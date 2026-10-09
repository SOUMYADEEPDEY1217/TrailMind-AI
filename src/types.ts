export type MoodType =
  | 'Stressed'
  | 'Bored'
  | 'Tired'
  | 'Curious'
  | 'Adventurous'
  | 'Happy'
  | 'Need Focus'
  | 'overstimulated'
  | 'sluggish'
  | 'anxious'
  | 'creative_block'
  | 'energized';

export type EnergyLevel = 'Low' | 'Medium' | 'High' | 'low' | 'medium' | 'high';

export type BiomeEnvironment =
  | 'Neighborhood'
  | 'City'
  | 'Park'
  | 'Campus'
  | 'Garden'
  | 'Forest'
  | 'Trail'
  | 'Riverside'
  | 'Beach'
  | 'Countryside'
  | 'urban_park'
  | 'forest_trail'
  | 'neighborhood_alley'
  | 'waterfront'
  | 'open_meadow'
  | 'backyard';

export type ActivityPreference =
  | 'Walking'
  | 'Running'
  | 'Photography'
  | 'Nature'
  | 'Bird Watching'
  | 'Mindfulness'
  | 'Exploration'
  | 'Fitness'
  | 'Gardening'
  | 'Surprise Me'
  | 'mindful_stroll'
  | 'flora_foraging'
  | 'sound_mapping'
  | 'elevation_stride'
  | 'photo_hunt'
  | 'twilight_walk';

export type SensoryFocus =
  | 'scents_flora'
  | 'wind_soundscape'
  | 'soil_textures'
  | 'sunlight_shadows'
  | 'open_sky';

export interface UserPreferences {
  timeMinutes: number;
  timeLabel?: string;
  mood: MoodType;
  energy: EnergyLevel;
  environment: BiomeEnvironment;
  activity: ActivityPreference;
  sensoryFocus?: SensoryFocus;
}

export interface MissionData {
  title: string;
  description: string;
  category: string;
  durationMinutes: number;
  difficulty: string;
  estimatedDistance: string;
  tasks: string[];
  bonusTask: string;
  safetyTip: string;
}

/**
 * Standard Mission model (alias of MissionData with optional ID & provenance)
 */
export type Mission = MissionData & {
  id?: string;
  provider?: string;
};

export interface Waypoint {
  id: string;
  order: number;
  title: string;
  durationMinutes: number;
  sensoryPrompt: string;
  actionChallenge: string;
  audioCueText: string;
  checkpointType: 'transition' | 'immersion' | 'discovery' | 'stillness' | 'return';
}

export interface Adventure {
  id: string;
  title: string;
  subtitle: string;
  classification: string;
  targetMinutes: number;
  biome: BiomeEnvironment;
  energyLevel: EnergyLevel;
  moodTarget: string;
  screenOffPromise: string;
  primarySensoryArtifact: string;
  gearChecklist: string[];
  waypoints: Waypoint[];
  audioBriefing: string;
  createdAt: string;
  elevationMeters?: number;
  difficulty: 'Gentle' | 'Moderate' | 'Brisk' | string;
  tasks?: string[];
  bonusTask?: string;
  safetyTip?: string;
  estimatedDistance?: string;
  isOffline?: boolean;
  offlineNotice?: string;
  provider?: 'CLOUD' | 'LOCAL' | 'OFFLINE' | string;
  providerName?: string;
}

export interface CompletedMemory {
  id: string;
  adventureId: string;
  title: string;
  // Specific user requirements: mission, date, duration, rating, reflection, activity, environment
  mission?: string;
  date: string;
  duration?: number; // duration in minutes
  outdoorMinutes: number;
  rating: number; // 1 to 5 (mapped to 😕 😐 🙂 😄 🤩)
  ratingEmoji?: string;
  reflection?: string;
  activity?: string;
  environment?: string;
  biome: BiomeEnvironment;
  moodBefore?: string;
  moodAfter?: string;
  sensoryHighlight?: string;
  fieldNote?: string;
  photoUrl?: string;
  waypointsCompleted: number;
  totalWaypoints: number;
  estimatedSteps: number;
  tags: string[];
}

/**
 * AdventureMemory: Full explorer record of a logged expedition
 */
export type AdventureMemory = CompletedMemory;

/**
 * AdventureReflection: User post-adventure reflection record
 */
export interface AdventureReflection {
  adventureId: string;
  rating: number; // 1-5
  ratingEmoji?: string;
  reflection: string;
  moodBefore?: string;
  moodAfter?: string;
  sensoryHighlight?: string;
  recordedAt: string;
}

/**
 * AdventureStats: Calculated statistics model from real completed adventures
 */
export interface AdventureStats {
  outdoorMinutes: number;
  adventuresCompleted: number;
  estimatedDistanceKm: number;
  estimatedDistanceMi: number;
  favoriteActivity: string;
  favoriteActivityCount: number;
  currentStreakDays: number;
  longestStreakDays: number;
  weeklyOutdoorMinutes: number;
  past7DaysOutdoorMinutes: number;
  totalSteps: number;
  biomesExploredCount: number;
  favoriteBiome: string;
  completionRate: number;
  averageSessionMinutes: number;
  expeditionLog?: AdventureMemory[];
}

export interface UserSettings {
  units: 'km' | 'mi';
  audioVoiceEnabled: boolean;
  speechRate: number;
  speechPitch: number;
  chimeIntervalMinutes: number;
  ambientSound: 'forest' | 'stream' | 'wind' | 'off';
  highContrastMode: boolean;
  pocketModeAutoDim: boolean;
  userName: string;
  emergencyContact: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  experienceLevel?: 'Novice Explorer' | 'Seasoned Rambler' | 'Trail Master';
  preferredBiome?: string;
  createdAt?: string;
  lastLoginAt?: string;
  totalAdventures?: number;
  totalOutdoorMinutes?: number;
}

