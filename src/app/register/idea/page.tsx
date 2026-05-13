import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ClipboardCheck, Lightbulb, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IdeaSubmissionForm } from "@/features/registration/components/idea-submission-form";

export const metadata: Metadata = {
  title: "Submit Idea",
  description:
    "Submit your SurgeVector Hackathon idea for Phase 1 review before team registration.",
};

const reviewSteps = [
  {
    description:
      "Share your participant details and the AI idea you want to prototype.",
    icon: Lightbulb,
    title: "Submit the idea",
  },
  {
    description:
      "Admins, mentors, or the panel vet the idea with a simple Phase 1 approval status.",
    icon: ClipboardCheck,
    title: "Review and approve",
  },
  {
    description:
      "After approval, create a team with one to three members and move into mentor coordination.",
    icon: Users,
    title: "Form the team",
  },
];

export default function IdeaRegistrationRoute() {
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
            <Link href="/register/team">Already approved?</Link>
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
                  Participant Intake
                </p>
                <CardTitle className="text-4xl sm:text-5xl">
                  Submit your SurgeVector Hackathon idea.
                </CardTitle>
                <CardDescription className="text-base leading-7">
                  Start with yourself and your idea. Team registration opens
                  after the panel or admin review marks the idea as approved.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-4">
              {reviewSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <Card className="p-5" key={step.title}>
                    <div className="flex gap-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                        <Icon aria-hidden="true" className="size-5" />
                      </span>
                      <div>
                        <h2 className="font-semibold text-white">
                          {step.title}
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {step.description}
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
                Idea Submission
              </p>
              <CardTitle>Tell us what you want to build</CardTitle>
              <CardDescription>
                Keep it focused on a prototype that can be shaped during the
                hackathon.
              </CardDescription>
            </CardHeader>
            <IdeaSubmissionForm />
          </Card>
        </section>
      </div>
    </main>
  );
}
