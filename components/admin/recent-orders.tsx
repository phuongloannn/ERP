'use client'

import { Clock, MapPin, DollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Order {
  id: number
  order_number: string
  total: number
  status: string
  order_type: string
  created_at: string
  item_count: number
}

interface RecentOrdersProps {
  orders: Order[]
  loading: boolean
}

export default function RecentOrders({ orders, loading }: RecentOrdersProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
      case 'preparing':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
      case 'ready':
        return 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
      case 'completed':
        return 'bg-green-500/20 text-green-600 dark:text-green-400'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dine-in':
        return '🍽️'
      case 'takeout':
        return '📦'
      case 'delivery':
        return '🚚'
      case 'online':
        return '💻'
      default:
        return '📝'
    }
  }

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {orders.slice(0, 6).map(order => (
            <div key={order.id} className="border border-border rounded-lg p-3 hover:bg-muted/30 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{order.order_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span>{getTypeIcon(order.order_type)}</span>
                  <span className="capitalize">{order.order_type}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span>📦</span>
                  <span>{order.item_count} items</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-primary text-right">
                  <DollarSign size={14} />
                  {(order.total / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
