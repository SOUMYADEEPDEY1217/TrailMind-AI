import React, { useState } from 'react';
import { Volume2, Waves } from 'lucide-react';
import { audioSynth } from '../../utils/audioSynth';

export const WaterfallRiverScene: React.FC = () => {
  const [currentCadence, setCurrentCadence] = useState<'glacial' | 'rapids' | 'still'>('rapids');

  const handleWaterSound = () => {
    audioSynth.playChime('waypoint');
    audioSynth.startAmbient('stream');
  };

  return (
    <section className="relative w-full min-h-[110vh] overflow-hidden bg-[#05141e] flex flex-col justify-between py-20 select-none">
      {/* ========================================================
          FULL BLEED ILLUSTRATED GORGE & WATERFALL ENVIRONMENT
         ======================================================== */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 1000"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Massive Canyon Cliffs Left & Right */}
        <path
          d="M0 0 L420 0 L360 480 L480 820 L380 1000 L0 1000 Z"
          fill="#06121a"
        />
        <path
          d="M1440 0 L1080 0 L1140 450 L1020 800 L1120 1000 L1440 1000 Z"
          fill="#050f15"
        />

        {/* Central Waterfall Cascades Cutting Through Canyon */}
        <g className="anim-shimmer-water">
          {/* Top Cascade Plunge */}
          <path
            d="M660 0 L780 0 L820 400 L620 400 Z"
            fill="#38bdf8"
            fillOpacity="0.3"
          />
          <path
            d="M680 0 L760 0 L780 390 L650 390 Z"
            fill="#a5f3fc"
            fillOpacity="0.45"
          />
          {/* Mid Tier Churn */}
          <path
            d="M590 400 L840 400 L890 740 L530 740 Z"
            fill="#0284c7"
            fillOpacity="0.4"
          />
          {/* White Water Torrents */}
          <path
            d="M690 40 L730 40 L750 720 L680 720 Z"
            fill="#ffffff"
            fillOpacity="0.75"
          />
          <path
            d="M740 80 L765 80 L790 710 L750 710 Z"
            fill="#ffffff"
            fillOpacity="0.65"
          />
          <path
            d="M640 160 L675 160 L685 700 L635 700 Z"
            fill="#e0f2fe"
            fillOpacity="0.55"
          />

          {/* Billowing Waterfall Mist Clouds */}
          <ellipse cx="710" cy="740" rx="300" ry="70" fill="#a5f3fc" fillOpacity="0.15" />
          <ellipse cx="710" cy="720" rx="200" ry="45" fill="#ffffff" fillOpacity="0.22" />
        </g>

        {/* Wide Rushing Mountain River Floor with Granite Stepping Stones */}
        <path
          d="M0 760 Q710 680 1440 760 L1440 1000 L0 1000 Z"
          fill="#031e28"
        />
        <path
          d="M0 830 Q710 770 1440 830 L1440 1000 L0 1000 Z"
          fill="#082f3d"
        />

        {/* Granite River Boulders (Natural Stepping Stones in River) */}
        <ellipse cx="380" cy="850" rx="110" ry="50" fill="#040b10" />
        <ellipse cx="610" cy="890" rx="85" ry="40" fill="#03080d" />
        <ellipse cx="880" cy="860" rx="130" ry="55" fill="#050e14" />
        <ellipse cx="1140" cy="900" rx="100" ry="45" fill="#040a0e" />

        {/* Swirling Current Ripples on Turquoise River with animated water motion */}
        <g className="anim-water-ripple">
          <ellipse cx="500" cy="870" rx="160" ry="14" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.35" fill="none" />
          <ellipse cx="1020" cy="910" rx="190" ry="16" stroke="#7dd3fc" strokeWidth="1" strokeOpacity="0.25" fill="none" />
        </g>
        <g className="anim-water-ripple-delayed">
          <ellipse cx="780" cy="880" rx="220" ry="18" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.3" fill="none" />
        </g>
      </svg>

      {/* ========================================================
          ASYMMETRIC COMPOSITION (NO CARDS)
         ======================================================== */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 xs:px-6 sm:px-12 lg:px-16 w-full flex-1 flex flex-col justify-between py-10 sm:py-12">
        {/* Top Story Anchor */}
        <div className="max-w-3xl space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3 text-[10px] xs:text-xs font-mono uppercase tracking-[0.25em] sm:tracking-[0.3em] text-cyan-400">
            <span>CHAPTER 03</span>
            <span className="w-8 h-[1px] bg-cyan-500/60" />
            <span>RIPARIAN FORCE</span>
          </div>

          <h2 className="font-editorial text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-[0.88] text-balance">
            Water never<br />
            hesitates.
          </h2>
        </div>

        {/* Middle Environmental Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end my-12">
          {/* Asymmetric Left Prose */}
          <div className="lg:col-span-6 space-y-6">
            <p className="font-editorial text-2xl sm:text-3xl text-cyan-100/90 italic leading-snug">
              "The human mind loops in deliberation. A mountain river simply wraps around granite and accelerates."
            </p>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-body max-w-md">
              Falling water creates continuous broadband white noise across all frequencies, instantly silencing the internal monologue. When cold glacial mist hits your skin, your mammalian diving reflex takes over.
            </p>

            <button
              onClick={handleWaterSound}
              className="inline-flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-cyan-300 hover:text-cyan-200 transition-colors pt-2 group cursor-pointer"
            >
              <span className="w-8 h-8 rounded-full border border-cyan-400/40 flex items-center justify-center group-hover:scale-110 transition-transform bg-black/40">
                <Volume2 className="w-4 h-4 text-cyan-400" />
              </span>
              <span className="underline underline-offset-4 decoration-cyan-400/40">
                Listen to the mountain rapids
              </span>
            </button>
          </div>

          {/* Asymmetric Right Natural Field Steppers (Integrated into River Stones) */}
          <div className="lg:col-span-6 space-y-6 lg:pl-10">
            <div className="space-y-4">
              <div
                onClick={() => setCurrentCadence('glacial')}
                className={`cursor-pointer transition-all duration-300 border-l-2 pl-4 py-2 ${
                  currentCadence === 'glacial'
                    ? 'border-cyan-400 text-white'
                    : 'border-cyan-900 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="font-mono text-xs text-cyan-400/90 tracking-widest uppercase mb-1">
                  TACTILE CURRENT // 01
                </div>
                <div className="font-editorial text-xl font-bold text-white mb-1">
                  Glacial Reset
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Submerge your wrists in a natural stream for 30 seconds. Cold thermal shock instantly halts nervous loops.
                </p>
              </div>

              <div
                onClick={() => setCurrentCadence('rapids')}
                className={`cursor-pointer transition-all duration-300 border-l-2 pl-4 py-2 ${
                  currentCadence === 'rapids'
                    ? 'border-cyan-400 text-white'
                    : 'border-cyan-900 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="font-mono text-xs text-cyan-400/90 tracking-widest uppercase mb-1">
                  AUDIO MASKING // 02
                </div>
                <div className="font-editorial text-xl font-bold text-white mb-1">
                  The 40dB Water Screen
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Stand 10 yards from tumbling water. Let your acoustic bandwidth register every micro-drop and splash.
                </p>
              </div>

              <div
                onClick={() => setCurrentCadence('still')}
                className={`cursor-pointer transition-all duration-300 border-l-2 pl-4 py-2 ${
                  currentCadence === 'still'
                    ? 'border-cyan-400 text-white'
                    : 'border-cyan-900 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="font-mono text-xs text-cyan-400/90 tracking-widest uppercase mb-1">
                  VISUAL RIPPLE // 03
                </div>
                <div className="font-editorial text-xl font-bold text-white mb-1">
                  Current Tracking
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Pick a floating autumn leaf or water vortex. Follow its path without moving your head for 60 seconds.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Horizon Line */}
        <div className="border-t border-cyan-950/80 pt-6 flex items-center justify-between text-xs font-mono text-cyan-400/70 tracking-widest uppercase">
          <span>03 // GORGE BASIN LEVEL</span>
          <span className="hidden sm:inline">TRAILMIND HYDRAULIC IMMERSION</span>
          <span>ASCENDING TO TWILIGHT HORIZON →</span>
        </div>
      </div>
    </section>
  );
};
