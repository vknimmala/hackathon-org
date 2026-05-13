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

- Landing route renders hackathon-specific details for SurgeVector and Taxilla teams instead of describing the website as a product.
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

- User enters the approved idea ID, team name, organization, and one to four members.
- Client validation enforces at least one member and at most four members.
- Server action revalidates the payload.
- Server action checks that the referenced idea exists and has status `approved`.
- Server action creates the team and team member rows, then writes an audit log entry.
- UI displays success with a note that mentor assignment comes after team creation.

Object state:

- Database state gains one team linked to the approved idea.
- Database state gains one to four team members.
- No mentor assignment is automatically created.

Findings:

- P0: None.
- P1: Team creation must be blocked when the idea is not approved.
- P2: The database trigger still enforces the maximum of four active members, while app validation enforces minimum one.

### Scenario: Invalid or premature team registration

Initial state:

- User opens `/register/team`.
- The idea ID is missing, malformed, not found, or points to an idea with status `submitted`, `draft`, or `rejected`.

Execution:

- Malformed IDs fail Zod validation.
- Existing but unapproved ideas fail the server-side approved-status check.
- More than four members fail client and server validation before database writes.

Object state:

- No team rows are inserted.
- No team member rows are inserted.
- Existing idea submission state is unchanged.

Findings:

- P0: None.
- P1: Server-side validation must be treated as authoritative because client validation can be bypassed.
- P3: Admin review UI can be built in the admin dashboard phase; for now, schema and copy should make the expected review state clear.

## Paper-Based Admin Idea Review Simulation

Date: 2026-05-13

### Scenario: Admin opens idea review dashboard

Initial state:

- Submitted idea rows exist in `idea_submissions`.
- Route `/admin` resolves to `src/app/(dashboard)/admin/page.tsx`.
- No Supabase auth screens or admin session flow exist yet.
- The minimal Phase 1 assumption is that `/admin` is used by internal organizers in a controlled environment until Supabase Auth and RLS policies are hardened.

Execution:

- The admin page creates a server-side Supabase service-role client.
- The page queries non-deleted `idea_submissions` rows ordered by newest `submitted_at`.
- Each row renders participant name, email, organization, department, idea title, problem statement, proposed solution, AI usage, current status, submitted date, and any existing review notes.
- No scoring, judging rubric, voting, realtime updates, panel hierarchy, or super-admin role is created.

Object state:

- Database state is read-only during dashboard render.
- If Supabase service configuration is missing, the dashboard should show an operational error instead of crashing the route.

Findings:

- P0: None.
- P1: Admin dashboard reads use the service-role client until the ownership/admin model is ready; this must remain documented and scoped.
- P2: The list can be card-based for Phase 1 instead of adding a reusable data table abstraction before needed.

### Scenario: Admin approves a submitted idea

Initial state:

- One `idea_submissions` row has status `submitted`.
- Admin enters optional review notes and selects approve.

Execution:

- Client form posts `ideaId`, `reviewStatus=approved`, and optional `reviewNotes` to a server action.
- Server action validates the idea ID and status payload.
- Server action fetches the existing idea row as `before_state`.
- Server action updates `status` to `approved`, sets `reviewed_at` to the current timestamp, and stores trimmed `review_notes` or `null`.
- Server action inserts an `audit_logs` row with action `approved`, the previous idea state, the updated idea state, and metadata identifying the admin idea review source.
- `/admin` is revalidated so the new status appears.

Object state:

- Idea state changes from `submitted` to `approved`.
- `reviewed_at` changes from `null` to an ISO timestamp.
- `review_notes` changes from `null` or prior text to the latest submitted notes.
- Audit state gains one append-only log entry.
- Team state remains unchanged until a participant registers a team with the approved idea ID.

Findings:

- P0: None.
- P1: The audit log insert must happen after a successful idea update and should surface any write failure to the admin.
- P2: Because there is no auth session yet, `reviewed_by` and `actor_id` remain `null`; document this as the current minimal assumption.

### Scenario: Admin rejects an idea

Initial state:

- One `idea_submissions` row has status `submitted` or `approved`.
- Admin enters optional review notes and selects reject.

