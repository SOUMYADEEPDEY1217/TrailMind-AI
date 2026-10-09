import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Play,
  Pause,
  CheckCircle2,
  Circle,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  ArrowRight,
  Compass,
  Footprints,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { Adventure } from '../types';
import { audioSynth } from '../utils/audioSynth';
import {
  clearActiveSession,
  getActiveSession,
  getCurrentAdventure,
  getSettings,
  saveActiveSession,
  saveCurrentAdventure,
  updateAdventureProgress,
  ActiveSessionData,
} from '../utils/storage';
import { CURATED_EXPEDITIONS } from '../utils/adventureEngine';
import { PWAStatusBadge } from '../components/PWAStatusBadge';

interface AdventurePageProps {
  adventure: Adventure | null;
  onNavigate: (route: string) => void;
  onCompleteAdventure: (summary: {
    elapsedSeconds: number;
    waypointsCompleted: number;
    photos: string[];
    notes: string[];
  }) => void;
}

export const AdventurePage: React.FC<AdventurePageProps> = ({
  adventure: propsAdventure,
  onNavigate,
  onCompleteAdventure,
}) => {
  // Re-hydrate adventure from localStorage if prop is missing (e.g. on direct browser refresh)
  const activeAdventure: Adventure = useMemo(() => {
    if (propsAdventure) return propsAdventure;
    const stored = getCurrentAdventure();
    if (stored) return stored;
    return CURATED_EXPEDITIONS[0];
  }, [propsAdventure]);

  const targetSeconds = useMemo(() => {
    return Math.max(60, (activeAdventure.targetMinutes || 20) * 60);
  }, [activeAdventure]);

  const settings = getSettings();

  // Active Session state with localStorage persistence
  const [session, setSession] = useState<ActiveSessionData>(() => {
    const existing = getActiveSession();
    if (existing && existing.adventureId === activeAdventure.id) {
      return existing;
    }
    // Initialize session if not present, and save to localStorage
    const newSession: ActiveSessionData = {
      adventureId: activeAdventure.id,
      startTimestamp: Date.now(),
      currentWaypointIndex: 0,
      isPaused: false,
      pocketMode: false,
      notes: [],
      photoUrls: [],
      completedTaskIndices: [],
      targetSeconds: (activeAdventure.targetMinutes || 20) * 60,
    };
    saveActiveSession(newSession);
    return newSession;
  });

  // Calculate real elapsed seconds directly from wall clock startTimestamp to survive refreshes & backgrounding
  const [now, setNow] = useState<number>(Date.now());
  const [isPaused, setIsPaused] = useState<boolean>(session.isPaused || false);
  const [completedTaskIndices, setCompletedTaskIndices] = useState<number[]>(
    session.completedTaskIndices || []
  );
  const [isPocketMode, setIsPocketMode] = useState<boolean>(session.pocketMode || false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Derive mission tasks from adventure.tasks or adventure.waypoints
  const checklistItems = useMemo<string[]>(() => {
    if (activeAdventure.tasks && activeAdventure.tasks.length > 0) {
      return activeAdventure.tasks;
    }
    if (activeAdventure.waypoints && activeAdventure.waypoints.length > 0) {
      return activeAdventure.waypoints.map(
        (w) => w.actionChallenge || w.sensoryPrompt || w.title
      );
    }
    return [
      'Step out past your front doorway and inhale cold outdoor air',
      'Spot something natural with vibrant color',
      'Close your eyes for 30 seconds and count 3 distinct sounds',
      'Discover one quiet micro-detail in the landscape',
    ];
  }, [activeAdventure]);

  // Ensure current adventure is preserved in storage
  useEffect(() => {
    if (activeAdventure) {
      saveCurrentAdventure(activeAdventure);
    }
  }, [activeAdventure]);

  // Timer tick: updates every second based on true real-world timestamp
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const currentTimestamp = Date.now();
      setNow(currentTimestamp);

      // Periodical ambient chime if configured
      if (!isMuted && settings.chimeIntervalMinutes > 0) {
        const elapsed = Math.floor((currentTimestamp - session.startTimestamp) / 1000);
        if (elapsed > 0 && elapsed % (settings.chimeIntervalMinutes * 60) === 0) {
          audioSynth.playChime('tick');
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isMuted, session.startTimestamp, settings.chimeIntervalMinutes]);

  // Compute live elapsed and remaining countdown seconds
  const elapsedSeconds = useMemo(() => {
    return Math.max(0, Math.floor((now - session.startTimestamp) / 1000));
  }, [now, session.startTimestamp]);

  const remainingSeconds = useMemo(() => {
    return Math.max(0, targetSeconds - elapsedSeconds);
  }, [targetSeconds, elapsedSeconds]);

  // Formatter for MM:SS
  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle checklist item and survive refresh in localStorage
  const handleToggleTask = (index: number) => {
    setCompletedTaskIndices((prev) => {
      const exists = prev.includes(index);
      const updated = exists ? prev.filter((i) => i !== index) : [...prev, index];

      // Update in localStorage immediately
      const updatedSession: ActiveSessionData = {
        ...session,
        completedTaskIndices: updated,
        currentWaypointIndex: updated.length,
      };
      setSession(updatedSession);
      updateAdventureProgress({
        completedTaskIndices: updated,
        currentWaypointIndex: updated.length,
      });

      // Tactile sound cue
      if (!isMuted) {
        if (!exists) {
          audioSynth.playChime('waypoint');
        } else {
          audioSynth.playChime('tick');
        }
      }

      return updated;
    });
  };

  // Toggle pause state
  const handleTogglePause = () => {
    const newPause = !isPaused;
    setIsPaused(newPause);
    const updatedSession = { ...session, isPaused: newPause };
    setSession(updatedSession);
    updateAdventureProgress({ isPaused: newPause });
  };

  // Toggle pocket mode
  const handleTogglePocketMode = (enabled: boolean) => {
    setIsPocketMode(enabled);
    const updatedSession = { ...session, pocketMode: enabled };
    setSession(updatedSession);
    updateAdventureProgress({ pocketMode: enabled });
  };

  // Finish adventure
  const handleFinishAdventure = () => {
    if (!isMuted) {
      audioSynth.playChime('complete');
    }
    clearActiveSession();
    onCompleteAdventure({
      elapsedSeconds,
      waypointsCompleted: completedTaskIndices.length || 1,
      photos: [],
      notes: [],
    });
    onNavigate('/complete');
  };

  // Exit/Abandon adventure with confirmation
  const handleAbortAdventure = () => {
    clearActiveSession();
    onNavigate('/explore');
  };

  // Calculate overall progress ratio
  const timeProgressRatio = Math.min(1, elapsedSeconds / targetSeconds);
  const checklistProgressRatio =
    checklistItems.length > 0 ? completedTaskIndices.length / checklistItems.length : 0;

  // =========================================================================
  // POCKET MODE (Ultra-minimal power-saving black screen for walking)
  // =========================================================================
  if (isPocketMode) {
    return (
      <div
        onClick={() => handleTogglePocketMode(false)}
        className="fixed inset-0 z-50 bg-[#020509] flex flex-col items-center justify-between p-8 text-center select-none cursor-pointer"
      >
        <div className="pt-8 space-y-1">
          <div className="text-[11px] font-mono text-amber-500 uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>POCKET MODE ENGAGED</span>
          </div>
          <div className="text-xs text-stone-500">
            Screen dimmed to keep attention on your surroundings
          </div>
        </div>

        <div className="space-y-4">
          <div className="w-20 h-20 rounded-full border border-amber-500/20 flex items-center justify-center animate-pulse mx-auto">
            <Footprints className="w-8 h-8 text-amber-400/80" />
          </div>
          <div className="font-mono text-6xl text-stone-200 font-light tracking-widest">
            {formatCountdown(remainingSeconds)}
          </div>
          <div className="text-xs font-mono text-amber-400/80 tracking-widest uppercase">
            {completedTaskIndices.length} OF {checklistItems.length} DISCOVERIES NOTICED
          </div>
        </div>

        <div className="pb-8 space-y-2">
          <div className="text-xs text-stone-400 flex items-center justify-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Tap anywhere to awaken screen</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ACTIVE ADVENTURE DISPLAY (Cinematic Illustrated Outdoor Minimal Scene)
  // =========================================================================
  return (
    <div className="relative min-h-screen h-screen overflow-y-auto lg:overflow-hidden bg-[#030812] text-stone-100 flex flex-col justify-between select-none">
      {/* ------------------------------------------------------------- */}
      {/* FULL-SCREEN ILLUSTRATED NATURE ENVIRONMENT                    */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Deep sky cosmic twilight gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020611] via-[#071526] to-[#0c223a]" />

        {/* Ambient warm horizon sunrise/sunset glow */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-[140%] h-[380px] bg-[radial-gradient(ellipse_at_bottom,_rgba(217,119,6,0.25)_0%,_rgba(180,83,9,0.12)_35%,_transparent_70%)]" />

        {/* Floating animated fireflies / embers */}
        <div className="absolute top-1/4 left-1/6 w-2 h-2 rounded-full bg-amber-300 anim-firefly-1 opacity-70 blur-[1px]" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-amber-200 anim-firefly-2 opacity-60 blur-[0.5px]" />
        <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 rounded-full bg-emerald-300 anim-firefly-3 opacity-50 blur-[1px]" />
        <div className="absolute top-1/2 right-1/6 w-1.5 h-1.5 rounded-full bg-amber-400 anim-firefly-1 opacity-60" />

        {/* Layered Mountains SVG */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
          fill="none"
        >
          {/* Distant majestic mountain ridge */}
          <path
            d="M0 480 L180 380 L360 450 L560 330 L740 440 L960 310 L1180 430 L1340 370 L1440 420 L1440 900 L0 900 Z"
            fill="#081b2d"
            opacity="0.65"
          />

          {/* Midground mountain silhouettes */}
          <path
            d="M0 560 L240 470 L480 540 L720 450 L980 530 L1220 460 L1440 520 L1440 900 L0 900 Z"
            fill="#051524"
            opacity="0.85"
          />

          {/* Pine forest treeline canopy */}
          <path
            d="M0 640 
               Q60 620 120 640 T240 635 T360 645 T480 630 T600 642 
               T720 635 T840 645 T960 630 T1080 640 T1200 635 T1320 645 T1440 638 
               L1440 900 L0 900 Z"
            fill="#030e18"
          />

          {/* Foreground rocky bluff and tall grass ledge */}
          <path
            d="M0 760 Q320 720 640 750 Q960 780 1440 730 L1440 900 L0 900 Z"
            fill="#020810"
          />

          {/* Stylized blades of foreground grass & stones */}
          <path
            d="M40 760 L45 730 L50 760 M60 760 L68 722 L75 760 M120 755 L126 718 L134 755 M140 755 L145 725 L152 755 
               M880 770 L885 735 L892 770 M910 772 L916 728 L924 772 M1340 740 L1346 705 L1352 740 M1360 742 L1368 712 L1374 742"
            stroke="#020810"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        {/* Subtle horizon mist glow line */}
        <div className="absolute bottom-48 inset-x-0 h-24 bg-gradient-to-t from-transparent via-cyan-900/10 to-transparent" />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TOP MINIMAL STATUS BAR                                        */}
      {/* ------------------------------------------------------------- */}
      <header className="relative z-20 px-3 xs:px-6 sm:px-12 pt-4 sm:pt-8 flex items-center justify-between">
        {/* Left: Mission Identity */}
        <div className="flex items-center gap-2 xs:gap-3 shrink-0">
          <span className="w-2 h-2 xs:w-2.5 xs:h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div className="space-y-0.5">
            <div className="text-[9px] xs:text-[10px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] text-emerald-400">
              ACTIVE OUTDOOR EXPEDITION
            </div>
            <h1 className="font-editorial text-base xs:text-lg sm:text-xl font-bold text-white tracking-wide truncate max-w-[120px] xs:max-w-[190px] sm:max-w-md">
              {activeAdventure.title}
            </h1>
          </div>
        </div>

        {/* Right: Minimal controls (Mute, Pocket Mode, Pause, Abort) */}
        <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-4 shrink-0">
          <div className="hidden sm:block">
            <PWAStatusBadge />
          </div>

          {/* Mute ambient chimes */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Unmute chimes' : 'Mute chimes'}
            className="p-1.5 xs:p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-stone-500" /> : <Volume2 className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-amber-300" />}
          </button>

          {/* Pocket Mode button */}
          <button
            type="button"
            onClick={() => handleTogglePocketMode(true)}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono tracking-widest uppercase text-stone-300 transition-colors cursor-pointer"
          >
            <EyeOff className="w-3.5 h-3.5 text-amber-400" />
            <span>Pocket Dim</span>
          </button>

          {/* Pause / Resume */}
          <button
            type="button"
            onClick={handleTogglePause}
            className="p-1.5 xs:p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 transition-colors cursor-pointer"
            title={isPaused ? 'Resume trek' : 'Pause trek'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 xs:w-4 xs:h-4 fill-white text-white" /> : <Pause className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-stone-200" />}
          </button>

          {/* Subtle exit link */}
          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            className="text-[10px] xs:text-[11px] font-mono uppercase tracking-widest text-stone-500 hover:text-stone-300 transition-colors px-1 xs:px-2 py-1 cursor-pointer"
          >
            Abort
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* CENTERPIECE: COLOSSAL TYPOGRAPHY & COUNTDOWN TIMER            */}
      {/* ------------------------------------------------------------- */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-4 xs:px-6 py-4 sm:py-8 max-w-4xl mx-auto space-y-4 sm:space-y-8">
        {/* THE MOST IMPORTANT TYPOGRAPHY ON SCREEN */}
        <div className="space-y-0.5 sm:space-y-2">
          <div className="font-editorial font-black text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-stone-100 tracking-tight leading-none drop-shadow-[0_12px_32px_rgba(0,0,0,0.9)]">
            PHONE DOWN.
          </div>
          <div className="font-editorial font-black text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent tracking-tight leading-none drop-shadow-[0_12px_32px_rgba(245,158,11,0.3)]">
            ADVENTURE ON.
          </div>
        </div>

        {/* Minimalist Outdoors Philosophy */}
        <p className="text-xs sm:text-sm md:text-base font-body text-stone-300 max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          The trail is in front of you, not on this screen. Look up, feel the wind, and let the real world recalibrate your mind.
        </p>

        {/* LARGE COUNTDOWN TIMER */}
        <div className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2">
          <div className="text-[10px] xs:text-[11px] font-mono tracking-[0.25em] sm:tracking-[0.3em] uppercase text-amber-400/90 font-medium">
            {remainingSeconds === 0 ? 'TREK TIME FULFILLED · WANDER FREELY' : 'TIME REMAINING OUTDOORS'}
          </div>

          <div className="font-mono text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-light text-amber-300 tracking-wider tabular-nums drop-shadow-[0_6px_28px_rgba(251,191,36,0.35)]">
            {formatCountdown(remainingSeconds)}
          </div>

          {/* Progress Bar & Elapsed Ratio */}
          <div className="w-56 xs:w-64 sm:w-80 mx-auto space-y-1.5 pt-1">
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-1000 ease-out"
                style={{ width: `${Math.round(timeProgressRatio * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
              <span>{Math.round(timeProgressRatio * 100)}% elapsed</span>
              <span>Target: ~{activeAdventure.targetMinutes} min</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SMALL MISSION CHECKLIST                                       */}
        {/* ------------------------------------------------------------- */}
        <div className="w-full max-w-xl mx-auto text-left space-y-3 pt-2 sm:pt-4">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-stone-400 border-b border-white/10 pb-2">
            <span className="flex items-center gap-2 text-amber-400">
              <Compass className="w-3.5 h-3.5" />
              <span>FIELD OBSERVATIONS</span>
            </span>
            <span>
              {completedTaskIndices.length} / {checklistItems.length} NOTICED
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {checklistItems.map((item, idx) => {
              const isChecked = completedTaskIndices.includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleToggleTask(idx)}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-white/5 border border-amber-500/30 text-stone-400'
                      : 'hover:bg-white/5 border border-transparent text-stone-200'
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-stone-500 hover:text-amber-400 transition-colors" />
                    )}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-body leading-snug ${
                      isChecked ? 'line-through text-stone-500' : 'text-stone-200'
                    }`}
                  >
                    {item}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM FINISH ADVENTURE ACTION                                */}
      {/* ------------------------------------------------------------- */}
      <footer className="relative z-20 px-4 xs:px-6 sm:px-12 pb-6 sm:pb-10 pt-3 sm:pt-4 flex flex-col items-center justify-center gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={handleFinishAdventure}
          className="w-full sm:w-auto min-h-[52px] sm:min-h-[58px] px-8 sm:px-14 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-3 transition-all shadow-[0_12px_36px_rgba(249,115,22,0.4)] hover:shadow-[0_16px_44px_rgba(249,115,22,0.6)] active:scale-[0.98] cursor-pointer"
        >
          <span>FINISH ADVENTURE</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-[11px] font-mono text-stone-400 tracking-wider">
          Trek state and waypoint notes will be memorialized upon completion.
        </div>
      </footer>

      {/* Exit Confirmation Dialog (Gentle modal) */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#081524] border border-white/20 p-8 rounded-2xl space-y-6 text-center">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
            <div className="space-y-2">
              <h3 className="font-editorial text-2xl font-bold text-white">
                Leave Active Expedition?
              </h3>
              <p className="text-xs text-stone-300 font-body leading-relaxed">
                Your current timer and checklist progress will be discarded. Are you sure you want to return to the map?
              </p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-6 py-2.5 rounded-full border border-white/20 hover:bg-white/10 text-xs font-mono uppercase tracking-widest text-stone-200 cursor-pointer"
              >
                Keep Exploring
              </button>
              <button
                type="button"
                onClick={handleAbortAdventure}
                className="px-6 py-2.5 rounded-full bg-red-600/80 hover:bg-red-600 text-xs font-mono uppercase tracking-widest text-white cursor-pointer"
              >
                Abandon Trek
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
