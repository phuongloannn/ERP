'use client'

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface OrderTypeBreakdownProps {
  data?: {  // Thêm optional chấm hỏi
    'dine-in': { count: number; percentage: number }
    'takeout': { count: number; percentage: number }
    'delivery': { count: number; percentage: number }
    'online': { count: number; percentage: number }
  }
}

export default function OrderTypeBreakdown({ data }: OrderTypeBreakdownProps) {
  // Dữ liệu mặc định nếu data undefined
  const defaultData = {
    'dine-in': { count: 0, percentage: 25 },
    'takeout': { count: 0, percentage: 25 },
    'delivery': { count: 0, percentage: 25 },
    'online': { count: 0, percentage: 25 },
  }

  // Sử dụng data nếu có, không thì dùng default
  const safeData = data || defaultData

  const chartData = [
    { 
      name: 'Dine-in', 
      value: safeData['dine-in']?.percentage || 0,
      count: safeData['dine-in']?.count || 0
    },
    { 
      name: 'Takeout', 
      value: safeData['takeout']?.percentage || 0,
      count: safeData['takeout']?.count || 0
    },
    { 
      name: 'Delivery', 
      value: safeData['delivery']?.percentage || 0,
      count: safeData['delivery']?.count || 0
    },
    { 
      name: 'Online', 
      value: safeData['online']?.percentage || 0,
      count: safeData['online']?.count || 0
    },
  ]

  const colors = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)']

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Order Type Distribution</CardTitle>
        <CardDescription>Breakdown by order type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Percentage']}
                labelFormatter={(name) => `Type: ${name}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {Object.entries(safeData).map(([type, stats]) => (
            <div key={type} className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground capitalize">{type.replace('-', ' ')}</p>
              <p className="text-lg font-bold text-foreground">{stats?.count || 0}</p>
              <p className="text-xs text-muted-foreground">{stats?.percentage || 0}%</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}