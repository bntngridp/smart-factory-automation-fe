'use client'

import React, { useState } from 'react'
import {
  BookOpen,
  FileQuestion,
  Headphones,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Layers,
  ArrowLeft,
  X,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Gauge,
  Boxes,
  ClipboardList,
  Sliders,
  Sparkles
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface HelpModuleProps {
  onBackToDashboard: () => void
  onNavigateTab?: (tabId: string) => void
}

interface GuideDetail {
  id: string
  icon: React.ElementType
  title: string
  desc: string
  tag: string
  overview: string
  steps: {
    title: string
    desc: string
    icon: React.ElementType
    points?: string[]
  }[]
  proTips: string
  actionLabel?: string
  actionTab?: string
}

export default function HelpModule({ onBackToDashboard, onNavigateTab }: HelpModuleProps) {
  const { t, language } = useLanguage()
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null)

  const guides: GuideDetail[] = [
    {
      id: 'quick-start',
      icon: Cpu,
      title: t('quick_start_guide'),
      desc: t('quick_start_guide_desc'),
      tag: 'Core',
      overview: language === 'id'
        ? 'Panduan ringkas untuk memahami navigasi utama dasbor eksekutif, membaca telemetri workstation secara real-time, dan mengonfigurasi personalisasi antarmuka pabrik cerdas.'
        : 'Quick guide to understanding the executive dashboard navigation, reading real-time workstation telemetry, and customizing smart factory UI preferences.',
      steps: [
        {
          title: language === 'id' ? '1. Membaca Metrik Kinerja Utama (KPIs)' : '1. Reading Core Performance Metrics (KPIs)',
          desc: language === 'id'
            ? 'Pantau 4 kartu telemetri utama di bagian atas dasbor: Efisiensi OEE (Overall Equipment Effectiveness), Total Output Produksi Harian, Utilisasi Mesin Aktif, dan Estimasi Laju Unit per Jam.'
            : 'Monitor the 4 core telemetry cards: Overall Equipment Effectiveness (OEE), Total Daily Production Output, Active Machine Utilization, and Hourly Production Rate.',
          icon: Gauge,
          points: [
            language === 'id' ? 'OEE Standar Industri: > 85% untuk efisiensi kelas dunia (World-Class).' : 'Industry Standard OEE: > 85% for world-class efficiency.',
            language === 'id' ? 'Utilisasi Mesin: Memantau 3 lini manufaktur secara kontinu.' : 'Machine Utilization: Continuous monitoring across all 3 production lines.'
          ]
        },
        {
          title: language === 'id' ? '2. Filter Rentang Waktu Analisis (7H, 30H, YTD)' : '2. Timeframe Filter Selection (7D, 30D, YTD)',
          desc: language === 'id'
            ? 'Gunakan pemilih periode waktu di pojok kanan atas grafik telemetri untuk menganalisis tren performa historis dan fluktuasi output produksi.'
            : 'Use the period filter in the chart header to evaluate historical performance trends and production fluctuations.',
          icon: Sliders
        },
        {
          title: language === 'id' ? '3. Aksi Cepat Lantai Pabrik' : '3. Floor Operational Quick Actions',
          desc: language === 'id'
            ? 'Gunakan kartu "Aksi Cepat" untuk mencatat produksi shift, mendata mutasi stok keluar, atau mendaftarkan SKU komponen baru tanpa meninggalkan dasbor.'
            : 'Leverage "Quick Actions" to record shift output, log stock-out mutations, or register new components directly from dashboard.',
          icon: Sparkles
        },
        {
          title: language === 'id' ? '4. Personalisasi Tema & Keamanan 2FA' : '4. Theme Personalization & 2FA Security',
          desc: language === 'id'
            ? 'Buka menu Pengaturan untuk beralih antara Mode Gelap/Terang, mengatur Kepadatan UI (Standar/Kompak), memilih Warna Aksen Telemetri, dan mengaktifkan Autentikasi Dua Faktor (2FA).'
            : 'Visit Settings to toggle Dark/Light mode, adjust UI density, choose Telemetry Accent Colors, and configure Two-Factor Authentication (2FA).',
          icon: ShieldAlert
        }
      ],
      proTips: language === 'id'
        ? 'Gunakan pintasan keyboard atau tombol toggle di header atas untuk berpindah mode tema dengan cepat saat kondisi pencahayaan di lantai pabrik berubah.'
        : 'Use header toggle buttons to switch themes seamlessly when lighting conditions on the factory floor change.',
      actionLabel: language === 'id' ? 'Buka Dasbor Eksekutif' : 'Open Executive Dashboard',
      actionTab: 'dashboard'
    },
    {
      id: 'production-flow',
      icon: Layers,
      title: t('production_flow_guide'),
      desc: t('production_flow_guide_desc'),
      tag: 'Workflow',
      overview: language === 'id'
        ? 'Standar Operasional Prosedur (SOP) penginputan hasil kerja per shift, verifikasi operator, dan mekanisme sinkronisasi inventaris gudang secara otomatis.'
        : 'Standard Operating Procedure (SOP) for recording shift production logs, operator validation, and automated inventory sync.',
      steps: [
        {
          title: language === 'id' ? '1. Verifikasi Kesiapan Mesin & Operator' : '1. Machine Readiness & Operator Verification',
          desc: language === 'id'
            ? 'Sebelum memulai pencatatan, pastikan lini manufaktur beroperasi normal dan nomor batch komponen bahan baku telah sesuai dengan Surat Perintah Kerja (SPK).'
            : 'Ensure manufacturing lines are operational and raw material batch numbers match work orders before logging output.',
          icon: ClipboardList,
          points: [
            language === 'id' ? 'Periksa status workstation di kartu Status Sistem' : 'Verify workstation status in System Status card',
            language === 'id' ? 'Pastikan nama operator terdaftar dalam shift aktif' : 'Ensure operator name matches active shift roster'
          ]
        },
        {
          title: language === 'id' ? '2. Penginputan Log Produksi Selesai (Finished Goods)' : '2. Logging Finished Goods Production',
          desc: language === 'id'
            ? 'Klik tombol "Catat Produksi", pilih SKU Produk yang diproduksi, masukkan jumlah kuantitas unit selesai yang lolos Quality Control (QC), dan isi nama penanggung jawab.'
            : 'Click "Record Production", select product SKU, input QC-passed finished unit quantity, and submit operator name.',
          icon: Boxes
        },
        {
          title: language === 'id' ? '3. Pembaruan Otomatis Stok Gudang' : '3. Real-Time Warehouse Stock Update',
          desc: language === 'id'
            ? 'Sistem secara otomatis menambah saldo stok gudang sesuai kuantitas log dan mengupdate rasio pencapaian target shift produksi harian.'
            : 'System automatically credits warehouse inventory with logged units and updates daily shift target fulfillment rate in real time.',
          icon: CheckCircle2
        },
        {
          title: language === 'id' ? '4. Penanganan Downtime & Laporan Cacat (Defect)' : '4. Downtime Handling & Defect Reporting',
          desc: language === 'id'
            ? 'Jika terjadi kendala teknis atau unit cacat, buat catatan khusus pada log riwayat untuk memicu pemberitahuan ke tim maintenance & rekayasa proses.'
            : 'Log special remarks if machine anomalies or defects occur to trigger alert notifications for maintenance engineers.',
          icon: AlertTriangle
        }
      ],
      proTips: language === 'id'
        ? 'Lakukan input log produksi secara berkala setiap 2 jam atau di akhir setiap sub-batch agar data telemetri OEE tetap akurat dan tidak menumpuk di akhir shift.'
        : 'Log production every 2 hours or at the end of each sub-batch to ensure real-time OEE accuracy across shifts.',
      actionLabel: language === 'id' ? 'Buka Catatan Produksi' : 'Open Production Logs',
      actionTab: 'production-logs'
    },
    {
      id: 'inventory-rules',
      icon: ShieldAlert,
      title: t('inventory_rules_guide'),
      desc: t('inventory_rules_guide_desc'),
      tag: 'Audit',
      overview: language === 'id'
        ? 'Pedoman pengelolaan keselamatan stok gudang, batas ambang minimum (Safety Stock Threshold), klasifikasi zona rak, dan tata kelola ekspor audit material.'
        : 'Guidelines for warehouse safety stock thresholds, low-stock alerts, shelf zone utilization, and inventory audit reporting.',
      steps: [
        {
          title: language === 'id' ? '1. Menetapkan Batas Safety Stock Tiap SKU' : '1. Configuring SKU Safety Stock Thresholds',
          desc: language === 'id'
            ? 'Setiap produk dan suku cadang memiliki batas minimum ketersediaan. Batas ini mencegah terhentinya lini perakitan akibat keterlambatan pasokan supplier.'
            : 'Each product SKU has a predefined minimum threshold to prevent assembly stoppage caused by vendor supply delays.',
          icon: ShieldAlert,
          points: [
            language === 'id' ? 'Komponen Kritis: Safety stock disarankan minimal 50-100 unit' : 'Critical Components: Suggested safety stock 50-100 units',
            language === 'id' ? 'Material Umum: Safety stock disesuaikan dengan lead time pengiriman' : 'General Hardware: Adjusted based on supplier lead time'
          ]
        },
        {
          title: language === 'id' ? '2. Tingkatan Peringatan Stok (Alert Levels)' : '2. Inventory Warning & Status Levels',
          desc: language === 'id'
            ? 'Sistem mengelompokkan stok ke dalam 3 status: Stok Aman (Hijau), Stok Menipis (Amber, saat stok <= batas minimum), dan Stok Habis (Merah, stok = 0).'
            : 'System categorizes stock into 3 statuses: Safe Stock (Green), Low Stock (Amber, when stock <= threshold), and Out of Stock (Red, stock = 0).',
          icon: AlertTriangle
        },
        {
          title: language === 'id' ? '3. Utilisasi Zona Rak & Telemetri Lingkungan' : '3. Shelf Zone Utilization & Environmental Telemetry',
          desc: language === 'id'
            ? 'Barang disusun berdasarkan 4 zona rak (Mekanikal, Elektrikal, Sensor/Valve, Bahan Mentah) dengan pemantauan suhu (~22.4°C) dan kelembaban (~48% RH) gudang.'
            : 'Goods are arranged across 4 rack zones (Mechanical, Electrical, Sensors/Valves, Raw Materials) with temperature and humidity telemetry.',
          icon: Boxes
        },
        {
          title: language === 'id' ? '4. Prosedur Audit & Ekspor Rekapitulasi' : '4. Audit Procedures & Data Export',
          desc: language === 'id'
            ? 'Gunakan tombol Ekspor Data di header untuk mengunduh rekap mutasi inventaris dalam format CSV, Excel (.xlsx), atau PDF resmi untuk keperluan audit bulanan.'
            : 'Use Export Data button in the header to download inventory records in CSV, Excel (.xlsx), or official PDF format for monthly audits.',
          icon: BookOpen
        }
      ],
      proTips: language === 'id'
        ? 'Periksa tabel "Peringatan Stok Rendah" di dasbor setiap awal shift untuk segera membuat pesanan pengadaan (Purchase Order) pada komponen berstatus menipis.'
        : 'Check the "Low Stock Alerts" table at the start of each shift to initiate timely purchase orders for dwindling components.',
      actionLabel: language === 'id' ? 'Buka Katalog Inventaris' : 'Open Inventory Catalog',
      actionTab: 'inventory'
    }
  ]

  const activeGuide = guides.find((g) => g.id === selectedGuideId) || null

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

  const handleActionClick = (tabId?: string) => {
    if (!tabId) return
    setSelectedGuideId(null)
    if (onNavigateTab) {
      onNavigateTab(tabId)
    } else if (tabId === 'dashboard') {
      onBackToDashboard()
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {t('help_center_title')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t('help_center_subtitle')}
          </p>
        </div>

        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 bg-[#162032] hover:bg-[#1E2D47] border border-[#1E293B] text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('back_to_dashboard')}</span>
        </button>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {guides.map((g) => {
          const Icon = g.icon
          return (
            <div
              key={g.id}
              onClick={() => setSelectedGuideId(g.id)}
              className="glass-card rounded-2xl p-5 border border-[#1E293B] hover:border-blue-500/40 transition-all group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/50 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md">
                    {g.tag}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-blue-500 transition-colors">
                  {g.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {g.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                <span className="mr-1.5">{t('view')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          )
        })}
      </div>

      {/* FAQ Section */}
      <div className="glass-card rounded-2xl p-6 border border-[#1E293B]">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/50 shrink-0">
            <FileQuestion className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white tracking-wide">
            {t('faq_title')}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B]"
            >
              <h4 className="text-xs font-bold text-white mb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0"></span>
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
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/50 shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{t('contact_support')}</h4>
            <p className="text-xs text-slate-400">{t('support_team_hours')}</p>
          </div>
        </div>

        <button
          onClick={() => alert('Support ticket system: support@smartfactory.local (Response SLA: < 15 mins)')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>{t('open_support_ticket')}</span>
        </button>
      </div>

      {/* COMPREHENSIVE INTERACTIVE GUIDE / SOP READER MODAL */}
      {activeGuide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl w-full max-w-2xl p-6 space-y-6 shadow-2xl relative my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#1E293B] gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/50 shrink-0">
                  <activeGuide.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white tracking-tight">{activeGuide.title}</h3>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md">
                      {activeGuide.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{activeGuide.desc}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedGuideId(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#162032] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overview Banner */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 text-xs text-slate-300 leading-relaxed">
              {activeGuide.overview}
            </div>

            {/* Detailed Step-by-Step SOP Sections */}
            <div className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1">
              {activeGuide.steps.map((step, idx) => {
                const StepIcon = step.icon
                return (
                  <div
                    key={idx}
                    className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400 shrink-0">
                        <StepIcon className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-xs font-bold text-white">{step.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-8.5">
                      {step.desc}
                    </p>
                    {step.points && step.points.length > 0 && (
                      <ul className="pl-8.5 space-y-1 pt-1">
                        {step.points.map((pt, pIdx) => (
                          <li key={pIdx} className="text-[11px] text-slate-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Pro Tip Box */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3.5 text-xs flex items-start gap-3">
              <Lightbulb className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-blue-400 block mb-0.5">
                  {language === 'id' ? 'Tips Operasional Pabrik' : 'Factory Operational Tip'}
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">{activeGuide.proTips}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[#1E293B]">
              <button
                type="button"
                onClick={() => setSelectedGuideId(null)}
                className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                {t('cancel')}
              </button>

              {activeGuide.actionLabel && (
                <button
                  type="button"
                  onClick={() => handleActionClick(activeGuide.actionTab)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all text-xs cursor-pointer"
                >
                  <span>{activeGuide.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

