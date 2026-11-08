// Tests the admin-users function. Run: node supabase/tests/admin-users.test.mjs
import fs from 'node:fs';
const env = Object.fromEntries(fs.readFileSync(new URL('../../.secrets.env', import.meta.url), 'utf8')
  .split('\n').filter(Boolean).map(l => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]));
const URL_ = env.SUPABASE_URL, ANON = env.SUPABASE_ANON_KEY, SVC = env.SUPABASE_SERVICE_ROLE_KEY, DOMAIN = 'users.bgdx.app';
let pass = 0, fail = 0;
const ok = (c, n, x = '') => { c ? pass++ : fail++; console.log(c ? '  ✓' : '  ✗', n, c ? '' : x); };
const svc = (p, o = {}) => fetch(URL_ + p, { ...o, headers: { apikey: SVC, Authorization: 'Bearer ' + SVC, 'Content-Type': 'application/json', Prefer: 'return=representation', ...(o.headers || {}) } }).then(async r => ({ status: r.status, data: await r.json().catch(() => null) }));
const signIn = async (u, p) => { const r = await fetch(`${URL_}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: ANON, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: `${u}@${DOMAIN}`, password: p }) }); return (await r.json()).access_token || null; };
const fn = (token, body) => fetch(`${URL_}/functions/v1/admin-users`, { method: 'POST', headers: { apikey: ANON, Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(async r => ({ status: r.status, data: await r.json().catch(() => null) }));

const sfx = Date.now().toString(36), pw = 'Admin' + sfx + 'x9Q', users = [];
let ws;
try {
  ws = (await svc('/rest/v1/workspaces', { method: 'POST', body: JSON.stringify({ name: 'fn test ' + sfx }) })).data[0].id;
  await svc('/rest/v1/owners', { method: 'POST', body: JSON.stringify({ workspace_id: ws, name: 'Boss' }) });
  const a = await svc('/auth/v1/admin/users', { method: 'POST', body: JSON.stringify({ email: `fadmin_${sfx}@${DOMAIN}`, password: pw, email_confirm: true }) });
  users.push(a.data.id);
  await svc('/rest/v1/members', { method: 'POST', body: JSON.stringify({ workspace_id: ws, user_id: a.data.id, username: 'fadmin_' + sfx, owner_name: 'Boss', role: 'admin' }) });
  const A = await signIn('fadmin_' + sfx, pw);

  const weak = await fn(A, { action: 'create', workspace_id: ws, username: 'fmem_' + sfx, password: 'short', owner_name: 'Rafi' });
  ok(weak.status === 400, 'weak password is rejected', JSON.stringify(weak.data));
  const made = await fn(A, { action: 'create', workspace_id: ws, username: 'fmem_' + sfx, password: 'Member' + sfx + 'x9Q', owner_name: 'Rafi', role: 'member' });
  ok(made.status === 200 && made.data.user_id, 'admin creates a member account (new owner name added automatically)', JSON.stringify(made.data));
  if (made.data?.user_id) users.push(made.data.user_id);
  const dup = await fn(A, { action: 'create', workspace_id: ws, username: 'fmem_' + sfx, password: 'Member' + sfx + 'x9Q', owner_name: 'Rafi2' });
  ok(dup.status === 400, 'duplicate username is rejected', JSON.stringify(dup.data));
  const M = await signIn('fmem_' + sfx, 'Member' + sfx + 'x9Q');
  ok(!!M, 'new member can sign in with username + password');
  const sneaky = await fn(M, { action: 'create', workspace_id: ws, username: 'evil_' + sfx, password: 'Evil' + sfx + 'x9Qzz', owner_name: 'Evil' });
  ok(sneaky.status === 403, 'member cannot create accounts', JSON.stringify(sneaky.data));
  const self = await fn(M, { action: 'update', workspace_id: ws, user_id: made.data.user_id, role: 'admin' });
  ok(self.status === 403, 'member cannot promote themselves');
  ok((await fn(A, { action: 'update', workspace_id: ws, user_id: a.data.id, role: 'member' })).status === 400, 'admin cannot remove their own admin access');
  ok((await fn(A, { action: 'set_password', workspace_id: ws, user_id: made.data.user_id, password: 'Reset' + sfx + 'x9Q' })).status === 200, 'admin resets a password');
  ok(!!(await signIn('fmem_' + sfx, 'Reset' + sfx + 'x9Q')), 'member signs in with the new password');
  ok((await fn(A, { action: 'update', workspace_id: ws, user_id: made.data.user_id, active: false })).status === 200, 'admin deactivates the member');
  ok(!(await signIn('fmem_' + sfx, 'Reset' + sfx + 'x9Q')), 'deactivated member can no longer sign in');
  ok((await fn('not-a-token', { action: 'create', workspace_id: ws })).status === 401, 'calls without a valid login are refused');
} catch (e) { fail++; console.error('ERROR', e.message); }
finally {
  if (ws) await svc(`/rest/v1/workspaces?id=eq.${ws}`, { method: 'DELETE' });
  for (const id of users) await svc(`/auth/v1/admin/users/${id}`, { method: 'DELETE' });
  console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
}
