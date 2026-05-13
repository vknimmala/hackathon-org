import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { ArrowLeft, Lightbulb, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TeamRegistrationForm } from "@/features/registration/components/team-registration-form";
import { getAvailableIdeasForTeamRegistration } from "@/features/registration/queries/team-registration-queries";

export const metadata: Metadata = {
  title: "Register Team",
  description:
    "Register a SurgeVector Hackathon team around an available idea.",
};

export default async function TeamRegistrationRoute() {
  const ideasResult = await getAvailableIdeasForTeamRegistration();

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
            <Link href="/register/participant">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back
            </Link>
          </Button>
          <Button asChild variant="secondary" className="border-orange-200/70 bg-white/80 text-[#15110d] hover:bg-primary/10 hover:text-[#15110d]">
            <Link href={"/register/idea" as Route}>Submit an idea first</Link>
          </Button>
        </header>

        <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Team Formation
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-[#15110d] sm:text-5xl">
              Register a team around an idea.
            </h1>
            <p className="text-base leading-7 text-[#5f5348]">
              Choose an unclaimed idea, add up to four members, and become the
              point of contact for mentor coordination.
            </p>

            <Card className="border-orange-200/60 bg-white/70 text-[#15110d] shadow-[0_18px_60px_rgba(17,17,17,0.07)]">
              <CardHeader>
                <span className="mb-2 flex size-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                  <Lightbulb aria-hidden="true" className="size-5" />
                </span>
                <CardTitle className="text-[#15110d]">1-hour head start</CardTitle>
                <CardDescription className="text-sm leading-6 text-[#66584c]">
                  If you submitted the idea, you have 1 hour to register a team
                  before it enters the shared pool. After that, any captain can
                  claim it.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-orange-200/60 bg-white/70 text-[#15110d] shadow-[0_18px_60px_rgba(17,17,17,0.07)]">
              <CardHeader>
                <span className="mb-2 flex size-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                  <Users aria-hidden="true" className="size-5" />
                </span>
                <CardTitle className="text-[#15110d]">One to four members</CardTitle>
                <CardDescription className="text-sm leading-6 text-[#66584c]">
                  The first member entered is the captain and primary contact.
                  Ideas disappear from the list once a team claims them.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card className="h-fit border-orange-200/60 bg-white/80 text-[#15110d] shadow-[0_30px_80px_rgba(17,17,17,0.10)]">
            <CardHeader className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Team Registration
              </p>
              <CardTitle className="text-[#15110d]">Build the team around the selected idea</CardTitle>
              <CardDescription className="text-[#66584c]">
                The first member is the captain and primary contact for mentor
                coordination.
              </CardDescription>
            </CardHeader>
            {!ideasResult.ok ? (
              <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-5">
                <p className="font-semibold text-[#15110d]">Available ideas could not be loaded</p>
                <p className="mt-2 text-sm leading-6 text-[#66584c]">
                  {ideasResult.message}
                </p>
              </div>
            ) : null}
            {ideasResult.ok && ideasResult.ideas.length === 0 ? (
              <div className="mb-6 rounded-xl border border-orange-200/60 bg-orange-50/50 p-5">
                <p className="font-semibold text-[#15110d]">No available ideas right now</p>
                <p className="mt-2 text-sm leading-6 text-[#66584c]">
                  Submit an idea first, or check back once ideas are in the
                  shared pool.
                </p>
              </div>
            ) : null}
            <TeamRegistrationForm availableIdeas={ideasResult.ideas} />
          </Card>
        </section>
      </div>
    </main>
  );
}
