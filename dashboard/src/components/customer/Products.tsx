/* eslint-disable @next/next/no-img-element */
'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { Product } from '@/types'

type ProductWithImage = Product & { imageUrl: string };

const getRandomImageFromUnsplash = (category: string, id: string) => {
  const keywords: Record<string, string> = {
    electronics: 'electronics,gadgets,tech',
    fashion: 'fashion,clothes,style',
    books: 'books,reading,library',
    beauty: 'beauty,makeup,cosmetics',
    food: 'food,fruit,vegetables',
    textile: 'textile,fabric,sewing',
    pharma: 'pharma,medicine,health',
    default: 'product,item,store',
  };
  const query = keywords[category?.toLowerCase()] || keywords.default;
  return `https://source.unsplash.com/400x300/?${query}&sig=${id}`;
};


const Products = () => {
  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { cart, addToCart, removeFromCart, getTotalItems } = useCart();

  const fetchProducts = useCallback(async (search: string, category: string) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category !== 'all') params.append('category', category);

      const response = await fetch(`/api/customer/products?${params.toString()}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        const productsWithImages = (data.products || []).map((p: Product) => ({
          ...p,
          imageUrl: getRandomImageFromUnsplash(p.category, p.id),
        }));
        setProducts(productsWithImages);
      } else {
        setError(data.error || 'Failed to fetch products');
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts(searchTerm, selectedCategory);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, selectedCategory, fetchProducts]);

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [productId, count]) => {
      const product = products.find(p => p.id === productId);
      return total + (product ? product.price * count : 0);
    }, 0);
  };

  const uniqueCategories = useMemo(() => {
    const categories = products.map(p => p.category).filter(Boolean);
    return Array.from(new Set(categories));
  }, [products]);

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
        <Button onClick={() => fetchProducts(searchTerm, selectedCategory)} className="bg-blue-600 hover:bg-blue-700">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search products by name or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
        >
          <option value="all">All Categories</option>
          {uniqueCategories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {getTotalItems() > 0 && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex justify-between items-center">
          <div>
            <p className="text-green-700 font-semibold">
              🛒 Cart: {getTotalItems()} items | Total: ${getTotalPrice().toFixed(2)}
            </p>
          </div>
          <Link href="/dashboard/customer/cart">
            <Button className="bg-green-600 hover:bg-green-700">
              View Cart
            </Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-4 border hover:shadow-lg transition-shadow duration-200">
            <div className="relative mb-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md bg-gray-200"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://source.unsplash.com/400x300/?product,store';
                }}
              />
              <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                {product.category}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                {product.name}
              </h3>
              <div className="flex justify-between items-center">
                <p className="text-blue-600 font-bold text-xl">${product.price}</p>
                <p className="text-sm text-gray-600">
                  Stock: <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              {product.stock > 0 ? (
                cart[product.id] ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => removeFromCart(product.id)} className="h-8 w-8 p-0">-</Button>
                      <span className="font-semibold min-w-[20px] text-center">{cart[product.id]}</span>
                      <Button variant="outline" size="sm" onClick={() => addToCart(product.id)} className="h-8 w-8 p-0" disabled={cart[product.id] >= product.stock}>+</Button>
                    </div>
                    <span className="text-sm text-gray-600">${(product.price * cart[product.id]).toFixed(2)}</span>
                  </div>
                ) : (
                  <Button onClick={() => addToCart(product.id)} className="w-full bg-blue-600 hover:bg-blue-700">Add to Cart</Button>
                )
              ) : (
                <Button disabled className="w-full bg-gray-400 cursor-not-allowed">Out of Stock</Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500 text-lg mb-2">No products found</p>
          <p className="text-gray-400">
            {searchTerm || selectedCategory !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'No products available at the moment'
            }
          </p>
          {(searchTerm || selectedCategory !== 'all') && (
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default Products;