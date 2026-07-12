import { NextResponse } from 'next/server';
import { deriveWorkspaceId } from '@/lib/services/workspace';
import {
  findByWorkspace,
  findByIdAndWorkspace,
} from '@/lib/repositories/reportRepository';

/**
 * GET /api/reports
 *
 * Query params:
 *   ?id=<reportId>   — fetch a single report (scoped to workspace)
 *
 * Without `id`, returns the 5 most recent reports for the workspace.
 *
 * The API key is sent via the `x-api-key` header.
 * It is hashed to derive the workspace — the raw key is never stored.
 *
 * Ref: ANTIGRAVITY_SPEC §4, §7, §11
 */
export async function GET(request) {
  try {
    const apiKey = request.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing x-api-key header' },
        { status: 401 }
      );
    }

    const workspaceId = deriveWorkspaceId(apiKey);
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('id');

    // Single report lookup
    if (reportId) {
      const report = await findByIdAndWorkspace(Number(reportId), workspaceId);

      if (!report) {
        return NextResponse.json(
          { error: 'Report not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ report });
    }

    // List recent reports for this workspace
    const reports = await findByWorkspace(workspaceId);
    return NextResponse.json({ reports });
  } catch (error) {
    console.error('[GET /api/reports]', error);
    return NextResponse.json(
      { error: 'Failed to retrieve reports' },
      { status: 500 }
    );
  }
}
