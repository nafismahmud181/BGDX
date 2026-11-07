/**
 * BGDX backend: Google Apps Script web app that uses your sheet as the database.
 * Setup: see SETUP.md. Secret key lives in Project Settings > Script properties > BGDX_KEY.
 */
var SHEET_NAME = 'Actions';
// Leave empty if you opened this script from the sheet (Extensions > Apps Script).
// If this is a standalone project, paste your sheet ID here (the text between /d/ and /edit in its URL).
var SPREADSHEET_ID = '1sbtGjaURWWbiko5G33Zk8noOzolXl80su83kKiQykPQ';
function ss() { return SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet(); }
var PRIORITIES = ['Highest', 'Medium', 'Low', 'Lowest'];
var STATUSES = ['Backlog', 'In Progress', 'Blocked', 'Parked', 'Closed'];
var REQUIRED = ['AID', 'Title', 'Domain', 'Ownership', 'Status', 'Priority', 'Cost Required?', 'Tentative Cost', 'Due Date', 'Actual Start', 'Actual End', 'Note', 'Checklist', 'PR', 'Branch', 'Updated', 'Updated By'];

// Helper columns BGDX adds live far to the right (BB..BF) so they stay out of your way.
var PLACED = { 'Checklist': 54, 'PR': 55, 'Branch': 56, 'Updated': 57, 'Updated By': 58 };

function doGet() { return out({ ok: true, msg: 'BGDX API is running' }); }

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var user = authUser(body.key);
    if (!user) return out({ ok: false, error: 'auth' });
    var who = user.name, admin = user.role === 'admin';
    var owners = dataOwners();
    if (!admin) {
      var canon = owners.filter(function (n) { return n.toLowerCase() === who.toLowerCase(); })[0];
      if (!canon) return out({ ok: false, error: 'Your key name "' + who + '" is not in the Data owners list. Ask your admin.' });
      who = canon;
    }
    // The master admin key has no person attached; use the name picked in the app for display and devices.
    var actor = (who === 'Admin' && body.me) ? String(body.me).trim() : who;
    if (body.action === 'register' || body.action === 'unregister') {
      return out(deviceAction(body, actor, admin ? 'admin' : 'member'));
    }
    var lock = LockService.getScriptLock(), events = [], result;
    lock.waitLock(20000);
    try {
      var sh = ss().getSheetByName(SHEET_NAME);
      if (!sh) return out({ ok: false, error: 'Sheet tab "' + SHEET_NAME + '" not found' });
      var cols = headerMap(sh);
      (body.ops || []).forEach(function (op) { if (op.op === 'upsert' && op.task) upsert(sh, cols, op.task, who, admin, owners, actor, events); });
      SpreadsheetApp.flush();
      var all = readAll(sh, cols);
      if (!admin) all = all.filter(function (t) { return t.owner === who; });
      result = { ok: true, who: who, role: admin ? 'admin' : 'member', owners: owners, tasks: all, inbox: readInbox(actor, admin) };
    } finally { lock.releaseLock(); }
    if (events.length) { try { notifyEvents(events, actor); } catch (err) { console.error('push failed: ' + err); } }
    return out(result);
  } catch (err) { return out({ ok: false, error: String(err) }); }
}

// Owner list = the same list your Ownership dropdown uses (Data!B2:B1000).
function dataOwners() {
  var sh = ss().getSheetByName('Data');
  if (!sh) return [];
  var v = sh.getRange('B2:B1000').getValues(), o = [];
  v.forEach(function (r) { var n = String(r[0]).trim(); if (n && o.indexOf(n) < 0) o.push(n); });
  return o;
}

function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function headerMap(sh) {
  var lastCol = Math.max(sh.getLastColumn(), 1);
  var head = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(function (v) { return String(v).trim(); });
  REQUIRED.forEach(function (name) {
    if (head.map(function (h) { return h.toLowerCase(); }).indexOf(name.toLowerCase()) < 0) {
      var at = PLACED[name];
      if (at) { while (head.length < at) head.push(''); head[at - 1] = name; sh.getRange(1, at).setValue(name); }
      else { head.push(name); sh.getRange(1, head.length).setValue(name); }
    }
  });
  var map = {};
  head.forEach(function (h, i) { if (h) map[h.toLowerCase()] = i; });
  return { map: map, width: head.length };
}

function iso(v) {
  if (v instanceof Date && !isNaN(v)) return Utilities.formatDate(v, ss().getSpreadsheetTimeZone(), 'yyyy-MM-dd');
  var d = new Date(v);
  return v && !isNaN(d) ? Utilities.formatDate(d, ss().getSpreadsheetTimeZone(), 'yyyy-MM-dd') : '';
}
function toDate(s) { if (!s) return ''; var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }

