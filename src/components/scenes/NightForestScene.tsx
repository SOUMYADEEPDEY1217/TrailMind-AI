import React, { useState } from 'react';
import { Sparkles, Moon, Flame } from 'lucide-react';
import { audioSynth } from '../../utils/audioSynth';

export const NightForestScene: React.FC = () => {
  const [activeStarMode, setActiveStarMode] = useState<'rods' | 'zenith' | 'silence'>('zenith');

  const handleNightChime = () => {
    audioSynth.playChime('waypoint');
  };

  return (
    <section className="relative w-full min-h-[110vh] overflow-hidden bg-[#040812] flex flex-col justify-between py-20 select-none">
      {/* ========================================================
          FULL BLEED NIGHT SKY & STELLAR ILLUMINATION (NO BOXES)
         ======================================================== */}
      {/* Deep Space Indigo-to-Black Gradient with Moon Glow */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Luminous Crescent Moon */}
        <div className="absolute top-20 right-16 sm:right-32 w-20 h-20 rounded-full bg-gradient-to-tr from-amber-100 to-transparent opacity-90 blur-[0.5px]">
          <div className="absolute inset-0 rounded-full bg-[#040812] translate-x-3 -translate-y-1" />
        </div>
        <div className="absolute top-14 right-10 sm:right-24 w-44 h-44 rounded-full bg-amber-100/10 blur-3xl" />

        {/* Dense Starfield & Nebula Drift */}
        <svg className="w-full h-full opacity-80" viewBox="0 0 1440 900" fill="none">
          <circle cx="120" cy="90" r="1.5" fill="#ffffff" />
          <circle cx="280" cy="180" r="2" fill="#ffd375" />
          <circle cx="440" cy="110" r="1.5" fill="#ffffff" />
          <circle cx="580" cy="70" r="2.5" fill="#fef08a" />
          <circle cx="720" cy="220" r="1" fill="#bae6fd" />
          <circle cx="880" cy="130" r="2" fill="#ffffff" />
          <circle cx="1020" cy="90" r="2.5" fill="#ffd375" />
          <circle cx="1180" cy="160" r="1.5" fill="#ffffff" />
          <circle cx="1340" cy="100" r="2" fill="#ffffff" />

          <circle cx="190" cy="280" r="1.5" fill="#ffffff" />
          <circle cx="340" cy="340" r="2" fill="#bae6fd" />
          <circle cx="510" cy="260" r="2.5" fill="#ffffff" />
          <circle cx="680" cy="320" r="1.5" fill="#ffd375" />
          <circle cx="830" cy="270" r="2" fill="#ffffff" />
          <circle cx="990" cy="340" r="1.5" fill="#ffffff" />
          <circle cx="1260" cy="290" r="2" fill="#ffd375" />

          {/* Faint Starlit Constellation Lines */}
          <line x1="440" y1="110" x2="510" y2="260" stroke="#ffffff" strokeWidth="0.6" strokeOpacity="0.25" />
          <line x1="510" y1="260" x2="580" y2="70" stroke="#ffffff" strokeWidth="0.6" strokeOpacity="0.25" />
          <line x1="880" y1="130" x2="990" y2="340" stroke="#ffffff" strokeWidth="0.6" strokeOpacity="0.25" />
          <line x1="990" y1="340" x2="1020" y2="90" stroke="#ffffff" strokeWidth="0.6" strokeOpacity="0.25" />
        </svg>

        {/* Floating Glowing Fireflies */}
        <div className="absolute top-[35%] left-[18%] w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_14px_#fbbf24] anim-firefly-1" />
        <div className="absolute top-[52%] left-[45%] w-3 h-3 rounded-full bg-yellow-300 shadow-[0_0_18px_#fde047] anim-firefly-2" />
        <div className="absolute top-[68%] left-[72%] w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_14px_#6ee7b7] anim-firefly-3" />
        <div className="absolute top-[42%] left-[86%] w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_12px_#f59e0b] anim-firefly-1" />
      </div>

      {/* Silhouette Mountain & Pine Line across the bottom */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[45%] pointer-events-none"
        viewBox="0 0 1440 450"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Distant Mountain Shadow */}
        <path
          d="M0 260 L240 180 L490 280 L760 160 L1020 270 L1240 170 L1440 240 L1440 450 L0 450 Z"
          fill="#02050b"
        />

        {/* Dense Pine Tree Crown Silhouettes */}
        <g fill="#010307">
          <path d="M40 290 L55 190 L70 290 Z M90 310 L105 210 L120 310 Z M160 300 L175 180 L190 300 Z" />
          <path d="M260 280 L275 170 L290 280 Z M380 320 L395 200 L410 320 Z M520 290 L535 180 L550 290 Z" />
          <path d="M680 310 L695 190 L710 310 Z M820 270 L835 160 L850 270 Z M940 300 L955 190 L970 300 Z" />
          <path d="M1100 290 L1115 170 L1130 290 Z M1220 310 L1235 200 L1250 310 Z M1360 280 L1375 180 L1390 280 Z" />
        </g>

        {/* Campfire Warm Ember Hearth (Integrated into Forest Floor) */}
        <g transform="translate(1080, 340)">
          <ellipse cx="0" cy="20" rx="90" ry="30" fill="#f97316" fillOpacity="0.25" className="anim-pulse-atmosphere" />
          <ellipse cx="0" cy="15" rx="55" ry="18" fill="#fbbf24" fillOpacity="0.4" />
          <ellipse cx="0" cy="10" rx="20" ry="10" fill="#ffffff" fillOpacity="0.7" />
        </g>
      </svg>

      {/* ========================================================
          ASYMMETRIC ENVIRONMENTAL STORYTELLING (NO CARDS)
         ======================================================== */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 xs:px-6 sm:px-12 lg:px-16 w-full flex-1 flex flex-col justify-between py-10 sm:py-12">
        {/* Top Story Anchor */}
        <div className="max-w-3xl space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3 text-[10px] xs:text-xs font-mono uppercase tracking-[0.25em] sm:tracking-[0.3em] text-amber-300">
            <span>CHAPTER 04</span>
            <span className="w-8 h-[1px] bg-amber-400/60" />
            <span>CIRCADIAN NIGHT</span>
          </div>

          <h2 className="font-editorial text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-[0.88] text-balance">
            Under a billion stars,<br />
            anxieties shrink.
          </h2>
        </div>

        {/* Middle Environmental Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end my-12">
          {/* Asymmetric Left Prose */}
          <div className="lg:col-span-6 space-y-6">
            <p className="font-editorial text-2xl sm:text-3xl text-amber-100/90 italic leading-snug">
              "For 99% of human evolution, darkness meant deep quiet, woodsmoke, and the silver glow of the Milky Way."
            </p>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-body max-w-md">
              Blue pixel light tricks our retinas into permanent daytime tension. Stepping into evening darkness lets rhodopsin replenish, widening your visual field and dropping heart rate.
            </p>

            <button
              onClick={handleNightChime}
              className="inline-flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-amber-300 hover:text-amber-200 transition-colors pt-2 group cursor-pointer"
            >
              <span className="w-8 h-8 rounded-full border border-amber-400/40 flex items-center justify-center group-hover:scale-110 transition-transform bg-black/40">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </span>
              <span className="underline underline-offset-4 decoration-amber-400/40">
                Awaken night peripheral vision
              </span>
            </button>
          </div>

          {/* Asymmetric Right Natural Night Guides */}
          <div className="lg:col-span-6 space-y-6 lg:pl-10">
            <div className="space-y-4">
              <div
                onClick={() => setActiveStarMode('zenith')}
                className={`cursor-pointer transition-all duration-300 border-l-2 pl-4 py-2 ${
                  activeStarMode === 'zenith'
                    ? 'border-amber-400 text-white'
                    : 'border-indigo-900 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="font-mono text-xs text-amber-400/90 tracking-widest uppercase mb-1">
                  STAR OBSERVATION // 01
                </div>
                <div className="font-editorial text-xl font-bold text-white mb-1">
                  The Zenith Fixed Point
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Find the highest star directly overhead. Lock your gaze on it for 45 seconds until depth perception opens.
                </p>
              </div>

              <div
                onClick={() => setActiveStarMode('rods')}
                className={`cursor-pointer transition-all duration-300 border-l-2 pl-4 py-2 ${
                  activeStarMode === 'rods'
                    ? 'border-amber-400 text-white'
                    : 'border-indigo-900 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="font-mono text-xs text-amber-400/90 tracking-widest uppercase mb-1">
                  ROD VISION ADAPTATION // 02
                </div>
                <div className="font-editorial text-xl font-bold text-white mb-1">
                  Peripheral Twilight Scan
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Look slightly away from an object in the dark. Your rod cells detect dim silhouettes better from the edge of vision.
                </p>
              </div>

              <div
                onClick={() => setActiveStarMode('silence')}
                className={`cursor-pointer transition-all duration-300 border-l-2 pl-4 py-2 ${
                  activeStarMode === 'silence'
                    ? 'border-amber-400 text-white'
                    : 'border-indigo-900 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="font-mono text-xs text-amber-400/90 tracking-widest uppercase mb-1">
                  NOCTURNAL ACOUSTICS // 03
                </div>
                <div className="font-editorial text-xl font-bold text-white mb-1">
                  Crickets & Night Wind
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  With daytime traffic hushed, your hearing reaches twice as far. Isolate 3 distinct night-time creature calls.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Horizon Line */}
        <div className="border-t border-indigo-950/80 pt-6 flex items-center justify-between text-xs font-mono text-amber-400/70 tracking-widest uppercase">
          <span>04 // MIDNIGHT ZENITH</span>
          <span className="hidden sm:inline">TRAILMIND CIRCADIAN RESTORATION</span>
          <span>STEPPING OUTSIDE INTO THE REAL WORLD →</span>
        </div>
      </div>
    </section>
  );
};
