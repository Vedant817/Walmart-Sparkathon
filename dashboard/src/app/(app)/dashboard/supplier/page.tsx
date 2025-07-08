'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PlusCircle, Search } from "lucide-react";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import AddProductForm from "@/components/supplier/AddProductForm";

const ITEMS_PER_PAGE = 15;

export interface Product {
  _id?: string;
  "Item Name": string;
  Company: string;
  Quantity: number;
  SKU: string;
  "Unit Cost ($)": number;
  "Lead Time (Days)": number;
  "Production Rate (Units/Day)": number;
}

const ProductTable = ({ products }: { products: Product[] }) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const viewport = tableContainerRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
    if (!viewport) return;
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(viewport.scrollLeft);
    e.preventDefault();
  }, []);

  const handleMouseLeave = useCallback(() => setIsDragging(false), []);
  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const viewport = tableContainerRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
    if (!viewport) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startX) * 1.5;
    viewport.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  return (
    <ScrollArea ref={tableContainerRef} className="w-full">
      <div
        className="min-w-max"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Item Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Company</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Quantity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">SKU</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Unit Cost ($)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">Lead Time (Days)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">Production Rate (Units/Day)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.SKU}>
                <td className="px-6 py-4 whitespace-nowrap">{product["Item Name"]}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.Company}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.Quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.SKU}</td>
                <td className="px-6 py-4 whitespace-nowrap">${product["Unit Cost ($)"]}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product["Lead Time (Days)"]}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {product["Production Rate (Units/Day)"]} units/day
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

const Pagination = ({ currentPage, totalPages, onPrevious, onNext }: {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-2 p-4 border-t">
      <Button variant="outline" size="sm" onClick={onPrevious} disabled={currentPage === 1}>
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button variant="outline" size="sm" onClick={onNext} disabled={currentPage === totalPages}>
        Next
      </Button>
    </div>
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/supplier/products?supplierId=ELE-001');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = (newProduct: Omit<Product, '_id'>) => {
    const productWithId = { ...newProduct, _id: new Date().toISOString() }; // Temporary ID
    setProducts(prev => [productWithId, ...prev]);
    setIsAddFormOpen(false);
  };

  const filteredProducts = useMemo(() =>
    products.filter(product =>
      product["Item Name"].toLowerCase().includes(searchTerm.toLowerCase())
    ), [products, searchTerm]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  if (loading) return <div className="h-full flex items-center justify-center"><p>Loading products...</p></div>;
  if (error) return <div className="px-4 sm:px-6"><p className="text-red-500">Error: {error}</p></div>;

  return (
    <div className="px-4 sm:px-6 space-y-4">
      {isAddFormOpen && (
        <AddProductForm
          onClose={() => setIsAddFormOpen(false)}
          onSubmit={handleAddProduct}
        />
      )}
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="h-8 gap-1" onClick={() => setIsAddFormOpen(true)}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Product</span>
          </Button>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Products</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {paginatedProducts.length === 0 ? (
            <p className="p-6 text-center">No products found.</p>
          ) : (
            <ProductTable products={paginatedProducts} />
          )}
        </CardContent>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={() => setCurrentPage(p => Math.max(p - 1, 1))}
          onNext={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
        />
      </Card>
    </div>
  );
}