import { AIProvider, GeneratedMission, MissionGenerationInput, ProviderStatus, OllamaHealthStatus } from './types';
import { extractAndParseMissionJson } from './jsonParser';

export interface OllamaProviderConfig {
  baseUrl?: string;
  model?: string;
  timeoutMs?: number;
}

/**
 * Local AI Provider powered by Ollama (Default: llama3.2:3b).
 * Respects configuration:
 * - OLLAMA_BASE_URL (defaults to http://127.0.0.1:11434 or http://localhost:11434)
 * - OLLAMA_MODEL (defaults to llama3.2:3b)
 *
 * CRITICAL REQUIREMENTS:
 * 1. "Before reporting Local AI as available, actually request the Ollama API."
 * 2. "If Ollama cannot be reached, NEVER falsely show Local AI Ready."
 * 3. "Retry malformed output once. If it still fails, use FallbackProvider."
 * 4. "The application must NEVER crash because Ollama is unavailable."
 */
export class OllamaProvider implements AIProvider {
  readonly id = 'LOCAL' as const;
  readonly name = 'Llama 3.2';
  readonly defaultModel: string;
  readonly baseUrl: string;
  readonly timeoutMs: number;

  constructor(config: OllamaProviderConfig = {}) {
    // Read from environment config or fallback to official specs:
    // OLLAMA_BASE_URL=http://127.0.0.1:11434
    // OLLAMA_MODEL=llama3.2:3b
    const envBaseUrl =
      (typeof process !== 'undefined' && (process.env?.OLLAMA_BASE_URL || process.env?.OLLAMA_HOST)) ||
      'http://127.0.0.1:11434';

    const envModel =
      (typeof process !== 'undefined' && process.env?.OLLAMA_MODEL) ||
      'llama3.2:3b';

    this.baseUrl = (config.baseUrl || envBaseUrl).replace(/\/+$/, '');
    this.defaultModel = config.model || envModel;
    this.timeoutMs = config.timeoutMs || 8000;
  }

  /**
   * Real health check pinging Ollama API.
   * Produces the exact requested AI status response:
   * {
   *   "provider": "ollama",
   *   "model": "llama3.2:3b",
   *   "available": true,
   *   "mode": "local"
   * }
   */
  async getHealthStatus(): Promise<OllamaHealthStatus> {
    const startTime = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);

    try {
      // 1. Ping /api/tags to list available local models
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        return {
          provider: 'ollama',
          model: this.defaultModel,
          available: false,
          mode: 'local',
          details: `Ollama returned HTTP error ${response.status}`,
          latencyMs: Date.now() - startTime,
        };
      }

      const data = await response.json();
      const models = Array.isArray(data?.models) ? data.models : [];
      const hasConfiguredModel = models.some((m: any) => {
        const name = (m.name || m.model || '').toLowerCase();
        return name.includes(this.defaultModel.toLowerCase()) || name.includes('llama3.2');
      });

