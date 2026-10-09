import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Sun,
  Sunrise,
  CheckCircle2,
  Footprints,
} from 'lucide-react';
import { Adventure, CompletedMemory } from '../types';
import { addMemory, completeAdventure, saveReflection } from '../utils/storage';
import { audioSynth } from '../utils/audioSynth';

interface CompletePageProps {
  adventure: Adventure | null;
  completionData: {
    elapsedSeconds: number;
    waypointsCompleted: number;
    photos: string[];
    notes: string[];
  } | null;
  onNavigate: (route: string) => void;
  onMemorySaved?: () => void;
}

const RATING_EMOJIS = [
  { emoji: '😕', score: 1, label: 'Tough / Distracted' },
  { emoji: '😐', score: 2, label: 'Okay' },
  { emoji: '🙂', score: 3, label: 'Pleasant' },
  { emoji: '😄', score: 4, label: 'Great' },
  { emoji: '🤩', score: 5, label: 'Magical' },
];

export const CompletePage: React.FC<CompletePageProps> = ({
  adventure,
  completionData,
  onNavigate,
  onMemorySaved,
}) => {
  const actualMinutes = Math.max(
    1,
    Math.round((completionData?.elapsedSeconds || 1200) / 60)
  );

  // Ratings
  const [selectedRating, setSelectedRating] = useState<number | null>(4); // default 🙂 / 😄
  const [reflection, setReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Derived adventure data
  const missionTitle = adventure?.title || 'Spontaneous Outdoor Wander';
  const activityName =
    adventure?.classification || adventure?.moodTarget || 'Nature Walk';
  const environmentName = adventure?.biome
    ? adventure.biome.replace(/_/g, ' ')
    : 'Outdoors';

  // Build Adventure Memory object matching the exact specification:
  // mission, date, duration, rating, reflection, activity, environment
  const createMemoryRecord = (userReflection: string, ratingScore: number): CompletedMemory => {
    const selectedEmojiObj = RATING_EMOJIS.find((r) => r.score === ratingScore);
    return {
      id: `mem-${Date.now()}`,
      adventureId: adventure?.id || `adv-${Date.now()}`,
      title: missionTitle,
      mission: missionTitle,
      date: new Date().toISOString(),
      duration: actualMinutes,
      outdoorMinutes: actualMinutes,
      rating: ratingScore,
      ratingEmoji: selectedEmojiObj ? selectedEmojiObj.emoji : '🙂',
      reflection: userReflection.trim() || 'Felt the outdoor air, saw details in the landscape, left the phone tucked away.',
      activity: activityName,
      environment: environmentName,
      biome: adventure?.biome || 'forest_trail',
      moodBefore: adventure?.moodTarget || 'Indoor screen fatigue',
      moodAfter: 'Refreshed & grounded',
      sensoryHighlight: userReflection.trim() || 'Noticed sunlight filtering through leaves and fresh air.',
      fieldNote: userReflection.trim() || 'Stepped outside and disconnected from digital noise.',
      waypointsCompleted: completionData?.waypointsCompleted || 3,
      totalWaypoints: adventure?.tasks?.length || adventure?.waypoints?.length || 3,
      estimatedSteps: Math.round(actualMinutes * 115),
      tags: [environmentName, activityName, `${actualMinutes} min`],
    };
  };

  const handleSaveMemory = () => {
    audioSynth.playChime('start');
    const memory = createMemoryRecord(reflection, selectedRating || 4);
    addMemory(memory);
    if (reflection.trim()) {
      saveReflection({
        adventureId: memory.adventureId,
        rating: memory.rating,
        ratingEmoji: memory.ratingEmoji,
        reflection: reflection.trim(),
        recordedAt: memory.date,
      });
    }
    if (onMemorySaved) onMemorySaved();
    setIsSaved(true);

    setTimeout(() => {
      onNavigate('/memories');
    }, 450);
  };

  const handleSkip = () => {
    // If skipped, still record minimal trail entry in archive so it appears in history
    audioSynth.playChime('tick');
    const minimalMemory = createMemoryRecord('', selectedRating || 3);
    addMemory(minimalMemory);
    if (onMemorySaved) onMemorySaved();
    onNavigate('/history');
  };

  return (
    <div className="relative min-h-screen bg-[#070b14] overflow-hidden text-stone-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* =====================================================================
          CINEMATIC ILLUSTRATED SUNRISE / SUNSET LANDSCAPE
          Rich golden-orange gradient glow, warm rays, mountain ridges, silhouettes
         ===================================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sky gradient: Golden sunrise / sunset dusk with twilight upper gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1328] via-[#241324] via-[#5c2323] via-[#b44820] to-[#f49342] opacity-90" />

        {/* Ambient atmospheric overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,rgba(255,200,80,0.45)_0%,rgba(230,80,30,0.25)_45%,transparent_75%)]" />

        {/* Illustrated Sunrise/Sunset Orb */}
        <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full bg-gradient-to-t from-[#ffe082] via-[#ff9800] to-transparent opacity-80 blur-2xl pointer-events-none" />
        <div className="absolute bottom-[32%] left-1/2 -translate-x-1/2 w-[160px] sm:w-[220px] h-[160px] sm:h-[220px] rounded-full bg-gradient-to-t from-[#fff9c4] via-[#ffd54f] to-[#ff9800] opacity-90 shadow-[0_0_90px_rgba(255,213,79,0.8)] pointer-events-none" />

        {/* Landscape Vector Silhouettes - Layered Sunrise Ridges & Trees */}
        <svg
          className="absolute inset-0 w-full h-full preserve-3d"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Distant Mountain Ridge 1 - Warm Amber Violet */}
          <path
            d="M0 640 L160 560 L380 620 L580 530 L840 640 L1100 520 L1320 590 L1440 550 L1440 900 L0 900 Z"
            fill="#451a2d"
            opacity="0.85"
          />

          {/* Mid Mountain Ridge 2 - Deep Copper Crimson */}
          <path
            d="M0 690 L220 620 L440 680 L720 590 L960 670 L1200 580 L1440 660 L1440 900 L0 900 Z"
            fill="#2c1020"
            opacity="0.95"
          />

          {/* Foreground Forest Hills & Treeline Silhouette */}
          <path
            d="M0 760 Q200 710 400 740 T800 730 T1200 750 T1440 730 L1440 900 L0 900 Z"
            fill="#120815"
          />

          {/* Detailed illustrated Pine trees & vegetation silhouette on the foreground */}
          {/* Left cluster */}
          <path d="M40 760 L60 700 L80 760 Z M50 720 L60 680 L70 720 Z" fill="#0d0510" />
          <path d="M75 770 L95 690 L115 770 Z M85 710 L95 670 L105 710 Z" fill="#0a030c" />
          <path d="M120 780 L140 715 L160 780 Z" fill="#0a030c" />
          <path d="M180 790 L195 735 L210 790 Z" fill="#09030b" />

          {/* Right cluster */}
          <path d="M1260 780 L1280 710 L1300 780 Z M1270 725 L1280 685 L1290 725 Z" fill="#0c040f" />
          <path d="M1310 770 L1330 695 L1350 770 Z" fill="#0a030c" />
          <path d="M1360 760 L1385 680 L1410 760 Z" fill="#070208" />

          {/* Gentle meadow grass foreground cap */}
          <path
            d="M0 830 Q360 800 720 820 T1440 810 L1440 900 L0 900 Z"
            fill="#060208"
          />
        </svg>

        {/* Rising Light Rays / Sunburst Dust particles */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(255,235,160,0.12)_0%,transparent_60%)]" />
      </div>

      {/* =====================================================================
          MAIN EDITORIAL CONTENT - WOVEN DIRECTLY INTO THE ENVIRONMENT
          (NO CONTAINERS, NO DASHBOARD CARDS)
         ===================================================================== */}
      <div className="relative z-20 min-h-screen flex flex-col justify-between max-w-4xl mx-auto px-4 xs:px-6 sm:px-10 lg:px-12 pt-16 xs:pt-20 sm:pt-28 pb-12 sm:pb-16">
        {/* Top Header Badge */}
        <div className="space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2.5 xs:gap-3 text-[10px] xs:text-xs font-mono uppercase tracking-[0.25em] sm:tracking-[0.35em] text-amber-300/90">
            <Sunrise className="w-4 h-4 text-amber-300 shrink-0" />
            <span>EXPEDITION COMPLETED</span>
            <span className="w-6 xs:w-8 h-[1px] bg-amber-400/50" />
            <span>REAL-WORLD VICTORY</span>
          </div>

          {/* Large text as requested:
              YOU WENT
              OUTSIDE.
              Small text:
              That's a win. */}
          <div className="space-y-2 sm:space-y-3">
            <h1 className="font-editorial text-5xl xs:text-6xl sm:text-8xl md:text-9xl font-black text-white tracking-tight leading-[0.88] drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
              YOU WENT<br />
              <span className="bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent">
                OUTSIDE.
              </span>
            </h1>

            <p className="font-editorial text-xl xs:text-2xl sm:text-3xl text-amber-200/90 italic tracking-wide">
              That's a win.
            </p>
          </div>

          {/* Mission context tag */}
          <div className="flex flex-wrap items-center gap-2 xs:gap-3 text-[11px] xs:text-xs font-mono text-stone-300/90 pt-1 sm:pt-2">
            <span className="text-amber-400 font-bold uppercase tracking-wider">{missionTitle}</span>
            <span>·</span>
            <span>{actualMinutes} MINUTES</span>
            <span>·</span>
            <span className="capitalize">{environmentName}</span>
            <span>·</span>
            <span>{activityName}</span>
          </div>
        </div>

        {/* Middle Section: Integrated Questions directly inside the illustrated world */}
        <div className="my-8 sm:my-10 space-y-8 sm:space-y-12">
          {/* Question 1: How was it? with 😕 😐 🙂 😄 🤩 */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-2 xs:gap-3">
              <span className="font-editorial text-lg xs:text-xl sm:text-2xl font-bold text-white tracking-wide">
                How was it?
              </span>
              <span className="text-[10px] xs:text-xs font-mono uppercase tracking-widest text-amber-400/80">
                // TAP YOUR FEELING
              </span>
            </div>

            {/* Emoji Selection Bar */}
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-6 flex-wrap">
              {RATING_EMOJIS.map((item) => {
                const isSelected = selectedRating === item.score;
                return (
                  <button
                    key={item.score}
                    type="button"
                    onClick={() => {
                      setSelectedRating(item.score);
                      audioSynth.playChime('tick');
                    }}
                    className={`group relative flex flex-col items-center justify-center p-2.5 xs:p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400/20 ring-2 ring-amber-400 scale-105 sm:scale-110 shadow-[0_0_24px_rgba(251,191,36,0.35)]'
                        : 'bg-black/30 hover:bg-black/50 border border-white/10 hover:border-amber-400/40 opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                    title={item.label}
                  >
                    <span className="text-2xl xs:text-3xl sm:text-4xl select-none transition-transform group-hover:scale-110">
                      {item.emoji}
                    </span>
                    <span
                      className={`text-[9px] xs:text-[10px] font-mono uppercase tracking-wider mt-1 sm:mt-1.5 transition-colors ${
                        isSelected ? 'text-amber-300 font-bold' : 'text-stone-400'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 2: What did you notice? Optional reflection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="reflection-input"
                className="font-editorial text-lg xs:text-xl sm:text-2xl font-bold text-white tracking-wide"
              >
                What did you notice?
              </label>
              <span className="text-[10px] xs:text-xs font-mono uppercase tracking-widest text-stone-400">
                Optional reflection
              </span>
            </div>

            <div className="relative">
              <textarea
                id="reflection-input"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={3}
                placeholder="A bird call, a cold stone, shadows stretching across the grass, quiet footsteps..."
                className="w-full p-3.5 xs:p-4 sm:p-5 bg-black/40 border border-white/20 focus:border-amber-400 rounded-xl text-stone-100 text-sm xs:text-base font-editorial italic placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all backdrop-blur-sm shadow-inner"
              />
              <div className="absolute right-3 bottom-3 text-[10px] xs:text-[11px] font-mono text-stone-500 pointer-events-none">
                NATURALIST JOURNAL
              </div>
            </div>
          </div>
        </div>

        {/* Buttons: SAVE MEMORY and SKIP */}
        <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-5">
          {/* SKIP Button */}
          <button
            type="button"
            onClick={handleSkip}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs font-mono uppercase tracking-[0.25em] text-stone-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer text-center"
          >
            SKIP
          </button>

          {/* SAVE MEMORY CTA */}
          <button
            type="button"
            onClick={handleSaveMemory}
            disabled={isSaved}
            className="w-full sm:w-auto min-h-[54px] sm:min-h-[58px] px-8 sm:px-10 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs sm:text-base tracking-widest uppercase flex items-center justify-center gap-3 transition-all shadow-[0_12px_36px_rgba(249,115,22,0.45)] active:scale-[0.98] cursor-pointer"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-stone-950" />
                <span>SAVED TO MEMORIES</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-stone-950 fill-stone-950" />
                <span>SAVE MEMORY</span>
                <ArrowRight className="w-5 h-5 text-stone-950" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
