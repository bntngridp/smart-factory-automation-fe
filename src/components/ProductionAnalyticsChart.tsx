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
import { TrendingUp } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useLanguage } from '@/context/LanguageContext'

export default function ProductionAnalyticsChart() {
  const { theme } = useTheme()
  const { t, formatNumber } = useLanguage()
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | 'YTD'>('30D')

  const isLight = theme === 'light'

  const chartData = [
    { name: t('days_mon'), production: 1100, inventory: 80000 },
    { name: t('days_tue'), production: 1250, inventory: 81200 },
    { name: t('days_wed'), production: 1380, inventory: 81900 },
    { name: t('days_thu'), production: 1240, inventory: 82450 },
    { name: t('days_fri'), production: 1420, inventory: 83100 },
    { name: t('days_sat'), production: 980, inventory: 83500 },
    { name: t('days_sun'), production: 850, inventory: 83900 },
  ]

  const timeframes: Array<{ id: '7D' | '30D' | 'YTD'; label: string }> = [
    { id: '7D', label: t('tf_7d') },
    { id: '30D', label: t('tf_30d') },
    { id: 'YTD', label: t('tf_ytd') },
  ]

  return (
    <div className="glass-card rounded-2xl p-5 mb-6">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-wide">
              {t('production_analytics')}
            </h2>
            <span className="text-[11px] font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {t('live_output')}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t('production_analytics_subtitle')}
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center bg-[#0F172A] border border-[#1E293B] p-1 rounded-xl">
          {timeframes.map((item) => (
            <button
              key={item.id}
              onClick={() => setTimeframe(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === item.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#E2E8F0' : '#1E293B'} vertical={false} />
            <XAxis dataKey="name" stroke={isLight ? '#64748B' : '#64748B'} fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              stroke={isLight ? '#64748B' : '#64748B'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val: number) => formatNumber(val)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isLight ? '#FFFFFF' : '#162032',
                borderColor: isLight ? '#E2E8F0' : '#1E293B',
                borderRadius: '12px',
                color: isLight ? '#0F172A' : '#F8FAFC',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)'
              }}
              itemStyle={{ color: '#2563EB', fontSize: '12px' }}
              formatter={(val: unknown) => [`${formatNumber(val as number)} ${t('units')}`, t('live_output')]}
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
