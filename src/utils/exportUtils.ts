import { getProductsApi, getProductionLogsApi, getInventoryMovementsApi, Product, ProductionLogItem, InventoryMovementItem } from '@/services/api'

/**
 * Escapes a cell value for standard RFC 4180 CSV compliance
 */
function escapeCsvCell(val: string | number | null | undefined): string {
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
 * Exports real live factory inventory and product catalog to CSV
 */
export async function exportFactoryInventoryCsv(): Promise<{ success: boolean; filename: string; rowCount: number }> {
  const [productsRes, logsRes, movementsRes] = await Promise.allSettled([
    getProductsApi(),
    getProductionLogsApi(),
    getInventoryMovementsApi(),
  ])

  const products: Product[] = productsRes.status === 'fulfilled' ? productsRes.value : []
  const logs: ProductionLogItem[] = logsRes.status === 'fulfilled' ? logsRes.value : []
  const movements: InventoryMovementItem[] = movementsRes.status === 'fulfilled' ? movementsRes.value : []

  const dateStr = new Date().toISOString().slice(0, 10)
  const timeStr = new Date().toLocaleTimeString('id-ID')
  const filename = `smart_factory_inventory_${dateStr}.csv`

  const rows: string[] = []

  // Header Metadata Section
  rows.push(['# SMART FACTORY AUTOMATION - INVENTORY & PRODUCTION EXPORT'].map(escapeCsvCell).join(','))
  rows.push([`# Generated Date: ${dateStr} ${timeStr}`, `# Total Products: ${products.length}`, `# Total Movements Logged: ${movements.length}`].map(escapeCsvCell).join(','))
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
    'Created At',
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
      p.CreatedAt ? new Date(p.CreatedAt).toLocaleString('id-ID') : '-',
    ].map(escapeCsvCell).join(','))
  })

  rows.push('')
  rows.push(['=== RIWAYAT MUTASI INVENTARIS TERKINI (IN / OUT) ==='].map(escapeCsvCell).join(','))
  rows.push([
    'Movement ID',
    'Product Name',
    'Movement Type',
    'Quantity',
    'Date & Time',
  ].map(escapeCsvCell).join(','))

  movements.forEach((m) => {
    rows.push([
      m.MovementID,
      m.Products?.ProductName || `Product #${m.ProductID}`,
      m.MovementType === 'IN' ? 'PENERIMAAN / PRODUKSI (IN)' : 'PENGELUARAN (OUT)',
      m.Quantity,
      new Date(m.MovementDate).toLocaleString('id-ID'),
    ].map(escapeCsvCell).join(','))
  })

  rows.push('')
  rows.push(['=== RIWAYAT LOG PRODUKSI MANUFAKTUR ==='].map(escapeCsvCell).join(','))
  rows.push([
    'Log ID',
    'Product Name',
    'Quantity Output',
    'Operator Name',
    'Production Timestamp',
  ].map(escapeCsvCell).join(','))

  logs.forEach((l) => {
    rows.push([
      l.LogID,
      l.Products?.ProductName || `Product #${l.ProductID}`,
      l.Quantity,
      l.OperatorName,
      new Date(l.ProductionDate).toLocaleString('id-ID'),
    ].map(escapeCsvCell).join(','))
  })

  const csvContent = rows.join('\r\n')
  downloadCsvFile(filename, csvContent)

  return {
    success: true,
    filename,
    rowCount: products.length + movements.length + logs.length,
  }
}
