import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Compass,
  Download,
  RotateCcw,
  Check,
  Play,
  Cpu,
  Cloud,
  Zap,
  CheckCircle2,
  XCircle,
  RefreshCw,
  User,
  LogIn,
  LogOut,
  ShieldCheck,
  Database,
} from 'lucide-react';
import { UserSettings } from '../types';
import {
  getSettings,
  getPreferences,
  getMemories,
  resetDemoData,
  saveSettings,
} from '../utils/storage';
import { audioSynth } from '../utils/audioSynth';
import { useAIStatus } from '../services/ai/useAIStatus';
import { useAuth } from '../context/AuthContext';

interface SettingsPageProps {
  onNavigate: (route: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const [settings, setSettingsState] = useState<UserSettings>(() => getSettings());
  const [saveToast, setSaveToast] = useState(false);

  const {
    currentUser,
    userProfile,
    isLoggedIn,
    openAuthModal,
    signOut,
    updateProfileDetails,
  } = useAuth();

  const [editDisplayName, setEditDisplayName] = useState('');
  const [editBiome, setEditBiome] = useState('forest_trail');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setEditDisplayName(userProfile.displayName || '');
      setEditBiome(userProfile.preferredBiome || 'forest_trail');
    }
  }, [userProfile]);

  const {
    status: aiStatus,
    loading: aiLoading,
    refreshStatus: refreshAIStatus,
    preferredProvider,
    setPreferredProvider,
    testOllama,
  } = useAIStatus();
  const [testingOllama, setTestingOllama] = useState(false);
  const [ollamaTestMsg, setOllamaTestMsg] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccessToast, setResetSuccessToast] = useState(false);

  const handleTestOllama = async () => {
    setTestingOllama(true);
    setOllamaTestMsg(null);
    try {
      const res = await testOllama();
      if (res.success) {
        setOllamaTestMsg(`✓ Connected to Ollama (${res.message})`);
        await refreshAIStatus();
      } else {
        setOllamaTestMsg(`✕ ${res.message || 'Connection refused at http://localhost:11434'}`);
      }
    } catch (err: any) {
      setOllamaTestMsg(`✕ ${err.message || 'Failed to ping daemon'}`);
    } finally {
      setTestingOllama(false);
    }
  };

  const updateSetting = <K extends keyof UserSettings>(
    key: K,
    val: UserSettings[K]
  ) => {
    const updated = { ...settings, [key]: val };
    setSettingsState(updated);
    saveSettings(updated);
    audioSynth.playChime('tick');
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleTestVoice = () => {
    audioSynth.speakPrompt(
      'Waypoint reached. Breathe in deeply through your nose and soften your gaze.',
      settings.speechRate,
      settings.speechPitch
    );
  };

  const confirmResetData = () => {
    resetDemoData();
    setSettingsState(getSettings());
    setShowResetConfirm(false);
    audioSynth.playChime('complete');
    setResetSuccessToast(true);
    setTimeout(() => setResetSuccessToast(false), 3000);
  };

  const handleExportData = () => {
    const fullBackup = {
      settings,
      preferences: getPreferences(),
      memories: getMemories(),
      timestamp: new Date().toISOString(),
    };
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `trailmind_backup_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
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
        <path d="M0 380 Q360 260 720 340 Q1080 420 1440 320 L1440 1200 L0 1200 Z" fill="#081822" />
      </svg>

      <div className="relative z-20 max-w-4xl mx-auto space-y-12 sm:space-y-16">
        {/* Editorial Heading (NO CARDS!) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 sm:pb-8">
          <div className="space-y-3 sm:space-y-4 max-w-2xl">
            <div className="flex items-center gap-3 text-[10px] xs:text-xs font-mono uppercase tracking-[0.25em] sm:tracking-[0.3em] text-amber-400">
              <span>HARDWARE & AUDIO CALIBRATION</span>
              <span className="w-8 h-[1px] bg-amber-400/60" />
              <span>THE TRAIL GUIDE</span>
            </div>

            <h1 className="font-editorial text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[0.9]">
              Field Settings &<br />
              Audio Guide.
            </h1>

            <p className="text-sm xs:text-base text-stone-300 font-body leading-relaxed">
              Fine-tune voice guidance speech rates, chime frequencies, and ambient outdoor soundscapes.
            </p>
          </div>

          {saveToast && (
            <div className="text-xs font-mono text-amber-400 tracking-wider self-start sm:self-auto">
              ✓ Preferences Saved
            </div>
          )}
        </div>

        {/* ========================================================
            UNBOXED INSTRUMENT TUNING (NO RECTANGULAR CARDS!)
           ======================================================== */}
        <div className="space-y-16">
          {/* Section 1: The Trail Guide Voice */}
          <div className="space-y-8 border-b border-white/10 pb-12">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono tracking-widest uppercase text-amber-400 mb-1">
                  01 // THE TRAIL GUIDE VOICE
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
                  Spoken Waypoint Guidance
                </h2>
                <p className="text-xs text-stone-400 font-body max-w-md mt-1">
                  Reads sensory instructions aloud in pocket mode so you do not glance at glass.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.audioVoiceEnabled}
                  onChange={(e) => updateSetting('audioVoiceEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
              </label>
            </div>

            {settings.audioVoiceEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-stone-300">Speech Cadence</span>
                    <span className="text-amber-400">{settings.speechRate.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.25"
                    step="0.05"
                    value={settings.speechRate}
                    onChange={(e) => updateSetting('speechRate', parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-stone-300">Voice Pitch</span>
                    <span className="text-amber-400">{settings.speechPitch.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.2"
                    step="0.1"
                    value={settings.speechPitch}
                    onChange={(e) => updateSetting('speechPitch', parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={handleTestVoice}
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 hover:text-amber-300 underline underline-offset-4 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Test Spoken Outdoor Cue</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Chime Intervals & Ambient Nature Sound */}
          <div className="space-y-8 border-b border-white/10 pb-12">
            <div>
              <div className="text-xs font-mono tracking-widest uppercase text-amber-400 mb-1">
                02 // SENSORY CHIME INTERVALS & AMBIENT AUDIO
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
                Acoustic Frequency
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-mono text-stone-400 block">
                  Time Notification Chime
                </label>
                <select
                  value={settings.chimeIntervalMinutes}
                  onChange={(e) => updateSetting('chimeIntervalMinutes', parseInt(e.target.value))}
                  className="w-full p-3 bg-transparent border-b border-white/20 text-sm font-editorial text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="0" className="bg-[#09121a]">Silent (Checkpoint transitions only)</option>
                  <option value="3" className="bg-[#09121a]">Every 3 minutes (gentle chime)</option>
                  <option value="5" className="bg-[#09121a]">Every 5 minutes (standard)</option>
                  <option value="10" className="bg-[#09121a]">Every 10 minutes</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-stone-400 block">
                  Default Soundscape
                </label>
                <select
                  value={settings.ambientSound}
                  onChange={(e) => updateSetting('ambientSound', e.target.value as 'forest' | 'stream' | 'wind' | 'off')}
                  className="w-full p-3 bg-transparent border-b border-white/20 text-sm font-editorial text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="forest" className="bg-[#09121a]">Forest Birds & Canopy Whispers</option>
                  <option value="stream" className="bg-[#09121a]">Riparian Mountain Stream</option>
                  <option value="wind" className="bg-[#09121a]">Open Ridge Wind Hum</option>
                  <option value="off" className="bg-[#09121a]">Real World Silence Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Units & Data Management */}
          <div className="space-y-8 border-b border-white/10 pb-12">
            <div>
              <div className="text-xs font-mono tracking-widest uppercase text-amber-400 mb-1">
                03 // UNITS & EXPEDITION ARCHIVE
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
                Telemetry & Backup
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={() => updateSetting('units', settings.units === 'km' ? 'mi' : 'km')}
                className="text-xs font-mono uppercase tracking-widest text-stone-300 hover:text-white underline underline-offset-4 cursor-pointer"
              >
                Units: {settings.units === 'km' ? 'Metric (Kilometers)' : 'Imperial (Miles)'} (Tap to toggle)
              </button>

              <button
                type="button"
                onClick={handleExportData}
                className="text-xs font-mono uppercase tracking-widest text-stone-300 hover:text-white underline underline-offset-4 cursor-pointer"
              >
                Export All Data (JSON)
              </button>

              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="text-xs font-mono uppercase tracking-widest text-stone-500 hover:text-stone-300 underline underline-offset-4 cursor-pointer"
              >
                Restore Demo Data
              </button>
            </div>
          </div>

          {/* Section 4: Progressive Web App Offline Architecture */}
          <div className="space-y-8 pb-12">
            <div>
              <div className="text-xs font-mono tracking-widest uppercase text-amber-400 mb-1">
                04 // PROGRESSIVE WEB APP & OFFLINE ENGINE
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
                Zero-Cloud Field Persistence
              </h2>
              <p className="text-xs text-stone-400 font-body max-w-lg mt-1">
                TrailMind is engineered as an offline-first PWA. All core tools, audio engines, 45 templates, and your active adventure checklist continue uninterrupted without cellular coverage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                  Application Shell
                </div>
                <div className="text-base font-editorial font-bold text-white">
                  Cached via Service Worker
                </div>
                <div className="text-[11px] text-stone-400">
                  Instant loading from local device storage
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                  Built-in Missions
                </div>
                <div className="text-base font-editorial font-bold text-white">
                  45 Offline Templates
                </div>
                <div className="text-[11px] text-stone-400">
                  15 activities, adaptive to time & mood
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                  Active Trek State
                </div>
                <div className="text-base font-editorial font-bold text-white">
                  Instant Local Storage
                </div>
                <div className="text-[11px] text-stone-400">
                  Survives reboots, refreshes & plane mode
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: AI Provider Architecture */}
          <div className="space-y-8 pb-12 border-t border-white/10 pt-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono tracking-widest uppercase text-amber-400 mb-1">
                  05 // AI PROVIDER ARCHITECTURE
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
                  Local, Cloud & Offline Intelligence
                </h2>
                <p className="text-xs text-stone-400 font-body max-w-lg mt-1">
                  Provider-independent architecture. Automatic fallback ensures you never get blocked outside.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                    Active Engine
                  </div>
                  <div className="text-xs font-mono font-bold text-amber-300">
                    {aiStatus?.headline || '● OFFLINE'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={refreshAIStatus}
                  disabled={aiLoading}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition-colors"
                  title="Refresh AI Status"
                >
                  <RefreshCw className={`w-4 h-4 ${aiLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Provider Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Local AI */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  aiStatus?.providers.LOCAL.connected
                    ? 'bg-cyan-950/20 border-cyan-500/40'
                    : 'bg-stone-900/40 border-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        aiStatus?.providers.LOCAL.connected
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-stone-800 text-stone-500'
                      }`}
                    >
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-mono text-sm font-bold text-white">LOCAL AI</div>
                      <div className="text-[11px] font-mono text-stone-400">Ollama</div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider ${
                      aiStatus?.providers.LOCAL.connected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-stone-800 text-stone-400 border border-white/5'
                    }`}
                  >
                    {aiStatus?.providers.LOCAL.connected ? 'Connected' : 'Offline'}
                  </span>
                </div>

                <div className="space-y-1 text-xs font-mono text-stone-400">
                  <div>Model: <span className="text-cyan-300 font-semibold">{aiStatus?.providers.LOCAL.model || 'llama3.2:3b'}</span></div>
                  <div>Endpoint: <span className="text-stone-300">{aiStatus?.providers.LOCAL.endpoint || 'http://127.0.0.1:11434'}</span></div>
                  <div className="text-[11px] text-stone-500 pt-1">
                    {aiStatus?.providers.LOCAL.details}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleTestOllama}
                    disabled={testingOllama}
                    className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-mono text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>{testingOllama ? 'Probing...' : 'Probe Ollama'}</span>
                  </button>
                  <span className="text-[10px] font-mono text-stone-500">100% On-device</span>
                </div>

                {ollamaTestMsg && (
                  <div className="mt-2 text-xs font-mono p-2 rounded-lg bg-stone-900 border border-white/10 text-stone-300">
                    {ollamaTestMsg}
                  </div>
                )}
              </div>

              {/* Cloud AI */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  aiStatus?.providers.CLOUD.connected
                    ? 'bg-violet-950/20 border-violet-500/40'
                    : 'bg-stone-900/40 border-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        aiStatus?.providers.CLOUD.connected
                          ? 'bg-violet-500/20 text-violet-300'
                          : 'bg-stone-800 text-stone-500'
                      }`}
                    >
                      <Cloud className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-mono text-sm font-bold text-white">CLOUD AI</div>
                      <div className="text-[11px] font-mono text-stone-400">Gemini</div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider ${
                      aiStatus?.providers.CLOUD.connected
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                        : 'bg-stone-800 text-stone-400 border border-white/5'
                    }`}
                  >
                    {aiStatus?.providers.CLOUD.connected ? 'Ready' : 'Unavailable'}
                  </span>
                </div>

                <div className="space-y-1 text-xs font-mono text-stone-400">
                  <div>Model: <span className="text-violet-300 font-semibold">gemini-3.8-flash</span></div>
                  <div>Provider: <span className="text-stone-300">Google GenAI</span></div>
                  <div className="text-[11px] text-stone-500 pt-1">
                    {aiStatus?.providers.CLOUD.details}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-stone-500">
                  Adaptive multimodal cognitive reasoning
                </div>
              </div>

              {/* Offline Engine */}
              <div className="p-5 rounded-2xl border bg-amber-950/20 border-amber-500/40">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-mono text-sm font-bold text-white">OFFLINE</div>
                      <div className="text-[11px] font-mono text-stone-400">TrailMind Engine</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Always Ready
                  </span>
                </div>

                <div className="space-y-1 text-xs font-mono text-stone-400">
                  <div>Templates: <span className="text-amber-300 font-semibold">40+ Built-in Biomes</span></div>
                  <div>Coverage: <span className="text-stone-300">Zero-network guarantee</span></div>
                  <div className="text-[11px] text-stone-500 pt-1">
                    {aiStatus?.providers.OFFLINE.details}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-stone-500">
                  Field-ready without cell tower or internet
                </div>
              </div>
            </div>

            {/* Provider Preference Dispatch */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-widest text-stone-400">
                DISPATCH PREFERENCE
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'AUTO', label: 'Auto Cascade', desc: 'Local → Cloud → Offline' },
                  { id: 'LOCAL', label: 'Local (Ollama)', desc: 'Prefers Llama 3.2' },
                  { id: 'CLOUD', label: 'Cloud (Gemini)', desc: 'Prefers Gemini' },
                  { id: 'OFFLINE', label: 'Offline Only', desc: 'TrailMind Engine' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPreferredProvider(opt.id as any)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      preferredProvider === opt.id
                        ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold shadow-md'
                        : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-xs font-mono">{opt.label}</div>
                    <div
                      className={`text-[10px] mt-0.5 ${
                        preferredProvider === opt.id ? 'text-stone-900' : 'text-stone-500'
                      }`}
                    >
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 6: Firebase Account & Cloud Database */}
          <div className="space-y-8 pb-12 border-t border-white/10 pt-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono tracking-widest uppercase text-amber-400 mb-1 flex items-center gap-2">
                  <Database className="w-3.5 h-3.5" />
                  <span>06 // FIREBASE ACCOUNT & CLOUD DATABASE</span>
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
                  User Details & Cloud Synchronization
                </h2>
                <p className="text-xs text-stone-400 font-body max-w-lg mt-1">
                  Connected to <span className="text-amber-300 font-mono">trailmind-ai-4316a.firebaseapp.com</span> Firestore.
                  <span className="block text-[11px] text-stone-400 mt-1">
                    Email &amp; Password authentication works everywhere. Google OAuth requires adding this domain to Firebase Console Authorized Domains.
                  </span>
                </p>
              </div>

              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="px-4 py-2 rounded-xl bg-red-950/30 hover:bg-red-950/50 border border-red-500/30 text-red-200 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => openAuthModal('signin')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuthModal('signup')}
                    className="px-4 py-2 rounded-xl border border-amber-400/50 text-amber-300 hover:bg-amber-400/10 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Sign Up</span>
                  </button>
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <div className="space-y-6">
                {/* Profile Card */}
                <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 backdrop-blur-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold text-lg font-mono">
                          {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'E'}
                        </div>
                        <div>
                          <div className="font-editorial text-xl font-bold text-white flex items-center gap-2">
                            <span>{userProfile?.displayName || 'Explorer'}</span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 font-mono font-normal">
                              {userProfile?.experienceLevel || 'Novice Explorer'}
                            </span>
                          </div>
                          <div className="text-xs text-stone-400 font-mono mt-0.5">
                            {currentUser?.email}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs font-mono text-stone-400 pt-2 border-t border-white/10">
                        <div className="flex justify-between">
                          <span>Firebase UID:</span>
                          <span className="text-stone-300 truncate max-w-[200px]">{currentUser?.uid}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Account Created:</span>
                          <span className="text-stone-300">
                            {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Active'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Adventures in DB:</span>
                          <span className="text-amber-300 font-bold">{userProfile?.totalAdventures || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Outdoor Minutes in DB:</span>
                          <span className="text-amber-300 font-bold">{userProfile?.totalOutdoorMinutes || 0} min</span>
                        </div>
                      </div>
                    </div>

                    {/* Edit Profile Form */}
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setSavingProfile(true);
                        try {
                          await updateProfileDetails({
                            displayName: editDisplayName.trim(),
                            preferredBiome: editBiome,
                          });
                          audioSynth.playChime('start');
                          setProfileSaveSuccess(true);
                          setTimeout(() => setProfileSaveSuccess(false), 2500);
                        } finally {
                          setSavingProfile(false);
                        }
                      }}
                      className="space-y-4 md:border-l md:border-white/10 md:pl-6"
                    >
                      <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
                        Update Database Details
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-stone-300 block">
                          Explorer Call-Sign
                        </label>
                        <input
                          type="text"
                          value={editDisplayName}
                          onChange={(e) => setEditDisplayName(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 text-white text-xs font-mono focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-stone-300 block">
                          Preferred Biome
                        </label>
                        <select
                          value={editBiome}
                          onChange={(e) => setEditBiome(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 text-white text-xs font-mono focus:outline-none"
                        >
                          <option value="forest_trail">Forest Trail</option>
                          <option value="waterfront">Waterfront</option>
                          <option value="urban_park">Urban Park</option>
                          <option value="mountain_crest">Mountain Crest</option>
                          <option value="open_meadow">Open Meadow</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <button
                          type="submit"
                          disabled={savingProfile}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs font-mono uppercase tracking-wider cursor-pointer transition-all disabled:opacity-50"
                        >
                          {savingProfile ? 'Saving...' : 'Save to Firestore'}
                        </button>
                        {profileSaveSuccess && (
                          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Saved!</span>
                          </span>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-black/30 border border-white/10 space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-editorial text-lg font-bold text-white">
                      Guest Explorer Mode
                    </div>
                    <p className="text-xs text-stone-300 font-body leading-relaxed">
                      You are currently using local device persistence. Sign in or create a Firebase account to store your personal user details, sync active treks, save your postcard memories, and backup statistics to Google Firebase Firestore.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => openAuthModal('signin')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In with Firebase</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuthModal('signup')}
                    className="px-5 py-2.5 rounded-xl border border-white/20 hover:border-amber-400 text-stone-300 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span>Create New Account</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Demo Data Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#081524] border border-white/20 p-8 rounded-2xl space-y-6 text-center shadow-2xl">
            <RotateCcw className="w-10 h-10 text-amber-400 mx-auto" />
            <div className="space-y-2">
              <h3 className="font-editorial text-2xl font-bold text-white">
                Restore Demo Data?
              </h3>
              <p className="text-xs text-stone-300 font-body leading-relaxed">
                This will reset your local storage to the original set of authenticated field expeditions and default settings.
              </p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-6 py-2.5 rounded-full border border-white/20 hover:bg-white/10 text-xs font-mono uppercase tracking-widest text-stone-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmResetData}
                className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-mono uppercase tracking-widest font-bold cursor-pointer"
              >
                Restore Records
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Success Toast */}
      {resetSuccessToast && (
        <div className="fixed bottom-8 right-8 z-50 p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-mono shadow-2xl flex items-center gap-2 animate-in fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Demo expedition records restored successfully.</span>
        </div>
      )}
    </div>
  );
};
