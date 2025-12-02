'use client'

import { useState } from 'react'
import { Edit2, Save, X } from 'lucide-react'
import { Inventory, Product } from '@/lib/db'

interface InventoryItem extends Inventory {
  product: Product
}

interface InventoryTableProps {
  items: InventoryItem[]
  loading: boolean
  onInventoryUpdate: () => void
}

export default function InventoryTable({
  items,
  loading,
  onInventoryUpdate,
}: InventoryTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<{ [key: number]: number }>({})

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item.id)
    setEditValues({ [item.id]: item.quantity_on_hand })
  }

  const handleSave = async (item: InventoryItem) => {
    const newQuantity = editValues[item.id]
    const difference = newQuantity - item.quantity_on_hand

    try {
      const res = await fetch('/api/inventory/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: item.product_id,
          quantity_change: difference,
        }),
      })

      if (res.ok) {
        setEditingId(null)
        onInventoryUpdate()
      }
    } catch (error) {
      console.error('[v0] Failed to update inventory:', error)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValues({})
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading inventory...
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No inventory items found
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
              Product
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
              Category
            </th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
              On Hand
            </th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
              Reserved
            </th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
              Available
            </th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
              Min Stock
            </th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
              Reorder Point
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
              Status
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const available = item.quantity_on_hand - item.quantity_reserved
            const isLowStock = item.quantity_on_hand <= item.minimum_stock
            const isEditing = editingId === item.id

            return (
              <tr
                key={item.id}
                className="border-b border-border hover:bg-muted/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-foreground">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">{item.product.description}</p>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {item.product.category}
                </td>
                <td className="px-6 py-4 text-right">
                  {isEditing ? (
                    <input
                      type="number"
                      value={editValues[item.id]}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          [item.id]: parseInt(e.target.value),
                        })
                      }
                      className="w-16 px-2 py-1 border border-border rounded text-right bg-input text-foreground"
                    />
                  ) : (
                    <span className="font-semibold">{item.quantity_on_hand}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right text-muted-foreground">
                  {item.quantity_reserved}
                </td>
                <td className="px-6 py-4 text-right font-semibold">{available}</td>
                <td className="px-6 py-4 text-right text-muted-foreground">
                  {item.minimum_stock}
                </td>
                <td className="px-6 py-4 text-right text-muted-foreground">
                  {item.reorder_point}
                </td>
                <td className="px-6 py-4 text-center">
                  {isLowStock ? (
                    <span className="inline-block px-3 py-1 bg-destructive/20 text-destructive rounded-full text-xs font-semibold">
                      Low Stock
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-xs font-semibold">
                      OK
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {isEditing ? (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleSave(item)}
                        className="p-2 hover:bg-muted rounded transition-colors text-green-600 dark:text-green-400"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-2 hover:bg-muted rounded transition-colors text-destructive"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
