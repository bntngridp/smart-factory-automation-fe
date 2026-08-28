'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Smartphone,
  KeyRound,
  ChevronLeft
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { MicrosoftLogo } from '@/components/MicrosoftLogo'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('adminsatu@forge.inc')
  const [password, setPassword] = useState('password123')
  const [maintainSession, setMaintainSession] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // 2FA Challenge States
  const [requires2FA, setRequires2FA] = useState(false)
  const [tempToken, setTempToken] = useState<string | null>(null)
  const [twoFACode, setTwoFACode] = useState('')
  const [twoFAUsername, setTwoFAUsername] = useState('')

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

      // Check if 2FA is required for this account
      if (data.requires2FA && data.tempToken) {
        setRequires2FA(true)
        setTempToken(data.tempToken)
        setTwoFAUsername(data.user?.Username || email)
        setSuccessMsg(null)
        setLoading(false)
        return
      }

      setSuccessMsg(`Authenticated successfully as ${data.user?.Username || email}! Redirecting...`)

      if (typeof window !== 'undefined') {
        localStorage.setItem('forge_token', data.token || 'authenticated')
        localStorage.setItem('forge_user', JSON.stringify(data.user || { Username: email }))
      }

      setTimeout(() => {
        router.push('/')
      }, 800)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication server unreachable'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tempToken || !twoFACode.trim()) {
      setError('Please enter your 6-digit TOTP code or emergency recovery code')
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6060'
      const res = await fetch(`${apiBase}/api/auth/2fa/verify-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tempToken,
          code: twoFACode.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Invalid 2FA authentication code')
      }

      setSuccessMsg(`2FA Verified successfully! Redirecting as ${data.user?.Username || twoFAUsername}...`)

      if (typeof window !== 'undefined') {
        localStorage.setItem('forge_token', data.token || 'authenticated')
        localStorage.setItem('forge_user', JSON.stringify(data.user || { Username: twoFAUsername }))
      }

      setTimeout(() => {
        router.push('/')
      }, 800)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '2FA verification failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setRequires2FA(false)
    setTempToken(null)
    setTwoFACode('')
    setError(null)
    setSuccessMsg(null)
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
          <Logo size="lg" className="mb-3" />

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

        {/* STEP 1: REGULAR CREDENTIALS LOGIN */}
        {!requires2FA ? (
          <>
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
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition-all text-xs disabled:opacity-50 shadow-md cursor-pointer outline-none focus:outline-none"
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
              className="w-full flex items-center justify-center gap-3 bg-[#0D131F] hover:bg-[#162032] border border-[#1E293B] hover:border-slate-700 text-slate-200 hover:text-white text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer shadow-sm group"
            >
              <MicrosoftLogo size={16} className="transition-transform group-hover:scale-110" />
              <span>SSO via Microsoft Entra</span>
            </button>
          </>
        ) : (
          /* STEP 2: 2FA TOTP CHALLENGE SCREEN */
          <div className="space-y-5 text-xs animate-fade-in">
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center gap-3.5 text-purple-300">
              <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-xs">Two-Factor Authentication</h3>
                <p className="text-[11px] text-purple-200/80 mt-0.5">
                  Account <span className="font-semibold text-white">{twoFAUsername}</span> is protected with 2FA.
                </p>
              </div>
            </div>

            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                  AUTHENTICATOR OR RECOVERY CODE
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={12}
                    placeholder="e.g. 123456 or ABCD-EFGH"
                    value={twoFACode}
                    onChange={(e) => setTwoFACode(e.target.value.toUpperCase())}
                    className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl pl-10 pr-4 py-3 text-white font-mono tracking-widest text-center text-sm placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5 text-center">
                  Open Google Authenticator, Microsoft Authenticator, or enter a backup code.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !twoFACode.trim()}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all text-xs disabled:opacity-50 shadow-lg shadow-purple-600/20 cursor-pointer outline-none focus:outline-none"
              >
                <span>{loading ? 'Verifying 2FA...' : 'Verify & Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full flex items-center justify-center gap-1.5 text-slate-400 hover:text-white text-xs py-2 transition-colors cursor-pointer outline-none focus:outline-none"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to credentials login</span>
              </button>
            </form>
          </div>
        )}

        {/* Security Notice Footer */}
        <div className="mt-8 text-center text-[10px] text-slate-500 leading-relaxed">
          <p>Secure Terminal Connection established.</p>
          <p>Unauthorized access is strictly prohibited.</p>
        </div>
      </div>
    </div>
  )
}
