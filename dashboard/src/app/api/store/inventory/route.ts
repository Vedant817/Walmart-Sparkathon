import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export interface InventoryItem {
  _id: string;
  category: string;
  Product_Name: string;
  Quantity_in_stock: number;
  Unit_Cost: number;
  Total_inventory_value: number;
  reorder_point: number;
}

export async function GET() {
  try {
    const collection = await getCollection('store_1_inventory');
    const inventoryData = await collection.find({}).toArray();

    const formattedData: InventoryItem[] = inventoryData.map((item: Record<string, unknown>) => ({
      _id: item._id as string,
      category: (item.Category as string) || '',
      Product_Name: (item.Product_Name as string) || '',
      Quantity_in_stock: (item.Quantity_in_Stock as number) || 0,
      Unit_Cost: (item.Unit_Cost as number) || 0,
      Total_inventory_value: (item.Total_Inventory_Value as number) || 0,
      reorder_point: (item.Reorder_Point as number) || 0,
    }));

    return NextResponse.json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch inventory data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}