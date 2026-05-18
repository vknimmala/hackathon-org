/**
 * notify-status-change — Supabase Edge Function
 *
 * Sends a status notification email to a participant when their registration
 * is approved or rejected by an admin.
 *
 * Setup:
 *   1. Sign up at https://resend.com and get an API key.
 *   2. Verify your sending domain in the Resend dashboard.
 *   3. Add your API key as a Supabase secret:
 *        supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxx
 *   4. Update FROM_EMAIL below to match your verified domain.
 *   5. Deploy: supabase functions deploy notify-status-change
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = "hackathon@surgevector.ai"; // must match your verified Resend domain
const HACKATHON_NAME = "SurgeVector.ai Hackathon 2026";
const SITE_URL = "https://hackathon.surgevector.ai"; // update to your live URL

interface Payload {
  registration_id: string;
  status: "approved" | "rejected";
  email: string;
  full_name: string;
  idea_title?: string | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY secret is not set. See setup instructions in this file.");
    }

    const payload: Payload = await req.json();
    const { status, email, full_name, idea_title } = payload;

    if (status !== "approved" && status !== "rejected") {
      return new Response(JSON.stringify({ skipped: true }), { status: 200 });
    }

    const isApproved = status === "approved";
    const subject = isApproved
      ? `🎉 Your idea has been approved — ${HACKATHON_NAME}`
      : `Update on your ${HACKATHON_NAME} submission`;

    const html = isApproved
      ? `
        <h2>Congratulations, ${full_name}!</h2>
        <p>Your submission <strong>${idea_title ?? "your idea"}</strong> has been <strong>approved</strong>.</p>
        <p>You're officially participating in the ${HACKATHON_NAME}. Get ready to build!</p>
        <p>Sign in to your dashboard to review your submission details:</p>
        <p><a href="${SITE_URL}/dashboard">${SITE_URL}/dashboard</a></p>
        <p>Good luck,<br/>The SurgeVector Hackathon Team</p>
      `
      : `
        <h2>Hi ${full_name},</h2>
        <p>Thank you for submitting <strong>${idea_title ?? "your idea"}</strong> to the ${HACKATHON_NAME}.</p>
        <p>After review, we weren't able to approve your submission this time. We encourage you to reach out to the organising team if you have questions.</p>
        <p><a href="${SITE_URL}/dashboard">${SITE_URL}/dashboard</a></p>
        <p>Best,<br/>The SurgeVector Hackathon Team</p>
      `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Resend API error ${res.status}: ${body}`);
    }

    return new Response(JSON.stringify({ sent: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
