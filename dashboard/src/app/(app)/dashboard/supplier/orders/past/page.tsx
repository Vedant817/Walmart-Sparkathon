import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PastOrdersPage() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <h1 className="text-lg font-semibold md:text-2xl">Past Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">#3208</td>
                <td className="px-6 py-4 whitespace-nowrap">Store #1234 - Dallas, TX</td>
                <td className="px-6 py-4 whitespace-nowrap">2025-06-20</td>
                <td className="px-6 py-4 whitespace-nowrap">Delivered</td>
                <td className="px-6 py-4 whitespace-nowrap">$1,150.00</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">#3207</td>
                <td className="px-6 py-4 whitespace-nowrap">Store #5678 - Miami, FL</td>
                <td className="px-6 py-4 whitespace-nowrap">2025-06-19</td>
                <td className="px-6 py-4 whitespace-nowrap">Delivered</td>
                <td className="px-6 py-4 whitespace-nowrap">$750.25</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  );
}