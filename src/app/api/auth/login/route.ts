import { NextResponse } from 'next/server'
import {
  generateCodeVerifier,
  generateNonce,
  buildAuthorizationUrl,
} from '@/lib/customer'

export async function GET() {
  try {
    const nonce = generateNonce()
    const codeVerifier = generateCodeVerifier()

    // Encode verifier + nonce inside the state parameter so no cookies are needed.
    // Shopify round-trips the state value back unchanged, giving us everything
    // required for the token exchange in the callback — no serverless cookie issues.
    const statePayload = Buffer.from(
      JSON.stringify({ v: codeVerifier, n: nonce })
    ).toString('base64url')

    const authUrl = await buildAuthorizationUrl(statePayload, codeVerifier, nonce)

    return NextResponse.redirect(authUrl)
  } catch (err) {
    console.error('[auth/login]', err)
    const base = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    return NextResponse.redirect(`${base}/account/login?error=config`)
  }
}
