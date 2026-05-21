# SurgeVector.ai Hackathon 2026

Public site for the hackathon: landing page, registration, volunteer signup, participant dashboard, and admin tools. Includes **HackBot**, a floating FAQ assistant powered by [Groq](https://console.groq.com/).

**Production:** https://hackathon.surgevector.ai

## Requirements

- Node.js **≥ 22.12**
- [Bun](https://bun.sh) (recommended; repo has `bun.lock`) or npm

## Quick start

```bash
bun install
# Create .env from the section below (never commit real keys)
bun run dev
```

Open http://localhost:3000 (or the port Vite prints).

## Environment variables

Create a `.env` in the project root. **Do not commit** real keys.

### Supabase (site auth, registrations)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# SSR fallback (same values as above)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### HackBot (Groq — server only)

Get a key from [console.groq.com/keys](https://console.groq.com/keys).

```env
GROQ_API_KEY=gsk_your_key_here
```

Optional (default is `llama-3.3-70b-versatile`):

```env
GROQ_MODEL=llama-3.3-70b-versatile
```

**Important:** Do **not** prefix `GROQ_API_KEY` with `VITE_` — it must stay on the server.

### Verify Groq key

```bash
npm run verify-groq
```

Or paste a key temporarily in `scripts/verify-groq-key.mjs` and run `node scripts/verify-groq-key.mjs` (clear it afterward).

## HackBot

| What | Where |
|------|--------|
| Chat UI | `public/hackbot.html` |
| Knowledge base (edit & redeploy) | `server/hackbot/knowledge-base.ts` |
| System prompt & rules | `server/hackbot/prompt.ts` |
| Rate limits & request validation | `server/hackbot/guardrails.ts` |
| API proxy | `POST /api/hackbot/chat` → `server/api/hackbot/chat.post.ts` |
| Floating widget | `src/components/site/HackBotWidget.tsx` |

Employees can use the **HackBot** button on any page or open `/hackbot.html` directly.

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Local dev server |
| `bun run build` | Production build (Vercel output under `.vercel/output`) |
| `bun run lint` | ESLint |
| `bun run format` | Prettier |
| `npm run verify-groq` | Test `GROQ_API_KEY` against Groq API |

## Deploy (Vercel)

1. Set all env vars above in the Vercel project (Production + Preview as needed).
2. Set `VITE_*` Supabase vars **before** build.
3. Set `GROQ_API_KEY` as a server env var (not exposed to the browser).
4. Deploy from `main`.

## Project layout

```
src/routes/          TanStack Router pages (home, register, admin, …)
src/components/      UI + site chrome (Header, Footer, HackBot widget)
public/hackbot.html  Standalone HackBot page (embedded in widget via iframe)
server/              Nitro API routes + HackBot KB / guardrails
supabase/            Migrations and edge functions
```

## Contributor notes

See [AGENTS.md](./AGENTS.md) for stack details, Supabase model, and coding conventions.
