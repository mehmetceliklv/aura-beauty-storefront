import type { Metadata } from 'next'
import { getSaleProducts } from '@/lib/queries/products'
import type { Product } from '@/lib/types'
import ProductGrid from '@/components/product/ProductGrid'

export const metadata: Metadata = {
  title: 'Sale',
  description: 'Shop discounted beauty and skincare products.',
}

export default async function SalePage() {
  let products: Product[] = []
  try {
    products = await getSaleProducts(24)
  } catch {
    // Shopify not configured
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-aura-navy tracking-wide">
          Sale
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {products.length} product{products.length !== 1 ? 's' : ''} on sale
        </p>
      </div>
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p className="text-gray-500 text-center py-20">No sale items found.</p>
      )}
    </div>
  )
}
