# Phase 1 Architecture

## Architecture Explanation

SurgeVector Hackathon 2026 uses a focused Next.js 15 App Router application backed by Supabase. The foundation keeps UI, feature ownership, validation, services, and database access separate without introducing future-phase infrastructure.

The app is organized around Phase 1 features:

- `landing` for the public-facing entry experience.
- `registration` for idea intake, approved team registration, and registration editing.
- `volunteers` for volunteer signups and coordination views.
- `mentors` for mentor profiles, capacity, availability, and reassignment controls.
- `admin` for dashboard composition and operational actions.
- `gamification` for participation points, badges, leaderboard entries, and completion progress.

Business logic should live in `src/services` or feature-local server actions when they are added. Shared schemas live in `src/validations`, shared domain types live in `src/types`, and Supabase clients live under `src/lib/supabase`.

## Folder Structure Tree

```text
src/
  app/
    (dashboard)/
      admin/
        mentors/
          page.tsx
        page.tsx
    (marketing)/
      page.tsx
    registrations/
      [registrationId]/
        edit/
          page.tsx
    register/
      idea/
        page.tsx
      team/
        page.tsx
      volunteer/
        page.tsx
    globals.css
    layout.tsx
  components/
    layout/
      route-placeholder.tsx
    motion/
      fade-in.tsx
    ui/
      button.tsx
      card.tsx
      input.tsx
      textarea.tsx
  features/
    admin/
      actions/
      components/
      queries/
    gamification/
    landing/
    mentors/
    registration/
      actions/
      components/
    volunteers/
      actions/
      components/
  hooks/
    use-media-query.ts
  lib/
    supabase/
      client.ts
      middleware.ts
      server.ts
    constants.ts
    env.ts
    utils.ts
  services/
  types/
    database.ts
  utils/
    format.ts
  validations/
    admin.ts
    mentor.ts
    registration.ts
    volunteer.ts
supabase/
  migrations/
    001_phase_1_initial_schema.sql
    002_idea_first_registration_flow.sql
```

## Route Structure

| Route | Purpose |
| --- | --- |
| `/` | SurgeVector Hackathon landing page with event details and Phase 1 CTAs |
| `/register/idea` | Participant idea submission before review |
| `/register/team` | Approved-idea team registration |
| `/register/volunteer` | Volunteer registration for contact details, preferred roles, and availability notes |
| `/registrations/[registrationId]/edit` | Registration editing foundation |
| `/admin` | Organizer idea review dashboard for approving or rejecting submitted ideas |
| `/admin/mentors` | Mentor management foundation |

## Database Schema

The initial migrations define:

- `users`
- `idea_submissions`
- `teams`
- `team_members`
- `mentors`
- `mentor_assignments`
- `volunteer_registrations`
- `themes`
- `achievements`
- `leaderboard_entries`
- `audit_logs`

All operational tables use UUID primary keys and timestamps. Soft delete columns are included where records may need to remain auditable. Audit logs are append-only and record actor, entity, action, before state, after state, and metadata.

Key Phase 1 constraints:

- Participants submit ideas before team creation.
- Team registration requires an approved idea submission.
- Organizer review updates `idea_submissions.status`, `reviewed_at`, and `review_notes`, then writes an `audit_logs` row for approval or rejection.
- Team member count is enforced at a maximum of 3 active members.
- App validation enforces minimum 1 team member.
- Volunteer registration inserts a `submitted` volunteer row and audit log only; assignment, scheduling, shifts, realtime coordination, and approval workflows stay out of scope.
- Mentor capacity is modeled with `capacity`, `current_team_count`, and `is_available`.
- Manual mentor override support is modeled through `mentor_assignments.override_reason`.
- Simple gamification is modeled through `participation_points`, `achievements`, and `leaderboard_entries`.

## Theme Configuration

Tailwind CSS is configured through `src/app/globals.css` using a CSS-first theme. The palette is intentionally limited to orange, black, white, muted glass surfaces, and accessible focus rings.

Reusable visual rules:

- Use black backgrounds with controlled orange gradients.
- Use `bg-card/80`, `border-border`, and `backdrop-blur-xl` for glass surfaces.
- Keep motion subtle and use `FadeIn` for short entrance transitions.
- Prefer accessible focus rings and semantic landmarks.

## Environment Variables

Required:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Server-only:

- `SUPABASE_SERVICE_ROLE_KEY`

Optional for Phase 1 notifications:

- `EMAIL_FROM`

## Supabase Integration Structure

| File | Responsibility |
| --- | --- |
| `src/lib/supabase/client.ts` | Browser Supabase client |
| `src/lib/supabase/server.ts` | Server Component and server action client |
| `src/lib/supabase/middleware.ts` | Session refresh helper, not activated until auth routes need it |
| `src/lib/env.ts` | Zod-backed environment validation |
| `src/features/admin/actions/idea-review-actions.ts` | Service-role idea approval/rejection action with audit logging |
| `src/features/admin/queries/idea-review-queries.ts` | Service-role submitted idea list query for the organizer dashboard |
| `src/features/volunteers/actions/volunteer-registration-actions.ts` | Service-role volunteer registration action with audit logging |
| `supabase/migrations/001_phase_1_initial_schema.sql` | Phase 1 foundation PostgreSQL schema |
| `supabase/migrations/002_idea_first_registration_flow.sql` | Participant idea intake and approved team linkage |

## Dependency List

Runtime:

- Next.js 15
- React
- Supabase JS and Supabase SSR helpers
- Framer Motion
- React Hook Form
- Zod and Hookform resolvers
- shadcn/ui-compatible primitives: class variance authority, clsx, tailwind-merge
- Lucide React icons

Development:

- TypeScript
- ESLint with Next config
- Tailwind CSS
- PostCSS and Tailwind PostCSS plugin

## Recommended Reusable UI Primitives

Initial primitives:

- `Button`
- `Card`
- `CardHeader`
- `CardTitle`
- `CardDescription`
- `Input`
- `Textarea`
- `RoutePlaceholder`
- `FadeIn`

Recommended next primitives:

- `Select`
- `Checkbox`
- `Badge`
- `Tabs`
- `Dialog`
- `DataTable`
- `MetricCard`
- `EmptyState`
- `FormField`

## Feature-Based Architecture Plan

Each feature should follow this shape as implementation grows:

```text
src/features/<feature>/
  components/
  actions/
  queries/
  types.ts
  constants.ts
  README.md
```

Use this only when the feature needs the folder. Do not create abstractions before the flow has real complexity.

## Setup Steps

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Add Supabase URL and anon key.
4. Apply all migrations in `supabase/migrations/` in order.
5. Run `npm run dev`.
6. Run `npm run lint` and `npm run typecheck` before opening a PR.

## Suggested Implementation Order

1. Finalize project setup and Supabase connection.
2. Build polished landing page. Completed for SurgeVector Hackathon.
3. Apply and verify Supabase schema.
4. Implement idea submission and approved team registration with React Hook Form and Zod. Completed.
5. Build simple admin idea review with approval, rejection, review notes, and audit logs. Completed.
6. Implement volunteer registration. Completed.
7. Add mentor management and manual assignment controls.
8. Add registration editing with audit log writes.
9. Add simple gamification and leaderboard views.
10. Add basic analytics views.
