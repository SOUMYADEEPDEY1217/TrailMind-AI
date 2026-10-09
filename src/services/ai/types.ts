export type ProviderType = 'CLOUD' | 'LOCAL' | 'OFFLINE';

export interface MissionGenerationInput {
  time?: string | number;
  mood?: string;
  energy?: string;
  environment?: string;
  activity?: string;
  sensoryFocus?: string;
}

export interface GeneratedMission {
  title: string;
  description: string;
  category: string;
  durationMinutes: number;
  difficulty: string;
  estimatedDistance: string;
  tasks: string[];
  bonusTask: string;
  safetyTip: string;
  provider: ProviderType;
  providerName: string;
  modelUsed?: string;
  isOffline?: boolean;
  offlineNotice?: string;
}

export interface ProviderStatus {
  type: ProviderType;
  name: string;
  model?: string;
  available: boolean;
  connected: boolean;
  endpoint?: string;
  details?: string;
  latencyMs?: number;
}

export interface OllamaHealthStatus {
  provider: 'ollama';
  model: string;
  available: boolean;
  mode: 'local';
  details?: string;
  latencyMs?: number;
}

export interface AIStatusSummary {
  activeProvider: ProviderType;
  activeName: string;
  activeModel: string;
  headline: string; // '● LOCAL AI' | '● CLOUD AI' | '● OFFLINE'
  subline: string;  // 'Llama 3.2' | 'Gemini' | 'TrailMind Engine'
  ollamaStatus?: OllamaHealthStatus;
  providers: {
    LOCAL: ProviderStatus;
    CLOUD: ProviderStatus;
    OFFLINE: ProviderStatus;
  };
  preferredProvider?: ProviderType | 'AUTO';
}

export interface AIProvider {
  readonly id: ProviderType;
  readonly name: string;
  readonly defaultModel?: string;
  checkAvailability(): Promise<ProviderStatus>;
  generateMission(input: MissionGenerationInput): Promise<GeneratedMission>;
}
