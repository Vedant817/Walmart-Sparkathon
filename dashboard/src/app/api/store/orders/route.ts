import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { BUSINESS_LOCATIONS } from '@/constants/locations';
import { ObjectId } from 'mongodb';
import { ActiveOrder } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const storeCollectionNames = BUSINESS_LOCATIONS
      .filter(loc => loc.type === 'store')
      .map(store => `${store.id}_order`);

    const allOrders: ActiveOrder[] = [];

    for (const collectionName of storeCollectionNames) {
      try {
        const collection = await getCollection(collectionName);
        const orders = await collection.find({}).toArray();

        const transformedOrders = orders.map(order => {
          const orderDate = new Date(order.orderDate || order.createdAt || Date.now());
          const transactionId = `TXN${order.orderId?.toString().slice(-8) || Math.random().toString(36).substr(2, 8)}`;
          const products = order.products || [];
          const firstProduct = products[0] || {};
          return {
            _id: order._id.toString(),
            orderId: order.orderId?.toString() || order._id.toString(),
            date: orderDate.toISOString().split('T')[0],
            time: orderDate.toTimeString().split(' ')[0],
            transaction_id: transactionId,
            customer_id: order.customerId || order.shippingAddress?.email || 'unknown',
            product_name: firstProduct.name || products.map((p: Record<string, unknown>) => p.name).join(', ') || 'Mixed Products',
            quantity: products.reduce((sum: number, p: Record<string, unknown>) => sum + ((p.quantity as number) || 0), 0) || 1,
            unit_price: firstProduct.price || 0,
            total_price: products.reduce((sum: number, p: Record<string, unknown>) => sum + (((p.price as number) || 0) * ((p.quantity as number) || 0)), 0),
            sub_total: order.totalAmount || 0,
            total_amount: order.totalAmount || 0,
            status: order.status?.toLowerCase() === 'pending' ? 'pending' :
              order.status?.toLowerCase() === 'packed' ? 'packed' :
                order.status?.toLowerCase() === 'out_for_delivery' ? 'out_for_delivery' :
                  order.status?.toLowerCase() === 'delivered' ? 'delivered' : 'fulfilled',
            customer_info: {
              name: order.shippingAddress?.fullName || 'Unknown Customer',
              email: order.shippingAddress?.email || '',
              phone: order.shippingAddress?.phone || '',
              address: order.shippingAddress
            },
            products: products
          } as ActiveOrder;
        });
        allOrders.push(...transformedOrders);
      } catch (error) {
        console.warn(`Could not fetch orders from collection: ${collectionName}`, error);
      }
    }

    allOrders.sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());

    let filteredOrders: ActiveOrder[] = allOrders
      .filter(order => ['pending', 'packed', 'out_for_delivery'].includes(order.status));

    if (search) {
      const searchLower = search.toLowerCase();
      filteredOrders = filteredOrders.filter(order =>
        order.orderId.toLowerCase().includes(searchLower) ||
        order.transaction_id.toLowerCase().includes(searchLower) ||
        order.customer_id.toLowerCase().includes(searchLower) ||
        order.product_name.toLowerCase().includes(searchLower) ||
        order.customer_info?.name.toLowerCase().includes(searchLower) ||
        order.customer_info?.email.toLowerCase().includes(searchLower)
      );
    }

    if (status && status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    const startIndex = (page - 1) * limit;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      orders: paginatedOrders,
      total: filteredOrders.length,
      page,
      limit,
      totalPages: Math.ceil(filteredOrders.length / limit)
    });

  } catch (error) {
    console.error('Error fetching store orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status, storeId } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    const storeCollectionNames = storeId ?
      [`${storeId}_order`] :
      BUSINESS_LOCATIONS
        .filter(loc => loc.type === 'store')
        .map(store => `${store.id}_order`);

    let updated = false;
    let orderToMove: ActiveOrder | null = null;

    for (const collectionName of storeCollectionNames) {
      try {
        const collection = await getCollection(collectionName);

        const order = await collection.findOne({
          $or: [
            { orderId: new ObjectId(orderId) },
            { _id: new ObjectId(orderId) },
            { orderId: orderId }
          ]
        });

        if (order) {
          const result = await collection.updateOne(
            { _id: order._id },
            {
              $set: {
                status: status,
                updatedAt: new Date()
              }
            }
          );

          if (result.modifiedCount > 0) {
            updated = true;
            if (status === 'delivered') {
              const orderDate = new Date(order.orderDate || order.createdAt || Date.now());
              const transactionId = `TXN${order.orderId?.toString().slice(-8) || Math.random().toString(36).substr(2, 8)}`;
              const products = order.products || [];
              const firstProduct = products[0] || {};
              
              orderToMove = {
                _id: order._id.toString(),
                orderId: order.orderId?.toString() || order._id.toString(),
                date: orderDate.toISOString().split('T')[0],
                time: orderDate.toTimeString().split(' ')[0],
                transaction_id: transactionId,
                customer_id: order.customerId || order.shippingAddress?.email || 'unknown',
                product_name: firstProduct.name || products.map((p: Record<string, unknown>) => p.name).join(', ') || 'Mixed Products',
                quantity: products.reduce((sum: number, p: Record<string, unknown>) => sum + ((p.quantity as number) || 0), 0) || 1,
                unit_price: firstProduct.price || 0,
                total_price: products.reduce((sum: number, p: Record<string, unknown>) => sum + (((p.price as number) || 0) * ((p.quantity as number) || 0)), 0),
                sub_total: order.totalAmount || 0,
                total_amount: order.totalAmount || 0,
                status: 'delivered' as const,
                customer_info: {
                  name: order.shippingAddress?.fullName || 'Unknown Customer',
                  email: order.shippingAddress?.email || '',
                  phone: order.shippingAddress?.phone || '',
                  address: order.shippingAddress
                },
                products: products
              };
              await collection.deleteOne({ _id: order._id });
            }
            break;
          }
        }
      } catch (error) {
        console.warn(`Could not update order in collection: ${collectionName}`, error);
      }
    }

    if (updated) {
      if (orderToMove) {
        const salesCollection = await getCollection('store_1_sale');
        const orderForSale = {
          ...orderToMove,
          _id: new ObjectId(orderToMove._id)
        };
        await salesCollection.insertOne(orderForSale);
      }
      return NextResponse.json({ success: true, message: 'Order status updated successfully' });
    } else {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}