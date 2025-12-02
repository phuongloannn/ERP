'use client'

import { ShoppingCart, Phone } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-xl font-bold text-primary-foreground">🍗</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Crispy Wings</h1>
          </div>

          <nav className="hidden gap-8 md:flex">
            <a href="#menu" className="text-sm font-medium text-foreground hover:text-primary transition">
              Menu
            </a>
            <a href="#about" className="text-sm font-medium text-foreground hover:text-primary transition">
              About
            </a>
            <a href="#contact" className="text-sm font-medium text-foreground hover:text-primary transition">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="tel:+1234567890" className="hidden items-center gap-2 text-sm font-medium text-primary hover:text-accent sm:flex">
              <Phone size={16} />
              <span>(555) 123-4567</span>
            </a>
            <button className="relative flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-accent transition">
              <ShoppingCart size={18} />
              <span className="hidden sm:inline">Cart</span>
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
