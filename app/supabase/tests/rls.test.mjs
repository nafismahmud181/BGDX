// Security test for the BGDX database. Creates a throwaway workspace + users, checks every access rule, then deletes them.
// Run: node supabase/tests/rls.test.mjs   (reads app/.secrets.env)
import fs from 'node:fs';

const env = Object.fromEntries(fs.readFileSync(new URL('../../.secrets.env', import.meta.url), 'utf8')
  .split('\n').filter(Boolean).map(l => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]));
const URL_ = env.SUPABASE_URL, ANON = env.SUPABASE_ANON_KEY, SVC = env.SUPABASE_SERVICE_ROLE_KEY;
const EMAIL_DOMAIN = 'users.bgdx.app';

let pass = 0, fail = 0;
const ok = (cond, name, extra = '') => { if (cond) { pass++; console.log('  ✓', name); } else { fail++; console.log('  ✗', name, extra); } };

async function rest(path, { token, method = 'GET', body, prefer } = {}) {
  const r = await fetch(`${URL_}/rest/v1/${path}`, {
    method, body: body ? JSON.stringify(body) : undefined,
    headers: { apikey: ANON, Authorization: `Bearer ${token || ANON}`, 'Content-Type': 'application/json', ...(prefer ? { Prefer: prefer } : {}) },
  });
  const text = await r.text(); let data; try { data = JSON.parse(text); } catch { data = text; }
  return { status: r.status, data };
}
const svc = (path, opts = {}) => fetch(`${URL_}${path}`, { ...opts, headers: { apikey: SVC, Authorization: `Bearer ${SVC}`, 'Content-Type': 'application/json', ...(opts.headers || {}) } }).then(async r => ({ status: r.status, data: await r.json().catch(() => null) }));
const svcRest = (path, opts = {}) => svc(`/rest/v1/${path}`, { ...opts, headers: { Prefer: 'return=representation', ...(opts.headers || {}) } });

