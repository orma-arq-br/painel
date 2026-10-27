import { createFileRoute } from "@tanstack/react-router"
import { startGoogleLogin } from "../../server/auth"

/** The "Entrar com Google" button lands here, and is sent on to Google. */
export const Route = createFileRoute("/auth/google")({
  server: {
    handlers: {
      GET: async () =>
        new Response(null, {
          status: 302,
          headers: { Location: await startGoogleLogin() },
        }),
    },
  },
})
