import type { Product } from './types'

/**
 * Determines badge states for a product based on its tags and pricing.
 */
export function getProductBadges(product: Product): {
  isNew: boolean
  isBestseller: boolean
  salePercent: number | null
} {
  const tags = product.tags ?? []
  const isNew = tags.some((t) => t.toLowerCase() === 'new')
  const isBestseller = tags.some((t) => t.toLowerCase() === 'bestseller')

  const firstVariant = product.variants?.nodes?.[0]
  const price = parseFloat(
    firstVariant?.price?.amount ?? product.priceRange.minVariantPrice.amount
  )
  const compareAt = parseFloat(
    firstVariant?.compareAtPrice?.amount ??
    product.compareAtPriceRange?.minVariantPrice?.amount ??
    '0'
  )

  const salePercent =
    compareAt > price && compareAt > 0
      ? Math.round(((compareAt - price) / compareAt) * 100)
      : null

  return { isNew, isBestseller, salePercent }
}

/**
 * Converts a string to a URL-friendly handle/slug.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Truncates text to a given length with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

/**
 * Groups brands by their first letter for the A-Z brands page.
 */
export function groupByLetter<T extends string>(
  items: T[]
): { letter: string; items: T[] }[] {
  const map: Record<string, T[]> = {}
  items.forEach((item) => {
    const letter = item[0]?.toUpperCase() ?? '#'
    if (!map[letter]) map[letter] = []
    map[letter].push(item)
  })
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, items]) => ({ letter, items }))
}

/**
 * Builds Shopify ProductFilter input objects from active filter state.
 */
export function buildShopifyFilters(params: {
  minPrice?: number
  maxPrice?: number
  brands?: string[]
  volumes?: string[]
  countries?: string[]
  skinTypes?: string[]
  skinConcerns?: string[]
  activeIngredients?: string[]
  ageGroup?: string | null
}): Record<string, unknown>[] {
  const filters: Record<string, unknown>[] = []

  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    filters.push({
      price: {
        min: params.minPrice ?? 0,
        max: params.maxPrice ?? 999999,
      },
    })
  }

  params.brands?.forEach((brand) => {
    filters.push({ productVendor: brand })
  })

  params.volumes?.forEach((vol) => {
    filters.push({ variantOption: { name: 'Volume', value: vol } })
  })

  params.countries?.forEach((country) => {
    filters.push({
      productMetafield: {
        namespace: 'custom',
        key: 'country_of_origin',
        value: country,
      },
    })
  })

  params.skinTypes?.forEach((type) => {
    filters.push({
      productMetafield: { namespace: 'filter', key: 'skin_type', value: type },
    })
  })

  params.skinConcerns?.forEach((concern) => {
    filters.push({
      productMetafield: { namespace: 'filter', key: 'skin_concern', value: concern },
    })
  })

  params.activeIngredients?.forEach((ingredient) => {
    filters.push({
      productMetafield: { namespace: 'filter', key: 'active_ingredients', value: ingredient },
    })
  })

  if (params.ageGroup) {
    filters.push({
      productMetafield: { namespace: 'filter', key: 'age_group', value: params.ageGroup },
    })
  }

  return filters
}
