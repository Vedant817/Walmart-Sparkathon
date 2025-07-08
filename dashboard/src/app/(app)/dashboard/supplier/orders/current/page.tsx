'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BUSINESS_LOCATIONS } from "@/constants/locations";

const mockProducts = [
  { "Item Name": "Laptop", "Unit Cost ($)": 1200 },
  { "Item Name": "Mouse", "Unit Cost ($)": 25 },
  { "Item Name": "Keyboard", "Unit Cost ($)": 75 },
  { "Item Name": "Webcam", "Unit Cost ($)": 150 },
  { "Item Name": "Microphone", "Unit Cost ($)": 100 },
];

const generateRandomOrder = (id: number, isCurrent: boolean) => {
  const products = [];
  let totalCost = 0;
  const numProducts = Math.floor(Math.random() * 3) + 1;

  for (let i = 0; i < numProducts; i++) {
    const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    const quantity = Math.floor(Math.random() * 151) + 50; // Bulk order quantity
    products.push({ name: product["Item Name"], quantity });
    totalCost += product["Unit Cost ($)"] * quantity;
  }

  const statusOptions = isCurrent ? ['Processing', 'Shipped', 'Out for Delivery'] : ['Delivered', 'Cancelled'];
  const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

  let location = 'N/A';
  let vehicleNo = 'N/A';

  if (status === 'Processing') {
    location = 'Warehouse';
  } else if (status === 'Shipped' || status === 'Out for Delivery') {
    const randomStore = BUSINESS_LOCATIONS.filter(loc => loc.type === 'store')[Math.floor(Math.random() * BUSINESS_LOCATIONS.filter(loc => loc.type === 'store').length)];
    location = `In Transit to ${randomStore.title}`;
    vehicleNo = `TRK-${Math.floor(Math.random() * 900) + 100}`;
  } else if (status === 'Delivered') {
    location = `Delivered to ${products[0].name}`;
  } else if (status === 'Cancelled') {
    location = 'N/A';
  }

  return {
    id: `ORD-${id}`,
    recipient: `store-${Math.floor(Math.random() * 3) + 1}`,
    products,
    totalCost: totalCost.toFixed(2),
    status,
    date: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000),
    location,
    vehicleNo,
  };
};
const mockCurrentOrders = Array.from({ length: 5 }, (_, i) => generateRandomOrder(i + 1, true));

export default function CurrentOrdersPage() {
  const [orders, setOrders] = useState(mockCurrentOrders);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [orders]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="px-4 sm:px-6 space-y-4">
      <h1 className="text-lg font-semibold md:text-2xl">Current Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>Orders in Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap h-[550px]">
            <table className="w-full min-w-max">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 min-w-[100px]">Order ID</th>
                  <th className="text-left p-2 min-w-[100px]">Date</th>
                  <th className="text-left p-2 min-w-[100px]">Recipient</th>
                  <th className="text-left p-2 min-w-[150px]">Products</th>
                  <th className="text-left p-2 min-w-[100px]">Total Cost</th>
                  <th className="text-left p-2 min-w-[120px]">Status</th>
                  <th className="text-left p-2 min-w-[200px]">Location</th>
                  <th className="text-left p-2 min-w-[100px]">Vehicle No.</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-100 cursor-pointer">
                    <td className="p-2">{order.id}</td>
                    <td className="p-2">{order.date.toLocaleDateString()}</td>
                    <td className="p-2">{order.recipient}</td>
                    <td className="p-2">
                      {order.products.map((product, index) => (
                        <div key={index} className="text-sm">
                          {product.name} (x{product.quantity})
                        </div>
                      ))}
                    </td>
                    <td className="p-2">${order.totalCost}</td>
                    <td className="p-2">
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Shipped">Shipped</SelectItem>
                          <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">{order.location}</td>
                    <td className="p-2">{order.vehicleNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}