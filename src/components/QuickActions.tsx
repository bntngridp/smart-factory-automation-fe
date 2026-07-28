'use client'

import React from 'react'
import { PlusCircle, ClipboardCheck, ArrowUpRight } from 'lucide-react'

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
  const actions = [
    {
      title: 'Add Product',
      description: 'Create new master item or component',
      icon: PlusCircle,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20',
      onClick: onOpenAddProduct
    },
    {
      title: 'Record Production',
      description: 'Log daily output & auto-mutate stock IN',
      icon: ClipboardCheck,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20',
      onClick: onOpenRecordProduction
    },
    {
      title: 'Stock Out',
      description: 'Record inventory output with stock validation',
      icon: ArrowUpRight,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20',
      onClick: onOpenStockOut
    }
  ]

  return (
    <div className="glass-card rounded-2xl p-5 mb-6">
      <h2 className="text-base font-bold text-white tracking-wide mb-1">
        Quick Actions
      </h2>
      <p className="text-xs text-slate-400 mb-4">
        Direct operational inputs & factory logs
      </p>

      <div className="space-y-3">
        {actions.map((action, idx) => {
          const Icon = action.icon

          return (
            <button
              key={idx}
              onClick={action.onClick}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#1E293B] bg-[#0F172A]/60 hover:bg-[#1E2D47] transition-all group text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${action.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {action.description}
                  </p>
                </div>
              </div>
              <span className="text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all text-xs font-semibold">
                →
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
