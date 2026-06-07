'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/shopify'

interface OrderLineItem {
  title: string
  quantity: number
  price: { amount: string; currencyCode: string }
  image: { url: string; altText: string | null } | null
}

interface Order {
  id: string
  name: string
  processedAt: string
  financialStatus: string
  fulfillmentStatus: string
  totalPrice: { amount: string; currencyCode: string }
  lineItems: { nodes: OrderLineItem[] }
}

interface OrdersData {
  customer: {
    orders: {
      nodes: Order[]
      pageInfo: { hasNextPage: boolean; endCursor: string | null }
    }
  }
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === 'PAID' || status === 'FULFILLED'
      ? 'text-green-700 bg-green-50'
      : status === 'PENDING' || status === 'IN_PROGRESS'
      ? 'text-amber-700 bg-amber-50'
      : 'text-aura-stone bg-aura-blush'

  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] tracking-[0.1em] uppercase font-medium ${color}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/account/orders')
      .then((res) => {
        if (res.status === 401) {
          window.location.href = '/account/login'
          return null
        }
        return res.json()
      })
      .then((data: OrdersData | null) => {
        if (data) setOrders(data.customer.orders.nodes)
      })
      .catch(() => setError('Failed to load orders. Please try again.'))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-[11px] tracking-[0.1em] uppercase text-aura-stone">
        <Link href="/account" className="hover:text-aura-rose-gold transition-colors">
          My Account
        </Link>
        <span className="mx-2">→</span>
        <span className="text-aura-charcoal">Order History</span>
      </nav>

      <h1 className="font-display text-4xl font-light text-aura-charcoal mb-10">
        Order History
      </h1>

      {isLoading && (
        <div className="text-center py-20">
          <div className="inline-block w-6 h-6 border-2 border-aura-rose-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-aura-stone text-[13px] mt-4">Loading your orders…</p>
        </div>
      )}

      {error && (
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 text-[13px]">
          {error}
        </div>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <div className="text-center py-20 border border-aura-border-soft">
          <span className="text-aura-rose-gold text-4xl block mb-4">✦</span>
          <p className="text-aura-stone text-[14px] mb-6">
            You haven&apos;t placed any orders yet.
          </p>
          <Link
            href="/collections"
            className="inline-block px-10 py-4 text-[11px] tracking-[0.15em] uppercase font-medium text-white bg-aura-charcoal hover:bg-aura-rose-gold transition-all duration-300"
          >
            Start Shopping →
          </Link>
        </div>
      )}

      {!isLoading && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-aura-border-soft bg-white overflow-hidden"
            >
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-aura-blush border-b border-aura-border-soft">
                <div>
                  <p className="text-[13px] font-medium text-aura-charcoal">
                    Order {order.name}
                  </p>
                  <p className="text-[11px] text-aura-stone mt-0.5">
                    {new Date(order.processedAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.financialStatus} />
                  <StatusBadge status={order.fulfillmentStatus} />
                  <p className="text-[14px] font-medium text-aura-charcoal">
                    {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
                  </p>
                </div>
              </div>

              {/* Line items */}
              <div className="px-6 py-4 divide-y divide-aura-border-soft">
                {order.lineItems.nodes.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    {item.image ? (
                      <div className="flex-shrink-0 w-14 h-14 bg-aura-blush overflow-hidden">
                        <Image
                          src={item.image.url}
                          alt={item.image.altText ?? item.title}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-14 h-14 bg-aura-blush flex items-center justify-center text-aura-rose-gold">
                        ✦
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-aura-charcoal font-medium truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-aura-stone mt-0.5">
                        Qty: {item.quantity} ·{' '}
                        {formatPrice(item.price.amount, item.price.currencyCode)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
