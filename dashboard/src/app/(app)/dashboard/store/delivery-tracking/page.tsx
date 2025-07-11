import { MapPin } from "lucide-react";

export default function DeliveryTrackingPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Delivery Tracking</h1>
      <div className="border p-4 rounded-lg">
        <MapPin className="w-8 h-8 mb-2" />
        <h2 className="text-lg font-semibold">Delivery #5432</h2>
        <p className="text-gray-500">Location: On its way</p>
      </div>
    </div>
  );
}
