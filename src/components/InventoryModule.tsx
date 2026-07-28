'use client'

import React, { useState, useEffect } from 'react'
import {
  Boxes,
  Download,
  Plus,
  Building2,
  Warehouse,
  ClipboardCheck,
  ArrowDownLeft,
  ArrowUpRight,
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
  Cell
} from 'recharts'

export interface InventoryMovementItem {
  MovementID: number
  ProductID: number
  MovementType: string | null
  Quantity: number
  MovementDate: string | null
  Products?: {
    ProductName: string
    Unit: string | null
  }
}

interface InventoryModuleProps {
  onOpenStockOut: () => void
  onOpenRecordProduction: () => void
}

const zoneChartData = [
  { zone: 'Zone A', capacity: 85, fill: '#3B82F6' },
  { zone: 'Zone B', capacity: 62, fill: '#3B82F6' },
  { zone: 'Zone C', capacity: 78, fill: '#F59E0B' },
  { zone: 'Zone D', capacity: 40, fill: '#3B82F6' },
]

export default function InventoryModule({
  onOpenStockOut,
  onOpenRecordProduction
}: InventoryModuleProps) {
  const [filterType, setFilterType] = useState<'All' | 'IN' | 'OUT'>('All')
  const [movements, setMovements] = useState<InventoryMovementItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMovements = async () => {
    setLoading(true)
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6060'
      const query = filterType !== 'All' ? `?type=${filterType}` : ''
      const res = await fetch(`${apiBase}/api/inventory/movements${query}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setMovements(data)
      }
    } catch (err) {
      console.error('Failed to fetch inventory movements:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovements()
  }, [filterType])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Primary Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Inventory Management
            </h1>
            <span className="text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Boxes className="w-3 h-3" />
              Stock Operations
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time stock monitoring and movement logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMovements}
            className="flex items-center gap-1.5 bg-[#162032] hover:bg-[#1E2D47] text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl border border-[#1E293B] transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={() => alert('Exporting inventory report...')}
            className="flex items-center gap-2 bg-[#162032] hover:bg-[#1E2D47] border border-[#1E293B] text-slate-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Report</span>
          </button>

          <button
            onClick={onOpenStockOut}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Entry</span>
          </button>
        </div>
      </div>

      {/* Top 3 KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Warehouse Value */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Warehouse Value</span>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">$14.2M</h2>
          <p className="text-xs text-emerald-400 font-medium mt-1.5">
            +2.4% from last month
          </p>
        </div>

        {/* Card 2: Storage Capacity */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400">Storage Capacity</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Warehouse className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">78%</h2>
            <span className="text-[11px] text-slate-400 font-medium">42,500 / 54,000 sq ft</span>
          </div>
          <div className="w-full bg-[#0F172A] rounded-full h-2 mt-3 border border-[#1E293B] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-amber-500 h-2 rounded-full w-[78%]"></div>
          </div>
        </div>

        {/* Card 3: Last Stock Audit */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-slate-400">Last Stock Audit</span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <ClipboardCheck className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Oct 24, 2026</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md">
              PASSED
            </span>
            <span className="text-xs text-slate-400">Auditor: J. Miller</span>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stock Movement History */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Stock Movement
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit trail of incoming & outgoing inventory mutations
              </p>
            </div>

            {/* Filter Tabs (All / IN / OUT) */}
            <div className="flex items-center bg-[#0F172A] border border-[#1E293B] p-1 rounded-xl">
              {(['All', 'IN', 'OUT'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filterType === type
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#0F172A] border-b border-[#1E293B] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Item / Product</th>
                  <th className="p-3.5 text-center">Type</th>
                  <th className="p-3.5 text-center">Qty</th>
                  <th className="p-3.5 text-right">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      Loading inventory movements...
                    </td>
                  </tr>
                ) : movements.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      No stock movements recorded yet.
                    </td>
                  </tr>
                ) : (
                  movements.map((m) => {
                    const isIN = m.MovementType === 'IN'
                    const dateStr = m.MovementDate
                      ? new Date(m.MovementDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '10:42 AM'

                    return (
                      <tr key={m.MovementID} className="hover:bg-[#1E2D47]/40 transition-colors">
                        <td className="p-3.5 font-mono text-slate-400">
                          {dateStr}
                        </td>
                        <td className="p-3.5 font-bold text-white">
                          {m.Products?.ProductName || `PRT-${m.ProductID}`}
                        </td>
                        <td className="p-3.5 text-center">
                          {isIN ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              <ArrowDownLeft className="w-3 h-3" />
                              IN
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              <ArrowUpRight className="w-3 h-3" />
                              OUT
                            </span>
                          )}
                        </td>
                        <td className={`p-3.5 text-center font-mono font-bold ${isIN ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {isIN ? `+${m.Quantity}` : `-${m.Quantity}`}
                        </td>
                        <td className="p-3.5 text-right text-slate-300 font-medium">
                          {isIN ? 'Operator Production' : 'Warehouse Output'}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Zone Utilization Chart */}
        <div className="glass-card rounded-2xl p-5">
          <h2 className="text-base font-bold text-white tracking-wide mb-1">
            Zone Utilization
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Warehouse capacity per storage sector (%)
          </p>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="zone" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#162032',
                    borderColor: '#1E293B',
                    borderRadius: '12px',
                    color: '#F8FAFC'
                  }}
                  formatter={(val: any) => [`${val}%`, 'Capacity Used']}
                />
                <Bar dataKey="capacity" radius={[6, 6, 0, 0]}>
                  {zoneChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-[#1E293B] text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>Standard Storage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Hazmat Zone</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
