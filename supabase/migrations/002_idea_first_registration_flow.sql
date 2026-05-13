create table public.idea_submissions (
  id uuid primary key default gen_random_uuid(),
  participant_user_id uuid references public.users(id),
  participant_full_name text not null,
  participant_email text not null,
  organization public.organization_type not null,
  department text not null,
  idea_title text not null,
  problem_statement text not null,
  proposed_solution text not null,
  ai_usage text not null,
  status public.registration_status not null default 'submitted',
  submitted_at timestamptz not null default now(),
  reviewed_by uuid references public.users(id),
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.teams
  add column idea_submission_id uuid references public.idea_submissions(id);

create index idea_submissions_status_idx on public.idea_submissions(status)
  where deleted_at is null;
create index idea_submissions_participant_email_idx on public.idea_submissions(participant_email)
  where deleted_at is null;
create index teams_idea_submission_idx on public.teams(idea_submission_id)
  where deleted_at is null;

create trigger set_idea_submissions_updated_at before update on public.idea_submissions
  for each row execute function public.set_updated_at();

alter table public.idea_submissions enable row level security;
