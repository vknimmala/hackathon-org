"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  submitTeamRegistrationAction,
  type RegistrationActionResult,
} from "@/features/registration/actions/registration-actions";
import type { AvailableTeamIdea } from "@/features/registration/queries/team-registration-queries";
import {
  teamRegistrationSchema,
  type TeamRegistrationInput,
} from "@/validations/registration";

const organizationOptions = [
  { label: "SurgeVector", value: "surgevector" },
  { label: "Taxilla", value: "taxilla" },
] as const;

const defaultMember = {
  email: "",
  fullName: "",
  role: "Builder",
};

const defaultValues: TeamRegistrationInput = {
  ideaSubmissionId: "",
  members: [defaultMember],
  organization: "surgevector",
  projectSummary: "",
  teamName: "",
};

interface TeamRegistrationFormProps {
  availableIdeas: AvailableTeamIdea[];
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="text-sm font-medium text-primary" role="alert">
      {message}
    </p>
  );
}

const labelClass = "text-sm font-semibold text-[#15110d]";
const selectClass =
  "h-11 w-full rounded-lg border border-orange-200/70 bg-white/80 px-3 text-sm text-[#15110d] outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/20";

export function TeamRegistrationForm({ availableIdeas }: TeamRegistrationFormProps) {
  const [result, setResult] = useState<RegistrationActionResult | null>(null);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<TeamRegistrationInput>({
    defaultValues,
    resolver: zodResolver(teamRegistrationSchema),
  });
  const { append, fields, remove } = useFieldArray({
    control,
    name: "members",
  });

  async function onSubmit(values: TeamRegistrationInput) {
    setResult(null);

    const response = await submitTeamRegistrationAction(values);
    setResult(response);

    if (response.ok) {
      reset(defaultValues);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className={labelClass}>Idea to build</span>
          <select
            className={selectClass}
            disabled={availableIdeas.length === 0 || isSubmitting}
            {...register("ideaSubmissionId")}
          >
            <option value="">Select an available idea</option>
            {availableIdeas.map((idea) => (
              <option key={idea.id} value={idea.id}>
                {idea.idea_title} — {idea.participant_full_name}
              </option>
            ))}
          </select>
          <p className="text-xs leading-5 text-[#66584c]">
            Original submitters have 1 hour of priority. After that, anyone can
            claim an unclaimed idea.
          </p>
          <FieldError message={errors.ideaSubmissionId?.message} />
        </label>

        <label className="space-y-2">
          <span className={labelClass}>Team name</span>
          <Input placeholder="Your hackathon team name" {...register("teamName")} />
          <FieldError message={errors.teamName?.message} />
        </label>

        <label className="space-y-2">
          <span className={labelClass}>Organization</span>
          <select className={selectClass} {...register("organization")}>
            {organizationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FieldError message={errors.organization?.message} />
        </label>
      </div>

      <label className="block space-y-2">
        <span className={labelClass}>Execution note</span>
        <Textarea
          placeholder="Optional: a short note about how this team will execute the selected idea."
          {...register("projectSummary")}
        />
        <FieldError message={errors.projectSummary?.message} />
      </label>

      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#15110d]">Team members</h2>
            <p className="text-sm text-[#66584c]">
              Add one to four members. The first member is the captain and point
              of contact.
            </p>
          </div>
          <Button
            disabled={fields.length >= 4 || isSubmitting}
            onClick={() => append({ ...defaultMember })}
            type="button"
            variant="secondary"
            className="border-orange-200/70 bg-white/80 text-[#15110d] hover:bg-primary/10 hover:text-[#15110d]"
          >
            Add member
          </Button>
        </div>

        {fields.map((field, index) => (
          <div
            className="rounded-xl border border-orange-200/60 bg-orange-50/30 p-4"
            key={field.id}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                {index === 0 ? "Captain / Point of contact" : `Member ${index + 1}`}
              </p>
              <Button
                disabled={fields.length === 1 || isSubmitting}
                onClick={() => remove(index)}
                size="sm"
                type="button"
                variant="ghost"
                className="text-[#66584c] hover:bg-primary/10 hover:text-[#15110d]"
              >
                Remove
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="space-y-2">
                <span className={labelClass}>Full name</span>
                <Input {...register(`members.${index}.fullName`)} />
                <FieldError message={errors.members?.[index]?.fullName?.message} />
              </label>
              <label className="space-y-2">
                <span className={labelClass}>Email</span>
                <Input
                  autoComplete="email"
                  type="email"
                  {...register(`members.${index}.email`)}
                />
                <FieldError message={errors.members?.[index]?.email?.message} />
              </label>
              <label className="space-y-2">
                <span className={labelClass}>Role</span>
                <Input
                  placeholder="Builder, designer, presenter..."
                  {...register(`members.${index}.role`)}
                />
                <FieldError message={errors.members?.[index]?.role?.message} />
              </label>
            </div>
          </div>
        ))}
      </div>

      {result ? (
        <div
          className="rounded-xl border border-orange-200/60 bg-orange-50/50 p-4 text-sm"
          role="status"
        >
          <p className={result.ok ? "text-[#15110d]" : "text-primary"}>
            {result.message}
          </p>
          {result.ok ? (
            <p className="mt-2 text-[#66584c]">Team ID: {result.id}</p>
          ) : null}
        </div>
      ) : null}

      <Button
        className="w-full sm:w-auto"
        disabled={isSubmitting || availableIdeas.length === 0}
        type="submit"
      >
        {isSubmitting ? "Registering team..." : "Register team"}
      </Button>
    </form>
  );
}
