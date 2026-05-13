"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/types/database";
import {
  ideaSubmissionSchema,
  teamRegistrationEditSchema,
  teamRegistrationSchema,
  type IdeaSubmissionInput,
  type TeamRegistrationEditInput,
  type TeamRegistrationInput,
} from "@/validations/registration";

type TeamMemberRow = Database["public"]["Tables"]["team_members"]["Row"];

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

function getTeamMemberRecord(
  member: TeamRegistrationEditInput["members"][number],
  index: number,
) {
  return {
    deleted_at: null,
    email: member.email.toLowerCase(),
    full_name: member.fullName,
    is_primary_contact: index === 0,
    role: member.role,
  };
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

export async function updateTeamRegistrationAction(
  input: TeamRegistrationEditInput,
): Promise<RegistrationActionResult> {
  const parsed = teamRegistrationEditSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the registration fields and try again.",
    };
  }

  const values = parsed.data;

  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data: existingTeam, error: teamLookupError } = await supabase
      .from("teams")
      .select("*")
      .eq("id", values.registrationId)
      .is("deleted_at", null)
      .maybeSingle();

    if (teamLookupError) {
      return {
        ok: false,
        message: teamLookupError.message,
      };
    }

    if (!existingTeam) {
      return {
        ok: false,
        message: "No active team registration was found for that ID.",
      };
    }

    const { data: existingMembers, error: membersLookupError } = await supabase
      .from("team_members")
      .select("*")
      .eq("team_id", existingTeam.id)
      .is("deleted_at", null)
      .order("is_primary_contact", { ascending: false })
      .order("created_at", { ascending: true });

    if (membersLookupError) {
      return {
        ok: false,
        message: membersLookupError.message,
      };
    }

    const existingMembersById = new Map(
      existingMembers.map((member) => [member.id, member]),
    );
    const explicitSubmittedIds = new Set(
      values.members
        .map((member) => member.id)
        .filter((memberId): memberId is string => Boolean(memberId)),
    );

    for (const memberId of explicitSubmittedIds) {
      if (!existingMembersById.has(memberId)) {
        return {
          ok: false,
          message:
            "One submitted team member no longer belongs to this registration.",
        };
      }
    }

    const existingMembersByEmail = new Map<string, TeamMemberRow>();

    existingMembers.forEach((member) => {
      existingMembersByEmail.set(member.email.toLowerCase(), member);
    });

    const memberIdsToKeep = new Set(explicitSubmittedIds);

    values.members.forEach((member) => {
      if (member.id) {
        return;
      }

      const reusableMember = existingMembersByEmail.get(
        member.email.toLowerCase(),
      );

      if (reusableMember && !explicitSubmittedIds.has(reusableMember.id)) {
        memberIdsToKeep.add(reusableMember.id);
      }
    });

    const memberIdsToSoftDelete = existingMembers
      .filter((member) => !memberIdsToKeep.has(member.id))
      .map((member) => member.id);
    const teamRecord = {
      name: values.teamName,
      organization: values.organization,
      project_summary: values.projectSummary || null,
    };
    const { data: updatedTeam, error: updateTeamError } = await supabase
      .from("teams")
      .update(teamRecord)
      .eq("id", existingTeam.id)
      .is("deleted_at", null)
      .select("*")
      .single();

    if (updateTeamError) {
      return {
        ok: false,
        message: updateTeamError.message,
      };
    }

    if (memberIdsToSoftDelete.length > 0) {
      const { error: softDeleteError } = await supabase
        .from("team_members")
        .update({
          deleted_at: new Date().toISOString(),
          is_primary_contact: false,
        })
        .eq("team_id", existingTeam.id)
        .in("id", memberIdsToSoftDelete);

      if (softDeleteError) {
        return {
          ok: false,
          message: softDeleteError.message,
        };
      }
    }

    const usedExistingMemberIds = new Set<string>();

    for (const [index, member] of values.members.entries()) {
      const memberRecord = getTeamMemberRecord(member, index);

      if (member.id) {
        const { error: updateMemberError } = await supabase
          .from("team_members")
          .update(memberRecord)
          .eq("id", member.id)
          .eq("team_id", existingTeam.id)
          .select("id")
          .single();

        if (updateMemberError) {
          return {
            ok: false,
            message: updateMemberError.message,
          };
        }

        usedExistingMemberIds.add(member.id);
        continue;
      }

      const reusableMember = existingMembersByEmail.get(
        member.email.toLowerCase(),
      );

      if (
        reusableMember &&
        !explicitSubmittedIds.has(reusableMember.id) &&
        !usedExistingMemberIds.has(reusableMember.id)
      ) {
        const { error: updateMemberError } = await supabase
          .from("team_members")
          .update(memberRecord)
          .eq("id", reusableMember.id)
          .eq("team_id", existingTeam.id)
          .select("id")
          .single();

        if (updateMemberError) {
          return {
            ok: false,
            message: updateMemberError.message,
          };
        }

        usedExistingMemberIds.add(reusableMember.id);
        continue;
      }

      const { error: insertMemberError } = await supabase
        .from("team_members")
        .insert({
          ...memberRecord,
          team_id: existingTeam.id,
        });

      if (insertMemberError) {
        return {
          ok: false,
          message: insertMemberError.message,
        };
      }
    }

    const { data: updatedMembers, error: updatedMembersError } = await supabase
      .from("team_members")
      .select("*")
      .eq("team_id", existingTeam.id)
      .is("deleted_at", null)
      .order("is_primary_contact", { ascending: false })
      .order("created_at", { ascending: true });

    if (updatedMembersError) {
      return {
        ok: false,
        message: updatedMembersError.message,
      };
    }

    const { error: auditError } = await supabase.from("audit_logs").insert({
      action: "updated",
      after_state: {
        members: updatedMembers,
        team: updatedTeam,
      } as Json,
      before_state: {
        members: existingMembers,
        team: existingTeam,
      } as Json,
      entity_id: existingTeam.id,
      entity_table: "teams",
      metadata: { source: "team_registration_edit" },
    });

    if (auditError) {
      return {
        ok: false,
        message: `Registration updated, but audit logging failed: ${auditError.message}`,
      };
    }

    revalidatePath(`/registrations/${existingTeam.id}/edit`);

    return {
      id: existingTeam.id,
      ok: true,
      message: "Registration updated. The latest team details are saved.",
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
