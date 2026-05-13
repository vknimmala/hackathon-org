import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ClipboardCheck,
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
import {
  HACKATHON_TIMELINE,
  isIdeaSubmissionOpen,
  isSharedTeamFormationOpen,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Participant Registration",
  description:
    "SurgeVector Hackathon participant timeline for idea submission and team registration.",
};

const participantActions = [
  {
    description:
      "Submit an AI idea under your own name before May 22 at 12:00 PM IST.",
    href: "/register/idea" as Route,
    icon: Lightbulb,
    label: "Idea submission",
    status: "idea",
  },
  {
    description:
      "Register as captain / point of contact for your idea now, or claim from the shared pool after May 22.",
    href: "/register/team" as Route,
    icon: Users,
    label: "Team registration",
    status: "team",
  },
] as const;

export default function ParticipantRegistrationRoute() {
  const isIdeaOpen = isIdeaSubmissionOpen();
  const isSharedPoolOpen = isSharedTeamFormationOpen();

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-8 lg:px-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,106,0,0.28),transparent_28rem),radial-gradient(circle_at_86%_12%,rgba(255,255,255,0.12),transparent_22rem)]"
      />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button asChild variant="ghost">
            <Link href="/register">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to registration
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/leaderboard">View leaderboard</Link>
          </Button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
          <Card className="overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,106,0,0.18),transparent_46%,rgba(255,255,255,0.06))]"
            />
            <CardHeader className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Participant Timeline
              </p>
              <CardTitle className="text-4xl sm:text-5xl">
                Submit the idea first. Form the team when you are ready.
              </CardTitle>
              <CardDescription className="text-base leading-7">
                Ideas belong to the submitter. Teams are registered separately by
                a captain or point of contact, with the shared idea pool opening
                after the idea window closes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <span className="mb-2 inline-flex size-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                <ClipboardCheck aria-hidden="true" className="size-6" />
              </span>
              <CardTitle>
                {isSharedPoolOpen ? "Shared pool is open" : "Idea window is live"}
              </CardTitle>
              <CardDescription className="text-base leading-7">
                {isSharedPoolOpen
                  ? "Team captains can now claim any remaining submitted or approved idea that has not already been taken."
                  : "Submit ideas until May 22 at 12:00 PM IST. Original idea submitters can still register their own team before that deadline."}
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          {participantActions.map((action) => {
            const Icon = action.icon;
            const isClosed = action.status === "idea" && !isIdeaOpen;

            return (
              <Card
                className={isClosed ? "border-primary/40 opacity-75" : ""}
                key={action.href}
              >
                <div className="flex h-full flex-col gap-5">
                  <span className="flex size-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                    <Icon aria-hidden="true" className="size-6" />
                  </span>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      {action.label}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {isClosed
                        ? "Idea submission is closed. Continue with team registration for remaining ideas."
                        : action.description}
                    </p>
                  </div>
                  <div className="mt-auto">
                    {isClosed ? (
                      <Button disabled type="button" variant="secondary">
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
              </Card>
            );
          })}
        </section>

        <section aria-labelledby="event-schedule" className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
              <CalendarDays aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Event Schedule
              </p>
              <h2 className="text-2xl font-semibold text-white" id="event-schedule">
                Key hackathon dates
              </h2>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-5">
            {HACKATHON_TIMELINE.map((item) => (
              <Card className="p-5" key={item.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  {item.date}
                </p>
                <h3 className="mt-3 font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
