import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ClipboardCheck, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TeamRegistrationEditForm } from "@/features/registration/components/team-registration-edit-form";
import { getTeamRegistrationForEdit } from "@/features/registration/queries/registration-edit-queries";

export const metadata: Metadata = {
  title: "Edit Registration",
  description:
    "Edit a SurgeVector Hackathon team registration and preserve audit history.",
};

interface EditRegistrationRouteProps {
  params: Promise<{
    registrationId: string;
  }>;
}

const organizationLabels = {
  surgevector: "SurgeVector",
  taxilla: "Taxilla",
} as const;

function formatDate(value: string | null) {
  if (!value) {
    return "Not submitted yet";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function EditRegistrationRoute({
  params,
}: EditRegistrationRouteProps) {
  const { registrationId } = await params;
  const result = await getTeamRegistrationForEdit(registrationId);
  const registration = result.registration;

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-8 lg:px-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,106,0,0.28),transparent_28rem),radial-gradient(circle_at_86%_12%,rgba(255,255,255,0.12),transparent_22rem)]"
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to hackathon
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/register/team">Register another team</Link>
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
                  Registration Editing
                </p>
                <CardTitle className="text-4xl sm:text-5xl">
                  Keep team details current.
                </CardTitle>
                <CardDescription className="text-base leading-7">
                  Update an existing Phase 1 team registration while preserving
                  member limits and writing an audit log after each successful
                  save.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <span className="mb-2 inline-flex size-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                  <ClipboardCheck aria-hidden="true" className="size-5" />
                </span>
                <CardTitle>Registration ID</CardTitle>
                <CardDescription className="break-all leading-6">
                  {registrationId}
                </CardDescription>
              </CardHeader>
            </Card>

            {registration ? (
              <>
                <Card>
                  <CardHeader>
                    <span className="mb-2 inline-flex size-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                      <FileText aria-hidden="true" className="size-5" />
                    </span>
                    <CardTitle>Linked idea</CardTitle>
                    <CardDescription className="leading-6">
                      {registration.idea
                        ? `${registration.idea.idea_title} (${registration.idea.status})`
                        : "No linked idea details were found for this registration."}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <span className="mb-2 inline-flex size-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                      <Users aria-hidden="true" className="size-5" />
                    </span>
                    <CardTitle>Current scope</CardTitle>
                    <CardDescription className="leading-6">
                      {organizationLabels[registration.organization]} team,
                      status {registration.status}, submitted{" "}
                      {formatDate(registration.submitted_at)}.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </>
            ) : null}
          </div>

          <div className="space-y-6">
            {!result.ok ? (
              <Card className="border-primary/40">
                <CardHeader>
                  <CardTitle>Registration could not be loaded</CardTitle>
                  <CardDescription className="text-base leading-7">
                    {result.message}
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : null}

            {result.ok && !registration ? (
              <Card>
                <CardHeader>
                  <CardTitle>No registration found</CardTitle>
                  <CardDescription className="text-base leading-7">
                    Check the registration ID and try again. Deleted or unknown
                    team registrations are not editable.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : null}

            {registration && registration.members.length === 0 ? (
              <Card className="border-primary/40">
                <CardHeader>
                  <CardTitle>No active team members found</CardTitle>
                  <CardDescription className="text-base leading-7">
                    Add at least one member before saving. Phase 1 teams must
                    have one to four active members.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : null}

            {registration ? (
              <Card className="h-fit">
                <CardHeader className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                    Editable Team Registration
                  </p>
                  <CardTitle>Update team and member details</CardTitle>
                  <CardDescription>
                    The first member listed becomes the primary contact for
                    mentor coordination.
                  </CardDescription>
                </CardHeader>
                <TeamRegistrationEditForm
                  key={`${registration.id}-${registration.updated_at}`}
                  registration={registration}
                />
              </Card>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
