import { z } from "zod";

export const ideaReviewSchema = z.object({
  ideaId: z.string().uuid({ message: "A valid idea ID is required." }),
  reviewNotes: z.string().max(1000, "Review notes must stay under 1000 characters."),
  reviewStatus: z.enum(["approved", "rejected"]),
});

export type IdeaReviewInput = z.infer<typeof ideaReviewSchema>;
