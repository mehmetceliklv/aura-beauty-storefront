import Link from 'next/link'
import { getFeaturedProducts, getBestsellers } from '@/lib/queries/products'
import type { Product } from '@/lib/types'
import ProductGrid from '@/components/product/ProductGrid'
import HeroBanner from '@/components/ui/HeroBanner'
import CategoryGrid from '@/components/ui/CategoryGrid'
import PromoBanner from '@/components/ui/PromoBanner'

export default async function HomePage() {
  let featuredProducts: Product[] = []
  let bestsellers: Product[] = []

  try {
    ;[featuredProducts, bestsellers] = await Promise.all([
      getFeaturedProducts(8),
      getBestsellers(8),
    ])
  } catch {
    // If Shopify is not configured, show placeholder UI
  }

  return (
    <>
      <HeroBanner />

      {/* Our Promise strip */}
      <div className="w-full bg-white border-y border-aura-border-soft">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Clinically Tested', icon: '✦' },
              { label: 'Cruelty Free', icon: '✦' },
              { label: 'Clean Ingredients', icon: '✦' },
            ].map(({ label, icon }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <span className="text-aura-rose-gold text-[10px]">{icon}</span>
                <p className="text-[10px] tracking-[0.15em] uppercase text-aura-stone font-light">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CategoryGrid />

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-4xl font-light text-aura-charcoal">
            Featured Products
          </h2>
          <Link
            href="/collections"
            className="text-[11px] tracking-[0.12em] uppercase text-aura-stone hover:text-aura-rose-gold transition-colors duration-300 font-medium"
          >
            View All →
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      {/* Bestsellers */}
      <section className="bg-aura-blush py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-display text-4xl font-light text-aura-charcoal">
              Our Bestsellers
            </h2>
            <Link
              href="/bestsellers"
              className="text-[11px] tracking-[0.12em] uppercase text-aura-stone hover:text-aura-rose-gold transition-colors duration-300 font-medium"
            >
              View All →
            </Link>
          </div>
          <ProductGrid products={bestsellers} />
        </div>
      </section>

      {/* Skin Diagnostics CTA */}
      <section className="w-full bg-aura-cream py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.2em] uppercase text-aura-stone font-light mb-4">
            Personalised Skincare
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-aura-charcoal mb-4 leading-tight">
            Find Your Perfect Routine
          </h2>
          <p className="text-[14px] text-aura-stone font-light leading-relaxed mb-8">
            Answer 5 questions, get personalized recommendations curated just for your skin.
          </p>
          <Link
            href="/skin-quiz"
            className="inline-block px-10 py-4 text-[11px] tracking-[0.15em] uppercase font-medium text-white bg-aura-charcoal hover:bg-aura-rose-gold transition-all duration-300 ease-out"
          >
            Start Skin Quiz →
          </Link>
        </div>
      </section>

      <PromoBanner />
    </>
  )
}
