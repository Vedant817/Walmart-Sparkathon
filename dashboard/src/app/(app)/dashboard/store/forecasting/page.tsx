'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, Package, BarChart3, ShoppingCart, Info } from 'lucide-react';
import { ForecastingData, ProductRecommendation, ForecastingMetrics } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function ForecastingPage() {
  const [forecasts, setForecasts] = useState<ForecastingData[]>([]);
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ForecastingData | null>(null);

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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Product Demand Forecasting</h1>
        <p className="text-gray-600">AI-powered predictions to optimize inventory and scale your business</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Being analyzed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Products</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.highRiskProducts}</div>
            <p className="text-xs text-muted-foreground">Need immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.predictedRevenue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics.averageConfidence * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Prediction accuracy</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Product Forecasts</CardTitle>
            <CardDescription>Detailed predictions for each product</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {forecasts.map((forecast) => (
                <div 
                  key={forecast.productName} 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedProduct?.productName === forecast.productName ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedProduct(forecast)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{forecast.productName}</h3>
                      <p className="text-sm text-gray-600">{forecast.category}</p>
                    </div>
                    <Badge 
                      variant={forecast.stockoutRisk === 'high' ? 'destructive' : forecast.stockoutRisk === 'medium' ? 'secondary' : 'default'}
                    >
                      {forecast.stockoutRisk} risk
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Current Stock:</span> {forecast.currentStock}
                    </div>
                    <div>
                      <span className="text-gray-600">Predicted Demand:</span> {forecast.predictedDemand}
                    </div>
                    <div>
                      <span className="text-gray-600">Daily Sales:</span> {forecast.averageDailySales.toFixed(1)}
                    </div>
                    <div>
                      <span className="text-gray-600">Revenue:</span> ${forecast.predictedRevenue.toFixed(0)}
                    </div>
                  </div>
                  {forecast.stockoutRisk === 'high' && (
                    <div className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Order {forecast.suggestedOrderQuantity} units immediately
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Factor Analysis</CardTitle>
            <CardDescription>
              {selectedProduct ? selectedProduct.productName : 'Select a product'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedProduct ? (
              <div>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={factorsRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 1]} />
                    <Radar name="Factors" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  <h4 className="font-semibold text-sm">Recommendations:</h4>
                  {selectedProduct.recommendations.map((rec, idx) => (
                    <div key={idx} className="text-sm p-2 bg-blue-50 rounded flex items-start">
                      <Info className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Select a product to view details</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Demand vs Stock Analysis</CardTitle>
          <CardDescription>Visual comparison of current stock, predicted demand, and suggested orders</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={demandChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="currentStock" fill="#8884d8" name="Current Stock" />
              <Bar dataKey="predictedDemand" fill="#82ca9d" name="Predicted Demand" />
              <Bar dataKey="suggestedOrder" fill="#ffc658" name="Suggested Order" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>New Product Opportunities</CardTitle>
          <CardDescription>Recommended products to add for business growth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <div key={rec.productName} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{rec.productName}</h4>
                  <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'secondary' : 'default'}>
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{rec.category}</p>
                <p className="text-sm mb-2">{rec.reason}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Potential Revenue:</span>
                  <span className="font-semibold">${rec.potentialRevenue.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Market Trend:</span>
                  <span className="font-semibold">{(rec.marketTrend * 100).toFixed(0)}%</span>
                </div>
                <button className="mt-3 w-full text-sm bg-blue-600 text-white rounded px-3 py-1 hover:bg-blue-700">
                  <ShoppingCart className="w-4 h-4 inline mr-1" />
                  Add to Inventory
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}