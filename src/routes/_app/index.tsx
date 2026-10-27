import { createFileRoute, Link } from "@tanstack/react-router"
import { PageHeader } from "../../components/PageHeader"
import { pageTitle } from "../../lib/title"

export const Route = createFileRoute("/_app/")({
  head: () => ({ meta: [{ title: pageTitle("Início") }] }),
  component: Home,
})

/** The hour in Porto Alegre, wherever the page happens to be rendered. */
const studioHour = () =>
  Number(
    new Intl.DateTimeFormat("pt-BR", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "America/Sao_Paulo",
    }).format(new Date()),
  )

function greeting(hour: number) {
  if (hour >= 5 && hour < 12) return "Bom dia"
  if (hour >= 12 && hour < 18) return "Boa tarde"
  return "Boa noite"
}

function Home() {
  const { user } = Route.useRouteContext()
  const firstName = user.name?.split(" ")[0]
  const hello = greeting(studioHour())

  return (
    <PageHeader title={firstName ? `${hello}, ${firstName}.` : `${hello}.`}>
      Este é o painel do escritório. Por enquanto ele mostra quem tem acesso, em{" "}
      <Link to="/equipe">Equipe</Link>. As próximas ferramentas entram no menu
      conforme ficarem prontas.
    </PageHeader>
  )
}
