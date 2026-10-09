import React, { useState, useMemo, useEffect } from 'react';
import {
  Clock,
  Battery,
  MapPin,
  Sparkles,
  Compass,
  ArrowRight,
  Wind,
  Flower2,
  Mountain,
  Volume2,
  TreePine,
  Building2,
  Waves,
  Sun,
  Eye,
  Camera,
  Activity,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  Adventure,
  UserPreferences,
} from '../types';
import { generateAdventure, generateOfflineAdventure } from '../utils/adventureEngine';
import { saveCurrentAdventure, savePreferences, getPreferences } from '../utils/storage';
import { audioSynth } from '../utils/audioSynth';
import { aiClient } from '../services/ai/aiClient';
import { AIStatusIndicator } from '../components/AIStatusIndicator';

interface ExplorePageProps {
  onNavigate: (route: string) => void;
  onAdventureCreated: (adv: Adventure) => void;
}

type TimeOption = '10 min' | '20 min' | '30 min' | '1 hour' | '2+ hours';
type MoodOption =
  | 'Stressed'
  | 'Bored'
  | 'Tired'
  | 'Curious'
  | 'Adventurous'
  | 'Happy'
  | 'Need Focus';
type EnergyOption = 'Low' | 'Medium' | 'High';
type EnvironmentOption =
  | 'Neighborhood'
  | 'City'
  | 'Park'
  | 'Campus'
  | 'Garden'
  | 'Forest'
  | 'Trail'
  | 'Riverside'
  | 'Beach'
  | 'Countryside';
type ActivityOption =
  | 'Walking'
  | 'Running'
  | 'Photography'
  | 'Nature'
  | 'Bird Watching'
  | 'Mindfulness'
  | 'Exploration'
  | 'Fitness'
  | 'Gardening'
  | 'Surprise Me';

