/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { ProductRecommendation } from '@/types';

async function generateRecommendations(): Promise<ProductRecommendation[]> {
  const trendingProducts = [
    {
      productName: 'Wireless Earbuds Pro',
      category: 'Electronics',
      reason: 'High demand in electronics category, trending on social media',
      potentialRevenue: 79.99, // Realistic price for wireless earbuds
      priority: 'high' as const,
      marketTrend: 0.92,
      demandScore: 0.88,
    },
    {
      productName: 'Organic Green Tea Set',
      category: 'Food',
      reason: 'Health-conscious trend, growing market segment',
      potentialRevenue: 24.99, // Realistic price for tea set
      priority: 'medium' as const,
      marketTrend: 0.78,
      demandScore: 0.72,
    },
    {
      productName: 'Smart Home Security Camera',
      category: 'Electronics',
      reason: 'Rising demand for home security, competitive pricing available',
      potentialRevenue: 149.99, // Realistic price for security camera
      priority: 'high' as const,
      marketTrend: 0.85,
      demandScore: 0.90,
    },
    {
      productName: 'Eco-Friendly Water Bottles',
      category: 'Home & Garden',
      reason: 'Environmental awareness driving demand, high profit margins',
      potentialRevenue: 19.99, // Realistic price for water bottle
      priority: 'medium' as const,
      marketTrend: 0.73,
      demandScore: 0.68,
    },
    {
      productName: 'Premium Yoga Mat Collection',
      category: 'Sports',
      reason: 'Fitness trend continues, complementary to existing products',
      potentialRevenue: 49.99, // Realistic price for yoga mat
      priority: 'low' as const,
      marketTrend: 0.65,
      demandScore: 0.60,
    },
    {
      productName: 'Vitamin D3 Supplements',
      category: 'Pharmaceuticals',
      reason: 'Health awareness post-pandemic, seasonal demand increase',
      potentialRevenue: 16.99, // Realistic price for vitamins
      priority: 'medium' as const,
      marketTrend: 0.71,
      demandScore: 0.75,
    },
    {
      productName: 'Cotton Bath Towel Set',
      category: 'Textiles',
      reason: 'Home improvement trend, essential household item with steady demand',
      potentialRevenue: 34.99, // Realistic price for towel set
      priority: 'low' as const,
      marketTrend: 0.58,
      demandScore: 0.62,
    },
    {
      productName: 'Instant Oatmeal Variety Pack',
      category: 'Food',
      reason: 'Quick breakfast trend, health-conscious consumers',
      potentialRevenue: 12.99, // Realistic price for oatmeal pack
      priority: 'medium' as const,
      marketTrend: 0.66,
      demandScore: 0.69,
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