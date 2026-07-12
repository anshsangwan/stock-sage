'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApiKey } from '@/lib/hooks/useApiKey';

export default function LoginPage() {
  const [key, setKey] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const { setApiKey } = useApiKey();
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Validate Gemini API Key format (starts with AIza or AQ)
    if (!(key.startsWith('AIza') || key.startsWith('AQ')) || key.length < 30) {
      setError('Invalid API Key format. Must start with AIza or AQ.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setApiKey(key, remember);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Stock Sage Portal
          </h1>
          <p className="text-sm text-zinc-500 font-medium">
            Powered by LangChain & Next.js
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <div className={`relative ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                  setError('');
                }}
                placeholder="Enter your Gemini API Key (AIza...)"
                className={`w-full pl-10 pr-4 py-3 bg-black/50 border rounded-xl text-white focus:outline-none focus:ring-2 transition-colors ${
                  error 
                    ? 'border-red-500 focus:ring-red-500/50' 
                    : 'border-zinc-800 focus:border-emerald-500/50 focus:ring-emerald-500/50'
                }`}
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-zinc-400 select-none cursor-pointer">
              Remember my API Key
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/20"
          >
            Initialize Agent Workspace
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800/50">
          <p className="text-xs text-zinc-500 leading-relaxed text-center">
            Your API key is stored only inside your browser and is sent directly to the AI orchestration layer. It is never stored in an external database.
          </p>
        </div>
      </div>
      
      {/* Shake animation keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}} />
    </div>
  );
}