Execution:

- Server action validates `reviewStatus=rejected`.
- Server action fetches the existing row, updates `status` to `rejected`, sets `reviewed_at`, and stores review notes.
- Server action writes an `audit_logs` row with action `rejected`.
- Team registration remains blocked because the registration action only accepts ideas with status `approved`.

Object state:

- Idea state changes to `rejected`.
- No team, mentor assignment, leaderboard, or notification rows are created.

Findings:

- P0: None.
- P1: Rejection must not delete or mutate the submitted idea content because organizers need auditability.
- P2: Optional review notes are useful for organizer context, but they are not sent as email notifications in this task.

### Scenario: Invalid review submission

Initial state:

- Admin submits a malformed idea ID, missing status, or an idea ID that no longer exists.

Execution:

- Zod validation rejects malformed form data before database writes.
- Missing rows return a friendly error.
- No idea update or audit log insert is attempted when validation or lookup fails.

Object state:

- Existing idea submission state remains unchanged.
- Existing audit log state remains unchanged.

Findings:

- P0: None.
- P1: Server-side validation remains authoritative because client forms can be bypassed.
- P3: Focused automated tests can be added later when the project has a test runner; for now, lint and typecheck validate implementation shape.

## Paper-Based Volunteer Registration Simulation

Date: 2026-05-13

### Scenario: Participant submits a volunteer registration

Initial state:

- User opens `/register/volunteer`.
- Route renders a Phase 1 volunteer intake form instead of the placeholder.
- React Hook Form initializes with empty full name, email, department, preferred roles, and availability notes.
- `volunteerRegistrationSchema` validates the same payload on the client and server.
- Supabase writes happen only inside a feature-local server action.

Execution:

- User enters full name, work email, department, at least one preferred role, and optional availability notes.
- Client validation blocks missing contact details, invalid email, missing preferred roles, or oversized notes before the server action runs.
- Server action validates the payload again because client validation can be bypassed.
- Server action inserts one `volunteer_registrations` row with status `submitted`.
- After a successful volunteer insert, server action writes one `audit_logs` row with action `submitted` and source metadata.
- UI shows a loading state during submission, then either the submitted volunteer registration ID or a form error.

Object state:

- Form state moves from idle to submitting to success or error.
- Database state gains one submitted volunteer registration and one append-only audit log row on success.
- No volunteer assignment, scheduling, shift, approval workflow, realtime state, mentor assignment, or gamification row is created.

Findings:

- P0: None.
- P1: Server-side validation remains authoritative because client validation can be bypassed.
- P1: Audit logging should be attempted immediately after the volunteer row is inserted and should surface a clear error if it fails.
- P2: Preferred roles stay as a simple text array in the existing `volunteer_registrations` table; do not add assignment, shift, or scheduling tables.
- P2: Missing Supabase service configuration must return a friendly form error instead of crashing the route.
- P3: Volunteer status remains `submitted`; approval and coordination views can be added only when explicitly scoped.

### Scenario: Invalid volunteer registration attempt

Initial state:

- User opens `/register/volunteer`.
- Required fields are empty, email is malformed, preferred roles are unselected, or availability notes exceed the allowed length.

Execution:

- React Hook Form and Zod report field-level validation errors.
- If a malformed payload reaches the server action, server-side Zod validation returns a generic correction message.
- No Supabase insert is attempted for invalid input.

Object state:

- Existing volunteer registrations remain unchanged.
- Existing audit logs remain unchanged.

Findings:

- P0: None.
- P1: Invalid submissions must not create partial volunteer or audit records.
- P3: Focused automated tests can be added later when the project has a test runner; for now, lint and typecheck validate implementation shape.

## Paper-Based Mentor Management Simulation

Date: 2026-05-13

### Scenario: Admin opens mentor management page

Initial state:

- Route `/admin/mentors` resolves to `src/app/(dashboard)/admin/mentors/page.tsx`.
- Mentor rows may or may not exist in the existing `mentors` table.
- The Phase 1 admin assumption remains controlled internal organizer access until auth roles and RLS policies are finalized.

