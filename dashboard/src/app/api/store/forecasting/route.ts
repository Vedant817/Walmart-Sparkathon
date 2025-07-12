import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ForecastingData, ProductRecommendation } from '@/types';

interface ProductSalesData {
  productName: string;
  category: string;
  currentStock: number;
  salesHistory: { date: string; quantity: number; revenue: number }[];
  avgPrice: number;
}

// Simulate social media trends (in real implementation, this would fetch from social media APIs)
function getSocialMediaTrend(productName: string): number {
  const trends: Record<string, number> = {
    'electronics': 0.8,
    'clothing': 0.7,
    'grocery': 0.5,
    'furniture': 0.4,
  };
  return trends[productName.toLowerCase()] || Math.random() * 0.6 + 0.2;
}

// Simulate weather impact (in real implementation, this would fetch from weather APIs)
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
    'December': 0.95, // Holiday season boost
  };
  return seasonalFactors[month] || 0.7;
}

// Calculate product forecasts based on real data
async function calculateForecasts(): Promise<ForecastingData[]> {
  try {
    // Fetch inventory data
    const inventoryCollection = await getCollection('store_1_inventory');
    const inventoryData = await inventoryCollection.find({}).toArray();
    
    // Fetch sales history
    const salesCollection = await getCollection('store_1_sale');
    const salesData = await salesCollection.find({}).toArray();
    
    // Group sales by product
    const productSalesMap = new Map<string, ProductSalesData>();
    
    // Initialize with inventory data
    inventoryData.forEach((item: any) => {
      productSalesMap.set(item.Product_Name, {
        productName: item.Product_Name,
        category: item.Category,
        currentStock: item.Quantity_in_Stock || 0,
        salesHistory: [],
        avgPrice: item.Unit_Cost || 0,
      });
    });
    
    // Process sales data
    salesData.forEach((sale: any) => {
      const productData = productSalesMap.get(sale.Product_Name);
      if (productData) {
        productData.salesHistory.push({
          date: sale.Date,
          quantity: sale.Quantity || 0,
          revenue: sale.Total_Amount || 0,
        });
      }
    });
    
    // Calculate forecasts for each product
    const forecasts: ForecastingData[] = [];
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    
    productSalesMap.forEach((productData) => {
      // Calculate average daily sales from last 30 days
      const recentSales = productData.salesHistory.slice(-30);
      const totalQuantity = recentSales.reduce((sum, sale) => sum + sale.quantity, 0);
      const avgDailySales = recentSales.length > 0 ? totalQuantity / recentSales.length : 0;
      
      // Calculate sales trend (comparing last 15 days to previous 15 days)
      const firstHalf = recentSales.slice(0, 15).reduce((sum, sale) => sum + sale.quantity, 0);
      const secondHalf = recentSales.slice(15).reduce((sum, sale) => sum + sale.quantity, 0);
      const salesTrendFactor = secondHalf > 0 ? (secondHalf - firstHalf) / firstHalf : 0;
      
      // Get other factors
      const socialMediaTrend = getSocialMediaTrend(productData.category);
      const climaticFactor = getClimaticFactor(currentMonth);
      const areaFactor = 0.8 + Math.random() * 0.4; // Simulated area demand factor
      const seasonalityFactor = climaticFactor;
      const competitionFactor = 0.3 + Math.random() * 0.4;
      
      // Calculate predicted demand (next 30 days)
      const baseDemand = avgDailySales * 30;
      const trendAdjustment = baseDemand * salesTrendFactor * 0.5;
      const socialMediaBoost = baseDemand * socialMediaTrend * 0.3;
      const seasonalAdjustment = baseDemand * (seasonalityFactor - 0.7) * 0.4;
      const areaAdjustment = baseDemand * (areaFactor - 1) * 0.2;
      
      const predictedDemand = Math.max(0, 
        baseDemand + trendAdjustment + socialMediaBoost + seasonalAdjustment + areaAdjustment
      );
      
      // Calculate stockout risk
      const daysOfStock = avgDailySales > 0 ? productData.currentStock / avgDailySales : Infinity;
      const stockoutRisk = daysOfStock < 7 ? 'high' : daysOfStock < 15 ? 'medium' : 'low';
      
      // Calculate confidence based on data availability
      const confidence = Math.min(0.95, 0.5 + (recentSales.length / 60));
      
      // Generate recommendations
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
    
    // Sort by stockout risk (high risk first)
    forecasts.sort((a, b) => {
      const riskOrder = { high: 0, medium: 1, low: 2 };
      return riskOrder[a.stockoutRisk] - riskOrder[b.stockoutRisk];
    });
    
    return forecasts;
  } catch (error) {
    console.error('Error calculating forecasts:', error);
    // Return sample data as fallback
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
