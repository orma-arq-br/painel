/**
 * Signing in with Google, and the logins that follow.
 *
 * Google proves who someone is; `allowedEmails` in src/config.ts decides
 * whether they get in. A login is a random token in an HTTP-only cookie whose
 * SHA-256 is stored in D1, so it can be ended from the server at any time.
 *
 * Server only: importing this from browser code fails the build.
 */
import "@tanstack/react-start/server-only"
import {
  deleteCookie,
  getCookie,
  getRequestUrl,
  setCookie,
} from "@tanstack/react-start/server"
import { env } from "cloudflare:workers"
import { isAllowedEmail } from "../config"

export interface User {
  id: number
  email: string
  name: string | null
  pictureUrl: string | null
}

const SESSION_COOKIE = "orma_session"
const OAUTH_STATE_COOKIE = "orma_oauth_state"
const OAUTH_VERIFIER_COOKIE = "orma_oauth_verifier"

/** Seconds, like every timestamp in the database. */
const DAY = 24 * 60 * 60
const SESSION_LENGTH = 30 * DAY
/** A login used after this much of its life is gone is extended to the full length again. */
const SESSION_RENEW_AFTER = 15 * DAY

const now = () => Math.floor(Date.now() / 1000)

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"]

/** Where Google sends people back to. Must be registered in the Google console. */
const callbackUrl = (origin: string) => `${origin}/auth/google/callback`

const cookieOptions = (maxAgeSeconds: number) => ({
  path: "/",
  httpOnly: true,
  // Plain http only on localhost, where some browsers refuse Secure cookies.
  secure: getRequestUrl().protocol === "https:",
  sameSite: "lax" as const,
  maxAge: maxAgeSeconds,
})

const clearCookie = (name: string) => deleteCookie(name, { path: "/" })

// ------------------------------------------------------------------ helpers

const base64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")

const randomToken = () => base64url(crypto.getRandomValues(new Uint8Array(32)))

const sha256 = async (value: string) =>
  new Uint8Array(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
  )

const hashToken = async (token: string) =>
  Array.from(await sha256(token), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("")

// --------------------------------------------------------- the Google round trip

/**
 * Starts a login: remembers a one-off state and PKCE verifier in short-lived
 * cookies and returns the Google URL to send the browser to.
 */
export async function startGoogleLogin() {
  // Missing secrets would otherwise send Google `client_id=undefined`, and the
  // only symptom would be Google's own "OAuth client not found" page.
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    throw new Error(
      "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are not set on this Worker (Settings → Variables and Secrets)",
    )
  }

  const url = getRequestUrl()
  const state = randomToken()
  const verifier = randomToken()
  const tenMinutes = 10 * 60
  setCookie(OAUTH_STATE_COOKIE, state, cookieOptions(tenMinutes))
  setCookie(OAUTH_VERIFIER_COOKIE, verifier, cookieOptions(tenMinutes))

  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: callbackUrl(url.origin),
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: base64url(await sha256(verifier)),
    code_challenge_method: "S256",
    // Always show the account picker: most people here have more than one
    // Google account, and signing in with the wrong one silently is confusing.
    prompt: "select_account",
  })
  return `${GOOGLE_AUTH_URL}?${params}`
}

export type GoogleLoginResult =
  | { ok: true; email: string; name: string | null; picture: string | null }
  | { ok: false; reason: "invalid" | "not-allowed" }

/**
 * Finishes a login: checks the state Google echoed back, trades the code for
 * an ID token and reads who the person is from it.
 *
 * The ID token comes straight from Google's token endpoint over TLS, in
 * exchange for our client secret, so per OpenID Connect its signature does not
 * need checking again; its issuer, audience and expiry still are.
 */
