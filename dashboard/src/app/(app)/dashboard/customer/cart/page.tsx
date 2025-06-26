import React from 'react'
import Cart from '@/components/customer/Cart'

const CartPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="ml-64 p-6 min-h-screen overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <Cart />
                </div>
            </div>
        </div>
    )
}

export default CartPage