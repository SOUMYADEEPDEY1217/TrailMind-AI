import React, { useState } from 'react';
import { Volume2, Sparkles, Footprints, Wind } from 'lucide-react';
import { audioSynth } from '../../utils/audioSynth';

export const ForestScene: React.FC = () => {
  const [activeSensory, setActiveSensory] = useState<'cedar' | 'canopy' | 'ferns'>('canopy');

  const handleSound = () => {
    audioSynth.playChime('waypoint');
    audioSynth.startAmbient('forest');
  };

  return (
    <section
      id="story-forest"
      className="relative w-full min-h-[110vh] overflow-hidden bg-[#06140d] flex flex-col justify-between py-20 select-none"
    >
      {/* ========================================================
          FULL BLEED ILLUSTRATED FOREST ENVIRONMENT (NO BOXES)
         ======================================================== */}
      {/* Slicing Golden Sunbeams through Canopy */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute -top-32 left-[12%] w-60 h-[140%] bg-gradient-to-b from-[#fde68a]/30 via-[#86efac]/10 to-transparent transform -rotate-[14deg] blur-2xl anim-pulse-atmosphere" />
        <div
          className="absolute -top-32 left-[48%] w-80 h-[140%] bg-gradient-to-b from-[#fed7aa]/25 via-[#6ee7b7]/10 to-transparent transform -rotate-[18deg] blur-3xl anim-pulse-atmosphere"
          style={{ animationDelay: '4s' }}
        />
        <div
          className="absolute -top-32 left-[78%] w-64 h-[140%] bg-gradient-to-b from-[#fef08a]/20 via-[#34d399]/10 to-transparent transform -rotate-[12deg] blur-2xl anim-pulse-atmosphere"
          style={{ animationDelay: '7s' }}
        />
      </div>

      {/* Full-width Colossal Redwoods and Pines Silhouette Layer */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 1000"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Distant Misty Pine Trees */}
        <g fill="#0b2418" opacity="0.6">
          <path d="M120 0 L150 0 L160 1000 L110 1000 Z" />
          <path d="M280 0 L310 0 L318 1000 L275 1000 Z" />
          <path d="M620 0 L660 0 L670 1000 L610 1000 Z" />
          <path d="M840 0 L870 0 L880 1000 L830 1000 Z" />
          <path d="M1120 0 L1160 0 L1170 1000 L1110 1000 Z" />
          <path d="M1340 0 L1370 0 L1380 1000 L1330 1000 Z" />
        </g>

        {/* Massive Midground Redwood Trunks with Ancient Branching */}
        <g fill="#040f09">
          {/* Giant Trunk Left */}
          <path d="M-40 0 L90 0 L120 1000 L-60 1000 Z" />
          <path d="M90 320 Q160 290 220 270 Q160 330 95 360 Z" />
          {/* Giant Trunk Center-Right */}
          <path d="M740 0 L840 0 L860 1000 L720 1000 Z" />
          <path d="M740 400 Q660 360 580 340 Q660 410 735 440 Z" />
          <path d="M840 280 Q930 240 1020 230 Q920 290 845 320 Z" />
          {/* Giant Trunk Right Edge */}
          <path d="M1360 0 L1480 0 L1500 1000 L1340 1000 Z" />
        </g>

        {/* Forest Floor Carpet: Rolling Moss Mounds & Deep Roots */}
        <path
          d="M0 860 Q240 810 500 840 Q760 880 1020 830 Q1280 810 1440 850 L1440 1000 L0 1000 Z"
          fill="#020805"
        />
        <path
          d="M0 910 Q320 870 680 900 Q1040 930 1440 890 L1440 1000 L0 1000 Z"
          fill="#010402"
        />

        {/* Dense Fern Fronds Carpet in Foreground */}
        <g fill="#072214">
          <path d="M40 950 Q90 830 180 810 Q140 890 60 950 Z" />
          <path d="M120 960 Q200 840 310 820 Q240 900 150 960 Z" />
          <path d="M480 970 Q560 860 670 850 Q590 920 510 970 Z" />
          <path d="M920 950 Q990 840 1100 830 Q1030 900 950 950 Z" />
          <path d="M1240 960 Q1310 850 1420 840 Q1350 910 1270 960 Z" />
        </g>
      </svg>

      {/* Floating Glowing Forest Spores, Fireflies, and Subtle Drifting Leaves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle Floating Leaves */}
        <div className="absolute top-[35%] left-[25%] anim-drift-leaf-1 pointer-events-none">
          <svg width="20" height="13" viewBox="0 0 20 13" fill="none">
            <path
              d="M0 6.5 C5 0.5, 15 0.5, 20 6.5 C15 12.5, 5 12.5, 0 6.5 Z"
              fill="#84cc16"
              fillOpacity="0.75"
            />
            <line x1="2" y1="6.5" x2="18" y2="6.5" stroke="#4d7c0f" strokeWidth="0.8" />
          </svg>
        </div>
        <div className="absolute top-[50%] right-[30%] anim-drift-leaf-2 pointer-events-none">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
            <path
              d="M0 6 C4 1, 14 1, 18 6 C14 11, 4 11, 0 6 Z"
              fill="#eab308"
              fillOpacity="0.7"
            />
            <line x1="1" y1="6" x2="16" y2="6" stroke="#ca8a04" strokeWidth="0.7" />
          </svg>
        </div>

        {/* Spores & Fireflies */}
        <div className="absolute top-[30%] left-[22%] w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_#6ee7b7] anim-firefly-1" />
        <div className="absolute top-[55%] left-[58%] w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_10px_#fde047] anim-firefly-2" />
        <div className="absolute top-[75%] left-[35%] w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fcd34d] anim-firefly-3" />
        <div className="absolute top-[40%] left-[82%] w-1 h-1 rounded-full bg-emerald-200 anim-firefly-1" />
      </div>

      {/* ========================================================
          ASYMMETRICAL ENVIRONMENTAL STORYTELLING (NO CARDS)
         ======================================================== */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 xs:px-6 sm:px-12 lg:px-16 w-full flex-1 flex flex-col justify-between py-10 sm:py-12">
        {/* Top Story Anchor: Asymmetrical left placement */}
        <div className="max-w-3xl space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3 text-[10px] xs:text-xs font-mono uppercase tracking-[0.25em] sm:tracking-[0.3em] text-emerald-400">
            <span>CHAPTER 02</span>
            <span className="w-8 h-[1px] bg-emerald-500/60" />
            <span>THE CANOPY SANCTUARY</span>
          </div>

          <h2 className="font-editorial text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-[0.88] text-balance">
            Leave civilization<br />
            at the tree line.
          </h2>
        </div>

        {/* Middle Environmental Spread: Information etched right into the scenery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end my-12">
          {/* Column 1: Editorial Thought */}
          <div className="lg:col-span-5 space-y-6">
            <p className="font-editorial text-2xl sm:text-3xl text-emerald-100/90 italic leading-snug">
              "When you look up through 200 feet of needle crowns, your eyes abandon the 15-inch focal plane of glass."
            </p>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-body max-w-md">
              Forest trees emit phytoncides that measurably drop human cortisol within 15 minutes. No notification, email, or digital deadline survives the stillness of damp moss and towering redwoods.
            </p>

            <button
              onClick={handleSound}
              className="inline-flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-amber-300 hover:text-amber-200 transition-colors pt-2 group cursor-pointer"
            >
              <span className="w-8 h-8 rounded-full border border-amber-400/40 flex items-center justify-center group-hover:scale-110 transition-transform bg-black/40">
                <Volume2 className="w-4 h-4 text-amber-400" />
              </span>
              <span className="underline underline-offset-4 decoration-amber-400/40">
                Immerse in live canopy audio
              </span>
            </button>
          </div>

          {/* Column 2: Interactive Nature Nodes (Integrated into trees, NOT a card!) */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row gap-6 sm:gap-10 lg:pl-10">
            {/* Environmental Node 1 */}
            <div
              onClick={() => setActiveSensory('canopy')}
              className={`cursor-pointer transition-all duration-300 border-l-2 pl-4 py-2 ${
                activeSensory === 'canopy'
                  ? 'border-amber-400 text-white'
                  : 'border-emerald-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <div className="font-mono text-xs text-amber-400/90 tracking-widest uppercase mb-1">
                FOCAL SHIFT 01
              </div>
              <div className="font-editorial text-xl font-bold text-white mb-1">
                Infinite Zenith
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Tilt your head completely back. Watch the tree crowns sway in opposing micro-drafts against the sky.
              </p>
            </div>

            {/* Environmental Node 2 */}
            <div
              onClick={() => setActiveSensory('cedar')}
              className={`cursor-pointer transition-all duration-300 border-l-2 pl-4 py-2 ${
                activeSensory === 'cedar'
                  ? 'border-amber-400 text-white'
                  : 'border-emerald-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <div className="font-mono text-xs text-amber-400/90 tracking-widest uppercase mb-1">
                TACTILE GROUNDING 02
              </div>
              <div className="font-editorial text-xl font-bold text-white mb-1">
                Bark & Cold Moss
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Place your bare palm flat against a wet cedar trunk. Notice the temperature delta against your skin.
              </p>
            </div>

            {/* Environmental Node 3 */}
            <div
              onClick={() => setActiveSensory('ferns')}
              className={`cursor-pointer transition-all duration-300 border-l-2 pl-4 py-2 ${
                activeSensory === 'ferns'
                  ? 'border-amber-400 text-white'
                  : 'border-emerald-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <div className="font-mono text-xs text-amber-400/90 tracking-widest uppercase mb-1">
                OLFACTORY PULSE 03
              </div>
              <div className="font-editorial text-xl font-bold text-white mb-1">
                Petrichor & Loam
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Crouch and breathe deeply near fallen needles. Decaying wood produces negative ions that awaken bloodflow.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Horizon Line marker */}
        <div className="border-t border-emerald-900/60 pt-6 flex items-center justify-between text-xs font-mono text-emerald-400/70 tracking-widest uppercase">
          <span>02 // CANOPY FLOOR LEVEL</span>
          <span className="hidden sm:inline">TRAILMIND ENVIRONMENTAL STORYTELLING</span>
          <span>DESCENDING TO RIVER RUN →</span>
        </div>
      </div>
    </section>
  );
};
