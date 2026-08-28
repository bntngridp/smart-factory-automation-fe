import React from 'react'

interface MicrosoftLogoProps {
  className?: string
  size?: number
}

/**
 * Official Microsoft HD Vector Logo (Transparent Background)
 * Perfect 4-Square Palette: Red (#F25022), Green (#7FBA00), Blue (#00A4EF), Yellow (#FFB900)
 */
export function MicrosoftLogo({ className = '', size = 18 }: MicrosoftLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <rect x="1" y="1" width="9" height="9" fill="#F25022" rx="0.5" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" rx="0.5" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" rx="0.5" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" rx="0.5" />
    </svg>
  )
}
