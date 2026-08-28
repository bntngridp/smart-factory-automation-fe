'use client'

import React from 'react'
import {
  Package,
  Activity,
  Boxes,
  AlertTriangle,
  Gauge
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface SummaryData {
  total_products: number
  total_production_today: number
  low_stock_alerts_count: number
}

interface SummaryCardsProps {
  data?: SummaryData
  loading?: boolean
}

export default function SummaryCards({ data, loading }: SummaryCardsProps) {
  const { t, formatNumber } = useLanguage()

  const rawProdCount = data?.total_products !== undefined ? data.total_products : 6
  const rawTodayCount = data?.total_production_today !== undefined ? data.total_production_today : 1127
  const rawInventoryCount = 82450
  const rawAlertsCount = data?.low_stock_alerts_count !== undefined ? data.low_stock_alerts_count : 1
  const rawEfficiency = '94.2%'

  const cards = [
    {
      id: 'products',
      label: t('total_products'),
      value: formatNumber(rawProdCount),
      subtext: t('active_catalog'),
      icon: Package
    },
    {
      id: 'today_production',
      label: t('today_production'),
      value: `${formatNumber(rawTodayCount)} ${t('units')}`,
      subtext: t('vs_daily_target'),
      icon: Activity
    },
    {
      id: 'inventory',
      label: t('current_inventory'),
      value: `${formatNumber(rawInventoryCount)} ${t('units')}`,
      subtext: t('total_items_in_stock'),
      icon: Boxes
    },
    {
      id: 'low_stock',
      label: t('low_stock_alerts'),
      value: formatNumber(rawAlertsCount),
      subtext: rawAlertsCount > 0 ? t('require_attention') : t('all_systems_nominal'),
      icon: AlertTriangle,
      isAlert: rawAlertsCount > 0
    },
    {
      id: 'efficiency',
      label: t('production_efficiency'),
      value: rawEfficiency,
      subtext: t('optimal_output'),
      icon: Gauge
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 my-6">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <div
            key={card.id}
            className="glass-card rounded-2xl p-4 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold text-slate-400 tracking-wide truncate">
                {card.label}
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-2 mt-1">
              <h3 className={`text-xl font-bold tracking-tight ${card.isAlert ? 'text-rose-500' : 'text-white'}`}>
                {loading ? '...' : card.value}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 mt-2.5">
              {card.isAlert ? (
                <span className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 truncate">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  {card.subtext}
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  {card.subtext}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
