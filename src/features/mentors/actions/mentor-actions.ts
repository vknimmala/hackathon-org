"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";
import { mentorCreateFormSchema } from "@/validations/mentor";

export type MentorCreateActionState = {
  id?: string;
  ok: boolean;
  message: string;
};

export const initialMentorCreateActionState: MentorCreateActionState = {
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
      return "Mentor management is not connected yet. Add the Supabase service role key and try again.";
    }

    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export async function createMentorAction(
  _previousState: MentorCreateActionState,
  formData: FormData,
): Promise<MentorCreateActionState> {
  const parsed = mentorCreateFormSchema.safeParse({
    capacity: getTextValue(formData, "capacity"),
    email: getTextValue(formData, "email"),
    expertise: getTextValue(formData, "expertise"),
    fullName: getTextValue(formData, "fullName"),
    isAvailable: formData.get("isAvailable") === "on",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the mentor profile fields and try again.",
    };
  }

  const values = parsed.data;
  const mentorRecord = {
    capacity: values.capacity,
    email: values.email.toLowerCase(),
    expertise: values.expertise,
    full_name: values.fullName,
    is_available: values.isAvailable,
  };

  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("sv_mentors")
      .insert(mentorRecord)
      .select("*")
      .single();

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    const { error: auditError } = await supabase.from("sv_audit_logs").insert({
      action: "created",
      after_state: data as unknown as Json,
      entity_id: data.id,
      entity_table: "sv_mentors",
      metadata: { source: "admin_mentor_create" },
    });

    if (auditError) {
      return {
        ok: false,
        message: `Mentor profile was created, but audit logging failed: ${auditError.message}`,
      };
    }

    revalidatePath("/admin/mentors");

    return {
      id: data.id,
      ok: true,
      message: "Mentor profile created for Phase 1 coordination.",
    };
  } catch (error) {
    return {
      ok: false,
      message: getActionErrorMessage(error),
    };
  }
}
