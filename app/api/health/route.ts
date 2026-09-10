import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'BhuScore Land Credit Bureau Next.js API',
    timestamp: new Date().toISOString(),
  });
}
