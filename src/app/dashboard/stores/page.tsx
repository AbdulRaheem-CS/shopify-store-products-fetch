'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AddStoreModal, StoreCard } from '@/components/StoreComponents'
import { HiPlus, HiShoppingBag } from 'react-icons/hi'
import { BiRefresh } from 'react-icons/bi'

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

export default function StoresPage() {
  const router = useRouter()
  const { status } = useSession()
  const [stores, setStores] = useState<Store[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchStores = async (silent = false) => {
    if (!silent) setIsLoading(true)
    setIsRefreshing(true)
    try {
      const res = await fetch('/api/stores')
      if (res.status === 401) {
        router.push('/auth/signin')
        return
      }
      if (!res.ok) throw new Error('Failed to fetch stores')
      const data = await res.json()
      setStores(data)
    } catch (error) {
      console.error('Error fetching stores:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStores()
    }
  }, [status])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this store?')) return
    
    try {
      const res = await fetch(`/api/stores/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete store')
      await fetchStores(true)
    } catch (error) {
      console.error('Error deleting store:', error)
      alert('Failed to delete store')
    }
  }

  const handleImport = async (id: string) => {
    try {
      const res = await fetch(`/api/stores/${id}/import-products`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to import products')
      const data = await res.json()
      alert(data.message)
      await fetchStores(true)
    } catch (error) {
      console.error('Error importing products:', error)
      alert('Failed to import products')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg text-slate-600 font-medium">Loading stores...</div>
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
              <HiShoppingBag className="w-8 h-8 text-blue-600" />
              My Stores
            </h1>
            <p className="text-slate-600 mt-2">Manage your connected e-commerce stores</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchStores(true)}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            >
              <BiRefresh className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="font-medium">Refresh</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              <HiPlus className="w-5 h-5" />
              Add Store
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        {stores.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Stores</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stores.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <HiShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Products</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {stores.reduce((sum, store) => sum + store._count.products, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <HiPlus className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg Products/Store</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {Math.round(stores.reduce((sum, store) => sum + store._count.products, 0) / stores.length)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BiRefresh className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stores Grid */}
        {stores.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiShoppingBag className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No stores connected</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Get started by connecting your first e-commerce store and start managing your products
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              <HiPlus className="w-5 h-5" />
              Add Your First Store
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onDelete={handleDelete}
                onImport={handleImport}
              />
            ))}
          </div>
        )}
      </div>

      <AddStoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStoreAdded={() => fetchStores(true)}
      />
    </div>
  )
}
