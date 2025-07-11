import { Users } from "lucide-react";

export default function SuppliersPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Suppliers</h1>
      <div className="border p-4 rounded-lg">
        <Users className="w-8 h-8 mb-2" />
        <h2 className="text-lg font-semibold">Supplier List</h2>
        <p className="text-gray-500">Manage your suppliers.</p>
      </div>
    </div>
  );
}
