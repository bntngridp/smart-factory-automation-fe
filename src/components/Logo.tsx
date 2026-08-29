import React from 'react'

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
  textColor?: string
}

export function Logo({
  size = 'md',
  className = '',
  showText = false,
  textColor = 'text-white',
}: LogoProps) {
  // Dimensions for precise squircle geometry
  const sizeConfig = {
    xs: { box: 'w-6 h-6 min-w-[24px]', rounded: 'rounded-lg' },
    sm: { box: 'w-8 h-8 min-w-[32px]', rounded: 'rounded-xl' },
    md: { box: 'w-9 h-9 min-w-[36px]', rounded: 'rounded-[12px]' },
    lg: { box: 'w-12 h-12 min-w-[48px]', rounded: 'rounded-2xl' },
    xl: { box: 'w-16 h-16 min-w-[64px]', rounded: 'rounded-[20px]' },
  }

  const current = sizeConfig[size] || sizeConfig.md

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Matte Dof Solid Plain Squircle Badge (Hitam Doff Polos) */}
      <div
        className={`
          ${current.box} ${current.rounded}
          bg-[#1B2434] border border-[#2D3A50]/70
          shadow-[0_2px_8px_rgba(0,0,0,0.35)]
          transition-transform duration-200 hover:scale-105
          shrink-0 relative overflow-hidden
        `}
      />

      {showText && (
        <div className="truncate">
          <h1 className={`font-bold tracking-wide text-base leading-tight ${textColor}`}>Forge</h1>
          <p className="text-[11px] text-slate-400 font-medium">Enterprise Automation</p>
        </div>
      )}
    </div>
  )
}
