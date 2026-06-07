import { NextRequest, NextResponse } from 'next/server'
import { customerFetch, CUSTOMER_ORDERS_QUERY, SESSION_COOKIE } from '@/lib/customer'

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

  const { searchParams } = new URL(request.url)
  const after = searchParams.get('after') ?? undefined

  try {
    const data = await customerFetch(
      session.accessToken,
      CUSTOMER_ORDERS_QUERY,
      { first: 10, after }
    )
    return NextResponse.json(data)
  } catch (err) {
    console.error('[api/account/orders]', err)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
