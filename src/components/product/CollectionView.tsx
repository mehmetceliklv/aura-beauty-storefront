'use client'

import { useState, useCallback } from 'react'
import type { Product, FilterState } from '@/lib/types'
import ProductGrid from './ProductGrid'
import FilterSidebar from '@/components/filters/FilterSidebar'

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

function FilterIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  )
}

export default function CollectionView({
  initialProducts,
  brands,
}: CollectionViewProps) {
  const [activeFilters, setActiveFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

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

  const activeFilterCount = activeFilters.brands.length + activeFilters.volumes.length +
    activeFilters.countries.length + activeFilters.skinTypes.length +
    activeFilters.skinConcerns.length + activeFilters.activeIngredients.length +
    (activeFilters.ageGroup ? 1 : 0)

  return (
    <>
      {/* Mobile filter toggle bar */}
      <div className="lg:hidden flex items-center justify-between mb-4 pb-4 border-b border-aura-border-soft">
        <p className="text-[12px] text-aura-stone">{products.length} products</p>
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-aura-border-soft text-[11px] tracking-[0.1em] uppercase font-medium text-aura-charcoal hover:border-aura-rose-gold hover:text-aura-rose-gold transition-all"
        >
          <FilterIcon />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-aura-rose-gold text-white text-[9px] flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFilterOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-aura-border-soft">
              <h2 className="text-[11px] tracking-[0.2em] uppercase font-medium text-aura-charcoal">Filters</h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-aura-stone hover:text-aura-charcoal transition-colors"
                aria-label="Close filters"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5">
              <FilterSidebar
                maxPrice={maxPrice}
                brands={brands}
                activeFilters={activeFilters}
                onFiltersChange={handleFiltersChange}
                onReset={handleReset}
              />
            </div>
            <div className="sticky bottom-0 p-4 bg-white border-t border-aura-border-soft">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 text-[11px] tracking-[0.15em] uppercase font-medium text-white bg-aura-charcoal hover:bg-aura-rose-gold transition-all duration-300"
              >
                Show {products.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="flex gap-12">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar
            maxPrice={maxPrice}
            brands={brands}
            activeFilters={activeFilters}
            onFiltersChange={handleFiltersChange}
            onReset={handleReset}
          />
        </div>
        <div className="flex-1 min-w-0">
          <ProductGrid products={products} />
        </div>
      </div>
    </>
  )
}
