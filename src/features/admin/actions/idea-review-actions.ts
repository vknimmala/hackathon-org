"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";
import { ideaReviewSchema } from "@/validations/admin";

export type IdeaReviewActionState = {
  ok: boolean;
  message: string;
};

export const initialIdeaReviewActionState: IdeaReviewActionState = {
  ok: false,
  message: "",
};

function getTextValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function getActionErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes("service role key")) {
      return "Admin review is not connected yet. Add the Supabase service role key and try again.";
    }

    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export async function reviewIdeaSubmissionAction(
  _previousState: IdeaReviewActionState,
  formData: FormData,
): Promise<IdeaReviewActionState> {
  const parsed = ideaReviewSchema.safeParse({
    ideaId: getTextValue(formData, "ideaId"),
    reviewNotes: getTextValue(formData, "reviewNotes").trim(),
    reviewStatus: getTextValue(formData, "reviewStatus"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the idea review action and notes, then try again.",
    };
  }

  const values = parsed.data;

  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data: existingIdea, error: lookupError } = await supabase
      .from("sv_idea_submissions")
      .select("*")
      .eq("id", values.ideaId)
      .is("deleted_at", null)
      .maybeSingle();

    if (lookupError) {
      return {
        ok: false,
        message: lookupError.message,
      };
    }

    if (!existingIdea) {
      return {
        ok: false,
        message: "No idea submission was found for review.",
      };
    }

    const reviewRecord = {
      review_notes: values.reviewNotes || null,
      reviewed_at: new Date().toISOString(),
      status: values.reviewStatus,
    };

    const { data: updatedIdea, error: updateError } = await supabase
      .from("sv_idea_submissions")
      .update(reviewRecord)
      .eq("id", values.ideaId)
      .is("deleted_at", null)
      .select("*")
      .single();

    if (updateError) {
      return {
        ok: false,
        message: updateError.message,
      };
    }

    const { error: auditError } = await supabase.from("sv_audit_logs").insert({
      action: values.reviewStatus,
      after_state: updatedIdea as unknown as Json,
      before_state: existingIdea as unknown as Json,
      entity_id: updatedIdea.id,
      entity_table: "sv_idea_submissions",
      metadata: {
        previous_status: existingIdea.status,
        source: "admin_idea_review",
      },
    });

    if (auditError) {
      return {
        ok: false,
        message: `Idea status changed, but audit logging failed: ${auditError.message}`,
      };
    }

    revalidatePath("/admin");

    return {
      ok: true,
      message:
        values.reviewStatus === "approved"
          ? "Idea approved. Participants can now register a team with this idea ID."
          : "Idea rejected. Team registration remains closed for this idea.",
    };
  } catch (error) {
    return {
      ok: false,
      message: getActionErrorMessage(error),
    };
  }
}
