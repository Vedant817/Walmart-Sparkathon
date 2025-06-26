import { NextRequest, NextResponse } from 'next/server'

// Mock order data - In a real application, this would be stored in a database
let mockOrders: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'default-user'
    const status = searchParams.get('status')

    let filteredOrders = mockOrders.filter(order => order.userId === userId)

    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status)
    }

    return NextResponse.json({
      success: true,
      orders: filteredOrders,
      count: filteredOrders.length
    })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch orders',
        orders: [] 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      userId = 'default-user',
      products, 
      deliveryType, 
      totalPrice,
      customerInfo 
    } = body

    // Generate order ID
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Create new order
    const newOrder = {
      id: orderId,
      userId,
      products,
      deliveryType,
      totalPrice,
      customerInfo,
      status: 'confirmed',
      orderDate: new Date().toISOString(),
      estimatedDelivery: deliveryType === 'urgent' ? 
        new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() : // 4 hours
        new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days
      trackingNumber: `TRK${Math.random().toString(36).substr(2, 12).toUpperCase()}`
    }

    mockOrders.push(newOrder)

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: 'Order placed successfully'
    })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create order' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, status, trackingInfo } = body

    const orderIndex = mockOrders.findIndex(order => order.id === orderId)

    if (orderIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order not found' 
        },
        { status: 404 }
      )
    }

    // Update order
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      status: status || mockOrders[orderIndex].status,
      trackingInfo: trackingInfo || mockOrders[orderIndex].trackingInfo,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      order: mockOrders[orderIndex],
      message: 'Order updated successfully'
    })

  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update order' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order ID is required' 
        },
        { status: 400 }
      )
    }

    const orderIndex = mockOrders.findIndex(order => order.id === orderId)

    if (orderIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order not found' 
        },
        { status: 404 }
      )
    }

    // Remove order
    mockOrders.splice(orderIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully'
    })

  } catch (error) {
    console.error('Error cancelling order:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to cancel order' 
      },
      { status: 500 }
    )
  }
}
