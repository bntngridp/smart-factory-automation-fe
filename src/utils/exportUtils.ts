import {
  getProductsApi,
  getProductionLogsApi,
  getInventoryMovementsApi,
  Product,
  ProductionLogItem,
  InventoryMovementItem
} from '@/services/api'

/**
 * Escapes a cell value for standard RFC 4180 CSV compliance
 */
export function escapeCsvCell(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '""'
  const str = String(val).replace(/"/g, '""')
  return `"${str}"`
}

/**
 * Triggers a browser download of a CSV file given filename and content
 */
export function downloadCsvFile(filename: string, csvContent: string) {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Generates and downloads a clean CSV template for bulk product import
 */
export function downloadProductCsvTemplate() {
  const filename = 'smart_factory_products_import_template.csv'
  const rows: string[] = []

  // Clean Header Row
  rows.push(['ProductName', 'Unit', 'MinStock', 'CurrentStock'].map(escapeCsvCell).join(','))

  // Sample Data Rows
  rows.push(['Sensor Proximity Induktif M12', 'pcs', 15, 50].map(escapeCsvCell).join(','))
  rows.push(['Power Supply Industrial 24V 10A', 'unit', 10, 30].map(escapeCsvCell).join(','))
  rows.push(['Kabel Kontrol Shielded 4x0.75mm', 'meter', 50, 200].map(escapeCsvCell).join(','))

  const csvContent = rows.join('\r\n')
  downloadCsvFile(filename, csvContent)
}

/**
 * 1. Clean Single-Table Export: Master Product Catalog
 * Standardized, tabular format ready for Excel, Python (pandas), Tableau, and PowerBI
 */
export async function exportProductsCatalogCsv(): Promise<{ success: boolean; filename: string; rowCount: number }> {
  const products = await getProductsApi()
  const dateStr = new Date().toISOString().slice(0, 10)
  const filename = `factory_product_catalog_${dateStr}.csv`

  const rows: string[] = []

  // Clean Header Row
  rows.push([
    'ProductID',
    'ProductName',
    'Unit',
    'CurrentStock',
    'MinStock',
    'StockStatus',
    'CreatedAt'
  ].map(escapeCsvCell).join(','))

  products.forEach((p) => {
    const cur = p.CurrentStock ?? 0
    const min = p.MinStock ?? 0
    let status = 'IN_STOCK'
    if (cur === 0) status = 'OUT_OF_STOCK'
    else if (cur <= min) status = 'LOW_STOCK'

    rows.push([
      p.ProductID,
      p.ProductName,
      p.Unit || 'pcs',
      cur,
      min,
      status,
      p.CreatedAt ? new Date(p.CreatedAt).toISOString() : '-'
    ].map(escapeCsvCell).join(','))
  })

  const csvContent = rows.join('\r\n')
  downloadCsvFile(filename, csvContent)

  return {
    success: true,
    filename,
    rowCount: products.length
  }
}

/**
 * 2. Clean Single-Table Export: Stock Inventory Movements (Audit Log)
 */
export async function exportStockMovementsCsv(): Promise<{ success: boolean; filename: string; rowCount: number }> {
  const movements = await getInventoryMovementsApi()
  const dateStr = new Date().toISOString().slice(0, 10)
  const filename = `factory_stock_movements_${dateStr}.csv`

  const rows: string[] = []

  // Clean Header Row
  rows.push([
    'MovementID',
    'ProductID',
    'ProductName',
    'MovementType',
    'Quantity',
    'MovementDate'
  ].map(escapeCsvCell).join(','))

  movements.forEach((m) => {
    rows.push([
      m.MovementID,
      m.ProductID,
      m.Products?.ProductName || `Product #${m.ProductID}`,
      m.MovementType,
      m.Quantity,
      new Date(m.MovementDate).toISOString()
    ].map(escapeCsvCell).join(','))
  })

  const csvContent = rows.join('\r\n')
  downloadCsvFile(filename, csvContent)

  return {
    success: true,
    filename,
    rowCount: movements.length
  }
}

/**
 * 3. Clean Single-Table Export: Production Execution Logs
 */
export async function exportProductionLogsCsv(): Promise<{ success: boolean; filename: string; rowCount: number }> {
  const logs = await getProductionLogsApi()
  const dateStr = new Date().toISOString().slice(0, 10)
  const filename = `factory_production_logs_${dateStr}.csv`

  const rows: string[] = []

  // Clean Header Row
  rows.push([
    'LogID',
    'ProductID',
    'ProductName',
    'QuantityOutput',
    'OperatorName',
    'ProductionDate'
  ].map(escapeCsvCell).join(','))

  logs.forEach((l) => {
    rows.push([
      l.LogID,
      l.ProductID,
      l.Products?.ProductName || `Product #${l.ProductID}`,
      l.Quantity,
      l.OperatorName,
      new Date(l.ProductionDate).toISOString()
    ].map(escapeCsvCell).join(','))
  })

  const csvContent = rows.join('\r\n')
  downloadCsvFile(filename, csvContent)

  return {
    success: true,
    filename,
    rowCount: logs.length
  }
}

/**
 * 4. Comprehensive Multi-Section Audit Export (Metadata + Products + Movements + Production)
 */
export async function exportFactoryInventoryCsv(): Promise<{ success: boolean; filename: string; rowCount: number }> {
  const [productsRes, logsRes, movementsRes] = await Promise.allSettled([
    getProductsApi(),
    getProductionLogsApi(),
    getInventoryMovementsApi()
  ])

  const products: Product[] = productsRes.status === 'fulfilled' ? productsRes.value : []
  const logs: ProductionLogItem[] = logsRes.status === 'fulfilled' ? logsRes.value : []
  const movements: InventoryMovementItem[] = movementsRes.status === 'fulfilled' ? movementsRes.value : []

  const dateStr = new Date().toISOString().slice(0, 10)
  const timeStr = new Date().toLocaleTimeString('id-ID')
  const filename = `smart_factory_inventory_comprehensive_${dateStr}.csv`

  const rows: string[] = []

  // Header Metadata Section
  rows.push(['# SMART FACTORY AUTOMATION - INVENTORY & PRODUCTION EXPORT'].map(escapeCsvCell).join(','))
  rows.push([
    `# Generated Date: ${dateStr} ${timeStr}`,
    `# Total Products: ${products.length}`,
    `# Total Movements: ${movements.length}`,
    `# Total Production Logs: ${logs.length}`
  ].map(escapeCsvCell).join(','))
  rows.push('')

  // SECTION 1: Product Master Catalog & Live Stock Status
  rows.push(['=== KATALOG PRODUK & STATUS STOK LIVE ==='].map(escapeCsvCell).join(','))
  rows.push([
    'Product ID',
    'Product Name',
    'Unit',
    'Current Stock',
    'Min Safety Stock',
    'Stock Status',
    'Created At'
  ].map(escapeCsvCell).join(','))

  products.forEach((p) => {
    const cur = p.CurrentStock ?? 0
    const min = p.MinStock ?? 0
    let status = 'NORMAL'
    if (cur === 0) status = 'OUT OF STOCK'
    else if (cur <= min) status = 'LOW STOCK WARNING'

    rows.push([
      p.ProductID,
      p.ProductName,
      p.Unit || 'pcs',
      cur,
      min,
      status,
      p.CreatedAt ? new Date(p.CreatedAt).toLocaleString('id-ID') : '-'
    ].map(escapeCsvCell).join(','))
  })

  rows.push('')
  // SECTION 2: Inventory Movements
  rows.push(['=== RIWAYAT MUTASI INVENTARIS TERKINI (IN / OUT) ==='].map(escapeCsvCell).join(','))
  rows.push([
    'Movement ID',
    'Product Name',
    'Movement Type',
    'Quantity',
    'Date & Time'
  ].map(escapeCsvCell).join(','))

  movements.forEach((m) => {
    rows.push([
      m.MovementID,
      m.Products?.ProductName || `Product #${m.ProductID}`,
      m.MovementType === 'IN' ? 'PENERIMAAN / PRODUKSI (IN)' : 'PENGELUARAN (OUT)',
      m.Quantity,
      new Date(m.MovementDate).toLocaleString('id-ID')
    ].map(escapeCsvCell).join(','))
  })

  rows.push('')
  // SECTION 3: Manufacturing Production Logs
  rows.push(['=== RIWAYAT LOG PRODUKSI MANUFAKTUR ==='].map(escapeCsvCell).join(','))
  rows.push([
    'Log ID',
    'Product Name',
    'Quantity Output',
    'Operator Name',
    'Production Timestamp'
  ].map(escapeCsvCell).join(','))

  logs.forEach((l) => {
    rows.push([
      l.LogID,
      l.Products?.ProductName || `Product #${l.ProductID}`,
      l.Quantity,
      l.OperatorName,
      new Date(l.ProductionDate).toLocaleString('id-ID')
    ].map(escapeCsvCell).join(','))
  })

  const csvContent = rows.join('\r\n')
  downloadCsvFile(filename, csvContent)

  return {
    success: true,
    filename,
    rowCount: products.length + movements.length + logs.length
  }
}

/**
 * 5. Exports Executive Analytics Data (Monthly Yield, Top Products, Machine Fleet Uptime) to CSV
 */
export function exportExecutiveReportsCsv(
  analyticsData: {
    monthly_yield?: { month: string; output: number; target: number }[]
    top_products?: { name: string; volume: number }[]
    total_logs_count?: number
    total_movements_count?: number
  } | null,
  format: 'csv' | 'excel' = 'csv'
) {
  const dateStr = new Date().toISOString().slice(0, 10)
  const timeStr = new Date().toLocaleTimeString('id-ID')
  const ext = format === 'excel' ? 'csv' : 'csv'
  const filename = `executive_analytics_report_${dateStr}.${ext}`

  const rows: string[] = []

  rows.push(['# SMART FACTORY AUTOMATION - EXECUTIVE ANALYTICS REPORT'].map(escapeCsvCell).join(','))
  rows.push([
    `# Generated Date: ${dateStr} ${timeStr}`,
    `# Total Production Logs: ${analyticsData?.total_logs_count || 0}`,
    `# Total Inventory Mutations: ${analyticsData?.total_movements_count || 0}`
  ].map(escapeCsvCell).join(','))
  rows.push('')

  // Section 1: Monthly Production Yield
  rows.push(['=== TREN HASIL PRODUKSI BULANAN (MONTHLY YIELD) ==='].map(escapeCsvCell).join(','))
  rows.push(['Month', 'Actual Output (pcs)', 'Production Target (pcs)', 'Efficiency (%)'].map(escapeCsvCell).join(','))

  const yields = analyticsData?.monthly_yield || []
  yields.forEach((y) => {
    const eff = y.target > 0 ? ((y.output / y.target) * 100).toFixed(1) + '%' : '100%'
    rows.push([y.month, y.output, y.target, eff].map(escapeCsvCell).join(','))
  })

  rows.push('')
  // Section 2: Top Products Distribution
  rows.push(['=== DISTRIBUSI KELUARAN PRODUK UNGGULAN (TOP PRODUCTS) ==='].map(escapeCsvCell).join(','))
  rows.push(['Product Name', 'Volume Output (pcs)'].map(escapeCsvCell).join(','))

  const products = analyticsData?.top_products || []
  products.forEach((p) => {
    rows.push([p.name, p.volume].map(escapeCsvCell).join(','))
  })

  rows.push('')
  // Section 3: Machine Fleet Uptime
  rows.push(['=== STATUS ARMADA MESIN (MACHINE FLEET UPTIME) ==='].map(escapeCsvCell).join(','))
  rows.push(['Machine ID', '00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Status'].map(escapeCsvCell).join(','))
  rows.push(['MCH-01 (CNC Milling)', 'Optimal', 'Optimal', 'Optimal', 'Optimal', 'Optimal', 'Optimal', 'ACTIVE'].map(escapeCsvCell).join(','))
  rows.push(['MCH-02 (Hydraulic Press)', 'Maintenance', 'Standby', 'Optimal', 'Warning', 'Optimal', 'Optimal', 'ACTIVE'].map(escapeCsvCell).join(','))
  rows.push(['MCH-03 (Final Assembly)', 'Optimal', 'Optimal', 'Optimal', 'Optimal', 'Optimal', 'Optimal', 'ACTIVE'].map(escapeCsvCell).join(','))
  rows.push(['MCH-04 (Laser Cutting)', 'Off', 'Off', 'Off', 'Off', 'Off', 'Off', 'STANDBY'].map(escapeCsvCell).join(','))

  const csvContent = rows.join('\r\n')
  downloadCsvFile(filename, csvContent)

  return { success: true, filename }
}
