'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Smartphone,
  KeyRound,
  ChevronLeft,
  Eye,
  EyeOff
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { MicrosoftLogo } from '@/components/MicrosoftLogo'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('adminsatu@forge.inc')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [maintainSession, setMaintainSession] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Check URL query parameters for SSO errors / callbacks
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const errorParam = params.get('error')
      if (errorParam) {
        setError(decodeURIComponent(errorParam))
      }
    }
  }, [])

  // 2FA Challenge States
  const [requires2FA, setRequires2FA] = useState(false)
  const [tempToken, setTempToken] = useState<string | null>(null)
  const [twoFACode, setTwoFACode] = useState('')
  const [twoFAUsername, setTwoFAUsername] = useState('')

  // 2-Step Forgot Password Wizard States
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [resetStep, setResetStep] = useState<'verify_otp' | 'new_password'>('verify_otp')
  const [resetEmail, setResetEmail] = useState('adminsatu@forge.inc')
  const [resetOtp, setResetOtp] = useState('')
  const [verifiedResetToken, setVerifiedResetToken] = useState<string | null>(null)
  const [verifiedUsername, setVerifiedUsername] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

  // STEP 1: Verify OTP from Microsoft Authenticator
  const handleVerifyResetOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail.trim()) {
      setError('Masukkan email kerja atau username Anda')
      return
    }
    if (!resetOtp.trim()) {
      setError('Masukkan kode 6-digit dari Microsoft Authenticator atau Recovery Code')
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6060'
      const res = await fetch(`${apiBase}/api/auth/reset-password/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: resetEmail.trim(),
          token: resetOtp.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Verifikasi kode OTP gagal')
      }

      setVerifiedResetToken(data.resetToken)
      setVerifiedUsername(data.username || resetEmail)
      setResetStep('new_password')
      setSuccessMsg(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memverifikasi OTP'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // STEP 2: Set New Password after OTP verification
  const handleCompleteResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verifiedResetToken) {
      setError('Sesi verifikasi tidak ditemukan. Silakan ulangi langkah verifikasi OTP.')
      setResetStep('verify_otp')
      return
    }
    if (newPassword.length < 6) {
      setError('Password baru minimal harus 6 karakter')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok dengan password baru')
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6060'
      const res = await fetch(`${apiBase}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resetToken: verifiedResetToken,
          newPassword: newPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mereset kata sandi')
      }

      setSuccessMsg(data.message || 'Password berhasil diperbarui! Silakan login dengan password baru.')
      setPassword(newPassword)
      setEmail(resetEmail)
      setIsForgotPassword(false)
      setResetStep('verify_otp')
      setResetOtp('')
      setVerifiedResetToken(null)
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mereset kata sandi'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setRequires2FA(false)
    setIsForgotPassword(false)
    setResetStep('verify_otp')
    setVerifiedResetToken(null)
    setTempToken(null)
    setTwoFACode('')
    setError(null)
    setSuccessMsg(null)
  }

  const handleSSOLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6060'
      const res = await fetch(`${apiBase}/api/auth/microsoft/login?format=json`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gagal memulai autentikasi Microsoft Entra ID')
      }

      if (!data.isConfigured) {
        setError(
          'Kredensial Microsoft Entra ID (MICROSOFT_CLIENT_ID & MICROSOFT_CLIENT_SECRET) belum diisi di backend (.env). Silakan masukkan Application ID Anda di Azure Portal.'
        )
        setLoading(false)
        return
      }

      // Redirect browser ke Microsoft Login Authorization URL
      window.location.href = data.url
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Server autentikasi tidak dapat dijangkau'
      setError(msg)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4 font-sans text-slate-100 relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#111827] border border-[#1E293B] rounded-2xl p-8 shadow-2xl relative z-10 animate-fade-in">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-7">
          <Logo size="lg" className="mb-3" />

          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-wide uppercase">
            Forge
          </h1>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase mt-0.5">
            ENTERPRISE AUTOMATION
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* 1. FORGOT PASSWORD / 2-STEP MINIMALIST WIZARD */}
        {isForgotPassword ? (
          <div className="space-y-5 text-xs animate-fade-in">
            {/* Minimalist Clean Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3.5 mb-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {resetStep === 'verify_otp' ? 'Step 1 of 2' : 'Step 2 of 2'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {resetStep === 'verify_otp' ? 'OTP Verification' : 'New Security Key'}
                </span>
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {resetStep === 'verify_otp' ? 'Verifikasi Microsoft Authenticator' : 'Buat Password Baru'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-normal">
                {resetStep === 'verify_otp'
                  ? 'Masukkan email kerja dan 6-digit kode OTP dari aplikasi Microsoft Authenticator.'
                  : `Masukkan password baru untuk akun ${verifiedUsername}.`}
              </p>
            </div>

            {resetStep === 'verify_otp' ? (
              /* STEP 1: VERIFY OTP FORM */
              <form onSubmit={handleVerifyResetOTP} className="space-y-4 text-xs">
                {/* WORK EMAIL / USERNAME */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase mb-1.5">
                    WORK EMAIL / USERNAME
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="adminsatu@forge.inc"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#090D16] border border-slate-300 dark:border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-xs"
                    />
                  </div>
                </div>

                {/* AUTHENTICATOR CODE / RECOVERY CODE */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase mb-1.5">
                    6-DIGIT OTP CODE
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      autoFocus
                      maxLength={18}
                      placeholder="Contoh: 123456 atau RC-XXXX-XXXX"
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value.toUpperCase())}
                      className="w-full bg-slate-50 dark:bg-[#090D16] border border-slate-300 dark:border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-xs"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                    Buka Microsoft Authenticator lalu ketikkan 6-digit kode aktif akun Anda.
                  </p>
                </div>

                {/* SUBMIT BUTTON STEP 1 (Follows user accent color theme: Blue, Emerald, Amber, Violet) */}
                <button
                  type="submit"
                  disabled={loading || !resetOtp.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all text-xs disabled:opacity-50 shadow-md shadow-blue-600/20 cursor-pointer outline-none focus:outline-none"
                >
                  <span>{loading ? 'Memverifikasi...' : 'Verifikasi & Lanjutkan'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white text-xs font-medium py-2 transition-colors cursor-pointer outline-none focus:outline-none"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Kembali ke halaman login</span>
                </button>
              </form>
            ) : (
              /* STEP 2: SET NEW PASSWORD FORM */
              <form onSubmit={handleCompleteResetPassword} className="space-y-4 text-xs">
                {/* NEW SECURITY KEY */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase mb-1.5">
                    PASSWORD BARU
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      autoFocus
                      minLength={6}
                      placeholder="Minimal 6 karakter"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#090D16] border border-slate-300 dark:border-[#1E293B] rounded-xl pl-10 pr-11 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors cursor-pointer outline-none focus:outline-none"
                      title={showNewPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      aria-label={showNewPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* CONFIRM NEW SECURITY KEY */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase mb-1.5">
                    KONFIRMASI PASSWORD BARU
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Ulangi password baru"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#090D16] border border-slate-300 dark:border-[#1E293B] rounded-xl pl-10 pr-11 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors cursor-pointer outline-none focus:outline-none"
                      title={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* SUBMIT BUTTON STEP 2 (Follows user accent color theme) */}
                <button
                  type="submit"
                  disabled={loading || !newPassword || newPassword !== confirmPassword}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all text-xs disabled:opacity-50 shadow-md shadow-blue-600/20 cursor-pointer outline-none focus:outline-none"
                >
                  <span>{loading ? 'Menyimpan...' : 'Simpan & Perbarui Password'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setResetStep('verify_otp')
                    setError(null)
                  }}
                  className="w-full flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white text-xs font-medium py-2 transition-colors cursor-pointer outline-none focus:outline-none"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Kembali ke verifikasi OTP</span>
                </button>
              </form>
            )}
          </div>
        ) : !requires2FA ? (
          /* 2. REGULAR CREDENTIALS LOGIN */
          <>
            <form onSubmit={handleLogin} className="space-y-5 text-xs">
              {/* WORK EMAIL */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-400 tracking-wider uppercase mb-1.5">
                  WORK EMAIL
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="adminsatu@forge.inc"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#090D16] border border-slate-300 dark:border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-xs"
                  />
                </div>
              </div>

              {/* SECURITY KEY */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-400 tracking-wider uppercase">
                    SECURITY KEY
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsForgotPassword(true)
                      setResetStep('verify_otp')
                      setResetEmail(email)
                      setError(null)
                      setSuccessMsg(null)
                    }}
                    className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-[10px] font-medium transition-colors"
                  >
                    Forgot key?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#090D16] border border-slate-300 dark:border-[#1E293B] rounded-xl pl-10 pr-11 py-2.5 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors cursor-pointer outline-none focus:outline-none"
                    title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me on this device Checkbox */}
              <div className="flex items-center py-0.5">
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 cursor-pointer text-xs select-none transition-colors">
                  <input
                    type="checkbox"
                    checked={maintainSession}
                    onChange={(e) => setMaintainSession(e.target.checked)}
                    className="rounded border-slate-300 dark:border-[#1E293B] bg-slate-50 dark:bg-[#090D16] text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Remember me on this device</span>
                </label>
              </div>

              {/* Authenticate Button (Follows user accent color theme: Blue, Emerald, Amber, Violet) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all text-xs disabled:opacity-50 shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 cursor-pointer outline-none focus:outline-none"
              >
                <span>{loading ? 'Authenticating...' : 'Authenticate'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* SSO via Microsoft Entra Button */}
            <div className="mt-3">
              <button
                type="button"
                onClick={handleSSOLogin}
                className="sso-btn w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-950 border border-slate-300 hover:border-slate-400 shadow-sm dark:bg-[#162032] dark:hover:bg-[#1E293B] dark:border-[#1E293B] dark:hover:border-slate-600 dark:text-slate-200 dark:hover:text-white text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer group"
              >
                <MicrosoftLogo size={16} className="transition-transform group-hover:scale-110" />
                <span>SSO via Microsoft Entra</span>
              </button>
            </div>
          </>
        ) : (
          /* 3. 2FA TOTP CHALLENGE SCREEN */
          <div className="space-y-5 text-xs animate-fade-in">
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center gap-3.5 text-purple-300">
              <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-xs">Two-Factor Authentication</h3>
                <p className="text-[11px] text-slate-600 dark:text-purple-200/80 mt-0.5">
                  Account <span className="font-semibold text-slate-900 dark:text-white">{twoFAUsername}</span> is protected with 2FA.
                </p>
              </div>
            </div>

            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  AUTHENTICATOR OR RECOVERY CODE
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={18}
                    placeholder="e.g. 123456 or ABCD-EFGH"
                    value={twoFACode}
                    onChange={(e) => setTwoFACode(e.target.value.toUpperCase())}
                    className="w-full bg-slate-50 dark:bg-[#090D16] border border-slate-300 dark:border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white font-mono tracking-widest text-center text-xs placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5 text-center">
                  Open Google Authenticator, Microsoft Authenticator, or enter a backup code.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !twoFACode.trim()}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all text-xs disabled:opacity-50 shadow-md shadow-blue-600/20 cursor-pointer outline-none focus:outline-none"
              >
                <span>{loading ? 'Verifying 2FA...' : 'Verify & Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full flex items-center justify-center gap-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-xs py-2 transition-colors cursor-pointer outline-none focus:outline-none"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to credentials login</span>
              </button>
            </form>
          </div>
        )}

        {/* Security Notice Footer */}
        <div className="mt-8 text-center text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
          <p>Secure Terminal Connection established.</p>
          <p>Unauthorized access is strictly prohibited.</p>
        </div>
      </div>
    </div>
  )
}
