'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import SummaryCards from '@/components/SummaryCards'
import ProductionAnalyticsChart from '@/components/ProductionAnalyticsChart'
import QuickActions from '@/components/QuickActions'
import SystemStatusCard from '@/components/SystemStatusCard'
import LowStockAlertsTable, { LowStockAlertItem } from '@/components/LowStockAlertsTable'
import ProductsModule from '@/components/ProductsModule'
import InventoryModule from '@/components/InventoryModule'
import ProductionLogsModule from '@/components/ProductionLogsModule'
import UsersModule from '@/components/UsersModule'
import ReportsModule from '@/components/ReportsModule'
import AddProductModal from '@/components/Modals/AddProductModal'
import RecordProductionModal from '@/components/Modals/RecordProductionModal'
import StockOutModal from '@/components/Modals/StockOutModal'
import { Sparkles, RefreshCw } from 'lucide-react'

interface DashboardSummaryData {
  total_products: number
  total_production_today: number
  low_stock_alerts: LowStockAlertItem[]
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [summaryData, setSummaryData] = useState<DashboardSummaryData | null>(null)
  const [loadingSummary, setLoadingSummary] = useState(true)

  // Modals state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isRecordProductionOpen, setIsRecordProductionOpen] = useState(false)
  const [isStockOutOpen, setIsStockOutOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined)

  const fetchDashboardSummary = async () => {
    setLoadingSummary(true)
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6060'
      const res = await fetch(`${apiBase}/api/dashboard/summary`, {
        cache: 'no-store'
      })
      if (res.ok) {
        const data = await res.json()
        setSummaryData(data)
      }
    } catch (err) {
      console.error('Failed to fetch dashboard summary from backend:', err)
    } finally {
      setLoadingSummary(false)
    }
  }

  useEffect(() => {
    fetchDashboardSummary()
  }, [])

  const handleOpenProduce = (productId?: number) => {
    setSelectedProductId(productId)
    setIsRecordProductionOpen(true)
  }

  return (
    <div className="flex min-h-screen bg-[#0B0F17] text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          onOpenAddProduct={() => setIsAddProductOpen(true)}
          onOpenRecordProduction={() => handleOpenProduce()}
          onOpenStockOut={() => setIsStockOutOpen(true)}
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
                      Executive Dashboard
                    </h1>
                    <span className="text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Smart Control
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Real-time overview of global manufacturing operations & inventory.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchDashboardSummary}
                    className="flex items-center gap-1.5 bg-[#162032] hover:bg-[#1E2D47] text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl border border-[#1E293B] transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingSummary ? 'animate-spin' : ''}`} />
                    <span>Sync Live Data</span>
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

                  {/* System Infrastructure Status */}
                  <SystemStatusCard />
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
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center my-12">
              <h2 className="text-xl font-bold text-white mb-2 capitalize">
                {activeTab.replace('-', ' ')} Module
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Detailed view for {activeTab} is currently active and fully integrated.
              </p>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all"
              >
                Back to Executive Dashboard
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
    </div>
  )
}
