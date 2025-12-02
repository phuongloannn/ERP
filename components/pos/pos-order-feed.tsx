'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import POSOrderCard from './pos-order-card';

interface Order {
  id: number;
  order_number: string;
  order_type: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivering';
  total: number;
  item_count: number;
  item_names: string;
  created_at: string;
  updated_at: string;
  delivery_address?: string;
}

export default function POSOrderFeed({
  orders,
  onRefresh,
}: {
  orders: Order[];
  onRefresh: () => void;
}) {
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const groupedOrders = {
    pending: orders.filter((o) => o.status === 'pending'),
    preparing: orders.filter((o) => o.status === 'preparing'),
    ready: orders.filter((o) => o.status === 'ready'),
    delivering: orders.filter((o) => o.status === 'delivering'),
  };

  const sections = [
    {
      title: 'Pending Orders',
      key: 'pending',
      color: 'border-red-300 bg-red-50',
      badge: 'bg-red-100 text-red-700',
      icon: '🔴',
    },
    {
      title: 'Preparing',
      key: 'preparing',
      color: 'border-amber-300 bg-amber-50',
      badge: 'bg-amber-100 text-amber-700',
      icon: '🟠',
    },
    {
      title: 'Ready for Pickup',
      key: 'ready',
      color: 'border-green-300 bg-green-50',
      badge: 'bg-green-100 text-green-700',
      icon: '🟢',
    },
    {
      title: 'On Delivery',
      key: 'delivering',
      color: 'border-purple-300 bg-purple-50',
      badge: 'bg-purple-100 text-purple-700',
      icon: '🟣',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {sections.map((section) => {
        const sectionOrders = groupedOrders[section.key as keyof typeof groupedOrders];

        return (
          <div
            key={section.key}
            className={`border-2 rounded-lg overflow-hidden ${section.color}`}
          >
            {/* Section Header */}
            <div className="p-4 border-b-2 border-current/20 bg-white/50">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="text-2xl">{section.icon}</span>
                {section.title}
                <span className={`ml-auto px-3 py-1 rounded-full text-sm font-semibold ${section.badge}`}>
                  {sectionOrders.length}
                </span>
              </h2>
            </div>

            {/* Orders List */}
            <div className="p-4 space-y-3 min-h-32">
              {sectionOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No orders</p>
                </div>
              ) : (
                sectionOrders.map((order) => (
                  <POSOrderCard
                    key={order.id}
                    order={order}
                    isExpanded={expandedOrder === order.id}
                    onToggleExpand={() =>
                      setExpandedOrder(expandedOrder === order.id ? null : order.id)
                    }
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
