"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createMentorAction,
  initialMentorCreateActionState,
} from "@/features/mentors/actions/mentor-actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full sm:w-auto" disabled={pending} type="submit">
      {pending ? "Creating mentor..." : "Create mentor"}
    </Button>
  );
}

export function MentorCreateForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(
    createMentorAction,
    initialMentorCreateActionState,
  );

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  return (
    <form action={formAction} className="space-y-6" ref={formRef}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-white">Full name</span>
          <Input
            autoComplete="name"
            name="fullName"
            placeholder="Mentor name"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white">Work email</span>
          <Input
            autoComplete="email"
            name="email"
            placeholder="mentor@surgevector.com"
            required
            type="email"
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-white">Expertise</span>
        <Textarea
          name="expertise"
          placeholder="Data engineering, GenAI apps, modernization"
          required
        />
        <p className="text-xs leading-5 text-muted-foreground">
          Separate expertise areas with commas or new lines.
        </p>
      </label>

      <div className="grid gap-4 sm:grid-cols-[0.75fr_1.25fr]">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-white">Capacity</span>
          <Input
            defaultValue={3}
            min={1}
            max={12}
            name="capacity"
            required
            type="number"
          />
        </label>

        <label className="flex items-start gap-3 rounded-xl border border-border bg-black/25 p-4 text-sm text-white transition focus-within:border-primary/70">
          <input
            className="mt-1 size-4 rounded border-border accent-primary"
            defaultChecked
            name="isAvailable"
            type="checkbox"
          />
          <span>
            <span className="block font-semibold">Available for assignments</span>
            <span className="mt-1 block text-muted-foreground">
              Keep this on for mentors who can receive Phase 1 teams.
            </span>
          </span>
        </label>
      </div>

      {state.message ? (
        <div
          className="rounded-xl border border-border bg-black/30 p-4 text-sm text-white"
          role="status"
        >
          <p className={state.ok ? "text-white" : "text-primary"}>
            {state.message}
          </p>
          {state.ok && state.id ? (
            <p className="mt-2 text-muted-foreground">Mentor ID: {state.id}</p>
          ) : null}
        </div>
      ) : null}

      <SubmitButton />
    </form>
  );
}
