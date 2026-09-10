import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const state = searchParams.get('state');
  const riskLevel = searchParams.get('riskLevel');
  const minScore = searchParams.get('minScore');
  const maxScore = searchParams.get('maxScore');

  let result = [...store.parcels];

  if (query) {
    const q = query.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.ulpin.toLowerCase().includes(q) ||
        p.stateSurveyNo.toLowerCase().includes(q) ||
        p.currentOwnerName.toLowerCase().includes(q) ||
        p.villageName.toLowerCase().includes(q) ||
        p.talukTehsil.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.pattaKhataNo.toLowerCase().includes(q)
    );
  }

  if (state && state !== 'ALL') {
    result = result.filter((p) => p.state.toLowerCase() === state.toLowerCase());
  }

  if (riskLevel && riskLevel !== 'ALL') {
    result = result.filter((p) => p.riskLevel === riskLevel);
  }

  if (minScore) {
    result = result.filter((p) => p.bhuScore >= Number(minScore));
  }

  if (maxScore) {
    result = result.filter((p) => p.bhuScore <= Number(maxScore));
  }

  return NextResponse.json(result);
}
