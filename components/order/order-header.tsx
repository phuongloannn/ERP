'use client'

import { ChefHat, Home } from 'lucide-react'
import Link from 'next/link'

interface OrderHeaderProps {
  step: 'menu' | 'checkout' | 'delivery' | 'confirmed'
}

export default function OrderHeader({ step }: OrderHeaderProps) {
  const steps = [
    { id: 'menu', label: 'Menu', number: 1 },
    { id: 'checkout', label: 'Review', number: 2 },
    { id: 'delivery', label: 'Delivery', number: 3 },
    { id: 'confirmed', label: 'Confirmed', number: 4 },
  ]

  return (
    <div className="bg-primary text-primary-foreground border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Logo */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ChefHat size={32} />
            <div>
              <h1 className="text-2xl font-bold">Manh Hoach</h1>
              <p className="text-xs opacity-75">Fried Chicken Delivery</p>
            </div>
          </Link>
          <Link href="/" className="flex items-center gap-1 text-sm hover:opacity-80 transition-opacity">
            <Home size={18} />
            Back to Home
          </Link>
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-between">
          {steps.map((s, index) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    steps.slice(0, steps.findIndex(st => st.id === step) + 1).some(st => st.id === s.id)
                      ? 'bg-primary-foreground text-primary'
                      : 'bg-primary-foreground/20 text-primary-foreground/50'
                  }`}
                >
                  {s.number}
                </div>
                <span
                  className={`text-sm font-medium transition-opacity ${
                    steps.slice(0, steps.findIndex(st => st.id === step) + 1).some(st => st.id === s.id)
                      ? 'opacity-100'
                      : 'opacity-50'
                  }`}
                >
                  {s.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 transition-colors ${
                    steps.slice(0, steps.findIndex(st => st.id === step) + 1).some(st => st.id === s.id) &&
                    steps.slice(0, steps.findIndex(st => st.id === step) + 1).some(st => st.id === steps[index + 1].id)
                      ? 'bg-primary-foreground'
                      : 'bg-primary-foreground/20'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
