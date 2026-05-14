"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Handshake,
  Lightbulb,
  Users,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VolunteerRegistrationForm } from "@/features/volunteers/components/volunteer-registration-form";

type Tab = "participant" | "volunteer";

interface RegisterPageProps {
  isIdeaOpen: boolean;
}

const volunteerNotes = [
  {
    description:
      "Help with check-ins, participant questions, logistics, and demo-day readiness.",
    icon: Handshake,
    title: "Support the event",
  },
  {
    description:
      "Share the times you can help so organizers can coordinate coverage manually.",
    icon: CalendarCheck,
    title: "Share availability",
  },
  {
    description:
      "Keep the hackathon moving for SurgeVector and Taxilla builders without adding shift workflows.",
    icon: UsersRound,
    title: "Enable builders",
  },
];

export function RegisterPage({ isIdeaOpen }: RegisterPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>("participant");

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
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <Button
            asChild
            className="text-[#15110d] hover:bg-primary/10 hover:text-[#15110d]"
            variant="ghost"
          >
            <Link href="/">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to hackathon
            </Link>
          </Button>
          <Button
            asChild
            className="border-orange-200/70 bg-white/80 text-[#15110d] hover:bg-primary/10 hover:text-[#15110d]"
            variant="secondary"
          >
            <Link href="/leaderboard">View leaderboard</Link>
          </Button>
        </header>

        {/* Tab toggle */}
        <div
          className="flex w-fit rounded-xl border border-orange-200/60 bg-white/60 p-1.5"
          role="tablist"
          aria-label="Registration type"
        >
          {(["participant", "volunteer"] as Tab[]).map((tab) => (
            <button
              aria-selected={activeTab === tab}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-primary text-white shadow-sm"
                  : "text-[#66584c] hover:text-[#15110d]"
              }`}
              key={tab}
              onClick={() => setActiveTab(tab)}
              role="tab"
              type="button"
            >
              {tab === "participant" ? "Participant" : "Volunteer"}
            </button>
          ))}
        </div>

        {/* Participant tab */}
        {activeTab === "participant" && (
          <div className="flex flex-col gap-8">
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-[#15110d] sm:text-5xl">
                Submit an idea. Form a team. Build.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[#5f5348]">
                Submit your idea before May 22. You have 1 hour of priority to
                register your team, then the idea enters the shared pool for
                anyone to claim.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Idea submission card */}
              <div
                className={`rounded-2xl border p-7 shadow-[0_18px_60px_rgba(17,17,17,0.08)] backdrop-blur-xl ${
                  isIdeaOpen
                    ? "border-orange-200/70 bg-white/80"
                    : "border-orange-200/40 bg-white/50 opacity-70"
                }`}
              >
                <span className="mb-5 flex size-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                  <Lightbulb aria-hidden="true" className="size-6" />
                </span>
                <h2 className="text-2xl font-semibold text-[#15110d]">
                  Idea submission
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#66584c]">
                  {isIdeaOpen
                    ? "Submit your AI idea before May 22. You can register a team straight away or let it enter the shared pool."
                    : "Idea submission is closed. Continue with team registration to claim an available idea."}
                </p>
                <div className="mt-6">
                  {isIdeaOpen ? (
                    <Button asChild>
                      <Link href="/register/idea">
                        Open
                        <ArrowRight aria-hidden="true" className="size-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      className="border-orange-200/60 bg-white/60 text-[#7a6a5b]"
                      disabled
                      variant="secondary"
                    >
                      Closed
                    </Button>
                  )}
                </div>
              </div>

              {/* Team registration card */}
              <div className="rounded-2xl border border-orange-200/70 bg-white/80 p-7 shadow-[0_18px_60px_rgba(17,17,17,0.08)] backdrop-blur-xl">
                <span className="mb-5 flex size-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                  <Users aria-hidden="true" className="size-6" />
                </span>
                <h2 className="text-2xl font-semibold text-[#15110d]">
                  Team registration
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#66584c]">
                  Register as captain for your submitted idea, or claim an
                  available idea from the shared pool.
                </p>
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/register/team">
                      Open
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Volunteer tab */}
        {activeTab === "volunteer" && (
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-[#15110d] sm:text-5xl">
                Help run the hackathon.
              </h1>
              <p className="text-base leading-7 text-[#5f5348]">
                Register your contact details, preferred support roles, and
                availability notes so organizers can coordinate event coverage.
              </p>

              <div className="grid gap-4">
                {volunteerNotes.map((note) => {
                  const Icon = note.icon;
                  return (
                    <Card
                      className="border-orange-200/60 bg-white/70 text-[#15110d] shadow-[0_18px_60px_rgba(17,17,17,0.07)]"
                      key={note.title}
                    >
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                            <Icon aria-hidden="true" className="size-5" />
                          </span>
                          <div>
                            <CardTitle className="text-base text-[#15110d]">
                              {note.title}
                            </CardTitle>
                            <CardDescription className="mt-1 text-sm leading-6 text-[#66584c]">
                              {note.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>

            <Card className="h-fit border-orange-200/60 bg-white/80 text-[#15110d] shadow-[0_30px_80px_rgba(17,17,17,0.10)]">
              <CardHeader className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Volunteer Registration
                </p>
                <CardTitle className="text-[#15110d]">
                  Tell organizers how you can help
                </CardTitle>
                <CardDescription className="text-[#66584c]">
                  This creates a submitted volunteer record only. Assignments
                  and scheduling stay outside this Phase 1 form.
                </CardDescription>
              </CardHeader>
              <VolunteerRegistrationForm />
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
