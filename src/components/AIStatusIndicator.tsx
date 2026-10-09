import React, { useState } from 'react';
import { useAIStatus } from '../services/ai/useAIStatus';
import { ProviderType } from '../services/ai/types';
import {
  Cpu,
  Cloud,
  Compass,
  CheckCircle2,
  XCircle,
  RefreshCw,
  SlidersHorizontal,
  X,
  ExternalLink,
  Zap,
} from 'lucide-react';

interface AIStatusIndicatorProps {
  compact?: boolean;
  className?: string;
}

export const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({
  compact = false,
  className = '',
}) => {
  const {
    status,
    loading,
    refreshStatus,
    preferredProvider,
    setPreferredProvider,
    testOllama,
  } = useAIStatus();

  const [isOpen, setIsOpen] = useState(false);
  const [testingOllama, setTestingOllama] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const activeProvider = status?.activeProvider || 'OFFLINE';
  const headline = status?.headline || '● OFFLINE';
  const subline = status?.subline || 'TrailMind Engine';

  // Badge visual styles per provider state
  const badgeTheme = {
    LOCAL: {
      dotColor: 'bg-cyan-400',
      textColor: 'text-cyan-300',
      subColor: 'text-cyan-400/80',
      bgColor: 'bg-cyan-950/50 hover:bg-cyan-900/60',
      borderColor: 'border-cyan-500/40',
      icon: Cpu,
    },
    CLOUD: {
      dotColor: 'bg-violet-400',
      textColor: 'text-violet-300',
      subColor: 'text-violet-400/80',
      bgColor: 'bg-violet-950/50 hover:bg-violet-900/60',
      borderColor: 'border-violet-500/40',
      icon: Cloud,
    },
    OFFLINE: {
      dotColor: 'bg-amber-400',
      textColor: 'text-amber-300',
      subColor: 'text-amber-400/80',
      bgColor: 'bg-amber-950/50 hover:bg-amber-900/60',
      borderColor: 'border-amber-500/40',
      icon: Compass,
    },
  }[activeProvider];

  const handleTestOllama = async () => {
    setTestingOllama(true);
    setTestResult(null);
    try {
      const res = await testOllama();
      if (res.success) {
        setTestResult(`✓ Ollama connected successfully! (${res.message})`);
        await refreshStatus();
      } else {
        setTestResult(`✕ ${res.message || 'Connection failed'}`);
      }
    } catch (e: any) {
      setTestResult(`✕ ${e.message || 'Connection failed'}`);
    } finally {
      setTestingOllama(false);
    }
  };

  return (
    <>
      {/* Clickable Status Badge */}
      <button
        onClick={() => setIsOpen(true)}
        title="View AI Provider Architecture & Status"
        className={`group relative flex items-center gap-2.5 px-3 py-1.5 rounded-full border transition-all duration-300 text-left shadow-sm ${badgeTheme.bgColor} ${badgeTheme.borderColor} ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${badgeTheme.dotColor}`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${badgeTheme.dotColor}`}
          />
        </span>

        {compact ? (
          <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider">
            <span className={`font-bold ${badgeTheme.textColor}`}>{activeProvider}</span>
            <span className="text-stone-500 hidden xs:inline">·</span>
            <span className="text-stone-300 font-semibold hidden xs:inline truncate max-w-[90px]">{subline}</span>
          </div>
        ) : (
          <div className="flex flex-col leading-tight">
            <span className={`text-[10px] font-mono uppercase font-bold tracking-widest ${badgeTheme.textColor}`}>
              {headline}
            </span>
            <span className={`text-[11px] font-mono tracking-tight font-medium ${badgeTheme.subColor}`}>
              {subline}
            </span>
          </div>
        )}
      </button>

      {/* AI Architecture Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-xl bg-stone-950 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-200 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-amber-400">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>AI PROVIDER ARCHITECTURE</span>
                </div>
                <h3 className="text-2xl font-editorial font-bold text-white tracking-tight">
                  Independent Intelligence Engine
                </h3>
                <p className="text-xs text-stone-400 font-body">
                  TrailMind dynamically routes mission generation across local, cloud, and offline tiers.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active Provider Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between ${badgeTheme.bgColor} ${badgeTheme.borderColor}`}
            >
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
                  ACTIVE GENERATION ENGINE
                </div>
                <div className={`text-base font-mono font-bold ${badgeTheme.textColor}`}>
                  {headline}
                </div>
                <div className="text-xs font-mono text-stone-300">
                  Model: {status?.activeModel || subline}
                </div>
              </div>
              <button
                onClick={refreshStatus}
                disabled={loading}
                title="Refresh Provider Connectivity"
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-stone-300 hover:text-white transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Provider Cards */}
            <div className="space-y-3.5">
              <div className="text-xs font-mono uppercase tracking-widest text-stone-400">
                PROVIDERS STATUS
              </div>

              {/* 1. LOCAL AI (Ollama) */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  status?.providers.LOCAL.connected
                    ? 'bg-cyan-950/20 border-cyan-500/40'
                    : 'bg-stone-900/40 border-white/5'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        status?.providers.LOCAL.connected
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-stone-800 text-stone-500'
                      }`}
                    >
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white">LOCAL AI</span>
                        <span className="text-xs font-mono text-stone-400">(Ollama)</span>
                      </div>
                      <div className="text-xs font-mono text-stone-400">
                        Default model: <span className="text-cyan-300 font-semibold">llama3.2:3b</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider ${
                      status?.providers.LOCAL.connected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-stone-800/80 text-stone-400 border border-white/5'
                    }`}
                  >
                    {status?.providers.LOCAL.connected ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-stone-500" />
                        <span>Not Detected</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="font-mono text-stone-400 text-[11px]">
                    Endpoint: <code className="text-stone-300">{status?.providers.LOCAL.endpoint || 'http://127.0.0.1:11434'}</code>
                    <div className="text-[10px] text-stone-500 mt-0.5">
                      {status?.providers.LOCAL.details || 'Runs 100% on your device hardware'}
                    </div>
                  </div>

                  <button
                    onClick={handleTestOllama}
                    disabled={testingOllama}
                    className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-mono text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0"
                  >
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>{testingOllama ? 'Probing...' : 'Test Ollama'}</span>
                  </button>
                </div>

                {testResult && (
                  <div className="mt-2 text-xs font-mono p-2 rounded-lg bg-stone-900 border border-white/10 text-stone-300">
                    {testResult}
                  </div>
                )}
              </div>

              {/* 2. CLOUD AI (Gemini) */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  status?.providers.CLOUD.connected
                    ? 'bg-violet-950/20 border-violet-500/40'
                    : 'bg-stone-900/40 border-white/5'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        status?.providers.CLOUD.connected
                          ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                          : 'bg-stone-800 text-stone-500'
                      }`}
                    >
                      <Cloud className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white">CLOUD AI</span>
                        <span className="text-xs font-mono text-stone-400">(Gemini)</span>
                      </div>
                      <div className="text-xs font-mono text-stone-400">
                        Model: <span className="text-violet-300 font-semibold">gemini-3.8-flash</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider ${
                      status?.providers.CLOUD.connected
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                        : 'bg-stone-800/80 text-stone-400 border border-white/5'
                    }`}
                  >
                    {status?.providers.CLOUD.connected ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-violet-400" />
                        <span>Ready</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-stone-500" />
                        <span>Unavailable</span>
                      </>
                    )}
                  </span>
                </div>
                <div className="mt-2 text-[11px] font-mono text-stone-400">
                  {status?.providers.CLOUD.details || 'Google Cloud Gemini API integration'}
                </div>
              </div>

              {/* 3. OFFLINE (TrailMind Engine) */}
              <div className="p-4 rounded-2xl border bg-amber-950/20 border-amber-500/40">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white">OFFLINE</span>
                        <span className="text-xs font-mono text-stone-400">(TrailMind Engine)</span>
                      </div>
                      <div className="text-xs font-mono text-amber-300 font-semibold">
                        40+ Adaptive Outdoor Biome Templates
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <CheckCircle2 className="w-3 h-3 text-amber-400" />
                    <span>Always Ready</span>
                  </span>
                </div>
                <div className="mt-2 text-[11px] font-mono text-stone-400">
                  Zero cloud required · Resilient outdoor exploration anytime, anywhere.
                </div>
              </div>
            </div>

            {/* Provider Preference Selection */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="text-xs font-mono uppercase tracking-widest text-stone-400">
                DISPATCH PREFERENCE
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'AUTO', label: 'Auto Cascade', desc: 'Local → Cloud → Offline' },
                  { id: 'LOCAL', label: 'Local (Ollama)', desc: 'Prefers Llama 3.2' },
                  { id: 'CLOUD', label: 'Cloud (Gemini)', desc: 'Prefers Gemini' },
                  { id: 'OFFLINE', label: 'Offline Only', desc: 'TrailMind Engine' },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setPreferredProvider(option.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      preferredProvider === option.id
                        ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold shadow-md'
                        : 'bg-stone-900/60 border-white/10 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div className="text-xs font-mono">{option.label}</div>
                    <div
                      className={`text-[10px] mt-0.5 ${
                        preferredProvider === option.id ? 'text-stone-900' : 'text-stone-500'
                      }`}
                    >
                      {option.desc}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-[11px] font-mono text-stone-500 pt-1">
                Automatic fallback is always active: if Ollama or Gemini encounters any issue, TrailMind instantly generates via the Offline Adventure Engine.
              </p>
            </div>

            {/* Ollama Setup Instructions */}
            <div className="p-3.5 rounded-xl bg-stone-900 border border-white/5 space-y-1.5 text-xs font-mono text-stone-400">
              <div className="text-stone-300 font-semibold flex items-center gap-1.5">
                <span>Want to run Local AI?</span>
              </div>
              <p className="text-[11px]">
                Install Ollama on your machine and run the default model in terminal:
              </p>
              <div className="p-2 rounded bg-stone-950 border border-white/10 text-cyan-300 select-all font-mono text-[11px]">
                ollama run llama3.2:3b
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-widest transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
