'use client'

import React, { useState } from 'react'
import {
  Settings,
  User,
  Shield,
  Palette,
  Bell,
  Server,
  Search,
  Check,
  UserPlus,
  Globe,
  MoreVertical
} from 'lucide-react'
import { useLanguage, Language } from '@/context/LanguageContext'

export default function SettingsModule() {
  const { language, setLanguage, t, isRTL } = useLanguage()
  const [activeSubTab, setActiveSubTab] = useState('language')
  const [searchQuery, setSearchQuery] = useState('')
  const [theme, setTheme] = useState('Dark')
  const [highContrast, setHighContrast] = useState(false)

  const systemRolesList = [
    { name: 'Sarah Connor', email: 's.connor@forge.io', role: 'Admin', roleColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', status: 'Active', lastLogin: '2 mins ago', avatarBg: 'bg-blue-600' },
    { name: 'Marcus Reed', email: 'm.reed@forge.io', role: 'Manager', roleColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30', status: 'Active', lastLogin: '1 hour ago', avatarBg: 'bg-amber-600' },
    { name: 'James Taggart', email: 'j.taggart@forge.io', role: 'Operator', roleColor: 'bg-slate-500/10 text-slate-400 border-slate-500/30', status: 'Offline', lastLogin: 'Yesterday', avatarBg: 'bg-slate-600' },
  ]

  const languagesList: { code: Language; label: string; flag: string }[] = [
    { code: 'id', label: '🇮🇩 Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'en', label: '🇬🇧 English (US)', flag: '🇬🇧' },
    { code: 'ar', label: '🇸🇦 العربية (Arabic - RTL)', flag: '🇸🇦' },
    { code: 'es', label: '🇪🇸 Español (Spanish)', flag: '🇪🇸' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {t('system_settings')}
            </h1>
            <span className="text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Settings className="w-3 h-3" />
              System Config
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t('settings_description')}
          </p>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="glass-card rounded-2xl p-6 border border-[#1E293B] min-h-[500px]">
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
          {/* Sub-menu Sidebar */}
          <div className="space-y-1">
            {[
              { id: 'language', label: t('language'), icon: Globe },
              { id: 'appearance', label: t('appearance'), icon: Palette },
              { id: 'profile', label: t('profile'), icon: User },
              { id: 'security', label: t('security'), icon: Shield },
              { id: 'notifications', label: t('notifications'), icon: Bell },
              { id: 'system', label: t('system'), icon: Server },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeSubTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#0F172A]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Right Content Panel */}
          <div className="md:col-span-3 space-y-8 text-xs border-l border-[#1E293B] pl-0 md:pl-8">
            {activeSubTab === 'language' ? (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{t('select_language')}</h3>
                  <p className="text-slate-400 mt-0.5">{t('language_subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                  {languagesList.map((lang) => (
                    <div
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all flex items-center justify-between ${
                        language === lang.code
                          ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20'
                          : 'border-[#1E293B] bg-[#0F172A] hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{lang.flag}</span>
                        <div>
                          <h4 className="font-bold text-white text-xs">{lang.label}</h4>
                          <p className="text-[10px] text-slate-400">ISO Code: {lang.code.toUpperCase()}</p>
                        </div>
                      </div>
                      {language === lang.code && <Check className="w-5 h-5 text-blue-400" />}
                    </div>
                  ))}
                </div>
              </div>
            ) : activeSubTab === 'appearance' ? (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{t('appearance')}</h3>
                  <p className="text-slate-400 mt-0.5">{t('appearance_subtitle')}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-300 mb-3">{t('theme')}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                    {/* Dark Theme Card */}
                    <div
                      onClick={() => setTheme('Dark')}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                        theme === 'Dark'
                          ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20'
                          : 'border-[#1E293B] bg-[#0F172A]'
                      }`}
                    >
                      <div className="w-full h-20 bg-[#0F172A] border border-[#1E293B] rounded-xl p-2 mb-3 flex flex-col gap-1.5 overflow-hidden">
                        <div className="w-full h-3 bg-[#1E2D47] rounded-md"></div>
                        <div className="flex gap-1.5 flex-1">
                          <div className="w-1/3 bg-[#162032] rounded-md"></div>
                          <div className="w-2/3 bg-[#162032] rounded-md"></div>
                        </div>
                      </div>
                      <div className="text-center font-bold text-white text-xs">{t('theme_dark')}</div>
                    </div>

                    {/* Light Theme Card */}
                    <div
                      onClick={() => setTheme('Light')}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                        theme === 'Light'
                          ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20'
                          : 'border-[#1E293B] bg-[#0F172A] opacity-60'
                      }`}
                    >
                      <div className="w-full h-20 bg-slate-300 border border-slate-400 rounded-xl p-2 mb-3 flex flex-col gap-1.5 overflow-hidden">
                        <div className="w-full h-3 bg-slate-400 rounded-md"></div>
                        <div className="flex gap-1.5 flex-1">
                          <div className="w-1/3 bg-slate-200 rounded-md"></div>
                          <div className="w-2/3 bg-slate-200 rounded-md"></div>
                        </div>
                      </div>
                      <div className="text-center font-bold text-slate-300 text-xs">{t('theme_light')}</div>
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
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white capitalize">{t(activeSubTab)} {t('configuration')}</h3>
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 text-slate-400">
                  <p>{t('config_active')} <strong className="text-white capitalize">{t(activeSubTab)}</strong> {t('config_active_suffix')}</p>
                </div>
              </div>
            )}

            {/* System Roles Section */}
            <div className="pt-6 border-t border-[#1E293B] space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{t('system_roles')}</h3>
                  <p className="text-slate-400 mt-0.5">{t('manage_user_access')}</p>
                </div>
                <button
                  onClick={() => alert('Add User triggered')}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{t('add_user')}</span>
                </button>
              </div>

              {/* System Roles Mini Table */}
              <div className="overflow-x-auto border border-[#1E293B] rounded-xl bg-[#0F172A]">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#1E293B] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="p-3">{t('user')}</th>
                      <th className="p-3">{t('role')}</th>
                      <th className="p-3 text-center">{t('status')}</th>
                      <th className="p-3 text-center">{t('last_login')}</th>
                      <th className="p-3 text-right">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B]">
                    {systemRolesList.map((user, idx) => (
                      <tr key={idx} className="hover:bg-[#162032] transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full ${user.avatarBg} flex items-center justify-center text-white font-bold text-[10px]`}>
                              {user.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <div>
                              <h5 className="font-bold text-white text-xs leading-tight">{user.name}</h5>
                              <p className="text-[10px] text-slate-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${user.roleColor}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {user.status === 'Active' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                              Offline
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center text-slate-400 font-mono text-[11px]">
                          {user.lastLogin}
                        </td>
                        <td className="p-3 text-right">
                          <button className="text-slate-400 hover:text-white p-1">
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
