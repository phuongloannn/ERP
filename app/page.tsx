'use client'

import Link from 'next/link'
import {
  ShoppingCart,
  Users,
  Zap,
  Flame,
  LayoutDashboard,
  ClipboardList,
  ChefHat,
} from 'lucide-react'

// Sử dụng các màu sắc chủ đạo: Cam (Accent) và Xám/Trắng (Background/Foreground)

export default function Home() {
  const systems = [
    {
      title: 'POS System',
      description: 'Fast checkout for cashiers',
      icon: ShoppingCart,
      href: '/pos',
      color: 'bg-orange-600/10 text-orange-600 dark:text-orange-400',
    },
    {
      title: 'Order Queue',
      description: 'Real-time order feed for kitchen',
      icon: Flame,
      href: '/pos-orders',
      color: 'bg-gray-600/10 text-gray-700 dark:text-gray-400',
    },
    {
      title: 'Inventory Management',
      description: 'Track stock levels',
      icon: Zap,
      href: '/inventory',
      color: 'bg-green-600/10 text-green-600 dark:text-green-400',
    },
    {
      title: 'Customer Ordering',
      description: 'Online ordering system',
      icon: Users,
      href: '/order',
      color: 'bg-purple-600/10 text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Order Management',
      description: 'Track and manage orders',
      icon: ClipboardList,
      href: '/orders',
      color: 'bg-blue-600/10 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Analytics Dashboard',
      description: 'Sales insights and metrics',
      icon: LayoutDashboard,
      href: '/admin',
      color: 'bg-red-600/10 text-red-600 dark:text-red-400',
    },
  ]

  return (
    // Nền tổng thể màu xám nhạt cho phong cách chuyên nghiệp, sạch sẽ
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header - Nổi bật với tông trắng/xám và điểm nhấn cam */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row items-center gap-12">
          {/* Left: Text */}
          <div className="flex-1 text-left">
            <h1 className="text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
              Manh Hoach <span className="text-orange-600">4S</span>
            </h1>
            <p className="text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 font-light mb-6">
              Sales Management System - Hanoi Branch
            </p>
            <p className="text-lg lg:text-xl text-gray-500 dark:text-gray-400 max-w-xl">
              Complete fried chicken sales management solution with POS, inventory tracking, online ordering, and analytics.
            </p>
            <div className="mt-8">
              <Link
                href="/admin"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 transition duration-150 ease-in-out"
              >
                Go to Admin Dashboard
              </Link>
            </div>
          </div>

          {/* Right: Image */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <img
              src="/images/cooking-header.jpg"
              alt="Cooking Illustration"
              className="rounded-lg shadow-2xl w-full max-w-lg object-cover border-4 border-orange-600/50"
            />
          </div>
        </div>
      </div>

      {/* Systems Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-10 text-center">
          <ChefHat className="inline-block w-8 h-8 text-orange-600 mr-2" />
          System Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {systems.map((system) => {
            const Icon = system.icon
            return (
              <Link
                key={system.href}
                href={system.href}
                // Thiết kế Card chuyên nghiệp: Nền trắng, bo tròn lớn, hover bằng ring cam
                className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-lg hover:shadow-xl hover:ring-2 hover:ring-orange-600 transition-all duration-300"
              >
                <div
                  className={`p-4 rounded-full ${system.color} w-fit mb-4 group-hover:shadow-lg group-hover:scale-105 transition-transform duration-300`}
                >
                  <Icon size={32} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{system.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{system.description}</p>
                <div className="text-orange-600 font-medium group-hover:translate-x-1 transition-transform flex items-center">
                  Access Now
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    ></path>
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Info boxes - Tông màu Xám-Cam */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {/* Hộp Thông tin 1: Nền cam nhạt */}
          <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 rounded-xl p-6 shadow-md">
            <h3 className="text-2xl font-bold text-orange-700 dark:text-orange-400 mb-3">
              Quick Start Guide
            </h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300 text-base list-disc pl-5">
              <li>Setup database at <code className="bg-orange-200/50 dark:bg-orange-800/50 px-1 rounded text-sm">/api/products/seed</code></li>
              <li>Access **POS system** for cashiers</li>
              <li>Monitor **Order Queue** in real-time</li>
              <li>Process orders from **Customer Ordering** channel</li>
            </ul>
          </div>

          {/* Hộp Thông tin 2: Nền xám nhạt */}
          <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-6 shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              Core Features
            </h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300 text-base list-disc pl-5">
              <li>**Real-time** order tracking</li>
              <li>Live kitchen order display (KDS)</li>
              <li>**Multi-channel** ordering support</li>
              <li>Complete payment processing workflow</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © 2025 Manh Hoach 4S. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}