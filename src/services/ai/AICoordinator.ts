import { AIProvider, AIStatusSummary, GeneratedMission, MissionGenerationInput, ProviderStatus, ProviderType, OllamaHealthStatus } from './types';
import { ollamaProvider } from './OllamaProvider';
import { fallbackProvider } from './FallbackProvider';
import { geminiProvider } from './GeminiProvider';

/**
 * AICoordinator implements the architecture:
 *
 * AIProvider
 * ├── OllamaProvider (LOCAL)
 * ├── FallbackProvider (OFFLINE)
 * └── GeminiProvider (CLOUD)
 *
 * PRIORITY ORDER:
 * 1. Ollama local AI
 * 2. Offline fallback engine
 * 3. Gemini cloud AI when explicitly configured
 */
export class AICoordinator implements AIProvider {
  readonly id = 'LOCAL' as const;
  readonly name = 'TrailMind AI Coordinator';

  private providers = {
    LOCAL: ollamaProvider,
    OFFLINE: fallbackProvider,
    CLOUD: geminiProvider,
  };

  /**
   * Health and connectivity status.
   * Performs real request to Ollama before reporting Local AI as available.
   * Produces the exact requested Ollama health response schema.
   */
  async getStatus(preferred?: ProviderType | 'AUTO'): Promise<AIStatusSummary> {
    const targetPref = preferred || 'AUTO';

    // 1. Actually ping Ollama API
    const ollamaHealth: OllamaHealthStatus = await this.providers.LOCAL.getHealthStatus().catch((err) => ({
      provider: 'ollama' as const,
      model: 'llama3.2:3b',
      available: false,
      mode: 'local' as const,
      details: err?.message || 'Connection failed',
    }));

    // 2. Check Fallback (always ready)
    const offlineStatus: ProviderStatus = await this.providers.OFFLINE.checkAvailability();

    // 3. Check Gemini
    const cloudStatus: ProviderStatus = await this.providers.CLOUD.checkAvailability().catch(() => ({
      type: 'CLOUD' as const,
      name: 'Gemini',
      model: 'gemini-3.8-flash',
      available: false,
      connected: false,
      details: 'Cloud API unavailable',
    }));

    const localStatus: ProviderStatus = {
      type: 'LOCAL',
      name: 'Llama 3.2',
      model: ollamaHealth.model,
      available: ollamaHealth.available,
      connected: ollamaHealth.available, // Strictly true only if ping succeeded!
      endpoint: this.providers.LOCAL.baseUrl,
      details: ollamaHealth.details,
      latencyMs: ollamaHealth.latencyMs,
    };

    // Determine active provider based on PRIORITY ORDER:
    // 1. Ollama local AI (if responsive and not overridden to OFFLINE/CLOUD)
    // 2. Offline fallback engine
    // 3. Gemini cloud AI when explicitly configured
    let activeProvider: ProviderType = 'OFFLINE';

    if (targetPref === 'LOCAL') {
      if (localStatus.connected) {
        activeProvider = 'LOCAL';
      } else {
        // "If Ollama cannot be reached, NEVER falsely show Local AI Ready.
        //  Automatically switch to the fallback provider."
        activeProvider = 'OFFLINE';
      }
    } else if (targetPref === 'CLOUD') {
      if (cloudStatus.connected) {
        activeProvider = 'CLOUD';
      } else if (localStatus.connected) {
        activeProvider = 'LOCAL';
      } else {
        activeProvider = 'OFFLINE';
      }
    } else if (targetPref === 'OFFLINE') {
      activeProvider = 'OFFLINE';
    } else {
      // AUTO mode:
      // Priority 1: Ollama local AI (if responding)
      // Priority 2: Offline fallback engine
      // Priority 3: Gemini cloud AI when explicitly configured
      if (localStatus.connected) {
        activeProvider = 'LOCAL';
      } else {
        // Fallback engine has priority over unsolicited cloud calls
        activeProvider = 'OFFLINE';
      }
    }

    let headline = '● OFFLINE';
    let subline = 'TrailMind Engine';
    let activeName = 'TrailMind Engine';
    let activeModel = 'Offline Engine';

    if (activeProvider === 'LOCAL') {
      headline = '● LOCAL AI';
      subline = 'Llama 3.2';
      activeName = 'Llama 3.2';
      activeModel = localStatus.model || 'llama3.2:3b';
    } else if (activeProvider === 'CLOUD') {
      headline = '● CLOUD AI';
      subline = 'Gemini';
      activeName = 'Gemini';
      activeModel = cloudStatus.model || 'gemini-3.8-flash';
    }

    return {
      activeProvider,
      activeName,
      activeModel,
      headline,
      subline,
      ollamaStatus: ollamaHealth,
      providers: {
        LOCAL: localStatus,
        CLOUD: cloudStatus,
        OFFLINE: offlineStatus,
      },
      preferredProvider: targetPref,
    };
  }

