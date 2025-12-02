'use client'

import { useState, useEffect } from 'react'
import InventoryHeader from '@/components/inventory/inventory-header'
import InventoryTable from '@/components/inventory/inventory-table'
import InventoryStats from '@/components/inventory/inventory-stats'
import LowStockAlert from '@/components/inventory/low-stock-alert'
import { Product, Inventory } from '@/lib/db'

interface InventoryItem extends Inventory {
  product: Product
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/inventory?type=low-stock')
        const data = await res.json()
        if (data.success) {
          setLowStockItems(data.data)
        }

        // Fetch all products for full inventory view
        const productsRes = await fetch('/api/products')
        const productsData = await productsRes.json()
        if (productsData.success) {
          // Mock inventory data (would come from DB in production)
          const mockInventory = productsData.data.map((product: Product) => ({
            id: product.id,
            product_id: product.id,
            product,
            quantity_on_hand: Math.floor(Math.random() * 100) + 5,
            quantity_reserved: Math.floor(Math.random() * 20),
            minimum_stock: 10,
            reorder_point: 20,
          }))
          setInventory(mockInventory)
        }
      } catch (error) {
        console.error('[v0] Failed to fetch inventory:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchInventory()
  }, [])

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory =
      filterCategory === 'all' || item.product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...new Set(inventory.map(i => i.product.category))]
  const totalValue = inventory.reduce(
    (sum, item) => sum + item.product.price * item.quantity_on_hand,
    0
  )
  const totalItems = inventory.reduce((sum, item) => sum + item.quantity_on_hand, 0)

  return (
    <div className="min-h-screen bg-background">
      <InventoryHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={filterCategory}
        onCategoryChange={setFilterCategory}
        categories={categories}
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <InventoryStats
          totalItems={totalItems}
          totalValue={totalValue}
          lowStockCount={lowStockItems.length}
          inventoryCount={inventory.length}
        />

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <LowStockAlert items={lowStockItems} />
        )}

        {/* Inventory Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <InventoryTable
            items={filteredInventory}
            loading={loading}
            onInventoryUpdate={() => {
              // Trigger refresh after update
            }}
          />
        </div>
      </div>
    </div>
  )
}
