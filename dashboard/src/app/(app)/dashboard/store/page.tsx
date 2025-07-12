"use client";
import { useEffect, useState, useMemo } from "react";
import { Package, AlertCircle, Loader2, Search, ChevronLeft, ChevronRight, ShoppingCart, Archive, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/types";

const ITEMS_PER_PAGE = 12;

// Orders Overview Component
function OrdersOverview() {
    const [orderStats, setOrderStats] = useState({
        activeOrders: 0,
        pastOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0
    });

    useEffect(() => {
        const fetchOrderStats = async () => {
            try {
                // Fetch active orders count
                const activeResponse = await fetch('/api/store/orders?type=active&limit=1');
                const activeData = await activeResponse.json();

                // Fetch past orders count
                const pastResponse = await fetch('/api/store/orders?type=past&limit=1');
                const pastData = await pastResponse.json();

                if (activeData.success && pastData.success) {
                    setOrderStats({
                        activeOrders: activeData.total || 0,
                        pastOrders: pastData.total || 0,
                        totalRevenue: (pastData.total || 0) * 2500, // Estimated average
                        pendingOrders: activeData.total || 0
                    });
                }
            } catch (error) {
                console.error('Error fetching order stats:', error);
            }
        };

        fetchOrderStats();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Link href="/dashboard/store/orders/active">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{orderStats.activeOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            Orders in progress
                        </p>
                    </CardContent>
                </Card>
            </Link>

            <Link href="/dashboard/store/orders/past">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                        <Archive className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{orderStats.pastOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            Successfully fulfilled
                        </p>
                    </CardContent>
                </Card>
            </Link>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                        ₹{orderStats.totalRevenue.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        From completed orders
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{orderStats.pendingOrders}</div>
                    <p className="text-xs text-muted-foreground">
                        Awaiting processing
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default function CurrentInventoryPage() {
    const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchInventoryData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const fetchInventoryData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/store/inventory');
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch inventory data');
            }

            if (result.success) {
                setInventoryData(result.data);
            } else {
                throw new Error(result.error || 'Failed to fetch inventory data');
            }
        } catch (err) {
            console.error('Error fetching inventory:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const filteredInventory = useMemo(() => {
        if (!searchTerm.trim()) {
            return inventoryData;
        }

        const searchLower = searchTerm.toLowerCase();
        return inventoryData.filter(item =>
            item.Product_Name.toLowerCase().includes(searchLower) ||
            item.category.toLowerCase().includes(searchLower) ||
            item._id.toLowerCase().includes(searchLower)
        );
    }, [inventoryData, searchTerm]);

    const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = filteredInventory.slice(startIndex, endIndex);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    const isLowStock = (quantity: number, reorderPoint: number) => {
        return quantity <= reorderPoint;
    };

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    if (loading) {
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Current Inventory</h1>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="ml-2">Loading inventory data...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Current Inventory</h1>
                <div className="flex items-center justify-center h-64 text-red-500">
                    <AlertCircle className="w-8 h-8" />
                    <span className="ml-2">Error: {error}</span>
                </div>
                <button
                    onClick={fetchInventoryData}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 pt-2">
            <div className="flex items-center mb-4">
                <Package className="w-8 h-8 mr-3" />
                <h1 className="text-2xl font-bold">Current Inventory</h1>
            </div>

            <OrdersOverview />
            <div className="mb-2">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Search products by name, category, or ID..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="mb-3">
                <p className="text-gray-600">
                    {searchTerm ? (
                        <>
                            Showing {filteredInventory.length} of {inventoryData.length} items
                            {filteredInventory.length > 0 && (
                                <> (Page {currentPage} of {totalPages})</>
                            )}
                        </>
                    ) : (
                        <>
                            Total Items: {inventoryData.length} |
                            <span className="text-red-600 font-bold"> Low Stock Items: {inventoryData.filter(item => isLowStock(item.Quantity_in_stock, item.reorder_point)).length}</span>
                            {inventoryData.length > 0 && (
                                <> | Page {currentPage} of {totalPages}</>
                            )}
                        </>
                    )}
                </p>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-bold">ID</TableHead>
                            <TableHead className="font-bold">Category</TableHead>
                            <TableHead className="font-bold">Product Name</TableHead>
                            <TableHead className="text-right font-bold">Quantity in Stock</TableHead>
                            <TableHead className="text-right font-bold">Unit Cost</TableHead>
                            <TableHead className="text-right font-bold">Total Inventory Value</TableHead>
                            <TableHead className="text-right font-bold">Reorder Point</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                    {searchTerm ? 'No products found matching your search' : 'No inventory data available'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentItems.map((item) => (
                                <TableRow
                                    key={item._id}
                                    className={isLowStock(item.Quantity_in_stock, item.reorder_point) ? 'bg-red-50' : ''}
                                >
                                    <TableCell className="font-mono text-sm">{item._id}</TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                                            {item.category}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-medium">{item.Product_Name}</TableCell>
                                    <TableCell className="text-right">
                                        <span className={isLowStock(item.Quantity_in_stock, item.reorder_point) ? 'text-red-600 font-semibold' : ''}>
                                            {item.Quantity_in_stock.toLocaleString()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.Unit_Cost)}</TableCell>
                                    <TableCell className="text-right font-semibold">
                                        {formatCurrency(item.Total_inventory_value)}
                                    </TableCell>
                                    <TableCell className="text-right">{item.reorder_point.toLocaleString()}</TableCell>
                                    <TableCell>
                                        {isLowStock(item.Quantity_in_stock, item.reorder_point) ? (
                                            <span className="flex items-center text-red-600">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                Low Stock
                                            </span>
                                        ) : (
                                            <span className="text-green-600">In Stock</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {filteredInventory.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-between mt-2">
                    <div className="text-sm text-gray-500">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredInventory.length)} of {filteredInventory.length} items
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="flex items-center"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Previous
                        </Button>
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="flex items-center"
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}

            {inventoryData.length > 0 && (
                <div className="mt-2 text-sm text-gray-500">
                    <p>* Items highlighted in red are below their reorder point</p>
                </div>
            )}
        </div>
    );
}