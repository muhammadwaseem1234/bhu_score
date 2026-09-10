import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const parcel = store.parcels.find(
    (p) => p.id === id || p.ulpin.toLowerCase() === id.toLowerCase()
  );

  if (!parcel) {
    return NextResponse.json(
      { error: 'Land parcel record not found in National Registry' },
      { status: 404 }
    );
  }

  return NextResponse.json(parcel);
}
