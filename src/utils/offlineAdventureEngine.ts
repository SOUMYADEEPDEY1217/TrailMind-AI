import { Adventure, BiomeEnvironment, EnergyLevel, MoodType, UserPreferences, Waypoint } from '../types';

export interface MissionTemplate {
  id: string;
  category:
    | 'Walking'
    | 'Nature observation'
    | 'Photography'
    | 'Running'
    | 'Mindfulness'
    | 'Bird watching'
    | 'Fitness'
    | 'Campus exploration'
    | 'Neighborhood exploration'
    | 'Gardening'
    | 'Color hunts'
    | 'Sound hunts'
    | 'Cloud watching'
    | 'Texture hunts'
    | 'Seasonal exploration';
  titleBase: string;
  descriptionBase: string;
  suitableEnvironments: BiomeEnvironment[];
  sensoryArtifact: string;
  generateTasks: (ctx: TemplateContext) => string[];
  bonusTask: (ctx: TemplateContext) => string;
  safetyTip: (ctx: TemplateContext) => string;
}

export interface TemplateContext {
  timeMinutes: number;
  timeLabel: string;
  mood: MoodType;
  energy: EnergyLevel;
  environment: BiomeEnvironment;
  activity: string;
  normalizedEnergy: 'Low' | 'Medium' | 'High';
}

const BIOME_NOUNS: Record<string, { ground: string; feature: string; canopy: string; aroma: string }> = {
  Forest: { ground: 'pine needles and leaf litter', feature: 'mossy tree trunks and ferns', canopy: 'dense forest canopy', aroma: 'rich damp earth and cedar resin' },
  Trail: { ground: 'packed dirt and gravel', feature: 'weathered granite boulders and switchbacks', canopy: 'open ridgeline and sky', aroma: 'crushed dry sage and sun-warmed stone' },
  Riverside: { ground: 'river stones and damp silt', feature: 'swirling water currents and riparian reeds', canopy: 'willow boughs and water reflections', aroma: 'cool river mist and fresh freshwater' },
  Beach: { ground: 'tide-packed sand and shell fragments', feature: 'driftwood, sea foam, and tidal pools', canopy: 'infinite ocean horizon and open sky', aroma: 'salty sea spray and kelp' },
  Park: { ground: 'clover lawns and paved walkways', feature: 'ancient shade oaks and garden benches', canopy: 'interlocking leafy boughs', aroma: 'freshly cut grass and flowering shrubs' },
  Garden: { ground: 'rich organic mulch and raised beds', feature: 'flowering borders, trellises, and stone basins', canopy: 'dappled sunlight through arbor leaves', aroma: 'blooming blossoms, damp compost, and sweet soil' },
  Neighborhood: { ground: 'brick sidewalks and quiet curbs', feature: 'cottage fences, porch plantings, and vintage ironwork', canopy: 'street tree canopies and rooflines', aroma: 'woodsmoke, lawn sprinklers, and neighborhood foliage' },
  City: { ground: 'flagstone and urban pavers', feature: 'stone facades, green pocket plazas, and light wells', canopy: 'dramatic architecture against the open sky', aroma: 'roasted coffee, warm granite, and morning air' },
  Campus: { ground: 'historic brickways and quad turf', feature: 'stone arches, collegiate courtyards, and memorial benches', canopy: 'century-old elms and ivy-clad walls', aroma: 'paper birch, damp lawn, and shaded stone' },
  Countryside: { ground: 'meadow grass and agricultural lanes', feature: 'weathered wooden fenceposts and wild hedgerows', canopy: 'sweeping 360-degree horizon and towering clouds', aroma: 'sweet hay, wild clover, and prairie breeze' },
  urban_park: { ground: 'clover lawns and paved walkways', feature: 'ancient shade oaks and garden benches', canopy: 'interlocking leafy boughs', aroma: 'freshly cut grass and flowering shrubs' },
  forest_trail: { ground: 'pine needles and leaf litter', feature: 'mossy tree trunks and ferns', canopy: 'dense forest canopy', aroma: 'rich damp earth and cedar resin' },
  waterfront: { ground: 'river stones and damp silt', feature: 'swirling water currents and riparian reeds', canopy: 'willow boughs and water reflections', aroma: 'cool river mist and fresh freshwater' },
  open_meadow: { ground: 'meadow grass and agricultural lanes', feature: 'weathered wooden fenceposts and wild hedgerows', canopy: 'sweeping 360-degree horizon and towering clouds', aroma: 'sweet hay, wild clover, and prairie breeze' },
  neighborhood_alley: { ground: 'brick sidewalks and quiet curbs', feature: 'cottage fences, porch plantings, and vintage ironwork', canopy: 'street tree canopies and rooflines', aroma: 'woodsmoke, lawn sprinklers, and neighborhood foliage' },
  backyard: { ground: 'organic mulch and soil', feature: 'garden borders and stone basins', canopy: 'dappled sunlight and branches', aroma: 'blooming blossoms and damp earth' },
};

function getBiomeDetails(env: BiomeEnvironment) {
  return BIOME_NOUNS[env] || BIOME_NOUNS.Park;
}

function getMoodReliefNote(mood: string): string {
  switch (mood) {
    case 'Stressed':
      return 'release optic strain and drop tension in your jaw and shoulders';
    case 'Bored':
      return 'spark perceptual novelty by discovering unexpected micro-patterns';
    case 'Tired':
      return 'restore vitality with gentle oxygenation and natural daylight';
    case 'Curious':
      return 'satisfy naturalist fascination with forensic outdoor observation';
    case 'Adventurous':
      return 'challenge boundaries with an exploratory stride and elevated viewpoints';
    case 'Happy':
      return 'amplify natural vitality and soak in the vibrant sensory open sky';
    case 'Need Focus':
      return 'purge screen fatigue by resetting your focal length to the infinite horizon';
    default:
      return 'realign mental tempo with the calm cadence of the outdoor world';
  }
}