export async function finishGoogleLogin(): Promise<GoogleLoginResult> {
  const url = getRequestUrl()
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const expectedState = getCookie(OAUTH_STATE_COOKIE)
  const verifier = getCookie(OAUTH_VERIFIER_COOKIE)
  clearCookie(OAUTH_STATE_COOKIE)
  clearCookie(OAUTH_VERIFIER_COOKIE)

  if (!code || !state || !expectedState || !verifier) {
    return { ok: false, reason: "invalid" }
  }
  if (state !== expectedState) return { ok: false, reason: "invalid" }

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: callbackUrl(url.origin),
      grant_type: "authorization_code",
      code_verifier: verifier,
    }),
  })
  if (!response.ok) return { ok: false, reason: "invalid" }

  const { id_token: idToken } = (await response.json()) as {
    id_token?: string
  }
  const claims = idToken ? decodeJwtPayload(idToken) : null
  if (
    !claims ||
    !GOOGLE_ISSUERS.includes(claims.iss) ||
    claims.aud !== env.GOOGLE_CLIENT_ID ||
    claims.exp < now() ||
    !claims.email ||
    claims.email_verified !== true
  ) {
    return { ok: false, reason: "invalid" }
  }

  const email = claims.email.toLowerCase()
  if (!isAllowedEmail(email)) return { ok: false, reason: "not-allowed" }

  return {
    ok: true,
    email,
    name: claims.name ?? null,
    picture: claims.picture ?? null,
  }
}

interface GoogleClaims {
  iss: string
  aud: string
  exp: number
  email?: string
  email_verified?: boolean
  name?: string
  picture?: string
}

function decodeJwtPayload(jwt: string): GoogleClaims | null {
  const payload = jwt.split(".")[1]
  if (!payload) return null
  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
    const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    return null
  }
}

// ------------------------------------------------------------------- logins

/** Records the person and opens a login for them, setting the cookie. */
export async function createSession(person: {
  email: string
  name: string | null
  picture: string | null
}) {
  const user = await env.DB.prepare(
    `INSERT INTO users (email, name, picture_url, last_login_at)
     VALUES (?1, ?2, ?3, unixepoch())
     ON CONFLICT (email) DO UPDATE SET
       name = excluded.name,
       picture_url = excluded.picture_url,
       last_login_at = excluded.last_login_at
     RETURNING id`,
  )
    .bind(person.email, person.name, person.picture)
    .first<{ id: number }>()
  if (!user) throw new Error("Could not record the user")

  const token = randomToken()
  await env.DB.prepare(
    "INSERT INTO sessions (id, user_id, expires_at) VALUES (?1, ?2, ?3)",
  )
    .bind(await hashToken(token), user.id, now() + SESSION_LENGTH)
    .run()

  setCookie(SESSION_COOKIE, token, cookieOptions(SESSION_LENGTH))
}

/**
 * Who this request belongs to, or `null`. Expired logins, and logins of anyone
 * no longer on the allowed list, are deleted on the spot.
 */
export async function validateSession(): Promise<User | null> {
  const token = getCookie(SESSION_COOKIE)
  if (!token) return null

  const id = await hashToken(token)
  const row = await env.DB.prepare(
    `SELECT sessions.expires_at, users.id, users.email, users.name, users.picture_url
     FROM sessions JOIN users ON users.id = sessions.user_id
     WHERE sessions.id = ?1`,
  )
    .bind(id)
    .first<{
      expires_at: number
      id: number
      email: string
      name: string | null
      picture_url: string | null
    }>()

  if (!row || row.expires_at < now() || !isAllowedEmail(row.email)) {
    if (row) await deleteSession(id)
    clearCookie(SESSION_COOKIE)
    return null
  }

  if (row.expires_at - now() < SESSION_LENGTH - SESSION_RENEW_AFTER) {
    await env.DB.prepare("UPDATE sessions SET expires_at = ?1 WHERE id = ?2")
      .bind(now() + SESSION_LENGTH, id)
      .run()
    setCookie(SESSION_COOKIE, token, cookieOptions(SESSION_LENGTH))
  }

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    pictureUrl: row.picture_url,
  }
}

const deleteSession = (id: string) =>
  env.DB.prepare("DELETE FROM sessions WHERE id = ?1").bind(id).run()

/** Ends the current login, on the server and in the browser. */
export async function endSession() {
  const token = getCookie(SESSION_COOKIE)
  if (token) await deleteSession(await hashToken(token))
  clearCookie(SESSION_COOKIE)
}
