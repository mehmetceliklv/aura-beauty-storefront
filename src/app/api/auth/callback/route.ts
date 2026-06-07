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
    return NextResponse.redirect(
      `${BASE_URL}/account/login?error=${encodeURIComponent(error)}`
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(`${BASE_URL}/account/login?error=missing_params`)
  }

  // Decode PKCE data from state (no cookies needed — Shopify round-trips state unchanged)
  let codeVerifier: string
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString())
    codeVerifier = decoded.v
    if (!codeVerifier) throw new Error('missing verifier in state')
  } catch (err) {
    console.error('[auth/callback] state decode failed:', err)
    return NextResponse.redirect(`${BASE_URL}/account/login?error=state_invalid`)
  }

  // Step 1: Exchange code for tokens
  let tokens: Awaited<ReturnType<typeof exchangeCodeForToken>>
  try {
    tokens = await exchangeCodeForToken(code, codeVerifier)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[auth/callback] token exchange failed:', msg)
    return NextResponse.redirect(
      `${BASE_URL}/account/login?error=${encodeURIComponent('token_failed: ' + msg.slice(0, 80))}`
    )
  }

  // Step 2: Fetch customer profile
  let session: CustomerSession
  try {
    const { customer } = await customerFetch<CustomerQueryResult>(
      tokens.access_token,
      CUSTOMER_QUERY
    )
    session = {
      accessToken: tokens.access_token,
      idToken: tokens.id_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + (tokens.expires_in ?? 3600) * 1000,
      customerId: customer.id,
      email: customer.emailAddress?.emailAddress ?? '',
      firstName: customer.firstName ?? undefined,
      lastName: customer.lastName ?? undefined,
    }
  } catch (err) {
    // Token is valid but profile fetch failed — create minimal session
    console.error('[auth/callback] profile fetch failed:', err)
    session = {
      accessToken: tokens.access_token,
      idToken: tokens.id_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + (tokens.expires_in ?? 3600) * 1000,
      customerId: '',
      email: '',
    }
  }

  const response = NextResponse.redirect(`${BASE_URL}/account`)
  response.cookies.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: tokens.expires_in ?? 3600,
  })

  return response
}
