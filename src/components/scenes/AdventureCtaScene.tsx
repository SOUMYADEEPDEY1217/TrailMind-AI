import React from 'react';
import { ArrowRight, Compass, Footprints, Sparkles, Sun } from 'lucide-react';
import { CURATED_EXPEDITIONS } from '../../utils/adventureEngine';
import { Adventure } from '../../types';
import { audioSynth } from '../../utils/audioSynth';

interface AdventureCtaSceneProps {
  onStartExplore: () => void;
  onLaunchCurated: (adv: Adventure) => void;
}

export const AdventureCtaScene: React.FC<AdventureCtaSceneProps> = ({
  onStartExplore,
  onLaunchCurated,
}) => {
  return (
    <section className="relative w-full min-h-[105vh] overflow-hidden bg-gradient-to-b from-[#040812] via-[#09151e] to-[#04090f] flex flex-col justify-between py-20 select-none">
      {/* Background Illustrated Summit Ridge & Sunward Glow */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-45"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Distant Mountain Ridges */}
        <path
          d="M0 380 L180 260 L400 390 L680 200 L950 370 L1220 220 L1440 330 L1440 900 L0 900 Z"
          fill="#0a1d28"
        />
        <path
          d="M0 520 L260 380 L540 500 L820 340 L1100 480 L1440 390 L1440 900 L0 900 Z"
          fill="#06131c"
        />
        <path
          d="M0 680 Q720 590 1440 680 L1440 900 L0 900 Z"
          fill="#030a0f"
        />

        {/* Trail Pathway Dashes ascending toward the right summit */}
        <path
          d="M120 860 Q400 780 750 710 Q1050 630 1340 580"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          strokeOpacity="0.4"
        />
      </svg>

      {/* Atmospheric Dawn Horizon Glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-gradient-to-b from-[#f97316]/20 via-[#fbbf24]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 xs:px-6 sm:px-12 lg:px-16 w-full flex-1 flex flex-col justify-between py-10 sm:py-12">
        {/* Top Story Anchor */}
        <div className="max-w-4xl space-y-4 sm:space-y-5">
          <div className="flex items-center gap-3 text-[10px] xs:text-xs font-mono uppercase tracking-[0.25em] sm:tracking-[0.3em] text-amber-400">
            <span>05 // THE SUMMIT TRAILHEAD</span>
            <span className="w-8 h-[1px] bg-amber-400/60" />
            <span>REAL-WORLD DEPARTURE</span>
          </div>

          <h2 className="font-editorial text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tight leading-[0.88] text-balance">
            Your life happens<br />
            past the glass.
          </h2>

          <p className="text-sm xs:text-base sm:text-xl text-stone-200 font-body max-w-2xl leading-relaxed pt-1 sm:pt-2">
            The computer was built to be a tool, not your habitat. Step past your front door right now.
          </p>

          {/* Primary Action Button */}
          <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => {
                audioSynth.playChime('start');
                onStartExplore();
              }}
              className="group w-full sm:w-auto min-h-[52px] sm:min-h-[56px] px-6 sm:px-10 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_12px_32px_rgba(249,115,22,0.4)] active:scale-[0.98] cursor-pointer"
            >
              <span>BUILD PERSONALIZED EXPEDITION</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Trailhead Routes Etched Into the Landscape (NO CARDS!) */}
        <div className="pt-16 pb-6">
          <div className="border-b border-white/10 pb-3 mb-8 flex items-center justify-between text-xs font-mono tracking-widest uppercase text-stone-400">
            <span>OR STEP INTO AN IMMEDIATE EXPEDITION BLUEPRINT</span>
            <span className="text-amber-400">ZERO PREPARATION</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {CURATED_EXPEDITIONS.map((exp, index) => (
              <div
                key={exp.id}
                onClick={() => {
                  audioSynth.playChime('start');
                  onLaunchCurated(exp);
                }}
                className="group cursor-pointer space-y-3 transition-transform hover:-translate-y-1"
              >
                {/* Asymmetric Trailhead Marker */}
                <div className="flex items-center gap-2 text-xs font-mono text-amber-300 tracking-wider">
                  <span className="text-stone-500">ROUTE 0{index + 1} //</span>
                  <span>{exp.targetMinutes} MIN</span>
                  <span className="text-stone-600">·</span>
                  <span className="capitalize">{exp.biome.replace('_', ' ')}</span>
                </div>

                {/* Editorial Title */}
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {exp.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-body">
                  {exp.subtitle}
                </p>

                {/* Direct Action Link */}
                <div className="pt-2 flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-amber-400 group-hover:text-amber-300">
                  <span className="underline underline-offset-4 decoration-amber-400/40">
                    Step outside on this route
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Horizon Line */}
        <div className="border-t border-stone-800/80 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 text-[10px] xs:text-xs font-mono text-stone-400 tracking-wider xs:tracking-widest uppercase">
          <span>05 // THE OUTDOOR THRESHOLD</span>
          <span>TRAILMIND AI · SCREEN TIME UNDER 90 SECONDS</span>
        </div>
      </div>
    </section>
  );
};
