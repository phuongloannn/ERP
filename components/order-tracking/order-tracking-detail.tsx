'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { useTranslation, type Language } from '@/lib/i18n';
import NotificationBanner from './notification-banner';

interface Order {
  id: number;
  order_number: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
  order_type: string;
  total: number;
  delivery_address?: string;
  payment_status?: string;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_phone?: string;
  items?: Array<{
    id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    image_url?: string;
  }>;
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: 'orderReceived',
    description: 'Order is in the queue',
    color: 'bg-blue-100 text-blue-700',
    borderColor: 'border-blue-300',
  },
  preparing: {
    icon: Clock,
    label: 'orderPreparing',
    description: 'ourTeamCooking',
    color: 'bg-amber-100 text-amber-700',
    borderColor: 'border-amber-300',
  },
  ready: {
    icon: CheckCircle2,
    label: 'ready',
    description: 'readyForPickup',
    color: 'bg-green-100 text-green-700',
    borderColor: 'border-green-300',
  },
  delivering: {
    icon: Truck,
    label: 'delivering',
    description: 'onTheWay',
    color: 'bg-purple-100 text-purple-700',
    borderColor: 'border-purple-300',
  },
  completed: {
    icon: CheckCircle2,
    label: 'completed',
    description: 'delivered',
    color: 'bg-green-100 text-green-700',
    borderColor: 'border-green-300',
  },
  cancelled: {
    icon: AlertCircle,
    label: 'cancelled',
    description: 'Order has been cancelled',
    color: 'bg-red-100 text-red-700',
    borderColor: 'border-red-300',
  },
};

export default function OrderTrackingDetail({
  orderId,
  onBack,
}: {
  orderId: string;
  onBack: () => void;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const { t } = useTranslation(language);

  useEffect(() => {
    const saved = (localStorage.getItem('language') as Language) || 'en';
    setLanguage(saved);
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const result = await response.json();

        if (!result.success) {
          setError(t('orderNotFound'));
          setLoading(false);
          return;
        }

        setOrder(result.data);
        setError('');
        setLoading(false);
      } catch (err) {
        console.error('[v0] Error fetching order:', err);
        setError(t('error'));
        setLoading(false);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [orderId, t]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-40 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Button onClick={onBack} variant="outline" className="mb-4">
          <ChevronLeft className="w-4 h-4 mr-2" />
          {t('back')}
        </Button>
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p className="text-lg font-semibold">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!order) return null;

  const statusList = ['pending', 'preparing', 'ready', 'delivering', 'completed'] as const;
  const currentStatusIndex = statusList.indexOf(order.status as typeof statusList[number]);

  return (
    <div className="max-w-2xl mx-auto">
      <Button onClick={onBack} variant="outline" className="mb-6">
        <ChevronLeft className="w-4 h-4 mr-2" />
        {t('back')}
      </Button>

      <NotificationBanner orderId={order.id} />

      <Card className="p-6 mb-6 shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-amber-900">
              {t('orderNumber')} {order.order_number}
            </h1>
            <p className="text-gray-600 text-sm">
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-amber-600">
              {order.total.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              })}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t('loading')}: {lastUpdate?.toLocaleTimeString() || 'now'}
            </p>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="my-8">
          <div className="space-y-3">
            {statusList.map((status, index) => {
              const isActive = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const config = statusConfig[status];
              const Icon = config.icon;

              return (
                <div key={status} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`p-2 rounded-full ${
                        isActive
                          ? config.color
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {index < statusList.length - 1 && (
                      <div
                        className={`w-1 h-12 my-1 ${
                          index < currentStatusIndex
                            ? 'bg-green-400'
                            : 'bg-gray-200'
                        }`}
                      ></div>
                    )}
                  </div>

                  <div className={`flex-1 pt-1 ${!isActive ? 'opacity-50' : ''}`}>
                    <p
                      className={`font-semibold ${
                        isCurrent
                          ? 'text-amber-700'
                          : isActive
                          ? 'text-gray-700'
                          : 'text-gray-500'
                      }`}
                    >
                      {t(config.label as keyof typeof translations.en)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t(config.description as keyof typeof translations.en)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-2 gap-4 pt-6 border-t">
          <div>
            <p className="text-xs text-gray-500 uppercase">{t('orderType')}</p>
            <p className="font-semibold text-gray-700 capitalize">
              {t(order.order_type as keyof typeof translations.en)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">{t('loading')}</p>
            <p className="font-semibold text-gray-700 capitalize">
              {order.payment_status || 'N/A'}
            </p>
          </div>
          {order.delivery_address && (
            <div className="col-span-2">
              <p className="text-xs text-gray-500 uppercase">{t('deliveryAddress')}</p>
              <p className="font-semibold text-gray-700">{order.delivery_address}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Order Items */}
      {order.items && order.items.length > 0 && (
        <Card className="p-6 shadow-lg">
          <h2 className="text-lg font-bold text-amber-900 mb-4">{t('items')}</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between pb-3 border-b last:border-0">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.product_name}</p>
                  <p className="text-sm text-gray-600">
                    {t('quantity')}: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-600">
                    {(item.unit_price * item.quantity).toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
