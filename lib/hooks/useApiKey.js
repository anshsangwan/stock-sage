'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'investmentAgent_apiKey';

// ─── HARDCODED API KEY CONFIGURATION ──────────────────────────────────
// Paste your raw Gemini API Key here to bypass the login gateway page.
// Alternatively, define NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.
const HARDCODED_GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyDefaultBypassKey'; 

/**
 * Hook to read / manage the Gemini API key from browser storage.
 */
export function useApiKey() {
  // If a hardcoded key is supplied in code, initialize with it immediately
  const [apiKey, setApiKeyState] = useState(HARDCODED_GEMINI_KEY || undefined);

  useEffect(() => {
    if (HARDCODED_GEMINI_KEY) {
      setApiKeyState(HARDCODED_GEMINI_KEY);
      return;
    }

    const stored =
      localStorage.getItem(STORAGE_KEY) ||
      sessionStorage.getItem(STORAGE_KEY) ||
      null;
    setApiKeyState(stored);
  }, []);

  /** Persist the key to the appropriate storage. */
  const setApiKey = useCallback((key, remember = false) => {
    if (remember) {
      localStorage.setItem(STORAGE_KEY, key);
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, key);
      localStorage.removeItem(STORAGE_KEY);
    }
    setApiKeyState(key);
  }, []);

  /** Clear the key from both storages. */
  const clearApiKey = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setApiKeyState(null);
  }, []);

  return { apiKey, setApiKey, clearApiKey };
}
