import type { Metadata } from 'next'
import { getSaleProducts } from '@/lib/queries/products'
import type { Product } from '@/lib/types'
import ProductGrid from '@/components/product/ProductGrid'

export const metadata: Metadata = {
  title: 'Sale — AURA BEAUTY',
  description: 'Shop discounted beauty and skincare products at AURA BEAUTY.',
}

export default async function SalePage() {
  let products: Product[] = []
  try {
    products = await getSaleProducts(48)
  } catch {
    // Shopify not configured
  }

  const hasDiscounts = products.some((p) => {
    const compareAt = parseFloat(
      p.compareAtPriceRange?.minVariantPrice?.amount || '0'
    )
    const price = parseFloat(p.priceRange.minVariantPrice.amount)
    return compareAt > price
  })

  return (
    <div>
      {/* Hero banner */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #C44B8A 0%, #9B2D6E 50%, #C44B8A 100%)',
        }}
      >
        <div className="max-w-screen-xl mx-auto px-6 py-16 text-center relative z-10">
          <p className="text-[11px] tracking-[0.25em] uppercase text-white/70 mb-3">
            {hasDiscounts ? 'Limited Time Offers' : 'Featured Collection'}
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-white mb-4">
            {hasDiscounts ? 'Sale' : 'Shop All'}
          </h1>
          {hasDiscounts && (
            <p className="text-white/80 text-[14px] mb-2">
              Up to 50% off on selected beauty &amp; skincare
            </p>
          )}
          <p className="text-white/60 text-[12px]">
            {products.length} product{products.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20"
          style={{ background: 'rgba(255,255,255,0.2)' }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-15"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        />
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-10">
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-24">
            <div className="text-6xl mb-6" style={{ color: '#C44B8A' }}>
              ✦
            </div>
            <p className="text-aura-stone text-[15px] mb-8">
              No products available right now. Check back soon!
            </p>
            <a
              href="/bestsellers"
              className="inline-block px-10 py-4 text-[11px] tracking-[0.15em] uppercase font-medium text-white"
              style={{ background: '#C44B8A' }}
            >
              Shop Bestsellers →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
