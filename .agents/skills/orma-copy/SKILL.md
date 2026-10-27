---
name: orma-copy
description: Writing rules for ALL text on screen in the ORMA Painel — page titles, labels, buttons, empty states, error and confirmation messages, tab titles. The panel is written 100% in Brazilian Portuguese for the studio's own team. Use whenever writing or editing any words someone will read in the interface.
---

# ORMA Painel — Writing for the Interface

## Language: Brazilian Portuguese, always

- **Every word on screen is in Brazilian Portuguese.** The creative director prompts in English — translate her _intent_ into natural pt-BR, never word-for-word, and show her both in your reply when she gave you the English.
- **No i18n, ever.** One language, no translations, no language switcher, no i18n libraries.
- `<html lang="pt-BR">`; tab titles follow `pageTitle()` in `src/lib/title.ts`: "Página · Painel ORMA".
- **Code is 100% English.** File names, components, CSS classes, variables, functions, comments, database tables and columns. Portuguese appears only in what people read and in page URLs (`/entrar`, `/equipe`, `/clientes`).

## Who is reading

The studio's own partners and team, often in a hurry, often on a phone. They know architecture far better than you; they don't know software. Every label should make the next action obvious.

## Voice

- **Short, plain, friendly.** "Salvar", "Cadastrar cliente", "Nenhum projeto ainda." The panel speaks to the reader as "você".
- **Say what happened and what to do next**, especially in errors: "Não foi possível salvar. Confira o e-mail e tente de novo.", never "Erro 500" or "Algo deu errado".
- **Architecture words are fine** here (the readers are architects): "RRT", "projeto executivo", "levantamento". Software words are not: no "registro", "entidade", "sincronizar", "dashboard"; prefer "cadastro", "lista", "painel".
- **Nothing that smells AI-written.** No em-dash as casual mid-sentence punctuation; rewrite with a period, comma, colon or parentheses. No "potencialize", "explore", "não é apenas X, é Y".

## pt-BR mechanics (get these right)

- Perfect accents and cedillas, always.
- Sentence case for titles and buttons ("Novo cliente", never "Novo Cliente").
- Months and weekdays lowercase: "27 de outubro de 2026". Areas "180 m²". Decimal comma: "4,5 m". Money: "R$ 1.500,00".
- No gerundismo: "vamos enviar", never "estaremos enviando".
- **The studio's name is written ORMA, in capitals, always**; it lives in `studio.name` / `studio.shortName` in `src/config.ts`.

## Placeholders

When a fact is unknown, write plausible pt-BR copy anyway and **list every invented fact to her at the end** so she can correct it.
