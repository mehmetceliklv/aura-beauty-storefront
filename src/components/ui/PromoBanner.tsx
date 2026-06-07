import React from 'react'
import Link from 'next/link'

const GIFT_SETS = [
  { name: 'Glow Starter Kit', desc: 'Toner + Serum + Moisturiser', price: '€69' },
  { name: 'Hydration Bundle', desc: 'Essence + Sheet Masks (10pk)', price: '€49' },
  { name: 'Sun Protection Set', desc: 'SPF Sunscreen + After-Sun', price: '€38' },
]

export default function PromoBanner() {
  return (
    <section
      className="w-full relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FDF8FB 0%, #FCEEF5 60%, #F4C5DC 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: text */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase font-light mb-4" style={{ color: '#C44B8A' }}>
              Gift Ideas
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-aura-charcoal mb-4 leading-tight">
              The Gift of
              <br />
              <em className="text-gradient-rose">Beautiful Skin</em>
            </h2>
            <p className="text-[14px] text-aura-stone font-light mb-8 max-w-md leading-relaxed">
              Beautifully curated gift sets for every skin type. Choose a set or build your own — all arrive gift-wrapped with a personalised card.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/bestsellers"
                className="inline-block px-8 py-4 text-[11px] tracking-[0.15em] uppercase font-medium text-white text-center transition-all duration-300 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #C44B8A, #9B2D6E)' }}
              >
                Shop Gift Sets
              </Link>
              <Link
                href="/bestsellers"
                className="inline-block px-8 py-4 text-[11px] tracking-[0.15em] uppercase font-medium text-aura-charcoal border border-aura-border-soft bg-white hover:border-aura-rose-gold hover:text-aura-rose-gold transition-all duration-300 ease-out text-center"
              >
                Bestsellers →
              </Link>
            </div>
          </div>

          {/* Right: gift set cards */}
          <div className="space-y-3">
            {GIFT_SETS.map(({ name, desc, price }) => (
              <div
                key={name}
                className="group flex items-center justify-between p-5 bg-white rounded-2xl border border-aura-border-soft hover:border-aura-rose-gold hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                    style={{ background: '#FCEEF5' }}
                  >
                    🎁
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-aura-charcoal group-hover:text-aura-rose-gold transition-colors">{name}</p>
                    <p className="text-[12px] text-aura-stone font-light">{desc}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-[15px] font-medium" style={{ color: '#C44B8A' }}>{price}</p>
                  <p className="text-[10px] tracking-widest uppercase text-aura-stone">from</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Decorative element */}
      <div
        className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, #C44B8A 0%, transparent 70%)' }}
        aria-hidden="true"
      />
    </section>
  )
}
