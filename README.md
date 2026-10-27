# ORMA Painel

The private backoffice of [ORMA Arquitetura](https://orma.arq.br): TanStack Start (React) on Cloudflare Workers, a D1 database, and Google sign-in limited to the addresses in `src/config.ts`.

## Run it locally

```sh
pnpm install
cp .dev.vars.example .dev.vars   # fill in the Google OAuth client
pnpm dev                         # http://localhost:3000
```

## First deploy (once, on the studio's Cloudflare account)

1. `pnpm exec wrangler login` with the studio's Cloudflare account.
2. `pnpm exec wrangler d1 create orma-painel` and paste the `database_id` it prints into `wrangler.jsonc`.
3. In Google Cloud console → APIs & Services → Credentials, create an **OAuth client ID** (type _Web application_) with these authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback`
   - `https://painel.orma.arq.br/auth/google/callback`
4. `pnpm exec wrangler secret put GOOGLE_CLIENT_ID` and `pnpm exec wrangler secret put GOOGLE_CLIENT_SECRET`.
5. `pnpm deploy`. The panel is published at https://painel.orma.arq.br (the `orma.arq.br` zone must be on the same Cloudflare account).

After that, `pnpm deploy` is all it takes: it builds, applies any new migrations to the real database, and publishes.

See `AGENTS.md` for how the project is organised and worked on.
