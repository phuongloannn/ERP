'use client'

import { TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface TopProduct {
  name: string
  sales: number
  revenue: number
}

interface TopProductsProps {
  products: TopProduct[]
}

export default function TopProducts({ products }: TopProductsProps) {
  const maxSales = Math.max(...products.map(p => p.sales))

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Best selling items today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-accent to-accent/50 rounded-lg flex items-center justify-center text-accent-foreground font-bold">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{product.name}</p>
                <div className="w-full bg-muted rounded-full h-2 mt-1">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(product.sales / maxSales) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-foreground">{product.sales}</p>
                <p className="text-xs text-muted-foreground">
                  {(product.revenue / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
