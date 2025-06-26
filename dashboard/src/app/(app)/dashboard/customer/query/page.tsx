import React from 'react'
import ChatInterface from '@/components/customer/QueryChat'

const CustomerQuery = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="ml-64 p-4 min-h-screen overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white p-4 rounded-lg shadow-md h-full">
                        <h1 className="text-2xl font-bold mb-6 text-center">Delivery Support Chatbot</h1>
                        <ChatInterface />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerQuery