create extension if not exists "pgcrypto";

create type public.user_role as enum ('participant', 'volunteer', 'mentor', 'admin');
create type public.organization_type as enum ('surgevector', 'taxilla');
create type public.registration_status as enum ('draft', 'submitted', 'approved', 'rejected');
create type public.mentor_assignment_status as enum ('active', 'reassigned', 'removed');
create type public.volunteer_status as enum ('submitted', 'approved', 'waitlisted', 'declined');
create type public.audit_action as enum (
  'created',
  'updated',
  'deleted',
  'submitted',
  'approved',
  'rejected',
  'assigned',
  'reassigned'
);

create table public.sv_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.user_role not null default 'participant',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.sv_themes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  is_active boolean not null default true,
  created_by uuid references public.sv_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.sv_teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization public.organization_type not null,
  theme_id uuid references public.sv_themes(id),
  project_summary text,
  status public.registration_status not null default 'draft',
  submitted_by uuid references public.sv_users(id),
  mentor_id uuid,
  participation_points integer not null default 0 check (participation_points >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  submitted_at timestamptz,
  deleted_at timestamptz
);

create table public.sv_team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.sv_teams(id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null,
  is_primary_contact boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (team_id, email)
);

create table public.sv_mentors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.sv_users(id),
  full_name text not null,
  email text not null unique,
  expertise text[] not null default '{}',
  capacity integer not null default 3 check (capacity > 0),
  current_team_count integer not null default 0 check (current_team_count >= 0),
  is_available boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (current_team_count <= capacity)
);

alter table public.sv_teams
  add constraint sv_teams_mentor_id_fkey foreign key (mentor_id) references public.sv_mentors(id);

create table public.sv_mentor_assignments (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.sv_teams(id),
  mentor_id uuid not null references public.sv_mentors(id),
  assigned_by uuid references public.sv_users(id),
  status public.mentor_assignment_status not null default 'active',
  override_reason text,
  assigned_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.sv_volunteer_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.sv_users(id),
  full_name text not null,
  email text not null,
  department text not null,
  preferred_roles text[] not null default '{}',
  availability_notes text,
  status public.volunteer_status not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.sv_achievements (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  points integer not null default 0 check (points >= 0),
  badge_icon text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.sv_leaderboard_entries (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.sv_teams(id),
  total_points integer not null default 0 check (total_points >= 0),
  badges jsonb not null default '[]'::jsonb,
  completion_progress integer not null default 0 check (completion_progress between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (team_id)
);

create table public.sv_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.sv_users(id),
  entity_table text not null,
  entity_id uuid not null,
  action public.audit_action not null,
  before_state jsonb,
  after_state jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index sv_users_role_idx on public.sv_users(role) where deleted_at is null;
create index sv_teams_status_idx on public.sv_teams(status) where deleted_at is null;
create index sv_teams_mentor_idx on public.sv_teams(mentor_id) where deleted_at is null;
create index sv_team_members_team_idx on public.sv_team_members(team_id) where deleted_at is null;
create index sv_mentor_assignments_team_idx on public.sv_mentor_assignments(team_id) where deleted_at is null;
create index sv_mentor_assignments_mentor_idx on public.sv_mentor_assignments(mentor_id) where deleted_at is null;
create index sv_volunteer_registrations_status_idx on public.sv_volunteer_registrations(status) where deleted_at is null;
create index sv_leaderboard_entries_points_idx on public.sv_leaderboard_entries(total_points desc) where deleted_at is null;
create index sv_audit_logs_entity_idx on public.sv_audit_logs(entity_table, entity_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.enforce_team_member_limit()
returns trigger
language plpgsql
as $$
declare
  active_member_count integer;
begin
  select count(*)
  into active_member_count
  from public.sv_team_members
  where team_id = new.team_id
    and deleted_at is null
    and (tg_op = 'INSERT' or id <> new.id);

  if active_member_count >= 4 then
    raise exception 'A team can have at most 4 active members';
  end if;

  return new;
end;
$$;

create trigger set_sv_users_updated_at before update on public.sv_users
  for each row execute function public.set_updated_at();
create trigger set_sv_themes_updated_at before update on public.sv_themes
  for each row execute function public.set_updated_at();
create trigger set_sv_teams_updated_at before update on public.sv_teams
  for each row execute function public.set_updated_at();
create trigger set_sv_team_members_updated_at before update on public.sv_team_members
  for each row execute function public.set_updated_at();
create trigger set_sv_mentors_updated_at before update on public.sv_mentors
  for each row execute function public.set_updated_at();
create trigger set_sv_mentor_assignments_updated_at before update on public.sv_mentor_assignments
  for each row execute function public.set_updated_at();
create trigger set_sv_volunteer_registrations_updated_at before update on public.sv_volunteer_registrations
  for each row execute function public.set_updated_at();
create trigger set_sv_achievements_updated_at before update on public.sv_achievements
  for each row execute function public.set_updated_at();
create trigger set_sv_leaderboard_entries_updated_at before update on public.sv_leaderboard_entries
  for each row execute function public.set_updated_at();

create trigger enforce_sv_team_member_limit before insert or update of team_id, deleted_at on public.sv_team_members
  for each row execute function public.enforce_team_member_limit();

alter table public.sv_users enable row level security;
alter table public.sv_themes enable row level security;
alter table public.sv_teams enable row level security;
alter table public.sv_team_members enable row level security;
alter table public.sv_mentors enable row level security;
alter table public.sv_mentor_assignments enable row level security;
alter table public.sv_volunteer_registrations enable row level security;
alter table public.sv_achievements enable row level security;
alter table public.sv_leaderboard_entries enable row level security;
alter table public.sv_audit_logs enable row level security;
