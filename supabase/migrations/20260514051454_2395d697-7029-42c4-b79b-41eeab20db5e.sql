
-- Roles enum + user_roles table
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can view own roles"
on public.user_roles for select
to authenticated
using (auth.uid() = user_id);

create policy "Admins can view all roles"
on public.user_roles for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Registrations table
create type public.registration_type as enum ('Participant', 'Volunteer');

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  type registration_type not null,
  full_name text not null,
  email text not null,
  phone text,
  organization text,
  team_or_department text,
  idea_title text,
  idea_description text,
  preferred_roles text[],
  availability_notes text,
  created_at timestamptz not null default now()
);

alter table public.registrations enable row level security;

-- Anyone (anon + authenticated) may submit
create policy "Anyone can submit a registration"
on public.registrations for insert
to anon, authenticated
with check (true);

-- Only admins can read
create policy "Admins can view all registrations"
on public.registrations for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update registrations"
on public.registrations for update
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete registrations"
on public.registrations for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create index registrations_type_idx on public.registrations(type);
create index registrations_created_at_idx on public.registrations(created_at desc);
