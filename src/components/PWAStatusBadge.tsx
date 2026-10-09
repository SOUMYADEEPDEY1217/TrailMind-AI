import React, { useState } from 'react';
import { useOnlineStatus } from '../utils/useOnlineStatus';
import { usePWAInstall } from '../utils/usePWAInstall';
import { Download, Wifi, WifiOff, CheckCircle, Share, Sparkles } from 'lucide-react';

export const PWAStatusBadge: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showOfflineInfo, setShowOfflineInfo] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Tiny non-intrusive status: ● ONLINE or ● OFFLINE READY */}
        <button
          type="button"
          onClick={() => setShowOfflineInfo(true)}
          title={isOnline ? 'Online mode: AI Cloud & Offline Engine available' : 'Offline ready: 45 templates & full local persistence active'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all border ${
            isOnline
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40'
              : 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60 shadow-lg shadow-amber-950/30'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isOnline ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
            }`}
          />
          <span>{isOnline ? '● ONLINE' : '● OFFLINE READY'}</span>
        </button>

        {/* In-app Install Prompt button when installable (or iOS guide) */}
        {!isInstalled && isInstallable && (
          <button
            type="button"
            onClick={install}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 transition-colors shadow-sm cursor-pointer"
            title="Install TrailMind to your home screen or desktop for 100% offline access"
          >
            <Download className="w-3 h-3" />
            <span>Install App</span>
          </button>
        )}

        {!isInstalled && isIOS && !isInstallable && (
          <button
            type="button"
            onClick={() => setShowInstallModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-stone-800 hover:bg-stone-700 border border-white/10 text-stone-300 transition-colors cursor-pointer"
            title="Install on iPhone / iPad"
          >
            <Download className="w-3 h-3 text-amber-400" />
            <span>Install</span>
          </button>
        )}
      </div>

      {/* Offline Ready Info Modal */}
      {showOfflineInfo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#081524] border border-white/15 p-6 rounded-2xl space-y-5 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                {isOnline ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <Wifi className="w-4 h-4 text-emerald-400" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                    <WifiOff className="w-4 h-4 text-amber-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-editorial text-lg font-bold text-white">
                    {isOnline ? 'Online & Offline Ready' : 'Field Offline Ready'}
                  </h3>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                    {isOnline ? '● ALL SYSTEMS CONNECTED' : '● AIRPLANE / FIELD MODE ENGAGED'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOfflineInfo(false)}
                className="text-stone-400 hover:text-white text-xs font-mono px-2 py-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-300 font-body leading-relaxed">
              {isOnline
                ? 'TrailMind is online. The Progressive Web App service worker has cached the entire application shell, offline sound synthesizers, and 45 built-in missions. You can wander into the woods with zero internet connectivity at any time.'
                : 'No internet connection detected, but you are 100% prepared! TrailMind operates seamlessly offline. Your active adventure, timer, checklist, memories, and built-in mission generator remain fully functional.'}
            </p>

            <div className="space-y-2 rounded-xl bg-white/5 border border-white/10 p-3.5 text-xs text-stone-200">
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-medium">
                Offline Capabilities Available Right Now:
              </div>
              <ul className="space-y-1.5 text-[11px] text-stone-300 list-disc list-inside">
                <li><strong className="text-white">Active adventure & timer:</strong> Uninterrupted outdoor counting</li>
                <li><strong className="text-white">Field checklist:</strong> All observations save to localStorage</li>
                <li><strong className="text-white">Offline Engine:</strong> 45 adaptive templates across 15 activities</li>
                <li><strong className="text-white">Memories & History:</strong> Complete local journal access</li>
                <li><strong className="text-white">Ambient synthesizers:</strong> Pure Web Audio soundscapes</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowOfflineInfo(false)}
                className="w-full py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Installation Instruction Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-[#081524] border border-white/15 p-6 rounded-2xl space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-editorial text-lg font-bold text-white">
                Install on iPhone / iPad
              </h3>
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                className="text-stone-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-stone-300 font-body leading-relaxed">
              To install TrailMind to your home screen for instant full-screen offline access:
            </p>
            <ol className="space-y-2 text-xs text-stone-200 list-decimal list-inside bg-white/5 p-3 rounded-lg border border-white/10">
              <li>
                Tap the <strong className="text-amber-400">Share button</strong> (square with arrow up) in Safari.
              </li>
              <li>
                Scroll down and tap <strong className="text-amber-400">Add to Home Screen</strong>.
              </li>
              <li>
                Tap <strong className="text-amber-400">Add</strong> in the top-right corner.
              </li>
            </ol>
            <button
              type="button"
              onClick={() => setShowInstallModal(false)}
              className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