  async checkAvailability(): Promise<ProviderStatus> {
    const status = await this.getStatus();
    return status.providers[status.activeProvider];
  }

  /**
   * Generates a mission according to the strict priority order:
   * 1. Ollama local AI
   * 2. Offline fallback engine
   * 3. Gemini cloud AI when explicitly configured
   *
   * The application NEVER crashes because Ollama is unavailable.
   */
  async generateMission(
    input: MissionGenerationInput,
    preferred?: ProviderType | 'AUTO'
  ): Promise<GeneratedMission> {
    const targetPref = preferred || 'AUTO';

    // If CLOUD is explicitly requested by user setting
    if (targetPref === 'CLOUD') {
      try {
        const cloudCheck = await this.providers.CLOUD.checkAvailability();
        if (cloudCheck.connected) {
          console.log('[AI Coordinator] Explicitly requested Cloud Gemini: Generating mission...');
          const cloudMission = await this.providers.CLOUD.generateMission(input);
          return cloudMission;
        }
      } catch (cloudErr: any) {
        console.warn(`[AI Coordinator] Cloud generation failed (${cloudErr?.message}). Falling back to priority order.`);
      }
    }

    // PRIORITY 1: Ollama Local AI (unless explicitly set to OFFLINE)
    if (targetPref !== 'OFFLINE') {
      try {
        const localHealth = await this.providers.LOCAL.getHealthStatus();
        if (localHealth.available) {
          console.log(`[AI Coordinator] Priority 1: Generating via Local Ollama (${localHealth.model})...`);
          const localMission = await this.providers.LOCAL.generateMission(input);
          return localMission;
        } else {
          console.log(`[AI Coordinator] Ollama not available (${localHealth.details}). Cascading to Fallback.`);
        }
      } catch (ollamaErr: any) {
        console.warn(`[AI Coordinator] Ollama generation failed (${ollamaErr?.message}). Cascading to Fallback.`);
      }
    }

    // PRIORITY 2: Offline Fallback Engine (Guaranteed 100% success rate, instant, offline-first)
    console.log('[AI Coordinator] Priority 2: Generating via TrailMind Offline Engine...');
    try {
      const offlineMission = await this.providers.OFFLINE.generateMission(input);
      return offlineMission;
    } catch (offlineErr: any) {
      console.error('[AI Coordinator] Offline engine unexpected error:', offlineErr);
    }

    // PRIORITY 3: Gemini Cloud AI if explicitly configured & available
    try {
      const cloudCheck = await this.providers.CLOUD.checkAvailability();
      if (cloudCheck.connected) {
        console.log('[AI Coordinator] Priority 3: Generating via Cloud Gemini...');
        const cloudMission = await this.providers.CLOUD.generateMission(input);
        return cloudMission;
      }
    } catch (err: any) {
      console.warn('[AI Coordinator] Cloud Gemini fallback failed:', err?.message);
    }

    // Absolute failsafe: returns a safe fallback mission
    return this.providers.OFFLINE.generateMission(input);
  }
}

export const aiCoordinator = new AICoordinator();
