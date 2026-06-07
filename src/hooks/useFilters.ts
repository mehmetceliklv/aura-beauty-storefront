'use client'

import { useCallback, useMemo } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { FilterState, SortKey } from '@/lib/types'

const DEFAULT_FILTERS: FilterState = {
  minPrice: 0,
  maxPrice: 9999,
  brands: [],
  volumes: [],
  countries: [],
  skinTypes: [],
  skinConcerns: [],
  activeIngredients: [],
  ageGroup: null,
}

export function useFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeFilters: FilterState = useMemo(() => {
    const brands = searchParams.get('brand')?.split(',').filter(Boolean) ?? []
    const volumes = searchParams.get('volume')?.split(',').filter(Boolean) ?? []
    const countries = searchParams.get('country')?.split(',').filter(Boolean) ?? []
    const minPrice = Number(searchParams.get('min_price') ?? 0)
    const maxPrice = Number(searchParams.get('max_price') ?? 9999)
    const skinTypes = searchParams.get('skin_type')?.split(',').filter(Boolean) ?? []
    const skinConcerns = searchParams.get('skin_concern')?.split(',').filter(Boolean) ?? []
    const activeIngredients = searchParams.get('ingredient')?.split(',').filter(Boolean) ?? []
    const ageGroup = searchParams.get('age') ?? null

    return { minPrice, maxPrice, brands, volumes, countries, skinTypes, skinConcerns, activeIngredients, ageGroup }
  }, [searchParams])

  const sortKey: SortKey = (searchParams.get('sort') as SortKey) ?? 'RELEVANCE'
  const sortReverse = searchParams.get('reverse') === 'true'
  const currentPage = Number(searchParams.get('page') ?? 1)

  const updateFilters = useCallback(
    (updates: Partial<FilterState & { sortKey: SortKey; sortReverse: boolean; page: number }>) => {
      const params = new URLSearchParams(searchParams.toString())

      if (updates.brands !== undefined) {
        if (updates.brands.length > 0) {
          params.set('brand', updates.brands.join(','))
        } else {
          params.delete('brand')
        }
      }

      if (updates.volumes !== undefined) {
        if (updates.volumes.length > 0) {
          params.set('volume', updates.volumes.join(','))
        } else {
          params.delete('volume')
        }
      }

      if (updates.countries !== undefined) {
        if (updates.countries.length > 0) {
          params.set('country', updates.countries.join(','))
        } else {
          params.delete('country')
        }
      }

      if (updates.skinTypes !== undefined) {
        if (updates.skinTypes.length > 0) {
          params.set('skin_type', updates.skinTypes.join(','))
        } else {
          params.delete('skin_type')
        }
      }

      if (updates.skinConcerns !== undefined) {
        if (updates.skinConcerns.length > 0) {
          params.set('skin_concern', updates.skinConcerns.join(','))
        } else {
          params.delete('skin_concern')
        }
      }

      if (updates.activeIngredients !== undefined) {
        if (updates.activeIngredients.length > 0) {
          params.set('ingredient', updates.activeIngredients.join(','))
        } else {
          params.delete('ingredient')
        }
      }

      if (updates.ageGroup !== undefined) {
        if (updates.ageGroup) {
          params.set('age', updates.ageGroup)
        } else {
          params.delete('age')
        }
      }

      if (updates.minPrice !== undefined) {
        params.set('min_price', String(updates.minPrice))
      }

      if (updates.maxPrice !== undefined) {
        params.set('max_price', String(updates.maxPrice))
      }

      if (updates.sortKey !== undefined) {
        params.set('sort', updates.sortKey)
      }

      if (updates.sortReverse !== undefined) {
        if (updates.sortReverse) {
          params.set('reverse', 'true')
        } else {
          params.delete('reverse')
        }
      }

      if (updates.page !== undefined) {
        if (updates.page > 1) {
          params.set('page', String(updates.page))
        } else {
          params.delete('page')
        }
      } else {
        // Reset page on filter change
        params.delete('page')
      }

      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const resetFilters = useCallback(() => {
    const params = new URLSearchParams()
    const sort = searchParams.get('sort')
    if (sort) params.set('sort', sort)
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  return {
    activeFilters,
    sortKey,
    sortReverse,
    currentPage,
    updateFilters,
    resetFilters,
  }
}
