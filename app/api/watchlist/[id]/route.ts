import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  store.watchlist = store.watchlist.filter((w) => w.id !== id && w.parcelId !== id);
  return NextResponse.json({ success: true, message: 'Unsubscribed from parcel watchlist' });
}
