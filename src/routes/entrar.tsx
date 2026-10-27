import { createFileRoute, redirect } from "@tanstack/react-router"
import receptionPhoto from "../assets/photos/reception.jpg"
import { Logo } from "../components/Logo"
import { pageTitle } from "../lib/title"
import styles from "./entrar.module.css"

const errors = {
  "not-allowed":
    "Este e-mail não tem acesso ao painel. Entre com a conta Google da equipe.",
  invalid: "Não foi possível entrar. Tente de novo.",
} as const

type ErrorCode = keyof typeof errors

export const Route = createFileRoute("/entrar")({
  validateSearch: (search: Record<string, unknown>): { erro?: ErrorCode } =>
    typeof search.erro === "string" && search.erro in errors
      ? { erro: search.erro as ErrorCode }
      : {},
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: "/" })
  },
  head: () => ({ meta: [{ title: pageTitle("Entrar") }] }),
  component: SignIn,
})

function SignIn() {
  const { erro } = Route.useSearch()

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <Logo className={styles.logo} />

        <div className={styles.body}>
          <p className="eyebrow">Painel do escritório</p>
          <h1>Entrar</h1>
          <p className={styles.lead}>Acesso restrito à equipe da ORMA.</p>

          {erro && (
            <p className={styles.error} role="alert">
              {errors[erro]}
            </p>
          )}

          {/* A plain link, not a script: Google's page has to be a full
              navigation anyway, and this works before anything has loaded. */}
          <a className={styles.button} href="/auth/google">
            <GoogleMark />
            Entrar com Google
          </a>
        </div>
      </section>

      <figure className={styles.photo}>
        <img
          src={receptionPhoto}
          alt="Recepção com parede lilás, painel arqueado iluminado por trás em luz quente e balcão ripado branco"
          fetchPriority="high"
        />
      </figure>
    </main>
  )
}

/** Google's "G", in ink like everything else here rather than its four colours. */
function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.mark}>
      <path
        fill="currentColor"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.32 2.98-7.35ZM12 22c2.7 0 4.97-.9 6.62-2.42l-3.24-2.5c-.9.6-2.04.95-3.38.95-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22Zm-5.59-8.09a6 6 0 0 1 0-3.82V7.5H3.07a10 10 0 0 0 0 9l3.34-2.59ZM12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.88A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.5l3.34 2.59C7.2 7.74 9.4 5.98 12 5.98Z"
      />
    </svg>
  )
}
