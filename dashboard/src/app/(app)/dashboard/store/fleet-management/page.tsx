'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Truck,
    Drone,
    Bot,
    MapPin,
    Battery,
    Clock,
    Package,
    Settings,
    Play,
    Pause,
    RotateCcw,
    X,
    Plus
} from 'lucide-react';

interface Vehicle {
    id: string;
    name: string;
    type: 'drone' | 'robot' | 'vehicle';
    status: 'active' | 'idle' | 'maintenance' | 'charging';
    battery?: number;
    location: string;
    currentDelivery?: string;
    deliveriesCompleted: number;
    lastMaintenance: string;
    capacity?: number;
    currentLoad?: number;
}

const getVehicleIcon = (type: string) => {
    switch (type) {
        case 'drone': return Drone;
        case 'robot': return Bot;
        case 'vehicle': return Truck;
        default: return Package;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'idle': return 'bg-yellow-100 text-yellow-800';
        case 'maintenance': return 'bg-red-100 text-red-800';
        case 'charging': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
    const Icon = getVehicleIcon(vehicle.type);

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-medium">{vehicle.name}</CardTitle>
                </div>
                <Badge className={getStatusColor(vehicle.status)}>
                    {vehicle.status}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{vehicle.location}</span>
                    </div>

                    {vehicle.battery !== undefined && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Battery className="h-4 w-4" />
                            <span>Battery: {vehicle.battery}%</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${vehicle.battery > 50 ? 'bg-green-500' : vehicle.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${vehicle.battery}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {vehicle.currentDelivery && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Package className="h-4 w-4" />
                            <span>Current: {vehicle.currentDelivery}</span>
                        </div>
                    )}

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Completed: {vehicle.deliveriesCompleted}</span>
                    </div>

                    <div className="flex space-x-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                            <Settings className="h-3 w-3 mr-1" />
                            Settings
                        </Button>
                        {vehicle.status === 'active' ? (
                            <Button size="sm" variant="outline">
                                <Pause className="h-3 w-3" />
                            </Button>
                        ) : vehicle.status === 'idle' ? (
                            <Button size="sm" variant="outline">
                                <Play className="h-3 w-3" />
                            </Button>
                        ) : (
                            <Button size="sm" variant="outline">
                                <RotateCcw className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

function AddVehicleModal({ isOpen, onClose, onAdd }: {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (vehicle: Omit<Vehicle, 'id' | 'deliveriesCompleted' | 'lastMaintenance'>) => void;
}) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'drone' as Vehicle['type'],
        status: 'idle' as Vehicle['status'],
        battery: 100,
        location: '',
        capacity: 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            ...formData,
            currentLoad: 0
        });
        setFormData({
            name: '',
            type: 'drone',
            status: 'idle',
            battery: 100,
            location: '',
            capacity: 1
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add New Vehicle</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Vehicle Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="e.g., SkyDelivery Gamma"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as Vehicle['type'] })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="drone">Drone</option>
                            <option value="robot">Robot</option>
                            <option value="vehicle">Vehicle</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="e.g., Hub Station"
                        />
                    </div>

                    {(formData.type === 'drone' || formData.type === 'robot') && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Battery Level (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.battery}
                                onChange={(e) => setFormData({ ...formData, battery: parseInt(e.target.value) })}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">Capacity</label>
                        <input
                            type="number"
                            min="1"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                            Add Vehicle
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function FleetManagementPage() {
    const [selectedType, setSelectedType] = useState<'all' | 'drone' | 'robot' | 'vehicle'>('all');
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

    const fetchFleetData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/store/fleet');
            const data = await response.json();

            if (data.success) {
                setVehicles(data.vehicles);
            } else {
                console.error('Failed to fetch fleet data:', data.error);
            }
        } catch (error) {
            console.error('Error fetching fleet data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFleetData();
        const interval = setInterval(fetchFleetData, 10000);

        return () => clearInterval(interval);
    }, []);

    const addVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'deliveriesCompleted' | 'lastMaintenance'>) => {
        try {
            setLoading(true);
            const newVehicle = {
                ...vehicleData,
                id: `${vehicleData.type.charAt(0).toUpperCase()}${String(Date.now()).slice(-3)}`,
                deliveriesCompleted: 0,
                lastMaintenance: new Date().toISOString().split('T')[0]
            };

            const response = await fetch('/api/store/fleet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ vehicle: newVehicle })
            });

            if (response.ok) {
                await fetchFleetData();
                console.log('Vehicle added successfully');
            } else {
                console.error('Failed to add vehicle');
            }
        } catch (error) {
            console.error('Error adding vehicle:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredVehicles = selectedType === 'all'
        ? vehicles
        : vehicles.filter(vehicle => vehicle.type === selectedType);

    const vehicleStats = {
        total: vehicles.length,
        active: vehicles.filter(v => v.status === 'active').length,
        idle: vehicles.filter(v => v.status === 'idle').length,
        maintenance: vehicles.filter(v => v.status === 'maintenance').length,
        charging: vehicles.filter(v => v.status === 'charging').length,
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
                    <p className="text-gray-600">Manage your delivery fleet of drones, robots, and vehicles</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={fetchFleetData} disabled={loading}>
                        <RotateCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button onClick={() => setShowAddVehicleModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Vehicle
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Package className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Fleet</p>
                                <p className="text-2xl font-bold">{vehicleStats.total}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Play className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active</p>
                                <p className="text-2xl font-bold text-green-600">{vehicleStats.active}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Pause className="h-5 w-5 text-yellow-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Idle</p>
                                <p className="text-2xl font-bold text-yellow-600">{vehicleStats.idle}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Settings className="h-5 w-5 text-red-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                                <p className="text-2xl font-bold text-red-600">{vehicleStats.maintenance}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Battery className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Charging</p>
                                <p className="text-2xl font-bold text-blue-600">{vehicleStats.charging}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex space-x-2">
                <Button
                    variant={selectedType === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedType('all')}
                >
                    All Vehicles
                </Button>
                <Button
                    variant={selectedType === 'drone' ? 'default' : 'outline'}
                    onClick={() => setSelectedType('drone')}
                >
                    <Drone className="h-4 w-4 mr-2" />
                    Drones
                </Button>
                <Button
                    variant={selectedType === 'robot' ? 'default' : 'outline'}
                    onClick={() => setSelectedType('robot')}
                >
                    <Bot className="h-4 w-4 mr-2" />
                    Robots
                </Button>
                <Button
                    variant={selectedType === 'vehicle' ? 'default' : 'outline'}
                    onClick={() => setSelectedType('vehicle')}
                >
                    <Truck className="h-4 w-4 mr-2" />
                    Vehicles
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Loading fleet data...</span>
                    </div>
                ) : filteredVehicles.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500">
                        No vehicles found
                    </div>
                ) : (
                    filteredVehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))
                )}
            </div>

            <AddVehicleModal
                isOpen={showAddVehicleModal}
                onClose={() => setShowAddVehicleModal(false)}
                onAdd={addVehicle}
            />
        </div>
    );
}