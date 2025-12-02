'use client'

import { useState } from 'react'
import { Trash2, Clock, MapPin, Phone, Mail } from 'lucide-react'

interface CartItem {
  product: { id: number; name: string; price: number }
  quantity: number
}

interface OrderSummaryProps {
  items: CartItem[]
  subtotal: number
  tax: number
  deliveryFee: number
  total: number
  step: 'menu' | 'checkout' | 'delivery' | 'confirmed'
  onRemoveItem: (productId: number) => void
  onUpdateQuantity: (productId: number, quantity: number) => void
  onProceedToCheckout: () => void
  onProceedToDelivery: () => void
  onConfirmOrder: () => void
  onBackToMenu: () => void
}

export default function OrderSummary({
  items,
  subtotal,
  tax,
  deliveryFee,
  total,
  step,
  onRemoveItem,
  onUpdateQuantity,
  onProceedToCheckout,
  onProceedToDelivery,
  onConfirmOrder,
  onBackToMenu,
}: OrderSummaryProps) {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  })

  const [deliveryTime, setDeliveryTime] = useState('asap')

  const handleSubmitOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert('Please fill in all delivery information')
      return
    }

    try {
      const orderData = {
        order_type: 'delivery',                // QUAN TRỌNG: Đúng field name
        customer_name: customerInfo.name,      // QUAN TRỌNG: Đúng field name
        customer_phone: customerInfo.phone,    // QUAN TRỌNG: Đúng field name
        delivery_address: customerInfo.address, // QUAN TRỌNG: Đúng field name
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price,      // API sẽ tính total_price
        })),
        notes: `Delivery time: ${deliveryTime === 'asap' ? '30-45 mins' : deliveryTime}` + 
               (customerInfo.email ? `\nEmail: ${customerInfo.email}` : ''),
      }

      console.log('Sending order data:', orderData) // Debug

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      const data = await res.json()
      console.log('Order response:', data) // Debug
      
      if (data.success) {
        onConfirmOrder()
      } else {
        alert('Failed to create order: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('[OrderSummary] Order submission error:', error)
      alert('Error submitting order: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg sticky top-4 overflow-hidden flex flex-col h-fit max-h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 border-b border-primary/20">
        <h2 className="text-lg font-bold">Order Summary</h2>
        <p className="text-sm opacity-75">{items.length} items</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto flex flex-col">
        {step === 'menu' && (
          <>
            {/* Items list */}
            <div className="p-4 space-y-2 border-b border-border">
              {items.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No items yet</p>
              ) : (
                items.map(item => (
                  <div key={item.product.id} className="flex items-start gap-3 text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        x{item.quantity} @ {(item.product.price / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground text-right w-16">
                        {((item.product.price * item.quantity) / 1000).toFixed(0)}K
                      </p>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Totals */}
            <div className="p-4 space-y-2 border-b border-border text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal:</span>
                <span>{(subtotal / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax (10%):</span>
                <span>{(tax / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery:</span>
                <span>{(deliveryFee / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border">
                <span>Total:</span>
                <span className="text-lg text-primary">{(total / 1000).toFixed(0)}K</span>
              </div>
            </div>

            {/* Checkout button */}
            <div className="p-4">
              <button
                onClick={onProceedToCheckout}
                disabled={items.length === 0}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Review & Checkout
              </button>
            </div>
          </>
        )}

        {step === 'checkout' && (
          <>
            <div className="p-4 space-y-3 flex-1">
              <p className="text-sm font-semibold text-foreground mb-3">Review Your Order</p>
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="font-semibold">
                    {((item.product.price * item.quantity) / 1000).toFixed(0)}K
                  </span>
                </div>
              ))}
              <div className="border-t border-border pt-3 mt-3 flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-primary text-lg">
                  {(total / 1000).toFixed(0)}K
                </span>
              </div>
            </div>

            <div className="p-4 space-y-2 border-t border-border">
              <button
                onClick={onBackToMenu}
                className="w-full py-2 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
              >
                Back to Menu
              </button>
              <button
                onClick={onProceedToDelivery}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                Continue to Delivery
              </button>
            </div>
          </>
        )}

        {step === 'delivery' && (
          <>
            <div className="p-4 space-y-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                  placeholder="Your phone"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                  placeholder="Your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Delivery Address
                </label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                  placeholder="Your delivery address"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Delivery Time
                </label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                >
                  <option value="asap">ASAP (30-45 mins)</option>
                  <option value="1hour">1 Hour</option>
                  <option value="2hours">2 Hours</option>
                </select>
              </div>
            </div>

            <div className="p-4 space-y-2 border-t border-border">
              <button
                onClick={onBackToMenu}
                className="w-full py-2 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmitOrder}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                Place Order - {(total / 1000).toFixed(0)}K
              </button>
            </div>
          </>
        )}

        {step === 'confirmed' && (
          <>
            <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-3xl">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Order Confirmed!</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Your order has been placed successfully
                </p>
              </div>

              <div className="w-full bg-muted p-4 rounded-lg space-y-2 text-left text-sm">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-accent" />
                  <span>Delivery: {deliveryTime === 'asap' ? '30-45 mins' : deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-accent" />
                  <span className="truncate">{customerInfo.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-accent" />
                  <span>{customerInfo.phone}</span>
                </div>
                {customerInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-accent" />
                    <span>{customerInfo.email}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 w-full">
                <p className="text-xs text-muted-foreground mb-3">
                  Total: {(total / 1000).toFixed(0)}K
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-border">
              <button
                onClick={() => window.location.href = '/'}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}