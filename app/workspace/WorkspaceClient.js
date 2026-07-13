'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApiKey } from '@/lib/hooks/useApiKey';
import { streamResearch } from '@/lib/services/streamClient';
import ReportSkeleton from '@/components/report/ReportSkeleton';
import AgentWorkspace from '@/components/dashboard/AgentWorkspace';

/**
 * WorkspaceClient - Client-side logic for the Workspace page.
 * Handles API key retrieval, SSE stream execution, and local progress status states.
 */
export default function WorkspaceClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const { apiKey } = useApiKey();
  const [currentStage, setCurrentStage] = useState(1);
  const [stageStatuses, setStageStatuses] = useState({
    1: 'pending',
    2: 'pending',
    3: 'pending',
    4: 'pending',
    5: 'pending',
    6: 'pending',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (apiKey === undefined) return; // Hook still loading
    
    if (apiKey === null) {
      router.replace('/login');
      return;
    }

    if (!query) {
      router.replace('/');
      return;
    }

    let active = true;

    // Start SSE stream
    streamResearch(query, apiKey, {
      onProgress: (stage, info) => {
        if (!active) return;
        setCurrentStage(stage);
        setStageStatuses((prev) => {
          const next = { ...prev, [stage]: info.status };
          
          // Cascading transition: if a stage is completed, mark all previous stages as completed
          // to ensure a smooth checklist transition.
          if (info.status === 'completed') {
            for (let i = 1; i < stage; i++) {
              next[i] = 'completed';
            }
          } else if (info.status === 'running') {
            next[stage] = 'running';
            // Any stage after the current one is pending
            for (let i = stage + 1; i <= 6; i++) {
              next[i] = 'pending';
            }
            // All stages before are completed
            for (let i = 1; i < stage; i++) {
              next[i] = 'completed';
            }
          }
          return next;
        });
      },
      onComplete: (reportId) => {
        if (!active) return;
        // Redirect to the newly generated report
        router.push(`/report/${reportId}`);
      },
      onError: (message) => {
        if (!active) return;
        setError(message);
      },
    });

    return () => {
      active = false;
    };
  }, [apiKey, query, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-8 flex flex-col items-center justify-center font-sans">
        <div className="max-w-md w-full p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl text-center shadow-2xl">
          <h2 className="text-xl font-bold text-red-400 mb-2">Research Failed</h2>
          <p className="text-sm text-zinc-400 mb-6 leading-relaxed">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors font-medium"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a]">
      {/* Background Pulse Skeleton */}
      <ReportSkeleton />

      {/* Foreground Status Modal */}
      <AgentWorkspace 
        currentStage={currentStage} 
        stageStatuses={stageStatuses} 
        query={query} 
      />
    </div>
  );
}
