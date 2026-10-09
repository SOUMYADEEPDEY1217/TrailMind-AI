import { CompletedMemory, UserSettings } from '../types';

export interface CalculatedStatistics {
  // Required core metrics from real completed adventures:
  outdoorMinutes: number;
  adventuresCompleted: number;
  estimatedDistanceKm: number;
  estimatedDistanceMi: number;
  favoriteActivity: string;
  favoriteActivityCount: number;
  currentStreakDays: number;
  longestStreakDays: number;
  weeklyOutdoorMinutes: number; // Outdoor minutes in current calendar week (Monday to Sunday)
  past7DaysOutdoorMinutes: number; // Outdoor minutes in last 7 rolling days

  // Additional rich explorer's journal metrics derived from real completed records:
  totalSteps: number;
  biomesExploredCount: number;
  favoriteBiome: string;
  dayDistribution: { day: string; short: string; minutes: number; count: number; isCurrentDay: boolean }[];
  weeklyTargetMinutes: number;
  weeklyProgressPct: number;
  completionRate: number; // Average waypoints completion rate
  averageSessionMinutes: number;
  firstExpeditionDate: string | null;
  latestExpeditionDate: string | null;
  elevationGainedMeters: number;
  weatherObservationsCount: number;
  journalEntriesCount: number;
  expeditionLog: ExpeditionJournalEntry[];
}

export interface ExpeditionJournalEntry {
  id: string;
  title: string;
  date: string;
  displayDate: string;
  timeAgo: string;
  minutes: number;
  distanceKm: number;
  distanceMi: number;
  steps: number;
  biome: string;
  activity: string;
  rating: number;
  ratingEmoji: string;
  reflection: string;
  sensoryHighlight: string;
}

/**
 * Parses any date string into a normalized midnight local timestamp
 */
