import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductsByCollection } from '@/lib/queries/products'
import CollectionView from '@/components/product/CollectionView'

interface Props {
  params: { handle: string }
  searchParams: {
    sort?: string
    brand?: string
    volume?: string
    country?: string
    min_price?: string
    max_price?: string
    skin_type?: string
    skin_concern?: string
    ingredient?: string
    age?: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const handle = decodeURIComponent(params.handle)
  try {
    const collection = await getProductsByCollection(handle, 1)
    if (collection) {
      return {
        title: collection.title,
        description: collection.description || `Shop ${collection.title} at AURA BEAUTY`,
      }
    }
  } catch {
    // fallback
  }
  return { title: 'Collection' }
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const handle = decodeURIComponent(params.handle)
  const sortKey = searchParams.sort?.toUpperCase() || 'RELEVANCE'
  const skinTypes = searchParams.skin_type?.split(',').filter(Boolean) ?? []
  const skinConcerns = searchParams.skin_concern?.split(',').filter(Boolean) ?? []
  const ingredients = searchParams.ingredient?.split(',').filter(Boolean) ?? []
  const ageGroup = searchParams.age ?? null

  let collection = null
  try {
    collection = await getProductsByCollection(handle, 24, undefined, sortKey)
  } catch {
    // Shopify not configured
  }

  if (!collection && process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN) {
    notFound()
  }

  const products = collection?.products?.nodes ?? []

  const brands = Array.from(
    new Set(products.map((p) => p.vendor).filter(Boolean))
  ).sort()

  const displayTitle = collection?.title ?? handle.replace(/-/g, ' ')

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="font-display text-5xl font-light text-aura-charcoal tracking-wide capitalize mb-2">
          {displayTitle}
        </h1>
        {collection?.description && (
          <p className="text-[13px] text-aura-stone font-light mt-3 max-w-xl leading-relaxed">
            {collection.description}
          </p>
        )}
        <p className="text-[11px] text-aura-stone font-light mt-4 tracking-[0.05em]">
          {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      <CollectionView initialProducts={products} brands={brands} />
    </div>
  )
}
