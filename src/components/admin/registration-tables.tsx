import { Fragment, useState } from "react";
import { RegistrationDetails } from "@/components/admin/RegistrationDetails";
import { parseTeamMembers, type Reg, type RegStatus } from "@/lib/registration-admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Check, ChevronDown, ChevronRight, Download, X } from "lucide-react";
import { cn } from "@/lib/utils";

function useExpandableRows() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  function toggle(id: string) {
    setExpandedId((current) => (current === id ? null : id));
  }
  return { expandedId, toggle };
}

function ExpandToggle({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
      aria-expanded={expanded}
      aria-label={expanded ? "Collapse details" : "Expand details"}
    >
      {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </button>
  );
}

function ExpandedRow({ colSpan, row }: { colSpan: number; row: Reg }) {
  return (
    <tr className="border-t border-border/60 bg-muted/20">
      <td colSpan={colSpan} className="px-4 py-4">
        <RegistrationDetails row={row} />
      </td>
    </tr>
  );
}

function OrgTeamCell({ row }: { row: Reg }) {
  const members = parseTeamMembers(row.team_members);
  const hasMeta = row.team_name || row.organization || row.team_or_department;

  if (!hasMeta && members.length === 0) return <>—</>;

  return (
    <div className="min-w-[10rem] space-y-0.5">
      {row.team_name && <div className="font-medium">{row.team_name}</div>}
      {row.organization && (
        <div className={row.team_name ? "text-xs text-muted-foreground" : ""}>{row.organization}</div>
      )}
      {row.team_or_department && <div className="text-xs text-muted-foreground">{row.team_or_department}</div>}
      {!row.team_name && members.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {members.length} member{members.length === 1 ? "" : "s"} (expand for list)
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: RegStatus }) {
  return (
    <Badge
      variant="outline"
      className={
        status === "approved"
          ? "border-green-500/40 bg-green-500/10 text-green-600"
          : status === "rejected"
            ? "border-destructive/40 bg-destructive/10 text-destructive"
            : "border-amber-500/40 bg-amber-500/10 text-amber-600"
      }
    >
      {status}
    </Badge>
  );
}

export function VolunteerTable({
  rows,
  loading,
  onExport,
}: {
  rows: Reg[];
  loading: boolean;
  onExport: () => void;
}) {
  const { expandedId, toggle } = useExpandableRows();
  const colSpan = 7;

  return (
    <Card className="mt-4 overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {rows.length} volunteer{rows.length === 1 ? "" : "s"} · click a row to expand
        </p>
        <Button size="sm" variant="outline" onClick={onExport} disabled={!rows.length} className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="w-10 px-2 py-3" aria-hidden />
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Team / dept</th>
              <th className="px-4 py-3">Preferred roles</th>
              <th className="px-4 py-3">Availability</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={colSpan} className="px-4 py-10 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={colSpan} className="px-4 py-10 text-center text-muted-foreground">
                  No volunteer registrations yet.
                </td>
              </tr>
            )}
            {rows.map((r) => {
              const expanded = expandedId === r.id;
              const notes = r.availability_notes?.trim() ?? "";
              return (
                <Fragment key={r.id}>
                  <tr
                    className={cn(
                      "cursor-pointer border-t border-border/60 hover:bg-muted/30",
                      expanded && "bg-muted/20",
                    )}
                    onClick={() => toggle(r.id)}
                  >
                    <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
                      <ExpandToggle expanded={expanded} onToggle={() => toggle(r.id)} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-medium">{r.full_name}</td>
                    <td className="px-4 py-3">{r.email}</td>
                    <td className="px-4 py-3">{r.team_or_department || "—"}</td>
                    <td className="px-4 py-3">
                      {r.preferred_roles && r.preferred_roles.length > 0 ? (
                        <div className="flex max-w-xs flex-wrap gap-1">
                          {r.preferred_roles.map((p) => (
                            <Badge key={p} variant="outline" className="text-[10px]">
                              {p}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="max-w-xs px-4 py-3 text-muted-foreground">
                      {notes ? <p className="line-clamp-2">{notes}</p> : "—"}
                    </td>
                  </tr>
                  {expanded && <ExpandedRow colSpan={colSpan} row={r} />}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function RegistrationsTable({
  rows,
  loading,
  onExport,
  onStatus,
}: {
  rows: Reg[];
  loading: boolean;
  onExport: () => void;
  onStatus: (id: string, status: RegStatus) => void;
}) {
  const { expandedId, toggle } = useExpandableRows();
  const colSpan = 9;

  return (
    <Card className="mt-4 overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {rows.length} record{rows.length === 1 ? "" : "s"} · click a row to expand
        </p>
        <Button size="sm" variant="outline" onClick={onExport} disabled={!rows.length} className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="w-10 px-2 py-3" aria-hidden />
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Org / team</th>
              <th className="px-4 py-3">Idea</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={colSpan} className="px-4 py-10 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={colSpan} className="px-4 py-10 text-center text-muted-foreground">
                  No registrations yet.
                </td>
              </tr>
            )}
            {rows.map((r) => {
              const isParticipant = r.type === "Participant";
              const status = r.status ?? "pending";
              const expanded = expandedId === r.id;
              const members = parseTeamMembers(r.team_members);

              return (
                <Fragment key={r.id}>
                  <tr
                    className={cn(
                      "cursor-pointer border-t border-border/60 hover:bg-muted/30",
                      expanded && "bg-muted/20",
                    )}
                    onClick={() => toggle(r.id)}
                  >
                    <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
                      <ExpandToggle expanded={expanded} onToggle={() => toggle(r.id)} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={isParticipant ? "default" : "secondary"}
                        className={isParticipant ? "bg-primary-gradient text-primary-foreground" : ""}
                      >
                        {r.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {r.full_name}
                      {r.phone && <div className="text-xs font-normal text-muted-foreground">{r.phone}</div>}
                    </td>
                    <td className="px-4 py-3">{r.email}</td>
                    <td className="px-4 py-3">
                      <OrgTeamCell row={r} />
                    </td>
                    <td className="max-w-xs px-4 py-3">
                      {isParticipant ? (
                        <div>
                          {r.idea_title && <div className="font-medium">{r.idea_title}</div>}
                          {r.idea_description && (
                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{r.idea_description}</p>
                          )}
                          {members.length > 0 && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              +{members.length} team member{members.length === 1 ? "" : "s"}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {r.preferred_roles?.length
                            ? r.preferred_roles.map((p) => (
                                <Badge key={p} variant="outline" className="text-[10px]">
                                  {p}
                                </Badge>
                              ))
                            : "—"}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isParticipant ? <StatusBadge status={status} /> : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      {isParticipant ? (
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-green-500/40 text-green-600 hover:bg-green-500/10"
                            onClick={() => onStatus(r.id, "approved")}
                            disabled={status === "approved"}
                          >
                            <Check className="mr-1 h-3.5 w-3.5" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-destructive/40 text-destructive hover:bg-destructive/10"
                            onClick={() => onStatus(r.id, "rejected")}
                            disabled={status === "rejected"}
                          >
                            <X className="mr-1 h-3.5 w-3.5" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                  {expanded && <ExpandedRow colSpan={colSpan} row={r} />}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
