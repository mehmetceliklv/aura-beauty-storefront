import Link from 'next/link'
import { getFeaturedProducts, getBestsellers } from '@/lib/queries/products'
import type { Product } from '@/lib/types'
import ProductGrid from '@/components/product/ProductGrid'
import HeroBanner from '@/components/ui/HeroBanner'
import CategoryGrid from '@/components/ui/CategoryGrid'
import PromoBanner from '@/components/ui/PromoBanner'

const BRANDS = [
  'COSRX', 'Klairs', 'Beauty of Joseon', 'Pyunkang Yul', 'Some By Mi',
  'Innisfree', 'Laneige', 'Anua', 'Round Lab', 'Tocobo',
  'Medicube', 'La\'dor', 'Masil', 'Aromatica', 'Daeng Gi Meo Ri',
]

const CONCERNS = [
  { label: 'Hydration', icon: '💧', href: '/search?q=hydrating' },
  { label: 'Brightening', icon: '✨', href: '/search?q=brightening' },
  { label: 'Anti-Aging', icon: '⏳', href: '/search?q=anti-aging' },
  { label: 'Acne & Pores', icon: '🌿', href: '/search?q=acne' },
  { label: 'Sensitive Skin', icon: '🌸', href: '/search?q=sensitive' },
  { label: 'Suncare', icon: '☀️', href: '/search?q=sunscreen' },
]

const PROMISES = [
  {
    title: 'Authentic Products',
    desc: 'Sourced directly from Korean brands and authorized distributors',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
  },
  {
    title: 'Cruelty-Free Focus',
    desc: 'Prioritising brands that are certified cruelty-free and vegan',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    title: 'Free Shipping',
    desc: 'Complimentary delivery on all orders over €80',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="1" y="3" width="15" height="13"/>
        <path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    title: 'Expert Curation',
    desc: 'Every product reviewed and approved by our beauty editors',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
]

export default async function HomePage() {
  let featuredProducts: Product[] = []
  let bestsellers: Product[] = []

  try {
    ;[featuredProducts, bestsellers] = await Promise.all([
      getFeaturedProducts(8),
      getBestsellers(8),
    ])
  } catch {
    // Shopify not configured
  }

  return (
    <>
      <HeroBanner />

      {/* Promise strip */}
      <div className="w-full bg-white border-y border-aura-border-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PROMISES.map(({ title, desc, icon }) => (
              <div key={title} className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: '#FCEEF5', color: '#C44B8A' }}
                >
                  {icon}
                </div>
                <div>
                  <p className="text-[12px] font-medium text-aura-charcoal mb-0.5">{title}</p>
                  <p className="text-[11px] text-aura-stone font-light leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand strip */}
      <div className="w-full border-b border-aura-border-soft overflow-hidden" style={{ background: '#FDF8FB' }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-aura-stone text-center mb-5 font-light">
            Trusted Brands
          </p>
          <div className="flex items-center gap-8 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {BRANDS.map((brand) => (
              <Link
                key={brand}
                href={`/search?q=${encodeURIComponent(brand)}`}
                className="flex-shrink-0 text-[12px] tracking-[0.08em] uppercase text-aura-stone hover:text-aura-rose-gold transition-colors duration-300 font-medium whitespace-nowrap"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <CategoryGrid />

      {/* Shop by Concern */}
      <section className="w-full border-y border-aura-border-soft py-10 sm:py-16" style={{ background: 'linear-gradient(180deg, #FDF8FB 0%, #FCEEF5 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-[10px] tracking-[0.2em] uppercase text-aura-stone font-light mb-2">Personalised Beauty</p>
            <h2 className="font-display text-2xl sm:text-3xl font-light text-aura-charcoal">Shop by Skin Concern</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {CONCERNS.map(({ label, icon, href }) => (
              <Link
                key={label}
                href={href}
                className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-white border border-aura-border-soft hover:border-aura-rose-gold hover:shadow-lg transition-all duration-300"
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-[11px] tracking-[0.08em] uppercase text-aura-stone group-hover:text-aura-rose-gold transition-colors duration-300 text-center font-medium">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-aura-stone font-light mb-2">Hand-picked</p>
            <h2 className="font-display text-2xl sm:text-4xl font-light text-aura-charcoal">Featured Products</h2>
          </div>
          <Link
            href="/bestsellers"
            className="text-[11px] tracking-[0.12em] uppercase text-aura-stone hover:text-aura-rose-gold transition-colors duration-300 font-medium"
          >
            View All →
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      {/* Bestsellers */}
      <section className="py-10 sm:py-20" style={{ background: 'linear-gradient(180deg, #FCEEF5 0%, #FDF8FB 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-aura-stone font-light mb-2">Most Loved</p>
              <h2 className="font-display text-2xl sm:text-4xl font-light text-aura-charcoal">Our Bestsellers</h2>
            </div>
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

      {/* Skin Quiz CTA */}
      <section className="w-full py-14 sm:py-24 px-4 sm:px-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #C44B8A 0%, #9B2D6E 50%, #C44B8A 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)' }} />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/60 font-light mb-4">
            Personalised Skincare
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-4 leading-tight">
            Find Your Perfect Routine
          </h2>
          <p className="text-[14px] text-white/70 font-light leading-relaxed mb-8">
            Answer 5 questions and get personalised recommendations curated just for your skin type.
          </p>
          <Link
            href="/bestsellers"
            className="inline-block px-10 py-4 text-[11px] tracking-[0.15em] uppercase font-medium bg-white hover:bg-aura-blush transition-all duration-300 ease-out"
            style={{ color: '#C44B8A' }}
          >
            Explore Skincare →
          </Link>
        </div>
      </section>

      <PromoBanner />
    </>
  )
}
