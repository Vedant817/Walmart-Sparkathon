import React from 'react'
import ChatInterface from '@/components/customer/QueryChat'

const CustomerQuery = () => {
    return (
        <main className="h-screen flex items-center justify-center bg-gray-100 w-screen p-4">
            <div className="bg-white p-4 rounded-lg shadow-md w-full h-full">
                <h1 className="text-2xl font-bold mb-6 text-center">Delivery Support Chatbot</h1>
                <ChatInterface />
            </div>
        </main>
    )
}

export default CustomerQuery