import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AlertsPage() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <h1 className="text-lg font-semibold md:text-2xl">Alerts</h1>
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
              <p className="font-bold">Low Stock Warning</p>
              <p>Great Value Milk is running low. Current stock: 100 units.</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
            <div className="p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700">
              <p className="font-bold">New Order</p>
              <p>New order #3210 received from Store #1234.</p>
              <p className="text-sm text-gray-500">1 day ago</p>
            </div>
            <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
              <p className="font-bold">Payment Received</p>
              <p>Payment for order #3208 has been successfully processed.</p>
              <p className="text-sm text-gray-500">3 days ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}