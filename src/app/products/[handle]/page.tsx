import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getProductByHandle } from '@/lib/queries/products'
import { formatPrice, getSalePercent } from '@/lib/shopify'
import AddToCartButton from '@/components/cart/AddToCartButton'

interface Props {
  params: { handle: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const handle = decodeURIComponent(params.handle)
  try {
    const product = await getProductByHandle(handle)
    if (product) {
      return {
        title: product.title,
        description: product.description,
        openGraph: product.featuredImage
          ? { images: [{ url: product.featuredImage.url }] }
          : undefined,
      }
    }
  } catch {
    // fallback
  }
  return { title: 'Product' }
}

export default async function ProductPage({ params }: Props) {
  const handle = decodeURIComponent(params.handle)

  let product = null
  try {
    product = await getProductByHandle(handle)
  } catch {
    // Shopify not configured
  }

  if (!product && process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN) {
    notFound()
  }

  if (!product) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-20 text-center text-gray-500">
        Product not available — configure Shopify environment variables to load
        real products.
      </div>
    )
  }

  const firstVariant = product.variants.nodes[0]
  const price = firstVariant?.price ?? product.priceRange.minVariantPrice
  const compareAt = firstVariant?.compareAtPrice ?? product.compareAtPriceRange?.minVariantPrice
  const salePercent = getSalePercent(price.amount, compareAt?.amount)

  const isNew = product.tags?.includes('new') || product.tags?.includes('NEW')
  const isBestseller =
    product.tags?.includes('bestseller') ||
    product.tags?.includes('BESTSELLER')

  const mainImage = product.featuredImage ?? product.images?.nodes?.[0]

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-3">
          {mainImage ? (
            <div className="relative aspect-square bg-aura-gray overflow-hidden">
              <Image
                src={mainImage.url}
                alt={mainImage.altText ?? product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          ) : (
            <div className="aspect-square bg-aura-gray flex items-center justify-center">
              <span className="text-gray-300 text-6xl">✦</span>
            </div>
          )}
          {product.images.nodes.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.nodes.slice(0, 5).map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square bg-aura-gray overflow-hidden"
                >
                  <Image
                    src={img.url}
                    alt={img.altText ?? `${product.title} image ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          {/* Badges */}
          <div className="flex gap-2">
            {isNew && (
              <span className="bg-aura-navy text-white text-xs font-semibold px-2 py-1 tracking-wider uppercase">
                NEW
              </span>
            )}
            {isBestseller && (
              <span className="bg-aura-beige text-aura-navy text-xs font-semibold px-2 py-1 tracking-wider uppercase">
                BESTSELLER
              </span>
            )}
            {salePercent !== null && (
              <span className="bg-aura-red text-white text-xs font-semibold px-2 py-1 tracking-wider uppercase">
                -{salePercent}%
              </span>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
              {product.vendor}
            </p>
            <h1 className="font-serif text-2xl text-aura-navy leading-snug">
              {product.title}
            </h1>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-xl font-semibold text-aura-navy">
              {formatPrice(price.amount, price.currencyCode)}
            </span>
            {compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount) && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(compareAt.amount, compareAt.currencyCode)}
              </span>
            )}
          </div>

          {/* Add to cart */}
          {firstVariant && (
            <AddToCartButton
              variantId={firstVariant.id}
              availableForSale={firstVariant.availableForSale}
            />
          )}

          {/* Description */}
          {product.descriptionHtml ? (
            <div
              className="prose prose-sm text-gray-600 max-w-none"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          ) : product.description ? (
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          ) : null}

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs border border-aura-border px-2 py-1 text-gray-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
