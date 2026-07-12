import { NextResponse } from 'next/server';
import { deriveWorkspaceId } from '@/lib/services/workspace';
import { createReport } from '@/lib/repositories/reportRepository';
import { researchGraph } from '@/lib/agent/graph';

/**
 * POST /api/research
 * 
 * Executes the LangGraph workflow and persists the generated report.
 * Expects { query: string } in body.
 * Expects x-api-key header.
 */
export async function POST(request) {
  try {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const workspaceId = deriveWorkspaceId(apiKey);

    // Run the LangGraph workflow
    // For Milestone 0, this is a blocking request. 
    // Streaming will be added in Milestone 3.
    const initialState = { query: body.query };
    
    // Pass API key to the graph nodes via config
    const config = {
      configurable: {
        apiKey,
      }
    };

    const finalState = await researchGraph.invoke(initialState, config);

    // Milestone 4: Fetch financial data
    const { getFinancialData } = require('@/lib/services/finance');
    const financialData = await getFinancialData(finalState.ticker);

    // Map LangGraph state to DB Schema
    const reportData = {
      workspaceId,
      companyName: finalState.companyName,
      ticker: finalState.ticker,
      verdict: finalState.verdict,
      executiveSummary: finalState.executiveSummary,
      bullCase: finalState.bullCase,
      bearCase: finalState.bearCase,
      newsSources: finalState.newsSources,
      relatedArticles: finalState.relatedArticles,
      sentimentPercentage: finalState.sentimentPercentage,
      sentimentLabel: finalState.sentimentLabel,
      // Financial Data:
      financialMetrics: financialData.financialMetrics,
      historicalPriceData: financialData.historicalPriceData,
      revenueData: financialData.revenueData,
    };

    // Save report to database (Milestone 1 integration)
    const savedReport = await createReport(reportData);

    return NextResponse.json({ reportId: savedReport.id });
  } catch (error) {
    console.error('[POST /api/research] Workflow failed:', error);
    return NextResponse.json(
      { error: error.message || 'Workflow execution failed' },
      { status: 500 }
    );
  }
}
