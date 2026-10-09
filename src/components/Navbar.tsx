import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Compass,
  MapPin,
  Play,
  Bookmark,
  History,
  BarChart3,
  Settings,
  Menu,
  X,
  ArrowUpRight,
  User as UserIcon,
  LogIn,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';
import { getSettings } from '../utils/storage';
import { PWAStatusBadge } from './PWAStatusBadge';
import { AIStatusIndicator } from './AIStatusIndicator';
import { useAuth } from '../context/AuthContext';

export type RoutePath =
  | '/'
  | '/explore'
  | '/mission'
  | '/adventure'
  | '/complete'
  | '/memories'
  | '/history'
  | '/stats'
  | '/settings';

interface NavbarProps {
  currentRoute: RoutePath;
  onNavigate: (route: RoutePath) => void;
  hasActiveAdventure?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  hasActiveAdventure = false,
}) => {
  const { currentUser, userProfile, isLoggedIn, openAuthModal, signOut } = useAuth();
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const [ambientType, setAmbientType] = useState<'forest' | 'stream' | 'wind'>('forest');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const s = getSettings();
    if (s.ambientSound !== 'off') setAmbientType(s.ambientSound);
  }, []);

  const toggleSound = () => {
    const playing = audioSynth.toggleAmbient(ambientType);
    setAmbientPlaying(playing);
  };

  const handleNavClick = (route: RoutePath) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  const handleAboutClick = () => {
    if (currentRoute === '/') {
      const section = document.getElementById('story-forest');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: window.innerHeight * 0.95, behavior: 'smooth' });
      }
    } else {
      onNavigate('/');
      setTimeout(() => {
        window.scrollTo({ top: window.innerHeight * 0.95, behavior: 'smooth' });
      }, 100);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/5 py-3 shadow-2xl'
            : 'bg-transparent py-4 sm:py-6 md:py-7'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 xs:px-6 sm:px-10 flex items-center justify-between">
          {/* Logo on Left */}
          <button
            onClick={() => handleNavClick('/')}
            className="group flex items-center gap-1.5 xs:gap-2.5 text-left focus:outline-none shrink-0"
          >
            <span className="font-editorial text-lg xs:text-2xl sm:text-3xl font-extrabold tracking-widest text-white/95 uppercase group-hover:text-amber-300 transition-colors drop-shadow-md">
              TRAILMIND
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-150 transition-transform shadow-sm shadow-amber-400" />
          </button>

          {/* Minimal Transparent Navigation on Right */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-11">
            <button
              onClick={() => handleNavClick('/explore')}
              className={`text-xs uppercase tracking-[0.22em] font-medium transition-all hover:text-white drop-shadow ${
                currentRoute === '/explore'
                  ? 'text-amber-300 font-semibold border-b border-amber-300 pb-0.5'
                  : 'text-stone-300 hover:text-amber-200'
              }`}
            >
              Explore
            </button>

            <button
              onClick={() => handleNavClick(hasActiveAdventure ? '/adventure' : '/mission')}
              className={`text-xs uppercase tracking-[0.22em] font-medium transition-all hover:text-white drop-shadow relative ${
                currentRoute === '/adventure' || currentRoute === '/mission'
                  ? 'text-amber-300 font-semibold border-b border-amber-300 pb-0.5'
                  : 'text-stone-300 hover:text-amber-200'
              }`}
            >
              <span>Adventures</span>
              {hasActiveAdventure && (
                <span className="absolute -top-1 -right-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('/memories')}
              className={`text-xs uppercase tracking-[0.22em] font-medium transition-all hover:text-white drop-shadow ${
                currentRoute === '/memories'
                  ? 'text-amber-300 font-semibold border-b border-amber-300 pb-0.5'
                  : 'text-stone-300 hover:text-amber-200'
              }`}
            >
              Memories
            </button>

            <button
              onClick={handleAboutClick}
              className="text-xs uppercase tracking-[0.22em] font-medium text-stone-300 hover:text-amber-200 transition-all drop-shadow"
            >
              About
            </button>

            {/* Ambient Nature Sound Toggle */}
            <button
              onClick={toggleSound}
              title={ambientPlaying ? 'Mute nature sound' : 'Turn on outdoor soundscape'}
              className={`p-2 rounded-full border transition-all ${
                ambientPlaying
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-lg shadow-amber-950/40'
                  : 'bg-black/30 text-stone-300 border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              {ambientPlaying ? (
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-amber-300" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>

            {/* AI Provider Architecture Status */}
            <AIStatusIndicator compact={false} />

            {/* Offline-First PWA Status Badge */}
            <PWAStatusBadge />

            {/* Firebase User Authentication Actions */}
            {isLoggedIn ? (
              <div className="flex items-center gap-1.5 pl-1.5 border-l border-white/10">
                <button
                  type="button"
                  onClick={() => handleNavClick('/settings')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 text-xs font-mono transition-all cursor-pointer"
                  title={`Signed in as ${userProfile?.displayName || currentUser?.email || 'Explorer'}`}
                >
                  <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate max-w-[90px] font-semibold">
                    {userProfile?.displayName || currentUser?.email?.split('@')[0] || 'Explorer'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="p-1.5 rounded-full bg-black/40 hover:bg-red-950/40 border border-white/10 hover:border-red-400/40 text-stone-400 hover:text-red-300 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-1.5 border-l border-white/10">
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-[0_4px_16px_rgba(245,158,11,0.25)] transition-all cursor-pointer active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>
            )}

            {/* Quick Expedition Drawer Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-full bg-black/30 border border-white/10 text-stone-300 hover:text-white hover:border-white/30 transition-all cursor-pointer"
              title="More Expedition Views (Stats, History, Settings)"
            >
              <Menu className="w-3.5 h-3.5" />
            </button>
          </nav>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-1 xs:gap-2 md:hidden shrink-0">
            <AIStatusIndicator compact={true} />
            <div className="hidden sm:block">
              <PWAStatusBadge />
            </div>

            {/* Mobile Auth Button */}
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => handleNavClick('/settings')}
                className="p-2 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 cursor-pointer"
                title={`Signed in as ${userProfile?.displayName || 'Explorer'}`}
              >
                <UserIcon className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 font-bold text-[11px] font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <LogIn className="w-3 h-3" />
                <span>Log In</span>
              </button>
            )}

            <button
              onClick={toggleSound}
              className={`p-2 rounded-full border transition-all ${
                ambientPlaying
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  : 'bg-black/40 text-stone-300 border-white/10'
              }`}
            >
              {ambientPlaying ? <Volume2 className="w-3.5 h-3.5 xs:w-4 xs:h-4 animate-pulse text-amber-300" /> : <VolumeX className="w-3.5 h-3.5 xs:w-4 xs:h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-full bg-black/40 border border-white/15 text-stone-200 hover:text-white cursor-pointer"
            >
              <Menu className="w-4 h-4 xs:w-5 xs:h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Illustrated Slide-in Drawer for all application destinations */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-12 overflow-y-auto max-h-screen animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 sm:pb-6">
            <span className="font-editorial text-xl sm:text-2xl font-bold tracking-widest text-white">
              TRAILMIND
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-stone-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="space-y-6 my-auto py-6 sm:py-8">
            {/* Firebase Account Status Banner in Drawer */}
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between gap-3">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold font-mono">
                      {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'E'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white font-mono flex items-center gap-2">
                        <span>{userProfile?.displayName || 'Explorer'}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-normal">
                          {userProfile?.experienceLevel || 'Novice Explorer'}
                        </span>
                      </div>
                      <div className="text-xs text-stone-400 font-mono truncate max-w-[180px] xs:max-w-[240px]">
                        {currentUser?.email}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="p-2 rounded-xl bg-black/40 hover:bg-red-950/40 border border-white/10 hover:border-red-400/40 text-stone-300 hover:text-red-300 text-xs font-mono transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                      FIREBASE ACCOUNT
                    </div>
                    <div className="text-xs text-stone-300 mt-0.5">
                      Sync treks, memories & statistics to the cloud
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('signin');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-400">
                NAVIGATION PORTAL
              </div>
              <div className="sm:hidden">
                <PWAStatusBadge />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleNavClick('/explore')}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-editorial text-xl font-bold text-white">Explore</div>
                  <div className="text-xs text-stone-400">Calibrate your time & surroundings</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => handleNavClick(hasActiveAdventure ? '/adventure' : '/mission')}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-editorial text-xl font-bold text-white">Adventures</div>
                  <div className="text-xs text-stone-400">Active mission & live outdoor compass</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => handleNavClick('/memories')}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-editorial text-xl font-bold text-white">Memories</div>
                  <div className="text-xs text-stone-400">Scrapbook of outdoor field logs</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => handleNavClick('/stats')}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-editorial text-xl font-bold text-white">Immersion Stats</div>
                  <div className="text-xs text-stone-400">Real outdoor minutes & biome count</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => handleNavClick('/history')}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-editorial text-xl font-bold text-white">Expedition History</div>
                  <div className="text-xs text-stone-400">Chronological trail archives & re-runs</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => handleNavClick('/settings')}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-editorial text-xl font-bold text-white">Settings</div>
                  <div className="text-xs text-stone-400">Guide speech, chimes, audio tuning</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex items-center justify-between text-xs text-stone-400">
            <span>TrailMind · AI that gets you outside</span>
            <button
              onClick={handleAboutClick}
              className="text-amber-300 hover:text-amber-200 underline"
            >
              Story Journey
            </button>
          </div>
        </div>
      )}
    </>
  );
};
