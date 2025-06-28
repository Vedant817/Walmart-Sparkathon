import RouteMap from "@/components/map/RouteMap";

export default function SupplyMapPage() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <h1 className="text-lg font-semibold md:text-2xl">Supply Map</h1>
      <RouteMap />
    </main>
  );
}