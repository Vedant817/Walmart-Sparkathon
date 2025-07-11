import { BarChart } from "lucide-react";

export default function InsightsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Insights</h1>
      <div className="border p-4 rounded-lg">
        <BarChart className="w-8 h-8 mb-2" />
        <h2 className="text-lg font-semibold">Sales Analytics</h2>
        <p className="text-gray-500">View your sales performance.</p>
      </div>
    </div>
  );
}
