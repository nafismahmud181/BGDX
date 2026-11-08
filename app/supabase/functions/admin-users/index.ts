// Admin-only account management. The app calls this; the service key never leaves the server.
// Actions (POST JSON, caller must be an admin of `workspace_id`):
//   create       { workspace_id, username, password, owner_name, role }
//   set_password { workspace_id, user_id, password }
//   update       { workspace_id, user_id, role?, active?, owner_name? }
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

export const EMAIL_DOMAIN = 'users.bgdx.app'; // usernames map to <username>@users.bgdx.app; no email is ever sent

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const reply = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const USERNAME = /^[a-z0-9][a-z0-9._-]{2,31}$/;
const strong = (p: string) => typeof p === 'string' && p.length >= 10 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return reply(200, { ok: true });
  if (req.method !== 'POST') return reply(405, { error: 'POST only' });
  const url = Deno.env.get('SUPABASE_URL')!, anon = Deno.env.get('SUPABASE_ANON_KEY')!, service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const auth = req.headers.get('Authorization') ?? '';
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return reply(400, { error: 'Invalid JSON' }); }
  const ws = String(body.workspace_id ?? '');
  if (!ws) return reply(400, { error: 'workspace_id required' });

  // Who is calling, and are they an admin of this workspace? (checked with their own token)
  const asCaller = createClient(url, anon, { global: { headers: { Authorization: auth } } });
  const { data: who } = await asCaller.auth.getUser();
  if (!who?.user) return reply(401, { error: 'Sign in first' });
  const { data: isAdmin } = await asCaller.rpc('is_admin', { ws });
  if (!isAdmin) return reply(403, { error: 'Only admins can manage accounts' });

  const db = createClient(url, service, { auth: { persistSession: false } });
  const ownerExists = async (name: string) =>
    !!(await db.from('owners').select('name').eq('workspace_id', ws).eq('name', name).maybeSingle()).data;

  switch (body.action) {
    case 'create': {
      const username = String(body.username ?? '').trim().toLowerCase();
      const password = String(body.password ?? '');
      const owner = String(body.owner_name ?? '').trim();
      const role = body.role === 'admin' ? 'admin' : 'member';
      if (!USERNAME.test(username)) return reply(400, { error: 'Username: 3–32 characters, letters, numbers, dot, dash or underscore' });
      if (!strong(password)) return reply(400, { error: 'Password: at least 10 characters with upper and lower case letters and a number' });
      if (!owner) return reply(400, { error: 'Pick which name this person is' });
      if (!(await ownerExists(owner))) await db.from('owners').insert({ workspace_id: ws, name: owner });
      const { data: made, error } = await db.auth.admin.createUser({ email: `${username}@${EMAIL_DOMAIN}`, password, email_confirm: true, user_metadata: { username } });
      if (error || !made.user) return reply(400, { error: /already/i.test(error?.message ?? '') ? 'That username is taken' : (error?.message ?? 'Could not create user') });
      const { error: e2 } = await db.from('members').insert({ workspace_id: ws, user_id: made.user.id, username, owner_name: owner, role });
      if (e2) { await db.auth.admin.deleteUser(made.user.id); return reply(400, { error: /owner_name|members_username/.test(e2.message) ? 'That name or username is already used' : e2.message }); }
      return reply(200, { ok: true, user_id: made.user.id, username });
    }
    case 'set_password': {
      const id = String(body.user_id ?? ''), password = String(body.password ?? '');
      if (!strong(password)) return reply(400, { error: 'Password: at least 10 characters with upper and lower case letters and a number' });
      const m = await db.from('members').select('user_id').eq('workspace_id', ws).eq('user_id', id).maybeSingle();
      if (!m.data) return reply(404, { error: 'No such person in this workspace' });
      const { error } = await db.auth.admin.updateUserById(id, { password });
      if (error) return reply(400, { error: error.message });
      return reply(200, { ok: true });
    }
    case 'update': {
      const id = String(body.user_id ?? '');
      const patch: Record<string, unknown> = {};
      if (body.role === 'admin' || body.role === 'member') patch.role = body.role;
      if (typeof body.active === 'boolean') patch.active = body.active;
      if (typeof body.owner_name === 'string' && body.owner_name.trim()) {
        const owner = body.owner_name.trim();
        if (!(await ownerExists(owner))) await db.from('owners').insert({ workspace_id: ws, name: owner });
        patch.owner_name = owner;
      }
      if (id === who.user.id && (patch.role === 'member' || patch.active === false)) return reply(400, { error: 'You cannot remove your own admin access' });
      const { data, error } = await db.from('members').update(patch).eq('workspace_id', ws).eq('user_id', id).select('user_id, username, owner_name, role, active');
      if (error) return reply(400, { error: error.message });
      if (!data?.length) return reply(404, { error: 'No such person in this workspace' });
      if (patch.active === false) await db.auth.admin.updateUserById(id, { ban_duration: '876000h' });
      if (patch.active === true) await db.auth.admin.updateUserById(id, { ban_duration: 'none' });
      return reply(200, { ok: true, member: data[0] });
    }
    default:
      return reply(400, { error: 'Unknown action' });
  }
});
