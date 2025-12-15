"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ShoppingBag,
  Search,
  Loader2,
  CheckCircle2,
  Trash2,
  Minus,
  Plus,
  Phone,
  MapPin,
  User,
  Truck,
  Clock,
} from "lucide-react"
import { Product } from "@/lib/db"

interface CartItem {
  product: Product
  quantity: number
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [trackingNumber, setTrackingNumber] = useState("")
  const [trackingResult, setTrackingResult] = useState<{
    order_number: string
    status: string
    updated_at: string
  } | null>(null)
  const [trackingLoading, setTrackingLoading] = useState(false)
  const [trackingError, setTrackingError] = useState("")
  const [logoutLoading, setLogoutLoading] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products")
        const data = await res.json()
        if (!data.success) throw new Error("Failed to load products")
        setProducts(data.data)
      } catch (err) {
        setError("Could not load products. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  )

  const filtered = useMemo(() => {
    const term = search.toLowerCase()
    return products.filter((p) => {
      const matchCategory = category === "all" || p.category === category
      const matchTerm =
        p.name.toLowerCase().includes(term) ||
        (p.description || "").toLowerCase().includes(term)
      return matchCategory && matchTerm
    })
  }, [category, products, search])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId))
      return
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const removeItem = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const submitOrder = async () => {
    if (!customerName || !customerPhone || !deliveryAddress) {
      setError("Please fill customer name, phone, and delivery address.")
      return
    }
    if (cart.length === 0) {
      setError("Your cart is empty.")
      return
    }

    setSubmitting(true)
    setError("")
    setOrderNumber("")

    try {
      const payload = {
        order_type: "online",
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        notes,
        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price,
        })),
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!data.success) throw new Error(data.error || "Checkout failed")

      setOrderNumber(data.data.order_number || "")
      setCart([])
      setNotes("")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Checkout failed"
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/login'
    } finally {
      setLogoutLoading(false)
    }
  }

  const trackOrder = async () => {
    setTrackingError("")
    setTrackingResult(null)
    if (!trackingNumber.trim()) {
      setTrackingError("Enter your order code to track.")
      return
    }

    setTrackingLoading(true)
    try {
      const res = await fetch(`/api/orders/status-updates?orderId=${encodeURIComponent(trackingNumber.trim())}`)
      const data = await res.json()
      if (!data.success) {
        setTrackingError(data.error || "Order not found")
        return
      }
      setTrackingResult(data.data)
    } catch (err) {
      setTrackingError("Unable to fetch order status. Please try again.")
    } finally {
      setTrackingLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white text-foreground">
      <div className="bg-gradient-to-r from-primary to-amber-600 text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Order Manh Hoach Fried Chicken
            </h1>
            <p className="text-primary-foreground/90 max-w-2xl">
              Browse the full POS menu, pick your favorites, and checkout with your details.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/account/orders"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-foreground/15 text-primary-foreground font-semibold hover:bg-primary-foreground/20"
              >
                View order history
              </Link>
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-semibold hover:opacity-90 disabled:opacity-60"
              >
                {logoutLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-primary-foreground/15 px-4 py-3 rounded-xl shadow-lg">
            <ShoppingBag className="w-10 h-10" />
            <div>
              <p className="text-sm opacity-80">Your cart</p>
              <p className="text-2xl font-bold">{cart.length} items</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          {/* Order tracking */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Truck className="w-4 h-4 text-primary" /> Track your order
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter order code (e.g., ORD-1700000000000)"
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-input"
              />
              <button
                onClick={trackOrder}
                disabled={trackingLoading}
                className="w-full md:w-auto px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {trackingLoading && <Loader2 className="w-4 h-4 animate-spin inline mr-2" />}
                Track
              </button>
            </div>
            {trackingError && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive rounded-lg px-3 py-2">
                {trackingError}
              </div>
            )}
            {trackingResult && (
              <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/40 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Order</p>
                    <p className="font-semibold text-foreground">{trackingResult.order_number}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                    {trackingResult.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" /> Updated: {new Date(trackingResult.updated_at).toLocaleString()}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    category === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {cat === "all" ? "All" : cat}
                </button>
              ))}
            </div>
            <div className="w-full md:w-80 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menu..."
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading menu...
            </div>
          ) : error && !products.length ? (
            <div className="p-4 rounded-lg border border-destructive bg-destructive/10 text-destructive">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-44 bg-muted">
                    <Image
                      src={product.image_url || "/images/default.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-lg leading-tight">{product.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description || ""}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-xl font-bold text-primary">
                        {product.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                      <button
                        onClick={() => addToCart(product)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="bg-card border border-border rounded-2xl shadow-lg p-4 space-y-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Your Cart</h2>
          </div>

          {cart.length === 0 ? (
            <p className="text-muted-foreground text-sm">No items yet. Add something tasty.</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-auto pr-1">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="border border-border rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(item.product.price * item.quantity).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 border border-border rounded-md">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-muted"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-muted"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-muted-foreground">@ {item.product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-border pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{subtotal.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (10%)</span>
              <span>{tax.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-primary pt-1">
              <span>Total</span>
              <span>{total.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <User className="w-4 h-4 text-primary" /> Customer details
            </div>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Full name"
              className="w-full px-3 py-2 rounded-lg border border-border bg-input"
            />
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-input">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Phone"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex items-start gap-2 px-3 py-2 rounded-lg border border-border bg-input">
              <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Delivery address"
                className="w-full bg-transparent outline-none resize-none"
                rows={2}
              />
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes for the kitchen (optional)"
              className="w-full px-3 py-2 rounded-lg border border-border bg-input resize-none"
              rows={2}
            />
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            {orderNumber && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 border border-green-200 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4" /> Order placed! Your code: {orderNumber}
              </div>
            )}
            <button
              onClick={submitOrder}
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Placing order..." : "Place order"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