Execution:

- The server route creates a Supabase service-role client through a feature-local mentor query.
- The query reads non-deleted `mentors` rows ordered by newest `created_at`.
- The page renders the mentor create form, summary cards, and either the mentor list, an empty state, or a load error.
- No mentor-team assignment, matching algorithm, realtime update, scheduling workflow, or AI assistant is created.

Object state:

- Database state is read-only during page render.
- If Supabase service configuration is missing, the page shows an operational error instead of crashing.

Findings:

- P0: None.
- P1: The route must keep the same minimal admin access assumption documented for `/admin` until auth/RLS hardening is implemented.
- P2: A card list is sufficient for Phase 1; do not add data table or filtering abstractions before assignment workflows exist.

### Scenario: Admin creates an available mentor

Initial state:

- Admin opens `/admin/mentors`.
- The form contains full name, email, comma-separated expertise, capacity, and an availability checkbox.
- Existing schema supports `expertise`, `capacity`, `current_team_count`, and `is_available`.

Execution:

- Admin submits valid mentor details.
- Server action reads `FormData`, trims text fields, converts capacity to a number, and maps the availability checkbox to a boolean.
- Zod validation enforces full name, valid email, at least one expertise item, capacity limits, and availability.
- Server action inserts one `mentors` row with lowercased email, expertise array, capacity, and availability.
- After successful insert, the action writes an `audit_logs` row with action `created`, entity table `mentors`, the created row as `after_state`, and source metadata.
- `/admin/mentors` is revalidated so the new mentor appears in the list.

Object state:

- Form state moves from idle to pending to success or error.
- Database state gains one mentor row and one append-only audit log row on success.
- `current_team_count` stays at the database default of `0`.
- No team, mentor assignment, leaderboard, notification, realtime, or scheduling rows are created.

Findings:

- P0: None.
- P1: Audit logging should run immediately after the mentor insert and surface a clear error if it fails.
- P1: Server-side validation remains authoritative because the admin form can be bypassed.
- P2: Expertise stays a simple text array parsed from organizer-entered comma or newline-separated text.
- P2: Duplicate mentor email relies on the existing database uniqueness constraint and should return a clear action error.

### Scenario: Invalid mentor creation attempt

Initial state:

- Admin submits missing contact details, invalid email, empty expertise, non-numeric capacity, capacity below one, or capacity above the Phase 1 form limit.

Execution:

- Server-side Zod validation rejects malformed form data before database writes.
- No mentor insert is attempted when validation fails.
- No audit log is attempted when no mentor row is created.

Object state:

- Existing mentor rows remain unchanged.
- Existing audit logs remain unchanged.

Findings:

- P0: None.
- P1: Invalid submissions must not create partial mentor or audit records.
- P3: Focused automated tests can be added later when the project has a test runner; for now, lint and typecheck validate implementation shape.

## Paper-Based Landing Theme Refresh Simulation

Date: 2026-05-13

### Scenario: Render landing page with refreshed SurgeVector visual theme

Initial state:

- Next.js loads `src/app/layout.tsx`.
- Global theme tokens load from `src/app/globals.css`.
- Route `/` resolves to `src/app/(marketing)/page.tsx`.
- Landing content arrays provide the existing Phase 1 hero metrics, registration CTAs, event flow cards, participant steps, and benefits.
- Shared `Button`, `Card`, and `FadeIn` primitives are available.

Execution:

- The landing route renders the same event-focused Phase 1 content and routes.
- The page background shifts from a dark-first canvas to a light cream/white canvas with subtle orange radial gradients.
- Header, hero metrics, event flow links, cards, and step blocks use soft white or cream glass surfaces with orange accents and black text.
- Primary actions still route to `/register/idea`, `/register/volunteer`, and `/admin`.
- No registration form, admin dashboard, Supabase query, server action, database row, auth session, or future-phase feature is touched.

Object state:

- No Supabase client is created during the static landing render.
- Module-level landing arrays remain unchanged in shape and continue to drive presentational UI.
- Existing registration, volunteer, and admin routes remain the only CTA destinations.
- Visual state changes are limited to CSS theme tokens and landing page class names.

