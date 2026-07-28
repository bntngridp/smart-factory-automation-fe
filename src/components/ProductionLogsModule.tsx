'use client'

import React, { useState, useEffect } from 'react'
import {
  ClipboardList,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Filter,
  Check,
  Zap
} from 'lucide-react'

export interface ProductOption {
  ProductID: number
  ProductName: string
  Unit: string | null
}

export interface ProductionLogRecord {
  LogID: number
  ProductID: number
  Quantity: number
  ProductionDate: string | null
  OperatorName: string | null
  MachineID?: string
  Status?: 'Completed' | 'In Progress' | 'Flagged'
  Products?: {
    ProductName: string
    Unit: string | null
  }
}

interface ProductionLogsModuleProps {
  onOpenRecordProduction?: () => void
}

export default function ProductionLogsModule({
  onOpenRecordProduction
}: ProductionLogsModuleProps) {
  const [products, setProducts] = useState<ProductOption[]>([])
  const [logs, setLogs] = useState<ProductionLogRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Inline Form States
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('')
  const [operator, setOperator] = useState('J. Miller')
  const [machine, setMachine] = useState('CNC-01 (Milling)')
  const [quantity, setQuantity] = useState<number>(45)
  const [shift, setShift] = useState('Morning (06:00 - 14:00)')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchProducts()
    fetchLogs()
  }, [])

  const fetchProducts = async () => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6060'
      const res = await fetch(`${apiBase}/api/products`)
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
        if (data.length > 0 && !selectedProductId) {
          setSelectedProductId(data[0].ProductID)
        }
      }
    } catch (err) {
      console.error('Failed to fetch products for logs', err)
    }
  }

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6060'
      const res = await fetch(`${apiBase}/api/inventory/movements?type=IN`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setLogs(data)
      }
    } catch (err) {
      console.error('Failed to fetch production logs', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitLog = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProductId) {
      setError('Please select a product')
      return
    }

    setSubmitting(true)
    setError(null)
    setSuccessMsg(null)

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6060'
      const res = await fetch(`${apiBase}/api/production-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: Number(selectedProductId),
          quantity: Number(quantity),
          operator_name: operator
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit log entry')
      }

      setSuccessMsg('Log submitted & inventory mutated successfully!')
      fetchLogs()
      setQuantity(0)
    } catch (err: any) {
      setError(err.message || 'Error connecting to API server')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Production Logs
            </h1>
            <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ClipboardList className="w-3 h-3" />
              Live Manufacturing Data
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Record and monitor real-time manufacturing data & yield.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="flex items-center gap-1.5 bg-[#162032] hover:bg-[#1E2D47] text-slate-300 text-xs font-semibold px-3.5 py-2 rounded-xl border border-[#1E293B] transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Top Section: Inline "+ New Entry" Form Card */}
      <div className="glass-card rounded-2xl p-6 border border-[#1E293B]">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Plus className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white tracking-wide">
            New Entry
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitLog} className="space-y-4 text-xs">
          {/* Row 1: Product, Operator, Machine */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(Number(e.target.value))}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              >
                {products.length === 0 ? (
                  <option value="">Loading products...</option>
                ) : (
                  products.map((p) => (
                    <option key={p.ProductID} value={p.ProductID}>
                      {p.ProductName}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Operator</label>
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="J. Miller">J. Miller</option>
                <option value="S. Chen">S. Chen</option>
                <option value="R. Davis">R. Davis</option>
                <option value="Budi Santoso">Budi Santoso</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Machine</label>
              <select
                value={machine}
                onChange={(e) => setMachine(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="CNC-01 (Milling)">CNC-01 (Milling)</option>
                <option value="Assy-Line-B">Assy-Line-B</option>
                <option value="Lathe-04">Lathe-04</option>
                <option value="Injection-02">Injection-02</option>
              </select>
            </div>
          </div>

          {/* Row 2: Quantity, Shift, Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Shift</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Morning (06:00 - 14:00)">Morning (06:00 - 14:00)</option>
                <option value="Afternoon (14:00 - 22:00)">Afternoon (14:00 - 22:00)</option>
                <option value="Night (22:00 - 06:00)">Night (22:00 - 06:00)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Submit Button Right-Aligned */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Log'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Bottom Section: Recent Logs Table */}
      <div className="glass-card rounded-2xl p-5 border border-[#1E293B]">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-base font-bold text-white tracking-wide">
            Recent Logs
          </h2>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl bg-[#0F172A] border border-[#1E293B] text-slate-400 hover:text-white transition-colors">
              <Filter className="w-3.5 h-3.5" />
            </button>
            <button className="p-2 rounded-xl bg-[#0F172A] border border-[#1E293B] text-slate-400 hover:text-white transition-colors">
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0F172A] border-b border-[#1E293B] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-3.5">Time</th>
                <th className="p-3.5">Operator</th>
                <th className="p-3.5">Machine ID</th>
                <th className="p-3.5">Product</th>
                <th className="p-3.5 text-center">Qty</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Loading recent production logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No production logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => {
                  const timeStr = log.ProductionDate
                    ? new Date(log.ProductionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '14:32'

                  // Sample status simulation matching design
                  const status = index % 3 === 0 ? 'Completed' : index % 3 === 1 ? 'In Progress' : 'Completed'

                  return (
                    <tr key={log.LogID || index} className="hover:bg-[#1E2D47]/40 transition-colors">
                      <td className="p-3.5 font-mono text-slate-400">
                        {timeStr}
                      </td>
                      <td className="p-3.5 font-bold text-white">
                        {log.OperatorName || 'J. Miller'}
                      </td>
                      <td className="p-3.5 font-mono text-blue-400">
                        {log.MachineID || (index % 2 === 0 ? 'CNC-01' : 'Assy-Line-B')}
                      </td>
                      <td className="p-3.5 font-medium text-slate-200">
                        {log.Products?.ProductName || 'Titanium Casing Alpha'}
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-white">
                        {log.Quantity}
                      </td>
                      <td className="p-3.5 text-right">
                        {status === 'Completed' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            Completed
                          </span>
                        ) : status === 'In Progress' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            In Progress
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                            Flagged
                          </span>
                        )}
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
