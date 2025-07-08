import { BUSINESS_LOCATIONS } from '@/constants/locations';
import { Card, CardContent} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Navigation, Store, Clock } from 'lucide-react';
import { useState, useMemo } from 'react';

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

interface SupplierMapSidebarProps {
  selectedStoreId: string | null;
  onSelectStore: (storeId: string | null) => void;
}

export default function SupplierMapSidebar({ selectedStoreId, onSelectStore }: SupplierMapSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const stores = BUSINESS_LOCATIONS.filter(loc => loc.type === 'store');
  const currentSupplier = BUSINESS_LOCATIONS.find(loc => loc.id === 'supplier-001');

  const filteredStores = useMemo(() => {
    if (!searchTerm) return stores;
    return stores.filter(store => 
      store.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stores, searchTerm]);

  const sortedStores = useMemo(() => {
    if (!currentSupplier) return filteredStores;
    return filteredStores.sort((a, b) => {
      const distanceA = getDistance(
        currentSupplier.coords[0], currentSupplier.coords[1],
        a.coords[0], a.coords[1]
      );
      const distanceB = getDistance(
        currentSupplier.coords[0], currentSupplier.coords[1],
        b.coords[0], b.coords[1]
      );
      return distanceA - distanceB;
    });
  }, [filteredStores, currentSupplier]);

  return (
    <div className="w-90 h-full bg-white border-r border-gray-200 shadow-lg flex flex-col">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Navigation className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Route Planning</h2>
            <p className="text-sm text-gray-600">Select destination store</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {currentSupplier && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <MapPin className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Current Location</p>
              <p className="text-xs text-gray-600 truncate">{currentSupplier.title}</p>
            </div>
          </div>
        </div>
      )}

      <ScrollArea className="h-[430px]">
        <div className="p-4 space-y-3">
          {selectedStoreId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectStore(null)}
              className="w-full mb-4 text-gray-600 hover:text-gray-900"
            >
              Clear Selection
            </Button>
          )}
          {sortedStores.map((store, index) => {
            const distance = currentSupplier ? getDistance(
              currentSupplier.coords[0],
              currentSupplier.coords[1],
              store.coords[0],
              store.coords[1]
            ).toFixed(2) : 'N/A';
            const isSelected = selectedStoreId === store.id;
            const estimatedTime = Math.round(parseFloat(distance) * 2);
            return (
              <Card
                key={store.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                    : 'hover:border-gray-300 border-gray-200'
                }`}
                onClick={() => onSelectStore(store.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Store className={`h-4 w-4 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                      <h3 className={`font-medium text-sm ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                        {store.title}
                      </h3>
                    </div>
                    <Badge 
                      variant={index === 0 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      #{index + 1}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {store.address}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span>{distance} km</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>~{estimatedTime} min</span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <div className="flex items-center gap-2 text-xs text-blue-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span>Route selected</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {filteredStores.length === 0 && (
            <div className="text-center py-8">
              <Store className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No stores found</p>
              <p className="text-gray-400 text-xs">Try adjusting your search</p>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{filteredStores.length} store{filteredStores.length !== 1 ? 's' : ''} available</span>
          {selectedStoreId && (
            <span className="text-blue-600 font-medium">Route active</span>
          )}
        </div>
      </div>
    </div>
  );
}
