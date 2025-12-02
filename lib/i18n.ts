export type Language = 'en' | 'vi';

export const translations = {
  en: {
    // Navigation & Common
    home: 'Home',
    trackOrder: 'Track Order',
    login: 'Login',
    logout: 'Logout',
    language: 'Language',
    
    // POS
    posSystem: 'POS System',
    orderQueue: 'Order Queue',
    products: 'Products',
    categories: 'Categories',
    cart: 'Cart',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Tax',
    discount: 'Discount',
    checkout: 'Checkout',
    paymentMethod: 'Payment Method',
    cash: 'Cash',
    card: 'Card',
    momo: 'MoMo',
    vnpay: 'VNPay',
    completeOrder: 'Complete Order',
    clearCart: 'Clear Cart',
    removeItem: 'Remove Item',
    quantity: 'Quantity',
    price: 'Price',
    addToCart: 'Add to Cart',
    
    // Order Status
    orderStatus: 'Order Status',
    orderNumber: 'Order Number',
    orderId: 'Order ID',
    pending: 'Pending',
    preparing: 'Preparing',
    ready: 'Ready',
    delivering: 'Delivering',
    completed: 'Completed',
    cancelled: 'Cancelled',
    orderReceived: 'Order Received',
    ourTeamCooking: 'Our team is cooking your order',
    readyForPickup: 'Ready for Pickup',
    onTheWay: 'On the Way',
    delivered: 'Delivered Successfully',
    
    // Tracking
    trackYourOrder: 'Track Your Order',
    enterOrderId: 'Enter your order ID or order number',
    search: 'Search',
    orderNotFound: 'Order not found',
    pleaseCheckOrderId: 'Please check your order ID',
    
    // Customer Info
    customerName: 'Customer Name',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    deliveryAddress: 'Delivery Address',
    orderType: 'Order Type',
    dineIn: 'Dine In',
    takeout: 'Takeout',
    delivery: 'Delivery',
    online: 'Online',
    
    // Items
    items: 'Items',
    noItems: 'No items',
    itemCount: 'Item Count',
    quantity: 'Quantity',
    unitPrice: 'Unit Price',
    totalPrice: 'Total Price',
    
    // Notifications
    notifications: 'Notifications',
    orderConfirmed: 'Order Confirmed',
    orderPreparing: 'Order Being Prepared',
    orderReady: 'Order Ready',
    orderDelivering: 'Order On The Way',
    orderCompleted: 'Order Completed',
    orderCancelled: 'Order Cancelled',
    notificationSent: 'Notification sent via',
    moreNotifications: 'more notification',
    
    // Inventory
    inventory: 'Inventory',
    stock: 'Stock',
    lowStock: 'Low Stock',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    quantityOnHand: 'Quantity On Hand',
    minimumStock: 'Minimum Stock',
    
    // Admin & Analytics
    analytics: 'Analytics',
    dashboard: 'Dashboard',
    sales: 'Sales',
    revenue: 'Revenue',
    orders: 'Orders',
    averageOrderValue: 'Average Order Value',
    topProducts: 'Top Products',
    recentOrders: 'Recent Orders',
    
    // Messages
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    processing: 'Processing...',
    tryAgain: 'Try Again',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    cancel: 'Cancel',
    close: 'Close',
  },
  vi: {
    // Navigation & Common
    home: 'Trang Chủ',
    trackOrder: 'Theo Dõi Đơn',
    login: 'Đăng Nhập',
    logout: 'Đăng Xuất',
    language: 'Ngôn Ngữ',
    
    // POS
    posSystem: 'Hệ Thống POS',
    orderQueue: 'Hàng Chờ Đơn Hàng',
    products: 'Sản Phẩm',
    categories: 'Danh Mục',
    cart: 'Giỏ Hàng',
    total: 'Tổng Cộng',
    subtotal: 'Tổng Phụ',
    tax: 'Thuế',
    discount: 'Giảm Giá',
    checkout: 'Thanh Toán',
    paymentMethod: 'Phương Thức Thanh Toán',
    cash: 'Tiền Mặt',
    card: 'Thẻ Tín Dụng',
    momo: 'MoMo',
    vnpay: 'VNPay',
    completeOrder: 'Hoàn Thành Đơn Hàng',
    clearCart: 'Xóa Giỏ Hàng',
    removeItem: 'Xóa Mục',
    quantity: 'Số Lượng',
    price: 'Giá',
    addToCart: 'Thêm Vào Giỏ',
    
    // Order Status
    orderStatus: 'Trạng Thái Đơn Hàng',
    orderNumber: 'Số Đơn Hàng',
    orderId: 'ID Đơn Hàng',
    pending: 'Chờ Xử Lý',
    preparing: 'Đang Chuẩn Bị',
    ready: 'Sẵn Sàng',
    delivering: 'Đang Giao',
    completed: 'Hoàn Thành',
    cancelled: 'Đã Hủy',
    orderReceived: 'Đã Nhận Đơn Hàng',
    ourTeamCooking: 'Đội ngũ của chúng tôi đang chuẩn bị đơn của bạn',
    readyForPickup: 'Sẵn Sàng Lấy',
    onTheWay: 'Đang Trên Đường',
    delivered: 'Đã Giao Thành Công',
    
    // Tracking
    trackYourOrder: 'Theo Dõi Đơn Hàng Của Bạn',
    enterOrderId: 'Nhập ID đơn hàng hoặc số đơn hàng của bạn',
    search: 'Tìm Kiếm',
    orderNotFound: 'Không Tìm Thấy Đơn Hàng',
    pleaseCheckOrderId: 'Vui lòng kiểm tra ID đơn hàng của bạn',
    
    // Customer Info
    customerName: 'Tên Khách Hàng',
    phone: 'Điện Thoại',
    email: 'Email',
    address: 'Địa Chỉ',
    deliveryAddress: 'Địa Chỉ Giao Hàng',
    orderType: 'Loại Đơn Hàng',
    dineIn: 'Ăn Tại Chỗ',
    takeout: 'Mang Về',
    delivery: 'Giao Hàng',
    online: 'Đặt Trực Tuyến',
    
    // Items
    items: 'Mục',
    noItems: 'Không có mục',
    itemCount: 'Số Lượng Mục',
    quantity: 'Số Lượng',
    unitPrice: 'Giá Đơn Vị',
    totalPrice: 'Tổng Giá',
    
    // Notifications
    notifications: 'Thông Báo',
    orderConfirmed: 'Đơn Hàng Đã Được Xác Nhận',
    orderPreparing: 'Đơn Hàng Đang Được Chuẩn Bị',
    orderReady: 'Đơn Hàng Đã Sẵn Sàng',
    orderDelivering: 'Đơn Hàng Đang Được Giao',
    orderCompleted: 'Đơn Hàng Hoàn Thành',
    orderCancelled: 'Đơn Hàng Đã Hủy',
    notificationSent: 'Thông báo được gửi qua',
    moreNotifications: 'thông báo khác',
    
    // Inventory
    inventory: 'Kho Hàng',
    stock: 'Hàng Tồn',
    lowStock: 'Hàng Tồn Thấp',
    inStock: 'Còn Hàng',
    outOfStock: 'Hết Hàng',
    quantityOnHand: 'Số Lượng Có Sẵn',
    minimumStock: 'Hàng Tồn Tối Thiểu',
    
    // Admin & Analytics
    analytics: 'Phân Tích',
    dashboard: 'Bảng Điều Khiển',
    sales: 'Bán Hàng',
    revenue: 'Doanh Thu',
    orders: 'Đơn Hàng',
    averageOrderValue: 'Giá Trị Đơn Bình Quân',
    topProducts: 'Sản Phẩm Hàng Đầu',
    recentOrders: 'Đơn Hàng Gần Đây',
    
    // Messages
    loading: 'Đang Tải...',
    error: 'Lỗi',
    success: 'Thành Công',
    processing: 'Đang Xử Lý...',
    tryAgain: 'Thử Lại',
    back: 'Quay Lại',
    next: 'Tiếp Theo',
    submit: 'Gửi',
    cancel: 'Hủy',
    close: 'Đóng',
  },
};

export const useTranslation = (language: Language = 'en') => {
  return {
    t: (key: keyof typeof translations.en): string => {
      return translations[language][key] || translations.en[key] || key;
    },
    language,
  };
};
