import Link from 'next/link'

export default function HeroBanner() {
  return (
    <section
      className="relative w-full flex items-center bg-aura-cream overflow-hidden"
      style={{ minHeight: '100vh' }}
      aria-label="Hero banner"
    >
      {/* Decorative blush circle */}
      <div
        className="absolute right-0 top-0 w-1/2 h-full opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 80% 40%, #F5E6DF 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="max-w-lg">
          {/* Eyebrow */}
          <p className="text-[10px] tracking-[0.25em] uppercase text-aura-rose-gold font-light mb-6">
            New Arrivals
          </p>

          {/* Heading */}
          <h1
            className="font-display font-light leading-[1.1] text-aura-charcoal mb-6"
            style={{ fontSize: 'clamp(3rem, 7vw, 5rem)' }}
          >
            Skincare that
            <br />
            <em>Honours</em> Your
            <br />
            Skin
          </h1>

          {/* Subtext */}
          <p className="text-[14px] text-aura-stone font-light leading-relaxed mb-10 max-w-xs">
            Curated skincare rituals from the world&apos;s most celebrated beauty houses.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/collections/face-care"
              className="inline-block px-8 py-3.5 text-[11px] tracking-[0.15em] uppercase font-medium text-white bg-aura-charcoal hover:bg-aura-rose-gold transition-all duration-300 ease-out text-center"
            >
              Explore Collection
            </Link>
            <Link
              href="/bestsellers"
              className="inline-block px-8 py-3.5 text-[11px] tracking-[0.15em] uppercase font-medium text-aura-charcoal border border-aura-charcoal hover:bg-aura-charcoal hover:text-white transition-all duration-300 ease-out text-center"
            >
              Bestsellers
            </Link>
          </div>
        </div>
      </div>

      {/* Right side decorative element */}
      <div
        className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="w-80 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #C4A882 0%, transparent 70%)' }}
        />
      </div>
    </section>
  )
}
