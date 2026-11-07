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

function doGet() { return out({ ok: true, msg: 'BGDX API is running' }); }

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var who = authUser(body.key);
    if (!who) return out({ ok: false, error: 'auth' });
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var sh = ss().getSheetByName(SHEET_NAME);
      if (!sh) return out({ ok: false, error: 'Sheet tab "' + SHEET_NAME + '" not found' });
      var cols = headerMap(sh);
      (body.ops || []).forEach(function (op) { if (op.op === 'upsert' && op.task) upsert(sh, cols, op.task, who); });
      SpreadsheetApp.flush();
      return out({ ok: true, tasks: readAll(sh, cols) });
    } finally { lock.releaseLock(); }
  } catch (err) { return out({ ok: false, error: String(err) }); }
}

function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function headerMap(sh) {
  var lastCol = Math.max(sh.getLastColumn(), 1);
  var head = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(function (v) { return String(v).trim(); });
  REQUIRED.forEach(function (name) {
    if (head.map(function (h) { return h.toLowerCase(); }).indexOf(name.toLowerCase()) < 0) {
      head.push(name); sh.getRange(1, head.length).setValue(name);
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

// Keys: BGDX_KEYS = {"Rafi":"key1","Nadia":"key2"} (one per person). BGDX_KEY stays as the admin master key.
function authUser(k) {
  if (!k) return null;
  var p = PropertiesService.getScriptProperties(), master = p.getProperty('BGDX_KEY');
  if (master && k === master) return 'Admin';
  try {
    var m = JSON.parse(p.getProperty('BGDX_KEYS') || '{}');
    for (var n in m) if (m[n] && m[n] === k) return n;
  } catch (e) {}
  return null;
}

function upsert(sh, cols, t, who) {
  var m = cols.map, last = sh.getLastRow(), row = -1, existing = null;
  if (last >= 2) {
    var ids = sh.getRange(2, m['aid'] + 1, last - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) if (String(ids[i][0]).trim() === t.id) { row = i + 2; break; }
  }
  if (row > 0) {
    existing = sh.getRange(row, 1, 1, cols.width).getValues()[0];
    if ((Number(existing[m['updated']]) || 0) > (t.upd || 0)) return; // server copy is newer
  } else { row = Math.max(last, 1) + 1; existing = new Array(cols.width).fill(''); }
  function set(n, v) { existing[m[n.toLowerCase()]] = v; }
  set('AID', t.id); set('Title', t.title); set('Domain', t.domain); set('Ownership', t.owner); set('Status', t.status);
  set('Priority', PRIORITIES[t.pri] || ''); set('Cost Required?', t.costReq ? 'YES' : 'NO'); set('Tentative Cost', t.cost === '' ? '' : t.cost);
  set('Due Date', toDate(t.due)); set('Actual Start', toDate(t.start)); set('Actual End', toDate(t.end));
  set('Note', t.notes || ''); set('Checklist', t.subs && t.subs.length ? JSON.stringify(t.subs) : ''); set('PR', t.pr || ''); set('Branch', t.branch || ''); set('Updated', t.upd || Date.now()); set('Updated By', who || '');
  sh.getRange(row, 1, 1, cols.width).setValues([existing]);
}
