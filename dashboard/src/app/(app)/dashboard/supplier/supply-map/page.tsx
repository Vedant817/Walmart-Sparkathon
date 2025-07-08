'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import SupplierMapSidebar from "@/components/supplier/SupplierMapSidebar";

const SupplierRouteMap = dynamic(
  () => import("@/components/supplier/SupplierRouteMap"),
  { ssr: false }
);

export default function SupplyMapPage() {
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  return (
    <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 lg:grid-cols-3 xl:grid-cols-3 max-h-screen">
      <div className="lg:col-span-1">
        <SupplierMapSidebar selectedStoreId={selectedStoreId} onSelectStore={setSelectedStoreId} />
      </div>
      <div className="lg:col-span-2 h-full">
        <h1 className="text-lg font-semibold md:text-2xl mb-2">Supply Map</h1>
        <SupplierRouteMap selectedStoreId={selectedStoreId} />
      </div>
    </main>
  );
}