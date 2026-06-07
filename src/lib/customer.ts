/**
 * Shopify Customer Account API — OAuth 2.0 PKCE helpers
 * https://shopify.dev/docs/api/customer
 *
 * Required env vars:
 *   SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID  — from Shopify Admin → Customer accounts
 *   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN    — e.g. aurabeautyukraine.myshopify.com
 *   NEXTAUTH_URL                        — public base URL, e.g. http://localhost:3000
 */

const SHOP_ID = '98765013319'
// Public OAuth client ID — not a secret (PKCE public client)
const CUSTOMER_ACCOUNT_CLIENT_ID =
  process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID ||
  '0b2b401b-4c3a-4583-b1fa-31b281b9ac57'

const AUTH_BASE = `https://shopify.com/authentication/${SHOP_ID}`
// Confirmed endpoints from Shopify Customer Accounts settings:
export const OAUTH_AUTHORIZE_URL = `${AUTH_BASE}/oauth/authorize`
export const OAUTH_TOKEN_URL = `${AUTH_BASE}/oauth/token`
export const OAUTH_LOGOUT_URL = `${AUTH_BASE}/logout`
const CUSTOMER_API = `https://shopify.com/authentication/${SHOP_ID}/account/customer/api/2024-10/graphql`

export function getCustomerAccountClientId() {
  return CUSTOMER_ACCOUNT_CLIENT_ID
}

export function getRedirectUri() {
  const base =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    'http://localhost:3000'
  return `${base}/api/auth/callback`
}

// ── PKCE helpers ───────────────────────────────────────────────────────────────

function base64url(buffer: ArrayBuffer): string {
  return Buffer.from(buffer)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export function generateCodeVerifier(): string {
  const bytes = new Uint8Array(64)
  crypto.getRandomValues(bytes)
  return base64url(bytes.buffer)
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return base64url(digest)
}

export function generateState(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return base64url(bytes.buffer)
}

export function generateNonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return base64url(bytes.buffer)
}

// ── OAuth URLs ─────────────────────────────────────────────────────────────────

export async function buildAuthorizationUrl(
  state: string,
  codeVerifier: string,
  nonce: string
): Promise<string> {
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const clientId = getCustomerAccountClientId()
  const redirectUri = getRedirectUri()

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    // Shopify Customer Account API only accepts openid + email in the OAuth scope.
    // The API permissions (read orders, addresses etc.) are configured in Shopify Admin.
    scope: 'openid email',
    state,
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })

  return `${OAUTH_AUTHORIZE_URL}?${params.toString()}`
}

// ── Token exchange ─────────────────────────────────────────────────────────────

export interface TokenSet {
  access_token: string
  expires_in: number
  id_token: string
  refresh_token?: string
  token_type: string
}

export async function exchangeCodeForToken(
  code: string,
  codeVerifier: string
): Promise<TokenSet> {
  const clientId = getCustomerAccountClientId()
  const redirectUri = getRedirectUri()

  const res = await fetch(OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      redirect_uri: redirectUri,
      code,
      code_verifier: codeVerifier,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Token exchange failed (${res.status}): ${text}`)
  }

  return res.json() as Promise<TokenSet>
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<TokenSet> {
  const clientId = getCustomerAccountClientId()

  const res = await fetch(OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      refresh_token: refreshToken,
    }),
  })

  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`)
  return res.json() as Promise<TokenSet>
}

// ── Customer Account API ───────────────────────────────────────────────────────

export async function customerFetch<T>(
  accessToken: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(CUSTOMER_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Shopify Customer Account API accepts the token directly (no Bearer prefix)
      Authorization: accessToken,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Customer API ${res.status}: ${text.slice(0, 200)}`)
  }
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0]?.message ?? 'Customer API error')
  return json.data as T
}

// ── Session cookie helpers ─────────────────────────────────────────────────────

export const SESSION_COOKIE = 'aura_customer_session'

export interface CustomerSession {
  accessToken: string
  refreshToken?: string
  expiresAt: number // unix ms
  customerId: string
  email: string
  firstName?: string
  lastName?: string
}

// ── GraphQL queries ────────────────────────────────────────────────────────────

export const CUSTOMER_QUERY = `
  query GetCustomer {
    customer {
      id
      emailAddress { emailAddress }
      firstName
      lastName
      defaultAddress {
        id
        address1
        address2
        city
        zoneCode
        zip
        countryCode
        phoneNumber
      }
    }
  }
`

export const CUSTOMER_ORDERS_QUERY = `
  query GetCustomerOrders($first: Int!, $after: String) {
    customer {
      orders(first: $first, after: $after, reverse: true) {
        nodes {
          id
          name
          processedAt
          financialStatus
          fulfillmentStatus
          totalPrice { amount currencyCode }
          lineItems(first: 5) {
            nodes {
              title
              quantity
              price { amount currencyCode }
              image { url altText }
            }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
`

export const CUSTOMER_ADDRESSES_QUERY = `
  query GetCustomerAddresses {
    customer {
      defaultAddress { id }
      addresses(first: 20) {
        nodes {
          id
          firstName
          lastName
          address1
          address2
          city
          zoneCode
          zip
          countryCode
          phoneNumber
        }
      }
    }
  }
`
