'use client'

import React, { useState, useEffect } from 'react'
import { X, ArrowUpRight, Check, AlertCircle } from 'lucide-react'

interface ProductOption {
  ProductID: number
  ProductName: string
  Unit: string | null
}

interface StockOutModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function StockOutModal({
  isOpen,
  onClose,
  onSuccess
}: StockOutModalProps) {
  const [products, setProducts] = useState<ProductOption[]>([])
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('')
  const [quantity, setQuantity] = useState<number>(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchProducts()
    }
  }, [isOpen])

  const fetchProducts = async () => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6060'
      const res = await fetch(`${apiBase}/api/products`)
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
        if (data.length > 0 && !selectedProductId) {
          setSelectedProductId(data[0].ProductID)
        }
      }
    } catch (err) {
      console.error('Failed to fetch products', err)
    }
  }

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
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6060'
      const res = await fetch(`${apiBase}/api/inventory/movements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: Number(selectedProductId),
          quantity: Number(quantity),
          movement_type: 'OUT'
        })
      })

      const data = await res.json()

      if (!res.ok) {
        // Status 422 triggers when stock is insufficient
        throw new Error(data.error || 'Failed to record stock output')
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Error connecting to API server')
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
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">Record Inventory Stock Out</h3>
            <p className="text-xs text-slate-400">Deduct stock for distribution or maintenance</p>
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
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
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

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Stock Out Quantity *</label>
            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Note: Request will fail if requested quantity exceeds current available stock.
            </p>
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
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold px-5 py-2 rounded-xl shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Processing...' : 'Deduct Stock'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
