'use client';
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp,
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users,
  Calendar,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ActiveOrderProduct } from '@/types';

interface InventoryItem {
  _id: string;
  category: string;
  Product_Name: string;
  Quantity_in_stock: number;
  Unit_Cost: number;
  Total_inventory_value: number;
  reorder_point: number;
}

interface PastOrder {
  _id: string;
  Date: string;
  Time: string;
  Store_ID: string;
  Transaction_ID: string;
  Customer_ID: string;
  Customer_Type: string;
  Category: string;
  Product_Name: string;
  Quantity: number;
  Unit_Cost: number;
  Unit_Price: number;
  Discount_Rate: number;
  Discount_Amount: number;
  Subtotal: number;
  Tax_Amount: number;
  Total_Amount: number;
  Gross_Profit: number;
  Profit_Margin_Percent: number;
  Payment_Method: string;
  Day_of_Week: string;
  Month: string;
  Hour_of_Day: number;
  Transaction_Total: number;
  Items_Per_Transaction: number;
  status: 'fulfilled' | 'delivered';
}

interface ActiveOrder {
  _id: string;
  orderId: string;
  date: string;
  time: string;
  transaction_id: string;
  customer_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  sub_total: number;
  total_amount: number;
  status: 'pending' | 'packed' | 'out_for_delivery' | 'delivered';
  customer_info?: {
    name: string;
    email: string;
    phone: string;
    address: {
      addressLine1: string;
      addressLine2: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  products: ActiveOrderProduct[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const timeRanges = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '1y', label: 'Last Year' },
  { value: 'all', label: 'All Time' }
];

export default function InsightsPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');

  const fetchData = async () => {
    try {
      setLoading(true);

      const inventoryResponse = await fetch('/api/store/inventory');
      const inventoryData = await inventoryResponse.json();
      if (inventoryData.success) {
        setInventory(inventoryData.data);
      }

      const pastOrdersResponse = await fetch('/api/store/orders/past?limit=1000');
      const pastOrdersData = await pastOrdersResponse.json();
      if (pastOrdersData.success) {
        setPastOrders(pastOrdersData.orders);
      }

      const activeOrdersResponse = await fetch('/api/store/orders?limit=1000');
      const activeOrdersData = await activeOrdersResponse.json();
      if (activeOrdersData.success) {
        setActiveOrders(activeOrdersData.orders);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch insights data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateRandomOrderData = (timeRange: string): PastOrder[] => {
    const categories = ['Electronics', 'Clothing', 'Food & Beverages', 'Home & Garden', 'Books & Stationery', 'Sports'];
    const paymentMethods = ['Credit Card', 'UPI', 'Cash', 'Debit Card', 'Net Banking'];
    const customerTypes = ['Regular', 'Premium', 'VIP'];
    
    const now = new Date();
    const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365, 'all': 90 };
    const days = daysMap[timeRange as keyof typeof daysMap] || 30;
    
    const sampleData: PastOrder[] = [];
    const numberOfOrders = Math.floor(Math.random() * 20) + 10;
    
    for (let i = 0; i < numberOfOrders; i++) {
      const randomDaysAgo = Math.floor(Math.random() * days);
      const orderDate = new Date(now.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
      const category = categories[Math.floor(Math.random() * categories.length)];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const customerType = customerTypes[Math.floor(Math.random() * customerTypes.length)];
      
      const quantity = Math.floor(Math.random() * 5) + 1;
      const unitPrice = Math.floor(Math.random() * 2000) + 100;
      const unitCost = unitPrice * (0.6 + Math.random() * 0.2);
      const subtotal = quantity * unitPrice;
      const discountRate = Math.floor(Math.random() * 20);
      const discountAmount = (subtotal * discountRate) / 100;
      const afterDiscount = subtotal - discountAmount;
      const taxAmount = afterDiscount * 0.18;
      const totalAmount = afterDiscount + taxAmount;
      const grossProfit = totalAmount - (quantity * unitCost);
      
      sampleData.push({
        _id: `sample_${i}_${timeRange}`,
        Date: orderDate.toISOString().split('T')[0],
        Time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
        Store_ID: 'store-001',
        Transaction_ID: `TXN${Date.now()}${i}`,
        Customer_ID: `CUST${String(i + 1).padStart(3, '0')}`,
        Customer_Type: customerType,
        Category: category,
        Product_Name: `${category} Product ${i + 1}`,
        Quantity: quantity,
        Unit_Cost: Math.round(unitCost),
        Unit_Price: unitPrice,
        Discount_Rate: discountRate,
        Discount_Amount: Math.round(discountAmount),
        Subtotal: subtotal,
        Tax_Amount: Math.round(taxAmount),
        Total_Amount: Math.round(totalAmount),
        Gross_Profit: Math.round(grossProfit),
        Profit_Margin_Percent: totalAmount > 0 ? Math.round((grossProfit / totalAmount) * 100) : 0,
        Payment_Method: paymentMethod,
        Day_of_Week: orderDate.toLocaleDateString('en-US', { weekday: 'long' }),
        Month: orderDate.toLocaleDateString('en-US', { month: 'long' }),
        Hour_of_Day: parseInt(orderDate.toTimeString().split(':')[0]),
        Transaction_Total: Math.round(totalAmount),
        Items_Per_Transaction: quantity,
        status: Math.random() > 0.5 ? 'delivered' : 'fulfilled'
      });
    }
    
    return sampleData.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
  };

  const filteredPastOrders = useMemo(() => {
    let filtered = pastOrders;
    
    if (timeRange !== 'all') {
      const now = new Date();
      const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
      const days = daysMap[timeRange as keyof typeof daysMap] || 30;
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      
      filtered = pastOrders.filter(order => {
        const orderDate = new Date(order.Date);
        return orderDate >= cutoffDate;
      });
    }

    if (filtered.length === 0) {
      return generateRandomOrderData(timeRange);
    }

    return filtered;
  }, [pastOrders, timeRange]);

  const isShowingSampleData = useMemo(() => {
    if (timeRange === 'all') return pastOrders.length === 0;
    
    const now = new Date();
    const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
    const days = daysMap[timeRange as keyof typeof daysMap] || 30;
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    const actualFilteredData = pastOrders.filter(order => {
      const orderDate = new Date(order.Date);
      return orderDate >= cutoffDate;
    });
    
    return actualFilteredData.length === 0;
  }, [pastOrders, timeRange]);
  const metrics = useMemo(() => {
    const totalRevenue = filteredPastOrders.reduce((sum, order) => sum + order.Total_Amount, 0);
    const totalProfit = filteredPastOrders.reduce((sum, order) => sum + order.Gross_Profit, 0);
    const totalOrders = filteredPastOrders.length;
    const totalInventoryValue = inventory.reduce((sum, item) => sum + item.Total_inventory_value, 0);
    const lowStockItems = inventory.filter(item => item.Quantity_in_stock <= item.reorder_point).length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalProfit,
      totalOrders,
      totalInventoryValue,
      lowStockItems,
      avgOrderValue,
      profitMargin,
      activeOrdersCount: activeOrders.length
    };
  }, [filteredPastOrders, inventory, activeOrders]);

  const salesByCategory = useMemo(() => {
    const categoryData = filteredPastOrders.reduce((acc, order) => {
      const category = order.Category || 'Other';
      if (!acc[category]) {
        acc[category] = { category, revenue: 0, orders: 0, profit: 0 };
      }
      acc[category].revenue += order.Total_Amount;
      acc[category].orders += 1;
      acc[category].profit += order.Gross_Profit;
      return acc;
    }, {} as Record<string, { category: string; revenue: number; orders: number; profit: number }>);

    return Object.values(categoryData).sort((a, b) => b.revenue - a.revenue);
  }, [filteredPastOrders]);

  const dailySales = useMemo(() => {
    const dailyData = filteredPastOrders.reduce((acc, order) => {
      const date = order.Date;
      if (!acc[date]) {
        acc[date] = { date, revenue: 0, orders: 0, profit: 0 };
      }
      acc[date].revenue += order.Total_Amount;
      acc[date].orders += 1;
      acc[date].profit += order.Gross_Profit;
      return acc;
    }, {} as Record<string, { date: string; revenue: number; orders: number; profit: number }>);

    return Object.values(dailyData)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30);
  }, [filteredPastOrders]);

  const inventoryByCategory = useMemo(() => {
    const categoryData = inventory.reduce((acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) {
        acc[category] = { category, value: 0, quantity: 0, items: 0 };
      }
      acc[category].value += item.Total_inventory_value;
      acc[category].quantity += item.Quantity_in_stock;
      acc[category].items += 1;
      return acc;
    }, {} as Record<string, { category: string; value: number; quantity: number; items: number }>);

    return Object.values(categoryData);
  }, [inventory]);

  const paymentMethodData = useMemo(() => {
    const methodData = filteredPastOrders.reduce((acc, order) => {
      const method = order.Payment_Method || 'Unknown';
      if (!acc[method]) {
        acc[method] = { method, count: 0, revenue: 0 };
      }
      acc[method].count += 1;
      acc[method].revenue += order.Total_Amount;
      return acc;
    }, {} as Record<string, { method: string; count: number; revenue: number }>);

    const totalOrders = filteredPastOrders.length;
    const totalRevenue = filteredPastOrders.reduce((sum, order) => sum + order.Total_Amount, 0);

    return Object.values(methodData)
      .map(item => ({
        ...item,
        orderPercentage: totalOrders > 0 ? (item.count / totalOrders) * 100 : 0,
        revenuePercentage: totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0,
        avgOrderValue: item.count > 0 ? item.revenue / item.count : 0
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredPastOrders]);

  const paymentMethodColors = {
    'Credit Card': '#3B82F6',
    'UPI': '#10B981',
    'Cash': '#F59E0B',
    'Debit Card': '#8B5CF6',
    'Net Banking': '#EF4444',
    'Unknown': '#6B7280'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  if (loading) {
    return (
      <div className="p-6 pt-2 space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mr-3" />
          <span className="text-lg">Loading insights...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-2 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Insights</h1>
          <p className="text-gray-600 mt-1">Analytics and performance metrics for your store</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={fetchData} disabled={loading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {isShowingSampleData && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg hidden">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                Viewing Sample Data
              </h3>
              <div className="mt-1 text-sm text-amber-700">
                No data found for the selected time period. Displaying sample data for demonstration purposes.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From {formatNumber(metrics.totalOrders)} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalProfit)}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.profitMargin.toFixed(1)}% profit margin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalInventoryValue)}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.lowStockItems} items low stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.activeOrdersCount)}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {formatCurrency(metrics.avgOrderValue)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value, name) => [formatCurrency(Number(value)), name]} />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                <Bar dataKey="profit" fill="#82ca9d" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Daily Sales Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value, name) => [formatCurrency(Number(value)), name]} />
                <Legend />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" name="Revenue" />
                <Area type="monotone" dataKey="profit" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Profit" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Inventory Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={inventoryByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) =>
                    `${category} ${percent !== undefined ? (percent * 100).toFixed(0) : '0'}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {inventoryByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Value']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Payment Methods Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ method, revenuePercentage }) => 
                        revenuePercentage > 5 ? `${method} ${revenuePercentage.toFixed(0)}%` : ''
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={paymentMethodColors[entry.method as keyof typeof paymentMethodColors] || '#6B7280'} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        formatCurrency(Number(value)), 
                        'Revenue',
                        `${props.payload.count} orders (${props.payload.revenuePercentage.toFixed(1)}%)`
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Statistics */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-gray-700 mb-3">Payment Method Breakdown</h4>
                {paymentMethodData.map((method) => (
                  <div key={method.method} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ 
                          backgroundColor: paymentMethodColors[method.method as keyof typeof paymentMethodColors] || '#6B7280' 
                        }} 
                      />
                      <div>
                        <div className="font-medium text-sm">{method.method}</div>
                        <div className="text-xs text-gray-500">
                          {method.count} orders ({method.orderPercentage.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">{formatCurrency(method.revenue)}</div>
                      <div className="text-xs text-gray-500">
                        Avg: {formatCurrency(method.avgOrderValue)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {salesByCategory.slice(0, 5).map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="font-medium">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(category.revenue)}</div>
                    <div className="text-sm text-gray-500">{category.orders} orders</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inventory
                .filter(item => item.Quantity_in_stock <= item.reorder_point)
                .slice(0, 5)
                .map((item) => (
                  <div key={item._id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item.Product_Name}</div>
                      <div className="text-sm text-gray-500">{item.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-red-600">{item.Quantity_in_stock}</div>
                      <div className="text-sm text-gray-500">Min: {item.reorder_point}</div>
                    </div>
                  </div>
                ))}
              {metrics.lowStockItems === 0 && (
                <div className="text-center text-gray-500 py-4">
                  All items are well stocked!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Products</span>
                <span className="font-semibold">{formatNumber(inventory.length)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Categories</span>
                <span className="font-semibold">{inventoryByCategory.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Order Value</span>
                <span className="font-semibold">{formatCurrency(metrics.avgOrderValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Profit Margin</span>
                <span className="font-semibold">{metrics.profitMargin.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Orders Today</span>
                <span className="font-semibold">
                  {filteredPastOrders.filter(order => 
                    new Date(order.Date).toDateString() === new Date().toDateString()
                  ).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}