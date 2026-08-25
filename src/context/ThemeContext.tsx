'use client'

import React, { createContext, useContext, useState, useSyncExternalStore } from 'react'

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

const emptySubscribe = () => () => {}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [highContrast, setHighContrastState] = useState<boolean>(false)
  const [uiDensity, setUiDensityState] = useState<UiDensity>('comfortable')
  const [accentColor, setAccentColorState] = useState<AccentColor>('blue')

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const storedTheme = useSyncExternalStore(
    emptySubscribe,
    () => {
      const saved = localStorage.getItem('forge_theme') as Theme
      return saved && ['dark', 'light'].includes(saved) ? saved : null
    },
    () => null
  )

  const storedContrast = useSyncExternalStore(
    emptySubscribe,
    () => localStorage.getItem('forge_high_contrast') === 'true',
    () => false
  )

  const storedDensity = useSyncExternalStore(
    emptySubscribe,
    () => {
      const saved = localStorage.getItem('forge_ui_density') as UiDensity
      return saved && ['comfortable', 'compact'].includes(saved) ? saved : null
    },
    () => null
  )

  const storedAccent = useSyncExternalStore(
    emptySubscribe,
    () => {
      const saved = localStorage.getItem('forge_accent_color') as AccentColor
      return saved && ['blue', 'emerald', 'amber', 'violet'].includes(saved) ? saved : null
    },
    () => null
  )

  const currentTheme = storedTheme || theme
  const currentContrast = storedContrast || highContrast
  const currentDensity = storedDensity || uiDensity
  const currentAccent = storedAccent || accentColor

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem('forge_theme', newTheme)
    }
  }

  const toggleTheme = () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
  }

  const setHighContrast = (val: boolean) => {
    setHighContrastState(val)
    if (typeof window !== 'undefined') {
      localStorage.setItem('forge_high_contrast', String(val))
    }
  }

  const setUiDensity = (val: UiDensity) => {
    setUiDensityState(val)
    if (typeof window !== 'undefined') {
      localStorage.setItem('forge_ui_density', val)
    }
  }

  const setAccentColor = (val: AccentColor) => {
    setAccentColorState(val)
    if (typeof window !== 'undefined') {
      localStorage.setItem('forge_accent_color', val)
    }
  }

  const rootClassNames = [
    mounted && currentTheme === 'light' ? 'light-mode' : 'dark-mode',
    currentContrast ? 'high-contrast' : '',
    currentDensity === 'compact' ? 'density-compact' : '',
    `accent-${currentAccent}`
  ].filter(Boolean).join(' ')

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        setTheme,
        toggleTheme,
        highContrast: currentContrast,
        setHighContrast,
        uiDensity: currentDensity,
        setUiDensity,
        accentColor: currentAccent,
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
