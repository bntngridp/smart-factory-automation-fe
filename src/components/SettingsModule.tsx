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
  Globe,
  Sliders
} from 'lucide-react'

export default function SettingsModule() {
  const [activeSubTab, setActiveSubTab] = useState('appearance')
  const [searchQuery, setSearchQuery] = useState('')
  const [theme, setTheme] = useState('Dark Industrial')
  const [accentColor, setAccentColor] = useState('Forge Blue')
  const [pollingRate, setPollingRate] = useState('5 seconds')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Settings
            </h1>
            <span className="text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Settings className="w-3 h-3" />
              System Config
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your account settings and system preferences.
          </p>
        </div>
      </div>

      {/* Main Settings Grid Layout */}
      <div className="glass-card rounded-2xl p-6 border border-[#1E293B] min-h-[500px]">
        {/* Search Bar Top */}
        <div className="relative max-w-sm mb-6">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0F172A] text-xs text-slate-200 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 border border-[#1E293B] focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sub-menu Sidebar */}
          <div className="space-y-1">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'appearance', label: 'Appearance', icon: Palette },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'system', label: 'System', icon: Server },
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

          {/* Settings Right Panel Content Area */}
          <div className="md:col-span-3 space-y-6 text-xs border-l border-[#1E293B] pl-0 md:pl-8">
            {activeSubTab === 'appearance' ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Theme Preferences</h3>
                  <p className="text-slate-400">Customise how the Smart Factory control center looks on your screen.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'Dark Industrial', label: 'Dark Industrial', desc: 'Control room theme (Default)', bg: 'bg-[#0B0F17]' },
                    { id: 'Enterprise Slate', label: 'Enterprise Slate', desc: 'Cool slate gray contrast', bg: 'bg-[#0F172A]' },
                    { id: 'High Contrast', label: 'High Contrast', desc: 'Maximum visibility', bg: 'bg-black' }
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setTheme(item.id)}
                      className={`cursor-pointer rounded-xl p-4 border transition-all ${
                        theme === item.id
                          ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20'
                          : 'border-[#1E293B] bg-[#0F172A] hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-full h-12 rounded-lg ${item.bg} border border-slate-700 mb-3 flex items-center justify-center`}>
                        {theme === item.id && <Check className="w-5 h-5 text-blue-400" />}
                      </div>
                      <h4 className="font-bold text-white">{item.label}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#1E293B]">
                  <h3 className="text-sm font-bold text-white mb-3">Live Telemetry Polling Rate</h3>
                  <select
                    value={pollingRate}
                    onChange={(e) => setPollingRate(e.target.value)}
                    className="bg-[#0F172A] border border-[#1E293B] text-slate-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 min-w-[200px]"
                  >
                    <option value="1 second">Real-time (1 second)</option>
                    <option value="5 seconds">Standard (5 seconds)</option>
                    <option value="15 seconds">Eco mode (15 seconds)</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white capitalize">{activeSubTab} Configuration</h3>
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 text-slate-400">
                  <p>Configuration options for <strong className="text-white capitalize">{activeSubTab}</strong> are active and configured according to Enterprise security guidelines.</p>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-4 border-t border-[#1E293B] flex justify-end">
              <button
                onClick={() => alert('Settings saved successfully!')}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
