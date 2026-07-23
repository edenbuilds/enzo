create extension if not exists pgcrypto;

create type public.project_status as enum ('draft', 'collecting', 'auditing', 'interview', 'complete');
create type public.job_status as enum ('queued', 'running', 'completed', 'failed');
create type public.evidence_kind as enum ('url', 'screenshot', 'pdf', 'repository', 'codebase-fact');

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  target_url text,
  status public.project_status not null default 'draft',
  evidence_revision integer not null default 0 check (evidence_revision >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.evidence_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind public.evidence_kind not null,
  title text not null,
  source_url text,
  content text check (char_length(content) <= 100000),
  storage_path text,
  revision integer not null check (revision >= 0),
  created_at timestamptz not null default now()
);

create table public.captures (
  id uuid primary key default gen_random_uuid(),
  evidence_id uuid not null references public.evidence_items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  viewport jsonb not null,
  title text not null,
  description text,
  headings jsonb not null default '[]'::jsonb,
  links jsonb not null default '[]'::jsonb,
  form_count integer not null default 0 check (form_count >= 0),
  screenshot_path text,
  captured_at timestamptz not null default now()
);

create table public.audit_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  idempotency_key text not null,
  status public.job_status not null default 'queued',
  findings jsonb not null default '[]'::jsonb,
  scorecard jsonb,
  opportunities jsonb not null default '[]'::jsonb,
  coverage_gaps jsonb not null default '[]'::jsonb,
  error text,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, idempotency_key)
);

create table public.answer_sets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  round_id text not null,
  answers jsonb not null,
  submitted_at timestamptz not null default now(),
  unique (project_id, round_id)
);

create table public.vision_briefs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id)
);

create table public.report_exports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  format text not null check (format in ('markdown', 'json', 'pdf')),
  status public.job_status not null default 'queued',
  storage_path text,
  created_at timestamptz not null default now()
);

create table public.share_links (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index evidence_items_project_id_idx on public.evidence_items(project_id);
create index audit_runs_project_id_idx on public.audit_runs(project_id);
create index captures_evidence_id_idx on public.captures(evidence_id);
create index share_links_project_id_idx on public.share_links(project_id);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_set_updated_at before update on public.projects
for each row execute function public.set_updated_at();

create trigger vision_briefs_set_updated_at before update on public.vision_briefs
for each row execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.evidence_items enable row level security;
alter table public.captures enable row level security;
alter table public.audit_runs enable row level security;
alter table public.answer_sets enable row level security;
alter table public.vision_briefs enable row level security;
alter table public.report_exports enable row level security;
alter table public.share_links enable row level security;

create policy "projects_select_own" on public.projects for select to authenticated
using ((select auth.uid()) = user_id);
create policy "projects_insert_own" on public.projects for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy "projects_update_own" on public.projects for update to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "projects_delete_own" on public.projects for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "evidence_select_own" on public.evidence_items for select to authenticated
using ((select auth.uid()) = user_id);
create policy "evidence_insert_own" on public.evidence_items for insert to authenticated
with check (
  (select auth.uid()) = user_id and
  exists (select 1 from public.projects p where p.id = project_id and p.user_id = (select auth.uid()))
);
create policy "evidence_update_own" on public.evidence_items for update to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "evidence_delete_own" on public.evidence_items for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "captures_select_own" on public.captures for select to authenticated using ((select auth.uid()) = user_id);
create policy "captures_insert_own" on public.captures for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "captures_update_own" on public.captures for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "captures_delete_own" on public.captures for delete to authenticated using ((select auth.uid()) = user_id);

create policy "audit_runs_select_own" on public.audit_runs for select to authenticated using ((select auth.uid()) = user_id);
create policy "audit_runs_insert_own" on public.audit_runs for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "audit_runs_update_own" on public.audit_runs for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "audit_runs_delete_own" on public.audit_runs for delete to authenticated using ((select auth.uid()) = user_id);

create policy "answer_sets_select_own" on public.answer_sets for select to authenticated using ((select auth.uid()) = user_id);
create policy "answer_sets_insert_own" on public.answer_sets for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "answer_sets_update_own" on public.answer_sets for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "answer_sets_delete_own" on public.answer_sets for delete to authenticated using ((select auth.uid()) = user_id);

create policy "vision_briefs_select_own" on public.vision_briefs for select to authenticated using ((select auth.uid()) = user_id);
create policy "vision_briefs_insert_own" on public.vision_briefs for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "vision_briefs_update_own" on public.vision_briefs for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "vision_briefs_delete_own" on public.vision_briefs for delete to authenticated using ((select auth.uid()) = user_id);

create policy "report_exports_select_own" on public.report_exports for select to authenticated using ((select auth.uid()) = user_id);
create policy "report_exports_insert_own" on public.report_exports for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "report_exports_update_own" on public.report_exports for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "report_exports_delete_own" on public.report_exports for delete to authenticated using ((select auth.uid()) = user_id);

create policy "share_links_select_own" on public.share_links for select to authenticated using ((select auth.uid()) = user_id);
create policy "share_links_insert_own" on public.share_links for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "share_links_update_own" on public.share_links for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "share_links_delete_own" on public.share_links for delete to authenticated using ((select auth.uid()) = user_id);

grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage on all sequences in schema public to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'evidence',
  'evidence',
  false,
  20971520,
  array['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
)
on conflict (id) do nothing;

create policy "evidence_objects_select_own" on storage.objects for select to authenticated
using (bucket_id = 'evidence' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "evidence_objects_insert_own" on storage.objects for insert to authenticated
with check (bucket_id = 'evidence' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "evidence_objects_update_own" on storage.objects for update to authenticated
using (bucket_id = 'evidence' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'evidence' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "evidence_objects_delete_own" on storage.objects for delete to authenticated
using (bucket_id = 'evidence' and (storage.foldername(name))[1] = (select auth.uid())::text);
