import React from 'react';
import { MountainHeroScene } from '../components/scenes/MountainHeroScene';
import { ForestScene } from '../components/scenes/ForestScene';
import { WaterfallRiverScene } from '../components/scenes/WaterfallRiverScene';
import { NightForestScene } from '../components/scenes/NightForestScene';
import { AdventureCtaScene } from '../components/scenes/AdventureCtaScene';
import { Adventure } from '../types';
import { saveCurrentAdventure } from '../utils/storage';

interface LandingPageProps {
  onNavigate: (route: string) => void;
  onSelectAdventure: (adv: Adventure) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onSelectAdventure,
}) => {
  const handleStartJourney = () => {
    onNavigate('/explore');
  };

  const handleLaunchCurated = (exp: Adventure) => {
    saveCurrentAdventure(exp);
    onSelectAdventure(exp);
    onNavigate('/mission');
  };

  return (
    <div className="relative w-full bg-[#070c14] overflow-x-hidden select-none">
      {/* Section 1: 100vh Multi-Layer Illustrated Mountain Landscape (Dawn / Alpine Crest) */}
      <MountainHeroScene
        onStartJourney={handleStartJourney}
        onExploreClick={() => onNavigate('/explore')}
      />

      {/* Section 2: Deep Sunlit Ancient Forest & Canopy Whispers */}
      <ForestScene />

      {/* Section 3: Tiered Roaring Waterfall & Riparian Current */}
      <WaterfallRiverScene />

      {/* Section 4: The Starlit Night Forest, Fireflies & Deep Perspective */}
      <NightForestScene />

      {/* Section 5: The Adventure Horizon CTA & Expedition Launchers */}
      <AdventureCtaScene
        onStartExplore={() => onNavigate('/explore')}
        onLaunchCurated={handleLaunchCurated}
      />
    </div>
  );
};
