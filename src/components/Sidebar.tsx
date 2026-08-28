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
import { Logo } from '@/components/Logo'

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
            <Logo size="md" />
            {!isCollapsed && (
              <div className="truncate">
                <h1 className="font-bold text-white tracking-wide text-base leading-tight">Forge</h1>
                <p className="text-[11px] text-slate-400 font-medium">{t('enterprise_automation')}</p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle — only visible when expanded */}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="hidden md:flex items-center justify-center w-8 h-8 shrink-0 rounded-lg text-slate-400 hover:text-white hover:bg-[#162032] border border-transparent hover:border-[#1E293B] transition-colors cursor-pointer"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Close Button */}
          {!isCollapsed && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="flex md:hidden items-center justify-center w-8 h-8 shrink-0 rounded-lg text-slate-400 hover:text-white hover:bg-[#162032] transition-colors cursor-pointer"
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
              className="w-full flex items-center justify-center p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#162032] border border-[#1E293B] transition-colors cursor-pointer"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {t('main_menu')}
            </div>
          )}
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                title={isCollapsed ? t(item.translationKey) : undefined}
                className={`w-full flex items-center gap-3.5 rounded-xl text-xs font-semibold transition-all duration-150 outline-none select-none cursor-pointer group ${
                  isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5'
                } ${
                  isActive
                    ? 'sidebar-nav-active bg-slate-900 text-white dark:bg-[#162032] dark:text-white border border-slate-900 dark:border-[#1E293B] shadow-sm'
                    : 'sidebar-nav-inactive text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#162032] border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 min-w-[16px] transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  }`}
                />
                {!isCollapsed && <span className="truncate">{t(item.translationKey)}</span>}
              </button>
            )
          })}
        </nav>

        {/* Bottom Actions & Logout */}
        <div className="p-3 border-t border-[#1E293B] space-y-1.5">
          <button
            type="button"
            onClick={() => handleSelectTab('settings')}
            title={isCollapsed ? t('settings') : undefined}
            className={`w-full flex items-center gap-3.5 rounded-xl text-xs font-semibold transition-all duration-150 outline-none select-none cursor-pointer group ${
              isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5'
            } ${
              activeTab === 'settings'
                ? 'sidebar-nav-active bg-slate-900 text-white dark:bg-[#162032] dark:text-white border border-slate-900 dark:border-[#1E293B] shadow-sm'
                : 'sidebar-nav-inactive text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#162032] border border-transparent'
            }`}
          >
            <Settings
              className={`w-4 h-4 min-w-[16px] transition-colors ${
                activeTab === 'settings'
                  ? 'text-white'
                  : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
              }`}
            />
            {!isCollapsed && <span className="truncate">{t('settings')}</span>}
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('help')}
            title={isCollapsed ? t('help') : undefined}
            className={`w-full flex items-center gap-3.5 rounded-xl text-xs font-semibold transition-all duration-150 outline-none select-none cursor-pointer group ${
              isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5'
            } ${
              activeTab === 'help'
                ? 'sidebar-nav-active bg-slate-900 text-white dark:bg-[#162032] dark:text-white border border-slate-900 dark:border-[#1E293B] shadow-sm'
                : 'sidebar-nav-inactive text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#162032] border border-transparent'
            }`}
          >
            <HelpCircle
              className={`w-4 h-4 min-w-[16px] transition-colors ${
                activeTab === 'help'
                  ? 'text-white'
                  : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
              }`}
            />
            {!isCollapsed && <span className="truncate">{t('help')}</span>}
          </button>

          {/* Clean Logout Button */}
          <button
            type="button"
            onClick={() => {
              setIsMobileOpen(false)
              if (onOpenLogout) onOpenLogout()
            }}
            title={isCollapsed ? t('logout') : undefined}
            className={`w-full flex items-center gap-3.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-150 outline-none select-none cursor-pointer group border border-transparent ${
              isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5'
            }`}
          >
            <LogOut className="w-4 h-4 min-w-[16px] text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors" />
            {!isCollapsed && <span className="truncate">{t('logout')}</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
