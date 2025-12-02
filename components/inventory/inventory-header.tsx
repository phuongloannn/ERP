'use client'

import { Search, Filter } from 'lucide-react'

interface InventoryHeaderProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  categories: string[]
}

export default function InventoryHeader({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: InventoryHeaderProps) {
  return (
    <div className="bg-primary text-primary-foreground p-6 border-b border-primary/20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>

        <div className="flex gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
              size={20}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-primary-foreground/20 text-primary-foreground placeholder-primary-foreground/50 border border-primary-foreground/30 focus:outline-none focus:border-primary-foreground/50"
            />
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-4 py-2 rounded-md bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30 focus:outline-none focus:border-primary-foreground/50"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-primary text-primary-foreground">
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