Alternative path:

- On small screens, the header keeps the compact logo and hides desktop navigation while the hero, metrics, and cards stack vertically.
- Focus-visible rings remain available through the shared `ring` theme token for keyboard navigation.

Findings:

- P0: None.
- P1: Preserve Phase 1 scope by refreshing visual treatment only; do not add judging, realtime, chat, AI assistant, or infrastructure features.
- P1: Light global tokens can affect admin and registration surfaces, so keep token changes compatible with existing `Button` and `Card` primitives instead of adding page-specific primitives.
- P2: Landing contrast must shift text from `text-white` assumptions to black/neutral text where surfaces become cream or white.
- P2: Docs should describe the new cream/white, orange, black, and subtle glass guidance so future landing edits remain aligned.
- P3: Visual validation remains manual unless a browser smoke harness is added later; lint and typecheck are the required validation commands for this task.

## Paper-Based Landing Polish Follow-Up Simulation

Date: 2026-05-13

### Scenario: Review landing page screenshot feedback

Initial state:

- Route `/` renders `src/app/(marketing)/page.tsx`.
- The refreshed theme uses a cream/white canvas with orange accents.
- The participant flow section includes one black feature card beside light step cards.
- The why-participate intro includes explanatory implementation copy about flyer-derived reasons and hidden event timing.

Execution:

- User scrolls through the landing page after the theme refresh.
- The black participant flow card visually reads as a leftover dark-theme block instead of a deliberate light-theme element.
- The why-participate supporting sentence exposes internal content guidance instead of participant-facing event value.
- CTA routes, registration links, admin routes, and Phase 1 content arrays remain unchanged.

Object state:

- No Supabase client is created.
- No form state, auth session, database row, route, or server action changes.
- Fixes are limited to presentational copy and landing section classes.

Findings:

- P0: None.
- P1: Remove internal/planning copy from participant-facing landing content.
- P2: Restyle the participant flow card as a light glass surface with a black accent, preserving the cream/orange theme.
- P3: Keep the follow-up narrow and avoid redesigning admin pages, forms, or future-phase features.

## Paper-Based Favicon Simulation

Date: 2026-05-13

### Scenario: Browser loads SurgeVector Hackathon favicon

Initial state:

- Next.js loads root app metadata from `src/app/layout.tsx`.
- No existing favicon, app icon, or public image asset is present.
- The landing theme uses orange, black, white, and cream as its primary visual palette.

Execution:

- Add a root-level `src/app/icon.svg` file using the Next.js App Router icon convention.
- Browser metadata can resolve the icon without adding a custom route or dependency.
- The SVG renders a compact orange rounded square with white `SV` lettering for small browser-tab display.

Object state:

- No route, form, Supabase client, auth session, database row, or server action changes.
- The icon is a static asset and does not affect landing content or registration/admin behavior.

Findings:

- P0: None.
- P1: Keep the favicon simple and brand-aligned; do not introduce generated image pipelines or additional packages.
- P2: Text must stay high-contrast at small sizes, so use white lettering on the orange mark.

## Paper-Based Spacious Landing Scroll Simulation

Date: 2026-05-13

### Scenario: Scroll through screen-like landing sections

Initial state:

- Route `/` renders `src/app/(marketing)/page.tsx`.
- The page has four major participant-facing content groups: hero/event flow, hackathon details, participant flow, and why participate.
- The current visual treatment uses a cream/white canvas with subtle grid texture and orange accents.

Execution:

- Convert the landing page from a tightly stacked long page into a normal vertical scroll page with screen-like sections.
- Use large vertical padding and viewport-height section targets so each major group gets enough whitespace.
- Apply proximity scroll snapping to help major sections land cleanly without creating carousel state, slideshow controls, or hidden content.
- Keep the same Phase 1 content arrays, CTA labels, and routes.

Object state:

- No Supabase client is created.
- No form state, auth session, database row, route, or server action changes.
- The scroll behavior is CSS-only and remains accessible as normal page scrolling.

Alternative path:

