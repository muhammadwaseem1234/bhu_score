import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { WatchlistSubscription } from '@/src/types';

export async function GET() {
  return NextResponse.json(store.watchlist);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      parcelId,
      notificationEmail,
      webhookUrl,
      alertOnLitigation,
      alertOnMortgage,
      alertOnRegistration,
      alertOnPublicNotice,
    } = body;

    const parcel = store.parcels.find((p) => p.id === parcelId);
    if (!parcel) {
      return NextResponse.json({ error: 'Parcel not found' }, { status: 404 });
    }

    const existingIndex = store.watchlist.findIndex((w) => w.parcelId === parcelId);
    if (existingIndex >= 0) {
      store.watchlist[existingIndex] = {
        ...store.watchlist[existingIndex],
        notificationEmail: notificationEmail || store.watchlist[existingIndex].notificationEmail,
        webhookUrl: webhookUrl ?? store.watchlist[existingIndex].webhookUrl,
        alertOnLitigation: alertOnLitigation ?? store.watchlist[existingIndex].alertOnLitigation,
        alertOnMortgage: alertOnMortgage ?? store.watchlist[existingIndex].alertOnMortgage,
        alertOnRegistration: alertOnRegistration ?? store.watchlist[existingIndex].alertOnRegistration,
        alertOnPublicNotice: alertOnPublicNotice ?? store.watchlist[existingIndex].alertOnPublicNotice,
      };
      return NextResponse.json(store.watchlist[existingIndex]);
    }

    const newSub: WatchlistSubscription = {
      id: `SUB-${Date.now()}`,
      parcelId: parcel.id,
      ulpin: parcel.ulpin,
      surveyNo: parcel.stateSurveyNo,
      village: `${parcel.villageName}, ${parcel.talukTehsil}`,
      state: parcel.state,
      currentScore: parcel.bhuScore,
      riskGrade: parcel.grade,
      subscribedAt: new Date().toISOString(),
      alertOnLitigation: alertOnLitigation ?? true,
      alertOnMortgage: alertOnMortgage ?? true,
      alertOnRegistration: alertOnRegistration ?? true,
      alertOnPublicNotice: alertOnPublicNotice ?? true,
      notificationEmail: notificationEmail || 'risk-desk@bureau.in',
      webhookUrl: webhookUrl || '',
      status: 'ACTIVE',
    };

    store.watchlist.unshift(newSub);
    return NextResponse.json(newSub, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
