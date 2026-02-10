import Link from 'next/link'
import { HiShoppingBag, HiCube, HiPencil, HiCheckCircle, HiArrowRight } from 'react-icons/hi'
import { RiDashboardFill } from 'react-icons/ri'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-8 shadow-xl">
            <RiDashboardFill className="w-10 h-10 text-white" />
          </div>
          
          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Multi-Store E-commerce
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mt-2">
              Dashboard
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Connect and manage multiple Shopify stores from a single, powerful dashboard. 
            Import products, edit details, and sync changes back to your stores seamlessly.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-xl hover:shadow-2xl transition-all text-lg"
            >
              <span>Get Started</span>
              <HiArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-slate-50 font-semibold border-2 border-blue-600 shadow-lg hover:shadow-xl transition-all text-lg"
            >
              <RiDashboardFill className="w-5 h-5" />
              <span>View Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 border border-slate-200 group">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <HiShoppingBag className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900">Multiple Stores</h3>
            <p className="text-slate-600 leading-relaxed">
              Connect multiple Shopify stores and manage them all from one centralized platform.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 border border-slate-200 group">
            <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <HiCube className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900">Product Sync</h3>
            <p className="text-slate-600 leading-relaxed">
              Import products with all details including variants, tags, images, and metafields.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 border border-slate-200 group">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <HiPencil className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900">Easy Editing</h3>
            <p className="text-slate-600 leading-relaxed">
              Edit product details in an intuitive interface and automatically sync changes back.
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-24 bg-white rounded-2xl shadow-xl p-10 border border-slate-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <HiCheckCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Key Features</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <HiCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Multi-Store Management</h4>
                <p className="text-slate-600">Connect multiple Shopify stores with API credentials</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <HiCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Complete Product Import</h4>
                <p className="text-slate-600">Import with title, description, price, variants, tags, and metafields</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <HiCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">User-Friendly Interface</h4>
                <p className="text-slate-600">Edit product details with an intuitive and modern UI</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <HiCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Automatic Sync</h4>
                <p className="text-slate-600">Changes automatically sync back to your Shopify stores</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <HiCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Real-Time Updates</h4>
                <p className="text-slate-600">See changes reflected instantly across all your stores</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <HiCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Extensible Platform</h4>
                <p className="text-slate-600">Built to support other e-commerce platforms in the future</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to streamline your store management?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of merchants managing their stores more efficiently
            </p>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-slate-50 font-semibold shadow-lg hover:shadow-xl transition-all text-lg"
            >
              <span>Start Managing Stores</span>
              <HiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-slate-600">
            © 2024 Multi-Store Dashboard. Built with Next.js, Prisma, and Shopify API.
          </p>
        </div>
      </div>
    </div>
  )
}
