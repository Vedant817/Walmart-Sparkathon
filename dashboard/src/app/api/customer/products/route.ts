import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface DatabaseProduct {
  _id: ObjectId;
  "Item Name": string;
  "Unit Cost ($)": number;
  "Company": string;
  "Quantity": number;
  "Cargo Size (cm x cm)"?: string;
  "Weight (g)"?: number;
  "SKU"?: string;
  "Location (WH-Aisle-Bin)"?: string;
  "Lead Time (Days)"?: number;
  "Reorder Point (Units)"?: number;
  "Suppliers"?: string;
  "Lot/Batch Number"?: string;
  "Storage Conditions"?: string;
}
interface TransformedProduct {
  id: string;
  name: string;
  price: number;
  urgentPrice: number;
  category: string;
  description: string;
  stock: number;
  company: string;
}

interface MongoQuery {
  $or?: Array<{
    [key: string]: {
      $regex: string;
      $options: string;
    };
  }>;
  _id?: {
    $in: ObjectId[];
  };
}

interface ProductRequestBody {
  productIds: string[];
  type: 'urgent' | 'normal';
}

interface ProductResponse {
  success: boolean;
  products: TransformedProduct[];
  count: number;
  error?: string;
}

interface OrderResponse {
  success: boolean;
  products: TransformedProduct[];
  totalPrice: number;
  deliveryType: string;
  estimatedDelivery: string;
  error?: string;
}

const transformProduct = (product: DatabaseProduct, collectionName: string): TransformedProduct => ({
  id: product._id.toString(),
  name: product["Item Name"] || 'Unknown Item',
  price: product["Unit Cost ($)"] || 0,
  urgentPrice: (product["Unit Cost ($)"] || 0) * 1.5,
  category: collectionName,
  description: `${product["Company"] || 'Unknown Company'} - ${product["Item Name"] || 'Unknown Item'}`,
  stock: product["Quantity"] || 0,
  company: product["Company"] || ''
});

export async function GET(request: NextRequest): Promise<NextResponse<ProductResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const category: string | null = searchParams.get('category');
    const search: string | null = searchParams.get('search');

    const collectionNames: string[] = ['electronics', 'pharma', 'food', 'textile'];
    const allProducts: TransformedProduct[] = [];

    for (const name of collectionNames) {
      if (category && category !== 'all' && category.toLowerCase() !== name.toLowerCase()) {
        continue;
      }

      try {
        const collection = await getCollection(name);
        let query: MongoQuery = {};
        
        if (search) {
          query = {
            $or: [
              { "Item Name": { $regex: search, $options: 'i' } },
              { "Company": { $regex: search, $options: 'i' } }
            ]
          };
        }

        const products = await collection.find(query).limit(50).toArray() as DatabaseProduct[];
        allProducts.push(...products.map(p => transformProduct(p, name)));
      } catch (e) {
        console.error(`Failed to fetch from collection: ${name}`, e);
      }
    }

    return NextResponse.json({
      success: true,
      products: allProducts,
      count: allProducts.length,
    });

  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products', products: [], count: 0 },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<OrderResponse>> {
  try {
    const body: ProductRequestBody = await request.json();
    const { productIds, type } = body;

    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product IDs', products: [], totalPrice: 0, deliveryType: '', estimatedDelivery: '' }, 
        { status: 400 }
      );
    }

    const collectionNames: string[] = ['electronics', 'pharma', 'food', 'textile'];
    const selectedProducts: TransformedProduct[] = [];

    for (const name of collectionNames) {
      try {
        const collection = await getCollection(name);
        const query: MongoQuery = {
          _id: { $in: productIds.map(id => new ObjectId(id)) }
        };
        
        const products = await collection.find(query).toArray() as DatabaseProduct[];
        selectedProducts.push(...products.map(p => transformProduct(p, name)));
      } catch (e) {
        console.error(`Failed to fetch from collection: ${name}`, e);
      }
    }

    const totalPrice: number = selectedProducts.reduce((total: number, product: TransformedProduct) => {
      const price: number = type === 'urgent' ? product.urgentPrice : product.price;
      return total + price;
    }, 0);

    return NextResponse.json({
      success: true,
      products: selectedProducts,
      totalPrice,
      deliveryType: type,
      estimatedDelivery: type === 'urgent' ? '2-4 hours' : '3-5 business days',
    });

  } catch (error) {
    console.error('Error in products POST API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process order', products: [], totalPrice: 0, deliveryType: '', estimatedDelivery: '' },
      { status: 500 }
    );
  }
}