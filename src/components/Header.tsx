'use client'

import React from 'react'
import { Search, Bell, Calendar, Download, Plus, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import LanguageDropdown from '@/components/LanguageDropdown'

interface HeaderProps {
  onOpenAddProduct: () => void
  onOpenRecordProduction: () => void
  onOpenStockOut: () => void
  onOpenNotifications?: () => void
}

export default function Header({
  onOpenAddProduct,
  onOpenRecordProduction,
  onOpenStockOut,
  onOpenNotifications
}: HeaderProps) {
  const { t } = useLanguage()

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <header className="bg-[#0B0F17]/80 backdrop-blur-md sticky top-0 z-20 border-b border-[#1E293B] px-6 py-3 flex flex-wrap items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder={t('search_placeholder')}
          className="w-full bg-[#162032] text-sm text-slate-200 placeholder-slate-400 rounded-xl pl-10 pr-4 py-2 border border-[#1E293B] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-2">
        {/* Calendar Badge */}
        <div className="hidden md:flex items-center gap-2 bg-[#162032] border border-[#1E293B] text-slate-300 text-xs px-3 py-2 rounded-xl">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>{currentDate}</span>
        </div>

        {/* Language Dropdown */}
        <LanguageDropdown />

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative bg-[#162032] hover:bg-[#1E2D47] border border-[#1E293B] p-2 rounded-xl text-slate-300 transition-colors"
          title="Open Notification Center"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
        </button>

        <div className="h-6 w-[1px] bg-[#1E293B] mx-1 hidden sm:block"></div>

        {/* Export Button */}
        <button
          onClick={() => alert('Exporting summary report...')}
          className="hidden sm:flex items-center gap-2 bg-[#162032] hover:bg-[#1E2D47] border border-[#1E293B] text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>{t('export')}</span>
        </button>

        {/* New Entry Primary Action Button */}
        <div className="relative group">
          <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20 transition-all">
            <Plus className="w-4 h-4" />
            <span>{t('new_action')}</span>
          </button>

          {/* Quick Dropdown on Hover */}
          <div className="absolute right-0 mt-2 w-52 bg-[#162032] border border-[#1E293B] rounded-xl shadow-2xl p-1.5 hidden group-hover:block transition-all z-50">
            <button
              onClick={onOpenAddProduct}
              className="w-full text-left px-3 py-2.5 text-xs text-slate-200 hover:bg-[#1E2D47] rounded-lg transition-colors"
            >
              {t('add_new_product')}
            </button>
            <button
              onClick={onOpenRecordProduction}
              className="w-full text-left px-3 py-2.5 text-xs text-slate-200 hover:bg-[#1E2D47] rounded-lg transition-colors"
            >
              {t('record_production')}
            </button>
            <button
              onClick={onOpenStockOut}
              className="w-full text-left px-3 py-2.5 text-xs text-slate-200 hover:bg-[#1E2D47] rounded-lg transition-colors"
            >
              {t('record_stock_out')}
            </button>
          </div>
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 ml-1 pl-2 border-l border-[#1E293B]">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
            BR
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">Bintang R.</p>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
              <ShieldCheck className="w-2.5 h-2.5" />
              <span>Admin</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
