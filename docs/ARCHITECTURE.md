# Phase 1 Architecture

## Architecture Explanation

SurgeVector Hackathon 2026 uses a focused Next.js 15 App Router application backed by Supabase. The foundation keeps UI, feature ownership, validation, services, and database access separate without introducing future-phase infrastructure.

The app is organized around Phase 1 features:
- `landing` for the public-facing entry experience.
- `registration` for team registration and registration editing.
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
  features/
    admin/
    gamification/
    landing/
    mentors/
    registration/
    volunteers/
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
    mentor.ts
    registration.ts
    volunteer.ts
supabase/
  migrations/
    001_phase_1_initial_schema.sql
```

## Route Structure

| Route | Purpose |
| --- | --- |
| `/` | Landing foundation and Phase 1 route map |
| `/register/team` | Team registration foundation |
| `/register/volunteer` | Volunteer registration foundation |
| `/registrations/[registrationId]/edit` | Registration editing foundation |
| `/admin` | Admin dashboard foundation |
| `/admin/mentors` | Mentor management foundation |

## Database Schema

The initial migration defines:
- `users`
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
- Team member count is enforced at a maximum of 3 active members.
- App validation enforces minimum 1 team member.
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
| `supabase/migrations/001_phase_1_initial_schema.sql` | Phase 1 PostgreSQL schema |

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
- `RoutePlaceholder`
- `FadeIn`

Recommended next primitives:
- `Input`
- `Textarea`
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
4. Apply `supabase/migrations/001_phase_1_initial_schema.sql`.
5. Run `npm run dev`.
6. Run `npm run lint` and `npm run typecheck` before opening a PR.

## Suggested Implementation Order

1. Finalize project setup and Supabase connection.
2. Build polished landing page.
3. Apply and verify Supabase schema.
4. Implement team registration with React Hook Form and Zod.
5. Implement volunteer registration.
6. Build admin dashboard summary cards and tables.
7. Add mentor management and manual assignment controls.
8. Add registration editing with audit log writes.
9. Add simple gamification and leaderboard views.
10. Add basic analytics views.
