'use client'

import React, { useState } from 'react'
import { X, Check, AlertCircle } from 'lucide-react'
import { createProductApi } from '@/services/api'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddProductModal({
  isOpen,
  onClose,
  onSuccess
}: AddProductModalProps) {
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('Electronics & Automation')
  const [unit, setUnit] = useState('Pieces (pcs)')
  const [initialStock, setInitialStock] = useState<number>(0)
  const [minStock, setMinStock] = useState<number>(10)
  const [supplier, setSupplier] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const cleanUnit = unit.includes('(') ? unit.split('(')[1].replace(')', '') : unit
      await createProductApi({
        ProductName: productName,
        Unit: cleanUnit,
        MinStock: Number(minStock)
      })

      onSuccess()
      onClose()
      // Reset form
      setProductName('')
      setSupplier('')
      setDescription('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menambahkan produk baru ke server'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#162032] border border-[#1E293B] rounded-2xl w-full max-w-xl p-6 shadow-2xl relative overflow-hidden">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <h3 className="text-xl font-extrabold text-white tracking-tight">Add New Product</h3>
          <p className="text-xs text-slate-400 mt-1">Enter product details for inventory tracking.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Product Name */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Product Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Servo Motor A-12"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Category & Unit of Measure */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Electronics & Automation">Electronics & Automation</option>
                <option value="Mechanical Parts">Mechanical Parts</option>
                <option value="Sensors & Transducers">Sensors & Transducers</option>
                <option value="PLCs & Controllers">PLCs & Controllers</option>
                <option value="Raw Materials">Raw Materials</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Unit of Measure</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Pieces (pcs)">Pieces (pcs)</option>
                <option value="Units (unit)">Units (unit)</option>
                <option value="Boxes (box)">Boxes (box)</option>
                <option value="Meters (m)">Meters (m)</option>
                <option value="Kilograms (kg)">Kilograms (kg)</option>
              </select>
            </div>
          </div>

          {/* Initial Stock, Min Stock Level, Primary Supplier */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Initial Stock</label>
              <input
                type="number"
                min="0"
                value={initialStock}
                onChange={(e) => setInitialStock(Number(e.target.value))}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Min. Stock Level</label>
              <input
                type="number"
                min="0"
                value={minStock}
                onChange={(e) => setMinStock(Number(e.target.value))}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Primary Supplier</label>
              <input
                type="text"
                placeholder="Supplier Name"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Description</label>
            <textarea
              rows={3}
              placeholder="Technical specifications or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Active Status Switch Card */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white text-xs">Active Status</h4>
              <p className="text-[11px] text-slate-400">Product available for production orders.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className="text-blue-500 hover:text-blue-400 transition-colors"
            >
              {isActive ? (
                <div className="w-10 h-5 bg-blue-600 rounded-full p-0.5 flex justify-end transition-all">
                  <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                </div>
              ) : (
                <div className="w-10 h-5 bg-slate-700 rounded-full p-0.5 flex justify-start transition-all">
                  <div className="w-4 h-4 bg-slate-400 rounded-full shadow-md"></div>
                </div>
              )}
            </button>
          </div>

          {/* Footer Form Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E293B]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white font-semibold bg-[#0F172A] border border-[#1E293B] hover:bg-[#1E2D47] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
