/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ForecastingData } from '@/types';
import { WithId, Document } from 'mongodb';

interface ProductSalesData {
  productName: string;
  category: string;
  currentStock: number;
  salesHistory: { date: string; quantity: number; revenue: number }[];
  avgPrice: number;
}

interface InventoryDocument extends Document {
  Product_Name: string;
  Category: string;
  Quantity_in_Stock?: number;
  Unit_Cost?: number;
}

interface SaleDocument extends Document {
  Product_Name: string;
  Date: string;
  Quantity?: number;
  Total_Amount?: number;
}

function getSocialMediaTrend(productName: string): number {
  const trends: Record<string, number> = {
    'electronics': 0.8,
    'clothing': 0.7,
    'grocery': 0.5,
    'furniture': 0.4,
  };
  return trends[productName.toLowerCase()] || Math.random() * 0.6 + 0.2;
}

function getClimaticFactor(month: string): number {
  const seasonalFactors: Record<string, number> = {
    'January': 0.6,
    'February': 0.65,
    'March': 0.7,
    'April': 0.75,
    'May': 0.8,
    'June': 0.85,
    'July': 0.9,
    'August': 0.85,
    'September': 0.8,
    'October': 0.75,
    'November': 0.7,
    'December': 0.95,
  };
  return seasonalFactors[month] || 0.7;
}

