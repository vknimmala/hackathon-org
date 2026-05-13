import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Award, BarChart3, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLeaderboard } from "@/features/gamification/queries/leaderboard-queries";
import type { LeaderboardTeam } from "@/features/gamification/queries/leaderboard-queries";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "Simple SurgeVector Hackathon team leaderboard for participation points, badges, and completion progress.",
};

const organizationLabels = {
  surgevector: "SurgeVector",
  taxila: "Taxila",
} as const;

function getLeaderboardStats(entries: LeaderboardTeam[]) {
  return {
    badges: entries.reduce((total, entry) => total + entry.badges.length, 0),
    points: entries.reduce((total, entry) => total + entry.totalPoints, 0),
    teams: entries.length,
  };
}

function ProgressBar({ value }: { value: number }) {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/10">
      <div
        aria-hidden="true"
        className="h-full rounded-full bg-primary"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}

export default async function LeaderboardRoute() {
  const result = await getLeaderboard();
  const entries = result.entries;
  const stats = getLeaderboardStats(entries);
  const statCards = [
    { icon: Trophy, label: "Teams", value: stats.teams },
    { icon: BarChart3, label: "Total points", value: stats.points },
    { icon: Award, label: "Badges earned", value: stats.badges },
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
          <Button asChild variant="secondary">
            <Link href="/register">Register now</Link>
          </Button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
          <Card className="overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,106,0,0.18),transparent_46%,rgba(255,255,255,0.06))]"
            />
            <CardHeader className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Simple Gamification
              </p>
              <CardTitle className="text-4xl sm:text-5xl">
                Track participation, badges, and progress.
              </CardTitle>
              <CardDescription className="text-base leading-7">
                Phase 1 keeps the leaderboard lightweight: teams are ordered by
                total points when present, then participation points from the team
                record.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <span className="mb-2 inline-flex size-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                <Sparkles aria-hidden="true" className="size-6" />
              </span>
              <CardTitle>No realtime scoring engine</CardTitle>
              <CardDescription className="text-base leading-7">
                This page reads the existing Phase 1 gamification tables only.
                Audience voting, advanced ranking, judging workflows, and XP
                systems stay out of scope.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section
          aria-label="Leaderboard summary"
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

        {!result.ok ? (
          <Card className="border-primary/40">
            <CardHeader>
              <CardTitle>Leaderboard could not be loaded</CardTitle>
              <CardDescription className="text-base leading-7">
                {result.message}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {result.ok && entries.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No teams on the leaderboard yet</CardTitle>
              <CardDescription className="text-base leading-7">
                Registered teams will appear here once they have participation
                points or leaderboard entries.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {entries.length > 0 ? (
          <section aria-label="Team leaderboard" className="grid gap-5">
            {entries.map((entry, index) => (
              <Card className="overflow-hidden" key={entry.id}>
                <div className="grid gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-start">
                  <div className="flex size-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-2xl font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                        {organizationLabels[entry.organization]} / {entry.status}
                      </p>
                      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                        {entry.name}
                      </h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-4 text-sm">
                          <span className="font-semibold text-white">
                            Completion progress
                          </span>
                          <span className="text-muted-foreground">
                            {entry.completionProgress}%
                          </span>
                        </div>
                        <ProgressBar value={entry.completionProgress} />
                      </div>
                      <div className="rounded-xl border border-border bg-black/25 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Participation points
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-white">
                          {entry.participation_points}
                        </p>
                      </div>
                    </div>
                    {entry.badges.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {entry.badges.map((badge) => (
                          <span
                            className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                            key={`${entry.id}-${badge.label}`}
                            title={badge.description}
                          >
                            {badge.label}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="rounded-2xl border border-primary/30 bg-primary/10 px-5 py-4 text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                      Total
                    </p>
                    <p className="mt-2 text-4xl font-semibold text-white">
                      {entry.totalPoints}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </section>
        ) : null}

        {result.ok && result.achievements.length > 0 ? (
          <section aria-labelledby="available-badges" className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Badge Catalog
              </p>
              <h2
                className="mt-2 text-2xl font-semibold text-white"
                id="available-badges"
              >
                Available participation badges
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {result.achievements.map((achievement) => (
                <Card className="p-5" key={achievement.id}>
                  <div className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-lg text-primary">
                      {achievement.badge_icon ?? "SV"}
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">
                        {achievement.name}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {achievement.description ?? achievement.code}
                      </p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                        {achievement.points} points
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
