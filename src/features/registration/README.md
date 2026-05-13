# Registration Feature

Owns the register choice flow, participant timeline, participant idea intake, team registration, team member capture, registration editing, and shared registration validation.

Phase 1 constraints:
- Participants submit ideas before team formation.
- Ideas are submitted under an individual participant name.
- Team registration is separate and is led by a captain / point of contact.
- Team registration claims an unclaimed submitted or approved idea through `teams.idea_submission_id`.
- Before May 22, 2026 at 12:00 PM IST, only the original idea submitter can register a team for that idea by matching captain email to submitter email.
- After May 22, 2026 at 12:00 PM IST, remaining submitted or approved ideas are available in the shared team formation pool.
- Minimum 1 team member.
- Maximum 4 team members.
- Store audit-friendly registration changes.

Implemented routes:
- `/register` asks whether the user is registering as a participant or volunteer.
- `/register/participant` shows the participant timeline and links to idea submission and team registration.
- `/register/idea` captures participant ideas for admin review.
- `/register/team` creates a team for an available idea and hides ideas already claimed by active teams.
- `/registrations/[registrationId]/edit` loads an existing team registration, allows editing team details and one to four active members, and writes an `audit_logs` row after a successful update.

Registration editing scope:
- Editable fields are team name, organization, optional project summary, and member full name, email, and role.
- The linked idea and team status are displayed but not changed by the edit route.
- Removed members are soft-deleted to preserve auditability.
- Phase 1 still uses the service-role MVP assumption until auth ownership and RLS policies are hardened.
