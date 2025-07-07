'use client';

import Link from 'next/link';

const navLinks = [
  { href: '/dashboard/customer', label: 'Products', icon: '🏠' },
  { href: '/dashboard/customer/cart', label: 'Cart', icon: '🛒' },
  { href: '/dashboard/customer/orders', label: 'My Orders', icon: '📦' },
  { href: '/dashboard/customer/query', label: 'Support Chat', icon: '💬' }
];

const NavItem = ({ href, label, icon }: { href: string; label: string; icon: string }) => (
  <li>
    <Link
      href={href}
      className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors border-b-1"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{label}</span>
    </Link>
  </li>
);

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 z-10 h-screen w-64 overflow-y-auto bg-white p-4 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">Shop Dashboard</h2>
      <nav>
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <NavItem key={link.href} {...link} />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;