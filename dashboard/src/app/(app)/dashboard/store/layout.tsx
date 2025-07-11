import StoreSidebar from "@/components/store/Sidebar";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full bg-gray-50">
            <StoreSidebar />
            <div className="flex-1 flex flex-col ml-64 min-w-0">
                <main className="flex-1 py-4 overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}