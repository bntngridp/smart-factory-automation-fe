'use client'

import React from 'react'
import { AlertTriangle, Plus, ArrowUpRight, RefreshCw, CheckCircle2 } from 'lucide-react'
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

  return (
    <div className="glass-card rounded-2xl p-5 mb-6 shadow-md">
      {/* Table Header Section */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-wide">
              {t('low_stock_alerts')}
            </h2>
            {hasAlerts ? (
              <span className="text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {t('action_required')}
              </span>
            ) : (
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {t('all_systems_nominal')}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('low_stock_subtitle')}
          </p>
        </div>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            {t('view_all')}
            <ArrowUpRight className="w-3.5 h-3.5" />
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
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('in_stock_status')}</span>
                  </div>
                </td>
              </tr>
            ) : (
              alerts.map((item) => {
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
                    <td className={`p-3.5 text-center font-mono font-bold ${isOut ? 'text-rose-400' : 'text-amber-400'}`}>
                      {formatNumber(item.CurrentStock)} <span className="text-[11px] font-normal text-slate-400">{unitLabel}</span>
                    </td>
                    <td className="p-3.5 text-center font-mono font-semibold text-slate-400">
                      {formatNumber(item.MinStock)} <span className="text-[11px] font-normal text-slate-400">{unitLabel}</span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                        isOut
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {isOut ? t('out_of_stock_status') : t('low_stock_status')}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => onRecordProduction(item.ProductID)}
                        className="inline-flex items-center gap-1.5 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
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
      </div>
    </div>
  )
}
