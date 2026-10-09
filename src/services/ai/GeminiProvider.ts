import { GoogleGenAI, Type } from '@google/genai';
import { AIProvider, GeneratedMission, MissionGenerationInput, ProviderStatus } from './types';

export class GeminiProvider implements AIProvider {
  readonly id = 'CLOUD' as const;
  readonly name = 'Gemini';
  readonly defaultModel = 'gemini-3.8-flash';

  private getApiKey(): string | undefined {
    return process.env.GEMINI_API_KEY;
  }

  async checkAvailability(): Promise<ProviderStatus> {
    const apiKey = this.getApiKey();
    const hasKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 0);

    return {
      type: 'CLOUD',
      name: this.name,
      model: this.defaultModel,
      available: hasKey,
      connected: hasKey,
      endpoint: 'Google Gemini API',
      details: hasKey ? 'Gemini 3.8 Flash Cloud ready' : 'GEMINI_API_KEY not configured',
      latencyMs: hasKey ? 45 : undefined,
    };
  }

  async generateMission(input: MissionGenerationInput): Promise<GeneratedMission> {
    const apiKey = this.getApiKey();
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || !apiKey.trim()) {
      throw new Error('GEMINI_API_KEY is not configured or is placeholder');
    }

    const rawTime = input.time ?? 30;
    const duration = typeof rawTime === 'number' ? rawTime : parseInt(String(rawTime).replace(/\D+/g, ''), 10) || 30;
    const mood = input.mood || 'Stressed';
    const energy = input.energy || 'Medium';
    const env = input.environment || 'Forest';
    const act = input.activity || 'Walking';

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `You are the core intelligence of TrailMind AI, creating a real-world micro-adventure to get the user outdoors without screen distraction.
Generate ONE outdoor micro-adventure based on:
- Duration: ${duration} minutes
- Mental State: ${mood}
- Physical Energy: ${energy}
- Terrain/Environment: ${env}
- Activity: ${act}

MANDATORY RULES:
1. Outdoors only in physical reality.
2. Exact duration: ${duration} minutes.
3. Minimal phone interaction (stowed in pocket).
4. Between 3 and 6 concise sequential tasks.
5. Realistic estimated distance (e.g. "1.2 km").
6. Inspiring bonus task.
7. Essential safety reminder.`;

    const apiPromise = ai.models.generateContent({
      model: this.defaultModel,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            durationMinutes: { type: Type.NUMBER },
            difficulty: { type: Type.STRING },
            estimatedDistance: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            bonusTask: { type: Type.STRING },
            safetyTip: { type: Type.STRING },
          },
          required: [
            'title',
            'description',
            'category',
            'durationMinutes',
            'difficulty',
            'estimatedDistance',
            'tasks',
            'bonusTask',
            'safetyTip',
          ],
        },
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API call timed out after 7s')), 7000)
    );

    const response = await Promise.race([apiPromise, timeoutPromise]);
    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    const parsed = JSON.parse(text);
    return {
      title: parsed.title,
      description: parsed.description,
      category: parsed.category || `${env} Exploration`,
      durationMinutes: duration,
      difficulty: parsed.difficulty || (energy === 'High' ? 'Brisk' : 'Moderate'),
      estimatedDistance: parsed.estimatedDistance || `${(duration * 0.07).toFixed(1)} km`,
      tasks: parsed.tasks,
      bonusTask: parsed.bonusTask,
      safetyTip: parsed.safetyTip,
      provider: 'CLOUD',
      providerName: 'Gemini',
      modelUsed: this.defaultModel,
    };
  }
}

export const geminiProvider = new GeminiProvider();
