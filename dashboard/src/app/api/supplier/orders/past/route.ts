import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Implement supplier past orders logic
    return NextResponse.json({ 
      success: true, 
      orders: [],
      message: 'Past orders endpoint - implementation pending'
    });
  } catch (error) {
    console.error('Error fetching past supplier orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch past orders' },
      { status: 500 }
    );
  }
}
