# Registration Feature

Owns participant idea intake, approved team registration, team member capture, registration editing, and shared registration validation.

Phase 1 constraints:
- Participants submit ideas before team formation.
- Team creation requires an approved idea submission.
- Minimum 1 team member.
- Maximum 3 team members.
- Store audit-friendly registration changes.

Implemented routes:
- `/register/idea` captures participant ideas for admin review.
- `/register/team` creates a team only after an approved idea ID is provided.
- `/registrations/[registrationId]/edit` loads an existing team registration, allows editing team details and one to three active members, and writes an `audit_logs` row after a successful update.

Registration editing scope:
- Editable fields are team name, organization, optional project summary, and member full name, email, and role.
- The linked idea and team status are displayed but not changed by the edit route.
- Removed members are soft-deleted to preserve auditability.
- Phase 1 still uses the service-role MVP assumption until auth ownership and RLS policies are hardened.
