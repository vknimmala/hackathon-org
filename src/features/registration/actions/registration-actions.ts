"use server";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";
import {
  ideaSubmissionSchema,
  teamRegistrationSchema,
  type IdeaSubmissionInput,
  type TeamRegistrationInput,
} from "@/validations/registration";

export type RegistrationActionResult =
  | {
      ok: true;
      id: string;
      message: string;
    }
  | {
      ok: false;
      message: string;
    };

function getActionErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes("service role key")) {
      return "Registration is not connected yet. Add the Supabase service role key and try again.";
    }

    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export async function submitIdeaAction(
  input: IdeaSubmissionInput,
): Promise<RegistrationActionResult> {
  const parsed = ideaSubmissionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the idea submission fields and try again.",
    };
  }

  const values = parsed.data;
  const ideaRecord = {
    ai_usage: values.aiUsage,
    department: values.department,
    idea_title: values.ideaTitle,
    organization: values.organization,
    participant_email: values.participantEmail.toLowerCase(),
    participant_full_name: values.participantFullName,
    problem_statement: values.problemStatement,
    proposed_solution: values.proposedSolution,
    status: "submitted" as const,
  };

  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("idea_submissions")
      .insert(ideaRecord)
      .select("id")
      .single();

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    await supabase.from("audit_logs").insert({
      action: "submitted",
      after_state: ideaRecord as Json,
      entity_id: data.id,
      entity_table: "idea_submissions",
      metadata: { source: "participant_idea_form" },
    });

    return {
      ok: true,
      id: data.id,
      message:
        "Idea submitted. The review panel will vet it before team registration opens.",
    };
  } catch (error) {
    return {
      ok: false,
      message: getActionErrorMessage(error),
    };
  }
}

export async function submitTeamRegistrationAction(
  input: TeamRegistrationInput,
): Promise<RegistrationActionResult> {
  const parsed = teamRegistrationSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the team registration fields and try again.",
    };
  }

  const values = parsed.data;

  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data: idea, error: ideaError } = await supabase
      .from("idea_submissions")
      .select("id, status")
      .eq("id", values.approvedIdeaId)
      .maybeSingle();

    if (ideaError) {
      return {
        ok: false,
        message: ideaError.message,
      };
    }

    if (!idea) {
      return {
        ok: false,
        message: "No idea submission was found for that ID.",
      };
    }

    if (idea.status !== "approved") {
      return {
        ok: false,
        message:
          "This idea is not approved yet. Team registration opens after review approval.",
      };
    }

    const teamRecord = {
      idea_submission_id: values.approvedIdeaId,
      name: values.teamName,
      organization: values.organization,
      project_summary: values.projectSummary || null,
      status: "submitted" as const,
      submitted_at: new Date().toISOString(),
    };

    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert(teamRecord)
      .select("id")
      .single();

    if (teamError) {
      return {
        ok: false,
        message: teamError.message,
      };
    }

    const memberRecords = values.members.map((member, index) => ({
      email: member.email.toLowerCase(),
      full_name: member.fullName,
      is_primary_contact: index === 0,
      role: member.role,
      team_id: team.id,
    }));

    const { error: membersError } = await supabase
      .from("team_members")
      .insert(memberRecords);

    if (membersError) {
      return {
        ok: false,
        message: membersError.message,
      };
    }

    await supabase.from("audit_logs").insert({
      action: "submitted",
      after_state: {
        members: memberRecords,
        team: teamRecord,
      },
      entity_id: team.id,
      entity_table: "teams",
      metadata: { source: "approved_idea_team_registration" },
    });

    return {
      ok: true,
      id: team.id,
      message:
        "Team registered. Mentor assignment will be coordinated after admin review.",
    };
  } catch (error) {
    return {
      ok: false,
      message: getActionErrorMessage(error),
    };
  }
}
