'use client'

import React, { useState, useEffect } from 'react'
import { X, ClipboardCheck, Check, AlertCircle } from 'lucide-react'
import { getProductsApi, createProductionLogApi, Product } from '@/services/api'

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
      setError('Please select a product')
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
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">Record Daily Production</h3>
            <p className="text-xs text-slate-400">Log output quantity & automatically mutate stock IN</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Select Product *</label>
            <select
              required
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(Number(e.target.value))}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {products.length === 0 ? (
                <option value="">No products found</option>
              ) : (
                products.map((p) => (
                  <option key={p.ProductID} value={p.ProductID}>
                    [{p.ProductID}] {p.ProductName} ({p.Unit || 'pcs'})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Produced Quantity *</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Operator Name *</label>
              <input
                type="text"
                required
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E293B]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2 rounded-xl shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : 'Record Production'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
