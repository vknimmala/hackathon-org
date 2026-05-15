import type { Tables } from "@/integrations/supabase/types";

export type Reg = Tables<"registrations">;
export type RegStatus = "pending" | "approved" | "rejected";

export type TeamMember = { name: string; email: string };

export function parseTeamMembers(raw: Reg["team_members"]): TeamMember[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    if (typeof item !== "object" || item === null) return [];
    const name = "name" in item ? String(item.name).trim() : "";
    const email = "email" in item ? String(item.email).trim() : "";
    if (!name && !email) return [];
    return [{ name, email }];
  });
}

export function registrationSearchText(r: Reg): string {
  const members = parseTeamMembers(r.team_members);
  return [
    r.full_name,
    r.email,
    r.phone,
    r.organization,
    r.team_or_department,
    r.team_name,
    r.idea_title,
    r.idea_description,
    r.availability_notes,
    ...(r.preferred_roles ?? []),
    ...members.flatMap((m) => [m.name, m.email]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function formatTeamMembersForCsv(members: TeamMember[]): string {
  if (!members.length) return "";
  return members.map((m) => `${m.name} <${m.email}>`).join("; ");
}

export const PARTICIPANT_CSV_HEADERS = [
  "type",
  "status",
  "full_name",
  "email",
  "phone",
  "organization",
  "team_or_department",
  "team_name",
  "team_members",
  "idea_title",
  "idea_description",
  "created_at",
] as const;

export const VOLUNTEER_CSV_HEADERS = [
  "type",
  "full_name",
  "email",
  "team_or_department",
  "preferred_roles",
  "availability_notes",
  "created_at",
] as const;
