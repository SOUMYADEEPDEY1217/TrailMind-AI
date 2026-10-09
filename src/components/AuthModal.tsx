import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Compass,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Trees,
  Mountain,
  Waves,
  Building,
  Copy,
  Check,
  ShieldAlert,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { audioSynth } from '../utils/audioSynth';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    signIn,
    signUp,
    signInGoogle,
    resetPassword,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [preferredBiome, setPreferredBiome] = useState('forest_trail');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  // Sync mode with context state when modal opens
  React.useEffect(() => {
    setMode(authModalMode);
    setErrorMsg(null);
    setSuccessMsg(null);
    setUnauthorizedDomain(null);
    setCopiedDomain(false);
    setShowForgot(false);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'preview-domain';

  const handleCopyDomain = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentHostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    }
  };

  const handleFillDemoAccount = (targetMode: 'signin' | 'signup') => {
    setMode(targetMode);
    setShowForgot(false);
    setEmail('rohan.dey1206@gmail.com');
    setPassword('explorer2026!');
    setDisplayName('Rohan Dey');
    setErrorMsg(null);
    setUnauthorizedDomain(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setUnauthorizedDomain(null);
    setLoading(true);

    try {
      if (showForgot) {
        if (!email.trim()) {
          setErrorMsg('Please enter your email to receive a password reset link.');
          setLoading(false);
          return;
        }
        await resetPassword(email);
        setSuccessMsg('Password reset email sent! Check your inbox.');
        audioSynth.playChime('complete');
        setLoading(false);
        return;
      }

      if (mode === 'signup') {
        if (!displayName.trim()) {
          setErrorMsg('Please enter your Explorer Name.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
        await signUp(email, password, displayName);
        audioSynth.playChime('complete');
        setSuccessMsg('Account registered and profile saved in Firebase Database!');
        setTimeout(() => {
          closeAuthModal();
        }, 1200);
      } else {
        await signIn(email, password);
        audioSynth.playChime('start');
        setSuccessMsg('Welcome back! Signed in with Firebase.');
        setTimeout(() => {
          closeAuthModal();
        }, 1000);
      }
    } catch (err: any) {
      console.warn('[Firebase Auth Error]', err);
      let message = 'An error occurred during authentication.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. Please check your credentials or create a new account.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists. Switch to "Sign In" above to access your account.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please provide a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/operation-not-allowed') {
        message = 'Email/Password provider is disabled in Firebase Console. Please enable Email/Password under Authentication > Sign-in method.';
      } else if (err.code === 'auth/network-request-failed') {
        message = 'Network connectivity issue reaching Firebase. Please check your internet connection.';
      } else if (err.message) {
        message = err.message;
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setUnauthorizedDomain(null);
    setLoading(true);
    try {
      await signInGoogle();
      audioSynth.playChime('start');
      setSuccessMsg('Successfully signed in with Google!');
      setTimeout(() => {
        closeAuthModal();
      }, 1000);
    } catch (err: any) {
      console.warn('[Google Auth Handled]', err);
      if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.includes('auth/unauthorized-domain'))) {
        setUnauthorizedDomain(currentHostname);
        setErrorMsg(`Google OAuth blocked: "${currentHostname}" is not yet an Authorized Domain in your Firebase Console.`);
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Google Sign-In popup closed before completing.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        // User clicked another operation
      } else if (err.code === 'auth/popup-blocked') {
        setErrorMsg('The sign-in popup was blocked by your browser. Please allow popups or use Email & Password.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setErrorMsg('Google Sign-In is not enabled in Firebase Console. Please enable Google provider in Authentication > Sign-in method.');
      } else {
        setErrorMsg(err.message || 'Google sign-in could not be completed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-[#070e17] border border-amber-500/30 rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.9)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Mountain Silhouette & Topo SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
          viewBox="0 0 600 700"
          preserveAspectRatio="none"
          fill="none"
        >
          <path d="M0 350 L150 250 L320 380 L480 220 L600 320 L600 700 L0 700 Z" fill="#0c2330" />
          <path d="M0 480 L200 380 L400 490 L600 410 L600 700 L0 700 Z" fill="#06131c" />
        </svg>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer z-20"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 p-6 sm:p-8">
          {/* Header */}
          <div className="space-y-2 text-center pb-6 border-b border-white/10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-400 mb-1">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-400">
              FIREBASE CLOUD PERSISTENCE
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-black text-white tracking-tight">
              {showForgot
                ? 'Reset Password'
                : mode === 'signup'
                ? 'Join TrailMind Expeditions'
                : 'Welcome Back, Explorer'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-body">
              {showForgot
                ? 'Enter your email to receive recovery instructions.'
                : mode === 'signup'
                ? 'Create your account to sync treks, memories and stats across devices.'
                : 'Sign in to access your saved field postcards, treks and milestones.'}
            </p>
          </div>

          {/* Mode Switch Tabs (when not in forgot password mode) */}
          {!showForgot && (
            <div className="flex rounded-xl bg-black/40 p-1 border border-white/10 my-6">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Status Notifications */}
          {unauthorizedDomain ? (
            <div className="mb-5 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-3 animate-fade-in">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                    Google OAuth: Domain Authorization Required
                  </div>
                  <p className="text-[11px] font-body text-stone-300 leading-relaxed">
                    Firebase restricts Google popup logins to domains in your Authorized Domains list. This preview host has not been added yet:
                  </p>
                </div>
              </div>

              {/* Domain Copy Box */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono">
                <span className="truncate text-stone-200 font-semibold">{unauthorizedDomain}</span>
                <button
                  type="button"
                  onClick={handleCopyDomain}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-[11px] font-mono flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                >
                  {copiedDomain ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDomain ? 'Copied!' : 'Copy Domain'}</span>
                </button>
              </div>

              <div className="text-[10px] font-mono text-stone-400 leading-relaxed">
                To enable Google popup: In Firebase Console → Authentication → Settings → Authorized domains → Add domain.
              </div>

              {/* Immediate working alternative */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setUnauthorizedDomain(null);
                    setErrorMsg(null);
                    setMode('signup');
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Use Email Sign Up (Works Instantly)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUnauthorizedDomain(null);
                    setErrorMsg(null);
                    setMode('signin');
                  }}
                  className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-stone-200 text-xs font-mono uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Email Sign In
                </button>
              </div>
            </div>
          ) : errorMsg ? (
            <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs font-mono flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          ) : null}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Demo Pre-fill Pill */}
          {!showForgot && (
            <div className="flex items-center justify-between pb-3">
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                {mode === 'signup' ? 'New Explorer Registration' : 'Explorer Sign In'}
              </span>
              <button
                type="button"
                onClick={() => handleFillDemoAccount(mode)}
                className="text-[10px] font-mono text-amber-400/90 hover:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                title="Fill credentials for quick testing"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Auto-fill details</span>
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && !showForgot && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Explorer Call-Sign / Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Rohan Dey"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 text-white text-sm focus:outline-none transition-colors"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="explorer@trailmind.ai"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 text-white text-sm focus:outline-none transition-colors"
              />
            </div>

            {!showForgot && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Password</span>
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-[10px] font-mono text-amber-400/90 hover:text-amber-300 underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 text-white text-sm focus:outline-none transition-colors"
                />
              </div>
            )}

            {/* Optional Biome Preference on Sign Up */}
            {mode === 'signup' && !showForgot && (
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-stone-300">
                  Favorite Starting Biome
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {[
                    { id: 'forest_trail', label: 'Forest Trail', icon: Trees },
                    { id: 'waterfront', label: 'Waterfront', icon: Waves },
                    { id: 'urban_park', label: 'Urban Park', icon: Building },
                    { id: 'mountain_crest', label: 'Mountain Crest', icon: Mountain },
                  ].map((biome) => {
                    const Icon = biome.icon;
                    const isSelected = preferredBiome === biome.id;
                    return (
                      <button
                        key={biome.id}
                        type="button"
                        onClick={() => setPreferredBiome(biome.id)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                            : 'bg-black/30 border-white/10 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="truncate">{biome.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-sm font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(245,158,11,0.3)] transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50"
            >
              <span>
                {loading
                  ? 'Processing...'
                  : showForgot
                  ? 'Send Reset Link'
                  : mode === 'signup'
                  ? 'Complete Registration'
                  : 'Sign In to TrailMind'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social / Google Sign In */}
          {!showForgot && (
            <div className="mt-5 space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#070e17] px-3 text-[10px] font-mono text-stone-400 uppercase tracking-widest shrink-0">
                  Or Continue With
                </span>
                <div className="border-t border-white/10 w-full" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-stone-200 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.9c2.28-2.1 3.645-5.18 3.645-9.14z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.4 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.6 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Google Account</span>
              </button>

              <div className="text-[10px] font-mono text-stone-400 text-center leading-normal px-2">
                Note: Google Sign-In requires adding preview domain to Firebase Authorized Domains. Email &amp; Password sign-in / registration works on all domains immediately.
              </div>
            </div>
          )}

          {/* Footer Toggle */}
          <div className="mt-6 text-center text-xs font-mono text-stone-400">
            {showForgot ? (
              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="text-amber-400 hover:text-amber-300 underline cursor-pointer"
              >
                Back to Sign In
              </button>
            ) : mode === 'signup' ? (
              <span>
                Already an explorer?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg(null);
                  }}
                  className="text-amber-400 hover:text-amber-300 underline cursor-pointer"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                First time here?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg(null);
                  }}
                  className="text-amber-400 hover:text-amber-300 underline cursor-pointer"
                >
                  Create an account
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
