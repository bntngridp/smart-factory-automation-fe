'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { useLanguage, Language } from '@/context/LanguageContext'

const languages: { code: Language; label: string; flag: string; dir: string }[] = [
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr' },
  { code: 'en', label: 'English (US)', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'es', label: 'Español', flag: '🇪🇸', dir: 'ltr' },
]

export default function LanguageDropdown() {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = languages.find((l) => l.code === language) || languages[0]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 bg-[#162032] hover:bg-[#1E2D47] border border-[#1E293B] text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
      >
        <Globe className="w-3.5 h-3.5 text-slate-400" />
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-[#162032] border border-[#1E293B] rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code)
                setOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold transition-all text-left ${
                language === lang.code
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-slate-300 hover:bg-[#1E2D47] hover:text-white'
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span className="flex-1">{lang.label}</span>
              {language === lang.code && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
