// Creates (or deletes with --clean) a throwaway workspace for visual testing. Prints the test login.
import fs from 'node:fs';
const env = Object.fromEntries(fs.readFileSync(new URL('../.secrets.env', import.meta.url), 'utf8').split('\n').filter(Boolean).map(l => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]));
const U = env.SUPABASE_URL, K = env.SUPABASE_SERVICE_ROLE_KEY;
const call = (p, o = {}) => fetch(U + p, { ...o, headers: { apikey: K, Authorization: 'Bearer ' + K, 'Content-Type': 'application/json', Prefer: 'return=representation', ...(o.headers || {}) } }).then(r => r.json().catch(() => null));
const STATE = new URL('../.seed-test.json', import.meta.url);
if (process.argv.includes('--clean')) {
  const st = JSON.parse(fs.readFileSync(STATE, 'utf8'));
  await call(`/rest/v1/workspaces?id=eq.${st.ws}`, { method: 'DELETE' });
  for (const id of st.users) await call(`/auth/v1/admin/users/${id}`, { method: 'DELETE' });
  fs.rmSync(STATE); console.log('cleaned'); process.exit(0);
}
const ws = (await call('/rest/v1/workspaces', { method: 'POST', body: JSON.stringify({ name: 'Visual test' }) }))[0].id;
await call('/rest/v1/owners', { method: 'POST', body: JSON.stringify(['Nafis', 'Sabbir', 'Hamim', 'C-Suite'].map((name, i) => ({ workspace_id: ws, name, sort: i }))) });
const pw = 'Visual' + Date.now().toString(36) + 'X9';
const u = await call('/auth/v1/admin/users', { method: 'POST', body: JSON.stringify({ email: 'vtest@users.bgdx.app', password: pw, email_confirm: true }) });
await call('/rest/v1/members', { method: 'POST', body: JSON.stringify({ workspace_id: ws, user_id: u.id, username: 'vtest', owner_name: 'Nafis', role: 'member' }) });
const d = n => { const x = new Date(); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };
const t = (aid, title, owner, status, priority, due, extra = {}) => ({ workspace_id: ws, aid, title, owner, status, priority, due, domain: 'Technology', checklist: [], pr: '', ...extra });
await call('/rest/v1/tasks', { method: 'POST', body: JSON.stringify([
  t('A-032', 'Website Launch Readiness (Architecture & System Infrastructure)', 'Nafis', 'In Progress', 0, d(0), { checklist: [{ t: 'Staging load test', d: true }, { t: 'Go-live checklist', d: false }], pr: '#218' }),
  t('A-040', 'Product Meta Data For Content', 'Nafis', 'Backlog', 1, d(0), { domain: 'Marketing' }),
  t('A-006', 'Packaging - Measurement & Box (Design Finalization)', 'Nafis', 'In Progress', 4, d(-5), { domain: 'Operations' }),
  t('A-050', 'Product Content Readiness', 'Nafis', 'Backlog', 2, d(3)),
  t('A-016', 'WhatsApp Business Profile', 'Sabbir', 'Blocked', 0, d(2)),
]) });
fs.writeFileSync(STATE, JSON.stringify({ ws, users: [u.id], user: 'vtest', pw }));
console.log('login: vtest /', pw);
