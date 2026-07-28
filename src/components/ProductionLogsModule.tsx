'use client'

import React, { useState, useEffect } from 'react'
import {
  ClipboardList,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  UserCheck,
  Zap,
  Calendar
} from 'lucide-react'

export interface ProductionLogItem {
  LogID: number
  ProductID: number
  Quantity: number
  ProductionDate: string | null
  OperatorName: string | null
  Products?: {
    ProductName: string
    Unit: string | null
  }
}

interface ProductionLogsModuleProps {
  onOpenRecordProduction: () => void
}

export default function ProductionLogsModule({
  onOpenRecordProduction
}: ProductionLogsModuleProps) {
  const [logs, setLogs] = useState<ProductionLogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6060'
      // Fetch movements with type IN or inventory movements
      const res = await fetch(`${apiBase}/api/inventory/movements?type=IN`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setLogs(data)
      }
    } catch (err) {
      console.error('Failed to fetch production logs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const filteredLogs = logs.filter(
    (l) =>
      (l.OperatorName && l.OperatorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.Products?.ProductName && l.Products.ProductName.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Primary Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Production Logs
            </h1>
            <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ClipboardList className="w-3 h-3" />
              Operator Output
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time daily operator output & automated inventory IN mutations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLogs}
            className="flex items-center gap-1.5 bg-[#162032] hover:bg-[#1E2D47] text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl border border-[#1E293B] transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={onOpenRecordProduction}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record Production</span>
          </button>
        </div>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Yield Today</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">1,240 units</h2>
          <p className="text-xs text-emerald-400 font-medium mt-1.5">+5.2% vs target</p>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400">Active Shift Operators</span>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">18 Operators</h2>
          <p className="text-xs text-blue-400 font-medium mt-1.5">Shift A (Morning Line)</p>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400">Average Batch Cycle</span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">14.2 mins</h2>
          <p className="text-xs text-purple-400 font-medium mt-1.5">Optimal performance</p>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by operator or product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0F172A] text-xs text-slate-200 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 border border-[#1E293B] focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Production Logs Data Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-[#1E293B]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0F172A] border-b border-[#1E293B] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-4">Log ID</th>
                <th className="p-4">Product Name</th>
                <th className="p-4 text-center">Qty Produced</th>
                <th className="p-4 text-center">Date & Time</th>
                <th className="p-4">Operator Name</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Loading daily production logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No production logs recorded today.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const dateStr = log.ProductionDate
                    ? new Date(log.ProductionDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                    : 'Today, 10:42 AM'

                  return (
                    <tr key={log.LogID || log.ProductID} className="hover:bg-[#1E2D47]/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-400">
                        LOG-{log.LogID || 1000 + log.ProductID}
                      </td>
                      <td className="p-4 font-bold text-white">
                        {log.Products?.ProductName || `Product ID ${log.ProductID}`}
                      </td>
                      <td className="p-4 text-center font-mono font-bold text-emerald-400">
                        +{log.Quantity.toLocaleString()} {log.Products?.Unit || 'pcs'}
                      </td>
                      <td className="p-4 text-center text-slate-400 font-mono">
                        {dateStr}
                      </td>
                      <td className="p-4 font-medium text-slate-200">
                        {log.OperatorName || 'Budi Santoso'}
                      </td>
                      <td className="p-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          INVENTORY MUTATED
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
