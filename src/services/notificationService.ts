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
  alertDbSync: true,
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
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
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
 */
export async function fetchLiveNotifications(): Promise<RealNotificationItem[]> {
  const rules = getStoredNotificationRules()
  if (!rules.notifInApp) return []

  const [summaryRes, statusRes, logsRes] = await Promise.allSettled([
    getDashboardSummaryApi(),
    getSystemStatusApi(),
    getProductionLogsApi(),
  ])

  const notifs: RealNotificationItem[] = []

  // 1. REAL LOW STOCK ALERTS (From MSSQL DB)
  if (rules.alertLowStock && summaryRes.status === 'fulfilled') {
    const alerts = summaryRes.value.low_stock_alerts || []
    alerts.forEach((item) => {
      const isOut = item.CurrentStock === 0
      const unit = item.Unit || 'pcs'
      if (isOut) {
        notifs.push({
          id: `stock-out-${item.ProductID}`,
          title: `Stok Habis: ${item.ProductName}`,
          message: `Inventaris ${item.ProductName} kosong (0 ${unit}). Ambang batas minimum: ${item.MinStock} ${unit}. Harap jadwalkan produksi segera.`,
          timeAgo: 'Kritis (Real-time)',
          type: 'critical',
          read: false,
          productId: item.ProductID,
          actionText: 'Catat Produksi Sekarang',
        })
      } else {
        notifs.push({
          id: `stock-low-${item.ProductID}`,
          title: `Stok Rendah: ${item.ProductName}`,
          message: `Stok ${item.ProductName} tersisa ${item.CurrentStock} ${unit} (Batas aman: ${item.MinStock} ${unit}).`,
          timeAgo: 'Peringatan Aktif',
          type: 'warning',
          read: false,
          productId: item.ProductID,
          actionText: 'Tambah Stok Produksi',
        })
      }
    })
  }

  // 2. REAL SYSTEM INFRASTRUCTURE & DB LATENCY ALERTS
  if (rules.alertDbSync && statusRes.status === 'fulfilled') {
    const status = statusRes.value
    const isDbOnline = status.status === 'online' || status.database === 'connected'
    if (isDbOnline) {
      notifs.push({
        id: 'sys-db-nominal',
        title: 'Koneksi Database MSSQL Optimal',
        message: `Katalog ${status.databaseCatalog || 'InventoryDB'} dan API Gateway beroperasi normal (Latensi: ${status.latencyMs || 5}ms).`,
        timeAgo: 'Live Telemetri',
        type: 'info',
        read: true,
      })
    } else {
      notifs.push({
        id: 'sys-db-warn',
        title: 'Peringatan Koneksi Basis Data',
        message: `Terdeteksi anomali pada polling telemetri backend atau latensi query MSSQL.`,
        timeAgo: 'Baru saja',
        type: 'critical',
        read: false,
      })
    }
  }

  // 3. REAL SHIFT BATCH PRODUCTION ALERTS
  if (rules.alertShiftBatch && logsRes.status === 'fulfilled') {
    const recentLogs = logsRes.value || []
    if (recentLogs.length > 0) {
      const topLog = recentLogs[0]
      const prodName = topLog.Products?.ProductName || `Produk #${topLog.ProductID}`
      notifs.push({
        id: `prod-log-${topLog.LogID}`,
        title: 'Batch Produksi Masuk',
        message: `${topLog.Quantity} unit ${prodName} berhasil dicatat oleh operator ${topLog.OperatorName}.`,
        timeAgo: new Date(topLog.ProductionDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        type: 'success',
        read: true,
      })
    }
  }

  // 4. MAINTENANCE ALERT IF ENABLED
  if (rules.alertMaintenance) {
    notifs.push({
      id: 'maint-cnc-500h',
      title: 'Jadwal Pemeliharaan Preventif',
      message: 'Mesin Press Otomatis Line 1 & CNC Milling mendekati siklus inspeksi berkala 500 jam.',
      timeAgo: 'Terjadwal',
      type: 'info',
      read: true,
    })
  }

  return notifs
}
