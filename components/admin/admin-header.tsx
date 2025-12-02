'use client'

import { BarChart3, LogOut, Settings } from 'lucide-react'

interface AdminHeaderProps {
  dateRange: 'today' | 'week' | 'month'
  onDateRangeChange: (range: 'today' | 'week' | 'month') => void
}

export default function AdminHeader({ dateRange, onDateRangeChange }: AdminHeaderProps) {
  return (
    <div className="bg-primary text-primary-foreground border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 size={32} />
            <div>
              <h1 className="text-2xl font-bold">Manh Hoach Analytics</h1>
              <p className="text-sm opacity-75">Admin Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-primary-foreground/20 rounded-lg transition-colors">
              <Settings size={20} />
            </button>
            <button className="p-2 hover:bg-primary-foreground/20 rounded-lg transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Date range selector */}
        <div className="flex gap-2">
          {(['today', 'week', 'month'] as const).map(range => (
            <button
              key={range}
              onClick={() => onDateRangeChange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                dateRange === range
                  ? 'bg-primary-foreground text-primary'
                  : 'bg-primary-foreground/20 hover:bg-primary-foreground/30'
              }`}
            >
              {range === 'today' ? 'Today' : range === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
