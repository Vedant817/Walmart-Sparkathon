'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  image: string
  stock: number
}

const Cart = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const { cart, removeFromCart, updateCartItem, getTotalItems } = useCart()

  useEffect(() => {
    fetchProducts()
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

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [productId, count]) => {
      const product = products.find(p => p.id === productId)
      return total + (product ? product.price * count : 0)
    }, 0)
  }

  const getCartItems = () => {
    return Object.entries(cart).map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId)
      return product ? { product, quantity } : null
    }).filter((item): item is { product: Product; quantity: number } => Boolean(item))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const cartItems = getCartItems()

  if (cartItems.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart</h2>
          <p className="text-gray-600">Your shopping cart is empty</p>
        </div>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Add some products to get started!</p>
          <Link href="/dashboard/customer">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
        <h2 className="text-2xl font-bold text-blue-800 mb-2">Your Cart</h2>
        <p className="text-blue-600">{getTotalItems()} items in your cart</p>
      </div>
      <div className="space-y-4">
        {cartItems.map(({ product, quantity }) => product && (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-4 border">
            <div className="flex items-center gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.description}</p>
                <p className="text-blue-600 font-bold">${product.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateCartItem(product.id, quantity - 1)}
                >
                  -
                </Button>
                <span className="font-semibold w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateCartItem(product.id, quantity + 1)}
                >
                  +
                </Button>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">${(product.price * quantity).toFixed(2)}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFromCart(product.id)}
                  className="text-red-600 hover:text-red-800 mt-2"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 p-6 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total Items:</span>
          <span className="text-lg">{getTotalItems()}</span>
        </div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-bold">Total Price:</span>
          <span className="text-xl font-bold text-blue-600">${getTotalPrice().toFixed(2)}</span>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/customer" className="flex-1">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/dashboard/customer/checkout" className="flex-1">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart