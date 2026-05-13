import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Gauge,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRoundCheck,
  Users,
} from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FeatureCard {
  description: string;
  icon: LucideIcon;
  label: string;
  title: string;
}

const heroMetrics = [
  { label: "Team size", value: "1-3" },
  { label: "Phase", value: "MVP" },
  { label: "Tracks", value: "AI" },
];

const primaryRoutes = [
  {
    description: "Create a HackVector team for SurgeVector and Taxila builders.",
    href: "/register/team",
    label: "Register your team",
  },
  {
    description: "Join the operations crew for check-ins, logistics, and support.",
    href: "/register/volunteer",
    label: "Volunteer for operations",
  },
  {
    description: "Review registrations, mentor capacity, and basic activity signals.",
    href: "/admin",
    label: "Open admin dashboard",
  },
  {
    description: "Manage availability, capacity, reassignment, and overrides.",
    href: "/admin/mentors",
    label: "Coordinate mentors",
  },
];

const phaseOneFeatures: FeatureCard[] = [
  {
    description: "Fast team onboarding with clear eligibility, member limits, and editing paths.",
    icon: Users,
    label: "01",
    title: "Team Registration",
  },
  {
    description: "Volunteer intake for availability, preferred roles, and coordination notes.",
    icon: UserRoundCheck,
    label: "02",
    title: "Volunteer Registration",
  },
  {
    description: "Simple capacity visibility, availability toggles, and manual mentor reassignment.",
    icon: ShieldCheck,
    label: "03",
    title: "Mentor Management",
  },
  {
    description: "Focused operational view for registrations, mentor load, volunteers, and analytics.",
    icon: LayoutDashboard,
    label: "04",
    title: "Admin Dashboard",
  },
];

const operatingSteps = [
  "Register teams with one to three members.",
  "Capture volunteer availability for event operations.",
  "Assign mentors with capacity and override visibility.",
  "Track completion progress, points, badges, and basic analytics.",
];

const signalCards = [
  {
    description: "Scoped to landing, registrations, mentors, volunteers, admin, analytics, gamification, and notifications.",
    icon: CheckCircle2,
    title: "Phase 1 Only",
  },
  {
    description: "Premium glass surfaces, clear hierarchy, keyboard-friendly CTAs, and responsive layouts.",
    icon: Sparkles,
    title: "Enterprise Polish",
  },
  {
    description: "Simple progress, badges, and leaderboard signals without realtime scoring complexity.",
    icon: Trophy,
    title: "Simple Gamification",
  },
];

