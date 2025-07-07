'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';

const navLinks = [
  { href: '/dashboard/customer', label: 'Products', icon: '🏠' },
  { href: '/dashboard/customer/cart', label: 'Cart', icon: '🛒' },
  { href: '/dashboard/customer/orders', label: 'My Orders', icon: '📦' },
  { href: '/dashboard/customer/query', label: 'Support Chat', icon: '💬' }
];

const NavItem = ({ href, label, icon, onClick }: { href?: string; label: string; icon: string; onClick?: () => void }) => (
  <li>
    {href ? (
      <Link
        href={href}
        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors border-b-1"
      >
        <span className="text-lg">{icon}</span>
        <span className="text-sm">{label}</span>
      </Link>
    ) : (
      <button
        onClick={onClick}
        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors border-b-1 w-full text-left"
      >
        <span className="text-lg">{icon}</span>
        <span className="text-sm">{label}</span>
      </button>
    )}
  </li>
);

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 z-10 h-screen w-64 overflow-y-auto bg-white p-4 shadow-md flex flex-col">
      <h2 className="mb-4 text-2xl font-bold">Shop Dashboard</h2>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <NavItem key={link.href} {...link} />
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <NavItem label="Logout" icon="🚪" onClick={() => signOut({ callbackUrl: '/' })} />
      </div>
    </aside>
  );
};

export default Sidebar;