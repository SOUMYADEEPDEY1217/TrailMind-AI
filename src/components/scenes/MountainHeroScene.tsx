import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { audioSynth } from '../../utils/audioSynth';

interface MountainHeroSceneProps {
  onStartJourney: () => void;
  onExploreClick: () => void;
}

export const MountainHeroScene: React.FC<MountainHeroSceneProps> = ({
  onStartJourney,
  onExploreClick,
}) => {
  // State for interpolated smooth parallax offsets
  const [offsets, setOffsets] = useState({
    scrollY: 0,
    mouseX: 0,
    mouseY: 0,
  });

  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Animation frame and target tracking
  const targetRef = useRef({
    scrollY: 0,
    mouseX: 0,
    mouseY: 0,
  });
  const currentRef = useRef({
    scrollY: 0,
    mouseX: 0,
    mouseY: 0,
  });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // 1. Detect prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // 2. Detect mobile / touch viewport
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 'ontouchstart' in window;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });

    // 3. Scroll tracking
    const handleScroll = () => {
      targetRef.current.scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initialize initial scroll
    targetRef.current.scrollY = window.scrollY;

    // 4. Mouse movement tracking (desktop only)
    const handleMouseMove = (e: MouseEvent) => {
      if (motionQuery.matches) return;
      const { innerWidth, innerHeight } = window;
      // Normalized between -1 and 1
      const nx = (e.clientX / innerWidth - 0.5) * 2;
      const ny = (e.clientY / innerHeight - 0.5) * 2;
      targetRef.current.mouseX = nx;
      targetRef.current.mouseY = ny;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 5. High-performance requestAnimationFrame loop with smooth lerp
    let lastTime = 0;
    const animate = (time: number) => {
      if (motionQuery.matches) {
        setOffsets({ scrollY: 0, mouseX: 0, mouseY: 0 });
        return;
      }

      // Smooth interpolation (lerp factor 0.12 for butter-smooth fluidity)
      const lerp = 0.12;
      const t = targetRef.current;
      const c = currentRef.current;

      c.scrollY += (t.scrollY - c.scrollY) * lerp;
      c.mouseX += (t.mouseX - c.mouseX) * lerp;
      c.mouseY += (t.mouseY - c.mouseY) * lerp;

      // Throttle React state updates slightly to 60fps
      if (time - lastTime >= 14) {
        lastTime = time;
        setOffsets({
          scrollY: c.scrollY,
          mouseX: c.mouseX,
          mouseY: c.mouseY,
        });
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Compute depth transformation for each layer
  // Distant scenery moves slowly, midground moderately, foreground slightly faster
  // Mobile uses scaled-down movement to ensure flawless performance
  const scrollDampener = isMobile ? 0.45 : 1.0;
  const mouseDampener = isMobile || reducedMotion ? 0 : 1.0;

  const getTransform = (
    scrollSpeed: number,
    mouseXFactor: number,
    mouseYFactor: number
  ) => {
    if (reducedMotion) return 'none';
    const yOffset = offsets.scrollY * scrollSpeed * scrollDampener;
    const xMouse = offsets.mouseX * mouseXFactor * mouseDampener;
    const yMouse = offsets.mouseY * mouseYFactor * mouseDampener;
    return `translate3d(${xMouse.toFixed(2)}px, ${(yOffset + yMouse).toFixed(2)}px, 0)`;
  };

  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden flex flex-col justify-between select-none bg-[#070c14]">
      {/* ======================================================================
          LAYER 1: SKY
          - Distant atmospheric dawn sky gradient
          - Radiant sunburst glow
          - Subtle slow cloud movement
          - Soaring bird silhouettes
          Speed: Very Slow (Distant)
         ====================================================================== */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform z-0"
        style={{
          transform: getTransform(0.04, 3, 2),
        }}
      >
        {/* Cinematic Sky Gradient (Sunset orange into deep navy and warm gold) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#08101e] via-[#16283d] via-45% to-[#d97736]" />

        {/* Dawn Atmospheric Sunburst */}
        <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full bg-gradient-to-b from-[#ffd375]/35 via-[#f97316]/20 to-transparent blur-3xl pointer-events-none anim-pulse-atmosphere" />

        {/* Cloud Movement: High Altitude Distant Cloud Bank */}
        <div className="absolute top-14 left-0 right-0 h-44 anim-drift-clouds-far opacity-40 pointer-events-none">
          <svg className="w-[200%] h-full" viewBox="0 0 1200 200" fill="none">
            <path
              d="M0 120 Q120 70 240 100 Q360 40 480 85 Q600 50 720 90 Q840 60 960 95 Q1080 60 1200 110 L1200 200 L0 200 Z"
              fill="#fed7aa"
              fillOpacity="0.25"
            />
            <path
              d="M100 140 Q250 90 400 120 Q550 80 700 115 Q850 75 1000 130 L1200 200 L0 200 Z"
              fill="#fed7aa"
              fillOpacity="0.18"
            />
          </svg>
        </div>

        {/* Soaring Birds Crossing the Horizon */}
        <div className="absolute top-28 left-0 anim-soar-bird pointer-events-none z-10">
          <svg width="42" height="18" viewBox="0 0 42 18" fill="none">
            <path
              d="M0 14 Q10 2 21 11 Q32 2 42 14 Q32 9 21 14 Q10 9 0 14 Z"
              fill="#101827"
              fillOpacity="0.75"
            />
          </svg>
        </div>
        <div className="absolute top-44 left-0 anim-soar-bird-delay pointer-events-none z-10">
          <svg width="30" height="13" viewBox="0 0 42 18" fill="none">
            <path
              d="M0 14 Q10 2 21 11 Q32 2 42 14 Q32 9 21 14 Q10 9 0 14 Z"
              fill="#101827"
              fillOpacity="0.55"
            />
          </svg>
        </div>
      </div>

      {/* ======================================================================
          LAYER 2: DISTANT MOUNTAINS
          - Colossal high peaks, deep navy lavender silhouette
          - Morning crest snow highlights and light edges
          Speed: Slow (Distant)
         ====================================================================== */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform z-1"
        style={{
          transform: getTransform(0.12, 7, 4),
        }}
      >
        <svg
          className="absolute bottom-[24%] left-0 w-full h-[58%]"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Farthest Mountain Wall (Deep navy lavender) */}
          <path
            d="M0 380 L140 250 L280 340 L450 160 L620 320 L750 210 L920 350 L1080 180 L1240 310 L1380 230 L1440 280 L1440 600 L0 600 Z"
            fill="#2c3a52"
          />
          {/* Light Edge on Distant Ridge */}
          <path
            d="M450 160 L452 165 L620 320 L622 320 L450 160 Z"
            fill="#ffd29d"
            fillOpacity="0.4"
          />
          <path
            d="M1080 180 L1082 185 L1240 310 L1080 180 Z"
            fill="#ffd29d"
            fillOpacity="0.35"
          />
        </svg>
      </div>

      {/* ======================================================================
          LAYER 3: NEAR MOUNTAINS
          - Secondary alpine ridge with faceted topography
          - Sun-kissed orange/gold facets
          Speed: Slow-Moderate (Midground Far)
         ====================================================================== */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform z-2"
        style={{
          transform: getTransform(0.22, 12, 7),
        }}
      >
        <svg
          className="absolute bottom-[20%] left-0 w-full h-[54%]"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Secondary Alpine Ridge (Rich Prussian blue with sharp facets) */}
          <path
            d="M0 450 L190 280 L360 410 L520 220 L720 400 L880 260 L1060 420 L1220 250 L1440 430 L1440 600 L0 600 Z"
            fill="#1c2b3e"
          />
          {/* Warm Sun Ridge Highlights */}
          <path
            d="M520 220 L580 300 L560 380 L520 220 Z"
            fill="#f97316"
            fillOpacity="0.32"
          />
          <path
            d="M1220 250 L1280 340 L1260 420 L1220 250 Z"
            fill="#f97316"
            fillOpacity="0.28"
          />
          <path
            d="M190 280 L240 350 L210 400 L190 280 Z"
            fill="#f59e0b"
            fillOpacity="0.22"
          />
        </svg>

        {/* Ambient Drifting Valley Mist between Mountain Ranks */}
        <div className="absolute bottom-[26%] left-0 right-0 h-24 anim-drift-clouds-near opacity-25 pointer-events-none">
          <svg className="w-[180%] h-full" viewBox="0 0 1000 120" fill="none">
            <path
              d="M0 60 Q150 20 300 50 Q450 10 600 45 Q750 20 900 55 L1000 120 L0 120 Z"
              fill="#fed7aa"
              fillOpacity="0.3"
            />
          </svg>
        </div>
      </div>

      {/* ======================================================================
          LAYER 4: TREES
          - Foothills, dense pine forest silhouettes, jagged crowns
          - Evergreen canopy texture
          Speed: Moderate (Midground)
         ====================================================================== */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform z-3"
        style={{
          transform: getTransform(0.35, 18, 10),
        }}
      >
        <svg
          className="absolute bottom-[10%] left-0 w-full h-[50%]"
          viewBox="0 0 1440 500"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Deep Forest Mountain Ridge */}
          <path
            d="M0 320 Q180 230 380 290 Q580 340 760 250 Q960 170 1180 280 Q1320 320 1440 270 L1440 500 L0 500 Z"
            fill="#12271e"
          />

          {/* Jagged Pine Tree Silhouettes on Ridge */}
          <g fill="#0e2018">
            <path d="M60 280 L70 240 L80 280 Z M75 285 L85 235 L95 285 Z M140 270 L150 225 L160 270 Z" />
            <path d="M220 290 L230 245 L240 290 Z M310 280 L322 230 L334 280 Z M380 295 L392 240 L404 295 Z" />
            <path d="M470 310 L482 255 L494 310 Z M540 320 L552 265 L564 320 Z M610 295 L622 245 L634 295 Z" />
            <path d="M680 270 L692 220 L704 270 Z M730 260 L742 215 L754 260 Z M780 265 L792 225 L804 265 Z" />
            <path d="M920 210 L932 165 L944 210 Z M950 220 L962 170 L974 220 Z M1020 240 L1032 190 L1044 240 Z" />
            <path d="M1120 260 L1132 210 L1144 260 Z M1240 290 L1252 240 L1264 290 Z M1360 280 L1372 230 L1384 280 Z" />
          </g>
        </svg>
      </div>

      {/* ======================================================================
          LAYER 5: WATER
          - Mountain gorge waterfall cutting through valley
          - Animated water shimmer and cascade spray
          - Valley river basin with ripples and sunset reflection
          Speed: Moderate-Active (Midground Near)
         ====================================================================== */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform z-4"
        style={{
          transform: getTransform(0.48, 24, 14),
        }}
      >
        <svg
          className="absolute bottom-[6%] left-0 w-full h-[46%]"
          viewBox="0 0 1440 450"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Fissure Chasm behind Waterfall */}
          <path d="M840 200 L860 200 L870 310 L835 310 Z" fill="#1e3a34" />

          {/* Roaring Waterfall Cascades (Animated Shimmer & Fluid Motion) */}
          <g className="anim-shimmer-water">
            <path
              d="M846 200 L856 200 L858 305 L844 305 Z"
              fill="#99f6e4"
              fillOpacity="0.8"
            />
            <path
              d="M849 210 L853 210 L854 305 L847 305 Z"
              fill="#ffffff"
              fillOpacity="0.95"
            />
            {/* Waterfall Mist Cloud at Base */}
            <ellipse
              cx="852"
              cy="305"
              rx="35"
              ry="12"
              fill="#ffffff"
              fillOpacity="0.35"
            />
            <ellipse
              cx="852"
              cy="308"
              rx="22"
              ry="8"
              fill="#a7f3d0"
              fillOpacity="0.45"
            />
          </g>

          {/* Valley River Basin / Lake */}
          <path
            d="M0 380 Q400 340 852 310 Q1100 340 1440 370 L1440 450 L0 450 Z"
            fill="#0b2420"
          />
          <path
            d="M200 400 Q500 360 852 318 Q1200 360 1400 400 L1400 450 L200 450 Z"
            fill="#144238"
            fillOpacity="0.65"
          />

          {/* Water reflection ripples with organic expansion animation */}
          <g className="anim-water-ripple">
            <ellipse
              cx="850"
              cy="340"
              rx="150"
              ry="7"
              fill="#ffd375"
              fillOpacity="0.25"
            />
            <ellipse
              cx="820"
              cy="365"
              rx="200"
              ry="9"
              fill="#f97316"
              fillOpacity="0.2"
            />
          </g>
          <g className="anim-water-ripple-delayed">
            <ellipse
              cx="880"
              cy="395"
              rx="270"
              ry="11"
              fill="#a7f3d0"
              fillOpacity="0.16"
            />
          </g>
        </svg>
      </div>

      {/* ======================================================================
          LAYER 6: ROCKS
          - Deep foreground cliffs, rocky outcroppings, geological crevices
          - Left promontory and right boulder observation shelf
          Speed: Faster (Foreground Scenery)
         ====================================================================== */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform z-5"
        style={{
          transform: getTransform(0.64, 32, 18),
        }}
      >
        <svg
          className="absolute bottom-0 left-0 w-full h-[45%]"
          viewBox="0 0 1440 450"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Foreground Cliff & Boulder Outcropping (Left side) */}
          <path
            d="M0 260 L180 230 L320 280 L440 370 L480 450 L0 450 Z"
            fill="#06120b"
          />
          {/* Cliff Face Texture Crevices */}
          <path
            d="M120 250 L140 330 L110 390 L100 450 L70 330 Z"
            fill="#0b2014"
          />
          <path d="M240 270 L260 360 L230 420 Z" fill="#0a1a11" />

          {/* Right Foreground Rocky Ridge with The Explorer Rock Shelf */}
          <path
            d="M1440 200 L1260 170 L1120 220 L980 320 L920 450 L1440 450 Z"
            fill="#050e09"
          />
          <path
            d="M1260 170 L1210 240 L1240 350 L1310 450 Z"
            fill="#0a1b12"
          />
          <path
            d="M1120 220 L1070 300 L1110 420 Z"
            fill="#08170f"
          />

          {/* Geological Rock Pedestal where character stands */}
          <path
            d="M1195 175 L1275 175 L1265 205 L1185 205 Z"
            fill="#040d07"
          />
        </svg>
      </div>

      {/* ======================================================================
          LAYER 7: FOREGROUND PLANTS
          - Windswept wild grasses, ferns, moss on rocks
          - Subtle grass movement animations
          - Floating leaves drifting in the wind
          - Illuminated warm morning light particles
          Speed: Fastest (Closest Foreground)
         ====================================================================== */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform z-6"
        style={{
          transform: getTransform(0.82, 42, 24),
        }}
      >
        <svg
          className="absolute bottom-0 left-0 w-full h-[45%]"
          viewBox="0 0 1440 450"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Tall Windswept Foreground Grasses & Botanical Ferns (Left) */}
          <g className="anim-sway-grass" fill="#06160c">
            <path d="M40 340 Q55 240 70 200 Q62 250 50 340 Z" />
            <path d="M60 350 Q85 230 110 190 Q95 250 75 350 Z" />
            <path d="M90 360 Q120 250 145 210 Q130 270 105 360 Z" />
            <path d="M140 370 Q165 260 200 230 Q180 280 155 370 Z" />
            {/* Botanical Fern frond */}
            <path d="M220 380 Q260 300 320 280 Q290 320 240 380 Z" />
          </g>

          {/* Right Grass Clumps near Explorer Edge */}
          <g className="anim-sway-grass-alt" fill="#041008">
            <path d="M1020 400 Q1050 310 1080 270 Q1060 330 1035 400 Z" />
            <path d="M1100 410 Q1130 300 1170 250 Q1145 320 1115 410 Z" />
            <path d="M1280 420 Q1320 310 1370 260 Q1340 330 1295 420 Z" />
            <path d="M1360 410 Q1390 320 1430 280 Q1410 340 1375 410 Z" />
          </g>
        </svg>

        {/* Floating Leaves: Subtle autumn/alpine leaves drifting across the foreground */}
        {!reducedMotion && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Leaf 1: Warm amber beech leaf */}
            <div className="absolute top-[42%] right-[22%] anim-drift-leaf-1 pointer-events-none">
              <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
                <path
                  d="M0 7 C5 0, 16 0, 22 7 C16 14, 5 14, 0 7 Z"
                  fill="#f59e0b"
                  fillOpacity="0.75"
                />
                <line x1="2" y1="7" x2="20" y2="7" stroke="#d97736" strokeWidth="0.8" />
              </svg>
            </div>

            {/* Leaf 2: Russet orange oak leaf */}
            <div className="absolute top-[52%] right-[38%] anim-drift-leaf-2 pointer-events-none">
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                <path
                  d="M0 6 C4 1, 14 1, 18 6 C14 11, 4 11, 0 6 Z"
                  fill="#ea580c"
                  fillOpacity="0.7"
                />
                <line x1="1" y1="6" x2="16" y2="6" stroke="#c2410c" strokeWidth="0.7" />
              </svg>
            </div>

            {/* Leaf 3: Moss green birch leaf (Desktop only) */}
            {!isMobile && (
              <div className="absolute top-[60%] right-[15%] anim-drift-leaf-3 pointer-events-none">
                <svg width="20" height="13" viewBox="0 0 20 13" fill="none">
                  <path
                    d="M0 6.5 C5 0.5, 15 0.5, 20 6.5 C15 12.5, 5 12.5, 0 6.5 Z"
                    fill="#4d7c0f"
                    fillOpacity="0.65"
                  />
                  <line x1="2" y1="6.5" x2="18" y2="6.5" stroke="#365314" strokeWidth="0.7" />
                </svg>
              </div>
            )}
          </div>
        )}

        {/* Light Particles: Illuminated morning dust spores & glowing warmth */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[55%] left-[20%] w-1.5 h-1.5 rounded-full bg-amber-300/80 blur-[0.5px] anim-firefly-1" />
          <div className="absolute top-[68%] left-[45%] w-2 h-2 rounded-full bg-orange-300/70 blur-[0.5px] anim-firefly-2" />
          <div className="absolute top-[60%] left-[78%] w-1.5 h-1.5 rounded-full bg-yellow-200/90 blur-[0.5px] anim-firefly-3" />
          <div className="absolute top-[48%] left-[62%] w-1 h-1 rounded-full bg-amber-100/80 anim-particle-rise-1" />
          {!isMobile && (
            <>
              <div className="absolute top-[65%] left-[32%] w-1.5 h-1.5 rounded-full bg-amber-400/75 blur-[0.5px] anim-particle-rise-2" />
              <div className="absolute top-[52%] left-[84%] w-1 h-1 rounded-full bg-yellow-100/85 anim-particle-rise-3" />
            </>
          )}
        </div>
      </div>

      {/* ======================================================================
          LAYER 8: EXPLORER / ADVENTURE CHARACTER
          - Silhouette of the hiker standing poised on the rocky bluff
          - Backpack, hiking staff, jacket, facing the wild mountain horizon
          - Sunrise rim-light contouring the edge
          - Subtle natural idle breathing animation
          Speed: Distinctive Foreground Character
         ====================================================================== */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform z-7"
        style={{
          transform: getTransform(0.74, 36, 20),
        }}
      >
        <svg
          className="absolute bottom-0 left-0 w-full h-[45%]"
          viewBox="0 0 1440 450"
          preserveAspectRatio="none"
          fill="none"
        >
          <g
            transform="translate(1210, 80) scale(0.95)"
            fill="#020805"
            className="anim-hiker-idle"
          >
            {/* Boots & Legs */}
            <path d="M12 70 L8 95 L18 95 L20 70 Z" />
            <path d="M28 68 L26 95 L36 95 L34 68 Z" />

            {/* Torso & Outdoor Jacket */}
            <path d="M8 32 L36 30 L40 68 L8 70 Z" />

            {/* Backpack on Back (facing toward the vast mountain valley) */}
            <path d="M34 32 C48 34, 52 50, 42 62 C38 65, 34 62, 34 58 Z" />

            {/* Arm & Trekking Pole */}
            <path d="M10 35 L-2 52 L-4 68 L2 68 L6 50 Z" />
            <line
              x1="-3"
              y1="40"
              x2="-6"
              y2="95"
              stroke="#020805"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Head & Explorer Hat / Hood */}
            <circle cx="22" cy="20" r="8.5" />
            <path d="M12 18 C12 12, 32 12, 32 18 C35 19, 36 21, 22 21 C10 21, 10 19, 12 18 Z" />

            {/* Warm Sunrise Rim-Light on Explorer Silhouette */}
            <path
              d="M12 18 C15 13, 22 13, 24 14"
              stroke="#fbbf24"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M8 32 L8 70"
              stroke="#fbbf24"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M-4 68 L-6 95"
              stroke="#fbbf24"
              strokeWidth="1"
              fill="none"
            />
          </g>
        </svg>
      </div>

      {/* ======================================================================
          HERO COPY LAYER
          Integrated directly with editorial typography & primary call-to-actions.
          Kept identical to original page layout (Do NOT redesign the pages).
         ====================================================================== */}
      <div className="relative z-30 pt-28 xs:pt-32 sm:pt-40 md:pt-44 px-4 xs:px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-between pb-10 sm:pb-16 pointer-events-none">
        <div className="max-w-4xl space-y-4 sm:space-y-6">
          {/* Small text kicker */}
          <div className="text-[10px] xs:text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] sm:tracking-[0.3em] text-amber-300/90 drop-shadow-md">
            YOUR NEXT ADVENTURE IS CLOSER THAN YOU THINK
          </div>

          {/* Huge editorial headline */}
          <h1 className="font-editorial text-5xl xs:text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-black tracking-tight leading-[0.84] text-white drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] text-balance">
            GO<br />
            OUTSIDE.
          </h1>

          {/* Supporting text */}
          <p className="text-sm xs:text-base sm:text-xl md:text-2xl text-stone-200 font-body max-w-xl leading-relaxed drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] pt-1 sm:pt-4">
            TrailMind turns your mood, time and surroundings into a real-world adventure.
          </p>

          {/* Primary Action Button */}
          <div className="pt-3 sm:pt-6 pointer-events-auto flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <button
              onClick={() => {
                audioSynth.playChime('start');
                onStartJourney();
              }}
              className="group w-full sm:w-auto min-h-[50px] sm:min-h-[58px] px-6 sm:px-10 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_12px_32px_rgba(249,115,22,0.4)] active:scale-[0.98] cursor-pointer"
            >
              <span>START THE JOURNEY</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                audioSynth.playChime('tick');
                onExploreClick();
              }}
              className="w-full sm:w-auto min-h-[50px] sm:min-h-[58px] px-6 sm:px-7 rounded-full bg-black/40 hover:bg-black/60 text-stone-100 hover:text-white border border-white/20 hover:border-white/40 text-xs sm:text-sm uppercase tracking-widest font-semibold backdrop-blur-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Calibrate Trail</span>
            </button>
          </div>
        </div>

        {/* Scroll Indicator Prompt */}
        <div className="pt-6 sm:pt-8 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 text-[10px] xs:text-xs text-white/70 font-mono tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>01 // THE ALPINE RIDGE</span>
          </div>
          <div className="flex items-center gap-2 animate-bounce">
            <span>SCROLL TO ENTER THE WILD</span>
            <span>↓</span>
          </div>
        </div>
      </div>
    </section>
  );
};
