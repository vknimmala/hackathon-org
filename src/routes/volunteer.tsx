import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowLeft, Calendar, CheckCircle2, Handshake, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RegistrationTypeToggle } from "@/components/registration/RegistrationTypeToggle";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/volunteer")({
  component: VolunteerPage,
  head: () => ({ meta: [{ title: "Volunteer — SurgeVector Hackathon 2026" }] }),
});

const PREFERRED_ROLES = [
  "Check-in support",
  "Participant support",
  "Mentor coordination",
  "Demo day logistics",
] as const;

const volunteerSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().min(1, "Work email is required").email("Enter a valid email"),
  team_or_department: z.string().trim().optional().or(z.literal("")),
  availability_notes: z.string().trim().optional().or(z.literal("")),
});

type Errors = Record<string, string>;

function flattenErrors(err: z.ZodError): Errors {
  const out: Errors = {};
  for (const issue of err.issues) {
    const key = issue.path.map(String).join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

const featureCards = [
  {
    icon: Handshake,
    title: "Support the event",
    body: "Help with check-ins, participant questions, logistics, and demo-day readiness.",
  },
  {
    icon: Calendar,
    title: "Share availability",
    body: "Share the times you can help so organizers can coordinate coverage manually.",
  },
  {
    icon: User,
    title: "Enable builders",
    body: "Keep the hackathon moving for SurgeVector and Taxilla builders without adding shift workflows.",
  },
] as const;

function VolunteerPage() {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <main className="grid min-h-screen place-items-center px-6 py-24">
          <div className="max-w-md text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-gradient shadow-glow">
              <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="mt-6 font-display text-3xl font-bold">Thanks for volunteering.</h1>
            <p className="mt-3 text-muted-foreground">
              Your details were received. Organizers will reach out when they need coverage.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="outline" onClick={() => setDone(false)}>
                Submit another
              </Button>
              <Link to="/">
                <Button className="bg-primary-gradient text-primary-foreground shadow-glow">Back home</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="min-h-screen bg-hero">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to hackathon
            </Link>
            <Button variant="outline" size="sm" className="w-fit rounded-full border-border/60 bg-card/80" asChild>
              <Link to="/">View leaderboard</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
            <div>
              <RegistrationTypeToggle active="volunteer" />
              <h1 className="mt-8 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Help run the hackathon.
              </h1>
              <p className="mt-4 max-w-lg text-muted-foreground">
                Register your contact details, preferred support roles, and availability notes so organizers can
                coordinate event coverage.
              </p>
              <ul className="mt-10 space-y-4">
                {featureCards.map(({ icon: Icon, title, body }) => (
                  <li
                    key={title}
                    className="flex gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-soft"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="font-display font-semibold">{title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <VolunteerForm onDone={() => setDone(true)} />
          </div>
        </div>
      </main>
    </div>
  );
}

function VolunteerForm({ onDone }: { onDone: () => void }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [roles, setRoles] = useState<string[]>([]);

  function toggleRole(role: string) {
    setRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
    setErrors((e) => {
      if (!e.preferred_roles) return e;
      const { preferred_roles: _, ...rest } = e;
      return rest;
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries());
    const parsed = volunteerSchema.safeParse(raw);

    const nextErrors: Errors = parsed.success ? {} : flattenErrors(parsed.error);
    if (roles.length === 0) nextErrors.preferred_roles = "Select at least one preferred role";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    const { error } = await supabase.from("registrations").insert({
      type: "Volunteer",
      full_name: parsed.data!.full_name,
      email: parsed.data!.email,
      team_or_department: parsed.data!.team_or_department || null,
      preferred_roles: roles,
      availability_notes: parsed.data!.availability_notes || null,
    } as never);
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Volunteer registration submitted!");
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
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft sm:p-8"
    >
      <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Volunteer registration</span>
      <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Tell organizers how you can help</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        This creates a submitted volunteer record only. Assignments and scheduling stay outside this Phase 1 form.
      </p>

      <div className="mt-8 space-y-5">
        <Field
          label="Full name"
          name="full_name"
          required
          placeholder="Your name"
          error={errors.full_name}
          onChange={() => clearError("full_name")}
        />
        <Field
          label="Work email"
          name="email"
          type="email"
          required
          placeholder="you@surgevector.com"
          error={errors.email}
          onChange={() => clearError("email")}
        />
        <Field
          label="Team or department"
          name="team_or_department"
          placeholder="Engineering, AI Platform, Taxilla Labs..."
          error={errors.team_or_department}
          onChange={() => clearError("team_or_department")}
        />

        <fieldset>
          <legend className="text-sm font-medium">
            Preferred roles<span className="text-primary"> *</span>
          </legend>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PREFERRED_ROLES.map((role) => {
              const id = `role-${role.replace(/\s+/g, "-").toLowerCase()}`;
              return (
                <label
                  key={role}
                  htmlFor={id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 bg-background/50 px-4 py-3 text-sm hover:border-primary/40"
                >
                  <Checkbox
                    id={id}
                    checked={roles.includes(role)}
                    onCheckedChange={() => toggleRole(role)}
                  />
                  {role}
                </label>
              );
            })}
          </div>
          {errors.preferred_roles && (
            <p className="mt-1.5 text-xs text-destructive">{errors.preferred_roles}</p>
          )}
        </fieldset>

        <div>
          <Label htmlFor="availability_notes">Availability notes</Label>
          <Textarea
            id="availability_notes"
            name="availability_notes"
            rows={5}
            placeholder="Share when you can help and any coordination context organizers should know."
            className={`mt-1.5 ${errors.availability_notes ? "border-destructive focus-visible:ring-destructive" : ""}`}
            onChange={() => clearError("availability_notes")}
          />
          {errors.availability_notes && (
            <p className="mt-1.5 text-xs text-destructive">{errors.availability_notes}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 bg-primary-gradient px-6 text-primary-foreground shadow-glow"
        >
          {loading ? "Submitting…" : "Register as volunteer"}
        </Button>
      </div>
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
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-primary"> *</span>}
      </Label>
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
