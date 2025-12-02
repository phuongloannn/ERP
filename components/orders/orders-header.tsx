'use client'

import { Search, Filter } from 'lucide-react'

interface OrdersHeaderProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  filterStatus: string
  onFilterChange: (value: string) => void
}

export default function OrdersHeader({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
}: OrdersHeaderProps) {
  return (
    <div className="bg-primary text-primary-foreground p-6 border-b border-primary/20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Order Management</h1>

        <div className="flex gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by order # or customer name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-primary-foreground/20 text-primary-foreground placeholder-primary-foreground/50 border border-primary-foreground/30 focus:outline-none focus:border-primary-foreground/50"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} />
            <select
              value={filterStatus}
              onChange={(e) => onFilterChange(e.target.value)}
              className="px-4 py-2 rounded-md bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30 focus:outline-none focus:border-primary-foreground/50"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
