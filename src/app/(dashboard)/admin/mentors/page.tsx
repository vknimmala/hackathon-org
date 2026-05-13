import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MentorCreateForm } from "@/features/mentors/components/mentor-create-form";
import { getMentorsForAdmin } from "@/features/mentors/queries/mentor-queries";
import type { MentorListItem } from "@/features/mentors/queries/mentor-queries";

export const metadata: Metadata = {
  title: "Admin Mentor Management",
  description:
    "Create and review SurgeVector Hackathon mentor profiles for Phase 1 coordination.",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getMentorCounts(mentors: MentorListItem[]) {
  return {
    available: mentors.filter((mentor) => mentor.is_available).length,
    capacity: mentors.reduce((total, mentor) => total + mentor.capacity, 0),
    total: mentors.length,
  };
}

export default async function MentorManagementRoute() {
  const result = await getMentorsForAdmin();
  const mentors = result.mentors;
  const counts = getMentorCounts(mentors);
  const statCards = [
    { icon: Users, label: "Total mentors", value: counts.total },
    { icon: CheckCircle2, label: "Available", value: counts.available },
    { icon: UserPlus, label: "Total capacity", value: counts.capacity },
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
            <Link href="/admin">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to admin review
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">Back to hackathon</Link>
          </Button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <Card className="overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,106,0,0.18),transparent_46%,rgba(255,255,255,0.06))]"
            />
            <CardHeader className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Mentor Management
              </p>
              <CardTitle className="text-4xl sm:text-5xl">
                Build the Phase 1 mentor bench.
              </CardTitle>
              <CardDescription className="text-base leading-7">
                Create mentor profiles with expertise, capacity, and availability
                so organizers can coordinate teams after registration.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Current Scope
              </p>
              <CardTitle>Simple profiles only</CardTitle>
              <CardDescription className="text-base leading-7">
                This foundation lists mentors and creates profiles in the existing
                table. Matching algorithms, scheduling, realtime updates, and AI
                mentor assistants stay out of Phase 1.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section
          aria-label="Mentor management summary"
          className="grid gap-4 sm:grid-cols-3"
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

        <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <Card>
            <CardHeader className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Add Mentor
              </p>
              <CardTitle>Create a mentor profile</CardTitle>
              <CardDescription className="text-base leading-7">
                Keep capacity realistic for Phase 1. Team assignment controls can
                build on this foundation later.
              </CardDescription>
            </CardHeader>
            <MentorCreateForm />
          </Card>

          <div className="space-y-5">
            {!result.ok ? (
              <Card className="border-primary/40">
                <CardHeader>
                  <CardTitle>Mentors could not be loaded</CardTitle>
                  <CardDescription className="text-base leading-7">
                    {result.message}
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : null}

            {result.ok && mentors.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No mentors yet</CardTitle>
                  <CardDescription className="text-base leading-7">
                    Created mentor profiles will appear here for organizer
                    coordination.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : null}

            {mentors.length > 0 ? (
              <section aria-label="Mentor list" className="grid gap-5">
                {mentors.map((mentor) => {
                  const remainingCapacity = Math.max(
                    mentor.capacity - mentor.current_team_count,
                    0,
                  );

                  return (
                    <Card className="overflow-hidden" key={mentor.id}>
                      <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                              Mentor Profile
                            </p>
                            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                              {mentor.full_name}
                            </h2>
                            <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail aria-hidden="true" className="size-4" />
                              {mentor.email}
                            </p>
                          </div>
                          <span
                            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                              mentor.is_available
                                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                                : "border-red-400/40 bg-red-400/10 text-red-200"
                            }`}
                          >
                            {mentor.is_available ? (
                              <CheckCircle2 aria-hidden="true" className="size-4" />
                            ) : (
                              <XCircle aria-hidden="true" className="size-4" />
                            )}
                            {mentor.is_available ? "Available" : "Unavailable"}
                          </span>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="rounded-xl border border-border bg-black/25 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                              Capacity
                            </p>
                            <p className="mt-2 font-semibold text-white">
                              {mentor.current_team_count} / {mentor.capacity} teams
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {remainingCapacity} remaining
                            </p>
                          </div>
                          <div className="rounded-xl border border-border bg-black/25 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                              Created
                            </p>
                            <p className="mt-2 font-semibold text-white">
                              {formatDate(mentor.created_at)}
                            </p>
                          </div>
                          <div className="rounded-xl border border-border bg-black/25 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                              Mentor ID
                            </p>
                            <p className="mt-2 break-all text-sm text-muted-foreground">
                              {mentor.id}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {mentor.expertise.map((item) => (
                            <span
                              className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                              key={item}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </section>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
