export interface ShopifyImage {
  url: string
  altText: string | null
  width: number
  height: number
}

export interface MoneyV2 {
  amount: string
  currencyCode: string
}

export interface ProductVariant {
  id: string
  title: string
  availableForSale: boolean
  price: MoneyV2
  compareAtPrice: MoneyV2 | null
  selectedOptions: { name: string; value: string }[]
  quantityAvailable: number | null
}

export interface Product {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  vendor: string
  productType: string
  tags: string[]
  availableForSale: boolean
  featuredImage: ShopifyImage | null
  images: { nodes: ShopifyImage[] }
  variants: { nodes: ProductVariant[] }
  priceRange: {
    minVariantPrice: MoneyV2
    maxVariantPrice: MoneyV2
  }
  compareAtPriceRange: {
    minVariantPrice: MoneyV2
    maxVariantPrice: MoneyV2
  }
  metafields?: Array<{
    key: string
    value: string
    namespace: string
  } | null>
  collections?: { nodes: { handle: string; title: string }[] }
}

export interface Collection {
  id: string
  handle: string
  title: string
  description: string
  image: ShopifyImage | null
  products: {
    nodes: Product[]
    pageInfo: PageInfo
    filters?: ProductFilter[]
  }
}

export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string | null
  endCursor: string | null
}

export interface ProductFilter {
  id: string
  label: string
  type: string
  values: FilterValue[]
}

export interface FilterValue {
  id: string
  label: string
  count: number
  input: string
}

export interface ShopBrandImage {
  image: ShopifyImage | null
}

export interface ShopInfo {
  name: string
  description: string | null
  primaryDomain: { url: string }
  brand: {
    logo: ShopBrandImage | null
    squareLogo: ShopBrandImage | null
  } | null
}

export interface CartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    price: MoneyV2
    product: Pick<Product, 'id' | 'handle' | 'title' | 'featuredImage'>
    selectedOptions: { name: string; value: string }[]
  }
  cost: {
    totalAmount: MoneyV2
  }
}

export interface Cart {
  id: string
  checkoutUrl?: string
  lines: { nodes: CartLine[] }
  cost: {
    subtotalAmount: MoneyV2
    totalAmount: MoneyV2
  }
  totalQuantity: number
}

export interface SortOption {
  label: string
  value: string
}

export type SortKey =
  | 'RELEVANCE'
  | 'PRICE'
  | 'TITLE'
  | 'CREATED_AT'
  | 'BEST_SELLING'

export interface FilterState {
  minPrice: number
  maxPrice: number
  brands: string[]
  volumes: string[]
  countries: string[]
  skinTypes: string[]
  skinConcerns: string[]
  activeIngredients: string[]
  ageGroup: string | null
}
