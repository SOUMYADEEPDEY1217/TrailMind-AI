import { AIProvider, AIStatusSummary, GeneratedMission, MissionGenerationInput, ProviderStatus, ProviderType } from './types';
import { fallbackProvider } from './FallbackProvider';

const PREFERRED_PROVIDER_KEY = 'trailmind_preferred_ai_provider';

export function getStoredAIPreference(): ProviderType | 'AUTO' {
  if (typeof window === 'undefined') return 'AUTO';
  try {
    const stored = localStorage.getItem(PREFERRED_PROVIDER_KEY);
    if (stored === 'LOCAL' || stored === 'CLOUD' || stored === 'OFFLINE' || stored === 'AUTO') {
      return stored;
    }
  } catch {
    // fallback to AUTO
  }
  return 'AUTO';
}

export function setStoredAIPreference(pref: ProviderType | 'AUTO'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PREFERRED_PROVIDER_KEY, pref);
  } catch {
    // ignore
  }
}

/**
 * Client-Side AI Provider implementation that communicates with the
 * TrailMind AI Service endpoints with automatic offline resiliency.
 */
export class AIClientProvider implements AIProvider {
  readonly id = 'CLOUD' as const;
  readonly name = 'TrailMind AI Client';

  async checkAvailability(): Promise<ProviderStatus> {
    const status = await this.getStatus();
    return status.providers[status.activeProvider];
  }

  async getStatus(): Promise<AIStatusSummary> {
    const preferred = getStoredAIPreference();

    // If completely offline in the browser, report OFFLINE status immediately
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return {
        activeProvider: 'OFFLINE',
        activeName: 'TrailMind Engine',
        activeModel: 'Offline Engine',
        headline: '● OFFLINE',
        subline: 'TrailMind Engine',
        providers: {
          LOCAL: {
            type: 'LOCAL',
            name: 'Llama 3.2',
            model: 'llama3.2:3b',
            available: false,
            connected: false,
            endpoint: 'http://localhost:11434',
            details: 'Device is offline',
          },
          CLOUD: {
            type: 'CLOUD',
            name: 'Gemini',
            model: 'gemini-3.8-flash',
            available: false,
            connected: false,
            details: 'Device is offline',
          },
          OFFLINE: {
            type: 'OFFLINE',
            name: 'TrailMind Engine',
            model: 'Offline Engine',
            available: true,
            connected: true,
            details: 'Always available offline',
          },
        },
        preferredProvider: preferred,
      };
    }

    try {
      const res = await fetch(`/api/ai/status?pref=${preferred}`, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        const data: AIStatusSummary = await res.json();
        return data;
      }
    } catch {
      // Network failure
    }

    // Default safe fallback when server endpoint cannot be reached
    return {
      activeProvider: 'OFFLINE',
      activeName: 'TrailMind Engine',
      activeModel: 'Offline Engine',
      headline: '● OFFLINE',
      subline: 'TrailMind Engine',
      providers: {
        LOCAL: {
          type: 'LOCAL',
          name: 'Llama 3.2',
          model: 'llama3.2:3b',
          available: false,
          connected: false,
          endpoint: 'http://localhost:11434',
          details: 'Local daemon probe failed',
        },
        CLOUD: {
          type: 'CLOUD',
          name: 'Gemini',
          model: 'gemini-3.8-flash',
          available: false,
          connected: false,
          details: 'Could not contact server',
        },
        OFFLINE: {
          type: 'OFFLINE',
          name: 'TrailMind Engine',
          model: 'Offline Engine',
          available: true,
          connected: true,
          details: 'Always available offline',
        },
      },
      preferredProvider: preferred,
    };
  }

  /**
   * Generates a mission using the provider-independent AI architecture.
   * Cascades: LOCAL -> CLOUD -> OFFLINE with zero user-facing errors.
   */
  async generateMission(input: MissionGenerationInput): Promise<GeneratedMission> {
    const preferred = getStoredAIPreference();

    // If browser is offline, instantly synthesize with FallbackProvider
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.log('[AI Client] Device offline: generating via FallbackProvider...');
      return fallbackProvider.generateMission(input);
    }

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...input,
          preferredProvider: preferred,
        }),
      });

      if (res.ok) {
        const mission: GeneratedMission = await res.json();
        return mission;
      }
    } catch (err: any) {
      console.warn('[AI Client] Server call failed, using client-side FallbackProvider:', err.message);
    }

    // Client-side automatic fallback ensures mission generation always works
    return fallbackProvider.generateMission(input);
  }

  /**
   * Explicitly tests the local Ollama connection.
   */
  async testLocalOllama(): Promise<{ success: boolean; message: string; details?: any; health?: any }> {
    try {
      const res = await fetch('/api/ai/test-local', { method: 'POST' });
      if (res.ok) {
        return await res.json();
      }
      return { success: false, message: `Server error ${res.status}` };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to ping test endpoint' };
    }
  }

  /**
   * Fetches the direct Ollama health status { provider: 'ollama', model: 'llama3.2:3b', available: boolean, mode: 'local' }
   */
  async getOllamaHealth(): Promise<{ provider: string; model: string; available: boolean; mode: string; details?: string }> {
    try {
      const res = await fetch('/api/ai/ollama-status');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // safe fallback
    }
    return {
      provider: 'ollama',
      model: 'llama3.2:3b',
      available: false,
      mode: 'local',
      details: 'Unable to reach health endpoint',
    };
  }
}

export const aiClient = new AIClientProvider();
