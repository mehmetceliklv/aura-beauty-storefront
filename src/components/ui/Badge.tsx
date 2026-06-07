import React from 'react'

interface BadgeProps {
  type: 'new' | 'bestseller' | 'sale'
  salePercent?: number
}

export default function Badge({ type, salePercent }: BadgeProps) {
  if (type === 'new') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 bg-aura-charcoal text-white text-[9px] tracking-[0.1em] uppercase font-medium">
        NEW
      </span>
    )
  }

  if (type === 'bestseller') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 border border-aura-stone text-aura-stone text-[9px] tracking-[0.1em] uppercase font-light bg-white/80">
        BESTSELLER
      </span>
    )
  }

  if (type === 'sale' && salePercent !== undefined) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 bg-aura-rose-gold text-white text-[9px] tracking-[0.1em] uppercase font-medium">
        -{salePercent}%
      </span>
    )
  }

  return null
}
