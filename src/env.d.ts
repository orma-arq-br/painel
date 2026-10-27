// Secrets aren't declared in wrangler.jsonc (see the note there), so
// `wrangler types` only sees them when a .dev.vars exists. Declared here so the
// types hold everywhere, CI included.
declare namespace Cloudflare {
  interface Env {
    /** From the Google Cloud console (APIs & Services → Credentials). */
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
  }
}
