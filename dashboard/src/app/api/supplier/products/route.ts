import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const supplierId = searchParams.get('supplierId');

    if (!supplierId) {
        return NextResponse.json({ error: 'Supplier ID is required' }, { status: 400 });
    }

    try {
        const collection = await getCollection('electronics');
        const products = await collection.find({
            Suppliers: { $regex: new RegExp(`(^|,)${supplierId}(,|$)`) }
        }).toArray();

        const productsWithProductionRate = products.map(product => {
            const productionRate = product["Lead Time (Days)"] > 0 
                ? Math.round((product.Quantity / product["Lead Time (Days)"]) * 100) / 100
                : 0;
            
            return {
                ...product,
                "Production Rate (Units/Day)": productionRate
            };
        });

        return NextResponse.json({ products: productsWithProductionRate });
    } catch (error) {
        console.error('Error fetching products from MongoDB:', error);
        return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const product = await req.json();
        const collection = await getCollection('electronics');
        const result = await collection.insertOne(product);
        return NextResponse.json({ message: 'Product added successfully', insertedId: result.insertedId }, { status: 201 });
    } catch (error) {
        console.error('Error adding product to MongoDB:', error);
        return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
    }
}