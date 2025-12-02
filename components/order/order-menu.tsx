'use client'

import { useState } from 'react'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { Product } from '@/lib/db'

interface OrderMenuProps {
  products: Product[]
  loading: boolean
  onAddToCart: (product: Product, quantity: number, notes: string) => void
}

export default function OrderMenu({ products, loading, onAddToCart }: OrderMenuProps) {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null)

  const categories = ['All', ...new Set(products.map(p => p.category))]
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter(p => p.category === selectedCategory)

  const updateQuantity = (productId: number, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, value),
    }))
  }

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1
    if (quantity > 0) {
      onAddToCart(product, quantity, '')
      setQuantities(prev => ({
        ...prev,
        [product.id]: 1,
      }))
      setExpandedProduct(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading menu...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors font-medium ${
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Product image placeholder */}
            <div className="w-full h-48 bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl font-bold text-accent-foreground">
                  {product.name.charAt(0)}
                </p>
                <p className="text-sm text-accent-foreground/70 mt-1">
                  {product.category}
                </p>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-lg text-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-primary">
                  {(product.price / 1000).toFixed(0)}K
                </p>
                <div className="flex items-center gap-1 bg-muted rounded-lg">
                  <button
                    onClick={() => updateQuantity(product.id, (quantities[product.id] || 1) - 1)}
                    className="p-1 hover:bg-muted-foreground/20 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">
                    {quantities[product.id] || 1}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, (quantities[product.id] || 1) + 1)}
                    className="p-1 hover:bg-muted-foreground/20 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
