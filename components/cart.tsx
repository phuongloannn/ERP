'use client'

import { useEffect, useState } from 'react'

const menuItems = [
  { id: 1, name: 'Crispy Chicken Bucket', price: 29.99 },
  { id: 2, name: 'Wings Pack', price: 24.99 },
  { id: 3, name: 'Chicken Tenders', price: 18.99 },
  { id: 4, name: 'Loaded Fries', price: 12.99 },
  { id: 5, name: 'Spicy Drumsticks', price: 16.99 },
  { id: 6, name: 'Family Feast', price: 54.99 },
]

export function Cart() {
  const [cart, setCart] = useState<{ [key: number]: number }>({})
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      setCart(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuItems.find(item => item.id === parseInt(id))
    return sum + (item?.price || 0) * qty
  }, 0)

  const itemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0)

  if (itemCount === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-accent transition"
      >
        <span className="text-2xl font-bold">{itemCount}</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 rounded-xl bg-card shadow-xl border border-border p-4">
          <h3 className="text-lg font-bold text-card-foreground mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {Object.entries(cart).map(([id, qty]) => {
              const item = menuItems.find(item => item.id === parseInt(id))
              if (!item) return null
              return (
                <div key={id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{qty}x {item.name}</span>
                  <span className="font-medium text-foreground">${(item.price * qty).toFixed(2)}</span>
                </div>
              )
            })}
          </div>
          <div className="border-t border-border pt-4">
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total:</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
            <button className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground hover:bg-accent transition">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