async function makeUser(username, password) {
  const r = await svc('/auth/v1/admin/users', { method: 'POST', body: JSON.stringify({ email: `${username}@${EMAIL_DOMAIN}`, password, email_confirm: true }) });
  if (!r.data || !r.data.id) throw new Error('create user failed: ' + JSON.stringify(r.data));
  return r.data.id;
}
async function signIn(username, password) {
  const r = await fetch(`${URL_}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: ANON, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: `${username}@${EMAIL_DOMAIN}`, password }) });
  const j = await r.json(); if (!j.access_token) throw new Error('sign in failed: ' + JSON.stringify(j)); return j.access_token;
}

const sfx = Date.now().toString(36), users = [];
let ws;
try {
  console.log('setup');
  ws = (await svcRest('workspaces', { method: 'POST', body: JSON.stringify({ name: 'RLS test ' + sfx }) })).data[0].id;
  await svcRest('owners', { method: 'POST', body: JSON.stringify([{ workspace_id: ws, name: 'Nafis' }, { workspace_id: ws, name: 'Sabbir' }, { workspace_id: ws, name: 'C-Suite' }]) });
  const pw = 'Pw-' + sfx + '-x9!';
  const adminId = await makeUser('t_admin_' + sfx, pw); users.push(adminId);
  const memId = await makeUser('t_sabbir_' + sfx, pw); users.push(memId);
  const outsiderId = await makeUser('t_out_' + sfx, pw); users.push(outsiderId);
  await svcRest('members', { method: 'POST', body: JSON.stringify([
    { workspace_id: ws, user_id: adminId, username: 't_admin_' + sfx, owner_name: 'Nafis', role: 'admin' },
    { workspace_id: ws, user_id: memId, username: 't_sabbir_' + sfx, owner_name: 'Sabbir', role: 'member' },
  ]) });
  const A = await signIn('t_admin_' + sfx, pw), S = await signIn('t_sabbir_' + sfx, pw), O = await signIn('t_out_' + sfx, pw);

  console.log('tasks');
  const t1 = await rest('tasks?select=*', { token: S, method: 'POST', body: { workspace_id: ws, title: 'Sabbir own', owner: 'Sabbir' }, prefer: 'return=representation' });
  ok(t1.status === 201 && t1.data[0].aid === 'A-001', 'member creates own task, database assigns A-001', JSON.stringify(t1.data));
  ok(t1.data[0] && t1.data[0].updated_by === 'Sabbir', 'updated_by is set by the server from the login');
  const t2 = await rest('tasks?select=*', { token: S, method: 'POST', body: { workspace_id: ws, title: 'For Nafis', owner: 'Nafis' }, prefer: 'return=minimal' });
  ok(t2.status === 201, 'member can assign a new task to another listed owner');
  const t3 = await rest('tasks', { token: S, method: 'POST', body: { workspace_id: ws, title: 'Bad owner', owner: 'Nobody' } });
  ok(t3.status >= 400, 'member cannot assign to a name that is not in the owner list');
  const t4 = await rest('tasks', { token: O, method: 'POST', body: { workspace_id: ws, title: 'Outsider', owner: 'Sabbir' } });
  ok(t4.status >= 400, 'user from outside the workspace cannot create tasks');

  const sees = await rest(`tasks?select=aid,owner&workspace_id=eq.${ws}`, { token: S });
  ok(sees.data.length === 1 && sees.data[0].owner === 'Sabbir', 'member sees only their own tasks', JSON.stringify(sees.data));
  const all = await rest(`tasks?select=aid,owner&workspace_id=eq.${ws}&order=aid`, { token: A });
  ok(all.data.length === 2 && all.data[1].aid === 'A-002', 'admin sees every task; IDs are sequential', JSON.stringify(all.data));
  ok((await rest(`tasks?select=aid&workspace_id=eq.${ws}`, { token: O })).data.length === 0, 'outsider sees no tasks');
  ok((await rest(`tasks?select=aid&workspace_id=eq.${ws}`)).status === 401 || (await rest(`tasks?select=aid&workspace_id=eq.${ws}`)).data.length === 0, 'anonymous visitor sees no tasks');

  const nafisTask = all.data.find(t => t.owner === 'Nafis').aid;
  const hijack = await rest(`tasks?workspace_id=eq.${ws}&aid=eq.${nafisTask}`, { token: S, method: 'PATCH', body: { title: 'hacked' }, prefer: 'return=representation' });
  ok(Array.isArray(hijack.data) && hijack.data.length === 0, "member cannot edit someone else's task");
  const aidChange = await rest(`tasks?workspace_id=eq.${ws}&aid=eq.A-001`, { token: S, method: 'PATCH', body: { aid: 'A-999' }, prefer: 'return=representation' });
  ok(aidChange.data[0] && aidChange.data[0].aid === 'A-001', 'task ID cannot be changed by users');

  const now = new Date();
  await rest(`tasks?workspace_id=eq.${ws}&aid=eq.A-001`, { token: S, method: 'PATCH', body: { status: 'In Progress', updated_at: now.toISOString() } });
  const stale = await rest(`tasks?workspace_id=eq.${ws}&aid=eq.A-001`, { token: S, method: 'PATCH', body: { status: 'Parked', updated_at: new Date(now - 60000).toISOString() }, prefer: 'return=representation' });
  const after = await rest(`tasks?select=status&workspace_id=eq.${ws}&aid=eq.A-001`, { token: S });
  ok(after.data[0].status === 'In Progress', 'an older (offline) edit does not overwrite a newer one', JSON.stringify(stale.data));
  await rest(`tasks?workspace_id=eq.${ws}&aid=eq.A-001`, { token: S, method: 'PATCH', body: { status: 'Closed', updated_at: new Date().toISOString() } });
  await rest(`tasks?workspace_id=eq.${ws}&aid=eq.A-001`, { token: A, method: 'PATCH', body: { priority: 0, updated_at: new Date(Date.now() + 1000).toISOString() } });

  console.log('notifications');
  const inA = (await rest(`inbox?select=kind,recipient,title,body&workspace_id=eq.${ws}&order=id`, { token: A })).data;
  const inS = (await rest(`inbox?select=kind,recipient,title,body&workspace_id=eq.${ws}&order=id`, { token: S })).data;
  ok(inA.some(n => n.kind === 'assign' && n.recipient === 'Nafis'), 'admin Nafis got "New task for you"', JSON.stringify(inA));
  ok(inA.some(n => n.kind === 'closed' && /by Sabbir/.test(n.body)), 'admin got "Task closed" when the member closed a task');
  ok(inS.some(n => n.kind === 'change' && /Priority: None → Highest/.test(n.body)), 'member got "Nafis updated your task" when the admin changed priority', JSON.stringify(inS));
  ok(!inS.some(n => n.recipient === '@admins'), 'member does not see admin-only notifications');
  ok(!inS.some(n => n.kind === 'change' && /Status/.test(n.body)), 'nobody is notified about their own changes');
  ok((await rest(`inbox?select=id&workspace_id=eq.${ws}`, { token: O })).data.length === 0, 'outsider sees no notifications');
  ok((await rest('inbox', { token: A, method: 'POST', body: { workspace_id: ws, recipient: 'Sabbir', kind: 'x', title: 'fake' } })).status >= 400, 'nobody can write fake notifications from the app');

  console.log('people & devices');
  ok((await rest(`members?select=username&workspace_id=eq.${ws}`, { token: S })).data.length === 1, 'member sees only their own account');
  ok((await rest(`members?select=username&workspace_id=eq.${ws}`, { token: A })).data.length === 2, 'admin sees all accounts');
  ok((await rest(`members?workspace_id=eq.${ws}&user_id=eq.${memId}`, { token: S, method: 'PATCH', body: { role: 'admin' }, prefer: 'return=representation' })).data.length === 0, 'member cannot make themselves admin');
  ok((await rest('rpc/register_device', { token: S, method: 'POST', body: { p_token: 'tok-' + sfx, p_workspace: ws, p_platform: 'web' } })).status === 204, 'member registers a push device');
  ok((await rest('rpc/register_device', { token: O, method: 'POST', body: { p_token: 'tok2-' + sfx, p_workspace: ws, p_platform: 'web' } })).status >= 400, 'outsider cannot register a device in this workspace');
  ok((await rest('devices?select=token', { token: A })).data.every(d => d.token !== 'tok-' + sfx), "admin cannot read other people's device tokens");
} catch (e) {
  fail++; console.error('ERROR', e.message);
} finally {
  console.log('cleanup');
  if (ws) await svcRest(`workspaces?id=eq.${ws}`, { method: 'DELETE' });
  for (const id of users) await svc(`/auth/v1/admin/users/${id}`, { method: 'DELETE' });
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}
