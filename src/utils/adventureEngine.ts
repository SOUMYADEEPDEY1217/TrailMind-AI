import { Adventure, BiomeEnvironment, EnergyLevel, MoodType, UserPreferences, Waypoint } from '../types';
import { generateOfflineAdventure, BUILT_IN_MISSION_TEMPLATES, MissionTemplate } from './offlineAdventureEngine';

export { generateOfflineAdventure, BUILT_IN_MISSION_TEMPLATES };
export type { MissionTemplate };

interface GenerationContext {
  timeMinutes: number;
  mood: MoodType;
  energy: EnergyLevel;
  environment: BiomeEnvironment;
  sensoryFocus: string;
}

const BIOME_NAMES: Record<string, string> = {
  Neighborhood: 'Quiet Neighborhood & Alleys',
  City: 'Urban Greenway & Architecture',
  Park: 'Public Park & Pocket Canopy',
  Campus: 'Open Grounds & Tree Corridor',
  Garden: 'Botanical Garden & Soil Beds',
  Forest: 'Pine Needle & Deep Forest Way',
  Trail: 'Natural Trail & Ridgeline',
  Riverside: 'Riparian River Edge & Waters',
  Beach: 'Coastal Shoreline & Sea Salt Winds',
  Countryside: 'Open Countryside & Meadow Horizon',
  urban_park: 'Urban Canopy & Pocket Park',
  forest_trail: 'Pine Needle & Forest Way',
  neighborhood_alley: 'Old Neighborhood & Brickway',
  waterfront: 'Riparian Edge & Shoreline',
  open_meadow: 'Open Meadow & Grassland Crest',
  backyard: 'Micro-Biome & Garden Perimeter',
};

const MOOD_TARGETS: Record<string, string> = {
  Stressed: 'Decompress optic nerve tension and trade digital alerts for natural acoustic depth',
  Bored: 'Awaken curious peripheral perception with unexpected micro-botanical and architectural detail',
  Tired: 'Gentle circulation boost with fresh oxygen, sunlight absorption, and unhurried pacing',
  Curious: 'Field investigation of living lichens, weathered stone, and bird flight paths',
  Adventurous: 'Explore an unfamiliar corner or summit elevation with an active exploratory cadence',
  Happy: 'Celebrate vitality under the open sky and deepen positive neurochemistry through sunlight',
  'Need Focus': 'Break cognitive loop fatigue by resetting eye convergence to the infinite horizon',
  overstimulated: 'Decompress optic nerve strain and trade screen noise for natural acoustic depth',
  sluggish: 'Awaken nervous system through brisk oxygenation, elevation gain, and tactile contact',
  anxious: 'Ground somatic tension into the earth with cadence pacing and horizon gazing',
  creative_block: 'Break repetitive thought loops by shifting focal length from 15 inches to infinity',
  energized: 'Channel vitality into an exploratory sprint toward natural elevation or boundary markers',
};

export function generateAdventure(prefs: UserPreferences): Adventure {
  return generateOfflineAdventure(prefs);
}

