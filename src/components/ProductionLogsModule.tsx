'use client'

import React, { useState, useEffect } from 'react'
import {
  ClipboardList,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Download,
  Filter,
  Check
} from 'lucide-react'
import {
  getProductsApi,
  getProductionLogsApi,
  createProductionLogApi,
  Product,
  ProductionLogItem
} from '@/services/api'

interface ProductionLogsModuleProps {
  onOpenRecordProduction?: () => void
}

export default function ProductionLogsModule({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onOpenRecordProduction
}: ProductionLogsModuleProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [logs, setLogs] = useState<ProductionLogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Inline Form States
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('')
  const [operator, setOperator] = useState('Budi Santoso')
  const [machine, setMachine] = useState('CNC-01 (Milling)')
  const [quantity, setQuantity] = useState<number>(45)
  const [shift, setShift] = useState('Morning (06:00 - 14:00)')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const data = await getProductionLogsApi()
      setLogs(data)
    } catch (err) {
      console.error('Failed to fetch production logs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false
    const load = async () => {
      try {
        const [prodData, logsData] = await Promise.all([
          getProductsApi(),
          getProductionLogsApi()
        ])
        if (!ignore) {
          setProducts(prodData)
          if (prodData.length > 0) {
            setSelectedProductId(prodData[0].ProductID)
          }
          setLogs(logsData)
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to initialize production logs module:', err)
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [])

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
      await createProductionLogApi({
        product_id: Number(selectedProductId),
        quantity: Number(quantity),
        operator_name: operator
      })

      setSuccessMsg('Log submitted and inventory mutated successfully!')
      fetchLogs()
      setQuantity(10)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mencatat log produksi'
      setError(msg)
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
            Record and monitor real-time manufacturing data and yield.
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
                      [{p.ProductID}] {p.ProductName}
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
                <option value="Budi Santoso">Budi Santoso</option>
                <option value="J. Miller">J. Miller</option>
                <option value="S. Chen">S. Chen</option>
                <option value="R. Davis">R. Davis</option>
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
                    Loading recent production logs from MSSQL...
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

                  return (
                    <tr key={log.LogID || index} className="hover:bg-[#1E2D47]/40 transition-colors">
                      <td className="p-3.5 font-mono text-slate-400">
                        {timeStr}
                      </td>
                      <td className="p-3.5 font-bold text-white">
                        {log.OperatorName || 'Budi Santoso'}
                      </td>
                      <td className="p-3.5 font-mono text-blue-400">
                        CNC-01
                      </td>
                      <td className="p-3.5 font-medium text-slate-200">
                        {log.Products?.ProductName || `PRD-${log.ProductID}`}
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-white">
                        +{log.Quantity}
                      </td>
                      <td className="p-3.5 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Completed
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
