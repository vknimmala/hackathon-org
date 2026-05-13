import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const foundationLinks = [
  { href: "/register/team", label: "Team registration" },
  { href: "/register/volunteer", label: "Volunteer registration" },
  { href: "/admin", label: "Admin dashboard" },
  { href: "/admin/mentors", label: "Mentor management" },
];

export default function LandingFoundationPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-12">
      <section className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
            Phase 1 MVP Foundation
          </p>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
              SurgeVector Hackathon 2026
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              A focused registration platform foundation for SurgeVector and
              Taxila teams, scoped to landing, registrations, mentors,
              volunteers, admin, analytics, and simple gamification.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/register/team">
                Start team registration
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/admin">Admin foundation</Link>
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Phase 1 Route Map</CardTitle>
            <CardDescription>
              Placeholder routes only. Feature implementation comes next.
            </CardDescription>
          </CardHeader>
          <nav aria-label="Phase 1 foundation routes" className="mt-6 grid gap-3">
            {foundationLinks.map((item) => (
              <Link
                className="rounded-lg border border-border bg-white/5 px-4 py-3 text-sm text-muted-foreground transition hover:border-primary/60 hover:text-white"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </Card>
      </section>
    </main>
  );
}
