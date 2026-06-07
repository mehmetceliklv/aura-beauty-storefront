import { NextResponse } from 'next/server'
import {
  generateCodeVerifier,
  generateState,
  generateNonce,
  buildAuthorizationUrl,
} from '@/lib/customer'

export async function GET() {
  try {
    const state = generateState()
    const nonce = generateNonce()
    const codeVerifier = generateCodeVerifier()
    const authUrl = await buildAuthorizationUrl(state, codeVerifier, nonce)

    const response = NextResponse.redirect(authUrl)

    // Store PKCE verifier and state in short-lived httpOnly cookies
    const cookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 600, // 10 minutes
    }

    response.cookies.set('oauth_state', state, cookieOpts)
    response.cookies.set('oauth_nonce', nonce, cookieOpts)
    response.cookies.set('oauth_code_verifier', codeVerifier, cookieOpts)

    return response
  } catch (err) {
    console.error('[auth/login]', err)
    return NextResponse.redirect(
      new URL('/account/login?error=config', process.env.NEXTAUTH_URL || 'http://localhost:3000')
    )
  }
}
