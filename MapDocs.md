[Docs](https://react-leaflet.js.org/docs/start-installation/)

## Project Structure

```plaintext
my-nextjs-leaflet-app/
├── components/
│   └── RouteMap.jsx         # Client-side React-Leaflet map + route display
├── lib/
│   └── osrm.js              # Wrapper for OSRM Trip & Route API calls
├── pages/
│   ├── api/
│   │   └── optimize.js      # Next.js API route for optimization
│   └── index.jsx            # Home page rendering <RouteMap />
├── public/
│   └── markers/             # Custom marker icons (SVG/PNG)
├── styles/
│   └── globals.css
├── package.json
└── next.config.js
```

---

## 1. Install Dependencies

```bash
npm install leaflet react-leaflet leaflet-defaulticon-compatibility
```

> **Why these?**
>
> * `react-leaflet` is the de facto React wrapper for Leaflet.
> * `leaflet-defaulticon-compatibility` fixes icon-loading in modern bundlers.

---

## 2. OSRM Helper

**`lib/osrm.js`**

```js
const BASE = 'https://router.project-osrm.org';

export async function optimizeTrip(coords) {
  // coords: [[lng,lat],…]
  const coordStr = coords.map(c => c.join(',')).join(';');
  const url = `${BASE}/trip/v1/driving/${coordStr}?source=first&destination=last&roundtrip=false&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('OSRM trip failed');
  return res.json();
}

export async function getRoute(coords) {
  // coords ordered by optimized sequence
  const coordStr = coords.map(c => c.join(',')).join(';');
  const url = `${BASE}/route/v1/driving/${coordStr}?geometries=geojson&overview=full`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('OSRM route failed');
  return res.json();
}
```

---

## 3. API Route for Optimization

**`pages/api/optimize.js`**

```js
import { optimizeTrip, getRoute } from '../../lib/osrm';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { waypoints } = req.body; // [{ lng, lat }, …]
    const coords = waypoints.map(w => [w.lng, w.lat]);
    const trip = await optimizeTrip(coords);
    if (!trip.trips?.length) throw new Error('No trip');
    const order = trip.waypoints.map(wp => wp.waypoint_index);
    const orderedCoords = order.map(i => coords[i]);
    const route = await getRoute(orderedCoords);
    res.status(200).json({ geometry: route.routes[0].geometry, order });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
```

---

## 4. Client-Side Map Component

**`components/RouteMap.jsx`**

```jsx
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';

const { MapContainer, TileLayer, Marker, Popup, Polyline } = dynamic(
  () => import('react-leaflet'),
  { ssr: false }
);

export default function RouteMap() {
  const [route, setRoute] = useState(null);

  // Your custom locations
  const points = [
    { id: 1, title: 'Store A', coords: [12.9716, 77.5946] },
    { id: 2, title: 'Warehouse B', coords: [12.9352, 77.6245] },
    { id: 3, title: 'Office C', coords: [12.9500, 77.5800] },
  ];

  useEffect(() => {
    async function fetchOptimized() {
      const resp = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          waypoints: points.map(p => ({ lng: p.coords[1], lat: p.coords[0] }))
        }),
      });
      const json = await resp.json();
      if (json.geometry) {
        // OSRM GeoJSON LineString: { coordinates: [[lng,lat],…] }
        setRoute(json.geometry.coordinates.map(c => [c[1], c[0]]));
      }
    }
    fetchOptimized();
  }, []);

  return (
    <MapContainer
      center={points[0].coords}
      zoom={12}
      style={{ height: '600px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {points.map(p => (
        <Marker key={p.id} position={p.coords}>
          <Popup>{p.title}</Popup>
        </Marker>
      ))}

      {route && <Polyline positions={route} weight={4} opacity={0.8} />}
    </MapContainer>
  );
}
```

---

## 5. Home Page

**`pages/index.jsx`**

```jsx
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const RouteMap = dynamic(() => import('../components/RouteMap'), {
  ssr: false
});

export default function Home() {
  return (
    <div>
      <h1>My Stores & Warehouses (Leaflet Edition)</h1>
      <RouteMap />
    </div>
  );
}
```

---

### Why This Stack?

* **React-Leaflet** = full Leaflet power in React + Next.js (via `ssr: false`).
* **OSRM Trip API** = free, zero-setup routing optimization.
* **OSRM Route API** = instant GeoJSON path generation.
* **OpenStreetMap tiles** = completely free basemap.
* **Totally custom**: use your own coordinates for stores, warehouses, zones.

You’ll have a fully client-rendered, interactive map that:

1. Drops custom markers for each location
2. Calls your `/api/optimize` to solve the best visit order
3. Renders the optimized route as a polyline

No Mapbox account needed, and you control every piece. Let me know if you’d like to add clustering, custom icons, or drawing/edit tools!
