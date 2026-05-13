"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  updateTeamRegistrationAction,
  type RegistrationActionResult,
} from "@/features/registration/actions/registration-actions";
import type { TeamRegistrationForEdit } from "@/features/registration/queries/registration-edit-queries";
import {
  teamRegistrationEditSchema,
  type TeamRegistrationEditInput,
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

function getDefaultValues(
  registration: TeamRegistrationForEdit,
): TeamRegistrationEditInput {
  return {
    members:
      registration.members.length > 0
        ? registration.members.map((member) => ({
            email: member.email,
            fullName: member.full_name,
            id: member.id,
            role: member.role,
          }))
        : [defaultMember],
    organization: registration.organization,
    projectSummary: registration.project_summary ?? "",
    registrationId: registration.id,
    teamName: registration.name,
  };
}

export function TeamRegistrationEditForm({
  registration,
}: {
  registration: TeamRegistrationForEdit;
}) {
  const router = useRouter();
  const [result, setResult] = useState<RegistrationActionResult | null>(null);
  const defaultValues = useMemo(
    () => getDefaultValues(registration),
    [registration],
  );
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<TeamRegistrationEditInput>({
    defaultValues,
    resolver: zodResolver(teamRegistrationEditSchema),
  });
  const { append, fields, remove } = useFieldArray({
    control,
    keyName: "fieldKey",
    name: "members",
  });

  async function onSubmit(values: TeamRegistrationEditInput) {
    setResult(null);

    const response = await updateTeamRegistrationAction(values);
    setResult(response);

    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("registrationId")} />

      <div className="grid gap-4 sm:grid-cols-2">
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

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-white">
          Team execution note
        </span>
        <Textarea
          placeholder="Optional: update how this team will execute the approved idea."
          {...register("projectSummary")}
        />
        <FieldError message={errors.projectSummary?.message} />
      </label>

      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Team members</h2>
            <p className="text-sm text-muted-foreground">
              Keep one to three members. The first member is the primary contact.
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
            key={field.fieldKey}
          >
            <input type="hidden" {...register(`members.${index}.id`)} />
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
            <p className="mt-2 text-muted-foreground">
              Registration ID: {result.id}
            </p>
          ) : null}
        </div>
      ) : null}

      <Button className="w-full sm:w-auto" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Saving registration..." : "Save registration updates"}
      </Button>
    </form>
  );
}
