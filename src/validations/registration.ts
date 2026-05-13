import { z } from "zod";

export const teamMemberSchema = z.object({
  fullName: z.string().min(2, "Enter the member's full name.").max(120),
  email: z.string().email("Enter a valid member email address."),
  role: z.string().min(2, "Enter the member's role.").max(80),
});

export const ideaSubmissionSchema = z.object({
  participantFullName: z.string().min(2, "Enter your full name.").max(120),
  participantEmail: z.string().email("Enter a valid work email address."),
  organization: z.enum(["surgevector", "taxila"]),
  department: z.string().min(2, "Enter your team or department.").max(120),
  ideaTitle: z.string().min(4, "Give your idea a clear title.").max(140),
  problemStatement: z
    .string()
    .min(20, "Describe the problem in at least 20 characters.")
    .max(1200),
  proposedSolution: z
    .string()
    .min(20, "Describe the solution in at least 20 characters.")
    .max(1200),
  aiUsage: z
    .string()
    .min(10, "Describe how AI will be used.")
    .max(800),
});

export const teamRegistrationSchema = z
  .object({
    approvedIdeaId: z
      .string()
      .uuid({ message: "Enter a valid approved idea ID." }),
    teamName: z.string().min(2, "Enter a team name.").max(120),
    organization: z.enum(["surgevector", "taxila"]),
    projectSummary: z.string().max(1000).optional(),
    members: z
      .array(teamMemberSchema)
      .min(1, "Add at least one team member.")
      .max(3, "A team can have at most three members."),
  })
  .superRefine((value, context) => {
    const memberEmails = new Set<string>();

    value.members.forEach((member, index) => {
      const email = member.email.toLowerCase();

      if (memberEmails.has(email)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Each member email must be unique.",
          path: ["members", index, "email"],
        });
      }

      memberEmails.add(email);
    });
  });

export const teamMemberEditSchema = teamMemberSchema.extend({
  id: z.string().uuid().optional(),
});

export const teamRegistrationEditSchema = z
  .object({
    members: z
      .array(teamMemberEditSchema)
      .min(1, "Add at least one team member.")
      .max(3, "A team can have at most three members."),
    organization: z.enum(["surgevector", "taxila"]),
    projectSummary: z.string().max(1000).optional(),
    registrationId: z
      .string()
      .uuid({ message: "Enter a valid registration ID." }),
    teamName: z.string().min(2, "Enter a team name.").max(120),
  })
  .superRefine((value, context) => {
    const memberEmails = new Set<string>();

    value.members.forEach((member, index) => {
      const email = member.email.toLowerCase();

      if (memberEmails.has(email)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Each member email must be unique.",
          path: ["members", index, "email"],
        });
      }

      memberEmails.add(email);
    });
  });

export type IdeaSubmissionInput = z.infer<typeof ideaSubmissionSchema>;
export type TeamRegistrationEditInput = z.infer<
  typeof teamRegistrationEditSchema
>;
export type TeamRegistrationInput = z.infer<typeof teamRegistrationSchema>;
