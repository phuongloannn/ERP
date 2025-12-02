'use client'

import { Package, DollarSign, AlertTriangle, Boxes } from 'lucide-react'

interface InventoryStatsProps {
  totalItems: number
  totalValue: number
  lowStockCount: number
  inventoryCount: number
}

export default function InventoryStats({
  totalItems,
  totalValue,
  lowStockCount,
  inventoryCount,
}: InventoryStatsProps) {
  const stats = [
    {
      label: 'Total Items',
      value: totalItems.toLocaleString(),
      icon: Package,
      color: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Inventory Value',
      value: (totalValue / 1000000).toFixed(1) + 'M',
      icon: DollarSign,
      color: 'bg-green-500/20 text-green-600 dark:text-green-400',
    },
    {
      label: 'Low Stock Items',
      value: lowStockCount.toString(),
      icon: AlertTriangle,
      color: 'bg-red-500/20 text-red-600 dark:text-red-400',
    },
    {
      label: 'SKU Count',
      value: inventoryCount.toString(),
      icon: Boxes,
      color: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
