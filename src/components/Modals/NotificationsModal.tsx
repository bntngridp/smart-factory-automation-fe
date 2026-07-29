'use client'

import React, { useState } from 'react'
import {
  X,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  CheckCheck,
  Trash2,
  ExternalLink
} from 'lucide-react'

export interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  type: 'critical' | 'warning' | 'info' | 'success'
  read: boolean
  actionLabel?: string
}

interface NotificationsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationsModal({
  isOpen,
  onClose
}: NotificationsModalProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all')
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Low Stock Alert Breached',
      message: 'Servo Motor A-12 is currently at 2 units (Minimum threshold: 10 units). Immediate restocking recommended.',
      time: '5 mins ago',
      type: 'critical',
      read: false,
      actionLabel: 'Produce Stock'
    },
    {
      id: '2',
      title: 'Scheduled Maintenance Warning',
      message: 'Machine CNC-01 (Milling) has reached 500 operating hours. Maintenance check due in 4 hours.',
      time: '25 mins ago',
      type: 'warning',
      read: false,
      actionLabel: 'Schedule'
    },
    {
      id: '3',
      title: 'Production Shift Batch Completed',
      message: 'Shift A completed 45 units of Titanium Casing Alpha by operator J. Miller. Inventory mutated +45 pcs.',
      time: '1 hour ago',
      type: 'success',
      read: true
    },
    {
      id: '4',
      title: 'MSSQL Database Sync Successful',
      message: 'Automated backup & telemetry index synchronization completed successfully on port 6063.',
      time: '3 hours ago',
      type: 'info',
      read: true
    }
  ])

  if (!isOpen) return null

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    )
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read
    if (filter === 'critical') return n.type === 'critical'
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#162032] border border-[#1E293B] rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-pulse border-2 border-[#162032]"></span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  Notification Center
                </h3>
                {unreadCount > 0 && (
                  <span className="text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time operational alerts, inventory warnings, and system logs.
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar Filter Tabs & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-[#1E293B]">
          <div className="flex items-center gap-1.5 bg-[#0F172A] p-1 rounded-xl border border-[#1E293B] text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filter === 'unread'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filter === 'critical'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Critical
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-[#0F172A] transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Mark read</span>
            </button>
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 px-2.5 py-1.5 rounded-lg hover:bg-[#0F172A] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Notifications Scrollable List */}
        <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
              <p className="font-semibold text-slate-300">No notifications found</p>
              <p className="text-[11px] text-slate-500 mt-1">All clear! No alerts matching the selected filter.</p>
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleRead(item.id)}
                className={`cursor-pointer rounded-xl p-4 border transition-all relative ${
                  !item.read
                    ? 'bg-[#0F172A] border-blue-500/40 hover:border-blue-500/70 shadow-sm'
                    : 'bg-[#0F172A] border-[#1E293B] opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon Indicator */}
                  <div className="mt-0.5 shrink-0">
                    {item.type === 'critical' ? (
                      <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    ) : item.type === 'warning' ? (
                      <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    ) : item.type === 'success' ? (
                      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-500">
                        <Info className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-bold text-white text-xs tracking-wide flex items-center gap-2">
                        {item.title}
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        )}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.message}
                    </p>

                    {item.actionLabel && (
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            alert(`Action ${item.actionLabel} executed`)
                          }}
                          className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/30 font-semibold text-[11px] px-3 py-1 rounded-lg flex items-center gap-1 transition-all"
                        >
                          <span>{item.actionLabel}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs text-slate-400">
          <span>Telemetry Stream Active</span>
          <button
            onClick={onClose}
            className="bg-[#0F172A] hover:bg-[#1E2D47] border border-[#1E293B] text-slate-200 font-semibold px-4 py-2 rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
