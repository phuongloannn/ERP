"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Clock, Truck, ArrowLeft, Receipt, PackageOpen } from "lucide-react"

interface OrderDetail {
  order: {
    id: number
    order_number: string
    order_type: string
    status: string
    subtotal: number
    tax: number
    discount: number
    total: number
    payment_method?: string
    payment_status?: string
    delivery_address?: string
    customer_name?: string
    customer_phone?: string
    notes?: string
    created_at: string
    updated_at: string
  }
  items: Array<{
    id: number
    product_id: number
    product_name: string
    image_url?: string
    quantity: number
    unit_price: number
    total_price: number
  }>
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [data, setData] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const load = async () => {
      const id = params?.id as string
      if (!id) return
      setError("")
      try {
        const res = await fetch(`/api/customer/orders/${id}`)
        const json = await res.json()
        if (!json.success) {
          setError(json.error || "Unable to load order.")
          return
        }
        setData(json.data)
      } catch (err) {
        setError("Unable to load order.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params?.id])

  const formatCurrency = (v: number) => v.toLocaleString("vi-VN", { style: "currency", currency: "VND" })

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-primary hover:opacity-80"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span>·</span>
          <Link href="/account/orders" className="text-primary hover:opacity-80">Order history</Link>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading order...
          </div>
        ) : error ? (
          <div className="p-4 border border-destructive bg-destructive/10 rounded-lg text-destructive text-sm">
            {error}
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Order</p>
                  <h1 className="text-2xl font-bold">{data.order.order_number}</h1>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(data.order.created_at).toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> {data.order.order_type}</span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-semibold">{data.order.status}</p>
                  <p className="text-sm text-muted-foreground">Payment: {data.order.payment_status || 'pending'}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Receipt className="w-4 h-4 text-primary" /> Items
              </div>
              {data.items.length === 0 ? (
                <div className="text-sm text-muted-foreground">No items found.</div>
              ) : (
                <div className="divide-y divide-border">
                  {data.items.map((item) => (
                    <div key={item.id} className="py-3 flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">Qty {item.quantity} × {formatCurrency(item.unit_price)}</p>
                      </div>
                      <p className="font-semibold">{formatCurrency(item.total_price)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <PackageOpen className="w-4 h-4 text-primary" /> Summary
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCurrency(data.order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>{formatCurrency(data.order.tax)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Discount</span>
                  <span>- {formatCurrency(data.order.discount)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-primary pt-1">
                  <span>Total</span>
                  <span>{formatCurrency(data.order.total)}</span>
                </div>
              </div>
              {data.order.delivery_address && (
                <div className="pt-2 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">Delivery address</p>
                  <p>{data.order.delivery_address}</p>
                </div>
              )}
              {data.order.notes && (
                <div className="pt-2 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">Notes</p>
                  <p>{data.order.notes}</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
