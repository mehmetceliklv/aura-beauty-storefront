import React from 'react'
import Link from 'next/link'

const SHOP_LINKS = [
  { label: 'Face Care', href: '/collections/face-care' },
  { label: 'Hair Care', href: '/collections/hair-care' },
  { label: 'Body Care', href: '/collections/body-care' },
  { label: 'Home Products', href: '/collections/home-products' },
  { label: 'Sale', href: '/sale' },
  { label: 'Bestsellers', href: '/bestsellers' },
]

const BRAND_LINKS = [
  'La Roche-Posay',
  'Vichy',
  'CeraVe',
  'Bioderma',
  'Avene',
  'Eucerin',
]

const HELP_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Delivery & Payment', href: '/delivery' },
  { label: 'Returns', href: '/returns' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Contact', href: '/contact' },
]

function InstagramIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0F0F0F', color: 'white' }}>
      {/* Top section: logo + tagline */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10 text-center">
        <p className="font-display text-3xl font-light tracking-[0.3em] uppercase text-white mb-3">
          AURA BEAUTY
        </p>
        <p className="text-[11px] tracking-[0.15em] uppercase font-light text-white/40">
          Premium Skincare &amp; Beauty
        </p>
      </div>

      {/* Rose-gold divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #C44B8A, transparent)' }} />
      </div>

      {/* 4-column links */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* SHOP */}
          <div>
            <h3 className="text-[10px] tracking-[0.2em] uppercase font-medium mb-5" style={{ color: '#C44B8A' }}>
              Shop
            </h3>
            <ul className="space-y-3">
              {SHOP_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-[13px] text-white/50 hover:text-white transition-colors duration-300 font-light">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* BRANDS */}
          <div>
            <h3 className="text-[10px] tracking-[0.2em] uppercase font-medium mb-5" style={{ color: '#C44B8A' }}>
              Brands
            </h3>
            <ul className="space-y-3">
              {BRAND_LINKS.map((brand) => (
                <li key={brand}>
                  <Link
                    href={`/brands#${brand.toLowerCase().replace(/[\s-]+/g, '-')}`}
                    className="text-[13px] text-white/50 hover:text-white transition-colors duration-300 font-light"
                  >
                    {brand}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/brands" className="text-[13px] font-light transition-colors duration-300 hover:text-white" style={{ color: '#C44B8A' }}>
                  All brands →
                </Link>
              </li>
            </ul>
          </div>

          {/* HELP */}
          <div>
            <h3 className="text-[10px] tracking-[0.2em] uppercase font-medium mb-5" style={{ color: '#C44B8A' }}>
              Help
            </h3>
            <ul className="space-y-3">
              {HELP_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-[13px] text-white/50 hover:text-white transition-colors duration-300 font-light">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONNECT */}
          <div>
            <h3 className="text-[10px] tracking-[0.2em] uppercase font-medium mb-5" style={{ color: '#C44B8A' }}>
              Connect
            </h3>
            <ul className="space-y-3 mb-6">
              <li>
                <a href="mailto:info@aurabeauty.ua" className="text-[13px] text-white/50 hover:text-white transition-colors duration-300 font-light">
                  info@aurabeauty.ua
                </a>
              </li>
              <li>
                <span className="text-[13px] text-white/50 font-light">
                  Mon–Sat 10:00–19:00
                </span>
              </li>
              <li>
                <span className="text-[13px] text-white/40 font-light">
                  123 Beauty Street<br />Kyiv, Ukraine 01001
                </span>
              </li>
            </ul>

            {/* Social icons */}
            <div className="flex items-center gap-4 flex-wrap">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/40 hover:text-white transition-colors duration-300">
                <InstagramIcon />
              </a>
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-white/40 hover:text-white transition-colors duration-300">
                <WhatsAppIcon />
              </a>
              <a href="https://t.me/" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="text-white/40 hover:text-white transition-colors duration-300">
                <TelegramIcon />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-white/40 hover:text-white transition-colors duration-300">
                <TikTokIcon />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-white/25 font-light tracking-[0.05em]">
            &copy; {new Date().getFullYear()} AURA BEAUTY. All rights reserved.
          </p>
          <p className="text-[11px] text-white/25 font-light tracking-[0.05em]">
            Made with care
          </p>
        </div>
      </div>
    </footer>
  )
}
