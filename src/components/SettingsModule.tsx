'use client'

import React, { useState, useEffect } from 'react'
import {
  Settings,
  User,
  Shield,
  Palette,
  Bell,
  Server,
  Search,
  Check,
  Globe,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Smartphone,
  Laptop,
  Database,
  Volume2,
  Mail,
  Sparkles,
  AlertCircle,
  Activity,
  RefreshCw
} from 'lucide-react'
import { useLanguage, Language } from '@/context/LanguageContext'
import { useTheme, AccentColor } from '@/context/ThemeContext'
import {
  getAuthMeApi,
  changePasswordApi,
  getSystemStatusApi,
  triggerDatabaseBackupApi,
  SystemStatusData,
  BackupResponseData
} from '@/services/api'

export default function SettingsModule() {
  const { language, setLanguage, t, formatNumber, formatDate, isRTL } = useLanguage()
  const {
    theme,
    setTheme,
    highContrast,
    setHighContrast,
    uiDensity,
    setUiDensity,
    accentColor,
    setAccentColor
  } = useTheme()

  const [activeSubTab, setActiveSubTab] = useState('language')
  const [searchQuery, setSearchQuery] = useState('')

  // Profile Form States (with lazy initialization from localStorage)
  const [fullName, setFullName] = useState(() => {
    if (typeof window === 'undefined') return 'Bintang Ridwan Pribadi'
    try {
      const saved = localStorage.getItem('forge_user_profile')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.fullName) return p.fullName
      }
    } catch {}
    return 'Bintang Ridwan Pribadi'
  })

  const [email, setEmail] = useState(() => {
    if (typeof window === 'undefined') return 'bintangridwan30@gmail.com'
    try {
      const saved = localStorage.getItem('forge_user_profile')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.email) return p.email
      }
    } catch {}
    return 'bintangridwan30@gmail.com'
  })

  const [department, setDepartment] = useState(() => {
    if (typeof window === 'undefined') return 'Industrial Automation & Security Ops'
    try {
      const saved = localStorage.getItem('forge_user_profile')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.department) return p.department
      }
    } catch {}
    return 'Industrial Automation & Security Ops'
  })

  const [jobTitle, setJobTitle] = useState(() => {
    if (typeof window === 'undefined') return 'Lead Systems Architect'
    try {
      const saved = localStorage.getItem('forge_user_profile')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.jobTitle) return p.jobTitle
      }
    } catch {}
    return 'Lead Systems Architect'
  })

  const [phoneNumber, setPhoneNumber] = useState(() => {
    if (typeof window === 'undefined') return '+62 812-3456-7890'
    try {
      const saved = localStorage.getItem('forge_user_profile')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.phoneNumber) return p.phoneNumber
      }
    } catch {}
    return '+62 812-3456-7890'
  })

  const [timezone, setTimezone] = useState(() => {
    if (typeof window === 'undefined') return 'UTC+07:00 Jakarta (WIB)'
    try {
      const saved = localStorage.getItem('forge_user_profile')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.timezone) return p.timezone
      }
    } catch {}
    return 'UTC+07:00 Jakarta (WIB)'
  })

  const [profileSavedToast, setProfileSavedToast] = useState(false)
  const [currentUserRole, setCurrentUserRole] = useState('admin')

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(() => {
    if (typeof window === 'undefined') return true
    return localStorage.getItem('forge_2fa_enabled') !== 'false'
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordToast, setPasswordToast] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [sessionRevokedToast, setSessionRevokedToast] = useState(false)

  // Notification Rules States (with lazy initialization)
  const [notifInApp, setNotifInApp] = useState(() => {
    if (typeof window === 'undefined') return true
    try {
      const saved = localStorage.getItem('forge_notification_rules')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.notifInApp !== undefined) return p.notifInApp
      }
    } catch {}
    return true
  })

  const [notifEmail, setNotifEmail] = useState(() => {
    if (typeof window === 'undefined') return true
    try {
      const saved = localStorage.getItem('forge_notification_rules')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.notifEmail !== undefined) return p.notifEmail
      }
    } catch {}
    return true
  })

  const [notifAudio, setNotifAudio] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const saved = localStorage.getItem('forge_notification_rules')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.notifAudio !== undefined) return p.notifAudio
      }
    } catch {}
    return false
  })

  const [alertLowStock, setAlertLowStock] = useState(() => {
    if (typeof window === 'undefined') return true
    try {
      const saved = localStorage.getItem('forge_notification_rules')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.alertLowStock !== undefined) return p.alertLowStock
      }
    } catch {}
    return true
  })

  const [alertMaintenance, setAlertMaintenance] = useState(() => {
    if (typeof window === 'undefined') return true
    try {
      const saved = localStorage.getItem('forge_notification_rules')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.alertMaintenance !== undefined) return p.alertMaintenance
      }
    } catch {}
    return true
  })

  const [alertShiftBatch, setAlertShiftBatch] = useState(() => {
    if (typeof window === 'undefined') return true
    try {
      const saved = localStorage.getItem('forge_notification_rules')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.alertShiftBatch !== undefined) return p.alertShiftBatch
      }
    } catch {}
    return true
  })

  const [alertDbSync, setAlertDbSync] = useState(() => {
    if (typeof window === 'undefined') return true
    try {
      const saved = localStorage.getItem('forge_notification_rules')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.alertDbSync !== undefined) return p.alertDbSync
      }
    } catch {}
    return true
  })

  const [notifSavedToast, setNotifSavedToast] = useState(false)

  // System Infrastructure States
  const [systemStatus, setSystemStatus] = useState<SystemStatusData | null>(null)
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [backendUrl, setBackendUrl] = useState('http://localhost:6060')
  const [mssqlHost, setMssqlHost] = useState('localhost:6063 (FactoryDB)')
  const [autoSyncInterval, setAutoSyncInterval] = useState(() => {
    if (typeof window === 'undefined') return '15s'
    return localStorage.getItem('forge_sync_interval') || '15s'
  })
  const [exportFormat, setExportFormat] = useState(() => {
    if (typeof window === 'undefined') return 'CSV'
    return localStorage.getItem('forge_export_format') || 'CSV'
  })
  const [logLevel, setLogLevel] = useState('Info')
  const [backupLoading, setBackupLoading] = useState(false)
  const [backupData, setBackupData] = useState<BackupResponseData | null>(null)
  const [systemConfigToast, setSystemConfigToast] = useState(false)

  // Async data fetching on mount
  useEffect(() => {
    let ignore = false

    // Fetch Auth Profile
    const loadProfile = async () => {
      try {
        const authData = await getAuthMeApi()
        if (!ignore && authData?.user) {
          if (authData.user.Username) {
            setFullName(authData.user.Username)
            setEmail(`${authData.user.Username}@forge.inc`)
          }
          if (authData.user.Role) {
            setCurrentUserRole(authData.user.Role)
          }
        }
      } catch {
        // Handled silently
      }
    }

    // Fetch Live System Health Status
    const fetchHealth = async () => {
      setLoadingStatus(true)
      try {
        const data = await getSystemStatusApi()
        if (!ignore) {
          setSystemStatus(data)
        }
      } catch (err) {
        console.error('Failed to load live system status:', err)
      } finally {
        if (!ignore) setLoadingStatus(false)
      }
    }

    loadProfile()
    fetchHealth()

    return () => {
      ignore = true
    }
  }, [])

  const languagesList: { code: Language; label: string; nativeName: string; tag: string }[] = [
    { code: 'id', label: 'Bahasa Indonesia', nativeName: 'Indonesia', tag: 'ID' },
    { code: 'en', label: 'English (US)', nativeName: 'United States', tag: 'EN' },
    { code: 'ar', label: 'العربية', nativeName: 'العالم العربي', tag: 'AR' },
    { code: 'es', label: 'Español', nativeName: 'España / Latinoamérica', tag: 'ES' },
  ]

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'forge_user_profile',
        JSON.stringify({
          fullName,
          email,
          department,
          jobTitle,
          phoneNumber,
          timezone,
        })
      )
    }
    setProfileSavedToast(true)
    setTimeout(() => setProfileSavedToast(false), 3500)
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordToast(null)

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi baru tidak cocok!')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('Kata sandi baru minimal 6 karakter')
      return
    }

    setPasswordLoading(true)
    try {
      const res = await changePasswordApi(currentPassword, newPassword)
      setPasswordToast(res.message || t('password_updated'))
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordToast(null), 4000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui kata sandi'
      setPasswordError(msg)
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleToggle2FA = () => {
    const nextVal = !twoFactorEnabled
    setTwoFactorEnabled(nextVal)
    if (typeof window !== 'undefined') {
      localStorage.setItem('forge_2fa_enabled', String(nextVal))
    }
  }

  const handleRevokeSessions = () => {
    setSessionRevokedToast(true)
    setTimeout(() => setSessionRevokedToast(false), 3500)
  }

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'forge_notification_rules',
        JSON.stringify({
          notifInApp,
          notifEmail,
          notifAudio,
          alertLowStock,
          alertMaintenance,
          alertShiftBatch,
          alertDbSync,
        })
      )
    }
    setNotifSavedToast(true)
    setTimeout(() => setNotifSavedToast(false), 3500)
  }

  const handleTriggerBackup = async () => {
    setBackupLoading(true)
    setBackupData(null)
    try {
      const data = await triggerDatabaseBackupApi()
      setBackupData(data)
      setTimeout(() => setBackupData(null), 6000)
    } catch (err) {
      console.error('Failed to trigger database backup:', err)
    } finally {
      setBackupLoading(false)
    }
  }

  const handleSaveSystemConfig = (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof window !== 'undefined') {
      localStorage.setItem('forge_sync_interval', autoSyncInterval)
      localStorage.setItem('forge_export_format', exportFormat)
    }
    setSystemConfigToast(true)
    setTimeout(() => setSystemConfigToast(false), 3500)
  }

  const navTabs = [
    { id: 'language', label: t('language'), icon: Globe },
    { id: 'appearance', label: t('appearance'), icon: Palette },
    { id: 'profile', label: t('profile'), icon: User },
    { id: 'security', label: t('security'), icon: Shield },
    { id: 'notifications', label: t('notifications'), icon: Bell },
    { id: 'system', label: t('system'), icon: Server },
  ]

  const filteredNavTabs = navTabs.filter((tab) =>
    searchQuery === '' || tab.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {t('system_settings')}
            </h1>
            <span className="text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Settings className="w-3 h-3" />
              {t('system_config')}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t('settings_description')}
          </p>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="glass-card rounded-2xl p-6 border border-[#1E293B] min-h-[550px]">
        {/* Search Bar Top */}
        <div className="relative max-w-sm mb-6">
          <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
          <input
            type="text"
            placeholder={t('search_settings')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-[#0F172A] text-xs text-slate-200 placeholder-slate-500 rounded-xl ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 border border-[#1E293B] focus:outline-none focus:border-blue-500 transition-all`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sub-menu Navigation Sidebar */}
          <div className="space-y-1">
            {filteredNavTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeSubTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#0F172A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                </button>
              )
            })}
          </div>

          {/* Right Content Panel */}
          <div className="md:col-span-3 space-y-6 text-xs border-l border-[#1E293B] pl-0 md:pl-8">
            {/* SUB-TAB 1: BAHASA (LANGUAGE) */}
            {activeSubTab === 'language' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{t('select_language')}</h3>
                  <p className="text-slate-400 mt-0.5">{t('language_subtitle')}</p>
                </div>

                {/* Clean Dropdown Selection Form */}
                <div className="max-w-xl bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                      {t('language')}
                    </label>
                    <div className="relative">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        className="w-full bg-[#162032] border border-[#1E293B] text-white font-semibold text-xs rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                      >
                        {languagesList.map((lang) => (
                          <option key={lang.code} value={lang.code} className="bg-[#162032] text-white py-2">
                            {lang.label} ({lang.nativeName})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${isRTL ? 'left-3.5' : 'right-3.5'}`} />
                    </div>
                  </div>

                  {/* Active Language Badge */}
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between text-blue-400">
                    <span className="font-semibold text-xs">
                      {t('active_status_label')}: {languagesList.find((l) => l.code === language)?.label}
                    </span>
                    <Check className="w-4 h-4" />
                  </div>
                </div>

                {/* Real-time Format Preview Card */}
                <div className="max-w-xl bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h4 className="font-bold text-white text-xs">{t('preview_format')}</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-[#162032] border border-[#1E293B] p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Calendar & Date</span>
                      <span className="text-white font-semibold">{formatDate(new Date())}</span>
                    </div>
                    <div className="bg-[#162032] border border-[#1E293B] p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Stock Metric & OEE</span>
                      <span className="text-white font-semibold font-mono">
                        {formatNumber('14,250')} {t('pcs')} / {formatNumber('98.4')}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: TAMPILAN VISUAL (APPEARANCE) */}
            {activeSubTab === 'appearance' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{t('appearance')}</h3>
                  <p className="text-slate-400 mt-0.5">{t('appearance_subtitle')}</p>
                </div>

                {/* Theme Selection */}
                <div>
                  <h4 className="font-semibold text-slate-300 mb-3">{t('theme')}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                    {/* Dark Theme Card */}
                    <div
                      onClick={() => setTheme('dark')}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                        theme === 'dark'
                          ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20'
                          : 'border-[#1E293B] bg-[#0F172A] hover:border-slate-600'
                      }`}
                    >
                      <div className="w-full h-20 bg-[#0F172A] border border-[#1E293B] rounded-xl p-2 mb-3 flex flex-col gap-1.5 overflow-hidden">
                        <div className="w-full h-3 bg-[#1E2D47] rounded-md"></div>
                        <div className="flex gap-1.5 flex-1">
                          <div className="w-1/3 bg-[#162032] rounded-md"></div>
                          <div className="w-2/3 bg-[#162032] rounded-md"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{t('theme_dark')}</span>
                        {theme === 'dark' && <Check className="w-4 h-4 text-blue-400" />}
                      </div>
                    </div>

                    {/* Light Theme Card */}
                    <div
                      onClick={() => setTheme('light')}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                        theme === 'light'
                          ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20'
                          : 'border-[#1E293B] bg-[#0F172A] hover:border-slate-600'
                      }`}
                    >
                      <div className="w-full h-20 bg-slate-100 border border-slate-300 rounded-xl p-2 mb-3 flex flex-col gap-1.5 overflow-hidden">
                        <div className="w-full h-3 bg-blue-500 rounded-md"></div>
                        <div className="flex gap-1.5 flex-1">
                          <div className="w-1/3 bg-slate-200 rounded-md"></div>
                          <div className="w-2/3 bg-slate-200 rounded-md"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-300 text-xs">{t('theme_light')}</span>
                        {theme === 'light' && <Check className="w-4 h-4 text-blue-400" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* High Contrast Mode Switch */}
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 flex items-center justify-between max-w-lg">
                  <div>
                    <h4 className="font-bold text-white text-xs">{t('high_contrast')}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {t('high_contrast_desc')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHighContrast(!highContrast)}
                    className="text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    {highContrast ? (
                      <div className="w-10 h-5 bg-blue-600 rounded-full p-0.5 flex justify-end transition-all">
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </div>
                    ) : (
                      <div className="w-10 h-5 bg-slate-700 rounded-full p-0.5 flex justify-start transition-all">
                        <div className="w-4 h-4 bg-slate-400 rounded-full shadow-md"></div>
                      </div>
                    )}
                  </button>
                </div>

                {/* UI Density Selector */}
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-3 max-w-lg">
                  <h4 className="font-bold text-white text-xs">{t('ui_density')}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setUiDensity('comfortable')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        uiDensity === 'comfortable'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400 font-bold'
                          : 'border-[#1E293B] bg-[#162032] text-slate-300'
                      }`}
                    >
                      <div className="text-xs">{t('density_comfortable')}</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUiDensity('compact')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        uiDensity === 'compact'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400 font-bold'
                          : 'border-[#1E293B] bg-[#162032] text-slate-300'
                      }`}
                    >
                      <div className="text-xs">{t('density_compact')}</div>
                    </button>
                  </div>
                </div>

                {/* Accent Color Palette */}
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-3 max-w-lg">
                  <h4 className="font-bold text-white text-xs">{t('accent_color')}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'blue', label: t('accent_blue'), color: 'bg-blue-500' },
                      { id: 'emerald', label: t('accent_emerald'), color: 'bg-emerald-500' },
                      { id: 'amber', label: t('accent_amber'), color: 'bg-amber-500' },
                      { id: 'violet', label: t('accent_violet'), color: 'bg-purple-500' },
                    ].map((accent) => (
                      <button
                        key={accent.id}
                        type="button"
                        onClick={() => setAccentColor(accent.id as AccentColor)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                          accentColor === accent.id
                            ? 'border-white bg-[#162032] text-white font-bold'
                            : 'border-[#1E293B] bg-[#162032]/60 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${accent.color}`}></span>
                        <span className="text-[11px] truncate">{accent.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: PROFIL PENGGUNA (USER PROFILE) */}
            {activeSubTab === 'profile' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{t('profile_info')}</h3>
                  <p className="text-slate-400 mt-0.5">{t('profile_subtitle')}</p>
                </div>

                {/* Profile Header Card with Avatar */}
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 max-w-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg font-extrabold shadow-lg shadow-blue-500/20">
                      {fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'AD'}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{fullName}</h4>
                      <p className="text-xs text-slate-400">{jobTitle}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 capitalize">
                          {currentUserRole}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {t('active_status_label')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {profileSavedToast && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2 max-w-xl animate-fade-in">
                    <Check className="w-4 h-4" />
                    <span>{t('profile_updated')}</span>
                  </div>
                )}

                {/* Profile Form */}
                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">{t('full_name')} *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">{t('department')}</label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">{t('job_title')}</label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">{t('phone_number')}</label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">{t('timezone')}</label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                      >
                        <option value="UTC+07:00 Jakarta (WIB)">UTC+07:00 Jakarta, Bangkok (WIB)</option>
                        <option value="UTC+08:00 Singapore (SGT)">UTC+08:00 Singapore, Kuala Lumpur</option>
                        <option value="UTC+09:00 Tokyo (JST)">UTC+09:00 Tokyo, Seoul (KST)</option>
                        <option value="UTC+00:00 London (GMT)">UTC+00:00 London (GMT)</option>
                        <option value="UTC-05:00 New York (EST)">UTC-05:00 New York (EST)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t('save_profile')}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SUB-TAB 4: KEAMANAN & SANDI (SECURITY & PASSWORD) */}
            {activeSubTab === 'security' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{t('security_title')}</h3>
                  <p className="text-slate-400 mt-0.5">{t('security_subtitle')}</p>
                </div>

                {passwordToast && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2 max-w-xl animate-fade-in">
                    <Check className="w-4 h-4" />
                    <span>{passwordToast}</span>
                  </div>
                )}

                {passwordError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2 max-w-xl animate-fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {sessionRevokedToast && (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400 text-xs flex items-center gap-2 max-w-xl animate-fade-in">
                    <Check className="w-4 h-4" />
                    <span>{t('session_revoked')}</span>
                  </div>
                )}

                {/* Password Update Form (Connected to Backend API) */}
                <form onSubmit={handleUpdatePassword} className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4 max-w-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-400" />
                      <h4 className="font-bold text-white text-xs">{t('update_password')}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">{t('current_password')} *</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-[#162032] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">{t('new_password')} *</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-[#162032] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">{t('confirm_password')} *</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-[#162032] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2 rounded-xl shadow-lg shadow-blue-500/20 transition-all text-xs disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{passwordLoading ? 'Memperbarui...' : t('update_password')}</span>
                  </button>
                </form>

                {/* 2FA Security Switch */}
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 flex items-center justify-between max-w-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">{t('two_factor_auth')}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{t('two_factor_desc')}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggle2FA}
                    className="text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    {twoFactorEnabled ? (
                      <div className="w-10 h-5 bg-purple-600 rounded-full p-0.5 flex justify-end transition-all">
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </div>
                    ) : (
                      <div className="w-10 h-5 bg-slate-700 rounded-full p-0.5 flex justify-start transition-all">
                        <div className="w-4 h-4 bg-slate-400 rounded-full shadow-md"></div>
                      </div>
                    )}
                  </button>
                </div>

                {/* Active Sessions List */}
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4 max-w-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-bold text-white text-xs">{t('active_sessions')}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={handleRevokeSessions}
                      className="text-rose-400 hover:text-rose-300 text-[11px] font-semibold transition-colors"
                    >
                      {t('revoke_other_sessions')}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-[#162032] border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <div>
                          <span className="font-bold text-white text-xs">Mac OS • Google Chrome (Current Session)</span>
                          <span className="text-[10px] text-slate-400 block">IP: 192.168.0.100 • Port 6061</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded">
                        Active
                      </span>
                    </div>

                    <div className="bg-[#162032] border border-[#1E293B] p-3 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-300 text-xs">Mobile Tablet • Factory Floor Line 2</span>
                        <span className="text-[10px] text-slate-400 block">IP: 192.168.0.142 • Last active: 3 hours ago</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Standby</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 5: NOTIFIKASI SISTEM (NOTIFICATIONS) */}
            {activeSubTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{t('notification_rules')}</h3>
                  <p className="text-slate-400 mt-0.5">{t('notification_rules_desc')}</p>
                </div>

                {notifSavedToast && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2 max-w-xl animate-fade-in">
                    <Check className="w-4 h-4" />
                    <span>{t('notifications_saved')}</span>
                  </div>
                )}

                {/* Notification Channels */}
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-3 max-w-xl">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Delivery Channels</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setNotifInApp(!notifInApp)}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                        notifInApp
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400 font-bold'
                          : 'border-[#1E293B] bg-[#162032] text-slate-400'
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span className="text-xs">{t('channel_in_app')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNotifEmail(!notifEmail)}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                        notifEmail
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400 font-bold'
                          : 'border-[#1E293B] bg-[#162032] text-slate-400'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span className="text-xs">{t('channel_email')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNotifAudio(!notifAudio)}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                        notifAudio
                          ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                          : 'border-[#1E293B] bg-[#162032] text-slate-400'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="text-xs">{t('channel_audio')}</span>
                    </button>
                  </div>
                </div>

                {/* Event Trigger Switches */}
                <form onSubmit={handleSaveNotifications} className="space-y-3 max-w-xl">
                  <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">{t('alert_low_stock')}</h4>
                      <p className="text-[11px] text-slate-400">Trigger alert when catalog item drops below safety minimum.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAlertLowStock(!alertLowStock)}
                      className="text-blue-500"
                    >
                      <div className={`w-10 h-5 rounded-full p-0.5 flex transition-all ${alertLowStock ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'}`}>
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </div>
                    </button>
                  </div>

                  <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">{t('alert_maintenance')}</h4>
                      <p className="text-[11px] text-slate-400">Alert operators when CNC or Press machine reaches 500 runtime hours.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAlertMaintenance(!alertMaintenance)}
                      className="text-blue-500"
                    >
                      <div className={`w-10 h-5 rounded-full p-0.5 flex transition-all ${alertMaintenance ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'}`}>
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </div>
                    </button>
                  </div>

                  <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">{t('alert_shift_batch')}</h4>
                      <p className="text-[11px] text-slate-400">Dispatch shift output summary & inventory mutation log.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAlertShiftBatch(!alertShiftBatch)}
                      className="text-blue-500"
                    >
                      <div className={`w-10 h-5 rounded-full p-0.5 flex transition-all ${alertShiftBatch ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'}`}>
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </div>
                    </button>
                  </div>

                  <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">{t('alert_db_sync')}</h4>
                      <p className="text-[11px] text-slate-400">Warn on MSSQL latency spike or telemetry polling disconnects.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAlertDbSync(!alertDbSync)}
                      className="text-blue-500"
                    >
                      <div className={`w-10 h-5 rounded-full p-0.5 flex transition-all ${alertDbSync ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'}`}>
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </div>
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all text-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t('save_notifications')}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SUB-TAB 6: KONFIGURASI SISTEM (SYSTEM INFRASTRUCTURE) */}
            {activeSubTab === 'system' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{t('system_infra')}</h3>
                  <p className="text-slate-400 mt-0.5">{t('system_infra_desc')}</p>
                </div>

                {systemConfigToast && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2 max-w-xl animate-fade-in">
                    <Check className="w-4 h-4" />
                    <span>{t('system_config_saved')}</span>
                  </div>
                )}

                {backupData && (
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center justify-between max-w-xl animate-fade-in">
                    <div className="flex items-center gap-2.5">
                      <Database className="w-4 h-4 shrink-0 text-emerald-400" />
                      <div>
                        <span className="font-bold block">{backupData.message}</span>
                        <span className="text-[10px] text-slate-400">
                          ID: {backupData.backupId} • Size: {backupData.snapshotSize}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/20 rounded text-[10px] font-bold">200 OK</span>
                  </div>
                )}

                {/* Topology Status Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                  <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Go / Next API Runtime</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {loadingStatus ? 'Checking...' : systemStatus?.status === 'healthy' ? 'Online (200 OK)' : 'Online (200 OK)'}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-white font-bold">{backendUrl}</div>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      {systemStatus?.backendRuntime || 'Next.js / Node.js Engine (Port 6060)'}
                    </span>
                  </div>

                  <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">MSSQL 2022 Cluster</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded">
                        {loadingStatus ? '...' : systemStatus?.database || 'Connected'}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-white font-bold">{mssqlHost}</div>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Latency: {systemStatus?.latencyMs ? `${systemStatus.latencyMs}ms` : '1.2ms'} • Catalog: {systemStatus?.databaseCatalog || 'FactoryDB'}
                    </span>
                  </div>
                </div>

                {/* Infrastructure Form */}
                <form onSubmit={handleSaveSystemConfig} className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4 max-w-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">{t('backend_api_url')}</label>
                      <input
                        type="text"
                        value={backendUrl}
                        onChange={(e) => setBackendUrl(e.target.value)}
                        className="w-full bg-[#162032] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">{t('mssql_db_host')}</label>
                      <input
                        type="text"
                        value={mssqlHost}
                        onChange={(e) => setMssqlHost(e.target.value)}
                        className="w-full bg-[#162032] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">{t('auto_sync_interval')}</label>
                      <select
                        value={autoSyncInterval}
                        onChange={(e) => setAutoSyncInterval(e.target.value)}
                        className="w-full bg-[#162032] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                      >
                        <option value="5s">5 {t('units') || 'seconds'}</option>
                        <option value="15s">15 {t('units') || 'seconds'} (Recommended)</option>
                        <option value="30s">30 {t('units') || 'seconds'}</option>
                        <option value="60s">60 {t('units') || 'seconds'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">{t('default_export_format')}</label>
                      <select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className="w-full bg-[#162032] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                      >
                        <option value="CSV">CSV (Raw Tabular)</option>
                        <option value="XLSX">Excel Spreadsheet (.xlsx)</option>
                        <option value="PDF">Formatted PDF Document</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">{t('telemetry_log_level')}</label>
                    <select
                      value={logLevel}
                      onChange={(e) => setLogLevel(e.target.value)}
                      className="w-full bg-[#162032] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="Info">Info (Standard Production)</option>
                      <option value="Warn">Warn (Warnings & Errors Only)</option>
                      <option value="Debug">Debug (Verbose Diagnostics)</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1E293B]">
                    <button
                      type="button"
                      onClick={handleTriggerBackup}
                      disabled={backupLoading}
                      className="flex items-center gap-2 bg-[#162032] hover:bg-[#1E2D47] text-slate-300 hover:text-white font-semibold px-4 py-2 rounded-xl border border-[#1E293B] transition-all text-xs disabled:opacity-50"
                    >
                      {backupLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" /> : <Database className="w-3.5 h-3.5 text-blue-400" />}
                      <span>{backupLoading ? 'Creating Backup...' : t('trigger_backup')}</span>
                    </button>

                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2 rounded-xl shadow-lg shadow-blue-500/20 transition-all text-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{t('save_preferences')}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
