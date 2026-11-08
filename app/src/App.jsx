// BGDX app logic: ported from the original single-file app (same screens and behaviour); data now lives in Supabase.
import React from 'react';
import Template from './ui/Template.jsx';
import { supabase, toEmail, fromRow, toRow, fromInbox, TASK_COLS } from './data.js';

export default class App extends React.Component {
  render() { return <Template v={this.renderVals()} />; }
  PRI = [
    { label: 'P0', name: 'Highest', c: '#FF2E63', on: '#FFFFFF', hint: 'Drop everything' },
    { label: 'P1', name: 'Medium', c: '#FF8A00', on: '#1F1100', hint: 'This week' },
    { label: 'P2', name: 'Low', c: '#6B4BFF', on: '#FFFFFF', hint: 'Soon' },
    { label: 'P3', name: 'Lowest', c: '#12C79A', on: '#002A1F', hint: 'Someday' },
    { label: '—', name: 'None', c: '#8E8D99', on: '#FFFFFF', hint: '' },
  ];
  STATUS = [
    { k: 'Backlog', label: 'Backlog', c: '#2B5D6E' },
    { k: 'In Progress', label: 'In Progress', c: '#0B4FA8' },
    { k: 'Blocked', label: 'Blocked', c: '#B30000' },
    { k: 'Parked', label: 'Parked', c: '#444444' },
    { k: 'Closed', label: 'Closed', c: '#137A4B' },
  ];
  DOMAINS = ['Technology', 'Operations', 'Marketing', 'Business Analysis', 'Management', 'Logistics'];
  MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  inputRef = React.createRef();
  ls(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  sv(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  cfg = this.ls('bgdx3-cfg'); // { ws, wsName, me (owner name), role, username } — cached so the app opens offline
  queue = this.ls('bgdx3-queue') || [];
  busy = false;
  idx = 0;
  parseHash() {
    const p = (location.hash || '').replace(/^#\/?/, '').split('/');
    if (p[0] === 'new') return { screen: 'today', openNew: true };
    if (['today', 'board', 'search', 'review', 'account', 'inbox', 'people'].includes(p[0])) return { screen: p[0] };
    if (p[0] === 'detail' && p[1]) return { screen: 'detail', sel: decodeURIComponent(p[1]) };
    return null;
  }
  hashFor(s) {
    if (s.screen === 'onboard' || s.screen === 'login') return null;
    if (s.screen === 'detail') return '#/detail/' + encodeURIComponent(s.sel || '');
    if (s.screen === 'focus') return '#/detail/' + encodeURIComponent(s.focusId || '');
    return '#/' + s.screen;
  }
  state = (() => {
    try { localStorage.removeItem('bgdx3-demo'); localStorage.removeItem('bgdx3-demotasks'); } catch (e) {}
    const cfg = this.cfg, seen = this.ls('bgdx3-onb') === true, st = this.props.startScreen ?? 'Auto';
    const mode = cfg && cfg.ws ? 'cloud' : 'none';
    const tasks = mode === 'cloud' ? ((this.ls('bgdx3-cache') || {}).tasks || []) : [];
    let screen = st === 'Onboarding' ? 'onboard' : st === 'Login' ? 'login' : st === 'Today' && mode !== 'none' ? 'today' : mode === 'none' ? (seen ? 'login' : 'onboard') : 'today';
    const hr = this.parseHash(); let sel0 = null;
    if (st === 'Auto' && mode !== 'none' && hr) { screen = hr.screen; sel0 = hr.sel || null; if (screen === 'detail' && !tasks.some(t => t.id === sel0)) { screen = 'today'; sel0 = null; } }
    return {
      screen, prev: 'today', mode, tasks, sel: sel0, focusId: null, dark: this.ls('bgdx3-dark') === true || (this.props.theme ?? 'Light') === 'Dark',
      sheet: false, draft: '', dPri: 1, dType: 'Technology', dDue: 'Today', dOwner: null, ownerF: null,
      q: '', fPri: [], fType: null, fStatus: 'all', col: 'In Progress', obStep: 0,
      secs: 1500, running: false, newSub: '', toast: null,
      syncSt: mode === 'cloud' ? 'syncing' : 'idle', pend: (this.ls('bgdx3-queue') || []).length, lastSync: (this.ls('bgdx3-cache') || {}).ts || 0, syncErr: '',
      lUser: '', lKey: '', lMe: '', lErr: '', lBusy: false, lStep: 1, lShowKey: false, lAdv: false, lPend: null, dOwners: null, adminView: 'team', pushOn: !!(this.ls('bgdx3-push') || {}).on, pushBusy: false, pushErr: '', people: [], pName: '', pUser: '', pPass: '', pRole: 'member', pBusy: false, pErr: '', pMsg: '', inbox: this.ls('bgdx3-inbox') || [], seen: this.ls('bgdx3-seen') || 0, inboxMark: this.ls('bgdx3-seen') || 0,
    };
  })();
  iso(d) { const z = n => String(n).padStart(2, '0'); return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()); }
  today() { return this.iso(new Date()); }
  addD(n) { const d = new Date(); d.setDate(d.getDate() + n); return this.iso(d); }
  parts(a) { const p = a.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); }
  dayDiff(a) { const d = this.parts(a), t = new Date(); return Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(t.getFullYear(), t.getMonth(), t.getDate())) / 864e5); }
  fmt(a) { const d = this.parts(a); return this.MON[d.getMonth()] + ' ' + d.getDate(); }
  dueTxt(t) {
    if (!t.due) return 'No date';
    if (t.status === 'Closed') return this.fmt(t.due);
    const n = this.dayDiff(t.due);
    return n < 0 ? 'Late ' + this.fmt(t.due) : n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : n < 7 ? this.DOW[this.parts(t.due).getDay()] : this.fmt(t.due);
  }
  me() { return (this.cfg && this.cfg.me) || ''; }
  owners(tasks) {
    const set = this.state && this.state.dOwners ? this.state.dOwners.slice() : []; tasks.forEach(t => { if (t.owner && !set.includes(t.owner)) set.push(t.owner); });
    const me = this.me(); set.sort((a, b) => (b === me) - (a === me) || a.localeCompare(b)); return set;
  }
  types(tasks) { const o = [...this.DOMAINS]; tasks.forEach(t => { if (t.domain && !o.includes(t.domain)) o.push(t.domain); }); return o; }
  // ── Push notifications ──
  // native = Android app (Capacitor plugin), web = browser / iPhone Home Screen app (Firebase).
  pushKind() {
    const C = window.Capacitor;
    if (C && C.isNativePlatform && C.isNativePlatform()) return C.Plugins && C.Plugins.PushNotifications ? 'native' : 'none';
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent), sa = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    if (ios && !sa) return 'ios-install';
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return 'none';
    const fb = window.BGDX_FIREBASE; if (!fb || !fb.apiKey) return 'noconfig';
    return 'web';
  }
  async registerDevice(token, platform, appUrl) {
    const { error } = await supabase.rpc('register_device', { p_token: token, p_workspace: this.cfg.ws, p_platform: platform, p_app_url: appUrl || '' });
    if (error) throw new Error(error.message);
  }
  async unregisterDevice(token) { await supabase.rpc('unregister_device', { p_token: token }); }
  loadScript(src) { return new Promise((ok, no) => { const el = document.createElement('script'); el.src = src; el.onload = ok; el.onerror = () => no(new Error('Could not load ' + src)); document.head.appendChild(el); }); }
  async fbMessaging() {
    if (!window.firebase || !firebase.messaging) {
      await this.loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
      await this.loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
    }
    if (!firebase.apps.length) firebase.initializeApp(window.BGDX_FIREBASE);
    const m = firebase.messaging();
    if (!this._fbFg) { this._fbFg = true; m.onMessage(p => this.onForegroundPush(p.notification || {})); }
    return m;
  }
  async webToken() {
    const m = await this.fbMessaging(), reg = await navigator.serviceWorker.ready;
    return m.getToken({ ...(window.BGDX_FIREBASE.vapidKey ? { vapidKey: window.BGDX_FIREBASE.vapidKey } : {}), serviceWorkerRegistration: reg });
  }
  nativeToken() {
    const P = window.Capacitor.Plugins.PushNotifications;
    return new Promise((ok, no) => { this._regWait = { ok, no }; P.register().catch(no); setTimeout(() => no(new Error('No token from Firebase. Is google-services.json in the Android project?')), 20000); });
  }
  initNativePush() {
    if (this._natInit) return; this._natInit = true;
    const P = window.Capacitor.Plugins.PushNotifications;
    P.addListener('registration', t => { if (this._regWait) { this._regWait.ok(t.value); this._regWait = null; } else this.savePushToken(t.value); });
    P.addListener('registrationError', e => { if (this._regWait) { this._regWait.no(new Error(e.error || 'Registration failed')); this._regWait = null; } });
    P.addListener('pushNotificationReceived', n => this.onForegroundPush(n));
    P.addListener('pushNotificationActionPerformed', a => { const u = a.notification && a.notification.data && a.notification.data.url; if (u && this.state.mode === 'cloud') location.hash = u; });
  }
  onForegroundPush(n) { if (n.title) this.flash(n.title); if (this.state.mode === 'cloud') this.sync(); }
  async savePushToken(token) {
    const kind = this.pushKind(), prev = this.ls('bgdx3-push') || {};
    await this.registerDevice(token, kind === 'native' ? 'android' : 'web', kind === 'web' ? location.href.split('#')[0] : '');
    if (prev.token && prev.token !== token) this.unregisterDevice(prev.token).catch(() => {});
    this.sv('bgdx3-push', { on: true, token });
  }
  async enablePush() {
    const kind = this.pushKind();
    this.setState({ pushBusy: true, pushErr: '' });
    try {
      let token;
      if (kind === 'native') {
        const P = window.Capacitor.Plugins.PushNotifications; this.initNativePush();
        let p = await P.checkPermissions(); if (p.receive !== 'granted') p = await P.requestPermissions();
        if (p.receive !== 'granted') throw new Error('Notifications are blocked. Allow them for BGDX in Android Settings > Apps.');
        token = await this.nativeToken();
      } else if (kind === 'web') {
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') throw new Error('Notifications are blocked. Allow them for BGDX in your phone or browser settings.');
        token = await this.webToken();
      } else return;
      await this.savePushToken(token);
      this.setState({ pushOn: true, pushBusy: false }); this.flash('Notifications on');
    } catch (e) { this.setState({ pushBusy: false, pushErr: String(e.message || e) }); }
  }
  async disablePush() {
    const prev = this.ls('bgdx3-push') || {};
    this.setState({ pushBusy: true, pushErr: '' });
    try { if (prev.token) await this.unregisterDevice(prev.token); } catch (e) {}
    try { if (this.pushKind() === 'native') await window.Capacitor.Plugins.PushNotifications.unregister(); else if (window.firebase && firebase.apps.length) await firebase.messaging().deleteToken(); } catch (e) {}
    this.sv('bgdx3-push', null); this.setState({ pushOn: false, pushBusy: false }); this.flash('Notifications off');
  }
  // On launch: refresh the token silently so the server always has a working one.
  async refreshPush() {
    const prev = this.ls('bgdx3-push'); if (!prev || !prev.on || this.state.mode !== 'sheet') return;
    const kind = this.pushKind();
    try {
      if (kind === 'native') {
        this.initNativePush();
        const p = await window.Capacitor.Plugins.PushNotifications.checkPermissions();
        if (p.receive === 'granted') await this.savePushToken(await this.nativeToken()); else { this.sv('bgdx3-push', null); this.setState({ pushOn: false }); }
      } else if (kind === 'web') {
        if (Notification.permission === 'granted') await this.savePushToken(await this.webToken()); else { this.sv('bgdx3-push', null); this.setState({ pushOn: false }); }
      }
    } catch (e) {}
  }
  // ── People (admins create and manage accounts; the admin-users function enforces it server-side) ──
  goPeople() { this.setState(st => ({ prev: ['people', 'account'].includes(st.screen) ? st.prev : st.screen, screen: 'people', pErr: '', pMsg: '' }), () => this.loadPeople()); }
  async loadPeople() {
    if (!this.cfg) return;
    const { data, error } = await supabase.from('members').select('user_id, username, owner_name, role, active').eq('workspace_id', this.cfg.ws).order('owner_name');
    if (error) { this.setState({ pErr: error.message }); return; }
    this.setState({ people: data });
  }
  async adminCall(body) {
    const { data, error } = await supabase.functions.invoke('admin-users', { body: { workspace_id: this.cfg.ws, ...body } });
    if (error) {
      let msg = error.message; try { const j = await error.context.json(); if (j && j.error) msg = j.error; } catch (e) {}
      throw new Error(msg);
    }
    return data;
  }
  makePassword() {
    const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ', a = 'abcdefghijkmnpqrstuvwxyz', d = '23456789', all = A + a + d, r = new Uint32Array(14);
    crypto.getRandomValues(r);
    const p = [A[r[0] % A.length], a[r[1] % a.length], d[r[2] % d.length], ...[...r.slice(3)].map(x => all[x % all.length])];
    return p.sort(() => (crypto.getRandomValues(new Uint8Array(1))[0] & 1) - 0.5).join('');
  }
  async addPerson() {
    const s = this.state; if (s.pBusy) return;
    const name = s.pName.trim(), username = s.pUser.trim().toLowerCase(), password = s.pPass;
    if (!name || !username || !password) { this.setState({ pErr: 'Fill in the name, username and password.', pMsg: '' }); return; }
    this.setState({ pBusy: true, pErr: '', pMsg: '' });
    try {
      await this.adminCall({ action: 'create', username, password, owner_name: name, role: s.pRole });
      this.setState({ pBusy: false, pName: '', pUser: '', pPass: '', pRole: 'member', pMsg: 'Account created. Send these to ' + name + ':\nUsername: ' + username + '\nPassword: ' + password });
      this.loadPeople(); this.sync();
    } catch (e) { this.setState({ pBusy: false, pErr: String(e.message || e) }); }
  }
  async personAction(p, kind) {
    try {
      if (kind === 'reset') {
        const pw = this.makePassword();
        if (!confirm('Reset the password for ' + p.owner_name + '?')) return;
        await this.adminCall({ action: 'set_password', user_id: p.user_id, password: pw });
        this.setState({ pErr: '', pMsg: 'New password for ' + p.owner_name + ':\nUsername: ' + p.username + '\nPassword: ' + pw });
      } else if (kind === 'role') {
        await this.adminCall({ action: 'update', user_id: p.user_id, role: p.role === 'admin' ? 'member' : 'admin' });
        this.flash(p.owner_name + (p.role === 'admin' ? ' is now a member' : ' is now an admin'));
      } else if (kind === 'active') {
        if (p.active && !confirm('Turn off ' + p.owner_name + "'s account? They will be signed out and can't sign in.")) return;
        await this.adminCall({ action: 'update', user_id: p.user_id, active: !p.active });
        this.flash(p.owner_name + (p.active ? ' turned off' : ' turned back on'));
      }
      this.loadPeople();
    } catch (e) { this.setState({ pErr: String(e.message || e), pMsg: '' }); }
  }
  // ── Notifications page ──
  goInbox() { this.setState(st => ({ prev: ['inbox', 'account'].includes(st.screen) ? st.prev : st.screen, screen: 'inbox', sheet: false, inboxMark: st.seen })); }
  markInboxSeen() { const top = (this.state.inbox[0] || {}).ts || 0; if (top > this.state.seen) { this.sv('bgdx3-seen', top); this.setState({ seen: top }); } }
  openNote(n) {
    const m = /^#\/detail\/(.+)$/.exec(n.url || '');
    if (m) { const id = decodeURIComponent(m[1]); if (this.state.tasks.some(t => t.id === id)) this.open(id); else this.flash('That task is no longer on your list'); }
    else if (n.url === '#/today') this.go('today');
  }
  agoShort(ts) {
    const d = Math.max(0, Date.now() - ts) / 1000;
    if (d < 60) return 'now'; if (d < 3600) return Math.floor(d / 60) + 'm'; if (d < 86400) return Math.floor(d / 3600) + 'h';
    if (d < 6 * 86400) return this.DOW[new Date(ts).getDay()];
    const x = new Date(ts); return this.MON[x.getMonth()] + ' ' + x.getDate();
  }
  componentDidMount() {
    this.onKey = e => { const tg = (e.target.tagName || '').toLowerCase(); if (e.key === 'Escape') this.setState({ sheet: false }); else if ((e.key === 'n' || e.key === 'c') && !e.metaKey && !e.ctrlKey && tg !== 'input' && tg !== 'textarea' && ['today', 'board', 'search', 'review'].includes(this.state.screen)) { e.preventDefault(); this.openSheet(); } };
    window.addEventListener('keydown', this.onKey);
    this._pt = this.state.tasks; this._pd = this.state.dark;
    this._pscr = this.state.screen; this._psel = this.state.sel;
    document.title = 'BGDX';
    try { const hf = this.hashFor(this.state); const hr0 = this.parseHash(); history.replaceState({ i: 0 }, '', hf !== null ? hf : location.pathname + location.search); if (hr0 && hr0.openNew && this.state.mode !== 'none') { history.replaceState({ i: 0 }, '', '#/today'); this.openSheet(); } } catch (e) {}
    this.onPop = e => {
      this.idx = (e.state && e.state.i) || 0;
      if (this.state.mode === 'none') return;
      const hr = this.parseHash(), screen = hr ? hr.screen : 'today', sel = hr && hr.sel ? hr.sel : this.state.sel;
      if (screen !== this.state.screen || sel !== this.state.sel) { this.skipPush = true; this.setState({ screen, sel, sheet: false, running: false }); } else this.setState({ sheet: false });
    };
    window.addEventListener('popstate', this.onPop);
    if (this.props.startScreen === undefined || this.props.startScreen === 'Auto') { if (this.state.screen === 'onboard') this.sv('bgdx3-onb', true); }
    if ('serviceWorker' in navigator && location.protocol === 'https:' && !/\.dc\.html$/.test(location.pathname)) {
      const had = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener('controllerchange', () => { if (had && !this.swReloaded) { this.swReloaded = true; location.reload(); } });
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
    this.onRz = () => this.forceUpdate(); window.addEventListener('resize', this.onRz);
    this.onNet = () => { if (this.state.mode === 'cloud') { if (navigator.onLine) this.sync(); else this.setState({ syncSt: 'offline' }); } };
    window.addEventListener('online', this.onNet); window.addEventListener('offline', this.onNet);
    this.onVis = () => { if (!document.hidden && this.state.mode === 'cloud') this.sync(); };
    document.addEventListener('visibilitychange', this.onVis);
    const sa = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    if (!sa && innerWidth < 600 && document.documentElement.requestFullscreen) {
      this.fs = () => { document.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(() => {}); removeEventListener('click', this.fs); };
      addEventListener('click', this.fs);
    }
    this.timer = setInterval(() => { if (this.state.running && this.state.secs > 0) this.setState(s => ({ secs: s.secs - 1 })); }, 1000);
    this.poll = setInterval(() => { if (this.state.mode === 'cloud' && !document.hidden) this.sync(); else this.forceUpdate(); }, 30000);
    if (this.state.mode === 'cloud') this.sync();
    this.refreshPush();
  }
  componentWillUnmount() {
    ['keydown'].forEach(() => window.removeEventListener('keydown', this.onKey));
    window.removeEventListener('resize', this.onRz); window.removeEventListener('popstate', this.onPop); window.removeEventListener('online', this.onNet); window.removeEventListener('offline', this.onNet);
    document.removeEventListener('visibilitychange', this.onVis);
    clearInterval(this.timer); clearInterval(this.poll); clearTimeout(this.tt); clearTimeout(this.st); this.unsubscribe();
  }
  componentDidUpdate() {
    const s = this.state;
    if (s.screen === 'inbox') this.markInboxSeen();
    const tc = document.querySelector('meta[name=theme-color]'); if (tc) tc.content = s.screen === 'focus' || s.dark ? '#0B0B0E' : '#F4F3EF';
    if (this._pscr !== s.screen || this._psel !== s.sel) {
      this._pscr = s.screen; this._psel = s.sel;
      if (this.skipPush) this.skipPush = false;
      else { const hf = this.hashFor(s); if (hf !== null && hf !== location.hash) { try { this.idx++; history.pushState({ i: this.idx }, '', hf); } catch (e) {} } }
    }
    if (this._pt !== s.tasks) {
      const first = this._pt === undefined; this._pt = s.tasks;
      if (!first) {
        if (s.mode === 'cloud') this.sv('bgdx3-cache', { tasks: s.tasks, ts: s.lastSync });
      }
    }
    if (this._pd !== s.dark) { const first = this._pd === undefined; this._pd = s.dark; if (!first) this.sv('bgdx3-dark', s.dark); }
  }
  flash(msg) { clearTimeout(this.tt); this.setState({ toast: msg }); this.tt = setTimeout(() => this.setState({ toast: null }), 1800); }
  // Every local edit is queued by task uid and sent in order; new tasks are inserted once, then updated.
  enqueue(task) {
    const prev = this.queue.find(q => q.uid === task.uid);
    this.queue = this.queue.filter(q => q.uid !== task.uid).concat({ uid: task.uid, isNew: !!(task.isNew || (prev && prev.isNew)), task });
    this.sv('bgdx3-queue', this.queue); this.setState({ pend: this.queue.length }); this.schedule(250);
  }
  async pushQueue() {
    for (const q of this.queue.slice()) {
      const row = toRow(q.task, this.cfg.ws);
      let res = q.isNew ? await supabase.from('tasks').insert(row) : await supabase.from('tasks').update(row).eq('id', row.id);
      if (res.error && res.error.code === '23505') res = { error: null }; // already inserted by an earlier attempt
      if (res.error) {
        if (res.error.code === '42501') { this.flash('Not allowed: ' + (q.task.id || 'task')); } // permission denied → drop this edit
        else throw new Error(res.error.message);
      }
      this.queue = this.queue.filter(x => x !== q); this.sv('bgdx3-queue', this.queue);
    }
  }
  async pull() {
    const ws = this.cfg.ws;
    const [tq, iq, oq, mq] = await Promise.all([
      supabase.from('tasks').select(TASK_COLS).eq('workspace_id', ws).order('aid'),
      supabase.from('inbox').select('created_at, kind, title, body, link').eq('workspace_id', ws).order('created_at', { ascending: false }).limit(50),
      supabase.from('owners').select('name').eq('workspace_id', ws).order('sort').order('name'),
      supabase.from('members').select('owner_name, role, active').eq('workspace_id', ws).eq('user_id', this.userId).maybeSingle(),
    ]);
    const err = tq.error || iq.error || oq.error || mq.error; if (err) throw new Error(err.message);
    if (!mq.data || !mq.data.active) { this.signOut('This account is no longer active. Ask your admin.'); return false; }
    if (mq.data.role !== this.cfg.role || mq.data.owner_name !== this.cfg.me) { this.cfg = { ...this.cfg, role: mq.data.role, me: mq.data.owner_name }; this.sv('bgdx3-cfg', this.cfg); }
    const inbox = iq.data.map(fromInbox); this.sv('bgdx3-inbox', inbox);
    const server = tq.data.map(fromRow), pend = new Set(this.queue.map(q => q.uid)), ids = new Set(server.map(t => t.uid));
    this.setState(s => {
      const local = new Map(s.tasks.map(t => [t.uid, t]));
      const out = server.map(t => pend.has(t.uid) ? { ...(local.get(t.uid) || t), id: t.id, isNew: false } : t);
      s.tasks.forEach(t => { if (pend.has(t.uid) && !ids.has(t.uid)) out.push(t); });
      return { tasks: out, inbox, dOwners: oq.data.map(o => o.name), ...this.remapIds(s, out) };
    });
    return true;
  }
  // A new task shows a temporary ID until the database assigns A-NNN; keep the open screen pointing at it.
  remapIds(s, tasks) {
    const fix = id => { const old = s.tasks.find(t => t.id === id); if (!old) return id; const now = tasks.find(t => t.uid === old.uid); return now ? now.id : id; };
    return { sel: s.sel && fix(s.sel), focusId: s.focusId && fix(s.focusId) };
  }
  subscribe() {
    if (this.chan || !this.cfg) return;
    const ws = this.cfg.ws;
    this.chan = supabase.channel('ws-' + ws)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: 'workspace_id=eq.' + ws }, p => this.onTaskEvent(p))
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'inbox', filter: 'workspace_id=eq.' + ws }, p => this.onInboxEvent(p))
      .subscribe(st => { if (st === 'SUBSCRIBED') this.setState({ live: true }); else if (st === 'CHANNEL_ERROR' || st === 'TIMED_OUT' || st === 'CLOSED') this.setState({ live: false }); });
  }
  unsubscribe() { if (this.chan) { supabase.removeChannel(this.chan); this.chan = null; } }
  onTaskEvent(p) {
    if (p.eventType === 'DELETE') { const uid = p.old && p.old.id; this.setState(s => ({ tasks: s.tasks.filter(t => t.uid !== uid) })); return; }
    const t = fromRow(p.new);
    if (this.queue.some(q => q.uid === t.uid)) return; // our own unsent edit is newer
    const mine = this.cfg && (this.cfg.role === 'admin' || t.owner === this.cfg.me);
    this.setState(s => {
      const has = s.tasks.some(x => x.uid === t.uid);
      const tasks = !mine ? s.tasks.filter(x => x.uid !== t.uid) : has ? s.tasks.map(x => x.uid === t.uid ? t : x) : [t, ...s.tasks];
      return { tasks, lastSync: Date.now(), ...this.remapIds(s, tasks) };
    });
  }
  onInboxEvent(p) {
    const n = fromInbox(p.new);
    this.setState(s => s.inbox.some(x => x.ts === n.ts && x.title === n.title) ? null : { inbox: [n, ...s.inbox].slice(0, 50) }, () => this.sv('bgdx3-inbox', this.state.inbox));
  }
  schedule(ms) { clearTimeout(this.st); if (this.state.mode === 'cloud') this.st = setTimeout(() => this.sync(), ms); }
  async sync() {
    if (!this.cfg || this.busy) return;
    if (!navigator.onLine) { this.setState({ syncSt: 'offline' }); return; }
    this.busy = true; this.setState({ syncSt: 'syncing' });
    let ok = false;
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) { this.busy = false; this.signOut('Your session ended. Sign in again.'); return; }
      this.userId = data.session.user.id;
      await this.pushQueue();
      if (await this.pull()) { this.subscribe(); this.setState({ syncSt: 'synced', lastSync: Date.now(), syncErr: '', pend: this.queue.length }); ok = true; }
    } catch (e) { this.setState({ syncSt: navigator.onLine ? 'error' : 'offline', syncErr: String(e.message || e), pend: this.queue.length }); }
    this.busy = false;
    if (this.queue.length) this.schedule(ok ? 250 : 8000);
  }
  async doConnect() {
    const username = this.state.lUser.trim().toLowerCase(), password = this.state.lKey;
    if (!username || !password) { this.setState({ lErr: 'Enter your username and password.' }); return; }
    this.setState({ lBusy: true, lErr: '' });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: toEmail(username), password });
      if (error) throw new Error(/invalid/i.test(error.message) ? 'Wrong username or password.' : /banned/i.test(error.message) ? 'This account is turned off. Ask your admin.' : error.message);
      const m = await supabase.from('members').select('workspace_id, owner_name, role, username, workspaces(name)').eq('user_id', data.user.id).eq('active', true).limit(1).maybeSingle();
      if (m.error || !m.data) { await supabase.auth.signOut(); throw new Error(m.error ? m.error.message : 'This account is not part of a workspace yet. Ask your admin.'); }
      this.userId = data.user.id;
      this.cfg = { ws: m.data.workspace_id, wsName: (m.data.workspaces && m.data.workspaces.name) || '', me: m.data.owner_name, role: m.data.role, username: m.data.username };
      this.queue = []; this.sv('bgdx3-cfg', this.cfg); this.sv('bgdx3-queue', []);
      const seen0 = Date.now(); this.sv('bgdx3-seen', seen0);
      this.setState({ mode: 'cloud', tasks: [], inbox: [], seen: seen0, inboxMark: seen0, screen: 'today', lBusy: false, lKey: '', lErr: '', syncSt: 'syncing', pend: 0, ownerF: null }, () => this.sync());
    } catch (e) { this.setState({ lBusy: false, lErr: String(e.message || e).replace('Failed to fetch', 'Could not connect. Check your internet and try again.') }); }
  }
  async signOut(msg) {
    const pp = this.ls('bgdx3-push'); if (pp && pp.token && this.cfg) await this.unregisterDevice(pp.token).catch(() => {});
    this.unsubscribe(); supabase.auth.signOut().catch(() => {});
    this.sv('bgdx3-push', null); this.sv('bgdx3-inbox', null); this.sv('bgdx3-seen', null);
    this.cfg = null; this.queue = []; this.sv('bgdx3-cfg', null); this.sv('bgdx3-queue', []); this.sv('bgdx3-cache', null);
    this.setState({ mode: 'none', tasks: [], inbox: [], seen: 0, pushOn: false, pushErr: '', screen: 'login', lErr: msg || '', lKey: '', lStep: 1, lPend: null, syncSt: 'idle', pend: 0, ownerF: null, live: false });
  }
  afterOb() { this.sv('bgdx3-onb', true); this.setState(s => ({ screen: s.mode === 'none' ? 'login' : 'today' })); }
  upd(id, fn) {
    let nt;
    this.setState(s => ({ tasks: s.tasks.map(t => t.id === id ? (nt = { ...fn(t), upd: Date.now() }) : t) }), () => { if (nt && this.state.mode === 'cloud') this.enqueue(nt); });
  }
  setStatus(id, k) {
    const td = this.today();
    this.upd(id, x => ({ ...x, status: k, start: k === 'In Progress' && !x.start ? td : x.start, end: k === 'Closed' ? td : (x.status === 'Closed' ? '' : x.end) }));
    if (k === 'Closed') this.flash('Closed · ' + id);
  }
  go(screen) { this.setState({ screen, sheet: false }); }
  open(id) { this.setState(s => ({ sel: id, prev: ['detail', 'focus', 'account'].includes(s.screen) ? s.prev : s.screen, screen: 'detail' })); }
  focus(id) { this.setState(s => ({ focusId: id, prev: s.screen === 'focus' ? s.prev : s.screen, screen: 'focus', secs: 1500, running: true })); }
  toggleDone(id) { const t = this.state.tasks.find(x => x.id === id); this.setStatus(id, t.status === 'Closed' ? 'Backlog' : 'Closed'); }
  parse(d) {
    const s = this.state; let pri = s.dPri, type = s.dType, owner = s.dOwner || this.me(), title = d;
    const m = d.match(/!p?([0-3])\b/i); if (m) { pri = +m[1]; title = title.replace(m[0], ''); }
    const tm = d.match(/#(\w+)/); if (tm) { const f = this.types(s.tasks).find(x => x.toLowerCase().startsWith(tm[1].toLowerCase())); if (f) { type = f; title = title.replace(tm[0], ''); } }
    const om = d.match(/@(\w+)/); if (om) { const f = this.owners(s.tasks).find(x => x.toLowerCase().startsWith(om[1].toLowerCase())); if (f) { owner = f; title = title.replace(om[0], ''); } }
    return { title: title.replace(/\s+/g, ' ').trim(), pri, type, owner };
  }
  addTask() {
    const p = this.parse(this.state.draft); if (!p.title) return;
    const uid = crypto.randomUUID(), id = 'New ' + uid.slice(0, 4), dd = this.state.dDue; // the database assigns the real A-NNN
    const task = { uid, isNew: true, id,title: p.title, domain: p.type, owner: p.owner, status: 'Backlog', pri: p.pri, due: dd === 'No date' ? '' : this.addD(dd === 'Today' ? 0 : dd === 'Tomorrow' ? 1 : 7), costReq: false, cost: '', start: '', end: '', notes: '', subs: [], pr: '', branch: '', upd: Date.now() };
    this.setState(s => ({ tasks: [task, ...s.tasks], draft: '', sheet: false, dOwner: null }), () => { if (this.state.mode === 'cloud') this.enqueue(task); });
    this.flash('Added · ' + p.title.slice(0, 40));
  }
  dec(t) {
    const p = this.PRI[t.pri] || this.PRI[4], st = this.STATUS.find(x => x.k === t.status) || this.STATUS[0], done = t.status === 'Closed';
    const subs = t.subs || [], sd = subs.filter(x => x.d).length, n = subs.length;
    const nextK = { 'Backlog': 'In Progress', 'In Progress': 'Closed', 'Blocked': 'In Progress', 'Parked': 'Backlog', 'Closed': 'Backlog' }[t.status] || 'Backlog';
    const adv = { 'Backlog': '→ Start', 'In Progress': '→ Close', 'Blocked': 'Unblock', 'Parked': 'Unpark', 'Closed': 'Reopen' }[t.status] || 'Move';
    return {
      ...t, subs, key: t.id, due: this.dueTxt(t), dueISO: t.due, dueN: t.due ? this.dayDiff(t.due) : null,
      dueLine: t.due ? 'Due ' + this.dueTxt(t) : 'No due date', type: t.domain, typeO: (t.domain || 'General') + (t.owner ? ' · ' + t.owner : ''),
      c: p.c, on: p.on, pl: p.label, pn: '', done, checkBg: done ? p.c : 'transparent', deco: done ? 'line-through' : 'none', op: done ? 0.5 : 1,
      hasSubs: n > 0, subTxt: sd + '/' + n, subPct: n ? Math.round(sd / n * 100) + '%' : '0%',
      hasPr: !!t.pr, noPr: !t.pr, hasFrom: false, from: '', fromInitial: '', branch: t.branch || '',
      prState: done ? 'Merged' : 'Open', prBg: done ? '#6B4BFF' : '#12C79A', prFg: done ? '#fff' : '#002A1F',
      statusName: st.label, shot: false, advLabel: adv,
      costReqTxt: t.costReq ? 'YES' : 'NO', costVal: t.cost === '' || t.cost == null ? '' : String(t.cost),
      startTxt: t.start ? this.fmt(t.start) : '—', endTxt: t.end ? this.fmt(t.end) : '—', notes: t.notes || '',
      advance: e => { e.stopPropagation(); this.setStatus(t.id, nextK); },
      open: () => this.open(t.id),
      toggle: e => { e.stopPropagation(); this.toggleDone(t.id); },
      focus: e => { if (e) e.stopPropagation(); this.focus(t.id); },
    };
  }
  renderVals() {
    const s = this.state, dark = s.dark, sig = this.props.signature ?? '#C8FF2E', scr = s.screen;
    const W = window.innerWidth, phoneMock = W >= 900 && this.props.desktopView === 'Phone mockup', desk = W >= 900 && !phoneMock, mob = W < 900;
    const admin = !!(this.cfg && this.cfg.role === 'admin');
    const T = s.tasks.map(t => this.dec(t));
    const Tf = s.ownerF ? T.filter(t => t.owner === s.ownerF) : T;
    const sortP = (a, b) => a.pri - b.pri;
    const owners = this.owners(s.tasks), types = this.types(s.tasks), td = this.today();
    const vars = dark
      ? { '--bg': '#0B0B0E', '--surf': '#16161C', '--surf2': '#23232B', '--ink': '#F4F3F8', '--mute': '#8E8D99', '--line': 'rgba(255,255,255,.08)' }
      : { '--bg': '#F4F3EF', '--surf': '#FFFFFF', '--surf2': '#ECEAE4', '--ink': '#0F0F12', '--mute': '#6A6971', '--line': 'rgba(15,15,18,.09)' };
    const bg = vars['--bg'];
    const themeVars = { ...vars, '--sig': sig, height: '100%', flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: desk ? 'row' : 'column', background: 'var(--bg)', color: 'var(--ink)', fontFamily: "'Geist',system-ui,sans-serif", overflow: 'hidden', transition: 'background .25s' };
    const selT = T.find(t => t.id === s.sel) || T[0] || this.dec({ id: '', title: '', domain: '', owner: '', status: 'Backlog', pri: 4, due: '', subs: [] });
    const focT = T.find(t => t.id === s.focusId) || selT;
    const fb = desk ? bg : scr === 'focus' ? '#0B0B0E' : scr === 'detail' ? selT.c : bg;

    const openT = Tf.filter(t => !t.done);
    const dueNow = openT.filter(t => t.dueN !== null && t.dueN <= 0).sort((a, b) => sortP(a, b) || a.dueN - b.dueN);
    const closedToday = Tf.filter(t => t.done && t.end === td);
    const late = openT.filter(t => t.dueN !== null && t.dueN < 0).length;
    const now = Tf.filter(t => t.status === 'In Progress').sort(sortP)[0];
    const upcoming = openT.filter(t => t.dueN === null || t.dueN > 0).sort((a, b) => (a.dueN === null) - (b.dueN === null) || a.dueN - b.dueN || sortP(a, b)).slice(0, 5);
    const segs = [...closedToday, ...dueNow].map(t => ({ bg: t.done ? t.c : 'var(--surf2)' }));
    const dl = new Date(); const dateLabel = (this.DOW[dl.getDay()] + ' · ' + this.MON[dl.getMonth()] + ' ' + dl.getDate()).toUpperCase();

    const colItems = Tf.filter(t => t.status === s.col).sort(sortP);
    const colTabs = this.STATUS.map(c => { const a = s.col === c.k; return { name: c.label, n: Tf.filter(t => t.status === c.k).length, bg: a ? 'var(--ink)' : 'var(--surf)', fg: a ? 'var(--bg)' : 'var(--ink)', onClick: () => this.setState({ col: c.k }) }; });

    const q = s.q.trim().toLowerCase();
    const results = Tf.filter(t => (!q || (t.title + ' ' + t.id + ' ' + (t.pr || '') + ' ' + (t.domain || '') + ' ' + (t.owner || '')).toLowerCase().includes(q)) && (!s.fPri.length || s.fPri.includes(t.pri)) && (!s.fType || t.domain === s.fType) && (s.fStatus === 'all' || t.status === s.fStatus)).sort((a, b) => (a.done - b.done) || sortP(a, b));
    const priBtn = (i, active, onClick) => ({ label: this.PRI[i].name, c: this.PRI[i].c, bg: active ? this.PRI[i].c : 'transparent', fg: active ? this.PRI[i].on : 'var(--ink)', onClick });
    const chip = (label, active, onClick) => ({ label, bg: active ? 'var(--ink)' : 'var(--surf)', fg: active ? 'var(--bg)' : 'var(--ink)', onClick });
    const ownerChips = [chip('All', !s.ownerF, () => this.setState({ ownerF: null })), ...owners.map(o => chip(o, s.ownerF === o, () => this.setState({ ownerF: s.ownerF === o ? null : o })))];

    const closedAll = Tf.filter(t => t.done), dayISO = i => this.addD(-6 + i);
    const wk = [0, 1, 2, 3, 4, 5, 6].map(i => closedAll.filter(t => t.end === dayISO(i)).length);
    const this7 = wk.reduce((a, b) => a + b, 0), prev7 = closedAll.filter(t => t.end && this.dayDiff(t.end) <= -7 && this.dayDiff(t.end) >= -13).length;
    const mx = Math.max(...wk, 1), delta = this7 - prev7;
    const week = wk.map((n, i) => ({ l: this.DOW[this.parts(dayISO(i)).getDay()][0], h: Math.max(8, n / mx * 100) + '%', bg: i === 6 ? sig : 'rgba(127,127,140,.35)' }));

    const pv = this.parse(s.draft), pvOwner = pv.owner;
    const mm = String(Math.floor(s.secs / 60)).padStart(2, '0') + ':' + String(s.secs % 60).padStart(2, '0');
    const nextSub = (focT.subs.find(x => !x.d) || {}).t || '';
    const ob = s.obStep, isSheet = s.mode === 'cloud';
    const navS = k => ({ bg: scr === k ? 'var(--ink)' : 'transparent', fg: scr === k ? 'var(--bg)' : 'var(--mute)' });
    const sideScr = desk && ['today', 'board', 'search', 'review', 'detail', 'account', 'inbox', 'people'].includes(scr);
    const unread = s.inbox.filter(n => n.ts > s.seen).length;
    const openN = Tf.filter(t => !t.done).length;

    const ago = s.lastSync ? Math.max(0, Math.round((Date.now() - s.lastSync) / 1000)) : 0;
    const agoTxt = ago < 10 ? 'just now' : ago < 60 ? ago + 's ago' : ago < 3600 ? Math.round(ago / 60) + 'm ago' : Math.round(ago / 3600) + 'h ago';
    const pendTxt = s.pend ? s.pend + ' change' + (s.pend > 1 ? 's' : '') + ' waiting' : 'All changes saved';
    const syncSt = isSheet ? s.syncSt : 'idle';
    const syncColor = { synced: '#12C79A', syncing: '#FF8A00', offline: '#8E8D99', error: '#FF2E63', idle: '#8E8D99' }[syncSt];
    const syncShort = { synced: 'Synced', syncing: 'Syncing', offline: 'Offline' + (s.pend ? ' · ' + s.pend : ''), error: 'Retrying', idle: '—' }[syncSt];
    const syncText = { synced: 'Synced ' + agoTxt, syncing: 'Syncing…', offline: 'Offline · ' + pendTxt, error: 'Sync failed, retrying · ' + pendTxt, idle: 'Not connected' }[syncSt];

    const sheetBox = desk
      ? { position: 'absolute', left: '50%', marginLeft: -270, width: 540, top: '14%', background: 'var(--surf)', borderRadius: 28, padding: 20, display: 'flex', flexDirection: 'column', gap: 14, boxShadow: '0 30px 80px rgba(0,0,0,.35)', transition: 'transform .25s cubic-bezier(.2,.8,.2,1),opacity .2s', transform: s.sheet ? 'translateY(0)' : 'translateY(16px)', opacity: s.sheet ? 1 : 0 }
      : { position: 'absolute', left: 0, right: 0, bottom: 0, background: 'var(--surf)', borderRadius: '28px 28px 0 0', padding: '10px 16px 20px', display: 'flex', flexDirection: 'column', gap: 14, transition: 'transform .3s cubic-bezier(.2,.8,.2,1)', transform: s.sheet ? 'translateY(0)' : 'translateY(105%)' };
    const nv = (label, d, k, badge, onClick) => ({ label, d, badge, onClick, bg: scr === k ? 'var(--ink)' : 'transparent', fg: scr === k ? 'var(--bg)' : 'var(--ink)' });
    const sideNav = [
      nv('Today', 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4', 'today', String(dueNow.length), () => this.go('today')),
      nv('Board', 'M4 5.5h4v13H4zM10 5.5h4v9h-4zM16 5.5h4v5h-4z', 'board', String(openN), () => this.go('board')),
      nv('Review', 'M5 20v-8M12 20V5M19 20v-5', 'review', '', () => this.go('review')),
      nv('Search', 'M11 4.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM20 20l-4-4', 'search', '', () => this.go('search')),
      nv('Notifications', 'M6 16V11a6 6 0 1112 0v5l1.5 2h-15zM10 20.5a2 2 0 004 0', 'inbox', unread ? String(unread) : '', () => this.goInbox()),
    ];
    const maxW = desk ? ({ onboard: 480, focus: 520, login: 480 }[scr] || 1800) : 0;
    const frameStyle = (mob || desk)
      ? { width: '100%', height: mob ? '100dvh' : '100vh', position: mob ? 'fixed' : 'relative', top: 0, left: 0, overflow: 'hidden', background: fb, paddingTop: 'env(safe-area-inset-top)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }
      : { width: 412, height: 892, borderRadius: 18, overflow: 'hidden', background: fb, border: '8px solid #1b1b1f', boxShadow: '0 30px 80px rgba(0,0,0,.25)', boxSizing: 'border-box', position: 'relative', display: 'flex', flexDirection: 'column' };
    const jumpList = [['Onboarding', () => this.setState({ screen: 'onboard', obStep: 0, sheet: false })], ['Login', () => this.go('login')], ['Today', () => this.go('today')], ['Board', () => this.go('board')], ['Task detail', () => this.open((T[0] || {}).id)], ['Quick add', () => this.openSheet()], ['Search', () => this.go('search')], ['Weekly review', () => this.go('review')], ['Focus', () => this.focus((T[0] || {}).id)], ['Account', () => this.go('account')], [dark ? '☀ Light' : '☾ Dark', () => this.setState({ dark: !dark })]];
    const curJump = s.sheet ? 'Quick add' : { onboard: 'Onboarding', login: 'Login', today: 'Today', board: 'Board', detail: 'Task detail', search: 'Search', review: 'Weekly review', focus: 'Focus', account: 'Account' }[scr];

    return {
      themeVars, frameStyle, dark, light: !dark, version: '1.0.0',
      jumps: jumpList.map(([label, onClick]) => ({ label, onClick, bg: label === curJump ? '#0F0F12' : 'rgba(15,15,18,.07)', fg: label === curJump ? '#fff' : '#0F0F12' })),
      jumpDisp: phoneMock ? 'flex' : 'none', rootMinH: phoneMock ? '100vh' : mob ? '100dvh' : '100vh', rootPad: phoneMock ? '28px 16px 40px' : '0',
      isOnboard: scr === 'onboard', isLogin: scr === 'login', isAccount: scr === 'account', isToday: scr === 'today' && !(admin && s.adminView === 'team'), isAdminDesk: scr === 'today' && admin && s.adminView === 'team' && desk, isAdminMob: scr === 'today' && admin && s.adminView === 'team' && !desk, isAdmin: admin, showTeam: () => this.setState({ adminView: 'team' }), showMine: () => this.setState({ adminView: 'mine' }), isBoard: scr === 'board' && !desk, isBoardDesk: scr === 'board' && desk, isSearch: scr === 'search', isReview: scr === 'review', isDetail: scr === 'detail', isFocus: scr === 'focus',
      showNav: ['today', 'board', 'search', 'review'].includes(scr) && !desk, showSide: sideScr, sideNav, themeIcon: dark ? 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4' : 'M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z',
      mainOuter: { flex: 1, minWidth: 0, minHeight: 0, display: 'flex', justifyContent: 'center' },
      mainInner: { width: '100%', maxWidth: maxW || 'none', display: 'flex', flexDirection: 'column', minHeight: 0 },
      sheetBox, handleDisp: desk ? 'none' : 'block',
      detailBar: { position: 'absolute', left: sideScr ? 248 : 0, right: 0, bottom: 0, padding: '12px 16px 16px', display: 'flex', justifyContent: 'center', background: 'linear-gradient(transparent,var(--bg) 30%)' },
      toastPos: desk ? 'position:absolute;left:50%;margin-left:-180px;width:360px;bottom:32px;box-sizing:border-box;' : 'position:absolute;left:24px;right:24px;bottom:calc(96px + env(safe-area-inset-bottom));',
      toggleDark: () => this.setState({ dark: !dark }),
      goToday: () => this.go('today'), goBoard: () => this.go('board'), goReview: () => this.go('review'), goSearch: () => this.go('search'), goAccount: () => this.setState(st => ({ prev: st.screen === 'account' ? st.prev : st.screen, screen: 'account' })),
      back: () => { this.setState({ running: false }); if (this.idx > 0) history.back(); else this.setState({ screen: s.prev || 'today' }); },
      nav: { today: navS('today'), board: navS('board'), review: navS('review'), search: navS('search') },
      // sync / account
      syncColor, syncShort, syncText, meInitial: (this.me()[0] || 'B').toUpperCase(), isSheet,
      acctTitle: isSheet ? 'Connected' : 'Not connected', acctHost: (this.cfg && this.cfg.wsName) || 'None', acctMe: this.me(), acctPend: String(s.pend),
      syncNow: () => this.sync(),
      isPeople: scr === 'people' && admin, goPeople: () => this.goPeople(),
      peopleCount: s.people.length ? s.people.filter(p => p.active).length + ' active' : '',
      pName: s.pName, pUser: s.pUser, pPass: s.pPass, ownerNames: s.dOwners || [],
      onPName: e => this.setState({ pName: e.target.value }), onPUser: e => this.setState({ pUser: e.target.value.replace(/\s/g, '').toLowerCase() }), onPPass: e => this.setState({ pPass: e.target.value }),
      genPass: () => this.setState({ pPass: this.makePassword() }),
      roleOpts: ['member', 'admin'].map(r => ({ label: r === 'admin' ? 'Admin' : 'Member', bg: s.pRole === r ? 'var(--ink)' : 'transparent', fg: s.pRole === r ? 'var(--bg)' : 'var(--ink)', onClick: () => this.setState({ pRole: r }) })),
      hasPErr: !!s.pErr, pErr: s.pErr, hasPMsg: !!s.pMsg, pMsg: s.pMsg, addLabel: s.pBusy ? 'Creating…' : 'Create account', addPerson: () => this.addPerson(),
      people: s.people.map(p => {
        const self = this.cfg && p.owner_name === this.cfg.me;
        return {
          id: p.user_id, name: p.owner_name + (self ? ' (you)' : ''), sub: '@' + p.username, initial: (p.owner_name[0] || '?').toUpperCase(), op: p.active ? 1 : 0.55,
          tag: !p.active ? 'OFF' : p.role === 'admin' ? 'ADMIN' : 'MEMBER', tagBg: !p.active ? 'var(--surf2)' : p.role === 'admin' ? 'var(--ink)' : 'var(--surf2)', tagFg: !p.active ? 'var(--mute)' : p.role === 'admin' ? 'var(--bg)' : 'var(--ink)',
          canEdit: !self,
          actions: [
            { label: 'Reset password', onClick: () => this.personAction(p, 'reset') },
            ...(p.active ? [{ label: p.role === 'admin' ? 'Make member' : 'Make admin', onClick: () => this.personAction(p, 'role') }] : []),
            { label: p.active ? 'Turn off' : 'Turn on', danger: p.active, onClick: () => this.personAction(p, 'active') },
          ],
        };
      }),
      isInbox: scr === 'inbox', goInbox: () => this.goInbox(), hasUnread: unread > 0, inboxBadge: unread > 9 ? '9+' : String(unread),
      inboxSub: (() => { const n = scr === 'inbox' ? s.inbox.filter(x => x.ts > s.inboxMark).length : unread; return s.inbox.length ? (n ? n + ' new' : 'All caught up') : ''; })(), inboxEmpty: s.inbox.length === 0,
      inboxItems: s.inbox.map(n => {
        const k = { assign: ['#6B4BFF', 'M15 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9 10a3 3 0 100-6 3 3 0 000 6zM19 8v6M22 11h-6'], change: ['#0B4FA8', 'M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4'], blocked: ['#FF2E63', 'M12 3l9.5 17h-19L12 3zM12 10v4M12 17.5v.01'], closed: ['#137A4B', 'M5 12.5l4.5 4.5L19 7.5'], daily: ['#FF8A00', 'M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z'] }[n.kind] || ['#8E8D99', 'M6 16V11a6 6 0 1112 0v5l1.5 2h-15zM10 20.5a2 2 0 004 0'];
        const isNew = n.ts > s.inboxMark;
        return { title: n.title, body: n.body, when: this.agoShort(n.ts), c: k[0], d: k[1], bg: isNew ? 'var(--surf)' : 'transparent', bd: isNew ? 'transparent' : 'var(--line)', dot: isNew ? 'block' : 'none', open: () => this.openNote(n) };
      }),
      ...(() => {
        const k = this.pushKind(), can = k === 'web' || k === 'native';
        const hint = s.pushErr || (k === 'ios-install' ? 'On iPhone, notifications need the Home Screen app: tap Share, then Add to Home Screen, and open BGDX from there.' : k === 'noconfig' ? 'Push is not set up yet (firebase-config.js is empty).' : k === 'none' ? 'This browser does not support notifications.' : s.pushOn ? 'You get alerts for tasks assigned to you, changes to your tasks, a morning due reminder' + (this.cfg && this.cfg.role === 'admin' ? ', and blocked tasks.' : '.') : '');
        return {
          showPushBtn: isSheet && can, pushHint: hint, hasPushHint: isSheet && !!hint, pushHintColor: s.pushErr ? '#FF2E63' : 'var(--mute)',
          pushLabel: s.pushBusy ? 'Working…' : s.pushOn ? 'Turn off notifications' : 'Turn on notifications',
          togglePush: () => { if (!s.pushBusy) (s.pushOn ? this.disablePush() : this.enablePush()); },
        };
      })(), acctActionLabel: isSheet ? 'Sign out' : 'Sign in', acctAction: () => isSheet ? this.signOut('') : this.go('login'),
      // login
      lUser: s.lUser, lKey: s.lKey, lMe: s.lMe, onLUser: e => this.setState({ lUser: e.target.value }), onLKey: e => this.setState({ lKey: e.target.value }), onLMe: e => this.setState({ lMe: e.target.value }),
      hasLErr: !!s.lErr, lErr: s.lErr, lBtn: s.lBusy ? 'Signing in…' : 'Sign in', doConnect: () => this.doConnect(),
      lStep1: s.lStep === 1, lStep2: s.lStep === 2, lKeyType: s.lShowKey ? 'text' : 'password', lShowTxt: s.lShowKey ? 'Hide' : 'Show', toggleKey: () => this.setState({ lShowKey: !s.lShowKey }),
      lAdv: s.lAdv, lAdvTxt: s.lAdv ? 'Hide advanced' : 'Advanced', toggleAdv: () => this.setState({ lAdv: !s.lAdv }),
      lTitle: s.lStep === 1 ? 'Sign in' : 'Who are you?', lSub: s.lStep === 1 ? 'Use the username and password your admin gave you.' : 'Pick your name so tasks are assigned to you.',
      lWho: [],
      onKeyEnter: e => { if (e.key === 'Enter') this.doConnect(); }, onMeEnter: () => {}, doFinish: () => {}, backStep: () => this.setState({ lStep: 1, lPend: null, lErr: '' }),
      // onboarding
      ob0: ob === 0, ob1: ob === 1, ob2: ob === 2, obCount: '0' + (ob + 1) + ' / 03',
      obDots: [0, 1, 2].map(i => ({ w: i === ob ? '22px' : '6px', bg: i === ob ? 'var(--ink)' : 'var(--line)' })),
      obCta: ob === 2 ? 'Start' : 'Next', obNext: () => ob === 2 ? this.afterOb() : this.setState({ obStep: ob + 1 }), finishOb: () => this.afterOb(), priLegend: this.PRI.slice(0, 4),
      // today
      dateLabel, todayHeadline: dueNow.length ? dueNow.length + ' to ship' : 'All clear',
      todaySub: closedToday.length + ' closed today' + (late ? ' · ' + late + ' late' : ''), todaySegs: segs, todayLeftN: String(dueNow.length), todayList: [...dueNow, ...closedToday],
      weekNo: 'WEEK ' + (() => { const d = new Date(), j = new Date(d.getFullYear(), 0, 1); return Math.ceil(((d - j) / 864e5 + j.getDay() + 1) / 7); })(),
      laneHeads: ['TODAY', 'TOMORROW', 'LATER'], lanes: admin ? this.buildLanes(T, owners) : [], teamSummary: admin ? this.teamSummary(T, owners) : '',
      hasNow: !!now, now: now || T[0] || {}, upcoming, ownerChips,
      // board
      colTabs, colItems, colEmpty: colItems.length === 0, openCount: openN + ' open',
      boardCols: this.STATUS.map(c => { const items = Tf.filter(t => t.status === c.k).sort(sortP); return { name: c.label, n: items.length, items, dot: c.c }; }),
      // search
      q: s.q, hasQ: !!s.q, onQ: e => this.setState({ q: e.target.value }), clearQ: () => this.setState({ q: '' }),
      priFilters: [0, 1, 2, 3].map(i => priBtn(i, s.fPri.includes(i), () => this.setState(st => ({ fPri: st.fPri.includes(i) ? st.fPri.filter(x => x !== i) : [...st.fPri, i] })))),
      typeFilters: [chip('All types', !s.fType, () => this.setState({ fType: null })), ...types.map(ty => chip(ty, s.fType === ty, () => this.setState({ fType: s.fType === ty ? null : ty })))],
      statusFilters: [{ k: 'all', label: 'All' }, ...this.STATUS].map(o => chip(o.label, s.fStatus === o.k, () => this.setState({ fStatus: o.k }))),
      results, resultsLabel: results.length + ' RESULT' + (results.length === 1 ? '' : 'S'),
      // review
      weekLabel: (this.fmt(dayISO(0)) + ' – ' + this.fmt(td)).toUpperCase(), weekDelta: (delta >= 0 ? '+' : '') + delta + ' vs prior wk', doneCount: String(this7), week,
      blockedN: String(Tf.filter(t => t.status === 'Blocked').length), overdueN: String(late),
      priMix: this.PRI.map((p, i) => ({ label: p.label, c: p.c, n: closedAll.filter(t => t.pri === i).length })).filter(p => p.n > 0),
      doneList: closedAll.slice().sort((a, b) => (b.end || '').localeCompare(a.end || '')).slice(0, 8), carryN: String(openN),
      // detail
      d: selT,
      statusOpts: this.STATUS.map(o => { const a = selT.status === o.k; return { label: o.label, bd: o.c, bg: a ? o.c : 'transparent', fg: a ? '#FFFFFF' : 'var(--ink)', onClick: () => this.setStatus(selT.id, o.k) }; }),
      priOpts: [0, 1, 2, 3].map(i => priBtn(i, selT.pri === i, () => this.upd(selT.id, x => ({ ...x, pri: i })))),
      ownerOpts: owners.map(o => chip(o, selT.owner === o, () => this.upd(selT.id, x => ({ ...x, owner: o })))),
      toggleCost: () => this.upd(selT.id, x => ({ ...x, costReq: !x.costReq })),
      onCost: e => { const v = e.target.value; this.upd(selT.id, x => ({ ...x, cost: v === '' ? '' : Number(v) })); },
      onNotes: e => { const v = e.target.value; this.upd(selT.id, x => ({ ...x, notes: v })); },
      subRows: selT.subs.map((x, i) => ({ ...x, bg: x.d ? selT.c : 'transparent', deco: x.d ? 'line-through' : 'none', op: x.d ? 0.5 : 1, toggle: () => this.upd(selT.id, t => ({ ...t, subs: t.subs.map((y, j) => j === i ? { ...y, d: !y.d } : y) })) })),
      newSub: s.newSub, onNewSub: e => this.setState({ newSub: e.target.value }),
      onSubKey: e => { if (e.key === 'Enter' && s.newSub.trim()) { const v = s.newSub.trim(); this.upd(selT.id, t => ({ ...t, subs: [...(t.subs || []), { t: v, d: false }] })); this.setState({ newSub: '' }); } },
      linkPr: () => this.upd(selT.id, t => ({ ...t, pr: '#' + (219 + parseInt((t.id.match(/\d+/) || [0])[0], 10) % 7), branch: 'feat/' + t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24).replace(/-$/, '') })),
      // focus
      f: { ...focT, nextSub, complete: () => { this.setStatus(focT.id, 'Closed'); this.setState({ screen: s.prev || 'today', running: false }); } },
      clock: mm, ringOff: String(753.98 * (1 - s.secs / 1500)), focusState: s.running ? 'DEEP WORK' : 'PAUSED',
      runLabel: s.running ? 'Pause' : 'Resume', toggleRun: () => this.setState({ running: !s.running }),
      // sheet
      sheetPE: s.sheet ? 'auto' : 'none', sheetOp: s.sheet ? 1 : 0,
      openSheet: () => this.openSheet(), closeSheet: () => this.setState({ sheet: false }),
      inputRef: this.inputRef, draft: s.draft, onDraft: e => this.setState({ draft: e.target.value }),
      onDraftKey: e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.addTask(); } },
      pv: { c: (this.PRI[pv.pri] || this.PRI[4]).c },
      sheetPri: [0, 1, 2, 3].map(i => priBtn(i, pv.pri === i, () => this.setState({ dPri: i, draft: s.draft.replace(/!p?[0-3]\b/i, '').trim() }))),
      sheetTypes: types.map(ty => ({ label: ty, bg: pv.type === ty ? 'var(--ink)' : 'var(--surf2)', fg: pv.type === ty ? 'var(--bg)' : 'var(--ink)', onClick: () => this.setState({ dType: ty, draft: s.draft.replace(/#\w+/, '').trim() }) })),
      sheetOwners: (owners.length ? owners : [this.me()]).map(o => chip(o, pvOwner === o, () => this.setState({ dOwner: o, draft: s.draft.replace(/@\w+/, '').trim() }))),
      sheetDue: ['Today', 'Tomorrow', '+1 week'].map(l => ({ label: l, bg: s.dDue === l ? 'var(--ink)' : 'transparent', fg: s.dDue === l ? 'var(--bg)' : 'var(--ink)', onClick: () => this.setState({ dDue: l }) })),
      addTask: () => this.addTask(), addOp: pv.title ? 1 : 0.35,
      hasToast: !!s.toast, toast: s.toast,
    };
  }
  buildLanes(T, owners) {
    const open = T.filter(t => !t.done);
    const names = owners.slice(); open.forEach(t => { if (t.owner && !names.includes(t.owner)) names.push(t.owner); });
    const tag = t => t.status === 'Blocked' ? ['BLOCKED · ' + t.pl, '#FF2E63'] : (t.dueN !== null && t.dueN < 0) ? ['OVERDUE ' + (-t.dueN) + 'D', '#FF2E63'] : [t.id + ' · ' + t.pl, t.pri === 0 ? '#FF2E63' : t.pri === 1 ? '#FF8A00' : 'var(--mute)'];
    const bucket = t => (t.dueN !== null && t.dueN <= 0) || (t.dueN === null && t.status === 'In Progress') ? 0 : t.dueN === 1 ? 1 : 2;
    return names.map(name => {
      const mine = open.filter(t => t.owner === name).sort((a, b) => a.pri - b.pri), n = mine.length;
      const card = (t, w) => { const [tg, tc] = tag(t); return { title: t.title, c: t.c, tag: tg, tagC: tc, when: w, open: t.open }; };
      const cols = [0, 1, 2].map(i => ({ cards: mine.filter(t => bucket(t) === i).slice(0, 2).map(t => card(t)) }));
      const extra = [0, 1, 2].map(i => mine.filter(t => bucket(t) === i).length - cols[i].cards.length);
      extra.forEach((x, i) => { if (x > 0) cols[i].cards.push({ title: '+' + x + ' more', c: 'var(--line)', tag: 'IN THE BOARD', tagC: 'var(--mute)', open: () => this.setState({ screen: 'board', ownerF: name }) }); });
      return { name, ini: (name[0] || '?').toUpperCase(), cols, isFree: n === 0, sub: n + ' open' + (n >= 4 ? ' · heavy' : n <= 1 ? ' · free' : ''),
        meter: [0, 1, 2, 3, 4].map(i => ({ bg: i < n ? (n >= 4 ? '#FF2E63' : '#C8FF2E') : 'var(--surf2)' })),
        flat: mine.map(t => card(t, ['Today', 'Tomorrow', 'Later'][bucket(t)])) };
    }).sort((a, b) => (b.flat.length - a.flat.length) || a.name.localeCompare(b.name));
  }
  teamSummary(T, owners) {
    const open = T.filter(t => !t.done), blocked = open.filter(t => t.status === 'Blocked').length, late = open.filter(t => t.dueN !== null && t.dueN < 0).length;
    const cnt = {}; open.forEach(t => { if (t.owner) cnt[t.owner] = (cnt[t.owner] || 0) + 1; });
    const top = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0], free = owners.filter(o => !cnt[o]);
    const parts = [open.length + ' open'];
    if (blocked) parts.push(blocked + ' blocked'); if (late) parts.push(late + ' overdue');
    if (top && cnt[top] >= 3) parts.push(top + ' is carrying the most'); if (free.length) parts.push(free.slice(0, 2).join(' and ') + (free.length > 2 ? ' +' + (free.length - 2) : '') + ' free');
    return parts.join(' · ');
  }
  openSheet() {
    this.setState(s => ({ sheet: true, screen: ['today', 'board', 'search', 'review'].includes(s.screen) ? s.screen : 'today' }));
    setTimeout(() => this.inputRef.current && this.inputRef.current.focus(), 320);
  }
}