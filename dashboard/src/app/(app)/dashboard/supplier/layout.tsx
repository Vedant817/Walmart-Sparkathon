import SupplierSidebar from "@/components/supplier/Sidebar";

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <SupplierSidebar />
      <div className="flex-1 flex flex-col ml-64 min-w-0">
        <main className="flex-1 py-4 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}