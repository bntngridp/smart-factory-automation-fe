'use client'

import React, { useState, useEffect } from 'react'
import {
  FileBarChart,
  Download,
  Calendar,
  FileSpreadsheet,
  FileText,
  RefreshCw
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

export default function ReportsModule() {
  const [timeframe, setTimeframe] = useState('Last 30 Days')
  const [data, setData] = useState<ReportsAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

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
    fetchReports()
  }, [])

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4']

  const monthlyYieldData = data?.monthly_yield || [
    { month: 'Jan', output: 75 },
    { month: 'Feb', output: 65 },
    { month: 'Mar', output: 85 },
    { month: 'Apr', output: 45 },
    { month: 'May', output: 82 },
    { month: 'Jun', output: 90 },
  ]

  const topProductsPieData = (data?.top_products || [
    { name: 'Alpha Core', volume: 12450 },
    { name: 'Beta Shield', volume: 8320 },
    { name: 'Gamma Valve', volume: 4150 },
  ]).map((item, index) => ({
    ...item,
    value: item.volume,
    color: colors[index % colors.length]
  }))

  const forecastData = [
    { day: 'Day 1', stock: 10000, projected: 10000 },
    { day: 'Day 5', stock: 9200, projected: 9200 },
    { day: 'Day 10', stock: 8500, projected: 8500 },
    { day: 'Today', stock: 7800, projected: 7800 },
    { day: 'Day 20', stock: null, projected: 6200 },
    { day: 'Day 25', stock: null, projected: 4800 },
    { day: 'Day 30', stock: null, projected: 3500 },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Export Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Analytics & Reports
            </h1>
            <span className="text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <FileBarChart className="w-3 h-3" />
              Intelligence Center
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive overview of production metrics and system health.
          </p>
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchReports}
            className="flex items-center gap-1.5 bg-[#162032] hover:bg-[#1E2D47] text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl border border-[#1E293B] transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <div className="flex items-center bg-[#162032] border border-[#1E293B] text-slate-300 text-xs px-3 py-2 rounded-xl gap-2">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>{timeframe}</span>
          </div>

          <button
            onClick={() => alert('Exporting PDF...')}
            className="flex items-center gap-1.5 bg-[#162032] hover:bg-[#1E2D47] border border-[#1E293B] text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" />
            <span>PDF</span>
          </button>

          <button
            onClick={() => alert('Exporting Excel...')}
            className="flex items-center gap-1.5 bg-[#162032] hover:bg-[#1E2D47] border border-[#1E293B] text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>EXCEL</span>
          </button>

          <button
            onClick={() => alert('Exporting CSV...')}
            className="flex items-center gap-1.5 bg-[#162032] hover:bg-[#1E2D47] border border-[#1E293B] text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Row 1: Monthly Production Yield Bar Chart & Top Products Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Production Yield (2 Cols wide) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-[#1E293B]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Monthly Production Yield
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time aggregated output per month from MSSQL
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-xs text-slate-400">Actual Output</span>
            </div>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyYieldData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#162032',
                    borderColor: '#1E293B',
                    borderRadius: '12px',
                    color: '#F8FAFC'
                  }}
                  formatter={(val: any) => [`${val} units`, 'Output']}
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
              Top Products
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Distribution by volume
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
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-white">{data?.total_logs_count || 7}</span>
              <span className="text-[10px] text-slate-400 font-medium">Logs Count</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs pt-2 border-t border-[#1E293B]">
            {topProductsPieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-300 font-medium truncate max-w-[120px]">{item.name}</span>
                </div>
                <span className="font-mono text-slate-400">{item.value.toLocaleString()}</span>
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
              Machine Performance Heatmap
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Uptime & efficiency across active units (Last 24h)
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span>Low</span>
            <div className="flex gap-1">
              <span className="w-4 h-3 rounded-sm bg-[#1E2D47]"></span>
              <span className="w-4 h-3 rounded-sm bg-[#047857]"></span>
              <span className="w-4 h-3 rounded-sm bg-[#10B981]"></span>
              <span className="w-4 h-3 rounded-sm bg-[#34D399]"></span>
            </div>
            <span>Optimal</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-7 gap-2 text-slate-500 font-mono text-[10px] pb-1 border-b border-[#1E293B]">
            <span></span>
            <span className="text-center">00:00</span>
            <span className="text-center">04:00</span>
            <span className="text-center">08:00</span>
            <span className="text-center">12:00</span>
            <span className="text-center">16:00</span>
            <span className="text-center">20:00</span>
          </div>

          {[
            { id: 'MCH-01', status: ['bg-[#10B981]', 'bg-[#10B981]', 'bg-[#34D399]', 'bg-[#10B981]', 'bg-[#34D399]', 'bg-[#10B981]'] },
            { id: 'MCH-02', status: ['bg-[#F43F5E]', 'bg-[#047857]', 'bg-[#10B981]', 'bg-[#F59E0B]', 'bg-[#10B981]', 'bg-[#10B981]'] },
            { id: 'MCH-03', status: ['bg-[#10B981]', 'bg-[#34D399]', 'bg-[#10B981]', 'bg-[#10B981]', 'bg-[#34D399]', 'bg-[#10B981]'] },
            { id: 'MCH-04', status: ['bg-[#1E2D47]', 'bg-[#1E2D47]', 'bg-[#1E2D47]', 'bg-[#1E2D47]', 'bg-[#1E2D47]', 'bg-[#1E2D47]'] },
          ].map((mch) => (
            <div key={mch.id} className="grid grid-cols-7 gap-2 items-center">
              <span className="font-mono text-slate-400 font-semibold text-[11px]">{mch.id}</span>
              {mch.status.map((st, i) => (
                <div key={i} className={`h-8 rounded-lg ${st} opacity-85 hover:opacity-100 transition-all border border-[#1E293B]`}></div>
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
              Inventory Forecast
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Predicted stock levels based on current run rate
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
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#162032',
                  borderColor: '#1E293B',
                  borderRadius: '12px',
                  color: '#F8FAFC'
                }}
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
