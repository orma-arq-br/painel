import { createFileRoute, Link } from "@tanstack/react-router"
import { PageHeader } from "../../components/PageHeader"
import { pageTitle } from "../../lib/title"

export const Route = createFileRoute("/_app/")({
  head: () => ({ meta: [{ title: pageTitle("Início") }] }),
  component: Home,
})

function Home() {
  const { user } = Route.useRouteContext()
  const firstName = user.name?.split(" ")[0]

  return (
    <PageHeader title={firstName ? `Olá, ${firstName}.` : "Olá."}>
      Este é o painel do escritório. Por enquanto ele mostra quem tem acesso, em{" "}
      <Link to="/equipe">Equipe</Link>. As próximas ferramentas entram no menu
      conforme ficarem prontas.
    </PageHeader>
  )
}
