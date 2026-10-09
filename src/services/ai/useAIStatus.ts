import { useState, useEffect, useCallback } from 'react';
import { AIStatusSummary, ProviderType } from './types';
import { aiClient, getStoredAIPreference, setStoredAIPreference } from './aiClient';

export function useAIStatus() {
  const [status, setStatus] = useState<AIStatusSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [preferred, setPreferred] = useState<ProviderType | 'AUTO'>(getStoredAIPreference);

  const refreshStatus = useCallback(async () => {
    try {
      const summary = await aiClient.getStatus();
      setStatus(summary);
    } catch {
      // safe fallback
    } finally {
      setLoading(false);
    }
  }, []);

  const changePreferredProvider = useCallback(
    async (newPref: ProviderType | 'AUTO') => {
      setStoredAIPreference(newPref);
      setPreferred(newPref);
      setLoading(true);
      try {
        const summary = await aiClient.getStatus();
        setStatus(summary);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    refreshStatus();

    // Check status when window gains focus or online/offline status changes
    const onFocus = () => refreshStatus();
    const onNetwork = () => refreshStatus();

    window.addEventListener('focus', onFocus);
    window.addEventListener('online', onNetwork);
    window.addEventListener('offline', onNetwork);

    // Periodic gentle refresh every 30 seconds
    const interval = setInterval(refreshStatus, 30000);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('online', onNetwork);
      window.removeEventListener('offline', onNetwork);
      clearInterval(interval);
    };
  }, [refreshStatus]);

  return {
    status,
    loading,
    refreshStatus,
    preferredProvider: preferred,
    setPreferredProvider: changePreferredProvider,
    testOllama: () => aiClient.testLocalOllama(),
  };
}
