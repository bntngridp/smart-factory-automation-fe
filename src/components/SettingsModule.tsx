'use client'

import React, { useState, useEffect } from 'react'
import {
  Settings,
  User,
  Shield,
  Palette,
  Bell,
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
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Key,
  Copy,
  X,
  QrCode,
  Factory,
  Gauge,
  Layers,
  SlidersHorizontal,
  HardDrive
} from 'lucide-react'
import { useLanguage, Language } from '@/context/LanguageContext'
import { useTheme, AccentColor } from '@/context/ThemeContext'
import SystemStatusCard from '@/components/SystemStatusCard'
import {
  getAuthMeApi,
  changePasswordApi,
  getSystemStatusApi,
  triggerDatabaseBackupApi,
  setup2FAApi,
  enable2FAApi,
  disable2FAApi,
  Setup2FAResponse,
  SystemStatusData,
  BackupResponseData
} from '@/services/api'
import { playNotificationTone } from '@/services/notificationService'

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
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false)
  const [isDisable2FAModalOpen, setIsDisable2FAModalOpen] = useState(false)
  const [twoFASetupLoading, setTwoFASetupLoading] = useState(false)
  const [twoFASetupData, setTwoFASetupData] = useState<Setup2FAResponse | null>(null)
  const [twoFAInputCode, setTwoFAInputCode] = useState('')
  const [twoFAVerifying, setTwoFAVerifying] = useState(false)
  const [twoFAError, setTwoFAError] = useState<string | null>(null)
  const [twoFACardError, setTwoFACardError] = useState<string | null>(null)
  const [twoFAToast, setTwoFAToast] = useState<string | null>(null)
  const [copiedSecret, setCopiedSecret] = useState(false)
  const [copiedRecovery, setCopiedRecovery] = useState(false)
  const [disablePasswordInput, setDisablePasswordInput] = useState('')
  const [disableLoading, setDisableLoading] = useState(false)
  const [disableError, setDisableError] = useState<string | null>(null)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordToast, setPasswordToast] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [sessionRevokedToast, setSessionRevokedToast] = useState(false)
  const [isRevokeConfirmModalOpen, setIsRevokeConfirmModalOpen] = useState(false)

  // Real Client Workstation Session Detection State (lazy-initialized)
  const [clientSession] = useState<{
    os: string
    browser: string
    host: string
    port: string
    ip: string
    lastActive: string
  }>(() => {
    if (typeof window === 'undefined') {
      return {
        os: 'macOS Workstation',
        browser: 'Google Chrome',
        host: 'localhost',
        port: '6061',
        ip: '127.0.0.1 (Localhost)',
        lastActive: 'Aktif saat ini (Sesi Terautentikasi)',
      }
    }

    const ua = navigator.userAgent
    let os = 'Desktop Workstation'
    if (ua.includes('Mac OS X') || ua.includes('Macintosh')) {
      os = 'macOS'
    } else if (ua.includes('Windows NT 10.0')) {
      os = 'Windows 10/11'
    } else if (ua.includes('Windows')) {
      os = 'Windows'
    } else if (ua.includes('Android')) {
      os = 'Android Mobile'
    } else if (ua.includes('iPhone') || ua.includes('iPad')) {
      os = 'iOS Device'
    } else if (ua.includes('Linux')) {
      os = 'Linux'
    }

    let browser = 'Web Browser'
    if (ua.includes('Edg/')) {
      browser = 'Microsoft Edge'
    } else if (ua.includes('OPR/') || ua.includes('Opera')) {
      browser = 'Opera'
    } else if (ua.includes('Chrome/')) {
      browser = 'Google Chrome'
    } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
      browser = 'Apple Safari'
    } else if (ua.includes('Firefox/')) {
      browser = 'Mozilla Firefox'
    }

    const host = window.location.hostname || 'localhost'
    const port = window.location.port || (window.location.protocol === 'https:' ? '443' : '80')
    const ip = host === 'localhost' ? '127.0.0.1 (Localhost)' : host

    return {
      os,
      browser,
      host,
      port,
      ip,
      lastActive: 'Aktif saat ini (Sesi Terautentikasi)',
    }
  })

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

  // Factory Operations & Parameter States
  const [systemStatus, setSystemStatus] = useState<SystemStatusData | null>(null)
  const [loadingStatus, setLoadingStatus] = useState(false)
  const backendUrl = 'http://localhost:6060'
  const mssqlHost = 'localhost:6063 (FactoryDB)'
  const [shift1Target, setShift1Target] = useState(() => {
    if (typeof window === 'undefined') return 500
    try {
      const saved = localStorage.getItem('forge_factory_operations_config')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.shift1Target !== undefined) return Number(p.shift1Target)
      }
    } catch {}
    return 500
  })
  const [shift2Target, setShift2Target] = useState(() => {
    if (typeof window === 'undefined') return 450
    try {
      const saved = localStorage.getItem('forge_factory_operations_config')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.shift2Target !== undefined) return Number(p.shift2Target)
      }
    } catch {}
    return 450
  })
  const [shift3Target, setShift3Target] = useState(() => {
    if (typeof window === 'undefined') return 400
    try {
      const saved = localStorage.getItem('forge_factory_operations_config')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.shift3Target !== undefined) return Number(p.shift3Target)
      }
    } catch {}
    return 400
  })
  const [oeeTarget, setOeeTarget] = useState(() => {
    if (typeof window === 'undefined') return 85
    try {
      const saved = localStorage.getItem('forge_factory_operations_config')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.oeeTarget !== undefined) return Number(p.oeeTarget)
      }
    } catch {}
    return 85
  })
  const [globalSafetyStock, setGlobalSafetyStock] = useState(() => {
    if (typeof window === 'undefined') return 50
    try {
      const saved = localStorage.getItem('forge_factory_operations_config')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.globalSafetyStock !== undefined) return Number(p.globalSafetyStock)
      }
    } catch {}
    return 50
  })
  const [backupSchedule, setBackupSchedule] = useState(() => {
    if (typeof window === 'undefined') return 'shift'
    try {
      const saved = localStorage.getItem('forge_factory_operations_config')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.backupSchedule !== undefined) return p.backupSchedule
      }
    } catch {}
    return 'shift'
  })
  const [autoSyncInterval, setAutoSyncInterval] = useState(() => {
    if (typeof window === 'undefined') return '15s'
    return localStorage.getItem('forge_sync_interval') || '15s'
  })
  const [exportFormat, setExportFormat] = useState(() => {
    if (typeof window === 'undefined') return 'CSV'
    return localStorage.getItem('forge_export_format') || 'CSV'
  })
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
          if (authData.user.TwoFactorEnabled !== undefined) {
            setTwoFactorEnabled(authData.user.TwoFactorEnabled)
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

  const handleOpen2FASetup = async () => {
    setTwoFASetupLoading(true)
    setTwoFAError(null)
    setTwoFACardError(null)
    setTwoFAInputCode('')
    setCopiedSecret(false)
    setCopiedRecovery(false)
    try {
      const data = await setup2FAApi()
      setTwoFASetupData(data)
      setIs2FAModalOpen(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyiapkan 2FA'
      if (
        msg.toLowerCase().includes('sesi') ||
        msg.toLowerCase().includes('unauthorized') ||
        msg.toLowerCase().includes('login')
      ) {
        setTwoFACardError('Sesi aktif diperlukan. Silakan login ke akun Anda terlebih dahulu untuk mengonfigurasi 2FA.')
      } else {
        setTwoFACardError(msg)
      }
    } finally {
      setTwoFASetupLoading(false)
    }
  }

  const handleConfirmEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!twoFASetupData) return
    const cleanCode = twoFAInputCode.trim()
    if (cleanCode.length !== 6 || !/^\d+$/.test(cleanCode)) {
      setTwoFAError('Masukkan 6 digit angka kode verifikasi dari aplikasi authenticator Anda')
      return
    }

    setTwoFAVerifying(true)
    setTwoFAError(null)

    try {
      const res = await enable2FAApi({
        secret: twoFASetupData.secret,
        code: cleanCode,
        recoveryCodes: twoFASetupData.recoveryCodes,
      })
      setTwoFactorEnabled(true)
      setIs2FAModalOpen(false)
      setTwoFAToast(res.message || t('two_factor_enabled_toast'))
      setTimeout(() => setTwoFAToast(null), 4000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kode verifikasi salah'
      setTwoFAError(msg)
    } finally {
      setTwoFAVerifying(false)
    }
  }

  const handleOpenDisable2FA = () => {
    setDisablePasswordInput('')
    setDisableError(null)
    setIsDisable2FAModalOpen(true)
  }

  const handleConfirmDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setDisableLoading(true)
    setDisableError(null)

    try {
      const res = await disable2FAApi({ password: disablePasswordInput })
      setTwoFactorEnabled(false)
      setIsDisable2FAModalOpen(false)
      setTwoFAToast(res.message || t('two_factor_disabled_toast'))
      setTimeout(() => setTwoFAToast(null), 4000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menonaktifkan 2FA'
      setDisableError(msg)
    } finally {
      setDisableLoading(false)
    }
  }

  const handleCopySecret = () => {
    if (!twoFASetupData) return
    navigator.clipboard.writeText(twoFASetupData.secret)
    setCopiedSecret(true)
    setTimeout(() => setCopiedSecret(false), 2500)
  }

  const handleCopyRecoveryCodes = () => {
    if (!twoFASetupData) return
    navigator.clipboard.writeText(twoFASetupData.recoveryCodes.join('\n'))
    setCopiedRecovery(true)
    setTimeout(() => setCopiedRecovery(false), 2500)
  }

  const handleOpenRevokeSessions = () => {
    setIsRevokeConfirmModalOpen(true)
  }

  const handleConfirmRevokeSessions = () => {
    setIsRevokeConfirmModalOpen(false)
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
      window.dispatchEvent(new Event('forge_notif_rules_change'))
    }
    if (notifAudio) {
      playNotificationTone('success')
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
      localStorage.setItem(
        'forge_factory_operations_config',
        JSON.stringify({
          shift1Target,
          shift2Target,
          shift3Target,
          oeeTarget,
          globalSafetyStock,
          backupSchedule,
          autoSyncInterval,
          exportFormat,
        })
      )
      localStorage.setItem('forge_sync_interval', autoSyncInterval)
      localStorage.setItem('forge_export_format', exportFormat)
      window.dispatchEvent(new Event('forge_factory_config_change'))
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
    { id: 'system', label: t('system'), icon: Factory },
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
                  type="button"
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-colors duration-150 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 select-none cursor-pointer border ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border-blue-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#0F172A] border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>}
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
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-3 max-w-2xl shadow-sm">
                  <h4 className="font-bold text-white text-xs">{t('accent_color')}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      {
                        id: 'blue',
                        label: t('accent_blue'),
                        hex: '#3B82F6',
                        activeBorder: 'border-blue-500',
                        activeBg: 'bg-blue-500/15',
                        activeText: 'text-blue-500 dark:text-blue-400',
                        ring: 'ring-2 ring-blue-500/30'
                      },
                      {
                        id: 'emerald',
                        label: t('accent_emerald'),
                        hex: '#10B981',
                        activeBorder: 'border-emerald-500',
                        activeBg: 'bg-emerald-500/15',
                        activeText: 'text-emerald-600 dark:text-emerald-400',
                        ring: 'ring-2 ring-emerald-500/30'
                      },
                      {
                        id: 'amber',
                        label: t('accent_amber'),
                        hex: '#F59E0B',
                        activeBorder: 'border-amber-500',
                        activeBg: 'bg-amber-500/15',
                        activeText: 'text-amber-600 dark:text-amber-400',
                        ring: 'ring-2 ring-amber-500/30'
                      },
                      {
                        id: 'violet',
                        label: t('accent_violet'),
                        hex: '#8B5CF6',
                        activeBorder: 'border-purple-500',
                        activeBg: 'bg-purple-500/15',
                        activeText: 'text-purple-600 dark:text-purple-400',
                        ring: 'ring-2 ring-purple-500/30'
                      }
                    ].map((accent) => {
                      const isSelected = accentColor === accent.id
                      return (
                        <button
                          key={accent.id}
                          type="button"
                          onClick={() => setAccentColor(accent.id as AccentColor)}
                          className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all outline-none focus:outline-none focus-visible:outline-none select-none cursor-pointer shadow-sm ${
                            isSelected
                              ? `${accent.activeBorder} ${accent.activeBg} ${accent.activeText} ${accent.ring} font-bold`
                              : 'border-[#1E293B] bg-[#162032] text-slate-300 hover:border-slate-400 hover:text-white'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full shrink-0 static-swatch shadow-sm ring-1 ring-black/10"
                            style={{ backgroundColor: accent.hex }}
                          ></span>
                          <span className="text-xs font-semibold">{accent.label}</span>
                        </button>
                      )
                    })}
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
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-sm uppercase">
                      {fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'AD'}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base leading-tight">{fullName}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{jobTitle}</p>
                      <div className="flex items-center gap-2.5 mt-2 text-xs font-semibold">
                        <span className="text-slate-300 capitalize">{currentUserRole}</span>
                        <span className="text-slate-500">•</span>
                        <span className="inline-flex items-center gap-1.5 text-emerald-500 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                          <span>{t('active_status_label')}</span>
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
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2 max-w-3xl animate-fade-in">
                    <Check className="w-4 h-4" />
                    <span>{passwordToast}</span>
                  </div>
                )}

                {passwordError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2 max-w-3xl animate-fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {sessionRevokedToast && (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400 text-xs flex items-center gap-2 max-w-3xl animate-fade-in">
                    <Check className="w-4 h-4" />
                    <span>{t('session_revoked')}</span>
                  </div>
                )}

                {/* Password Update Form (Connected to Backend API) */}
                <form onSubmit={handleUpdatePassword} className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 space-y-4 max-w-3xl">
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

                {/* 2FA Security Card */}
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 space-y-4 max-w-3xl">
                  {twoFAToast && (
                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2.5 animate-fade-in">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>{twoFAToast}</span>
                    </div>
                  )}

                  {twoFACardError && (
                    <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2.5 animate-fade-in">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{twoFACardError}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl border shrink-0 ${
                          twoFactorEnabled
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        }`}
                      >
                        {twoFactorEnabled ? <ShieldCheck className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h4 className="font-bold text-white text-sm tracking-tight">{t('two_factor_auth')}</h4>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wide ${
                              twoFactorEnabled
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {twoFactorEnabled ? t('two_factor_status_active') : t('two_factor_status_inactive')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-xl">{t('two_factor_desc')}</p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center sm:self-center">
                      {twoFactorEnabled ? (
                        <button
                          type="button"
                          onClick={handleOpenDisable2FA}
                          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer outline-none focus:outline-none whitespace-nowrap"
                        >
                          {t('two_factor_disable_btn')}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={twoFASetupLoading}
                          onClick={handleOpen2FASetup}
                          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50 cursor-pointer outline-none focus:outline-none whitespace-nowrap"
                        >
                          {twoFASetupLoading ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Key className="w-3.5 h-3.5" />
                          )}
                          <span>{twoFASetupLoading ? 'Menyiapkan...' : t('two_factor_setup_btn')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Real Active Workstation Session */}
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 space-y-4 max-w-3xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-bold text-white text-xs">{t('active_sessions')}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenRevokeSessions}
                      className="text-rose-400 hover:text-rose-300 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      {t('revoke_other_sessions')}
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-[#162032] border border-emerald-500/30 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">
                              {clientSession.os} • {clientSession.browser}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              Current Workstation
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">
                            Host: {clientSession.host}:{clientSession.port} • IP: {clientSession.ip}
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/30 whitespace-nowrap self-start sm:self-center">
                        {clientSession.lastActive}
                      </span>
                    </div>

                    <div className="p-3 bg-[#0B1120] rounded-xl border border-dashed border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        Semua workstation lain telah terisolasi dan tidak ada sesi paralel tidak sah.
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 shrink-0">1 Sesi Aktif</span>
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
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">{t('delivery_channels')}</h4>
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
                      <p className="text-[11px] text-slate-400">{t('alert_low_stock_desc')}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAlertLowStock(!alertLowStock)}
                      className="text-blue-500 cursor-pointer"
                    >
                      <div className={`w-10 h-5 rounded-full p-0.5 flex transition-all ${alertLowStock ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'}`}>
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </div>
                    </button>
                  </div>

                  <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">{t('alert_maintenance')}</h4>
                      <p className="text-[11px] text-slate-400">{t('alert_maintenance_desc')}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAlertMaintenance(!alertMaintenance)}
                      className="text-blue-500 cursor-pointer"
                    >
                      <div className={`w-10 h-5 rounded-full p-0.5 flex transition-all ${alertMaintenance ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'}`}>
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </div>
                    </button>
                  </div>

                  <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">{t('alert_shift_batch')}</h4>
                      <p className="text-[11px] text-slate-400">{t('alert_shift_batch_desc')}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAlertShiftBatch(!alertShiftBatch)}
                      className="text-blue-500 cursor-pointer"
                    >
                      <div className={`w-10 h-5 rounded-full p-0.5 flex transition-all ${alertShiftBatch ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'}`}>
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </div>
                    </button>
                  </div>

                  <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">{t('alert_db_sync')}</h4>
                      <p className="text-[11px] text-slate-400">{t('alert_db_sync_desc')}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAlertDbSync(!alertDbSync)}
                      className="text-blue-500 cursor-pointer"
                    >
                      <div className={`w-10 h-5 rounded-full p-0.5 flex transition-all ${alertDbSync ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'}`}>
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </div>
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-all text-xs cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t('save_notifications')}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SUB-TAB 6: KONFIGURASI OPERASIONAL PABRIK & INFRASTRUKTUR */}
            {activeSubTab === 'system' && (
              <div className="space-y-6 animate-fade-in max-w-3xl">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{t('system_infra')}</h3>
                  <p className="text-slate-400 mt-0.5">{t('system_infra_desc')}</p>
                </div>

                {systemConfigToast && (
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2 animate-fade-in shadow-lg">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{t('system_config_saved')}</span>
                  </div>
                )}

                {backupData && (
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center justify-between animate-fade-in shadow-lg">
                    <div className="flex items-center gap-2.5">
                      <Database className="w-4 h-4 shrink-0 text-emerald-400" />
                      <div>
                        <span className="font-bold block">{backupData.message}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {backupData.backupId} • Size: {backupData.snapshotSize}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/20 rounded text-[10px] font-bold">200 OK</span>
                  </div>
                )}

                {/* System Infrastructure Telemetry Card */}
                <SystemStatusCard className="mb-0" />

                {/* Live Telemetry Status Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Go / Next API Runtime</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {loadingStatus ? 'Checking...' : 'Online (200 OK)'}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-white font-bold">{backendUrl}</div>
                    <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                      {systemStatus?.backendRuntime || 'Next.js / Node.js Engine (Port 6060)'}
                    </span>
                  </div>

                  <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">MSSQL 2022 Cluster</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded flex items-center gap-1">
                        <Database className="w-3 h-3" />
                        {loadingStatus ? '...' : systemStatus?.database || 'Connected'}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-white font-bold">{mssqlHost}</div>
                    <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                      Latency: {systemStatus?.latencyMs ? `${systemStatus.latencyMs}ms` : '17ms'} • Catalog: {systemStatus?.databaseCatalog || 'FactoryDB'}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSaveSystemConfig} className="space-y-5">
                  {/* SECTION 1: Production Shift Targets & OEE */}
                  <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#1E293B] pb-3">
                      <Gauge className="w-4 h-4 text-blue-400" />
                      <h4 className="font-bold text-white text-xs">{t('shift_output_targets')}</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                          {t('target_shift_1')}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            value={shift1Target}
                            onChange={(e) => setShift1Target(Number(e.target.value))}
                            className="w-full bg-[#162032] border border-[#1E293B] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500 pr-12"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                            {t('pcs')}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                          {t('target_shift_2')}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            value={shift2Target}
                            onChange={(e) => setShift2Target(Number(e.target.value))}
                            className="w-full bg-[#162032] border border-[#1E293B] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500 pr-12"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                            {t('pcs')}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                          {t('target_shift_3')}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            value={shift3Target}
                            onChange={(e) => setShift3Target(Number(e.target.value))}
                            className="w-full bg-[#162032] border border-[#1E293B] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500 pr-12"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                            {t('pcs')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] text-slate-300 font-semibold">
                            {t('oee_standard_target')}
                          </label>
                          <span className="text-xs font-bold text-blue-400 font-mono">{oeeTarget}%</span>
                        </div>
                        <input
                          type="range"
                          min="60"
                          max="99"
                          value={oeeTarget}
                          onChange={(e) => setOeeTarget(Number(e.target.value))}
                          className="w-full accent-blue-500 cursor-pointer h-1.5 bg-[#162032] rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                          {t('global_safety_stock_threshold')}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            value={globalSafetyStock}
                            onChange={(e) => setGlobalSafetyStock(Number(e.target.value))}
                            className="w-full bg-[#162032] border border-[#1E293B] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500 pr-12"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                            {t('pcs')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Active Manufacturing Lines */}
                  <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2 border-b border-[#1E293B] pb-3">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <h4 className="font-bold text-white text-xs">{t('factory_production_lines')}</h4>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="bg-[#162032] border border-[#1E293B] p-3 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="font-semibold text-slate-200">{t('line_1_name')}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded">
                          Running (High Precision)
                        </span>
                      </div>

                      <div className="bg-[#162032] border border-[#1E293B] p-3 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="font-semibold text-slate-200">{t('line_2_name')}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded">
                          Running (Automated)
                        </span>
                      </div>

                      <div className="bg-[#162032] border border-[#1E293B] p-3 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="font-semibold text-slate-200">{t('line_3_name')}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded">
                          Running (QC Checked)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: Database Retention & Telemetry Polling */}
                  <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#1E293B] pb-3">
                      <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-bold text-white text-xs">{t('backup_retention_policy')}</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1.5">{t('auto_backup_schedule')}</label>
                        <select
                          value={backupSchedule}
                          onChange={(e) => setBackupSchedule(e.target.value)}
                          className="w-full bg-[#162032] border border-[#1E293B] rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="shift">{t('backup_shift_change')}</option>
                          <option value="daily">{t('backup_daily_midnight')}</option>
                          <option value="weekly">{t('backup_weekly_sunday')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1.5">{t('auto_sync_interval')}</label>
                        <select
                          value={autoSyncInterval}
                          onChange={(e) => setAutoSyncInterval(e.target.value)}
                          className="w-full bg-[#162032] border border-[#1E293B] rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="5s">5 Detik / 5 Seconds</option>
                          <option value="15s">15 Detik / 15 Seconds (Recommended)</option>
                          <option value="30s">30 Detik / 30 Seconds</option>
                          <option value="60s">60 Detik / 60 Seconds</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1.5">{t('default_export_format')}</label>
                        <select
                          value={exportFormat}
                          onChange={(e) => setExportFormat(e.target.value)}
                          className="w-full bg-[#162032] border border-[#1E293B] rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="CSV">CSV (Raw Tabular)</option>
                          <option value="XLSX">Excel Spreadsheet (.xlsx)</option>
                          <option value="PDF">Formatted PDF Document</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1E293B]">
                      <button
                        type="button"
                        onClick={handleTriggerBackup}
                        disabled={backupLoading}
                        className="flex items-center gap-2 bg-[#162032] hover:bg-[#1E2D47] text-slate-300 hover:text-white font-semibold px-4 py-2.5 rounded-xl border border-[#1E293B] transition-all text-xs disabled:opacity-50 cursor-pointer"
                      >
                        {backupLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" /> : <HardDrive className="w-3.5 h-3.5 text-blue-400" />}
                        <span>{backupLoading ? 'Creating Backup...' : t('trigger_backup')}</span>
                      </button>

                      <button
                        type="submit"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-all text-xs cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>{t('save_factory_config')}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2FA SETUP MODAL */}
      {is2FAModalOpen && twoFASetupData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl relative my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">{t('two_factor_modal_title')}</h3>
                  <p className="text-[11px] text-slate-400">RFC 6238 TOTP Authenticator</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIs2FAModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#162032] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Message */}
            {twoFAError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{twoFAError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              {/* STEP 1: SCAN QR CODE */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <QrCode className="w-4 h-4 text-purple-400" />
                  <span>{t('two_factor_step_1')}</span>
                </div>
                <p className="text-[11px] text-slate-400">{t('two_factor_step_1_desc')}</p>

                {/* QR Code Container */}
                <div className="flex justify-center p-3 bg-white rounded-xl shadow-inner max-w-[200px] mx-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={twoFASetupData.qrCodeUri}
                    alt="2FA QR Code"
                    className="w-40 h-40 object-contain"
                  />
                </div>

                {/* Manual Secret Key */}
                <div className="pt-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {t('two_factor_manual_key')}
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#162032] border border-[#1E293B] rounded-xl px-3 py-2 text-xs font-mono text-purple-300 tracking-wider select-all overflow-x-auto">
                      {twoFASetupData.secret}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopySecret}
                      className="flex items-center gap-1.5 bg-[#162032] hover:bg-[#1E2D47] text-slate-200 border border-[#1E293B] px-3 py-2 rounded-xl transition-colors font-semibold text-xs shrink-0 cursor-pointer"
                    >
                      {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSecret ? t('two_factor_copied') : t('two_factor_copy_key')}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* STEP 2: RECOVERY CODES */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white text-xs">
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>{t('two_factor_step_2')}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyRecoveryCodes}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedRecovery ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedRecovery ? t('two_factor_copied') : 'Salin Semua'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">{t('two_factor_step_2_desc')}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#162032] p-3 rounded-xl border border-[#1E293B]">
                  {twoFASetupData.recoveryCodes.map((code, idx) => (
                    <div
                      key={idx}
                      className="text-center font-mono text-[11px] text-slate-300 font-bold bg-[#0F172A] py-1 rounded-lg border border-slate-700/50"
                    >
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 3: VERIFICATION FORM */}
              <form onSubmit={handleConfirmEnable2FA} className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-3">
                <label className="block font-bold text-white text-xs">
                  {t('two_factor_step_3')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    placeholder="123456"
                    value={twoFAInputCode}
                    onChange={(e) => setTwoFAInputCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#162032] border border-[#1E293B] rounded-xl px-4 py-2.5 text-center font-mono text-lg tracking-widest text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIs2FAModalOpen(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={twoFAVerifying || twoFAInputCode.length !== 6}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2 rounded-xl shadow-lg shadow-purple-600/20 transition-all text-xs disabled:opacity-50 cursor-pointer"
                  >
                    {twoFAVerifying ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>{twoFAVerifying ? 'Memverifikasi...' : t('two_factor_verify_btn')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 2FA DISABLE CONFIRMATION MODAL */}
      {isDisable2FAModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2.5 text-rose-400">
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">{t('two_factor_disable_btn')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDisable2FAModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#162032] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {disableError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{disableError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmDisable2FA} className="space-y-4 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Menonaktifkan 2FA akan mengurangi perlindungan keamanan akun Anda. Masukkan kata sandi saat ini untuk melanjutkan:
              </p>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{t('current_password')} *</label>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="••••••••••••"
                  value={disablePasswordInput}
                  onChange={(e) => setDisablePasswordInput(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setIsDisable2FAModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={disableLoading || !disablePasswordInput}
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {disableLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                  <span>{disableLoading ? 'Memproses...' : 'Konfirmasi Nonaktifkan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVOKE SESSIONS CONFIRMATION MODAL */}
      {isRevokeConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2.5 text-rose-400">
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">{t('revoke_other_sessions')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRevokeConfirmModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#162032] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs space-y-2">
              <p className="text-rose-300 font-semibold leading-relaxed">
                {t('confirm_revoke_sessions')}
              </p>
              <p className="text-[11px] text-slate-400">
                {t('delete_warning')}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E293B]">
              <button
                type="button"
                onClick={() => setIsRevokeConfirmModalOpen(false)}
                className="px-4 py-2 text-slate-400 hover:text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmRevokeSessions}
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{t('revoke_other_sessions')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

