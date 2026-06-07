'use client'

import React, { useState, useCallback } from 'react'
import { formatPrice } from '@/lib/shopify'

interface PriceRangeFilterProps {
  min: number
  max: number
  value: [number, number]
  onChange: (range: [number, number]) => void
  currencyCode?: string
}

export default function PriceRangeFilter({
  min,
  max,
  value,
  onChange,
  currencyCode = 'USD',
}: PriceRangeFilterProps) {
  const [localMin, setLocalMin] = useState(value[0])
  const [localMax, setLocalMax] = useState(value[1])

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = Math.min(Number(e.target.value), localMax - 1)
      setLocalMin(newMin)
      onChange([newMin, localMax])
    },
    [localMax, onChange]
  )

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = Math.max(Number(e.target.value), localMin + 1)
      setLocalMax(newMax)
      onChange([localMin, newMax])
    },
    [localMin, onChange]
  )

  return (
    <div className="space-y-3">
      {/* Price labels */}
      <div className="flex justify-between items-center">
        <span style={{ fontSize: '12px', color: '#666' }}>
          {formatPrice(String(localMin), currencyCode)}
        </span>
        <span style={{ fontSize: '12px', color: '#666' }}>
          {formatPrice(String(localMax), currencyCode)}
        </span>
      </div>

      {/* Range sliders */}
      <div className="relative h-2" style={{ paddingTop: '4px' }}>
        <div
          className="absolute h-1 rounded"
          style={{
            backgroundColor: '#E5E5E5',
            left: 0,
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
        <div
          className="absolute h-1 rounded"
          style={{
            backgroundColor: '#C8102E',
            left: `${((localMin - min) / (max - min)) * 100}%`,
            right: `${100 - ((localMax - min) / (max - min)) * 100}%`,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localMin}
          onChange={handleMinChange}
          className="absolute w-full h-1 appearance-none bg-transparent cursor-pointer"
          style={{ top: 0 }}
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localMax}
          onChange={handleMaxChange}
          className="absolute w-full h-1 appearance-none bg-transparent cursor-pointer"
          style={{ top: 0 }}
          aria-label="Maximum price"
        />
      </div>

      {/* Min/Max inputs */}
      <div className="flex items-center gap-2 mt-2">
        <input
          type="number"
          value={localMin}
          min={min}
          max={localMax - 1}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), localMax - 1)
            setLocalMin(v)
            onChange([v, localMax])
          }}
          className="w-full text-center border text-sm py-1"
          style={{ borderColor: '#E5E5E5', fontSize: '12px' }}
          aria-label="Minimum price input"
        />
        <span style={{ color: '#aaa', fontSize: '12px' }}>–</span>
        <input
          type="number"
          value={localMax}
          min={localMin + 1}
          max={max}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), localMin + 1)
            setLocalMax(v)
            onChange([localMin, v])
          }}
          className="w-full text-center border text-sm py-1"
          style={{ borderColor: '#E5E5E5', fontSize: '12px' }}
          aria-label="Maximum price input"
        />
      </div>
    </div>
  )
}
