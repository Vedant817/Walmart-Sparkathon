import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { waypoints } = await req.json();

  if (!waypoints || waypoints.length < 2) {
    return NextResponse.json({ error: 'Not enough waypoints' }, { status: 400 });
  }

//TODO: Implement route optimization logic here
  const routeData = {
    geometry: {
      coordinates: waypoints.map((wp: any) => [wp.lng, wp.lat]),
    },
    routeInfo: {
      distance: '10 km',
      duration: '20 mins',
    },
  };

  return NextResponse.json({ success: true, data: routeData });
}