// 45 Built-In Mission Templates (3 per each of the 15 categories)
export const BUILT_IN_MISSION_TEMPLATES: MissionTemplate[] = [
  // ================= 1. WALKING =================
  {
    id: 'walking-perimeter-drift',
    category: 'Walking',
    titleBase: 'The Outer Perimeter Drift',
    descriptionBase: 'A continuous boundary walk skirting the outer edges of your outdoor space.',
    suitableEnvironments: ['Park', 'Campus', 'Neighborhood', 'Garden', 'Countryside', 'Trail'],
    sensoryArtifact: 'Locate where two contrasting materials meet along the path border (e.g. grass and stone).',
    generateTasks: (ctx) => {
      const bio = getBiomeDetails(ctx.environment);
      return [
        `Cross your threshold and walk toward the furthest visible perimeter edge across the ${ctx.environment.toLowerCase()}.`,
        `Follow the boundary line without crossing inward for the next ${Math.max(5, Math.floor(ctx.timeMinutes * 0.3))} minutes.`,
        `Notice how the terrain shifts underfoot along the ${bio.ground}. Maintain a steady unhurried cadence.`,
        `Stop at the most distant corner. Take 4 deep nasal breaths and ${getMoodReliefNote(ctx.mood)}.`,
        `Complete your boundary circuit at an easy return pace, keeping your eyes forward and phone stowed.`,
      ];
    },
    bonusTask: () => 'Find an overgrown natural boundary marker or old fence post reclaimed by wild flora.',
    safetyTip: () => 'Stay alert at pedestrian intersections and remain on designated public walking paths.',
  },
  {
    id: 'walking-rhythmic-cadence',
    category: 'Walking',
    titleBase: 'The Dual-Tempo Cadence Stride',
    descriptionBase: 'An alternating rhythm walk coordinating stride speed with lung capacity.',
    suitableEnvironments: ['Neighborhood', 'Trail', 'Park', 'Riverside', 'Campus', 'City'],
    sensoryArtifact: 'Sync your breath: 4 steps inhale, 4 steps exhale.',
    generateTasks: (ctx) => [
      'Step outside and lock into a slow warmup stroll for 60 paces, letting the outdoor temperature register.',
      `Shift into a brisk rhythmic cadence for 3 minutes, then decelerate into a relaxed stroll for 2 minutes. Repeat across the ${ctx.environment.toLowerCase()}.`,
      `Tune into the physical sensation of your heels striking the ground and your arms swinging naturally.`,
      `Pause near ${getBiomeDetails(ctx.environment).feature}. Stand tall with soft knees and let your heart rate settle.`,
      'Walk back at a natural fluid pace, feeling the circulation warmth in your fingers and toes.',
    ],
    bonusTask: () => 'Track 100 consecutive steps in flawless silence without shifting your gaze down.',
    safetyTip: () => 'Maintain comfortable posture and yield right-of-way to oncoming cyclists or runners.',
  },
  {
    id: 'walking-unseen-corridors',
    category: 'Walking',
    titleBase: 'The Unseen Corridors Walk',
    descriptionBase: 'An exploratory walk deliberately choosing turns and paths you have never taken.',
    suitableEnvironments: ['Neighborhood', 'City', 'Campus', 'Park', 'Trail'],
    sensoryArtifact: 'Find a narrow footway, alleyway, or dirt bypass you normally walk right past.',
    generateTasks: (ctx) => [
      'Exit your door and immediately turn in the opposite direction of your routine commute.',
      `At every fork or pathway junction, choose the path with more natural foliage and less vehicle noise.`,
      `Look up at rooflines and ${getBiomeDetails(ctx.environment).canopy} to discover architectural or botanical details you have overlooked.`,
      `Find an unfamiliar vantage point. Pause for 60 seconds to ${getMoodReliefNote(ctx.mood)}.`,
      'Navigate your way back through a parallel corridor, anchoring your sense of direction with the sky.',
    ],
    bonusTask: () => 'Spot an ancient tree or weathered structure that looks like it has stood there for decades.',
    safetyTip: () => 'Stick strictly to well-lit public rights of way and trust your situational instincts.',
  },

  // ================= 2. NATURE OBSERVATION =================
  {
    id: 'nature-micro-biome-census',
    category: 'Nature observation',
    titleBase: 'The Lichen & Micro-Biome Census',
    descriptionBase: 'A forensic naturalist walk inspecting miniature ecosystems thriving on bark and stone.',
    suitableEnvironments: ['Forest', 'Park', 'Garden', 'Trail', 'Campus', 'Riverside'],
    sensoryArtifact: 'Examine a patch of living moss or crustose lichen from 3 inches away.',
    generateTasks: (ctx) => [
      `Step outdoors and walk until you locate three mature trees or natural stone outcrops in the ${ctx.environment.toLowerCase()}.`,
      'Inspect the north-facing bark or damp stone crevice for living lichen, moss cushions, or algae colonies.',
      'Touch the texture with the pad of your index finger. Feel whether it is dry, spongy, velvety, or rough.',
      `Notice how this micro-community thrives silently away from the digital grid. ${getMoodReliefNote(ctx.mood)}.`,
      'Continue your loop noticing how many different green and grey hues exist in living bark.',
    ],
    bonusTask: () => 'Find tiny insects or water droplets resting inside a moss miniature canopy.',
    safetyTip: () => 'Do not peel or damage living moss; observe with eyes and gentle touch only.',
  },
  {
    id: 'nature-canopy-strata',
    category: 'Nature observation',
    titleBase: 'The Forest Strata & Crown Shyness Walk',
    descriptionBase: 'A vertical survey exploring nature from leaf litter roots to interlocking treetops.',
    suitableEnvironments: ['Forest', 'Park', 'Campus', 'Trail', 'Riverside'],
    sensoryArtifact: 'Look straight up into the interlocking tree crowns to find channels of open sky.',
    generateTasks: (ctx) => [
      `Walk into the deepest green area of the ${ctx.environment.toLowerCase()} at an unhurried, silent pace.`,
      'Stop beneath the tallest tree canopy. Look straight up 90 degrees at the crown branches.',
      'Observe "crown shyness": the delicate winding gaps where treetops avoid touching one another.',
      'Shift your gaze down to the leaf litter and root network anchoring into the soil.',
      'Walk back feeling the protective acoustic barrier created by the high canopy overhead.',
    ],
    bonusTask: () => 'Identify three distinct leaf shapes from three different plant species on the same branch line.',
    safetyTip: () => 'Mind your footing on exposed roots and wet leaf litter to prevent slipping.',
  },
  {
    id: 'nature-flora-survivalists',
    category: 'Nature observation',
    titleBase: 'The Pavement Cracks & Pioneer Plants',
    descriptionBase: 'A naturalist hunt for wild flora thriving in improbable urban and stone crevices.',
    suitableEnvironments: ['City', 'Neighborhood', 'Campus', 'Park'],
    sensoryArtifact: 'Locate a resilient plant flowering out of asphalt, brick mortar, or stone.',
    generateTasks: (ctx) => [
      'Walk slowly with your gaze angled toward the ground and building foundations.',
      'Hunt for pioneer plants: dandelion rosettes, plantain leaves, clover, or wild grasses breaking through concrete.',
      'Admire the sheer biological resilience of living green pushing through stone.',
      `Take a long grounding breath. Let the plant\'s quiet resilience remind you to ${getMoodReliefNote(ctx.mood)}.`,
      'Return with an elevated appreciation for life persisting in overlooked corners.',
    ],
    bonusTask: () => 'Find tiny seeds or spore heads waiting for the wind on a sidewalk weed.',
    safetyTip: () => 'Stay cautious of curbs, driveways, and street traffic while inspecting low areas.',
  },

  // ================= 3. PHOTOGRAPHY =================
  {
    id: 'photo-shadow-geometry',
    category: 'Photography',
    titleBase: 'The Shadow Geometry & Negative Space Hunt',
    descriptionBase: 'Train your photographer eye to compose shots using cast shadows and dramatic angles.',
    suitableEnvironments: ['City', 'Neighborhood', 'Campus', 'Park', 'Riverside', 'Trail'],
    sensoryArtifact: 'Frame a shot with your fingers showing high contrast between light and shade.',
    generateTasks: (ctx) => [
      `Step outside and search for where direct sunlight casts sharp geometric shadows against ${getBiomeDetails(ctx.environment).feature}.`,
      'Create a finger frame (index fingers and thumbs) to isolate a composition without pulling out your phone.',
      'Notice how the angle of the sun defines crisp silhouettes of railings, leaves, or building cornices.',
      `Observe how the shadows move subtly in the wind. Allow your mind to ${getMoodReliefNote(ctx.mood)}.`,
      'Take only ONE intentional mental snapshot or physical photo before tucking your device away for the return.',
    ],
    bonusTask: () => 'Capture the reflection of sunlight bouncing off water or glass onto a shadowed surface.',
    safetyTip: () => 'Do not look directly into the sun while framing your composition.',
  },
  {
    id: 'photo-macro-texture',
    category: 'Photography',
    titleBase: 'The Macro Naturalist Composition',
    descriptionBase: 'A deliberate photographer hunt for striking close-up patterns in organic textures.',
    suitableEnvironments: ['Garden', 'Forest', 'Park', 'Beach', 'Trail', 'Countryside'],
    sensoryArtifact: 'Isolate a 2-inch square of natural bark, mineral crystal, or leaf veins.',
    generateTasks: (ctx) => [
      `Walk into the ${ctx.environment.toLowerCase()} until you find a richly textured natural object.`,
      'Crouch down or step close. Notice radial symmetry, vein bifurcations, or mineral striations.',
      'Compose a close-up composition where the texture completely fills your entire field of vision.',
      'Notice how extreme micro-focus eliminates mental background noise and digital anxiety.',
      'Step back, exhale fully, and walk home carrying that heightened visual acuity.',
    ],
    bonusTask: () => 'Find dew drops, water beadings, or sap droplets adhering to an organic surface.',
    safetyTip: () => 'Watch for thorny briers or stinging nettles when leaning close to flora.',
  },
  {
    id: 'photo-cinematic-golden-hour',
    category: 'Photography',
    titleBase: 'The Horizon Line & Silhouette Study',
    descriptionBase: 'Explore cinematic depth of field by framing organic silhouettes against open sky.',
    suitableEnvironments: ['Trail', 'Beach', 'Riverside', 'Countryside', 'Park', 'Campus'],
    sensoryArtifact: 'Line up an interesting tree branch, hill crest, or architectural spire against the horizon.',
    generateTasks: (ctx) => [
      `Walk toward the most unobstructed view of the horizon in the ${ctx.environment.toLowerCase()}.`,
      'Position yourself so a natural silhouette stands out boldly against the bright sky.',
      'Study the gradient in the sky from the zenith down to the earth line.',
      `Breathe in the expansive scenery. Let the wide open vista ${getMoodReliefNote(ctx.mood)}.`,
      'Return with a cleared mind and a feeling of cinematic scale in your chest.',
    ],
    bonusTask: () => 'Find birds gliding across your horizon frame and follow their trajectory until they vanish.',
    safetyTip: () => 'Maintain clear footing on edges, ridges, or waterfront seawalls.',
  },

  // ================= 4. RUNNING =================
  {
    id: 'running-fartlek-intervals',
    category: 'Running',
    titleBase: 'The Landmark Fartlek Stride',
    descriptionBase: 'Playful outdoor speed play alternating jogging with surges between natural landmarks.',
    suitableEnvironments: ['Park', 'Trail', 'Campus', 'Neighborhood', 'Riverside'],
    sensoryArtifact: 'Pick a distinct tree or lamp post 50 meters ahead as your surge landmark.',
    generateTasks: (ctx) => [
      'Warm up with a 3-minute easy jog, feeling your ankles flex and lungs expand.',
      `Pick a visible landmark (a great oak, a stone marker, or trail bend) and surge into a brisk cadence until you reach it.`,
      'Decelerate to an easy recovery jog for 90 seconds. Repeat 4 to 6 times across the route.',
      `Notice the clean rush of oxygen clearing out mental cobwebs. Feel your body ${getMoodReliefNote(ctx.mood)}.`,
      'Cooldown with a 3-minute gentle walk, rolling your shoulders back and letting your pulse normalize.',
    ],
    bonusTask: () => 'Complete one uphill surge with light, springy feet and tall posture.',
    safetyTip: () => 'Keep eyes scanned 10 paces ahead on the trail to spot uneven ground, tree roots, or loose gravel.',
  },
  {
    id: 'running-elevation-crest',
    category: 'Running',
    titleBase: 'The Ridgeline Cadence & Gradient Push',
    descriptionBase: 'An elevation-focused run building leg power and lung volume on natural inclines.',
    suitableEnvironments: ['Trail', 'Countryside', 'Park', 'Neighborhood'],
    sensoryArtifact: 'Focus on short, quick strides with toes striking right under your hips on the incline.',
    generateTasks: (ctx) => [
      'Begin with an easy jog toward the nearest natural hill, bridge ramp, or elevation gradient.',
      'Shorten your stride and pump your arms as you ascend the slope without straining.',
      'Crest the rise, turn around to face the vista, and breathe deeply in the cooler hilltop air.',
      'Descend gently with relaxed knees and an unhurried, controlled cadence.',
      'Stride home on flat ground feeling the residual surge of endorphins and clear focus.',
    ],
    bonusTask: () => 'Count 30 consecutive breaths through only your nose at the peak of the climb.',
    safetyTip: () => 'Do not overstride on downhill sections; maintain light, rapid foot strikes.',
  },
  {
    id: 'running-steady-flow',
    category: 'Running',
    titleBase: 'The Mindful Aerobic Flow Run',
    descriptionBase: 'A steady, continuous aerobic run maintaining a relaxed conversational heart rate.',
    suitableEnvironments: ['Riverside', 'Park', 'Beach', 'Trail', 'Campus', 'Neighborhood'],
    sensoryArtifact: 'Check your breathing: you should be able to speak a full sentence out loud comfortably.',
    generateTasks: (ctx) => [
      'Start with a 2-minute purposeful walk before transitioning smoothly into an effortless jog.',
      `Lock into a continuous aerobic rhythm through the ${ctx.environment.toLowerCase()}. Do not check your watch.`,
      `Listen to the ambient rhythm of your breath synchronizing with the sound of your shoe soles on ${getBiomeDetails(ctx.environment).ground}.`,
      `Let every repetitive footfall pound out stress and worry. ${getMoodReliefNote(ctx.mood)}.`,
      'Taper down into a walking finish, appreciating how light your thoughts feel after the movement.',
    ],
    bonusTask: () => 'Run a 500-meter stretch with eyes soft, taking in the full 180-degree peripheral landscape.',
    safetyTip: () => 'Stay hydrated if running for over 30 minutes in warm weather.',
  },

  // ================= 5. MINDFULNESS =================
  {
    id: 'mindful-five-senses-grounding',
    category: 'Mindfulness',
    titleBase: 'The 5-4-3-2-1 Somatic Grounding Trek',
    descriptionBase: 'A restorative sensory check-in systematically grounding your nervous system in the wild.',
    suitableEnvironments: ['Park', 'Forest', 'Garden', 'Riverside', 'Beach', 'Trail', 'Campus'],
    sensoryArtifact: 'Isolate 5 things you can see, 4 you can feel, 3 you can hear, 2 you can smell, and 1 you can taste in the air.',
    generateTasks: (ctx) => [
      `Walk for 5 minutes into the quietest corner of the ${ctx.environment.toLowerCase()} and come to a gentle stop.`,
      'Spot 5 distinct natural textures or colors in your immediate field of vision.',
      'Touch 4 physical textures: bark, cool stone, crushed leaf, or the ambient breeze on your palms.',
      'Close your eyes and isolate 3 natural sounds: birds, wind rustle, or distant water.',
      `Take 2 deep nasal breaths of ${getBiomeDetails(ctx.environment).aroma}. Notice 1 taste of fresh moisture in the air.`,
      'Walk back at a grounded, deeply calm tempo feeling renewed presence in your body.',
    ],
    bonusTask: () => 'Stand for 60 seconds with your eyes closed and feel the direction of the wind on your face.',
    safetyTip: () => 'Pick a quiet spot safely clear of bicycle trails or vehicular traffic.',
  },
  {
    id: 'mindful-horizon-infinity',
    category: 'Mindfulness',
    titleBase: 'The Infinite Horizon Optical Reset',
    descriptionBase: 'Dissolve screen-induced eye convergence by anchoring your gaze onto the distant horizon.',
    suitableEnvironments: ['Beach', 'Countryside', 'Trail', 'Riverside', 'Park', 'City'],
    sensoryArtifact: 'Find the furthest physical object on the horizon and let your eyes soften onto it.',
    generateTasks: (ctx) => [
      `Walk to an open vantage point where you have a clear view of the sky or distant horizon.`,
      'Stand with feet shoulder-width apart. Drop your shoulders down and away from your ears.',
      'Gaze at the most distant ridge, cloud formation, or tree line without focusing on any single detail.',
      'Expand your peripheral vision horizontally until you can see both sides of your hands held wide.',
      `Hold this panoramic gaze for 2 full minutes. Feel your nervous system switch from alert to tranquil calm.`,
    ],
    bonusTask: () => 'Track a bird or drifting cloud across your entire field of view without turning your neck.',
    safetyTip: () => 'Avoid looking directly at the sun while softening your optical gaze.',
  },
  {
    id: 'mindful-stillness-immersion',
    category: 'Mindfulness',
    titleBase: 'The Five-Minute Sanctuary Stillness',
    descriptionBase: 'A radical pause in physical motion, allowing the natural world to accept your presence.',
    suitableEnvironments: ['Forest', 'Garden', 'Park', 'Riverside', 'Campus'],
    sensoryArtifact: 'Become so quiet that wildlife (birds, squirrels, insects) resumes normal behavior around you.',
    generateTasks: (ctx) => [
      `Walk into the ${ctx.environment.toLowerCase()} until you find a secluded bench, boulder, or base of a tree.`,
      'Stop all physical movement. Rest your hands in your lap or at your sides.',
      'Notice how birds and insects quiet down when you arrive. Wait 2 minutes for them to resume their songs.',
      `Feel the cool or warm air moving across your neck. Allow your thoughts to settle like sediment in still water.`,
      'Bow your head slightly in gratitude to the living world before beginning your peaceful return stride.',
    ],
    bonusTask: () => 'Notice a tiny detail within arm\'s reach (an ant highway, a leaf pore, or drop of sap) that you missed while walking.',
    safetyTip: () => 'Keep warm with an extra layer if sitting still in chilly weather.',
  },

  // ================= 6. BIRD WATCHING =================
  {
    id: 'birds-perch-canopy-census',
    category: 'Bird watching',
    titleBase: 'The Canopy Perch & Silhouette Scout',
    descriptionBase: 'An attentive search tracking wild birds resting and foraging on high branches.',
    suitableEnvironments: ['Park', 'Forest', 'Campus', 'Garden', 'Riverside', 'Countryside'],
    sensoryArtifact: 'Spot a bird silhouette perched against the bright sky on a bare branch or utility wire.',
    generateTasks: (ctx) => [
      `Walk slowly through the ${ctx.environment.toLowerCase()}, keeping your gaze elevated toward branch forks.`,
      'Scan the uppermost tips of trees and shrubs for solitary silhouettes sitting watch.',
      'Watch for small sudden twitches: a tail flick, head cock, or sudden wing stretch.',
      'Observe the bird\'s foraging pattern for 90 seconds without making sudden movements.',
      'Note the bird\'s beak shape (seed-cracking wedge, insect needle, or hook) before continuing.',
    ],
    bonusTask: () => 'Observe a bird taking flight and note whether its flight style is undulating, direct, or gliding.',
    safetyTip: () => 'Keep your eyes on your footing whenever you step off smooth paved paths.',
  },
  {
    id: 'birds-acoustic-triangulation',
    category: 'Bird watching',
    titleBase: 'The Acoustic Triangulation & Birdsong Map',
    descriptionBase: 'Use stereo auditory focus to locate birds solely by their calls and chirps.',
    suitableEnvironments: ['Forest', 'Park', 'Garden', 'Riverside', 'Neighborhood', 'Campus'],
    sensoryArtifact: 'Close your eyes and point directly toward the origin of a birdsong in the trees.',
    generateTasks: (ctx) => [
      `Stop in an area surrounded by trees in the ${ctx.environment.toLowerCase()}.`,
      'Close your eyes and listen. Notice sound cues entering your left ear versus your right ear.',
      'Isolate at least 3 distinct bird voices: a high trill, a harsh caw or squawk, and a rhythmic chirp.',
      'Open your eyes and look in the exact direction of the most persistent call to locate the caller.',
      `Appreciate how tuning in to natural acoustic patterns ${getMoodReliefNote(ctx.mood)}.`,
    ],
    bonusTask: () => 'Identify a contact call between two birds replying back and forth across a clearing.',
    safetyTip: () => 'Be mindful of bicycle paths and joggers when stopping with your eyes closed.',
  },
  {
    id: 'birds-flight-pathways',
    category: 'Bird watching',
    titleBase: 'The Thermal Gliders & Aerial Pathways',
    descriptionBase: 'Track large birds, hawks, gulls, or swallows riding invisible air currents.',
    suitableEnvironments: ['Beach', 'Riverside', 'Countryside', 'Trail', 'Campus', 'City'],
    sensoryArtifact: 'Observe an aerial glider riding a thermal without flapping its wings for 15 seconds.',
    generateTasks: (ctx) => [
      `Walk toward open sky or water in the ${ctx.environment.toLowerCase()} where thermal updrafts form.`,
      'Look high above the treeline or rooftops for soaring raptors, corvids, gulls, or swifts.',
      'Track how a bird tilts its primary wing feathers to steer with minimal aerodynamic effort.',
      'Reflect on how effortless movement feels when aligned with the natural flow.',
      'Walk back with lighter shoulders, carrying the spacious freedom of flight in your posture.',
    ],
    bonusTask: () => 'Count how many seconds a bird can stay airborne before taking its next wing flap.',
    safetyTip: () => 'Never stare directly at the sun when tracking birds high in the zenith.',
  },

  // ================= 7. FITNESS =================
  {
    id: 'fitness-natural-parkour',
    category: 'Fitness',
    titleBase: 'The Natural Terrain Calisthenics Walk',
    descriptionBase: 'Turn outdoor features like park benches, boulders, and curbs into an active movement circuit.',
    suitableEnvironments: ['Park', 'Campus', 'Trail', 'City', 'Neighborhood'],
    sensoryArtifact: 'Find a sturdy park bench or flat boulder for step-ups and calf extensions.',
    generateTasks: (ctx) => [
      'Walk briskly for 4 minutes to warm up your hamstrings, calves, and shoulder joints.',
      'Find a stable bench or low stone ledge. Perform 15 controlled step-ups per leg.',
      'Walk briskly for 2 minutes to the next open spot. Hold a wall-sit or tree-lean squat for 45 seconds.',
      'Complete 15 incline push-ups against a sturdy railing or bench back.',
      'Finish with an easy stride cooldown, taking expansive breaths that fill your ribcage.',
    ],
    bonusTask: () => 'Find a curb or low log and walk heel-to-toe for 20 paces to test your balance.',
    safetyTip: () => 'Always test bench and stone stability before bearing full weight.',
  },
  {
    id: 'fitness-cadence-power-stride',
    category: 'Fitness',
    titleBase: 'The Power Cadence & Posture Alignment',
    descriptionBase: 'A fast-paced fitness walk focusing on core engagement, heel roll, and arm drive.',
    suitableEnvironments: ['Neighborhood', 'Campus', 'Trail', 'Riverside', 'Park'],
    sensoryArtifact: 'Engage your lower abdomen gently and draw your shoulder blades down your back.',
    generateTasks: (ctx) => [
      'Begin at a moderate pace, checking your posture: crown of head reaching toward the sky.',
      'Accelerate into a power stride: drive elbows back at 90 degrees and push off firmly from your back toes.',
      `Maintain this elevated tempo for ${Math.max(5, Math.floor(ctx.timeMinutes * 0.4))} minutes across the ${ctx.environment.toLowerCase()}.`,
      'Feel the heat generating across your core and back. Release any lingering frustration into the rhythm.',
      'Decelerate smoothly for the final 3 minutes, shaking out your arms and rotating your wrists.',
    ],
    bonusTask: () => 'Complete 30 seconds of high-knee marching while pumping your arms with vigor.',
    safetyTip: () => 'Keep footwear laced securely and avoid over-striding on slick surfaces.',
  },
  {
    id: 'fitness-interval-circuit',
    category: 'Fitness',
    titleBase: 'The Terrain Elevation Interval Trek',
    descriptionBase: 'Incorporate brisk intervals and natural resistance through stairs and slopes.',
    suitableEnvironments: ['Campus', 'Park', 'City', 'Trail', 'Countryside'],
    sensoryArtifact: 'Locate a set of outdoor stone steps or a prominent grassy slope.',
    generateTasks: (ctx) => [
      `Power-walk toward the steepest staircase or incline in the ${ctx.environment.toLowerCase()}.`,
      'Climb the stairs or slope at a brisk, purposeful cadence with hands on hips.',
      'Walk slowly down to recover your breath. Repeat the ascent 3 to 5 times.',
      'Pause at the crest, place your hands on your lower ribs, and take 5 expansive diaphragmatic breaths.',
      'Walk back at a relaxed pace, feeling your legs energized and your mind sharp.',
    ],
    bonusTask: () => 'Perform 20 calf raises on the edge of the bottom step, holding the top position for 2 seconds.',
    safetyTip: () => 'Hold handrails on stairs if steps are damp or uneven.',
  },

  // ================= 8. CAMPUS EXPLORATION =================
  {
    id: 'campus-historic-quad-arc',
    category: 'Campus exploration',
    titleBase: 'The Collegiate Quad & Historic Brickway Arc',
    descriptionBase: 'Trace architectural keystones, historic dates, and collegiate plazas.',
    suitableEnvironments: ['Campus', 'City', 'Neighborhood'],
    sensoryArtifact: 'Locate a cornerstone or plaque showing an architectural date etched in stone.',
    generateTasks: (ctx) => [
      'Enter the central quadrangle or courtyard and stand at the center point.',
      'Observe the geometry of the pathways radiating outward toward libraries and halls.',
      'Walk along the historic brick or stone walkways, examining the varying colors and wear patterns.',
      'Locate a quiet archway or covered colonnade. Notice how the acoustics amplify footstep echoes.',
      'Exit the quad through an unfamiliar portal, carrying a sense of curiosity and intellectual clarity.',
    ],
    bonusTask: () => 'Find an ancient heritage tree on campus with an identification plaque or bronze marker.',
    safetyTip: () => 'Yield to student pedestrian flows, maintenance carts, and skateboarders.',
  },
  {
    id: 'campus-secret-courtyards',
    category: 'Campus exploration',
    titleBase: 'The Hidden Courtyard & Solitary Bench Quest',
    descriptionBase: 'Venture behind academic buildings to discover quiet reading gardens and stone benches.',
    suitableEnvironments: ['Campus', 'City', 'Neighborhood', 'Garden'],
    sensoryArtifact: 'Find a secluded stone bench tucked behind a building wing away from main avenues.',
    generateTasks: (ctx) => [
      'Bypass the crowded main thoroughfares and duck behind the science or humanities halls.',
      'Search for a tucked-away interior courtyard, reading pocket, or sculpture alcove.',
      'Sit on an empty stone bench for 2 minutes. Notice the complete silence compared to main walkways.',
      `Take this time to ${getMoodReliefNote(ctx.mood)}. Let the academic ambiance inspire fresh perspectives.`,
      'Walk back through a garden passageway, noting how peaceful the hidden spaces feel.',
    ],
    bonusTask: () => 'Discover an outdoor sculpture or kinetic art installation and view it from 3 angles.',
    safetyTip: () => 'Respect private academic offices and adhere to posted visitor hours.',
  },
  {
    id: 'campus-academic-canopy',
    category: 'Campus exploration',
    titleBase: 'The Arboretum Grounds & Champion Elm Promenade',
    descriptionBase: 'Explore the stately campus tree canopy planted by generations of naturalists.',
    suitableEnvironments: ['Campus', 'Park', 'Garden'],
    sensoryArtifact: 'Touch the massive trunk of the thickest tree on campus and estimate its age.',
    generateTasks: (ctx) => [
      'Walk the perimeter of the campus green, scanning for the largest deciduous and evergreen trees.',
      'Approach a champion oak, elm, or sequoia. Stand near the trunk and gaze up into its expansive limbs.',
      'Notice how campus trees provide natural shade corridors for thinkers and strollers.',
      'Take 3 slow breaths of clean oxygen filtered by the historic canopy.',
      'Complete a loop around the library green with refreshed mental stamina.',
    ],
    bonusTask: () => 'Locate a fallen seed pod, pinecone, or acorn from the oldest tree on campus.',
    safetyTip: () => 'Watch for trip hazards around exposed tree roots on lawns.',
  },

  // ================= 9. NEIGHBORHOOD EXPLORATION =================
  {
    id: 'neighborhood-architectural-timecapsule',
    category: 'Neighborhood exploration',
    titleBase: 'The Decades & Architectural Time Capsule',
    descriptionBase: 'A walking survey observing distinct architectural eras, vintage mailboxes, and rooflines.',
    suitableEnvironments: ['Neighborhood', 'City'],
    sensoryArtifact: 'Spot a vintage architectural detail (a transom window, cast-iron fence, or carved corbel).',
    generateTasks: (ctx) => [
      'Step out your door and walk down a side street at an unhurried, observant pace.',
      'Compare three consecutive homes: observe variations in brick bond patterns, porches, and roof pitches.',
      'Look for craftsmanship from past decades: brass knockers, hand-set stone walls, or carriage steps.',
      `Reflect on how many generations have walked these streets before you. ${getMoodReliefNote(ctx.mood)}.`,
      'Return home feeling connected to the human history woven into your immediate surroundings.',
    ],
    bonusTask: () => 'Find a vintage sidewalk stamp showing a contractor\'s name or year embedded in concrete.',
    safetyTip: () => 'Stay on sidewalks, look both ways at crosswalks, and respect private property boundaries.',
  },
  {
    id: 'neighborhood-secret-alleys',
    category: 'Neighborhood exploration',
    titleBase: 'The Back Alleys & Overgrown Fencelines',
    descriptionBase: 'Explore the rustic utility lanes and brick alleyways hiding behind quiet streets.',
    suitableEnvironments: ['Neighborhood', 'City', 'Campus'],
    sensoryArtifact: 'Find where wild flowering vines or ivy are spilling over an old wooden or stone alley wall.',
    generateTasks: (ctx) => [
      'Locate a public service alley, paved lane, or gravel cut-through behind residential blocks.',
      'Walk down the alleyway where utility lines, private gardens, and fencelines meet.',
      'Notice the wilder flora that thrives in alleys: morning glories, wild mint, and mossy paving stones.',
      'Listen to the acoustic quietude between brick walls away from vehicle sirens.',
      'Emerge back onto the open street feeling like an urban explorer who peeked behind the curtain.',
    ],
    bonusTask: () => 'Find an antique carriage gate or old brick wall showing layers of weathered paint.',
    safetyTip: () => 'Only explore safe, open public through-alleys with clear daylight visibility.',
  },
  {
    id: 'neighborhood-front-porch-botany',
    category: 'Neighborhood exploration',
    titleBase: 'The Front Stoop & Container Garden Census',
    descriptionBase: 'Survey the creative potted plants, hanging baskets, and curb plantings of your neighbors.',
    suitableEnvironments: ['Neighborhood', 'City', 'Campus'],
    sensoryArtifact: 'Identify three distinct flowering varieties planted in window boxes or front stoop pots.',
    generateTasks: (ctx) => [
      'Take a stroll along a quiet residential street, looking at front yard borders and porch plantings.',
      'Observe the care neighbors invest in lavender, hydrangeas, potted ferns, and blooming perennials.',
      'Inhale the pleasant mingling of floral scents and moist soil as you pass.',
      `Appreciate the human desire to cultivate beauty for passersby. ${getMoodReliefNote(ctx.mood)}.`,
      'Walk home inspired by the creativity alive in ordinary domestic spaces.',
    ],
    bonusTask: () => 'Find a little free library or community seed box along your route.',
    safetyTip: () => 'Stay strictly on public sidewalks and admire gardens from a polite distance.',
  },

  // ================= 10. GARDENING =================
  {
    id: 'gardening-soil-bed-inspection',
    category: 'Gardening',
    titleBase: 'The Living Soil & Compost Moisture Probe',
    descriptionBase: 'A grounded horticultural walk investigating rich loam, earthworm activity, and mulched beds.',
    suitableEnvironments: ['Garden', 'Park', 'Campus', 'Countryside', 'Forest'],
    sensoryArtifact: 'Scoop a pinch of fallen leaf mold or dry soil and smell the rich earthy geosmin.',
    generateTasks: (ctx) => [
      `Walk toward cultivated garden beds or rich natural soil in the ${ctx.environment.toLowerCase()}.`,
      'Kneel or crouch down beside an open bed covered in bark mulch or compost.',
      'Gently push back the top layer to reveal the damp, darker soil beneath.',
      'Smell the distinct aroma of healthy soil microbes (geosmin). Inhale deeply 3 times.',
      'Stand up feeling somatically connected to the earth that feeds and sustains all living things.',
    ],
    bonusTask: () => 'Locate an earthworm cast, beetle trail, or fungal mycelium thread running through mulch.',
    safetyTip: () => 'Wash hands after handling soil and avoid trampling planted seed beds.',
  },
  {
    id: 'gardening-pollinator-corridor',
    category: 'Gardening',
    titleBase: 'The Pollinator Highway & Bloom Survey',
    descriptionBase: 'Track bees, hoverflies, and butterflies moving between flowering nectar corridors.',
    suitableEnvironments: ['Garden', 'Park', 'Countryside', 'Campus', 'Neighborhood'],
    sensoryArtifact: 'Observe a bee or pollinator visiting a blossom for 30 uninterrupted seconds.',
    generateTasks: (ctx) => [
      'Head to a sunny flower bed, clover patch, or wildflower border.',
      'Stop near a clump of blooming flowers. Stand motionlessly and watch for buzzing activity.',
      'Watch a bumblebee or honeybee land, enter the blossom, and dust its pollen baskets with golden pollen.',
      'Follow the pollinator as it launches into the air toward the next flower.',
      `Reflect on how essential this silent labor is to the ecosystem. ${getMoodReliefNote(ctx.mood)}.`,
    ],
    bonusTask: () => 'Identify whether the flowers visited are trumpet-shaped, flat daisy discs, or tubular spikes.',
    safetyTip: () => 'Do not swat or provoke bees; stand still and they will ignore you completely.',
  },
  {
    id: 'gardening-herbaceous-aroma',
    category: 'Gardening',
    titleBase: 'The Aromatic Herb & Foliage Crush Walk',
    descriptionBase: 'Awaken your olfactory sense by identifying aromatic herbs, pines, and wild foliage.',
    suitableEnvironments: ['Garden', 'Park', 'Forest', 'Neighborhood', 'Countryside'],
    sensoryArtifact: 'Gently brush aromatic leaves between your fingers (rosemary, lavender, pine, or mint).',
    generateTasks: (ctx) => [
      `Search for aromatic plants along your route through the ${ctx.environment.toLowerCase()}.`,
      'Locate a needle-bearing evergreen, garden rosemary, lavender bush, or wild sage.',
      'Gently stroke a foliage tip without tearing it, then bring your fingers to your nose.',
      'Inhale the sharp, resinous phytoncides. Notice how rapidly scent resets mental fatigue.',
      'Carry that aromatic alertness with you as you finish your brisk outdoor loop.',
    ],
    bonusTask: () => 'Compare the scent of a crushed dry fallen leaf versus a fresh living pine needle.',
    safetyTip: () => 'Never taste or ingest unfamiliar wild plants or mushrooms.',
  },

  // ================= 11. COLOR HUNTS =================
  {
    id: 'color-spectrum-pantone',
    category: 'Color hunts',
    titleBase: 'The Outdoor Pantone Palette Hunt',
    descriptionBase: 'Find five specific colors in the natural landscape: crimson, ochre, moss, azure, and charcoal.',
    suitableEnvironments: ['Park', 'Garden', 'Forest', 'Trail', 'Beach', 'Riverside', 'Campus', 'City', 'Neighborhood', 'Countryside'],
    sensoryArtifact: 'Locate 5 natural objects matching the 5 distinct colors of the earth spectrum.',
    generateTasks: (ctx) => [
      'Step out and begin your color scavenger hunt with eyes alert for natural chromatic variety.',
      'Find something vivid RED or CRIMSON (a berry, a stem, an autumn leaf, or a flower).',
      'Find something OCHRE or GOLDEN (dry grass, lichen, stone grain, or deadwood).',
      'Find something MOSS GREEN and something CHARCOAL or SLATE GREY.',
      `Pause and observe how rich the natural spectrum is compared to a computer screen. ${getMoodReliefNote(ctx.mood)}.`,
    ],
    bonusTask: () => 'Find an unexpected flash of blue (a bird feather, a wildflower, or reflection in water).',
    safetyTip: () => 'Keep moving safely while scanning; pause before inspecting colors in bushes.',
  },
  {
    id: 'color-monochrome-green',
    category: 'Color hunts',
    titleBase: 'The Fifty Shades of Botanical Green',
    descriptionBase: 'Challenge your eyes to distinguish at least seven distinct shades of green in living foliage.',
    suitableEnvironments: ['Forest', 'Park', 'Garden', 'Trail', 'Riverside', 'Campus'],
    sensoryArtifact: 'Compare two adjacent leaves: one lime/chartreuse, one deep forest emerald.',
    generateTasks: (ctx) => [
      `Immerse yourself into the green foliage of the ${ctx.environment.toLowerCase()}.`,
      'Count 7 distinct shades of green: lime, olive, jade, sage, pine, mint, and chartreuse.',
      'Notice how sunlight shining through a translucent leaf transforms deep green into glowing neon yellow-green.',
      'Notice how shadow deepens evergreen needles into rich blue-green charcoal.',
      'Feel the calming parasympathetic effect that botanical green has on the human nervous system.',
    ],
    bonusTask: () => 'Find a leaf that has variegated colors: white stripes or yellow spots running through green.',
    safetyTip: () => 'Watch for poison ivy or nettles which also wear deceptively rich shades of green.',
  },
  {
    id: 'color-high-contrast-neon',
    category: 'Color hunts',
    titleBase: 'The High-Contrast Mineral & Blossom Hunt',
    descriptionBase: 'Spot vivid pops of bright neon color standing out against dark earth and stone.',
    suitableEnvironments: ['Trail', 'Forest', 'Garden', 'City', 'Park', 'Beach'],
    sensoryArtifact: 'Find a brilliant orange lichen or electric petal glowing against dark wet stone.',
    generateTasks: (ctx) => [
      'Walk briskly while scanning for high-contrast color pops in the landscape.',
      'Look for bright orange Xanthoria lichen on granite, or a single bright dandelion in dark asphalt.',
      'Observe how high-contrast color triggers automatic dopamine and visual joy in the brain.',
      `Let that burst of natural color lift your spirits and ${getMoodReliefNote(ctx.mood)}.`,
      'Complete your walk with brighter eyes and a revitalized outlook on the day.',
    ],
    bonusTask: () => 'Find a smooth pebble or shell with high-contrast banded stripes running through it.',
    safetyTip: () => 'Maintain awareness of bike paths and pedestrians while scanning low areas.',
  },

  // ================= 12. SOUND HUNTS =================
  {
    id: 'sound-decibel-peeling',
    category: 'Sound hunts',
    titleBase: 'The Three-Tier Acoustic Peeling Walk',
    descriptionBase: 'Tune your ears like an audio equalizer: isolate near, mid-range, and distant horizon sounds.',
    suitableEnvironments: ['Park', 'Campus', 'Forest', 'Riverside', 'Neighborhood', 'Trail', 'City'],
    sensoryArtifact: 'Isolate the quietest background sound you can detect across the entire landscape.',
    generateTasks: (ctx) => [
      'Walk 100 paces in complete silence. Stow your phone away and turn your ears into directional antennas.',
      'Isolate Level 1 (Immediate): The crunch of your footsteps, the rustle of your jacket, your own breath.',
      'Isolate Level 2 (Mid-Range): Birds in the trees 20 meters away, a breeze through shrubs, a gate clicking.',
      'Isolate Level 3 (Distant): The low rumble of an airplane, distant water, or a dog barking half a mile away.',
      `Notice how expanding your acoustic field instantly dissolves mental claustrophobia. ${getMoodReliefNote(ctx.mood)}.`,
    ],
    bonusTask: () => 'Identify a sound produced entirely by moving air colliding with inanimate matter (branches, wires, walls).',
    safetyTip: () => 'Keep situational awareness of sirens or approaching vehicles when listening deeply.',
  },
  {
    id: 'sound-water-and-wind',
    category: 'Sound hunts',
    titleBase: 'The Wind Harp & Water Resonance Map',
    descriptionBase: 'Follow the shifting pitches created when breeze flows through needles, boughs, and ripples.',
    suitableEnvironments: ['Riverside', 'Beach', 'Forest', 'Park', 'Trail', 'Countryside'],
    sensoryArtifact: 'Listen to the distinct difference between wind through deciduous leaves vs pine needles.',
    generateTasks: (ctx) => [
      `Walk toward water or a dense stand of trees in the ${ctx.environment.toLowerCase()}.`,
      'Stop beneath a pine tree or willow. Close your eyes and listen to the white-noise hiss of the breeze.',
      'Notice how the pitch rises when a gust hits and softens into a murmur as it passes.',
      'If near water, listen to the rhythmic slap of ripples or the gentle trickling of a drainage brook.',
      'Let the natural soundscape wash away mental chatter and leave behind peaceful clarity.',
    ],
    bonusTask: () => 'Find dry leaves still clinging to winter branches rattling together like natural castanets.',
    safetyTip: () => 'Keep safe footing along wet riverbanks or slippery coastal rocks.',
  },
  {
    id: 'sound-footstep-texture',
    category: 'Sound hunts',
    titleBase: 'The Footstep Acoustic Resonance Stride',
    descriptionBase: 'A rhythm walk tuning into the sonic feedback of gravel, pavement, grass, and earth.',
    suitableEnvironments: ['Trail', 'Park', 'Campus', 'Neighborhood', 'Forest'],
    sensoryArtifact: 'Compare the acoustic note of walking on hard pavement versus soft dirt.',
    generateTasks: (ctx) => [
      'Begin your walk on hard pavement, noting the crisp, resonant tap of your shoes.',
      `Transition off the paved path onto gravel, dirt, or pine needles across the ${ctx.environment.toLowerCase()}.`,
      'Listen to the crunch and cushion: notice how the softer ground dampens sound and cushions your joints.',
      'Try walking 30 paces so softly that your footsteps make zero audible sound.',
      'Return home feeling light-footed, mindful, and in sync with the physical ground.',
    ],
    bonusTask: () => 'Crunch a crisp fallen dry leaf underfoot and listen to the sharp organic crackle.',
    safetyTip: () => 'Do not step off paths into sensitive vegetation or private grounds.',
  },

  // ================= 13. CLOUD WATCHING =================
  {
    id: 'cloud-cumulus-drift',
    category: 'Cloud watching',
    titleBase: 'The Cumulus Drift & Morphology Study',
    descriptionBase: 'Track cloud formations across the troposphere and identify their shifting shapes.',
    suitableEnvironments: ['Beach', 'Countryside', 'Park', 'Campus', 'Trail', 'Riverside'],
    sensoryArtifact: 'Fix your eye on a single small cloud puff and watch it dissolve into blue sky over 60 seconds.',
    generateTasks: (ctx) => [
      `Walk to an open area with wide sky visibility in the ${ctx.environment.toLowerCase()}.`,
      'Find a comfortable spot to stop. Lean against a tree or sit back on a bench.',
      'Look up into the cloudscape: identify whether you see fluffy cumulus, feathery cirrus, or layered stratus.',
      'Track a single cloud edge relative to a treetop or rooftop. Observe the speed of high-altitude winds.',
      `Allow the vast open scale of the sky to swallow your small daily worries. ${getMoodReliefNote(ctx.mood)}.`,
    ],
    bonusTask: () => 'Spot two cloud layers moving in different directions due to wind shear at different altitudes.',
    safetyTip: () => 'Never stare directly at the sun; keep the solar disc behind a tree or building.',
  },
  {
    id: 'cloud-wind-shear-tracker',
    category: 'Cloud watching',
    titleBase: 'The High Altitude Wind Vector Scout',
    descriptionBase: 'Read weather patterns and impending frontal systems by observing cloud textures.',
    suitableEnvironments: ['Countryside', 'Beach', 'Trail', 'Park', 'Campus'],
    sensoryArtifact: 'Notice which direction clouds are travelling compared to the breeze on your face.',
    generateTasks: (ctx) => [
      'Step out into open ground and face directly into the ground-level breeze.',
      'Now look straight up at the high clouds. Are they moving with the breeze or across it?',
      'Notice feathery mares\' tails (cirrus) signaling high-altitude jet streams miles above your head.',
      'Appreciate being an observer standing at the bottom of an immense ocean of moving atmosphere.',
      'Take 3 huge breaths of that fresh atmospheric air before striding back inside.',
    ],
    bonusTask: () => 'Identify a patch of virga (rain evaporating beneath a cloud before it hits the ground).',
    safetyTip: () => 'If clouds turn dark grey with thunder rumbles, head indoors immediately.',
  },
  {
    id: 'cloud-twilight-luminance',
    category: 'Cloud watching',
    titleBase: 'The Silver Lining & Cloud Luminescence Arc',
    descriptionBase: 'Observe sunlight scattering through clouds, creating silver rims and crepuscular rays.',
    suitableEnvironments: ['Riverside', 'Beach', 'Trail', 'Park', 'Neighborhood', 'City'],
    sensoryArtifact: 'Find where sunlight breaks through a cloud bank in visible beams ("sun rays").',
    generateTasks: (ctx) => [
      `Head toward open horizon space as the sun moves lower in the sky across the ${ctx.environment.toLowerCase()}.`,
      'Look toward the sunlit clouds. Notice the glowing silver or golden fringes around dense cloud bellies.',
      'Watch for crepuscular rays (god rays) fanning out across the sky like radiant cathedral pillars.',
      'Watch how the colors shift from white to cream, amber, and lavender in real time.',
      'Walk back feeling elevated by the grand natural light show happening over your head.',
    ],
    bonusTask: () => 'Notice how the underside of clouds takes on the reflected color of the landscape below.',
    safetyTip: () => 'Keep sunglasses or a brimmed hat handy if walking into low bright sunlight.',
  },

  // ================= 14. TEXTURE HUNTS =================
  {
    id: 'texture-tactile-naturalist',
    category: 'Texture hunts',
    titleBase: 'The Four-Element Tactile Naturalist Hunt',
    descriptionBase: 'Awaken the somatosensory nerve endings in your fingers by touching 4 distinct natural textures.',
    suitableEnvironments: ['Forest', 'Park', 'Trail', 'Beach', 'Garden', 'Riverside', 'Campus'],
    sensoryArtifact: 'Locate 4 contrasting textures: Rough, Silky, Cold, and Fibrous.',
    generateTasks: (ctx) => [
      `Walk with intention into the ${ctx.environment.toLowerCase()}, keeping your hands out of your pockets.`,
      'Touch 1: ROUGH (find deeply fissured oak bark, coarse granite, or dry pinecone scales).',
      'Touch 2: SILKY (find a smooth young birch stem, velvety petal, or polished river pebble).',
      'Touch 3: FIBROUS (touch peeling cedar bark, dried ornamental grass heads, or coconut husk mulch).',
      'Touch 4: COLD (touch damp shaded stone, morning dew, or running water).',
      `Feel how direct tactile contact with organic matter grounds your nervous system. ${getMoodReliefNote(ctx.mood)}.`,
    ],
    bonusTask: () => 'Touch the underside of a fallen leaf versus the top waxy cuticle to feel the texture difference.',
    safetyTip: () => 'Check surfaces for stinging insects or thorns before placing your full palm down.',
  },
  {
    id: 'texture-bark-rubbing-cartography',
    category: 'Texture hunts',
    titleBase: 'The Tree Bark Cartography & Furrow Survey',
    descriptionBase: 'A comparative exploration of tree bark textures: from glass-smooth beech to deep furrowed oak.',
    suitableEnvironments: ['Forest', 'Park', 'Campus', 'Garden', 'Trail'],
    sensoryArtifact: 'Compare the bark of two different tree species side by side with closed eyes.',
    generateTasks: (ctx) => [
      `Walk until you are surrounded by mature trees in the ${ctx.environment.toLowerCase()}.`,
      'Find a tree with furrowed, corky bark (like an oak, pine, or cottonwood). Run your fingers along the deep ridges.',
      'Find a tree with smooth, papery, or peeling bark (like a beech, birch, or cherry).',
      'Close your eyes and run your fingers along both. Feel the topographical landscape in the bark.',
      'Reflect on how bark shields the living vascular system of the tree through all weather.',
    ],
    bonusTask: () => 'Find ancient sap or amber resin hardened into a jewel-like droplet on a conifer trunk.',
    safetyTip: () => 'Do not strip bark from living trees; feel its surface as it grows.',
  },
  {
    id: 'texture-thermal-contrast',
    category: 'Texture hunts',
    titleBase: 'The Thermal Contrast & Sun-Warmed Stone Hunt',
    descriptionBase: 'Use your palms as temperature sensors to compare sun-soaked stone against shaded earth.',
    suitableEnvironments: ['Trail', 'Beach', 'Riverside', 'City', 'Campus', 'Park'],
    sensoryArtifact: 'Press one hand onto sun-baked stone and the other onto cool shaded soil.',
    generateTasks: (ctx) => [
      `Walk along your route looking for surfaces that have been absorbing direct sunlight in the ${ctx.environment.toLowerCase()}.`,
      'Find a boulder, brick wall, or paved curb warmed by the sun. Rest both palms flat against it for 15 seconds.',
      'Feel the radiant infrared heat transferring from the stone straight into your palms.',
      'Now touch an adjacent surface resting in permanent shade (under a bush or north wall). Notice the sharp chill.',
      'Breathe in the warmth and let it thaw any muscular rigidity across your shoulders and spine.',
    ],
    bonusTask: () => 'Find a lizard, dragonfly, or butterfly basking on the warm stone surface.',
    safetyTip: () => 'In hot summer months, test hot metal surfaces with a light tap first to prevent burns.',
  },

  // ================= 15. SEASONAL EXPLORATION =================
  {
    id: 'seasonal-phenology-markers',
    category: 'Seasonal exploration',
    titleBase: 'The Seasonal Phenology & Shift Signal Scout',
    descriptionBase: 'Hunt for subtle biological markers indicating the changing season in real time.',
    suitableEnvironments: ['Park', 'Garden', 'Forest', 'Campus', 'Trail', 'Countryside', 'Riverside'],
    sensoryArtifact: 'Find a plant displaying evidence of transition: swelling buds, seed pods, or color change.',
    generateTasks: (ctx) => [
      `Walk into the ${ctx.environment.toLowerCase()} as a seasonal phenologist tracking cyclical rhythms.`,
      'Look for the clearest sign of the current season: spring leaf buds, summer seed heads, autumn leaf tints, or winter dormant bark.',
      'Inspect a branch tip: can you see tight protective bud scales holding next season\'s leaves in reserve?',
      'Notice how nature moves in patient, unhurried cycles without digital haste.',
      `Align your own internal pace with the patient season. ${getMoodReliefNote(ctx.mood)}.`,
    ],
    bonusTask: () => 'Find a seed designed for wind dispersal (a dandelion parachute or winged maple samara).',
    safetyTip: () => 'Dress appropriately for current outdoor seasonal temperatures and wind chill.',
  },
  {
    id: 'seasonal-sun-angle-shadows',
    category: 'Seasonal exploration',
    titleBase: 'The Solar Angle & Solstice Shadow Arc',
    descriptionBase: 'Observe how the current season\'s solar elevation creates long or short shadows.',
    suitableEnvironments: ['Campus', 'City', 'Park', 'Neighborhood', 'Countryside', 'Beach'],
    sensoryArtifact: 'Measure your own cast shadow: is it taller or shorter than your actual body height?',
    generateTasks: (ctx) => [
      'Step outside into direct sunlight and turn your back to the sun.',
      'Look at your cast shadow stretching across the ground. Notice how the current time of year shapes its length.',
      'Notice where the sunlight reaches today versus where shadows remain deep and cool.',
      'Face toward the sun (with eyes closed) and feel the solar radiation warming your eyelids and forehead for 60 seconds.',
      'Walk back carrying that dose of natural full-spectrum photons in your bloodstream.',
    ],
    bonusTask: () => 'Find where moss or snow persists only in the exact permanent shadow of a building or boulder.',
    safetyTip: () => 'Avoid looking directly at the sun while calculating solar angle.',
  },
  {
    id: 'seasonal-wild-harvest-botany',
    category: 'Seasonal exploration',
    titleBase: 'The Fallen Cones & Seed Pod Cartography',
    descriptionBase: 'A naturalist mapping expedition collecting mental records of seasonal seed pods and nuts.',
    suitableEnvironments: ['Forest', 'Park', 'Garden', 'Campus', 'Trail'],
    sensoryArtifact: 'Examine a fallen pinecone or seed pod and observe the mathematical spiral of its scales.',
    generateTasks: (ctx) => [
      `Walk along the tree lines of the ${ctx.environment.toLowerCase()} looking for fallen reproductive pods.`,
      'Find a fallen pinecone, acorn cap, sweetgum ball, or dry seed pod on the ground.',
      'Count the spirals in the scales: notice the Fibonacci sequence embedded in natural growth.',
      'Hold the pod in your palm and appreciate the biological information packaged into this natural vessel.',
      'Place it gently back on the earth and complete your walk with admiration for nature\'s blueprints.',
    ],
    bonusTask: () => 'Find a pinecone that has closed its scales tight due to dampness, or opened wide in the sun.',
    safetyTip: () => 'Do not eat or taste fallen seeds, nuts, or berries unless verified by a botanical expert.',
  },
];

