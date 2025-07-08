"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert } from "@/types";
import { useRouter } from 'next/navigation';

export default function AlertsPage() {
  const [filter, setFilter] = useState<string>('all');
  const router = useRouter();

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'payment',
      message: 'Payment for order #3208 from Walmart Supercenter has been successfully processed and confirmed. Funds should reflect in your account within 24 hours.',
      timestamp: '2025-07-05T10:30:00Z',
      contactInfo: { name: 'Accounts Department', email: 'accounts@walmart.com', phone: '+1-800-123-4567' },
    },
    {
      id: '2',
      type: 'dispatch',
      message: 'Order #3210 containing 500 units of Great Value Milk has been dispatched from our main warehouse. Estimated delivery to Store #1234 is by 3 PM today.',
      timestamp: '2025-07-07T09:00:00Z',
      contactInfo: { name: 'Logistics Team', email: 'logistics@walmart.com', phone: '+1-800-987-6543' },
    },
    {
      id: '3',
      type: 'stock',
      message: 'Critical low stock alert for Great Value Milk. Only 100 units remaining. Please initiate a replenishment order immediately to avoid stockouts.',
      timestamp: '2025-07-08T08:00:00Z',
      reason: 'High demand due to recent promotion.',
      contactInfo: { name: 'Inventory Management', email: 'inventory@walmart.com', phone: '+1-800-555-1212' },
    },
    {
      id: '4',
      type: 'production',
      message: 'Urgent issue detected in Production Line A affecting product X. The line is currently down for maintenance. Expected delay of 4-6 hours.',
      timestamp: '2025-07-08T09:30:00Z',
      reason: 'Machine malfunction: Conveyor belt motor failure.',
      contactInfo: { name: 'Production Supervisor', email: 'prod.sup@walmart.com', phone: '+1-800-222-3333' },
    },
    {
      id: '5',
      type: 'route',
      message: 'Delivery route for order #3211 to Store #5678 has been rerouted due to unexpected road closure on Highway 101. New ETA is 4:30 PM.',
      timestamp: '2025-07-08T10:00:00Z',
      reason: 'Road closure: Emergency roadworks.',
      contactInfo: { name: 'Dispatch Team', email: 'dispatch@walmart.com', phone: '+1-800-777-8888' },
    },
    {
      id: '6',
      type: 'payment',
      message: 'Payment for order #3212 from online customer is currently pending verification. Please review the transaction details.',
      timestamp: '2025-07-08T10:20:00Z',
      contactInfo: { name: 'Finance Department', email: 'finance@walmart.com', phone: '+1-800-111-2222' },
    },
    {
      id: '7',
      type: 'stock',
      message: 'Low stock warning for Fresh Apples. Only 50 units remaining. Consider expediting the next shipment.',
      timestamp: '2025-07-08T07:00:00Z',
      reason: 'Seasonal demand and unexpected surge in local sales.',
      contactInfo: { name: 'Inventory Management', email: 'inventory@walmart.com', phone: '+1-800-555-1212' },
    },
    {
      id: '8',
      type: 'dispatch',
      message: 'Order #3213 for frozen goods has been dispatched. Temperature controlled delivery in progress.',
      timestamp: '2025-07-07T11:00:00Z',
      contactInfo: { name: 'Logistics Team', email: 'logistics@walmart.com', phone: '+1-800-987-6543' },
    },
    {
      id: '9',
      type: 'production',
      message: 'Major power outage at Production Facility B. All operations are temporarily halted. Restoration efforts are underway.',
      timestamp: '2025-07-08T09:45:00Z',
      reason: 'Unexpected power cut affecting the entire facility.',
      contactInfo: { name: 'Facility Management', email: 'facility@walmart.com', phone: '+1-800-444-5555' },
    },
    {
      id: '10',
      type: 'route',
      message: 'Delivery route for order #3214 to rural area is experiencing significant delays due to heavy traffic congestion. Expect 1-2 hour delay.',
      timestamp: '2025-07-08T10:15:00Z',
      reason: 'Traffic congestion on main arterial roads.',
      contactInfo: { name: 'Dispatch Team', email: 'dispatch@walmart.com', phone: '+1-800-777-8888' },
    },
  ];

  const filteredAlerts = filter === 'all' ? alerts : alerts.filter(alert => alert.type === filter);

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'payment':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'dispatch':
        return 'bg-blue-100 border-blue-500 text-blue-700';
      case 'stock':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'production':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'route':
        return 'bg-purple-100 border-purple-500 text-purple-700';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    }).format(date);
  };

  const handleContactClick = (contactInfo: Alert['contactInfo']) => {
    if (contactInfo?.email) {
      router.push(`/dashboard/supplier/chat/${contactInfo.email}`);
    } else if (contactInfo?.phone) {
      alert(`Contact Phone: ${contactInfo.phone}`);
    } else {
      alert('No contact information available.');
    }
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-6">
      <h1 className="text-lg font-semibold md:text-2xl">Alerts</h1>
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex space-x-2">
            <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
            <Button variant={filter === 'payment' ? 'default' : 'outline'} onClick={() => setFilter('payment')}>Payment</Button>
            <Button variant={filter === 'dispatch' ? 'default' : 'outline'} onClick={() => setFilter('dispatch')}>Dispatch</Button>
            <Button variant={filter === 'stock' ? 'default' : 'outline'} onClick={() => setFilter('stock')}>Stock</Button>
            <Button variant={filter === 'production' ? 'default' : 'outline'} onClick={() => setFilter('production')}>Production</Button>
            <Button variant={filter === 'route' ? 'default' : 'outline'} onClick={() => setFilter('route')}>Route</Button>
          </div>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 border-l-4 ${getAlertColor(alert.type)} cursor-pointer rounded-lg`}>
                  <p className="font-bold">{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert</p>
                  <p>{alert.message}</p>
                  {alert.reason && <p className="text-sm text-gray-600">Reason: {alert.reason}</p>}
                  <p className="text-sm text-gray-500">{formatTimestamp(alert.timestamp)}</p>
                  {alert.contactInfo && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleContactClick(alert.contactInfo)}
                    >
                      Contact {alert.contactInfo.name || 'Department'}
                    </Button>
                  )}
                </div>
              ))}
              {filteredAlerts.length === 0 && <p>No alerts to display for this category.</p>}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </main>
  );
}