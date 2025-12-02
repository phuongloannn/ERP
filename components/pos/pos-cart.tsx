'use client'

import { useState } from 'react'
import { Trash2, Plus, Minus, DollarSign } from 'lucide-react'
import { Product } from '@/lib/db'

interface CartItem {
  product: Product
  quantity: number
}

interface POSCartProps {
  items: CartItem[]
  onRemoveItem: (productId: number) => void
  onUpdateQuantity: (productId: number, quantity: number) => void
  onClearCart: () => void
}

export default function POSCart({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
}: POSCartProps) {
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [processingOrder, setProcessingOrder] = useState(false)

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleCheckout = async () => {
    if (items.length === 0) return

    setProcessingOrder(true)
    try {
      // Build payload chuẩn API
      const orderData = {
        order_type: 'delivery',       // theo API backend
        customer_name: 'POS Customer', // default tên khách POS
        customer_phone: '0000000000',  // default số điện thoại
        delivery_address: 'N/A',       // default địa chỉ
        payment_method: paymentMethod,
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price, // API tính total_price
        })),
      }

      console.log('Order payload:', orderData)

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      const data = await res.json()
      console.log('Order response:', data)

      if (data.success) {
        alert(`Order created: ${data.data.order_number}`)
        onClearCart()
      } else {
        alert('Failed to create order: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('[POSCart] Checkout error:', error)
      alert('Error processing order: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setProcessingOrder(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-secondary/20">
        <h2 className="text-lg font-bold text-foreground">Order Cart</h2>
        <p className="text-sm text-muted-foreground">{items.length} items</p>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <p className="text-2xl mb-2">🛒</p>
              <p>No items in cart</p>
            </div>
          </div>
        ) : (
          items.map(item => (
            <div
              key={item.product.id}
              className="bg-background border border-border rounded-lg p-3 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(item.product.price * item.quantity).toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="text-destructive hover:text-destructive/80 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 bg-background border border-border rounded-md">
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                    className="p-1 hover:bg-muted transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-semibold text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                    className="p-1 hover:bg-muted transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  @ {(item.product.price).toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Totals & checkout */}
      {items.length > 0 && (
        <>
          <div className="border-t border-border p-4 space-y-3 bg-secondary/10">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-semibold">
                {subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (10%):</span>
              <span className="font-semibold">
                {tax.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="text-foreground font-bold">Total:</span>
              <span className="text-2xl font-bold text-primary">
                {total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </span>
            </div>
          </div>

          <div className="border-t border-border p-4 space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="momo">MoMo</option>
                <option value="vnpay">VNPay</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClearCart}
                className="flex-1 py-2 px-3 border border-border rounded-md text-foreground hover:bg-muted transition-colors font-medium"
              >
                Clear
              </button>
              <button
                onClick={handleCheckout}
                disabled={processingOrder || items.length === 0}
                className="flex-1 py-3 px-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity font-bold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <DollarSign size={20} />
                {processingOrder ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
