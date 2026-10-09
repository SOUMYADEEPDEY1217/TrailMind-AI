import React, { useState, useEffect } from 'react';
import { Navbar, RoutePath } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { MissionPage } from './pages/MissionPage';
import { AdventurePage } from './pages/AdventurePage';
import { CompletePage } from './pages/CompletePage';
import { MemoriesPage } from './pages/MemoriesPage';
import { HistoryPage } from './pages/HistoryPage';
import { StatsPage } from './pages/StatsPage';
import { SettingsPage } from './pages/SettingsPage';
import { Adventure, CompletedMemory } from './types';
import {
  getCurrentAdventure,
  saveCurrentAdventure,
  getActiveSession,
  DEFAULT_PREFERENCES,
} from './utils/storage';
import { CURATED_EXPEDITIONS, generateAdventure } from './utils/adventureEngine';
import { recordAdventureCompletionInFirestore } from './services/firebase';

export default function App() {
  const { currentUser } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<RoutePath>(() => {
    const path = window.location.pathname as RoutePath;
    const validPaths: RoutePath[] = [
      '/',
      '/explore',
      '/mission',
      '/adventure',
      '/complete',
      '/memories',
      '/history',
      '/stats',
      '/settings',
    ];
    return validPaths.includes(path) ? path : '/';
  });

  const [currentAdventure, setCurrentAdventure] = useState<Adventure | null>(() => {
    return getCurrentAdventure() || CURATED_EXPEDITIONS[0];
  });

  const [completionData, setCompletionData] = useState<{
    elapsedSeconds: number;
    waypointsCompleted: number;
    photos: string[];
    notes: string[];
  } | null>(null);

  const [hasActiveAdventure, setHasActiveAdventure] = useState<boolean>(() => {
    return !!getActiveSession();
  });

  // Sync route with browser history
  const handleNavigate = (route: string) => {
    const validRoute = route as RoutePath;
    setCurrentRoute(validRoute);
    window.history.pushState({}, '', validRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname as RoutePath;
      const validPaths: RoutePath[] = [
        '/',
        '/explore',
        '/mission',
        '/adventure',
        '/complete',
        '/memories',
        '/history',
        '/stats',
        '/settings',
      ];
      if (validPaths.includes(path)) {
        setCurrentRoute(path);
      } else {
        setCurrentRoute('/');
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleSelectAdventure = (adv: Adventure) => {
    setCurrentAdventure(adv);
    saveCurrentAdventure(adv);
  };

  const handleStartAdventure = () => {
    setHasActiveAdventure(true);
  };

  const handleCompleteAdventure = (summary: {
    elapsedSeconds: number;
    waypointsCompleted: number;
    photos: string[];
    notes: string[];
  }) => {
    setCompletionData(summary);
    setHasActiveAdventure(false);

    // If user is authenticated with Firebase, record adventure in Firestore
    if (currentUser && currentAdventure) {
      recordAdventureCompletionInFirestore(currentUser.uid, {
        title: currentAdventure.title,
        durationMinutes: Math.max(1, Math.round(summary.elapsedSeconds / 60)),
        rating: 5,
        reflection: summary.notes?.[0] || 'Outdoor trek completed',
      });
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-body selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navbar (Hidden in Active Adventure mode for pure outdoor focus) */}
      {currentRoute !== '/adventure' && (
        <Navbar
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          hasActiveAdventure={hasActiveAdventure}
        />
      )}

      {/* Main Page Viewport */}
      <main className="flex-1">
        {currentRoute === '/' && (
          <LandingPage
            onNavigate={handleNavigate}
            onSelectAdventure={handleSelectAdventure}
          />
        )}

        {currentRoute === '/explore' && (
          <ExplorePage
            onNavigate={handleNavigate}
            onAdventureCreated={handleSelectAdventure}
          />
        )}

        {currentRoute === '/mission' && (
          <MissionPage
            adventure={currentAdventure}
            onNavigate={handleNavigate}
            onStartAdventure={handleStartAdventure}
          />
        )}

        {currentRoute === '/adventure' && (
          <AdventurePage
            adventure={currentAdventure}
            onNavigate={handleNavigate}
            onCompleteAdventure={handleCompleteAdventure}
          />
        )}

        {currentRoute === '/complete' && (
          <CompletePage
            adventure={currentAdventure}
            completionData={completionData}
            onNavigate={handleNavigate}
            onMemorySaved={() => {}}
          />
        )}

        {currentRoute === '/memories' && (
          <MemoriesPage
            onNavigate={handleNavigate}
            onSelectAdventureFromMemory={(mem: CompletedMemory) => {
              const newAdv = generateAdventure({
                ...DEFAULT_PREFERENCES,
                timeMinutes: mem.duration || mem.outdoorMinutes,
                environment: mem.biome,
              });
              newAdv.title = mem.mission || mem.title;
              handleSelectAdventure(newAdv);
              handleNavigate('/mission');
            }}
          />
        )}

        {currentRoute === '/history' && (
          <HistoryPage
            onNavigate={handleNavigate}
            onReRunAdventure={(title: string) => {
              const stored = getCurrentAdventure();
              if (stored) {
                setCurrentAdventure(stored);
              }
            }}
          />
        )}

        {currentRoute === '/stats' && (
          <StatsPage onNavigate={handleNavigate} />
        )}

        {currentRoute === '/settings' && (
          <SettingsPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Quiet Minimal Footer (Clean Editorial, hidden during active adventure) */}
      {currentRoute !== '/adventure' && (
        <footer className="border-t border-white/10 bg-[#050912] py-8 text-xs text-stone-400">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="font-editorial text-lg font-bold tracking-widest text-white">TRAILMIND</span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span className="text-stone-300">AI that gets you outside.</span>
            </div>
            <div className="flex items-center gap-6 text-xs uppercase tracking-widest text-stone-400">
              <button onClick={() => handleNavigate('/explore')} className="hover:text-amber-300 transition-colors">
                Explore
              </button>
              <button onClick={() => handleNavigate('/mission')} className="hover:text-amber-300 transition-colors">
                Mission
              </button>
              <button onClick={() => handleNavigate('/memories')} className="hover:text-amber-300 transition-colors">
                Memories
              </button>
              <button onClick={() => handleNavigate('/stats')} className="hover:text-amber-300 transition-colors">
                Stats
              </button>
              <button onClick={() => handleNavigate('/history')} className="hover:text-amber-300 transition-colors">
                History
              </button>
              <button onClick={() => handleNavigate('/settings')} className="hover:text-amber-300 transition-colors">
                Settings
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Global Firebase Auth Modal (Sign In, Sign Up, Password Reset) */}
      <AuthModal />
    </div>
  );
}
