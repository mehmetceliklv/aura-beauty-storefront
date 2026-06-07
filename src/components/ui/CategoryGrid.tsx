import Link from 'next/link'

const categories = [
  {
    label: 'Face Care',
    href: '/collections/face-care',
    description: 'Cleansers, serums & moisturizers',
  },
  {
    label: 'Hair Care',
    href: '/collections/hair-care',
    description: 'Shampoos, masks & styling',
  },
  {
    label: 'Body Care',
    href: '/collections/body-care',
    description: 'Body lotions, scrubs & oils',
  },
  {
    label: 'Home',
    href: '/collections/home-products',
    description: 'Candles, diffusers & more',
  },
]

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20" aria-label="Shop categories">
      <div className="flex items-end justify-between mb-10">
        <h2 className="font-display text-4xl font-light text-aura-charcoal">
          Shop by Category
        </h2>
        <Link
          href="/collections"
          className="text-[11px] tracking-[0.12em] uppercase text-aura-stone hover:text-aura-rose-gold transition-colors duration-300 font-medium"
        >
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map(({ label, href, description }) => (
          <Link
            key={label}
            href={href}
            className="group block bg-aura-blush p-8 text-center hover:bg-aura-blush-dark transition-all duration-300 ease-out"
          >
            <h3 className="font-display text-xl font-light text-aura-charcoal mb-2 group-hover:text-aura-rose-gold transition-colors duration-300">
              {label}
            </h3>
            <p className="text-[11px] tracking-[0.06em] text-aura-stone font-light">
              {description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
