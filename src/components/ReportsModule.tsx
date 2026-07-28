'use client'

import React, { useState } from 'react'
import {
  FileBarChart,
  Download,
  Calendar,
  TrendingUp,
  Award,
  CheckCircle2,
  PieChart as PieIcon
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'

const monthlyReportData = [
  { month: 'Jan', output: 12400, target: 11000 },
  { month: 'Feb', output: 13100, target: 12000 },
  { month: 'Mar', output: 14500, target: 13000 },
  { month: 'Apr', output: 13800, target: 13500 },
  { month: 'May', output: 15200, target: 14000 },
  { month: 'Jun', output: 16100, target: 15000 },
]

export default function ReportsModule() {
  const [reportType, setReportType] = useState('Production Summary')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Analytics & Reports
            </h1>
            <span className="text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <FileBarChart className="w-3 h-3" />
              Executive Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive manufacturing performance analytics & exports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Downloading PDF Full Report...')}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400">Monthly Target Revenue</span>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">$1.42M</h2>
          <p className="text-xs text-emerald-400 font-medium mt-1.5">+8.4% above target</p>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400">Overall Equipment Efficiency (OEE)</span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">94.2%</h2>
          <p className="text-xs text-purple-400 font-medium mt-1.5">Class A Manufacturing</p>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400">Defect Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">0.42%</h2>
          <p className="text-xs text-emerald-400 font-medium mt-1.5">-0.12% vs last quarter</p>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="glass-card rounded-2xl p-5 border border-[#1E293B]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Monthly Production Output vs Target
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Historical yield metrics for H1 2026
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="bg-[#0F172A] border border-[#1E293B] text-slate-300 text-xs rounded-xl px-3.5 py-2 focus:outline-none"
            >
              <option value="Production Summary">Production Summary</option>
              <option value="Inventory Movements">Inventory Movements</option>
              <option value="Operator Efficiency">Operator Efficiency</option>
            </select>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyReportData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#162032',
                  borderColor: '#1E293B',
                  borderRadius: '12px',
                  color: '#F8FAFC'
                }}
              />
              <Bar dataKey="target" fill="#1E2D47" radius={[6, 6, 0, 0]} name="Target" />
              <Bar dataKey="output" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Actual Output" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