- On smaller screens, content stacks naturally and uses minimum section height only where there is enough room.
- If a viewport is too short for a section, normal overflow scrolling still exposes all content.

Findings:

- P0: None.
- P1: Do not implement a real slideshow, carousel, route transition system, or client-side scroll state.
- P2: Section spacing should improve screenshots by reducing partial cross-section overlap and giving each content group a clear visual pause.
- P3: Keep copy and routes unchanged except for prior participant-facing polish.

## Paper-Based Landing Scroll Stability Simulation

Date: 2026-05-13

### Scenario: User scrolls a small amount on the landing page

Initial state:

- Route `/` renders `src/app/(marketing)/page.tsx`.
- The landing page uses screen-like section spacing.
- The page currently has an internal `h-svh` scroll container with CSS scroll snapping.

Execution:

- User performs a small wheel or trackpad scroll gesture.
- Browser applies scroll snap selection inside the internal scroll container.
- Because sections are near full viewport height, the snap algorithm can jump multiple sections and feel like the page moved from top to bottom.
- Replace the internal scroll container and snap classes with normal document scrolling.

Object state:

- No Supabase client is created.
- No form state, auth session, database row, route, or server action changes.
- Section spacing remains CSS-only; scroll position is left to the browser's normal document flow.

Findings:

- P0: None.
- P1: Remove CSS scroll snapping from the landing page because it causes unpredictable jumps on normal scroll input.
- P2: Keep the roomier section layout, but use plain document scrolling for stability.
- P3: Update landing theme guidance so future edits avoid reintroducing snap behavior.

## Paper-Based Registration Editing Simulation

Date: 2026-05-13

### Scenario: Participant opens an existing team registration for editing

Initial state:

- Route `/registrations/[registrationId]/edit` receives a team registration UUID.
- The existing registration lives in `teams`, is linked to an approved idea through `idea_submissions`, and has one to four active `team_members`.
- Supabase service-role access is used for the Phase 1 foundation until auth ownership and RLS policies are finalized.

Execution:

- Server route validates the registration ID shape before querying.
- Query loads the non-deleted `teams` row, active `team_members`, and linked idea details when present.
- Page renders an error state when Supabase configuration or query execution fails.
- Page renders a not-found state when no active team exists for the ID.
- Page renders an empty-member notice when the team exists but has no active members, while the edit form still requires at least one member before save.
- Client form initializes with team name, organization, project summary, and current member details.

Object state:

- Database state is read-only during initial render.
- Form state starts with loaded team and member values.
- No approval workflow, mentor assignment, realtime collaboration, or advanced permission layer is created.

Findings:

- P0: None.
- P1: Server-side validation must remain authoritative because the client form can be bypassed.
- P1: Missing registration rows must not throw a route crash; they should show a not-found state.
- P2: Keep the route on the existing service-role MVP assumption and document that auth ownership checks remain a later hardening task.

### Scenario: Participant saves valid registration edits

Initial state:

- A team row exists with one to four active members.
- User edits team name, organization, optional project summary, and member full name, email, or role fields.
- Submitted members include at least one member and no more than four members.

Execution:

- Client-side Zod validation checks text limits, organization, team size, and duplicate member emails.
- Server action validates the same payload again.
- Server action reads existing team and member rows as `before_state`.
- Server action updates the team row and synchronizes member rows by updating retained members, inserting new members, and soft-deleting removed members.
- Server action fetches the updated team and active members as `after_state`.
- Server action writes an `audit_logs` row with action `updated`, entity table `teams`, and source metadata.
- Route revalidates after a successful update and the form shows a success state.

Object state:

- Team state changes only for editable fields: `name`, `organization`, and `project_summary`.
- Member state changes for active member details and primary contact ordering; the first submitted member remains primary.
- Removed members keep auditability through `deleted_at` instead of hard deletion.
- Idea approval status, team status, mentor assignment, points, and admin review state remain unchanged.

Findings:

- P0: None.
- P1: Member synchronization must avoid creating more than four active members before removals are applied.
- P1: Audit logging should happen after successful updates and should surface a clear error if it fails.
- P2: Duplicate emails must be blocked before database writes to avoid unique constraint failures.

