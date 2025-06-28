import SupplierSidebar from "@/components/supplier/Sidebar";

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SupplierSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        {children}
      </div>
    </div>
  );
}