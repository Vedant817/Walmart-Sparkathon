import { NextRequest, NextResponse } from 'next/server'

const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    price: 999,
    urgentPrice: 1099,
    category: 'electronics',
    description: 'Latest iPhone with advanced camera system and A17 Pro chip',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
    stock: 25
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24',
    price: 899,
    urgentPrice: 999,
    category: 'electronics',
    description: 'Flagship Android phone with AI features and excellent camera',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    stock: 30
  },
  {
    id: '3',
    name: 'Nike Air Max 270',
    price: 150,
    urgentPrice: 180,
    category: 'clothing',
    description: 'Comfortable running shoes with Max Air unit',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    stock: 50
  },
  {
    id: '4',
    name: 'MacBook Air M3',
    price: 1299,
    urgentPrice: 1399,
    category: 'electronics',
    description: 'Ultra-thin laptop with M3 chip and all-day battery life',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    stock: 15
  },
  {
    id: '5',
    name: 'Adidas Ultraboost 22',
    price: 180,
    urgentPrice: 210,
    category: 'clothing',
    description: 'Energy-returning running shoes for optimal performance',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop',
    stock: 40
  },
  {
    id: '6',
    name: 'Sony WH-1000XM5',
    price: 399,
    urgentPrice: 449,
    category: 'electronics',
    description: 'Industry-leading noise canceling wireless headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    stock: 35
  },
  {
    id: '7',
    name: 'The Psychology of Money',
    price: 15,
    urgentPrice: 20,
    category: 'books',
    description: 'Timeless lessons on wealth, greed, and happiness',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
    stock: 100
  },
  {
    id: '8',
    name: 'Levi\'s 501 Original Jeans',
    price: 89,
    urgentPrice: 109,
    category: 'clothing',
    description: 'Classic straight-leg jeans with authentic fit',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
    stock: 60
  },
  {
    id: '9',
    name: 'Instant Pot Duo 7-in-1',
    price: 99,
    urgentPrice: 119,
    category: 'home',
    description: 'Multi-use pressure cooker, slow cooker, rice cooker, and more',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    stock: 45
  },
  {
    id: '10',
    name: 'Wilson Tennis Racket',
    price: 129,
    urgentPrice: 149,
    category: 'sports',
    description: 'Professional-grade tennis racket for intermediate players',
    image: 'https://images.unsplash.com/photo-1622279394951-72de0c976a7a?w=400&h=300&fit=crop',
    stock: 20
  },
  {
    id: '11',
    name: 'KitchenAid Stand Mixer',
    price: 379,
    urgentPrice: 429,
    category: 'home',
    description: 'Iconic stand mixer for all your baking needs',
    image: 'https://images.unsplash.com/photo-1586236275491-d8ad0bb1cf0d?w=400&h=300&fit=crop',
    stock: 12
  },
  {
    id: '12',
    name: 'Atomic Habits',
    price: 18,
    urgentPrice: 23,
    category: 'books',
    description: 'An easy & proven way to build good habits & break bad ones',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    stock: 80
  },
  {
    id: '13',
    name: 'Patagonia Fleece Jacket',
    price: 149,
    urgentPrice: 179,
    category: 'clothing',
    description: 'Warm and sustainable fleece jacket for outdoor adventures',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
    stock: 25
  },
  {
    id: '14',
    name: 'Yeti Rambler Tumbler',
    price: 35,
    urgentPrice: 42,
    category: 'home',
    description: 'Insulated stainless steel tumbler keeps drinks hot or cold',
    image: 'https://images.unsplash.com/photo-1544441892-794166f1e3be?w=400&h=300&fit=crop',
    stock: 75
  },
  {
    id: '15',
    name: 'Fitbit Charge 5',
    price: 179,
    urgentPrice: 209,
    category: 'electronics',
    description: 'Advanced fitness & health tracker with built-in GPS',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=300&fit=crop',
    stock: 40
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'normal'
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let filteredProducts = [...mockProducts]

    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      )
    }

    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      products: filteredProducts,
      type,
      count: filteredProducts.length
    })

  } catch (error) {
    console.error('Error in products API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        products: [] 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productIds, type } = body

    const selectedProducts = mockProducts.filter(product => 
      productIds.includes(product.id)
    )

    const totalPrice = selectedProducts.reduce((total, product) => {
      const price = type === 'urgent' ? product.urgentPrice : product.price
      return total + price
    }, 0)

    return NextResponse.json({
      success: true,
      products: selectedProducts,
      totalPrice,
      deliveryType: type,
      estimatedDelivery: type === 'urgent' ? '2-4 hours' : '3-5 business days'
    })

  } catch (error) {
    console.error('Error in products POST API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process order' 
      },
      { status: 500 }
    )
  }
}