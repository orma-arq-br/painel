/**
 * Studio facts and access rules, defined once and imported everywhere.
 * Never hardcode these in a component or page.
 */
export const studio = {
  name: "ORMA Arquitetura",
  shortName: "ORMA",
  /** The public site, linked from the sidebar. */
  url: "https://orma.arq.br",
} as const

export interface TeamMember {
  /** As shown on the Equipe page. */
  name: string
  /**
   * Every Google account this person may sign in with, lowercase. Not always
   * a Gmail address: a Google account can be registered on any e-mail, such
   * as a Hotmail one.
   */
  googleAccounts: readonly string[]
}

/**
 * Who can sign in to the panel. Anyone else is turned away at the login, and
 * removing an account here also ends its open logins on the next click.
 *
 * To let someone in, add them here; to add another Google account for someone
 * already here, add it to their `googleAccounts`.
 */
export const team: readonly TeamMember[] = [
  {
    name: "Rafael Audibert",
    googleAccounts: ["rafaeelaudibert@gmail.com"],
  },
  {
    name: "Liliane Basso",
    googleAccounts: ["liliis98b@gmail.com", "lilianeb9@hotmail.com"],
  },
]

/** Every Google account that can sign in, across the whole team. */
export const allowedEmails = team.flatMap((member) => member.googleAccounts)

export const isAllowedEmail = (email: string) =>
  allowedEmails.includes(email.trim().toLowerCase())
