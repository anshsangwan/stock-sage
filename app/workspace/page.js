import { Suspense } from 'react';
import WorkspaceClient from './WorkspaceClient';
import ReportSkeleton from '@/components/report/ReportSkeleton';

/**
 * Agent Workspace Page
 * 
 * Transitional page where the AI execution progress is visualized.
 * Wrapped in a Suspense boundary to prevent production prerendering build errors 
 * related to the client-side useSearchParams() hook.
 * 
 * Ref: ANTIGRAVITY_SPEC §12
 */
export const dynamic = 'force-dynamic';

export default function WorkspacePage() {
  return (
    <Suspense 
      fallback={
        <div className="relative min-h-screen bg-[#0a0a0a]">
          <ReportSkeleton />
        </div>
      }
    >
      <WorkspaceClient />
    </Suspense>
  );
}
