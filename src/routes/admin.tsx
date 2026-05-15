import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LogOut, Shield, Users, Lightbulb, Search, Download, RefreshCw, Zap, Check, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — SurgeVector Hackathon" }, { name: "robots", content: "noindex" }] }),
});

type Reg = Tables<"registrations">;
type RegStatus = "pending" | "approved" | "rejected";

function AdminPage() {
  const [session, setSession] = useState<unknown>(undefined); // undefined = loading
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s?.user) {
        supabase.from("user_roles").select("role").eq("user_id", s.user.id).eq("role", "admin").maybeSingle()
          .then(({ data }) => setIsAdmin(!!data));
      } else {
        setIsAdmin(null);
      }
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        supabase.from("user_roles").select("role").eq("user_id", s.user.id).eq("role", "admin").maybeSingle()
          .then(({ data }) => setIsAdmin(!!data));
      } else {
        setIsAdmin(null);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }
  if (!session) return <AuthScreen />;
  if (isAdmin === null) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Checking permissions…</div>;
  }
  if (!isAdmin) return <NoAccessScreen />;
  return <Dashboard />;
}

function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    try {
      const { error } =
        mode === "login"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({
              email,
              password,
              options: { emailRedirectTo: `${window.location.origin}/admin` },
            });
      if (error) toast.error(error.message);
      else if (mode === "signup") toast.success("Account created. An admin must grant you access.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-hero px-4 py-10 sm:px-6">
      <Card className="w-full max-w-md p-8">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-primary-gradient text-primary-foreground shadow-glow">
            <Zap className="w-4 h-4" />
          </span>
          <span className="font-display font-bold">SurgeVector.ai</span>
        </Link>
        <h1 className="font-display text-2xl font-bold">Admin {mode === "login" ? "sign in" : "sign up"}</h1>
        <p className="text-sm text-muted-foreground mt-1">Restricted access. Only granted admins can view registrations.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" minLength={6} required className="mt-1.5" />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary-gradient text-primary-foreground shadow-glow h-11">
            {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>
        <button onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))} className="mt-4 text-sm text-muted-foreground hover:text-foreground">
          {mode === "login" ? "No account? Sign up" : "Have an account? Sign in"}
        </button>
      </Card>
    </div>
  );
}

function NoAccessScreen() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen grid place-items-center px-6">
      <Card className="mx-4 max-w-md p-6 text-center sm:p-8">
        <Shield className="w-10 h-10 mx-auto text-primary" />
        <h1 className="mt-4 font-display text-2xl font-bold">No admin access</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your account is signed in but doesn't have admin rights yet. Ask an organiser to grant you the <code>admin</code> role in <code>user_roles</code>.</p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Button variant="outline" onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin" }); }}>
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
          <Link to="/"><Button>Home</Button></Link>
        </div>
      </Card>
    </div>
  );
}

