import { createFileRoute } from "@tanstack/react-router"
import { PageHeader } from "../../components/PageHeader"
import { pageTitle } from "../../lib/title"
import { getTeam } from "../../server/functions"
import styles from "./equipe.module.css"

export const Route = createFileRoute("/_app/equipe")({
  loader: () => getTeam(),
  head: () => ({ meta: [{ title: pageTitle("Equipe") }] }),
  component: Team,
})

/** Fixed to the studio's time zone, so the server and the browser agree. */
const lastLogin = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
})

function Team() {
  const team = Route.useLoaderData()

  return (
    <>
      <PageHeader title="Equipe">
        Quem pode entrar no painel, sempre com a própria conta Google.
      </PageHeader>

      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">Contas Google</th>
            <th scope="col">Último acesso</th>
          </tr>
        </thead>
        <tbody>
          {team.map((member) => (
            <tr key={member.name}>
              <td data-label="Nome">{member.name}</td>
              <td data-label="Contas Google">
                <ul role="list" className={styles.accounts}>
                  {member.googleAccounts.map((email) => (
                    <li key={email}>{email}</li>
                  ))}
                </ul>
              </td>
              <td data-label="Último acesso">
                {member.lastLoginAt
                  ? lastLogin.format(member.lastLoginAt * 1000)
                  : "Ainda não entrou"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
