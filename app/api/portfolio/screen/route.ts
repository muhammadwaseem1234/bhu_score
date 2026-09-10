import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { parcelIds } = body;
    const targetParcels =
      Array.isArray(parcelIds) && parcelIds.length > 0
        ? store.parcels.filter((p) => parcelIds.includes(p.id) || parcelIds.includes(p.ulpin))
        : store.parcels;

    const totalCount = targetParcels.length;
    const avgScore =
      totalCount > 0
        ? Math.round(targetParcels.reduce((acc, p) => acc + p.bhuScore, 0) / totalCount)
        : 0;
    const cleanCount = targetParcels.filter((p) => p.riskLevel === 'CLEAN').length;
    const moderateCount = targetParcels.filter((p) => p.riskLevel === 'MODERATE_RISK').length;
    const highRiskCount = targetParcels.filter(
      (p) => p.riskLevel === 'HIGH_RISK' || p.riskLevel === 'CRITICAL_RISK'
    ).length;
    const activeLitigationCount = targetParcels.filter((p) => p.litigationHistory.length > 0).length;
    const activeCersaiCount = targetParcels.filter((p) =>
      p.encumbrances.some((e) => e.status === 'ACTIVE_ENCUMBERED' || e.status === 'UNDER_DRT_RECOVERY')
    ).length;

    return NextResponse.json({
      totalCount,
      avgScore,
      cleanCount,
      moderateCount,
      highRiskCount,
      activeLitigationCount,
      activeCersaiCount,
      parcels: targetParcels,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to screen portfolio' }, { status: 400 });
  }
}
