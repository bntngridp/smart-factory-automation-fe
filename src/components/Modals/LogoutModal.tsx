'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, X, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const { t, formatNumber } = useLanguage()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleConfirmLogout = async () => {
    setLoading(true)

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6060'
      // Call backend logout endpoint to clear httpOnly cookie
      await fetch(`${apiBase}/api/auth/logout`, {
        method: 'POST',
      })
    } catch (err) {
      console.error('Logout API error:', err)
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('forge_token')
        localStorage.removeItem('forge_user')
      }
      setLoading(false)
      onClose()
      router.push('/login')
    }
  }

  // Retrieve current user
  let username = 'Bintang R. (Admin)'
  if (typeof window !== 'undefined') {
    const savedUser = localStorage.getItem('forge_user')
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        username = parsed.Username || username
      } catch {}
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#162032] border border-[#1E293B] rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-3 shadow-lg shadow-rose-500/10">
            <LogOut className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-extrabold text-white tracking-tight">
            {t('confirm_sign_out')}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
            {t('sign_out_desc')}
          </p>
        </div>

        {/* User Session Info Card */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-3.5 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm uppercase">
              {username.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h4 className="font-bold text-white text-xs leading-tight">{username}</h4>
              <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium mt-0.5">
                <ShieldCheck className="w-3 h-3 text-slate-400" />
                {t('active_session')}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Port {formatNumber(6061)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white font-semibold bg-[#0F172A] border border-[#1E293B] hover:bg-[#1E2D47] transition-all text-xs"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirmLogout}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-rose-500/20 transition-all text-xs disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span>{loading ? t('signing_out') : t('yes_sign_out')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
