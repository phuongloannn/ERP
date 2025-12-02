'use client'

import { useState, useEffect } from 'react'
import OrdersHeader from '@/components/orders/orders-header'
import OrdersTable from '@/components/orders/orders-table'
import OrderDetailModal from '@/components/orders/order-detail-modal'

interface OrderDetail {
  id: number
  order_number: string
  total: number
  status: string
  payment_status: string
  order_type: string
  created_at: string
  updated_at: string
  customer_name?: string      // <-- SỬA THÀNH string
  customer_phone?: string     // <-- SỬA THÀNH string
  delivery_address?: string
  subtotal: number
  tax: number
  discount: number
  payment_method?: string
  notes?: string
  items: Array<{
    id: number
    product_id: number
    product_name: string
    quantity: number
    unit_price: number
    total_price: number
  }>
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch orders từ database
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && data.data) {
  // Format data từ API
  const formattedOrders: OrderDetail[] = data.data.map((order: any) => {
    // Tạo tên khách hàng mặc định
    let customerName = order.customer_name;
    let customerPhone = order.customer_phone;
    
    // Nếu không có tên khách hàng, tạo mặc định
    if (!customerName || customerName === 'NULL' || customerName === 'null') {
      if (order.order_type === 'dine-in') {
        customerName = 'Dine-in Customer';
      } else if (order.order_type === 'takeout') {
        customerName = 'Takeout Customer';
      } else if (order.order_type === 'delivery') {
        customerName = 'Delivery Customer';
      } else if (order.order_type === 'online') {
        customerName = 'Online Customer';
      } else {
        customerName = 'Customer';
      }
    }
    
    // Nếu không có số điện thoại
    if (!customerPhone || customerPhone === 'NULL') {
      customerPhone = 'N/A';
    }

    // Trả về object với thông tin đã sửa
    return {
      id: order.id,
      order_number: order.order_number,
      total: parseFloat(order.total) || 0,
      status: order.status,
      payment_status: order.payment_status || 'pending',
      order_type: order.order_type,
      created_at: order.created_at,
      updated_at: order.updated_at,
      customer_name: customerName,       // ĐÃ SỬA
      customer_phone: customerPhone,     // ĐÃ SỬA
      delivery_address: order.delivery_address || 'Store Pickup',
      subtotal: parseFloat(order.subtotal) || 0,
      tax: parseFloat(order.tax) || 0,
      discount: parseFloat(order.discount) || 0,
      payment_method: order.payment_method || 'cash',
      notes: order.notes,
      items: order.items || []
    };
  });
        setOrders(formattedOrders.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ))
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    
    // Refresh mỗi 30 giây để cập nhật real-time
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [])

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.customer_phone?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await res.json()
      
      if (data.success) {
        // Cập nhật local state
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId ? { 
              ...order, 
              status: newStatus,
              updated_at: new Date().toISOString()
            } : order
          )
        )
        
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ 
            ...selectedOrder, 
            status: newStatus,
            updated_at: new Date().toISOString()
          })
        }
        
        // Refresh data từ server
        fetchOrders()
      } else {
        alert('Failed to update status: ' + data.error)
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
      alert('Failed to update order status')
    }
  }

  const handleProcessPayment = async (orderId: number, amount: number) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          payment_status: 'paid',
          payment_method: 'cash' // hoặc lấy từ UI
        }),
      })

      const data = await res.json()
      if (data.success) {
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId ? { 
              ...order, 
              payment_status: 'paid' 
            } : order
          )
        )
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, payment_status: 'paid' })
        }
      } else {
        alert('Payment failed: ' + data.error)
      }
    } catch (error) {
      console.error('Payment processing error:', error)
      alert('Failed to process payment')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <OrdersHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        
      />

      <div className="p-6 max-w-7xl mx-auto">
        <OrdersTable
          orders={filteredOrders}
          loading={loading}
  onSelectOrder={(order: any) => setSelectedOrder(order)}  // SỬA DÒNG NÀY
          onUpdateStatus={handleUpdateStatus}
        />
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateStatus}
          onProcessPayment={handleProcessPayment}
        />
      )}
    </div>
  )
}