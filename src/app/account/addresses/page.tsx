'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface Address {
  id: string
  firstName?: string
  lastName?: string
  address1?: string
  address2?: string
  city?: string
  zoneCode?: string
  zip?: string
  countryCode?: string
  phoneNumber?: string
}

interface AddressesData {
  customer: {
    defaultAddress: { id: string } | null
    addresses: { nodes: Address[] }
  }
}

function AddressCard({
  address,
  isDefault,
}: {
  address: Address
  isDefault: boolean
}) {
  const name = [address.firstName, address.lastName].filter(Boolean).join(' ')

  return (
    <div
      className={`p-6 border ${
        isDefault ? 'border-aura-rose-gold' : 'border-aura-border-soft'
      } bg-white relative`}
    >
      {isDefault && (
        <span className="absolute top-4 right-4 text-[10px] tracking-[0.1em] uppercase text-aura-rose-gold font-medium">
          Default
        </span>
      )}

      {name && (
        <p className="text-[13px] font-medium text-aura-charcoal mb-1">{name}</p>
      )}
      {address.address1 && (
        <p className="text-[13px] text-aura-stone">{address.address1}</p>
      )}
      {address.address2 && (
        <p className="text-[13px] text-aura-stone">{address.address2}</p>
      )}
      <p className="text-[13px] text-aura-stone">
        {[address.city, address.zoneCode, address.zip].filter(Boolean).join(', ')}
      </p>
      {address.countryCode && (
        <p className="text-[13px] text-aura-stone">{address.countryCode}</p>
      )}
      {address.phoneNumber && (
        <p className="text-[12px] text-aura-stone mt-1">{address.phoneNumber}</p>
      )}
    </div>
  )
}

export default function AddressesPage() {
  const [data, setData] = useState<AddressesData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/account/addresses')
      .then((res) => {
        if (res.status === 401) {
          window.location.href = '/account/login'
          return null
        }
        return res.json()
      })
      .then((d: AddressesData | null) => {
        if (d) setData(d)
      })
      .catch(() => setError('Failed to load addresses. Please try again.'))
      .finally(() => setIsLoading(false))
  }, [])

  const addresses = data?.customer.addresses.nodes ?? []
  const defaultAddressId = data?.customer.defaultAddress?.id

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-[11px] tracking-[0.1em] uppercase text-aura-stone">
        <Link href="/account" className="hover:text-aura-rose-gold transition-colors">
          My Account
        </Link>
        <span className="mx-2">→</span>
        <span className="text-aura-charcoal">Saved Addresses</span>
      </nav>

      <div className="flex items-end justify-between mb-10">
        <h1 className="font-display text-4xl font-light text-aura-charcoal">
          Saved Addresses
        </h1>
        {/* Add address redirects to Shopify's hosted account UI */}
        <a
          href={`https://shopify.com/authentication/98765013319/account/addresses/new`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] tracking-[0.12em] uppercase text-aura-stone hover:text-aura-charcoal border border-aura-border-soft px-4 py-2 hover:border-aura-charcoal transition-colors"
        >
          + Add Address
        </a>
      </div>

      {isLoading && (
        <div className="text-center py-20">
          <div className="inline-block w-6 h-6 border-2 border-aura-rose-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-aura-stone text-[13px] mt-4">Loading addresses…</p>
        </div>
      )}

      {error && (
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 text-[13px]">
          {error}
        </div>
      )}

      {!isLoading && !error && addresses.length === 0 && (
        <div className="text-center py-20 border border-aura-border-soft">
          <span className="text-aura-rose-gold text-4xl block mb-4">◎</span>
          <p className="text-aura-stone text-[14px] mb-4">
            You haven&apos;t saved any addresses yet.
          </p>
          <p className="text-aura-stone text-[12px]">
            Add an address to speed up checkout.
          </p>
        </div>
      )}

      {!isLoading && addresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isDefault={address.id === defaultAddressId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
