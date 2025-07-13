import { NextRequest, NextResponse } from 'next/server';

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

const fleetDataStore: Vehicle[] = [
    {
        id: 'D001',
        name: 'SkyDelivery Alpha',
        type: 'drone',
        status: 'idle',
        battery: 85,
        location: 'Zone A - Residential',
        deliveriesCompleted: 23,
        lastMaintenance: '2024-01-10',
        capacity: 1,
        currentLoad: 0
    },
    {
        id: 'D002',
        name: 'SkyDelivery Beta',
        type: 'drone',
        status: 'idle',
        battery: 92,
        location: 'Hub Station',
        deliveriesCompleted: 31,
        lastMaintenance: '2024-01-12',
        capacity: 1,
        currentLoad: 0
    },
    {
        id: 'R001',
        name: 'GroundBot Alpha',
        type: 'robot',
        status: 'idle',
        battery: 78,
        location: 'Downtown District',
        deliveriesCompleted: 45,
        lastMaintenance: '2024-01-09',
        capacity: 2,
        currentLoad: 0
    },
    {
        id: 'V001',
        name: 'Delivery Van Alpha',
        type: 'vehicle',
        status: 'idle',
        location: 'Highway Route 1',
        deliveriesCompleted: 156,
        lastMaintenance: '2024-01-05',
        capacity: 10,
        currentLoad: 0
    },
    {
        id: 'V002',
        name: 'Delivery Van Beta',
        type: 'vehicle',
        status: 'idle',
        location: 'Parking Lot B',
        deliveriesCompleted: 142,
        lastMaintenance: '2024-01-11',
        capacity: 10,
        currentLoad: 0
    }
];

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const vehicleId = searchParams.get('vehicleId');

        if (vehicleId) {
            const vehicle = fleetDataStore.find(v => v.id === vehicleId);
            if (!vehicle) {
                return NextResponse.json(
                    { success: false, error: 'Vehicle not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json({ success: true, vehicle });
        } else {
            return NextResponse.json({ success: true, vehicles: fleetDataStore });
        }
    } catch (error) {
        console.error('Error fetching fleet data:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch fleet data' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { vehicle } = body;

        if (!vehicle) {
            return NextResponse.json(
                { success: false, error: 'Vehicle data is required' },
                { status: 400 }
            );
        }

        fleetDataStore.push(vehicle);

        console.log(`[Fleet Management] New vehicle added: ${vehicle.name} (${vehicle.id})`);

        return NextResponse.json({
            success: true,
            message: 'Vehicle added successfully',
            vehicle: vehicle
        });

    } catch (error) {
        console.error('Error adding vehicle:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to add vehicle' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { vehicleId, updates } = body;

        if (!vehicleId) {
            return NextResponse.json(
                { success: false, error: 'Vehicle ID is required' },
                { status: 400 }
            );
        }

        const vehicleIndex = fleetDataStore.findIndex(v => v.id === vehicleId);
        if (vehicleIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'Vehicle not found' },
                { status: 404 }
            );
        }

        fleetDataStore[vehicleIndex] = {
            ...fleetDataStore[vehicleIndex],
            ...updates
        };

        console.log(`[Fleet Management] Vehicle ${vehicleId} updated:`, updates);

        return NextResponse.json({
            success: true,
            message: 'Vehicle updated successfully',
            vehicle: fleetDataStore[vehicleIndex]
        });

    } catch (error) {
        console.error('Error updating vehicle:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update vehicle' },
            { status: 500 }
        );
    }
}

// Note: If fleet management utilities are needed in other files,
// they should be implemented in a separate utility file like @/lib/fleet.ts
