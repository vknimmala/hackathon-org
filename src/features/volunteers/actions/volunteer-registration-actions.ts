"use server";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";
import {
  volunteerRegistrationSchema,
  type VolunteerRegistrationInput,
} from "@/validations/volunteer";

export type VolunteerRegistrationActionResult =
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
      return "Volunteer registration is not connected yet. Add the Supabase service role key and try again.";
    }

    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export async function submitVolunteerRegistrationAction(
  input: VolunteerRegistrationInput,
): Promise<VolunteerRegistrationActionResult> {
  const parsed = volunteerRegistrationSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the volunteer registration fields and try again.",
    };
  }

  const values = parsed.data;
  const volunteerRecord = {
    availability_notes: values.availabilityNotes || null,
    department: values.department,
    email: values.email.toLowerCase(),
    full_name: values.fullName,
    preferred_roles: values.preferredRoles,
    status: "submitted" as const,
  };

  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("volunteer_registrations")
      .insert(volunteerRecord)
      .select("id")
      .single();

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    const { error: auditError } = await supabase.from("audit_logs").insert({
      action: "submitted",
      after_state: volunteerRecord as Json,
      entity_id: data.id,
      entity_table: "volunteer_registrations",
      metadata: { source: "volunteer_registration_form" },
    });

    if (auditError) {
      return {
        ok: false,
        message: `Volunteer registration was submitted, but audit logging failed: ${auditError.message}`,
      };
    }

    return {
      ok: true,
      id: data.id,
      message:
        "Volunteer registration submitted. Organizers will use it for Phase 1 event coordination.",
    };
  } catch (error) {
    return {
      ok: false,
      message: getActionErrorMessage(error),
    };
  }
}