export const ExplorePage: React.FC<ExplorePageProps> = ({
  onNavigate,
  onAdventureCreated,
}) => {
  const initialPrefs = getPreferences();

  // Selected State
  const [selectedTime, setSelectedTime] = useState<TimeOption>('30 min');
  const [selectedMood, setSelectedMood] = useState<MoodOption>('Stressed');
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyOption>('Medium');
  const [selectedEnvironment, setSelectedEnvironment] = useState<EnvironmentOption>('Forest');
  const [selectedActivity, setSelectedActivity] = useState<ActivityOption>('Mindfulness');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLog, setGenerationLog] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [telemetryIndex, setTelemetryIndex] = useState(0);

  const telemetrySteps = useMemo(() => [
    `Surveying terrain topography across the ${selectedEnvironment}...`,
    `Calibrating ${selectedTime} loop for ${selectedEnergy.toLowerCase()} physical energy...`,
    `Synthesizing sensory markers to dissolve ${selectedMood.toLowerCase()} mental tension...`,
    `Etching actionable waypoints for ${selectedActivity.toLowerCase()}...`,
    `Finalizing offline pocket guide and departure threshold...`,
  ], [selectedEnvironment, selectedTime, selectedEnergy, selectedMood, selectedActivity]);

  useEffect(() => {
    if (!isGenerating) {
      setTelemetryIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setTelemetryIndex((prev) => (prev + 1) % telemetrySteps.length);
    }, 650);
    return () => clearInterval(interval);
  }, [isGenerating, telemetrySteps.length]);

  const telemetryMessage = telemetrySteps[telemetryIndex] || telemetrySteps[0];

  // Time conversion to minutes
  const timeInMinutes = useMemo(() => {
    switch (selectedTime) {
      case '10 min':
        return 10;
      case '20 min':
        return 20;
      case '30 min':
        return 30;
      case '1 hour':
        return 60;
      case '2+ hours':
        return 120;
      default:
        return 30;
    }
  }, [selectedTime]);

  // Options Data
  const timeOptions: TimeOption[] = ['10 min', '20 min', '30 min', '1 hour', '2+ hours'];

  const moodOptions: { id: MoodOption; label: string; desc: string }[] = [
    { id: 'Stressed', label: 'Stressed', desc: 'Screen burnout & mental clutter' },
    { id: 'Bored', label: 'Bored', desc: 'Seeking novelty & fresh eyes' },
    { id: 'Tired', label: 'Tired', desc: 'Low vitality, need gentle oxygen' },
    { id: 'Curious', label: 'Curious', desc: 'Micro-botany & architectural secrets' },
    { id: 'Adventurous', label: 'Adventurous', desc: 'New boundaries & summit pushes' },
    { id: 'Happy', label: 'Happy', desc: 'Celebrate the open sky & sunshine' },
    { id: 'Need Focus', label: 'Need Focus', desc: 'Reset focal length from 15in to infinity' },
  ];

  const energyOptions: { id: EnergyOption; label: string; paceDesc: string }[] = [
    { id: 'Low', label: 'Low', paceDesc: 'Slow, contemplative stroll' },
    { id: 'Medium', label: 'Medium', paceDesc: 'Steady unhurried stride' },
    { id: 'High', label: 'High', paceDesc: 'Brisk cadence & elevation' },
  ];

  const environmentOptions: {
    id: EnvironmentOption;
    label: string;
    sub: string;
  }[] = [
    { id: 'Forest', label: 'Forest', sub: 'Canopy & pine' },
    { id: 'Trail', label: 'Trail', sub: 'Ridges & dirt' },
    { id: 'Riverside', label: 'Riverside', sub: 'Current & stones' },
    { id: 'Beach', label: 'Beach', sub: 'Tides & sea mist' },
    { id: 'Park', label: 'Park', sub: 'Lawns & oaks' },
    { id: 'Garden', label: 'Garden', sub: 'Soil & living flora' },
    { id: 'Neighborhood', label: 'Neighborhood', sub: 'Alleys & brick' },
    { id: 'City', label: 'City', sub: 'Stone & skyline' },
    { id: 'Campus', label: 'Campus', sub: 'Quads & elms' },
    { id: 'Countryside', label: 'Countryside', sub: 'Meadow & hills' },
  ];

  const activityOptions: { id: ActivityOption; label: string }[] = [
    { id: 'Walking', label: 'Walking' },
    { id: 'Mindfulness', label: 'Mindfulness' },
    { id: 'Nature', label: 'Nature' },
    { id: 'Photography', label: 'Photography' },
    { id: 'Bird Watching', label: 'Bird Watching' },
    { id: 'Exploration', label: 'Exploration' },
    { id: 'Running', label: 'Running' },
    { id: 'Fitness', label: 'Fitness' },
    { id: 'Gardening', label: 'Gardening' },
    { id: 'Surprise Me', label: 'Surprise Me' },
  ];

  // Dynamic Landscape Background calculation
  const environmentTheme = useMemo(() => {
    switch (selectedEnvironment) {
      case 'Forest':
        return {
          bgGradient: 'from-[#03150d] via-[#051c11] to-[#030d07]',
          accentGlow: 'rgba(74, 222, 128, 0.2)',
          contourColor: '#0c301c',
          particleColor: '#86efac',
        };
      case 'Riverside':
      case 'Beach':
        return {
          bgGradient: 'from-[#031422] via-[#052136] to-[#020b14]',
          accentGlow: 'rgba(56, 189, 248, 0.25)',
          contourColor: '#0b3554',
          particleColor: '#7dd3fc',
        };
      case 'Trail':
        return {
          bgGradient: 'from-[#091522] via-[#0e2133] to-[#050b12]',
          accentGlow: 'rgba(251, 191, 36, 0.22)',
          contourColor: '#173650',
          particleColor: '#fde047',
        };
      case 'City':
      case 'Neighborhood':
      case 'Campus':
        return {
          bgGradient: 'from-[#170e0a] via-[#241510] to-[#0a0604]',
          accentGlow: 'rgba(249, 115, 22, 0.2)',
          contourColor: '#3a2016',
          particleColor: '#fed7aa',
        };
      case 'Park':
      case 'Garden':
      case 'Countryside':
      default:
        return {
          bgGradient: 'from-[#081810] via-[#0e2619] to-[#050e09]',
          accentGlow: 'rgba(250, 204, 21, 0.2)',
          contourColor: '#143c26',
          particleColor: '#fef08a',
        };
    }
  }, [selectedEnvironment]);

  // Handle Adventure Generation with AIProvider (Local Ollama / Cloud Gemini / Offline Engine)
  const handleGenerateAdventure = async (forceOffline = false) => {
    setValidationError(null);

    // Validation
    if (!selectedTime) {
      setValidationError('Please select how much time you have outside.');
      return;
    }
    if (!selectedMood) {
      setValidationError('Please select your current mental state.');
      return;
    }
    if (!selectedEnergy) {
      setValidationError('Please select your physical energy level.');
      return;
    }
    if (!selectedEnvironment) {
      setValidationError('Please select your immediate outdoor surroundings.');
      return;
    }
    if (!selectedActivity) {
      setValidationError('Please select your preferred activity style.');
      return;
    }

    setIsGenerating(true);
    setGenerationLog(`Surveying terrain: ${selectedEnvironment} for ${selectedTime}...`);
    audioSynth.playChime('tick');

    const updatedPrefs: UserPreferences = {
      timeMinutes: timeInMinutes,
      timeLabel: selectedTime,
      mood: selectedMood,
      energy: selectedEnergy,
      environment: selectedEnvironment,
      activity: selectedActivity,
      sensoryFocus: 'wind_soundscape',
    };
    savePreferences(updatedPrefs);

    const minDelay = new Promise((resolve) => setTimeout(resolve, 1800));

    try {
      // Mission generation must use AIProvider.generateMission()
      const missionDataPromise = forceOffline
        ? generateOfflineAdventure(updatedPrefs)
        : aiClient.generateMission({
            time: selectedTime,
            mood: selectedMood,
            energy: selectedEnergy,
            environment: selectedEnvironment,
            activity: selectedActivity,
          });

      const [missionData] = await Promise.all([missionDataPromise, minDelay]);

      if (missionData && missionData.title) {
        const rawTasks: string[] =
          'tasks' in missionData && Array.isArray(missionData.tasks) && missionData.tasks.length > 0
            ? missionData.tasks
            : 'waypoints' in missionData && Array.isArray(missionData.waypoints)
            ? (missionData as any).waypoints.map((w: any) => w.actionChallenge || w.sensoryPrompt)
            : [
                'Step across your threshold and put your phone away.',
                `Walk through ${selectedEnvironment.toLowerCase()} noticing immediate sensations.`,
                'Take 60 seconds of complete silence and focus on deep breathing.',
                'Return along an unhurried route feeling grounded.',
              ];

        const durationMinutes =
          ('durationMinutes' in missionData && typeof (missionData as any).durationMinutes === 'number'
            ? (missionData as any).durationMinutes
            : 'targetMinutes' in missionData && typeof (missionData as any).targetMinutes === 'number'
            ? (missionData as any).targetMinutes
            : timeInMinutes) || timeInMinutes;

        const stepMinutes = Math.max(2, Math.floor(durationMinutes / rawTasks.length));

        const waypoints = rawTasks.map((task: string, idx: number) => ({
          id: `wp-${idx + 1}`,
          order: idx + 1,
          title:
            idx === 0
              ? 'The Departure Threshold'
              : idx === rawTasks.length - 1
              ? 'The Grounded Return'
              : `Waypoint 0${idx + 1}`,
          durationMinutes: stepMinutes,
          sensoryPrompt: task,
          actionChallenge: task,
          audioCueText: task,
          checkpointType: (idx === 0
            ? 'transition'
            : idx === rawTasks.length - 1
            ? 'return'
            : 'immersion') as any,
        }));

        const isOffline =
          forceOffline ||
          ('isOffline' in missionData && (missionData as any).isOffline) ||
          ('provider' in missionData && (missionData as any).provider === 'OFFLINE');

        const generatedAdventure: Adventure = {
          id: `adv-${Date.now()}`,
          title: missionData.title,
          subtitle:
            ('description' in missionData && (missionData as any).description) ||
            ('subtitle' in missionData && (missionData as any).subtitle) ||
            `A ${durationMinutes}-minute outdoor exploration in the ${selectedEnvironment.toLowerCase()}.`,
          classification: `${(
            ('category' in missionData && (missionData as any).category) || selectedEnvironment
          ).toUpperCase()} // ${durationMinutes} MIN // ${(
            ('difficulty' in missionData && (missionData as any).difficulty) || selectedEnergy
          ).toUpperCase()}`,
          targetMinutes: durationMinutes,
          biome: selectedEnvironment,
          energyLevel: selectedEnergy,
          moodTarget: `Transform ${selectedMood.toLowerCase()} mental state into natural presence`,
          screenOffPromise:
            'Once you step past your threshold, the phone remains stowed in your pocket until the completion chime.',
          primarySensoryArtifact: rawTasks[1] || rawTasks[0],
          gearChecklist: [
            'Outdoor footwear with traction',
            'Weather-appropriate layer',
            'Pocket or clip for hands-free phone storage',
            durationMinutes >= 30 ? 'Small bottle of water' : 'Keys only — travel light',
          ],
          waypoints,
          audioBriefing: `Welcome to TrailMind. Your mission is ${durationMinutes} minutes in the ${selectedEnvironment.toLowerCase()}. Once you step outside, tuck your phone away. The chime will guide your transitions. Breathe in deeply, and begin.`,
          createdAt: new Date().toISOString(),
          difficulty:
            ('difficulty' in missionData && (missionData as any).difficulty) ||
            (selectedEnergy === 'High' ? 'Brisk' : selectedEnergy === 'Medium' ? 'Moderate' : 'Gentle'),
          tasks: rawTasks,
          bonusTask:
            ('bonusTask' in missionData && (missionData as any).bonusTask) ||
            'Capture one unexpected detail in your surroundings.',
          safetyTip:
            ('safetyTip' in missionData && (missionData as any).safetyTip) ||
            'Stay on public paths and remain aware of footing.',
          estimatedDistance:
            ('estimatedDistance' in missionData && (missionData as any).estimatedDistance) ||
            `${(durationMinutes * 0.07).toFixed(1)} km`,
          isOffline,
          offlineNotice: isOffline ? 'TrailMind found a mission without the cloud.' : undefined,
          provider: ('provider' in missionData && (missionData as any).provider) || (isOffline ? 'OFFLINE' : 'CLOUD'),
          providerName:
            ('providerName' in missionData && (missionData as any).providerName) ||
            (isOffline ? 'TrailMind Engine' : 'Cloud AI'),
        };

        saveCurrentAdventure(generatedAdventure);
        onAdventureCreated(generatedAdventure);
        audioSynth.playChime('start');
        setIsGenerating(false);
        onNavigate('/mission');
        return;
      }
    } catch (err: any) {
      console.warn('AI generation error, executing offline template fallback:', err);
    }

    // Reliable fallback execution via TrailMind's Offline Adventure Engine
    await minDelay;
    const offlineAdventure = generateOfflineAdventure(updatedPrefs);
    offlineAdventure.isOffline = true;
    offlineAdventure.offlineNotice = 'TrailMind found a mission without the cloud.';
    offlineAdventure.provider = 'OFFLINE';
    offlineAdventure.providerName = 'TrailMind Engine';

    saveCurrentAdventure(offlineAdventure);
    onAdventureCreated(offlineAdventure);
    audioSynth.playChime('start');
    setIsGenerating(false);
    onNavigate('/mission');
  };

  return (
    <div
      className={`relative min-h-screen bg-gradient-to-b ${environmentTheme.bgGradient} pb-28 pt-20 xs:pt-24 sm:pt-32 px-4 xs:px-6 sm:px-12 lg:px-16 transition-colors duration-1000 select-none overflow-hidden`}
    >
      {/* ========================================================
          DYNAMIC ILLUSTRATED BACKGROUND (REACTS TO SELECTIONS)
         ======================================================== */}
      {/* Dynamic Ambient Sun / Horizon Glow (Changes with Environment & Mood) */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[450px] rounded-full blur-3xl pointer-events-none transition-all duration-1000 opacity-60"
        style={{
          background: `radial-gradient(circle, ${environmentTheme.accentGlow} 0%, transparent 70%)`,
        }}
      />

      {/* Dynamic Topo Mountain Silhouettes */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30 transition-all duration-1000"
        viewBox="0 0 1440 1200"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 450 L340 280 L760 480 L1120 220 L1440 370 L1440 1200 L0 1200 Z"
          fill={environmentTheme.contourColor}
        />
        <path
          d="M0 650 L420 500 L880 680 L1260 460 L1440 590 L1440 1200 L0 1200 Z"
          fill="#02060b"
          fillOpacity="0.8"
        />

        {/* Trail Pathway Dashes that pulse more actively when High Energy is selected */}
        <path
          d="M80 920 Q480 820 860 760 Q1180 700 1440 680"
          stroke={environmentTheme.particleColor}
          strokeWidth={selectedEnergy === 'High' ? '2.5' : '1.5'}
          strokeDasharray={selectedEnergy === 'High' ? '4 6' : '6 10'}
          strokeOpacity={selectedEnergy === 'High' ? '0.7' : '0.35'}
          className={selectedEnergy === 'High' ? 'animate-pulse' : ''}
        />
      </svg>

      {/* Dynamic Animated Particles (Density & Velocity shift with Energy) */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-[28%] left-[24%] w-2 h-2 rounded-full blur-[0.5px] ${
            selectedEnergy === 'High' ? 'anim-firefly-1 animate-ping' : 'anim-firefly-1'
          }`}
          style={{ backgroundColor: environmentTheme.particleColor }}
        />
        <div
          className={`absolute top-[48%] left-[68%] w-2.5 h-2.5 rounded-full blur-[0.5px] ${
            selectedEnergy === 'High' ? 'anim-firefly-2 animate-bounce' : 'anim-firefly-2'
          }`}
          style={{ backgroundColor: environmentTheme.particleColor }}
        />
        <div
          className="absolute top-[68%] left-[42%] w-1.5 h-1.5 rounded-full blur-[0.5px] anim-firefly-3"
          style={{ backgroundColor: environmentTheme.particleColor }}
        />
      </div>

      {/* ========================================================
          PAGE COMPOSITION: EDITORIAL HEADLINE & UNBOXED DIALS
         ======================================================== */}
      <div className="relative z-20 max-w-6xl mx-auto space-y-12 sm:space-y-16">
        {/* Exact Requested Heading with AI Status Indicator */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 sm:space-y-4 max-w-3xl">
            <div className="flex items-center gap-3 text-[10px] xs:text-xs font-mono uppercase tracking-[0.25em] sm:tracking-[0.3em] text-amber-400">
              <span>EXPLORE & ADVENTURE GENERATOR</span>
              <span className="w-8 h-[1px] bg-amber-400/60" />
              <span>REAL-WORLD ROUTE SYNTHESIS</span>
            </div>

            <h1 className="font-editorial text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tight leading-[0.88] text-balance">
              WHERE WILL<br />
              TODAY TAKE YOU?
            </h1>

            <p className="text-sm xs:text-base sm:text-xl text-stone-200 font-body max-w-2xl leading-relaxed pt-1 sm:pt-2">
              Set your duration, mood, pace, and immediate terrain. Watch the environment calibrate in real time.
            </p>
          </div>

          <div className="shrink-0 self-start pt-1 sm:pt-2">
            <AIStatusIndicator />
          </div>
        </div>

        {/* Validation Warning Notice if triggered */}
        {validationError && (
          <div className="p-4 border-l-2 border-red-500 bg-red-950/30 text-red-200 text-xs sm:text-sm font-mono flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* ========================================================
            NATURAL LANDSCAPE STAGING (ZERO RECTANGULAR CARDS)
           ======================================================== */}
        <div className="space-y-12 sm:space-y-16">
          {/* ==================== 1. TIME SELECTION ==================== */}
          <div className="space-y-4 border-b border-white/10 pb-10 sm:pb-12">
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 text-[11px] xs:text-xs font-mono tracking-widest uppercase">
              <span className="text-amber-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>TIME // HOW LONG CAN YOU BE OUTSIDE?</span>
              </span>
              <span className="text-white font-bold text-xs sm:text-sm tracking-wide">
                {selectedTime.toUpperCase()} COMMITTED
              </span>
            </div>

            {/* Horizontal Trail Scale */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-6 pt-3">
              {timeOptions.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      audioSynth.playChime('tick');
                      setSelectedTime(time);
                    }}
                    className={`group text-left border-b-2 pb-3 sm:pb-4 transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 text-white'
                        : 'border-white/15 text-stone-500 hover:text-stone-300 hover:border-white/30'
                    }`}
                  >
                    <div className="font-editorial text-2xl xs:text-3xl sm:text-4xl font-black">
                      {time.split(' ')[0]}
                    </div>
                    <div className="text-[10px] xs:text-xs font-mono tracking-widest uppercase text-stone-400 group-hover:text-amber-300 mt-1">
                      {time.includes('hour') ? 'Hours' : 'Minutes'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ==================== 2. MOOD SELECTION ==================== */}
          <div className="space-y-4 border-b border-white/10 pb-12">
            <div className="flex items-center justify-between text-xs font-mono tracking-widest uppercase text-amber-400">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>MOOD // WHAT ARE YOU FEELING RIGHT NOW?</span>
              </span>
              <span className="text-white font-bold text-xs">{selectedMood.toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              {moodOptions.map((m) => {
                const isSelected = selectedMood === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      audioSynth.playChime('tick');
                      setSelectedMood(m.id);
                    }}
                    className={`cursor-pointer border-l-2 pl-4 py-2 transition-all duration-300 ${
                      isSelected
                        ? 'border-amber-400 text-white scale-[1.02]'
                        : 'border-white/15 text-stone-400 hover:border-white/35 hover:text-stone-200'
                    }`}
                  >
                    <div className="font-editorial text-2xl font-bold text-white mb-0.5 flex items-center justify-between">
                      <span>{m.label}</span>
                      {isSelected && <span className="text-amber-400 text-xs font-mono">●</span>}
                    </div>
                    <p className="text-xs text-stone-400 font-body leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ==================== 3. ENERGY LEVEL ==================== */}
          <div className="space-y-4 border-b border-white/10 pb-12">
            <div className="flex items-center justify-between text-xs font-mono tracking-widest uppercase text-amber-400">
              <span className="flex items-center gap-2">
                <Battery className="w-4 h-4" />
                <span>ENERGY // PHYSICAL CADENCE & STRIDE</span>
              </span>
              <span className="text-white font-bold text-xs">{selectedEnergy.toUpperCase()} PACE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-2">
              {energyOptions.map((e) => {
                const isSelected = selectedEnergy === e.id;
                return (
                  <div
                    key={e.id}
                    onClick={() => {
                      audioSynth.playChime('tick');
                      setSelectedEnergy(e.id);
                    }}
                    className={`cursor-pointer border-l-2 pl-5 py-2 transition-all duration-300 ${
                      isSelected
                        ? 'border-amber-400 text-white'
                        : 'border-white/15 text-stone-400 hover:border-white/35 hover:text-stone-200'
                    }`}
                  >
                    <div className="font-editorial text-2xl font-bold text-white mb-1">
                      {e.label} Energy
                    </div>
                    <p className="text-xs text-stone-400 font-body leading-relaxed">
                      {e.paceDesc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ==================== 4. ENVIRONMENT SELECTION ==================== */}
          <div className="space-y-4 border-b border-white/10 pb-12">
            <div className="flex items-center justify-between text-xs font-mono tracking-widest uppercase text-amber-400">
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4" />
                <span>ENVIRONMENT // IMMEDIATE SURROUNDING TERRAIN</span>
              </span>
              <span className="text-white font-bold text-xs">{selectedEnvironment.toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 pt-2">
              {environmentOptions.map((env) => {
                const isSelected = selectedEnvironment === env.id;
                return (
                  <div
                    key={env.id}
                    onClick={() => {
                      audioSynth.playChime('tick');
                      setSelectedEnvironment(env.id);
                    }}
                    className={`cursor-pointer border-b-2 pb-3 transition-all duration-300 ${
                      isSelected
                        ? 'border-amber-400 text-white scale-[1.03]'
                        : 'border-white/15 text-stone-500 hover:border-white/35 hover:text-stone-300'
                    }`}
                  >
                    <div className="font-editorial text-lg xs:text-xl sm:text-2xl font-bold text-white leading-tight">
                      {env.label}
                    </div>
                    <div className="text-[10px] xs:text-[11px] font-mono tracking-widest text-stone-400 uppercase mt-0.5 truncate">
                      {env.sub}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ==================== 5. ACTIVITY SELECTION ==================== */}
          <div className="space-y-4 border-b border-white/10 pb-12">
            <div className="flex items-center justify-between text-xs font-mono tracking-widest uppercase text-amber-400">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>ACTIVITY // PREFERRED EXPEDITION FOCUS</span>
              </span>
              <span className="text-white font-bold text-xs">{selectedActivity.toUpperCase()}</span>
            </div>

            <div className="flex flex-wrap gap-x-4 xs:gap-x-8 gap-y-3 xs:gap-y-4 pt-2">
              {activityOptions.map((act) => {
                const isSelected = selectedActivity === act.id;
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => {
                      audioSynth.playChime('tick');
                      setSelectedActivity(act.id);
                    }}
                    className={`text-left font-editorial text-lg xs:text-xl sm:text-2xl font-bold transition-all cursor-pointer pb-1 border-b-2 ${
                      isSelected
                        ? 'text-amber-300 border-amber-400 scale-[1.05]'
                        : 'text-stone-500 border-transparent hover:text-stone-200 hover:border-white/20'
                    }`}
                  >
                    {act.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================
            MAIN CTA: CREATE MY ADVENTURE →
           ======================================================== */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 pb-16">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="text-[10px] xs:text-xs font-mono uppercase tracking-[0.25em] text-amber-400">
              SYNTHESIS BLUEPRINT
            </div>
            <div className="text-sm xs:text-base text-stone-200 font-body">
              {selectedTime} · {selectedActivity} in {selectedEnvironment} · {selectedMood} state · {selectedEnergy} energy
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleGenerateAdventure(false)}
              className="w-full sm:w-auto min-h-[56px] sm:min-h-[64px] px-8 sm:px-14 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-base sm:text-lg tracking-wide flex items-center justify-center gap-3 transition-all shadow-[0_12px_36px_rgba(249,115,22,0.45)] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-mono tracking-wider">FINDING YOUR TRAIL...</span>
                </>
              ) : (
                <>
                  <span>CREATE MY ADVENTURE</span>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </>
              )}
            </button>
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleGenerateAdventure(true)}
              className="text-xs font-mono text-stone-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1"
              title="Generate instantly without cloud using TrailMind's 45 built-in templates"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Or generate instantly offline (without cloud)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          FULL-SCREEN ENVIRONMENTAL ANIMATION: FINDING YOUR TRAIL...
         ======================================================== */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#040810]/95 backdrop-blur-md select-none">
          {/* Atmospheric Starfield and Ambient Glowing Auroras */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[720px] rounded-full bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-transparent blur-3xl anim-pulse-glow" />
            <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-amber-200 anim-firefly-1" />
            <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-amber-100 anim-firefly-2" />
            <div className="absolute top-2/3 left-1/3 w-1.5 h-1.5 rounded-full bg-orange-200 anim-firefly-3" />
            <div className="absolute top-1/2 right-1/3 w-2.5 h-2.5 rounded-full bg-amber-300 blur-[1px] anim-firefly-1" />
          </div>

          {/* Layered Illustrated Topographical Landscape */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg
              className="absolute inset-0 w-full h-full opacity-65"
              viewBox="0 0 1440 900"
              preserveAspectRatio="xMidYMid slice"
              fill="none"
            >
              <defs>
                <linearGradient id="genMountainFar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#102538" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#040b14" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="genMountainMid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0a2a1a" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#02080a" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="genTrailGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>

              {/* Distant Mountain Ridge */}
              <path
                d="M0 480 L220 320 L540 500 L880 260 L1200 440 L1440 330 L1440 900 L0 900 Z"
                fill="url(#genMountainFar)"
              />

              {/* Midground Forest Ridge */}
              <path
                d="M0 620 L320 460 L720 640 L1080 430 L1440 580 L1440 900 L0 900 Z"
                fill="url(#genMountainMid)"
              />

              {/* Animated Glowing Golden Trail Contour weaving across the scene */}
              <path
                d="M-40 760 Q280 620 580 660 T1020 540 T1480 620"
                stroke="url(#genTrailGlow)"
                strokeWidth="4"
                strokeLinecap="round"
                className="anim-draw-trail"
              />

              {/* Parallel Trail Contour with Dash Rhythm */}
              <path
                d="M-20 840 Q340 720 740 780 T1220 680 T1480 720"
                stroke="url(#genTrailGlow)"
                strokeWidth="2"
                strokeDasharray="6 12"
                strokeOpacity="0.6"
                className="anim-draw-trail"
              />

              {/* Foreground Dark Earth Silhouette */}
              <path
                d="M0 780 Q480 720 960 790 Q1240 820 1440 760 L1440 900 L0 900 Z"
                fill="#020508"
              />
            </svg>
          </div>

          {/* Central Editorial Telemetry HUD */}
          <div className="relative z-30 max-w-xl mx-auto px-6 text-center space-y-8">
            {/* Ambient Compass Glyph */}
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-amber-400/35 anim-spin-slow" />
              <div className="absolute inset-2 rounded-full border border-dashed border-amber-300/25" />
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl anim-pulse-glow" />
              <Compass className="w-10 h-10 text-amber-300 anim-pulse-glow" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-[0.35em] text-amber-400">
                <span className="w-6 h-[1px] bg-amber-400/60" />
                <span>EXPEDITION SYNTHESIS</span>
                <span className="w-6 h-[1px] bg-amber-400/60" />
              </div>

              {/* EXACT REQUESTED PHRASE */}
              <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-black text-amber-100 tracking-tight leading-[1] drop-shadow-[0_0_35px_rgba(251,191,36,0.45)]">
                FINDING YOUR TRAIL...
              </h2>
            </div>

            {/* Cycling Environmental Telemetry */}
            <div className="space-y-3 pt-2">
              <p className="font-editorial text-lg sm:text-xl text-stone-200 italic min-h-[3rem] transition-all duration-300 leading-snug">
                "{telemetryMessage}"
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-stone-400 uppercase tracking-widest pt-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-amber-300">
                  {selectedEnvironment}
                </span>
                <span>·</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-stone-200">
                  {selectedTime}
                </span>
                <span>·</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-stone-200">
                  {selectedActivity}
                </span>
                <span>·</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-stone-200">
                  {selectedEnergy} ENERGY
                </span>
              </div>
            </div>

            {/* Subtle Glowing Progress Line */}
            <div className="w-56 mx-auto h-[2px] bg-white/10 rounded-full overflow-hidden relative">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 rounded-full w-full animate-[driftSlow_2s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
