'use client'

import React from 'react'

interface CountryFilterProps {
  options: string[]
  selected: string[]
  onChange: (countries: string[]) => void
}

export default function CountryFilter({ options, selected, onChange }: CountryFilterProps) {
  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((c) => c !== option))
    } else {
      onChange([...selected, option])
    }
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {options.map((option) => (
        <li key={option} style={{ marginBottom: '6px' }}>
          <label
            className="flex items-center gap-2 cursor-pointer"
            style={{ fontSize: '13px', color: '#333' }}
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => handleToggle(option)}
              style={{ accentColor: '#C8102E', cursor: 'pointer' }}
              aria-label={`Filter by country: ${option}`}
            />
            <span>{option}</span>
          </label>
        </li>
      ))}
    </ul>
  )
}
