// Supabase client + mapping between database rows and the task objects the UI uses.
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, EMAIL_DOMAIN } from './config.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: 'bgdx3-auth' },
});

export const toEmail = username => `${String(username).trim().toLowerCase()}@${EMAIL_DOMAIN}`;

// UI task: { uid, id (human ID like A-032), title, domain, owner, status, pri, costReq, cost, due, start, end, notes, subs, pr, branch, upd }
export function fromRow(r) {
  return {
    uid: r.id, id: r.aid, title: r.title || '', domain: r.domain || '', owner: r.owner || '', status: r.status || 'Backlog',
    pri: r.priority ?? 4, costReq: !!r.cost_required, cost: r.cost == null ? '' : Number(r.cost),
    due: r.due || '', start: r.start_date || '', end: r.end_date || '', notes: r.notes || '',
    subs: Array.isArray(r.checklist) ? r.checklist : [], pr: r.pr || '', branch: r.branch || '',
    upd: Date.parse(r.updated_at) || 0,
  };
}

export function toRow(t, workspaceId) {
  return {
    id: t.uid, workspace_id: workspaceId, title: t.title || '', domain: t.domain || '', owner: t.owner || '', status: t.status || 'Backlog',
    priority: t.pri ?? 4, cost_required: !!t.costReq, cost: t.cost === '' || t.cost == null || isNaN(Number(t.cost)) ? null : Number(t.cost),
    due: t.due || null, start_date: t.start || null, end_date: t.end || null, notes: t.notes || '',
    checklist: t.subs || [], pr: t.pr || '', branch: t.branch || '', updated_at: new Date(t.upd || Date.now()).toISOString(),
  };
}

export const fromInbox = n => ({ ts: Date.parse(n.created_at) || 0, kind: n.kind, title: n.title, body: n.body, url: n.link });

export const TASK_COLS = 'id, aid, title, domain, owner, status, priority, cost_required, cost, due, start_date, end_date, notes, checklist, pr, branch, updated_at';
