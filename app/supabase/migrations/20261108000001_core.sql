-- BGDX core schema: workspaces, people, tasks, inbox, devices — with row-level security.
-- Access model (same as the Sheets version):
--   admin  : sees and edits every task in the workspace
--   member : sees and edits only tasks whose owner is their owner name; may assign new tasks to any listed owner

-- ───────────── Tables ─────────────
create table public.workspaces (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  id_prefix   text not null default 'A',     -- task IDs look like A-001
  next_seq    integer not null default 1,     -- next task number
  created_at  timestamptz not null default now()
);

-- Names a task can be assigned to: people ("Nafis") or groups ("C-Suite"). Mirrors the sheet's Ownership dropdown.
create table public.owners (
  workspace_id uuid not null references public.workspaces on delete cascade,
  name         text not null check (length(trim(name)) > 0),
  sort         integer not null default 0,
  primary key (workspace_id, name)
);

create table public.members (
  workspace_id uuid not null references public.workspaces on delete cascade,
  user_id      uuid not null references auth.users on delete cascade,
  username     text not null,
  owner_name   text not null,
  role         text not null default 'member' check (role in ('admin', 'member')),
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  primary key (workspace_id, user_id),
  foreign key (workspace_id, owner_name) references public.owners (workspace_id, name) on update cascade
);
create unique index members_username_key on public.members (lower(username));

create table public.tasks (
  id             uuid primary key default gen_random_uuid(),  -- clients may send their own id (offline-safe, idempotent)
  workspace_id   uuid not null references public.workspaces on delete cascade,
  aid            text not null,                                -- human ID, assigned by the database
  title          text not null default '',
  domain         text not null default '',
  owner          text not null default '',
  status         text not null default 'Backlog' check (status in ('Backlog', 'In Progress', 'Blocked', 'Parked', 'Closed')),
  priority       smallint not null default 4 check (priority between 0 and 4),  -- 0 Highest .. 3 Lowest, 4 none
  cost_required  boolean not null default false,
  cost           numeric,
  due            date,
  start_date     date,
  end_date       date,
  notes          text not null default '',
  checklist      jsonb not null default '[]'::jsonb,
  pr             text not null default '',
  branch         text not null default '',
  updated_at     timestamptz not null default now(),
  updated_by     text not null default '',
  created_at     timestamptz not null default now(),
  unique (workspace_id, aid)
);
create index tasks_ws_owner_idx on public.tasks (workspace_id, owner);

create table public.inbox (
  id           bigint generated always as identity primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  recipient    text not null,                 -- an owner name, or '@admins'
  kind         text not null,                 -- assign | change | blocked | closed | daily | test
  title        text not null,
  body         text not null default '',
  link         text not null default '',      -- e.g. '#/detail/A-032'
  actor        text not null default '',
  except_name  text not null default '',      -- admins with this owner name skip an '@admins' item
  task_id      uuid references public.tasks on delete set null,
  created_at   timestamptz not null default now()
);
create index inbox_ws_recipient_idx on public.inbox (workspace_id, recipient, created_at desc);

create table public.devices (
  token        text primary key,
  user_id      uuid not null references auth.users on delete cascade,
  workspace_id uuid not null references public.workspaces on delete cascade,
  platform     text not null check (platform in ('web', 'android', 'ios')),
  app_url      text not null default '',
  updated_at   timestamptz not null default now()
);

-- ───────────── Helper functions (security definer so policies can read members without recursion) ─────────────
create function public.is_member(ws uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from members where workspace_id = ws and user_id = auth.uid() and active);
$$;

create function public.is_admin(ws uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from members where workspace_id = ws and user_id = auth.uid() and active and role = 'admin');
$$;

create function public.my_owner(ws uuid) returns text
language sql stable security definer set search_path = public as $$
  select owner_name from members where workspace_id = ws and user_id = auth.uid() and active;
$$;

create function public.is_owner_name(ws uuid, n text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from owners where workspace_id = ws and name = n);
$$;

