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

### Scenario: Render polished SurgeVector Hackathon landing page

Initial state:

- Next.js loads `src/app/layout.tsx`.
- Global theme tokens load from `src/app/globals.css`.
- Route `/` resolves to `src/app/(marketing)/page.tsx`.
- Shared primitives `Button`, `Card`, and `FadeIn` are available.

Execution:

- Landing route renders static hero content for SurgeVector Hackathon.
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
- P3: App metadata should use the SurgeVector Hackathon name so the browser title and event copy stay aligned.

## Paper-Based Revised Registration Flow Simulation

Date: 2026-05-13

### Scenario: Render actual SurgeVector Hackathon landing page

Initial state:

- Next.js loads `src/app/layout.tsx`.
- Route `/` resolves to `src/app/(marketing)/page.tsx`.
- Shared `Button`, `Card`, and `FadeIn` primitives are available.

Execution:

- Landing route renders hackathon-specific details for SurgeVector and Taxila teams instead of describing the website as a product.
- Primary CTA routes participants to `/register/idea`.
- Secondary CTAs route volunteers to `/register/volunteer` and coordinators to `/admin`.
- The page explains the Phase 1 event flow: register yourself, submit an AI idea, receive review, form a team after approval, and then receive mentor coordination.

Object state:

- No Supabase client is created during static landing render.
- Route constants stay module-local and reusable only within the landing route.

Findings:

- P0: None.
- P1: Branding must use SurgeVector Hackathon across metadata, landing copy, and docs.
- P2: Landing copy should present event information and participant actions, not a generic product/platform explanation.

### Scenario: Participant submits an idea

Initial state:

- User opens `/register/idea`.
- Client form initializes with React Hook Form and `ideaSubmissionSchema`.
- Supabase writes happen only inside a server action.

Execution:

- User enters participant details, organization, department, idea title, problem statement, proposed solution, and AI usage notes.
- Client-side Zod validation rejects missing or too-short fields before calling the server action.
- Server action validates the same payload again.
- Server action inserts one `idea_submissions` row with status `submitted`.
- Server action writes an audit log entry after a successful insert.
- UI displays a success message telling the participant that review happens before team creation.

Object state:

- Form state moves from idle to submitting to success or error.
- Database state gains one submitted idea and one audit log entry.
- No team, mentor assignment, leaderboard entry, or realtime state is created.

Findings:

- P0: None.
- P1: If Supabase service configuration is missing, the action must fail with a friendly error instead of crashing the route.
- P2: Review remains a simple admin/panel status flow for Phase 1; do not introduce super-admin hierarchy or advanced judging workflows.

### Scenario: Approved idea proceeds to team registration

Initial state:

- A submitted idea has been reviewed and marked `approved` by an admin or panel process.
- User opens `/register/team`.
- Client form initializes with React Hook Form and `teamRegistrationSchema`.

Execution:

- User enters the approved idea ID, team name, organization, and 1 to 3 members.
- Client validation enforces at least one member and at most three members.
- Server action revalidates the payload.
- Server action checks that the referenced idea exists and has status `approved`.
- Server action creates the team and team member rows, then writes an audit log entry.
- UI displays success with a note that mentor assignment comes after team creation.

Object state:

- Database state gains one team linked to the approved idea.
- Database state gains one to three team members.
- No mentor assignment is automatically created.

Findings:

- P0: None.
- P1: Team creation must be blocked when the idea is not approved.
- P2: The database trigger still enforces the maximum of three active members, while app validation enforces minimum one.

### Scenario: Invalid or premature team registration

Initial state:

- User opens `/register/team`.
- The idea ID is missing, malformed, not found, or points to an idea with status `submitted`, `draft`, or `rejected`.

Execution:

- Malformed IDs fail Zod validation.
- Existing but unapproved ideas fail the server-side approved-status check.
- More than three members fail client and server validation before database writes.

Object state:

- No team rows are inserted.
- No team member rows are inserted.
- Existing idea submission state is unchanged.

Findings:

- P0: None.
- P1: Server-side validation must be treated as authoritative because client validation can be bypassed.
- P3: Admin review UI can be built in the admin dashboard phase; for now, schema and copy should make the expected review state clear.

## Open TODOs

- Add RLS policies when auth roles and ownership flows are implemented.
- Generate full Supabase TypeScript types after the Supabase project is created.
- Add focused tests after the first real form and server action are implemented.
