import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { BUSINESS_LOCATIONS } from '@/constants/locations';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Not logged in' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const storeCollectionNames = BUSINESS_LOCATIONS
      .filter(loc => loc.type === 'store')
      .map(store => `${store.id}_order`);

    const allOrders = [];

    for (const name of storeCollectionNames) {
      try {
        const collection = await getCollection(name);
        const orders = await collection.find({ "shippingAddress.email": userEmail }).toArray();
        allOrders.push(...orders);
      } catch (e) {
        console.warn(`Could not fetch orders from collection: ${name}`, e);
      }
    }

    allOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

    return NextResponse.json({ success: true, orders: allOrders });

  } catch (error) {
    console.error('Fatal error in GET /api/customer/orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders due to a server error' }, { status: 500 });
  }
}