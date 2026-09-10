import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { ParcelAlertEvent } from '@/src/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { parcelId, eventType, customTitle, customDescription, severity } = body;
    const parcel = store.parcels.find((p) => p.id === parcelId) || store.parcels[0];

    const alertId = `ALT-${Date.now()}`;
    let title = customTitle;
    let description = customDescription;
    let sev: 'INFO' | 'WARNING' | 'ALERT' | 'CRITICAL' = severity || 'ALERT';
    let registry = 'National Registry Gateway';

    if (!title) {
      if (eventType === 'NEW_COURT_SUIT') {
        title = `New Original Suit filed against Survey ${parcel.stateSurveyNo}`;
        description = `O.S. ${Math.floor(
          Math.random() * 800 + 100
        )}/2026 instituted before District Civil Court claiming partition rights.`;
        sev = 'CRITICAL';
        registry = 'eCourts National Judicial Grid';
      } else if (eventType === 'NEW_CERSAI_MORTGAGE') {
        title = `New Collateral Mortgage Charge Registered in CERSAI`;
        description = `Equitable mortgage of ₹${(Math.random() * 15 + 2).toFixed(
          2
        )} Cr created by Nationalised Bank on ULPIN ${parcel.ulpin}.`;
        sev = 'ALERT';
        registry = 'CERSAI Portal (Govt of India)';
      } else if (eventType === 'PUBLIC_GAZETTE_NOTICE') {
        title = `Preliminary Land Acquisition Notice Gazette Published`;
        description = `Section 3A NHAI / Metro Railway right-of-way alignment notification published in official gazette.`;
        sev = 'WARNING';
        registry = 'Gazette of India';
      } else {
        title = `Sub-Registrar Mutation Application Lodged`;
        description = `Form 11 J-Slip transfer registered at Sub-Registrar Office for review.`;
        sev = 'INFO';
        registry = parcel.rorRegistrySource;
      }
    }

    const newAlert: ParcelAlertEvent = {
      id: alertId,
      parcelId: parcel.id,
      ulpin: parcel.ulpin,
      surveyNo: parcel.stateSurveyNo,
      location: `${parcel.villageName}, ${parcel.district}, ${parcel.state}`,
      eventType: eventType || 'NEW_COURT_SUIT',
      severity: sev,
      title,
      description,
      sourceRegistry: registry,
      timestamp: new Date().toISOString(),
      isRead: false,
      notifiedChannels: {
        email: true,
        push: true,
        webhook: true,
      },
    };

    store.alerts.unshift(newAlert);
    return NextResponse.json(newAlert, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to simulate registry event' }, { status: 400 });
  }
}
