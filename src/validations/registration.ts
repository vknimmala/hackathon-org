import { z } from "zod";

export const teamMemberSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  role: z.string().min(2).max(80),
});

export const teamRegistrationSchema = z.object({
  teamName: z.string().min(2).max(120),
  organization: z.enum(["surgevector", "taxila"]),
  themeId: z.string().uuid().optional(),
  projectSummary: z.string().max(1000).optional(),
  members: z.array(teamMemberSchema).min(1).max(3),
});

export type TeamRegistrationInput = z.infer<typeof teamRegistrationSchema>;
