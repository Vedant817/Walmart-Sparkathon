'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, RefreshCw, Package, MapPin, Truck, CheckCircle, Drone, Bot, Navigation, Phone, Eye, ChevronLeft, ChevronRight, X, AlertTriangle, Route, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DeliveryOrder {
  _id: string;
  orderId: string;
  date: string;
  time: string;
  customer_info: {
    name: string;
    email: string;
    phone: string;
    address: {
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  products: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total_amount: number;
  status: 'out_for_delivery' | 'delivered';
  vehicleAssignment: {
    vehicleName: string;
    vehicleType: 'drone' | 'robot' | 'vehicle';
    assignedAt: string;
    estimatedDeliveryTime?: string;
    status: 'in_transit' | 'delivered';
    currentLocation?: string;
    estimatedDistance?: number;
  };
  trackingInfo: {
    timestamp: string;
    status: string;
    location: string;
    description: string;
  }[];
  routeInfo: {
    distance: number;
    estimatedTime: number;
    routeType: 'normal' | 'alternate';
    issueReason?: string;
    waypoints: { lat: number; lng: number; name: string }[];
  };
}

const statusIcons = {
  out_for_delivery: <Truck className="w-4 h-4" />,
  delivered: <CheckCircle className="w-4 h-4" />
};

const statusColors = {
  out_for_delivery: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200'
};

const getVehicleIcon = (type: string) => {
  switch (type) {
    case 'drone': return <Drone className="w-4 h-4" />;
    case 'robot': return <Bot className="w-4 h-4" />;
    case 'vehicle': return <Truck className="w-4 h-4" />;
    default: return <Package className="w-4 h-4" />;
  }
};

const nearbyAddresses = [
  { area: 'Commercial Street', zipCode: '560001', lat: 12.9843, lng: 77.6088 },
  { area: 'Brigade Road', zipCode: '560025', lat: 12.9735, lng: 77.6069 },
  { area: 'Church Street', zipCode: '560001', lat: 12.9786, lng: 77.5993 },
  { area: 'Residency Road', zipCode: '560025', lat: 12.9698, lng: 77.5932 },
  { area: 'Richmond Road', zipCode: '560025', lat: 12.9589, lng: 77.5970 },
  { area: 'Cunningham Road', zipCode: '560052', lat: 12.9911, lng: 77.5855 },
  { area: 'Lavelle Road', zipCode: '560001', lat: 12.9634, lng: 77.5855 },
  { area: 'UB City Mall Area', zipCode: '560001', lat: 12.9719, lng: 77.5936 },
  { area: 'Cubbon Park Area', zipCode: '560001', lat: 12.9762, lng: 77.5905 },
  { area: 'Trinity Circle', zipCode: '560025', lat: 12.9743, lng: 77.6028 }
];

const generateRandomDeliveryOrder = (id: number): DeliveryOrder => {
  const customerNames = [
    'Rajesh Kumar', 'Priya Sharma', 'Ankit Patel', 'Meera Nair', 'Suresh Reddy',
    'Kavya Singh', 'Amit Gupta', 'Deepa Rao', 'Vikram Joshi', 'Sneha Das'
  ];
  
  const products = [
    { name: 'Electronics - Bluetooth Headphones', price: 29.99, category: 'Electronics' },
    { name: 'Food - Organic Quinoa', price: 5.49, category: 'Food' },
    { name: 'Textiles - Cotton T-Shirt', price: 9.99, category: 'Textiles' },
    { name: 'Pharmaceuticals - Vitamin D3', price: 3.99, category: 'Pharmaceuticals' },
    { name: 'Electronics - Wireless Mouse', price: 14.99, category: 'Electronics' },
    { name: 'Food - Greek Yogurt', price: 2.29, category: 'Food' },
    { name: 'Textiles - Denim Jeans', price: 18.99, category: 'Textiles' },
    { name: 'Electronics - Phone Charger', price: 7.99, category: 'Electronics' }
  ];

  const vehicles = [
    { name: 'SkyDelivery Alpha', type: 'drone' as const },
    { name: 'RoboCart Beta', type: 'robot' as const },
    { name: 'Express Van 01', type: 'vehicle' as const },
    { name: 'AirDrop Gamma', type: 'drone' as const },
    { name: 'AutoBot Delta', type: 'robot' as const }
  ];

  const statuses: ('out_for_delivery' | 'delivered')[] = ['out_for_delivery', 'delivered'];
  const orderStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  const selectedAddress = nearbyAddresses[Math.floor(Math.random() * nearbyAddresses.length)];
  const selectedCustomer = customerNames[Math.floor(Math.random() * customerNames.length)];
  const selectedVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
  
  const routeIssues = [
    { reason: 'Heavy traffic on main route', probability: 0.3 },
    { reason: 'Road construction on direct path', probability: 0.2 },
    { reason: 'Accident blocking primary route', probability: 0.15 },
    { reason: 'Weather conditions affecting visibility', probability: 0.1 }
  ];
  
  const hasRouteIssue = Math.random() < 0.4;
  const selectedIssue = hasRouteIssue ? routeIssues[Math.floor(Math.random() * routeIssues.length)] : null;
  
  const storeLocation = { lat: 12.9716, lng: 77.5946, name: 'MG Road Store' };
  
  const generateWaypoints = (start: any, end: any, isAlternate: boolean) => {
    const waypoints = [start];
    
    if (isAlternate) {
      const midPoint1 = {
        lat: start.lat + (end.lat - start.lat) * 0.3 + (Math.random() - 0.5) * 0.01,
        lng: start.lng + (end.lng - start.lng) * 0.3 + (Math.random() - 0.5) * 0.01,
        name: 'Via Alternate Route'
      };
      const midPoint2 = {
        lat: start.lat + (end.lat - start.lat) * 0.7 + (Math.random() - 0.5) * 0.01,
        lng: start.lng + (end.lng - start.lng) * 0.7 + (Math.random() - 0.5) * 0.01,
        name: 'Bypass Point'
      };
      waypoints.push(midPoint1, midPoint2);
    } else {
      const midPoint = {
        lat: start.lat + (end.lat - start.lat) * 0.5,
        lng: start.lng + (end.lng - start.lng) * 0.5,
        name: 'Midway Point'
      };
      waypoints.push(midPoint);
    }
    
    waypoints.push({ lat: end.lat, lng: end.lng, name: end.area });
    return waypoints;
  };
  
  const routeType = selectedIssue ? 'alternate' : 'normal';
  const baseDistance = Math.sqrt(
    Math.pow(selectedAddress.lat - storeLocation.lat, 2) + 
    Math.pow(selectedAddress.lng - storeLocation.lng, 2)
  ) * 111; // Rough conversion to km
  
  const routeInfo = {
    distance: routeType === 'alternate' ? baseDistance * 1.3 : baseDistance,
    estimatedTime: routeType === 'alternate' ? baseDistance * 8 : baseDistance * 6, // minutes
    routeType,
    issueReason: selectedIssue?.reason,
    waypoints: generateWaypoints(storeLocation, selectedAddress, routeType === 'alternate')
  };
  
  const orderProducts = [];
  const productCount = Math.floor(Math.random() * 3) + 1;
  let totalAmount = 0;
  
  for (let i = 0; i < productCount; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    orderProducts.push({
      productId: `PROD_${id}_${i}`,
      name: product.name,
      quantity,
      price: product.price
    });
    totalAmount += product.price * quantity;
  }

  const orderDate = new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000);
  const assignedTime = new Date(orderDate.getTime() + Math.floor(Math.random() * 120) * 60 * 1000);
  
  const trackingInfo = [
    {
      timestamp: orderDate.toISOString(),
      status: 'Order Packed',
      location: 'MG Road Store',
      description: 'Order has been packed and ready for dispatch'
    },
    {
      timestamp: assignedTime.toISOString(),
      status: 'Out for Delivery',
      location: 'MG Road Store',
      description: `Assigned to ${selectedVehicle.name} for delivery`
    }
  ];

  if (orderStatus === 'delivered') {
    const deliveredTime = new Date(assignedTime.getTime() + Math.floor(Math.random() * 180) * 60 * 1000);
    trackingInfo.push({
      timestamp: deliveredTime.toISOString(),
      status: 'Delivered',
      location: selectedAddress.area,
      description: 'Package delivered successfully'
    });
  }

  return {
    _id: `ORDER_${id}`,
    orderId: `WM${Date.now().toString().slice(-6)}${id.toString().padStart(3, '0')}`,
    date: orderDate.toISOString().split('T')[0],
    time: orderDate.toTimeString().slice(0, 8),
    customer_info: {
      name: selectedCustomer,
      email: selectedCustomer.toLowerCase().replace(' ', '.') + '@email.com',
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      address: {
        addressLine1: `${Math.floor(Math.random() * 200) + 1}, ${selectedAddress.area}`,
        addressLine2: Math.random() > 0.5 ? `Near ${selectedAddress.area} Metro` : '',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: selectedAddress.zipCode,
        country: 'India'
      }
    },
    products: orderProducts,
    total_amount: totalAmount,
    status: orderStatus,
    vehicleAssignment: {
      vehicleName: selectedVehicle.name,
      vehicleType: selectedVehicle.type,
      assignedAt: assignedTime.toISOString(),
      estimatedDeliveryTime: orderStatus === 'out_for_delivery' 
        ? new Date(assignedTime.getTime() + Math.floor(Math.random() * 120) * 60 * 1000).toISOString()
        : undefined,
      status: orderStatus === 'delivered' ? 'delivered' : 'in_transit',
      currentLocation: orderStatus === 'out_for_delivery' 
        ? `En route to ${selectedAddress.area}` 
        : selectedAddress.area,
      estimatedDistance: Math.floor(Math.random() * 15) + 2 // 2-16 km from MG Road
    },
    trackingInfo,
    routeInfo
  };
};

