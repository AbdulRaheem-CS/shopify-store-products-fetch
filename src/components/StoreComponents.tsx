'use client'

import { useState } from 'react'
import { HiX, HiShoppingBag, HiDownload, HiTrash, HiCube, HiCalendar, HiLink, HiExclamationCircle } from 'react-icons/hi'
import { SiShopify, SiWoo, SiMagento } from 'react-icons/si'

interface Store {
  id: string
  name: string
  platform: string
  storeUrl: string
  _count: {
    products: number
  }
  createdAt: string
}

interface AddStoreModalProps {
  isOpen: boolean
  onClose: () => void
  onStoreAdded: () => void
}

export function AddStoreModal({ isOpen, onClose, onStoreAdded }: AddStoreModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    platform: 'SHOPIFY',
    storeUrl: '',
    accessToken: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Failed to add store')

      setFormData({ name: '', platform: 'SHOPIFY', storeUrl: '', accessToken: '' })
      onStoreAdded()
      onClose()
    } catch (err) {
      setError('Failed to add store. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <HiShoppingBag className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Add New Store</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <HiExclamationCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Store Name
            </label>
            <input
              type="text"
              required
              placeholder="My Awesome Store"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Platform
            </label>
            <select
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            >
              <option value="SHOPIFY">🛍️ Shopify</option>
              <option value="WOOCOMMERCE">🛒 WooCommerce</option>
              <option value="MAGENTO">🏪 Magento</option>
              <option value="CUSTOM">⚙️ Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Store URL
            </label>
            <div className="relative">
              <HiLink className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="url"
                required
                placeholder="https://yourstore.myshopify.com"
                value={formData.storeUrl}
                onChange={(e) => setFormData({ ...formData, storeUrl: e.target.value })}
                className="block w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Access Token
            </label>
            <input
              type="password"
              required
              placeholder="shpat_••••••••••••••••"
              value={formData.accessToken}
              onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
              className="block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
            />
            <p className="mt-2 text-xs text-slate-500">
              Find your access token in your store's admin panel
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {isLoading ? 'Adding...' : 'Add Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function StoreCard({ store, onDelete, onImport }: {
  store: Store
  onDelete: (id: string) => void
  onImport: (id: string) => void
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDelete(store.id)
    setIsDeleting(false)
  }

  const handleImport = async () => {
    setIsImporting(true)
    await onImport(store.id)
    setIsImporting(false)
  }

  const getPlatformIcon = () => {
    switch (store.platform) {
      case 'SHOPIFY':
        return <SiShopify className="w-6 h-6" />
      case 'WOOCOMMERCE':
        return <SiWoo className="w-6 h-6" />
      case 'MAGENTO':
        return <SiMagento className="w-6 h-6" />
      default:
        return <HiShoppingBag className="w-6 h-6" />
    }
  }

  const getPlatformColor = () => {
    switch (store.platform) {
      case 'SHOPIFY':
        return 'from-green-500 to-emerald-600'
      case 'WOOCOMMERCE':
        return 'from-purple-500 to-violet-600'
      case 'MAGENTO':
        return 'from-orange-500 to-red-600'
      default:
        return 'from-blue-500 to-indigo-600'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group overflow-hidden">
      {/* Platform Badge Header */}
      <div className={`h-2 bg-gradient-to-r ${getPlatformColor()}`}></div>
      
      <div className="p-6">
        {/* Store Info */}
        <div className="flex items-start gap-4 mb-6">
          <div className={`w-14 h-14 bg-gradient-to-br ${getPlatformColor()} rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
            {getPlatformIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">{store.name}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
              <span className="px-2.5 py-0.5 bg-slate-100 rounded-md font-medium">
                {store.platform}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <HiLink className="w-4 h-4" />
              <span className="truncate">{store.storeUrl}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <HiCube className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{store._count.products}</p>
              <p className="text-xs text-slate-600">Products</p>
            </div>
          </div>
          <div className="h-10 w-px bg-slate-300"></div>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <HiCalendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <p className="text-xs text-slate-600 truncate">
              Added {new Date(store.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleImport}
            disabled={isImporting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg font-medium text-sm"
          >
            <HiDownload className={`w-4 h-4 ${isImporting ? 'animate-bounce' : ''}`} />
            {isImporting ? 'Importing...' : 'Import'}
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2.5 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm"
          >
            <HiTrash className={`w-4 h-4 ${isDeleting ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  )
}