export default function LandingFoundationPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,106,0,0.34),transparent_28rem),radial-gradient(circle_at_84%_12%,rgba(255,255,255,0.12),transparent_22rem),linear-gradient(135deg,rgba(255,106,0,0.12),transparent_36%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-20 px-6 py-8 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between gap-6">
          <Link
            aria-label="HackVector home"
            className="group inline-flex items-center gap-3 rounded-full border border-border bg-white/8 px-3 py-2 text-sm font-semibold backdrop-blur-xl transition hover:border-primary/60"
            href="/"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_28px_rgba(255,106,0,0.42)]">
              HV
            </span>
            <span className="hidden text-white sm:inline">
              HackVector by SurgeVector
            </span>
          </Link>
          <nav
            aria-label="Primary landing actions"
            className="hidden items-center gap-2 md:flex"
          >
            <Button asChild size="sm" variant="ghost">
              <Link href="/admin">Admin</Link>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <Link href="/register/volunteer">Volunteer</Link>
            </Button>
          </nav>
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <FadeIn className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary shadow-[0_0_36px_rgba(255,106,0,0.16)] backdrop-blur-xl">
              <Sparkles aria-hidden="true" className="size-4" />
              Phase 1 MVP Registration Platform
            </div>
            <div className="space-y-5">
              <h1 className="max-w-5xl text-balance text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
                HackVector is where SurgeVector teams turn AI ideas into
                shipped prototypes.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                A polished internal hackathon hub for SurgeVector and Taxila
                teams, focused on registrations, volunteers, mentors, admin
                operations, basic analytics, and simple gamification.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-12 px-6" size="lg">
                <Link href="/register/team">
                  Register your team
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
              <Button asChild className="h-12 px-6" size="lg" variant="secondary">
                <Link href="/register/volunteer">Become a volunteer</Link>
              </Button>
            </div>
            <dl className="grid max-w-xl grid-cols-3 gap-3">
              {heroMetrics.map((metric) => (
                <div
                  className="rounded-xl border border-border bg-white/8 p-4 backdrop-blur-xl"
                  key={metric.label}
                >
                  <dt className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {metric.label}
                  </dt>
                  <dd className="mt-2 text-2xl font-semibold text-white">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>

          <FadeIn className="relative" transition={{ delay: 0.08, duration: 0.35 }}>
            <Card className="overflow-hidden p-0">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,106,0,0.2),transparent_42%,rgba(255,255,255,0.1))]"
              />
              <div className="relative border-b border-border p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                      Command Preview
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                      Registration operations, ready for launch.
                    </h2>
                  </div>
                  <div className="rounded-full border border-primary/30 bg-primary/10 p-3 text-primary">
                    <Gauge aria-hidden="true" className="size-6" />
                  </div>
                </div>
              </div>
              <div className="relative grid gap-4 p-6 sm:p-8">
                {primaryRoutes.map((route) => (
                  <Link
                    className="group rounded-xl border border-border bg-black/25 p-4 transition hover:border-primary/60 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    href={route.href}
                    key={route.href}
                  >
                    <span className="flex items-center justify-between gap-4 text-sm font-semibold text-white">
                      {route.label}
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 text-primary transition group-hover:translate-x-1"
                      />
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                      {route.description}
                    </span>
                  </Link>
                ))}
              </div>
            </Card>
          </FadeIn>
        </section>

        <section aria-labelledby="phase-one-scope" className="space-y-6">
          <FadeIn className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Phase 1 Scope
              </p>
              <h2
                className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl"
                id="phase-one-scope"
              >
                Everything needed to open registration and coordinate the first
                wave.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              Built for speed and operational clarity: no heavy infrastructure,
              no future-phase collaboration systems, just the MVP surface that
              teams need now.
            </p>
          </FadeIn>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {phaseOneFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <FadeIn
                  className="h-full"
                  key={feature.title}
                  transition={{ delay: index * 0.04, duration: 0.35 }}
                >
                  <Card className="h-full overflow-hidden">
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary/80 via-white/40 to-transparent"
                    />
                    <CardHeader>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                          {feature.label}
                        </span>
                        <span className="rounded-full border border-border bg-white/8 p-2 text-primary">
                          <Icon aria-hidden="true" className="size-5" />
                        </span>
                      </div>
                      <CardTitle className="text-2xl">{feature.title}</CardTitle>
                      <CardDescription className="text-sm leading-6">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <FadeIn>
            <Card className="h-full">
              <CardHeader>
                <div className="mb-2 inline-flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_32px_rgba(255,106,0,0.3)]">
                  <CalendarDays aria-hidden="true" className="size-6" />
                </div>
                <CardTitle className="text-3xl">MVP operating flow</CardTitle>
                <CardDescription className="text-base leading-7">
                  The landing page sets expectations for a focused registration
                  platform, then routes participants and coordinators into the
                  correct Phase 1 entry points.
                </CardDescription>
              </CardHeader>
            </Card>
          </FadeIn>
          <FadeIn transition={{ delay: 0.06, duration: 0.35 }}>
            <Card className="h-full">
              <ol className="grid gap-4 sm:grid-cols-2">
                {operatingSteps.map((step, index) => (
                  <li
                    className="rounded-xl border border-border bg-black/25 p-4"
                    key={step}
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                      Step {index + 1}
                    </span>
                    <p className="mt-3 text-sm leading-6 text-white">{step}</p>
                  </li>
                ))}
              </ol>
            </Card>
          </FadeIn>
        </section>

        <section
          aria-label="Platform signals"
          className="grid gap-4 pb-10 md:grid-cols-3"
        >
          {signalCards.map((signal, index) => {
            const Icon = signal.icon;

            return (
              <FadeIn
                className="h-full"
                key={signal.title}
                transition={{ delay: index * 0.04, duration: 0.35 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <span className="mb-2 inline-flex size-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <CardTitle>{signal.title}</CardTitle>
                    <CardDescription className="leading-6">
                      {signal.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </FadeIn>
            );
          })}
        </section>
      </div>
    </main>
  );
}
