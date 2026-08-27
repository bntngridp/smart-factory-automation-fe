export interface ParsedProductRow {
  ProductName: string
  Unit: string
  MinStock: number
  CurrentStock?: number
}

export interface ImportValidationResult {
  validRows: ParsedProductRow[]
  errors: { row: number; message: string }[]
  totalRows: number
}

/**
 * Robust RFC 4180 CSV parser that handles quoted strings with embedded commas and newlines
 */
export function parseCsvText(csvText: string): string[][] {
  const result: string[][] = []
  let currentRow: string[] = []
  let currentCell = ''
  let insideQuotes = false

  const text = csvText.replace(/^\uFEFF/, '') // Strip UTF-8 BOM if present

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const nextChar = text[i + 1]

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote: ""
        currentCell += '"'
        i++ // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell.trim())
      currentCell = ''
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++ // Skip \n in \r\n
      }
      currentRow.push(currentCell.trim())
      if (currentRow.some((c) => c.length > 0)) {
        result.push(currentRow)
      }
      currentRow = []
      currentCell = ''
    } else {
      currentCell += char
    }
  }

  // Push remaining cell if any
  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim())
    if (currentRow.some((c) => c.length > 0)) {
      result.push(currentRow)
    }
  }

  return result
}

/**
 * Validates parsed CSV rows against product schema requirements
 */
export function validateProductImportRows(rows: string[][]): ImportValidationResult {
  if (rows.length === 0) {
    return { validRows: [], errors: [{ row: 0, message: 'File CSV kosong' }], totalRows: 0 }
  }

  // Check header row
  const header = rows[0].map((h) => h.toLowerCase().replace(/[\s_#]/g, ''))
  const nameIdx = header.findIndex((h) => h.includes('productname') || h === 'name' || h === 'namaproduk')
  const unitIdx = header.findIndex((h) => h.includes('unit') || h === 'satuan')
  const minStockIdx = header.findIndex((h) => h.includes('minstock') || h.includes('safety') || h === 'minimumstok')
  const curStockIdx = header.findIndex((h) => h.includes('currentstock') || h === 'stock' || h === 'stok')

  const dataRows = rows.slice(1)
  const validRows: ParsedProductRow[] = []
  const errors: { row: number; message: string }[] = []

  dataRows.forEach((row, index) => {
    const rowNum = index + 2 // 1-indexed including header
    if (row.length === 0 || row.every((c) => c === '')) return

    const name = nameIdx !== -1 ? row[nameIdx] : row[0]
    const unit = unitIdx !== -1 ? row[unitIdx] : row[1] || 'pcs'
    const minStockRaw = minStockIdx !== -1 ? row[minStockIdx] : row[2] || '10'
    const curStockRaw = curStockIdx !== -1 ? row[curStockIdx] : row[3]

    if (!name || name.trim() === '') {
      errors.push({ row: rowNum, message: 'Nama produk tidak boleh kosong' })
      return
    }

    const minStock = parseInt(minStockRaw, 10)
    if (isNaN(minStock) || minStock < 0) {
      errors.push({ row: rowNum, message: `Batas minimum stok tidak valid: "${minStockRaw}"` })
      return
    }

    const currentStock = curStockRaw !== undefined && curStockRaw !== '' ? parseInt(curStockRaw, 10) : undefined

    validRows.push({
      ProductName: name.trim(),
      Unit: unit ? unit.trim() : 'pcs',
      MinStock: minStock,
      CurrentStock: currentStock !== undefined && !isNaN(currentStock) ? currentStock : undefined
    })
  })

  return {
    validRows,
    errors,
    totalRows: dataRows.length
  }
}
