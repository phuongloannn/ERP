'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, Clock, Flame, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import POSOrderFeed from '@/components/pos/pos-order-feed';

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

export default function POSOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/feed');
      const result = await response.json();

      if (!result.success) {
        setError('Failed to load orders');
        return;
      }

      setOrders(result.data);
      setError('');
      setLastRefresh(new Date());
    } catch (err) {
      console.error('[v0] Error fetching orders:', err);
      setError('Connection error. Retrying...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Auto-refresh every 3 seconds if enabled
    if (!autoRefresh) return;

    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const preparingCount = orders.filter((o) => o.status === 'preparing').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-700 to-orange-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Order Queue</h1>
              <p className="text-amber-50 text-sm mt-1">Real-time order management for kitchen staff</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Live Updates</span>
              </label>
              <Button
                onClick={fetchOrders}
                variant="outline"
                className="bg-white/20 hover:bg-white/30 border-white/50 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <p className="text-xs text-red-600 font-semibold uppercase">Pending</p>
                <p className="text-2xl font-bold text-red-700">{pendingCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <Flame className="w-6 h-6 text-amber-600" />
              <div>
                <p className="text-xs text-amber-600 font-semibold uppercase">Preparing</p>
                <p className="text-2xl font-bold text-amber-700">{preparingCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-xs text-green-600 font-semibold uppercase">Ready</p>
                <p className="text-2xl font-bold text-green-700">{readyCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
            {error}
          </div>
        )}

        {loading && !orders.length ? (
          <div className="text-center py-12">
            <div className="animate-spin inline-block">
              <RefreshCw className="w-8 h-8 text-amber-600" />
            </div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-xl font-semibold text-gray-700">All caught up!</p>
            <p className="text-gray-500 mt-1">No pending orders at the moment</p>
          </div>
        ) : (
          <POSOrderFeed orders={orders} onRefresh={fetchOrders} />
        )}

        {/* Last updated timestamp */}
        <div className="text-center text-xs text-gray-500 mt-8">
          Last updated: {lastRefresh.toLocaleTimeString()}
          {autoRefresh && ' (Auto-refreshing every 3s)'}
        </div>
      </div>
    </div>
  );
}
