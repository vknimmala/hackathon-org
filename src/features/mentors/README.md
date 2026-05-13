# Mentors Feature

Owns mentor profiles, availability, capacity, assignment history, manual reassignment, and admin overrides.

Current Phase 1 behavior:

- `/admin/mentors` lists non-deleted mentor profiles for internal organizers.
- Organizers can create mentor profiles with full name, email, expertise, capacity, and availability.
- Mentor creation writes to the existing `mentors` table and records an `audit_logs` entry with action `created`.
- Expertise remains a simple text array parsed from comma or newline-separated form input.
- Auth screens and final role/RLS enforcement are not implemented yet; the route assumes controlled internal organizer access until that model is ready.

Do not add AI mentor assistants or recommendation systems in Phase 1.

Out of scope here: matching algorithms, realtime availability, advanced scheduling, automated assignment, and approval workflows.
