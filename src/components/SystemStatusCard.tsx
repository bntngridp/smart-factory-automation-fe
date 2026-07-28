'use client'

import React from 'react'
import { CheckCircle2, Cpu, Database, Server } from 'lucide-react'

export default function SystemStatusCard() {
  return (
    <div className="glass-card rounded-2xl p-5 mb-6 text-center">
      <h2 className="text-base font-bold text-white tracking-wide mb-1 text-left">
        System Status
      </h2>
      <p className="text-xs text-slate-400 mb-6 text-left">
        Live infrastructure & database health check
      </p>

      {/* Circular Gauge Status Indicator */}
      <div className="relative w-32 h-32 mx-auto my-2 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#1E293B"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#10B981"
            strokeWidth="8"
            strokeDasharray="251.2"
            strokeDashoffset="25"
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-full shadow-lg shadow-emerald-500/20 animate-pulse">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
      </div>

      <h3 className="text-sm font-bold text-emerald-400 mt-3">
        All Systems Nominal
      </h3>
      <p className="text-[11px] text-slate-400 mt-0.5">
        Last sync: 2 mins ago (Port 6060/6063)
      </p>

      {/* Micro Status Badges */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#1E293B] text-[10px]">
        <div className="bg-[#0F172A] p-2 rounded-lg border border-[#1E293B] flex flex-col items-center gap-1">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-300 font-semibold">MSSQL DB</span>
          <span className="text-emerald-400">Online</span>
        </div>
        <div className="bg-[#0F172A] p-2 rounded-lg border border-[#1E293B] flex flex-col items-center gap-1">
          <Server className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300 font-semibold">API Gateway</span>
          <span className="text-emerald-400">Online</span>
        </div>
        <div className="bg-[#0F172A] p-2 rounded-lg border border-[#1E293B] flex flex-col items-center gap-1">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-slate-300 font-semibold">Prisma ORM</span>
          <span className="text-emerald-400">Synced</span>
        </div>
      </div>
    </div>
  )
}
