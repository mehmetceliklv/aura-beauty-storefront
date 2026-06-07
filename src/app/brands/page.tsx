import type { Metadata } from 'next'
import { getAllBrands, groupBrandsByLetter } from '@/lib/queries/shop'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Brands',
  description: 'Browse all beauty brands available at AURA BEAUTY.',
}

export default async function BrandsPage() {
  let brandGroups: { letter: string; brands: string[] }[] = []
  try {
    const brands = await getAllBrands()
    brandGroups = groupBrandsByLetter(brands)
  } catch {
    // Shopify not configured
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl text-aura-navy tracking-wide mb-8">
        Brands
      </h1>

      {brandGroups.length > 0 ? (
        <div className="space-y-8">
          {brandGroups.map(({ letter, brands }) => (
            <div key={letter}>
              <h2 className="text-lg font-semibold text-aura-navy border-b border-aura-border pb-2 mb-4">
                {letter}
              </h2>
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {brands.map((brand) => (
                  <li key={brand}>
                    <Link
                      href={`/collections/all?brand=${encodeURIComponent(brand)}`}
                      className="text-sm text-gray-700 hover:text-aura-navy hover:underline"
                    >
                      {brand}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-20">No brands found.</p>
      )}
    </div>
  )
}
