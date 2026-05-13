"use client";

import { useActionState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  initialIdeaReviewActionState,
  reviewIdeaSubmissionAction,
} from "@/features/admin/actions/idea-review-actions";

interface IdeaReviewFormProps {
  currentStatus: string;
  defaultReviewNotes: string | null;
  ideaId: string;
}

function ReviewButton({
  children,
  value,
  variant = "primary",
}: {
  children: ReactNode;
  value: "approved" | "rejected";
  variant?: "primary" | "secondary";
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      name="reviewStatus"
      type="submit"
      value={value}
      variant={variant}
    >
      {pending ? "Saving review..." : children}
    </Button>
  );
}

export function IdeaReviewForm({
  currentStatus,
  defaultReviewNotes,
  ideaId,
}: IdeaReviewFormProps) {
  const [state, formAction] = useActionState(
    reviewIdeaSubmissionAction,
    initialIdeaReviewActionState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input name="ideaId" type="hidden" value={ideaId} />
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-white">Review notes</span>
        <Textarea
          defaultValue={defaultReviewNotes ?? ""}
          maxLength={1000}
          name="reviewNotes"
          placeholder="Optional context for organizers or follow-up."
        />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <ReviewButton value="approved">Approve idea</ReviewButton>
        <ReviewButton value="rejected" variant="secondary">
          Reject idea
        </ReviewButton>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        Current status: <span className="font-semibold text-white">{currentStatus}</span>
      </p>
      {state.message ? (
        <p
          aria-live="polite"
          className={state.ok ? "text-sm text-white" : "text-sm text-primary"}
          role="status"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
