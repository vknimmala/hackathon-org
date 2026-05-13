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

## Open TODOs

- Add RLS policies when auth roles and ownership flows are implemented.
- Generate full Supabase TypeScript types after the Supabase project is created.
- Add focused tests after the first real form and server action are implemented.
