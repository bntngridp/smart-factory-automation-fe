'use client'

import React from 'react'
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Boxes,
  FileBarChart,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Factory
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onOpenLogout?: () => void
}

export default function Sidebar({ activeTab, setActiveTab, onOpenLogout }: SidebarProps) {
  const { t } = useLanguage()

  const menuItems = [
    { id: 'dashboard', translationKey: 'dashboard', icon: LayoutDashboard },
    { id: 'products', translationKey: 'products', icon: Package },
    { id: 'production-logs', translationKey: 'production_logs', icon: ClipboardList },
    { id: 'inventory', translationKey: 'inventory', icon: Boxes },
    { id: 'reports', translationKey: 'reports', icon: FileBarChart },
    { id: 'users', translationKey: 'users', icon: Users },
  ]

  return (
    <aside className="w-64 bg-[#0F172A] border-r border-[#1E293B] flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-[#1E293B]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Factory className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-wide text-lg leading-tight">Forge</h1>
          <p className="text-[11px] text-slate-400 font-medium">Enterprise Automation</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Main Menu
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#1E2D47] text-emerald-400 border-l-4 border-emerald-500 shadow-md shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#162032]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{t(item.translationKey)}</span>
            </button>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-[#1E293B] space-y-1">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-[#1E2D47] text-emerald-400 border-l-4 border-emerald-500'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#162032]'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>{t('settings')}</span>
        </button>
        <button
          onClick={() => setActiveTab('help')}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-[#162032] transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>{t('help')}</span>
        </button>
        <button
          onClick={onOpenLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors mt-2"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  )
}
