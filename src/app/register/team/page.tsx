import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { ArrowLeft, ClipboardCheck, Lightbulb, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TeamRegistrationForm } from "@/features/registration/components/team-registration-form";
import { getAvailableIdeasForTeamRegistration } from "@/features/registration/queries/team-registration-queries";
import { isSharedTeamFormationOpen } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Register Team",
  description:
    "Register a SurgeVector Hackathon team around an available Phase 1 idea.",
};

export default async function TeamRegistrationRoute() {
  const ideasResult = await getAvailableIdeasForTeamRegistration();
  const isSharedPoolOpen = isSharedTeamFormationOpen();

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
            <Link href={"/register/participant" as Route}>Participant timeline</Link>
          </Button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,106,0,0.18),transparent_46%,rgba(255,255,255,0.06))]"
              />
              <CardHeader className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Team Formation
                </p>
                <CardTitle className="text-4xl sm:text-5xl">
                  Register a team around an available idea.
                </CardTitle>
                <CardDescription className="text-base leading-7">
                  Team captains choose an unclaimed idea, add one to three
                  members, and become the point of contact for mentor
                  coordination.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <span className="mb-2 inline-flex size-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                  <ClipboardCheck aria-hidden="true" className="size-5" />
                </span>
                <CardTitle>
                  {isSharedPoolOpen ? "Shared idea pool open" : "Owner claim window"}
                </CardTitle>
                <CardDescription className="leading-6">
                  {isSharedPoolOpen
                    ? "All remaining submitted or approved ideas can be claimed by a team."
                    : "Until May 22 at 12:00 PM IST, the first member email must match the idea submitter email."}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <span className="mb-2 inline-flex size-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                  <Users aria-hidden="true" className="size-5" />
                </span>
                <CardTitle>One to three members</CardTitle>
                <CardDescription className="leading-6">
                  The form and database keep the Phase 1 team size rule aligned:
                  minimum one member, maximum three members.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <span className="mb-2 inline-flex size-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                  <Lightbulb aria-hidden="true" className="size-5" />
                </span>
                <CardTitle>Ideas disappear after claim</CardTitle>
                <CardDescription className="leading-6">
                  The form only lists ideas not linked to an active team. The
                  server action rechecks before saving to avoid stale claims.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card className="h-fit">
            <CardHeader className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Team Registration
              </p>
              <CardTitle>Build the team around the selected idea</CardTitle>
              <CardDescription>
                The first member entered here becomes the captain and primary
                contact for mentor coordination.
              </CardDescription>
            </CardHeader>
            {!ideasResult.ok ? (
              <Card className="mb-6 border-primary/40">
                <CardHeader>
                  <CardTitle>Available ideas could not be loaded</CardTitle>
                  <CardDescription className="text-base leading-7">
                    {ideasResult.message}
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : null}
            {ideasResult.ok && ideasResult.ideas.length === 0 ? (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>No available ideas right now</CardTitle>
                  <CardDescription className="text-base leading-7">
                    Submit an idea first or check back after teams claim the
                    shared pool.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : null}
            <TeamRegistrationForm
              availableIdeas={ideasResult.ideas}
              isSharedPoolOpen={isSharedPoolOpen}
            />
          </Card>
        </section>
      </div>
    </main>
  );
}
