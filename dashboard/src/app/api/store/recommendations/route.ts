import { NextRequest, NextResponse } from 'next/server';
import { ProductRecommendation } from '@/types';

// Generate product recommendations based on market trends
async function generateRecommendations(): Promise<ProductRecommendation[]> {
  const trendingProducts = [
    {
      productName: 'Wireless Earbuds Pro',
      category: 'Electronics',
      reason: 'High demand in electronics category, trending on social media',
      potentialRevenue: 25000,
      priority: 'high' as const,
      marketTrend: 0.92,
      demandScore: 0.88,
    },
    {
      productName: 'Organic Green Tea Set',
      category: 'Grocery',
      reason: 'Health-conscious trend, growing market segment',
      potentialRevenue: 15000,
      priority: 'medium' as const,
      marketTrend: 0.78,
      demandScore: 0.72,
    },
    {
      productName: 'Smart Home Security Camera',
      category: 'Electronics',
      reason: 'Rising demand for home security, competitive pricing available',
      potentialRevenue: 30000,
      priority: 'high' as const,
      marketTrend: 0.85,
      demandScore: 0.90,
    },
    {
      productName: 'Eco-Friendly Water Bottles',
      category: 'Home & Living',
      reason: 'Environmental awareness driving demand, high profit margins',
      potentialRevenue: 12000,
      priority: 'medium' as const,
      marketTrend: 0.73,
      demandScore: 0.68,
    },
    {
      productName: 'Premium Yoga Mat Collection',
      category: 'Sports & Fitness',
      reason: 'Fitness trend continues, complementary to existing products',
      potentialRevenue: 18000,
      priority: 'low' as const,
      marketTrend: 0.65,
      demandScore: 0.60,
    },
  ];

  return trendingProducts;
}

export async function GET(request: NextRequest) {
  try {
    const recommendations = await generateRecommendations();

    return NextResponse.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch recommendations',
      },
      { status: 500 }
    );
  }
}