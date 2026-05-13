import Link from "next/link";
import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarDays,
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

interface PrimaryRoute {
  description: string;
  href: Route;
  label: string;
}

const heroMetrics = [
  { label: "Team size", value: "1-4" },
  { label: "Eligibility", value: "SurgeVector, Taxilla" },
  { label: "Entry", value: "Idea first" },
];

const primaryRoutes: PrimaryRoute[] = [
  {
    description:
      "Choose participant or volunteer registration, then follow the right Phase 1 path.",
    href: "/register" as Route,
    label: "Register now",
  },
  {
    description:
      "See the participant timeline for idea submission and team formation windows.",
    href: "/register/participant",
    label: "Participant timeline",
  },
  {
    description:
      "Track simple participation points, badges, and completion progress.",
    href: "/leaderboard",
    label: "View leaderboard",
  },
];

const phaseOneFeatures: FeatureCard[] = [
  {
    description:
      "Start as an individual participant by sharing the AI prototype idea you want to build.",
    icon: Users,
    label: "01",
    title: "Idea Submission",
  },
  {
    description:
      "Idea submission stays individual, so every idea has a clear owner and contact.",
    icon: UserRoundCheck,
    label: "02",
    title: "Named Idea Owner",
  },
  {
    description:
      "Team captains claim an available idea and register one to four members.",
    icon: ShieldCheck,
    label: "03",
    title: "Team Formation",
  },
  {
    description:
      "Mentors help teams stay focused once the hackathon build phase begins.",
    icon: LayoutDashboard,
    label: "04",
    title: "Mentor Support",
  },
];

const operatingSteps = [
  "Submit ideas under your own name before May 22 at 12:00 PM IST.",
  "Register as captain for your own idea immediately, or wait for the shared pool.",
  "After May 22, remaining available ideas can be claimed by teams.",
  "Mentors are coordinated after team creation so teams can prepare for the build.",
];

const participationBenefits = [
  {
    description:
      "Turn an internal workflow, customer pain, or operational gap into a practical AI prototype.",
    icon: Sparkles,
    title: "Build Real-World AI Solutions",
  },
  {
    description:
      "Get focused guidance from mentors as your selected idea moves toward build time.",
    icon: UserRoundCheck,
    title: "Mentorship From Experts",
  },
  {
    description:
      "Showcase strong prototypes and earn visibility for thoughtful execution.",
    icon: Trophy,
    title: "Prizes And Recognition",
  },
  {
    description:
      "Work with SurgeVector and Taxilla builders across teams while growing your AI delivery skills.",
    icon: Users,
    title: "Network And Grow",
  },
];

