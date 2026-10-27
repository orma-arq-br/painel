# ORMA Painel

The private backoffice of [ORMA Arquitetura](https://orma.arq.br): TanStack Start (React) on Cloudflare Workers, a D1 database, and Google sign-in limited to the people listed in `team` in `src/config.ts`.

## Run it locally

```sh
pnpm install
pnpm dev        # http://localhost:3000
```

No keys needed: on the dev server the sign-in page has a button per team member that signs you straight in as them, without Google. Those buttons, and the route behind them, don't exist in the built panel.

To try the real Google sign-in locally, `cp .dev.vars.example .dev.vars` and fill in the OAuth client; until then the Google button is shown switched off.

## Deploying

Cloudflare builds and publishes every push to `main` (Workers Builds, connected to this repository) at https://painel.orma.arq.br. In the Worker's **Settings → Build**:

- Build command: `pnpm build`
- Deploy command: `pnpm release` (publishes, then applies any new migrations to the real database)

Three things are set by hand, once:

1. **The database** already exists (`orma-painel`, in Eastern North America, the closest region to Porto Alegre) and is pinned by ID in `wrangler.jsonc`. If it ever has to be recreated: `pnpm exec wrangler d1 create orma-painel --location enam`, then put the new ID there.
2. **Secrets** (after the first deploy, once the Worker exists): in the Worker's **Settings → Variables and Secrets** (the runtime section, not the one under Build), add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (type _Secret_).
3. **Google OAuth client**: authorized redirect URIs `http://localhost:3000/auth/google/callback` and `https://painel.orma.arq.br/auth/google/callback`. Its consent screen links to https://orma.arq.br/painel/privacidade and https://orma.arq.br/painel/termos, and the app is **published** (not in testing), so Google lets any account through its own screen without a test-user list. Who actually gets in is decided only by `team` in `src/config.ts`.

To publish by hand instead: `pnpm build && pnpm release`.

See `AGENTS.md` for how the project is organised and worked on.
