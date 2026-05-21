import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { isEditingAllowed } from "@/config/registration-edit";
import { REGISTRATIONS_OPEN, REGISTRATION_CLOSED_MESSAGE } from "@/config/registrations-open";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogOut, Plus, Trash2, Lock, Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "My Registration — SurgeVector Hackathon 2026" }] }),
});

type Reg = Tables<"registrations">;
type TeamMember = { name: string; email: string };
type Errors = Record<string, string>;

function parseTeamMembers(raw: unknown): TeamMember[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (m): m is TeamMember =>
      typeof m === "object" && m !== null && "name" in m && "email" in m,
  );
}

const ORGANIZATION_OPTIONS = [
  "Sales",
  "Finance",
  "HR",
  "GTM",
  "App Modernisation",
  "Data Engineering",
  "Taxilla",
  "SurgeVector Platform",
  "Products",
  "Others",
] as const;

const PREFERRED_ROLES = [
  "Check-in support",
  "Participant support",
  "Judging support",
  "Logistics",
  "Photography/Media",
  "Technical support",
];

const STATUS_META: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Pending review", variant: "outline" },
  approved: { label: "Approved", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
};

const teamMemberSchema = z.object({
  name: z.string().trim().min(1, "Name required"),
  email: z.string().trim().min(1, "Email required").email("Valid email required"),
});

