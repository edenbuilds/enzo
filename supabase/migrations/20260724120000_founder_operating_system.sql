create table public.catalog_versions (
  id text not null,
  version text not null,
  kind text not null check (kind in ('mind', 'approach', 'style', 'workroom')),
  body jsonb not null,
  evaluation_status text not null check (evaluation_status in ('research', 'reviewed', 'production')),
  created_at timestamptz not null default now(),
  primary key (id, version)
);

alter table public.artifact_revisions
  drop constraint artifact_revisions_artifact_type_check;
alter table public.artifact_revisions
  add constraint artifact_revisions_artifact_type_check
  check (artifact_type in (
    'decision-memo',
    'thirty-day-plan',
    'technical-design',
    'implementation-plan',
    'design-direction',
    'campaign-brief',
    'sales-playbook'
  ));

create table public.saved_playbooks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  workroom_id text not null,
  body jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workroom_runs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.company_models(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  workroom_id text not null,
  status text not null,
  body jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workroom_approval_events (
  id uuid primary key default gen_random_uuid(),
  workroom_run_id uuid not null references public.workroom_runs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  gate_type text not null,
  status text not null check (status in ('pending', 'approved', 'denied')),
  body jsonb not null,
  created_at timestamptz not null default now()
);

create table public.deployment_records (
  id uuid primary key default gen_random_uuid(),
  workroom_run_id uuid not null references public.workroom_runs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  environment text not null,
  status text not null check (status in ('planned', 'deployed', 'failed', 'rolled-back')),
  revision text not null,
  body jsonb not null,
  created_at timestamptz not null default now()
);

create index workroom_runs_user_id_idx on public.workroom_runs(user_id);
create index workroom_approval_events_run_idx on public.workroom_approval_events(workroom_run_id);
create index deployment_records_run_idx on public.deployment_records(workroom_run_id);

create trigger saved_playbooks_set_updated_at before update on public.saved_playbooks
for each row execute function public.set_updated_at();
create trigger workroom_runs_set_updated_at before update on public.workroom_runs
for each row execute function public.set_updated_at();

alter table public.catalog_versions enable row level security;
alter table public.saved_playbooks enable row level security;
alter table public.workroom_runs enable row level security;
alter table public.workroom_approval_events enable row level security;
alter table public.deployment_records enable row level security;

create policy "catalog_versions_read" on public.catalog_versions for select to anon, authenticated using (true);
create policy "saved_playbooks_own" on public.saved_playbooks for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "workroom_runs_own" on public.workroom_runs for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "workroom_approval_events_read_own" on public.workroom_approval_events for select to authenticated
using ((select auth.uid()) = user_id);
create policy "workroom_approval_events_insert_own" on public.workroom_approval_events for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy "deployment_records_read_own" on public.deployment_records for select to authenticated
using ((select auth.uid()) = user_id);
create policy "deployment_records_insert_own" on public.deployment_records for insert to authenticated
with check ((select auth.uid()) = user_id);

grant select on public.catalog_versions to anon, authenticated;
grant select, insert, update, delete on public.saved_playbooks, public.workroom_runs to authenticated;
grant select, insert on public.workroom_approval_events, public.deployment_records to authenticated;
