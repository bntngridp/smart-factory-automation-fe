'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import SummaryCards from '@/components/SummaryCards'
import ProductionAnalyticsChart from '@/components/ProductionAnalyticsChart'
import QuickActions from '@/components/QuickActions'
import ShiftProductionGoalCard from '@/components/ShiftProductionGoalCard'
import LowStockAlertsTable from '@/components/LowStockAlertsTable'
import ProductsModule from '@/components/ProductsModule'
import InventoryModule from '@/components/InventoryModule'
import ProductionLogsModule from '@/components/ProductionLogsModule'
import UsersModule from '@/components/UsersModule'
import ReportsModule from '@/components/ReportsModule'
import SettingsModule from '@/components/SettingsModule'
import HelpModule from '@/components/HelpModule'
import AddProductModal from '@/components/Modals/AddProductModal'
import RecordProductionModal from '@/components/Modals/RecordProductionModal'
import StockOutModal from '@/components/Modals/StockOutModal'
import NotificationsModal from '@/components/Modals/NotificationsModal'
import LogoutModal from '@/components/Modals/LogoutModal'
import { Sparkles, RefreshCw } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { getDashboardSummaryApi, DashboardSummary } from '@/services/api'

export default function Home() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [summaryData, setSummaryData] = useState<DashboardSummary | null>(null)
  const [loadingSummary, setLoadingSummary] = useState(true)

  // Sidebar responsive & collapse state
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Modals state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isRecordProductionOpen, setIsRecordProductionOpen] = useState(false)
  const [isStockOutOpen, setIsStockOutOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined)

  const fetchDashboardSummary = async () => {
    setLoadingSummary(true)
    try {
      const data = await getDashboardSummaryApi()
      setSummaryData(data)
    } catch (err) {
      console.error('Failed to fetch dashboard summary from backend:', err)
    } finally {
      setLoadingSummary(false)
    }
  }

  useEffect(() => {
    let ignore = false
    const load = async () => {
      try {
        const data = await getDashboardSummaryApi()
        if (!ignore) {
          setSummaryData(data)
          setLoadingSummary(false)
        }
      } catch (err) {
        console.error('Failed to fetch dashboard summary from backend:', err)
        if (!ignore) setLoadingSummary(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [])

  const handleOpenProduce = (productId?: number) => {
    setSelectedProductId(productId)
    setIsRecordProductionOpen(true)
  }

  return (
    <div className="flex min-h-screen bg-[#0B0F17] text-slate-100 font-sans">
      {/* Responsive Collapsible Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogout={() => setIsLogoutOpen(true)}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Top Header */}
        <Header
          onOpenAddProduct={() => setIsAddProductOpen(true)}
          onOpenRecordProduction={() => handleOpenProduce()}
          onOpenStockOut={() => setIsStockOutOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onNavigateTab={setActiveTab}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Dashboard Body Content */}
        <main className="flex-1 px-6 py-6 overflow-y-auto">
          {activeTab === 'dashboard' ? (
            <div>
              {/* Page Title Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">
                      {t('executive_dashboard')}
                    </h1>
                    <span className="text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {t('smart_control')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {t('realtime_overview')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchDashboardSummary}
                    className="flex items-center gap-1.5 bg-[#162032] hover:bg-[#1E2D47] text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl border border-[#1E293B] transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingSummary ? 'animate-spin' : ''}`} />
                    <span>{t('refresh')}</span>
                  </button>
                </div>
              </div>

              {/* 5 KPI Summary Cards Row */}
              <SummaryCards
                data={
                  summaryData
                    ? {
                        total_products: summaryData.total_products,
                        total_production_today: summaryData.total_production_today,
                        low_stock_alerts_count: summaryData.low_stock_alerts.length
                      }
                    : undefined
                }
                loading={loadingSummary}
              />

              {/* Main Dashboard Two-Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (2 Cols wide on desktop) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Production Analytics Area Chart */}
                  <ProductionAnalyticsChart />

                  {/* Low Stock Alerts Table */}
                  <LowStockAlertsTable
                    alerts={summaryData?.low_stock_alerts}
                    loading={loadingSummary}
                    onRecordProduction={handleOpenProduce}
                    onViewAll={() => setActiveTab('products')}
                  />
                </div>

                {/* Right Column (1 Col wide) */}
                <div className="space-y-6">
                  {/* Quick Actions Card */}
                  <QuickActions
                    onOpenAddProduct={() => setIsAddProductOpen(true)}
                    onOpenRecordProduction={() => handleOpenProduce()}
                    onOpenStockOut={() => setIsStockOutOpen(true)}
                  />

                  {/* Daily Shift Target & Progress Goal */}
                  <ShiftProductionGoalCard
                    todayOutput={summaryData?.total_production_today ?? 0}
                    onRecordProduction={() => handleOpenProduce()}
                  />
                </div>
              </div>
            </div>
          ) : activeTab === 'products' ? (
            <ProductsModule
              onOpenAddProduct={() => setIsAddProductOpen(true)}
              onOpenRecordProduction={handleOpenProduce}
            />
          ) : activeTab === 'inventory' ? (
            <InventoryModule
              onOpenStockOut={() => setIsStockOutOpen(true)}
              onOpenRecordProduction={handleOpenProduce}
            />
          ) : activeTab === 'production-logs' ? (
            <ProductionLogsModule
              onOpenRecordProduction={() => handleOpenProduce()}
            />
          ) : activeTab === 'users' ? (
            <UsersModule />
          ) : activeTab === 'reports' ? (
            <ReportsModule />
          ) : activeTab === 'settings' ? (
            <SettingsModule />
          ) : activeTab === 'help' ? (
            <HelpModule onBackToDashboard={() => setActiveTab('dashboard')} />
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center my-12">
              <h2 className="text-xl font-bold text-white mb-2 capitalize">
                {activeTab.replace('-', ' ')}
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                {t('realtime_overview')}
              </p>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all"
              >
                {t('back_to_dashboard')}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Interactive Action Modals */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSuccess={fetchDashboardSummary}
      />

      <RecordProductionModal
        isOpen={isRecordProductionOpen}
        preselectedProductId={selectedProductId}
        onClose={() => setIsRecordProductionOpen(false)}
        onSuccess={fetchDashboardSummary}
      />

      <StockOutModal
        isOpen={isStockOutOpen}
        onClose={() => setIsStockOutOpen(false)}
        onSuccess={fetchDashboardSummary}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onOpenProduce={handleOpenProduce}
      />

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
      />
    </div>
  )
}
