import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, OAUTH_LOGOUT_URL, getCustomerAccountClientId, type CustomerSession } from '@/lib/customer'

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

export async function GET(request: NextRequest) {
  // Read id_token from session before clearing it
  let idToken: string | undefined
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value
  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie) as CustomerSession
      idToken = session.idToken
    } catch {
      // ignore parse errors
    }
  }

  // Clear local session cookie
  const params = new URLSearchParams({
    post_logout_redirect_uri: BASE_URL,
    client_id: getCustomerAccountClientId(),
  })

  // id_token_hint is required by Shopify's logout endpoint
  if (idToken) {
    params.set('id_token_hint', idToken)
  }

  const response = NextResponse.redirect(`${OAUTH_LOGOUT_URL}?${params.toString()}`)
  response.cookies.delete(SESSION_COOKIE)

  return response
}
