'use client'

import { AlertTriangle } from 'lucide-react'
import { Inventory, Product } from '@/lib/db'

interface InventoryItem extends Inventory {
  product: Product
}

interface LowStockAlertProps {
  items: InventoryItem[]
}

export default function LowStockAlert({ items }: LowStockAlertProps) {
  return (
    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-destructive flex-shrink-0 mt-0.5" size={20} />
        <div className="flex-1">
          <h3 className="font-semibold text-destructive mb-2">
            Low Stock Alert: {items.length} items need restocking
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {items.map(item => (
              <div key={item.id} className="text-sm bg-background/50 p-2 rounded">
                <p className="font-medium text-foreground">{item.product.name}</p>
                <p className="text-muted-foreground">
                  Stock: {item.quantity_on_hand} / Min: {item.minimum_stock}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
