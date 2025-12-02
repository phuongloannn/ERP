'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import OrderHeader from '@/components/order/order-header'
import OrderMenu from '@/components/order/order-menu'
import OrderSummary from '@/components/order/order-summary'
import { Product } from '@/lib/db'

interface CartItem {
  product: Product
  quantity: number
  notes: string
}

export default function OrderPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<'menu' | 'checkout' | 'delivery' | 'confirmed'>('menu')

  // Fetch products từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        if (data.success) {
          setProducts(data.data)
        }
      } catch (error) {
        console.error('[OrderPage] Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const addToCart = (product: Product, quantity: number, notes: string = '') => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, quantity, notes }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId)

    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const deliveryFee = 15000
  const total = subtotal + tax + deliveryFee

  // Tạo component ProductGrid nội bộ để hiển thị ảnh
  const ProductGrid = ({ products }: { products: Product[] }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map(product => (
        <div key={product.id} className="border rounded p-2 flex flex-col items-center">
          <div className="w-full h-32 relative overflow-hidden rounded-md mb-2">
            <Image
              src={product.image_url || '/images/default.jpg'}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <h3 className="font-semibold text-center">{product.name}</h3>
          <p className="text-center text-muted-foreground">{product.category}</p>
          <p className="text-center font-bold">
            {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </p>
          <button
            className="mt-2 px-4 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => addToCart(product, 1)}
          >
            Add
          </button>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <OrderHeader step={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 md:p-8">
        {(step === 'menu' || step === 'checkout') && (
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        )}

        <div className="lg:col-span-1">
          <OrderSummary
            items={cart}
            subtotal={subtotal}
            tax={tax}
            deliveryFee={deliveryFee}
            total={total}
            step={step}
            onRemoveItem={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onProceedToCheckout={() => setStep('checkout')}
            onProceedToDelivery={() => setStep('delivery')}
            onConfirmOrder={() => setStep('confirmed')}
            onBackToMenu={() => setStep('menu')}
          />
        </div>
      </div>
    </div>
  )
}
