'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import POSHeader from '@/components/pos/pos-header'
import POSCart from '@/components/pos/pos-cart'
import { Product } from '@/lib/db'

// ProductGrid component tích hợp trong trang luôn
function ProductGrid({
  products,
  onAddToCart
}: {
  products: Product[],
  onAddToCart: (product: Product, quantity: number) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <div
          key={product.id}
          className="border rounded p-2 flex flex-col items-center bg-card shadow-sm"
        >
          {/* IMAGE FIX: Hiển thị hình chữ nhật ngang, đồng đều */}
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
          <p className="text-center font-bold">{product.price.toLocaleString()} VND</p>

          <button
            className="mt-2 px-4 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => onAddToCart(product, 1)}
          >
            Add
          </button>
        </div>
      ))}
    </div>
  )
}

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<Array<{ product: Product; quantity: number }>>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Fetch products từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        if (data.success) setProducts(data.data)
      } catch (error) {
        console.error('[v0] Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Danh sách category
  const categories = ['all', ...new Set(products.map(p => p.category))]
  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter(p => p.category === selectedCategory)

  // Cart actions
  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, quantity }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => setCart([])

  return (
    <div className="flex h-screen bg-background">
      {/* Left side - Products */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <POSHeader />

        {/* Category tabs */}
        <div className="border-b border-border bg-card">
          <div className="flex gap-2 p-4 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <ProductGrid products={filteredProducts} onAddToCart={addToCart} />
          )}
        </div>
      </div>

      {/* Right side - Cart */}
      <div className="w-96 border-l border-border bg-card flex flex-col">
        <POSCart
          items={cart}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onClearCart={clearCart}
        />
      </div>
    </div>
  )
}
