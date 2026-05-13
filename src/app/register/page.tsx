import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Handshake, Rocket, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Choose participant or volunteer registration for SurgeVector Hackathon 2026.",
};

const registrationChoices = [
  {
    description:
      "Submit ideas, claim an available idea as captain, and register a focused team of one to four builders.",
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
    <main className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-8 lg:px-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,106,0,0.28),transparent_28rem),radial-gradient(circle_at_86%_12%,rgba(255,255,255,0.12),transparent_22rem)]"
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex items-center justify-between gap-4">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to hackathon
            </Link>
          </Button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <Card className="overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,106,0,0.18),transparent_46%,rgba(255,255,255,0.06))]"
            />
            <CardHeader className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Register Now
              </p>
              <CardTitle className="text-4xl sm:text-5xl">
                Choose how you will power the hackathon.
              </CardTitle>
              <CardDescription className="text-base leading-7">
                SurgeVector Hackathon is built for practical AI acceleration:
                useful internal ideas, compact teams, and working prototypes that
                can become reusable enterprise accelerators.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <span className="mb-2 inline-flex size-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                <Rocket aria-hidden="true" className="size-6" />
              </span>
              <CardTitle>Rapid AI delivery, grounded in real work</CardTitle>
              <CardDescription className="text-base leading-7">
                Bring a workflow, data task, support gap, or engineering
                bottleneck that can be turned into a focused prototype during the
                hackathon.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          {registrationChoices.map((choice) => {
            const Icon = choice.icon;

            return (
              <Link
                className="group rounded-xl border border-border bg-card/80 p-6 text-card-foreground shadow-2xl shadow-black/30 backdrop-blur-xl transition hover:border-primary/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href={choice.href}
                key={choice.href}
              >
                <span className="mb-5 flex size-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <span className="flex items-center justify-between gap-4 text-2xl font-semibold text-white">
                  {choice.label}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-5 text-primary transition group-hover:translate-x-1"
                  />
                </span>
                <span className="mt-3 block text-sm leading-6 text-muted-foreground">
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
