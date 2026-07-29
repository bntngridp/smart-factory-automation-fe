export interface Product {
  ProductID: number
  ProductName: string
  Unit: string
  MinStock: number
  CurrentStock?: number
  CreatedAt?: string
  UpdatedAt?: string
}

export interface CreateProductPayload {
  ProductName: string
  Unit: string
  MinStock: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6060/api'

export async function getProductsApi(): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal mengambil data produk')
  }

  return res.json()
}

export async function createProductApi(payload: CreateProductPayload): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal menambahkan produk baru')
  }

  return res.json()
}

export async function deleteProductApi(id: number): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Gagal menghapus produk')
  }

  return res.json()
}
