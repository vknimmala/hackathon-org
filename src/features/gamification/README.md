# Gamification Feature

Owns simple participation points, badges, leaderboard entries, and completion progress.

Implemented route:
- `/leaderboard` renders a read-only team leaderboard ordered by `leaderboard_entries.total_points` when present, falling back to `teams.participation_points`.
- Teams without leaderboard entries still appear with zero completion progress and no badges.
- Active achievements are shown as a simple badge catalog when present.

States:
- Loading is handled by `src/app/leaderboard/loading.tsx`.
- Query errors render a focused error card.
- Empty teams render an empty state.

Do not add realtime scoring, XP engines, audience voting, or advanced ranking systems in Phase 1.
