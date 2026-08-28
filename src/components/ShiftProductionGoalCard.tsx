'use client'

import React, { useMemo, useState, useEffect } from 'react'
import {
  Plus,
  Award
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'

interface ShiftProductionGoalCardProps {
  todayOutput: number
  targetQuota?: number
  onRecordProduction?: () => void
}

export default function ShiftProductionGoalCard({
  todayOutput,
  targetQuota: propTargetQuota,
  onRecordProduction
}: ShiftProductionGoalCardProps) {
  const { theme } = useTheme()
  const { t, formatNumber } = useLanguage()
  const [configTarget, setConfigTarget] = useState<number | null>(null)

  const isLight = theme === 'light'

  // Real-time Shift Detection based on local client hour
  const currentShift = useMemo(() => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 14) {
      return {
        key: 'shift1Target',
        name: t('morning_shift'),
        code: 'SHIFT-1',
        timeRange: '06:00 - 14:00',
        defaultTarget: 500,
        badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
      }
    } else if (hour >= 14 && hour < 22) {
      return {
        key: 'shift2Target',
        name: t('afternoon_shift'),
        code: 'SHIFT-2',
        timeRange: '14:00 - 22:00',
        defaultTarget: 450,
        badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
      }
    } else {
      return {
        key: 'shift3Target',
        name: t('night_shift'),
        code: 'SHIFT-3',
        timeRange: '22:00 - 06:00',
        defaultTarget: 400,
        badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
      }
    }
  }, [t])

  // Sync with Factory Operations Config in Settings
  useEffect(() => {
    const readSavedConfig = () => {
      try {
        const saved = localStorage.getItem('forge_factory_operations_config')
        if (saved) {
          const parsed = JSON.parse(saved)
          const val = parsed[currentShift.key]
          if (val !== undefined && !isNaN(Number(val))) {
            setConfigTarget(Number(val))
            return
          }
        }
      } catch {}
      setConfigTarget(currentShift.defaultTarget)
    }

    readSavedConfig()
    window.addEventListener('forge_factory_config_change', readSavedConfig)
    return () => window.removeEventListener('forge_factory_config_change', readSavedConfig)
  }, [currentShift])

  const targetQuota = propTargetQuota ?? configTarget ?? currentShift.defaultTarget

  const completionPercent = Math.min(
    Math.round((todayOutput / targetQuota) * 100),
    100
  ) || 0

  const isTargetAchieved = todayOutput >= targetQuota

  // Circumference for 40 radius circle = 2 * PI * 40 = 251.2
  const strokeDashoffset = 251.2 - (251.2 * completionPercent) / 100

  return (
    <div className="glass-card rounded-2xl p-5 text-center shadow-lg transition-all animate-fade-in">
      {/* Header with Title & Live Shift Badge */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <h2 className="text-base font-bold text-white tracking-wide text-left">
          {t('shift_target_title')}
        </h2>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border tracking-wider uppercase flex items-center gap-1.5 shrink-0 ${currentShift.badgeColor}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          {currentShift.code}
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-4 text-left leading-relaxed">
        {t('shift_target_subtitle')}
      </p>

      {/* Circular Target Progress Gauge */}
      <div className="relative w-32 h-32 mx-auto my-1 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Track - Theme sensitive */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={isLight ? '#E2E8F0' : '#1E293B'}
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress Track */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={isTargetAchieved ? '#10B981' : '#3B82F6'}
            strokeWidth="8"
            strokeDasharray="251.2"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-white font-mono tracking-tight">
            {formatNumber(completionPercent)}%
          </span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            {t('target_achieved')}
          </span>
        </div>
      </div>

      {/* Clean Metrics Row: Output & Remaining */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#1E293B] text-xs">
        <div className="p-2.5 rounded-xl bg-[#0F172A] border border-[#1E293B] text-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
            {t('live_output')}
          </span>
          <span className="text-sm font-bold text-emerald-400 font-mono">
            {formatNumber(todayOutput)} <span className="text-[11px] font-normal text-slate-400">{t('units')}</span>
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#0F172A] border border-[#1E293B] text-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
            {t('target_quota')}
          </span>
          <span className="text-sm font-bold text-white font-mono">
            {formatNumber(targetQuota)} <span className="text-[11px] font-normal text-slate-400">{t('units')}</span>
          </span>
        </div>
      </div>

      {/* Action CTA Button */}
      {onRecordProduction && (
        <button
          type="button"
          onClick={onRecordProduction}
          className="w-full mt-3.5 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          {isTargetAchieved ? (
            <Award className="w-3.5 h-3.5" />
          ) : (
            <Plus className="w-3.5 h-3.5" />
          )}
          <span>{t('log_production_cta')}</span>
        </button>
      )}
    </div>
  )
}
