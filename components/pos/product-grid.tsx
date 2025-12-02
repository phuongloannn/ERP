'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Product } from '@/lib/db'

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product, quantity: number) => void
}

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})

  const handleQuantityChange = (productId: number, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, value)
    }))
  }

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1
    onAddToCart(product, quantity)
    setQuantities(prev => ({
      ...prev,
      [product.id]: 1
    }))
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {products.map(product => (
        <div
          key={product.id}
          className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          {/* Product image placeholder */}
          <div className="w-full h-40 bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent-foreground">
                {product.name.charAt(0)}
              </p>
              <p className="text-xs text-accent-foreground/70">{product.category}</p>
            </div>
          </div>

          <div className="p-3 space-y-3">
            <div>
              <p className="font-semibold text-foreground truncate">{product.name}</p>
              <p className="text-sm text-muted-foreground truncate">{product.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-primary">
                {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </p>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  value={quantities[product.id] || 1}
                  onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                  className="w-10 h-8 px-2 border border-border rounded text-center text-sm bg-input text-foreground"
                />
              </div>
            </div>

            <button
              onClick={() => handleAddToCart(product)}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Plus size={18} />
              Add
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
