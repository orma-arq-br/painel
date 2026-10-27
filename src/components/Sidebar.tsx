import { Link } from "@tanstack/react-router"
import { studio } from "../config"
import type { User } from "../server/auth"
import { Logo } from "./Logo"
import styles from "./Sidebar.module.css"

/** The pages, in the order they appear. Add a page here and it shows up. */
const pages = [
  { to: "/", label: "Início" },
  { to: "/equipe", label: "Equipe" },
] as const

export function Sidebar({ user }: { user: User }) {
  return (
    <header className={styles.sidebar}>
      <Link to="/" className={styles.brand} aria-label="Painel ORMA, início">
        <Logo className={styles.logo} />
        <span className="eyebrow">Painel</span>
      </Link>

      <nav className={styles.nav} aria-label="Páginas do painel">
        <ul role="list">
          {pages.map((page) => (
            <li key={page.to}>
              <Link
                to={page.to}
                activeOptions={{ exact: true }}
                activeProps={{ "aria-current": "page" }}
              >
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.foot}>
        <a href={studio.url} target="_blank" rel="noreferrer">
          Ver o site ↗
        </a>

        <p className={styles.user}>
          {user.name ?? user.email}
          <span title={user.email}>{user.email}</span>
        </p>

        <form method="post" action="/sair">
          <button type="submit" className={styles.signOut}>
            Sair
          </button>
        </form>
      </div>
    </header>
  )
}
