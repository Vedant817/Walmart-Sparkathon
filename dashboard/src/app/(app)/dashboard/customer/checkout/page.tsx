import React from 'react'
import Checkout from '@/components/customer/Checkout'

const CheckoutPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="ml-64 p-6 min-h-screen overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <Checkout />
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage