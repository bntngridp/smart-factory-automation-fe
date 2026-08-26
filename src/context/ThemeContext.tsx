'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Theme = 'dark' | 'light'
export type UiDensity = 'comfortable' | 'compact'
export type AccentColor = 'blue' | 'emerald' | 'amber' | 'violet'

export interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  highContrast: boolean
  setHighContrast: (highContrast: boolean) => void
  uiDensity: UiDensity
  setUiDensity: (density: UiDensity) => void
  accentColor: AccentColor
  setAccentColor: (accent: AccentColor) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark'
    try {
      const saved = localStorage.getItem('forge_theme') as Theme
      if (saved && ['dark', 'light'].includes(saved)) return saved
    } catch {}
    return 'dark'
  })

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    try {
      return localStorage.getItem('forge_high_contrast') === 'true'
    } catch {}
    return false
  })

  const [uiDensity, setUiDensityState] = useState<UiDensity>(() => {
    if (typeof window === 'undefined') return 'comfortable'
    try {
      const saved = localStorage.getItem('forge_ui_density') as UiDensity
      if (saved && ['comfortable', 'compact'].includes(saved)) return saved
    } catch {}
    return 'comfortable'
  })

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    if (typeof window === 'undefined') return 'blue'
    try {
      const saved = localStorage.getItem('forge_accent_color') as AccentColor
      if (saved && ['blue', 'emerald', 'amber', 'violet'].includes(saved)) return saved
    } catch {}
    return 'blue'
  })

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedTheme = localStorage.getItem('forge_theme') as Theme
        if (savedTheme && ['dark', 'light'].includes(savedTheme)) setThemeState(savedTheme)

        const savedContrast = localStorage.getItem('forge_high_contrast')
        if (savedContrast !== null) setHighContrastState(savedContrast === 'true')

        const savedDensity = localStorage.getItem('forge_ui_density') as UiDensity
        if (savedDensity && ['comfortable', 'compact'].includes(savedDensity)) setUiDensityState(savedDensity)

        const savedAccent = localStorage.getItem('forge_accent_color') as AccentColor
        if (savedAccent && ['blue', 'emerald', 'amber', 'violet'].includes(savedAccent)) setAccentColorState(savedAccent)
      } catch {}
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('forge_theme_change', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('forge_theme_change', handleStorageChange)
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('forge_theme', newTheme)
        window.dispatchEvent(new Event('forge_theme_change'))
      } catch {}
    }
  }

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
  }

  const setHighContrast = (val: boolean) => {
    setHighContrastState(val)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('forge_high_contrast', String(val))
        window.dispatchEvent(new Event('forge_theme_change'))
      } catch {}
    }
  }

  const setUiDensity = (val: UiDensity) => {
    setUiDensityState(val)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('forge_ui_density', val)
        window.dispatchEvent(new Event('forge_theme_change'))
      } catch {}
    }
  }

  const setAccentColor = (val: AccentColor) => {
    setAccentColorState(val)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('forge_accent_color', val)
        window.dispatchEvent(new Event('forge_theme_change'))
      } catch {}
    }
  }

  const rootClassNames = [
    theme === 'light' ? 'light-mode' : 'dark-mode',
    highContrast ? 'high-contrast' : '',
    uiDensity === 'compact' ? 'density-compact' : '',
    `accent-${accentColor}`
  ].filter(Boolean).join(' ')

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        highContrast,
        setHighContrast,
        uiDensity,
        setUiDensity,
        accentColor,
        setAccentColor
      }}
    >
      <div className={rootClassNames}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