function readAll(sh, cols) {
  var last = sh.getLastRow();
  if (last < 2) return [];
  var rows = sh.getRange(2, 1, last - 1, cols.width).getValues(), m = cols.map, tasks = [];
  function g(r, n) { var i = m[n.toLowerCase()]; return i === undefined ? '' : r[i]; }
  rows.forEach(function (r) {
    var id = String(g(r, 'AID')).trim();
    if (!id) return;
    var pri = PRIORITIES.indexOf(String(g(r, 'Priority')).trim());
    var status = String(g(r, 'Status')).trim();
    var subs = []; try { subs = JSON.parse(g(r, 'Checklist') || '[]'); } catch (e) {}
    var cost = g(r, 'Tentative Cost');
    tasks.push({
      id: id, title: String(g(r, 'Title')), domain: String(g(r, 'Domain')).trim(), owner: String(g(r, 'Ownership')).trim(),
      status: STATUSES.indexOf(status) >= 0 ? status : 'Backlog', pri: pri < 0 ? 4 : pri,
      costReq: String(g(r, 'Cost Required?')).trim().toUpperCase() === 'YES', cost: typeof cost === 'number' ? cost : '',
      due: iso(g(r, 'Due Date')), start: iso(g(r, 'Actual Start')), end: iso(g(r, 'Actual End')),
      notes: String(g(r, 'Note')), subs: subs, pr: String(g(r, 'PR')), branch: String(g(r, 'Branch')), upd: Number(g(r, 'Updated')) || 0
    });
  });
  return tasks;
}

// Keys: BGDX_KEY = master admin key. BGDX_KEYS = per-person keys, either
//   {"Hamim":{"key":"long-random-1","access":"admin"},"Sabbir":{"key":"long-random-2","access":"member"}}
// or the short form {"Sabbir":"long-random-2"} (member).
function authUser(k) {
  if (!k) return null;
  var p = PropertiesService.getScriptProperties(), master = p.getProperty('BGDX_KEY');
  if (master && k === master) return { name: 'Admin', role: 'admin' };
  try {
    var m = JSON.parse(p.getProperty('BGDX_KEYS') || '{}');
    for (var n in m) {
      var v = m[n], key = typeof v === 'string' ? v : (v && v.key);
      var role = typeof v === 'string' ? 'member' : (v && String(v.access).toLowerCase() === 'admin' ? 'admin' : 'member');
      if (key && key === k) return { name: n, role: role };
    }
  } catch (e) {}
  return null;
}

function upsert(sh, cols, t, who, admin, owners, actor, events) {
  if (!admin && owners.indexOf(t.owner) < 0) t.owner = who;
  var m = cols.map, last = sh.getLastRow(), row = -1, existing = null, before = null;
  if (last >= 2) {
    var ids = sh.getRange(2, m['aid'] + 1, last - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) if (String(ids[i][0]).trim() === t.id) { row = i + 2; break; }
  }
  if (row > 0) {
    existing = sh.getRange(row, 1, 1, cols.width).getValues()[0];
    if (!admin && String(existing[m['ownership']]).trim() !== who) return; // not your task
    if ((Number(existing[m['updated']]) || 0) > (t.upd || 0)) return; // server copy is newer
    before = existing.slice();
  } else { row = Math.max(last, 1) + 1; existing = new Array(cols.width).fill(''); }
  function set(n, v) { existing[m[n.toLowerCase()]] = v; }
  set('AID', t.id); set('Title', t.title); set('Domain', t.domain); set('Ownership', t.owner); set('Status', t.status);
  set('Priority', PRIORITIES[t.pri] || ''); set('Cost Required?', t.costReq ? 'YES' : 'NO'); set('Tentative Cost', t.cost === '' ? '' : t.cost);
  set('Due Date', toDate(t.due)); set('Actual Start', toDate(t.start)); set('Actual End', toDate(t.end));
  set('Note', t.notes || ''); set('Checklist', t.subs && t.subs.length ? JSON.stringify(t.subs) : ''); set('PR', t.pr || ''); set('Branch', t.branch || ''); set('Updated', t.upd || Date.now()); set('Updated By', who || '');
  sh.getRange(row, 1, 1, cols.width).setValues([existing]);
  if (events) collectEvents(events, before, t, m, actor);
}

