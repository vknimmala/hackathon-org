import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { ArrowLeft, ClipboardCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TeamRegistrationForm } from "@/features/registration/components/team-registration-form";

export const metadata: Metadata = {
  title: "Register Team",
  description:
    "Register a SurgeVector Hackathon team after idea approval for Phase 1 mentor coordination.",
};

export default function TeamRegistrationRoute() {
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
            <Link href={"/register/idea" as Route}>Submit an idea first</Link>
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
                  Register a team after idea approval.
                </CardTitle>
                <CardDescription className="text-base leading-7">
                  SurgeVector Hackathon teams can include one to three members.
                  Mentor assignment comes after the approved idea is linked to
                  a registered team.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <span className="mb-2 inline-flex size-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                  <ClipboardCheck aria-hidden="true" className="size-5" />
                </span>
                <CardTitle>Approval required</CardTitle>
                <CardDescription className="leading-6">
                  Use the approved idea ID returned by the review workflow. The
                  server action blocks team creation until the idea status is
                  approved.
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
          </div>

          <Card className="h-fit">
            <CardHeader className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Approved Team Registration
              </p>
              <CardTitle>Build the team around the vetted idea</CardTitle>
              <CardDescription>
                The first member entered here becomes the primary contact for
                mentor coordination.
              </CardDescription>
            </CardHeader>
            <TeamRegistrationForm />
          </Card>
        </section>
      </div>
    </main>
  );
}
