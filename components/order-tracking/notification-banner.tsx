'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Mail, MessageSquare } from 'lucide-react';

interface Notification {
  id: number;
  type: string;
  channel: 'email' | 'sms' | 'push';
  message: string;
  created_at: string;
}

export default function NotificationBanner({
  orderId,
}: {
  orderId: number;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/notifications?orderId=${orderId}`);
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setNotifications(data.data);
          setShowBanner(true);
        }
      } catch (error) {
        console.error('[v0] Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (!showBanner || notifications.length === 0) return null;

  const latestNotification = notifications[0];
  const channelIcon = latestNotification.channel === 'email' ? Mail : MessageSquare;
  const ChannelIcon = channelIcon;

  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
      <div className="pt-1">
        <Bell className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-blue-900 mb-1">
          Update sent via {latestNotification.channel.toUpperCase()}
        </p>
        <p className="text-sm text-blue-800">{latestNotification.message}</p>
        {notifications.length > 1 && (
          <p className="text-xs text-blue-600 mt-2">
            +{notifications.length - 1} more notification{notifications.length > 2 ? 's' : ''}
          </p>
        )}
      </div>
      <button
        onClick={() => setShowBanner(false)}
        className="text-blue-400 hover:text-blue-600"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