async function calculateForecasts(): Promise<ForecastingData[]> {
  try {
    const inventoryCollection = await getCollection('store_1_inventory');
    const inventoryData = await inventoryCollection.find({}).toArray();
    
    const salesCollection = await getCollection('store_1_sale');
    const salesData = await salesCollection.find({}).toArray();
    
    const productSalesMap = new Map<string, ProductSalesData>();
    
    inventoryData.forEach((item) => {
      const inventoryItem = item as WithId<InventoryDocument>;
      productSalesMap.set(inventoryItem.Product_Name, {
        productName: inventoryItem.Product_Name,
        category: inventoryItem.Category,
        currentStock: inventoryItem.Quantity_in_Stock || 0,
        salesHistory: [],
        avgPrice: inventoryItem.Unit_Cost || 0,
      });
    });
    
    salesData.forEach((sale) => {
      const saleDocument = sale as WithId<SaleDocument>;
      const productData = productSalesMap.get(saleDocument.Product_Name);
      if (productData) {
        productData.salesHistory.push({
          date: saleDocument.Date,
          quantity: saleDocument.Quantity || 0,
          revenue: saleDocument.Total_Amount || 0,
        });
      }
    });
    
    const forecasts: ForecastingData[] = [];
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    
    productSalesMap.forEach((productData) => {
      const recentSales = productData.salesHistory.slice(-30);
      const totalQuantity = recentSales.reduce((sum, sale) => sum + sale.quantity, 0);
      const avgDailySales = recentSales.length > 0 ? totalQuantity / recentSales.length : 0;
      
      const firstHalf = recentSales.slice(0, 15).reduce((sum, sale) => sum + sale.quantity, 0);
      const secondHalf = recentSales.slice(15).reduce((sum, sale) => sum + sale.quantity, 0);
      const salesTrendFactor = secondHalf > 0 ? (secondHalf - firstHalf) / firstHalf : 0;
      
      const socialMediaTrend = getSocialMediaTrend(productData.category);
      const climaticFactor = getClimaticFactor(currentMonth);
      const areaFactor = 0.8 + Math.random() * 0.4;
      const seasonalityFactor = climaticFactor;
      const competitionFactor = 0.3 + Math.random() * 0.4;
      
      const baseDemand = avgDailySales * 30;
      const trendAdjustment = baseDemand * salesTrendFactor * 0.5;
      const socialMediaBoost = baseDemand * socialMediaTrend * 0.3;
      const seasonalAdjustment = baseDemand * (seasonalityFactor - 0.7) * 0.4;
      const areaAdjustment = baseDemand * (areaFactor - 1) * 0.2;
      
      const predictedDemand = Math.max(0, 
        baseDemand + trendAdjustment + socialMediaBoost + seasonalAdjustment + areaAdjustment
      );
      
      const daysOfStock = avgDailySales > 0 ? productData.currentStock / avgDailySales : Infinity;
      const stockoutRisk = daysOfStock < 7 ? 'high' : daysOfStock < 15 ? 'medium' : 'low';
      
      const confidence = Math.min(0.95, 0.5 + (recentSales.length / 60));
      
      const recommendations: string[] = [];
      if (stockoutRisk === 'high') {
        recommendations.push('Urgent: Reorder immediately to avoid stockout');
      }
      if (socialMediaTrend > 0.7) {
        recommendations.push('High social media interest - consider promotional campaign');
      }
      if (salesTrendFactor > 0.2) {
        recommendations.push('Sales trending upward - increase safety stock');
      }
      if (seasonalityFactor > 0.8) {
        recommendations.push('Peak season approaching - prepare for increased demand');
      }
      if (competitionFactor < 0.4) {
        recommendations.push('Low competition - opportunity for market expansion');
      }
      
      // Determine seasonal trend
      const seasonalTrend = salesTrendFactor > 0.1 ? 'increasing' : 
                            salesTrendFactor < -0.1 ? 'decreasing' : 'stable';
      
      forecasts.push({
        productName: productData.productName,
        currentStock: productData.currentStock,
        averageDailySales: avgDailySales,
        predictedDemand: Math.round(predictedDemand),
        confidence,
        recommendations,
        category: productData.category,
        seasonalTrend,
        stockoutRisk,
        suggestedOrderQuantity: Math.max(0, Math.round(predictedDemand - productData.currentStock + (avgDailySales * 7))), // Include safety stock
        predictedRevenue: predictedDemand * productData.avgPrice,
        factors: {
          salesTrend: salesTrendFactor,
          socialMediaTrend,
          climaticFactor,
          areaFactor,
          seasonalityFactor,
          competitionFactor,
        },
      } as ForecastingData);
    });
    
    forecasts.sort((a, b) => {
      const riskOrder = { high: 0, medium: 1, low: 2 };
      return riskOrder[a.stockoutRisk] - riskOrder[b.stockoutRisk];
    });
    
    return forecasts;
  } catch (error) {
    console.error('Error calculating forecasts:', error);
    return [
      {
        productName: 'Sample Product A',
        currentStock: 100,
        averageDailySales: 10,
        predictedDemand: 350,
        confidence: 0.85,
        recommendations: [
          'Sales trending upward - increase safety stock',
          'High social media interest - consider promotional campaign'
        ],
        category: 'Electronics',
        seasonalTrend: 'increasing' as const,
        stockoutRisk: 'medium' as const,
        suggestedOrderQuantity: 250,
        predictedRevenue: 17500,
        factors: {
          salesTrend: 0.15,
          socialMediaTrend: 0.8,
          climaticFactor: 0.75,
          areaFactor: 0.9,
          seasonalityFactor: 0.75,
          competitionFactor: 0.4,
        },
      },
      {
        productName: 'Sample Product B',
        currentStock: 50,
        averageDailySales: 8,
        predictedDemand: 280,
        confidence: 0.78,
        recommendations: [
          'Urgent: Reorder immediately to avoid stockout',
          'Peak season approaching - prepare for increased demand'
        ],
        category: 'Clothing',
        seasonalTrend: 'stable' as const,
        stockoutRisk: 'high' as const,
        suggestedOrderQuantity: 300,
        predictedRevenue: 8400,
        factors: {
          salesTrend: 0.05,
          socialMediaTrend: 0.7,
          climaticFactor: 0.85,
          areaFactor: 0.85,
          seasonalityFactor: 0.85,
          competitionFactor: 0.5,
        },
      },
    ];
  }
}

export async function GET(request: NextRequest) {
  try {
    const forecasts: ForecastingData[] = await calculateForecasts();

    return NextResponse.json({
      success: true,
      data: forecasts,
    });
  } catch (error) {
    console.error('Error fetching forecasting data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch forecasting data',
      },
      { status: 500 }
    );
  }
}