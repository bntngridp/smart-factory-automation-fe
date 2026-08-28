'use client'

import React, { useState, useEffect } from 'react'
import { X, ClipboardCheck, Check, AlertCircle } from 'lucide-react'
import { getProductsApi, createProductionLogApi, Product } from '@/services/api'
import { useLanguage } from '@/context/LanguageContext'

interface RecordProductionModalProps {
  isOpen: boolean
  preselectedProductId?: number
  onClose: () => void
  onSuccess: () => void
}

export default function RecordProductionModal({
  isOpen,
  preselectedProductId,
  onClose,
  onSuccess
}: RecordProductionModalProps) {
  const { t, formatNumber } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('')
  const [quantity, setQuantity] = useState<number>(100)
  const [operatorName, setOperatorName] = useState('Budi Santoso')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false
    const load = async () => {
      if (!isOpen) return
      try {
        const data = await getProductsApi()
        if (!ignore) {
          setProducts(data)
          if (preselectedProductId) {
            setSelectedProductId(preselectedProductId)
          } else if (data.length > 0 && !selectedProductId) {
            setSelectedProductId(data[0].ProductID)
          }
        }
      } catch (err) {
        console.error('Failed to fetch products for production log modal:', err)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [isOpen, preselectedProductId, selectedProductId])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProductId) {
      setError(t('please_select_product'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      await createProductionLogApi({
        product_id: Number(selectedProductId),
        quantity: Number(quantity),
        operator_name: operatorName
      })

      try {
        window.dispatchEvent(new Event('forge_production_logged'))
      } catch {}
      onSuccess()
      onClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mencatat log produksi ke server'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#162032] border border-[#1E293B] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/50 shrink-0">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white leading-tight">{t('record_daily_production')}</h3>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">{t('select_product_prompt')}</label>
            <select
              required
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(Number(e.target.value))}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              {products.length === 0 ? (
                <option value="">{t('no_products') || 'No products found'}</option>
              ) : (
                products.map((p) => (
                  <option key={p.ProductID} value={p.ProductID}>
                    [PRD-{formatNumber(p.ProductID)}] {p.ProductName} ({p.Unit === 'pcs' || p.Unit === 'pzas' ? t('pcs') : p.Unit || t('units')})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">{t('quantity_produced')} *</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">{t('operator_name_label')} *</label>
              <input
                type="text"
                required
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E293B]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold transition-colors cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? '...' : t('save_production_log')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
