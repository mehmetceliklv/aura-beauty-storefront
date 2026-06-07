import { NextRequest, NextResponse } from 'next/server'
import { customerFetch, CUSTOMER_ADDRESSES_QUERY, SESSION_COOKIE } from '@/lib/customer'

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value
  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let session
  try {
    session = JSON.parse(sessionCookie)
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  if (Date.now() > session.expiresAt) {
    return NextResponse.json({ error: 'Session expired' }, { status: 401 })
  }

  try {
    const data = await customerFetch(
      session.accessToken,
      CUSTOMER_ADDRESSES_QUERY
    )
    return NextResponse.json(data)
  } catch (err) {
    console.error('[api/account/addresses]', err)
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 })
  }
}
