import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { alertId } = body;
    if (alertId) {
      store.alerts = store.alerts.map((a) => (a.id === alertId ? { ...a, isRead: true } : a));
    } else {
      store.alerts = store.alerts.map((a) => ({ ...a, isRead: true }));
    }
    return NextResponse.json({ success: true, alerts: store.alerts });
  } catch {
    store.alerts = store.alerts.map((a) => ({ ...a, isRead: true }));
    return NextResponse.json({ success: true, alerts: store.alerts });
  }
}
