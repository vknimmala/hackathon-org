# Issues And TODOs

## Paper-Based Foundation Simulation

Date: 2026-05-13

### Scenario: Open landing route

Initial state:

- Next.js loads `src/app/layout.tsx`.
- Global theme tokens load from `src/app/globals.css`.
- Route `/` resolves to `src/app/(marketing)/page.tsx`.

Execution:

- Landing route renders static foundation content and links.
- Shared `Button` and `Card` primitives render without Supabase calls.
- No authentication or database state is required.

Findings:

- No runtime data dependency on missing Supabase environment variables for placeholder routes.

### Scenario: Open registration placeholder

Initial state:

- Route `/register/team` resolves to the placeholder route.
- Route imports `RoutePlaceholder`.

Execution:

- Placeholder renders static copy and a link back to `/`.
- Registration schemas remain available in `src/validations/registration.ts` for the later form implementation.

Findings:

- Team size constraints are represented in Zod with `min(1)` and `max(3)`.
- Database trigger enforces only the maximum active team member count; minimum is enforced by application validation.

### Scenario: Supabase client creation

Initial state:

- Supabase helpers are not imported by placeholder routes.
- Environment values are defined in `.env.local` before feature wiring.

Execution:

- Browser client validates public Supabase env values.
- Server client validates public and optional server env values.

Findings:

- No active middleware is registered yet, avoiding accidental env failures before auth routes are implemented.

## Paper-Based Landing Page Simulation

Date: 2026-05-13

### Scenario: Render polished HackVector landing page

Initial state:

- Next.js loads `src/app/layout.tsx`.
- Global theme tokens load from `src/app/globals.css`.
- Route `/` resolves to `src/app/(marketing)/page.tsx`.
- Shared primitives `Button`, `Card`, and `FadeIn` are available.

Execution:

- Landing route renders static hero content for HackVector by SurgeVector.
- Module-level arrays provide metrics, Phase 1 scope cards, workflow steps, and route links.
- `FadeIn` applies subtle client-side entrance animation to presentational sections.
- Primary CTA links to `/register/team`; secondary CTA links to `/register/volunteer`.
- Supporting links route to `/admin` and `/admin/mentors`.

Object state:

- No Supabase client is created.
- No form state, auth session, or database records are read or written.
- Existing placeholder routes remain the destination until registration and admin flows are implemented.

Findings:

- P0: None.
- P1: None.
- P2: Landing copy must stay limited to Phase 1 registration operations and avoid implying advanced judging, realtime systems, copilots, SSO, or complex infrastructure.
- P3: App metadata should use the HackVector name so the browser title and product copy stay aligned.

## Open TODOs

- Add RLS policies when auth roles and ownership flows are implemented.
- Generate full Supabase TypeScript types after the Supabase project is created.
- Add focused tests after the first real form and server action are implemented.
