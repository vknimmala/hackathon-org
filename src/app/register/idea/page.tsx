import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IdeaSubmissionForm } from "@/features/registration/components/idea-submission-form";
import { isIdeaSubmissionOpen } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Submit Idea",
  description:
    "Submit your SurgeVector Hackathon AI idea before May 22.",
};

export default function IdeaRegistrationRoute() {
  const isOpen = isIdeaSubmissionOpen();

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
        </header>

        <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Idea Submission
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-[#15110d] sm:text-5xl">
              Submit your hackathon idea.
            </h1>
            <p className="text-base leading-7 text-[#5f5348]">
              Submit under your own name. You get 1 hour of priority to register
              a team, then the idea enters the shared pool for others to claim.
            </p>

            <Card className="border-orange-200/60 bg-white/70 text-[#15110d] shadow-[0_18px_60px_rgba(17,17,17,0.07)]">
              <CardHeader>
                <span className="mb-2 flex size-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                  <Users aria-hidden="true" className="size-5" />
                </span>
                <CardTitle className="text-[#15110d]">Then form a team</CardTitle>
                <CardDescription className="text-sm leading-6 text-[#66584c]">
                  After submitting, go to team registration and add one to four
                  members. The first member becomes the captain and point of
                  contact for mentor coordination.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card className="h-fit border-orange-200/60 bg-white/80 text-[#15110d] shadow-[0_30px_80px_rgba(17,17,17,0.10)]">
            <CardHeader className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Your idea
              </p>
              <CardTitle className="text-[#15110d]">Tell us what you want to build</CardTitle>
              <CardDescription className="text-[#66584c]">
                Keep it focused on a prototype that can be shaped during the
                hackathon sprint.
              </CardDescription>
            </CardHeader>
            {isOpen ? (
              <IdeaSubmissionForm />
            ) : (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                <p className="font-semibold text-[#15110d]">Idea submission is closed</p>
                <p className="mt-2 text-sm leading-6 text-[#66584c]">
                  Submission closed May 22 at 11:59 PM IST. Head to team
                  registration to claim an available idea.
                </p>
              </div>
            )}
          </Card>
        </section>
      </div>
    </main>
  );
}
