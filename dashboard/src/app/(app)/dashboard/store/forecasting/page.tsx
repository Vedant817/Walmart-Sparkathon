'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, Package, BarChart3, ShoppingCart, Info, Star, Clock, DollarSign, Target, Activity, Bot, CheckCircle, Settings, Plus, Minus, Send } from 'lucide-react';
import { ForecastingData, ProductRecommendation, ForecastingMetrics } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Custom scrollbar styles
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

// Supplier mapping based on categories
const CATEGORY_SUPPLIERS = {
  'Food': 'FreshCorp Suppliers',
  'Electronics': 'TechWorld Distributors',
  'Pharmaceuticals': 'MediSupply Co.',
  'Textiles': 'FabricPro Suppliers',
  'Home & Garden': 'HomeBase Suppliers',
  'Sports': 'SportMax Distributors'
};

export default function ForecastingPage() {
  const [forecasts, setForecasts] = useState<ForecastingData[]>([]);
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ForecastingData | null>(null);
  
  // Smart Agent state
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [forecastResponse, recommendationResponse] = await Promise.all([
          fetch('/api/store/forecasting'),
          fetch('/api/store/recommendations')
        ]);
        
        const forecastData = await forecastResponse.json();
        const recommendationData = await recommendationResponse.json();

        if (forecastData.success) {
          setForecasts(forecastData.data);
          if (forecastData.data.length > 0) {
            setSelectedProduct(forecastData.data[0]);
          }
        }
        
        if (recommendationData.success) {
          setRecommendations(recommendationData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const metrics: ForecastingMetrics = {
    totalProducts: forecasts.length,
    highRiskProducts: forecasts.filter(f => f.stockoutRisk === 'high').length,
    predictedRevenue: forecasts.reduce((sum, f) => sum + f.predictedRevenue, 0),
    stockoutRisk: forecasts.filter(f => f.stockoutRisk !== 'low').length / Math.max(forecasts.length, 1),
    averageConfidence: forecasts.reduce((sum, f) => sum + f.confidence, 0) / Math.max(forecasts.length, 1),
    topGrowthProducts: forecasts
      .filter(f => f.seasonalTrend === 'increasing')
      .slice(0, 3)
      .map(f => f.productName),
    topRiskProducts: forecasts
      .filter(f => f.stockoutRisk === 'high')
      .slice(0, 3)
      .map(f => f.productName),
  };

  const demandChartData = forecasts.map(f => ({
    name: f.productName.substring(0, 20),
    currentStock: f.currentStock,
    predictedDemand: f.predictedDemand,
    suggestedOrder: f.suggestedOrderQuantity,
  }));

  const factorsRadarData = selectedProduct ? [
    {
      subject: 'Sales Trend',
      value: selectedProduct.factors.salesTrend,
      fullMark: 1,
    },
    {
      subject: 'Social Media',
      value: selectedProduct.factors.socialMediaTrend,
      fullMark: 1,
    },
    {
      subject: 'Climate',
      value: selectedProduct.factors.climaticFactor,
      fullMark: 1,
    },
    {
      subject: 'Area',
      value: selectedProduct.factors.areaFactor,
      fullMark: 1,
    },
    {
      subject: 'Seasonality',
      value: selectedProduct.factors.seasonalityFactor,
      fullMark: 1,
    },
    {
      subject: 'Competition',
      value: selectedProduct.factors.competitionFactor,
      fullMark: 1,
    },
  ] : [];

  // Function to toggle selection in Smart Agent
  const handleItemToggle = (productName: string) => {
    setSelectedItems(prev => {
      if (prev[productName]) {
        const { [productName]: removed, ...rest } = prev;
        return rest;
      } else {
        // AI-predicted quantity based on demand score and market trend
        const product = recommendations.find(r => r.productName === productName);
        const aiPredictedQty = product ? Math.max(1, Math.round((product.demandScore + product.marketTrend) * 50)) : 1;
        return { ...prev, [productName]: aiPredictedQty };
      }
    });
  };

  // Smart Agent functions
  const handleQuantityChange = (productName: string, change: number) => {
    setSelectedItems(prev => {
      const currentQty = prev[productName] || 0;
      const newQty = Math.max(0, currentQty + change);
      if (newQty === 0) {
        const { [productName]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productName]: newQty };
    });
  };

  const handleSmartOrder = async () => {
    setIsOrdering(true);
    
    // Group orders by category/supplier
    const ordersBySupplier: Record<string, { supplier: string, items: Array<{ product: ProductRecommendation, quantity: number }> }> = {};
    
    Object.entries(selectedItems).forEach(([productName, quantity]) => {
      const product = recommendations.find(r => r.productName === productName);
      if (product) {
        const supplier = CATEGORY_SUPPLIERS[product.category as keyof typeof CATEGORY_SUPPLIERS] || 'General Suppliers';
        if (!ordersBySupplier[supplier]) {
          ordersBySupplier[supplier] = { supplier, items: [] };
        }
        ordersBySupplier[supplier].items.push({ product, quantity });
      }
    });

    // Simulate API calls to different suppliers
    try {
      const orderPromises = Object.values(ordersBySupplier).map(async (order) => {
        // Simulate order creation
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        const orderData = {
          supplier: order.supplier,
          items: order.items,
          orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          status: 'placed',
          estimatedDelivery: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          totalValue: order.items.reduce((sum, item) => sum + (item.product.potentialRevenue * item.quantity), 0)
        };
        
        // In a real app, this would be an API call to create the order
        // await fetch('/api/orders/create', { method: 'POST', body: JSON.stringify(orderData) });
        
        return orderData;
      });
      
      await Promise.all(orderPromises);
      setOrderComplete(true);
      
      // Clear selections after successful order
      setTimeout(() => {
        setSelectedItems({});
        setShowAgentModal(false);
        setOrderComplete(false);
        setIsOrdering(false);
      }, 3000);
    } catch (error) {
      console.error('Order failed:', error);
      setIsOrdering(false);
    }
  };

  const totalSelectedItems = Object.keys(selectedItems).length;
  const totalOrderValue = Object.entries(selectedItems).reduce((sum, [productName, quantity]) => {
    const product = recommendations.find(r => r.productName === productName);
    return sum + (product ? product.potentialRevenue * quantity : 0);
  }, 0);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading forecasting data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-red-600 inline mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customScrollbarStyles }} />
      <div className="min-h-screen bg-gray-50">
        <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Demand Forecasting</h1>
              <p className="text-gray-600 mt-1">AI-powered predictions to optimize inventory and scale your business</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Total Products</CardTitle>
              <div className="p-2 bg-blue-50 rounded-full">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">{metrics.totalProducts}</div>
              <p className="text-sm text-gray-500">Being analyzed</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">High Risk Products</CardTitle>
              <div className="p-2 bg-red-50 rounded-full">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 mb-1">{metrics.highRiskProducts}</div>
              <p className="text-sm text-gray-500">Need immediate attention</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Predicted Revenue</CardTitle>
              <div className="p-2 bg-green-50 rounded-full">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-1">${metrics.predictedRevenue.toLocaleString()}</div>
              <p className="text-sm text-gray-500">Next 30 days</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Avg Confidence</CardTitle>
              <div className="p-2 bg-purple-50 rounded-full">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 mb-1">{(metrics.averageConfidence * 100).toFixed(1)}%</div>
              <p className="text-sm text-gray-500">Prediction accuracy</p>
            </CardContent>
          </Card>
        </div>

        {/* Product Forecasts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg h-fit">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Product Forecasts
                </CardTitle>
                <CardDescription className="text-gray-600">Click on any product to view detailed analysis</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] overflow-y-auto custom-scrollbar">
                  <div className="p-6 space-y-4">
                    {forecasts.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No forecast data available</p>
                        <p className="text-gray-400 text-sm mt-1">Please check back later</p>
                      </div>
                    ) : (
                      forecasts.map((forecast) => (
                        <div 
                          key={forecast.productName} 
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            selectedProduct?.productName === forecast.productName 
                              ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md' 
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedProduct(forecast)}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{forecast.productName}</h3>
                              <p className="text-sm text-gray-600 font-medium">{forecast.category}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2 ml-4">
                              <Badge 
                                className={`text-xs font-semibold px-2 py-1 whitespace-nowrap ${
                                  forecast.stockoutRisk === 'high' 
                                    ? 'bg-red-100 text-red-800 border-red-200' 
                                    : forecast.stockoutRisk === 'medium' 
                                    ? 'bg-yellow-100 text-yellow-800 border-yellow-200' 
                                    : 'bg-green-100 text-green-800 border-green-200'
                                }`}
                              >
                                {forecast.stockoutRisk.toUpperCase()} RISK
                              </Badge>
                              <div className="text-right">
                                <div className="text-xs font-semibold text-gray-900">
                                  {(forecast.confidence * 100).toFixed(0)}% Confidence
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="text-xs text-gray-600 font-medium mb-1">Current Stock</div>
                              <div className="text-base font-bold text-gray-900">{forecast.currentStock}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="text-xs text-gray-600 font-medium mb-1">Predicted Demand</div>
                              <div className="text-base font-bold text-blue-600">{forecast.predictedDemand}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="text-xs text-gray-600 font-medium mb-1">Daily Sales</div>
                              <div className="text-base font-bold text-gray-900">{forecast.averageDailySales.toFixed(1)}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="text-xs text-gray-600 font-medium mb-1">Revenue (30d)</div>
                              <div className="text-base font-bold text-green-600">${forecast.predictedRevenue.toLocaleString()}</div>
                            </div>
                          </div>
                          
                          {forecast.stockoutRisk === 'high' && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="text-sm text-red-700 font-semibold flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span>URGENT: Order {forecast.suggestedOrderQuantity} units immediately</span>
                              </div>
                            </div>
                          )}
                          
                          {forecast.seasonalTrend === 'increasing' && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="text-sm text-green-700 font-semibold flex items-center">
                                <TrendingUp className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span>Trending upward - Consider increasing inventory</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Factor Analysis
              </CardTitle>
              <CardDescription className="text-gray-600">
                {selectedProduct ? `Analyzing ${selectedProduct.productName}` : 'Select a product to view detailed factor analysis'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {selectedProduct ? (
                <div>
                  <div className="bg-white rounded-lg border border-gray-100 p-4 mb-6">
                    <ResponsiveContainer width="100%" height={220}>
                      <RadarChart data={factorsRadarData}>
                        <PolarGrid gridType="polygon" stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="subject" className="text-sm font-medium" />
                        <PolarRadiusAxis angle={90} domain={[0, 1]} tick={false} />
                        <Radar 
                          name="Impact Factors" 
                          dataKey="value" 
                          stroke="#6366f1" 
                          fill="#6366f1" 
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {factorsRadarData.map((factor, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-600 font-medium mb-1">{factor.subject}</div>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-gray-900">{(factor.value * 100).toFixed(0)}%</div>
                          <div className={`w-2 h-2 rounded-full ${
                            factor.value > 0.7 ? 'bg-green-500' : 
                            factor.value > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      AI Recommendations
                    </h4>
                    {selectedProduct.recommendations.map((rec, idx) => (
                      <div key={idx} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <div className="text-sm text-blue-800 font-medium">{rec}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Select a product to view detailed analysis</p>
                  <p className="text-gray-400 text-sm mt-1">Click on any product card to see its influencing factors</p>
                </div>
              )}
            </CardContent>
          </Card>
      </div>

        {/* Demand vs Stock Analysis */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Demand vs Stock Analysis
            </CardTitle>
            <CardDescription className="text-gray-600">
              Compare current inventory levels with predicted demand and recommended orders
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total Current Stock</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {demandChartData.reduce((sum, item) => sum + item.currentStock, 0).toLocaleString()}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Total Predicted Demand</p>
                    <p className="text-2xl font-bold text-green-900">
                      {demandChartData.reduce((sum, item) => sum + item.predictedDemand, 0).toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700">Total Suggested Orders</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {demandChartData.reduce((sum, item) => sum + item.suggestedOrder, 0).toLocaleString()}
                    </p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={demandChartData} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    fontSize={12}
                    stroke="#666"
                    tick={{ fill: '#666' }}
                  />
                  <YAxis 
                    fontSize={12}
                    stroke="#666"
                    tick={{ fill: '#666' }}
                    label={{ value: 'Quantity', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '14px'
                    }}
                    labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '20px',
                      fontSize: '14px'
                    }}
                  />
                  <Bar 
                    dataKey="currentStock" 
                    fill="#3b82f6" 
                    name="Current Stock" 
                    radius={[2, 2, 0, 0]}
                    stroke="#2563eb"
                    strokeWidth={1}
                  />
                  <Bar 
                    dataKey="predictedDemand" 
                    fill="#10b981" 
                    name="Predicted Demand" 
                    radius={[2, 2, 0, 0]}
                    stroke="#059669"
                    strokeWidth={1}
                  />
                  <Bar 
                    dataKey="suggestedOrder" 
                    fill="#f59e0b" 
                    name="Suggested Order" 
                    radius={[2, 2, 0, 0]}
                    stroke="#d97706"
                    strokeWidth={1}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Analysis Insights */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  Key Insights
                </h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Products with high predicted demand vs current stock need immediate attention</li>
                  <li>• Suggested orders help maintain optimal inventory levels</li>
                  <li>• Monitor seasonal trends to adjust forecasting accuracy</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  Action Items
                </h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Review products where demand exceeds current stock</li>
                  <li>• Consider bulk ordering for items with high suggested quantities</li>
                  <li>• Implement automated reorder points for critical items</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Star className="h-5 w-5 text-emerald-600" />
                New Product Opportunities
              </CardTitle>
              <CardDescription className="text-gray-600">
                AI-recommended products to expand your inventory and boost revenue
              </CardDescription>
            </div>
            <button
              onClick={() => setShowAgentModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Bot className="h-5 w-5" />
              Smart Agent
              {totalSelectedItems > 0 && (
                <Badge className="bg-white text-blue-600 ml-1">{totalSelectedItems}</Badge>
              )}
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <div key={rec.productName} className="group p-5 border-2 border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-lg transition-all duration-200 bg-white">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">{rec.productName}</h4>
                    <p className="text-sm text-gray-600 font-medium">{rec.category}</p>
                  </div>
                  <Badge 
                    className={`text-xs font-semibold px-2 py-1 ${
                      rec.priority === 'high' 
                        ? 'bg-red-100 text-red-800 border-red-200' 
                        : rec.priority === 'medium' 
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200' 
                        : 'bg-green-100 text-green-800 border-green-200'
                    }`}
                  >
                    {rec.priority.toUpperCase()}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">{rec.reason}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 font-medium">Potential Revenue:</span>
                    <span className="text-sm font-bold text-green-600">${rec.potentialRevenue.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 font-medium">Market Trend:</span>
                    <span className="text-sm font-bold text-blue-600">{(rec.marketTrend * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 font-medium">Demand Score:</span>
                    <span className="text-sm font-bold text-purple-600">{(rec.demandScore * 100).toFixed(0)}%</span>
                  </div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Use Smart Agent to select and order</p>
                  <div className="text-xs text-gray-500">AI Predicted: {Math.max(1, Math.round((rec.demandScore + rec.marketTrend) * 50))} units</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Agent Modal */}
      {showAgentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Smart Ordering Agent</h2>
                    <p className="text-blue-100 text-sm">Automated procurement across multiple suppliers</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAgentModal(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  disabled={isOrdering}
                >
                  <Plus className="h-5 w-5 rotate-45" />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {orderComplete ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Orders Placed Successfully!</h3>
                  <p className="text-gray-600 mb-4">Your orders have been automatically distributed to the appropriate suppliers.</p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800 font-medium">You can track your orders in the Supplier Shipment page.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Select Products for Order</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {recommendations.map((rec) => {
                        const aiPredictedQty = Math.max(1, Math.round((rec.demandScore + rec.marketTrend) * 50));
                        const supplier = CATEGORY_SUPPLIERS[rec.category as keyof typeof CATEGORY_SUPPLIERS] || 'General Suppliers';
                        const isSelected = !!selectedItems[rec.productName];
                        
                        return (
                          <div key={rec.productName} className={`p-4 border rounded-lg transition-all duration-200 ${
                            isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleItemToggle(rec.productName)}
                                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-semibold text-gray-900">{rec.productName}</h4>
                                    <p className="text-sm text-gray-600">{rec.category} • {supplier}</p>
                                  </div>
                                  <Badge className={`text-xs ${
                                    rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {rec.priority.toUpperCase()}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                                  <div className="text-center p-2 bg-gray-50 rounded">
                                    <div className="text-gray-600">AI Predicted</div>
                                    <div className="font-bold text-blue-600">{aiPredictedQty} units</div>
                                  </div>
                                  <div className="text-center p-2 bg-gray-50 rounded">
                                    <div className="text-gray-600">Revenue</div>
                                    <div className="font-bold text-green-600">${rec.potentialRevenue.toFixed(0)}</div>
                                  </div>
                                  <div className="text-center p-2 bg-gray-50 rounded">
                                    <div className="text-gray-600">Trend</div>
                                    <div className="font-bold text-purple-600">{(rec.marketTrend * 100).toFixed(0)}%</div>
                                  </div>
                                </div>
                                
                                {isSelected && (
                                  <div className="flex items-center justify-between p-2 bg-blue-100 border border-blue-200 rounded mt-2">
                                    <span className="text-sm font-medium text-blue-800">Quantity:</span>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleQuantityChange(rec.productName, -1)}
                                        className="w-6 h-6 flex items-center justify-center bg-blue-200 hover:bg-blue-300 text-blue-800 rounded-full text-xs"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </button>
                                      <input
                                        type="number"
                                        value={selectedItems[rec.productName]}
                                        onChange={(e) => {
                                          const newQty = Math.max(0, parseInt(e.target.value) || 0);
                                          if (newQty === 0) {
                                            handleItemToggle(rec.productName);
                                          } else {
                                            setSelectedItems(prev => ({...prev, [rec.productName]: newQty}));
                                          }
                                        }}
                                        className="w-16 text-center text-sm font-bold text-blue-900 bg-white border border-blue-300 rounded px-2 py-1"
                                        min="1"
                                      />
                                      <button
                                        onClick={() => handleQuantityChange(rec.productName, 1)}
                                        className="w-6 h-6 flex items-center justify-center bg-blue-200 hover:bg-blue-300 text-blue-800 rounded-full text-xs"
                                      >
                                        <Plus className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {Object.keys(selectedItems).length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-blue-900">Total Order Value:</span>
                        <span className="text-xl font-bold text-blue-900">${totalOrderValue.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-blue-700">Selected Items:</span>
                        <span className="font-medium text-blue-900">{Object.keys(selectedItems).length}</span>
                      </div>
                      <p className="text-sm text-blue-700 mt-2">
                        Orders will be distributed to {new Set(Object.keys(selectedItems).map(productName => {
                          const product = recommendations.find(r => r.productName === productName);
                          return product ? CATEGORY_SUPPLIERS[product.category as keyof typeof CATEGORY_SUPPLIERS] || 'General Suppliers' : 'Unknown';
                        })).size} different suppliers.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {!orderComplete && Object.keys(selectedItems).length > 0 && (
              <div className="border-t bg-gray-50 p-6">
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedItems({})}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                    disabled={isOrdering}
                  >
                    Clear All
                  </button>
                  <button
                    onClick={handleSmartOrder}
                    disabled={isOrdering}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isOrdering ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing Orders...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Place Orders
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
        </div>
      </div>
    </>
  )
}