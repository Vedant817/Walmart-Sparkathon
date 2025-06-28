// OSRM (Open Source Routing Machine) API wrapper
// This helper provides functions to interact with the free OSRM routing service
// Documentation: http://project-osrm.org/docs/v5.24.0/api/

const OSRM_BASE_URL = 'https://router.project-osrm.org';

/**
 * Optimize the order of waypoints using OSRM Trip API
 * The Trip API solves the traveling salesman problem to find the optimal route
 * @param {Array} coords - Array of coordinates in [longitude, latitude] format
 * @returns {Object} - OSRM trip response with optimized waypoint order
 */
export async function optimizeTrip(coords) {
    try {
        // Convert coordinates array to the format OSRM expects: "lng,lat;lng,lat;..."
        const coordinateString = coords.map(coord => coord.join(',')).join(';');

        // Build the Trip API URL with parameters:
        // - source=first: start from the first waypoint
        // - destination=last: end at the last waypoint  
        // - roundtrip=false: don't return to starting point
        // - geometries=geojson: return route geometry in GeoJSON format
        const tripUrl = `${OSRM_BASE_URL}/trip/v1/driving/${coordinateString}?source=first&destination=last&roundtrip=false&geometries=geojson`;

        const response = await fetch(tripUrl);

        if (!response.ok) {
            throw new Error(`OSRM Trip API failed with status: ${response.status}`);
        }

        const tripData = await response.json();

        // Validate that we received a valid trip response
        if (!tripData.trips || tripData.trips.length === 0) {
            throw new Error('No valid trip found in OSRM response');
        }

        return tripData;
    } catch (error) {
        console.error('Error in optimizeTrip:', error);
        throw new Error(`Trip optimization failed: ${error.message}`);
    }
}

/**
 * Get detailed route geometry between ordered waypoints using OSRM Route API
 * This provides the actual path to follow on roads between locations
 * @param {Array} coords - Array of coordinates in optimal order [longitude, latitude]
 * @returns {Object} - OSRM route response with detailed geometry
 */
export async function getDetailedRoute(coords) {
    try {
        // Convert coordinates to OSRM format
        const coordinateString = coords.map(coord => coord.join(',')).join(';');

        // Build the Route API URL with parameters:
        // - geometries=geojson: return route geometry in GeoJSON format
        // - overview=full: include all geometry points for detailed route
        // - steps=true: include turn-by-turn directions (optional)
        const routeUrl = `${OSRM_BASE_URL}/route/v1/driving/${coordinateString}?geometries=geojson&overview=full&steps=true`;

        const response = await fetch(routeUrl);

        if (!response.ok) {
            throw new Error(`OSRM Route API failed with status: ${response.status}`);
        }

        const routeData = await response.json();

        // Validate that we received a valid route response
        if (!routeData.routes || routeData.routes.length === 0) {
            throw new Error('No valid route found in OSRM response');
        }

        return routeData;
    } catch (error) {
        console.error('Error in getDetailedRoute:', error);
        throw new Error(`Route generation failed: ${error.message}`);
    }
}

/**
 * Calculate estimated travel time and distance for a route
 * @param {Object} routeData - OSRM route response
 * @returns {Object} - Formatted duration and distance information
 */
export function formatRouteInfo(routeData) {
    if (!routeData.routes || routeData.routes.length === 0) {
        return { duration: 'N/A', distance: 'N/A' };
    }

    const route = routeData.routes[0];

    // Convert duration from seconds to hours and minutes
    const durationMinutes = Math.round(route.duration / 60);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    const durationText = hours > 0
        ? `${hours}h ${minutes}m`
        : `${minutes}m`;

    // Convert distance from meters to kilometers
    const distanceKm = (route.distance / 1000).toFixed(1);

    return {
        duration: durationText,
        distance: `${distanceKm} km`,
        rawDuration: route.duration,
        rawDistance: route.distance
    };
}