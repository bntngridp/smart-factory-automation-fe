'use client'

import React from 'react'
import {
  Package,
  Activity,
  Boxes,
  AlertTriangle,
  Gauge,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

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
  const cards = [
    {
      id: 'products',
      label: 'Total Products',
      value: data?.total_products !== undefined ? data.total_products.toLocaleString() : '4,821',
      subtext: '+12 vs last month',
      isPositive: true,
      icon: Package,
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      id: 'today_production',
      label: "Today's Production",
      value: data?.total_production_today !== undefined ? `${data.total_production_today.toLocaleString()} units` : '1,240 units',
      subtext: '+5.2% vs yesterday',
      isPositive: true,
      icon: Activity,
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 'inventory',
      label: 'Current Inventory',
      value: '82,450',
      subtext: '-1.4% capacity',
      isPositive: false,
      icon: Boxes,
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      id: 'low_stock',
      label: 'Low Stock Alerts',
      value: data?.low_stock_alerts_count !== undefined ? data.low_stock_alerts_count.toString() : '3',
      subtext: 'Critical attention required',
      isAlert: true,
      icon: AlertTriangle,
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30 shadow-rose-500/10 shadow-lg'
    },
    {
      id: 'efficiency',
      label: 'Production Efficiency',
      value: '94.2%',
      subtext: '+0.8% OEE',
      isPositive: true,
      icon: Gauge,
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 my-6">
      {cards.map((card) => {
        const Icon = card.icon
        const isAlertCard = card.isAlert && (data?.low_stock_alerts_count ?? 3) > 0

        return (
          <div
            key={card.id}
            className={`rounded-2xl p-4 transition-all duration-200 ${
              isAlertCard
                ? 'bg-rose-950/20 border-2 border-rose-500/40 shadow-xl shadow-rose-500/10 relative overflow-hidden'
                : 'glass-card hover:border-[#334155]'
            }`}
          >
            {isAlertCard && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-bl-full pointer-events-none"></div>
            )}

            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold text-slate-400 tracking-wide">
                {card.label}
              </span>
              <div className={`p-2 rounded-xl border ${card.badgeColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-2 mt-1">
              <h3 className={`text-xl font-bold tracking-tight ${isAlertCard ? 'text-rose-400' : 'text-white'}`}>
                {loading ? '...' : card.value}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 mt-2.5">
              {card.isAlert ? (
                <span className="text-[11px] font-medium text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {card.subtext}
                </span>
              ) : card.isPositive ? (
                <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {card.subtext}
                </span>
              ) : (
                <span className="text-[11px] font-medium text-amber-400 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
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
