# Volunteers Feature

Owns volunteer registration, availability windows, preferred roles, and admin-facing coverage views.

Keep coordination simple and registration-focused for Phase 1.

## Current Phase 1 Behavior

- `/register/volunteer` renders a React Hook Form intake for full name, email, department, preferred roles, and availability notes.
- `submitVolunteerRegistrationAction` validates the payload with Zod on the server, inserts a `volunteer_registrations` row with status `submitted`, and writes an `audit_logs` row.
- The form shows loading, success, and error states and returns the submitted volunteer registration ID on success.
- Do not add volunteer assignment, scheduling, shift management, realtime updates, or approval workflows unless they are explicitly scoped later.
