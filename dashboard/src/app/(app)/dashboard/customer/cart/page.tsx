import React from 'react';
import Cart from '@/components/customer/Cart';
import { Session } from 'next-auth';

const CartPage = ({ session }: { session: Session }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-64 p-6 min-h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Cart session={session} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;