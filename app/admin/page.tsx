'use client'

import { useState, useEffect } from 'react'
import AdminHeader from '@/components/admin/admin-header'
import SalesMetrics from '@/components/admin/sales-metrics'
import SalesChart from '@/components/admin/sales-chart'
import TopProducts from '@/components/admin/top-products'
import RecentOrders from '@/components/admin/recent-orders'
import OrderTypeBreakdown from '@/components/admin/order-type-breakdown'

interface Order {
  id: number
  order_number: string
  total: number
  status: string
  order_type: string
  created_at: string
  item_count: number
  customer_name?: string
}

interface SalesData {
  total_revenue: number
  total_orders: number
  average_order_value: number
  completed_orders: number
}

interface TopProduct {
  name: string
  sales: number
  revenue: number
}

export default function AdminDashboard() {
  const [salesData, setSalesData] = useState<SalesData | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [orderTypeStats, setOrderTypeStats] = useState<any>({})
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('today')

  // Format tiền VND
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // 1. Fetch today's sales
        const salesRes = await fetch('/api/orders?type=today')
        const salesResult = await salesRes.json()
        
        if (salesResult.success) {
          setSalesData({
            total_revenue: salesResult.data.total_revenue || 0,
            total_orders: salesResult.data.total_orders || 0,
            average_order_value: salesResult.data.average_order_value || 0,
            completed_orders: salesResult.data.completed_orders || 0,
          })
        }

        // 2. Fetch recent orders (lấy từ API thật)
        const ordersRes = await fetch('/api/orders?limit=8')
        const ordersResult = await ordersRes.json()
        
        if (ordersResult.success) {
          const formattedOrders = ordersResult.data.map((order: any) => ({
            id: order.id,
            order_number: order.order_number,
            total: order.total || 0,
            status: order.status,
            order_type: order.order_type,
            created_at: order.created_at,
            item_count: order.item_count || 0,
            customer_name: order.customer_name,
          }))
          setOrders(formattedOrders)
          
          // 3. Tính toán order type stats từ orders thật
          calculateOrderTypeStats(formattedOrders)
          
          // 4. Tạo chart data từ orders thật
          generateChartData(formattedOrders)
        }

        // 5. Fetch top products từ database
        fetchTopProducts()

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [dateRange])

  const calculateOrderTypeStats = (ordersList: Order[]) => {
    const defaultStats = {
      'dine-in': { count: 0, percentage: 0 },
      'takeout': { count: 0, percentage: 0 },
      'delivery': { count: 0, percentage: 0 },
      'online': { count: 0, percentage: 0 },
    }

    if (ordersList.length > 0) {
      const typeCounts: Record<string, number> = {}
      
      ordersList.forEach(order => {
        typeCounts[order.order_type] = (typeCounts[order.order_type] || 0) + 1
      })
      
      const total = ordersList.length
      
      Object.keys(defaultStats).forEach(type => {
        const count = typeCounts[type] || 0
        defaultStats[type as keyof typeof defaultStats] = {
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0
        }
      })
    }
    
    setOrderTypeStats(defaultStats)
  }

  const fetchTopProducts = async () => {
    try {
      // Tạm thời dùng mock data, có thể tạo API sau
      const mockTopProducts = [
        { name: 'Gà chiên giòn', sales: 156, revenue: 7020000 },
        { name: 'Burger gà', sales: 124, revenue: 6820000 },
        { name: 'Gà rán cay', sales: 45, revenue: 6750000 },
        { name: 'Mì tương đen', sales: 67, revenue: 8040000 },
        { name: 'Khoai chiên cay', sales: 89, revenue: 4272000 },
      ]
      setTopProducts(mockTopProducts)
    } catch (error) {
      console.error('Failed to fetch top products:', error)
    }
  }

  const generateChartData = (ordersList: Order[]) => {
    try {
      // Tạo chart data từ orders trong 24h gần nhất
      const now = new Date()
      const hours = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date(now)
        hour.setHours(now.getHours() - 23 + i)
        return hour
      })

      const generatedChartData = hours.map(hour => {
        const hourStart = new Date(hour)
        const hourEnd = new Date(hour)
        hourEnd.setHours(hour.getHours() + 1)
        
        // Lọc orders trong khoảng thời gian này
        const hourlyOrders = ordersList.filter(order => {
          const orderTime = new Date(order.created_at)
          return orderTime >= hourStart && orderTime < hourEnd
        })
        
        const revenue = hourlyOrders.reduce((sum, order) => sum + order.total, 0)
        
        return {
          hour: `${hour.getHours()}:00`,
          revenue,
          orders: hourlyOrders.length,
        }
      })

      setChartData(generatedChartData)
    } catch (error) {
      console.error('Failed to generate chart data:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader dateRange={dateRange} onDateRangeChange={setDateRange} />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Key Metrics */}
        <SalesMetrics
          totalRevenue={salesData?.total_revenue || 0}
          totalOrders={salesData?.total_orders || 0}
          loading={loading}
        />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <SalesChart data={chartData} />

          {/* Order Type Breakdown */}
          <OrderTypeBreakdown data={orderTypeStats} />
        </div>

        {/* Top Products and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopProducts products={topProducts} />
          <RecentOrders orders={orders} loading={loading} />
        </div>
      </div>
    </div>
  )
}