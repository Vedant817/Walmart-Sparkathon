'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { Product } from '@/types'

const Products = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const { cart, addToCart, removeFromCart, getTotalItems } = useCart()

  useEffect(() => {
    fetchProducts();
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [productId, count]) => {
      const product = products.find(p => p.id === productId)
      return total + (product ? product.price * count : 0)
    }, 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="home">Home & Garden</option>
          <option value="books">Books</option>
          <option value="sports">Sports</option>
        </select>
      </div>

      {getTotalItems() > 0 && (
        <div className="bg-green-50 p-2 rounded-lg border border-green-200 flex justify-between items-center">
          <div>
            <p className="text-green-600">Items: {getTotalItems()} | Total: ${getTotalPrice().toFixed(2)}</p>
          </div>
          <Link href="/dashboard/customer/cart">
            <Button className="bg-green-600 hover:bg-green-700">
              View Cart 🛒
            </Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-4 border hover:shadow-lg transition-shadow">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{product.description}</p>
            <p className="text-blue-600 font-bold text-xl mb-2">${product.price}</p>
            <p className="text-sm text-gray-500 mb-4">Stock: {product.stock}</p>
            <div className="flex items-center justify-between">
              {cart[product.id] ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromCart(product.id)}
                  >
                    -
                  </Button>
                  <span className="font-semibold">{cart[product.id]}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addToCart(product.id)}
                  >
                    +
                  </Button>
                </div>
              ) : (
                <Button onClick={() => addToCart(product.id)} className="w-full">
                  Add to Cart
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default Products