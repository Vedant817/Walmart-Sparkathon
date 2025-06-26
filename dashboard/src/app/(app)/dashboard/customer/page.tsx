'use client'
import React from 'react'
import Products from '@/components/customer/Products'

const CustomerDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="ml-64 p-6 min-h-screen overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Dashboard</h1>
                        <p className="text-gray-600">Welcome to your shopping dashboard. Browse products and add them to your cart.</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <Products />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerDashboard