import { z } from "zod";

export const mentorProfileSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  expertise: z.array(z.string().min(2).max(80)).min(1),
  capacity: z.number().int().min(1).max(12),
  isAvailable: z.boolean(),
});

export type MentorProfileInput = z.infer<typeof mentorProfileSchema>;
