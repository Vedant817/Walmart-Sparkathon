'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Product } from '@/types'

declare global {
  interface Window {
    updateCart?: (cart: Record<string, number>) => void
    globalCart?: Record<string, number>
  }
}

interface DeliveryMode {
  id: string
  name: string
  description: string
  cost: number
  estimatedTime: string
  icon: string
}

const deliveryModes: DeliveryMode[] = [
  {
    id: 'normal',
    name: 'Normal Delivery',
    description: 'Standard delivery',
    cost: 5.99,
    estimatedTime: '3-5 business days',
    icon: '📦'
  },
  {
    id: 'nextDay',
    name: 'Next Day Delivery',
    description: 'Get it tomorrow',
    cost: 12.99,
    estimatedTime: '1 business day',
    icon: '🚚'
  },
  {
    id: 'urgent',
    name: 'Urgent Delivery',
    description: 'Express delivery',
    cost: 19.99,
    estimatedTime: '2-4 hours',
    icon: '⚡'
  }
]

import { useSession } from 'next-auth/react';

const Checkout = () => {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<{ [key: string]: number }>({})
  const [loading, setLoading] = useState(true)
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState('normal')
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: '',
    phone: null,
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: null,
    country: 'India'
  })
  const [orderPlacing, setOrderPlacing] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  useEffect(() => {
    fetchProducts()
    if (typeof window !== 'undefined') {
      setCart(window.globalCart || {})
    }
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/customer/products')
      const data = await response.json()
      setProducts(data.products)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCartItems = () => {
    return Object.entries(cart).map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId)
      return product ? { product, quantity } : null
    }).filter(Boolean)
  }

  const getSubtotal = () => {
    return Object.entries(cart).reduce((total, [productId, count]) => {
      const product = products.find(p => p.id === productId)
      return total + (product ? product.price * count : 0)
    }, 0)
  }

  const getSelectedDeliveryMode = () => {
    return deliveryModes.find(mode => mode.id === selectedDeliveryMode) || deliveryModes[0]
  }

  const getTotalPrice = () => {
    const subtotal = getSubtotal()
    const deliveryMode = getSelectedDeliveryMode()
    return subtotal + deliveryMode.cost
  }

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0)
  }

  const handleAddressChange = (field: string, value: string) => {
    setDeliveryAddress(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const isAddressValid = () => {
    return deliveryAddress.fullName &&
      deliveryAddress.phone &&
      deliveryAddress.addressLine1 &&
      deliveryAddress.city &&
      deliveryAddress.state &&
      deliveryAddress.zipCode
  }

  const handlePlaceOrder = async () => {
    if (!session) {
      alert('Please sign in to place an order.');
      return;
    }

    if (!isAddressValid()) {
      alert('Please fill in all required address fields.');
      return;
    }

    if (getTotalItems() === 0) {
      alert('Your cart is empty.');
      return;
    }

    setOrderPlacing(true);

    try {
      const orderData = {
        cart: getCartItems().filter((item): item is { product: Product; quantity: number } => item !== null).map(({ product, quantity }) => ({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity
        })),
        customerInfo: {
          id: 'cus_' + Math.random().toString(36).substring(2, 15),
          email: session.user?.email,
          address: deliveryAddress
        }
      };

      const response = await fetch('/api/customer/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setOrderSuccess(true);
        setCart({}); // Clear the cart
        if (typeof window !== 'undefined' && window.updateCart) {
          window.updateCart({});
        }
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setOrderPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (orderSuccess) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Order Placed Successfully!</h2>
          <p className="text-green-600">Your order has been placed and will be processed soon.</p>
        </div>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Thank you for your order!</h3>
          <p className="text-gray-500 mb-6">You will receive a confirmation email shortly.</p>
          <Button onClick={() => window.location.href = '/dashboard/customer'} className="bg-blue-600 hover:bg-blue-700">
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  const cartItems = getCartItems()

  if (cartItems.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Checkout</h2>
          <p className="text-gray-600">Your cart is empty</p>
        </div>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Add some products to checkout!</p>
          <Button onClick={() => window.location.href = '/dashboard/customer'} className="bg-blue-600 hover:bg-blue-700">
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
        <h2 className="text-2xl font-bold text-blue-800 mb-2">Checkout</h2>
        <p className="text-blue-600">Complete your order</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 border">
            <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={deliveryAddress.fullName}
                  onChange={(e) => handleAddressChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={deliveryAddress.phone ?? ''}
                  onChange={(e) => handleAddressChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="addressLine1">Address Line 1 *</Label>
                <Input
                  id="addressLine1"
                  value={deliveryAddress.addressLine1}
                  onChange={(e) => handleAddressChange('addressLine1', e.target.value)}
                  placeholder="Street address"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  value={deliveryAddress.addressLine2}
                  onChange={(e) => handleAddressChange('addressLine2', e.target.value)}
                  placeholder="Apartment, suite, etc. (optional)"
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={deliveryAddress.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={deliveryAddress.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  placeholder="State"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={deliveryAddress.zipCode ?? ''}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  placeholder="ZIP Code"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={deliveryAddress.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border">
            <h3 className="text-lg font-semibold mb-4">Select Delivery Mode</h3>
            <div className="space-y-3">
              {deliveryModes.map((mode) => (
                <div
                  key={mode.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedDeliveryMode === mode.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => setSelectedDeliveryMode(mode.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="deliveryMode"
                        value={mode.id}
                        checked={selectedDeliveryMode === mode.id}
                        onChange={() => setSelectedDeliveryMode(mode.id)}
                        className="text-blue-600"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{mode.icon}</span>
                          <span className="font-semibold">{mode.name}</span>
                        </div>
                        <p className="text-sm text-gray-600">{mode.description}</p>
                        <p className="text-sm text-blue-600">{mode.estimatedTime}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-lg">${mode.cost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 border">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3">
              {cartItems.filter((item): item is { product: Product; quantity: number } => item !== null).map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-600">Qty: {quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(product.price * quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border">
            <h3 className="text-lg font-semibold mb-4">Price Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal ({getTotalItems()} items)</span>
                <span>${getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery ({getSelectedDeliveryMode().name})</span>
                <span>${getSelectedDeliveryMode().cost.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border">
            {!isAddressValid() && (
              <Alert className="mb-4">
                <AlertDescription>
                  Please fill in all required address fields to continue.
                </AlertDescription>
              </Alert>
            )}
            <Button
              onClick={handlePlaceOrder}
              disabled={!isAddressValid() || orderPlacing}
              className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
            >
              {orderPlacing ? 'Placing Order...' : `Place Order - $${getTotalPrice().toFixed(2)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout;