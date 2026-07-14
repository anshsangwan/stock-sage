import { getFinancialData } from '@/lib/services/finance';
import { deriveWorkspaceId } from '@/lib/services/workspace';
import { createReport } from '@/lib/repositories/reportRepository';
import { researchGraph } from '@/lib/agent/graph';

export const dynamic = 'force-dynamic';

/**
 * POST /api/stream
 * 
 * Executes the LangGraph workflow and streams real-time progress events
 * to the client using Server-Sent Events (SSE).
 */
export async function POST(request) {
  try {
    const headerKey = request.headers.get('x-api-key');
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || headerKey;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing API key' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    if (!body.query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const workspaceId = deriveWorkspaceId(apiKey);
    const encoder = new TextEncoder();

    // Create a readable stream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (eventData) => {
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(eventData)}\n\n`));
          } catch (e) {
            console.error('Error writing to stream controller:', e);
          }
        };

        try {
          // Pass the stream callback via LangGraph configuration
          const config = {
            configurable: {
              apiKey,
              onStep: (stage, statusInfo) => {
                sendEvent({ type: 'progress', stage, ...statusInfo });
              },
            },
          };

          // Step 1: Extract company information (triggers inside research node)
          // The researchNode will notify progress for Stage 1 and Stage 2

          const initialState = { query: body.query };
          const finalState = await researchGraph.invoke(initialState, config);

          // Step 6: Finalize report
          sendEvent({ type: 'progress', stage: 6, status: 'running' });
          
          // Milestone 4: Fetch financial data
          const financialData = await getFinancialData(finalState.ticker);

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

          const savedReport = await createReport(reportData);

          sendEvent({ type: 'progress', stage: 6, status: 'completed' });
          sendEvent({ type: 'complete', reportId: savedReport.id });
        } catch (error) {
          console.error('[SSE Stream Error]:', error);
          sendEvent({ type: 'error', message: error.message || 'An unexpected error occurred during research.' });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[POST /api/stream] Route failed:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
