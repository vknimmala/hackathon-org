# Deployment Guide — SurgeVector Hackathon 2026

## Prerequisites

- Node.js 20 or later
- npm 10 or later
- A Supabase account (free tier is sufficient for Phase 1)

---

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**.
3. Set a project name (e.g., `surgevector-hackathon`), choose a region closest to your users, and set a strong database password. Save the password; you will need it if you ever connect directly via psql.
4. Wait for the project to provision (roughly 1–2 minutes).

---

## 2. Gather Supabase Credentials

In the Supabase dashboard for your project, go to **Project Settings → API**.

You need three values:

| Value | Where to find it |
| --- | --- |
| Project URL | **Project URL** field at the top |
| Anon public key | Under **Project API keys → anon public** |
| Service role key | Under **Project API keys → service_role** (click to reveal) |

Keep the service role key confidential. It bypasses Row Level Security and must never be exposed to the browser.

---

## 3. Configure Environment Variables

Copy the example environment file and fill in your values:

```
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

The `NEXT_PUBLIC_` variables are safe to expose to the browser. `SUPABASE_SERVICE_ROLE_KEY` is server-only and must not start with `NEXT_PUBLIC_`.

---

## 4. Apply Database Migrations

Migrations live in `supabase/migrations/` and must be applied in order. The Supabase SQL editor is the simplest path for local setup without the Supabase CLI.

### Option A — SQL Editor (no CLI required)

1. In the Supabase dashboard, open **SQL Editor**.
2. Create a new query, paste the full contents of `supabase/migrations/001_phase_1_initial_schema.sql`, and run it.
3. Create a second query, paste `supabase/migrations/002_idea_first_registration_flow.sql`, and run it.
4. Verify each migration completes without errors in the output panel.

### Option B — Supabase CLI

If you have the Supabase CLI installed and linked to your project:

```bash
supabase db push
```

This pushes all pending migrations in order.

---

## 5. Verify the Schema

After applying migrations, go to **Table Editor** in the Supabase dashboard and confirm the following tables exist:

- `sv_users`
- `sv_idea_submissions`
- `sv_teams`
- `sv_team_members`
- `sv_mentors`
- `sv_mentor_assignments`
- `sv_volunteer_registrations`
- `sv_themes`
- `sv_achievements`
- `sv_leaderboard_entries`
- `sv_audit_logs`

All tables use UUID primary keys and include `created_at`, `updated_at`, and `deleted_at` timestamps.

---

## 6. Run the Development Server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and verify:

- Landing page renders the hero image and timeline.
- `/register` shows the Participant / Volunteer tab toggle.
- `/register/idea` form submits without errors.
- `/register/team` loads available ideas from Supabase.
- `/admin` shows the idea review dashboard.
- `/admin/mentors` shows the mentor management page.
- `/leaderboard` renders (empty state is expected before teams are registered).

---

## 7. Pre-PR Validation

Always run both commands before opening a pull request:

```bash
npm run lint
npm run typecheck
```

Fix any errors before committing.

---

## 8. Production Deployment (Vercel)

1. Push the branch to GitHub.
2. Connect the repository to a Vercel project.
3. In **Vercel → Settings → Environment Variables**, add the same four variables from `.env.local`. Set `NEXT_PUBLIC_APP_URL` to your production domain.
4. Set the build command to `npm run build` and the output directory to `.next` (Vercel detects Next.js automatically).
5. Deploy. Vercel runs `next build` and serves the app via edge functions.

For production, make sure:

- `SUPABASE_SERVICE_ROLE_KEY` is added only to server environments (not exposed in the browser bundle).
- Supabase RLS policies are in place before the app goes public. Phase 1 uses service-role access for admin and registration operations; add RLS policies before removing the controlled-access assumption.

---

## 9. Key Dates and Constants

Defined in `src/lib/constants.ts`:

| Constant | Value | Effect |
| --- | --- | --- |
| `IDEA_SUBMISSION_CLOSES_AT` | May 22, 2026 at 11:59 PM IST | Idea form closes after this time |
| `IDEA_EXCLUSIVE_WINDOW_HOURS` | 1 | Original submitter has 1 hour to claim their idea before the shared pool opens |
| `TEAM_MEMBER_LIMITS.max` | 4 | Team registration enforces a four-member cap |

---

## 10. Open TODOs Before Launch

- Add Supabase Auth and row-level security policies when the admin ownership model is ready.
- Run `supabase gen types typescript` after the project is created to regenerate `src/types/database.ts` against the live schema.
- Add focused integration tests once the test runner is configured.
