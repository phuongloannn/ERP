'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const menuItems = [
  {
    id: 1,
    name: 'Crispy Chicken Bucket',
    description: '12 pieces of golden fried chicken',
    price: 29.99,
    image: '/fried-chicken-bucket-golden.jpg',
    category: 'Combos'
  },
  {
    id: 2,
    name: 'Wings Pack',
    description: '20 pieces of spicy wings with sauce',
    price: 24.99,
    image: '/chicken-wings-spicy.jpg',
    category: 'Wings'
  },
  {
    id: 3,
    name: 'Chicken Tenders',
    description: '8 crispy chicken tenders with fries',
    price: 18.99,
    image: '/chicken-tenders-crispy.jpg',
    category: 'Combos'
  },
  {
    id: 4,
    name: 'Loaded Fries',
    description: 'Crispy fries topped with chicken and cheddar',
    price: 12.99,
    image: '/loaded-fries-chicken.jpg',
    category: 'Sides'
  },
  {
    id: 5,
    name: 'Spicy Drumsticks',
    description: '6 drumsticks with extra spice coating',
    price: 16.99,
    image: '/spicy-drumsticks-chicken.jpg',
    category: 'Chicken'
  },
  {
    id: 6,
    name: 'Family Feast',
    description: '24 pieces mixed chicken with sides',
    price: 54.99,
    image: '/family-feast-fried-chicken.jpg',
    category: 'Combos'
  },
]

export function Menu() {
  const [cart, setCart] = useState<{ [key: number]: number }>({})
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', ...new Set(menuItems.map(item => item.category))]
  const filteredItems = selectedCategory === 'All' ? menuItems : menuItems.filter(item => item.category === selectedCategory)

  const addToCart = (id: number) => {
    setCart(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }))
  }

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const newCart = { ...prev }
      if (newCart[id] > 1) {
        newCart[id]--
      } else {
        delete newCart[id]
      }
      return newCart
    })
  }

  return (
    <section id="menu" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground mb-2">Our Menu</h2>
            <p className="text-lg text-muted-foreground">Handpicked selections of our finest fried chicken</p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-secondary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map(item => (
              <div key={item.id} className="overflow-hidden rounded-xl bg-card shadow-md hover:shadow-lg transition">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="h-48 w-full object-cover"
                />
                <div className="space-y-4 p-6">
                  <div>
                    <h3 className="text-lg font-bold text-card-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">${item.price}</span>
                    <div className="flex items-center gap-2">
                      {cart[item.id] ? (
                        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-6 text-center font-medium">{cart[item.id]}</span>
                          <button
                            onClick={() => addToCart(item.id)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item.id)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-accent transition"
                        >
                          <Plus size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
