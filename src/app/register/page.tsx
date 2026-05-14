import type { Metadata } from "next";
import { isIdeaSubmissionOpen } from "@/lib/constants";
import { RegisterPage } from "@/features/registration/components/register-page";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Register as a participant or volunteer for SurgeVector Hackathon 2026.",
};

export default function RegisterRoute() {
  const isIdeaOpen = isIdeaSubmissionOpen();
  return <RegisterPage isIdeaOpen={isIdeaOpen} />;
}
