import React from 'react'
import Sidebar from '@/components/customer/Sidebar'

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <div className="min-h-screen overflow-y-auto">
                {children}
            </div>
        </div>
    )
}