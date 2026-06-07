'use client'

import React, { useState } from 'react'
import PriceRangeFilter from './PriceRangeFilter'
import BrandFilter from './BrandFilter'
import VolumeFilter from './VolumeFilter'
import CountryFilter from './CountryFilter'
import type { FilterState } from '@/lib/types'

interface FilterSidebarProps {
  maxPrice?: number
  brands?: string[]
  activeFilters: FilterState
  onFiltersChange: (filters: Partial<FilterState>) => void
  onReset: () => void
}

interface SectionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

const LABEL_STYLE: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '300',
  color: '#1C1C1C',
}

interface CheckboxGroupProps {
  options: string[]
  selected: string[]
  onChange: (values: string[]) => void
  ariaPrefix: string
}

function CheckboxGroup({ options, selected, onChange, ariaPrefix }: CheckboxGroupProps) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((v) => v !== opt))
    } else {
      onChange([...selected, opt])
    }
  }
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {options.map((opt) => (
        <li key={opt} style={{ marginBottom: '6px' }}>
          <label className="flex items-center gap-2 cursor-pointer" style={LABEL_STYLE}>
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
              style={{ accentColor: '#C4A882', cursor: 'pointer' }}
              aria-label={`Filter by ${ariaPrefix}: ${opt}`}
            />
            <span>{opt}</span>
          </label>
        </li>
      ))}
    </ul>
  )
}

interface RadioGroupProps {
  options: string[]
  selected: string | null
  onChange: (value: string) => void
  ariaPrefix: string
}

function RadioGroup({ options, selected, onChange, ariaPrefix }: RadioGroupProps) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {options.map((opt) => (
        <li key={opt} style={{ marginBottom: '6px' }}>
          <label className="flex items-center gap-2 cursor-pointer" style={LABEL_STYLE}>
            <input
              type="radio"
              name={ariaPrefix}
              checked={opt === 'All Ages' ? selected === null : selected === opt}
              onChange={() => onChange(opt)}
              style={{ accentColor: '#C4A882', cursor: 'pointer' }}
              aria-label={`Filter by ${ariaPrefix}: ${opt}`}
            />
            <span>{opt}</span>
          </label>
        </li>
      ))}
    </ul>
  )
}

function FilterSection({ title, isOpen, onToggle, children }: SectionProps) {
  return (
    <div style={{ borderBottom: '1px solid #EDE8E3', paddingBottom: '16px', marginBottom: '16px' }}>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
        aria-expanded={isOpen}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0' }}
      >
        <span style={{ fontSize: '10px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1C1C1C' }}>
          {title}
        </span>
        <svg
          width="10"
          height="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease-out', color: '#8C7B6B' }}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  )
}

export default function FilterSidebar({
  maxPrice = 500,
  brands = [],
  activeFilters,
  onFiltersChange,
  onReset,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState({
    price: true,
    brands: true,
    volume: false,
    country: false,
    skinType: true,
    skinConcern: false,
    ingredients: false,
    ageGroup: false,
  })

  const toggle = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <aside
      aria-label="Product filters"
      style={{ width: '220px', flexShrink: 0, padding: '0' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ fontSize: '10px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#1C1C1C' }}>
          Filter
        </h2>
        <button
          type="button"
          onClick={onReset}
          style={{ fontSize: '10px', color: '#8C7B6B', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase' }}
        >
          Reset
        </button>
      </div>

      {/* Price Range */}
      <FilterSection
        title="Price"
        isOpen={openSections.price}
        onToggle={() => toggle('price')}
      >
        <PriceRangeFilter
          min={0}
          max={maxPrice}
          value={[activeFilters.minPrice, activeFilters.maxPrice]}
          onChange={([min, max]) => onFiltersChange({ minPrice: min, maxPrice: max })}
        />
      </FilterSection>

      {/* Brands */}
      <FilterSection
        title="Brands"
        isOpen={openSections.brands}
        onToggle={() => toggle('brands')}
      >
        <BrandFilter
          brands={brands}
          selected={activeFilters.brands}
          onChange={(selected) => onFiltersChange({ brands: selected })}
        />
      </FilterSection>

      {/* Volume */}
      <FilterSection
        title="Volume"
        isOpen={openSections.volume}
        onToggle={() => toggle('volume')}
      >
        <VolumeFilter
          options={['30ml', '50ml', '100ml', '200ml', '300ml+']}
          selected={activeFilters.volumes}
          onChange={(selected) => onFiltersChange({ volumes: selected })}
        />
      </FilterSection>

      {/* Country */}
      <FilterSection
        title="Country"
        isOpen={openSections.country}
        onToggle={() => toggle('country')}
      >
        <CountryFilter
          options={['USA', 'France', 'Korea', 'Japan', 'Israel', 'Ukraine', 'Germany', 'Italy', 'UK']}
          selected={activeFilters.countries}
          onChange={(selected) => onFiltersChange({ countries: selected })}
        />
      </FilterSection>

      {/* Skin Type */}
      <FilterSection
        title="Skin Type"
        isOpen={openSections.skinType}
        onToggle={() => toggle('skinType')}
      >
        <CheckboxGroup
          options={['Normal', 'Dry', 'Oily', 'Combination', 'Sensitive', 'Mature']}
          selected={activeFilters.skinTypes}
          onChange={(selected) => onFiltersChange({ skinTypes: selected })}
          ariaPrefix="skin type"
        />
      </FilterSection>

      {/* Skin Concern */}
      <FilterSection
        title="Skin Concern"
        isOpen={openSections.skinConcern}
        onToggle={() => toggle('skinConcern')}
      >
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <CheckboxGroup
            options={['Acne & Blemishes', 'Anti-Ageing', 'Brightening', 'Dehydration', 'Redness', 'Sensitivity', 'Pores', 'Dullness', 'Barrier Repair']}
            selected={activeFilters.skinConcerns}
            onChange={(selected) => onFiltersChange({ skinConcerns: selected })}
            ariaPrefix="skin concern"
          />
        </div>
      </FilterSection>

      {/* Active Ingredients */}
      <FilterSection
        title="Active Ingredients"
        isOpen={openSections.ingredients}
        onToggle={() => toggle('ingredients')}
      >
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <CheckboxGroup
            options={['Astragalus', 'Centella Asiatica', 'Niacinamide', 'Retinol', 'Vitamin C', 'Hyaluronic Acid', 'BHA / Salicylic Acid', 'AHA', 'Ceramide', 'Peptides', 'Bakuchiol']}
            selected={activeFilters.activeIngredients}
            onChange={(selected) => onFiltersChange({ activeIngredients: selected })}
            ariaPrefix="ingredient"
          />
        </div>
      </FilterSection>

      {/* Age Group */}
      <FilterSection
        title="Age Group"
        isOpen={openSections.ageGroup}
        onToggle={() => toggle('ageGroup')}
      >
        <RadioGroup
          options={['All Ages', 'Under 25', '25–35', '35–45', '45+']}
          selected={activeFilters.ageGroup}
          onChange={(value) => onFiltersChange({ ageGroup: value === 'All Ages' ? null : value })}
          ariaPrefix="age group"
        />
      </FilterSection>
    </aside>
  )
}
