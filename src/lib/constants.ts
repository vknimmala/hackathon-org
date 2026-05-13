export const APP_NAME = "SurgeVector Hackathon 2026";

export const TEAM_MEMBER_LIMITS = {
  min: 1,
  max: 4,
} as const;

// Both idea submission and team registration close May 22 at 11:59 PM IST (18:30 UTC).
export const IDEA_SUBMISSION_CLOSES_AT = new Date("2026-05-22T18:30:00.000Z");

// After submitting, the original submitter has this many hours of exclusive
// priority to register a team before the idea enters the shared pool.
export const IDEA_EXCLUSIVE_WINDOW_HOURS = 1;

export const HACKATHON_TIMELINE = [
  {
    date: "May 14, 2026",
    description:
      "Event introduction, problem statements, and guidelines shared with all participants.",
    title: "Kick-off",
  },
  {
    date: "May 14–22, 2026",
    description:
      "Submit ideas and form teams before May 22. Original submitters get 1 hour of priority before their idea enters the shared pool.",
    title: "Ideas & Teams",
  },
  {
    date: "May 22–29, 2026",
    description:
      "Build your prototype during the sprint with mentor and engineering lead support.",
    title: "Development Sprint",
  },
  {
    date: "May 30, 2026",
    description:
      "Present your working prototype to judges and peers on demo day.",
    title: "Demo Day",
  },
] as const;

export const PHASE_ONE_FEATURES = [
  "landing",
  "registration",
  "volunteers",
  "mentors",
  "admin",
  "gamification",
] as const;

export function isIdeaSubmissionOpen(now = new Date()) {
  return now.getTime() < IDEA_SUBMISSION_CLOSES_AT.getTime();
}

export function isIdeaInExclusiveWindow(
  submittedAt: string | Date,
  now = new Date(),
) {
  const submittedDate =
    typeof submittedAt === "string" ? new Date(submittedAt) : submittedAt;
  const expiresAt = new Date(
    submittedDate.getTime() + IDEA_EXCLUSIVE_WINDOW_HOURS * 60 * 60 * 1000,
  );
  return now < expiresAt;
}
