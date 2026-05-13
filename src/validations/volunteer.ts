import { z } from "zod";

export const volunteerRegistrationSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  department: z.string().min(2).max(120),
  preferredRoles: z.array(z.string().min(2).max(80)).min(1),
  availabilityNotes: z.string().max(1000).optional(),
});

export type VolunteerRegistrationInput = z.infer<
  typeof volunteerRegistrationSchema
>;