// ONE-TIME: select "moveHelperColumns" in the editor and press Run.
// Moves Checklist, PR, Branch, Updated, Updated By to BB..BF (headers + data). Safe to run twice.
function moveHelperColumns() {
  var sh = ss().getSheetByName(SHEET_NAME);
  var lastCol = sh.getLastColumn(), lastRow = Math.max(sh.getLastRow(), 1);
  var head = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(function (v) { return String(v).trim().toLowerCase(); });
  var moved = [];
  Object.keys(PLACED).forEach(function (name) {
    var from = head.indexOf(name.toLowerCase()) + 1, to = PLACED[name];
    if (from > 0 && from !== to) {
      sh.getRange(1, from, lastRow, 1).moveTo(sh.getRange(1, to));
      moved.push(name + ': ' + from + ' -> ' + to);
    }
  });
  Logger.log(moved.length ? 'Moved ' + moved.join(', ') : 'Nothing to move');
}

// ───────────────────────── Push notifications (Firebase Cloud Messaging) ─────────────────────────
// Setup: Script property FCM_SERVICE_ACCOUNT = the full JSON of a Firebase service-account key.
// Run setupDailyReminder() once from the editor to schedule the morning reminder.
var DEVICES_SHEET = 'Devices';
var DEVICE_HEAD = ['Token', 'Name', 'Role', 'Platform', 'App URL', 'Updated'];
var REMINDER_HOUR = 9; // spreadsheet time zone

function devicesSheet() {
  var book = ss(), sh = book.getSheetByName(DEVICES_SHEET);
  if (!sh) {
    sh = book.insertSheet(DEVICES_SHEET);
    sh.getRange(1, 1, 1, DEVICE_HEAD.length).setValues([DEVICE_HEAD]);
    sh.hideSheet();
  }
  return sh;
}

function readDevices() {
  var sh = devicesSheet(), last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, DEVICE_HEAD.length).getValues().map(function (r, i) {
    return { row: i + 2, token: String(r[0]), name: String(r[1]).trim(), role: String(r[2]), platform: String(r[3]), url: String(r[4]) };
  }).filter(function (d) { return d.token; });
}

function deviceAction(body, name, role) {
  var token = String(body.token || '').trim();
  if (!token || token.length > 4096) return { ok: false, error: 'Missing device token' };
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = devicesSheet(), hit = readDevices().filter(function (d) { return d.token === token; })[0];
    if (body.action === 'unregister') { if (hit) sh.deleteRow(hit.row); return { ok: true }; }
    var platform = body.platform === 'android' ? 'android' : 'web';
    var appUrl = /^https:\/\//.test(String(body.appUrl || '')) ? String(body.appUrl).split('#')[0] : '';
    var row = [token, name, role, platform, appUrl, new Date()];
    if (hit) sh.getRange(hit.row, 1, 1, row.length).setValues([row]); else sh.appendRow(row);
    return { ok: true };
  } finally { lock.releaseLock(); }
}

// Decide who hears about a saved task. before = old sheet row (null for a new task).
function collectEvents(events, before, t, m, actor) {
  var label = t.id + ' · ' + t.title, me = String(actor || '').toLowerCase();
  var oldOwner = before ? String(before[m['ownership']]).trim() : '';
  var oldStatus = before ? String(before[m['status']]).trim() : '';
  var mine = t.owner && t.owner.toLowerCase() !== me;
  if (mine && (!before || oldOwner !== t.owner)) {
    events.push({ kind: 'assign', to: t.owner, title: 'New task for you', body: label + (actor ? '\nAssigned by ' + actor : ''), url: '#/detail/' + t.id, tag: t.id });
  } else if (mine && before) {
    var ch = [];
    if (oldStatus !== t.status) ch.push('Status: ' + oldStatus + ' → ' + t.status);
    var oldPri = String(before[m['priority']]).trim(), newPri = PRIORITIES[t.pri] || '';
    if (oldPri !== newPri) ch.push('Priority: ' + (oldPri || 'None') + ' → ' + (newPri || 'None'));
    var oldDue = iso(before[m['due date']]);
    if (oldDue !== (t.due || '')) ch.push('Due: ' + (oldDue || 'none') + ' → ' + (t.due || 'none'));
    if (ch.length) events.push({ kind: 'change', to: t.owner, title: actor + ' updated your task', body: label + '\n' + ch.join(' · '), url: '#/detail/' + t.id, tag: t.id });
  }
  if (t.status === 'Blocked' && oldStatus !== 'Blocked') {
    events.push({ kind: 'blocked', toAdmins: true, except: mine ? t.owner : '', title: 'Task blocked', body: label + '\nOwner: ' + (t.owner || '—') + (actor ? ' · by ' + actor : ''), url: '#/detail/' + t.id, tag: t.id + '-blocked' });
  }
  if (t.status === 'Closed' && before && oldStatus !== 'Closed') {
    events.push({ kind: 'closed', toAdmins: true, except: mine ? t.owner : '', title: 'Task closed', body: label + '\nOwner: ' + (t.owner || '—') + (actor ? ' · by ' + actor : ''), url: '#/detail/' + t.id, tag: t.id + '-closed' });
  }
}

