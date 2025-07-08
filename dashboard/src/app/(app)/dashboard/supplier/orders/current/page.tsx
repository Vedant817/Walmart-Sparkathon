'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  return {
    id: `ORD-${id}`,
    recipient: `store-${Math.floor(Math.random() * 3) + 1}`,
    products,
    totalCost: totalCost.toFixed(2),
    status: isCurrent ? (['Processing', 'Shipped', 'Out for Delivery'])[Math.floor(Math.random() * 3)] : (['Delivered', 'Cancelled'])[Math.floor(Math.random() * 2)],
    date: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000),
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
                      {order.products.map(p => <li key={p.name}>{p.name} (x{p.quantity})</li>)}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">${order.totalCost}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
