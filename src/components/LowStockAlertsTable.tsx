'use client'

import React from 'react'
import { AlertTriangle, PlusCircle, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export interface LowStockAlertItem {
  ProductID: number
  ProductName: string
  Unit: string | null
  MinStock: number
  CurrentStock: number
}

interface LowStockAlertsTableProps {
  alerts?: LowStockAlertItem[]
  loading?: boolean
  onRecordProduction: (productId?: number) => void
}

export default function LowStockAlertsTable({
  alerts = [],
  loading,
  onRecordProduction
}: LowStockAlertsTableProps) {
  const { t } = useLanguage()

  // Sample fallback data if backend is empty
  const displayAlerts: LowStockAlertItem[] = alerts.length > 0 ? alerts : [
    { ProductID: 1007, ProductName: 'Bearing SKF 6203-2RS', Unit: 'pcs', MinStock: 200, CurrentStock: 0 },
    { ProductID: 1008, ProductName: 'Sensor Suhu OMRON E5CC', Unit: 'pcs', MinStock: 50, CurrentStock: 5 },
    { ProductID: 1009, ProductName: 'PLC Mitsubishi FX5U', Unit: 'unit', MinStock: 10, CurrentStock: 2 },
  ]

  return (
    <div className="glass-card rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-wide">
              {t('low_stock_alerts')}
            </h2>
            <span className="text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              {t('action_required')}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('low_stock_subtitle')}
          </p>
        </div>

        <button
          onClick={() => alert('Viewing all inventory alerts...')}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
        >
          {t('view')}
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#1E293B] text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
              <th className="pb-3 px-2">{t('product_name')}</th>
              <th className="pb-3 px-2 text-center">{t('current_stock')}</th>
              <th className="pb-3 px-2 text-center">{t('min_stock')}</th>
              <th className="pb-3 px-2 text-center">{t('status')}</th>
              <th className="pb-3 px-2 text-right">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-400">
                  Loading inventory alerts...
                </td>
              </tr>
            ) : displayAlerts.map((item) => {
              const isOut = item.CurrentStock === 0

              return (
                <tr key={item.ProductID} className="hover:bg-[#1E2D47]/40 transition-colors">
                  <td className="py-3 px-2 font-medium text-slate-200">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isOut ? 'bg-rose-500 animate-ping' : 'bg-amber-500'}`}></div>
                      <span>{item.ProductName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-rose-400">
                    {item.CurrentStock.toLocaleString()} {item.Unit || 'pcs'}
                  </td>
                  <td className="py-3 px-2 text-center text-slate-400">
                    {item.MinStock.toLocaleString()} {item.Unit || 'pcs'}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      isOut
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {isOut ? 'OUT OF STOCK' : 'LOW STOCK'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => onRecordProduction(item.ProductID)}
                      className="inline-flex items-center gap-1 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
                    >
                      <PlusCircle className="w-3 h-3" />
                      Produce
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
