'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type MegaColumn = {
  heading: string
  sections: {
    subheading?: string
    links: { label: string; href: string }[]
  }[]
}

type NavItem =
  | { label: string; href: string; style?: string; mega?: never }
  | { label: string; href?: never; style?: string; mega: MegaColumn[] }

const SKINCARE_MEGA: MegaColumn[] = [
  {
    heading: 'PRODUCT TYPES',
    sections: [
      {
        subheading: 'FACE CARE',
        links: [
          { label: 'Moisturizer & Cream', href: '/collections/face-care' },
          { label: 'Essence & Serum', href: '/search?q=essence+serum' },
          { label: 'Toner & Mist', href: '/search?q=toner' },
          { label: 'Sunscreen', href: '/search?q=sunscreen' },
          { label: 'Spot Treatment', href: '/search?q=spot-treatment' },
        ],
      },
      {
        subheading: 'MASKS',
        links: [
          { label: 'Sheet Masks', href: '/search?q=sheet+mask' },
          { label: 'Sleeping Masks', href: '/search?q=sleeping+mask' },
          { label: 'Eye Masks', href: '/search?q=eye+mask' },
          { label: 'Peel-off Masks', href: '/search?q=peel+mask' },
        ],
      },
    ],
  },
  {
    heading: 'EYE & LIP / CLEANSER',
    sections: [
      {
        subheading: 'EYE & LIP',
        links: [
          { label: 'Eye Cream', href: '/search?q=eye+cream' },
          { label: 'Eye Serum', href: '/search?q=eye+serum' },
          { label: 'Lip Care', href: '/search?q=lip+care' },
          { label: 'Lip Masks', href: '/search?q=lip+mask' },
        ],
      },
      {
        subheading: 'CLEANSER',
        links: [
          { label: 'Face Wash', href: '/search?q=face+wash' },
          { label: 'Exfoliator', href: '/search?q=exfoliator' },
          { label: 'Makeup Remover', href: '/search?q=makeup+remover' },
          { label: 'Pore Care', href: '/search?q=pore+care' },
        ],
      },
    ],
  },
  {
    heading: 'HIGHLIGHT',
    sections: [
      {
        links: [
          { label: 'Korean Beauty', href: '/search?q=korean' },
          { label: 'Japanese Beauty', href: '/search?q=japanese' },
          { label: 'Cruelty-free', href: '/search?q=cruelty+free' },
          { label: 'Vegan', href: '/search?q=vegan' },
        ],
      },
      {
        subheading: 'PRICE',
        links: [
          { label: 'Under €20', href: '/search?maxPrice=20' },
          { label: '€20–€50', href: '/search?minPrice=20&maxPrice=50' },
          { label: 'Over €50', href: '/search?minPrice=50' },
        ],
      },
    ],
  },
]

const MAKEUP_MEGA: MegaColumn[] = [
  {
    heading: 'FACE / EYE',
    sections: [
      {
        subheading: 'FACE',
        links: [
          { label: 'Foundation', href: '/search?q=foundation' },
          { label: 'BB & CC Cream', href: '/search?q=bb+cream' },
          { label: 'Concealer', href: '/search?q=concealer' },
          { label: 'Blush', href: '/search?q=blush' },
          { label: 'Highlighter', href: '/search?q=highlighter' },
          { label: 'Powder', href: '/search?q=powder' },
        ],
      },
      {
        subheading: 'EYE',
        links: [
          { label: 'Eyebrow', href: '/search?q=eyebrow' },
          { label: 'Eyeliner', href: '/search?q=eyeliner' },
          { label: 'Eyeshadow', href: '/search?q=eyeshadow' },
          { label: 'Mascara', href: '/search?q=mascara' },
        ],
      },
    ],
  },
  {
    heading: 'LIP / TOOLS',
    sections: [
      {
        subheading: 'LIP',
        links: [
          { label: 'Lip Tint', href: '/search?q=lip+tint' },
          { label: 'Lipstick', href: '/search?q=lipstick' },
          { label: 'Lip Gloss', href: '/search?q=lip+gloss' },
          { label: 'Lip Balm', href: '/search?q=lip+balm' },
        ],
      },
      {
        subheading: 'TOOLS',
        links: [
          { label: 'Makeup Brushes', href: '/search?q=makeup+brush' },
          { label: 'Sponge & Applicator', href: '/search?q=sponge' },
          { label: 'Makeup Palettes', href: '/search?q=palette' },
        ],
      },
    ],
  },
  {
    heading: 'HIGHLIGHT',
    sections: [
      {
        links: [
          { label: 'Korean Beauty', href: '/search?q=korean' },
          { label: 'Japanese Beauty', href: '/search?q=japanese' },
          { label: 'Travel Size', href: '/search?q=mini' },
          { label: 'Value Sets', href: '/search?q=set' },
        ],
      },
    ],
  },
]

