import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, Handshake, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VolunteerRegistrationForm } from "@/features/volunteers/components/volunteer-registration-form";

export const metadata: Metadata = {
  title: "Volunteer Registration",
  description:
    "Register as a Phase 1 SurgeVector Hackathon volunteer for event coordination and participant support.",
};

const volunteerNotes = [
  {
    description:
      "Help with check-ins, participant questions, logistics, and demo-day readiness.",
    icon: Handshake,
    title: "Support the event",
  },
  {
    description:
      "Share the times you can help so organizers can coordinate coverage manually.",
    icon: CalendarCheck,
    title: "Share availability",
  },
  {
    description:
      "Keep the hackathon moving for SurgeVector and Taxila builders without adding shift workflows.",
    icon: UsersRound,
    title: "Enable builders",
  },
];

export default function VolunteerRegistrationRoute() {
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
          <Button asChild variant="secondary">
            <Link href="/register/idea">Submit an idea</Link>
          </Button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,106,0,0.18),transparent_46%,rgba(255,255,255,0.06))]"
              />
              <CardHeader className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Volunteer Intake
                </p>
                <CardTitle className="text-4xl sm:text-5xl">
                  Help run the SurgeVector Hackathon.
                </CardTitle>
                <CardDescription className="text-base leading-7">
                  Register your contact details, preferred support roles, and
                  availability notes so organizers can coordinate Phase 1 event
                  coverage.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-4">
              {volunteerNotes.map((note) => {
                const Icon = note.icon;

                return (
                  <Card className="p-5" key={note.title}>
                    <div className="flex gap-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                        <Icon aria-hidden="true" className="size-5" />
                      </span>
                      <div>
                        <h2 className="font-semibold text-white">
                          {note.title}
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {note.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="h-fit">
            <CardHeader className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Volunteer Registration
              </p>
              <CardTitle>Tell organizers how you can help</CardTitle>
              <CardDescription>
                This creates a submitted volunteer record only. Assignments and
                scheduling stay outside this Phase 1 form.
              </CardDescription>
            </CardHeader>
            <VolunteerRegistrationForm />
          </Card>
        </section>
      </div>
    </main>
  );
}
