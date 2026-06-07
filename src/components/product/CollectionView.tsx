'use client'

import { useState, useCallback } from 'react'
import type { Product, FilterState } from '@/lib/types'
import ProductGrid from './ProductGrid'
import FilterSidebar from '@/components/filters/FilterSidebar'
import { buildShopifyFilters } from '@/lib/utils'

interface CollectionViewProps {
  initialProducts: Product[]
  brands: string[]
}

const DEFAULT_FILTERS: FilterState = {
  minPrice: 0,
  maxPrice: 500,
  brands: [],
  volumes: [],
  countries: [],
  skinTypes: [],
  skinConcerns: [],
  activeIngredients: [],
  ageGroup: null,
}

export default function CollectionView({
  initialProducts,
  brands,
}: CollectionViewProps) {
  const [activeFilters, setActiveFilters] = useState<FilterState>(DEFAULT_FILTERS)

  const filteredProducts = useCallback(() => {
    return initialProducts.filter((product) => {
      const firstVariant = product.variants?.nodes?.[0]
      const price = parseFloat(
        firstVariant?.price?.amount ?? product.priceRange.minVariantPrice.amount
      )

      if (price < activeFilters.minPrice || price > activeFilters.maxPrice) {
        return false
      }

      if (
        activeFilters.brands.length > 0 &&
        !activeFilters.brands.includes(product.vendor)
      ) {
        return false
      }

      return true
    })
  }, [initialProducts, activeFilters])

  const handleFiltersChange = (partial: Partial<FilterState>) => {
    setActiveFilters((prev) => ({ ...prev, ...partial }))
  }

  const handleReset = () => {
    setActiveFilters(DEFAULT_FILTERS)
  }

  const products = filteredProducts()
  const maxPrice = Math.max(
    500,
    ...initialProducts.map((p) =>
      parseFloat(p.priceRange.maxVariantPrice.amount)
    )
  )

  return (
    <div className="flex gap-12">
      <FilterSidebar
        maxPrice={maxPrice}
        brands={brands}
        activeFilters={activeFilters}
        onFiltersChange={handleFiltersChange}
        onReset={handleReset}
      />
      <div className="flex-1 min-w-0">
        <ProductGrid products={products} />
      </div>
    </div>
  )
}
