import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { waypoints } = await request.json();
        
        console.log('Received waypoints:', waypoints); 
        
        if (!waypoints || waypoints.length < 2) {
            return NextResponse.json({
                success: false,
                error: 'At least 2 waypoints are required'
            }, { status: 400 });
        }

        for (const wp of waypoints) {
            if (!wp.lng || !wp.lat || isNaN(wp.lng) || isNaN(wp.lat)) {
                return NextResponse.json({
                    success: false,
                    error: 'Invalid coordinates provided'
                }, { status: 400 });
            }
        }

        const mockGeometry = {
            coordinates: waypoints.map((wp: { lng: number; lat: number; }) => [wp.lng, wp.lat])
        };

        if (waypoints.length > 1) {
            const allCoords = [];
            for (let i = 0; i < waypoints.length - 1; i++) {
                const start = waypoints[i];
                const end = waypoints[i + 1];
                
                allCoords.push([start.lng, start.lat]);
                
                const midLng = (start.lng + end.lng) / 2;
                const midLat = (start.lat + end.lat) / 2;
                allCoords.push([midLng, midLat]);
            }
            allCoords.push([waypoints[waypoints.length - 1].lng, waypoints[waypoints.length - 1].lat]);
            
            mockGeometry.coordinates = allCoords;
        }

        const totalDistance = calculateMockDistance(waypoints);
        const estimatedDuration = Math.round(totalDistance * 2); 

        return NextResponse.json({
            success: true,
            data: {
                geometry: mockGeometry,
                routeInfo: {
                    distance: `${totalDistance.toFixed(2)} km`,
                    duration: `${estimatedDuration} minutes`,
                    optimized: waypoints.length > 2
                }
            }
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            success: false,
            error: `Server error: ${error instanceof Error ? error.message : "Map Route Error"}`
        }, { status: 500 });
    }
}

function calculateMockDistance(waypoints: { lat: number; lng: number }[]) {
    let totalDistance = 0;
    
    for (let i = 0; i < waypoints.length - 1; i++) {
        const lat1 = waypoints[i].lat;
        const lng1 = waypoints[i].lng;
        const lat2 = waypoints[i + 1].lat;
        const lng2 = waypoints[i + 1].lng;
        
        const R = 6371; 
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        totalDistance += distance;
    }
    
    return totalDistance;
}