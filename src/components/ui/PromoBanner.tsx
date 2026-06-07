import React from 'react'
import Link from 'next/link'

export default function PromoBanner() {
  return (
    <section className="w-full bg-aura-blush py-16 px-8">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-[10px] tracking-[0.2em] uppercase text-aura-stone font-light mb-4">
          Gift Ideas
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-light text-aura-charcoal mb-4 leading-tight">
          The Gift of Beautiful Skin
        </h2>
        <p className="text-[14px] text-aura-stone font-light mb-8 max-w-md mx-auto leading-relaxed">
          Beautifully wrapped gift sets, ready to delight. Choose any amount and let them
          pick what they love.
        </p>
        <Link
          href="/gift-cards"
          className="inline-block px-8 py-3.5 text-[11px] tracking-[0.15em] uppercase font-medium text-aura-charcoal border border-aura-charcoal hover:bg-aura-charcoal hover:text-white transition-all duration-300 ease-out"
        >
          Shop Gift Sets
        </Link>
      </div>
    </section>
  )
}
