import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, OAUTH_LOGOUT_URL, getCustomerAccountClientId } from '@/lib/customer'

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

export async function GET(request: NextRequest) {
  // Clear local session cookie first
  const response = NextResponse.redirect(`${BASE_URL}/`)
  response.cookies.delete(SESSION_COOKIE)

  // Then redirect through Shopify's confirmed logout endpoint
  // https://shopify.com/authentication/98765013319/logout
  const params = new URLSearchParams({
    post_logout_redirect_uri: BASE_URL,
    client_id: getCustomerAccountClientId(),
  })

  return NextResponse.redirect(`${OAUTH_LOGOUT_URL}?${params.toString()}`)
}