-- ───────────── Task triggers ─────────────
-- Assign A-NNN on insert; keep the counter ahead of any explicitly provided ID (e.g. from the sheet).
create function public.tasks_before_insert() returns trigger
language plpgsql security definer set search_path = public as $$
declare n integer; p text;
begin
  if new.aid is null or trim(new.aid) = '' then
    update workspaces set next_seq = next_seq + 1 where id = new.workspace_id
      returning next_seq - 1, id_prefix into n, p;
    new.aid := p || '-' || lpad(n::text, 3, '0');
  else
    n := nullif(regexp_replace(new.aid, '\D', '', 'g'), '')::integer;
    if n is not null then
      update workspaces set next_seq = greatest(next_seq, n + 1) where id = new.workspace_id;
    end if;
  end if;
  if auth.uid() is not null then
    new.updated_by := coalesce(my_owner(new.workspace_id), new.updated_by);
    new.updated_at := least(coalesce(new.updated_at, now()), now());
  end if;
  return new;
end $$;
create trigger tasks_before_insert before insert on public.tasks for each row execute function public.tasks_before_insert();

-- Last write wins: an older edit (e.g. queued offline) never overwrites a newer one.
-- Users cannot move tasks between workspaces or change the human ID.
create function public.tasks_before_update() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null then
    new.workspace_id := old.workspace_id;
    new.aid := old.aid;
    new.created_at := old.created_at;
    new.updated_by := coalesce(my_owner(old.workspace_id), new.updated_by);
    new.updated_at := least(coalesce(new.updated_at, now()), now());
  end if;
  if new.updated_at < old.updated_at then
    return null;  -- stale edit: keep the newer row
  end if;
  return new;
end $$;
create trigger tasks_before_update before update on public.tasks for each row execute function public.tasks_before_update();

-- Notification rules (same as the Sheets version):
--   assign  : new task / reassigned → new owner (unless they did it)
--   change  : someone else changed status, priority or due date → owner
--   blocked : moved to Blocked → admins
--   closed  : moved to Closed (update only) → admins
create function public.tasks_notify() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  actor text := coalesce(new.updated_by, '');
  label text := new.aid || ' · ' || new.title;
  pri   text[] := array['Highest', 'Medium', 'Low', 'Lowest', 'None'];
  mine  boolean := new.owner <> '' and lower(new.owner) <> lower(actor);
  ch    text[] := '{}';
  ex    text;
  lnk   text := '#/detail/' || new.aid;
begin
  if mine and (tg_op = 'INSERT' or old.owner is distinct from new.owner) then
    insert into inbox (workspace_id, recipient, kind, title, body, link, actor, task_id)
    values (new.workspace_id, new.owner, 'assign', 'New task for you',
            label || case when actor <> '' then E'\nAssigned by ' || actor else '' end, lnk, actor, new.id);
  elsif mine and tg_op = 'UPDATE' then
    if old.status is distinct from new.status then ch := ch || ('Status: ' || old.status || ' → ' || new.status); end if;
    if old.priority is distinct from new.priority then ch := ch || ('Priority: ' || pri[old.priority + 1] || ' → ' || pri[new.priority + 1]); end if;
    if old.due is distinct from new.due then
      ch := ch || ('Due: ' || coalesce(old.due::text, 'none') || ' → ' || coalesce(new.due::text, 'none'));
    end if;
    if array_length(ch, 1) > 0 then
      insert into inbox (workspace_id, recipient, kind, title, body, link, actor, task_id)
      values (new.workspace_id, new.owner, 'change', actor || ' updated your task',
              label || E'\n' || array_to_string(ch, ' · '), lnk, actor, new.id);
    end if;
  end if;
  ex := case when mine then new.owner else '' end;
  if new.status = 'Blocked' and (tg_op = 'INSERT' or old.status <> 'Blocked') then
    insert into inbox (workspace_id, recipient, kind, title, body, link, actor, except_name, task_id)
    values (new.workspace_id, '@admins', 'blocked', 'Task blocked',
            label || E'\nOwner: ' || coalesce(nullif(new.owner, ''), '—') || case when actor <> '' then ' · by ' || actor else '' end,
            lnk, actor, ex, new.id);
  end if;
  if tg_op = 'UPDATE' and new.status = 'Closed' and old.status <> 'Closed' then
    insert into inbox (workspace_id, recipient, kind, title, body, link, actor, except_name, task_id)
    values (new.workspace_id, '@admins', 'closed', 'Task closed',
            label || E'\nOwner: ' || coalesce(nullif(new.owner, ''), '—') || case when actor <> '' then ' · by ' || actor else '' end,
            lnk, actor, ex, new.id);
  end if;
  return null;
