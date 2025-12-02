import { db } from './db';

export interface NotificationPayload {
  orderId: number;
  customerId?: number;
  type: 'order_confirmed' | 'order_preparing' | 'order_ready' | 'order_delivering' | 'order_completed' | 'order_cancelled';
  channel: 'email' | 'sms' | 'push';
  recipient: string;
  message: string;
}

const notificationMessages = {
  order_confirmed: {
    subject: 'Order Confirmed',
    template: (orderNumber: string) => 
      `Your order ${orderNumber} has been confirmed. We're starting to prepare it!`,
  },
  order_preparing: {
    subject: 'Order Being Prepared',
    template: (orderNumber: string) => 
      `We're now preparing your order ${orderNumber}. You'll get an update soon!`,
  },
  order_ready: {
    subject: 'Order Ready',
    template: (orderNumber: string) => 
      `Great news! Your order ${orderNumber} is ready for pickup/delivery.`,
  },
  order_delivering: {
    subject: 'Order On The Way',
    template: (orderNumber: string) => 
      `Your order ${orderNumber} is on the way to you! Check tracking for updates.`,
  },
  order_completed: {
    subject: 'Order Completed',
    template: (orderNumber: string) => 
      `Your order ${orderNumber} has been delivered. Thank you for your order!`,
  },
  order_cancelled: {
    subject: 'Order Cancelled',
    template: (orderNumber: string) => 
      `Your order ${orderNumber} has been cancelled. Please contact us for details.`,
  },
};

export const notificationService = {
  // Create notification record
  async createNotification(payload: NotificationPayload) {
    try {
      const result = await db.query(
        `INSERT INTO notifications (order_id, customer_id, notification_type, channel, recipient, message)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [payload.orderId, payload.customerId || null, payload.type, payload.channel, payload.recipient, payload.message]
      );
      return result[0];
    } catch (error) {
      console.error('[v0] Error creating notification:', error);
      throw error;
    }
  },

  // Send email notification
  async sendEmailNotification(orderId: number, email: string, type: string, orderNumber: string) {
    try {
      const message = notificationMessages[type as keyof typeof notificationMessages];
      if (!message) return;

      const payload: NotificationPayload = {
        orderId,
        type: type as NotificationPayload['type'],
        channel: 'email',
        recipient: email,
        message: message.template(orderNumber),
      };

      // Create notification record
      await this.createNotification(payload);

      // In production, you would integrate with:
      // - SendGrid
      // - Mailgun
      // - AWS SES
      // For now, we'll log it
      console.log('[v0] Email notification queued:', {
        to: email,
        subject: message.subject,
        message: message.template(orderNumber),
      });

      return true;
    } catch (error) {
      console.error('[v0] Error sending email notification:', error);
      return false;
    }
  },

  // Send SMS notification
  async sendSMSNotification(orderId: number, phone: string, type: string, orderNumber: string) {
    try {
      const message = notificationMessages[type as keyof typeof notificationMessages];
      if (!message) return;

      const payload: NotificationPayload = {
        orderId,
        type: type as NotificationPayload['type'],
        channel: 'sms',
        recipient: phone,
        message: message.template(orderNumber),
      };

      // Create notification record
      await this.createNotification(payload);

      // In production, you would integrate with:
      // - Twilio
      // - AWS SNS
      // - ViettelMessaging
      // For now, we'll log it
      console.log('[v0] SMS notification queued:', {
        to: phone,
        message: message.template(orderNumber),
      });

      return true;
    } catch (error) {
      console.error('[v0] Error sending SMS notification:', error);
      return false;
    }
  },

  // Send push notification (browser push)
  async sendPushNotification(orderId: number, userId: string, type: string, orderNumber: string) {
    try {
      const message = notificationMessages[type as keyof typeof notificationMessages];
      if (!message) return;

      const payload: NotificationPayload = {
        orderId,
        type: type as NotificationPayload['type'],
        channel: 'push',
        recipient: userId,
        message: message.template(orderNumber),
      };

      // Create notification record
      await this.createNotification(payload);

      console.log('[v0] Push notification queued:', {
        userId,
        message: message.template(orderNumber),
      });

      return true;
    } catch (error) {
      console.error('[v0] Error sending push notification:', error);
      return false;
    }
  },

  // Send notification across multiple channels
  async notifyCustomer(orderId: number, customerData: {
    id?: number;
    email?: string;
    phone?: string;
    userId?: string;
  }, type: string, orderNumber: string) {
    const results = [];

    if (customerData.email) {
      results.push(await this.sendEmailNotification(orderId, customerData.email, type, orderNumber));
    }

    if (customerData.phone) {
      results.push(await this.sendSMSNotification(orderId, customerData.phone, type, orderNumber));
    }

    if (customerData.userId) {
      results.push(await this.sendPushNotification(orderId, customerData.userId, type, orderNumber));
    }

    return results.some(r => r);
  },

  // Get notifications for customer
  async getCustomerNotifications(orderId: number, limit = 10) {
    try {
      const result = await db.query(
        `SELECT * FROM notifications 
         WHERE order_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2`,
        [orderId, limit]
      );
      return result;
    } catch (error) {
      console.error('[v0] Error fetching notifications:', error);
      return [];
    }
  },
};