function notifyEvents(events, actor) {
  logInbox(events, actor);
  var devices = readDevices(), me = String(actor || '').toLowerCase(), msgs = [];
  events.forEach(function (e) {
    devices.forEach(function (d) {
      var n = d.name.toLowerCase();
      var hit = e.toAdmins ? (d.role === 'admin' && n !== me && n !== String(e.except || '').toLowerCase()) : (n === String(e.to).toLowerCase());
      if (hit) msgs.push({ device: d, title: e.title, body: e.body, url: e.url, tag: e.tag });
    });
  });
  sendPush(msgs);
}

// Daily: each person gets one message with what is due today and what is overdue.
// Everyone gets it in the in-app inbox; people with a registered device also get a push.
function dailyReminder() {
  var sh = ss().getSheetByName(SHEET_NAME); if (!sh) return;
  var tasks = readAll(sh, headerMap(sh)), devices = readDevices(), msgs = [], events = [];
  var today = Utilities.formatDate(new Date(), ss().getSpreadsheetTimeZone(), 'yyyy-MM-dd');
  var names = {}; tasks.forEach(function (t) { if (t.owner) names[t.owner.toLowerCase()] = t.owner; });
  Object.keys(names).forEach(function (key) {
    var open = tasks.filter(function (t) { return t.owner.toLowerCase() === key && t.status !== 'Closed' && t.due && t.due <= today; });
    if (!open.length) return;
    var dueToday = open.filter(function (t) { return t.due === today; }).length, late = open.length - dueToday;
    var head = [dueToday ? dueToday + ' due today' : '', late ? late + ' overdue' : ''].filter(String).join(' · ');
    open.sort(function (a, b) { return a.pri - b.pri || a.due.localeCompare(b.due); });
    var body = open.slice(0, 3).map(function (t) { return t.id + ' ' + t.title; }).join('\n') + (open.length > 3 ? '\n+' + (open.length - 3) + ' more' : '');
    events.push({ kind: 'daily', to: names[key], title: head, body: body, url: '#/today' });
    devices.forEach(function (d) { if (d.name.toLowerCase() === key) msgs.push({ device: d, title: head, body: body, url: '#/today', tag: 'daily' }); });
  });
  logInbox(events, '');
  sendPush(msgs);
}

// ── In-app inbox: every notification is also logged to a hidden "Inbox" tab ──
var INBOX_SHEET = 'Inbox';
var INBOX_HEAD = ['Time', 'To', 'Kind', 'Title', 'Body', 'Link', 'By', 'Except'];
var INBOX_KEEP = 2000; // rows; older ones are trimmed

function inboxSheet() {
  var book = ss(), sh = book.getSheetByName(INBOX_SHEET);
  if (!sh) {
    sh = book.insertSheet(INBOX_SHEET);
    sh.getRange(1, 1, 1, INBOX_HEAD.length).setValues([INBOX_HEAD]);
    sh.hideSheet();
  } else if (sh.getRange(1, INBOX_HEAD.length).getValue() === '') {
    sh.getRange(1, 1, 1, INBOX_HEAD.length).setValues([INBOX_HEAD]); // older tab: add new header(s)
  }
  return sh;
}

function logInbox(events, actor) {
  if (!events.length) return;
  var now = Date.now();
  var rows = events.map(function (e) { return [now, e.toAdmins ? '@admins' : e.to, e.kind || '', e.title, e.body, e.url || '', actor || '', e.except || '']; });
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = inboxSheet();
    sh.getRange(sh.getLastRow() + 1, 1, rows.length, INBOX_HEAD.length).setValues(rows);
    var extra = sh.getLastRow() - 1 - INBOX_KEEP;
    if (extra > 200) sh.deleteRows(2, extra);
  } finally { lock.releaseLock(); }
}