// Helper: Select best template matching activity, environment, mood, and energy
export function selectBestTemplate(prefs: UserPreferences): MissionTemplate {
  const act = (prefs.activity || '').toLowerCase();
  const env = prefs.environment || 'Park';

  // 1. Try exact activity matches
  let candidateTemplates: MissionTemplate[] = [];

  if (act.includes('walk')) {
    candidateTemplates = BUILT_IN_MISSION_TEMPLATES.filter((t) => t.category === 'Walking');
  } else if (act.includes('nature')) {
    candidateTemplates = BUILT_IN_MISSION_TEMPLATES.filter((t) => t.category === 'Nature observation');
  } else if (act.includes('photo')) {
    candidateTemplates = BUILT_IN_MISSION_TEMPLATES.filter((t) => t.category === 'Photography');
  } else if (act.includes('run')) {
    candidateTemplates = BUILT_IN_MISSION_TEMPLATES.filter((t) => t.category === 'Running');
  } else if (act.includes('mindful')) {
    candidateTemplates = BUILT_IN_MISSION_TEMPLATES.filter((t) => t.category === 'Mindfulness');
  } else if (act.includes('bird')) {
    candidateTemplates = BUILT_IN_MISSION_TEMPLATES.filter((t) => t.category === 'Bird watching');
  } else if (act.includes('fit')) {
    candidateTemplates = BUILT_IN_MISSION_TEMPLATES.filter((t) => t.category === 'Fitness');
  } else if (act.includes('garden')) {
    candidateTemplates = BUILT_IN_MISSION_TEMPLATES.filter((t) => t.category === 'Gardening');
  } else if (act.includes('color')) {
    candidateTemplates = BUILT_IN_MISSION_TEMPLATES.filter((t) => t.category === 'Color hunts');
  } else if (act.includes('sound')) {
    candidateTemplates = BUILT_IN_MISSION_TEMPLATES.filter((t) => t.category === 'Sound hunts');
  } else if (act.includes('cloud')) {
    candidateTemplates = BUILT_IN_MISSION_TEMPLATES.filter((t) => t.category === 'Cloud watching');
  } else if (act.includes('texture')) {
    candidateTemplates = BUILT_IN_MISSION_TEMPLATES.filter((t) => t.category === 'Texture hunts');
  } else if (act.includes('season')) {
    candidateTemplates = BUILT_IN_MISSION_TEMPLATES.filter((t) => t.category === 'Seasonal exploration');
  } else if (act.includes('campus')) {
    candidateTemplates = BUILT_IN_MISSION_TEMPLATES.filter((t) => t.category === 'Campus exploration');
  } else if (act.includes('neighborhood')) {
    candidateTemplates = BUILT_IN_MISSION_TEMPLATES.filter((t) => t.category === 'Neighborhood exploration');
  }

  // If no direct category match, check environment-friendly candidates
  if (!candidateTemplates.length) {
    if (env === 'Campus') {
      candidateTemplates = BUILT_IN_MISSION_TEMPLATES.filter((t) => t.category === 'Campus exploration');
    } else if (env === 'Neighborhood') {
      candidateTemplates = BUILT_IN_MISSION_TEMPLATES.filter((t) => t.category === 'Neighborhood exploration');
    } else if (env === 'Garden') {
      candidateTemplates = BUILT_IN_MISSION_TEMPLATES.filter((t) => t.category === 'Gardening');
    } else if (env === 'Forest' || env === 'Trail') {
      candidateTemplates = BUILT_IN_MISSION_TEMPLATES.filter(
        (t) => t.category === 'Nature observation' || t.category === 'Texture hunts' || t.category === 'Walking'
      );
    } else {
      // Pick broad engaging candidates
      candidateTemplates = BUILT_IN_MISSION_TEMPLATES;
    }
  }

  // Filter candidates that match the environment if possible
  const envMatches = candidateTemplates.filter((t) => t.suitableEnvironments.includes(env));
  const pool = envMatches.length ? envMatches : candidateTemplates;

  // Use mood and time as a deterministic seed with variation
  const seed = Math.abs(
    (prefs.mood || '').length * 13 +
      (prefs.timeMinutes || 30) * 7 +
      (prefs.environment || '').length * 5 +
      (prefs.activity || '').length * 11
  );

  return pool[seed % pool.length] || BUILT_IN_MISSION_TEMPLATES[0];
}

