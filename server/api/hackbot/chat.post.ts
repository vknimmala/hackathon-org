import { defineHandler } from "nitro";
import { buildHackBotSystemPrompt } from "../../hackbot/prompt";
import { checkRateLimit, getClientIp, parseHackBotRequest } from "../../hackbot/guardrails";

const XAI_CHAT_URL = "https://api.x.ai/v1/chat/completions";
const DEFAULT_MODEL = "grok-2-mini";

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getXaiApiKey(): string | undefined {
  return process.env.XAI_API_KEY || process.env.GROK_API_KEY;
}

export default defineHandler(async (event) => {
  const apiKey = getXaiApiKey();
  if (!apiKey) {
    return jsonResponse(
      { error: { message: "XAI_API_KEY (or GROK_API_KEY) is not configured" } },
      503,
    );
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

  const model = process.env.GROK_MODEL || DEFAULT_MODEL;
  const system = buildHackBotSystemPrompt(parsed.userName);

  const res = await fetch(XAI_CHAT_URL, {
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
    return new Response(raw || JSON.stringify({ error: { message: "Upstream API error" } }), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
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
