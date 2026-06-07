import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SESSION_COOKIE, type CustomerSession } from '@/lib/customer'

export const metadata: Metadata = { title: 'My Account' }

export default async function AccountPage() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value

  if (!sessionCookie) {
    redirect('/account/login')
  }

  let session: CustomerSession
  try {
    session = JSON.parse(sessionCookie) as CustomerSession
  } catch {
    redirect('/account/login')
  }

  if (Date.now() > session.expiresAt) {
    redirect('/account/login')
  }

  const displayName =
    [session.firstName, session.lastName].filter(Boolean).join(' ') ||
    session.email

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-[10px] tracking-[0.2em] uppercase text-aura-stone font-light mb-2">
          My Account
        </p>
        <h1 className="font-display text-4xl font-light text-aura-charcoal">
          Welcome, {session.firstName || 'Beauty Lover'}
        </h1>
        <p className="text-[13px] text-aura-stone mt-1">{session.email}</p>
      </div>

      {/* Account cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Orders */}
        <Link
          href="/account/orders"
          className="group block p-8 border border-aura-border-soft hover:border-aura-rose-gold bg-white transition-all duration-300 hover:shadow-lg"
        >
          <div className="text-aura-rose-gold text-3xl mb-4">✦</div>
          <h2 className="font-display text-xl font-light text-aura-charcoal mb-2 group-hover:text-aura-rose-gold transition-colors">
            Order History
          </h2>
          <p className="text-[12px] text-aura-stone leading-relaxed">
            View and track your past orders, check delivery status, and request returns.
          </p>
          <span className="inline-block mt-4 text-[11px] tracking-[0.1em] uppercase text-aura-stone group-hover:text-aura-rose-gold transition-colors">
            View Orders →
          </span>
        </Link>

        {/* Addresses */}
        <Link
          href="/account/addresses"
          className="group block p-8 border border-aura-border-soft hover:border-aura-rose-gold bg-white transition-all duration-300 hover:shadow-lg"
        >
          <div className="text-aura-rose-gold text-3xl mb-4">◎</div>
          <h2 className="font-display text-xl font-light text-aura-charcoal mb-2 group-hover:text-aura-rose-gold transition-colors">
            Saved Addresses
          </h2>
          <p className="text-[12px] text-aura-stone leading-relaxed">
            Manage your shipping addresses for faster checkout on future orders.
          </p>
          <span className="inline-block mt-4 text-[11px] tracking-[0.1em] uppercase text-aura-stone group-hover:text-aura-rose-gold transition-colors">
            Manage Addresses →
          </span>
        </Link>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className="group block p-8 border border-aura-border-soft hover:border-aura-rose-gold bg-white transition-all duration-300 hover:shadow-lg"
        >
          <div className="text-aura-rose-gold text-3xl mb-4">♡</div>
          <h2 className="font-display text-xl font-light text-aura-charcoal mb-2 group-hover:text-aura-rose-gold transition-colors">
            Wishlist
          </h2>
          <p className="text-[12px] text-aura-stone leading-relaxed">
            Your saved products. Save items you love and purchase when you&apos;re ready.
          </p>
          <span className="inline-block mt-4 text-[11px] tracking-[0.1em] uppercase text-aura-stone group-hover:text-aura-rose-gold transition-colors">
            View Wishlist →
          </span>
        </Link>
      </div>

      {/* Profile summary */}
      <div className="bg-aura-blush p-8 mb-8">
        <h2 className="font-display text-xl font-light text-aura-charcoal mb-4">
          Account Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] tracking-[0.15em] uppercase text-aura-stone mb-1">
              Name
            </p>
            <p className="text-[14px] text-aura-charcoal">{displayName}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.15em] uppercase text-aura-stone mb-1">
              Email
            </p>
            <p className="text-[14px] text-aura-charcoal">{session.email}</p>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <div className="flex justify-end">
        <a
          href="/api/auth/logout"
          className="text-[11px] tracking-[0.12em] uppercase text-aura-stone hover:text-red-500 transition-colors"
        >
          Sign Out
        </a>
      </div>
    </div>
  )
}
