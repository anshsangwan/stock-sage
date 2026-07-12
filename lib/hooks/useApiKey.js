'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'investmentAgent_apiKey';

/**
 * Hook to read / manage the Gemini API key from browser storage.
 *
 * - localStorage  → "Remember Me" was checked on login.
 * - sessionStorage → session-only key.
 *
 * The full auth context (Milestone 0) will wrap this hook.
 * Components can use it directly until then.
 */
export function useApiKey() {
  const [apiKey, setApiKeyState] = useState(undefined);

  useEffect(() => {
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