### Scenario: Invalid or stale edit submission

Initial state:

- User submits a malformed registration ID, removes all members, adds more than four members, duplicates member emails, or submits a member ID that does not belong to the team.

Execution:

- Zod validation rejects malformed IDs, missing team names, invalid organization values, invalid member details, duplicate emails, and invalid team sizes.
- Server action returns a friendly error when the team no longer exists.
- Server action rejects member IDs outside the team before writing any member changes.
- No audit log is written when validation or lookup fails before updates.

Object state:

- Existing team and member rows remain unchanged for validation and lookup failures.
- Audit log state remains unchanged for rejected submissions.

Findings:

- P0: None.
- P1: Cross-team member IDs must be rejected to avoid accidental edits to another registration.
- P2: Focused automated tests can be added after a test runner exists; for now, lint and typecheck validate implementation shape.

## Paper-Based Gamification and Registration Choice Simulation

Date: 2026-05-13

### Scenario: Visitor opens the simple leaderboard

Initial state:

- Existing schema includes `teams.participation_points`, `leaderboard_entries`, `achievements`, and `audit_logs`.
- `src/features/gamification` only contains a README, so no leaderboard query or route currently exists.
- `src/types/database.ts` does not yet expose TypeScript table types for `achievements` or `leaderboard_entries`.

Execution:

- Route `/leaderboard` renders as a server component.
- The feature-local query reads non-deleted teams and non-deleted leaderboard entries using the service-role MVP pattern already used by admin and mentor pages.
- Query code joins data in application code: entries are matched to teams by `team_id`, while teams without entries fall back to `teams.participation_points`.
- Rows are sorted by effective points descending, with updated time as a stable secondary signal.
- The page renders summary cards, rank cards, completion progress, and badge chips when badge data is present.

Object state:

- Database rows are read-only.
- No audit log is written because leaderboard viewing has no side effect.
- No realtime scoring, XP engine, audience voting, judging workflow, or AI recommendation state is introduced.

Alternative paths:

- If Supabase configuration or query execution fails, the route shows a readable error card.
- If no teams exist, the route shows an empty state.
- If a team has no leaderboard entry, participation points still display from the `teams` row and badges/progress stay empty.

Findings:

- P0: None.
- P1: Database types must include the existing gamification tables before strongly typed queries can be added.
- P1: Points ordering must use `leaderboard_entries.total_points` when present and `teams.participation_points` as fallback.
- P2: Badge JSON should be parsed conservatively because the schema stores badges as JSONB.

### Scenario: Visitor clicks Register Now and chooses a path

Initial state:

- Landing navigation currently exposes participant, organizer, and volunteer links.
- `/register/idea`, `/register/team`, and `/register/volunteer` already exist.
- Idea submission currently creates an individual idea submission row; team registration currently requires an approved idea ID.

Execution:

- Landing navigation and primary hero CTA route to `/register`.
- `/register` presents a simple choice between participant and volunteer paths with grounded SurgeVector/Texila AI accelerator copy.
- Participant choice routes to `/register/participant`.
- `/register/participant` shows the event timeline and two actions: idea submission and team registration.
- The idea submission action is shown as live until 2026-05-22 12:00 IST and closed after that timestamp.
- Team registration remains available for an original idea owner before the cutoff and becomes the shared idea pool after the cutoff.

Object state:

- No database state changes occur while viewing the choice or participant timeline pages.
- Route state is derived from the current server time only.
- Organizer/admin links are not removed as routes; they are simply no longer primary landing nav actions.

Findings:

- P0: None.
- P1: Do not delete existing admin, volunteer, or registration routes while changing landing navigation.
- P1: Date-gated UI must not be the only enforcement for team claiming; the team registration server action must validate claims.
- P2: Keep the new pages static/server-rendered and avoid client-side wizards or complex state.

### Scenario: Participant registers a team around an idea

Initial state:

- Idea rows live in `idea_submissions`.
- Team rows link to ideas through `teams.idea_submission_id`.
- A unique database constraint on `teams.idea_submission_id` does not exist, so application validation must prevent duplicate active claims in Phase 1.