export default function LandingFoundationPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff8ef] text-[#15110d]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(255,106,0,0.24),transparent_28rem),radial-gradient(circle_at_86%_8%,rgba(255,255,255,0.92),transparent_22rem),radial-gradient(circle_at_74%_68%,rgba(255,183,77,0.18),transparent_28rem),linear-gradient(135deg,#fff8ef_0%,#fffaf6_48%,#f6eadf_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(17,17,17,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.035)_1px,transparent_1px)] bg-[size:72px_72px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-6 sm:px-8 lg:px-10">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-6 py-6">
          <Link
            aria-label="SurgeVector Hackathon home"
            className="group inline-flex items-center gap-3 rounded-full border border-orange-200/70 bg-white/70 px-3 py-2 text-sm font-semibold shadow-[0_18px_60px_rgba(17,17,17,0.08)] backdrop-blur-xl transition hover:border-primary/60"
            href="/"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-[#111111] text-white shadow-[0_0_28px_rgba(255,106,0,0.32)]">
              SV
            </span>
            <span className="hidden text-[#15110d] sm:inline">
              SurgeVector Hackathon
            </span>
          </Link>
          <nav
            aria-label="Primary landing actions"
            className="hidden items-center gap-2 md:flex"
          >
            <Button
              asChild
              className="border-[#111111] bg-[#111111] text-white hover:bg-primary"
              size="sm"
              variant="secondary"
            >
              <Link href="/register">Register now</Link>
            </Button>
          </nav>
        </header>

        <section className="grid min-h-[calc(100svh-5.75rem)] content-center gap-12 py-14 sm:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-14 lg:py-20">
          <FadeIn className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary shadow-[0_0_36px_rgba(255,106,0,0.16)] backdrop-blur-xl">
              <Sparkles aria-hidden="true" className="size-4" />
              2026 Internal AI Hackathon
            </div>
            <div className="space-y-5">
              <h1 className="max-w-5xl text-balance text-5xl font-semibold tracking-[-0.05em] text-[#15110d] sm:text-6xl lg:text-[4.25rem] lg:leading-[0.95] xl:text-7xl">
                Where AI ideas become reusable enterprise accelerators.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#5f5348] sm:text-xl">
                SurgeVector and Taxilla builders submit practical ideas, form
                focused teams, and move into mentor-led execution during the
                hackathon.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-12 px-6" size="lg">
                <Link href={"/register" as Route}>
                  Register now
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-12 border-orange-200/80 bg-white/70 px-6 text-[#15110d] shadow-[0_18px_50px_rgba(17,17,17,0.08)] hover:bg-primary/10 hover:text-[#15110d]"
                size="lg"
                variant="secondary"
              >
                <Link href="/leaderboard">View leaderboard</Link>
              </Button>
            </div>
            <dl className="grid max-w-xl grid-cols-3 gap-3">
              {heroMetrics.map((metric) => (
                <div
                  className="rounded-xl border border-orange-200/60 bg-white/65 p-4 shadow-[0_18px_60px_rgba(17,17,17,0.07)] backdrop-blur-xl"
                  key={metric.label}
                >
                  <dt className="text-xs uppercase tracking-[0.22em] text-[#7a6a5b]">
                    {metric.label}
                  </dt>
                  <dd className="mt-2 text-2xl font-semibold text-[#15110d]">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>

          <FadeIn
            className="relative"
            transition={{ delay: 0.08, duration: 0.35 }}
          >
            <Card className="overflow-hidden border-orange-200/70 bg-white/75 p-0 text-[#15110d] shadow-[0_30px_100px_rgba(17,17,17,0.14)]">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,106,0,0.16),transparent_46%,rgba(17,17,17,0.05))]"
              />
              <div className="relative border-b border-orange-200/60 p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                      Event Flow
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#15110d]">
                      Start with registration, then pick the right path.
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
                    className="group rounded-xl border border-orange-200/70 bg-[#fffaf4]/80 p-4 shadow-[0_14px_44px_rgba(17,17,17,0.06)] transition hover:border-primary/60 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    href={route.href}
                    key={route.href}
                  >
                    <span className="flex items-center justify-between gap-4 text-sm font-semibold text-[#15110d]">
                      {route.label}
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 text-primary transition group-hover:translate-x-1"
                      />
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-[#66584c]">
                      {route.description}
                    </span>
                  </Link>
                ))}
              </div>
            </Card>
          </FadeIn>
        </section>

        <section
          aria-labelledby="phase-one-scope"
          className="flex min-h-svh flex-col justify-center gap-10 py-20 sm:py-24 lg:py-28"
        >
          <FadeIn className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Hackathon Details
              </p>
              <h2
                className="max-w-3xl text-3xl font-semibold tracking-tight text-[#15110d] sm:text-4xl"
                id="phase-one-scope"
              >
                The participant journey separates idea ownership from team
                formation.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[#66584c]">
              Submit ideas as yourself, then register a compact team as captain
              when you are ready to build or claim from the shared pool.
            </p>
          </FadeIn>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {phaseOneFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <FadeIn
                  className="h-full"
                  key={feature.title}
                  transition={{ delay: index * 0.04, duration: 0.35 }}
                >
                  <Card className="h-full overflow-hidden border-orange-200/60 bg-white/70 text-[#15110d] shadow-[0_18px_70px_rgba(17,17,17,0.08)]">
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary/80 via-[#111111]/20 to-transparent"
                    />
                    <CardHeader>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                          {feature.label}
                        </span>
                        <span className="rounded-full border border-orange-200/70 bg-primary/10 p-2 text-primary">
                          <Icon aria-hidden="true" className="size-5" />
                        </span>
                      </div>
                      <CardTitle className="text-2xl">{feature.title}</CardTitle>
                      <CardDescription className="text-sm leading-6 text-[#66584c]">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </section>

        <section className="grid min-h-svh content-center gap-6 py-20 sm:py-24 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-8 lg:py-28">
          <FadeIn>
            <Card className="h-full overflow-hidden border-orange-200/70 bg-white/75 text-[#15110d] shadow-[0_18px_70px_rgba(17,17,17,0.08)]">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-primary via-[#111111] to-primary"
              />
              <CardHeader>
                <div className="mb-2 inline-flex size-12 items-center justify-center rounded-2xl bg-[#111111] text-white shadow-[0_0_32px_rgba(255,106,0,0.24)]">
                  <CalendarDays aria-hidden="true" className="size-6" />
                </div>
                <CardTitle className="text-3xl">Participant flow</CardTitle>
                <CardDescription className="text-base leading-7 text-[#66584c]">
                  SurgeVector Hackathon keeps the participant flow simple:
                  participants submit ideas under their own name, then team
                  captains claim ideas and coordinate the build group.
                </CardDescription>
              </CardHeader>
            </Card>
          </FadeIn>
          <FadeIn transition={{ delay: 0.06, duration: 0.35 }}>
            <Card className="h-full border-orange-200/60 bg-white/70 text-[#15110d] shadow-[0_18px_70px_rgba(17,17,17,0.08)]">
              <ol className="grid gap-6 sm:grid-cols-2">
                {operatingSteps.map((step, index) => (
                  <li
                    className="rounded-xl border border-orange-200/70 bg-[#fffaf4]/80 p-5"
                    key={step}
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                      Step {index + 1}
                    </span>
                    <p className="mt-3 text-sm leading-6 text-[#2a1b10]">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </Card>
          </FadeIn>
        </section>

        <section
          aria-labelledby="why-participate"
          className="flex min-h-svh flex-col justify-center gap-10 py-20 sm:py-24 lg:py-28"
        >
          <FadeIn className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Why Participate
              </p>
              <h2
                className="max-w-3xl text-3xl font-semibold tracking-tight text-[#15110d] sm:text-4xl"
                id="why-participate"
              >
                Build useful AI prototypes, learn with mentors, and grow across
                teams.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[#66584c]">
              Bring a practical AI idea, learn with mentors, and showcase a
              working prototype with builders across SurgeVector and Taxilla.
            </p>
          </FadeIn>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {participationBenefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <FadeIn
                  className="h-full"
                  key={benefit.title}
                  transition={{ delay: index * 0.04, duration: 0.35 }}
                >
                  <Card className="h-full border-orange-200/60 bg-white/70 text-[#15110d] shadow-[0_18px_70px_rgba(17,17,17,0.08)]">
                    <CardHeader>
                      <span className="mb-2 inline-flex size-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                        <Icon aria-hidden="true" className="size-5" />
                      </span>
                      <CardTitle>{benefit.title}</CardTitle>
                      <CardDescription className="leading-6 text-[#66584c]">
                        {benefit.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
