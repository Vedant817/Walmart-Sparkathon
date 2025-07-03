import React from 'react';
import Sidebar from '@/components/customer/Sidebar';
import { CartProvider } from '@/contexts/CartContext';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="min-h-screen overflow-y-auto">
          {children}
        </div>
      </div>
    </CartProvider>
  );
}