'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('adminsatu@forge.inc')
  const [password, setPassword] = useState('password123')
  const [maintainSession, setMaintainSession] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6060'
      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Invalid work email or security key')
      }

      setSuccessMsg(`Authenticated successfully as ${data.user?.Username || email}! Redirecting...`)

      if (typeof window !== 'undefined') {
        localStorage.setItem('forge_token', data.token || 'authenticated')
        localStorage.setItem('forge_user', JSON.stringify(data.user || { Username: email }))
      }

      setTimeout(() => {
        router.push('/')
      }, 800)
    } catch (err: any) {
      setError(err.message || 'Authentication server unreachable')
    } finally {
      setLoading(false)
    }
  }

  const handleSSOLogin = () => {
    alert('Redirecting to Microsoft Entra ID SSO Identity Provider...')
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4 font-sans text-slate-100 relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#111827] border border-[#1E293B] rounded-2xl p-8 shadow-2xl relative z-10 animate-fade-in">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#1E293B] border border-slate-700 p-2 flex items-center justify-center mb-3">
            <span className="font-extrabold text-lg text-white tracking-tight">F</span>
          </div>

          <h1 className="text-xl font-black text-white tracking-wide uppercase">
            Forge
          </h1>
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">
            ENTERPRISE AUTOMATION
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 text-xs">
          {/* WORK EMAIL */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
              WORK EMAIL
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="adminsatu@forge.inc"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* SECURITY KEY */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                SECURITY KEY
              </label>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert('Reset key request initiated'); }}
                className="text-slate-400 hover:text-white text-[10px] font-medium"
              >
                Forgot key?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Maintain active session Checkbox */}
          <div className="flex items-center py-0.5">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={maintainSession}
                onChange={(e) => setMaintainSession(e.target.checked)}
                className="rounded border-[#1E293B] bg-[#090D16] text-blue-600 focus:ring-0"
              />
              <span>Maintain active session</span>
            </label>
          </div>

          {/* Authenticate Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-300 text-slate-950 font-bold py-2.5 rounded-xl transition-all text-xs disabled:opacity-50 shadow-md"
          >
            <span>{loading ? 'Authenticating...' : 'Authenticate'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* External Provider Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1E293B]"></div>
          </div>
          <span className="relative bg-[#111827] px-3 text-[10px] text-slate-500 font-medium">
            External Provider
          </span>
        </div>

        {/* SSO via Microsoft Entra Button */}
        <button
          type="button"
          onClick={handleSSOLogin}
          className="w-full flex items-center justify-center gap-2.5 bg-[#090D16] hover:bg-[#162032] border border-[#1E293B] text-slate-200 text-xs font-semibold py-2.5 rounded-xl transition-all"
        >
          <div className="w-3.5 h-3.5 bg-blue-500 rounded-sm flex items-center justify-center text-[9px] font-black text-white">
            M
          </div>
          <span>SSO via Microsoft Entra</span>
        </button>

        {/* Security Notice Footer */}
        <div className="mt-8 text-center text-[10px] text-slate-500 leading-relaxed">
          <p>Secure Terminal Connection established.</p>
          <p>Unauthorized access is strictly prohibited.</p>
        </div>
      </div>
    </div>
  )
}