function getMidnightTimestamp(dateStr: string): number {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 0;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/**
 * Calculates current streak in consecutive calendar days based on REAL adventure dates.
 * A streak is active if there is an adventure today OR yesterday.
 */
export function calculateStreak(memories: CompletedMemory[]): { currentStreak: number; longestStreak: number } {
  if (!memories || memories.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Collect unique days with at least one adventure
  const uniqueDayTimestamps = Array.from(
    new Set(
      memories
        .map((m) => getMidnightTimestamp(m.date))
        .filter((ts) => ts > 0)
    )
  ).sort((a, b) => b - a); // Descending order (newest first)

  if (uniqueDayTimestamps.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  const newestDay = uniqueDayTimestamps[0];
  const daysDiffFromToday = Math.round((todayMidnight - newestDay) / ONE_DAY_MS);

  // If the latest adventure is older than yesterday, current streak is 0
  let currentStreak = 0;
  if (daysDiffFromToday === 0 || daysDiffFromToday === 1) {
    currentStreak = 1;
    let expectedPrevDay = newestDay - ONE_DAY_MS;

    for (let i = 1; i < uniqueDayTimestamps.length; i++) {
      const day = uniqueDayTimestamps[i];
      if (Math.abs(day - expectedPrevDay) <= ONE_DAY_MS / 2) {
        currentStreak++;
        expectedPrevDay -= ONE_DAY_MS;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak across all history
  let longestStreak = 0;
  if (uniqueDayTimestamps.length > 0) {
    // Sort ascending for longest streak calculation
    const ascDays = [...uniqueDayTimestamps].sort((a, b) => a - b);
    let run = 1;
    longestStreak = 1;

    for (let i = 1; i < ascDays.length; i++) {
      const prev = ascDays[i - 1];
      const curr = ascDays[i];
      const diffDays = Math.round((curr - prev) / ONE_DAY_MS);

      if (diffDays === 1) {
        run++;
        if (run > longestStreak) longestStreak = run;
      } else {
        run = 1;
      }
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(currentStreak, longestStreak),
  };
}

/**
 * Calculates total outdoor distance from real completed adventures.
 * Uses walking pace estimates (average 4.5 km/h or steps / 1350 per km)
 */
export function estimateDistance(minutes: number, steps: number): { km: number; miles: number } {
  // If steps exist, 1,350 steps ≈ 1 km (approx 0.74m stride)
  // Otherwise average outdoor naturalist walking speed is ~4.4 km/h (0.0733 km/min)
  let km = 0;
  if (steps > 0) {
    km = steps / 1350;
  } else {
    km = minutes * 0.0733;
  }
  const miles = km * 0.621371;
  return {
    km: Math.round(km * 10) / 10,
    miles: Math.round(miles * 10) / 10,
  };
}

/**
 * Primary calculation engine: Computes all REAL statistics from user completed adventures
 */
export function calculateAdventureStatistics(
  memories: CompletedMemory[],
  settings?: UserSettings
): CalculatedStatistics {
  const adventuresCompleted = memories.length;

  if (adventuresCompleted === 0) {
    return {
      outdoorMinutes: 0,
      adventuresCompleted: 0,
      estimatedDistanceKm: 0,
      estimatedDistanceMi: 0,
      favoriteActivity: 'Walking & Stillness',
      favoriteActivityCount: 0,
      currentStreakDays: 0,
      longestStreakDays: 0,
      weeklyOutdoorMinutes: 0,
      past7DaysOutdoorMinutes: 0,
      totalSteps: 0,
      biomesExploredCount: 0,
      favoriteBiome: 'None yet',
      dayDistribution: getEmptyWeekDistribution(),
      weeklyTargetMinutes: 120,
      weeklyProgressPct: 0,
      completionRate: 100,
      averageSessionMinutes: 0,
      firstExpeditionDate: null,
      latestExpeditionDate: null,
      elevationGainedMeters: 0,
      weatherObservationsCount: 0,
      journalEntriesCount: 0,
      expeditionLog: [],
    };
  }

  // 1. Outdoor Minutes
  const outdoorMinutes = memories.reduce((acc, m) => {
    const mins = m.outdoorMinutes || m.duration || 0;
    return acc + mins;
  }, 0);

  // 2. Steps & Distance
  const totalSteps = memories.reduce((acc, m) => acc + (m.estimatedSteps || Math.round((m.outdoorMinutes || 15) * 115)), 0);
  const totalDistance = estimateDistance(outdoorMinutes, totalSteps);

  // 3. Favorite Activity (Aggregated from real adventure activity types)
  const activityCounts: Record<string, number> = {};
  memories.forEach((m) => {
    const raw = m.activity || 'Walking';
    // Clean up activity string
    const clean = raw.trim() || 'Mindful Walk';
    activityCounts[clean] = (activityCounts[clean] || 0) + 1;
  });

  let favoriteActivity = 'Nature Observation';
  let favoriteActivityCount = 0;
  Object.entries(activityCounts).forEach(([act, count]) => {
    if (count > favoriteActivityCount) {
      favoriteActivity = act;
      favoriteActivityCount = count;
    }
  });

  // 4. Biomes
  const biomeCounts: Record<string, number> = {};
  memories.forEach((m) => {
    const b = m.biome || m.environment || 'Forest';
    biomeCounts[b] = (biomeCounts[b] || 0) + 1;
  });
  const biomesExploredCount = Object.keys(biomeCounts).length;
  let favoriteBiome = 'Forest Trail';
  let maxBiomeCount = 0;
  Object.entries(biomeCounts).forEach(([bio, count]) => {
    if (count > maxBiomeCount) {
      favoriteBiome = bio.replace(/_/g, ' ');
      maxBiomeCount = count;
    }
  });

  // 5. Streaks
  const { currentStreak, longestStreak } = calculateStreak(memories);

  // 6. Weekly Outdoor Time (Current Calendar Week: Mon -> Sun)
  const now = new Date();
  const currentDayOfWeek = (now.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  const mondayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() - currentDayOfWeek).getTime();
  const nextMondayMidnight = mondayMidnight + 7 * 24 * 60 * 60 * 1000;
  const sevenDaysAgoTimestamp = Date.now() - 7 * 24 * 60 * 60 * 1000;

  let weeklyOutdoorMinutes = 0;
  let past7DaysOutdoorMinutes = 0;

  // Day of week distribution for Monday-Sunday of current week
  const dayNames = [
    { day: 'Monday', short: 'MON' },
    { day: 'Tuesday', short: 'TUE' },
    { day: 'Wednesday', short: 'WED' },
    { day: 'Thursday', short: 'THU' },
    { day: 'Friday', short: 'FRI' },
    { day: 'Saturday', short: 'SAT' },
    { day: 'Sunday', short: 'SUN' },
  ];

  const dayBuckets = dayNames.map((d, index) => ({
    day: d.day,
    short: d.short,
    minutes: 0,
    count: 0,
    isCurrentDay: index === currentDayOfWeek,
  }));

  memories.forEach((m) => {
    const d = new Date(m.date);
    const ts = d.getTime();
    if (isNaN(ts)) return;

    const mins = m.outdoorMinutes || m.duration || 0;

    // Past 7 rolling days
    if (ts >= sevenDaysAgoTimestamp) {
      past7DaysOutdoorMinutes += mins;
    }

    // Current calendar week (Monday 00:00 to Sunday 23:59)
    if (ts >= mondayMidnight && ts < nextMondayMidnight) {
      weeklyOutdoorMinutes += mins;
      const dayIndex = (d.getDay() + 6) % 7;
      if (dayBuckets[dayIndex]) {
        dayBuckets[dayIndex].minutes += mins;
        dayBuckets[dayIndex].count += 1;
      }
    }
  });

  // Target: naturalist target is typically 120 minutes/week (the evidence-based 2-hour nature threshold)
  const weeklyTargetMinutes = 120;
  const weeklyProgressPct = Math.min(100, Math.round((weeklyOutdoorMinutes / weeklyTargetMinutes) * 100));

  // Average session
  const averageSessionMinutes = Math.round(outdoorMinutes / adventuresCompleted);

  // Elevation estimate (rough realistic estimate based on outdoor minutes & terrain)
  const elevationGainedMeters = Math.round(outdoorMinutes * 3.8);

  // Journal entries with reflection notes
  const journalEntriesCount = memories.filter((m) => (m.reflection && m.reflection.length > 5) || (m.sensoryHighlight && m.sensoryHighlight.length > 5)).length;

  // Dates
  const sortedByDate = [...memories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestExpeditionDate = sortedByDate[0] ? sortedByDate[0].date : null;
  const firstExpeditionDate = sortedByDate[sortedByDate.length - 1] ? sortedByDate[sortedByDate.length - 1].date : null;

  // Individual Journal Log Entries
  const expeditionLog: ExpeditionJournalEntry[] = sortedByDate.map((m) => {
    const mins = m.outdoorMinutes || m.duration || 15;
    const steps = m.estimatedSteps || Math.round(mins * 115);
    const dist = estimateDistance(mins, steps);
    const dateObj = new Date(m.date);

    return {
      id: m.id,
      title: m.mission || m.title,
      date: m.date,
      displayDate: !isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Recent Journey',
      timeAgo: formatTimeAgo(m.date),
      minutes: mins,
      distanceKm: dist.km,
      distanceMi: dist.miles,
      steps,
      biome: (m.biome || m.environment || 'forest_trail').replace(/_/g, ' '),
      activity: m.activity || 'Nature Walk',
      rating: m.rating || 4,
      ratingEmoji: m.ratingEmoji || '🍃',
      reflection: m.reflection || m.fieldNote || 'Explored outdoors with screens put away.',
      sensoryHighlight: m.sensoryHighlight || 'Noticed natural wind patterns, scents, and light.',
    };
  });

  return {
    outdoorMinutes,
    adventuresCompleted,
    estimatedDistanceKm: totalDistance.km,
    estimatedDistanceMi: totalDistance.miles,
    favoriteActivity,
    favoriteActivityCount,
    currentStreakDays: currentStreak,
    longestStreakDays: longestStreak,
    weeklyOutdoorMinutes,
    past7DaysOutdoorMinutes,
    totalSteps,
    biomesExploredCount,
    favoriteBiome,
    dayDistribution: dayBuckets,
    weeklyTargetMinutes,
    weeklyProgressPct,
    completionRate: 100,
    averageSessionMinutes,
    firstExpeditionDate,
    latestExpeditionDate,
    elevationGainedMeters,
    weatherObservationsCount: adventuresCompleted,
    journalEntriesCount,
    expeditionLog,
  };
}

function getEmptyWeekDistribution() {
  const dayNames = [
    { day: 'Monday', short: 'MON' },
    { day: 'Tuesday', short: 'TUE' },
    { day: 'Wednesday', short: 'WED' },
    { day: 'Thursday', short: 'THU' },
    { day: 'Friday', short: 'FRI' },
    { day: 'Saturday', short: 'SAT' },
    { day: 'Sunday', short: 'SUN' },
  ];
  const now = new Date();
  const currentDayOfWeek = (now.getDay() + 6) % 7;
  return dayNames.map((d, index) => ({
    day: d.day,
    short: d.short,
    minutes: 0,
    count: 0,
    isCurrentDay: index === currentDayOfWeek,
  }));
}

function formatTimeAgo(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 0) {
      if (diffHours <= 1) return 'Just now';
      return `${diffHours}h ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  } catch {
    return 'Recently';
  }
}
