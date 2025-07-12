'use client';
import React, { useState, useEffect } from 'react';
import { Truck, Package, Clock, CheckCircle, RefreshCw, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

interface ShipmentItem {
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  supplier: string;
}

interface Shipment {
  _id: string;
  shipmentId: string;
  orderId: string;
  supplier: string;
  status: 'ordered' | 'confirmed' | 'shipped' | 'delivered';
  items: ShipmentItem[];
  totalValue: number;
  orderDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  storeId: string;
}

interface ShipmentsResponse {
  success: boolean;
  shipments: Shipment[];
}

interface UpdateShipmentResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const statusConfig = {
  ordered: {
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    bgColor: 'bg-yellow-50',
    label: 'Ordered'
  },
  confirmed: {
    icon: CheckCircle,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    bgColor: 'bg-blue-50',
    label: 'Confirmed'
  },
  shipped: {
    icon: Truck,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    bgColor: 'bg-purple-50',
    label: 'Shipped'
  },
  delivered: {
    icon: Package,
    color: 'bg-green-100 text-green-800 border-green-200',
    bgColor: 'bg-green-50',
    label: 'Delivered'
  }
};

export default function ShipmentTrackingPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchShipments = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('/api/store/shipments');
      const data: ShipmentsResponse = await response.json();
      
      if (data.success) {
        setShipments(data.shipments);
      } else {
        toast.error('Failed to fetch shipments');
      }
    } catch (error) {
      console.error('Error fetching shipments:', error);
      toast.error('Error fetching shipments');
    } finally {
      setLoading(false);
    }
  };

  const updateShipmentStatus = async (shipmentId: string, newStatus: Shipment['status']): Promise<void> => {
    try {
      setUpdating(shipmentId);
      const response = await fetch('/api/store/shipments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shipmentId,
          status: newStatus,
          ...(newStatus === 'delivered' ? { actualDelivery: new Date().toISOString() } : {})
        }),
      });
      
      const result: UpdateShipmentResponse = await response.json();
      
      if (result.success) {
        toast.success('Shipment status updated successfully');
        fetchShipments();
      } else {
        toast.error(result.error || 'Failed to update shipment status');
      }
    } catch (error) {
      console.error('Error updating shipment:', error);
      toast.error('Error updating shipment status');
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusOptions = (currentStatus: string) => {
    const statusOrder = ['ordered', 'confirmed', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    return statusOrder.slice(currentIndex);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading shipments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supplier Shipments</h1>
          <p className="text-gray-600 mt-1">Track orders placed through Smart Agent</p>
        </div>
        <Button onClick={fetchShipments} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {shipments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Shipments Found</h3>
            <p className="text-gray-600 mb-4">Orders placed through the Smart Agent will appear here.</p>
            <p className="text-sm text-gray-500">Use the Smart Agent in the Forecasting page to place orders.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shipments List */}
          <div className="lg:col-span-2 space-y-4">
            {shipments.map((shipment) => {
              const statusInfo = statusConfig[shipment.status];
              const StatusIcon = statusInfo.icon;
              
              return (
                <Card key={shipment._id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedShipment(shipment)}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {shipment.shipmentId}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Order: {shipment.orderId}
                        </p>
                        <p className="text-sm font-medium text-gray-700 mt-1">
                          {shipment.supplier}
                        </p>
                      </div>
                      <Badge className={`${statusInfo.color} gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="font-medium">{formatDate(shipment.orderDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Est. Delivery</p>
                        <p className="font-medium">{formatDate(shipment.estimatedDelivery)}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Total Value</p>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(shipment.totalValue)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {shipment.items.length} item{shipment.items.length !== 1 ? 's' : ''}
                        </p>
                        <Button variant="outline" size="sm" className="mt-1">
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Shipment Details Sidebar */}
          <div>
            {selectedShipment ? (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Shipment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {selectedShipment.shipmentId}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">
                      Order: {selectedShipment.orderId}
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      {selectedShipment.supplier}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Status Update</h5>
                    <div className="space-y-2">
                      {getStatusOptions(selectedShipment.status).map((status) => (
                        <Button
                          key={status}
                          variant={selectedShipment.status === status ? "default" : "outline"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            if (status !== selectedShipment.status) {
                              updateShipmentStatus(selectedShipment.shipmentId, status as Shipment['status']);
                            }
                          }}
                          disabled={updating === selectedShipment.shipmentId}
                        >
                          {React.createElement(statusConfig[status as keyof typeof statusConfig].icon, { className: "w-3 h-3 mr-2" })}
                          {statusConfig[status as keyof typeof statusConfig].label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Items</h5>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedShipment.items.map((item, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded">
                          <p className="font-medium text-sm">{item.productName}</p>
                          <p className="text-xs text-gray-600">
                            {item.quantity} × {formatCurrency(item.unitPrice)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">Total Value:</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(selectedShipment.totalValue)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Order Date:</span>
                        <span>{formatDate(selectedShipment.orderDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Delivery:</span>
                        <span>{formatDate(selectedShipment.estimatedDelivery)}</span>
                      </div>
                      {selectedShipment.actualDelivery && (
                        <div className="flex justify-between">
                          <span>Delivered:</span>
                          <span>{formatDate(selectedShipment.actualDelivery)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-6">
                <CardContent className="text-center py-12">
                  <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a shipment to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
