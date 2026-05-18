import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RegistrationsTable, VolunteerTable } from "@/components/admin/registration-tables";
import {
  formatTeamMembersForCsv,
  parseTeamMembers,
  registrationSearchText,
  type Reg,
  type RegStatus,
  PARTICIPANT_CSV_HEADERS,
  VOLUNTEER_CSV_HEADERS,
} from "@/lib/registration-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  LogOut,
  Shield,
  Users,
  Lightbulb,
  Search,
  Download,
  RefreshCw,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — SurgeVector Hackathon" }, { name: "robots", content: "noindex" }] }),
});

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
    toast.success(
      status === "approved"
        ? "Participant idea approved. Team can proceed with the hackathon."
        : "Participant idea rejected.",
    );
    // Fire-and-forget: send status notification email to the participant
    const reg = rows.find((r) => r.id === id);
    if (reg && (status === "approved" || status === "rejected")) {
      supabase.functions
        .invoke("notify-status-change", {
          body: {
            registration_id: id,
            status,
            email: reg.email,
            full_name: reg.full_name,
            idea_title: reg.idea_title ?? null,
          },
        })
        .catch((err) => console.error("notify-status-change:", err));
    }
  }

  const stats = useMemo(() => ({
    total: rows.length,
    participants: rows.filter((r) => r.type === "Participant").length,
    volunteers: rows.filter((r) => r.type === "Volunteer").length,
  }), [rows]);

  const filtered = (type?: "Participant" | "Volunteer") => rows.filter((r) => {
    if (type && r.type !== type) return false;
    if (!q) return true;
    return registrationSearchText(r).includes(q.toLowerCase());
  });

  function exportCsv(type?: "Participant" | "Volunteer") {
    const data = filtered(type);
    const headers =
      type === "Volunteer" ? [...VOLUNTEER_CSV_HEADERS] : [...PARTICIPANT_CSV_HEADERS];
    const csv = [headers.join(",")].concat(
      data.map((r) =>
        headers
          .map((h) => {
            let v: unknown = r[h as keyof Reg];
            if (h === "team_members") v = formatTeamMembersForCsv(parseTeamMembers(r.team_members));
            if (h === "preferred_roles" && Array.isArray(v)) v = v.join("; ");
            const s = v == null ? "" : String(v);
            return `"${s.replace(/"/g, '""')}"`;
          })
          .join(","),
      ),
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
          <TabsContent value="all">
            <RegistrationsTable rows={filtered()} loading={loading} onExport={() => exportCsv()} onStatus={updateStatus} />
          </TabsContent>
          <TabsContent value="Participant">
            <RegistrationsTable
              rows={filtered("Participant")}
              loading={loading}
              onExport={() => exportCsv("Participant")}
              onStatus={updateStatus}
            />
          </TabsContent>
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