// Latest 50 notifications for this person (admins also see "@admins" ones not caused by themselves).
function readInbox(name, admin) {
  var sh = ss().getSheetByName(INBOX_SHEET); if (!sh) return [];
  var last = sh.getLastRow(); if (last < 2) return [];
  var from = Math.max(2, last - 499), me = String(name || '').toLowerCase(), outList = [];
  var rows = sh.getRange(from, 1, last - from + 1, INBOX_HEAD.length).getValues();
  for (var i = rows.length - 1; i >= 0 && outList.length < 50; i--) {
    var r = rows[i], to = String(r[1]).toLowerCase();
    var mine = to === me || (admin && to === '@admins' && String(r[6]).toLowerCase() !== me && String(r[7]).toLowerCase() !== me);
    if (mine) outList.push({ ts: Number(r[0]) || 0, kind: String(r[2]), title: String(r[3]), body: String(r[4]), url: String(r[5]) });
  }
  return outList;
}

// ONE-TIME: select "setupDailyReminder" in the editor and press Run. Safe to run again.
function setupDailyReminder() {
  ScriptApp.getProjectTriggers().forEach(function (tr) { if (tr.getHandlerFunction() === 'dailyReminder') ScriptApp.deleteTrigger(tr); });
  ScriptApp.newTrigger('dailyReminder').timeBased().everyDays(1).atHour(REMINDER_HOUR).create();
  Logger.log('Daily reminder scheduled around ' + REMINDER_HOUR + ':00 (' + ss().getSpreadsheetTimeZone() + ')');
}

// Run from the editor after turning notifications on in the app: sends a test to every device.
function testPush() {
  sendPush(readDevices().map(function (d) { return { device: d, title: 'BGDX test', body: 'Notifications work for ' + d.name, url: '#/today', tag: 'test' }; }));
}

function fcmAuth() {
  var raw = PropertiesService.getScriptProperties().getProperty('FCM_SERVICE_ACCOUNT');
  if (!raw) return null;
  var sa = JSON.parse(raw), cache = CacheService.getScriptCache(), tok = cache.get('fcm-token');
  if (!tok) {
    var now = Math.floor(Date.now() / 1000);
    var enc = function (o) { return Utilities.base64EncodeWebSafe(JSON.stringify(o)).replace(/=+$/, ''); };
    var unsigned = enc({ alg: 'RS256', typ: 'JWT' }) + '.' + enc({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/firebase.messaging', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 });
    var sig = Utilities.base64EncodeWebSafe(Utilities.computeRsaSha256Signature(unsigned, sa.private_key)).replace(/=+$/, '');
    var res = UrlFetchApp.fetch('https://oauth2.googleapis.com/token', { method: 'post', payload: { grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: unsigned + '.' + sig }, muteHttpExceptions: true });
    var j = JSON.parse(res.getContentText());
    if (!j.access_token) throw new Error('FCM auth failed: ' + res.getContentText());
    tok = j.access_token; cache.put('fcm-token', tok, 3000);
  }
  return { project: sa.project_id, token: tok };
}

function sendPush(msgs) {
  if (!msgs.length) return;
  var auth = fcmAuth(); if (!auth) return;
  var endpoint = 'https://fcm.googleapis.com/v1/projects/' + auth.project + '/messages:send';
  var reqs = msgs.map(function (x) {
    var d = x.device, message = { token: d.token, notification: { title: x.title, body: x.body }, data: { url: x.url, tag: x.tag } };
    if (d.platform === 'android') message.android = { priority: 'high', notification: { tag: x.tag } };
    else {
      message.webpush = { headers: { Urgency: 'high' }, notification: { tag: x.tag, renotify: true } };
      if (d.url) { message.webpush.fcm_options = { link: d.url + x.url }; message.webpush.notification.icon = d.url.replace(/[^/]*$/, '') + 'icon-192.png'; }
    }
    return { url: endpoint, method: 'post', contentType: 'application/json', headers: { Authorization: 'Bearer ' + auth.token }, payload: JSON.stringify({ message: message }), muteHttpExceptions: true };
  });
  var res = UrlFetchApp.fetchAll(reqs), dead = [];
  res.forEach(function (r, i) {
    var code = r.getResponseCode(), txt = r.getContentText();
    if (code === 404 || /UNREGISTERED|registration-token-not-registered/.test(txt)) dead.push(msgs[i].device.token);
    else if (code >= 300) console.error('FCM ' + code + ': ' + txt);
  });
  if (dead.length) {
    var sh = devicesSheet();
    readDevices().filter(function (d) { return dead.indexOf(d.token) >= 0; }).reverse().forEach(function (d) { sh.deleteRow(d.row); });
  }
}
