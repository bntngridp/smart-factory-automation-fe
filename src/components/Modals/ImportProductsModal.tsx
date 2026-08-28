'use client'

import React, { useState, useRef } from 'react'
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  Download,
  Check,
  AlertCircle,
  RefreshCw,
  Trash2,
  Package
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { parseCsvText, validateProductImportRows, ParsedProductRow } from '@/utils/importUtils'
import { downloadProductCsvTemplate } from '@/utils/exportUtils'
import { createProductApi } from '@/services/api'

interface ImportProductsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function ImportProductsModal({
  isOpen,
  onClose,
  onSuccess
}: ImportProductsModalProps) {
  const { t, formatNumber } = useLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [parsedRows, setParsedRows] = useState<ParsedProductRow[]>([])
  const [validationErrors, setValidationErrors] = useState<{ row: number; message: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState<{ current: number; total: number } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    processFile(selected)
  }

  const processFile = (selected: File) => {
    if (!selected.name.endsWith('.csv')) {
      setErrorMsg('Hanya file format .csv yang didukung.')
      return
    }

    setFile(selected)
    setLoading(true)
    setErrorMsg(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const rawGrid = parseCsvText(text)
        const result = validateProductImportRows(rawGrid)

        setParsedRows(result.validRows)
        setValidationErrors(result.errors)
        setLoading(false)
      } catch (err) {
        console.error('CSV parse error:', err)
        setErrorMsg('Gagal membaca struktur file CSV.')
        setLoading(false)
      }
    }
    reader.onerror = () => {
      setErrorMsg('Gagal membuka file.')
      setLoading(false)
    }
    reader.readAsText(selected, 'UTF-8')
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      processFile(droppedFile)
    }
  }

  const handleReset = () => {
    setFile(null)
    setParsedRows([])
    setValidationErrors([])
    setErrorMsg(null)
    setImportProgress(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleExecuteImport = async () => {
    if (parsedRows.length === 0) return
    setImporting(true)
    setErrorMsg(null)
    setImportProgress({ current: 0, total: parsedRows.length })

    let successCount = 0
    try {
      for (let i = 0; i < parsedRows.length; i++) {
        const item = parsedRows[i]
        await createProductApi({
          ProductName: item.ProductName,
          Unit: item.Unit,
          MinStock: item.MinStock
        })
        successCount++
        setImportProgress({ current: successCount, total: parsedRows.length })
      }

      onSuccess()
      onClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kegagalan saat import'
      setErrorMsg(`Berhasil mengimpor ${successCount} dari ${parsedRows.length} produk. Error: ${msg}`)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#162032] border border-[#1E293B] rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          disabled={importing}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1E293B] gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {t('import_products_title')}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('import_products_desc')}
              </p>
            </div>
          </div>

          <button
            onClick={downloadProductCsvTemplate}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F172A] border border-[#1E293B] hover:bg-[#1E2D47] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shrink-0"
            title="Download Template CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{t('download_template')}</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="my-3 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-xs">
          {!file ? (
            /* Upload Drop Area */
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#1E293B] hover:border-slate-600 rounded-2xl p-8 text-center cursor-pointer transition-all bg-[#0F172A]/50 hover:bg-[#0F172A] flex flex-col items-center justify-center gap-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-sm">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">
                  {t('drag_drop_csv')}
                </p>
                <p className="text-slate-400 text-[11px] mt-1">
                  Format: .csv (Kolom: ProductName, Unit, MinStock)
                </p>
              </div>
            </div>
          ) : (
            /* File Preview & Validation Results */
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#0F172A] border border-[#1E293B] rounded-xl">
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="font-bold text-white text-xs">{file.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {(file.size / 1024).toFixed(1)} KB • {parsedRows.length} {t('valid_rows_found')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  disabled={importing}
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer disabled:opacity-50"
                  title="Ganti File"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Validation Errors Warning */}
              {validationErrors.length > 0 && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Ditemukan {validationErrors.length} baris tidak valid (akan dilewati):</span>
                  </div>
                  <ul className="list-disc list-inside text-[10px] text-amber-300/80 space-y-0.5 max-h-20 overflow-y-auto pl-1">
                    {validationErrors.map((err, i) => (
                      <li key={i}>Baris {err.row}: {err.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Data Table Preview */}
              <div>
                <h4 className="font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  <span>Preview Data Impor ({parsedRows.length} Produk):</span>
                </h4>
                <div className="border border-[#1E293B] rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#0F172A] text-slate-400 font-semibold text-[10px] uppercase border-b border-[#1E293B]">
                        <th className="p-2.5">#</th>
                        <th className="p-2.5">{t('product_name')}</th>
                        <th className="p-2.5">{t('unit')}</th>
                        <th className="p-2.5 text-right">{t('min_stock')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E293B]">
                      {parsedRows.map((item, idx) => (
                        <tr key={idx} className="hover:bg-[#1E2D47]/40 text-slate-200">
                          <td className="p-2.5 font-mono text-slate-400 text-[11px]">{idx + 1}</td>
                          <td className="p-2.5 font-semibold text-white">{item.ProductName}</td>
                          <td className="p-2.5 text-slate-300">{item.Unit}</td>
                          <td className="p-2.5 text-right font-mono text-slate-300">{item.MinStock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Progress Bar during Import */}
              {importProgress && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                    <span>Mengimpor produk ke database MSSQL...</span>
                    <span>{importProgress.current} / {importProgress.total}</span>
                  </div>
                  <div className="w-full bg-[#0F172A] rounded-full h-2 overflow-hidden border border-[#1E293B]">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#1E293B]">
          <button
            type="button"
            onClick={onClose}
            disabled={importing}
            className="px-4 py-2 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer text-xs font-semibold disabled:opacity-50"
          >
            {t('cancel')}
          </button>

          <button
            type="button"
            onClick={handleExecuteImport}
            disabled={importing || loading || parsedRows.length === 0}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {importing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Mengimpor...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Mulai Impor ({formatNumber(parsedRows.length)} Produk)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
