'use client'

import React from 'react'
import { Plus, ArrowUpRight, RefreshCw, CheckCircle2 } from 'lucide-react'
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
  onViewAll?: () => void
}

export default function LowStockAlertsTable({
  alerts = [],
  loading,
  onRecordProduction,
  onViewAll
}: LowStockAlertsTableProps) {
  const { t, formatNumber } = useLanguage()

  const hasAlerts = alerts && alerts.length > 0
  const displayedAlerts = alerts.slice(0, 5)

  return (
    <div className="glass-card rounded-2xl p-5 mb-6 shadow-md">
      {/* Table Header Section */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide">
            {t('low_stock_alerts')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('low_stock_subtitle')}
          </p>
        </div>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <span>{t('view_all')}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        )}
      </div>

      {/* Encapsulated Data Table Grid Container */}
      <div className="overflow-x-auto rounded-xl border border-[#1E293B]">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#0B132B] border-b border-[#1E293B] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="p-3.5">{t('product_name')}</th>
              <th className="p-3.5 text-center">{t('current_stock')}</th>
              <th className="p-3.5 text-center">{t('min_stock')}</th>
              <th className="p-3.5 text-center">{t('status')}</th>
              <th className="p-3.5 text-right">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                    <span>{t('loading')}</span>
                  </div>
                </td>
              </tr>
            ) : !hasAlerts ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2 text-emerald-500 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('in_stock_status')}</span>
                  </div>
                </td>
              </tr>
            ) : (
              displayedAlerts.map((item) => {
                const isOut = item.CurrentStock === 0
                const unitLabel = item.Unit === 'pcs' || item.Unit === 'pzas' ? t('pcs') : item.Unit || t('units')

                return (
                  <tr key={item.ProductID} className="hover:bg-[#1E2D47]/40 transition-colors">
                    <td className="p-3.5 font-bold text-white">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isOut ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'}`}></span>
                        <span>{item.ProductName}</span>
                      </div>
                    </td>
                    <td className={`p-3.5 text-center font-mono font-bold ${isOut ? 'text-rose-500' : 'text-amber-500'}`}>
                      {formatNumber(item.CurrentStock)} <span className="text-[11px] font-normal text-slate-400">{unitLabel}</span>
                    </td>
                    <td className="p-3.5 text-center font-mono font-semibold text-slate-400">
                      {formatNumber(item.MinStock)} <span className="text-[11px] font-normal text-slate-400">{unitLabel}</span>
                    </td>
                    <td className="p-3.5 text-center">
                      {isOut ? (
                        <span className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-rose-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                          <span>{t('out_of_stock_status')}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-amber-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                          <span>{t('low_stock_status')}</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => onRecordProduction(item.ProductID)}
                        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{t('produce')}</span>
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        {/* View All Footer when more than 5 alerts exist */}
        {alerts.length > 5 && onViewAll && (
          <div className="p-3 bg-[#0F172A] border-t border-[#1E293B] text-center">
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t('view_all')} ({formatNumber(alerts.length)} {t('products')})</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
