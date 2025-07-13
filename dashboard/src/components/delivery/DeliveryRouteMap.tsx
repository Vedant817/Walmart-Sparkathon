/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Route, Zap, RefreshCw } from 'lucide-react';
import { getDetailedRoute } from '@/lib/osrm';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);

// Import Leaflet dynamically for client-side only
let L: any = null;
if (typeof window !== 'undefined') {
  L = require('leaflet');
  require('leaflet/dist/leaflet.css');
  
  // Fix for default markers in react-leaflet
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}

interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface DeliveryRouteMapProps {
  storeLocation: Location;
  destinationLocation: Location;
  vehicleLocation?: Location;
  routeType: 'normal' | 'alternate';
  alternateReason?: string;
  vehicleType: 'drone' | 'robot' | 'vehicle';
  className?: string;
}

export default function DeliveryRouteMap({ 
  storeLocation, 
  destinationLocation, 
  vehicleLocation, 
  routeType, 
  alternateReason, 
  vehicleType,
  className 
}: DeliveryRouteMapProps) {
  const [routeGeometry, setRouteGeometry] = useState<[number, number][]>([]);
  const [alternateGeometry, setAlternateGeometry] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Ensure component is mounted (client-side)
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Store and destination coordinates
  const storeCoords: [number, number] = [storeLocation.lat, storeLocation.lng];
  const destCoords: [number, number] = [destinationLocation.lat, destinationLocation.lng];
  
  // Vehicle position
  const getVehiclePosition = (): [number, number] => {
    if (vehicleLocation) {
      return [vehicleLocation.lat, vehicleLocation.lng];
    }
    
    if (routeGeometry.length === 0) {
      return storeCoords;
    }
    
    // Simulate vehicle at 40% progress along the route if no specific location provided
    const progressIndex = Math.floor(routeGeometry.length * 0.4);
    return routeGeometry[progressIndex] || storeCoords;
  };
  
  // Fetch real routes using OSRM
  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      try {
        // Get coordinates in [lng, lat] format for OSRM
        const storeOsrmCoords: [number, number] = [storeCoords[1], storeCoords[0]];
        const destOsrmCoords: [number, number] = [destCoords[1], destCoords[0]];
        
        // Fetch the optimal route
        const routeResponse: any = await getDetailedRoute([storeOsrmCoords, destOsrmCoords]);
        
        if (routeResponse && Array.isArray(routeResponse.routes) && routeResponse.routes.length > 0) {
          const route = routeResponse.routes[0];
          
          // Convert coordinates from [lng, lat] to [lat, lng] for Leaflet
          const geometry: [number, number][] = route.geometry.coordinates
            .filter((coord: number[]) => coord.length >= 2)
            .map((coord: number[]) => [coord[1], coord[0]] as [number, number]);
          
          setRouteGeometry(geometry);
          
          // Generate alternate route if there's a route issue
          if (routeType === 'alternate') {
            // Create a slightly offset alternate route to simulate traffic avoidance
            const alternateRoute = geometry.map((coord, index, arr) => {
              const progress = index / (arr.length - 1);
              const offset = Math.sin(progress * Math.PI) * 0.003; // Smaller offset for realism
              const p1 = arr[index];
              const p2 = index < arr.length - 1 ? arr[index + 1] : p1;
              const angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
              const perpAngle = angle + Math.PI / 2;
              
              return [
                coord[0] + offset * Math.cos(perpAngle),
                coord[1] + offset * Math.sin(perpAngle),
              ] as [number, number];
            });
            
            setAlternateGeometry(alternateRoute);
          }
        }
      } catch (error) {
        console.error('Error fetching route:', error);
        // Fallback to straight line if OSRM fails
        setRouteGeometry([storeCoords, destCoords]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoutes();
  }, [routeType]);
  
  // Custom icons - only create if client-side and L is available
  const storeIcon = useMemo(() => {
    if (!L || !mounted) return null;
    return new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }, [mounted]);
  
  const destinationIcon = useMemo(() => {
    if (!L || !mounted) return null;
    return new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }, [mounted]);
  
  const vehicleIcon = useMemo(() => {
    if (!L || !mounted) return null;
    const emoji = vehicleType === 'drone' ? '🚁' : 
                 vehicleType === 'robot' ? '🤖' : '🚐';
    
    return new L.DivIcon({
      className: 'vehicle-marker',
      html: `<div style="background: #8b5cf6; color: white; padding: 4px 8px; border-radius: 50%; font-size: 16px; text-align: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${emoji}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  }, [vehicleType, mounted]);
  
  // Calculate center point between store and destination
  const centerLat = (storeCoords[0] + destCoords[0]) / 2;
  const centerLng = (storeCoords[1] + destCoords[1]) / 2;
  
  // Don't render until mounted on client side
  if (!mounted) {
    return (
      <div className="p-4 bg-slate-50 rounded-lg">
        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
          <Route className="w-5 h-5 text-slate-600" />
          Delivery Route Optimization
        </h3>
        <div className="w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Loading map...</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-slate-50 rounded-lg">
      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
        <Route className="w-5 h-5 text-slate-600" />
        Delivery Route Optimization
      </h3>
      
      {/* Route Status Banner */}
      {routeType === 'alternate' && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="font-medium text-yellow-800">Alternative Route Selected</span>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            <strong>Reason:</strong> {alternateReason}
          </p>
        </div>
      )}
      
      {routeType === 'normal' && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-800">Optimal Route Active</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Using the fastest and most efficient path to destination.
          </p>
        </div>
      )}
      
      {/* Leaflet Map */}
      <div className="w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
        {loading ? (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Loading route...</span>
            </div>
          </div>
        ) : (
          <MapContainer
            center={[centerLat, centerLng]}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Store Marker */}
            {storeIcon && (
              <Marker position={storeCoords} icon={storeIcon}>
                <Popup>
                  <strong>MG Road Store</strong><br />
                  Pickup Location
                </Popup>
              </Marker>
            )}
            
            {/* Destination Marker */}
            {destinationIcon && (
              <Marker position={destCoords} icon={destinationIcon}>
                <Popup>
                  <strong>Delivery Destination</strong><br />
                  {destinationLocation.name}
                </Popup>
              </Marker>
            )}
            
            {/* Optimal Route */}
            {routeGeometry.length > 0 && (
              <Polyline
                positions={routeGeometry}
                color={routeType === 'normal' ? '#10b981' : '#22c55e'}
                weight={4}
                opacity={0.8}
              />
            )}
            
            {/* Alternative Route (if applicable) */}
            {routeType === 'alternate' && alternateGeometry.length > 0 && (
              <Polyline
                positions={alternateGeometry}
                color="#f59e0b"
                weight={4}
                opacity={0.7}
                dashArray="10, 10"
              />
            )}
            
            {/* Vehicle Position */}
            {vehicleLocation && (
              <Marker position={getVehiclePosition()} icon={vehicleIcon}>
                <Popup>
                  <strong>Vehicle Position</strong><br />
                  Type: {vehicleType}<br />
                  Status: In Transit
                </Popup>
              </Marker>
            )}
          </MapContainer>
        )}
      </div>
      
      {/* Route Summary */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <p>
            <strong>Route Type:</strong>
            <Badge className={`ml-2 ${routeType === 'alternate' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
              {routeType === 'alternate' ? 'Alternative' : 'Optimal'}
            </Badge>
          </p>
          <p><strong>Vehicle:</strong> {vehicleType}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-gray-700">{storeLocation.name}</span>
            <Badge variant="outline" className="text-xs">Start</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-gray-700">{destinationLocation.name}</span>
            <Badge variant="outline" className="text-xs">Destination</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
