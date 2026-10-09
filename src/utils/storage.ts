import {
  Adventure,
  AdventureMemory,
  AdventureReflection,
  AdventureStats,
  CompletedMemory,
  Mission,
  MissionData,
  UserPreferences,
  UserSettings,
} from '../types';
import { calculateAdventureStatistics } from './statsCalculator';

/**
 * Storage keys used for TrailMind persistence
 */
const STORAGE_KEYS = {
  PREFERENCES: 'trailmind_preferences',
  CURRENT_ADVENTURE: 'trailmind_current_adventure',
  CURRENT_MISSION: 'trailmind_current_mission',
  ACTIVE_SESSION: 'trailmind_active_session',
  MEMORIES: 'trailmind_memories',
  REFLECTIONS: 'trailmind_reflections',
  SETTINGS: 'trailmind_settings',
} as const;

export const DEFAULT_PREFERENCES: UserPreferences = {
  timeMinutes: 20,
  mood: 'overstimulated',
  energy: 'medium',
  environment: 'forest_trail',
  activity: 'mindful_stroll',
  sensoryFocus: 'wind_soundscape',
};

export const DEFAULT_SETTINGS: UserSettings = {
  units: 'km',
  audioVoiceEnabled: true,
  speechRate: 0.95,
  speechPitch: 1.0,
  chimeIntervalMinutes: 5,
  ambientSound: 'forest',
  highContrastMode: false,
  pocketModeAutoDim: true,
  userName: 'Wanderer',
  emergencyContact: '',
};

const SEED_MEMORIES: CompletedMemory[] = [
  {
    id: 'mem-101',
    adventureId: 'adv-seed-1',
    title: 'The Moss Corridor & Pine Needle Trail',
    mission: 'The Moss Corridor & Pine Needle Trail',
    date: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // ~1 day ago
    duration: 24,
    outdoorMinutes: 24,
    rating: 5,
    ratingEmoji: '🤩',
    reflection: 'Stepped away from screens at 4 PM. Didn’t check phone once. Brain feels totally de-fragmented.',
    activity: 'Nature',
    environment: 'Forest',
    biome: 'forest_trail',
    moodBefore: 'Overstimulated & tight shoulders',
    moodAfter: 'Deeply grounded, quiet mind',
    sensoryHighlight: 'Cold cedar bark texture against fingertips and the distinct petrichor smell of damp needles.',
    fieldNote: 'Stepped away from screens at 4 PM. Didn’t check phone once. Brain feels totally de-fragmented.',
    waypointsCompleted: 4,
    totalWaypoints: 4,
    estimatedSteps: 2840,
    tags: ['Forest', 'Petrichor', 'Quiet'],
  },
  {
    id: 'mem-102',
    adventureId: 'adv-seed-2',
    title: 'Twilight Riverbank Wind & Stone Hunt',
    mission: 'Twilight Riverbank Wind & Stone Hunt',
    date: new Date(Date.now() - 1000 * 60 * 60 * 74).toISOString(), // ~3 days ago
    duration: 35,
    outdoorMinutes: 35,
    rating: 5,
    ratingEmoji: '😄',
    reflection: 'The 5-minute silence waypoint broke the mental loop I had been stuck in for three days straight.',
    activity: 'Mindfulness',
    environment: 'Riverside',
    biome: 'waterfront',
    moodBefore: 'Creative block on project proposal',
    moodAfter: 'Spark of clarity and mental space',
    sensoryHighlight: 'Watched ripples on water catch amber twilight. Found a flat river shale stone with quartz veins.',
    fieldNote: 'The 5-minute silence waypoint broke the mental loop I had been stuck in for three days straight.',
    waypointsCompleted: 4,
    totalWaypoints: 4,
    estimatedSteps: 4120,
    tags: ['Riverside', 'Sunset', 'Stillness'],
  },
  {
    id: 'mem-103',
    adventureId: 'adv-seed-3',
    title: 'The Rooftop Skyline Horizon Sweep',
    mission: 'The Rooftop Skyline Horizon Sweep',
    date: new Date(Date.now() - 1000 * 60 * 60 * 148).toISOString(), // ~6 days ago
    duration: 15,
    outdoorMinutes: 15,
    rating: 4,
    ratingEmoji: '🙂',
    reflection: 'Proof that 15 minutes outside does what three cups of espresso fail to do.',
    activity: 'Walking',
    environment: 'Park',
    biome: 'urban_park',
    moodBefore: 'Sluggish afternoon slump',
    moodAfter: 'Alert, energized breathing',
    sensoryHighlight: 'Gust of wind hitting forehead at the open crest; 3 hawks circling in the thermal updraft.',
    fieldNote: 'Proof that 15 minutes outside does what three cups of espresso fail to do.',
    waypointsCompleted: 3,
    totalWaypoints: 3,
    estimatedSteps: 1890,
    tags: ['Park', 'Brisk', 'Wind'],
  },
];