function flattenErrors(err: z.ZodError): Errors {
  const out: Errors = {};
  for (const issue of err.issues) {
    const key = issue.path.map(String).join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

// ─── Page shell ─────────────────────────────────────────────────────────────

function DashboardPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<unknown>(undefined); // undefined = loading
  const [reg, setReg] = useState<Reg | null | undefined>(undefined);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) navigate({ to: "/login", replace: true });
    });

    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      if (!s) {
        navigate({ to: "/login", replace: true });
        return;
      }
      const { data } = await supabase
        .from("registrations")
        .select("*")
        .eq("user_id", s.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setReg(data ?? null);
      setFetching(false);
    });

    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  if (session === undefined || fetching) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  if (!reg) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 grid place-items-center px-6 py-24 bg-hero">
          <div className="max-w-md text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-accent grid place-items-center">
              <span className="text-2xl">🔍</span>
            </div>
            <h1 className="mt-6 font-display text-2xl font-bold">No registration found</h1>
            <p className="mt-2 text-muted-foreground text-sm">
              We couldn't find a registration linked to your account. Make sure you're
              signed in with the same email you used when registering.
            </p>
            {!REGISTRATIONS_OPEN && (
              <p className="mt-4 text-sm text-muted-foreground">{REGISTRATION_CLOSED_MESSAGE}</p>
            )}
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              {REGISTRATIONS_OPEN && (
                <Link to="/register">
                  <Button className="bg-primary-gradient text-primary-foreground shadow-glow">
                    Register now
                  </Button>
                </Link>
              )}
              <Button variant="outline" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" /> Sign out
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const meta = STATUS_META[reg.status] ?? STATUS_META.pending;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 bg-hero">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                My Registration
              </span>
              <h1 className="mt-1 font-display text-3xl font-bold">Your submission</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={meta.variant}>{meta.label}</Badge>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" /> Sign out
              </Button>
            </div>
          </div>

          <div className="mt-8">
            {reg.type === "Participant" ? (
              <ParticipantEdit reg={reg} onSaved={setReg} />
            ) : (
              <VolunteerEdit reg={reg} onSaved={setReg} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Locked banner ───────────────────────────────────────────────────────────

function EditLockedBanner({ status }: { status: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/50 p-4">
      <Lock className="mt-0.5 w-4 h-4 shrink-0 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        Your registration has been <strong>{status}</strong>. Editing is locked.
        Contact an organiser if you need to make changes.
      </p>
    </div>
  );
}

// ─── Field helper ────────────────────────────────────────────────────────────

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  error,
  defaultValue,
  disabled,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: () => void;
}) {
  return (
    <div>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-primary"> *</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        disabled={disabled}
        aria-invalid={!!error}
        onChange={onChange}
        className={`mt-1.5 ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
      />
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ─── Participant edit form ───────────────────────────────────────────────────

function ParticipantEdit({ reg, onSaved }: { reg: Reg; onSaved: (r: Reg) => void }) {
  const canEdit = isEditingAllowed(reg.status);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [organization, setOrganization] = useState(reg.organization ?? "");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    parseTeamMembers(reg.team_members),
  );

  function addMember() {
    if (teamMembers.length >= 4) return;
    setTeamMembers((prev) => [...prev, { name: "", email: "" }]);
  }

  function removeMember(idx: number) {
    setTeamMembers((prev) => prev.filter((_, i) => i !== idx));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (k.startsWith("team_members.")) delete next[k];
      });
      return next;
    });
  }

  function updateMember(idx: number, field: "name" | "email", value: string) {
    setTeamMembers((prev) => prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m)));
    setErrors((prev) => {
      const k = `team_members.${idx}.${field}`;
      if (!prev[k]) return prev;
      const { [k]: _, ...rest } = prev;
      return rest;
    });
  }

  function clearError(name: string) {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canEdit) return;

    const fd = new FormData(e.currentTarget);

    const memberErrors: Errors = {};
    teamMembers.forEach((m, i) => {
      const r = teamMemberSchema.safeParse(m);
      if (!r.success) {
        for (const issue of r.error.issues) {
          memberErrors[`team_members.${i}.${issue.path[0]}`] = issue.message;
        }
      }
    });

    if (Object.keys(memberErrors).length > 0) {
      setErrors(memberErrors);
      return;
    }

    const full_name = String(fd.get("full_name")).trim();
    const phone = String(fd.get("phone")).trim() || null;
    const team_or_department = String(fd.get("team_or_department")).trim() || null;
    const team_name = String(fd.get("team_name")).trim() || null;
    const idea_title = String(fd.get("idea_title")).trim();
    const idea_description = String(fd.get("idea_description")).trim();

    const fieldErrors: Errors = {};
    if (!full_name) fieldErrors.full_name = "Full name is required";
    if (!idea_title) fieldErrors.idea_title = "Idea title is required";
    if (!idea_description) fieldErrors.idea_description = "Idea description is required";

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    const { data, error } = await supabase
      .from("registrations")
      .update({
        full_name,
        phone,
        organization: organization || null,
        team_or_department,
        team_name,
        team_members: teamMembers,
        idea_title,
        idea_description,
      })
      .eq("id", reg.id)
      .select()
      .single();
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    if (data) onSaved(data);
    setSaved(true);
    toast.success("Registration updated.");
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {!canEdit && <EditLockedBanner status={reg.status} />}

      {/* Personal info */}
      <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft space-y-4 sm:p-8">
        <h2 className="font-display font-semibold text-lg">Personal info</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Full name"
            name="full_name"
            required
            placeholder="Your name"
            defaultValue={reg.full_name}
            disabled={!canEdit}
            error={errors.full_name}
            onChange={() => clearError("full_name")}
          />
          <div>
            <Label htmlFor="email_ro">Work email</Label>
            <Input
              id="email_ro"
              value={reg.email}
              disabled
              className="mt-1.5 opacity-60"
              title="Email cannot be changed"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Phone (optional)"
            name="phone"
            placeholder="+91 xxx xxx xxxx"
            defaultValue={reg.phone ?? ""}
            disabled={!canEdit}
            error={errors.phone}
            onChange={() => clearError("phone")}
          />
          <div>
            <Label htmlFor="organization">Organization</Label>
            <Select
              value={organization}
              onValueChange={(v) => { setOrganization(v); clearError("organization"); }}
              disabled={!canEdit}
            >
              <SelectTrigger id="organization" className="mt-1.5">
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent>
                {ORGANIZATION_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Field
          label="Team or department"
          name="team_or_department"
          placeholder="AI Platform, Engineering, ..."
          defaultValue={reg.team_or_department ?? ""}
          disabled={!canEdit}
          error={errors.team_or_department}
          onChange={() => clearError("team_or_department")}
        />
      </section>

      {/* Team */}
      <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft space-y-4 sm:p-8">
        <h2 className="font-display font-semibold text-lg">Team</h2>
        <Field
          label="Team name"
          name="team_name"
          placeholder="e.g. Vector Surge"
          defaultValue={reg.team_name ?? ""}
          disabled={!canEdit}
          error={errors.team_name}
          onChange={() => clearError("team_name")}
        />
        <div className="space-y-3">
          {teamMembers.map((m, i) => (
            <div key={i} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-start">
              <div>
                <Label htmlFor={`tm_name_${i}`}>Member {i + 1} name</Label>
                <Input
                  id={`tm_name_${i}`}
                  value={m.name}
                  onChange={(e) => updateMember(i, "name", e.target.value)}
                  placeholder="Name"
                  disabled={!canEdit}
                  className={`mt-1.5 ${errors[`team_members.${i}.name`] ? "border-destructive" : ""}`}
                />
                {errors[`team_members.${i}.name`] && (
                  <p className="mt-1.5 text-xs text-destructive">{errors[`team_members.${i}.name`]}</p>
                )}
              </div>
              <div>
                <Label htmlFor={`tm_email_${i}`}>Member {i + 1} email</Label>
                <Input
                  id={`tm_email_${i}`}
                  type="email"
                  value={m.email}
                  onChange={(e) => updateMember(i, "email", e.target.value)}
                  placeholder="member@surgevector.ai"
                  disabled={!canEdit}
                  className={`mt-1.5 ${errors[`team_members.${i}.email`] ? "border-destructive" : ""}`}
                />
                {errors[`team_members.${i}.email`] && (
                  <p className="mt-1.5 text-xs text-destructive">{errors[`team_members.${i}.email`]}</p>
                )}
              </div>
              {canEdit && (
                <div className="flex justify-end sm:pt-7">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMember(i)}
                    aria-label="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
          {canEdit && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addMember}
              disabled={teamMembers.length >= 4}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add team member {teamMembers.length > 0 && `(${teamMembers.length}/4)`}
            </Button>
          )}
        </div>
      </section>

      {/* Idea */}
      <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft space-y-4 sm:p-8">
        <h2 className="font-display font-semibold text-lg">Idea</h2>
        <Field
          label="Idea title"
          name="idea_title"
          required
          placeholder="A short, memorable project name"
          defaultValue={reg.idea_title ?? ""}
          disabled={!canEdit}
          error={errors.idea_title}
          onChange={() => clearError("idea_title")}
        />
        <div>
          <Label htmlFor="idea_description">
            Idea description <span className="text-primary">*</span>
          </Label>
          <Textarea
            id="idea_description"
            name="idea_description"
            rows={5}
            placeholder="What problem does it solve? How will AI be used?"
            defaultValue={reg.idea_description ?? ""}
            disabled={!canEdit}
            aria-invalid={!!errors.idea_description}
            onChange={() => clearError("idea_description")}
            className={`mt-1.5 ${errors.idea_description ? "border-destructive" : ""}`}
          />
          {errors.idea_description && (
            <p className="mt-1.5 text-xs text-destructive">{errors.idea_description}</p>
          )}
        </div>
      </section>

      {canEdit && (
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary-gradient text-primary-foreground shadow-glow h-11 px-8"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" /> Saved
            </>
          ) : loading ? (
            "Saving…"
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Save changes
            </>
          )}
        </Button>
      )}
    </form>
  );
}

// ─── Volunteer edit form ─────────────────────────────────────────────────────

function VolunteerEdit({ reg, onSaved }: { reg: Reg; onSaved: (r: Reg) => void }) {
  const canEdit = isEditingAllowed(reg.status);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [roles, setRoles] = useState<string[]>(reg.preferred_roles ?? []);

  function toggleRole(role: string) {
    setRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
    setErrors((prev) => {
      if (!prev.preferred_roles) return prev;
      const { preferred_roles: _, ...rest } = prev;
      return rest;
    });
  }

  function clearError(name: string) {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canEdit) return;

    const fd = new FormData(e.currentTarget);
    const full_name = String(fd.get("full_name")).trim();
    const team_or_department = String(fd.get("team_or_department")).trim() || null;
    const availability_notes = String(fd.get("availability_notes")).trim() || null;

    const fieldErrors: Errors = {};
    if (!full_name) fieldErrors.full_name = "Full name is required";
    if (roles.length === 0) fieldErrors.preferred_roles = "Select at least one role";

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    const { data, error } = await supabase
      .from("registrations")
      .update({ full_name, team_or_department, preferred_roles: roles, availability_notes })
      .eq("id", reg.id)
      .select()
      .single();
    setLoading(false);

    if (error) { toast.error(error.message); return; }
    if (data) onSaved(data);
    setSaved(true);
    toast.success("Registration updated.");
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {!canEdit && <EditLockedBanner status={reg.status} />}

      <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft space-y-4 sm:p-8">
        <h2 className="font-display font-semibold text-lg">Personal info</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Full name"
            name="full_name"
            required
            placeholder="Your name"
            defaultValue={reg.full_name}
            disabled={!canEdit}
            error={errors.full_name}
            onChange={() => clearError("full_name")}
          />
          <div>
            <Label htmlFor="email_ro">Work email</Label>
            <Input
              id="email_ro"
              value={reg.email}
              disabled
              className="mt-1.5 opacity-60"
              title="Email cannot be changed"
            />
          </div>
        </div>
        <Field
          label="Team or department"
          name="team_or_department"
          placeholder="AI Platform, Engineering, ..."
          defaultValue={reg.team_or_department ?? ""}
          disabled={!canEdit}
          error={errors.team_or_department}
          onChange={() => clearError("team_or_department")}
        />
      </section>

      <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft space-y-4 sm:p-8">
        <h2 className="font-display font-semibold text-lg">Volunteer preferences</h2>
        <fieldset>
          <legend className="text-sm font-medium">
            Preferred roles <span className="text-primary">*</span>
          </legend>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PREFERRED_ROLES.map((role) => {
              const id = `role-${role.replace(/\s+/g, "-").toLowerCase()}`;
              return (
                <label
                  key={role}
                  htmlFor={id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition-colors ${
                    roles.includes(role)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  } ${!canEdit ? "pointer-events-none opacity-60" : ""}`}
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={roles.includes(role)}
                    onChange={() => toggleRole(role)}
                    disabled={!canEdit}
                    className="accent-primary"
                  />
                  {role}
                </label>
              );
            })}
          </div>
          {errors.preferred_roles && (
            <p className="mt-2 text-xs text-destructive">{errors.preferred_roles}</p>
          )}
        </fieldset>
        <div>
          <Label htmlFor="availability_notes">Availability notes (optional)</Label>
          <Textarea
            id="availability_notes"
            name="availability_notes"
            rows={3}
            placeholder="Any constraints on your availability during the hackathon?"
            defaultValue={reg.availability_notes ?? ""}
            disabled={!canEdit}
            className="mt-1.5"
          />
        </div>
      </section>

      {canEdit && (
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary-gradient text-primary-foreground shadow-glow h-11 px-8"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" /> Saved
            </>
          ) : loading ? (
            "Saving…"
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Save changes
            </>
          )}
        </Button>
      )}
    </form>
  );
}
