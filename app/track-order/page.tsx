'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import OrderTrackingDetail from '@/components/order-tracking/order-tracking-detail';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter order ID or order number');
      return;
    }
    setError('');
    setSelectedOrder(orderId);
  };

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <OrderTrackingDetail
          orderId={selectedOrder}
          onBack={() => {
            setSelectedOrder(null);
            setOrderId('');
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <div className="max-w-md mx-auto pt-20">
        <Card className="p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">
            Track Your Order
          </h1>
          <p className="text-gray-600 mb-8">
            Enter your order ID or order number to track your fried chicken order in real-time.
          </p>

          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order ID or Order Number
              </label>
              <Input
                type="text"
                placeholder="e.g., 12345 or ORD-001"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3"
            >
              Track Order
            </Button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            You'll see live updates as your order is being prepared and delivered.
          </p>
        </Card>
      </div>
    </div>
  );
}
