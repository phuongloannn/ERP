'use client'

import { TrendingUp, ShoppingCart, DollarSign, Clock } from 'lucide-react'

interface SalesMetricsProps {
  totalRevenue: number
  totalOrders: number
  loading: boolean
}

export default function SalesMetrics({ totalRevenue, totalOrders, loading }: SalesMetricsProps) {
  const metrics = [
    {
      label: 'Total Revenue',
      value: loading ? '-' : (totalRevenue / 1000000).toFixed(1) + 'M',
      icon: DollarSign,
      change: '+12.5%',
      color: 'bg-green-500/20 text-green-600 dark:text-green-400',
    },
    {
      label: 'Total Orders',
      value: loading ? '-' : totalOrders,
      icon: ShoppingCart,
      change: '+8.2%',
      color: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Avg Order Value',
      value: loading ? '-' : ((totalRevenue / (totalOrders || 1)) / 1000).toFixed(0) + 'K',
      icon: TrendingUp,
      change: '+4.3%',
      color: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Avg Prep Time',
      value: '18 min',
      icon: Clock,
      change: '-2.1%',
      color: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        const isNegative = metric.change.startsWith('-')

        return (
          <div key={index} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric.color}`}>
                <Icon size={24} />
              </div>
              <span
                className={`text-sm font-semibold ${
                  isNegative ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {metric.change}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
            <p className="text-3xl font-bold text-foreground">{metric.value}</p>
          </div>
        )
      })}
    </div>
  )
}
