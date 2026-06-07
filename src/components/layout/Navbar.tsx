'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'SALE', href: '/sale' },
  { label: 'BESTSELLERS', href: '/bestsellers' },
  { label: 'BRANDS', href: '/brands' },
  { label: 'FACE', href: '/collections/face-care' },
  { label: 'HAIR', href: '/collections/hair-care' },
  { label: 'BODY', href: '/collections/body-care' },
  { label: 'HOME', href: '/collections/home-products' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="w-full bg-aura-white border-b border-aura-border-soft">
      <div className="max-w-7xl mx-auto px-6">
        <ul
          className="flex items-center overflow-x-auto gap-1"
          style={{ listStyle: 'none', margin: 0, padding: 0 }}
        >
          {NAV_ITEMS.map(({ label, href }, index) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <React.Fragment key={href}>
                {index > 0 && (
                  <li aria-hidden="true" className="text-aura-border-soft text-[10px] select-none px-1">
                    ·
                  </li>
                )}
                <li>
                  <Link
                    href={href}
                    className={`nav-item block ${isActive ? 'active text-aura-rose-gold' : 'text-aura-charcoal'}`}
                  >
                    {label}
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
