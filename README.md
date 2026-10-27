# ORMA Painel

The private backoffice of [ORMA Arquitetura](https://orma.arq.br): TanStack Start (React) on Cloudflare Workers, a D1 database, and Google sign-in limited to the addresses in `src/config.ts`.

## Run it locally

```sh
pnpm install
cp .dev.vars.example .dev.vars   # fill in the Google OAuth client
pnpm dev                         # http://localhost:3000
```

## Deploying

Cloudflare builds and publishes every push to `main` (Workers Builds, connected to this repository) at https://painel.orma.arq.br. In the Worker's **Settings → Build**:

- Build command: `pnpm build`
- Deploy command: `pnpm release` (publishes, then applies any new migrations to the real database)

The first deploy creates the `orma-painel` D1 database by itself. Two things are set by hand, once:

1. **Secrets** (after the first deploy, once the Worker exists): in the Worker's **Settings → Variables and secrets**, add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (type _Secret_).
2. **Google OAuth client**: authorized redirect URIs `http://localhost:3000/auth/google/callback` and `https://painel.orma.arq.br/auth/google/callback`. Its consent screen links to https://orma.arq.br/painel/privacidade and https://orma.arq.br/painel/termos.

To publish by hand instead: `pnpm build && pnpm release`.

See `AGENTS.md` for how the project is organised and worked on.
