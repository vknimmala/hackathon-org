"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  submitVolunteerRegistrationAction,
  type VolunteerRegistrationActionResult,
} from "@/features/volunteers/actions/volunteer-registration-actions";
import {
  volunteerRegistrationSchema,
  type VolunteerRegistrationInput,
} from "@/validations/volunteer";

const roleOptions = [
  "Check-in support",
  "Participant support",
  "Mentor coordination",
  "Demo day logistics",
] as const;

const defaultValues: VolunteerRegistrationInput = {
  availabilityNotes: "",
  department: "",
  email: "",
  fullName: "",
  preferredRoles: [],
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

export function VolunteerRegistrationForm() {
  const [result, setResult] =
    useState<VolunteerRegistrationActionResult | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<VolunteerRegistrationInput>({
    defaultValues,
    resolver: zodResolver(volunteerRegistrationSchema),
  });

  async function onSubmit(values: VolunteerRegistrationInput) {
    setResult(null);

    const response = await submitVolunteerRegistrationAction(values);
    setResult(response);

    if (response.ok) {
      reset(defaultValues);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-[#15110d]">Full name</span>
          <Input
            autoComplete="name"
            placeholder="Your name"
            {...register("fullName")}
          />
          <FieldError message={errors.fullName?.message} />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-[#15110d]">Work email</span>
          <Input
            autoComplete="email"
            placeholder="you@surgevector.com"
            type="email"
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </label>
      </div>

      <label className="space-y-2 block">
        <span className="text-sm font-semibold text-[#15110d]">
          Team or department
        </span>
        <Input
          placeholder="Engineering, AI Platform, Taxilla Labs..."
          {...register("department")}
        />
        <FieldError message={errors.department?.message} />
      </label>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-[#15110d]">
          Preferred roles
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {roleOptions.map((role) => (
            <label
              className="flex items-start gap-3 rounded-xl border border-orange-200/60 bg-orange-50/30 p-4 text-sm text-[#15110d] transition focus-within:border-primary/70"
              key={role}
            >
              <input
                className="mt-1 size-4 rounded border-border accent-primary"
                type="checkbox"
                value={role}
                {...register("preferredRoles")}
              />
              <span>{role}</span>
            </label>
          ))}
        </div>
        <FieldError message={errors.preferredRoles?.message} />
      </fieldset>

      <label className="space-y-2 block">
        <span className="text-sm font-semibold text-[#15110d]">
          Availability notes
        </span>
        <Textarea
          placeholder="Share when you can help and any coordination context organizers should know."
          {...register("availabilityNotes")}
        />
        <FieldError message={errors.availabilityNotes?.message} />
      </label>

      {result ? (
        <div
          className="rounded-xl border border-orange-200/60 bg-orange-50/50 p-4 text-sm"
          role="status"
        >
          <p className={result.ok ? "text-[#15110d]" : "text-primary"}>
            {result.message}
          </p>
          {result.ok ? (
            <p className="mt-2 text-[#66584c]">
              Volunteer registration ID: {result.id}
            </p>
          ) : null}
        </div>
      ) : null}

      <Button className="w-full sm:w-auto" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Submitting volunteer registration..." : "Register as volunteer"}
      </Button>
    </form>
  );
}
