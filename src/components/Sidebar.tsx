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
  Factory,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onOpenLogout?: () => void
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onOpenLogout,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}: SidebarProps) {
  const { t } = useLanguage()

  const menuItems = [
    { id: 'dashboard', translationKey: 'dashboard', icon: LayoutDashboard },
    { id: 'products', translationKey: 'products', icon: Package },
    { id: 'production-logs', translationKey: 'production_logs', icon: ClipboardList },
    { id: 'inventory', translationKey: 'inventory', icon: Boxes },
    { id: 'reports', translationKey: 'reports', icon: FileBarChart },
    { id: 'users', translationKey: 'users', icon: Users },
  ]

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId)
    setIsMobileOpen(false) // Close mobile drawer when selecting tab
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          bg-[#0F172A] border-r border-[#1E293B] flex flex-col h-screen sticky top-0 z-40 select-none
          transition-all duration-300 ease-in-out
          fixed md:sticky
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#1E293B]">
          {/* Logo & Brand Text */}
          <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'w-full justify-center' : ''}`}>
            <div className="w-10 h-10 min-w-[40px] rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <Factory className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <h1 className="font-bold text-white tracking-wide text-lg leading-tight">Forge</h1>
                <p className="text-[11px] text-slate-400 font-medium">{t('enterprise_automation')}</p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle — only visible when expanded */}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="hidden md:flex items-center justify-center w-8 h-8 shrink-0 rounded-lg text-slate-400 hover:text-white hover:bg-[#162032] border border-transparent hover:border-[#1E293B] transition-colors"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Close Button */}
          {!isCollapsed && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="flex md:hidden items-center justify-center w-8 h-8 shrink-0 rounded-lg text-slate-400 hover:text-white hover:bg-[#162032] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Collapsed Expand Button — dedicated row below logo when collapsed */}
        {isCollapsed && (
          <div className="px-3 pt-3 hidden md:block">
            <button
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="w-full flex items-center justify-center p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#162032] border border-[#1E293B] transition-colors"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              {t('main_menu')}
            </div>
          )}
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                title={isCollapsed ? t(item.translationKey) : undefined}
                className={`w-full flex items-center gap-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5'
                } ${
                  isActive
                    ? 'bg-[#1E2D47] text-emerald-400 border-l-4 border-emerald-500 shadow-md shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#162032]'
                }`}
              >
                <Icon className={`w-4 h-4 min-w-[16px] ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate">{t(item.translationKey)}</span>}
              </button>
            )
          })}
        </nav>

        {/* Bottom Actions & Logout */}
        <div className="p-3 border-t border-[#1E293B] space-y-1.5">
          <button
            onClick={() => handleSelectTab('settings')}
            title={isCollapsed ? t('settings') : undefined}
            className={`w-full flex items-center gap-3.5 rounded-xl text-sm font-medium transition-colors ${
              isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5'
            } ${
              activeTab === 'settings'
                ? 'bg-[#1E2D47] text-emerald-400 border-l-4 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#162032]'
            }`}
          >
            <Settings className="w-4 h-4 min-w-[16px] text-slate-400" />
            {!isCollapsed && <span className="truncate">{t('settings')}</span>}
          </button>

          <button
            onClick={() => handleSelectTab('help')}
            title={isCollapsed ? t('help') : undefined}
            className={`w-full flex items-center gap-3.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-[#162032] transition-colors ${
              isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5'
            }`}
          >
            <HelpCircle className="w-4 h-4 min-w-[16px] text-slate-400" />
            {!isCollapsed && <span className="truncate">{t('help')}</span>}
          </button>

          {/* Clean Logout Button */}
          <button
            onClick={() => {
              setIsMobileOpen(false)
              if (onOpenLogout) onOpenLogout()
            }}
            title={isCollapsed ? t('logout') : undefined}
            className={`w-full flex items-center gap-3.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors ${
              isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5'
            }`}
          >
            <LogOut className="w-4 h-4 min-w-[16px] text-rose-400" />
            {!isCollapsed && <span className="truncate">{t('logout')}</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
