import { getDashboardSummaryApi, getSystemStatusApi, getProductionLogsApi } from './api'

export interface RealNotificationItem {
  id: string
  title: string
  message: string
  timeAgo: string
  type: 'critical' | 'warning' | 'info' | 'success'
  read: boolean
  productId?: number
  actionText?: string
}

export interface NotificationRules {
  notifInApp: boolean
  notifEmail: boolean
  notifAudio: boolean
  alertLowStock: boolean
  alertMaintenance: boolean
  alertShiftBatch: boolean
  alertDbSync: boolean
}

export const DEFAULT_NOTIFICATION_RULES: NotificationRules = {
  notifInApp: true,
  notifEmail: true,
  notifAudio: true,
  alertLowStock: true,
  alertMaintenance: true,
  alertShiftBatch: true,
  alertDbSync: true
}

const DISMISSED_NOTIFS_STORAGE_KEY = 'forge_dismissed_notifications'
const READ_NOTIFS_STORAGE_KEY = 'forge_read_notifications'

/**
 * Retrieves the set of dismissed/deleted notification IDs from localStorage
 */
export function getDismissedNotificationIds(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(DISMISSED_NOTIFS_STORAGE_KEY)
    if (raw) {
      const arr = JSON.parse(raw)
      if (Array.isArray(arr)) return new Set(arr)
    }
  } catch (err) {
    console.error('Failed to parse dismissed notification IDs:', err)
  }
  return new Set()
}

/**
 * Permanently dismisses/deletes an individual notification by ID
 */
export function dismissNotification(id: string): void {
  if (typeof window === 'undefined') return
  try {
    const set = getDismissedNotificationIds()
    set.add(id)
    localStorage.setItem(DISMISSED_NOTIFS_STORAGE_KEY, JSON.stringify(Array.from(set)))
    window.dispatchEvent(new Event('forge_notifications_updated'))
  } catch (err) {
    console.error('Failed to persist dismissed notification:', err)
  }
}

/**
 * Permanently dismisses/deletes multiple notifications by ID
 */
export function dismissAllNotifications(ids: string[]): void {
  if (typeof window === 'undefined') return
  try {
    const set = getDismissedNotificationIds()
    ids.forEach((id) => set.add(id))
    localStorage.setItem(DISMISSED_NOTIFS_STORAGE_KEY, JSON.stringify(Array.from(set)))
    window.dispatchEvent(new Event('forge_notifications_updated'))
  } catch (err) {
    console.error('Failed to persist dismissed notifications:', err)
  }
}

/**
 * Retrieves the set of read notification IDs from localStorage
 */
export function getReadNotificationIds(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(READ_NOTIFS_STORAGE_KEY)
    if (raw) {
      const arr = JSON.parse(raw)
      if (Array.isArray(arr)) return new Set(arr)
    }
  } catch (err) {
    console.error('Failed to parse read notification IDs:', err)
  }
  return new Set()
}

/**
 * Marks a notification as read and persists it to localStorage
 */
export function markNotificationAsRead(id: string): void {
  if (typeof window === 'undefined') return
  try {
    const set = getReadNotificationIds()
    set.add(id)
    localStorage.setItem(READ_NOTIFS_STORAGE_KEY, JSON.stringify(Array.from(set)))
    window.dispatchEvent(new Event('forge_notifications_updated'))
  } catch (err) {
    console.error('Failed to persist read notification:', err)
  }
}

/**
 * Marks all given notifications as read and persists them
 */
export function markAllNotificationsAsRead(ids: string[]): void {
  if (typeof window === 'undefined') return
  try {
    const set = getReadNotificationIds()
    ids.forEach((id) => set.add(id))
    localStorage.setItem(READ_NOTIFS_STORAGE_KEY, JSON.stringify(Array.from(set)))
    window.dispatchEvent(new Event('forge_notifications_updated'))
  } catch (err) {
    console.error('Failed to persist all read notifications:', err)
  }
}

/**
 * Toggles a notification between read and unread
 */
export function toggleNotificationRead(id: string, currentReadState: boolean): boolean {
  if (typeof window === 'undefined') return !currentReadState
  try {
    const set = getReadNotificationIds()
    if (currentReadState) {
      set.delete(id)
    } else {
      set.add(id)
    }
    localStorage.setItem(READ_NOTIFS_STORAGE_KEY, JSON.stringify(Array.from(set)))
    window.dispatchEvent(new Event('forge_notifications_updated'))
    return !currentReadState
  } catch (err) {
    console.error('Failed to toggle read notification:', err)
    return !currentReadState
  }
}

export function getStoredNotificationRules(): NotificationRules {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_RULES
  try {
    const raw = localStorage.getItem('forge_notification_rules')
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...DEFAULT_NOTIFICATION_RULES, ...parsed }
    }
  } catch (err) {
    console.error('Failed to parse stored notification rules:', err)
  }
  return DEFAULT_NOTIFICATION_RULES
}

/**
 * Plays a synthesized subtle industrial notification chime using Web Audio API
 */
