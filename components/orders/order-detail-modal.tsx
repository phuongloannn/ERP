'use client'

import { X, CreditCard, Package, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

interface OrderDetailModalProps {
  order: any
  onClose: () => void
  onUpdateStatus: (orderId: number, status: string) => void
  onProcessPayment: (orderId: number, amount: number) => void
}

export default function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
  onProcessPayment,
}: OrderDetailModalProps) {
  const [processing, setProcessing] = useState(false)

  const handlePaymentClick = async () => {
    setProcessing(true)
    try {
      await onProcessPayment(order.id, order.total)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{order.order_number}</h2>
            <p className="text-sm text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order items */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Package size={20} />
              Order Items
            </h3>
            <div className="space-y-2 bg-muted/30 rounded-lg p-4">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-foreground">
                    {item.product_name} x{item.quantity}
                  </span>
                  <span className="font-semibold text-foreground">
                    {(item.unit_price * item.quantity / 1000).toFixed(0)}K
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer info */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Name</p>
                <p className="text-foreground font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Phone</p>
                <p className="text-foreground font-medium">{order.customer_phone}</p>
              </div>
              {order.delivery_address && (
                <div className="col-span-2">
                  <p className="text-muted-foreground mb-1">Delivery Address</p>
                  <p className="text-foreground font-medium">{order.delivery_address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Order Status</label>
              <select
                value={order.status}
                onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
              >
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Payment Status</label>
              <div className="px-3 py-2 border border-border rounded-lg bg-muted text-foreground font-medium">
                {order.payment_status}
              </div>
            </div>
          </div>

          {/* Pricing summary */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="text-foreground">{(order.total / 1.1 / 1000).toFixed(0)}K</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (10%):</span>
              <span className="text-foreground">{((order.total / 1.1 * 0.1) / 1000).toFixed(0)}K</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-bold">
              <span className="text-foreground">Total:</span>
              <span className="text-primary text-lg">{(order.total / 1000).toFixed(0)}K</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {order.payment_status === 'pending' && (
              <button
                onClick={handlePaymentClick}
                disabled={processing}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                {processing ? 'Processing...' : 'Process Payment'}
              </button>
            )}
            {order.payment_status === 'completed' && order.status !== 'completed' && (
              <button
                onClick={() => onUpdateStatus(order.id, 'completed')}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={20} />
                Mark as Completed
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-border rounded-lg font-bold hover:bg-muted transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
