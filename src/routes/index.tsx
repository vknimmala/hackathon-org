import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Rocket } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "SurgeVector.ai Hackathon 2026 — Build the next AI wave" },
      { name: "description", content: "Six weeks of building. Workshops by AWS & Microsoft, IP awareness, mentor demo day. Register your team or volunteer." },
    ],
  }),
});

const journey = [
  {
    date: "MAY 14, 2026",
    title: "Kick-off",
    body: "Event introduction, problem statements, and guidelines shared with all participants.",
  },
  {
    date: "MAY 14–22, 2026",
    title: "Ideas & Teams",
    body: "Submit ideas and form teams before May 22. Approved ideas can be considered for team registrations.",
  },
  {
    date: "MAY 22–29, 2026",
    title: "Development Sprint",
    body: "Build your prototype during the sprint with mentor and engineering lead support.",
  },
  {
    date: "MAY 30, 2026",
    title: "Demo Day",
    body: "Present your working prototype to judges and peers on demo day.",
  },
];

const faqs = [
  { q: "What is the theme of the hackathon?", a: "Building reusable AI accelerators that improve productivity, automation, and cross-functional efficiency." },
  { q: "Who can participate?", a: "Teams of 1–4 members from the SurgeVector and Taxilla organizations across all teams and functions." },
  { q: "What kind of projects can we build?", a: "AI solutions for GTM & Sales, Engineering productivity, HR/Finance/Legal operations, or cross-functional automation." },
  { q: "What are the required deliverables?", a: "A documented AI accelerator, live demo, and benchmark results showing measurable impact." },
  { q: "How will projects be judged?", a: "Based on AI effectiveness, productivity improvement, reusability, and responsible AI practices." },
  { q: "Are mentors and tools provided?", a: "Yes, mentors, AI frameworks, VM provisioning, and tool access will be provided." },
  { q: "What are the award categories?", a: "Best Overall Team, Most Innovative Solution, and Community Choice Award." },
  { q: "Where will communication happen?", a: "Through Microsoft Teams and Outlook." },
  { q: "What happens after the hackathon?", a: "Selected solutions may be integrated into company workflows and reusable AI repositories." },
  {
    q: "I HAVE A QUESTION OR CONCERN, WHICH IS NOT COVERED HERE, WHOM SHOULD I CONTACT?",
    a: "Please reach out to Shashinder Babu Chittipaka or Swapna Priya Madallapally for any other queries.",
  },
];

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* HERO BANNER */}
      <section className="relative w-full">
        <img
          src={heroBanner}
          alt="Build Reusable AI Accelerators Together — SurgeVector Hackathon May 14–30"
          className="block w-full h-auto"
          loading="eager"
        />
      </section>

      {/* JOURNEY */}
      <section id="journey" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Journey</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">Four milestones, from idea to demo day.</h2>
          </div>

          <div className="relative mt-20 hidden lg:grid grid-cols-4 gap-6">
            {/* horizontal line passes through dot row */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-primary/40" />
            {journey.map((step, i) => {
              const above = i % 2 === 0;
              return (
                <div key={step.title} className="relative flex flex-col items-center text-center">
                  <div className={`px-2 ${above ? "" : "invisible"}`}>
                    <div className="text-xs font-semibold tracking-[0.2em] text-primary">{step.date}</div>
                    <h3 className="mt-2 font-display font-semibold text-lg">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                  </div>
                  <div className="relative z-10 my-10 grid place-items-center w-6 h-6 rounded-full bg-background border-2 border-primary shadow-glow">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  </div>
                  <div className={`px-2 ${!above ? "" : "invisible"}`}>
                    <div className="text-xs font-semibold tracking-[0.2em] text-primary">{step.date}</div>
                    <h3 className="mt-2 font-display font-semibold text-lg">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile / tablet stacked */}
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:hidden">
            {journey.map((step) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto grid place-items-center w-5 h-5 rounded-full bg-background border-2 border-primary shadow-glow">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div className="text-xs font-semibold tracking-[0.2em] text-primary mt-4">{step.date}</div>
                <h3 className="mt-2 font-display font-semibold text-lg">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 py-20 bg-secondary/40">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">FAQs</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="mt-12">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`f-${i}`} className="border-b border-border/60">
                <AccordionTrigger className="text-left font-display font-semibold text-base hover:text-primary">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-primary-gradient text-primary-foreground p-12 sm:p-16 shadow-glow">
            <Sparkles className="absolute top-6 right-6 w-24 h-24 opacity-20" />
            <h3 className="font-display text-3xl sm:text-4xl font-bold max-w-2xl">Registrations are open. Bring an idea, or claim one.</h3>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="h-12 px-6 bg-background text-foreground hover:bg-background/90">
                  <Rocket className="mr-2 w-4 h-4" /> Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
