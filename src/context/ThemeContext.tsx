'use client'

import React, { createContext, useContext, useEffect, useSyncExternalStore } from 'react'

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

const subscribeTheme = (callback: () => void) => {
  window.addEventListener('storage', callback)
  window.addEventListener('forge_theme_change', callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener('forge_theme_change', callback)
  }
}

const getThemeSnapshot = (): Theme => {
  try {
    const saved = localStorage.getItem('forge_theme') as Theme
    if (saved && ['dark', 'light'].includes(saved)) return saved
  } catch {}
  return 'dark'
}
const getServerThemeSnapshot = (): Theme => 'dark'

const getContrastSnapshot = (): boolean => {
  try {
    return localStorage.getItem('forge_high_contrast') === 'true'
  } catch {}
  return false
}
const getServerContrastSnapshot = (): boolean => false

const getDensitySnapshot = (): UiDensity => {
  try {
    const saved = localStorage.getItem('forge_ui_density') as UiDensity
    if (saved && ['comfortable', 'compact'].includes(saved)) return saved
  } catch {}
  return 'comfortable'
}
const getServerDensitySnapshot = (): UiDensity => 'comfortable'

const getAccentSnapshot = (): AccentColor => {
  try {
    const saved = localStorage.getItem('forge_accent_color') as AccentColor
    if (saved && ['blue', 'emerald', 'amber', 'violet'].includes(saved)) return saved
  } catch {}
  return 'blue'
}
const getServerAccentSnapshot = (): AccentColor => 'blue'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot)
  const highContrast = useSyncExternalStore(subscribeTheme, getContrastSnapshot, getServerContrastSnapshot)
  const uiDensity = useSyncExternalStore(subscribeTheme, getDensitySnapshot, getServerDensitySnapshot)
  const accentColor = useSyncExternalStore(subscribeTheme, getAccentSnapshot, getServerAccentSnapshot)

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem('forge_theme', newTheme)
      window.dispatchEvent(new Event('forge_theme_change'))
    } catch {}
  }

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
  }

  const setHighContrast = (val: boolean) => {
    try {
      localStorage.setItem('forge_high_contrast', String(val))
      window.dispatchEvent(new Event('forge_theme_change'))
    } catch {}
  }

  const setUiDensity = (val: UiDensity) => {
    try {
      localStorage.setItem('forge_ui_density', val)
      window.dispatchEvent(new Event('forge_theme_change'))
    } catch {}
  }

  const setAccentColor = (val: AccentColor) => {
    try {
      localStorage.setItem('forge_accent_color', val)
      window.dispatchEvent(new Event('forge_theme_change'))
    } catch {}
  }

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('light-mode')
      root.classList.remove('dark-mode')
    } else {
      root.classList.add('dark-mode')
      root.classList.remove('light-mode')
    }

    if (highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    if (uiDensity === 'compact') {
      root.classList.add('density-compact')
    } else {
      root.classList.remove('density-compact')
    }

    const accents: AccentColor[] = ['blue', 'emerald', 'amber', 'violet']
    accents.forEach((a) => root.classList.remove(`accent-${a}`))
    root.classList.add(`accent-${accentColor}`)
  }, [theme, highContrast, uiDensity, accentColor])

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