      return {
        provider: 'ollama',
        model: this.defaultModel,
        available: true, // Actually connected!
        mode: 'local',
        details: hasConfiguredModel
          ? `Model ${this.defaultModel} loaded and responsive`
          : `Ollama daemon online (${models.length} model${models.length === 1 ? '' : 's'} installed; run \`ollama pull ${this.defaultModel}\` if needed)`,
        latencyMs: Date.now() - startTime,
      };
    } catch (err: any) {
      clearTimeout(timer);
      const isAbort = err?.name === 'AbortError';
      return {
        provider: 'ollama',
        model: this.defaultModel,
        available: false, // NEVER falsely show ready when unreachable
        mode: 'local',
        details: isAbort
          ? `Timeout reaching ${this.baseUrl}`
          : `Daemon unreachable at ${this.baseUrl} (${err?.message || 'Connection refused'})`,
        latencyMs: Date.now() - startTime,
      };
    }
  }

  /**
   * Compatibility adapter for AIProvider.checkAvailability()
   */
  async checkAvailability(): Promise<ProviderStatus> {
    const health = await this.getHealthStatus();
    return {
      type: 'LOCAL',
      name: this.name,
      model: health.model,
      available: health.available,
      connected: health.available, // Strictly true only on success
      endpoint: this.baseUrl,
      details: health.details,
      latencyMs: health.latencyMs,
    };
  }

  /**
   * Performs an internal generation call to /api/generate
   */
  private async executeGeneration(prompt: string): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          model: this.defaultModel,
          prompt,
          stream: false,
          format: 'json',
          options: {
            temperature: 0.7,
            num_predict: 600,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Ollama HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const outputText = result?.response;

      if (!outputText || typeof outputText !== 'string') {
        throw new Error('Empty response payload from Ollama');
      }

      return outputText;
    } catch (err: any) {
      clearTimeout(timeout);
      throw err;
    }
  }

  /**
   * Generates a real-world outdoor mission with Ollama.
   * Features:
   * - Robust JSON extraction
   * - Retries malformed output once
   * - Never crashes; throws clean error for AICoordinator to cascade
   */
  async generateMission(input: MissionGenerationInput): Promise<GeneratedMission> {
    const rawTime = input.time ?? 30;
    const duration = typeof rawTime === 'number' ? rawTime : parseInt(String(rawTime).replace(/\D+/g, ''), 10) || 30;
    const mood = input.mood || 'Stressed';
    const energy = input.energy || 'Medium';
    const env = input.environment || 'Forest';
    const act = input.activity || 'Walking';

    const prompt = `You are TrailMind AI, an outdoor expedition planner running on a local Ollama model (${this.defaultModel}).
Generate a screen-free real-world outdoor micro-adventure matching these parameters:
- Duration: ${duration} minutes
- Mood to transform: ${mood}
- Physical Energy: ${energy}
- Immediate Outdoors: ${env}
- Activity: ${act}

Respond ONLY with valid JSON matching this exact structure:
{
  "title": "Short poetic title (e.g. The Cedar Grove & Canopy Stride)",
  "description": "One vivid sentence framing the walk",
  "category": "${env} Exploration",
  "durationMinutes": ${duration},
  "difficulty": "${energy === 'High' ? 'Brisk' : energy === 'Medium' ? 'Moderate' : 'Gentle'}",
  "estimatedDistance": "${(duration * (energy === 'High' ? 0.09 : 0.06)).toFixed(1)} km",
  "tasks": [
    "Step outside, put phone in pocket, and notice immediate air temperature",
    "Walk at a ${energy.toLowerCase()} pace and observe 2 seasonal changes",
    "Identify a natural focal point and pause for 60 seconds of silence",
    "Follow an unhurried route back while releasing shoulder tension"
  ],
  "bonusTask": "Locate one unexpected architectural or botanical detail",
  "safetyTip": "Stay on public paths and remain aware of footing"
}`;

    // Pass 1: Primary attempt
    try {
      const rawOutput = await this.executeGeneration(prompt);
      const parsed = extractAndParseMissionJson(rawOutput, duration);

      return {
        ...parsed,
        provider: 'LOCAL',
        providerName: 'Llama 3.2',
        modelUsed: this.defaultModel,
      };
    } catch (firstErr: any) {
      console.warn(`[OllamaProvider] Pass 1 parse failed (${firstErr?.message}). Retrying once with strict JSON prompt...`);

      // Pass 2: Retry with explicit format reinforcement
      const retryPrompt = `${prompt}\n\nIMPORTANT: Your previous output was malformed. Output ONLY raw, valid JSON. Do not include markdown code blocks or explanations.`;
      const retryOutput = await this.executeGeneration(retryPrompt);
      const parsed = extractAndParseMissionJson(retryOutput, duration);

      return {
        ...parsed,
        provider: 'LOCAL',
        providerName: 'Llama 3.2',
        modelUsed: this.defaultModel,
      };
    }
  }
}

export const ollamaProvider = new OllamaProvider();
