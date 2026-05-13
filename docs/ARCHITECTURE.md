# Phase 1 Architecture

## Architecture Explanation

SurgeVector Hackathon 2026 uses a focused Next.js 15 App Router application backed by Supabase. The foundation keeps UI, feature ownership, validation, services, and database access separate without introducing future-phase infrastructure.

The app is organized around Phase 1 features:

- `landing` for the public-facing entry experience.
- `registration` for the register choice flow, participant timeline, idea intake, team registration, and registration editing.
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
    leaderboard/
      loading.tsx
      page.tsx
    register/
      participant/
        page.tsx
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
      queries/
    landing/
    mentors/
      actions/
      components/
      queries/
    registration/
      actions/
      components/
      queries/
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
| `/register` | Registration choice page for participant or volunteer paths |
| `/register/participant` | Participant timeline with idea submission and team registration actions |
| `/register/idea` | Individual participant idea submission before the May 22 noon cutoff |
| `/register/team` | Team captain registration for an unclaimed submitted or approved idea |
| `/register/volunteer` | Volunteer registration for contact details, preferred roles, and availability notes |
| `/leaderboard` | Simple leaderboard for team points, badges, and completion progress |
| `/registrations/[registrationId]/edit` | Edit an existing team registration and audit successful updates |
| `/admin` | Organizer idea review dashboard for approving or rejecting submitted ideas |
| `/admin/mentors` | Organizer mentor profile list and create form |

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

- Participants submit ideas under their own name before team creation.
- Team registration is separate from idea submission and is led by a captain / point of contact.
- Team registration claims an unclaimed submitted or approved idea through `teams.idea_submission_id`; claimed ideas are hidden from the available idea list.
- Before May 22, 2026 at 12:00 PM IST, only the original idea submitter can register a team for that idea by matching the captain email to the idea submitter email. After that cutoff, the remaining idea pool is open for team captains.
- Registration editing loads an existing non-deleted team, active team members, and linked idea context; successful updates write `audit_logs.before_state` and `audit_logs.after_state`.
- Organizer review updates `idea_submissions.status`, `reviewed_at`, and `review_notes`, then writes an `audit_logs` row for approval or rejection.
- Team member count is enforced at a maximum of 4 active members.
- App validation enforces minimum 1 team member.
- Volunteer registration inserts a `submitted` volunteer row and audit log only; assignment, scheduling, shifts, realtime coordination, and approval workflows stay out of scope.
- Mentor capacity is modeled with `capacity`, `current_team_count`, and `is_available`.
- Mentor management creates profiles in the existing `mentors` table and writes an `audit_logs` row after successful creation.
- Manual mentor override support is modeled through `mentor_assignments.override_reason`.
- Simple gamification is modeled through `participation_points`, `achievements`, and `leaderboard_entries`; `/leaderboard` reads these tables without realtime scoring or advanced ranking.

## Theme Configuration

Tailwind CSS is configured through `src/app/globals.css` using a CSS-first theme. The palette is intentionally limited to orange, black, white, muted glass surfaces, and accessible focus rings.

Reusable visual rules:

- The landing route should use a light cream or white event canvas with controlled orange gradients and black contrast text.
- Keep admin and registration pages simple and avoid redesigning them during landing-only visual refreshes.
- Use `bg-card/80`, `border-border`, and `backdrop-blur-xl` for shared glass surfaces; landing-specific surfaces can use translucent white or cream with soft orange borders.
- Structure landing content as roomy, screen-like sections with normal document scrolling; avoid CSS scroll snapping on the landing page because it can feel jumpy across full-height sections.
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
| `src/features/registration/actions/registration-actions.ts` | Idea submission, idea-claim team registration, and team registration edit actions with audit logging |
| `src/features/registration/queries/team-registration-queries.ts` | Service-role available idea list query for team registration |
| `src/features/registration/queries/registration-edit-queries.ts` | Service-role team registration edit lookup for team, member, and linked idea context |
| `src/features/gamification/queries/leaderboard-queries.ts` | Service-role leaderboard query for teams, leaderboard entries, and active achievements |
| `src/features/mentors/actions/mentor-actions.ts` | Service-role mentor profile creation action with audit logging |
| `src/features/mentors/queries/mentor-queries.ts` | Service-role mentor list query for organizer mentor management |
| `src/features/volunteers/actions/volunteer-registration-actions.ts` | Service-role volunteer registration action with audit logging |
| `supabase/migrations/001_phase_1_initial_schema.sql` | Phase 1 foundation PostgreSQL schema |
| `supabase/migrations/002_idea_first_registration_flow.sql` | Participant idea intake and team-to-idea linkage |

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
4. Implement idea submission and idea-claim team registration with React Hook Form and Zod. Completed.
5. Build simple admin idea review with approval, rejection, review notes, and audit logs. Completed.
6. Implement volunteer registration. Completed.
7. Add mentor management foundation. Completed for profile creation and listing; manual assignment controls remain later Phase 1 scope.
8. Add registration editing with audit log writes.
9. Add simple gamification and leaderboard views.
10. Add basic analytics views.
