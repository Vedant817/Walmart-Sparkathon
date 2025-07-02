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
        id: 'store-001',
        title: 'Main Store - MG Road',
        description: 'Primary retail outlet and customer service center',
        type: 'store',
        coords: [12.9716, 77.5946], // MG Road, Bangalore
        address: 'MG Road, Bangalore',
        priority: 'high',
        capacity: 500
    },
    {
        id: 'store-002',
        title: 'Store - Koramangala',
        description: 'Secondary retail location',
        type: 'store',
        coords: [12.9352, 77.6245], // Koramangala, Bangalore
        address: 'Koramangala, Bangalore',
        priority: 'high',
        capacity: 300
    },
    {
        id: 'store-003',
        title: 'Store - Whitefield',
        description: 'East Bangalore retail outlet',
        type: 'store',
        coords: [12.9698, 77.7500], // Whitefield, Bangalore
        address: 'Whitefield, Bangalore',
        priority: 'medium',
        capacity: 250
    },

    // 12 Suppliers
    {
        id: 'supplier-001',
        title: 'Electronics Supplier - Electronic City',
        description: 'Consumer electronics and gadgets',
        type: 'supplier',
        coords: [12.8456, 77.6603], // Electronic City
        address: 'Electronic City, Bangalore',
        priority: 'high',
        category: 'Electronics'
    },
    {
        id: 'supplier-002',
        title: 'Textile Supplier - Chickpet',
        description: 'Clothing and fabric supplier',
        type: 'supplier',
        coords: [12.9698, 77.5830], // Chickpet
        address: 'Chickpet, Bangalore',
        priority: 'medium',
        category: 'Textiles'
    },
    {
        id: 'supplier-003',
        title: 'Food Supplier - Yeshwantpur',
        description: 'Packaged food and beverages',
        type: 'supplier',
        coords: [13.0280, 77.5540], // Yeshwantpur
        address: 'Yeshwantpur, Bangalore',
        priority: 'high',
        category: 'Food & Beverages'
    },
    {
        id: 'supplier-004',
        title: 'Furniture Supplier - Peenya',
        description: 'Home and office furniture',
        type: 'supplier',
        coords: [13.0290, 77.5200], // Peenya Industrial Area
        address: 'Peenya Industrial Area, Bangalore',
        priority: 'medium',
        category: 'Furniture'
    },
    {
        id: 'supplier-005',
        title: 'Cosmetics Supplier - Rajajinagar',
        description: 'Beauty and personal care products',
        type: 'supplier',
        coords: [12.9890, 77.5540], // Rajajinagar
        address: 'Rajajinagar, Bangalore',
        priority: 'medium',
        category: 'Cosmetics'
    },
    {
        id: 'supplier-006',
        title: 'Sports Goods - Jayanagar',
        description: 'Sports equipment and accessories',
        type: 'supplier',
        coords: [12.9250, 77.5830], // Jayanagar
        address: 'Jayanagar, Bangalore',
        priority: 'low',
        category: 'Sports'
    },
    {
        id: 'supplier-007',
        title: 'Books & Stationery - Basavanagudi',
        description: 'Educational and office supplies',
        type: 'supplier',
        coords: [12.9420, 77.5740], // Basavanagudi
        address: 'Basavanagudi, Bangalore',
        priority: 'low',
        category: 'Books & Stationery'
    },
    {
        id: 'supplier-008',
        title: 'Hardware Supplier - Bommanahalli',
        description: 'Tools and hardware equipment',
        type: 'supplier',
        coords: [12.9100, 77.6300], // Bommanahalli
        address: 'Bommanahalli, Bangalore',
        priority: 'medium',
        category: 'Hardware'
    },
    {
        id: 'supplier-009',
        title: 'Automotive Parts - Hosur Road',
        description: 'Vehicle parts and accessories',
        type: 'supplier',
        coords: [12.9000, 77.6100], // Hosur Road
        address: 'Hosur Road, Bangalore',
        priority: 'medium',
        category: 'Automotive'
    },
    {
        id: 'supplier-010',
        title: 'Pharmaceutical Supplier - Hebbal',
        description: 'Medical supplies and pharmaceuticals',
        type: 'supplier',
        coords: [13.0350, 77.5970], // Hebbal
        address: 'Hebbal, Bangalore',
        priority: 'high',
        category: 'Pharmaceuticals'
    },
    {
        id: 'supplier-011',
        title: 'Home Appliances - Marathahalli',
        description: 'Kitchen and home appliances',
        type: 'supplier',
        coords: [12.9590, 77.6970], // Marathahalli
        address: 'Marathahalli, Bangalore',
        priority: 'medium',
        category: 'Home Appliances'
    },
    {
        id: 'supplier-012',
        title: 'Organic Products - Ulsoor',
        description: 'Organic food and eco-friendly products',
        type: 'supplier',
        coords: [12.9810, 77.6090], // Ulsoor
        address: 'Ulsoor, Bangalore',
        priority: 'low',
        category: 'Organic Products'
    }
];

