import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function ProductsPage() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Products</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Great Value Milk</td>
                <td className="px-6 py-4 whitespace-nowrap">GV-MILK-1G</td>
                <td className="px-6 py-4 whitespace-nowrap">100</td>
                <td className="px-6 py-4 whitespace-nowrap">$3.50</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Marketside Organic Bananas</td>
                <td className="px-6 py-4 whitespace-nowrap">MS-BAN-ORG-1B</td>
                <td className="px-6 py-4 whitespace-nowrap">250</td>
                <td className="px-6 py-4 whitespace-nowrap">$0.59/lb</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Freshness Guaranteed Ground Beef</td>
                <td className="px-6 py-4 whitespace-nowrap">FG-GB-8020-1LB</td>
                <td className="px-6 py-4 whitespace-nowrap">50</td>
                <td className="px-6 py-4 whitespace-nowrap">$4.99/lb</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  );
}