'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Clock, MapPin } from 'lucide-react';

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

export default function POSOrderCard({
  order,
  isExpanded,
  onToggleExpand,
}: {
  order: Order;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const getTimeElapsed = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}h ago`;
  };

  const statusColors = {
    pending: 'bg-red-100 text-red-700',
    preparing: 'bg-amber-100 text-amber-700',
    ready: 'bg-green-100 text-green-700',
    delivering: 'bg-purple-100 text-purple-700',
  };

  const nextStatus = {
    pending: 'preparing',
    preparing: 'ready',
    ready: 'delivering',
    delivering: 'completed',
  };

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${order.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus[order.status] }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Trigger refresh in parent component
      window.location.reload();
    } catch (error) {
      console.error('[v0] Error updating status:', error);
      alert('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div
        onClick={onToggleExpand}
        className="p-4 cursor-pointer hover:bg-gray-50 flex items-start justify-between"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-lg text-amber-700">
              Order #{order.order_number}
            </span>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${statusColors[order.status]}`}>
              {order.status.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {getTimeElapsed(order.created_at)}
            </div>
            <div className="text-amber-700 font-semibold">
              {order.total.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              })}
            </div>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <>
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            {/* Items */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                Items ({order.item_count})
              </p>
              <p className="text-sm text-gray-700 line-clamp-3">{order.item_names}</p>
            </div>

            {/* Delivery Address if applicable */}
            {order.delivery_address && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Delivery Address
                </p>
                <p className="text-sm text-gray-700">{order.delivery_address}</p>
              </div>
            )}

            {/* Action Button */}
            <Button
              onClick={handleStatusUpdate}
              disabled={loading || order.status === 'delivering'}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2"
            >
              {loading
                ? 'Updating...'
                : `Mark as ${nextStatus[order.status].charAt(0).toUpperCase() + nextStatus[order.status].slice(1)}`}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
