import Link from 'next/link'

const STATS = [
  { value: '500+', label: 'Products' },
  { value: '40+', label: 'Brands' },
  { value: '★ 4.9', label: 'Rating' },
]

const FLOATING_CARDS = [
  { icon: '✦', title: 'COSRX Snail 96', sub: '€19.00', rotate: '-rotate-3', pos: 'top-16 left-0' },
  { icon: '◎', title: 'Beauty of Joseon', sub: 'Bestseller', rotate: 'rotate-2', pos: 'top-1/2 right-0 -translate-y-1/2' },
]

export default function HeroBanner() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FDF8FB 0%, #FCEEF5 45%, #FDF8FB 100%)' }}
      aria-label="Hero banner"
    >
      {/* Background blobs */}
      <div
        className="absolute top-0 right-0 w-2/3 h-full pointer-events-none"
        aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse at 80% 30%, rgba(196,75,138,0.08) 0%, transparent 60%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-1/2 h-1/2 pointer-events-none"
        aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse at 20% 80%, rgba(244,197,220,0.2) 0%, transparent 55%)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[60vh] lg:min-h-[90vh]">

          {/* Left: Content */}
          <div className="relative z-10 max-w-xl py-12 sm:py-16 lg:py-0">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 bg-white border border-aura-border-soft rounded-full px-4 py-1.5 mb-8 shadow-sm">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: '#C44B8A', animation: 'pulse 2s infinite' }}
              />
              <span className="text-[10px] tracking-[0.15em] uppercase font-medium" style={{ color: '#C44B8A' }}>
                New Arrivals · Summer 2025
              </span>
            </div>

            {/* Heading */}
            <h1
              className="font-display font-light leading-[1.05] text-aura-charcoal mb-6"
              style={{ fontSize: 'clamp(3rem, 5.5vw, 5rem)' }}
            >
              Korean Beauty,
              <br />
              <em className="text-gradient-rose italic">Curated</em>
              <br />
              for You
            </h1>

            {/* Subtext */}
            <p className="text-[15px] text-aura-stone font-light leading-relaxed mb-8 max-w-sm">
              Discover premium skincare, makeup and haircare from the world&apos;s most beloved K-beauty brands — delivered to your door.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-8 mb-10 pb-10 border-b border-aura-border-soft">
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="font-display text-2xl font-light text-aura-charcoal">{value}</p>
                  <p className="text-[10px] tracking-[0.1em] uppercase text-aura-stone mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/bestsellers"
                className="inline-block px-8 py-4 text-[11px] tracking-[0.15em] uppercase font-medium text-white text-center transition-all duration-300 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #C44B8A 0%, #9B2D6E 100%)' }}
              >
                Shop Bestsellers
              </Link>
              <Link
                href="/brands"
                className="inline-block px-8 py-4 text-[11px] tracking-[0.15em] uppercase font-medium text-aura-charcoal border border-aura-border-soft bg-white hover:border-aura-rose-gold hover:text-aura-rose-gold transition-all duration-300 ease-out text-center"
              >
                Browse Brands →
              </Link>
            </div>

            {/* Trust icons */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8">
              {['Cruelty-free', 'Clean ingredients', 'Authentic products'].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <span className="text-aura-rose-gold text-[10px]">✓</span>
                  <span className="text-[11px] text-aura-stone font-light">{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual composition */}
          <div className="relative hidden lg:flex items-center justify-center" style={{ height: '600px' }}>
            {/* Main glow ring */}
            <div
              className="absolute w-80 h-80 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(196,75,138,0.15) 0%, rgba(244,197,220,0.08) 50%, transparent 70%)' }}
            />
            {/* Outer decorative ring */}
            <div
              className="absolute w-96 h-96 rounded-full border border-aura-border-soft opacity-60"
              style={{ borderStyle: 'dashed' }}
            />
            <div
              className="absolute"
              style={{ width: '480px', height: '480px', borderRadius: '50%', border: '1px solid rgba(240,213,229,0.3)' }}
            />

            {/* Center brand medallion */}
            <div className="relative z-20 w-52 h-52 rounded-full bg-white flex items-center justify-center"
              style={{ boxShadow: '0 20px 60px rgba(196,75,138,0.15), 0 4px 20px rgba(0,0,0,0.08)' }}
            >
              <div className="text-center">
                <p className="font-display text-2xl tracking-[0.3em] uppercase text-aura-charcoal">AURA</p>
                <p className="text-[9px] tracking-[0.25em] uppercase text-aura-stone mt-0.5">BEAUTY</p>
                <div className="mt-2 text-[10px]" style={{ color: '#C44B8A', letterSpacing: '0.3em' }}>✦ ✦ ✦</div>
              </div>
            </div>

            {/* Floating product cards */}
            <div className="absolute top-14 left-0 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 z-10 -rotate-3"
              style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base"
                style={{ background: '#FCEEF5', color: '#C44B8A' }}>✦</div>
              <div>
                <p className="text-[12px] font-medium text-aura-charcoal">COSRX Snail 96</p>
                <p className="text-[11px] text-aura-stone">€19.00</p>
              </div>
            </div>

            <div className="absolute top-1/2 right-0 -translate-y-1/2 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 z-10 rotate-2"
              style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base"
                style={{ background: '#FDF0F8', color: '#C44B8A' }}>◎</div>
              <div>
                <p className="text-[12px] font-medium text-aura-charcoal">Beauty of Joseon</p>
                <p className="text-[11px]" style={{ color: '#C44B8A' }}>Bestseller ★</p>
              </div>
            </div>

            {/* Review card */}
            <div className="absolute bottom-20 left-8 bg-white rounded-2xl p-4 z-10 -rotate-1 max-w-[200px]"
              style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
            >
              <div className="flex items-center gap-0.5 mb-1.5">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-[11px]" style={{ color: '#C44B8A' }}>★</span>
                ))}
              </div>
              <p className="text-[11px] font-medium text-aura-charcoal leading-snug">&ldquo;Glowing skin in 2 weeks!&rdquo;</p>
              <p className="text-[10px] text-aura-stone mt-1">— Verified Customer</p>
            </div>

            {/* Small accent circles */}
            <div className="absolute top-32 right-16 w-4 h-4 rounded-full" style={{ background: '#F4C5DC' }} />
            <div className="absolute bottom-32 right-24 w-3 h-3 rounded-full" style={{ background: '#C44B8A', opacity: 0.3 }} />
            <div className="absolute top-1/2 left-12 w-2 h-2 rounded-full" style={{ background: '#9B2D6E', opacity: 0.4 }} />
          </div>

        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(253,248,251,0.5))' }}
      />
    </section>
  )
}
