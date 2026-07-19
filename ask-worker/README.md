# Ask Worker

Cloudflare Worker that powers the "Ask" panel on lide.studio. It proxies visitor questions to Claude with Lide's portfolio as context, streaming the answer back as plain text. The API key lives here as a Worker secret — never in the static site.

## Deploy (one time)

```bash
cd ask-worker
npm install
npx wrangler login                          # opens browser, free Cloudflare account is fine
npx wrangler secret put ANTHROPIC_API_KEY   # paste your key from console.anthropic.com
npx wrangler deploy                         # prints the worker URL, e.g. https://lide-ask.<you>.workers.dev
```

Then point the site at it — in `next-app/.env.local` (and in the GitHub Actions build env for production):

```
NEXT_PUBLIC_ASK_ENDPOINT=https://lide-ask.<you>.workers.dev
```

Rebuild/redeploy the site. Without this env var the Ask panel silently falls back to curated-only answers, so nothing breaks before the Worker exists.

## Cost & abuse control

- **Model**: `ASK_MODEL` in `wrangler.toml` — `claude-opus-4-8` (default, best answers) or `claude-haiku-4-5` (~5x cheaper) if traffic grows.
- **Rate limiting**: add a Cloudflare rate limiting rule (free plan includes one): Security → WAF → Rate limiting rules → e.g. 10 requests / minute per IP on this worker's route.
- Input is capped at 300 chars and output at 1024 tokens, and the system prompt is cached, so a single request costs a fraction of a cent.
- Set a monthly spend limit at console.anthropic.com as a backstop.

## Updating the knowledge

Facts live in `src/prompt.js`. When the portfolio changes, update it (and `next-app/src/content/ask-knowledge.json` for the curated answers), then `npx wrangler deploy`.
