export interface Product {
  ProductID: number
  ProductName: string
  Unit: string
  MinStock: number
  CurrentStock?: number
  CreatedAt?: string
  UpdatedAt?: string
}

export interface CreateProductPayload {
  ProductName: string
  Unit: string
  MinStock: number
}

export interface ProductionLogItem {
  LogID: number
  ProductID: number
  Quantity: number
  OperatorName: string
  ProductionDate: string
  Products?: {
    ProductName: string
    Unit: string
  }
}

export interface CreateProductionLogPayload {
  product_id: number
  quantity: number
  operator_name: string
}

export interface InventoryMovementItem {
  MovementID: number
  ProductID: number
  MovementType: 'IN' | 'OUT'
  Quantity: number
  MovementDate: string
  Products?: {
    ProductName: string
    Unit: string
  }
}

export interface CreateStockOutPayload {
  product_id: number
  quantity: number
  movement_type: 'OUT'
}

export interface LowStockItem {
  ProductID: number
  ProductName: string
  Unit: string | null
  MinStock: number
  CurrentStock: number
}

export interface DashboardSummary {
  total_products: number
  total_production_today: number
  low_stock_alerts: LowStockItem[]
}

export interface AnalyticsDataPoint {
  date?: string
  dayKey?: string
  monthIndex?: number
  name: string
  production: number
}

export interface DashboardAnalyticsResponse {
  timeframe: '7D' | '30D' | 'YTD'
  total_period_production: number
  data: AnalyticsDataPoint[]
}

export interface UserItem {
  UserID: number
  Username: string
  Role: string
  TwoFactorEnabled?: boolean
}

export interface CreateUserPayload {
  username: string
  password?: string
  role?: string
}

export interface MonthlyYieldItem {
  month: string
  output: number
  target: number
}

export interface TopProductVolume {
  name: string
  volume: number
}

export interface ProductStockSummary {
  ProductID: number
  ProductName: string
  Unit: string | null
  CurrentStock: number
  MinStock: number
}

export interface ReportsAnalyticsData {
  monthly_yield: MonthlyYieldItem[]
  top_products: TopProductVolume[]
  product_stocks: ProductStockSummary[]
  total_logs_count: number
  total_movements_count: number
}

export interface SystemStatusData {
  status: string
  database: string
  databaseCatalog: string
  backendRuntime: string
  latencyMs: number
  counts: {
    products: number
    productionLogs: number
    inventoryMovements: number
    users: number
  }
  timestamp: string
}

export interface BackupResponseData {
  success: boolean
  backupId: string
  operator: string
  database: string
  snapshotSize: string
  createdAt: string
  message: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6060/api'

export async function getProductsApi(): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal mengambil data produk')
  }

  return res.json()
}

export async function createProductApi(payload: CreateProductPayload): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal menambahkan produk baru')
  }

  return res.json()
}

export async function deleteProductApi(id: number): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal menghapus produk')
  }

  return res.json()
}

export async function getProductionLogsApi(): Promise<ProductionLogItem[]> {
  const res = await fetch(`${API_BASE_URL}/production-logs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal mengambil riwayat produksi')
  }

  return res.json()
}

export async function createProductionLogApi(payload: CreateProductionLogPayload): Promise<ProductionLogItem> {
  const res = await fetch(`${API_BASE_URL}/production-logs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal mencatat log produksi')
  }

  return res.json()
}

export async function getInventoryMovementsApi(type?: string): Promise<InventoryMovementItem[]> {
  const url = type ? `${API_BASE_URL}/inventory/movements?type=${type}` : `${API_BASE_URL}/inventory/movements`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal mengambil riwayat mutasi stok')
  }

  return res.json()
}

export async function createStockOutApi(payload: CreateStockOutPayload): Promise<InventoryMovementItem> {
  const res = await fetch(`${API_BASE_URL}/inventory/movements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal mencatat pengeluaran stok')
  }

  return res.json()
}

export async function getDashboardSummaryApi(): Promise<DashboardSummary> {
  const res = await fetch(`${API_BASE_URL}/dashboard/summary`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal mengambil ringkasan dashboard')
  }

  return res.json()
}

export async function getDashboardAnalyticsApi(timeframe: '7D' | '30D' | 'YTD' = '7D'): Promise<DashboardAnalyticsResponse> {
  const res = await fetch(`${API_BASE_URL}/dashboard/analytics?timeframe=${timeframe}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal mengambil data analitik produksi')
  }

  return res.json()
}

export async function getUsersApi(): Promise<UserItem[]> {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal mengambil daftar pengguna')
  }

  return res.json()
}

export async function createUserApi(payload: CreateUserPayload): Promise<UserItem> {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal menambahkan pengguna baru')
  }

  return res.json()
}

export async function updateUserRoleApi(userId: number, role: string): Promise<UserItem> {
  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role }),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal memperbarui peran pengguna')
  }

  return res.json()
}

export async function deleteUserApi(userId: number): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal menghapus pengguna')
  }

  return res.json()
}

export async function getReportsApi(timeframe: string = '30'): Promise<ReportsAnalyticsData> {
  const res = await fetch(`${API_BASE_URL}/reports?timeframe=${timeframe}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal mengambil data laporan analitik')
  }

  return res.json()
}

function getAuthHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  }
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('forge_token')
    if (token && token.length > 20) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  return headers
}

export async function getAuthMeApi(): Promise<{ user: UserItem }> {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
    credentials: 'include',
    cache: 'no-store',
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Sesi belum login atau tidak valid')
  }

  return res.json()
}

export async function changePasswordApi(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ currentPassword, newPassword }),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal memperbarui kata sandi')
  }

  return res.json()
}

export async function getSystemStatusApi(): Promise<SystemStatusData> {
  const res = await fetch(`${API_BASE_URL}/system/status`, {
    method: 'GET',
    headers: getAuthHeaders(),
    credentials: 'include',
    cache: 'no-store',
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal memuat status sistem')
  }

  return res.json()
}

export async function triggerDatabaseBackupApi(): Promise<BackupResponseData> {
  const res = await fetch(`${API_BASE_URL}/system/backup`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal memicu backup database')
  }

  return res.json()
}

export interface Setup2FAResponse {
  success: boolean
  secret: string
  otpauthUri: string
  qrCodeUri: string
  recoveryCodes: string[]
}

export async function setup2FAApi(): Promise<Setup2FAResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/2fa/setup`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal menyiapkan 2FA')
  }

  return res.json()
}

export async function enable2FAApi(payload: {
  secret: string
  code: string
  recoveryCodes: string[]
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/2fa/enable`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal mengaktifkan 2FA')
  }

  return res.json()
}

export async function disable2FAApi(payload?: {
  password?: string
  code?: string
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/2fa/disable`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(payload || {}),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal menonaktifkan 2FA')
  }

  return res.json()
}

export interface VerifyLogin2FAResponse {
  success: boolean
  token: string
  user: UserItem
  message: string
}

export async function verifyLogin2FAApi(payload: {
  tempToken: string
  code: string
}): Promise<VerifyLogin2FAResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/2fa/verify-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Verifikasi 2FA gagal')
  }

  return res.json()
}

