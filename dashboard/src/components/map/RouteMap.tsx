'use client';
import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';

const MapContainer = dynamic(() => import('react-leaflet').then(rl => rl.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(rl => rl.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(rl => rl.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(rl => rl.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(rl => rl.Polyline), { ssr: false });
const Tooltip = dynamic(() => import('react-leaflet').then(rl => rl.Tooltip), { ssr: false });

const BUSINESS_LOCATIONS = [
    {
        id: 'hq-001',
        title: 'Corporate Headquarters',
        description: 'Main office and administrative center',
        type: 'headquarters',
        coords: [12.9716, 77.5946],
        address: 'MG Road, Bangalore',
        priority: 'high'
    },
    {
        id: 'wh-002',
        title: 'Central Warehouse',
        description: 'Primary distribution center',
        type: 'warehouse',
        coords: [12.9352, 77.6245],
        address: 'Whitefield, Bangalore',
        priority: 'high'
    },
    {
        id: 'store-003',
        title: 'Retail Store - Koramangala',
        description: 'Customer service and retail outlet',
        type: 'retail',
        coords: [12.9352, 77.6245],
        address: 'Koramangala, Bangalore',
        priority: 'medium'
    },
    {
        id: 'store-004',
        title: 'Retail Store - Indiranagar',
        description: 'Premium retail location',
        type: 'retail',
        coords: [12.9719, 77.6413],
        address: 'Indiranagar, Bangalore',
        priority: 'medium'
    },
    {
        id: 'service-005',
        title: 'Service Center - Electronic City',
        description: 'Technical support and repairs',
        type: 'service',
        coords: [12.8456, 77.6603],
        address: 'Electronic City, Bangalore',
        priority: 'low'
    },
    {
        id: 'depot-006',
        title: 'Logistics Depot',
        description: 'Secondary distribution point',
        type: 'logistics',
        coords: [12.9698, 77.7500],
        address: 'Marathahalli, Bangalore',
        priority: 'medium'
    }
];

function getMarkerColor(type) {
    const colorMap = {
        headquarters: '#FF6B6B',
        warehouse: '#4ECDC4',
        retail: '#45B7D1',
        service: '#96CEB4',
        logistics: '#FFEAA7'
    } as const;
    return colorMap[type as keyof typeof colorMap] || '#95A5A6';
}

export default function RouteMap() {
    const [optimizedRoute, setOptimizedRoute] = useState<null | any>(null);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [routeInfo, setRouteInfo] = useState(null);
    const [error, setError] = useState(null);
    const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]);

    const optimizeSelectedRoute = useCallback(async () => {
        if (selectedLocations.length < 2) {
            setError('Please select at least 2 locations to optimize a route');
            return;
        }

        setIsOptimizing(true);
        setError(null);

        try {
            console.log('Starting route optimization for:', selectedLocations.map(loc => loc.title));

            const waypoints = selectedLocations.map(location => ({
                lng: location.coords[1],
                lat: location.coords[0],
                title: location.title,
                id: location.id
            }));

            const response = await fetch('/api/optimize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ waypoints }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to optimize route');
            }

            if (result.success && result.data) {
                const routeCoordinates = result.data.geometry.coordinates.map(coord => [coord[1], coord[0]]);

                setOptimizedRoute(routeCoordinates);
                setRouteInfo(result.data.routeInfo);

                console.log('Route optimization successful:', result.data.routeInfo);
            } else {
                throw new Error('Invalid response from optimization API');
            }

        } catch (error) {
            console.error('Route optimization failed:', error);
            setError(`Route optimization failed: ${error.message}`);
            setOptimizedRoute(null);
            setRouteInfo(null);
        } finally {
            setIsOptimizing(false);
        }
    }, [selectedLocations]);

    const toggleLocationSelection = useCallback((location) => {
        setSelectedLocations(prev => {
            const isSelected = prev.some(loc => loc.id === location.id);

            if (isSelected) {
                return prev.filter(loc => loc.id !== location.id);
            } else {
                return [...prev, location];
            }
        });

        setOptimizedRoute(null);
        setRouteInfo(null);
        setError(null);
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedLocations([]);
        setOptimizedRoute(null);
        setRouteInfo(null);
        setError(null);
    }, []);

    useEffect(() => {
        if (selectedLocations.length >= 2 && !isOptimizing) {
            const timeoutId = setTimeout(() => {
                optimizeSelectedRoute();
            }, 500);

            return () => clearTimeout(timeoutId);
        }
    }, [selectedLocations, optimizeSelectedRoute, isOptimizing]);

    return (
        <div className="route-map-container">
            <div className="map-controls">
                <h2>Supply Route</h2>
                <div className="location-selector">
                    <h3>Select Locations ({selectedLocations.length} selected)</h3>
                    <div className="location-grid">
                        {BUSINESS_LOCATIONS.map(location => (
                            <div
                                key={location.id}
                                className={`location-card ${selectedLocations.some(loc => loc.id === location.id) ? 'selected' : ''}`}
                                onClick={() => toggleLocationSelection(location)}
                                style={{ borderColor: getMarkerColor(location.type) }}
                            >
                                <div className="location-header">
                                    <h4>{location.title}</h4>
                                    <span className={`location-type ${location.type}`}>
                                        {location.type}
                                    </span>
                                </div>
                                <p>{location.description}</p>
                                <small>{location.address}</small>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="route-actions">
                    <button
                        onClick={optimizeSelectedRoute}
                        disabled={selectedLocations.length < 2 || isOptimizing}
                        className="optimize-btn"
                    >
                        {isOptimizing ? 'Optimizing Route...' : 'Optimize Route'}
                    </button>

                    <button
                        onClick={clearSelection}
                        className="clear-btn"
                    >
                        Clear Selection
                    </button>
                </div>

                {routeInfo && (
                    <div className="route-info">
                        <h3>Optimized Route Information</h3>
                        <div className="route-stats">
                            <div className="stat">
                                <span className="stat-label">Total Distance:</span>
                                <span className="stat-value">{routeInfo.distance}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Estimated Time:</span>
                                <span className="stat-value">{routeInfo.duration}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Waypoints:</span>
                                <span className="stat-value">{selectedLocations.length}</span>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        <h4>Error</h4>
                        <p>{error}</p>
                    </div>
                )}
            </div>

            <div className="map-wrapper">
                <MapContainer
                    center={mapCenter}
                    zoom={12}
                    style={{ height: '600px', width: '100%' }}
                    className="leaflet-container"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {BUSINESS_LOCATIONS.map(location => {
                        const isSelected = selectedLocations.some(loc => loc.id === location.id);

                        return (
                            <Marker
                                key={location.id}
                                position={location.coords}
                                eventHandlers={{
                                    click: () => toggleLocationSelection(location)
                                }}
                            >
                                <Popup>
                                    <div className="marker-popup">
                                        <h4>{location.title}</h4>
                                        <p>{location.description}</p>
                                        <p><strong>Type:</strong> {location.type}</p>
                                        <p><strong>Address:</strong> {location.address}</p>
                                        <p><strong>Priority:</strong> {location.priority}</p>
                                        <button
                                            onClick={() => toggleLocationSelection(location)}
                                            className={isSelected ? 'remove-btn' : 'add-btn'}
                                        >
                                            {isSelected ? 'Remove from Route' : 'Add to Route'}
                                        </button>
                                    </div>
                                </Popup>

                                <Tooltip permanent={isSelected}>
                                    {location.title} {isSelected ? '✓' : ''}
                                </Tooltip>
                            </Marker>
                        );
                    })}

                    {optimizedRoute && (
                        <Polyline
                            positions={optimizedRoute}
                            color="#FF6B6B"
                            weight={4}
                            opacity={0.8}
                            dashArray="5, 10"
                        />
                    )}
                </MapContainer>
            </div>
        </div>
    );
}