import { createFileRoute } from "@tanstack/react-router"
import { createSession, finishGoogleLogin } from "../../../server/auth"

const redirectTo = (location: string) =>
  new Response(null, { status: 302, headers: { Location: location } })

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
