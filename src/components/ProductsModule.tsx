'use client'

import React, { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Plus,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  X,
  Check,
  Upload,
  Download
} from 'lucide-react'
import { getProductsApi, deleteProductApi, Product } from '@/services/api'
import { useLanguage } from '@/context/LanguageContext'
import { exportProductsCatalogCsv } from '@/utils/exportUtils'
import ImportProductsModal from '@/components/Modals/ImportProductsModal'

interface ProductsModuleProps {
  onOpenAddProduct: () => void
  onOpenRecordProduction: (productId?: number) => void
}

export default function ProductsModule({
  onOpenAddProduct,
  onOpenRecordProduction
}: ProductsModuleProps) {
  const { t, formatNumber } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Delete Confirmation Modal States
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Import Modal State & Export loading
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [exporting, setExporting] = useState(false)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await getProductsApi()
      setProducts(data)
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false
    const load = async () => {
      try {
        const data = await getProductsApi()
        if (!ignore) {
          setProducts(data)
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [])

  const handleConfirmDelete = async () => {
    if (!productToDelete) return
    setDeleting(true)
    try {
      await deleteProductApi(productToDelete.ProductID)
      setProducts((prev) => prev.filter((p) => p.ProductID !== productToDelete.ProductID))
      setProductToDelete(null)
      showToast(t('delete_product_success'))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menghapus produk'
      showToast(msg)
    } finally {
      setDeleting(false)
    }
  }

  const filteredProducts = products.filter((p) =>
    p.ProductName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `PRD-${p.ProductID}`.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map((p) => p.ProductID))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleExportCatalog = async () => {
    setExporting(true)
    try {
      const res = await exportProductsCatalogCsv()
      showToast(`${t('export_catalog_csv')}: ${res.filename}`)
    } catch (err) {
      console.error('Export catalog failed:', err)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center gap-3 shadow-2xl animate-fade-in">
          <Check className="w-5 h-5 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Primary Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {t('products_management')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t('products_subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchProducts}
            className="flex items-center gap-1.5 bg-[#162032] hover:bg-[#1E2D47] text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl border border-[#1E293B] transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{t('sync_data')}</span>
          </button>

          <button
            onClick={handleExportCatalog}
            disabled={exporting}
            className="flex items-center gap-1.5 bg-[#162032] hover:bg-[#1E2D47] text-slate-300 hover:text-white text-xs font-semibold px-3 py-2 rounded-xl border border-[#1E293B] transition-all cursor-pointer disabled:opacity-50"
            title="Export Products to CSV"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>{exporting ? '...' : t('export')}</span>
          </button>

          <button
            onClick={() => setImportModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#162032] hover:bg-[#1E2D47] text-emerald-400 hover:text-emerald-300 text-xs font-semibold px-3 py-2 rounded-xl border border-emerald-500/30 hover:border-emerald-500/50 transition-all cursor-pointer"
            title="Import Products from CSV"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{t('import_csv')}</span>
          </button>

          <button
            onClick={onOpenAddProduct}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('add_product')}</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="glass-card rounded-2xl border border-[#1E293B] overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#1E293B] flex flex-wrap items-center justify-between gap-4 bg-[#0F172A]">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('search_products')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#162032] text-xs text-slate-200 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 border border-[#1E293B] focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-[#162032] border border-[#1E293B] text-slate-300 text-xs px-3 py-2 rounded-xl hover:text-white transition-colors">
              <Filter className="w-3.5 h-3.5" />
              <span>{t('all_statuses')}</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0B132B] border-b border-[#1E293B] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                    className="rounded border-slate-700 bg-[#0F172A] text-blue-600 focus:ring-0 focus:ring-offset-0"
                  />
                </th>
                <th className="p-4">SKU / ID</th>
                <th className="p-4">{t('product_name')}</th>
                <th className="p-4">{t('unit')}</th>
                <th className="p-4 text-center">{t('current_stock')}</th>
                <th className="p-4 text-center">{t('min_stock')}</th>
                <th className="p-4 text-center">{t('status')}</th>
                <th className="p-4 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                      <span>{t('loading')}</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    {t('no_products')}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item) => {
                  const currentStock = item.CurrentStock ?? 0
                  const isSelected = selectedIds.includes(item.ProductID)
                  const isLow = currentStock > 0 && currentStock <= item.MinStock
                  const isOut = currentStock === 0

                  return (
                    <tr
                      key={item.ProductID}
                      className={`hover:bg-[#1E2D47]/40 transition-colors ${
                        isSelected ? 'bg-blue-600/10' : ''
                      }`}
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(item.ProductID)}
                          className="rounded border-slate-700 bg-[#0F172A] text-blue-600 focus:ring-0 focus:ring-offset-0"
                        />
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-400">
                        PRD-{formatNumber(item.ProductID)}
                      </td>
                      <td className="p-4 font-bold text-white">
                        {item.ProductName}
                      </td>
                      <td className="p-4 text-slate-300">
                        {item.Unit === 'pcs' || item.Unit === 'pzas' ? t('pcs') : item.Unit || t('units')}
                      </td>
                      <td className="p-4 text-center font-mono font-bold text-white">
                        {formatNumber(currentStock)}
                      </td>
                      <td className="p-4 text-center font-mono text-slate-400">
                        {formatNumber(item.MinStock)}
                      </td>
                      <td className="p-4 text-center">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                            <span>{t('out_of_stock_status')}</span>
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                            <span>{t('low_stock_status')}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                            <span>{t('in_stock_status')}</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onOpenRecordProduction(item.ProductID)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all cursor-pointer"
                            title={t('produce')}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                            title={t('delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination Bar */}
        <div className="bg-[#0F172A] p-4 border-t border-[#1E293B] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">
              {formatNumber(selectedIds.length)} {t('active_catalog')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span>{t('showing')} {formatNumber(filteredProducts.length)} {t('of')} {formatNumber(products.length)} {t('products')}</span>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg bg-[#162032] border border-[#1E293B] text-slate-400 hover:text-white disabled:opacity-40">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold">{formatNumber(1)}</button>
              <button className="p-1.5 rounded-lg bg-[#162032] border border-[#1E293B] text-slate-400 hover:text-white">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Product Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#162032] border border-[#1E293B] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setProductToDelete(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">{t('delete')} {t('products')}</h3>
                <p className="text-xs text-slate-400 font-mono">PRD-{formatNumber(productToDelete.ProductID)}</p>
              </div>
            </div>

            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs space-y-2 mb-5">
              <p className="text-rose-300">
                {t('confirm_delete_product')} <strong className="text-white underline">&ldquo;{productToDelete.ProductName}&rdquo;</strong>?
              </p>
              <p className="text-[11px] text-slate-400">
                {t('delete_warning')}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold transition-colors cursor-pointer text-xs"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-rose-500/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleting ? '...' : t('delete')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Products from CSV Modal */}
      <ImportProductsModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onSuccess={() => {
          fetchProducts()
          showToast(t('import_success'))
        }}
      />
    </div>
  )
}
