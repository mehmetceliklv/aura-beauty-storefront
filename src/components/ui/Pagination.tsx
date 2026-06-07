'use client'

import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | '...')[] = [1]

    if (currentPage > 3) {
      pages.push('...')
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push('...')
    }

    pages.push(totalPages)

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-8">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="flex items-center justify-center w-8 h-8 transition-colors"
        style={{
          border: '1px solid #E5E5E5',
          backgroundColor: currentPage === 1 ? '#F7F7F7' : 'white',
          color: currentPage === 1 ? '#ccc' : '#1a1a1a',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
        }}
      >
        <ChevronLeft />
      </button>

      {/* Page numbers */}
      {pageNumbers.map((page, index) =>
        page === '...' ? (
          <span
            key={`ellipsis-${index}`}
            className="flex items-center justify-center w-8 h-8 text-sm text-gray-400"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
            className="flex items-center justify-center w-8 h-8 text-sm transition-colors"
            style={{
              border: '1px solid #E5E5E5',
              backgroundColor: currentPage === page ? '#C8102E' : 'white',
              color: currentPage === page ? 'white' : '#1a1a1a',
              cursor: 'pointer',
              fontWeight: currentPage === page ? '600' : '400',
            }}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="flex items-center justify-center w-8 h-8 transition-colors"
        style={{
          border: '1px solid #E5E5E5',
          backgroundColor: currentPage === totalPages ? '#F7F7F7' : 'white',
          color: currentPage === totalPages ? '#ccc' : '#1a1a1a',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
        }}
      >
        <ChevronRight />
      </button>
    </nav>
  )
}