Execution:

- Team route loads available, non-deleted, non-rejected ideas that are not already linked to an active team.
- The client form captures the selected idea, team name, organization, optional execution note, and one to four members.
- The first member is treated as captain / point of contact.
- Server action validates the payload and looks up the idea.
- Server action rejects deleted, rejected, or already claimed ideas.
- Before 2026-05-22 12:00 IST, server action allows registration only when the first member email matches the original idea submitter email.
- From 2026-05-22 12:00 IST onward, any unclaimed, non-rejected idea can be selected.
- Successful registration inserts `teams`, inserts team members, writes an `audit_logs` row, and revalidates `/register/team` and `/leaderboard`.

Object state:

- `idea_submissions` remain separate individual idea records.
- `teams.idea_submission_id` becomes the claim marker for the chosen idea.
- `team_members.is_primary_contact` marks the first member as captain / point of contact.
- Rejected ideas and already claimed ideas are never offered as valid team registrations.

Alternative paths:

- Malformed idea IDs, missing teams, duplicate member emails, too many members, and stale claims return friendly errors without writes.
- If a concurrent team claim happens between page load and submit, the action rechecks active teams and rejects the second claim.
- If audit logging fails after inserts, the action returns the existing partial-audit warning pattern instead of hiding the problem.

Findings:

- P0: None.
- P1: Recheck claim status inside the server action to prevent stale available-idea selections.
- P1: The pre-cutoff owner exception needs email matching because auth ownership is not implemented in the MVP yet.
- P2: A future database unique partial index on active `teams.idea_submission_id` would strengthen this invariant after schema migration policy is decided.

## Paper-Based Taxilla Typo Correction Simulation

Date: 2026-05-13

### Scenario: Repository uses the corrected Taxilla organization name

Initial state:

- Display copy uses the misspelled Taxilla organization name in landing, registration, volunteer, README, and metadata text.
- Typed organization values use a misspelled persisted enum value in validation, TypeScript database types, and the initial Supabase migration.
- Existing registration forms, admin labels, leaderboard labels, and edit forms map the typo value to the typo label.
- The active working tree has unrelated `next-env.d.ts` and `src/app/icon.svg` changes that must remain untouched.

Execution:

- Replace display text with `Taxilla` everywhere in repo-owned source and docs.
- Replace the persisted organization value with `taxilla` in validation schemas, UI option values, route label maps, TypeScript database types, and the initial Supabase enum definition.
- Keep the change as a rename only; no new tables, workflows, routes, or future-phase features are added.
- Leave unrelated generated/icon working tree changes unstaged and unmodified.

Object state:

- Form submissions now send `organization: "taxilla"` for Taxilla selections.
- Admin, leaderboard, registration edit, and team registration label maps now render `Taxilla`.
- Database type unions and validation enums remain aligned with the Supabase enum migration.
- Existing deployed rows with the previous misspelled enum value would need migration if this schema had live data, but this Phase 1 MVP branch is still under active development.

Findings:

- P0: None.
- P1: Stored enum values, Zod enums, and TypeScript `Organization` must change together or typecheck will fail.
- P2: This is a breaking rename for any existing local seed/data using the previous misspelled enum value; no compatibility shim is needed for unshipped branch work.
- P3: Run lint and typecheck after the rename to catch missed labels or enum mismatches.

## Paper-Based Team Size and Eligibility Copy Simulation

Date: 2026-05-13

### Scenario: Platform uses 1-4 team size and full organization names

Initial state:

- Landing metrics show the previous compact team-size and shorthand eligibility values.
- Registration validation allows the previous compact member count.
- Team registration and edit forms disable the add button when the member count reaches the previous limit.
- The Supabase team member trigger raises when an insert/update would exceed the previous active member limit.
- Route copy and docs describe teams with the previous compact limit.

Execution:

- Update the shared team member limit constant to maximum four.
- Update Zod schemas for team registration and editing to allow four members.
- Update the add-member button guards in create and edit forms to allow a fourth member.
- Update the Supabase trigger threshold and error text to enforce at most four active members.
- Update user-facing copy and docs to one-to-four / 1-4.
- Change the landing eligibility metric from shorthand to `SurgeVector, Taxilla`.

