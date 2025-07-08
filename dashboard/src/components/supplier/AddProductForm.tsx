'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { X } from "lucide-react";
import { useState } from "react";
import { Product } from "@/app/(app)/dashboard/supplier/page";

interface ProductFormProps {
  onClose: () => void;
  onSubmit: (product: Product) => void;
}

export default function AddProductForm({ onClose, onSubmit }: ProductFormProps) {
  const [product, setProduct] = useState({
    "Item Name": "",
    Company: "",
    Quantity: 0,
    SKU: "",
    "Unit Cost ($)": 0,
    "Lead Time (Days)": 0,
    "Production Rate (Units/Day)": 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setProduct(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/supplier/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      const result = await response.json();
      onSubmit({ ...product, _id: result.insertedId });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-lg border-2 border-gray-300 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Add New Product</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="Item Name">Item Name</Label>
              <Input id="Item Name" name="Item Name" value={product["Item Name"]} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="Company">Company</Label>
              <Input id="Company" name="Company" value={product.Company} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="Quantity">Quantity</Label>
              <Input id="Quantity" name="Quantity" type="number" value={product.Quantity} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="SKU">SKU</Label>
              <Input id="SKU" name="SKU" value={product.SKU} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="Unit Cost ($)">Unit Cost ($)</Label>
              <Input id="Unit Cost ($)" name="Unit Cost ($)" type="number" value={product["Unit Cost ($)"]} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="Lead Time (Days)">Lead Time (Days)</Label>
              <Input id="Lead Time (Days)" name="Lead Time (Days)" type="number" value={product["Lead Time (Days)"]} onChange={handleChange} required />
            </div>
            <div className="col-span-2">
              <Label htmlFor="Production Rate (Units/Day)">Production Rate (Units/Day)</Label>
              <Input id="Production Rate (Units/Day)" name="Production Rate (Units/Day)" type="number" value={product["Production Rate (Units/Day)"]} onChange={handleChange} required />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add Product</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