const HAIR_BODY_MEGA: MegaColumn[] = [
  {
    heading: 'HAIR CARE / HEALTH',
    sections: [
      {
        subheading: 'HAIR CARE',
        links: [
          { label: 'Shampoo & Conditioner', href: '/search?q=shampoo' },
          { label: 'Hair Treatment', href: '/search?q=hair+treatment' },
          { label: 'Hair Styling', href: '/search?q=hair+styling' },
          { label: 'Hair Masks', href: '/search?q=hair+mask' },
        ],
      },
      {
        subheading: 'HEALTH',
        links: [
          { label: 'Supplements', href: '/search?q=supplements' },
          { label: 'Vitamins', href: '/search?q=vitamins' },
        ],
      },
    ],
  },
  {
    heading: 'BODY CARE / HAND & FOOT',
    sections: [
      {
        subheading: 'BODY CARE',
        links: [
          { label: 'Body Lotion', href: '/search?q=body+lotion' },
          { label: 'Body Scrub', href: '/search?q=body+scrub' },
          { label: 'Bath & Shower', href: '/search?q=bath' },
          { label: 'Body Oil', href: '/search?q=body+oil' },
        ],
      },
      {
        subheading: 'HAND & FOOT',
        links: [
          { label: 'Hand Cream', href: '/search?q=hand+cream' },
          { label: 'Nail Care', href: '/search?q=nail' },
          { label: 'Foot Care', href: '/search?q=foot+care' },
        ],
      },
    ],
  },
  {
    heading: 'HIGHLIGHT',
    sections: [
      {
        links: [
          { label: 'Korean Beauty', href: '/search?q=korean' },
          { label: 'Natural & Organic', href: '/search?q=natural' },
          { label: 'Cruelty-free', href: '/search?q=cruelty+free' },
        ],
      },
    ],
  },
]

const NAV_ITEMS: NavItem[] = [
  { label: 'SKINCARE', mega: SKINCARE_MEGA },
  { label: 'MAKEUP', mega: MAKEUP_MEGA },
  { label: 'HAIR & BODY', mega: HAIR_BODY_MEGA },
  { label: 'BRANDS', href: '/brands' },
  { label: 'BESTSELLERS', href: '/bestsellers' },
  { label: 'SALE', href: '/sale', style: 'sale' },
  { label: 'FLASH DEALS', href: '/sale?flash=1', style: 'flash' },
]

function MegaPanel({ columns, onClose }: { columns: MegaColumn[]; onClose: () => void }) {
  return (
    <div className="absolute top-full left-0 right-0 z-50 bg-white shadow-xl border-t-2 border-aura-rose-gold">
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-10 px-8 py-8">
        {columns.map((col) => (
          <div key={col.heading}>
            <p className="text-[10px] tracking-[0.15em] uppercase font-semibold text-aura-charcoal border-b border-aura-border-soft pb-2 mb-3">
              {col.heading}
            </p>
            {col.sections.map((section, si) => (
              <div key={si}>
                {section.subheading && (
                  <p className="text-[10px] tracking-[0.12em] uppercase font-semibold text-aura-stone mt-3 mb-1">
                    {section.subheading}
                  </p>
                )}
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="text-[12px] text-aura-charcoal hover:text-aura-rose-gold transition-colors block py-0.5"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const handleMouseEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenMenu(label)
  }

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120)
  }

  return (
    <nav className="w-full bg-white border-b border-aura-border-soft relative">
      <div className="max-w-7xl mx-auto px-6">
        <ul className="hidden md:flex items-center" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {NAV_ITEMS.map((item) => {
            const hasMega = 'mega' in item && !!item.mega
            const href = 'href' in item ? item.href : undefined
            const isActive = href ? (pathname === href || pathname.startsWith(href + '/')) : false
            const isOpen = openMenu === item.label

            const labelClass =
              item.style === 'flash'
                ? 'text-aura-rose-gold font-bold'
                : item.style === 'sale'
                ? 'text-aura-rose-gold font-semibold'
                : isActive
                ? 'text-aura-rose-gold'
                : 'text-aura-charcoal'

            return (
              <li
                key={item.label}
                className={hasMega ? '' : 'relative'}
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                {hasMega ? (
                  <button
                    className={`nav-item block ${labelClass} ${isOpen ? 'text-aura-rose-gold' : ''}`}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={href!}
                    className={`nav-item block ${labelClass}`}
                    onClick={() => setOpenMenu(null)}
                  >
                    {item.label}
                  </Link>
                )}

                {hasMega && isOpen && (
                  <MegaPanel
                    columns={(item as { mega: MegaColumn[] }).mega}
                    onClose={() => setOpenMenu(null)}
                  />
                )}
              </li>
            )
          })}
        </ul>

        {/* Mobile: simple scrollable links */}
        <ul className="md:hidden flex items-center overflow-x-auto gap-1" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {NAV_ITEMS.map((item, index) => {
            const href = 'href' in item ? item.href : '/collections'
            const isActive = pathname === href || pathname.startsWith((href ?? '') + '/')
            const labelClass =
              item.style === 'flash'
                ? 'text-aura-rose-gold font-bold'
                : item.style === 'sale'
                ? 'text-aura-rose-gold font-semibold'
                : isActive
                ? 'text-aura-rose-gold'
                : 'text-aura-charcoal'
            return (
              <React.Fragment key={item.label}>
                {index > 0 && (
                  <li aria-hidden="true" className="text-aura-border-soft text-[10px] select-none px-1">·</li>
                )}
                <li>
                  <Link href={href!} className={`nav-item block ${labelClass}`}>
                    {item.label}
                  </Link>
                </li>
              </React.Fragment>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
