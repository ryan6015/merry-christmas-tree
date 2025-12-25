
import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import ChristmasTree from './components/ChristmasTree';
import Atmosphere from './components/Atmosphere';
import GreetingCard from './components/GreetingCard';
import LoadingScreen from './components/LoadingScreen';
import { COLORS } from './colors';
import bgm from './assets/jingle-bells.mp3';
import Photo from "./assets/photo.jpg";

// Define the greeting card image URL centrally to ensure preloading works correctly
export const GREETING_IMAGE_URL = Photo;

/**
 * Controller component to handle rotation logic based on the animation timeline.
 */
const TreeController: React.FC<{ canInteract: boolean }> = ({ canInteract }) => {
  return (
    <>
      <ChristmasTree />
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        autoRotate={canInteract}
        autoRotateSpeed={0.8}
        enableRotate={canInteract}
        makeDefault
      />
    </>
  );
};

const App: React.FC = () => {
  const [showCard, setShowCard] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [canInteract, setCanInteract] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pointerStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // 1. Preload the Greeting Card Image
    const img = new Image();
    img.src = GREETING_IMAGE_URL;

    // 2. Loading Screen Logic
    // Show the loading silhouette for at least 2 seconds as requested
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // 3. Animation interaction delay (starts after LoadingScreen is gone)
    // Sequence: 2s loading + 0.5s converge + 1.0s line growth
    const interactionTimer = setTimeout(() => {
      setCanInteract(true);
    }, 3600);

    // 4. Set initial volume for the relaxed vibe
    if (audioRef.current) {
      audioRef.current.volume = 0.4; // Slightly softer for piano music
    }

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(interactionTimer);
    };
  }, []);

  const toggleMusic = (e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.play().catch(console.error);
      setIsMuted(false);
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (showCard || isLoading) return;
    const target = e.target as HTMLElement;
    if (target.closest('.music-toggle-btn')) return;

    const deltaX = Math.abs(e.clientX - pointerStart.current.x);
    const deltaY = Math.abs(e.clientY - pointerStart.current.y);
    
    // Threshold to distinguish click from rotation drag
    if (deltaX < 5 && deltaY < 5) {
      setShowCard(true);
    }
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden select-none bg-[#02040a]"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {isLoading && <LoadingScreen />}

      <audio 
        ref={audioRef} 
        loop 
        // Festive, soft, cheerful piano music for Christmas
        src={bgm} 
      />

      {!showCard && !isLoading && (
        <div className="absolute top-[6%] left-0 w-full flex justify-center pointer-events-none z-10 animate-fade-in">
          <h1 
            className="text-4xl md:text-6xl text-[#ffd700] font-serif italic drop-shadow-[0_2px_15px_rgba(255,215,0,0.5)]"
            style={{ fontFamily: "'Brush Script MT', 'Dancing Script', cursive" }}
          >
            Merry Christmas
          </h1>
        </div>
      )}

      {!isLoading && (
        <button 
          onClick={toggleMusic}
          onPointerUp={(e) => e.stopPropagation()} 
          className="music-toggle-btn absolute top-6 right-6 z-50 p-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white transition-all hover:bg-white/15 active:scale-90 shadow-lg"
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          )}
        </button>
      )}

      {/* The 3D scene only renders content when not loading for performance and clean entry */}
      {!isLoading && (
        <Canvas
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 4, 20]} fov={40} />
            <TreeController canInteract={canInteract} />
            <Atmosphere />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[-10, 5, -10]} color={COLORS.accent} intensity={1} />
          </Suspense>
        </Canvas>
      )}

      {showCard && <GreetingCard onClose={() => setShowCard(false)} />}

      {!showCard && canInteract && !isLoading && (
        <div className="absolute bottom-10 left-0 w-full flex flex-col items-center pointer-events-none space-y-3 animate-pulse opacity-60">
          <p className="text-white text-[10px] tracking-[0.4em] uppercase font-light text-center">
            Drag to Rotate • Click to Open
          </p>
          <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