function Dashboard() {
  const [rows, setRows] = useState<Reg[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("registrations").select("*").order("created_at", { ascending: false });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setRows(data || []);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: RegStatus) {
    const prev = rows;
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } as Reg : r)));
    const { error } = await supabase
      .from("registrations")
      .update({ status } as never)
      .eq("id", id);
    if (error) {
      setRows(prev);
      toast.error(error.message);
      return;
    }
    toast.success(status === "approved" ? "Idea approved" : "Idea rejected");
  }

  const stats = useMemo(() => ({
    total: rows.length,
    participants: rows.filter((r) => r.type === "Participant").length,
    volunteers: rows.filter((r) => r.type === "Volunteer").length,
  }), [rows]);

  const filtered = (type?: "Participant" | "Volunteer") => rows.filter((r) => {
    if (type && r.type !== type) return false;
    if (!q) return true;
    const hay = `${r.full_name} ${r.email} ${r.organization ?? ""} ${r.team_or_department ?? ""} ${r.idea_title ?? ""}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  function exportCsv(type?: "Participant" | "Volunteer") {
    const data = filtered(type);
    const headers = ["type","full_name","email","phone","organization","team_or_department","idea_title","idea_description","preferred_roles","availability_notes","created_at"];
    const csv = [headers.join(",")].concat(
      data.map((r) => headers.map((h) => {
        const v = (r as unknown as Record<string, unknown>)[h];
        const s = Array.isArray(v) ? v.join("; ") : v == null ? "" : String(v);
        return `"${s.replace(/"/g, '""')}"`;
      }).join(","))
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `registrations-${type ?? "all"}-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border/60">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <span className="grid place-items-center w-9 h-9 rounded-lg bg-primary-gradient text-primary-foreground shadow-glow">
              <Zap className="w-4 h-4" />
            </span>
            <span className="truncate font-display font-bold">SurgeVector Admin</span>
          </Link>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Button variant="ghost" size="sm" onClick={load}><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
            <Button variant="outline" size="sm" onClick={async () => { await supabase.auth.signOut(); }}>
              <LogOut className="w-4 h-4 mr-2" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-bold">Registrations</h1>
        <p className="text-muted-foreground mt-1">All hackathon submissions across both tracks.</p>

        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <Stat label="Total" value={stats.total} icon={<Users className="w-5 h-5" />} />
          <Stat label="Participants" value={stats.participants} icon={<Lightbulb className="w-5 h-5" />} />
          <Stat label="Volunteers" value={stats.volunteers} icon={<Shield className="w-5 h-5" />} />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, idea…" className="pl-9" />
          </div>
        </div>

        <Tabs defaultValue="all" className="mt-6">
          <TabsList className="flex h-auto w-full flex-wrap justify-start sm:w-auto">
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="Participant">Participants ({stats.participants})</TabsTrigger>
            <TabsTrigger value="Volunteer">Volunteers ({stats.volunteers})</TabsTrigger>
          </TabsList>
          <TabsContent value="all"><Table rows={filtered()} loading={loading} onExport={() => exportCsv()} onStatus={updateStatus} /></TabsContent>
          <TabsContent value="Participant"><Table rows={filtered("Participant")} loading={loading} onExport={() => exportCsv("Participant")} onStatus={updateStatus} /></TabsContent>
          <TabsContent value="Volunteer">
            <VolunteerTable rows={filtered("Volunteer")} loading={loading} onExport={() => exportCsv("Volunteer")} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <Card className="p-5 flex items-center justify-between">
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-display text-3xl font-bold mt-1">{value}</div>
      </div>
      <div className="w-10 h-10 rounded-xl bg-primary-gradient text-primary-foreground grid place-items-center shadow-glow">{icon}</div>
    </Card>
  );
}

function VolunteerTable({ rows, loading, onExport }: { rows: Reg[]; loading: boolean; onExport: () => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Card className="mt-4 overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">{rows.length} volunteer{rows.length === 1 ? "" : "s"}</p>
        <Button size="sm" variant="outline" onClick={onExport} disabled={!rows.length} className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
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
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No volunteer registrations yet.
                </td>
              </tr>
            )}
            {rows.map((r) => {
              const notes = r.availability_notes?.trim() ?? "";
              const expanded = expandedId === r.id;
              return (
                <tr key={r.id} className="border-t border-border/60 hover:bg-muted/30">
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
                  <td className="max-w-sm px-4 py-3">
                    {notes ? (
                      <div>
                        <p className={expanded ? "" : "line-clamp-2 text-muted-foreground"}>{notes}</p>
                        {notes.length > 120 && (
                          <button
                            type="button"
                            className="mt-1 text-xs font-medium text-primary hover:underline"
                            onClick={() => setExpandedId(expanded ? null : r.id)}
                          >
                            {expanded ? "Show less" : "View full notes"}
                          </button>
                        )}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Table({ rows, loading, onExport, onStatus }: { rows: Reg[]; loading: boolean; onExport: () => void; onStatus: (id: string, status: RegStatus) => void }) {
  return (
    <Card className="mt-4 overflow-hidden">
      <div className="flex flex-col gap-3 p-4 border-b border-border/60 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">{rows.length} record{rows.length === 1 ? "" : "s"}</p>
        <Button size="sm" variant="outline" onClick={onExport} disabled={!rows.length} className="w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Org / Team</th>
              <th className="px-4 py-3">Idea / Roles</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">Loading…</td></tr>
            )}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">No registrations yet.</td></tr>
            )}
            {rows.map((r) => {
              const status = ((r as unknown as { status?: RegStatus }).status) ?? "pending";
              return (
              <tr key={r.id} className="border-t border-border/60 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Badge variant={r.type === "Participant" ? "default" : "secondary"} className={r.type === "Participant" ? "bg-primary-gradient text-primary-foreground" : ""}>{r.type}</Badge>
                </td>
                <td className="px-4 py-3 font-medium">{r.full_name}{r.phone && <div className="text-xs text-muted-foreground font-normal">{r.phone}</div>}</td>
                <td className="px-4 py-3">{r.email}</td>
                <td className="px-4 py-3">
                  {r.organization && <div>{r.organization}</div>}
                  {r.team_or_department && <div className="text-xs text-muted-foreground">{r.team_or_department}</div>}
                </td>
                <td className="px-4 py-3 max-w-sm">
                  {r.idea_title && <div className="font-medium">{r.idea_title}</div>}
                  {r.idea_description && <div className="text-xs text-muted-foreground line-clamp-2">{r.idea_description}</div>}
                  {r.preferred_roles && r.preferred_roles.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {r.preferred_roles.map((p) => <Badge key={p} variant="outline" className="text-[10px]">{p}</Badge>)}
                    </div>
                  )}
                  {r.availability_notes && <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.availability_notes}</div>}
                </td>
                <td className="px-4 py-3">
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
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 border-green-500/40 text-green-600 hover:bg-green-500/10"
                      onClick={() => onStatus(r.id, "approved")}
                      disabled={status === "approved"}
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 border-destructive/40 text-destructive hover:bg-destructive/10"
                      onClick={() => onStatus(r.id, "rejected")}
                      disabled={status === "rejected"}
                    >
                      <X className="w-3.5 h-3.5 mr-1" /> Reject
                    </Button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
