/** A plain redirect for server routes, where Start's `redirect()` doesn't apply. */
export const redirectTo = (location: string, status = 302) =>
  new Response(null, { status, headers: { Location: location } })