export interface ActiveSessionData {
  adventureId: string;
  startTimestamp: number;
  currentWaypointIndex: number;
  isPaused: boolean;
  pocketMode: boolean;
  notes: string[];
  photoUrls: string[];
  completedChecklist?: string[];
  completedTaskIndices?: number[];
  targetSeconds?: number;
}

/**
 * Robust safe parsing helper that never throws or crashes on corrupt storage
 */
function safeGetJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback;
  }
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch (error) {
    console.warn(`[TrailMind Storage] Failed parsing ${key}, falling back safely:`, error);
    return fallback;
  }
}

/**
 * Robust safe saving helper with quota handling and silent recovery
 */
function safeSetJSON(key: string, value: unknown): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[TrailMind Storage] Failed saving ${key}:`, error);
    return false;
  }
}

function safeRemoveItem(key: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// ============================================================================
// 1. User Preferences
// ============================================================================

export function getPreferences(): UserPreferences {
  const prefs = safeGetJSON<UserPreferences>(STORAGE_KEYS.PREFERENCES, DEFAULT_PREFERENCES);
  // Ensure valid fallback fields
  if (!prefs || typeof prefs !== 'object' || !prefs.timeMinutes) {
    return DEFAULT_PREFERENCES;
  }
  return { ...DEFAULT_PREFERENCES, ...prefs };
}

export function savePreferences(prefs: UserPreferences): void {
  safeSetJSON(STORAGE_KEYS.PREFERENCES, prefs);
}

// ============================================================================
// 2. Mission Persistence
// ============================================================================

export function saveMission(mission: Mission | MissionData): void {
  safeSetJSON(STORAGE_KEYS.CURRENT_MISSION, mission);
}

export function getMission(): Mission | null {
  const mission = safeGetJSON<Mission | null>(STORAGE_KEYS.CURRENT_MISSION, null);
  if (!mission || typeof mission !== 'object' || !mission.title) {
    return null;
  }
  return mission;
}

// ============================================================================
// 3. Adventure Persistence (Current / Staged)
// ============================================================================

export function getCurrentAdventure(): Adventure | null {
  const adv = safeGetJSON<Adventure | null>(STORAGE_KEYS.CURRENT_ADVENTURE, null);
  if (!adv || typeof adv !== 'object' || !adv.id || !adv.title) {
    return null;
  }
  return adv;
}

export function saveCurrentAdventure(adv: Adventure): void {
  safeSetJSON(STORAGE_KEYS.CURRENT_ADVENTURE, adv);
  // Also keep Mission copy synchronized
  if (adv.tasks) {
    saveMission({
      title: adv.title,
      description: adv.subtitle || '',
      category: adv.classification || 'Nature',
      durationMinutes: adv.targetMinutes || 20,
      difficulty: adv.difficulty || 'Moderate',
      estimatedDistance: adv.estimatedDistance || '1.5 km',
      tasks: adv.tasks,
      bonusTask: adv.bonusTask || '',
      safetyTip: adv.safetyTip || 'Stay present and aware of footing.',
    });
  }
}

// ============================================================================
// 4. Active Adventure Session
// ============================================================================

export function getActiveSession(): ActiveSessionData | null {
  const session = safeGetJSON<ActiveSessionData | null>(STORAGE_KEYS.ACTIVE_SESSION, null);
  if (!session || typeof session !== 'object' || !session.adventureId || !session.startTimestamp) {
    return null;
  }
  return session;
}

/**
 * Standard function alias required by specification
 */
export function getActiveAdventure(): { adventure: Adventure | null; session: ActiveSessionData | null } | null {
  const session = getActiveSession();
  const adventure = getCurrentAdventure();
  if (!session && !adventure) return null;
  return { adventure, session };
}

export function startAdventure(adventure: Adventure, targetSeconds?: number): ActiveSessionData {
  saveCurrentAdventure(adventure);
  const session: ActiveSessionData = {
    adventureId: adventure.id,
    startTimestamp: Date.now(),
    currentWaypointIndex: 0,
    isPaused: false,
    pocketMode: false,
    notes: [],
    photoUrls: [],
    completedChecklist: [],
    completedTaskIndices: [],
    targetSeconds: targetSeconds || (adventure.targetMinutes || 20) * 60,
  };
  saveActiveSession(session);
  return session;
}

export function saveActiveSession(session: ActiveSessionData): void {
  safeSetJSON(STORAGE_KEYS.ACTIVE_SESSION, session);
}

export function updateAdventureProgress(
  updates: Partial<ActiveSessionData>
): ActiveSessionData | null {
  const current = getActiveSession();
  if (!current) return null;
  const updated: ActiveSessionData = { ...current, ...updates };
  saveActiveSession(updated);
  return updated;
}

export function clearActiveSession(): void {
  safeRemoveItem(STORAGE_KEYS.ACTIVE_SESSION);
}

// ============================================================================
// 5. Completed Adventures & Reflections
// ============================================================================

/**
 * Saves a reflection record
 */
export function saveReflection(reflection: AdventureReflection): void {
  const existing = safeGetJSON<AdventureReflection[]>(STORAGE_KEYS.REFLECTIONS, []);
  const updated = [reflection, ...existing.filter((r) => r.adventureId !== reflection.adventureId)];
  safeSetJSON(STORAGE_KEYS.REFLECTIONS, updated);
}

export function getReflections(): AdventureReflection[] {
  return safeGetJSON<AdventureReflection[]>(STORAGE_KEYS.REFLECTIONS, []);
}

/**
 * Completes an active adventure and logs it into historical memories
 */
export function completeAdventure(
  adventure: Adventure | null,
  summary: {
    elapsedSeconds: number;
    waypointsCompleted: number;
    rating?: number;
    ratingEmoji?: string;
    reflection?: string;
    photos?: string[];
    notes?: string[];
  }
): CompletedMemory {
  const actualMinutes = Math.max(1, Math.round((summary.elapsedSeconds || 1200) / 60));
  const advTitle = adventure?.title || 'Spontaneous Outdoor Wander';
  const activityName = adventure?.classification || adventure?.moodTarget || 'Nature Walk';
  const envName = adventure?.biome ? adventure.biome.replace(/_/g, ' ') : 'Outdoors';

  const memory: CompletedMemory = {
    id: `mem-${Date.now()}`,
    adventureId: adventure?.id || `adv-${Date.now()}`,
    title: advTitle,
    mission: advTitle,
    date: new Date().toISOString(),
    duration: actualMinutes,
    outdoorMinutes: actualMinutes,
    rating: summary.rating || 4,
    ratingEmoji: summary.ratingEmoji || '😄',
    reflection: summary.reflection?.trim() || 'Felt the outdoor air, saw details in the landscape, left the phone tucked away.',
    activity: activityName,
    environment: envName,
    biome: adventure?.biome || 'forest_trail',
    moodBefore: adventure?.moodTarget || 'Indoor screen fatigue',
    moodAfter: 'Refreshed & grounded',
    sensoryHighlight: summary.reflection?.trim() || 'Noticed sunlight filtering through leaves and fresh air.',
    fieldNote: summary.reflection?.trim() || 'Stepped outside and disconnected from digital noise.',
    waypointsCompleted: summary.waypointsCompleted || 3,
    totalWaypoints: adventure?.tasks?.length || adventure?.waypoints?.length || 3,
    estimatedSteps: Math.round(actualMinutes * 115),
    tags: [envName, activityName, `${actualMinutes} min`],
  };

  // Add to persistent memories
  addMemory(memory);

  // If a reflection was entered, save it
  if (summary.reflection) {
    saveReflection({
      adventureId: memory.adventureId,
      rating: memory.rating,
      ratingEmoji: memory.ratingEmoji,
      reflection: summary.reflection,
      recordedAt: memory.date,
    });
  }

  // Clear active session upon completion
  clearActiveSession();

  return memory;
}

// ============================================================================
// 6. Memories & Adventure History
// ============================================================================

export function getMemories(): CompletedMemory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMORIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  // Initialize with seed memories if storage is empty
  saveMemories(SEED_MEMORIES);
  return SEED_MEMORIES;
}

/**
 * Standard function alias required by specification
 */
export function getAdventureHistory(): CompletedMemory[] {
  return getMemories();
}

/**
 * Standard function alias required by specification
 */
export function saveMemory(memory: CompletedMemory): void {
  addMemory(memory);
}

export function saveMemories(memories: CompletedMemory[]): void {
  safeSetJSON(STORAGE_KEYS.MEMORIES, memories);
}

export function addMemory(memory: CompletedMemory): void {
  const list = getMemories();
  const updated = [memory, ...list];
  saveMemories(updated);
}

export function deleteMemory(id: string): void {
  const list = getMemories();
  const updated = list.filter((m) => m.id !== id);
  saveMemories(updated);
}

// ============================================================================
// 7. Settings Persistence
// ============================================================================

export function getSettings(): UserSettings {
  const settings = safeGetJSON<UserSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  if (!settings || typeof settings !== 'object') {
    return DEFAULT_SETTINGS;
  }
  return { ...DEFAULT_SETTINGS, ...settings };
}

export function saveSettings(settings: UserSettings): void {
  safeSetJSON(STORAGE_KEYS.SETTINGS, settings);
}

// ============================================================================
// 8. Statistics Calculation Function
// ============================================================================

/**
 * Calculates current real adventure statistics from stored memories
 */
export function calculateStats(): AdventureStats {
  const memories = getMemories();
  const settings = getSettings();
  const calculated = calculateAdventureStatistics(memories, settings);

  return {
    outdoorMinutes: calculated.outdoorMinutes,
    adventuresCompleted: calculated.adventuresCompleted,
    estimatedDistanceKm: calculated.estimatedDistanceKm,
    estimatedDistanceMi: calculated.estimatedDistanceMi,
    favoriteActivity: calculated.favoriteActivity,
    favoriteActivityCount: calculated.favoriteActivityCount,
    currentStreakDays: calculated.currentStreakDays,
    longestStreakDays: calculated.longestStreakDays,
    weeklyOutdoorMinutes: calculated.weeklyOutdoorMinutes,
    past7DaysOutdoorMinutes: calculated.past7DaysOutdoorMinutes,
    totalSteps: calculated.totalSteps,
    biomesExploredCount: calculated.biomesExploredCount,
    favoriteBiome: calculated.favoriteBiome,
    completionRate: calculated.completionRate,
    averageSessionMinutes: calculated.averageSessionMinutes,
    expeditionLog: memories,
  };
}

// ============================================================================
// 9. Demo Data Reset
// ============================================================================

export function resetDemoData(): void {
  saveMemories(SEED_MEMORIES);
  savePreferences(DEFAULT_PREFERENCES);
  saveSettings(DEFAULT_SETTINGS);
  safeRemoveItem(STORAGE_KEYS.REFLECTIONS);
  safeRemoveItem(STORAGE_KEYS.CURRENT_MISSION);
  clearActiveSession();
}

/**
 * Storage Service Object for modular dependency injection if desired
 */
export const storageService = {
  savePreferences,
  getPreferences,
  saveMission,
  getMission,
  startAdventure,
  getActiveAdventure,
  getActiveSession,
  saveActiveSession,
  updateAdventureProgress,
  completeAdventure,
  saveReflection,
  getReflections,
  getAdventureHistory,
  saveMemory,
  getMemories,
  addMemory,
  deleteMemory,
  getCurrentAdventure,
  saveCurrentAdventure,
  clearActiveSession,
  getSettings,
  saveSettings,
  calculateStats,
  resetDemoData,
};
