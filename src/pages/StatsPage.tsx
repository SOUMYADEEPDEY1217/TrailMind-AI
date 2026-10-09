import React, { useState, useEffect } from 'react';
import {
  Compass,
  Footprints,
  Flame,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
  Mountain,
  Wind,
  Navigation,
  ArrowRight,
  BookOpen,
  Eye,
  CheckCircle2,
  TreePine,
  Layers,
  Award,
  ChevronRight,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { getMemories, getSettings } from '../utils/storage';
import { calculateAdventureStatistics, CalculatedStatistics } from '../utils/statsCalculator';
import { audioSynth } from '../utils/audioSynth';

interface StatsPageProps {
  onNavigate: (route: string) => void;
}

export const StatsPage: React.FC<StatsPageProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<CalculatedStatistics>(() => {
    const memories = getMemories();
    const settings = getSettings();
    return calculateAdventureStatistics(memories, settings);
  });

  const [settings] = useState(() => getSettings());
  const [selectedJournalIndex, setSelectedJournalIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'journal' | 'map_ledger' | 'field_badges'>('journal');

  // Reload stats whenever memories might change
  useEffect(() => {
    const handleStorage = () => {
      const memories = getMemories();
      const currentSettings = getSettings();
      setStats(calculateAdventureStatistics(memories, currentSettings));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const distanceUnit = settings.units || 'km';
  const displayedDistance =
    distanceUnit === 'mi'
      ? `${stats.estimatedDistanceMi.toFixed(1)} mi`
      : `${stats.estimatedDistanceKm.toFixed(1)} km`;

  const selectedEntry = stats.expeditionLog[selectedJournalIndex] || null;

  return (
    <div className="relative min-h-screen bg-[#060b13] pb-32 pt-24 sm:pt-28 px-4 sm:px-8 lg:px-14 overflow-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* =========================================================================
          CINEMATIC ILLUSTRATED NATURALIST BACKGROUND (Independent Environmental Depth)
          Layers of atmospheric mist, topographic elevation curves, and compass rose
         ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Layer 1: Atmospheric Forest Night / Dawn Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050912] via-[#07131d] via-[#0b1c24] to-[#050b10] opacity-95" />

        {/* Ambient Topo Glow in warm amber and deep teal */}
        <div className="absolute top-[-10%] right-[-5%] w-[680px] h-[680px] rounded-full bg-gradient-to-br from-amber-500/10 via-emerald-600/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-[45%] left-[-15%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-cyan-600/10 via-teal-800/5 to-transparent blur-3xl pointer-events-none" />

        {/* Layer 2: Illustrated Topographic Survey Contours & Map Lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
          viewBox="0 0 1440 1400"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Topographic elevation lines */}
          <path
            d="M-100 240 C300 210, 600 320, 950 200 C1250 90, 1400 220, 1600 180"
            stroke="#fbbf24"
            strokeWidth="1.2"
            strokeDasharray="4 8"
          />
          <path
            d="M-100 320 C250 290, 580 430, 920 310 C1220 200, 1450 330, 1600 290"
            stroke="#38bdf8"
            strokeWidth="1"
            strokeOpacity="0.6"
          />
          <path
            d="M-100 480 C200 420, 520 600, 880 460 C1200 340, 1380 500, 1600 440"
            stroke="#fbbf24"
            strokeWidth="0.8"
            strokeDasharray="8 12"
          />
          <path
            d="M-100 700 C350 630, 700 840, 1020 680 C1300 540, 1480 720, 1600 660"
            stroke="#34d399"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
          <path
            d="M-100 950 C280 870, 640 1080, 1050 900 C1350 780, 1500 960, 1600 900"
            stroke="#fbbf24"
            strokeWidth="0.75"
            strokeDasharray="3 9"
          />

          {/* Expedition Trail Vector with Waypoint Markers */}
          <path
            d="M120 420 Q320 310 520 460 T920 380 T1320 540"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="6 6"
            strokeOpacity="0.7"
          />
          <circle cx="120" cy="420" r="5" fill="#f59e0b" />
          <circle cx="520" cy="460" r="4" fill="#38bdf8" />
          <circle cx="920" cy="380" r="4" fill="#34d399" />
          <circle cx="1320" cy="540" r="6" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />

          {/* Compass Rose Ornament in corner */}
          <g transform="translate(1280, 180) scale(0.65)" stroke="#fbbf24" strokeWidth="1" opacity="0.35">
            <circle cx="100" cy="100" r="80" strokeDasharray="3 5" fill="none" />
            <circle cx="100" cy="100" r="60" fill="none" />
            <polygon points="100,20 108,90 100,80 92,90" fill="#fbbf24" />
            <polygon points="100,180 108,110 100,120 92,110" fill="#fbbf24" opacity="0.6" />
            <polygon points="20,100 90,92 80,100 90,108" fill="#fbbf24" opacity="0.6" />
            <polygon points="180,100 110,92 120,100 110,108" fill="#fbbf24" opacity="0.6" />
          </g>
        </svg>

        {/* Layer 3: Distant Alpine Ridges Silhouette */}
        <div className="absolute bottom-0 inset-x-0 h-[380px] pointer-events-none opacity-40">
          <svg className="w-full h-full" viewBox="0 0 1440 380" preserveAspectRatio="none" fill="none">
            <path
              d="M0 240 L180 140 L380 220 L580 90 L820 220 L1080 80 L1280 180 L1440 120 L1440 380 L0 380 Z"
              fill="#06121b"
            />
            <path
              d="M0 290 L240 210 L520 280 L760 190 L1040 270 L1260 210 L1440 260 L1440 380 L0 380 Z"
              fill="#040b11"
            />
          </svg>
        </div>
      </div>

      <div className="relative z-20 max-w-6xl mx-auto space-y-12">
        {/* =========================================================================
            EXPLORER'S JOURNAL TITLE & COMPASS HEADER
           ========================================================================= */}
        <header className="border-b border-white/10 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              {/* Journal Header Tagline & Coordinates */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono uppercase tracking-[0.3em] text-amber-400">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  EXPEDITION LOGBOOK
                </span>
                <span className="w-6 h-[1px] bg-amber-400/50" />
                <span className="text-stone-300">FIELD ARCHIVE & REAL METRICS</span>
                <span className="w-6 h-[1px] bg-amber-400/50" />
                <span className="text-emerald-400">OFF-SCREEN CHRONICLE</span>
              </div>

              {/* Large Atmospheric Typography */}
              <h1 className="font-editorial text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[0.95]">
                The Explorer’s<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400">
                  Journal.
                </span>
              </h1>

              <p className="text-sm xs:text-base sm:text-lg text-stone-300 font-body leading-relaxed max-w-2xl">
                Every minute, kilometer, and trail marker calculated exclusively from your real completed
                field expeditions. No synthetic dashboard badges—only soil walked, horizons scanned, and
                breaths taken under open skies.
              </p>
            </div>

            {/* Quick Actions & Navigation */}
            <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto shrink-0">
              <button
                onClick={() => {
                  audioSynth.playChime('start');
                  onNavigate('/explore');
                }}
                className="min-h-[44px] xs:min-h-[48px] px-6 sm:px-7 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-stone-950 font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-[0_0_24px_rgba(245,158,11,0.35)] hover:brightness-110 active:scale-95 transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>Begin Next Mission</span>
              </button>

              <button
                onClick={() => {
                  audioSynth.playChime('tick');
                  onNavigate('/memories');
                }}
                className="min-h-[44px] xs:min-h-[48px] px-5 sm:px-6 py-3 rounded-full border border-white/20 bg-black/40 hover:bg-white/10 text-stone-200 font-mono text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Field Notes</span>
              </button>
            </div>
          </div>

          {/* Navigation Ledger Tabs with smooth horizontal touch scrolling */}
          <div className="flex items-center gap-2 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/5 font-mono text-xs tracking-wider uppercase overflow-x-auto pb-2 sm:pb-0 whitespace-nowrap">
            <button
              onClick={() => {
                audioSynth.playChime('tick');
                setActiveTab('journal');
              }}
              className={`px-3.5 sm:px-4 py-2 rounded-full cursor-pointer transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 ${
                activeTab === 'journal'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
                  : 'text-stone-400 hover:text-white border border-transparent'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>01. Expedition Logbook</span>
            </button>

            <button
              onClick={() => {
                audioSynth.playChime('tick');
                setActiveTab('map_ledger');
              }}
              className={`px-3.5 sm:px-4 py-2 rounded-full cursor-pointer transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 ${
                activeTab === 'map_ledger'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
                  : 'text-stone-400 hover:text-white border border-transparent'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>02. Weekly Trail Cadence</span>
            </button>

            <button
              onClick={() => {
                audioSynth.playChime('tick');
                setActiveTab('field_badges');
              }}
              className={`px-3.5 sm:px-4 py-2 rounded-full cursor-pointer transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 ${
                activeTab === 'field_badges'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
                  : 'text-stone-400 hover:text-white border border-transparent'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>03. Naturalist Waypoints</span>
            </button>
          </div>
        </header>

        {/* =========================================================================
            PRIMARY EXPEDITION LEDGER: LARGE TYPOGRAPHY & MAP LINES (NO CARDS!)
            Displaying the 6 Core Requested Metrics:
            1. Outdoor Minutes
            2. Adventures Completed
            3. Estimated Distance
            4. Favorite Activity
            5. Current Streak
            6. Weekly Outdoor Time
           ========================================================================= */}
        <section className="relative">
          {/* Naturalist Map Line Divider */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] text-amber-400 mb-6 sm:mb-8">
            <span className="w-4 h-4 rounded-full border border-amber-400 flex items-center justify-center text-[9px] font-bold">
              ✦
            </span>
            <span>CORE EXPEDITION TELEMETRY</span>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-amber-400/60 via-white/10 to-transparent" />
            <span className="text-stone-400 hidden sm:inline">DERIVED FROM REAL RECORDS</span>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-8 sm:gap-y-10 gap-x-4 sm:gap-x-8 border-b border-white/10 pb-10 sm:pb-14">
            {/* Metric 1: Outdoor Minutes */}
            <div className="space-y-1.5 sm:space-y-2 relative border-l-2 border-amber-400/80 pl-3 sm:pl-4">
              <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-stone-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Outdoor Minutes</span>
              </div>
              <div className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-none tracking-tight">
                {stats.outdoorMinutes}
                <span className="text-xl sm:text-2xl text-amber-400 font-sans font-normal ml-1">m</span>
              </div>
              <div className="text-[11px] sm:text-xs text-stone-400 font-mono">
                {stats.outdoorMinutes >= 60
                  ? `${(stats.outdoorMinutes / 60).toFixed(1)} hrs in the wild`
                  : 'Total off-screen immersion'}
              </div>
            </div>

            {/* Metric 2: Adventures Completed */}
            <div className="space-y-1.5 sm:space-y-2 relative border-l-2 border-emerald-400/80 pl-3 sm:pl-4">
              <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-stone-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Adventures Completed</span>
              </div>
              <div className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-none tracking-tight font-mono tabular-nums">
                {stats.adventuresCompleted}
              </div>
              <div className="text-[11px] sm:text-xs text-emerald-400 font-mono">
                {stats.adventuresCompleted === 1
                  ? '1 expedition logged'
                  : `${stats.adventuresCompleted} verified treks`}
              </div>
            </div>

            {/* Metric 3: Estimated Distance */}
            <div className="space-y-1.5 sm:space-y-2 relative border-l-2 border-cyan-400/80 pl-3 sm:pl-4">
              <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-stone-400 flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">Estimated Distance</span>
              </div>
              <div className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-none tracking-tight font-mono tabular-nums">
                {distanceUnit === 'mi'
                  ? stats.estimatedDistanceMi.toFixed(1)
                  : stats.estimatedDistanceKm.toFixed(1)}
                <span className="text-xl sm:text-2xl text-cyan-400 font-sans font-normal ml-1">
                  {distanceUnit}
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-stone-400 font-mono">
                ≈ {stats.totalSteps.toLocaleString()} real footsteps
              </div>
            </div>

            {/* Metric 4: Favorite Activity */}
            <div className="space-y-1.5 sm:space-y-2 relative border-l-2 border-orange-400/80 pl-3 sm:pl-4">
              <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-stone-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="truncate">Favorite Activity</span>
              </div>
              <div className="font-editorial text-2xl xs:text-3xl sm:text-4xl font-black text-amber-200 leading-tight tracking-tight line-clamp-2">
                {stats.favoriteActivity}
              </div>
              <div className="text-[11px] sm:text-xs text-orange-400 font-mono">
                {stats.favoriteActivityCount > 0
                  ? `${stats.favoriteActivityCount} recorded sessions`
                  : 'Preferred expedition discipline'}
              </div>
            </div>

            {/* Metric 5: Current Streak */}
            <div className="space-y-1.5 sm:space-y-2 relative border-l-2 border-amber-500/80 pl-3 sm:pl-4">
              <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-stone-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">Current Streak</span>
              </div>
              <div className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-black text-amber-300 leading-none tracking-tight font-mono tabular-nums">
                {stats.currentStreakDays}
                <span className="text-xl sm:text-2xl text-amber-400 font-sans font-normal ml-1">d</span>
              </div>
              <div className="text-[11px] sm:text-xs text-amber-400 font-mono">
                {stats.longestStreakDays > stats.currentStreakDays
                  ? `Best: ${stats.longestStreakDays} days running`
                  : 'Consecutive outdoor days'}
              </div>
            </div>

            {/* Metric 6: Weekly Outdoor Time */}
            <div className="space-y-1.5 sm:space-y-2 relative border-l-2 border-teal-400/80 pl-3 sm:pl-4">
              <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-stone-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="truncate">Weekly Outdoor Time</span>
              </div>
              <div className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-none tracking-tight font-mono tabular-nums">
                {stats.weeklyOutdoorMinutes}
                <span className="text-xl sm:text-2xl text-teal-400 font-sans font-normal ml-1">m</span>
              </div>
              <div className="text-[11px] sm:text-xs text-teal-300 font-mono">
                {stats.weeklyProgressPct}% of 120m threshold
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 01: EXPLORER'S JOURNAL ENTRIES & FIELD LEDGER
           ========================================================================= */}
        {activeTab === 'journal' && (
          <section className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400">
                  SECTION 01 // INDIVIDUAL EXPEDITION FOLIOS
                </div>
                <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-white mt-1">
                  Chronicle of Completed Treks
                </h2>
              </div>
              <div className="text-xs font-mono text-stone-400">
                {stats.expeditionLog.length} field records authenticated
              </div>
            </div>

            {stats.expeditionLog.length === 0 ? (
              <div className="py-20 text-center space-y-4 border border-dashed border-white/20 rounded-2xl bg-black/30">
                <Compass className="w-12 h-12 text-amber-400/60 mx-auto animate-pulse" />
                <h3 className="font-editorial text-2xl text-white">No Expeditions Logged Yet</h3>
                <p className="text-sm text-stone-400 max-w-md mx-auto font-body">
                  Step outside, step away from screens, and complete your first TrailMind adventure
                  to generate authenticated entries in this journal.
                </p>
                <button
                  onClick={() => onNavigate('/explore')}
                  className="px-6 py-2.5 rounded-full bg-amber-500 text-stone-950 font-mono text-xs uppercase tracking-widest font-bold cursor-pointer"
                >
                  Start Your First Trek
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Trail Marker List */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="text-xs font-mono uppercase tracking-widest text-stone-400 pb-2">
                    SELECT AN EXPEDITION FOLIO:
                  </div>

                  <div className="space-y-2 max-h-[520px] overflow-y-auto pr-2">
                    {stats.expeditionLog.map((entry, index) => {
                      const isSelected = index === selectedJournalIndex;
                      return (
                        <div
                          key={entry.id}
                          onClick={() => {
                            audioSynth.playChime('tick');
                            setSelectedJournalIndex(index);
                          }}
                          className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                              : 'bg-black/30 border-white/10 hover:border-white/30 hover:bg-white/5'
                          }`}
                        >
                          {/* Trail Marker Point */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-amber-400">
                                <span>{entry.displayDate}</span>
                                <span>•</span>
                                <span className="text-stone-400">{entry.timeAgo}</span>
                              </div>
                              <h4 className="font-editorial text-lg font-bold text-white leading-snug">
                                {entry.title}
                              </h4>
                            </div>
                            <span className="text-xl shrink-0">{entry.ratingEmoji}</span>
                          </div>

                          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10 text-xs font-mono text-stone-300">
                            <span className="flex items-center gap-1 text-amber-300">
                              <Clock className="w-3 h-3" />
                              {entry.minutes}m
                            </span>
                            <span className="flex items-center gap-1 text-cyan-300">
                              <Footprints className="w-3 h-3" />
                              {distanceUnit === 'mi' ? `${entry.distanceMi} mi` : `${entry.distanceKm} km`}
                            </span>
                            <span className="text-stone-400 capitalize truncate">
                              {entry.biome}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Naturalist Open Journal Page Display */}
                <div className="lg:col-span-7">
                  {selectedEntry && (
                    <div className="relative p-6 sm:p-10 rounded-2xl border border-amber-500/30 bg-[#09111b]/90 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.6)] space-y-8">
                      {/* Topographic Watermark Background */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 600 600" preserveAspectRatio="none">
                          <circle cx="300" cy="300" r="140" stroke="#fbbf24" strokeWidth="2" fill="none" strokeDasharray="6 6" />
                          <circle cx="300" cy="300" r="220" stroke="#fbbf24" strokeWidth="1" fill="none" />
                          <line x1="0" y1="300" x2="600" y2="300" stroke="#fbbf24" strokeWidth="1" />
                          <line x1="300" y1="0" x2="300" y2="600" stroke="#fbbf24" strokeWidth="1" />
                        </svg>
                      </div>

                      {/* Header of Journal Folio */}
                      <div className="relative border-b border-white/10 pb-6 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono uppercase tracking-[0.2em] text-amber-400">
                          <span className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            FIELD ENTRY #{selectedJournalIndex + 1} OF {stats.expeditionLog.length}
                          </span>
                          <span className="text-stone-300 font-mono">{selectedEntry.displayDate}</span>
                        </div>

                        <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-white">
                          {selectedEntry.title}
                        </h3>

                        <div className="flex flex-wrap gap-2 pt-1">
                          <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {selectedEntry.biome}
                          </span>
                          <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {selectedEntry.activity}
                          </span>
                          <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase bg-white/10 text-stone-200">
                            Rating: {selectedEntry.rating}/5 {selectedEntry.ratingEmoji}
                          </span>
                        </div>
                      </div>

                      {/* Expedition Telemetry Grid */}
                      <div className="relative grid grid-cols-3 gap-4 py-3 border-b border-white/10 text-center font-mono">
                        <div className="space-y-1">
                          <div className="text-[10px] text-stone-400 uppercase tracking-widest">Immersion Time</div>
                          <div className="text-2xl font-bold text-white font-editorial">{selectedEntry.minutes}m</div>
                          <div className="text-[10px] text-amber-400">100% off screen</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] text-stone-400 uppercase tracking-widest">Calculated Distance</div>
                          <div className="text-2xl font-bold text-cyan-300 font-editorial">
                            {distanceUnit === 'mi' ? `${selectedEntry.distanceMi} mi` : `${selectedEntry.distanceKm} km`}
                          </div>
                          <div className="text-[10px] text-stone-400">≈ {selectedEntry.steps.toLocaleString()} steps</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] text-stone-400 uppercase tracking-widest">Elevation Drift</div>
                          <div className="text-2xl font-bold text-emerald-300 font-editorial">
                            +{Math.round(selectedEntry.minutes * 3.8)}m
                          </div>
                          <div className="text-[10px] text-emerald-400">Ambient terrain</div>
                        </div>
                      </div>

                      {/* Naturalist Reflection & Field Note (Hand-written feeling) */}
                      <div className="relative space-y-4">
                        <div className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Naturalist Field Observation & Reflection</span>
                        </div>

                        <blockquote className="p-5 rounded-xl border-l-4 border-amber-400 bg-black/40 text-stone-200 font-body text-base sm:text-lg italic leading-relaxed">
                          "{selectedEntry.reflection}"
                        </blockquote>

                        {selectedEntry.sensoryHighlight && selectedEntry.sensoryHighlight !== selectedEntry.reflection && (
                          <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1.5">
                            <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Sensory Artifact Recorded:</span>
                            </div>
                            <p className="text-sm text-stone-300 font-body">
                              {selectedEntry.sensoryHighlight}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Footer Stamp */}
                      <div className="relative flex items-center justify-between text-[11px] font-mono text-stone-400 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>TRAILMIND ARCHIVE VERIFIED</span>
                        </div>
                        <button
                          onClick={() => {
                            audioSynth.playChime('start');
                            onNavigate('/memories');
                          }}
                          className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Full Memories Album</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {/* =========================================================================
            SECTION 02: 7-DAY OUTDOOR CADENCE & MAP TRAIL LEDGER
           ========================================================================= */}
        {activeTab === 'map_ledger' && (
          <section className="space-y-12">
            <div className="border-b border-white/10 pb-6">
              <div className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400">
                SECTION 02 // SEVEN-DAY CADENCE & HABIT TOPOGRAPHY
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-white mt-1">
                Weekly Rhythm Against the Horizon
              </h2>
              <p className="text-stone-300 text-sm max-w-2xl font-body mt-2">
                Medical consensus indicates that 120 minutes of outdoor immersion per week produces
                profound reductions in cortisol, restores ocular convergence, and elevates dopamine tone.
              </p>
            </div>

            {/* 7-Day Histogram Composed Directly on Horizon (NO CARDS!) */}
            <div className="space-y-8">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 uppercase tracking-widest">
                  CURRENT CALENDAR WEEK: {stats.weeklyOutdoorMinutes}m LOGGED
                </span>
                <span className="text-stone-400">
                  Target: 120m / week ({stats.weeklyProgressPct}%)
                </span>
              </div>

              {/* Weekly Progress Bar */}
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-emerald-400 transition-all duration-700 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                  style={{ width: `${Math.max(4, stats.weeklyProgressPct)}%` }}
                />
              </div>

              {/* 7 Day Vertical Cadence Pillars */}
              <div className="grid grid-cols-7 gap-2 sm:gap-6 pt-4">
                {stats.dayDistribution.map((d) => {
                  const maxDayMin = Math.max(
                    60,
                    ...stats.dayDistribution.map((x) => x.minutes)
                  );
                  const heightPct = Math.min(100, Math.round((d.minutes / maxDayMin) * 85));
                  const hasActivity = d.minutes > 0;

                  return (
                    <div key={d.day} className="space-y-3 text-center group">
                      <div className="h-44 flex items-end justify-center border-b border-white/20 pb-3 relative">
                        {/* Day Column */}
                        <div
                          className={`w-4 sm:w-6 rounded-t-lg transition-all duration-500 relative ${
                            hasActivity
                              ? 'bg-gradient-to-t from-amber-500 via-orange-400 to-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.5)]'
                              : 'bg-white/10'
                          }`}
                          style={{ height: `${Math.max(12, heightPct)}%` }}
                        >
                          {hasActivity && (
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-mono text-amber-300 whitespace-nowrap font-bold">
                              {d.minutes}m
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div
                          className={`text-xs font-mono font-bold tracking-wider ${
                            d.isCurrentDay ? 'text-amber-400' : 'text-stone-300'
                          }`}
                        >
                          {d.short}
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono">
                          {d.count > 0 ? `${d.count} trek` : '—'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Environmental Biome Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-white/10">
              <div className="space-y-4">
                <div className="text-xs font-mono uppercase tracking-widest text-amber-400">
                  BIODIVERSITY & HABITAT SPREAD
                </div>
                <h3 className="font-editorial text-2xl text-white font-bold">
                  Ecosystems Explored ({stats.biomesExploredCount})
                </h3>
                <p className="text-sm text-stone-300 font-body leading-relaxed">
                  Stepping into diverse micro-biomes exposes the senses to varied volatile organic
                  compounds (phytoncides) and acoustic signatures.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-stone-400">Most Frequented Biome</span>
                    <span className="text-amber-300 font-bold uppercase">{stats.favoriteBiome}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-stone-400">Average Trek Duration</span>
                    <span className="text-emerald-300 font-bold">{stats.averageSessionMinutes} minutes</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-stone-400">Cumulative Elevation Gain</span>
                    <span className="text-cyan-300 font-bold">+{stats.elevationGainedMeters} meters</span>
                  </div>
                </div>
              </div>

              {/* Naturalist Habit Pledge */}
              <div className="p-6 rounded-2xl border border-white/10 bg-black/40 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
                    <Wind className="w-4 h-4" />
                    <span>THE TRAILMIND MANIFESTO</span>
                  </div>
                  <h4 className="font-editorial text-xl text-white font-bold">
                    "The eye was never engineered to rest at fifteen inches."
                  </h4>
                  <p className="text-xs text-stone-300 font-body leading-relaxed">
                    By recording real minutes in open space, you counteract the digital gravity of the
                    workday. Even 15 minutes of wind and foliage recalibrates your nervous system.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-400">Current Outdoor Streak</span>
                  <span className="text-amber-400 font-bold">{stats.currentStreakDays} Consecutive Days</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 03: NATURALIST WAYPOINTS & EXPEDITION MILESTONES
           ========================================================================= */}
        {activeTab === 'field_badges' && (
          <section className="space-y-10">
            <div className="border-b border-white/10 pb-6">
              <div className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400">
                SECTION 03 // NATURALIST MILESTONES & EXPEDITION MARKS
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-white mt-1">
                Trail Marks Unlocked
              </h2>
              <p className="text-stone-300 text-sm max-w-2xl font-body mt-2">
                Earned strictly through authentic exploration in the field. No artificial screen badges.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  id: 'm1',
                  title: 'Threshold Crosser',
                  desc: 'Completed your first authentic outdoor micro-adventure.',
                  unlocked: stats.adventuresCompleted >= 1,
                  metric: `${stats.adventuresCompleted}/1 adventures`,
                  icon: <Compass className="w-5 h-5 text-amber-400" />,
                },
                {
                  id: 'm2',
                  title: 'Phytoncide Immersion',
                  desc: 'Logged 60+ cumulative outdoor minutes beneath trees and sky.',
                  unlocked: stats.outdoorMinutes >= 60,
                  metric: `${stats.outdoorMinutes}/60 minutes`,
                  icon: <TreePine className="w-5 h-5 text-emerald-400" />,
                },
                {
                  id: 'm3',
                  title: 'Kilometer Strider',
                  desc: 'Walked at least 5 kilometers across natural and neighborhood paths.',
                  unlocked: stats.estimatedDistanceKm >= 5,
                  metric: `${stats.estimatedDistanceKm.toFixed(1)}/5.0 km`,
                  icon: <Footprints className="w-5 h-5 text-cyan-400" />,
                },
                {
                  id: 'm4',
                  title: 'Consistent Cadence',
                  desc: 'Maintained a 3-day consecutive outdoor adventure streak.',
                  unlocked: stats.currentStreakDays >= 3 || stats.longestStreakDays >= 3,
                  metric: `${stats.longestStreakDays}/3 days streak`,
                  icon: <Flame className="w-5 h-5 text-orange-400" />,
                },
                {
                  id: 'm5',
                  title: 'Two-Hour Nature Threshold',
                  desc: 'Completed 120+ minutes in a single weekly cycle.',
                  unlocked: stats.weeklyOutdoorMinutes >= 120 || stats.outdoorMinutes >= 120,
                  metric: `${stats.weeklyOutdoorMinutes}/120 weekly min`,
                  icon: <Clock className="w-5 h-5 text-amber-400" />,
                },
                {
                  id: 'm6',
                  title: 'Field Journal Naturalist',
                  desc: 'Logged 3 or more contemplative reflections in your archive.',
                  unlocked: stats.journalEntriesCount >= 3,
                  metric: `${stats.journalEntriesCount}/3 written notes`,
                  icon: <BookOpen className="w-5 h-5 text-teal-400" />,
                },
              ].map((badge) => (
                <div
                  key={badge.id}
                  className={`flex items-start gap-4 p-5 rounded-2xl border transition-all ${
                    badge.unlocked
                      ? 'border-amber-500/40 bg-amber-500/5 shadow-[0_4px_24px_rgba(245,158,11,0.08)]'
                      : 'border-white/10 bg-black/30 opacity-40'
                  }`}
                >
                  <div className="p-3 rounded-xl border border-white/20 bg-black/60 shrink-0">
                    {badge.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-editorial text-lg font-bold text-white">
                        {badge.title}
                      </h4>
                      {badge.unlocked && (
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-stone-300 font-body leading-relaxed">
                      {badge.desc}
                    </p>
                    <div className="text-[10px] font-mono text-amber-400/90 pt-1 font-bold">
                      {badge.metric}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            BOTTOM EXPEDITION FOOTER & CALL TO ACTION
           ========================================================================= */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-xs font-mono text-stone-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>AUTHENTIC LOCAL DATA</span>
            <span>•</span>
            <span>UPDATES REAL-TIME WITH ADVENTURES</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                audioSynth.playChime('start');
                onNavigate('/explore');
              }}
              className="px-6 py-3 rounded-full bg-amber-500 text-stone-950 font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2 cursor-pointer shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Launch New Adventure</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
