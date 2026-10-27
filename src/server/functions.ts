/**
 * Everything the pages ask the server for. Each function that touches studio
 * data goes through `requireUser`: the page guards in src/routes/_app.tsx only
 * keep people off screens, these keep them off the data.
 */
import { createMiddleware, createServerFn } from "@tanstack/react-start"
import { env } from "cloudflare:workers"
import { allowedEmails, team } from "../config"
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

export interface TeamMemberAccess {
  name: string
  googleAccounts: readonly string[]
  /**
   * The most recent sign-in with any of their accounts, in seconds since the
   * epoch; `null` until their first.
   */
  lastLoginAt: number | null
}

/** Everyone allowed in, with when they last signed in. */
export const getTeam = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async (): Promise<TeamMemberAccess[]> => {
    const { results } = await env.DB.prepare(
      `SELECT email, last_login_at FROM users
       WHERE email IN (${allowedEmails.map(() => "?").join(", ")})`,
    )
      .bind(...allowedEmails)
      .all<{ email: string; last_login_at: number | null }>()

    const lastLoginByEmail = new Map(
      results.map((row) => [row.email, row.last_login_at]),
    )
    return team.map((member) => {
      const logins = member.googleAccounts
        .map((email) => lastLoginByEmail.get(email))
        .filter((at): at is number => typeof at === "number")
      return {
        name: member.name,
        googleAccounts: member.googleAccounts,
        lastLoginAt: logins.length ? Math.max(...logins) : null,
      }
    })
  })
