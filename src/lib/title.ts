import { studio } from "../config"

/** "Equipe · Painel ORMA" — the pattern every tab title follows. */
export const pageTitle = (page: string) =>
  `${page} · Painel ${studio.shortName}`
