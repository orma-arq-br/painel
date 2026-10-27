import { createFileRoute } from "@tanstack/react-router"
import { redirectTo } from "../lib/redirect"
import { endSession } from "../server/auth"

/**
 * The "Sair" button posts here. POST only, so a link elsewhere on the web
 * can't sign anyone out; the session cookie is SameSite=Lax, so a form on
 * another site can't either.
 */
export const Route = createFileRoute("/sair")({
  server: {
    handlers: {
      // Typed or bookmarked by hand: nothing to do here, back to the start.
      GET: () => redirectTo("/"),
      POST: async () => {
        await endSession()
        return redirectTo("/entrar", 303)
      },
    },
  },
})
