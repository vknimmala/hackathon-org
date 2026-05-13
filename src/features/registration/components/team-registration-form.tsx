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
import {
  teamRegistrationSchema,
  type TeamRegistrationInput,
} from "@/validations/registration";

const organizationOptions = [
  { label: "SurgeVector", value: "surgevector" },
  { label: "Taxila", value: "taxila" },
] as const;

const defaultMember = {
  email: "",
  fullName: "",
  role: "Builder",
};

const defaultValues: TeamRegistrationInput = {
  approvedIdeaId: "",
  members: [defaultMember],
  organization: "surgevector",
  projectSummary: "",
  teamName: "",
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="text-sm font-medium text-primary" role="alert">
      {message}
    </p>
  );
}

export function TeamRegistrationForm() {
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
          <span className="text-sm font-semibold text-white">
            Approved idea ID
          </span>
          <Input
            placeholder="UUID from the approved idea submission"
            {...register("approvedIdeaId")}
          />
          <FieldError message={errors.approvedIdeaId?.message} />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white">Team name</span>
          <Input placeholder="Your hackathon team name" {...register("teamName")} />
          <FieldError message={errors.teamName?.message} />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white">Organization</span>
          <select
            className="h-11 w-full rounded-lg border border-border bg-black/30 px-3 text-sm text-white outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-ring/50"
            {...register("organization")}
          >
            {organizationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FieldError message={errors.organization?.message} />
        </label>
      </div>

      <label className="space-y-2 block">
        <span className="text-sm font-semibold text-white">
          Team execution note
        </span>
        <Textarea
          placeholder="Optional: add a short note about how this team will execute the approved idea."
          {...register("projectSummary")}
        />
        <FieldError message={errors.projectSummary?.message} />
      </label>

      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Team members</h2>
            <p className="text-sm text-muted-foreground">
              Add one to three members. The first member is the primary contact.
            </p>
          </div>
          <Button
            disabled={fields.length >= 3 || isSubmitting}
            onClick={() => append({ ...defaultMember })}
            type="button"
            variant="secondary"
          >
            Add member
          </Button>
        </div>

        {fields.map((field, index) => (
          <div
            className="rounded-xl border border-border bg-black/25 p-4"
            key={field.id}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Member {index + 1}
              </p>
              <Button
                disabled={fields.length === 1 || isSubmitting}
                onClick={() => remove(index)}
                size="sm"
                type="button"
                variant="ghost"
              >
                Remove
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-white">
                  Full name
                </span>
                <Input {...register(`members.${index}.fullName`)} />
                <FieldError message={errors.members?.[index]?.fullName?.message} />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-white">Email</span>
                <Input
                  autoComplete="email"
                  type="email"
                  {...register(`members.${index}.email`)}
                />
                <FieldError message={errors.members?.[index]?.email?.message} />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-white">Role</span>
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
          className="rounded-xl border border-border bg-black/30 p-4 text-sm text-white"
          role="status"
        >
          <p className={result.ok ? "text-white" : "text-primary"}>
            {result.message}
          </p>
          {result.ok ? (
            <p className="mt-2 text-muted-foreground">Team ID: {result.id}</p>
          ) : null}
        </div>
      ) : null}

      <Button className="w-full sm:w-auto" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Registering team..." : "Register approved team"}
      </Button>
    </form>
  );
}
