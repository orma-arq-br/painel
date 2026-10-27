import { createFileRoute } from "@tanstack/react-router"
import { redirectTo } from "../../lib/redirect"
import { startGoogleLogin } from "../../server/auth"

/** The "Entrar com Google" button lands here, and is sent on to Google. */
export const Route = createFileRoute("/auth/google")({
  server: {
    handlers: {
      GET: async () => {
        try {
          return redirectTo(await startGoogleLogin())
        } catch (error) {
          // Shows up in the Worker's logs; the visitor gets the panel's own
          // "couldn't sign in" message instead of an error page from Google.
          console.error(error)
          return redirectTo("/entrar?erro=invalid")
        }
      },
    },
  },
})
