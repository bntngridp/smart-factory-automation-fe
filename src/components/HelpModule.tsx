'use client'

import React from 'react'
import {
  HelpCircle,
  BookOpen,
  FileQuestion,
  Headphones,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Layers,
  ArrowLeft
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface HelpModuleProps {
  onBackToDashboard: () => void
}

export default function HelpModule({ onBackToDashboard }: HelpModuleProps) {
  const { t } = useLanguage()

  const guides = [
    {
      icon: Cpu,
      title: t('quick_start_guide'),
      desc: t('quick_start_guide_desc'),
      tag: 'Core'
    },
    {
      icon: Layers,
      title: t('production_flow_guide'),
      desc: t('production_flow_guide_desc'),
      tag: 'Workflow'
    },
    {
      icon: ShieldAlert,
      title: t('inventory_rules_guide'),
      desc: t('inventory_rules_guide_desc'),
      tag: 'Audit'
    }
  ]

  const faqs = [
    {
      q: t('faq_1_q'),
      a: t('faq_1_a')
    },
    {
      q: t('faq_2_q'),
      a: t('faq_2_a')
    },
    {
      q: t('faq_3_q'),
      a: t('faq_3_a')
    }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {t('help_center_title')}
            </h1>
            <span className="text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              {t('documentation')}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t('help_center_subtitle')}
          </p>
        </div>

        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 bg-[#162032] hover:bg-[#1E2D47] border border-[#1E293B] text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('back_to_dashboard')}</span>
        </button>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {guides.map((g, idx) => {
          const Icon = g.icon
          return (
            <div
              key={idx}
              className="glass-card rounded-2xl p-5 border border-[#1E293B] hover:border-blue-500/40 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-[#0F172A] border border-[#1E293B] px-2 py-0.5 rounded-md">
                  {g.tag}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-blue-400 transition-colors">
                {g.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {g.desc}
              </p>
              <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                <span className="mr-1.5">{t('view')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          )
        })}
      </div>

      {/* FAQ Section */}
      <div className="glass-card rounded-2xl p-6 border border-[#1E293B]">
        <div className="flex items-center gap-2 mb-5">
          <FileQuestion className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white tracking-wide">
            {t('faq_title')}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B]"
            >
              <h4 className="text-xs font-bold text-white mb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                {faq.q}
              </h4>
              <p className="text-xs text-slate-400 pl-3.5 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Technical Support Footer */}
      <div className="glass-card rounded-2xl p-5 border border-[#1E293B] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{t('contact_support')}</h4>
            <p className="text-xs text-slate-400">{t('support_team_hours')}</p>
          </div>
        </div>

        <button
          onClick={() => alert('Support ticket system opened: support@forge.inc')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>{t('open_support_ticket')}</span>
        </button>
      </div>
    </div>
  )
}
