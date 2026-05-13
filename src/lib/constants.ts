export const APP_NAME = "SurgeVector Hackathon 2026";

export const TEAM_MEMBER_LIMITS = {
  min: 1,
  max: 4,
} as const;

// Idea submission window closes May 18 at 11:59 PM IST (18:30 UTC).
export const IDEA_SUBMISSION_CLOSES_AT = new Date("2026-05-18T18:30:00.000Z");

// Shared team formation pool opens May 22 at 12:00 PM IST (06:30 UTC).
export const TEAM_FORMATION_POOL_OPENS_AT = new Date(
  "2026-05-22T06:30:00.000Z",
);

export const HACKATHON_TIMELINE = [
  {
    date: "May 14, 2026",
    description: "Event introduction, problem statements, and guidelines shared with all participants.",
    title: "Kick-off",
  },
  {
    date: "May 14–18, 2026",
    description: "Submit your AI idea individually before May 18. Every idea needs a named owner.",
    title: "Idea Generation",
  },
  {
    date: "By May 22, 2026",
    description: "Form a team of up to four members. Original submitters can register first; shared pool opens May 22.",
    title: "Team Formation",
  },
  {
    date: "May 22–29, 2026",
    description: "Build your prototype during the sprint with support from mentors and engineering leads.",
    title: "Development Sprint",
  },
  {
    date: "May 30, 2026",
    description: "Present your working prototype to judges and peers on demo day.",
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

export function isSharedTeamFormationOpen(now = new Date()) {
  return now.getTime() >= TEAM_FORMATION_POOL_OPENS_AT.getTime();
}
