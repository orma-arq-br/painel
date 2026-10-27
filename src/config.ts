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

/**
 * The only Google accounts that can sign in. Anyone else is turned away at the
 * login, and removing an address here also ends that person's open logins on
 * their next click. Lowercase.
 */
export const allowedEmails: readonly string[] = [
  "rafaeelaudibert@gmail.com",
  "liliis98b@gmail.com",
]

export const isAllowedEmail = (email: string) =>
  allowedEmails.includes(email.trim().toLowerCase())
