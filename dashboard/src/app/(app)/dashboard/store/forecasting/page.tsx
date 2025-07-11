import { TrendingUp } from "lucide-react";

export default function ForecastingPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Demand Forecasting</h1>
      <div className="border p-4 rounded-lg">
        <TrendingUp className="w-8 h-8 mb-2" />
        <h2 className="text-lg font-semibold">Future Demand</h2>
        <p className="text-gray-500">Predict your future sales.</p>
      </div>
    </div>
  );
}
