import { NextRequest, NextResponse } from 'next/server'
import {
  exchangeCodeForToken,
  customerFetch,
  CUSTOMER_QUERY,
  SESSION_COOKIE,
  type CustomerSession,
} from '@/lib/customer'

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

interface CustomerQueryResult {
  customer: {
    id: string
    emailAddress: { emailAddress: string }
    firstName?: string
    lastName?: string
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(`${BASE_URL}/account/login?error=${error}`)
  }

  if (!code || !state) {
    return NextResponse.redirect(`${BASE_URL}/account/login?error=missing_params`)
  }

  // Validate state (CSRF protection)
  const savedState = request.cookies.get('oauth_state')?.value
  if (!savedState || savedState !== state) {
    return NextResponse.redirect(`${BASE_URL}/account/login?error=state_mismatch`)
  }

  const codeVerifier = request.cookies.get('oauth_code_verifier')?.value
  if (!codeVerifier) {
    return NextResponse.redirect(`${BASE_URL}/account/login?error=missing_verifier`)
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForToken(code, codeVerifier)

    // Fetch customer profile
    const { customer } = await customerFetch<CustomerQueryResult>(
      tokens.access_token,
      CUSTOMER_QUERY
    )

    const session: CustomerSession = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
      customerId: customer.id,
      email: customer.emailAddress.emailAddress,
      firstName: customer.firstName ?? undefined,
      lastName: customer.lastName ?? undefined,
    }

    const response = NextResponse.redirect(`${BASE_URL}/account`)

    // Store session as JSON cookie (httpOnly)
    response.cookies.set(SESSION_COOKIE, JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: tokens.expires_in,
    })

    // Clear PKCE cookies
    response.cookies.delete('oauth_state')
    response.cookies.delete('oauth_nonce')
    response.cookies.delete('oauth_code_verifier')

    return response
  } catch (err) {
    console.error('[auth/callback]', err)
    return NextResponse.redirect(`${BASE_URL}/account/login?error=auth_failed`)
  }
}
