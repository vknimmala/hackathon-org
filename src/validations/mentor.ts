import { z } from "zod";

const expertiseItemSchema = z.string().trim().min(2).max(80);

function splitExpertise(value: string) {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export const mentorProfileSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  expertise: z.array(expertiseItemSchema).min(1),
  capacity: z.coerce.number().int().min(1).max(12),
  isAvailable: z.boolean(),
});

export type MentorProfileInput = z.infer<typeof mentorProfileSchema>;

export const mentorCreateFormSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  expertise: z.string().transform(splitExpertise).pipe(z.array(expertiseItemSchema).min(1)),
  capacity: z.coerce.number().int().min(1).max(12),
  isAvailable: z.boolean(),
});

export type MentorCreateInput = z.infer<typeof mentorCreateFormSchema>;
