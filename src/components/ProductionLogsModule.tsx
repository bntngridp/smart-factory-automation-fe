'use client'

import React, { useState, useEffect } from 'react'
import {
  ClipboardList,
  Plus,
  RefreshCw,
  AlertCircle,
  Download,
  Check,
  Cpu
} from 'lucide-react'
import {
  getProductsApi,
  getProductionLogsApi,
  createProductionLogApi,
  Product,
  ProductionLogItem
} from '@/services/api'
import { useLanguage } from '@/context/LanguageContext'
import { exportProductionLogsCsv } from '@/utils/exportUtils'

interface ProductionLogsModuleProps {
  onOpenRecordProduction?: () => void
}

export default function ProductionLogsModule({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onOpenRecordProduction
}: ProductionLogsModuleProps) {
  const { t, formatNumber } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [logs, setLogs] = useState<ProductionLogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  // Inline Form States
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('')
  const [operator, setOperator] = useState('Budi Santoso')
  const [machine, setMachine] = useState('CNC-01 (Milling)')
  const [quantity, setQuantity] = useState<number>(45)
  const [shift, setShift] = useState('morning')
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
      setError(t('please_select_product'))
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await createProductionLogApi({
        product_id: Number(selectedProductId),
        quantity: Number(quantity),
        operator_name: operator
      })

      showToast(t('log_submitted_success'))
      await fetchLogs()
      setQuantity(10)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mencatat log produksi'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await exportProductionLogsCsv()
      showToast(`${t('export_csv')}: ${res.filename}`)
    } catch (err) {
      console.error('Failed to export production logs:', err)
    } finally {
      setExporting(false)
    }
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

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {t('production_logs_title')}
            </h1>
            <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ClipboardList className="w-3 h-3" />
              {t('live_manufacturing_data')}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t('production_logs_subtitle')}
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="flex items-center gap-1.5 bg-[#162032] hover:bg-[#1E2D47] text-slate-300 text-xs font-semibold px-3.5 py-2 rounded-xl border border-[#1E293B] transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{t('sync_data')}</span>
        </button>
      </div>

      {/* Top Section: Inline "+ New Entry" Form Card */}
      <div className="glass-card rounded-2xl p-6 border border-[#1E293B]">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Plus className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white tracking-wide">
            {t('new_log_entry')}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmitLog} className="space-y-4 text-xs">
          {/* Row 1: Product, Operator, Machine */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">{t('select_product')}</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(Number(e.target.value))}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                {products.length === 0 ? (
                  <option value="">{t('loading')}</option>
                ) : (
                  products.map((p) => (
                    <option key={p.ProductID} value={p.ProductID}>
                      [PRD-{formatNumber(p.ProductID)}] {p.ProductName} ({p.Unit === 'pcs' || p.Unit === 'pzas' ? t('pcs') : p.Unit || t('units')})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">{t('operator_name')}</label>
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="Budi Santoso">Budi Santoso</option>
                <option value="Maya Sari">Maya Sari</option>
                <option value="Rudi Hartono">Rudi Hartono</option>
                <option value="Dewi Lestari">Dewi Lestari</option>
                <option value="Andi Wijaya">Andi Wijaya</option>
                <option value="Siti Aminah">Siti Aminah</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">{t('select_machine')}</label>
              <select
                value={machine}
                onChange={(e) => setMachine(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="CNC-01 (Milling)">CNC-01 (Milling & High Precision)</option>
                <option value="PRESS-02 (Stamping)">PRESS-02 (Stamping & Hydraulic)</option>
                <option value="ASSY-03 (Packaging)">ASSY-03 (Final Assembly & Packaging)</option>
                <option value="LASER-04 (Cutting)">LASER-04 (Fiber Laser Cutting)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Quantity, Shift, Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">{t('quantity_produced')}</label>
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
              <label className="block text-slate-300 font-semibold mb-1.5">{t('shift')}</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="morning">{t('shift_morning')}</option>
                <option value="afternoon">{t('shift_afternoon')}</option>
                <option value="night">{t('shift_night')}</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">{t('mutation_date')}</label>
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
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{submitting ? '...' : t('submit_log')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Bottom Section: Recent Logs Table */}
      <div className="glass-card rounded-2xl p-5 border border-[#1E293B]">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            {t('recent_logs')}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-1.5 bg-[#0F172A] hover:bg-[#1E2D47] border border-[#1E293B] text-slate-300 text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>{exporting ? '...' : t('export')}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0F172A] border-b border-[#1E293B] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-3.5">{t('time')}</th>
                <th className="p-3.5">{t('operator')}</th>
                <th className="p-3.5">{t('machine_id')}</th>
                <th className="p-3.5">{t('products')}</th>
                <th className="p-3.5 text-center">{t('quantity')}</th>
                <th className="p-3.5 text-right">{t('status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>{t('loading')}</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    {t('no_production_logs')}
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => {
                  const timeStr = log.ProductionDate
                    ? new Date(log.ProductionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '14:32'

                  // Dynamic Machine Assignment
                  const machineTags = ['CNC-01', 'PRESS-02', 'ASSY-03', 'LASER-04']
                  const assignedMachine = machineTags[log.ProductID % machineTags.length] || 'CNC-01'

                  return (
                    <tr key={log.LogID || index} className="hover:bg-[#1E2D47]/40 transition-colors">
                      <td className="p-3.5 font-mono text-slate-400">
                        {timeStr}
                      </td>
                      <td className="p-3.5 font-bold text-white">
                        {log.OperatorName || 'Budi Santoso'}
                      </td>
                      <td className="p-3.5 font-mono text-blue-400 font-semibold">
                        {assignedMachine}
                      </td>
                      <td className="p-3.5 font-medium text-slate-200">
                        {log.Products?.ProductName || `PRD-${formatNumber(log.ProductID)}`}
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-emerald-400">
                        +{formatNumber(log.Quantity)}
                      </td>
                      <td className="p-3.5 text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                          <span>{t('active_status_label')}</span>
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
