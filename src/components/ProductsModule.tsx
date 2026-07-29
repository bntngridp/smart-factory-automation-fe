'use client'

import React, { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Package,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { getProductsApi, deleteProductApi, Product } from '@/services/api'

interface ProductsModuleProps {
  onOpenAddProduct: () => void
  onOpenRecordProduction: (productId?: number) => void
}

export default function ProductsModule({
  onOpenAddProduct,
  onOpenRecordProduction
}: ProductsModuleProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])

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
    fetchProducts()
  }, [])

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus produk PRD-${id}?`)) return
    try {
      await deleteProductApi(id)
      setProducts((prev) => prev.filter((p) => p.ProductID !== id))
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus produk')
    }
  }

  const filteredProducts = products.filter((p) =>
    p.ProductName.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Primary Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Products Management
            </h1>
            <span className="text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Package className="w-3 h-3" />
              Master Catalog
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage and track manufacturing inventory & safety thresholds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="flex items-center gap-1.5 bg-[#162032] hover:bg-[#1E2D47] text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl border border-[#1E293B] transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={onOpenAddProduct}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0F172A] text-xs text-slate-200 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 border border-[#1E293B] focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-[#0F172A] hover:bg-[#1E2D47] border border-[#1E293B] text-slate-300 text-xs px-3.5 py-2.5 rounded-xl transition-colors">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter Status</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-[#1E293B]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0F172A] border-b border-[#1E293B] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-4 w-10 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      filteredProducts.length > 0 &&
                      selectedIds.length === filteredProducts.length
                    }
                    className="rounded border-[#1E293B] bg-[#162032] text-blue-600 focus:ring-0"
                  />
                </th>
                <th className="p-4">Product ID</th>
                <th className="p-4">Product Name</th>
                <th className="p-4 text-center">Unit</th>
                <th className="p-4 text-center">Current Stock</th>
                <th className="p-4 text-center">Min Stock</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Loading master catalog products from MSSQL...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No products found matching query.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item) => {
                  const isSelected = selectedIds.includes(item.ProductID)
                  const currentStock = item.CurrentStock ?? 0
                  const minStock = item.MinStock ?? 0
                  const isOut = currentStock === 0
                  const isLow = currentStock < minStock && !isOut

                  return (
                    <tr
                      key={item.ProductID}
                      className={`hover:bg-[#1E2D47]/40 transition-colors ${
                        isSelected ? 'bg-blue-900/10' : ''
                      }`}
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(item.ProductID)}
                          className="rounded border-[#1E293B] bg-[#162032] text-blue-600 focus:ring-0"
                        />
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-400">
                        PRD-{item.ProductID}
                      </td>
                      <td className="p-4 font-bold text-white">
                        {item.ProductName}
                      </td>
                      <td className="p-4 text-center text-slate-300">
                        {item.Unit || 'pcs'}
                      </td>
                      <td
                        className={`p-4 text-center font-bold ${
                          isOut
                            ? 'text-rose-400'
                            : isLow
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {currentStock.toLocaleString()}
                      </td>
                      <td className="p-4 text-center text-slate-400 font-medium">
                        {minStock.toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        {isOut ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                            OUT OF STOCK
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            LOW STOCK
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            IN STOCK
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onOpenRecordProduction(item.ProductID)}
                            className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                            title="Produce Item"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => alert(`Edit PRD-${item.ProductID}`)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(item.ProductID)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
            <select className="bg-[#162032] border border-[#1E293B] text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none">
              <option>Bulk Actions</option>
              <option>Delete Selected</option>
              <option>Export CSV</option>
            </select>
            <button className="bg-[#162032] hover:bg-[#1E2D47] border border-[#1E293B] text-slate-200 px-3 py-1.5 rounded-lg transition-colors font-medium">
              Apply
            </button>
            <span className="text-[11px] text-slate-500">
              {selectedIds.length} selected
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span>Showing 1-{filteredProducts.length} of {products.length} products</span>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg bg-[#162032] border border-[#1E293B] text-slate-400 hover:text-white disabled:opacity-40">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold">1</button>
              <button className="px-2.5 py-1 rounded-lg bg-[#162032] text-slate-300 hover:bg-[#1E2D47]">2</button>
              <button className="p-1.5 rounded-lg bg-[#162032] border border-[#1E293B] text-slate-400 hover:text-white">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
