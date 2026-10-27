import { createFileRoute } from "@tanstack/react-router"
import { redirectTo } from "../../../lib/redirect"
import { createSession, finishGoogleLogin } from "../../../server/auth"

/** Where Google sends people back to after they pick an account. */
export const Route = createFileRoute("/auth/google/callback")({
  server: {
    handlers: {
      GET: async () => {
        const result = await finishGoogleLogin()
        if (!result.ok) return redirectTo(`/entrar?erro=${result.reason}`)

        await createSession(result)
        return redirectTo("/")
      },
    },
  },
})
