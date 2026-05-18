// @ts-nocheck — JSR imports are Deno-only; local TS server can't resolve them.
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@^1";

/**
 * notify-status-change — Supabase Edge Function
 *
 * Sends a status notification email when a registration is approved/rejected.
 *
 * Setup (no custom domain needed):
 *   1. Sign up free at https://resend.com — takes 2 minutes, no card required.
 *   2. Copy your API key from the Resend dashboard.
 *   3. Supabase dashboard → Edge Functions → Manage secrets → add:
 *        RESEND_API_KEY = re_xxxxxxxxxxxx
 *   4. Update SITE_URL below to your live Vercel URL.
 *
 * Emails arrive from "onboarding@resend.dev" — works on the free tier with
 * no domain verification. Swap FROM_EMAIL once you verify your own domain.
 */

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = "onboarding@resend.dev";
const HACKATHON_NAME = "SurgeVector.ai Hackathon 2026";
const SITE_URL = "https://hackathon.surgevector.ai"; // ← update to your live URL

interface Payload {
  registration_id: string;
  status: "approved" | "rejected";
  email: string;
  full_name: string;
  idea_title?: string | null;
}

export default {
  fetch: withSupabase({ auth: ["publishable", "secret"] }, async (req) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "authorization, x-client-info, apikey, content-type",
        },
      });
    }

    if (!RESEND_API_KEY) {
      return Response.json(
        { error: "RESEND_API_KEY secret is not set. See setup instructions in this file." },
        { status: 500 },
      );
    }

    const payload: Payload = await req.json();
    const { status, email, full_name, idea_title } = payload;

    if (status !== "approved" && status !== "rejected") {
      return Response.json({ skipped: true });
    }

    const isApproved = status === "approved";
    const subject = isApproved
      ? `Your idea has been approved — ${HACKATHON_NAME}`
      : `Update on your ${HACKATHON_NAME} submission`;

    const html = isApproved
      ? `
        <h2>Congratulations, ${full_name}!</h2>
        <p>Your submission <strong>${idea_title ?? "your idea"}</strong> has been <strong>approved</strong>.</p>
        <p>You're officially participating in the ${HACKATHON_NAME}. Get ready to build!</p>
        <p><a href="${SITE_URL}/dashboard">View your registration</a></p>
        <p>Good luck,<br/>The SurgeVector Hackathon Team</p>
      `
      : `
        <h2>Hi ${full_name},</h2>
        <p>Thank you for submitting <strong>${idea_title ?? "your idea"}</strong> to the ${HACKATHON_NAME}.</p>
        <p>After review, we weren't able to approve your submission this time. Reach out to the organising team if you have questions.</p>
        <p><a href="${SITE_URL}/dashboard">View your registration</a></p>
        <p>Best,<br/>The SurgeVector Hackathon Team</p>
      `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({ from: FROM_EMAIL, to: email, subject, html }),
    });

    if (!res.ok) {
      const body = await res.text();
      return Response.json(
        { error: `Resend API error ${res.status}: ${body}` },
        { status: 500 },
      );
    }

    return Response.json({ sent: true });
  }),
};
