import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/types/database";

type AchievementRow = Database["public"]["Tables"]["sv_achievements"]["Row"];
type LeaderboardEntryRow =
  Database["public"]["Tables"]["sv_leaderboard_entries"]["Row"];
type TeamRow = Database["public"]["Tables"]["sv_teams"]["Row"];

const achievementSelect = `
  badge_icon,
  code,
  description,
  id,
  name,
  points
` as const;

const leaderboardEntrySelect = `
  badges,
  completion_progress,
  team_id,
  total_points,
  updated_at
` as const;

const teamSelect = `
  created_at,
  id,
  name,
  organization,
  participation_points,
  status,
  updated_at
` as const;

export interface LeaderboardBadge {
  description?: string;
  label: string;
}

export type AchievementCatalogItem = Pick<
  AchievementRow,
  "badge_icon" | "code" | "description" | "id" | "name" | "points"
>;

export type LeaderboardTeam = Pick<
  TeamRow,
  "id" | "name" | "organization" | "participation_points" | "status"
> & {
  badges: LeaderboardBadge[];
  completionProgress: number;
  lastUpdatedAt: string;
  totalPoints: number;
};

export type LeaderboardResult =
  | {
      achievements: AchievementCatalogItem[];
      entries: LeaderboardTeam[];
      ok: true;
    }
  | {
      achievements: [];
      entries: [];
      message: string;
      ok: false;
    };

function getQueryErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes("service role key")) {
      return "Leaderboard is not connected yet. Add the Supabase service role key to load team points.";
    }

    return error.message;
  }

  return "Leaderboard could not be loaded.";
}

function getBadgeLabel(badge: Json): LeaderboardBadge | null {
  if (typeof badge === "string") {
    return { label: badge };
  }

  if (!badge || typeof badge !== "object" || Array.isArray(badge)) {
    return null;
  }

  const label =
    typeof badge.name === "string"
      ? badge.name
      : typeof badge.label === "string"
        ? badge.label
        : typeof badge.code === "string"
          ? badge.code
          : null;

  if (!label) {
    return null;
  }

  const description =
    typeof badge.description === "string" ? badge.description : undefined;

  return { description, label };
}

function parseBadges(value: Json): LeaderboardBadge[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((badge) => {
    const parsedBadge = getBadgeLabel(badge);

    return parsedBadge ? [parsedBadge] : [];
  });
}

function getLeaderboardRows(
  teams: Pick<
    TeamRow,
    | "created_at"
    | "id"
    | "name"
    | "organization"
    | "participation_points"
    | "status"
    | "updated_at"
  >[],
  entries: Pick<
    LeaderboardEntryRow,
    "badges" | "completion_progress" | "team_id" | "total_points" | "updated_at"
  >[],
) {
  const entriesByTeamId = new Map(
    entries.map((entry) => [entry.team_id, entry]),
  );

  return teams
    .map((team) => {
      const entry = entriesByTeamId.get(team.id);

      return {
        badges: entry ? parseBadges(entry.badges) : [],
        completionProgress: entry?.completion_progress ?? 0,
        id: team.id,
        lastUpdatedAt: entry?.updated_at ?? team.updated_at ?? team.created_at,
        name: team.name,
        organization: team.organization,
        participation_points: team.participation_points,
        status: team.status,
        totalPoints: entry?.total_points ?? team.participation_points,
      };
    })
    .sort((first, second) => {
      if (second.totalPoints !== first.totalPoints) {
        return second.totalPoints - first.totalPoints;
      }

      return (
        new Date(second.lastUpdatedAt).getTime() -
        new Date(first.lastUpdatedAt).getTime()
      );
    });
}

export async function getLeaderboard(): Promise<LeaderboardResult> {
  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data: teams, error: teamsError } = await supabase
      .from("sv_teams")
      .select(teamSelect)
      .is("deleted_at", null);

    if (teamsError) {
      return {
        achievements: [],
        entries: [],
        message: teamsError.message,
        ok: false,
      };
    }

    const { data: entries, error: entriesError } = await supabase
      .from("sv_leaderboard_entries")
      .select(leaderboardEntrySelect)
      .is("deleted_at", null);

    if (entriesError) {
      return {
        achievements: [],
        entries: [],
        message: entriesError.message,
        ok: false,
      };
    }

    const { data: achievements, error: achievementsError } = await supabase
      .from("sv_achievements")
      .select(achievementSelect)
      .eq("is_active", true)
      .is("deleted_at", null)
      .order("points", { ascending: true });

    if (achievementsError) {
      return {
        achievements: [],
        entries: [],
        message: achievementsError.message,
        ok: false,
      };
    }

    return {
      achievements,
      entries: getLeaderboardRows(teams, entries),
      ok: true,
    };
  } catch (error) {
    return {
      achievements: [],
      entries: [],
      message: getQueryErrorMessage(error),
      ok: false,
    };
  }
}