function buildAdventureTitle(env: string, act: string, mood: string): string {
  const titlesByEnv: Record<string, string[]> = {
    Forest: [
      'The Moss Corridor & Pine Scent Trail',
      'The Canopy Whisper Expedition',
      'Granite Bed & Fern Shadow Path',
      'The Deep Root Sanctuary',
    ],
    forest_trail: [
      'The Moss Corridor & Pine Scent Trail',
      'The Canopy Whisper Expedition',
      'Granite Bed & Fern Shadow Path',
      'The Deep Root Way',
    ],
    Riverside: [
      'The Riparian Edge & Shore Wind Stride',
      'Current & Stone Observation Trek',
      'The Waterline Reflection Path',
      'Riverbank Mist & River Stones',
    ],
    waterfront: [
      'The Riparian Edge & Shore Wind Stride',
      'Current & Stone Observation Trek',
      'The Waterline Reflection Path',
      'Riverbank Mist & Gravel Walk',
    ],
    Beach: [
      'The Tidal Shoreline & Sea Drift Stride',
      'Salt Mist & Dune Grass Observation',
      'The Ocean Horizon Line Arc',
      'Shell & Tidepool Coastal Trek',
    ],
    Park: [
      'The Green Corridor & Pocket Sanctuary',
      'Sunlight Foliage & Birdsong Pocket',
      'The Great Lawn Perimeter Drift',
      'Ancient Oak & Granite Bench Walk',
    ],
    urban_park: [
      'The Pocket Sanctuary & Canopy Sweep',
      'The Urban Edge & Stone Steps Walk',
      'Sunlight Foliage & Birdsong Pocket',
      'The Green Corridor Drift',
    ],
    Trail: [
      'The Ridge Crest & Mountain Elevation',
      'Granite Step & Switchback Horizon',
      'The Windward Ridge Walk',
      'The High Viewpoint Ascent',
    ],
    Neighborhood: [
      'The Brickway & Wild Flora Hunt',
      'Secret Alley & Old Fence Botanical Walk',
      'Neighborhood Perimeter & Tree Census',
      'The Quiet Street Horizon Arc',
    ],
    City: [
      'Urban Skyline & Stone Facade Walk',
      'The Dappled Plaza & Canopy Pocket',
      'Architectural Geometry & Cloud Scan',
      'The Rooftop & Alley Discovery Stride',
    ],
    Campus: [
      'Historic Quad & Leaf Canopy Orbit',
      'The Brick Arch & Open Lawn Walk',
      'Stone Steps & Ancient Elms Promenade',
      'Library Lawn to Stream Ridge',
    ],
    Garden: [
      'The Living Flora & Scented Soil Bed',
      'Botanical Diversity & Pollinator Path',
      'The Herbaceous Border Walk',
      'Dappled Trellis & Moss Basin',
    ],
    Countryside: [
      'The Open Meadow & Windmill Arc',
      'Hayfield Perimeter & Wild Chicory Walk',
      'Rolling Hill Crest & Open Breeze',
      'The Farm Lane Horizon Stride',
    ],
    open_meadow: [
      'The Tall Grass & Horizon Sweep',
      'Sunward Meadow Crest & Wind Map',
      'The Earth Ridge Observation',
      'Wildflower Perimeter Stride',
    ],
  };

  const pool = titlesByEnv[env] || titlesByEnv.Forest || titlesByEnv.forest_trail;
  const index = Math.abs((mood.length * 3 + act.length * 7)) % pool.length;
  return pool[index];
}

function buildAdventureSubtitle(mins: number, energy: string, env: string): string {
  const normEnergy = energy.toLowerCase();
  const pace = normEnergy === 'high' ? 'brisk cadence' : normEnergy === 'medium' ? 'steady unhurried stride' : 'mindful slow pacing';
  const name = BIOME_NAMES[env] || env;
  return `A ${mins}-minute outdoor recalibration in ${name} at a ${pace}.`;
}

function getSensoryArtifact(focus: string, env: BiomeEnvironment): string {
  switch (focus) {
    case 'scents_flora':
      return 'Crush a fallen dry leaf or needle in your palm and identify two distinct aromatic notes.';
    case 'soil_textures':
      return 'Locate a patch of exposed earth, stone, or bark and press your fingertips to it for 10 seconds.';
    case 'sunlight_shadows':
      return 'Find where dappled light cuts through leaves or buildings, and observe the boundary line.';
    case 'open_sky':
      return 'Stop at an unobstructed viewpoint and track a cloud movement against a fixed silhouette for 60 seconds.';
    case 'wind_soundscape':
    default:
      return 'Close your eyes for 30 seconds and count how many non-mechanical sounds you can isolate.';
  }
}

