"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

interface ManagerLayoutProps {
    children: React.ReactNode;
}

export default function ManagerLayout({ children }: ManagerLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
                        <p className="text-gray-600 mt-1">Monitor and manage all store operations</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
                {children}
            </div>
        </div>
    );
}