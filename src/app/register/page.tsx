import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Handshake, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Choose participant or volunteer registration for SurgeVector Hackathon 2026.",
};

const registrationChoices = [
  {
    description:
      "Submit an AI idea, register a team of one to four builders, and build a working prototype.",
    href: "/register/participant" as Route,
    icon: Users,
    label: "Participant",
  },
  {
    description:
      "Help organizers with check-ins, logistics, participant support, and demo-day readiness.",
    href: "/register/volunteer" as Route,
    icon: Handshake,
    label: "Volunteer",
  },
] as const;

export default function RegisterChoiceRoute() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff8ef] text-[#15110d] px-6 py-8 sm:px-8 lg:px-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(255,106,0,0.20),transparent_28rem),radial-gradient(circle_at_86%_8%,rgba(255,255,255,0.90),transparent_22rem)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(17,17,17,0.030)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.030)_1px,transparent_1px)] bg-[size:72px_72px]"
      />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="flex items-center justify-between gap-4">
          <Button asChild variant="ghost" className="text-[#15110d] hover:bg-primary/10 hover:text-[#15110d]">
            <Link href="/">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to hackathon
            </Link>
          </Button>
        </header>

        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Register Now
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[#15110d] sm:text-5xl">
            Choose how you will power the hackathon.
          </h1>
          <p className="max-w-xl text-base leading-7 text-[#5f5348]">
            SurgeVector and Taxilla builders submit ideas, form teams, and build
            working AI prototypes. Volunteers keep the event running smoothly.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          {registrationChoices.map((choice) => {
            const Icon = choice.icon;

            return (
              <Link
                className="group rounded-2xl border border-orange-200/70 bg-white/80 p-7 text-[#15110d] shadow-[0_18px_60px_rgba(17,17,17,0.08)] backdrop-blur-xl transition hover:border-primary/60 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                href={choice.href}
                key={choice.href}
              >
                <span className="mb-5 flex size-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <span className="flex items-center justify-between gap-4 text-2xl font-semibold text-[#15110d]">
                  {choice.label}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-5 text-primary transition group-hover:translate-x-1"
                  />
                </span>
                <span className="mt-3 block text-sm leading-6 text-[#66584c]">
                  {choice.description}
                </span>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