end $$;
create trigger tasks_notify after insert or update on public.tasks for each row execute function public.tasks_notify();

-- ───────────── Device registration (a token moves to whoever registers it last) ─────────────
create function public.register_device(p_token text, p_workspace uuid, p_platform text, p_app_url text default '')
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_member(p_workspace) then raise exception 'not a member of this workspace'; end if;
  insert into devices (token, user_id, workspace_id, platform, app_url, updated_at)
  values (p_token, auth.uid(), p_workspace, p_platform, coalesce(p_app_url, ''), now())
  on conflict (token) do update set user_id = excluded.user_id, workspace_id = excluded.workspace_id,
    platform = excluded.platform, app_url = excluded.app_url, updated_at = now();
end $$;

create function public.unregister_device(p_token text) returns void
language sql security definer set search_path = public as $$
  delete from devices where token = p_token and user_id = auth.uid();
$$;

-- ───────────── Row-level security ─────────────
alter table public.workspaces enable row level security;
alter table public.owners     enable row level security;
alter table public.members    enable row level security;
alter table public.tasks      enable row level security;
alter table public.inbox      enable row level security;
alter table public.devices    enable row level security;

create policy "members read their workspace" on public.workspaces for select using (is_member(id));

create policy "members read owners"  on public.owners for select using (is_member(workspace_id));
create policy "admins add owners"    on public.owners for insert with check (is_admin(workspace_id));
create policy "admins edit owners"   on public.owners for update using (is_admin(workspace_id)) with check (is_admin(workspace_id));
create policy "admins delete owners" on public.owners for delete using (is_admin(workspace_id));

-- Members see themselves; admins see everyone. Accounts are created/changed only by the admin-users function.
create policy "read self or as admin" on public.members for select using (user_id = auth.uid() or is_admin(workspace_id));

create policy "read own or as admin" on public.tasks for select
  using (is_admin(workspace_id) or owner = my_owner(workspace_id));
create policy "create tasks" on public.tasks for insert
  with check (is_admin(workspace_id) or (is_member(workspace_id) and is_owner_name(workspace_id, owner)));
create policy "edit own or as admin" on public.tasks for update
  using (is_admin(workspace_id) or owner = my_owner(workspace_id))
  with check (is_admin(workspace_id) or (is_member(workspace_id) and is_owner_name(workspace_id, owner)));
create policy "admins delete tasks" on public.tasks for delete using (is_admin(workspace_id));

create policy "read my notifications" on public.inbox for select using (
  recipient = my_owner(workspace_id)
  or (recipient = '@admins' and is_admin(workspace_id)
      and actor is distinct from my_owner(workspace_id) and except_name is distinct from my_owner(workspace_id))
);

create policy "read own devices" on public.devices for select using (user_id = auth.uid());

-- Only signed-in users get table access; anonymous visitors get nothing.
revoke all on public.workspaces, public.owners, public.members, public.tasks, public.inbox, public.devices from anon;
revoke execute on function public.register_device(text, uuid, text, text), public.unregister_device(text) from anon, public;
grant execute on function public.register_device(text, uuid, text, text), public.unregister_device(text) to authenticated;

-- Live updates for the app.
alter publication supabase_realtime add table public.tasks, public.inbox;
