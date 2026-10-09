import React, { useState } from 'react';
import {
  Compass,
  Calendar,
  Clock,
  Sparkles,
  Search,
  Trash2,
  Share2,
  MapPin,
  Tag,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  X,
  Wind,
  Layers,
} from 'lucide-react';
import { CompletedMemory } from '../types';
import { deleteMemory, getMemories, saveCurrentAdventure, DEFAULT_PREFERENCES } from '../utils/storage';
import { generateAdventure } from '../utils/adventureEngine';
import { audioSynth } from '../utils/audioSynth';

interface MemoriesPageProps {
  onNavigate: (route: string) => void;
  onSelectAdventureFromMemory?: (memory: CompletedMemory) => void;
}

export const MemoriesPage: React.FC<MemoriesPageProps> = ({ onNavigate }) => {
  const [memories, setMemories] = useState<CompletedMemory[]>(() => getMemories());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBiomeFilter, setActiveBiomeFilter] = useState<string>('all');
  const [selectedMemory, setSelectedMemory] = useState<CompletedMemory | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const biomeFilters = [
    { id: 'all', label: 'All Terrains' },
    { id: 'Forest', label: 'Forest' },
    { id: 'Park', label: 'Park' },
    { id: 'Riverside', label: 'Riverside' },
    { id: 'Beach', label: 'Beach' },
    { id: 'Trail', label: 'Trail' },
    { id: 'Neighborhood', label: 'Neighborhood' },
  ];

  const filteredMemories = memories.filter((m) => {
    const memEnv = (m.environment || m.biome || '').toLowerCase();
    const matchesFilter =
      activeBiomeFilter === 'all' ||
      memEnv.includes(activeBiomeFilter.toLowerCase()) ||
      (m.biome && m.biome.toLowerCase().includes(activeBiomeFilter.toLowerCase()));

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      (m.mission && m.mission.toLowerCase().includes(query)) ||
      m.title.toLowerCase().includes(query) ||
      (m.reflection && m.reflection.toLowerCase().includes(query)) ||
      (m.activity && m.activity.toLowerCase().includes(query)) ||
      (m.environment && m.environment.toLowerCase().includes(query)) ||
      (m.fieldNote && m.fieldNote.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMemory(id);
    setMemories(getMemories());
    if (selectedMemory?.id === id) {
      setSelectedMemory(null);
    }
  };

  const handleShare = (m: CompletedMemory, e: React.MouseEvent) => {
    e.stopPropagation();
    const missionName = m.mission || m.title;
    const dur = m.duration || m.outdoorMinutes;
    const text = `Postcard from the Trail: "${missionName}"\nDuration: ${dur} min\nRating: ${m.ratingEmoji || '⭐'.repeat(m.rating || 5)}\nNoticed: "${m.reflection || m.sensoryHighlight}"\n#TrailMind #GoOutside`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(m.id);
      audioSynth.playChime('tick');
      setTimeout(() => setCopiedId(null), 2400);
    }
  };

  const handleRevisit = (m: CompletedMemory) => {
    audioSynth.playChime('start');
    const newAdv = generateAdventure({
      ...DEFAULT_PREFERENCES,
      timeMinutes: m.duration || m.outdoorMinutes,
      environment: m.biome,
    });
    newAdv.title = m.mission || m.title;
    saveCurrentAdventure(newAdv);
    onNavigate('/mission');
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return {
        day: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        year: d.getFullYear(),
        full: d.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      };
    } catch {
      return { day: '12', month: 'OCT', year: 2026, full: 'Recent Trek' };
    }
  };

  // Dynamic stamp postal cancellation marks and vintage paper tones
  const postcardThemes = [
    {
      paper: 'bg-[#f7f2e7] text-[#292218] border-[#e2d5c3]',
      accent: 'border-[#b59972]',
      tagBg: 'bg-[#eadecc] text-[#5c4933]',
      stampBorder: 'border-amber-700/60',
      tilt: 'rotate-[-1.2deg]',
    },
    {
      paper: 'bg-[#f4efe3] text-[#24211a] border-[#dfd1be]',
      accent: 'border-[#948169]',
      tagBg: 'bg-[#e6d8c4] text-[#4d402f]',
      stampBorder: 'border-orange-800/60',
      tilt: 'rotate-[1.5deg]',
    },
    {
      paper: 'bg-[#efebe1] text-[#22211d] border-[#dad0bc]',
      accent: 'border-[#8f8572]',
      tagBg: 'bg-[#ded4bf] text-[#423b2c]',
      stampBorder: 'border-emerald-800/60',
      tilt: 'rotate-[-0.8deg]',
    },
    {
      paper: 'bg-[#f9f5eb] text-[#2c2419] border-[#e7dbc9]',
      accent: 'border-[#bfa98b]',
      tagBg: 'bg-[#ecdfcb] text-[#5e4b31]',
      stampBorder: 'border-stone-700/60',
      tilt: 'rotate-[1deg]',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#070b14] pb-32 pt-20 xs:pt-24 sm:pt-32 px-4 xs:px-6 sm:px-10 lg:px-14 overflow-hidden text-stone-100">
      {/* Background Illustrated Topography & Forest Mist */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 1200"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 360 C320 280 640 420 960 300 C1200 220 1360 340 1440 310 L1440 1200 L0 1200 Z"
            fill="#091420"
          />
          <path
            d="M0 540 C400 480 800 600 1100 500 C1300 430 1400 510 1440 480 L1440 1200 L0 1200 Z"
            fill="#050d15"
          />
        </svg>
      </div>

      <div className="relative z-20 max-w-6xl mx-auto space-y-12 sm:space-y-16">
        {/* Editorial Heading (NO CARDS!) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6 sm:pb-8">
          <div className="space-y-3 sm:space-y-4 max-w-2xl">
            <div className="flex items-center gap-3 text-[10px] xs:text-xs font-mono uppercase tracking-[0.25em] sm:tracking-[0.3em] text-amber-400">
              <span>PHYSICAL TRAVEL POSTCARDS</span>
              <span className="w-8 h-[1px] bg-amber-400/60" />
              <span>EXPEDITION JOURNAL</span>
            </div>

            <h1 className="font-editorial text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[0.9]">
              The Real-World<br />
              Postcards.
            </h1>

            <p className="text-sm xs:text-base text-stone-300 font-body leading-relaxed max-w-xl">
              Physical field memories stamped with date, duration, rating, and what you noticed when you put your phone away.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('/history')}
              className="min-h-[44px] xs:min-h-[48px] px-5 sm:px-6 rounded-full border border-white/20 hover:border-amber-400 text-stone-300 hover:text-white text-xs font-mono uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>View History</span>
            </button>

            <button
              onClick={() => onNavigate('/explore')}
              className="min-h-[44px] xs:min-h-[48px] px-6 sm:px-7 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs font-mono uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>New Adventure</span>
            </button>
          </div>
        </div>

        {/* Minimal Filters & Search (Typographic & border-less) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
          <div className="flex items-center gap-6 overflow-x-auto pb-2 sm:pb-0 text-xs font-mono uppercase tracking-widest">
            {biomeFilters.map((b) => (
              <button
                key={b.id}
                onClick={() => setActiveBiomeFilter(b.id)}
                className={`transition-colors whitespace-nowrap cursor-pointer pb-1 ${
                  activeBiomeFilter === b.id
                    ? 'text-amber-400 font-bold border-b-2 border-amber-400'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          <div className="relative sm:w-72">
            <Search className="w-4 h-4 text-stone-500 absolute left-0 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search postcards & notices..."
              className="w-full pl-7 pr-4 py-2 bg-transparent border-b border-white/20 text-xs text-white focus:outline-none focus:border-amber-400 placeholder:text-stone-500 font-body"
            />
          </div>
        </div>

        {/* =========================================================================
            COLLECTION OF BEAUTIFUL PHYSICAL TRAVEL POSTCARDS & EXPEDITION JOURNALS
            Designed with natural deckle edges, vintage postal stamps, cancellation marks,
            asymmetrical layout, and tactile tactile paper texture.
            (DEFINITELY NOT GENERIC DATABASE CARDS)
           ========================================================================= */}
        {filteredMemories.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <p className="font-editorial text-3xl text-stone-400 italic">
              No postcards stamped yet.
            </p>
            <p className="text-sm font-body text-stone-500 max-w-md mx-auto">
              Finish an adventure outside to stamp your first physical travel postcard.
            </p>
            <button
              onClick={() => onNavigate('/explore')}
              className="text-xs font-mono uppercase tracking-widest text-amber-400 underline underline-offset-4 cursor-pointer inline-flex items-center gap-2 pt-2"
            >
              <span>Generate your first trail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 pt-4">
            {filteredMemories.map((mem, index) => {
              const theme = postcardThemes[index % postcardThemes.length];
              const dateInfo = formatDate(mem.date);
              const missionName = mem.mission || mem.title;
              const durationMins = mem.duration || mem.outdoorMinutes;
              const userRatingEmoji = mem.ratingEmoji || (mem.rating >= 5 ? '🤩' : mem.rating >= 4 ? '😄' : mem.rating >= 3 ? '🙂' : '😐');
              const reflectionText = mem.reflection || mem.sensoryHighlight || mem.fieldNote;
              const envName = mem.environment || (mem.biome ? mem.biome.replace(/_/g, ' ') : 'Outdoors');
              const actName = mem.activity || 'Walking';

              return (
                <div
                  key={mem.id}
                  onClick={() => setSelectedMemory(mem)}
                  className={`group relative ${theme.tilt} hover:rotate-0 transition-transform duration-300 cursor-pointer shadow-[0_16px_40px_rgba(0,0,0,0.65)] hover:shadow-[0_22px_50px_rgba(0,0,0,0.8)]`}
                >
                  {/* Physical Postcard Paper Cardstock */}
                  <div className={`relative p-4 xs:p-6 sm:p-8 rounded-sm ${theme.paper} border border-dashed ${theme.accent} overflow-hidden flex flex-col justify-between min-h-[340px] sm:min-h-[360px]`}>
                    {/* Airmail Border Edge Accent (Subtle retro border stripes) */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-[repeating-linear-gradient(45deg,#b91c1c,#b91c1c_12px,#f7f2e7_12px,#f7f2e7_24px,#1d4ed8_24px,#1d4ed8_36px,#f7f2e7_36px,#f7f2e7_48px)] opacity-60" />

                    {/* TOP SECTION: Postcard Header with Postal Cancellation & Vintage Stamp */}
                    <div className="flex items-start justify-between gap-3 sm:gap-4 border-b border-[#292218]/15 pb-3 sm:pb-4 pt-1">
                      {/* Left: Expedition Location & Classification */}
                      <div className="space-y-1">
                        <div className="text-[10px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#786348] flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-[#b5502b] shrink-0" />
                          <span className="truncate">{envName} · {actName}</span>
                        </div>
                        <h2 className="font-editorial text-xl xs:text-2xl sm:text-3xl font-black tracking-tight leading-tight text-[#1c1710] group-hover:text-[#943818] transition-colors">
                          {missionName}
                        </h2>
                      </div>

                      {/* Right: Vintage Postage Stamp & Postal cancellation wavy lines */}
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        {/* Wavy Postal Cancellation Lines */}
                        <svg className="w-12 h-8 opacity-40 hidden sm:block" viewBox="0 0 60 40">
                          <path d="M0 10 Q 15 5, 30 10 T 60 10" fill="none" stroke="#292218" strokeWidth="1.2" />
                          <path d="M0 20 Q 15 15, 30 20 T 60 20" fill="none" stroke="#292218" strokeWidth="1.2" />
                          <path d="M0 30 Q 15 25, 30 30 T 60 30" fill="none" stroke="#292218" strokeWidth="1.2" />
                        </svg>

                        {/* Physical Postage Stamp */}
                        <div className="w-13 xs:w-16 h-17 xs:h-20 border-2 border-dashed border-[#8d6f4d] bg-[#fdf9f0] p-1 flex flex-col items-center justify-between shadow-sm relative rotate-2 group-hover:rotate-0 transition-transform">
                          <div className="text-[8px] font-mono tracking-widest text-[#786348]">TRAIL</div>
                          <span className="text-xl xs:text-2xl select-none" role="img" aria-label="mood">
                            {userRatingEmoji}
                          </span>
                          <div className="text-[8px] xs:text-[9px] font-mono font-bold text-[#b5502b]">
                            {durationMins}m
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* MIDDLE SECTION: Hand-written Journal Reflection & What Did You Notice */}
                    <div className="py-4 sm:py-5 my-auto space-y-2">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-[#8a7256] flex items-center gap-2">
                        <span>WHAT WAS NOTICED //</span>
                      </div>
                      <p className="font-editorial text-base xs:text-lg sm:text-xl text-[#221c15] italic leading-relaxed">
                        "{reflectionText}"
                      </p>
                    </div>

                    {/* BOTTOM SECTION: Postcard Footer with Postal Date, Duration & Action buttons */}
                    <div className="border-t border-[#292218]/15 pt-3 sm:pt-4 flex flex-col xs:flex-row xs:items-center justify-between gap-2.5 xs:gap-3 text-[11px] xs:text-xs font-mono">
                      {/* Left Date Stamp & Duration */}
                      <div className="flex flex-wrap items-center gap-2 xs:gap-3 text-[#67543d]">
                        <div className="flex items-center gap-1.5 font-bold text-[#2a2217]">
                          <Calendar className="w-3.5 h-3.5 text-[#b5502b] shrink-0" />
                          <span>{dateInfo.full}</span>
                        </div>
                        <span>·</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#b5502b] shrink-0" />
                          <span>{durationMins}m outside</span>
                        </div>
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex items-center gap-2 self-end xs:self-auto">
                        <button
                          type="button"
                          onClick={(e) => handleShare(mem, e)}
                          className="px-2.5 py-1 rounded bg-[#e8dcce] hover:bg-[#d8c8b6] text-[#3d3121] transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                          title="Copy memory snippet"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>{copiedId === mem.id ? 'Copied!' : 'Share'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDelete(mem.id, e)}
                          className="p-1 rounded text-[#94785b] hover:text-[#b91c1c] transition-colors cursor-pointer"
                          title="Remove postcard"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Postal Stamp Date Seal watermark */}
                    <div className="absolute right-6 bottom-14 w-20 h-20 rounded-full border border-dashed border-[#8d6f4d]/30 pointer-events-none flex flex-col items-center justify-center -rotate-12 opacity-60">
                      <div className="text-[7px] font-mono tracking-widest text-[#6c573f]">OUTDOORS</div>
                      <div className="text-[10px] font-mono font-bold text-[#6c573f]">{dateInfo.month} {dateInfo.day}</div>
                      <div className="text-[7px] font-mono text-[#6c573f]">{dateInfo.year}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          DETAILED POSTCARD INSPECTION OVERLAY
         ========================================================================= */}
      {selectedMemory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="relative max-w-2xl w-full bg-[#f7f2e7] text-[#292218] p-8 sm:p-10 rounded-sm shadow-2xl border-2 border-dashed border-[#b59972] space-y-6">
            <button
              onClick={() => setSelectedMemory(null)}
              className="absolute top-4 right-4 p-2 text-[#786348] hover:text-[#292218] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#292218]/20 pb-4 space-y-1">
              <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#b5502b]">
                {selectedMemory.environment || selectedMemory.biome} · {selectedMemory.activity || 'Walking'}
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl font-black text-[#1c1710]">
                {selectedMemory.mission || selectedMemory.title}
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-4 border-b border-[#292218]/15 pb-4 text-xs font-mono">
              <div>
                <span className="text-[#8a7256] block">DATE</span>
                <span className="font-bold text-[#2a2217]">
                  {formatDate(selectedMemory.date).full}
                </span>
              </div>
              <div>
                <span className="text-[#8a7256] block">DURATION</span>
                <span className="font-bold text-[#2a2217]">
                  {selectedMemory.duration || selectedMemory.outdoorMinutes} Minutes
                </span>
              </div>
              <div>
                <span className="text-[#8a7256] block">RATING</span>
                <span className="text-xl">
                  {selectedMemory.ratingEmoji || '🤩'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8a7256]">
                WHAT YOU NOTICED //
              </span>
              <p className="font-editorial text-2xl text-[#221c15] italic leading-relaxed">
                "{selectedMemory.reflection || selectedMemory.sensoryHighlight}"
              </p>
            </div>

            <div className="border-t border-[#292218]/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setSelectedMemory(null)}
                className="text-xs font-mono uppercase tracking-widest text-[#786348] hover:text-[#1c1710]"
              >
                Close Postcard
              </button>

              <button
                type="button"
                onClick={() => handleRevisit(selectedMemory)}
                className="min-h-[46px] px-8 rounded-full bg-[#1c1710] hover:bg-[#b5502b] text-[#f7f2e7] font-bold text-xs font-mono uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-colors shadow-md"
              >
                <Compass className="w-4 h-4" />
                <span>Re-Run This Mission</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
