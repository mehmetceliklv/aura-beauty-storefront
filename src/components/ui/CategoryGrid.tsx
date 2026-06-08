import Link from 'next/link'

const categories = [
  {
    label: 'Skincare',
    href: '/collections/face-care',
    description: 'Cleansers, serums & moisturisers',
    count: '200+ products',
    gradient: 'linear-gradient(135deg, #FFE4F0 0%, #F4C5DC 100%)',
    accent: '#C44B8A',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
  },
  {
    label: 'Makeup',
    href: '/search?q=makeup',
    description: 'Foundation, lip & eye looks',
    count: '150+ products',
    gradient: 'linear-gradient(135deg, #FFF0F6 0%, #ECBCD4 100%)',
    accent: '#9B2D6E',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    label: 'Hair Care',
    href: '/collections/hair-care',
    description: 'Shampoos, masks & treatments',
    count: '80+ products',
    gradient: 'linear-gradient(135deg, #F5E8FF 0%, #D8B4F8 100%)',
    accent: '#7C3AED',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 2a7 7 0 0 1 7 7v1a7 7 0 0 1-7 7 7 7 0 0 1-7-7V9a7 7 0 0 1 7-7z"/>
        <path d="M8 9s1 2 4 2 4-2 4-2"/>
        <path d="M9 15v4M15 15v4"/>
      </svg>
    ),
  },
  {
    label: 'Body Care',
    href: '/collections/body-care',
    description: 'Lotions, scrubs & bath oils',
    count: '60+ products',
    gradient: 'linear-gradient(135deg, #FFF3E0 0%, #FFD8A8 100%)',
    accent: '#D97706',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
        <ellipse cx="12" cy="12" rx="10" ry="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  {
    label: 'Sun Care',
    href: '/search?q=sunscreen',
    description: 'SPF, sun sticks & after-sun',
    count: '40+ products',
    gradient: 'linear-gradient(135deg, #FFFBEB 0%, #FDE68A 100%)',
    accent: '#B45309',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
      </svg>
    ),
  },
  {
    label: 'Bestsellers',
    href: '/bestsellers',
    description: 'Our most-loved K-beauty picks',
    count: 'Shop now →',
    gradient: 'linear-gradient(135deg, #FCEEF5 0%, #C44B8A 100%)',
    accent: '#FFFFFF',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
]

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20" aria-label="Shop categories">
      <div className="flex items-end justify-between mb-8 sm:mb-12">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-aura-stone font-light mb-2">
            Explore
          </p>
          <h2 className="font-display text-2xl sm:text-4xl font-light text-aura-charcoal">
            Shop by Category
          </h2>
        </div>
        <Link
          href="/bestsellers"
          className="text-[11px] tracking-[0.12em] uppercase text-aura-stone hover:text-aura-rose-gold transition-colors duration-300 font-medium"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map(({ label, href, description, count, gradient, accent, icon }) => (
          <Link
            key={label}
            href={href}
            className="group relative block overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{ background: gradient }}
          >
            <div className="p-4 sm:p-6 md:p-8">
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.6)', color: accent }}
              >
                {icon}
              </div>

              {/* Label */}
              <h3
                className="font-display text-xl font-light mb-1 transition-colors duration-300"
                style={{ color: label === 'Bestsellers' ? '#fff' : '#1C1C1C' }}
              >
                {label}
              </h3>

              {/* Description */}
              <p
                className="text-[12px] font-light mb-4 leading-relaxed"
                style={{ color: label === 'Bestsellers' ? 'rgba(255,255,255,0.8)' : '#9B6B85' }}
              >
                {description}
              </p>

              {/* Count/CTA */}
              <span
                className="text-[10px] tracking-[0.12em] uppercase font-medium"
                style={{ color: label === 'Bestsellers' ? 'rgba(255,255,255,0.9)' : accent }}
              >
                {count}
              </span>
            </div>

            {/* Hover overlay shimmer */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            />

            {/* Arrow */}
            <div
              className="absolute top-5 right-5 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0"
              style={{ background: 'rgba(255,255,255,0.9)' }}
            >
              <span className="text-[11px] font-medium" style={{ color: accent }}>→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
