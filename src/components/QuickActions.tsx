'use client'

import React from 'react'
import { PlusCircle, ClipboardCheck, ArrowUpRight, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface QuickActionsProps {
  onOpenAddProduct: () => void
  onOpenRecordProduction: () => void
  onOpenStockOut: () => void
}

export default function QuickActions({
  onOpenAddProduct,
  onOpenRecordProduction,
  onOpenStockOut,
}: QuickActionsProps) {
  const { t } = useLanguage()

  const actions = [
    {
      title: t('add_new_product'),
      icon: PlusCircle,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/30 group-hover:bg-blue-500 group-hover:text-white',
      onClick: onOpenAddProduct
    },
    {
      title: t('record_production'),
      icon: ClipboardCheck,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-white',
      onClick: onOpenRecordProduction
    },
    {
      title: t('stock_out_btn'),
      icon: ArrowUpRight,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30 group-hover:bg-amber-500 group-hover:text-white',
      onClick: onOpenStockOut
    }
  ]

  return (
    <div className="glass-card rounded-2xl p-5 mb-6">
      <h2 className="text-base font-bold text-white tracking-wide mb-1">
        {t('quick_actions')}
      </h2>
      <p className="text-xs text-slate-400 mb-4">
        {t('quick_actions_subtitle')}
      </p>

      <div className="space-y-2.5">
        {actions.map((action, idx) => {
          const Icon = action.icon

          return (
            <button
              key={idx}
              onClick={action.onClick}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-[#1E293B] bg-[#0F172A] hover:bg-[#1E2D47] transition-all group text-left shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border transition-all ${action.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                  {action.title}
                </h4>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
