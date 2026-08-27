'use client'

import React, { useState, useEffect } from 'react'
import {
  FileBarChart,
  Download,
  Calendar,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  TrendingUp,
  Check
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { getReportsApi, ReportsAnalyticsData } from '@/services/api'
import { useLanguage } from '@/context/LanguageContext'
import { exportExecutiveReportsCsv } from '@/utils/exportUtils'

export default function ReportsModule() {
  const { t, formatNumber } = useLanguage()
  const [timeframe, setTimeframe] = useState<'30' | '7' | '90'>('30')
  const [data, setData] = useState<ReportsAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  const fetchReports = async () => {
    setLoading(true)
    try {
      const res = await getReportsApi()
      setData(res)
    } catch (err) {
      console.error('Failed to fetch reports analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false
    const load = async () => {
      try {
        const res = await getReportsApi()
        if (!ignore) {
          setData(res)
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to fetch reports analytics:', err)
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [])

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4']

  const monthlyYieldData = data?.monthly_yield || [
    { month: 'Jan', output: 75, target: 85 },
    { month: 'Feb', output: 65, target: 80 },
    { month: 'Mar', output: 85, target: 90 },
    { month: 'Apr', output: 45, target: 60 },
    { month: 'May', output: 82, target: 95 },
    { month: 'Jun', output: 90, target: 100 },
  ]

  const topProductsPieData = (data?.top_products && data.top_products.length > 0
    ? data.top_products
    : [
        { name: 'Bearing SKF 6203', volume: 12450 },
        { name: 'Relay Industri 24V', volume: 8320 },
        { name: 'PLC Mitsubishi FX5U', volume: 4150 },
      ]
  ).map((item, index) => ({
    ...item,
    value: item.volume,
    color: colors[index % colors.length]
  }))

  // Dynamic stock depletion projection based on total inventory
  const totalStockCount = data?.product_stocks?.reduce((acc, p) => acc + p.CurrentStock, 0) || 10000
  const currentBase = Math.max(totalStockCount, 1500)

  const forecastData = [
    { day: `${t('day_prefix')} 1`, stock: currentBase, projected: currentBase },
    { day: `${t('day_prefix')} 5`, stock: Math.round(currentBase * 0.92), projected: Math.round(currentBase * 0.92) },
    { day: `${t('day_prefix')} 10`, stock: Math.round(currentBase * 0.85), projected: Math.round(currentBase * 0.85) },
    { day: t('day_today'), stock: Math.round(currentBase * 0.78), projected: Math.round(currentBase * 0.78) },
    { day: `${t('day_prefix')} 20`, stock: null, projected: Math.round(currentBase * 0.62) },
    { day: `${t('day_prefix')} 25`, stock: null, projected: Math.round(currentBase * 0.48) },
    { day: `${t('day_prefix')} 30`, stock: null, projected: Math.round(currentBase * 0.35) },
  ]

  const handleExportCsv = () => {
    exportExecutiveReportsCsv(data, 'csv')
    showToast('Laporan eksekutif CSV berhasil diunduh.')
  }

  const handleExportExcel = () => {
    exportExecutiveReportsCsv(data, 'excel')
    showToast('Laporan eksekutif Excel (.csv) berhasil diunduh.')
  }

  const handleExportPdf = () => {
    showToast('Menyiapkan tampilan cetak laporan PDF...')
    setTimeout(() => {
      window.print()
    }, 400)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center gap-3 shadow-2xl animate-fade-in">
          <Check className="w-5 h-5 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Export Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {t('reports_title')}
            </h1>
            <span className="text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <FileBarChart className="w-3 h-3" />
              {t('intelligence_center')}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t('reports_subtitle')}
          </p>
        </div>

        {/* Toolbar controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchReports}
            className="flex items-center gap-1.5 bg-[#162032] hover:bg-[#1E2D47] text-slate-300 text-xs font-semibold px-3.5 py-2 rounded-xl border border-[#1E293B] transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{t('sync_data')}</span>
          </button>

          <div className="flex items-center bg-[#162032] border border-[#1E293B] text-slate-300 text-xs px-2.5 py-1.5 rounded-xl gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as '30' | '7' | '90')}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="7" className="bg-[#0F172A]">{t('timeframe_last_7_days')}</option>
              <option value="30" className="bg-[#0F172A]">{t('timeframe_last_30_days')}</option>
              <option value="90" className="bg-[#0F172A]">{t('timeframe_last_90_days')}</option>
            </select>
          </div>

          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 bg-[#162032] hover:bg-[#1E2D47] border border-[#1E293B] text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer"
            title="Export / Print to PDF"
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" />
            <span>{t('export_pdf')}</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 bg-[#162032] hover:bg-[#1E2D47] border border-[#1E293B] text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer"
            title="Export to Excel Spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('export_excel')}</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 bg-[#162032] hover:bg-[#1E2D47] border border-[#1E293B] text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>{t('export_csv')}</span>
          </button>
        </div>
      </div>

      {/* Row 1: Monthly Production Yield Bar Chart & Top Products Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Production Yield (2 Cols wide) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-[#1E293B]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                {t('monthly_yield')}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('monthly_yield_desc')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-xs text-slate-400">{t('live_output')}</span>
            </div>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyYieldData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val: number) => formatNumber(val)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#162032',
                    borderColor: '#1E293B',
                    borderRadius: '12px',
                    color: '#F8FAFC'
                  }}
                  formatter={(val: unknown) => [`${formatNumber(val as number)} ${t('units')}`, t('live_output')]}
                />
                <Bar dataKey="output" radius={[6, 6, 0, 0]} fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Distribution Donut Chart (1 Col wide) */}
        <div className="glass-card rounded-2xl p-5 border border-[#1E293B] flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              {t('top_products_distribution')}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('top_products_desc')}
            </p>
          </div>

          <div className="relative h-[160px] w-full my-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topProductsPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {topProductsPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#162032',
                    borderColor: '#1E293B',
                    borderRadius: '12px',
                    color: '#F8FAFC'
                  }}
                  formatter={(val: unknown) => [formatNumber(val as number), t('quantity')]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-white">{formatNumber(data?.total_logs_count || 10)}</span>
              <span className="text-[10px] text-slate-400 font-medium">{t('production_logs')}</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs pt-2 border-t border-[#1E293B]">
            {topProductsPieData.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-300 font-medium truncate max-w-[140px]">{item.name}</span>
                </div>
                <span className="font-mono text-slate-400 font-bold">{formatNumber(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Machine Performance Heatmap */}
      <div className="glass-card rounded-2xl p-5 border border-[#1E293B]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              {t('machine_performance_heatmap')}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('heatmap_desc')}
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span>{t('heatmap_low')}</span>
            <div className="flex gap-1">
              <span className="w-4 h-3 rounded-sm bg-[#1E2D47]"></span>
              <span className="w-4 h-3 rounded-sm bg-[#047857]"></span>
              <span className="w-4 h-3 rounded-sm bg-[#10B981]"></span>
              <span className="w-4 h-3 rounded-sm bg-[#34D399]"></span>
            </div>
            <span>{t('heatmap_optimal')}</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="space-y-2 text-xs overflow-x-auto">
          <div className="grid grid-cols-7 gap-2 text-slate-500 font-mono text-[10px] pb-1 border-b border-[#1E293B] min-w-[500px]">
            <span></span>
            <span className="text-center">00:00</span>
            <span className="text-center">04:00</span>
            <span className="text-center">08:00</span>
            <span className="text-center">12:00</span>
            <span className="text-center">16:00</span>
            <span className="text-center">20:00</span>
          </div>

          {[
            { id: 'MCH-01', name: 'CNC Milling #1', status: ['bg-[#10B981]', 'bg-[#10B981]', 'bg-[#34D399]', 'bg-[#10B981]', 'bg-[#34D399]', 'bg-[#10B981]'] },
            { id: 'MCH-02', name: 'Hydraulic Press #2', status: ['bg-[#F43F5E]', 'bg-[#047857]', 'bg-[#10B981]', 'bg-[#F59E0B]', 'bg-[#10B981]', 'bg-[#10B981]'] },
            { id: 'MCH-03', name: 'Final Assembly #3', status: ['bg-[#10B981]', 'bg-[#34D399]', 'bg-[#10B981]', 'bg-[#10B981]', 'bg-[#34D399]', 'bg-[#10B981]'] },
            { id: 'MCH-04', name: 'Laser Cutting #4', status: ['bg-[#1E2D47]', 'bg-[#1E2D47]', 'bg-[#1E2D47]', 'bg-[#1E2D47]', 'bg-[#1E2D47]', 'bg-[#1E2D47]'] },
          ].map((mch) => (
            <div key={mch.id} className="grid grid-cols-7 gap-2 items-center min-w-[500px]">
              <div className="flex flex-col">
                <span className="font-mono text-slate-300 font-bold text-[11px]">{mch.id}</span>
                <span className="text-[9px] text-slate-500 truncate">{mch.name}</span>
              </div>
              {mch.status.map((st, i) => (
                <div
                  key={i}
                  className={`h-8 rounded-lg ${st} opacity-85 hover:opacity-100 transition-all border border-[#1E293B] flex items-center justify-center`}
                  title={`${mch.name} - Slot ${i + 1}`}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Inventory Forecast Area Chart */}
      <div className="glass-card rounded-2xl p-5 border border-[#1E293B]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              {t('inventory_forecast')}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('forecast_desc')}
            </p>
          </div>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val: number) => formatNumber(val)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#162032',
                  borderColor: '#1E293B',
                  borderRadius: '12px',
                  color: '#F8FAFC'
                }}
                formatter={(val: unknown) => [formatNumber(val as number), t('stock')]}
              />
              <Area type="monotone" dataKey="stock" stroke="#3B82F6" strokeWidth={3} fill="url(#colorStock)" />
              <Area type="monotone" dataKey="projected" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
