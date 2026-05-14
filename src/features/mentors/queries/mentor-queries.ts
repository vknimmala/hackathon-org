import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type MentorRow = Database["public"]["Tables"]["sv_mentors"]["Row"];

const mentorListSelect = `
  capacity,
  created_at,
  current_team_count,
  email,
  expertise,
  full_name,
  id,
  is_available
` as const;

export type MentorListItem = Pick<
  MentorRow,
  | "capacity"
  | "created_at"
  | "current_team_count"
  | "email"
  | "expertise"
  | "full_name"
  | "id"
  | "is_available"
>;

export type MentorListResult =
  | {
      mentors: MentorListItem[];
      ok: true;
    }
  | {
      mentors: [];
      message: string;
      ok: false;
    };

function getQueryErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes("service role key")) {
      return "Mentor management is not connected yet. Add the Supabase service role key to load mentors.";
    }

    return error.message;
  }

  return "Mentors could not be loaded.";
}

export async function getMentorsForAdmin(): Promise<MentorListResult> {
  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("sv_mentors")
      .select(mentorListSelect)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        mentors: [],
        message: error.message,
        ok: false,
      };
    }

    return {
      mentors: data,
      ok: true,
    };
  } catch (error) {
    return {
      mentors: [],
      message: getQueryErrorMessage(error),
      ok: false,
    };
  }
}
