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
  ArrowRight
} from 'lucide-react'

export default function Home() {
  const systems = [
    {
      title: 'POS System',
      description: 'Fast checkout and billing for cashiers',
      icon: ShoppingCart,
      href: '/pos',
      color: 'bg-orange-600/10 text-orange-600',
    },
    {
      title: 'Order Queue',
      description: 'Real-time kitchen display & order tracking',
      icon: Flame,
      href: '/pos-orders',
      color: 'bg-red-600/10 text-red-600',
    },
    {
      title: 'Inventory',
      description: 'Manage stock levels and raw materials',
      icon: Zap,
      href: '/inventory',
      color: 'bg-blue-600/10 text-blue-600',
    },
    {
      title: 'Customer Ordering',
      description: 'Public online food ordering platform',
      icon: Users,
      href: '/order',
      color: 'bg-green-600/10 text-green-600',
    },
    {
      title: 'Order Management',
      description: 'Comprehensive order history and status',
      icon: ClipboardList,
      href: '/orders',
      color: 'bg-purple-600/10 text-purple-600',
    },
    {
      title: 'Analytics',
      description: 'Sales insights and performance metrics',
      icon: LayoutDashboard,
      href: '/admin',
      color: 'bg-indigo-600/10 text-indigo-600',
    },
  ]

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      {/* NOTE: The City Background Header is handled in layout.tsx. 
         This page focuses exclusively on the System Modules.
      */}

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 border-b border-gray-100 pb-8 gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-orange-600" />
              System Modules
            </h2>
            <p className="text-slate-500 mt-2 font-medium">Select a management module to begin your workflow</p>
          </div>
          
          <Link
            href="/admin"
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-slate-200"
          >
            System Overview <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map((system) => {
            const Icon = system.icon
            return (
              <Link
                key={system.href}
                href={system.href}
                className="group relative bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:border-orange-200 transition-all duration-500 overflow-hidden"
              >
                {/* Background Decor */}
                <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity ${system.color.split(' ')[0]}`} />
                
                <div className={`p-4 rounded-2xl ${system.color} w-fit mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <Icon size={32} />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {system.title}
                </h3>
                
                <p className="text-slate-500 font-medium mb-6">
                  {system.description}
                </p>
                
                <div className="flex items-center text-sm font-black uppercase tracking-wider text-slate-400 group-hover:text-orange-600 transition-colors">
                  Access Module <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Info Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-20">
          <div className="bg-orange-50/50 border border-orange-100 rounded-[2.5rem] p-10">
            <h3 className="text-2xl font-black text-orange-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
              Quick Start Guide
            </h3>
            <ul className="space-y-4 text-slate-600 font-medium">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2" />
                Seed initial data at <code className="bg-white px-2 py-0.5 rounded border border-orange-200 text-orange-600 text-sm">/api/products/seed</code>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2" />
                Utilize the **POS** terminal for on-site transactions
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2" />
                Monitor the **Order Queue** for real-time kitchen processing
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10">
            <h3 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight">Core Features</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                'Real-time Tracking',
                'Multi-channel Support',
                'Auto Inventory',
                'Advanced Analytics'
              ].map(item => (
                <div key={item} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm font-bold text-slate-700 flex items-center gap-2 hover:border-orange-200 transition-colors cursor-default">
                   <div className="w-2 h-2 rounded-full bg-green-500" />
                   {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-100 py-10 text-center">
        <p className="text-slate-400 font-medium text-sm">
          © 2025 Manh Hoach 4S. All rights reserved.
        </p>
      </footer>
    </div>
  )
}