function getMarkerColor(type) {
    const colorMap = {
        store: '#FF6B6B',        // Red for stores
        supplier: '#4ECDC4',     // Teal for suppliers
    } as const;
    return colorMap[type as keyof typeof colorMap] || '#95A5A6';
}
e
function getMarkerIcon(type) {
    const iconMap = {
        store: '🏪',
        supplier: '🏭'
    };
    return iconMap[type] || '📍';
}

export default function RouteMap() {
    const [optimizedRoute, setOptimizedRoute] = useState<null | any>(null);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [routeInfo, setRouteInfo] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]);
    const [filterType, setFilterType] = useState('all');
    const [autoOptimize, setAutoOptimize] = useState(false); 

    const filteredLocations = BUSINESS_LOCATIONS.filter(location => {
        if (filterType === 'all') return true;
        return location.type === filterType;
    });

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

            console.log('Waypoints being sent:', waypoints);

            const response = await fetch('/api/optimize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ waypoints }),
            });

            console.log('Response status:', response.status);

            const result = await response.json();
            console.log('API Response:', result);

            if (!response.ok) {
                throw new Error(result.error || `HTTP ${response.status}: Failed to optimize route`);
            }

            if (result.success && result.data) {
                const routeCoordinates = result.data.geometry.coordinates.map(coord => [coord[1], coord[0]]);

                setOptimizedRoute(routeCoordinates);
                setRouteInfo(result.data.routeInfo);

                console.log('Route optimization successful:', result.data.routeInfo);
            } else {
                throw new Error(result.error || 'Invalid response from optimization API');
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

    const selectAllStores = useCallback(() => {
        const stores = BUSINESS_LOCATIONS.filter(loc => loc.type === 'store');
        setSelectedLocations(stores);
    }, []);

    const selectHighPrioritySuppliers = useCallback(() => {
        const highPrioritySuppliers = BUSINESS_LOCATIONS.filter(
            loc => loc.type === 'supplier' && loc.priority === 'high'
        );
        setSelectedLocations(prev => [...prev, ...highPrioritySuppliers.filter(
            supplier => !prev.some(selected => selected.id === supplier.id)
        )]);
    }, [selectedLocations]);

    const handleOptimizeClick = useCallback(() => {
        optimizeSelectedRoute();
    }, [optimizeSelectedRoute]);

    useEffect(() => {
        if (selectedLocations.length >= 2 && !isOptimizing && autoOptimize) {
            const timeoutId = setTimeout(() => {
                optimizeSelectedRoute();
            }, 500);

            return () => clearTimeout(timeoutId);
        }
    }, [selectedLocations, optimizeSelectedRoute, isOptimizing, autoOptimize]);

    return (
        <div className="route-map-container">
            <div className="map-controls">
                <h2>Supply Chain Route Optimizer</h2>
                
                <div className="filter-controls">
                    <h3>Filter Locations</h3>
                    <div className="filter-buttons">
                        <button 
                            className={filterType === 'all' ? 'active' : ''}
                            onClick={() => setFilterType('all')}
                        >
                            All ({BUSINESS_LOCATIONS.length})
                        </button>
                        <button 
                            className={filterType === 'store' ? 'active' : ''}
                            onClick={() => setFilterType('store')}
                        >
                            Stores (3)
                        </button>
                        <button 
                            className={filterType === 'supplier' ? 'active' : ''}
                            onClick={() => setFilterType('supplier')}
                        >
                            Suppliers (12)
                        </button>
                    </div>
                </div>

                <div className="quick-selection">
                    <h3>Quick Selection</h3>
                    <div className="quick-buttons">
                        <button onClick={selectAllStores}>
                            Select All Stores
                        </button>
                        <button onClick={selectHighPrioritySuppliers}>
                            Add High Priority Suppliers
                        </button>
                    </div>
                </div>

                <div className="location-selector">
                    <h3>Select Locations ({selectedLocations.length} selected)</h3>
                    <div className="location-grid">
                        {filteredLocations.map(location => (
                            <div
                                key={location.id}
                                className={`location-card ${selectedLocations.some(loc => loc.id === location.id) ? 'selected' : ''} ${location.type}`}
                                onClick={() => toggleLocationSelection(location)}
                                style={{ borderColor: getMarkerColor(location.type) }}
                            >
                                <div className="location-header">
                                    <h4>{getMarkerIcon(location.type)} {location.title}</h4>
                                    <span className={`location-type ${location.type}`}>
                                        {location.type}
                                    </span>
                                    <span className={`priority ${location.priority}`}>
                                        {location.priority}
                                    </span>
                                </div>
                                <p>{location.description}</p>
                                {location.category && (
                                    <p><strong>Category:</strong> {location.category}</p>
                                )}
                                {location.capacity && (
                                    <p><strong>Capacity:</strong> {location.capacity} units</p>
                                )}
                                <small>{location.address}</small>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="route-actions">
                    <button
                        onClick={handleOptimizeClick}
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

                <div className="auto-optimize-control">
                    <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        padding: '10px',
                        background: '#f8f9fa',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        cursor: 'pointer'
                    }}>
                        <input
                            type="checkbox"
                            checked={autoOptimize}
                            onChange={(e) => setAutoOptimize(e.target.checked)}
                            style={{ cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                            🔄 Auto-optimize when selecting locations
                        </span>
                    </label>
                    {autoOptimize && (
                        <small style={{ 
                            color: '#6c757d', 
                            fontSize: '12px',
                            display: 'block',
                            marginTop: '4px',
                            fontStyle: 'italic'
                        }}>
                            Route will automatically optimize 500ms after selection changes
                        </small>
                    )}
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
                            <div className="stat">
                                <span className="stat-label">Stores:</span>
                                <span className="stat-value">
                                    {selectedLocations.filter(loc => loc.type === 'store').length}
                                </span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Suppliers:</span>
                                <span className="stat-value">
                                    {selectedLocations.filter(loc => loc.type === 'supplier').length}
                                </span>
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
                    zoom={11}
                    style={{ height: '600px', width: '100%' }}
                    className="leaflet-container"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {filteredLocations.map(location => {
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
                                        <h4>{getMarkerIcon(location.type)} {location.title}</h4>
                                        <p>{location.description}</p>
                                        <p><strong>Type:</strong> {location.type}</p>
                                        {location.category && (
                                            <p><strong>Category:</strong> {location.category}</p>
                                        )}
                                        {location.capacity && (
                                            <p><strong>Capacity:</strong> {location.capacity} units</p>
                                        )}
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
                                    {getMarkerIcon(location.type)} {location.title} {isSelected ? '✓' : ''}
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