function RouteMapComponent({ routeInfo, order }: { routeInfo: any; order: DeliveryOrder }) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  
  const calculateBounds = () => {
    const lats = routeInfo.waypoints.map((wp: any) => wp.lat);
    const lngs = routeInfo.waypoints.map((wp: any) => wp.lng);
    return {
      minLat: Math.min(...lats) - 0.002,
      maxLat: Math.max(...lats) + 0.002,
      minLng: Math.min(...lngs) - 0.002,
      maxLng: Math.max(...lngs) + 0.002
    };
  };
  
  const bounds = calculateBounds();
  const centerLat = (bounds.minLat + bounds.maxLat) / 2;
  const centerLng = (bounds.minLng + bounds.maxLng) / 2;
  
  return (
    <div className="p-4 bg-slate-50 rounded-lg">
      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
        <Route className="w-5 h-5 text-slate-600" />
        Delivery Route Optimization
      </h3>
      
      {routeInfo.routeType === 'alternate' && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="font-medium text-yellow-800">Alternative Route Selected</span>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            <strong>Reason:</strong> {routeInfo.issueReason}
          </p>
        </div>
      )}
      
      {routeInfo.routeType === 'normal' && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-800">Optimal Route Active</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Using the fastest and most efficient path to destination.
          </p>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="w-full h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-gray-200 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(45deg, #f0f9ff 25%, transparent 25%), linear-gradient(-45deg, #f0f9ff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f9ff 75%), linear-gradient(-45deg, transparent 75%, #f0f9ff 75%)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 250">
          <path
            d={routeInfo.routeType === 'alternate' 
              ? "M 50 200 Q 120 150 180 180 Q 250 120 350 50" 
              : "M 50 200 L 180 140 L 350 50"
            }
            stroke={routeInfo.routeType === 'alternate' ? '#f59e0b' : '#10b981'}
            strokeWidth="3"
            fill="none"
            strokeDasharray={routeInfo.routeType === 'alternate' ? '8,4' : 'none'}
          />
          
          <circle cx="50" cy="200" r="8" fill="#3b82f6" stroke="white" strokeWidth="2" />
          <text x="50" y="220" textAnchor="middle" className="text-xs" fill="#374151">Store</text>
          
          <circle cx="350" cy="50" r="8" fill="#ef4444" stroke="white" strokeWidth="2" />
          <text x="350" y="40" textAnchor="middle" className="text-xs" fill="#374151">Destination</text>
          
          <g>
            {order.status === 'out_for_delivery' && (
              <>
                <circle 
                  cx={routeInfo.routeType === 'alternate' ? '180' : '150'} 
                  cy={routeInfo.routeType === 'alternate' ? '180' : '160'} 
                  r="6" 
                  fill="#8b5cf6" 
                  stroke="white" 
                  strokeWidth="2"
                >
                  <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
                </circle>
                <text 
                  x={routeInfo.routeType === 'alternate' ? '180' : '150'} 
                  y={routeInfo.routeType === 'alternate' ? '200' : '180'} 
                  textAnchor="middle" 
                  className="text-xs" 
                  fill="#374151"
                >
                  {order.vehicleAssignment.vehicleType === 'drone' ? '🚁' : order.vehicleAssignment.vehicleType === 'robot' ? '🤖' : '🚐'}
                </text>
              </>
            )}
          </g>
          
          {routeInfo.routeType === 'alternate' && (
            <>
              <circle cx="120" cy="160" r="4" fill="#ef4444" />
              <text x="120" y="150" textAnchor="middle" className="text-xs" fill="#dc2626">⚠️</text>
            </>
          )}
        </svg>
        
        <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow-sm text-xs">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Store</span>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Destination</span>
          </div>
          {order.status === 'out_for_delivery' && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Vehicle</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <p><strong>Distance:</strong> {routeInfo.distance.toFixed(1)} km</p>
          <p><strong>Est. Time:</strong> {Math.round(routeInfo.estimatedTime)} mins</p>
        </div>
        <div className="space-y-2">
          <p><strong>Route Type:</strong> 
            <Badge className={`ml-2 ${routeInfo.routeType === 'alternate' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
              {routeInfo.routeType === 'alternate' ? 'Alternative' : 'Optimal'}
            </Badge>
          </p>
          <p><strong>Waypoints:</strong> {routeInfo.waypoints.length}</p>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Route Waypoints:</h4>
        <div className="space-y-1 text-sm">
          {routeInfo.waypoints.map((waypoint: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                index === 0 ? 'bg-blue-500' : 
                index === routeInfo.waypoints.length - 1 ? 'bg-red-500' : 
                'bg-gray-400'
              }`}></div>
              <span className="text-gray-700">{waypoint.name}</span>
              {index === Math.floor(routeInfo.waypoints.length / 2) && order.status === 'out_for_delivery' && (
                <Badge variant="outline" className="text-xs">Current</Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrderDetailsModal({ order, onClose }: { order: DeliveryOrder; onClose: () => void }) {
  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg border border-2 border-gray-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Delivery Tracking Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className='cursor-pointer hover:bg-red-500 hover:text-white'>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Order Information
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>Order ID:</strong> {order.orderId}</p>
                <p><strong>Date:</strong> {new Date(order.date + 'T' + order.time).toLocaleString('en-US')}</p>
                <p><strong>Status:</strong> 
                  <Badge className={`ml-2 ${statusColors[order.status]}`}>
                    {statusIcons[order.status]}
                    {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </p>
                <p><strong>Total Amount:</strong> ${order.total_amount.toFixed(2)}</p>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" />
                Customer Information
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {order.customer_info.name}</p>
                <p><strong>Email:</strong> {order.customer_info.email}</p>
                <p><strong>Phone:</strong> {order.customer_info.phone}</p>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                Delivery Address
              </h3>
              <div className="text-sm">
                <p>{order.customer_info.address.addressLine1}</p>
                {order.customer_info.address.addressLine2 && <p>{order.customer_info.address.addressLine2}</p>}
                <p>{order.customer_info.address.city}, {order.customer_info.address.state} {order.customer_info.address.zipCode}</p>
                <p>{order.customer_info.address.country}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                {getVehicleIcon(order.vehicleAssignment.vehicleType)}
                <span className="text-purple-600">Vehicle Assignment</span>
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>Vehicle:</strong> {order.vehicleAssignment.vehicleName}</p>
                <p><strong>Type:</strong> {order.vehicleAssignment.vehicleType.charAt(0).toUpperCase() + order.vehicleAssignment.vehicleType.slice(1)}</p>
                <p><strong>Current Location:</strong> {order.vehicleAssignment.currentLocation}</p>
                <p><strong>Distance:</strong> ~{order.vehicleAssignment.estimatedDistance} km from store</p>
                <p><strong>Assigned At:</strong> {new Date(order.vehicleAssignment.assignedAt).toLocaleString('en-US')}</p>
                {order.vehicleAssignment.estimatedDeliveryTime && (
                  <p><strong>Est. Delivery:</strong> {new Date(order.vehicleAssignment.estimatedDeliveryTime).toLocaleString('en-US')}</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-gray-600" />
                Tracking Timeline
              </h3>
              <div className="space-y-3">
                {order.trackingInfo.map((track, index) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-3 pb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        index === order.trackingInfo.length - 1 ? 'bg-blue-600' : 'bg-blue-300'
                      }`}></div>
                      <p className="font-medium text-sm">{track.status}</p>
                    </div>
                    <p className="text-xs text-gray-600 ml-5">{track.location}</p>
                    <p className="text-xs text-gray-500 ml-5">{track.description}</p>
                    <p className="text-xs text-gray-400 ml-5">{new Date(track.timestamp).toLocaleString('en-US')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <RouteMapComponent routeInfo={order.routeInfo} order={order} />
        </div>
        
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-3">Order Items</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.products.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>${(product.price * product.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 text-right">
            <p className="text-xl font-bold">Total: ${order.total_amount.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export default function DeliveryTrackingPage() {
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const generateDeliveryOrders = () => {
    setLoading(true);
    setTimeout(() => {
      const orders = Array.from({ length: 25 }, (_, i) => generateRandomDeliveryOrder(i + 1));
      setDeliveryOrders(orders);
      setLoading(false);
      toast.success('Delivery orders refreshed successfully');
    }, 1000);
  };

  useEffect(() => {
    generateDeliveryOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return deliveryOrders.filter(order => {
      const matchesSearch = searchTerm === '' || 
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_info.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_info.address.addressLine1.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.vehicleAssignment.vehicleName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === '' || statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [deliveryOrders, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const formatDate = (date: string, time: string) => {
    const dateTime = new Date(`${date}T${time}`);
    return dateTime.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 py-2 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Delivery Tracking</h1>
          <p className="text-gray-600 mt-1">Track and monitor ongoing deliveries from MG Road Store</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateDeliveryOrders} disabled={loading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by order ID, customer name, address, or vehicle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Active Deliveries ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              Loading deliveries...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No delivery orders found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Delivery Address</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((order) => (
                    <TableRow key={order._id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell className="font-medium">
                        #{order.orderId.slice(-8)}
                      </TableCell>
                      <TableCell>
                        {formatDate(order.date, order.time)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer_info.name}</div>
                          <div className="text-sm text-gray-500">{order.customer_info.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer_info.address.addressLine1}</div>
                          <div className="text-sm text-gray-500">
                            {order.customer_info.address.city}, {order.customer_info.address.zipCode}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getVehicleIcon(order.vehicleAssignment.vehicleType)}
                          <div>
                            <div className="font-medium">{order.vehicleAssignment.vehicleName}</div>
                            <div className="text-sm text-gray-500 capitalize">{order.vehicleAssignment.vehicleType}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[order.status]} gap-1`}>
                          {statusIcons[order.status]}
                          {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(order.total_amount)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          className="gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Track
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredOrders.length > 0 && (
                <div className="flex justify-between items-center mt-4">
                  <Button onClick={handlePrevPage} disabled={currentPage === 1} className="gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                  <Button onClick={handleNextPage} disabled={currentPage === totalPages} className="gap-2">
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
}