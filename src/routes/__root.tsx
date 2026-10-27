import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import type { ReactNode } from "react"
import { studio } from "../config"
import { getCurrentUser } from "../server/functions"
import globalCss from "../styles/global.css?url"

export const Route = createRootRoute({
  // Every page carries someone's session, and none of it belongs in a search
  // engine, a shared cache or someone else's frame.
  headers: () => ({
    "Cache-Control": "private, no-store",
    "X-Robots-Tag": "noindex, nofollow",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "same-origin",
  }),
  beforeLoad: async () => ({ user: await getCurrentUser() }),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "theme-color", content: "#f7f6f4" },
      { title: `Painel ${studio.shortName}` },
    ],
    links: [
      { rel: "stylesheet", href: globalCss },
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/favicon-180.png" },
    ],
  }),
  component: Outlet,
  shellComponent: Document,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">Página não encontrada</p>
      <h1>Este endereço não existe no painel.</h1>
      <Link to="/">Voltar ao início</Link>
    </main>
  )
}

function Document({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
