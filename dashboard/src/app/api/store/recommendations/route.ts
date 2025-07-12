/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { ProductRecommendation } from '@/types';

async function generateRecommendations(): Promise<ProductRecommendation[]> {
  const trendingProducts = [
    {
      productName: 'Wireless Earbuds Pro',
      category: 'Electronics',
      reason: 'High demand in electronics category, trending on social media',
      potentialRevenue: 59.99,
      priority: 'high' as const,
      marketTrend: 0.92,
      demandScore: 0.88,
    },
    {
      productName: 'Organic Green Tea Set',
      category: 'Food',
      reason: 'Health-conscious trend, growing market segment',
      potentialRevenue: 15.99,
      priority: 'medium' as const,
      marketTrend: 0.78,
      demandScore: 0.72,
    },
    {
      productName: 'Smart Home Security Camera',
      category: 'Electronics',
      reason: 'Rising demand for home security, competitive pricing available',
      potentialRevenue: 89.99,
      priority: 'high' as const,
      marketTrend: 0.85,
      demandScore: 0.90,
    },
    {
      productName: 'Eco-Friendly Water Bottles',
      category: 'Home & Garden',
      reason: 'Environmental awareness driving demand, high profit margins',
      potentialRevenue: 12.99,
      priority: 'medium' as const,
      marketTrend: 0.73,
      demandScore: 0.68,
    },
    {
      productName: 'Premium Yoga Mat Collection',
      category: 'Sports',
      reason: 'Fitness trend continues, complementary to existing products',
      potentialRevenue: 29.99,
      priority: 'low' as const,
      marketTrend: 0.65,
      demandScore: 0.60,
    },
    {
      productName: 'Vitamin D3 Supplements',
      category: 'Pharmaceuticals',
      reason: 'Health awareness post-pandemic, seasonal demand increase',
      potentialRevenue: 14.99,
      priority: 'medium' as const,
      marketTrend: 0.71,
      demandScore: 0.75,
    },
    {
      productName: 'Cotton Bath Towel Set',
      category: 'Textiles',
      reason: 'Home improvement trend, essential household item with steady demand',
      potentialRevenue: 24.99,
      priority: 'low' as const,
      marketTrend: 0.58,
      demandScore: 0.62,
    },
    {
      productName: 'Instant Oatmeal Variety Pack',
      category: 'Food',
      reason: 'Quick breakfast trend, health-conscious consumers',
      potentialRevenue: 8.99,
      priority: 'medium' as const,
      marketTrend: 0.66,
      demandScore: 0.69,
    },
    {
      productName: 'Bluetooth Portable Speaker',
      category: 'Electronics',
      reason: 'Popular for outdoor activities and events, good margins',
      potentialRevenue: 39.99,
      priority: 'high' as const,
      marketTrend: 0.81,
      demandScore: 0.79,
    },
    {
      productName: 'Organic Coffee Beans',
      category: 'Food',
      reason: 'Premium coffee trend, high customer loyalty',
      potentialRevenue: 18.99,
      priority: 'medium' as const,
      marketTrend: 0.74,
      demandScore: 0.71,
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