function buildWaypoints(
  totalMins: number,
  count: number,
  mood: MoodType,
  energy: EnergyLevel,
  env: BiomeEnvironment,
  sensoryFocus: string,
  act: string
): Waypoint[] {
  const stepMinutes = Math.max(2, Math.floor(totalMins / count));
  const remaining = totalMins - stepMinutes * (count - 1);

  const waypoints: Waypoint[] = [];

  // 1. Transition Threshold
  waypoints.push({
    id: 'wp-1',
    order: 1,
    title: 'The Threshold Step',
    durationMinutes: stepMinutes,
    checkpointType: 'transition',
    sensoryPrompt: 'Cross your doorway or threshold. Exhale deeply. Let the temperature shift across your face register fully before taking a step.',
    actionChallenge: 'Walk 100 paces in complete silence. No checking notifications. Lock your device into your pocket now.',
    audioCueText: 'You are now crossing the threshold. Put your phone away. Feel the outdoor air on your face. Walk one hundred steady paces.',
  });

  // 2. Sensory Immersion
  const immersionDuration = count === 3 ? stepMinutes : Math.floor(stepMinutes * 1.2);
  waypoints.push({
    id: 'wp-2',
    order: 2,
    title: 'The Sensory Tuning Fork',
    durationMinutes: immersionDuration,
    checkpointType: 'immersion',
    sensoryPrompt: getImmersionPrompt(sensoryFocus, env),
    actionChallenge: 'Slow your stride by 20%. Let your peripheral vision expand outward instead of fixating on the ground directly ahead.',
    audioCueText: 'Waypoint reached. Soften your gaze and expand your peripheral vision. Notice the ambient sounds and textures around you.',
  });

  // 3. Discovery / Artifact Quest
  if (count >= 4) {
    waypoints.push({
      id: 'wp-3',
      order: 3,
      title: 'Micro-Observation Quest',
      durationMinutes: stepMinutes,
      checkpointType: 'discovery',
      sensoryPrompt: 'Search for signs of resilience in this environment: moss in a crack, an unkempt branch reaching for sun, or mineral patterns on stone.',
      actionChallenge: 'Touch one natural texture. Examine its detail from 4 inches away as if you are a field naturalist.',
      audioCueText: 'Discovery checkpoint. Find one natural artifact—a stone, a leaf, or bark texture. Give it your complete tactile focus.',
    });
  }

  // 4. Stillness / Altitude Checkpoint (if 5 waypoints)
  if (count >= 5) {
    waypoints.push({
      id: 'wp-4',
      order: 4,
      title: 'The Horizon Stillness',
      durationMinutes: stepMinutes,
      checkpointType: 'stillness',
      sensoryPrompt: 'Stop in place. Stand with feet shoulder-width apart. Feel the weight of your body transferring straight into the ground.',
      actionChallenge: 'Take 5 deep nasal breaths. With each exhale, drop your shoulders away from your ears.',
      audioCueText: 'Pause here. Stop all movement for sixty seconds. Take five deep nasal breaths, letting the outside world settle around you.',
    });
  }

  // Final: Return & Internalize
  waypoints.push({
    id: `wp-${count}`,
    order: count,
    title: 'The Recalibrated Return',
    durationMinutes: remaining,
    checkpointType: 'return',
    sensoryPrompt: 'Turn toward home or your endpoint. Notice the difference in your mental tempo compared to when you first stepped out.',
    actionChallenge: 'Pick a memory anchor: an image, a scent, or a feeling of cool air in your lungs to carry back indoors.',
    audioCueText: 'Final leg. Begin your return journey at an easy cadence. Notice how your breathing and thoughts have cleared.',
  });

  return waypoints;
}

function getImmersionPrompt(focus: string, env: BiomeEnvironment): string {
  switch (focus) {
    case 'scents_flora':
      return 'Breathe in deeply through your nose. Can you detect pine, damp soil, crushed clover, or fresh rainwater?';
    case 'wind_soundscape':
      return 'Tune your ears like an antenna. Separate close sounds (footsteps, fabric) from distant ones (leaves swaying, birds, distant water).';
    case 'soil_textures':
      return 'Notice the feedback under the soles of your shoes. Is it packed granite, loose gravel, springy loam, or cool stone?';
    case 'sunlight_shadows':
      return 'Look up through the canopy or architectural rooflines. Track where warm sunlight creates high contrast against cool shadows.';
    default:
      return 'Look upward toward the tree line or horizon. Track 3 distinct shapes moving with the breeze.';
  }
}

