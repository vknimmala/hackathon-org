import { defineHandler } from "nitro";
import { buildHackBotSystemPrompt } from "../../hackbot/prompt";
import { checkRateLimit, getClientIp, parseHackBotRequest } from "../../hackbot/guardrails";

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getGroqApiKey(): string | undefined {
  return process.env.GROQ_API_KEY;
}

export default defineHandler(async (event) => {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    return jsonResponse({ error: { message: "GROQ_API_KEY is not configured" } }, 503);
  }

  const rateError = checkRateLimit(getClientIp(event.req.headers));
  if (rateError) {
    return jsonResponse({ error: { message: rateError } }, 429);
  }

  let body: unknown;
  try {
    body = await event.req.json();
  } catch {
    return jsonResponse({ error: { message: "Invalid JSON body" } }, 400);
  }

  const parsed = parseHackBotRequest(body);
  if (typeof parsed === "string") {
    return jsonResponse({ error: { message: parsed } }, 400);
  }

  const model = process.env.GROQ_MODEL || DEFAULT_MODEL;
  const system = buildHackBotSystemPrompt(parsed.userName);

  const res = await fetch(GROQ_CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      temperature: 0.3,
      messages: [{ role: "system", content: system }, ...parsed.messages],
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    let message = "Upstream API error";
    try {
      const err = JSON.parse(raw) as { error?: { message?: string } };
      message = err.error?.message || message;
    } catch {
      if (raw) message = raw.slice(0, 300);
    }
    return jsonResponse({ error: { message } }, res.status >= 400 && res.status < 600 ? res.status : 502);
  }

  let data: {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  try {
    data = JSON.parse(raw) as typeof data;
  } catch {
    return jsonResponse({ error: { message: "Invalid upstream response" } }, 502);
  }

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    return jsonResponse({ error: { message: "Empty response from model" } }, 502);
  }

  return jsonResponse({ content });
});
