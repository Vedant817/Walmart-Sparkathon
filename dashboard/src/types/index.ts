export interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  image: string
  stock: number
}

export interface CartItem {
  productId: string
  quantity: number
  deliveryType: 'normal' | 'urgent'
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

export interface DeliveryAddress {
  fullName: string,
  phone: number | null,
  addressLine1: string,
  addressLine2: string,
  city: string,
  state: string,
  zipCode: number | null,
  country: 'India'
}
export interface TrackingInfo {
  status: string
  message: string
  timestamp: string
  location?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ProductsResponse {
  success: boolean
  products: Product[]
  type: string
  count: number
}

export interface OrdersResponse {
  success: boolean
  orders: Order[]
  count: number
}

export interface OrderResponse {
  success: boolean
  order: Order
  message: string
}

export interface DeliveryComponentProps {
  onCartUpdate?: (cart: Cart) => void
}

export interface SidebarProps {
  activeSection?: string
}

export interface CheckoutForm {
  customerInfo: CustomerInfo
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay'
  deliveryInstructions?: string
}

export type DeliveryType = 'normal' | 'urgent'

export interface DeliveryOption {
  type: DeliveryType
  name: string
  description: string
  timeframe: string
  additionalCost: number
}