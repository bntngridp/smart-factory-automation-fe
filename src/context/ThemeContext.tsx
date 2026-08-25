'use client'

import React, { createContext, useContext, useState, useSyncExternalStore } from 'react'

export type Theme = 'dark' | 'light'

export interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const emptySubscribe = () => () => {}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')

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

  const currentTheme = storedTheme || theme

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

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setTheme, toggleTheme }}>
      <div className={mounted && currentTheme === 'light' ? 'light-mode' : 'dark-mode'}>
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
