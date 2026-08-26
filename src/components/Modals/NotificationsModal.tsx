'use client'

import React, { useState, useEffect } from 'react'
import {
  X,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  CheckCheck,
  Trash2,
  ExternalLink,
  RefreshCw
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { fetchLiveNotifications, RealNotificationItem } from '@/services/notificationService'

interface NotificationsModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenProduce?: (productId?: number) => void
}

export default function NotificationsModal({
  isOpen,
  onClose,
  onOpenProduce
}: NotificationsModalProps) {
  const { t, formatNumber } = useLanguage()
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all')
  const [notifications, setNotifications] = useState<RealNotificationItem[]>([])
  const [loading, setLoading] = useState(false)

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const items = await fetchLiveNotifications()
      setNotifications(items)
    } catch (err) {
      console.error('Failed to load live notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isOpen) return
    let ignore = false

    const run = async () => {
      try {
        const items = await fetchLiveNotifications()
        if (!ignore) {
          setNotifications(items)
        }
      } catch (err) {
        console.error('Failed to load live notifications:', err)
      }
    }

    run()

    return () => {
      ignore = true
    }
  }, [isOpen])

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
                  {t('notification_center')}
                </h3>
                {unreadCount > 0 && (
                  <span className="text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full">
                    {formatNumber(unreadCount)} {t('new_badge')}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('notifications_desc')}
              </p>
            </div>
          </div>

          <button
            onClick={loadNotifications}
            className="p-2 rounded-xl bg-[#0F172A] border border-[#1E293B] text-slate-300 hover:text-white hover:border-blue-500/30 transition-all text-xs flex items-center gap-1.5 mr-6"
            title="Refresh Live Notifications"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
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
              {t('all_filter')} ({formatNumber(notifications.length)})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filter === 'unread'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('unread_filter')} ({formatNumber(unreadCount)})
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filter === 'critical'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('critical_filter')}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-[#0F172A] transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>{t('mark_all_read')}</span>
            </button>
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 px-2.5 py-1.5 rounded-lg hover:bg-[#0F172A] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('clear_all')}</span>
            </button>
          </div>
        </div>

        {/* Notifications Scrollable List */}
        <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
              <span>Memuat notifikasi real-time dari database...</span>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
              <p className="font-semibold text-slate-300">{t('no_notifications')}</p>
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
                        {item.timeAgo}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.message}
                    </p>

                    {item.actionText && (
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onClose()
                            if (onOpenProduce) {
                              onOpenProduce(item.productId)
                            }
                          }}
                          className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold text-[11px] px-3 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <span>{item.actionText}</span>
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
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Sinkronisasi Notifikasi Aktif
          </span>
          <button
            onClick={onClose}
            className="bg-[#0F172A] hover:bg-[#1E2D47] border border-[#1E293B] text-slate-200 font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
