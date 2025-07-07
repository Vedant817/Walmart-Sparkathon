import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { BUSINESS_LOCATIONS } from '@/lib/locations';

const storeLocations: { [key: string]: { lat: number; lon: number } } = BUSINESS_LOCATIONS.filter(loc => loc.type === 'store').reduce((acc, store) => {
  acc[store.id] = { lat: store.coords[0], lon: store.coords[1] };
  return acc;
}, {} as { [key: string]: { lat: number; lon: number } });

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const findNearestStore = (customerLat: number, customerLon: number) => {
  let nearestStore = ''
  let minDistance = Infinity;

  for (const store in storeLocations) {
    const distance = getDistance(customerLat, customerLon, storeLocations[store].lat, storeLocations[store].lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearestStore = store;
    }
  }
  return nearestStore;
};

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CustomerInfo {
  id: string;
  address: Address;
  email: string;
}

interface RequestBody {
  cart: CartItem[];
  customerInfo: CustomerInfo;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { cart, customerInfo } = body;

    const customerLat = 12.9716; //! Bangalore (MG Road) - Placeholder
    const customerLon = 77.5946;

    const nearestStore = findNearestStore(customerLat, customerLon);
    const orderCollectionName = `${nearestStore}_order`;

    const orderCollection = await getCollection(orderCollectionName);

    const newOrder = {
      orderId: new ObjectId(),
      customerId: customerInfo.id,
      products: cart,
      orderDate: new Date(),
      status: 'Pending',
      totalAmount: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
      shippingAddress: {
        ...customerInfo.address,
        email: customerInfo.email,
      },
    };

    await orderCollection.insertOne(newOrder);

    return NextResponse.json({ success: true, message: `Order placed successfully at ${nearestStore}` });

  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ success: false, error: 'Failed to place order' }, { status: 500 });
  }
}