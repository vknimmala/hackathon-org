import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type IdeaSubmissionRow =
  Database["public"]["Tables"]["idea_submissions"]["Row"];
type TeamRow = Database["public"]["Tables"]["teams"]["Row"];

const availableIdeaSelect = `
  department,
  id,
  idea_title,
  organization,
  participant_email,
  participant_full_name,
  status,
  submitted_at
` as const;

export type AvailableTeamIdea = Pick<
  IdeaSubmissionRow,
  | "department"
  | "id"
  | "idea_title"
  | "organization"
  | "participant_email"
  | "participant_full_name"
  | "status"
  | "submitted_at"
>;

export type AvailableTeamIdeasResult =
  | {
      ideas: AvailableTeamIdea[];
      ok: true;
    }
  | {
      ideas: [];
      message: string;
      ok: false;
    };

function getQueryErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes("service role key")) {
      return "Team registration is not connected yet. Add the Supabase service role key to load available ideas.";
    }

    return error.message;
  }

  return "Available ideas could not be loaded.";
}

function getClaimedIdeaIds(teams: Pick<TeamRow, "idea_submission_id">[]) {
  return new Set(
    teams
      .map((team) => team.idea_submission_id)
      .filter((ideaId): ideaId is string => Boolean(ideaId)),
  );
}

export async function getAvailableIdeasForTeamRegistration(): Promise<AvailableTeamIdeasResult> {
  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data: ideas, error: ideasError } = await supabase
      .from("idea_submissions")
      .select(availableIdeaSelect)
      .in("status", ["submitted", "approved"])
      .is("deleted_at", null)
      .order("submitted_at", { ascending: true });

    if (ideasError) {
      return {
        ideas: [],
        message: ideasError.message,
        ok: false,
      };
    }

    const { data: teams, error: teamsError } = await supabase
      .from("teams")
      .select("idea_submission_id")
      .not("idea_submission_id", "is", null)
      .is("deleted_at", null);

    if (teamsError) {
      return {
        ideas: [],
        message: teamsError.message,
        ok: false,
      };
    }

    const claimedIdeaIds = getClaimedIdeaIds(teams);

    return {
      ideas: ideas.filter((idea) => !claimedIdeaIds.has(idea.id)),
      ok: true,
    };
  } catch (error) {
    return {
      ideas: [],
      message: getQueryErrorMessage(error),
      ok: false,
    };
  }
}
