import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { REGISTRATIONS_OPEN } from "@/config/registrations-open";
import { RegistrationClosed } from "@/components/site/RegistrationClosed";

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

function VolunteerPage() {
  const [done, setDone] = useState(false);

  if (!REGISTRATIONS_OPEN) {
    return <RegistrationClosed pageTitle="Volunteer registration closed" />;
  }

  if (done) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 grid place-items-center px-6 py-24">
          <div className="max-w-md text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-gradient shadow-glow">
              <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="mt-6 font-display text-3xl font-bold">Thanks for volunteering.</h1>
            <p className="mt-3 text-muted-foreground">
              Your details were received. Organisers will reach out when they need coverage.
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
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 bg-hero">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to hackathon
          </Link>

          <div className="mt-8">
            <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Volunteer</span>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Help run the hackathon.
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Share how you can help and when you are available.
            </p>
          </div>

          <div className="mt-10">
            <VolunteerForm onDone={() => setDone(true)} />
          </div>
        </div>
      </main>
      <Footer />
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
      className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft space-y-5 sm:p-8"
    >
      <div className="grid sm:grid-cols-2 gap-4">
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
      </div>
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
                <Checkbox id={id} checked={roles.includes(role)} onCheckedChange={() => toggleRole(role)} />
                {role}
              </label>
            );
          })}
        </div>
        {errors.preferred_roles && <p className="mt-1.5 text-xs text-destructive">{errors.preferred_roles}</p>}
      </fieldset>

      <div>
        <Label htmlFor="availability_notes">Availability notes</Label>
        <Textarea
          id="availability_notes"
          name="availability_notes"
          rows={5}
          placeholder="When you can help and any context for organisers"
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
        className="bg-primary-gradient text-primary-foreground shadow-glow h-11 px-6"
      >
        {loading ? "Submitting..." : "Register as volunteer"}
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
