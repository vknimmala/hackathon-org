const MAX_USER_NAME = 50;
const MAX_MESSAGES = 40;
const MAX_MESSAGE_CHARS = 4000;
const MAX_REQUESTS_PER_WINDOW = 30;
const RATE_WINDOW_MS = 60_000;

type ChatMessage = { role: "user" | "assistant"; content: string };

type RateBucket = { count: number; resetAt: number };

const rateBuckets = new Map<string, RateBucket>();

export type HackBotChatRequest = {
  userName?: unknown;
  messages?: unknown;
};

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return headers.get("x-real-ip") || "unknown";
}

export function checkRateLimit(ip: string): string | null {
  const now = Date.now();
  let bucket = rateBuckets.get(ip);
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + RATE_WINDOW_MS };
    rateBuckets.set(ip, bucket);
  }
  bucket.count += 1;
  if (bucket.count > MAX_REQUESTS_PER_WINDOW) {
    return "Too many requests. Please wait a minute and try again.";
  }
  return null;
}

export function parseHackBotRequest(body: unknown): { userName: string; messages: ChatMessage[] } | string {
  if (!body || typeof body !== "object") return "Invalid request body.";

  const raw = body as HackBotChatRequest;

  if ("system" in raw || "model" in raw || "max_tokens" in raw) {
    return "Invalid request fields.";
  }

  const userName =
    typeof raw.userName === "string" ? raw.userName.trim().slice(0, MAX_USER_NAME) : "";

  if (!Array.isArray(raw.messages) || raw.messages.length === 0) {
    return "Messages are required.";
  }

  if (raw.messages.length > MAX_MESSAGES) {
    return "Conversation is too long. Please start a new chat.";
  }

  const messages: ChatMessage[] = [];

  for (const item of raw.messages) {
    if (!item || typeof item !== "object") return "Invalid message format.";
    const msg = item as { role?: unknown; content?: unknown };
    if (msg.role !== "user" && msg.role !== "assistant") {
      return "Invalid message role.";
    }
    if (typeof msg.content !== "string") return "Invalid message content.";
    const content = msg.content.trim();
    if (!content) return "Empty messages are not allowed.";
    if (content.length > MAX_MESSAGE_CHARS) {
      return "A message is too long.";
    }
    messages.push({ role: msg.role, content });
  }

  const last = messages[messages.length - 1];
  if (!last || last.role !== "user") {
    return "Last message must be from the user.";
  }

  return { userName, messages };
}
