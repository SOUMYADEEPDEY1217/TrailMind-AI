import { AIProvider, GeneratedMission, MissionGenerationInput, ProviderStatus } from './types';
import { generateOfflineAdventure } from '../../utils/offlineAdventureEngine';
import { BiomeEnvironment, EnergyLevel, MoodType, UserPreferences } from '../../types';

export class FallbackProvider implements AIProvider {
  readonly id = 'OFFLINE' as const;
  readonly name = 'TrailMind Engine';
  readonly defaultModel = 'Offline Adventure Engine (40+ Biomes)';

  async checkAvailability(): Promise<ProviderStatus> {
    return {
      type: 'OFFLINE',
      name: this.name,
      model: 'Built-in Engine',
      available: true,
      connected: true,
      details: 'Instant zero-cloud generation with 40+ adaptive biome templates',
      latencyMs: 1,
    };
  }

  async generateMission(input: MissionGenerationInput): Promise<GeneratedMission> {
    const rawTime = input.time ?? 30;
    const timeMinutes = typeof rawTime === 'number' ? rawTime : parseInt(String(rawTime).replace(/\D+/g, ''), 10) || 30;

    const prefs: UserPreferences = {
      timeMinutes,
      timeLabel: `${timeMinutes} min`,
      mood: (input.mood || 'Stressed') as MoodType,
      energy: (input.energy || 'Medium') as EnergyLevel,
      environment: (input.environment || 'Forest') as BiomeEnvironment,
      activity: (input.activity || 'Mindfulness') as any,
      sensoryFocus: (input.sensoryFocus as any) || 'wind_soundscape',
    };

    const adventure = generateOfflineAdventure(prefs);

    return {
      title: adventure.title,
      description: adventure.subtitle || `A ${timeMinutes}-minute outdoor exploration tailored to your immediate environment.`,
      category: `${input.environment || 'Outdoor'} Exploration`,
      durationMinutes: adventure.targetMinutes || timeMinutes,
      difficulty: adventure.difficulty || (input.energy === 'High' ? 'Brisk' : input.energy === 'Medium' ? 'Moderate' : 'Gentle'),
      estimatedDistance: adventure.estimatedDistance || `${(timeMinutes * 0.07).toFixed(1)} km`,
      tasks: adventure.tasks && adventure.tasks.length > 0
        ? adventure.tasks
        : adventure.waypoints.map(w => w.actionChallenge || w.sensoryPrompt),
      bonusTask: adventure.bonusTask || 'Capture one unexpected detail in your surroundings.',
      safetyTip: adventure.safetyTip || 'Stay on public paths and remain aware of footing.',
      provider: 'OFFLINE',
      providerName: 'TrailMind Engine',
      modelUsed: 'TrailMind Offline Engine',
      isOffline: true,
      offlineNotice: 'TrailMind found a mission without the cloud.',
    };
  }
}

export const fallbackProvider = new FallbackProvider();
