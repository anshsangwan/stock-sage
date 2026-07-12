import { NextResponse } from 'next/server';
import { getFinancialData } from '@/lib/services/finance';

export const dynamic = 'force-dynamic';

/**
 * GET /api/finance
 * 
 * Retrieves Yahoo Finance statistical data, annual financials, and price history.
 * Expects ?ticker=XYZ
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');

    if (!ticker) {
      return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
    }

    const data = await getFinancialData(ticker);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[GET /api/finance] Failed to retrieve data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve financial data' },
      { status: 500 }
    );
  }
}
