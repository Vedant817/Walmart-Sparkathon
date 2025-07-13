'use client';
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, RefreshCw, Archive, CheckCircle, Package2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { PastOrder } from '@/types';

const statusIcons = {
  fulfilled: <Package2 className="w-4 h-4" />,
  delivered: <CheckCircle className="w-4 h-4" />
};

const statusColors = {
  fulfilled: 'bg-blue-100 text-blue-800 border-blue-200',
  delivered: 'bg-green-100 text-green-800 border-green-200'
};

export default function PastOrdersPage() {
  const [orders, setOrders] = useState<PastOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchOrders = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        type: 'past',
        page: page.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter })
      });

      const response = await fetch(`/api/store/orders/past?${params}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
        setTotalPages(data.totalPages);
        setTotalOrders(data.total);
        setCurrentPage(page);
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

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchOrders(page);
    }
  };

  return (
    <div className="p-6 pt-2 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Past Orders</h1>
          <p className="text-gray-600 mt-1">View completed and fulfilled orders</p>
        </div>
        <Button onClick={() => fetchOrders(currentPage)} disabled={loading} className="gap-2">
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
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
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
            <Archive className="w-5 h-5" />
            Past Orders ({totalOrders})
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
              No past orders found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">
                          #{order.Transaction_ID.slice(-8)}
                        </TableCell>
                        <TableCell>
                          {formatDate(order.Date, order.Time)}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {order.Transaction_ID}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.Customer_ID || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{order.Customer_ID}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs whitespace-normal break-words" title={order.Product_Name}>
                            {order.Product_Name}
                          </div>
                        </TableCell>
                        <TableCell>{order.Quantity}</TableCell>
                        <TableCell>{formatCurrency(order.Unit_Price)}</TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(order.Total_Amount)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusColors[order.status]} gap-1`}>
                            {statusIcons[order.status]}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalOrders)} of {totalOrders} orders
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                        return (
                          <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}