Object state:

- Team registrations can submit one, two, three, or four active members.
- The first member remains the captain / point of contact.
- The database trigger remains the final invariant for active team member count.
- No new tables, routes, workflows, or future-phase features are introduced.

Findings:

- P0: None.
- P1: Client validation, form add-button guards, and the database trigger must all move to four together.
- P2: Older paper simulation notes may mention prior one-to-three behavior; current architecture and feature docs should describe the new rule.

## Paper-Based Timeline and Landing Simplification Simulation

Date: 2026-05-13

### Scenario: Update timeline dates and simplify landing page

Initial state:

- `IDEA_SUBMISSION_CLOSES_AT` and `TEAM_FORMATION_POOL_OPENS_AT` are both set to May 22 06:30 UTC.
- `HACKATHON_TIMELINE` has five entries with idea submission ending May 22.
- Landing page has four major sections: hero/event flow, hackathon details (phaseOneFeatures cards), participant flow (operatingSteps), and why-participate.
- Participant page status card has two states: idea open or shared pool open.
- Team registration action enforces the pool-open check using `isSharedTeamFormationOpen()`.
- Business doc specifies idea generation ends May 18, team formation closes May 22, sprint May 22–29, demo day May 30.
- No idea approval or vetting step is required — submitted ideas are immediately available for team formation.

Execution:

- `IDEA_SUBMISSION_CLOSES_AT` changes to May 18 end-of-day IST (2026-05-18T18:30:00Z).
- `TEAM_FORMATION_POOL_OPENS_AT` changes to May 22 12:00 PM IST (2026-05-22T06:30:00Z) — now decoupled from idea close date.
- `isIdeaSubmissionOpen()` now returns false after May 18 instead of May 22. No logic change needed.
- `isSharedTeamFormationOpen()` still gates the shared pool on May 22. No logic change needed.
- Team registration action already allows ideas with status `submitted` or `approved`, so no approval step removal is needed.
- Landing removes the "Hackathon Details" section (phaseOneFeatures 4 cards) and the "Participant Flow" section (operatingSteps).
- Landing adds an inline timeline section using `HACKATHON_TIMELINE` from constants.
- Landing hero slogan changes to "Build Reusable AI Accelerators, Together."
- Hero metrics change "Entry: Idea first" to "Dates: May 14–30".
- Hero right card simplifies to two links: Register and Leaderboard (removes Participant timeline link).
- Participant page status card gains a third state for May 18–22 gap (idea closed, pool not yet open).
- Participant page idea submission description updated from May 22 to May 18.

Gap state analysis (May 18–22):

- `isIdeaOpen` = false, `isSharedPoolOpen` = false.
- The participant page status card currently only has two states, so it would show "Idea window is live" — incorrect.
- The idea submission action card shows "Closed" — correct.
- Team registration remains open only for original idea owners during this gap.
- Fix: add a third status card state for "Idea submission closed — shared pool opens May 22."

Object state:

- No database schema changes. No new tables, routes, or server actions.
- `isIdeaSubmissionOpen()` and `isSharedTeamFormationOpen()` return values change after May 18 and May 22 respectively.
- Landing page renders fewer sections, adds timeline.
- Participant page renders correct 3-state status messaging.

Findings:

- P0: None.
- P1: Participant page must handle the May 18–22 gap state explicitly or it will show "Idea window is live" when the idea window is actually closed.
- P1: The hardcoded date "May 22 at 12:00 PM IST" in `registration-actions.ts` is still accurate because it references pool open time, not idea close time. No change needed.
- P2: Available idea query already filters by `["submitted", "approved"]` — submitted ideas pass through without an approval step. No change needed.
- P3: Run lint and typecheck after changes to validate import cleanup from removed sections.

## Open TODOs

- Add RLS policies when auth roles and ownership flows are implemented.
- Generate full Supabase TypeScript types after the Supabase project is created.
- Add focused tests after the first real form and server action are implemented.
