import { z } from "zod";

export const volunteerRegistrationSchema = z.object({
  fullName: z.string().min(2, "Enter your full name.").max(120),
  email: z.string().email("Enter a valid work email address."),
  department: z.string().min(2, "Enter your team or department.").max(120),
  preferredRoles: z
    .array(z.string().min(2).max(80))
    .min(1, "Select at least one volunteer role."),
  availabilityNotes: z.string().max(1000).optional(),
});

export type VolunteerRegistrationInput = z.infer<
  typeof volunteerRegistrationSchema
>;
