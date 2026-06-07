import { formatPrice } from '@/lib/shopify'

interface PriceDisplayProps {
  price: string
  compareAtPrice?: string | null
  currencyCode: string
  className?: string
}

export default function PriceDisplay({
  price,
  compareAtPrice,
  currencyCode,
  className = '',
}: PriceDisplayProps) {
  const isOnSale =
    compareAtPrice != null &&
    parseFloat(compareAtPrice) > parseFloat(price)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        className="text-base font-bold"
        style={{ color: isOnSale ? '#C8102E' : '#1a1a1a' }}
      >
        {formatPrice(price, currencyCode)}
      </span>
      {isOnSale && (
        <span className="text-sm line-through text-gray-400">
          {formatPrice(compareAtPrice!, currencyCode)}
        </span>
      )}
    </div>
  )
}
