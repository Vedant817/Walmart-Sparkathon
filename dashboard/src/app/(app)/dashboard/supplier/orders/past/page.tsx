'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const mockProducts = [
  { "Item Name": "Laptop", "Unit Cost ($)": 1200 },
  { "Item Name": "Mouse", "Unit Cost ($)": 25 },
  { "Item Name": "Keyboard", "Unit Cost ($)": 75 },
  { "Item Name": "Webcam", "Unit Cost ($)": 150 },
  { "Item Name": "Microphone", "Unit Cost ($)": 100 },
];

const generateRandomOrder = (id: number) => {
  const products = [];
  let totalCost = 0;
  const numProducts = Math.floor(Math.random() * 3) + 1;

  for (let i = 0; i < numProducts; i++) {
    const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    const quantity = Math.floor(Math.random() * 151) + 50;
    products.push({ name: product["Item Name"], quantity });
    totalCost += product["Unit Cost ($)"] * quantity;
  }

  return {
    id: `ORD-${id}`,
    recipient: `store-${Math.floor(Math.random() * 3) + 1}`,
    products,
    totalCost: totalCost.toFixed(2),
    status: 'Delivered',
    date: new Date(Date.now() - Math.floor(Math.random() * 30 + 10) * 24 * 60 * 60 * 1000),
  };
};
const mockPastOrders = Array.from({ length: 10 }, (_, i) => generateRandomOrder(i + 6));

const numCancelled = Math.floor(Math.random() * 2) + 1; // 1 or 2
const cancelledIndices = new Set<number>();
while (cancelledIndices.size < numCancelled) {
  cancelledIndices.add(Math.floor(Math.random() * mockPastOrders.length));
}

cancelledIndices.forEach(index => {
  mockPastOrders[index].status = 'Cancelled';
});

export default function PastOrdersPage() {
  const [orders] = useState(mockPastOrders);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [orders]);

  return (
    <div className="px-4 sm:px-6 space-y-4">
      <h1 className="text-lg font-semibold md:text-2xl">Past Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>Completed Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.date.toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.recipient}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ul>
                      {order.products.map((p, index) => <li key={index}>{p.name} (x{p.quantity})</li>)}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">${order.totalCost}</td>
                  <td className={cn("px-6 py-4 whitespace-nowrap", {
                    'text-red-600': order.status === 'Cancelled',
                    'text-green-600': order.status === 'Delivered',
                  })}>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