export const CURATED_EXPEDITIONS: Adventure[] = [
  {
    id: 'curated-sensory-reset',
    title: 'The 15-Minute Sensory Reset',
    subtitle: 'A high-impact decompression walk designed to purge digital fatigue.',
    classification: 'URBAN PARK // 15 MIN // LOW ENERGY',
    targetMinutes: 15,
    biome: 'urban_park',
    energyLevel: 'low',
    moodTarget: 'Immediate relief for screen-weary eyes and overstimulated cognition',
    screenOffPromise: '60 seconds on screen. 14 minutes with phone stowed.',
    primarySensoryArtifact: 'Find one living leaf with dew or rain and observe its vein geometry.',
    gearChecklist: ['Comfortable slip-on shoes', 'Phone in pocket on silent'],
    audioBriefing: 'This is your 15-minute sanctuary. Step out your door, put your phone away, and let the outside world absorb your mental noise.',
    createdAt: new Date().toISOString(),
    elevationMeters: 5,
    difficulty: 'Gentle',
    waypoints: [
      {
        id: 'c1-1',
        order: 1,
        title: 'The Threshold Step',
        durationMinutes: 3,
        checkpointType: 'transition',
        sensoryPrompt: 'Cross your threshold. Feel the air temperature drop or rise. Keep your eyes up at eye level or higher.',
        actionChallenge: 'Walk 100 paces without looking down.',
        audioCueText: 'Begin your walk. Keep your gaze up and forward. Phone goes into your pocket now.',
      },
      {
        id: 'c1-2',
        order: 2,
        title: 'Sound Horizon Scan',
        durationMinutes: 7,
        checkpointType: 'immersion',
        sensoryPrompt: 'Tune in to the farthest audible sound. Hold your attention on it for 10 strides.',
        actionChallenge: 'Touch the bark of one tree or the cool surface of stone along your path.',
        audioCueText: 'Tune into your ears. Notice the subtle background sounds around you. Touch one natural surface.',
      },
      {
        id: 'c1-3',
        order: 3,
        title: 'The Clear-Headed Return',
        durationMinutes: 5,
        checkpointType: 'return',
        sensoryPrompt: 'Turn back toward your starting point. Notice the sensation of relaxed shoulder muscles.',
        actionChallenge: 'Inhale 4 counts, hold 2, exhale 6 as you walk back.',
        audioCueText: 'Final stretch. Return at an easy pace with slow, calming breaths.',
      },
    ],
  },
  {
    id: 'curated-forest-canopy',
    title: 'Canopy Whisper & Pine Way',
    subtitle: 'An immersive 25-minute forest walk with tactile flora mapping.',
    classification: 'FOREST TRAIL // 25 MIN // MEDIUM ENERGY',
    targetMinutes: 25,
    biome: 'forest_trail',
    energyLevel: 'medium',
    moodTarget: 'Deep physiological calming through natural phytoncides and soft fascination',
    screenOffPromise: 'Full outdoor immersion. Phone audio cues keep time so you do not have to look.',
    primarySensoryArtifact: 'Locate a patch of lichen or moss growing on north-facing bark.',
    gearChecklist: ['Sturdy shoes', 'Light windbreaker', 'Hands free'],
    audioBriefing: 'Welcome to the forest corridor. Let the canopy enclose your field of view. The trail guide will chime at each milestone.',
    createdAt: new Date().toISOString(),
    elevationMeters: 28,
    difficulty: 'Moderate',
    waypoints: [
      {
        id: 'c2-1',
        order: 1,
        title: 'Entering the Green Field',
        durationMinutes: 5,
        checkpointType: 'transition',
        sensoryPrompt: 'Step into the dirt or needle path. Inhale the scent of damp earth and decaying wood.',
        actionChallenge: 'Count 20 breath cycles while maintaining a steady rhythm.',
        audioCueText: 'You are on the trail. Breathe in deeply through your nose. Maintain an unhurried, steady stride.',
      },
      {
        id: 'c2-2',
        order: 2,
        title: 'Micro-Flora Investigation',
        durationMinutes: 8,
        checkpointType: 'discovery',
        sensoryPrompt: 'Inspect the forest floor. Notice the layers of fallen leaves, twigs, and moss cushions.',
        actionChallenge: 'Find one fallen pinecone, acorn, or textured stone. Hold it in your palm for 1 minute.',
        audioCueText: 'Checkpoint two. Look closely at the forest floor. Notice the organic textures and patterns.',
      },
      {
        id: 'c2-3',
        order: 3,
        title: 'The Canopy Stillness',
        durationMinutes: 6,
        checkpointType: 'stillness',
        sensoryPrompt: 'Find a safe clearing. Stop and look directly up through the interlocking branch crowns.',
        actionChallenge: 'Stay motionless for 60 seconds. Feel the wind moving through the upper branches.',
        audioCueText: 'Pause here. Look straight up into the branches. Stand in stillness for sixty seconds.',
      },
      {
        id: 'c2-4',
        order: 4,
        title: 'The Grounded Descent',
        durationMinutes: 6,
        checkpointType: 'return',
        sensoryPrompt: 'Walk back with light feet. Notice how quiet your internal monologue has become.',
        actionChallenge: 'Memorize one view or texture to recall later when sitting at your desk.',
        audioCueText: 'Return leg initiated. Stride easily and carry the forest quiet back with you.',
      },
    ],
  },
  {
    id: 'curated-twilight-threshold',
    title: 'The Twilight Horizon Sweep',
    subtitle: 'Catch the day-to-night gradient and observe the changing soundscape.',
    classification: 'OPEN MEADOW // 30 MIN // MEDIUM ENERGY',
    targetMinutes: 30,
    biome: 'open_meadow',
    energyLevel: 'medium',
    moodTarget: 'Reset circadian rhythm and dissolve cognitive tunnel vision',
    screenOffPromise: 'Zero screen glancing. Let your eyes adapt to the evening ambient light naturally.',
    primarySensoryArtifact: 'Locate the brightest planet or star emerging in the twilight gradient.',
    gearChecklist: ['Warm evening layer', 'Safe reflective element', 'Stowed phone'],
    audioBriefing: 'Twilight is the magic threshold. As the light softens, your eyes expand. Let the evening wind clear your mind.',
    createdAt: new Date().toISOString(),
    elevationMeters: 40,
    difficulty: 'Moderate',
    waypoints: [
      {
        id: 'c3-1',
        order: 1,
        title: 'The Amber Light Walk',
        durationMinutes: 7,
        checkpointType: 'transition',
        sensoryPrompt: 'Look toward the western horizon. Observe the amber and violet tones spreading through the clouds.',
        actionChallenge: 'Walk toward the highest point or open crest near you.',
        audioCueText: 'Begin your evening trek. Seek open sky. Let your eyes adjust to the soft natural twilight.',
      },
      {
        id: 'c3-2',
        order: 2,
        title: 'The Evening Shift',
        durationMinutes: 10,
        checkpointType: 'immersion',
        sensoryPrompt: 'Feel the rapid cooling of the air as the sun drops lower. Notice how birds change their evening calls.',
        actionChallenge: 'Stop and face into the wind for 10 slow breaths.',
        audioCueText: 'Feel the evening breeze cooling your skin. Notice the transition from daytime to dusk.',
      },
      {
        id: 'c3-3',
        order: 3,
        title: 'First Star Observation',
        durationMinutes: 7,
        checkpointType: 'stillness',
        sensoryPrompt: 'Scan the zenith sky for the first point of starlight or the crescent moon.',
        actionChallenge: 'Stand completely still and listen for crickets, wind, or nocturnal rustles.',
        audioCueText: 'Look up into the darkening sky. Stand still and let the quietness of night sink in.',
      },
      {
        id: 'c3-4',
        order: 4,
        title: 'The Settled Return',
        durationMinutes: 6,
        checkpointType: 'return',
        sensoryPrompt: 'Return with night-adapted vision. Notice how grounded your footsteps feel in the dark.',
        actionChallenge: 'Hold the calm stillness in your posture as you approach your home doorway.',
        audioCueText: 'Return journey begins. Walk with steady, confident steps back into warmth.',
      },
    ],
  },
];
