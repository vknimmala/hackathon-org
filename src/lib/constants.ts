export const APP_NAME = "SurgeVector Hackathon 2026";

export const TEAM_MEMBER_LIMITS = {
  min: 1,
  max: 4,
} as const;

export const IDEA_SUBMISSION_CLOSES_AT = new Date("2026-05-22T06:30:00.000Z");

export const TEAM_FORMATION_POOL_OPENS_AT = IDEA_SUBMISSION_CLOSES_AT;

export const HACKATHON_TIMELINE = [
  {
    date: "May 14, 2026",
    description: "Event introduction, problem statement, and guidelines.",
    title: "Kick-off and briefing",
  },
  {
    date: "May 14-22, 2026",
    description: "Submit individual AI ideas before May 22 at 12:00 PM IST.",
    title: "Idea submission",
  },
  {
    date: "May 22, 2026",
    description: "Team captains claim ideas and register one to four members.",
    title: "Team formation",
  },
  {
    date: "May 22-29, 2026",
    description: "Build prototypes with focused mentor coordination.",
    title: "Development",
  },
  {
    date: "May 30, 2026",
    description: "Final presentations and judging.",
    title: "Demo day",
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
