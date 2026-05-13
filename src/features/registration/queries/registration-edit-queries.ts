import { z } from "zod";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type IdeaSubmissionRow =
  Database["public"]["Tables"]["idea_submissions"]["Row"];
type TeamMemberRow = Database["public"]["Tables"]["team_members"]["Row"];
type TeamRow = Database["public"]["Tables"]["teams"]["Row"];

const registrationIdSchema = z.string().uuid();

const teamEditSelect = `
  id,
  idea_submission_id,
  name,
  organization,
  project_summary,
  status,
  submitted_at,
  updated_at
` as const;

const teamMemberEditSelect = `
  created_at,
  email,
  full_name,
  id,
  is_primary_contact,
  role
` as const;

const ideaSummarySelect = `
  id,
  idea_title,
  status
` as const;

export type TeamRegistrationForEdit = Pick<
  TeamRow,
  | "id"
  | "idea_submission_id"
  | "name"
  | "organization"
  | "project_summary"
  | "status"
  | "submitted_at"
  | "updated_at"
> & {
  idea: Pick<IdeaSubmissionRow, "id" | "idea_title" | "status"> | null;
  members: Pick<
    TeamMemberRow,
    "email" | "full_name" | "id" | "is_primary_contact" | "role"
  >[];
};

export type TeamRegistrationEditQueryResult =
  | {
      ok: true;
      registration: TeamRegistrationForEdit | null;
    }
  | {
      message: string;
      ok: false;
      registration: null;
    };

function getQueryErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes("service role key")) {
      return "Registration editing is not connected yet. Add the Supabase service role key to load this registration.";
    }

    return error.message;
  }

  return "Registration details could not be loaded.";
}

export async function getTeamRegistrationForEdit(
  registrationId: string,
): Promise<TeamRegistrationEditQueryResult> {
  const parsed = registrationIdSchema.safeParse(registrationId);

  if (!parsed.success) {
    return {
      ok: true,
      registration: null,
    };
  }

  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select(teamEditSelect)
      .eq("id", parsed.data)
      .is("deleted_at", null)
      .maybeSingle();

    if (teamError) {
      return {
        message: teamError.message,
        ok: false,
        registration: null,
      };
    }

    if (!team) {
      return {
        ok: true,
        registration: null,
      };
    }

    const { data: members, error: membersError } = await supabase
      .from("team_members")
      .select(teamMemberEditSelect)
      .eq("team_id", team.id)
      .is("deleted_at", null)
      .order("is_primary_contact", { ascending: false })
      .order("created_at", { ascending: true });

    if (membersError) {
      return {
        message: membersError.message,
        ok: false,
        registration: null,
      };
    }

    const idea = team.idea_submission_id
      ? await supabase
          .from("idea_submissions")
          .select(ideaSummarySelect)
          .eq("id", team.idea_submission_id)
          .is("deleted_at", null)
          .maybeSingle()
      : null;

    if (idea?.error) {
      return {
        message: idea.error.message,
        ok: false,
        registration: null,
      };
    }

    return {
      ok: true,
      registration: {
        ...team,
        idea: idea?.data ?? null,
        members: members.map((member) => ({
          email: member.email,
          full_name: member.full_name,
          id: member.id,
          is_primary_contact: member.is_primary_contact,
          role: member.role,
        })),
      },
    };
  } catch (error) {
    return {
      message: getQueryErrorMessage(error),
      ok: false,
      registration: null,
    };
  }
}
