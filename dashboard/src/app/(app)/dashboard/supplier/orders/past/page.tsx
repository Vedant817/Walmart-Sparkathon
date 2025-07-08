'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BUSINESS_LOCATIONS } from "@/constants/locations";

const mockProducts = [
  { "Item Name": "Laptop", "Unit Cost ($)": 1200 },
  { "Item Name": "Mouse", "Unit Cost ($)": 25 },
  { "Item Name": "Keyboard", "Unit Cost ($)": 75 },
  { "Item Name": "Webcam", "Unit Cost ($)": 150 },
  { "Item Name": "Microphone", "Unit Cost ($)": 100 },
];

const generateRandomPastOrder = (id: number, cancelledCount: { current: number }) => {
  const products = [];
  let totalCost = 0;
  const numProducts = Math.floor(Math.random() * 3) + 1;

  for (let i = 0; i < numProducts; i++) {
    const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    const quantity = Math.floor(Math.random() * 151) + 50;
    products.push({
      name: product["Item Name"],
      quantity
    });
    totalCost += product["Unit Cost ($)"] * quantity;
  }

  let status;
  if (cancelledCount.current < 2 && Math.random() < 0.3) {
    status = 'Cancelled';
    cancelledCount.current++;
  } else {
    status = 'Delivered';
  }

  let location = 'N/A';
  let vehicleNo = 'N/A';

  if (status === 'Delivered') {
    const randomStore = BUSINESS_LOCATIONS.filter(loc => loc.type === 'store')[
      Math.floor(Math.random() * BUSINESS_LOCATIONS.filter(loc => loc.type === 'store').length)
    ];
    location = `Delivered to ${randomStore?.title || 'Store'}`;
    vehicleNo = `TRK-${Math.floor(Math.random() * 900) + 100}`;
  } else if (status === 'Cancelled') {
    location = 'Order Cancelled';
    vehicleNo = 'N/A';
  }

  return {
    id: `ORD-${id}`,
    recipient: `store-${Math.floor(Math.random() * 3) + 1}`,
    products,
    totalCost: totalCost.toFixed(2),
    status,
    date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    location,
    vehicleNo,
  };
};

const generatePastOrders = (count: number) => {
  const cancelledCount = { current: 0 };
  return Array.from({ length: count }, (_, i) =>
    generateRandomPastOrder(i + 1, cancelledCount)
  );
};

const mockPastOrders = generatePastOrders(10);

export default function PastOrdersPage() {
  const [pastOrders] = useState(mockPastOrders);

  const sortedPastOrders = useMemo(() => {
    return [...pastOrders].sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [pastOrders]);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Past Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap h-[575px]">
            <table className="w-full min-w-max ">
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
                {sortedPastOrders.map((order) => (
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
                      <span className={`px-2 py-1 rounded text-xs ${order.status === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {order.status}
                      </span>
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