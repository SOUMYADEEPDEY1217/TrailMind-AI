import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  RotateCcw,
  Search,
  Download,
  Bookmark,
  Sparkles,
  Compass,
} from 'lucide-react';
import { CompletedMemory } from '../types';
import { getMemories, saveCurrentAdventure, DEFAULT_PREFERENCES } from '../utils/storage';
import { generateAdventure } from '../utils/adventureEngine';
import { audioSynth } from '../utils/audioSynth';

interface HistoryPageProps {
  onNavigate: (route: string) => void;
  onReRunAdventure: (advTitle: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onNavigate,
  onReRunAdventure,
}) => {
  const [memories, setMemories] = useState<CompletedMemory[]>(() => getMemories());
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = memories.filter((m) => {
    const query = searchQuery.toLowerCase();
    const missionName = m.mission || m.title;
    const reflectionText = m.reflection || m.sensoryHighlight || m.fieldNote || '';
    const envName = m.environment || m.biome || '';
    const actName = m.activity || '';

    return (
      !searchQuery ||
      missionName.toLowerCase().includes(query) ||
      reflectionText.toLowerCase().includes(query) ||
      envName.toLowerCase().includes(query) ||
      actName.toLowerCase().includes(query)
    );
  });

  const handleReRun = (memory: CompletedMemory) => {
    audioSynth.playChime('start');
    const newAdv = generateAdventure({
      ...DEFAULT_PREFERENCES,
      timeMinutes: memory.duration || memory.outdoorMinutes,
      environment: memory.biome,
    });
    newAdv.title = memory.mission || memory.title;
    saveCurrentAdventure(newAdv);
    onReRunAdventure(newAdv.title);
    onNavigate('/mission');
  };

  const exportHistoryJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(memories, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `trailmind_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    audioSynth.playChime('tick');
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="relative min-h-screen bg-[#060c14] pb-28 pt-20 xs:pt-24 sm:pt-32 px-4 xs:px-6 sm:px-12 lg:px-16 overflow-hidden">
      {/* Background Topo */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        viewBox="0 0 1440 1200"
        preserveAspectRatio="none"
        fill="none"
      >
        <path d="M0 450 L380 320 L760 480 L1140 290 L1440 420 L1440 1200 L0 1200 Z" fill="#081822" />
      </svg>

      <div className="relative z-20 max-w-5xl mx-auto space-y-12 sm:space-y-16">
        {/* Editorial Heading (NO CARDS!) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6 sm:pb-8">
          <div className="space-y-3 sm:space-y-4 max-w-2xl">
            <div className="flex items-center gap-3 text-[10px] xs:text-xs font-mono uppercase tracking-[0.25em] sm:tracking-[0.3em] text-amber-400">
              <span>EXPEDITION CHRONOLOGY</span>
              <span className="w-8 h-[1px] bg-amber-400/60" />
              <span>PAST LOGS</span>
            </div>

            <h1 className="font-editorial text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[0.9]">
              The Chronological<br />
              Trail Archive.
            </h1>

            <p className="text-sm xs:text-base text-stone-300 font-body leading-relaxed">
              Every completed adventure, logged duration, and recorded observation. Re-run any past trail or browse your physical postcards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('/memories')}
              className="min-h-[44px] xs:min-h-[46px] px-5 sm:px-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs font-mono uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-all shadow-md"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>View Postcards</span>
            </button>

            <button
              onClick={exportHistoryJSON}
              className="min-h-[44px] xs:min-h-[46px] px-5 sm:px-6 rounded-full border border-white/20 hover:border-amber-400 text-stone-300 hover:text-white text-xs font-mono uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Minimal Search Line */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-stone-500 absolute left-0 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past routes, biomes, or memories..."
            className="w-full pl-7 pr-4 py-2 bg-transparent border-b border-white/20 text-xs text-white focus:outline-none focus:border-amber-400 placeholder:text-stone-500 font-body"
          />
        </div>

        {/* Unboxed Chronological Expedition Logs (NO RECTANGULAR CARDS!) */}
        <div className="space-y-12">
          {filtered.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="font-editorial text-2xl text-stone-400 italic">
                No past missions found.
              </p>
              <button
                onClick={() => onNavigate('/explore')}
                className="text-xs font-mono uppercase tracking-widest text-amber-400 underline underline-offset-4 cursor-pointer"
              >
                Start an adventure today →
              </button>
            </div>
          ) : (
            filtered.map((item, index) => {
              const missionName = item.mission || item.title;
              const durationMins = item.duration || item.outdoorMinutes;
              const reflectionText = item.reflection || item.sensoryHighlight || item.fieldNote;
              const envName = item.environment || (item.biome ? item.biome.replace(/_/g, ' ') : 'Outdoors');
              const actName = item.activity || 'Walking';
              const ratingDisplay = item.ratingEmoji || (item.rating >= 5 ? '🤩' : item.rating >= 4 ? '😄' : item.rating >= 3 ? '🙂' : '😐');

              return (
                <div
                  key={item.id}
                  className="border-b border-white/10 pb-8 sm:pb-10 flex flex-col md:flex-row md:items-start justify-between gap-5 sm:gap-8 group"
                >
                  <div className="space-y-2.5 sm:space-y-3 max-w-2xl">
                    <div className="flex items-center gap-2 xs:gap-3 text-[11px] xs:text-xs font-mono text-stone-400 flex-wrap">
                      <span className="text-amber-400 font-bold">ROUTE 0{index + 1} //</span>
                      <span>{formatDate(item.date)}</span>
                      <span>·</span>
                      <span className="uppercase text-stone-300">{envName}</span>
                      <span>·</span>
                      <span className="text-stone-400">{actName}</span>
                      <span>·</span>
                      <span className="text-white font-bold">{durationMins} MIN</span>
                      <span>·</span>
                      <span className="text-base select-none">{ratingDisplay}</span>
                    </div>

                    <h3 className="font-editorial text-2xl xs:text-3xl sm:text-4xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      {missionName}
                    </h3>

                    {reflectionText && (
                      <p className="font-editorial text-lg xs:text-xl text-amber-100/90 italic leading-snug">
                        "{reflectionText}"
                      </p>
                    )}

                    <div className="text-[11px] xs:text-xs font-mono text-stone-500 flex flex-wrap items-center gap-2 xs:gap-4 pt-1">
                      <span>~{item.estimatedSteps} steps</span>
                      <span>·</span>
                      <span>{item.waypointsCompleted} checkpoints cleared</span>
                      {item.moodAfter && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-400">{item.moodAfter}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleReRun(item)}
                    className="self-start md:self-center shrink-0 min-h-[44px] xs:min-h-[46px] px-6 sm:px-7 rounded-full bg-white/5 hover:bg-amber-400 hover:text-stone-950 border border-white/20 hover:border-amber-400 text-stone-300 text-xs font-mono uppercase tracking-widest font-semibold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-Run Trail</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
