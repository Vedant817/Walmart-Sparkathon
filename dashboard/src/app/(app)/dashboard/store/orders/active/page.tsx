'use client';
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, RefreshCw, Package, Clock, Truck, CheckCircle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { ActiveOrder } from '@/types';

const statusIcons = {
  pending: <Clock className="w-4 h-4" />,
  packed: <Package className="w-4 h-4" />,
  out_for_delivery: <Truck className="w-4 h-4" />,
  delivered: <CheckCircle className="w-4 h-4" />
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  packed: 'bg-blue-100 text-blue-800 border-blue-200',
  out_for_delivery: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200'
};

function OrderDetailsModal({ order, onClose }: { order: ActiveOrder; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className='cursor-pointer hover:bg-red-500 hover:text-white'>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Customer Information</h3>
            <p><strong>Name:</strong> {order.customer_info?.name}</p>
            <p><strong>Email:</strong> {order.customer_info?.email}</p>
            <p><strong>Phone:</strong> {order.customer_info?.phone}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Shipping Address</h3>
            <p>{order.customer_info?.address.addressLine1}</p>
            {order.customer_info?.address.addressLine2 && <p>{order.customer_info?.address.addressLine2}</p>}
            <p>{order.customer_info?.address.city}, {order.customer_info?.address.state} {order.customer_info?.address.zipCode}</p>
            <p>{order.customer_info?.address.country}</p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Products</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.products.map(p => (
                <TableRow key={p.productId}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.quantity}</TableCell>
                  <TableCell>{formatCurrency(p.price)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-6 text-right">
          <p className="text-xl font-bold">Total: {formatCurrency(order.total_amount)}</p>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
}

export default function ActiveOrdersPage() {
  const [orders, setOrders] = useState<ActiveOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<ActiveOrder | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        type: 'active',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter })
      });

      const response = await fetch(`/api/store/orders?${params}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdating(orderId);
      const response = await fetch('/api/store/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: newStatus
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Order status updated successfully');
        fetchOrders();
      } else {
        toast.error(data.error || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error updating order status');
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatDate = (date: string, time: string) => {
    const dateTime = new Date(`${date}T${time}`);
    return dateTime.toLocaleString('en-IN', {
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
          <h1 className="text-3xl font-bold text-gray-900">Active Orders</h1>
          <p className="text-gray-600 mt-1">Manage current orders and update their status</p>
        </div>
        <Button onClick={fetchOrders} disabled={loading} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by order ID, transaction ID, customer, or product..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="packed">Packed</SelectItem>
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
            <Package className="w-5 h-5" />
            Active Orders ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No active orders found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id} onClick={() => setSelectedOrder(order)} className="cursor-pointer">
                      <TableCell className="font-medium">
                        #{order.orderId.slice(-8)}
                      </TableCell>
                      <TableCell>
                        {formatDate(order.date, order.time)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer_info?.name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500">{order.customer_id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ul className="list-disc list-inside">
                          {order.products.map(p => (
                            <li key={p.productId}>{p.name} (x{p.quantity})</li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(order.total_amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[order.status]} gap-1`}>
                          {statusIcons[order.status]}
                          {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.orderId, value)}
                          disabled={updating === order.orderId}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="packed">Packed</SelectItem>
                            <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
}