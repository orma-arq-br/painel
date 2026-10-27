---
name: orma-panel-design
description: Design direction and build conventions for the ORMA Painel, the studio's private backoffice. Consult BEFORE building or changing anything visual — pages, lists, tables, forms, buttons, the sidebar, colors, spacing. Also defines where design tokens live and the quality bar every change must pass.
---

# ORMA Painel — Design Direction

The panel is the back room of the same studio as orma.arq.br, so it wears the same clothes: paper background, ink text, Montserrat, hairlines, no colour. But it is a place to **work**, not a portfolio. Where the public site is brave and spacious, the panel is calm, dense enough to see a whole list at once, and fast to use on a phone.

## Non-negotiables

- **Same palette and type as the site.** `--color-paper`, `--color-ink`, two greys, and a faint `--color-wash` for hovered rows. No accent colour, no brand burgundy (it lives only in the favicon). Light-weight (300) titles with tight tracking; regular body text.
- **Hairlines, not boxes.** Separate things with 1px `--color-grey-2` lines and space. No cards with rounded corners and shadows, no gradients, no glassmorphism, no emoji as icons, no icon packs. Corners are square.
- **One primary action per screen**, as the solid ink button (see "Entrar com Google" in `src/routes/entrar.module.css`). Secondary actions are the outlined button ("Sair" in the sidebar) or a plain underlined link.
- **Lists are tables on desktop and label/value blocks on the phone** (see `src/routes/_app/equipe.module.css`). Never a horizontally scrolling table.

## Anatomy — build these without being asked

- **Every page opens with `PageHeader`**: the title, and one sentence saying what the page is for.
- **Every new page is added to the sidebar** (`pages` in `src/components/Sidebar.tsx`) unless it is a detail page reached from a list.
- **Empty states**: a list with nothing in it says so in a sentence and offers the action that fills it ("Nenhum cliente ainda. Cadastrar o primeiro").
- **Forms**: one column, labels above fields, the save button at the end, clear pt-BR error messages next to the field at fault, and a confirmation after saving. Fields ≥ 44px tall. Forms work as plain forms first where possible.
- **Destructive actions ask first** and say exactly what will be lost.
- **Search or filters** appear once a list passes ~20 rows, not before.
- **Loading**: no spinners on fast pages; anything slower than a moment shows a quiet text state.

## Foundations — single source of truth

- **`src/config.ts`** — studio facts and `allowedEmails`. Never hardcode either elsewhere.
- **`src/styles/global.css`** — every token (`--color-*`, `--text-*`, `--space-*`, `--edge`, `--sidebar-width`, `--content-max`, `--motion-*`), in cascade layers `reset, tokens, base`. Components use `var(--…)` — never raw colours, font sizes or magic spacing. A value needed twice becomes a token.
- **A CSS Module next to each component or page** (`Sidebar.module.css`, `equipe.module.css`) for everything specific to it. Global classes only for the few true globals (`.eyebrow`, `.visually-hidden`).

## Build conventions

- Mobile-first CSS: base styles are the phone; `@media (min-width: 60rem)` adds the sidebar column (48rem for tables).
- Semantic HTML (`header`, `nav`, `main`, `table`, `form`, `label`); visible focus styles; contrast ≥ 4.5:1; touch targets ≥ 44px.
- Motion is limited to quick hover and focus responses (`--motion-fast`, `--ease-out-soft`); the global reduced-motion rule in `global.css` turns it off.
- Dates and times are formatted with `Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo" })` so the server and the browser agree.

## Quality gate (every visual change)

1. Dev server running (`pnpm dev` in the background), page opened signed in.
2. Screenshot at phone (~390px) **and** desktop (~1440px) width; look at both, the phone one first.
3. Browser console clean.
4. Try it as she would: create, edit, reload, check it stuck.
5. For bigger milestones, run the `web-design-guidelines` skill as an audit.

## Decisions

_Record every decision she confirms here (date + one line), so future sessions never re-ask._

- **2026-10-27** — First version: same palette, type and logo as orma.arq.br; a sidebar on the left on desktop, a header with the pages in a row on the phone. Sign-in with Google only, limited to the addresses in `allowedEmails`. The sign-in page uses the site's reception photograph (Consultório TH).
