/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface ShipmentItem {
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  supplier: string;
}

interface Shipment {
  _id?: ObjectId;
  shipmentId: string;
  orderId: string;
  supplier: string;
  status: 'ordered' | 'confirmed' | 'shipped' | 'delivered';
  items: ShipmentItem[];
  totalValue: number;
  orderDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  storeId: string;
}

interface ShipmentResponse extends Omit<Shipment, '_id'> {
  _id: string;
}

export async function GET(request: NextRequest) {
  try {
    const collection = await getCollection('store_1_shipment');
    const shipments = await collection.find({}).sort({ orderDate: -1 }).toArray() as Shipment[];

    const shipmentsResponse: ShipmentResponse[] = shipments.map(shipment => ({
      ...shipment,
      _id: shipment._id!.toString()
    }));

    return NextResponse.json({
      success: true,
      shipments: shipmentsResponse
    });
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shipments' },
      { status: 500 }
    );
  }
}

interface OrderRequest {
  supplier: string;
  items: ShipmentItem[];
  totalValue: number;
}

interface CreateShipmentsRequest {
  orders: OrderRequest[];
}

export async function POST(request: NextRequest) {
  try {
    const { orders }: CreateShipmentsRequest = await request.json();

    if (!orders || !Array.isArray(orders)) {
      return NextResponse.json(
        { success: false, error: 'Invalid orders data' },
        { status: 400 }
      );
    }

    const collection = await getCollection('store_1_shipment');
    const shipments: Shipment[] = [];

    for (const order of orders) {
      const shipmentId = `SHP-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      
      const estimatedDeliveryDate = new Date();
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + Math.floor(Math.random() * 7) + 2); // 2-8 days

      const shipment: Shipment = {
        shipmentId,
        orderId,
        supplier: order.supplier,
        status: 'ordered',
        items: order.items,
        totalValue: order.totalValue,
        orderDate: new Date().toISOString(),
        estimatedDelivery: estimatedDeliveryDate.toISOString(),
        storeId: 'store_1'
      };

      shipments.push(shipment);
    }

    const result = await collection.insertMany(shipments);

    return NextResponse.json({
      success: true,
      message: `${shipments.length} shipments created successfully`,
      shipmentIds: shipments.map(s => s.shipmentId)
    });
  } catch (error) {
    console.error('Error creating shipments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create shipments' },
      { status: 500 }
    );
  }
}

interface UpdateShipmentRequest {
  shipmentId: string;
  status: 'ordered' | 'confirmed' | 'shipped' | 'delivered';
  actualDelivery?: string;
}

export async function PATCH(request: NextRequest) {
  try {
    const { shipmentId, status, actualDelivery }: UpdateShipmentRequest = await request.json();

    if (!shipmentId || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const collection = await getCollection('store_1_shipment');
    const updateData: Partial<Pick<Shipment, 'status' | 'actualDelivery'>> = { status };
    
    if (actualDelivery) {
      updateData.actualDelivery = actualDelivery;
    }

    const result = await collection.updateOne(
      { shipmentId },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Shipment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Shipment status updated successfully'
    });
  } catch (error) {
    console.error('Error updating shipment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update shipment' },
      { status: 500 }
    );
  }
}