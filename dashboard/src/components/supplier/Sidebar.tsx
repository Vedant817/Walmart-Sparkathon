'use client';
import { Bell, Home, LineChart, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: '/dashboard/supplier', label: 'Products', icon: Package },
  { href: '/dashboard/supplier/orders/current', label: 'Current Orders', icon: ShoppingCart },
  { href: '/dashboard/supplier/orders/past', label: 'Past Orders', icon: LineChart },
  { href: '/dashboard/supplier/alerts', label: 'Alerts', icon: Bell },
  { href: '/dashboard/supplier/supply-map', label: 'Supply Map', icon: Home },
];

const NavItem = ({
  href,
  label,
  icon: Icon,
  isActive
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
}) => (
  <li>
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-colors border-b border-gray-100 hover:bg-gray-50",
        isActive
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "text-gray-700 hover:text-gray-900"
      )}
    >
      <Icon className={cn(
        "h-5 w-5",
        isActive ? "text-blue-600" : "text-gray-500"
      )} />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  </li>
);

export default function SupplierSidebar() {
  const pathname = usePathname();
  const isSupplierPath = pathname.startsWith("/dashboard/supplier");

  if (!isSupplierPath) {
    return null;
  }

  const isActiveLink = (href: string) => {
    if (href === '/dashboard/supplier') {
      return pathname === '/dashboard/supplier' || pathname.includes('/products');
    }
    return pathname.includes(href.split('/').pop() || '');
  };

  return (
    <aside className="fixed left-0 top-0 z-10 h-screen w-64 overflow-y-auto bg-white p-4 shadow-lg border-r border-gray-200">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Supplier Portal</h2>
            <p className="text-xs text-gray-500">Manage your business</p>
          </div>
        </div>
      </div>
      <nav>
        <ul className="space-y-1">
          {navLinks.map((link) => (
            <NavItem
              key={link.href}
              href={link.href}
              label={link.label}
              icon={link.icon}
              isActive={isActiveLink(link.href)}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}
