import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  head: () => ({ meta: [{ title: "Register — SurgeVector Hackathon 2026" }] }),
});

const teamMemberSchema = z.object({
  name: z.string().trim().min(1, "Name required"),
  email: z.string().trim().min(1, "Email required").email("Enter a valid email"),
});

const participantSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().trim().optional().or(z.literal("")),
  organization: z.string().trim().optional().or(z.literal("")),
  team_or_department: z.string().trim().optional().or(z.literal("")),
  team_name: z.string().trim().optional().or(z.literal("")),
  idea_title: z.string().trim().min(1, "Idea title is required"),
  idea_description: z.string().trim().min(1, "Idea description is required"),
});

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

type Errors = Record<string, string>;

function flattenErrors(err: z.ZodError): Errors {
  const out: Errors = {};
  for (const issue of err.issues) {
    const key = issue.path.map(String).join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

function RegisterPage() {
  const [done, setDone] = useState<boolean>(false);

  if (done) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 grid place-items-center px-6 py-24">
          <div className="max-w-md text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary-gradient grid place-items-center shadow-glow">
              <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="mt-6 font-display text-3xl font-bold">You're in.</h1>
            <p className="mt-3 text-muted-foreground">Your registration was received. Organisers will reach out via email with next steps.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={() => setDone(false)} variant="outline">Submit another</Button>
              <Link to="/"><Button className="bg-primary-gradient text-primary-foreground shadow-glow">Back home</Button></Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 bg-hero">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to hackathon
          </Link>

          <div className="mt-8">
            <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Registration</span>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold tracking-tight">Join the hackathon.</h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">Submit your idea, name your team, and add up to four team members.</p>
          </div>

          <div className="mt-10">
            <ParticipantForm onDone={() => setDone(true)} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ParticipantForm({ onDone }: { onDone: () => void }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [organization, setOrganization] = useState("");
  const [teamMembers, setTeamMembers] = useState<{ name: string; email: string }[]>([]);

  function addMember() {
    if (teamMembers.length >= 4) return;
    setTeamMembers((prev) => [...prev, { name: "", email: "" }]);
  }
  function removeMember(idx: number) {
    setTeamMembers((prev) => prev.filter((_, i) => i !== idx));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => { if (k.startsWith("team_members.")) delete next[k]; });
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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = { ...Object.fromEntries(fd.entries()), organization };
    const parsed = participantSchema.safeParse(raw);

    // Validate non-empty team members
    const memberErrors: Errors = {};
    teamMembers.forEach((m, i) => {
      const r = teamMemberSchema.safeParse(m);
      if (!r.success) {
        for (const issue of r.error.issues) {
          memberErrors[`team_members.${i}.${issue.path[0]}`] = issue.message;
        }
      }
    });

    if (!parsed.success || Object.keys(memberErrors).length > 0) {
      setErrors({ ...(parsed.success ? {} : flattenErrors(parsed.error)), ...memberErrors });
      return;
    }
    setErrors({});
    setLoading(true);
    const { error } = await supabase.from("registrations").insert({
      type: "Participant",
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      organization: parsed.data.organization || null,
      team_or_department: parsed.data.team_or_department || null,
      team_name: parsed.data.team_name || null,
      team_members: teamMembers,
      idea_title: parsed.data.idea_title,
      idea_description: parsed.data.idea_description,
    } as never);
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Registration submitted!");
    onDone();
  }

  function clearError(name: string) {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft space-y-5 sm:p-8">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full name" name="full_name" required placeholder="Your name" error={errors.full_name} onChange={() => clearError("full_name")} />
        <Field label="Work email" name="email" type="email" required placeholder="you@surgevector.ai" error={errors.email} onChange={() => clearError("email")} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Phone (optional)" name="phone" placeholder="+91 xxx xxx xxxx" error={errors.phone} onChange={() => clearError("phone")} />
        <div>
          <Label htmlFor="organization">Organization</Label>
          <Select value={organization} onValueChange={(v) => { setOrganization(v); clearError("organization"); }}>
            <SelectTrigger id="organization" className="mt-1.5">
              <SelectValue placeholder="Select organization" />
            </SelectTrigger>
            <SelectContent>
              {ORGANIZATION_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.organization && <p className="mt-1.5 text-xs text-destructive">{errors.organization}</p>}
        </div>
      </div>
      <Field label="Team or department" name="team_or_department" placeholder="AI Platform, Engineering, ..." error={errors.team_or_department} onChange={() => clearError("team_or_department")} />

      {/* Team section */}
      <div className="rounded-2xl border border-border/60 bg-background/50 p-5 space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display font-semibold">Team</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Add a team name and up to 4 members.</p>
          </div>
        </div>
        <Field label="Team name" name="team_name" placeholder="e.g. Vector Surge" error={errors.team_name} onChange={() => clearError("team_name")} />
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
                  className={`mt-1.5 ${errors[`team_members.${i}.name`] ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                {errors[`team_members.${i}.name`] && <p className="mt-1.5 text-xs text-destructive">{errors[`team_members.${i}.name`]}</p>}
              </div>
              <div>
                <Label htmlFor={`tm_email_${i}`}>Member {i + 1} email</Label>
                <Input
                  id={`tm_email_${i}`}
                  type="email"
                  value={m.email}
                  onChange={(e) => updateMember(i, "email", e.target.value)}
                  placeholder="member@surgevector.ai"
                  className={`mt-1.5 ${errors[`team_members.${i}.email`] ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                {errors[`team_members.${i}.email`] && <p className="mt-1.5 text-xs text-destructive">{errors[`team_members.${i}.email`]}</p>}
              </div>
              <div className="flex justify-end sm:pt-7">
                <Button type="button" variant="ghost" size="icon" onClick={() => removeMember(i)} aria-label="Remove member">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
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
        </div>
      </div>

      <Field label="Idea title" name="idea_title" required placeholder="A short, memorable project name" error={errors.idea_title} onChange={() => clearError("idea_title")} />
      <div>
        <Label htmlFor="idea_description">Idea description</Label>
        <Textarea
          id="idea_description"
          name="idea_description"
          rows={5}
          placeholder="What problem does it solve? How will AI be used?"
          className={`mt-1.5 ${errors.idea_description ? "border-destructive focus-visible:ring-destructive" : ""}`}
          onChange={() => clearError("idea_description")}
          aria-invalid={!!errors.idea_description}
        />
        {errors.idea_description && <p className="mt-1.5 text-xs text-destructive">{errors.idea_description}</p>}
      </div>
      <Button type="submit" disabled={loading} className="bg-primary-gradient text-primary-foreground shadow-glow h-11 px-6">
        {loading ? "Submitting..." : "Submit registration"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  error,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  onChange?: () => void;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}{required && <span className="text-primary"> *</span>}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        onChange={onChange}
        className={`mt-1.5 ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
      />
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
