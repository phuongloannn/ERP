"use client"

import { useEffect, useState } from "react"
import { Loader2, Clock, CheckCircle2, Truck, XCircle } from "lucide-react"
import Link from "next/link"

interface OrderRow {
  id: number
  order_number: string
  status: string
  total: number
  order_type: string
  payment_status: string
  created_at: string
  updated_at: string
}

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const load = async () => {
      setError("")
      try {
        const res = await fetch("/api/customer/orders")
        const data = await res.json()
        if (!data.success) {
          setError(data.error || "Please login to view your orders.")
          return
        }
        setOrders(data.data || [])
      } catch (err) {
        setError("Unable to load orders.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const statusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700"
      case "preparing":
        return "bg-blue-100 text-blue-700"
      case "ready":
        return "bg-emerald-100 text-emerald-700"
      case "delivering":
        return "bg-purple-100 text-purple-700"
      case "completed":
        return "bg-green-100 text-green-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Your orders</p>
            <h1 className="text-3xl font-bold">Order history</h1>
            <p className="text-sm text-muted-foreground">Track status and review past purchases.</p>
          </div>
          <Link
            href="/shop"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90"
          >
            Back to shop
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading orders...
          </div>
        ) : error ? (
          <div className="p-4 border border-destructive bg-destructive/10 rounded-lg text-destructive text-sm flex items-start gap-2">
            <XCircle className="w-4 h-4 mt-0.5" />
            <div>
              <p className="font-semibold">{error}</p>
              <p className="text-xs mt-1">
                Need an account? <Link href="/register" className="underline">Register</Link> or <Link href="/login" className="underline">login</Link>.
              </p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-6 border border-border bg-card rounded-xl text-center space-y-3">
            <p className="text-lg font-semibold">No orders yet</p>
            <p className="text-sm text-muted-foreground">Start an order to see it here.</p>
            <Link href="/shop" className="px-4 py-2 inline-flex rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90">Shop now</Link>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl shadow-sm divide-y divide-border">
            {orders.map((order) => (
              <div key={order.id} className="p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{order.order_number}</p>
                  <p className="text-lg font-semibold">{order.total.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(order.created_at).toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> {order.order_type}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                    Payment: {order.payment_status || 'pending'}
                  </span>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="text-primary text-sm font-semibold hover:opacity-80"
                  >
                    Details
                  </Link>
                  <Link
                    href={`/track-order?orderId=${encodeURIComponent(order.order_number)}`}
                    className="text-primary text-sm font-semibold hover:opacity-80"
                  >
                    Track
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
