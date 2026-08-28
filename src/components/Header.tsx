'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  Bell,
  Calendar,
  Download,
  Plus,
  ShieldCheck,
  Menu,
  Package,
  LayoutDashboard,
  CheckCircle2,
  RefreshCw,
  X
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { exportFactoryInventoryCsv } from '@/utils/exportUtils'
import { fetchLiveNotifications } from '@/services/notificationService'
import { getProductsApi, Product } from '@/services/api'

interface HeaderProps {
  onOpenAddProduct: () => void
  onOpenRecordProduction: (productId?: number) => void
  onOpenStockOut: () => void
  onOpenNotifications?: () => void
  onNavigateTab?: (tab: string) => void
  setIsMobileOpen?: (open: boolean) => void
}

interface SearchResultItem {
  id: string
  title: string
  subtitle: string
  category: 'module' | 'product' | 'action'
  action: () => void
}

export default function Header({
  onOpenAddProduct,
  onOpenRecordProduction,
  onOpenStockOut,
  onOpenNotifications,
  onNavigateTab,
  setIsMobileOpen
}: HeaderProps) {
  const { t, formatDate, formatNumber } = useLanguage()
  const currentDate = formatDate(new Date())

  // Export State
  const [exportLoading, setExportLoading] = useState(false)
  const [exportToast, setExportToast] = useState<string | null>(null)

  // Notification Live Counter
  const [unreadNotifCount, setUnreadNotifCount] = useState(0)

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [productsList, setProductsList] = useState<Product[]>([])
  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ignore = false
    const loadInitialData = async () => {
      try {
        const notifs = await fetchLiveNotifications()
        if (!ignore) {
          const unread = notifs.filter((n) => !n.read).length
          setUnreadNotifCount(unread)
        }
      } catch (err) {
        console.error('Failed to load notif count in header:', err)
      }

      try {
        const prods = await getProductsApi()
        if (!ignore) {
          setProductsList(prods)
        }
      } catch (err) {
        console.error('Failed to load products for global search:', err)
      }
    }

    loadInitialData()

    // Listen for rules change or notification updates
    const handleRulesChange = () => {
      loadInitialData()
    }
    window.addEventListener('forge_notif_rules_change', handleRulesChange)
    window.addEventListener('forge_notifications_updated', handleRulesChange)

    return () => {
      ignore = true
      window.removeEventListener('forge_notif_rules_change', handleRulesChange)
      window.removeEventListener('forge_notifications_updated', handleRulesChange)
    }
  }, [])

  // Close search popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleExport = async () => {
    setExportLoading(true)
    setExportToast(null)
    try {
      const res = await exportFactoryInventoryCsv()
      setExportToast(`Berhasil mengunduh ${res.filename} (${res.rowCount} baris data)`)
      setTimeout(() => setExportToast(null), 4000)
    } catch (err) {
      console.error('Export failed:', err)
      setExportToast('Gagal mengekspor data.')
      setTimeout(() => setExportToast(null), 3000)
    } finally {
      setExportLoading(false)
    }
  }

  // Filter global search items
  const queryLower = searchQuery.trim().toLowerCase()
  const searchResults: SearchResultItem[] = []

  if (queryLower.length > 0) {
    // 1. Module shortcuts
    const moduleList = [
      { id: 'dashboard', title: t('dashboard'), sub: 'Ringkasan KPI lantai pabrik', tab: 'dashboard' },
      { id: 'products', title: t('products'), sub: 'Katalog SKU & master produk', tab: 'products' },
      { id: 'production-logs', title: t('production_logs'), sub: 'Riwayat pencatatan batch produksi', tab: 'production-logs' },
      { id: 'inventory', title: t('inventory'), sub: 'Status stok & kartu mutasi inventaris', tab: 'inventory' },
      { id: 'reports', title: t('reports'), sub: 'Analisis yield, OEE & visualisasi data', tab: 'reports' },
      { id: 'users', title: t('users'), sub: 'Akses operator & manajemen otorisasi', tab: 'users' },
      { id: 'settings', title: t('settings'), sub: 'Konfigurasi platform & keamanan 2FA', tab: 'settings' },
      { id: 'help', title: t('help_faq'), sub: 'Panduan operasional pabrik & dokumentasi', tab: 'help' },
    ]

    moduleList.forEach((m) => {
      if (m.title.toLowerCase().includes(queryLower) || m.sub.toLowerCase().includes(queryLower)) {
        searchResults.push({
          id: `mod-${m.id}`,
          title: m.title,
          subtitle: m.sub,
          category: 'module',
          action: () => {
            if (onNavigateTab) onNavigateTab(m.tab)
            setIsSearchOpen(false)
            setSearchQuery('')
          }
        })
      }
    })

    // 2. Action Shortcuts
    if ('tambah produk add product baru'.includes(queryLower)) {
      searchResults.push({
        id: 'act-add-prod',
        title: '+ ' + t('add_new_product'),
        subtitle: 'Buka formulir pendaftaran master SKU baru',
        category: 'action',
        action: () => {
          onOpenAddProduct()
          setIsSearchOpen(false)
          setSearchQuery('')
        }
      })
    }

    if ('catat produksi record manufacturing'.includes(queryLower)) {
      searchResults.push({
        id: 'act-rec-prod',
        title: '⚡ ' + t('record_production'),
        subtitle: 'Input jumlah batch output produksi terkini',
        category: 'action',
        action: () => {
          onOpenRecordProduction()
          setIsSearchOpen(false)
          setSearchQuery('')
        }
      })
    }

    if ('stok keluar pengeluaran barang stock out'.includes(queryLower)) {
      searchResults.push({
        id: 'act-stock-out',
        title: '📦 ' + t('record_stock_out'),
        subtitle: 'Catat mutasi pengeluaran barang dari gudang',
        category: 'action',
        action: () => {
          onOpenStockOut()
          setIsSearchOpen(false)
          setSearchQuery('')
        }
      })
    }

    // 3. Products
    productsList.forEach((p) => {
      if (
        p.ProductName.toLowerCase().includes(queryLower) ||
        String(p.ProductID).includes(queryLower) ||
        (p.Unit && p.Unit.toLowerCase().includes(queryLower))
      ) {
        searchResults.push({
          id: `prod-${p.ProductID}`,
          title: p.ProductName,
          subtitle: `SKU #${p.ProductID} • Stok: ${p.CurrentStock ?? 0} ${p.Unit || 'pcs'} (Min: ${p.MinStock})`,
          category: 'product',
          action: () => {
            if (onNavigateTab) onNavigateTab('products')
            setIsSearchOpen(false)
            setSearchQuery('')
          }
        })
      }
    })
  }

  return (
    <header className="bg-[#0B0F17]/80 backdrop-blur-md sticky top-0 z-30 border-b border-[#1E293B] px-6 py-3 flex flex-wrap items-center justify-between gap-3">
      {/* Search Bar with Global Live Search Popover */}
      <div ref={searchContainerRef} className="relative flex items-center gap-3 flex-1 max-w-md">
        {/* Mobile Menu Toggle */}
        {setIsMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden p-2 rounded-xl bg-[#162032] border border-[#1E293B] text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Search Input Container */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setIsSearchOpen(true)
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder={t('search_placeholder')}
            className="w-full bg-[#162032] text-sm text-slate-200 placeholder-slate-400 rounded-xl pl-10 pr-9 py-2 border border-[#1E293B] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('')
                setIsSearchOpen(false)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Floating Live Search Dropdown */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 top-full mt-2 w-full max-h-80 overflow-y-auto bg-[#162032] border border-[#1E293B] rounded-2xl shadow-2xl p-2 z-50 animate-fade-in divide-y divide-[#1E293B]/50">
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  Tidak ditemukan hasil untuk &quot;{searchQuery}&quot;
                </div>
              ) : (
                searchResults.slice(0, 10).map((item) => (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-[#1E2D47] transition-all flex items-center justify-between gap-3 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-lg bg-[#0F172A] border border-[#1E293B] text-blue-400 group-hover:border-blue-500/40">
                        {item.category === 'module' ? (
                          <LayoutDashboard className="w-3.5 h-3.5" />
                        ) : item.category === 'action' ? (
                          <Plus className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Package className="w-3.5 h-3.5 text-purple-400" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 bg-[#0F172A] px-2 py-0.5 rounded border border-[#1E293B]">
                      {item.category}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-2">
        {/* Export Toast notification */}
        {exportToast && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl animate-fade-in shadow-lg">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{exportToast}</span>
          </div>
        )}

        {/* Calendar Badge */}
        <div className="hidden md:flex items-center gap-2 bg-[#162032] border border-[#1E293B] text-slate-300 text-xs px-3 py-2 rounded-xl">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span suppressHydrationWarning>{currentDate}</span>
        </div>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative bg-[#162032] hover:bg-[#1E2D47] border border-[#1E293B] p-2 rounded-xl text-slate-300 transition-colors cursor-pointer"
          title="Open Notification Center"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-600 !text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-[#0B0F17] shadow-sm">
              {formatNumber(unreadNotifCount)}
            </span>
          )}
        </button>

        <div className="h-6 w-[1px] bg-[#1E293B] mx-1 hidden sm:block"></div>

        {/* Real Export Button */}
        <button
          onClick={handleExport}
          disabled={exportLoading}
          className="hidden sm:flex items-center gap-2 bg-[#162032] hover:bg-[#1E2D47] border border-[#1E293B] text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all cursor-pointer disabled:opacity-50"
          title="Unduh Laporan Inventaris (.CSV)"
        >
          {exportLoading ? (
            <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span>{exportLoading ? 'Mengekspor...' : t('export')}</span>
        </button>

        {/* New Entry Primary Action Button */}
        <div className="relative group">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>{t('new_action')}</span>
          </button>

          {/* Quick Dropdown on Hover */}
          <div className="absolute right-0 mt-2 w-52 bg-[#162032] border border-[#1E293B] rounded-xl shadow-2xl p-1.5 hidden group-hover:block transition-all z-50">
            <button
              onClick={onOpenAddProduct}
              className="w-full text-left px-3 py-2.5 text-xs text-slate-200 hover:bg-[#1E2D47] rounded-lg transition-colors cursor-pointer"
            >
              {t('add_new_product')}
            </button>
            <button
              onClick={() => onOpenRecordProduction()}
              className="w-full text-left px-3 py-2.5 text-xs text-slate-200 hover:bg-[#1E2D47] rounded-lg transition-colors cursor-pointer"
            >
              {t('record_production')}
            </button>
            <button
              onClick={onOpenStockOut}
              className="w-full text-left px-3 py-2.5 text-xs text-slate-200 hover:bg-[#1E2D47] rounded-lg transition-colors cursor-pointer"
            >
              {t('record_stock_out')}
            </button>
          </div>
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 ml-1 pl-2 border-l border-[#1E293B]">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm uppercase">
            BR
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">Bintang R</p>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium mt-0.5">
              <ShieldCheck className="w-2.5 h-2.5 text-slate-400" />
              <span>{t('admin')}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
