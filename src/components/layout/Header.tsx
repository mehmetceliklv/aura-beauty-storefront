'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartContext } from '@/context/CartContext'

interface HeaderProps {
  cartCount?: number
  wishlistCount?: number
}

function SearchIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function AccountIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function HamburgerIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export default function Header({ cartCount: cartCountProp = 0, wishlistCount = 0 }: HeaderProps) {
  const router = useRouter()
  const { totalQuantity, openCart } = useCartContext()
  const cartCount = totalQuantity > 0 ? totalQuantity : cartCountProp
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`w-full sticky top-0 z-40 bg-aura-cream/95 backdrop-blur-sm border-b border-aura-border-soft transition-all duration-300 ease-out ${
        scrolled ? 'shadow-sm py-0' : 'py-0'
      }`}
    >
      <div className={`max-w-7xl mx-auto px-6 flex items-center justify-between gap-4 transition-all duration-300 ease-out ${scrolled ? 'py-3' : 'py-5'}`}>
        {/* Left: hamburger / catalog */}
        <div className="flex items-center w-32">
          <Link
            href="/collections"
            className="flex items-center gap-2 text-aura-charcoal hover:text-aura-rose-gold transition-all duration-300 ease-out"
            aria-label="Open catalog"
          >
            <HamburgerIcon />
            <span className="hidden sm:inline text-[11px] tracking-[0.12em] uppercase font-medium">Catalog</span>
          </Link>
        </div>

        {/* Center: Logo */}
        <div className="flex-1 flex items-center justify-center">
          <Link href="/" className="aura-logo text-aura-charcoal">
            AURA BEAUTY
          </Link>
        </div>

        {/* Right: icons */}
        <div className="flex items-center gap-1 w-32 justify-end">
          {/* Search */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 hover:text-aura-rose-gold transition-all duration-300 ease-out"
              aria-label="Search"
            >
              {searchOpen ? <CloseIcon /> : <SearchIcon />}
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-full mt-3 z-50" style={{ width: '300px' }}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (searchQuery.trim()) {
                      setSearchOpen(false)
                      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
                    }
                  }}
                  className="flex shadow-sm"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    autoFocus
                    className="flex-1 px-4 py-2.5 text-[13px] bg-white border border-aura-border-soft focus:outline-none focus:border-aura-rose-gold transition-colors font-light"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-aura-charcoal text-white hover:bg-aura-rose-gold transition-all duration-300 ease-out"
                  >
                    <SearchIcon />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Account */}
          <Link
            href="/account"
            className="p-2.5 hover:text-aura-rose-gold transition-all duration-300 ease-out"
            aria-label="Account"
          >
            <AccountIcon />
          </Link>

          {/* Cart */}
          <button
            onClick={openCart}
            className="p-2.5 hover:text-aura-rose-gold transition-all duration-300 ease-out relative"
            aria-label={`Shopping cart, ${cartCount} items`}
          >
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center bg-aura-rose-gold font-medium">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
