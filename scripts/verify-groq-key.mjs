/**
 * Verify a Groq API key (console.groq.com) with a minimal chat request.
 *
 * Usage (pick one):
 *   1. Paste your key below in API_KEY, then:  node scripts/verify-groq-key.mjs
 *   2. Or set env:  GROQ_API_KEY=gsk_... node scripts/verify-groq-key.mjs
 */

// ── Paste your key here (leave empty if using GROQ_API_KEY in .env) ─────────
const API_KEY = "";

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";

const key =
  (API_KEY && !API_KEY.includes("PASTE_") ? API_KEY : null) || process.env.GROQ_API_KEY;

if (!key) {
  console.error("No API key found.");
  console.error("Paste your key in API_KEY at the top of scripts/verify-groq-key.mjs");
  console.error("or set GROQ_API_KEY in the environment.");
  process.exit(1);
}

console.log(`Checking Groq key (model: ${MODEL})...`);

const res = await fetch(CHAT_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${key}`,
  },
  body: JSON.stringify({
    model: MODEL,
    max_tokens: 16,
    messages: [{ role: "user", content: "Reply with exactly: OK" }],
  }),
});

const body = await res.text();
let json;
try {
  json = JSON.parse(body);
} catch {
  json = null;
}

if (!res.ok) {
  const msg = json?.error?.message || body.slice(0, 300);
  console.error(`Request failed (${res.status}):`, msg);
  if (res.status === 401) console.error("Key looks invalid or unauthorized.");
  process.exit(1);
}

const reply = json?.choices?.[0]?.message?.content?.trim();
console.log("Valid — Groq API key works.");
if (reply) console.log("Sample reply:", reply);
