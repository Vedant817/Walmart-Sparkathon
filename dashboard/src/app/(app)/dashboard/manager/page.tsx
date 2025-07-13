"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingCart, Users, Star, Truck, Building } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const stores = [
  {
    id: 1,
    name: 'Walmart Supercenter #123',
    location: 'New York, NY',
    manager: {
      name: 'Alice Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    financials: {
      revenue: 1250000,
      profit: 56250,
      expenses: 1193750,
    },
    inventory: {
      stockLevel: 85, // percentage
      topSellers: [
        { name: 'Organic Bananas', sales: 12000 },
        { name: 'Great Value Milk', sales: 10500 },
        { name: 'Fresh Chicken Breast', sales: 9800 },
      ],
    },
    suppliers: [
      { name: 'Fresh Farms Inc.', cost: 150000 },
      { name: 'General Goods Co.', cost: 200000 },
      { name: 'Produce Direct', cost: 120000 },
    ],
    customerSatisfaction: 4.5,
    employeeCount: 150,
    monthlySales: [
      { month: 'Jan', sales: 1180000 },
      { month: 'Feb', sales: 1220000 },
      { month: 'Mar', sales: 1150000 },
      { month: 'Apr', sales: 1280000 },
      { month: 'May', sales: 1250000 },
      { month: 'Jun', sales: 1320000 },
    ],
    categoryBreakdown: [
      { category: 'Electronics', value: 35, color: '#8884d8' },
      { category: 'Clothing', value: 25, color: '#82ca9d' },
      { category: 'Food & Beverages', value: 20, color: '#ffc658' },
      { category: 'Home & Garden', value: 20, color: '#ff7300' },
    ],
  },
  {
    id: 2,
    name: 'Walmart Supercenter #456',
    location: 'Los Angeles, CA',
    manager: {
      name: 'David Smith',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    financials: {
      revenue: 1500000,
      profit: 78000,
      expenses: 1422000,
    },
    inventory: {
      stockLevel: 92,
      topSellers: [
        { name: 'Avocado', sales: 15000 },
        { name: 'Sourdough Bread', sales: 11000 },
        { name: 'Craft Beer Selection', sales: 10200 },
      ],
    },
    suppliers: [
      { name: 'West Coast Veggies', cost: 180000 },
      { name: 'Quality Meats', cost: 220000 },
      { name: 'LA Beverages', cost: 130000 },
    ],
    customerSatisfaction: 4.8,
    employeeCount: 180,
    monthlySales: [
      { month: 'Jan', sales: 1420000 },
      { month: 'Feb', sales: 1480000 },
      { month: 'Mar', sales: 1510000 },
      { month: 'Apr', sales: 1460000 },
      { month: 'May', sales: 1500000 },
      { month: 'Jun', sales: 1550000 },
    ],
    categoryBreakdown: [
      { category: 'Electronics', value: 40, color: '#8884d8' },
      { category: 'Clothing', value: 30, color: '#82ca9d' },
      { category: 'Food & Beverages', value: 15, color: '#ffc658' },
      { category: 'Home & Garden', value: 15, color: '#ff7300' },
    ],
  },
  {
    id: 3,
    name: 'Walmart Neighborhood Market #789',
    location: 'Chicago, IL',
    manager: {
      name: 'Emily White',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    financials: {
      revenue: 950000,
      profit: 36100,
      expenses: 913900,
    },
    inventory: {
      stockLevel: 78,
      topSellers: [
        { name: 'Deep Dish Pizza', sales: 8000 },
        { name: 'Italian Beef', sales: 7500 },
        { name: 'Local Craft Soda', sales: 6000 },
      ],
    },
    suppliers: [
      { name: 'Midwest Produce', cost: 100000 },
      { name: 'Chicago Butchery', cost: 150000 },
      { name: 'Great Lakes Dairy', cost: 110000 },
    ],
    customerSatisfaction: 4.2,
    employeeCount: 95,
    monthlySales: [
      { month: 'Jan', sales: 890000 },
      { month: 'Feb', sales: 920000 },
      { month: 'Mar', sales: 940000 },
      { month: 'Apr', sales: 960000 },
      { month: 'May', sales: 950000 },
      { month: 'Jun', sales: 980000 },
    ],
    categoryBreakdown: [
      { category: 'Electronics', value: 30, color: '#8884d8' },
      { category: 'Clothing', value: 35, color: '#82ca9d' },
      { category: 'Food & Beverages', value: 20, color: '#ffc658' },
      { category: 'Home & Garden', value: 15, color: '#ff7300' },
    ],
  },
  {
    id: 4,
    name: 'Walmart Supercenter #101',
    location: 'Houston, TX',
    manager: {
      name: 'Michael Brown',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    financials: {
      revenue: 1100000,
      profit: 52800,
      expenses: 1047200,
    },
    inventory: {
      stockLevel: 88,
      topSellers: [
        { name: 'BBQ Brisket', sales: 14000 },
        { name: 'Cornbread Mix', sales: 9000 },
        { name: 'Sweet Iced Tea', sales: 8500 },
      ],
    },
    suppliers: [
      { name: 'Texas Beef Co.', cost: 160000 },
      { name: 'Southern Produce', cost: 190000 },
      { name: 'Lone Star Snacks', cost: 100000 },
    ],
    customerSatisfaction: 4.6,
    employeeCount: 160,
    monthlySales: [
      { month: 'Jan', sales: 1050000 },
      { month: 'Feb', sales: 1080000 },
      { month: 'Mar', sales: 1120000 },
      { month: 'Apr', sales: 1090000 },
      { month: 'May', sales: 1100000 },
      { month: 'Jun', sales: 1140000 },
    ],
    categoryBreakdown: [
      { category: 'Electronics', value: 32, color: '#8884d8' },
      { category: 'Clothing', value: 28, color: '#82ca9d' },
      { category: 'Food & Beverages', value: 25, color: '#ffc658' },
      { category: 'Home & Garden', value: 15, color: '#ff7300' },
    ],
  },
];

type Store = typeof stores[0];

export default function ManagerDashboard() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const totalRevenue = stores.reduce((acc, store) => acc + store.financials.revenue, 0);
  const totalProfit = stores.reduce((acc, store) => acc + store.financials.profit, 0);
  const totalEmployees = stores.reduce((acc, store) => acc + store.employeeCount, 0);
  const avgSatisfaction = (stores.reduce((acc, store) => acc + store.customerSatisfaction, 0) / stores.length).toFixed(1);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalProfit)}</div>
            <p className="text-xs text-muted-foreground">+3.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSatisfaction} / 5.0</div>
            <p className="text-xs text-muted-foreground">Slight increase from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">+12 new hires this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {stores.map((store) => (
          <Card key={store.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{store.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{store.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <img src={store.manager.avatar} alt={store.manager.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold">{store.manager.name}</p>
                    <p className="text-xs text-muted-foreground">Store Manager</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-semibold">Revenue</p>
                    <p>{formatCurrency(store.financials.revenue)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-semibold">Profit</p>
                    <p>{formatCurrency(store.financials.profit)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-semibold">Inventory Level</p>
                    <p>{store.inventory.stockLevel}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-semibold">Satisfaction</p>
                    <p>{store.customerSatisfaction} / 5.0</p>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <h4 className="font-semibold mb-2">Top Selling Products</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {store.inventory.topSellers.map((product, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{product.name}</span>
                      <span className="font-medium">{formatCurrency(product.sales)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Button onClick={() => setSelectedStore(store)} className="w-full">View More Details</Button>
            </div>
          </Card>
        ))}
      </div>

      {selectedStore && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
          onClick={() => setSelectedStore(null)}
        >
          <Card 
            className="w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedStore.name}</CardTitle>
                  <p className="text-md text-muted-foreground">{selectedStore.location}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedStore(null)}>
                  &times;
                </Button>
              </div>
            </CardHeader>
            <CardContent className="max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 border-b pb-2">Financial Overview</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Revenue:</span> <span className="font-medium">{formatCurrency(selectedStore.financials.revenue)}</span></div>
                    <div className="flex justify-between"><span>Expenses:</span> <span className="font-medium text-red-500">{formatCurrency(selectedStore.financials.expenses)}</span></div>
                    <div className="flex justify-between"><span>Profit:</span> <span className="font-medium text-green-500">{formatCurrency(selectedStore.financials.profit)}</span></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3 border-b pb-2">Operational Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Employees:</span> <span className="font-medium">{selectedStore.employeeCount}</span></div>
                    <div className="flex justify-between"><span>Customer Satisfaction:</span> <Badge variant={selectedStore.customerSatisfaction > 4.5 ? "default" : "secondary"}>{selectedStore.customerSatisfaction} / 5.0</Badge></div>
                    <div className="flex justify-between"><span>Inventory Level:</span> <span className="font-medium">{selectedStore.inventory.stockLevel}% Full</span></div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />

              <div>
                <h3 className="font-semibold text-lg mb-3">Overall KPIs/Performance</h3>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Average Delivery Time: 2.5 days</li>
                  <li>Return Rate: 1.2%</li>
                  <li>Customer Retention Rate: 85%</li>
                </ul>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Monthly Sales Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={selectedStore.monthlySales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Category Sales Breakdown</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie 
                        data={selectedStore.categoryBreakdown} 
                        cx="50%" 
                        cy="50%" 
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {selectedStore.categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-semibold text-lg mb-3">Alert Disruptions</h3>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Delivery Delays: 3 incidents</li>
                  <li>Inventory Shortages: 2 incidents</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Fleet Information</h3>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Supplier Fleet: 10 trucks available</li>
                  <li>Delivery Fleet: 8 trucks in operation</li>
                </ul>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-semibold text-lg mb-3"><Truck className="inline-block mr-2 h-5 w-5" />Suppliers</h3>
                <div className="space-y-3">
                  {selectedStore.suppliers.map((supplier, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Building className="h-6 w-6 text-muted-foreground" />
                        <div>
                          <p className="font-semibold">{supplier.name}</p>
                          <p className="text-xs text-muted-foreground">Primary Supplier</p>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{formatCurrency(supplier.cost)}</p>
                        <p className="text-xs text-muted-foreground text-right">Monthly Cost</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}