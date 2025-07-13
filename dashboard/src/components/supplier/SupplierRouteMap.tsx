import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState, useMemo } from 'react';
import { BUSINESS_LOCATIONS } from '@/constants/locations';
import { getDetailedRoute } from '@/lib/osrm';

interface LeafletIconDefault extends L.Icon.Default {
    _getIconUrl?: () => string;
}

delete (L.Icon.Default.prototype as LeafletIconDefault)._getIconUrl;
(L.Icon.Default as typeof L.Icon.Default & { mergeOptions: (options: object) => void }).mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const yellowCheckpointIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface Route {
    geometry: {
        coordinates: number[][];
    };
    duration: number;
    distance: number;
}

interface RouteResponse {
    routes: Route[];
}

interface RouteData {
    geometry: [number, number][];
    duration: number;
    distance: number;
    isHighTraffic: boolean;
    storeId: string;
    type: 'best' | 'highTraffic';
}

interface SupplierRouteMapProps {
    selectedStoreId: string | null;
}

export default function SupplierRouteMap({ selectedStoreId }: SupplierRouteMapProps) {
    const [routes, setRoutes] = useState<RouteData[]>([]);
    const [loading, setLoading] = useState(true);  // Added for better UX

    // Memoize constants to prevent recreation
    const currentSupplier = useMemo(() => 
        BUSINESS_LOCATIONS.find(loc => loc.id === 'supplier-001'), 
    []);
    const allStores = useMemo(() => 
        BUSINESS_LOCATIONS.filter(loc => loc.type === 'store'), 
    []);

    const displayedStores = useMemo(() => {
        if (selectedStoreId) {
            return allStores.filter(store => store.id === selectedStoreId);
        } else {
            return allStores;
        }
    }, [selectedStoreId, allStores]);

    useEffect(() => {
        const fetchRoutes = async () => {
            setLoading(true);
            if (!currentSupplier || !selectedStoreId) {
                if (routes.length > 0) setRoutes([]);  // Only update if necessary
                setLoading(false);
                return;
            }

            const store = allStores.find(s => s.id === selectedStoreId);
            if (!store) {
                setLoading(false);
                return;
            }

            const supplierCoords: [number, number] = [currentSupplier.coords[1], currentSupplier.coords[0]];
            const storeCoords: [number, number] = [store.coords[1], store.coords[0]];

            try {
                const routeResponse = await getDetailedRoute([supplierCoords, storeCoords]) as RouteResponse;
                const newRoutes: RouteData[] = [];

                if (routeResponse.routes && routeResponse.routes.length > 0) {
                    // ... (rest of your route processing logic remains unchanged)
                }
                setRoutes(newRoutes);
            } catch (error) {
                console.error(`Error fetching routes from ${currentSupplier.title} to ${store.title}:`, error);
                setRoutes([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRoutes();
    }, [currentSupplier, selectedStoreId, allStores, routes.length]);  // Added routes.length to track changes

    if (loading) {
        return <div>Loading map...</div>;
    }

    if (!currentSupplier) {
        return <div>No supplier data available.</div>;
    }

    const center: [number, number] = [currentSupplier.coords[0], currentSupplier.coords[1]];
    return (
        <MapContainer center={center} zoom={13} style={{ height: '90vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={center} icon={yellowCheckpointIcon}>
                <Popup>
                    <strong>{currentSupplier.title}</strong><br />
                    {currentSupplier.address}
                </Popup>
            </Marker>
            {displayedStores.map(store => (
                <Marker key={store.id} position={[store.coords[0], store.coords[1]]}>
                    <Popup>
                        <strong>{store.title}</strong><br />
                        {store.address}
                    </Popup>
                </Marker>
            ))}

            {routes.map((route) => {
                const midIndex = Math.floor(route.geometry.length / 2);
                const popupPosition = route.geometry[midIndex];
                return (
                    <div key={`${route.storeId}-${route.type}`}>
                        <Polyline
                            positions={route.geometry}
                            color={route.type === 'best' ? '#22c55e' : '#ef4444'}
                            weight={4}
                            opacity={0.8}
                            dashArray={route.type === 'highTraffic' ? '10, 10' : undefined}
                        />
                        <Marker
                            position={popupPosition}
                            icon={L.divIcon({
                                className: 'route-info-popup',
                                html: `<div style="background: ${route.type === 'best' ? '#22c55e' : '#ef4444'}; color: white; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2); white-space: nowrap; border: 2px solid white;">
                                    <div>${route.type === 'best' ? '🚀 Best Route' : '🚦 High Traffic Route'}</div>
                                    <div>📏 ${(route.distance / 1000).toFixed(2)} km</div>
                                    <div>⏱️ ${(route.duration / 60).toFixed(0)} min</div>
                                </div>`,
                                iconSize: [120, 60],
                                iconAnchor: [60, 30]
                            })}
                        />
                    </div>
                );
            })}
        </MapContainer>
    );
}