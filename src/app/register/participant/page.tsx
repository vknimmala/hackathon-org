import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Lightbulb,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HACKATHON_TIMELINE, isIdeaSubmissionOpen } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Participant Registration",
  description:
    "SurgeVector Hackathon participant timeline for idea submission and team registration.",
};

const participantActions = [
  {
    description:
      "Submit your AI idea before May 22. You can register a team straight away or let it enter the shared pool.",
    href: "/register/idea" as Route,
    icon: Lightbulb,
    label: "Idea submission",
    status: "idea",
  },
  {
    description:
      "Register as captain for your submitted idea, or claim an available idea from the shared pool.",
    href: "/register/team" as Route,
    icon: Users,
    label: "Team registration",
    status: "team",
  },
] as const;

export default function ParticipantRegistrationRoute() {
  const isIdeaOpen = isIdeaSubmissionOpen();

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
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button asChild variant="ghost" className="text-[#15110d] hover:bg-primary/10 hover:text-[#15110d]">
            <Link href="/register">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to registration
            </Link>
          </Button>
          <Button asChild variant="secondary" className="border-orange-200/70 bg-white/80 text-[#15110d] hover:bg-primary/10 hover:text-[#15110d]">
            <Link href="/leaderboard">View leaderboard</Link>
          </Button>
        </header>

        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Participant Timeline
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[#15110d] sm:text-5xl">
            Submit an idea. Form a team. Build.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[#5f5348]">
            Submit your idea before May 22. You have 1 hour of priority to
            register your team, then the idea enters the shared pool for anyone
            to claim.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          {participantActions.map((action) => {
            const Icon = action.icon;
            const isClosed = action.status === "idea" && !isIdeaOpen;

            return (
              <div
                className={`rounded-2xl border p-7 shadow-[0_18px_60px_rgba(17,17,17,0.08)] backdrop-blur-xl ${
                  isClosed
                    ? "border-orange-200/40 bg-white/50 opacity-70"
                    : "border-orange-200/70 bg-white/80"
                }`}
                key={action.href}
              >
                <span className="mb-5 flex size-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <h2 className="text-2xl font-semibold text-[#15110d]">
                  {action.label}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#66584c]">
                  {isClosed
                    ? "Idea submission is closed. Continue with team registration to claim an available idea."
                    : action.description}
                </p>
                <div className="mt-6">
                  {isClosed ? (
                    <Button disabled type="button" variant="secondary" className="border-orange-200/60 bg-white/60 text-[#7a6a5b]">
                      Closed
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link href={action.href}>
                        Open
                        <ArrowRight aria-hidden="true" className="size-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        <section aria-labelledby="event-schedule" className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
              <CalendarDays aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Event Schedule
              </p>
              <h2
                className="text-2xl font-semibold text-[#15110d]"
                id="event-schedule"
              >
                Key hackathon dates
              </h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HACKATHON_TIMELINE.map((item) => (
              <Card
                className="border-orange-200/60 bg-white/70 text-[#15110d] shadow-[0_18px_60px_rgba(17,17,17,0.07)]"
                key={item.title}
              >
                <CardHeader>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                    {item.date}
                  </p>
                  <CardTitle className="text-base text-[#15110d]">{item.title}</CardTitle>
                  <CardDescription className="text-sm leading-6 text-[#66584c]">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