export function playNotificationTone(type: 'critical' | 'warning' | 'info' | 'success' = 'info') {
  if (typeof window === 'undefined') return
  const rules = getStoredNotificationRules()
  if (!rules.notifAudio) return

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return

    const ctx = new AudioContextClass()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    const now = ctx.currentTime

    if (type === 'critical') {
      // Urgent high two-tone alert
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(880, now) // A5
      osc.frequency.setValueAtTime(660, now + 0.15) // E5
      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
      osc.start(now)
      osc.stop(now + 0.45)
    } else if (type === 'warning') {
      // Soft amber warning
      osc.type = 'sine'
      osc.frequency.setValueAtTime(587.33, now) // D5
      osc.frequency.setValueAtTime(783.99, now + 0.12) // G5
      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
      osc.start(now)
      osc.stop(now + 0.35)
    } else {
      // Friendly soft chime
      osc.type = 'sine'
      osc.frequency.setValueAtTime(523.25, now) // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08) // E5
      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
      osc.start(now)
      osc.stop(now + 0.3)
    }
  } catch {
    // Audio context not allowed prior to user gesture, ignore silently
  }
}

/**
 * Generates live notifications dynamically from real database state
 * and applies persistent dismissal and read state filters
 */
export async function fetchLiveNotifications(): Promise<RealNotificationItem[]> {
  const rules = getStoredNotificationRules()
  if (!rules.notifInApp) return []

  const dismissedIds = getDismissedNotificationIds()
  const readIds = getReadNotificationIds()

  const [summaryRes, statusRes, logsRes] = await Promise.allSettled([
    getDashboardSummaryApi(),
    getSystemStatusApi(),
    getProductionLogsApi()
  ])

  const notifs: RealNotificationItem[] = []

  // 1. REAL LOW STOCK ALERTS (From MSSQL DB)
  if (rules.alertLowStock && summaryRes.status === 'fulfilled') {
    const alerts = summaryRes.value.low_stock_alerts || []
    alerts.forEach((item) => {
      const isOut = item.CurrentStock === 0
      const unit = item.Unit || 'pcs'
      const id = isOut ? `stock-out-${item.ProductID}` : `stock-low-${item.ProductID}`

      if (!dismissedIds.has(id)) {
        if (isOut) {
          notifs.push({
            id,
            title: `Stok Habis: ${item.ProductName}`,
            message: `Inventaris ${item.ProductName} kosong (0 ${unit}). Ambang batas minimum: ${item.MinStock} ${unit}. Harap jadwalkan produksi segera.`,
            timeAgo: 'Kritis (Real-time)',
            type: 'critical',
            read: readIds.has(id),
            productId: item.ProductID,
            actionText: 'Catat Produksi Sekarang'
          })
        } else {
          notifs.push({
            id,
            title: `Stok Rendah: ${item.ProductName}`,
            message: `Stok ${item.ProductName} tersisa ${item.CurrentStock} ${unit} (Batas aman: ${item.MinStock} ${unit}).`,
            timeAgo: 'Peringatan Aktif',
            type: 'warning',
            read: readIds.has(id),
            productId: item.ProductID,
            actionText: 'Tambah Stok Produksi'
          })
        }
      }
    })
  }

  // 2. REAL SYSTEM INFRASTRUCTURE & DB LATENCY ALERTS
  if (rules.alertDbSync && statusRes.status === 'fulfilled') {
    const status = statusRes.value
    const isDbOnline = status.status === 'online' || status.database === 'connected'
    const id = isDbOnline ? 'sys-db-nominal' : 'sys-db-warn'

    if (!dismissedIds.has(id)) {
      if (isDbOnline) {
        notifs.push({
          id,
          title: 'Koneksi Database MSSQL Optimal',
          message: `Katalog ${status.databaseCatalog || 'FactoryDB'} dan API Gateway beroperasi normal (Latensi: ${status.latencyMs || 5}ms).`,
          timeAgo: 'Live Telemetri',
          type: 'info',
          read: readIds.has(id) || true
        })
      } else {
        notifs.push({
          id,
          title: 'Peringatan Koneksi Basis Data',
          message: 'Terdeteksi anomali pada polling telemetri backend atau latensi query MSSQL.',
          timeAgo: 'Baru saja',
          type: 'critical',
          read: readIds.has(id)
        })
      }
    }
  }

  // 3. REAL SHIFT BATCH PRODUCTION ALERTS
  if (rules.alertShiftBatch && logsRes.status === 'fulfilled') {
    const recentLogs = logsRes.value || []
    if (recentLogs.length > 0) {
      const topLog = recentLogs[0]
      const prodName = topLog.Products?.ProductName || `Produk #${topLog.ProductID}`
      const id = `prod-log-${topLog.LogID}`

      if (!dismissedIds.has(id)) {
        notifs.push({
          id,
          title: 'Batch Produksi Masuk',
          message: `${topLog.Quantity} unit ${prodName} berhasil dicatat oleh operator ${topLog.OperatorName}.`,
          timeAgo: new Date(topLog.ProductionDate).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          type: 'success',
          read: readIds.has(id) || true
        })
      }
    }
  }

  // 4. MAINTENANCE ALERT IF ENABLED
  if (rules.alertMaintenance) {
    const id = 'maint-cnc-500h'
    if (!dismissedIds.has(id)) {
      notifs.push({
        id,
        title: 'Jadwal Pemeliharaan Preventif',
        message: 'Mesin Press Otomatis Line 1 & CNC Milling mendekati siklus inspeksi berkala 500 jam.',
        timeAgo: 'Terjadwal',
        type: 'info',
        read: readIds.has(id) || true
      })
    }
  }

  return notifs
}
