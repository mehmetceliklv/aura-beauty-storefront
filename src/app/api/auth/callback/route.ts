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
    return NextResponse.redirect(`${BASE_URL}/account/login?error=${encodeURIComponent(error)}`)
  }

  if (!code || !state) {
    return NextResponse.redirect(`${BASE_URL}/account/login?error=missing_params`)
  }

  // Validate state (CSRF protection)
  const savedState = request.cookies.get('oauth_state')?.value
  if (!savedState || savedState !== state) {
    console.error('[auth/callback] state mismatch', { savedState, state })
    return NextResponse.redirect(`${BASE_URL}/account/login?error=state_mismatch`)
  }

  const codeVerifier = request.cookies.get('oauth_code_verifier')?.value
  if (!codeVerifier) {
    console.error('[auth/callback] missing code_verifier cookie')
    return NextResponse.redirect(`${BASE_URL}/account/login?error=missing_verifier`)
  }

  // Step 1: Exchange code for tokens
  let tokens: Awaited<ReturnType<typeof exchangeCodeForToken>>
  try {
    tokens = await exchangeCodeForToken(code, codeVerifier)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[auth/callback] token exchange failed:', msg)
    return NextResponse.redirect(
      `${BASE_URL}/account/login?error=${encodeURIComponent('token_' + msg.slice(0, 60))}`
    )
  }

  // Step 2: Fetch customer profile using access token
  let customer: CustomerQueryResult['customer']
  try {
    const result = await customerFetch<CustomerQueryResult>(
      tokens.access_token,
      CUSTOMER_QUERY
    )
    customer = result.customer
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[auth/callback] customer fetch failed:', msg)
    // Token is valid but profile fetch failed — still create a minimal session
    // so the user isn't stuck in a login loop
    const minimalSession: CustomerSession = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + (tokens.expires_in ?? 3600) * 1000,
      customerId: 'unknown',
      email: 'unknown',
    }
    const response = NextResponse.redirect(`${BASE_URL}/account`)
    response.cookies.set(SESSION_COOKIE, JSON.stringify(minimalSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: tokens.expires_in ?? 3600,
    })
    response.cookies.delete('oauth_state')
    response.cookies.delete('oauth_nonce')
    response.cookies.delete('oauth_code_verifier')
    return response
  }

  const session: CustomerSession = {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: Date.now() + (tokens.expires_in ?? 3600) * 1000,
    customerId: customer.id,
    email: customer.emailAddress?.emailAddress ?? 'unknown',
    firstName: customer.firstName ?? undefined,
    lastName: customer.lastName ?? undefined,
  }

  const response = NextResponse.redirect(`${BASE_URL}/account`)

  response.cookies.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: tokens.expires_in ?? 3600,
  })

  response.cookies.delete('oauth_state')
  response.cookies.delete('oauth_nonce')
  response.cookies.delete('oauth_code_verifier')

  return response
}
