import { createFileRoute } from "@tanstack/react-router"
import { team } from "../../config"
import { redirectTo } from "../../lib/redirect"
import { createSession } from "../../server/auth"

/**
 * Signs in as a team member without Google, on the dev server only, so the
 * panel can be worked on from a fresh clone with no OAuth keys. The buttons
 * on the sign-in page post here.
 *
 * `import.meta.env.DEV` is replaced with `false` when building, so in the
 * published panel this route can only ever answer 404.
 */
export const Route = createFileRoute("/auth/dev")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!import.meta.env.DEV) return new Response(null, { status: 404 })

        const email = String((await request.formData()).get("conta") ?? "")
        const member = team.find((m) => m.googleAccounts.includes(email))
        if (!member) return redirectTo("/entrar?erro=not-allowed")

        await createSession({ email, name: member.name, picture: null })
        return redirectTo("/", 303)
      },
    },
  },
})
