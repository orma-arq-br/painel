/**
 * Everything the pages ask the server for. Each function that touches studio
 * data goes through `requireUser`: the page guards in src/routes/_app.tsx only
 * keep people off screens, these keep them off the data.
 */
import { createMiddleware, createServerFn } from "@tanstack/react-start"
import { env } from "cloudflare:workers"
import { allowedEmails } from "../config"
import { validateSession } from "./auth"

/** Who is signed in, or `null`. Safe to call from anywhere. */
export const getCurrentUser = createServerFn({ method: "GET" }).handler(() =>
  validateSession(),
)

const requireUser = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const user = await validateSession()
    if (!user) throw new Error("Unauthorized")
    return next({ context: { user } })
  },
)

export interface TeamMember {
  email: string
  name: string | null
  /** Seconds since the epoch; `null` until their first login. */
  lastLoginAt: number | null
}

/** Everyone allowed in, with when they last signed in. */
export const getTeam = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async (): Promise<TeamMember[]> => {
    const { results } = await env.DB.prepare(
      `SELECT email, name, last_login_at FROM users
       WHERE email IN (${allowedEmails.map(() => "?").join(", ")})`,
    )
      .bind(...allowedEmails)
      .all<{ email: string; name: string | null; last_login_at: number }>()

    const byEmail = new Map(results.map((row) => [row.email, row]))
    return allowedEmails.map((email) => ({
      email,
      name: byEmail.get(email)?.name ?? null,
      lastLoginAt: byEmail.get(email)?.last_login_at ?? null,
    }))
  })
