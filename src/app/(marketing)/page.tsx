import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HACKATHON_TIMELINE } from "@/lib/constants";

const heroMetrics = [
  { label: "Team size", value: "1–4" },
  { label: "Eligibility", value: "SurgeVector, Taxilla" },
  { label: "Dates", value: "May 14–30" },
];

const faqs = [
  {
    answer:
      "Any full-time employee at SurgeVector or Taxilla is eligible to participate. Teams can have between one and four members.",
    question: "Who can participate in the hackathon?",
  },
  {
    answer:
      "You can submit an idea, form a team around an available idea, or volunteer to support the event. Visit the registration page to get started.",
    question: "How do I register?",
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
        <section className="flex min-h-[calc(100svh-5.75rem)] items-center gap-10 py-20 sm:py-24 lg:grid lg:grid-cols-2 lg:gap-16">
          <FadeIn className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary shadow-[0_0_36px_rgba(255,106,0,0.16)] backdrop-blur-xl">
              <Sparkles aria-hidden="true" className="size-4" />
              2026 Internal AI Hackathon
            </div>
            <div className="space-y-5">
              <h1 className="text-balance text-5xl font-semibold tracking-[-0.05em] text-[#15110d] sm:text-6xl lg:text-[4.25rem] lg:leading-[0.95] xl:text-7xl">
                Build Reusable AI Accelerators, Together.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#5f5348] sm:text-xl">
                SurgeVector and Taxilla builders submit ideas, form focused
                teams, and sprint to build working AI prototypes.
              </p>
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
            className="hidden lg:block"
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <Image
              alt="AI accelerator core visualization showing data ingestion, model training, code generation, and agentic ops"
              className="w-full rounded-2xl shadow-[0_40px_100px_rgba(17,17,17,0.22)]"
              height={507}
              priority
              src="/images/hero-visual.png"
              width={900}
            />
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
              {/* Above labels — even indices */}
              <div className="grid grid-cols-4">
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
              <div className="relative grid grid-cols-4 items-center py-1">
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

              {/* Below labels — odd indices */}
              <div className="grid grid-cols-4">
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
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 lg:hidden">
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

        {/* ── Registration CTA ── */}
        <section
          aria-labelledby="registration-cta"
          className="py-20 sm:py-24 lg:py-28"
        >
          <FadeIn>
            <div className="overflow-hidden rounded-3xl bg-[#111111] px-8 py-16 text-center shadow-[0_40px_100px_rgba(17,17,17,0.22)] sm:px-16 sm:py-20">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Registration
              </p>
              <h2
                className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
                id="registration-cta"
              >
                Ready to build something real?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#a89a8c]">
                Submit your idea, form a team of up to four, and build a working
                AI prototype in two weeks. Open to all SurgeVector and Taxilla
                employees.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  className="h-12 bg-primary px-8 text-white hover:bg-primary/90"
                  size="lg"
                >
                  <Link href="/register">
                    Register now
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ── About Us ── */}
        <section
          aria-labelledby="about-us"
          className="py-20 sm:py-24 lg:py-28"
        >
          <FadeIn className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                About
              </p>
              <h2
                className="text-3xl font-semibold tracking-tight text-[#15110d] sm:text-4xl"
                id="about-us"
              >
                Who we are.
              </h2>
            </div>
            <div className="space-y-5 text-base leading-8 text-[#5f5348]">
              <p>
                SurgeVector is an AI-first software delivery company focused on
                building intelligent accelerators that reduce time-to-value for
                enterprise teams. Alongside our partner Taxilla, we operate
                across data ingestion, model training, code generation, and
                agentic operations.
              </p>
              <p>
                The SurgeVector Internal AI Hackathon brings builders from both
                organizations together for two weeks of focused ideation and
                prototyping. Every idea starts with a real problem — an
                internal workflow, a customer pain point, or an operational gap
                — and ends with a working demonstration.
              </p>
              <p>
                This is Phase 1 of our ongoing commitment to democratize AI
                delivery skills across every team. The best prototypes will be
                reviewed for production readiness and potential integration into
                our accelerator platform.
              </p>
            </div>
          </FadeIn>
        </section>

        {/* ── FAQs ── */}
        <section
          aria-labelledby="faqs"
          className="pb-28 pt-4 sm:pb-32"
        >
          <FadeIn className="mb-12 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              FAQs
            </p>
            <h2
              className="text-3xl font-semibold tracking-tight text-[#15110d] sm:text-4xl"
              id="faqs"
            >
              Common questions.
            </h2>
          </FadeIn>

          <FadeIn className="divide-y divide-orange-200/60">
            {faqs.map((faq) => (
              <details
                className="group py-6"
                key={faq.question}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[#15110d] [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown
                    aria-hidden="true"
                    className="size-5 shrink-0 text-primary transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <p className="mt-4 text-sm leading-7 text-[#5f5348]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </FadeIn>
        </section>
      </div>
    </main>
  );
}