// Generates an adaptive Adventure using the Offline Engine
export function generateOfflineAdventure(prefs: UserPreferences): Adventure {
  const timeMinutes = prefs.timeMinutes || 30;
  const mood = prefs.mood || 'Stressed';
  const energy = prefs.energy || 'Medium';
  const environment = prefs.environment || 'Park';
  const activity = prefs.activity || 'Walking';

  const normalizedEnergy: 'Low' | 'Medium' | 'High' =
    energy.toLowerCase() === 'high' ? 'High' : energy.toLowerCase() === 'low' ? 'Low' : 'Medium';

  const ctx: TemplateContext = {
    timeMinutes,
    timeLabel: prefs.timeLabel || `${timeMinutes} min`,
    mood,
    energy,
    environment,
    activity,
    normalizedEnergy,
  };

  const template = selectBestTemplate(prefs);
  let tasks = template.generateTasks(ctx);

  // Adapt task count to available time:
  // 10 min -> 3 tasks
  // 20 min -> 4 tasks
  // 30 min -> 4 or 5 tasks
  // 60+ min -> 5 or 6 tasks
  let targetTaskCount = 4;
  if (timeMinutes <= 12) targetTaskCount = 3;
  else if (timeMinutes <= 22) targetTaskCount = 4;
  else if (timeMinutes <= 35) targetTaskCount = 5;
  else targetTaskCount = 5;

  if (tasks.length > targetTaskCount) {
    // Keep first (threshold), middle immersion, and last (return)
    const first = tasks[0];
    const last = tasks[tasks.length - 1];
    const middle = tasks.slice(1, tasks.length - 1).slice(0, targetTaskCount - 2);
    tasks = [first, ...middle, last];
  }

  // Realistic distance calculation based on time and energy
  const speedKmh =
    activity.toLowerCase().includes('run')
      ? normalizedEnergy === 'High'
        ? 10.5
        : normalizedEnergy === 'Medium'
        ? 8.5
        : 7.0
      : normalizedEnergy === 'High'
      ? 5.5
      : normalizedEnergy === 'Medium'
      ? 4.2
      : 3.0;

  const distanceKm = ((speedKmh * timeMinutes) / 60).toFixed(1);
  const estimatedDistance = `${distanceKm} km`;

  const difficulty =
    normalizedEnergy === 'High' ? 'Brisk' : normalizedEnergy === 'Medium' ? 'Moderate' : 'Gentle';

  const stepMinutes = Math.max(2, Math.floor(timeMinutes / tasks.length));

  const waypoints: Waypoint[] = tasks.map((taskText, idx) => ({
    id: `wp-${idx + 1}`,
    order: idx + 1,
    title:
      idx === 0
        ? 'The Departure Threshold'
        : idx === tasks.length - 1
        ? 'The Recalibrated Return'
        : `Waypoint 0${idx + 1}: Immersion`,
    durationMinutes: idx === tasks.length - 1 ? timeMinutes - stepMinutes * (tasks.length - 1) : stepMinutes,
    sensoryPrompt: taskText,
    actionChallenge: taskText,
    audioCueText: taskText,
    checkpointType:
      idx === 0 ? 'transition' : idx === tasks.length - 1 ? 'return' : idx === 1 ? 'immersion' : 'discovery',
  }));

  const bonusTask = template.bonusTask(ctx);
  const safetyTip = template.safetyTip(ctx);

  const title = template.titleBase;
  const subtitle = `A ${timeMinutes}-minute ${template.category.toLowerCase()} mission in the ${environment.toLowerCase()} calibrated to relieve ${mood.toLowerCase()} tension at a ${normalizedEnergy.toLowerCase()} pace.`;
  const classification = `${environment.toUpperCase()} // ${timeMinutes} MIN // ${normalizedEnergy.toUpperCase()} CADENCE`;

  const gearChecklist = [
    'Outdoor footwear with traction',
    'Weather layer for ambient temperature',
    'Pocket or clip for hands-free phone storage',
    timeMinutes >= 30 ? 'Small bottle of water' : 'Keys only — travel light',
  ];

  const audioBriefing = `Welcome to TrailMind. This is your offline mission: ${title}. You have ${timeMinutes} minutes in the ${environment.toLowerCase()}. Once you cross your threshold, stow your phone in your pocket. Ambient chimes will guide your waypoints. Breathe deeply, and begin.`;

  return {
    id: `adv-offline-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title,
    subtitle,
    classification,
    targetMinutes: timeMinutes,
    biome: environment,
    energyLevel: energy,
    moodTarget: `Transform ${mood.toLowerCase()} mental state into grounded sensory presence`,
    screenOffPromise:
      'Screen time pledge: Under 60 seconds on glass. Once you step past your threshold, the phone remains in your pocket until the completion chime.',
    primarySensoryArtifact: template.sensoryArtifact,
    gearChecklist,
    waypoints,
    audioBriefing,
    createdAt: new Date().toISOString(),
    elevationMeters: normalizedEnergy === 'High' ? Math.round(timeMinutes * 2.2) : Math.round(timeMinutes * 0.7),
    difficulty,
    tasks,
    bonusTask,
    safetyTip,
    estimatedDistance,
    isOffline: true,
    offlineNotice: 'TrailMind found a mission without the cloud.',
  };
}
