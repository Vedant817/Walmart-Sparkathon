'use client';
import React from 'react';
import Products from '@/components/customer/Products';
import { useSession } from 'next-auth/react';

const CustomerDashboard = () => {
    const { data: session } = useSession();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="ml-64 p-4 min-h-screen overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <div className='flex justify-between items-center'>
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Dashboard</h1>
                            <p className="text-gray-600">Welcome to your shopping dashboard. Browse products and add them to your cart.</p>
                        </div>
                        <p className="border-2 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">Welcome, {session?.user?.name}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <Products />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;