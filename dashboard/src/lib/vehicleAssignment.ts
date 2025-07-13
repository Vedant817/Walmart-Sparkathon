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

interface OrderForAssignment {
    orderId: string;
    customerLocation: string;
    priority: 'normal' | 'urgent';
    weight?: number;
    estimatedDistance?: number;
    deliveryType?: 'same_day' | 'next_day' | 'standard';
}

const mockFleetData: Vehicle[] = [
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

export class VehicleAssignmentService {
    private static instance: VehicleAssignmentService;
    private fleetData: Vehicle[] = [...mockFleetData];

    private constructor() { }

    public static getInstance(): VehicleAssignmentService {
        if (!VehicleAssignmentService.instance) {
            VehicleAssignmentService.instance = new VehicleAssignmentService();
        }
        return VehicleAssignmentService.instance;
    }

    public async assignVehicleToOrder(order: OrderForAssignment): Promise<{
        success: boolean;
        assignedVehicle?: Vehicle;
        message: string;
    }> {
        try {
            console.log(`[Vehicle Assignment] Processing order: ${order.orderId}`);

            const availableVehicles = await this.getAvailableVehicles();

            if (availableVehicles.length === 0) {
                return {
                    success: false,
                    message: 'No vehicles available for assignment'
                };
            }

            const bestVehicle = this.selectBestVehicle(availableVehicles, order);

            if (!bestVehicle) {
                return {
                    success: false,
                    message: 'No suitable vehicle found for this order'
                };
            }

            const assignmentResult = await this.assignVehicle(bestVehicle, order);

            if (assignmentResult.success) {
                console.log(`[Vehicle Assignment] Successfully assigned ${bestVehicle.name} to order ${order.orderId}`);
                return {
                    success: true,
                    assignedVehicle: bestVehicle,
                    message: `Order assigned to ${bestVehicle.name} (${bestVehicle.type})`
                };
            } else {
                return {
                    success: false,
                    message: assignmentResult.message
                };
            }

        } catch (error) {
            console.error('[Vehicle Assignment] Error:', error);
            return {
                success: false,
                message: 'Internal error during vehicle assignment'
            };
        }
    }

    private async getAvailableVehicles(): Promise<Vehicle[]> {
        try {
            const apiUrl = process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000/api/store/fleet'
                : '/api/store/fleet';

            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.vehicles) {
                    this.fleetData = data.vehicles;
                    console.log(`[Vehicle Assignment] Updated fleet data from API: ${this.fleetData.length} vehicles`);
                }
            } else {
                console.warn('[Vehicle Assignment] Failed to fetch fleet data from API, using cached data');
            }
        } catch (error) {
            console.warn('[Vehicle Assignment] Failed to fetch latest fleet data, using cached data:', error);
        }

        const availableVehicles = this.fleetData.filter(vehicle => {
            if (vehicle.status !== 'idle') {
                console.log(`[Vehicle Assignment] Vehicle ${vehicle.name} is ${vehicle.status}, not available`);
                return false;
            }

            if (vehicle.currentLoad && vehicle.capacity && vehicle.currentLoad >= vehicle.capacity) {
                console.log(`[Vehicle Assignment] Vehicle ${vehicle.name} is at capacity (${vehicle.currentLoad}/${vehicle.capacity})`);
                return false;
            }

            if (vehicle.battery !== undefined && vehicle.battery < 30) {
                console.log(`[Vehicle Assignment] Vehicle ${vehicle.name} has low battery (${vehicle.battery}%)`);
                return false;
            }

            console.log(`[Vehicle Assignment] Vehicle ${vehicle.name} is available`);
            return true;
        });

        console.log(`[Vehicle Assignment] Found ${availableVehicles.length} available vehicles out of ${this.fleetData.length} total`);
        return availableVehicles;
    }

    private selectBestVehicle(availableVehicles: Vehicle[], order: OrderForAssignment): Vehicle | null {
        const scoredVehicles = availableVehicles.map(vehicle => ({
            vehicle,
            score: this.calculateVehicleScore(vehicle, order)
        }));

        scoredVehicles.sort((a, b) => b.score - a.score);

        return scoredVehicles.length > 0 ? scoredVehicles[0].vehicle : null;
    }

    private calculateVehicleScore(vehicle: Vehicle, order: OrderForAssignment): number {
        let score = 0;

        switch (vehicle.type) {
            case 'drone':
                score += 10;
                break;
            case 'robot':
                score += 8;
                break;
            case 'vehicle':
                score += 6;
                break;
        }

        if (vehicle.battery !== undefined) {
            score += vehicle.battery / 10;
        }

        score += Math.min(vehicle.deliveriesCompleted / 10, 5);

        if (vehicle.capacity && vehicle.currentLoad !== undefined) {
            const utilizationRate = vehicle.currentLoad / vehicle.capacity;
            score += (1 - utilizationRate) * 5;
        }

        if (order.priority === 'urgent') {
            if (vehicle.type === 'drone') score += 15;
            else if (vehicle.type === 'robot') score += 10;
        }

        if (this.isLocationMatch(vehicle.location, order.customerLocation)) {
            score += 10;
        }

        return score;
    }

    private isLocationMatch(vehicleLocation: string, customerLocation: string): boolean {
        const vehicleLower = vehicleLocation.toLowerCase();
        const customerLower = customerLocation.toLowerCase();
        const commonKeywords = ['downtown', 'residential', 'zone', 'district', 'highway'];

        for (const keyword of commonKeywords) {
            if (vehicleLower.includes(keyword) && customerLower.includes(keyword)) {
                return true;
            }
        }

        return false;
    }

    private async assignVehicle(vehicle: Vehicle, order: OrderForAssignment): Promise<{
        success: boolean;
        message: string;
    }> {
        try {
            console.log(`[Vehicle Assignment] Attempting to assign ${vehicle.name} to order ${order.orderId}`);

            const apiUrl = process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000/api/store/fleet'
                : '/api/store/fleet';

            const response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    vehicleId: vehicle.id,
                    updates: {
                        status: 'active',
                        currentDelivery: order.orderId,
                        currentLoad: (vehicle.currentLoad || 0) + 1
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.error('[Vehicle Assignment] Fleet API update failed:', errorData);
                return {
                    success: false,
                    message: `Failed to update fleet management system: ${errorData.error || 'Unknown error'}`
                };
            }

            const responseData = await response.json();
            console.log('[Vehicle Assignment] Fleet API response:', responseData);

            const vehicleIndex = this.fleetData.findIndex(v => v.id === vehicle.id);
            if (vehicleIndex !== -1) {
                this.fleetData[vehicleIndex] = {
                    ...this.fleetData[vehicleIndex],
                    status: 'active',
                    currentDelivery: order.orderId,
                    currentLoad: (this.fleetData[vehicleIndex].currentLoad || 0) + 1
                };
                console.log(`[Vehicle Assignment] Local fleet data updated for vehicle ${vehicle.name}`);
            }

            console.log(`[Vehicle Assignment] Vehicle ${vehicle.name} successfully assigned to order ${order.orderId}`);

            return {
                success: true,
                message: 'Vehicle successfully assigned and fleet management updated'
            };

        } catch (error) {
            console.error('[Vehicle Assignment] Assignment error:', error);
            return {
                success: false,
                message: `Failed to assign vehicle: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    public getFleetStatus(): {
        total: number;
        active: number;
        idle: number;
        maintenance: number;
        charging: number;
    } {
        return {
            total: this.fleetData.length,
            active: this.fleetData.filter(v => v.status === 'active').length,
            idle: this.fleetData.filter(v => v.status === 'idle').length,
            maintenance: this.fleetData.filter(v => v.status === 'maintenance').length,
            charging: this.fleetData.filter(v => v.status === 'charging').length
        };
    }

    public async releaseVehicle(vehicleId: string): Promise<boolean> {
        try {
            const vehicleIndex = this.fleetData.findIndex(v => v.id === vehicleId);

            if (vehicleIndex !== -1) {
                this.fleetData[vehicleIndex] = {
                    ...this.fleetData[vehicleIndex],
                    status: 'idle',
                    currentDelivery: undefined,
                    currentLoad: Math.max((this.fleetData[vehicleIndex].currentLoad || 1) - 1, 0),
                    deliveriesCompleted: this.fleetData[vehicleIndex].deliveriesCompleted + 1
                };

                console.log(`[Vehicle Assignment] Vehicle ${vehicleId} released from assignment`);
                return true;
            }

            return false;
        } catch (error) {
            console.error('[Vehicle Assignment] Release error:', error);
            return false;
        }
    }
}

export const vehicleAssignmentService = VehicleAssignmentService.getInstance();