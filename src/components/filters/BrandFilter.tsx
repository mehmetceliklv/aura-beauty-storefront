'use client'

import React from 'react'

interface BrandFilterProps {
  brands: string[]
  selected: string[]
  onChange: (brands: string[]) => void
}

export default function BrandFilter({ brands, selected, onChange }: BrandFilterProps) {
  const handleToggle = (brand: string) => {
    if (selected.includes(brand)) {
      onChange(selected.filter((b) => b !== brand))
    } else {
      onChange([...selected, brand])
    }
  }

  if (brands.length === 0) {
    return (
      <p style={{ fontSize: '12px', color: '#aaa' }}>No brands available.</p>
    )
  }

  return (
    <ul
      style={{
        maxHeight: '200px',
        overflowY: 'auto',
        listStyle: 'none',
        padding: 0,
        margin: 0,
      }}
    >
      {brands.map((brand) => (
        <li key={brand} style={{ marginBottom: '6px' }}>
          <label
            className="flex items-center gap-2 cursor-pointer"
            style={{ fontSize: '13px', color: '#333' }}
          >
            <input
              type="checkbox"
              checked={selected.includes(brand)}
              onChange={() => handleToggle(brand)}
              style={{ accentColor: '#C8102E', cursor: 'pointer' }}
              aria-label={`Filter by brand: ${brand}`}
            />
            <span>{brand}</span>
          </label>
        </li>
      ))}
    </ul>
  )
}
