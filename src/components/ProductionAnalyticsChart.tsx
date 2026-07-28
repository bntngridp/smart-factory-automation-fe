'use client'

import React, { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { TrendingUp, Calendar } from 'lucide-react'

const sampleChartData = [
  { name: 'Mon', production: 1100, inventory: 80000 },
  { name: 'Tue', production: 1250, inventory: 81200 },
  { name: 'Wed', production: 1380, inventory: 81900 },
  { name: 'Thu', production: 1240, inventory: 82450 },
  { name: 'Fri', production: 1420, inventory: 83100 },
  { name: 'Sat', production: 980, inventory: 83500 },
  { name: 'Sun', production: 850, inventory: 83900 },
]

export default function ProductionAnalyticsChart() {
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | 'YTD'>('30D')

  return (
    <div className="glass-card rounded-2xl p-5 mb-6">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-wide">
              Production Analytics
            </h2>
            <span className="text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Live Output
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time daily manufacturing & yield efficiency trend
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center bg-[#0F172A] border border-[#1E293B] p-1 rounded-xl">
          {(['7D', '30D', 'YTD'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTimeframe(item)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === item
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={sampleChartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#162032',
                borderColor: '#1E293B',
                borderRadius: '12px',
                color: '#F8FAFC',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
              itemStyle={{ color: '#60A5FA', fontSize: '12px' }}
              formatter={(val: any) => [`${val} units`, 'Production']}
            />
            <Area
              type="monotone"
              dataKey="production"
              stroke="#3B82F6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorProduction)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
