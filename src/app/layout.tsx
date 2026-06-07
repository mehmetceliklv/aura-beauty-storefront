import type { Metadata } from 'next'
import type React from 'react'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawerWrapper from '@/components/cart/CartDrawerWrapper'

export const metadata: Metadata = {
  title: {
    default: 'AURA BEAUTY — Premium Beauty & Skincare',
    template: '%s | AURA BEAUTY',
  },
  description:
    'Discover premium beauty, skincare, hair care, and body care products at AURA BEAUTY. Shop bestsellers and top brands.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <WishlistProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-4 py-2 z-50"
              style={{ fontSize: '13px' }}
            >
              Skip to main content
            </a>
            <AnnouncementBar />
            <Header />
            <Navbar />
            <main id="main-content">{children}</main>
            <Footer />
            <CartDrawerWrapper />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}
