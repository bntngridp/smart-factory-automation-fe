'use client'

import React, { useMemo } from 'react'
import {
  Clock,
  Plus,
  Zap,
  Award
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface ShiftProductionGoalCardProps {
  todayOutput: number
  targetQuota?: number
  onRecordProduction?: () => void
}

export default function ShiftProductionGoalCard({
  todayOutput,
  targetQuota = 1200,
  onRecordProduction
}: ShiftProductionGoalCardProps) {
  const { t, formatNumber } = useLanguage()

  // Real-time Shift Detection based on local client hour
  const currentShift = useMemo(() => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 14) {
      return {
        name: t('morning_shift'),
        code: 'SHIFT-1',
        timeRange: '06:00 - 14:00',
        badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
      }
    } else if (hour >= 14 && hour < 22) {
      return {
        name: t('afternoon_shift'),
        code: 'SHIFT-2',
        timeRange: '14:00 - 22:00',
        badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
      }
    } else {
      return {
        name: t('night_shift'),
        code: 'SHIFT-3',
        timeRange: '22:00 - 06:00',
        badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
      }
    }
  }, [t])

  const completionPercent = Math.min(
    Math.round((todayOutput / targetQuota) * 100),
    100
  ) || 0

  const remainingUnits = Math.max(targetQuota - todayOutput, 0)
  const isTargetAchieved = todayOutput >= targetQuota

  // Circumference for 40 radius circle = 2 * PI * 40 = 251.2
  const strokeDashoffset = 251.2 - (251.2 * completionPercent) / 100

  return (
    <div className="glass-card rounded-2xl p-5 text-center shadow-lg transition-all animate-fade-in">
      {/* Header with Title & Live Shift Pill */}
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

      <p className="text-xs text-slate-400 mb-5 text-left leading-relaxed">
        {t('shift_target_subtitle')}
      </p>

      {/* Circular Target Progress Gauge */}
      <div className="relative w-36 h-36 mx-auto my-2 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Track */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#1E293B"
            strokeWidth="7"
            fill="transparent"
          />
          {/* Progress Track */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={isTargetAchieved ? '#10B981' : '#3B82F6'}
            strokeWidth="7"
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
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            {t('target_achieved')}
          </span>
        </div>
      </div>

      {/* Target Metrics Numbers */}
      <div className="flex items-center justify-center gap-6 mt-3">
        <div className="text-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            {t('live_output')}
          </span>
          <span className="text-base font-extrabold text-emerald-400 font-mono">
            {formatNumber(todayOutput)} <span className="text-xs font-normal text-slate-400">{t('units')}</span>
          </span>
        </div>

        <div className="w-px h-8 bg-[#1E293B]"></div>

        <div className="text-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            {t('target_quota')}
          </span>
          <span className="text-base font-extrabold text-white font-mono">
            {formatNumber(targetQuota)} <span className="text-xs font-normal text-slate-400">{t('units')}</span>
          </span>
        </div>
      </div>

      {/* Micro Status Indicators Bar */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#1E293B] text-[11px]">
        <div className="bg-[#0F172A] p-2.5 rounded-xl border border-[#1E293B] flex items-center justify-between text-left">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold">{t('line_efficiency')}</span>
          </div>
          <span className="font-mono font-bold text-emerald-400">98.4%</span>
        </div>

        <div className="bg-[#0F172A] p-2.5 rounded-xl border border-[#1E293B] flex items-center justify-between text-left">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="font-semibold">{t('remaining_target')}</span>
          </div>
          <span className="font-mono font-bold text-white">
            {formatNumber(remainingUnits)}
          </span>
        </div>
      </div>

      {/* Action CTA Button */}
      {onRecordProduction && (
        <button
          type="button"
          onClick={onRecordProduction}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
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
