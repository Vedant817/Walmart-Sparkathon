export interface Product {
  id: string;
  name: string;
  price: number;
  urgentPrice: number;
  category: string;
  description: string;
  image: string;
  stock: number;
  company?: string;
  sku?: string;
  weight?: number;
  location?: string;
  leadTime?: number;
  suppliers?: string;
  storageConditions?: string;
}

export interface Cart {
  [productId: string]: number
}

export interface Order {
  id: string
  userId: string
  products: OrderProduct[]
  deliveryType: 'normal' | 'urgent'
  totalPrice: number
  customerInfo: CustomerInfo
  status: OrderStatus
  orderDate: string
  estimatedDelivery: string
  trackingNumber: string
  updatedAt?: string
  trackingInfo?: TrackingInfo[]
}

export interface OrderProduct {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface TrackingInfo {
  status: string
  message: string
  timestamp: string
  location?: string
}

export interface Alert {
  id: string;
  type: 'payment' | 'dispatch' | 'stock' | 'production' | 'route';
  message: string;
  timestamp: string;
  reason?: string;
  contactInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}