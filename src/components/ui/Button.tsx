import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'red' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    transition: 'all 0.15s',
    border: 'none',
    width: fullWidth ? '100%' : undefined,
  }

  const sizeMap = {
    sm: { fontSize: '11px', padding: '6px 12px' },
    md: { fontSize: '13px', padding: '10px 20px' },
    lg: { fontSize: '14px', padding: '14px 28px' },
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#1B1F3B',
      color: 'white',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#1a1a1a',
      border: '1px solid #1a1a1a',
    },
    red: {
      backgroundColor: '#C8102E',
      color: 'white',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#1a1a1a',
    },
  }

  return (
    <button
      style={{
        ...baseStyles,
        ...sizeMap[size],
        ...variantStyles[variant],
      }}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
}
