import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Mail,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IdeaReviewForm } from "@/features/admin/components/idea-review-form";
import { getIdeaSubmissionsForReview } from "@/features/admin/queries/idea-review-queries";
import type { IdeaSubmissionForReview } from "@/features/admin/queries/idea-review-queries";

export const metadata: Metadata = {
  title: "Admin Idea Review",
  description:
    "Review SurgeVector Hackathon idea submissions and mark them approved or rejected.",
};

const organizationLabels = {
  surgevector: "SurgeVector",
  taxila: "Taxila",
} as const;

function assertNever(value: never): never {
  throw new Error(`Unhandled idea status: ${value}`);
}

function getStatusClass(status: IdeaSubmissionForReview["status"]) {
  switch (status) {
    case "draft":
      return "border-white/20 bg-white/10 text-white";
    case "submitted":
      return "border-primary/40 bg-primary/10 text-primary";
    case "approved":
      return "border-emerald-400/40 bg-emerald-400/10 text-emerald-200";
    case "rejected":
      return "border-red-400/40 bg-red-400/10 text-red-200";
    default:
      return assertNever(status);
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getIdeaCounts(ideas: IdeaSubmissionForReview[]) {
  return {
    approved: ideas.filter((idea) => idea.status === "approved").length,
    rejected: ideas.filter((idea) => idea.status === "rejected").length,
    submitted: ideas.filter((idea) => idea.status === "submitted").length,
    total: ideas.length,
  };
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
        {label}
      </h3>
      <p className="text-sm leading-6 text-muted-foreground">{value}</p>
    </div>
  );
}

export default async function AdminDashboardRoute() {
  const result = await getIdeaSubmissionsForReview();
  const ideas = result.ideas;
  const counts = getIdeaCounts(ideas);
  const statCards = [
    { icon: ClipboardCheck, label: "Total ideas", value: counts.total },
    { icon: Clock3, label: "Awaiting review", value: counts.submitted },
    { icon: CheckCircle2, label: "Approved", value: counts.approved },
    { icon: XCircle, label: "Rejected", value: counts.rejected },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-8 lg:px-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,106,0,0.26),transparent_28rem),radial-gradient(circle_at_86%_8%,rgba(255,255,255,0.1),transparent_24rem)]"
      />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to hackathon
            </Link>
          </Button>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="secondary">
              <Link href="/register/idea">Submit idea</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/register/team">Register team</Link>
            </Button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <Card className="overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,106,0,0.18),transparent_46%,rgba(255,255,255,0.06))]"
            />
            <CardHeader className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Admin Review
              </p>
              <CardTitle className="text-4xl sm:text-5xl">
                Approve ideas for team registration.
              </CardTitle>
              <CardDescription className="text-base leading-7">
                Review submitted SurgeVector Hackathon ideas, add optional notes,
                and mark each idea approved or rejected. Approved idea IDs unlock
                Phase 1 team registration.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Minimal Access Assumption
              </p>
              <CardTitle>Internal organizer route</CardTitle>
              <CardDescription className="text-base leading-7">
                This MVP uses the server-side Supabase service role for admin
                review because auth screens and the final ownership model are not
                implemented yet. Supabase Auth and RLS hardening remain tracked
                for the Phase 1 admin model.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section
          aria-label="Idea review summary"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card className="p-5" key={stat.label}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                      {stat.value}
                    </p>
                  </div>
                  <span className="rounded-2xl border border-primary/30 bg-primary/10 p-3 text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                </div>
              </Card>
            );
          })}
        </section>

        {!result.ok ? (
          <Card className="border-primary/40">
            <CardHeader>
              <CardTitle>Submitted ideas could not be loaded</CardTitle>
              <CardDescription className="text-base leading-7">
                {result.message}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {result.ok && ideas.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No submitted ideas yet</CardTitle>
              <CardDescription className="text-base leading-7">
                Ideas submitted from the participant intake form will appear here
                for approval or rejection.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {ideas.length > 0 ? (
          <section aria-label="Submitted ideas" className="grid gap-5">
            {ideas.map((idea) => (
              <Card className="overflow-hidden" key={idea.id}>
                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                  <div className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                          {organizationLabels[idea.organization]} / {idea.department}
                        </p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                          {idea.idea_title}
                        </h2>
                      </div>
                      <span
                        className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getStatusClass(
                          idea.status,
                        )}`}
                      >
                        {idea.status}
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-border bg-black/25 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Participant
                        </p>
                        <p className="mt-2 font-semibold text-white">
                          {idea.participant_full_name}
                        </p>
                        <p className="mt-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail aria-hidden="true" className="size-4" />
                          {idea.participant_email}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border bg-black/25 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Submitted
                        </p>
                        <p className="mt-2 font-semibold text-white">
                          {formatDate(idea.submitted_at)}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Idea ID: {idea.id}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-3">
                      <DetailBlock
                        label="Problem Statement"
                        value={idea.problem_statement}
                      />
                      <DetailBlock
                        label="Proposed Solution"
                        value={idea.proposed_solution}
                      />
                      <DetailBlock label="AI Usage" value={idea.ai_usage} />
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-black/25 p-5">
                    <IdeaReviewForm
                      currentStatus={idea.status}
                      defaultReviewNotes={idea.review_notes}
                      ideaId={idea.id}
                    />
                    {idea.reviewed_at ? (
                      <p className="mt-4 text-xs leading-5 text-muted-foreground">
                        Last reviewed {formatDate(idea.reviewed_at)}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}
