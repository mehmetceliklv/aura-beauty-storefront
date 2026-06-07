import React from 'react'
import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center flex-wrap gap-1" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li>
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
          >
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li className="text-xs text-gray-400" aria-hidden="true">
              /
            </li>
            <li>
              {item.href && index < items.length - 1 ? (
                <Link
                  href={item.href}
                  className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-xs text-gray-800"
                  aria-current={index === items.length - 1 ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}
