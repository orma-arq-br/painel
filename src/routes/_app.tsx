import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { Sidebar } from "../components/Sidebar"
import styles from "./_app.module.css"

/** Every page behind the login: the sidebar on the left, the page beside it. */
export const Route = createFileRoute("/_app")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/entrar" })
    return { user: context.user }
  },
  component: AppLayout,
})

function AppLayout() {
  const { user } = Route.useRouteContext()

  return (
    <div className={styles.shell}>
      <Sidebar user={user} />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
