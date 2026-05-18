import type { Database } from "@/integrations/supabase/types";

type RegistrationStatus = Database["public"]["Enums"]["registration_status"];

/**
 * Controls which registration statuses allow participant self-editing.
 *
 * "all"           – always editable regardless of review status
 * string[]        – only editable when the registration's status is in this list
 *
 * Examples:
 *   "all"                    – always editable
 *   ["pending"]              – locked once approved or rejected  ← default
 *   ["pending", "approved"]  – only locked after rejection
 */
export const EDITABLE_STATUSES: "all" | RegistrationStatus[] = ["pending"];

export function isEditingAllowed(status: RegistrationStatus): boolean {
  if (EDITABLE_STATUSES === "all") return true;
  return (EDITABLE_STATUSES as RegistrationStatus[]).includes(status);
}
