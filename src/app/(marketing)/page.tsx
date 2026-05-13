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
    <>
      {/* ── Sticky dark header ── */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[#0d0d0d]/95 px-6 py-3.5 backdrop-blur-xl sm:px-8 lg:px-10">
        <Link aria-label="SurgeVector Hackathon home" href="/">
          <span className="flex items-center overflow-hidden rounded-xl bg-white/95 px-3 py-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
            <Image
              alt="SurgeVector"
              className="h-7 w-auto"
              height={36}
              priority
              src="/images/surgevector-logo.png"
              width={140}
            />
          </span>
        </Link>
        <nav aria-label="Primary actions">
          <Button
            asChild
            className="bg-primary text-white shadow-[0_0_20px_rgba(255,106,0,0.35)] hover:bg-primary/90"
            size="sm"
          >
            <Link href="/register">Register now</Link>
          </Button>
        </nav>
      </header>

      {/* ── Full-bleed dark hero ── */}
      <section
        aria-label="Hero"
        className="relative flex min-h-[calc(100svh-3.75rem)] flex-col items-center justify-center overflow-hidden text-center"
      >
        {/* Background image */}
        <Image
          alt=""
          aria-hidden="true"
          className="object-cover"
          fill
          priority
          src="/images/hero-visual.png"
        />
        {/* Overlay for readability */}
        <div aria-hidden="true" className="absolute inset-0 bg-black/60" />

        {/* Accessible h1 for SEO — visually hidden since the image carries the headline */}
        <h1 className="sr-only">
          Build Reusable AI Accelerators, Together. — SurgeVector Internal AI
          Hackathon 2026
        </h1>

        <FadeIn className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary backdrop-blur-xl">
            <Sparkles aria-hidden="true" className="size-4" />
            2026 Internal AI Hackathon
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/55">
            May 14 – May 30, 2026
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.36em] text-primary">
            2 — week build sprint
          </p>
        </FadeIn>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex size-10 items-center justify-center rounded-full border border-white/20 text-white/35">
            <ChevronDown aria-hidden="true" className="size-5" />
          </div>
        </div>
      </section>

      {/* ── Cream content ── */}
      <main className="relative overflow-hidden bg-[#fff8ef] text-[#15110d]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(255,106,0,0.18),transparent_28rem),radial-gradient(circle_at_86%_8%,rgba(255,255,255,0.90),transparent_22rem)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(17,17,17,0.030)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.030)_1px,transparent_1px)] bg-[size:72px_72px]"
        />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col px-6 sm:px-8 lg:px-10">
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
              <div aria-label="Hackathon timeline" className="hidden lg:block">
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
                  Submit your idea, form a team of up to four, and build a
                  working AI prototype in two weeks. Open to all SurgeVector and
                  Taxilla employees.
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
                  SurgeVector is an AI-first software delivery company focused
                  on building intelligent accelerators that reduce
                  time-to-value for enterprise teams. Alongside our partner
                  Taxilla, we operate across data ingestion, model training,
                  code generation, and agentic operations.
                </p>
                <p>
                  The SurgeVector Internal AI Hackathon brings builders from
                  both organizations together for two weeks of focused
                  ideation and prototyping. Every idea starts with a real
                  problem — an internal workflow, a customer pain point, or an
                  operational gap — and ends with a working demonstration.
                </p>
                <p>
                  This is Phase 1 of our ongoing commitment to democratize AI
                  delivery skills across every team. The best prototypes will
                  be reviewed for production readiness and potential
                  integration into our accelerator platform.
                </p>
              </div>
            </FadeIn>
          </section>

          {/* ── FAQs ── */}
          <section aria-labelledby="faqs" className="pb-28 pt-4 sm:pb-32">
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
                <details className="group py-6" key={faq.question}>
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
    </>
  );
}
