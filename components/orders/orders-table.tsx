'use client'

import { ChevronRight, Clock, MapPin } from 'lucide-react'

interface Order {
  id: number
  order_number: string
  total: number
  status: string
  payment_status: string
  order_type: string
  created_at: string
  customer_name?: string
}

interface OrdersTableProps {
  orders: Order[]
  loading: boolean
  onSelectOrder: (order: Order) => void
  onUpdateStatus: (orderId: number, status: string) => void
}

export default function OrdersTable({
  orders,
  loading,
  onSelectOrder,
  onUpdateStatus,
}: OrdersTableProps) {
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

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-600 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
      case 'failed':
        return 'bg-red-500/20 text-red-600 dark:text-red-400'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">Loading orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No orders found</p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Time</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Amount</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Payment</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => onSelectOrder(order)}
              >
                <td className="px-6 py-4">
                  <p className="font-semibold text-foreground">{order.order_number}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
  <div className="text-sm text-foreground truncate max-w-[120px]">
    {order.customer_name}
  </div>
</td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium capitalize text-muted-foreground">
                    {order.order_type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleTimeString()}
                  </p>
                </td>
                <td className="px-6 py-4 text-right">
                  <p className="font-bold text-primary">
                    {(order.total / 1000).toFixed(0)}K
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPaymentColor(order.payment_status)}`}>
                    {order.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="p-2 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground">
                    <ChevronRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
