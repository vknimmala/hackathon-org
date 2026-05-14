import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type IdeaSubmissionRow =
  Database["public"]["Tables"]["sv_idea_submissions"]["Row"];

const ideaReviewSelect = `
  ai_usage,
  department,
  id,
  idea_title,
  organization,
  participant_email,
  participant_full_name,
  problem_statement,
  proposed_solution,
  review_notes,
  reviewed_at,
  status,
  submitted_at
` as const;

export type IdeaSubmissionForReview = Pick<
  IdeaSubmissionRow,
  | "ai_usage"
  | "department"
  | "id"
  | "idea_title"
  | "organization"
  | "participant_email"
  | "participant_full_name"
  | "problem_statement"
  | "proposed_solution"
  | "review_notes"
  | "reviewed_at"
  | "status"
  | "submitted_at"
>;

export type IdeaReviewListResult =
  | {
      ideas: IdeaSubmissionForReview[];
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
      return "Admin review is not connected yet. Add the Supabase service role key to load submitted ideas.";
    }

    return error.message;
  }

  return "Submitted ideas could not be loaded.";
}

export async function getIdeaSubmissionsForReview(): Promise<IdeaReviewListResult> {
  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("sv_idea_submissions")
      .select(ideaReviewSelect)
      .is("deleted_at", null)
      .order("submitted_at", { ascending: false });

    if (error) {
      return {
        ideas: [],
        message: error.message,
        ok: false,
      };
    }

    return {
      ideas: data,
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
