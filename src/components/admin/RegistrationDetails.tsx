import type { Reg } from "@/lib/registration-admin";
import { parseTeamMembers } from "@/lib/registration-admin";
import { Badge } from "@/components/ui/badge";

export function RegistrationDetails({ row }: { row: Reg }) {
  if (row.type === "Volunteer") {
    return <VolunteerDetails row={row} />;
  }
  return <ParticipantDetails row={row} />;
}

function DetailBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{children}</dd>
    </div>
  );
}

function ParticipantDetails({ row }: { row: Reg }) {
  const members = parseTeamMembers(row.team_members);

  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      <DetailBlock label="Organization">{row.organization || "—"}</DetailBlock>
      <DetailBlock label="Team or department">{row.team_or_department || "—"}</DetailBlock>
      <DetailBlock label="Team name">
        {row.team_name ? <span className="font-medium">{row.team_name}</span> : "—"}
      </DetailBlock>
      <DetailBlock label="Phone">{row.phone || "—"}</DetailBlock>
      <div className="sm:col-span-2">
        <DetailBlock label="Idea description">
          <p className="whitespace-pre-wrap">{row.idea_description || "—"}</p>
        </DetailBlock>
      </div>
      <div className="sm:col-span-2">
        <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Team members</dt>
        <dd className="mt-2">
          {members.length === 0 ? (
            <span className="text-sm text-muted-foreground">No additional members listed.</span>
          ) : (
            <ul className="divide-y divide-border/60 rounded-lg border border-border/60">
              {members.map((m, i) => (
                <li
                  key={`${m.email}-${i}`}
                  className="flex flex-col gap-0.5 px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-medium">{m.name}</span>
                  <span className="text-muted-foreground">{m.email}</span>
                </li>
              ))}
            </ul>
          )}
        </dd>
      </div>
    </dl>
  );
}

function VolunteerDetails({ row }: { row: Reg }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      <DetailBlock label="Team or department">{row.team_or_department || "—"}</DetailBlock>
      <DetailBlock label="Preferred roles">
        {row.preferred_roles && row.preferred_roles.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {row.preferred_roles.map((role) => (
              <Badge key={role} variant="outline" className="text-xs">
                {role}
              </Badge>
            ))}
          </div>
        ) : (
          "—"
        )}
      </DetailBlock>
      <div className="sm:col-span-2">
        <DetailBlock label="Availability notes">
          <p className="whitespace-pre-wrap">{row.availability_notes || "—"}</p>
        </DetailBlock>
      </div>
    </dl>
  );
}
