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
  // Dimensions & font scales for precise squircle geometry
  const sizeConfig = {
    xs: { box: 'w-6 h-6 min-w-[24px]', rounded: 'rounded-lg', fontSize: 'text-xs', fSize: 12 },
    sm: { box: 'w-8 h-8 min-w-[32px]', rounded: 'rounded-xl', fontSize: 'text-sm', fSize: 15 },
    md: { box: 'w-9 h-9 min-w-[36px]', rounded: 'rounded-[12px]', fontSize: 'text-base', fSize: 18 },
    lg: { box: 'w-12 h-12 min-w-[48px]', rounded: 'rounded-2xl', fontSize: 'text-2xl', fSize: 24 },
    xl: { box: 'w-16 h-16 min-w-[64px]', rounded: 'rounded-[20px]', fontSize: 'text-3xl', fSize: 32 },
  }

  const current = sizeConfig[size] || sizeConfig.md

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Matte Dof Badge matching user brand image: #1B2434 matte navy background & #0B0F17 matte black 'F' */}
      <div
        className={`
          ${current.box} ${current.rounded}
          bg-[#1B2434] border border-[#2D3A50]/70
          flex items-center justify-center
          shadow-[0_2px_8px_rgba(0,0,0,0.35)]
          transition-transform duration-200 hover:scale-105
          shrink-0 relative overflow-hidden
        `}
      >
        <span
          className="font-black text-[#0B0F17] leading-none select-none tracking-tighter"
          style={{
            fontSize: `${current.fSize}px`,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif',
            textShadow: '0 0.5px 0.5px rgba(255,255,255,0.04)',
          }}
        >
          F
        </span>
      </div>

      {showText && (
        <div className="truncate">
          <h1 className={`font-bold tracking-wide text-base leading-tight ${textColor}`}>Forge</h1>
          <p className="text-[11px] text-slate-400 font-medium">Enterprise Automation</p>
        </div>
      )}
    </div>
  )
}
