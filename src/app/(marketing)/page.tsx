import Link from "next/link";
import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Gauge,
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
import { HACKATHON_TIMELINE } from "@/lib/constants";

interface PrimaryRoute {
  description: string;
  href: Route;
  label: string;
}

interface ParticipationBenefit {
  description: string;
  icon: LucideIcon;
  title: string;
}

const heroMetrics = [
  { label: "Team size", value: "1–4" },
  { label: "Eligibility", value: "SurgeVector, Taxilla" },
  { label: "Dates", value: "May 14–30" },
];

const primaryRoutes: PrimaryRoute[] = [
  {
    description:
      "Choose participant or volunteer registration, then follow the right path.",
    href: "/register" as Route,
    label: "Register now",
  },
  {
    description:
      "Track participation points, badges, and completion progress.",
    href: "/leaderboard",
    label: "View leaderboard",
  },
];

const participationBenefits: ParticipationBenefit[] = [
  {
    description:
      "Turn an internal workflow, customer pain, or operational gap into a practical AI prototype.",
    icon: Sparkles,
    title: "Build Real-World AI Solutions",
  },
  {
    description:
      "Get focused guidance from mentors as your idea moves toward the build phase.",
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
        {/* ── Header ── */}
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

        {/* ── Hero ── */}
        <section className="grid min-h-[calc(100svh-5.75rem)] content-center gap-12 py-14 sm:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-14 lg:py-20">
          <FadeIn className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary shadow-[0_0_36px_rgba(255,106,0,0.16)] backdrop-blur-xl">
              <Sparkles aria-hidden="true" className="size-4" />
              2026 Internal AI Hackathon
            </div>
            <div className="space-y-5">
              <h1 className="max-w-5xl text-balance text-5xl font-semibold tracking-[-0.05em] text-[#15110d] sm:text-6xl lg:text-[4.25rem] lg:leading-[0.95] xl:text-7xl">
                Build Reusable AI Accelerators, Together.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#5f5348] sm:text-xl">
                SurgeVector and Taxilla builders submit ideas, form focused
                teams, and sprint to build working AI prototypes.
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
                      Quick start
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#15110d]">
                      Submit an idea. Form a team. Build.
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

        {/* ── Journey / Timeline ── */}
        <section
          aria-labelledby="event-timeline"
          className="py-20 sm:py-24 lg:py-28"
        >
          <FadeIn className="mb-12 space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Journey
            </p>
            <h2
              className="text-3xl font-semibold tracking-tight text-[#15110d] sm:text-4xl"
              id="event-timeline"
            >
              Five milestones, from idea to demo day.
            </h2>
          </FadeIn>

          {/* Desktop: hexathon-style horizontal alternating timeline */}
          <FadeIn>
            <div className="hidden lg:block" aria-label="Hackathon timeline">
              {/* Above labels — even indices (0, 2, 4) */}
              <div className="grid grid-cols-5">
                {HACKATHON_TIMELINE.map((item, index) =>
                  index % 2 === 0 ? (
                    <div
                      className="flex flex-col items-center pb-5 text-center"
                      key={item.title}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                        {item.date}
                      </p>
                      <h3 className="mt-2 px-2 text-sm font-semibold text-[#15110d]">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 px-2 text-xs leading-5 text-[#66584c]">
                        {item.description}
                      </p>
                    </div>
                  ) : (
                    <div aria-hidden="true" key={item.title} />
                  ),
                )}
              </div>

              {/* Dots row with connecting line */}
              <div className="relative grid grid-cols-5 items-center py-1">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-[10%] top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-primary/30 via-primary/70 to-primary/30"
                />
                {HACKATHON_TIMELINE.map((item) => (
                  <div className="flex justify-center" key={item.title}>
                    <div className="relative z-10 flex size-5 items-center justify-center rounded-full border-2 border-primary bg-[#fff8ef] shadow-[0_0_16px_rgba(255,106,0,0.4)]">
                      <div className="size-2.5 rounded-full bg-primary" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Below labels — odd indices (1, 3) */}
              <div className="grid grid-cols-5">
                {HACKATHON_TIMELINE.map((item, index) =>
                  index % 2 !== 0 ? (
                    <div
                      className="flex flex-col items-center pt-5 text-center"
                      key={item.title}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                        {item.date}
                      </p>
                      <h3 className="mt-2 px-2 text-sm font-semibold text-[#15110d]">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 px-2 text-xs leading-5 text-[#66584c]">
                        {item.description}
                      </p>
                    </div>
                  ) : (
                    <div aria-hidden="true" key={item.title} />
                  ),
                )}
              </div>
            </div>
          </FadeIn>

          {/* Mobile / tablet: card grid fallback */}
          <div className="grid gap-5 sm:grid-cols-2 lg:hidden">
            {HACKATHON_TIMELINE.map((item) => (
              <Card
                className="border-orange-200/60 bg-white/70 text-[#15110d] shadow-[0_18px_70px_rgba(17,17,17,0.08)]"
                key={item.title}
              >
                <CardHeader>
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                    {item.date}
                  </span>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <CardDescription className="text-sm leading-6 text-[#66584c]">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Why Participate ── */}
        <section
          aria-labelledby="why-participate"
          className="flex flex-col justify-center gap-10 py-20 sm:py-24 lg:py-28"
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
