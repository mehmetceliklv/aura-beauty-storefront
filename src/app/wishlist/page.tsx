'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useWishlist } from '@/context/WishlistContext'
import ProductGrid from '@/components/product/ProductGrid'
import type { Product } from '@/lib/types'

export default function WishlistPage() {
  const { wishlist, totalCount } = useWishlist()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (wishlist.length === 0) {
      setIsLoading(false)
      return
    }

    fetch('/api/wishlist-products?ids=' + wishlist.join(','))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.products) setProducts(data.products)
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [wishlist])

  return (
    <div>
      {/* Hero */}
      <div className="bg-aura-blush border-b border-aura-border-soft">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <nav className="mb-6 text-[11px] tracking-[0.1em] uppercase text-aura-stone">
            <Link
              href="/account"
              className="hover:text-aura-rose-gold transition-colors"
            >
              My Account
            </Link>
            <span className="mx-2">→</span>
            <span className="text-aura-charcoal">Wishlist</span>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-aura-rose-gold text-3xl">♡</span>
            <div>
              <h1 className="font-display text-4xl font-light text-aura-charcoal">
                My Wishlist
              </h1>
              <p className="text-[13px] text-aura-stone mt-1">
                {totalCount} saved item{totalCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-10">
        {isLoading && (
          <div className="text-center py-20">
            <div
              className="inline-block w-6 h-6 border-2 rounded-full animate-spin"
              style={{ borderColor: '#C44B8A', borderTopColor: 'transparent' }}
            />
            <p className="text-aura-stone text-[13px] mt-4">
              Loading your wishlist…
            </p>
          </div>
        )}

        {!isLoading && wishlist.length === 0 && (
          <div className="text-center py-24 border border-aura-border-soft">
            <span className="text-5xl block mb-6" style={{ color: '#C44B8A' }}>
              ♡
            </span>
            <h2 className="font-display text-2xl font-light text-aura-charcoal mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-aura-stone text-[14px] mb-8">
              Save products you love and purchase when you&apos;re ready.
            </p>
            <Link
              href="/bestsellers"
              className="inline-block px-10 py-4 text-[11px] tracking-[0.15em] uppercase font-medium text-white transition-all"
              style={{ background: '#C44B8A' }}
            >
              Explore Products →
            </Link>
          </div>
        )}

        {!isLoading && wishlist.length > 0 && products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-aura-stone text-[14px] mb-6">
              You have {totalCount} saved item{totalCount !== 1 ? 's' : ''}.
            </p>
            <p className="text-aura-stone text-[13px] mb-8">
              Browse our store to find these products.
            </p>
            <Link
              href="/bestsellers"
              className="inline-block px-10 py-4 text-[11px] tracking-[0.15em] uppercase font-medium text-white"
              style={{ background: '#C44B8A' }}
            >
              Shop Now →
            </Link>
          </div>
        )}

        {!isLoading && products.length > 0 && (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  )
}
