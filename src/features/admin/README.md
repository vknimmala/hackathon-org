# Admin Feature

Owns organizer dashboard composition, idea review actions, operational analytics, mentor assignment controls, and registration editing entry points.

Avoid complex dashboards initially; prioritize clear operational status.

Current Phase 1 behavior:

- `/admin` lists submitted idea submissions for internal organizers.
- `/admin/mentors` lists mentor profiles and creates new mentor records for Phase 1 coordination.
- Organizers can approve or reject an idea with optional review notes.
- Review actions update `idea_submissions.status`, `reviewed_at`, and `review_notes`.
- Each approval or rejection writes an `audit_logs` row.
- Each mentor creation writes an `audit_logs` row.
- Auth screens and final role/RLS enforcement are not implemented yet; the route assumes controlled internal organizer access until that model is ready.

Out of scope here: scoring rubrics, voting, realtime updates, advanced judging workflows, and super-admin hierarchies.
