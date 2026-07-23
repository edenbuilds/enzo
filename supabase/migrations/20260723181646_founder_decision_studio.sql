create type public.decision_status as enum (
  'framing',
  'researching',
  'council-ready',
  'awaiting-founder',
  'decided',
  'reviewed'
);

create table public.founder_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  body jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.company_models (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.evidence_claims (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.company_models(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  classification text not null check (classification in ('verified', 'user-provided', 'researched', 'inferred', 'assumed', 'hypothetical', 'perspective-specific')),
  statement text not null,
  source_label text not null,
  freshness text not null check (freshness in ('current', 'dated', 'unknown')),
  confidence numeric(4,3) not null check (confidence between 0 and 1),
  citations jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.lens_versions (
  id text not null,
  version text not null,
  body jsonb not null,
  source_map jsonb not null default '[]'::jsonb,
  evaluation_status text not null check (evaluation_status in ('research', 'reviewed', 'production')),
  created_at timestamptz not null default now(),
  primary key (id, version)
);

create table public.decisions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.company_models(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  status public.decision_status not null default 'framing',
  reversibility text not null check (reversibility in ('reversible', 'costly-to-reverse', 'irreversible')),
  options jsonb not null,
  assumptions jsonb not null default '[]'::jsonb,
  success_metric text not null,
  deadline timestamptz not null,
  review_date timestamptz not null,
  final_option_id text,
  founder_rationale text,
  decision_snapshot jsonb,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.council_runs (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null references public.decisions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  idempotency_key text not null,
  body jsonb not null,
  created_at timestamptz not null default now(),
  sealed_at timestamptz not null,
  unique (user_id, idempotency_key)
);

create table public.artifact_revisions (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null references public.decisions(id) on delete cascade,
  company_id uuid not null references public.company_models(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  artifact_key text not null,
  artifact_type text not null check (artifact_type in ('decision-memo', 'thirty-day-plan')),
  revision integer not null check (revision > 0),
  title text not null,
  body text not null,
  citations jsonb not null default '[]'::jsonb,
  status text not null check (status in ('draft', 'final')),
  created_at timestamptz not null default now(),
  unique (user_id, artifact_key, revision)
);

create table public.experiments (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null references public.decisions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body jsonb not null,
  status text not null check (status in ('planned', 'running', 'complete')),
  review_date timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.outcome_reviews (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null unique references public.decisions(id) on delete cascade,
  experiment_id uuid not null references public.experiments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body jsonb not null,
  reviewed_at timestamptz not null default now()
);

create table public.visual_references (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.company_models(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  source_url text,
  storage_path text,
  accessed_at timestamptz not null,
  relevance text not null,
  element text not null,
  do_not_copy text not null,
  applicable_area text not null,
  confidence numeric(4,3) not null check (confidence between 0 and 1),
  rights_status text not null,
  created_at timestamptz not null default now()
);

create table public.provenance_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.company_models(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  source_url text not null,
  source_commit text,
  license_spdx text,
  disposition text not null,
  reviewed_at timestamptz not null default now(),
  check ((company_id is null and user_id is null) or (company_id is not null and user_id is not null))
);

create index decisions_company_id_idx on public.decisions(company_id);
create index council_runs_decision_id_idx on public.council_runs(decision_id);
create index artifact_revisions_decision_id_idx on public.artifact_revisions(decision_id);
create index evidence_claims_company_id_idx on public.evidence_claims(company_id);

create trigger founder_profiles_set_updated_at before update on public.founder_profiles
for each row execute function public.set_updated_at();
create trigger company_models_set_updated_at before update on public.company_models
for each row execute function public.set_updated_at();
create trigger decisions_set_updated_at before update on public.decisions
for each row execute function public.set_updated_at();
create trigger experiments_set_updated_at before update on public.experiments
for each row execute function public.set_updated_at();

create function public.prevent_decided_decision_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.status in ('decided', 'reviewed') and (
    new.question is distinct from old.question or
    new.options is distinct from old.options or
    new.assumptions is distinct from old.assumptions or
    new.final_option_id is distinct from old.final_option_id or
    new.founder_rationale is distinct from old.founder_rationale or
    new.decision_snapshot is distinct from old.decision_snapshot
  ) then
    raise exception 'decided decision snapshots are immutable';
  end if;
  return new;
end;
$$;

create trigger decisions_prevent_snapshot_mutation before update on public.decisions
for each row execute function public.prevent_decided_decision_mutation();

alter table public.founder_profiles enable row level security;
alter table public.company_models enable row level security;
alter table public.evidence_claims enable row level security;
alter table public.lens_versions enable row level security;
alter table public.decisions enable row level security;
alter table public.council_runs enable row level security;
alter table public.artifact_revisions enable row level security;
alter table public.experiments enable row level security;
alter table public.outcome_reviews enable row level security;
alter table public.visual_references enable row level security;
alter table public.provenance_records enable row level security;

create policy "lens_versions_read" on public.lens_versions for select to anon, authenticated using (true);
create policy "public_provenance_read" on public.provenance_records for select to anon, authenticated using (user_id is null);

create policy "founder_profiles_own" on public.founder_profiles for all to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "company_models_own" on public.company_models for all to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "evidence_claims_own" on public.evidence_claims for all to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "decisions_own" on public.decisions for all to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "council_runs_read_own" on public.council_runs for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "council_runs_insert_own" on public.council_runs for insert to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "artifact_revisions_read_own" on public.artifact_revisions for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "artifact_revisions_insert_own" on public.artifact_revisions for insert to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "experiments_own" on public.experiments for all to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "outcome_reviews_read_own" on public.outcome_reviews for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "outcome_reviews_insert_own" on public.outcome_reviews for insert to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "visual_references_own" on public.visual_references for all to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "private_provenance_own" on public.provenance_records for all to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

grant select, insert, update, delete on public.founder_profiles, public.company_models, public.evidence_claims,
  public.decisions, public.experiments, public.visual_references to authenticated;
grant select, insert on public.council_runs, public.artifact_revisions, public.outcome_reviews to authenticated;
grant select on public.lens_versions to anon, authenticated;
grant select on public.provenance_records to anon, authenticated;
grant insert, update, delete on public.provenance_records to authenticated;
