'use client'

import React from 'react'
import type { SortKey } from '@/lib/types'

interface SortOption {
  label: string
  value: SortKey
  reverse?: boolean
}

const SORT_OPTIONS: SortOption[] = [
  { label: 'Featured', value: 'RELEVANCE' },
  { label: 'Price: Low to High', value: 'PRICE', reverse: false },
  { label: 'Price: High to Low', value: 'PRICE', reverse: true },
  { label: 'Newest', value: 'CREATED_AT', reverse: true },
  { label: 'Best Selling', value: 'BEST_SELLING' },
  { label: 'Name: A-Z', value: 'TITLE' },
]

interface SortDropdownProps {
  value: SortKey
  reverse?: boolean
  onChange: (key: SortKey, reverse: boolean) => void
}

export default function SortDropdown({ value, reverse = false, onChange }: SortDropdownProps) {
  const currentOption = SORT_OPTIONS.find(
    (o) => o.value === value && (o.reverse ?? false) === reverse
  )

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort-select"
        className="text-xs text-gray-500 whitespace-nowrap"
        style={{ fontSize: '12px' }}
      >
        Sort by:
      </label>
      <select
        id="sort-select"
        value={`${value}-${reverse ? 'desc' : 'asc'}`}
        aria-label="Sort products by"
        onChange={(e) => {
          const val = e.target.value
          const lastDash = val.lastIndexOf('-')
          const key = val.slice(0, lastDash) as SortKey
          const dir = val.slice(lastDash + 1)
          onChange(key, dir === 'desc')
        }}
        className="text-sm border px-2 py-1.5 focus:outline-none focus:border-gray-400"
        style={{
          borderColor: '#E5E5E5',
          fontSize: '13px',
          backgroundColor: 'white',
          cursor: 'pointer',
          minWidth: '160px',
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <option
            key={`${option.value}-${option.reverse ? 'desc' : 'asc'}`}
            value={`${option.value}-${option.reverse ? 'desc' : 'asc'}`}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
