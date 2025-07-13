/* eslint-disable @next/next/no-img-element */
'use client'
import React from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { Product } from '@/types'

type ProductWithImage = Product & { 
  imageUrl: string; 
  imageLoading?: boolean; 
  imageError?: boolean; 
};

// Enhanced image selection with product relevance
const getRelevantProductImage = (productName: string, category: string, productId: string): string => {
  const name = productName.toLowerCase();
  
  // Product-specific keywords with relevant images
  const productKeywords: Record<string, string> = {
    // Electronics
    'phone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    'smartphone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    'laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    'computer': 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=300&fit=crop',
    'headphone': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    'earphone': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    'camera': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
    'watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    'tablet': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
    'speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
    
    // Fashion
    'shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
    'dress': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop',
    'shoes': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
    'sneakers': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
    'bag': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    'jacket': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop',
    'jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
    'hat': 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=300&fit=crop',
    
    // Books
    'novel': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
    'textbook': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop',
    'cookbook': 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=300&fit=crop',
    'magazine': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    
    // Beauty
    'lipstick': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=300&fit=crop',
    'cream': 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=300&fit=crop',
    'perfume': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop',
    'shampoo': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    'makeup': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
    
    // Food
    'coffee': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
    'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    'milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
    'fruit': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop',
    'vegetable': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
    'cheese': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop',
    
    // Home
    'chair': 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop',
    'table': 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=300&fit=crop',
    'lamp': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    'pillow': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
    'curtain': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  };

  // Check for specific product keywords first
  for (const [keyword, imageUrl] of Object.entries(productKeywords)) {
    if (name.includes(keyword)) {
      return imageUrl;
    }
  }

  // Fallback to category-specific images
  const categoryImages: Record<string, string[]> = {
    electronics: [
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&h=300&fit=crop',
    ],
    fashion: [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    ],
    books: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop',
    ],
    beauty: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
    ],
    food: [
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=400&h=300&fit=crop',
    ],
    home: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop',
    ],
    default: [
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
    ]
  };

  const images = categoryImages[category?.toLowerCase()] || categoryImages.default;
  const seed = (productId + productName).replace(/[^\w]/g, '').slice(-6);
  const index = parseInt(seed, 36) % images.length;
  return images[index];
};

const Products: React.FC = () => {
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
          imageUrl: getRelevantProductImage(p.name, p.category, p.id),
          imageLoading: false,
          imageError: false,
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

  const handleImageError = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const fallbackUrl = `https://via.placeholder.com/400x300/e2e8f0/64748b?text=${encodeURIComponent(p.category || 'Product')}`;
        return { ...p, imageUrl: fallbackUrl, imageError: true };
      }
      return p;
    }));
  };

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
                onError={() => handleImageError(product.id)}
                loading="lazy"
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
};

export default Products;
