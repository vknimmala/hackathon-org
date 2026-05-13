"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  submitIdeaAction,
  type RegistrationActionResult,
} from "@/features/registration/actions/registration-actions";
import {
  ideaSubmissionSchema,
  type IdeaSubmissionInput,
} from "@/validations/registration";

const organizationOptions = [
  { label: "SurgeVector", value: "surgevector" },
  { label: "Taxilla", value: "taxilla" },
] as const;

const defaultValues: IdeaSubmissionInput = {
  aiUsage: "",
  department: "",
  ideaTitle: "",
  organization: "surgevector",
  participantEmail: "",
  participantFullName: "",
  problemStatement: "",
  proposedSolution: "",
};

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

export function IdeaSubmissionForm() {
  const [result, setResult] = useState<RegistrationActionResult | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<IdeaSubmissionInput>({
    defaultValues,
    resolver: zodResolver(ideaSubmissionSchema),
  });

  async function onSubmit(values: IdeaSubmissionInput) {
    setResult(null);

    const response = await submitIdeaAction(values);
    setResult(response);

    if (response.ok) {
      reset(defaultValues);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className={labelClass}>Full name</span>
          <Input
            autoComplete="name"
            placeholder="Your name"
            {...register("participantFullName")}
          />
          <FieldError message={errors.participantFullName?.message} />
        </label>

        <label className="space-y-2">
          <span className={labelClass}>Work email</span>
          <Input
            autoComplete="email"
            placeholder="you@surgevector.com"
            type="email"
            {...register("participantEmail")}
          />
          <FieldError message={errors.participantEmail?.message} />
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

        <label className="space-y-2">
          <span className={labelClass}>Team or department</span>
          <Input
            placeholder="AI Platform, Taxilla Labs..."
            {...register("department")}
          />
          <FieldError message={errors.department?.message} />
        </label>
      </div>

      <label className="block space-y-2">
        <span className={labelClass}>Idea title</span>
        <Input
          placeholder="A short, memorable project name"
          {...register("ideaTitle")}
        />
        <FieldError message={errors.ideaTitle?.message} />
      </label>

      <label className="block space-y-2">
        <span className={labelClass}>Problem statement</span>
        <Textarea
          placeholder="What internal workflow, customer pain, or operational gap should this idea solve?"
          {...register("problemStatement")}
        />
        <FieldError message={errors.problemStatement?.message} />
      </label>

      <label className="block space-y-2">
        <span className={labelClass}>Proposed solution</span>
        <Textarea
          placeholder="Describe the prototype you want to build during the hackathon."
          {...register("proposedSolution")}
        />
        <FieldError message={errors.proposedSolution?.message} />
      </label>

      <label className="block space-y-2">
        <span className={labelClass}>AI usage</span>
        <Textarea
          placeholder="Explain how AI will be used in this idea."
          {...register("aiUsage")}
        />
        <FieldError message={errors.aiUsage?.message} />
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
            <p className="mt-2 text-[#66584c]">Idea ID: {result.id}</p>
          ) : null}
        </div>
      ) : null}

      <Button className="w-full sm:w-auto" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Submitting..." : "Submit idea"}
      </Button>
    </form>
  );
}
