'use client';
import React from 'react';
import Cart from '@/components/customer/Cart';
import { useSession } from 'next-auth/react';

const CartPage = () => {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-64 p-6 min-h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {session && <Cart session={session} />}
        </div>
      </div>
    </div>
  );
};

export default CartPage;