import { shopifyFetch } from '@/lib/shopify'
import type { ShopInfo } from '@/lib/types'

export async function getShopInfo(): Promise<ShopInfo> {
  const query = `
    query GetShopInfo {
      shop {
        name
        description
        primaryDomain {
          url
        }
        brand {
          logo {
            image {
              url
              altText
              width
              height
            }
          }
          squareLogo {
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  `
  const data = await shopifyFetch<{ shop: ShopInfo }>({ query })
  return data.shop
}

export async function getAllBrands(): Promise<string[]> {
  const query = `
    query GetAllBrands {
      products(first: 250) {
        nodes {
          vendor
        }
      }
    }
  `
  const data = await shopifyFetch<{ products: { nodes: { vendor: string }[] } }>(
    { query }
  )

  const vendorSet = new Set<string>()
  data.products.nodes.forEach(({ vendor }) => {
    if (vendor && vendor.trim()) {
      vendorSet.add(vendor.trim())
    }
  })

  return Array.from(vendorSet).sort((a, b) => a.localeCompare(b))
}

export interface BrandGroup {
  letter: string
  brands: string[]
}

export function groupBrandsByLetter(brands: string[]): BrandGroup[] {
  const grouped: Record<string, string[]> = {}

  brands.forEach((brand) => {
    const letter = brand[0].toUpperCase()
    if (!grouped[letter]) grouped[letter] = []
    grouped[letter].push(brand)
  })

  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, brands]) => ({ letter, brands }))
}
