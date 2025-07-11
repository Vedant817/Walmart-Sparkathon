import { Truck } from "lucide-react";

export default function ShipmentTrackingPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Supplier Shipments</h1>
      <div className="border p-4 rounded-lg">
        <Truck className="w-8 h-8 mb-2" />
        <h2 className="text-lg font-semibold">Shipment #9876</h2>
        <p className="text-gray-500">Status: In Transit</p>
      </div>
    </div>
  );
}
