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
    "Register as a SurgeVector Hackathon volunteer for event coordination and participant support.",
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
      "Keep the hackathon moving for SurgeVector and Taxilla builders without adding shift workflows.",
    icon: UsersRound,
    title: "Enable builders",
  },
];

export default function VolunteerRegistrationRoute() {
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
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex items-center justify-between gap-4">
          <Button asChild variant="ghost" className="text-[#15110d] hover:bg-primary/10 hover:text-[#15110d]">
            <Link href="/register">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to registration
            </Link>
          </Button>
        </header>

        <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Volunteer Intake
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-[#15110d] sm:text-5xl">
              Help run the hackathon.
            </h1>
            <p className="text-base leading-7 text-[#5f5348]">
              Register your contact details, preferred support roles, and
              availability notes so organizers can coordinate event coverage.
            </p>

            <div className="grid gap-4">
              {volunteerNotes.map((note) => {
                const Icon = note.icon;

                return (
                  <Card
                    className="border-orange-200/60 bg-white/70 text-[#15110d] shadow-[0_18px_60px_rgba(17,17,17,0.07)]"
                    key={note.title}
                  >
                    <CardHeader>
                      <div className="flex gap-4 items-start">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                          <Icon aria-hidden="true" className="size-5" />
                        </span>
                        <div>
                          <CardTitle className="text-base text-[#15110d]">
                            {note.title}
                          </CardTitle>
                          <CardDescription className="mt-1 text-sm leading-6 text-[#66584c]">
                            {note.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="h-fit border-orange-200/60 bg-white/80 text-[#15110d] shadow-[0_30px_80px_rgba(17,17,17,0.10)]">
            <CardHeader className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Volunteer Registration
              </p>
              <CardTitle className="text-[#15110d]">Tell organizers how you can help</CardTitle>
              <CardDescription className="text-[#66584c]">
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
