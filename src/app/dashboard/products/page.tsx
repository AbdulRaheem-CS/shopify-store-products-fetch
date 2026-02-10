'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { 
  HiCube, 
  HiPencil, 
  HiX, 
  HiTag, 
  HiShoppingBag,
  HiPhotograph,
  HiCurrencyDollar,
  HiViewGrid
} from 'react-icons/hi'
import { BiRefresh } from 'react-icons/bi'

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  compareAtPrice: number | null
  image: string | null
  store: {
    name: string
    platform: string
  }
  variants: Array<{
    id: string
    title: string
    price: number
    sku: string | null
    inventoryQuantity: number | null
  }>
  tags: Array<{
    id: string
    tag: string
  }>
  metafields: Array<{
    id: string
    namespace: string
    key: string
    value: string
    type: string
  }>
}

export default function ProductsPage() {
  const router = useRouter()
  const { status } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState<any>({})
  const [isSaving, setIsSaving] = useState(false)

  const fetchProducts = async (silent = false) => {
    if (!silent) setIsLoading(true)
    setIsRefreshing(true)
    try {
      const res = await fetch('/api/products')
      if (res.status === 401) {
        router.push('/auth/signin')
        return
      }
      if (!res.ok) throw new Error('Failed to fetch products')
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Small helper to strip HTML tags and decode basic entities
  const stripHtml = (html: string) => {
    if (!html) return ''
    // Remove tags
    const tmp = html.replace(/<[^>]*>/g, '')
    // Decode common entities
    return tmp.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProducts()
    }
  }, [status])

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setEditData({
  title: product.title,
  // show plain text in textarea (strip HTML tags)
  description: product.description ? stripHtml(product.description) : '',
  price: product.price,
  tags: product.tags.map(t => t.tag),
    })
    setEditMode(true)
  }

  const handleSave = async () => {
    if (!selectedProduct) return
    setIsSaving(true)

    try {
      const res = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      })

      if (!res.ok) throw new Error('Failed to update product')
      
      alert('Product updated successfully!')
      setEditMode(false)
      setSelectedProduct(null)
      await fetchProducts(true)
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg text-slate-600 font-medium">Loading products...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <HiCube className="w-8 h-8 text-blue-600" />
              Products
            </h1>
            <p className="text-slate-600 mt-2">View and edit your imported products</p>
          </div>
          <button
            onClick={() => fetchProducts(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <BiRefresh className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="font-medium">Refresh</span>
          </button>
        </div>

        {/* Stats Overview */}
        {products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Products</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{products.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <HiCube className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg Price</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    ${(products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <HiCurrencyDollar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Variants</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {products.reduce((sum, p) => sum + p.variants.length, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <HiViewGrid className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiCube className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Import products from your connected stores to start managing them
            </p>
            <button
              onClick={() => router.push('/dashboard/stores')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              <HiShoppingBag className="w-5 h-5" />
              Go to Stores
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group overflow-hidden">
                {/* Product Image */}
                <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-slate-200 rounded-2xl flex items-center justify-center">
                        <HiPhotograph className="w-10 h-10 text-slate-400" />
                      </div>
                    </div>
                  )}
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                      SALE
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5">
                  {/* Store Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700">
                      {product.store.name}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">
                      {product.store.platform}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                    {product.description ? 
                      product.description.replace(/<[^>]*>/g, '') : 
                      'No description available'
                    }
                  </p>

                  {/* Price & Variants */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="text-sm text-slate-500 line-through">
                            ${product.compareAtPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                      <HiViewGrid className="w-4 h-4" />
                      {product.variants.length}
                    </div>
                  </div>

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {product.tags.slice(0, 3).map((tagObj) => (
                        <span
                          key={tagObj.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                        >
                          <HiTag className="w-3 h-3" />
                          {tagObj.tag}
                        </span>
                      ))}
                      {product.tags.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                          +{product.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Edit Button */}
                  <button
                    onClick={() => handleEdit(product)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <HiPencil className="w-4 h-4" />
                    Edit Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editMode && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-6 flex justify-between items-center rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold">Edit Product</h2>
                <p className="text-blue-100 mt-1">Update product details and sync back to store</p>
              </div>
              <button
                onClick={() => {
                  setEditMode(false)
                  setSelectedProduct(null)
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="p-8 space-y-6">
              {/* Product Image Preview */}
              {selectedProduct.image && (
                <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}

              {/* Title */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                  <HiCube className="w-4 h-4 text-blue-600" />
                  Product Title
                </label>
                <input
                  type="text"
                  value={editData.title || ''}
                  onChange={(e) => setEditData({...editData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                  Description
                </label>
                <textarea
                  value={editData.description || ''}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Price */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                  <HiCurrencyDollar className="w-4 h-4 text-green-600" />
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={editData.price || ''}
                    onChange={(e) => setEditData({...editData, price: parseFloat(e.target.value)})}
                    className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                  <HiTag className="w-4 h-4 text-emerald-600" />
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={editData.tags?.join(', ') || ''}
                  onChange={(e) => setEditData({ ...editData, tags: e.target.value.split(',').map((t: string) => t.trim()).filter((t: string) => t) })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., clothing, summer, sale"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false)
                    setSelectedProduct(null)
                  }}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save & Sync to Shopify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
