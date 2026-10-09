import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Clock,
  Battery,
  MapPin,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Circle,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Footprints,
} from 'lucide-react';
import { Adventure } from '../types';
import { audioSynth } from '../utils/audioSynth';
import { getSettings, saveCurrentAdventure, startAdventure } from '../utils/storage';

interface MissionPageProps {
  adventure: Adventure | null;
  onNavigate: (route: string) => void;
  onStartAdventure: () => void;
}

export const MissionPage: React.FC<MissionPageProps> = ({
  adventure,
  onNavigate,
  onStartAdventure,
}) => {
  const [checkedGear, setCheckedGear] = useState<Record<string, boolean>>({});
  const [isAudioPreviewing, setIsAudioPreviewing] = useState(false);
  const settings = getSettings();

  if (!adventure) {
    return (
      <div className="min-h-screen bg-[#060c14] flex items-center justify-center p-6 text-center pt-24">
        <div className="max-w-md space-y-4">
          <h2 className="text-3xl font-editorial font-bold text-white">
            No Mission Staged Yet
          </h2>
          <p className="text-sm text-stone-400 font-body">
            Calibrate your available time and terrain to assemble an expedition.
          </p>
          <button
            onClick={() => onNavigate('/explore')}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2"
          >
            <span>Calibrate Expedition</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const toggleGear = (item: string) => {
    setCheckedGear((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
    audioSynth.playChime('tick');
  };

  const handleTestAudioPrompt = () => {
    if (isAudioPreviewing) {
      audioSynth.stopSpeaking();
      setIsAudioPreviewing(false);
    } else {
      setIsAudioPreviewing(true);
      audioSynth.speakPrompt(adventure.audioBriefing, settings.speechRate, settings.speechPitch);
      setTimeout(() => {
        setIsAudioPreviewing(false);
      }, 7000);
    }
  };

  const handleLaunch = () => {
    audioSynth.playChime('start');
    if (settings.audioVoiceEnabled) {
      audioSynth.speakPrompt(adventure.audioBriefing, settings.speechRate, settings.speechPitch);
    }
    // Launch active adventure via storage service
    startAdventure(adventure, (adventure.targetMinutes || 20) * 60);
    onStartAdventure();
    onNavigate('/adventure');
  };

  return (
    <div className="relative min-h-screen bg-[#060c14] pb-28 pt-20 xs:pt-24 sm:pt-32 px-4 xs:px-6 sm:px-12 lg:px-16 overflow-hidden">
      {/* Background Illustrated Terrain Topo Texture */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        viewBox="0 0 1440 1200"
        preserveAspectRatio="none"
        fill="none"
      >
        <path d="M0 320 Q360 220 720 300 Q1080 380 1440 280 L1440 1200 L0 1200 Z" fill="#081820" />
        <path d="M0 640 Q400 520 800 620 Q1200 720 1440 580 L1440 1200 L0 1200 Z" fill="#040e14" />
      </svg>

      <div className="relative z-20 max-w-5xl mx-auto space-y-12 sm:space-y-16">
        {/* Top Breadcrumb & Return */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 xs:gap-3 text-[10px] xs:text-xs font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] text-amber-400">
            <span>EXPEDITION BRIEFING</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="truncate max-w-[120px] xs:max-w-none">{adventure.classification}</span>
          </div>
          <button
            onClick={() => onNavigate('/explore')}
            className="text-[11px] xs:text-xs font-mono uppercase tracking-widest text-stone-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-dial</span>
          </button>
        </div>

        {/* AI Provider Origin Banner */}
        {adventure.isOffline || adventure.provider === 'OFFLINE' ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 xs:p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30 backdrop-blur-sm shadow-[0_8px_32px_rgba(245,158,11,0.15)]">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              </div>
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300 font-bold">
                  ● OFFLINE ADVENTURE
                </div>
                <div className="text-stone-300 text-sm font-body mt-0.5">
                  TrailMind found a mission without the cloud.
                </div>
              </div>
            </div>
            <div className="text-stone-400 text-xs font-mono tracking-wider sm:text-right pl-12 sm:pl-0">
              Generated by TrailMind Engine · Zero cloud connection required
            </div>
          </div>
        ) : adventure.provider === 'LOCAL' ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 xs:p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 backdrop-blur-sm shadow-[0_8px_32px_rgba(6,182,212,0.15)]">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300 font-bold">
                  ● LOCAL AI EXPEDITION
                </div>
                <div className="text-stone-300 text-sm font-body mt-0.5">
                  Synthesized locally on your hardware via Llama 3.2 (Ollama).
                </div>
              </div>
            </div>
            <div className="text-stone-400 text-xs font-mono tracking-wider sm:text-right pl-12 sm:pl-0">
              100% On-Device · Zero telemetry or external transmission
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 xs:p-5 rounded-2xl bg-violet-950/30 border border-violet-500/30 backdrop-blur-sm shadow-[0_8px_32px_rgba(139,92,246,0.15)]">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-violet-500/20 border border-violet-400/40 flex items-center justify-center shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse" />
              </div>
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-violet-300 font-bold">
                  ● CLOUD AI EXPEDITION
                </div>
                <div className="text-stone-300 text-sm font-body mt-0.5">
                  Crafted with Gemini cloud intelligence.
                </div>
              </div>
            </div>
            <div className="text-stone-400 text-xs font-mono tracking-wider sm:text-right pl-12 sm:pl-0">
              Gemini 3.8 Flash · High-precision cognitive adaptation
            </div>
          </div>
        )}

        {/* Hero Mission Title & Philosophy (NO CARDS!) */}
        <div className="space-y-4 sm:space-y-6 max-w-3xl">
          <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-[11px] sm:text-xs font-mono tracking-widest uppercase text-stone-400">
            <span>DIFFICULTY: {adventure.difficulty.toUpperCase()}</span>
            <span>·</span>
            <span>DURATION: {adventure.targetMinutes} MINUTES</span>
            {adventure.estimatedDistance && (
              <>
                <span>·</span>
                <span className="text-amber-400 font-bold">EST. DISTANCE: {adventure.estimatedDistance}</span>
              </>
            )}
            <span>·</span>
            <span className="text-stone-300">{adventure.biome.toUpperCase()}</span>
          </div>

          <h1 className="font-editorial text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[0.9]">
            {adventure.title}
          </h1>

          <p className="font-editorial text-xl xs:text-2xl sm:text-3xl text-amber-100/90 italic leading-snug">
            "{adventure.subtitle}"
          </p>

          {/* The Screen-Off Covenant Etched in Text */}
          <div className="border-l-2 border-amber-400 pl-4 py-1 space-y-1">
            <div className="text-xs font-mono uppercase tracking-widest text-amber-400">
              THE SCREEN-OFF COVENANT
            </div>
            <p className="text-sm text-stone-300 font-body leading-relaxed">
              {adventure.screenOffPromise}
            </p>
          </div>
        </div>

        {/* Primary Sensory Artifact & Voice Guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-b border-white/10 py-10">
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>PRIMARY SENSORY ARTIFACT</span>
            </div>
            <p className="font-editorial text-xl sm:text-2xl font-bold text-white leading-relaxed">
              {adventure.primarySensoryArtifact}
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <span>THE TRAIL GUIDE VOICE</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 font-body leading-relaxed">
              "{adventure.audioBriefing}"
            </p>
            <button
              type="button"
              onClick={handleTestAudioPrompt}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 hover:text-amber-300 underline underline-offset-4 cursor-pointer"
            >
              {isAudioPreviewing ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Silence audio primer</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Preview speech cue</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Your Mission Field Tasks (Expedition Checklist) */}
        {adventure.tasks && adventure.tasks.length > 0 && (
          <div className="space-y-6 border-t border-white/10 pt-10">
            <div className="space-y-1">
              <div className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400">
                YOUR MISSION
              </div>
              <p className="font-editorial text-2xl text-stone-200">
                Walk outside and discover:
              </p>
            </div>
            <div className="space-y-3.5 pl-2 max-w-3xl">
              {adventure.tasks.map((task, idx) => (
                <div key={idx} className="flex items-start gap-3.5 text-stone-200">
                  <span className="text-amber-400 font-mono text-base select-none mt-0.5">○</span>
                  <span className="text-base sm:text-lg font-body leading-relaxed text-stone-200">
                    {task}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Waypoints Rendered along a continuous vertical topological trail line */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-2">
              <Footprints className="w-4 h-4" />
              <span>THE ITINERARY TRAIL ({adventure.waypoints.length} WAYPOINTS)</span>
            </div>
            <span className="text-xs font-mono text-stone-400">~{adventure.targetMinutes} MINS TOTAL</span>
          </div>

          <div className="relative pl-6 sm:pl-10 space-y-12 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-[1px] before:bg-white/20">
            {adventure.waypoints.map((wp, index) => (
              <div key={wp.id} className="relative space-y-2">
                {/* Node Milestone Dot */}
                <div className="absolute -left-6 sm:-left-10 top-1 w-4 h-4 rounded-full bg-[#060c14] border-2 border-amber-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-stone-400">
                  <span className="text-amber-300 font-bold">WAYPOINT 0{index + 1}</span>
                  <span>·</span>
                  <span>~{wp.durationMinutes} MIN</span>
                  <span>·</span>
                  <span className="uppercase">{wp.checkpointType}</span>
                </div>

                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
                  {wp.title}
                </h3>

                <p className="text-sm sm:text-base text-stone-200 font-body leading-relaxed max-w-2xl">
                  {wp.sensoryPrompt}
                </p>

                <div className="text-xs font-mono text-stone-400 pt-1">
                  Immediate challenge: {wp.actionChallenge}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bonus Task & Safety Tip (Unboxed Naturalist Field Sections) */}
        {(adventure.bonusTask || adventure.safetyTip) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-white/10 pt-10">
            {adventure.bonusTask && (
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>BONUS NATURALIST CHALLENGE</span>
                </div>
                <p className="font-editorial text-lg sm:text-xl text-stone-200 leading-snug">
                  {adventure.bonusTask}
                </p>
                <div className="text-xs font-mono text-stone-500">
                  Optional field observation for curious explorers.
                </div>
              </div>
            )}

            {adventure.safetyTip && (
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>TRAIL SAFETY & PROTOCOL</span>
                </div>
                <p className="text-sm sm:text-base text-stone-300 font-body leading-relaxed">
                  {adventure.safetyTip}
                </p>
                <div className="text-xs font-mono text-stone-500">
                  Always yield to oncoming pedestrians and mind your footing.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pre-Departure Gear Check (Naturalist Field List, NO CARDS!) */}
        <div className="space-y-6 border-t border-white/10 pt-10">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-400">
            FIELD READINESS CHECKLIST
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {adventure.gearChecklist.map((item) => {
              const isChecked = !!checkedGear[item];
              return (
                <div
                  key={item}
                  onClick={() => toggleGear(item)}
                  className="flex items-center gap-3 cursor-pointer py-2 border-b border-white/5 hover:border-white/20 transition-all text-xs sm:text-sm text-stone-200"
                >
                  {isChecked ? (
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-stone-600 shrink-0" />
                  )}
                  <span className={isChecked ? 'line-through opacity-60' : ''}>{item}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Departure Action Button */}
        <div className="border-t border-white/10 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 pb-12">
          <div className="text-center sm:text-left space-y-1">
            <div className="font-editorial text-2xl text-stone-200 tracking-wide">
              YOUR TRAIL IS WAITING.
            </div>
            <div className="text-xs font-mono text-stone-400">
              Once outside, stow phone in your pocket. Ambient chimes tell you when waypoints arrive.
            </div>
          </div>

          <button
            type="button"
            onClick={handleLaunch}
            className="w-full sm:w-auto min-h-[56px] sm:min-h-[64px] px-6 sm:px-12 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-3 transition-all shadow-[0_12px_32px_rgba(249,115,22,0.4)] active:scale-[0.98] cursor-pointer"
          >
            <Play className="w-5 h-5 fill-stone-950" />
            <span>START ADVENTURE</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
