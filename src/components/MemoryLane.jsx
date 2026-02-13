import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MemoryLane.css';

// Dynamic import of all images
const imagesModules = import.meta.glob('../assets/images/*.{jpg,jpeg,png,JPG}', { eager: true });
const allImagesEntries = Object.entries(imagesModules);

// Filter and Sort Images
const memoryImages = allImagesEntries
    .map(([, mod]) => mod.default)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })); 

const captions = [
  "To: My Lighthouse...",
  "You caught my attention, my interest, and my heart.",
  "I'm so thankful I met a girl like you.",
  "Someone willing to support me...",
  "Someone who accepts me for who I am.",
  "With God's proper place and timing...",
  "Everything will come to its place.",
  "Isaiah 60:22 - When the time is right, I, the Lord will make it happen.",
  "I prayed for the girl He would give me...",
  "And I trusted Him.",
  "Then I met you.",
  "You are special to me.",
  "I want to be as close to you as possible.",
  "I think I already fell in love with you.",
  "Join me in every journey...",
  "In the highs and lows...",
  "In every victory we accomplish.",
  "You are the first...",
  "And I want you to be the last.",
  "Will you join me in my journey?",
  "From: The man attracted to your light."
];

// Helper to generate random positions for the "Tunnel"
// We want center to be somewhat clear, so we push X/Y outwards
const generatePosition = () => {
    const angle = Math.random() * Math.PI * 2;
    const radius = 45 + Math.random() * 45; // INCREASED: 45% to 90% from center (More scattered)
    return {
        left: `${50 + Math.cos(angle) * radius}%`,
        top: `${50 + Math.sin(angle) * radius}%`,
        rotation: (Math.random() - 0.5) * 60 // More tilt
    };
};

const MemoryLane = ({ onComplete }) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(-1);
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Timing: 4 Minutes Total
  const TOTAL_DURATION_MS = 240000; 
  const SPAWN_INTERVAL = TOTAL_DURATION_MS / memoryImages.length; 
  const CAPTION_DURATION = TOTAL_DURATION_MS / captions.length; 
  const FLIGHT_DURATION = 15; // seconds - slow graceful float
  const MAX_VISIBLE = 3; // max images on screen at once

  // Pre-calculate positions so they are consistent per render
  const photoPositions = useMemo(() => 
    memoryImages.map(() => generatePosition()), 
  []);

  // Photo Spawner - runs once on mount
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePhotoIndex(prev => {
        const next = prev + 1;
        if (next >= memoryImages.length) {
          clearInterval(timer);
          setTimeout(() => onCompleteRef.current(), 5000);
          return prev;
        }
        return next;
      });
    }, SPAWN_INTERVAL);

    return () => clearInterval(timer);
  }, [SPAWN_INTERVAL]);

  // Caption Timer - runs once on mount
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCaptionIndex(prev => {
        const next = prev + 1;
        if (next >= captions.length) {
          clearInterval(timer);
          return prev;
        }
        return next;
      });
    }, CAPTION_DURATION);

    return () => clearInterval(timer);
  }, [CAPTION_DURATION]);


  return (
    <div className="memory-lane-container overflow-hidden perspective-container">
        {/* 
            Perspective Container creates 3D space.
            Each photo starts deep in Z (-1000px) and flies to Z (500px).
        */}
        <style>{`
            .perspective-container {
                perspective: 1000px;
                overflow: hidden;
            }
        `}</style>
        
        {/* Floating Hearts BG (Preserved) */}
        <div className="floating-hearts-bg">
            {[...Array(15)].map((_, i) => (
                <div key={i} className="bg-heart" style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${10 + Math.random() * 10}s`
                }}>❤️</div>
            ))}
        </div>

      {/* The Time Tunnel */}
      <AnimatePresence>
        {memoryImages.map((src, index) => {
            // Sliding window: only render recently spawned images
            if (index > activePhotoIndex || index < activePhotoIndex - MAX_VISIBLE) return null;
            
            const pos = photoPositions[index];

            return (
                <motion.div
                    key={index}
                    initial={{ 
                        opacity: 0, 
                        z: -1500, 
                        scale: 0.2,
                        left: '50%', 
                        top: '50%',
                        x: '-50%',
                        y: '-50%' 
                    }}
                    animate={{ 
                        opacity: [0, 0.9, 1, 0.8, 0], 
                        z: 600,
                        scale: [0.2, 0.6, 0.9, 1, 1],
                        left: pos.left, 
                        top: pos.top,
                        rotate: pos.rotation
                    }}
                    transition={{ 
                        duration: FLIGHT_DURATION,
                        ease: "linear",
                    }}
                    style={{
                        position: 'absolute',
                        width: '300px', 
                        height: 'auto',
                    }}
                    className="shadow-2xl border-4 border-white/80 rounded-lg"
                >
                    <img src={src} alt="memory" className="w-full h-auto rounded" />
                </motion.div>
            );
        })}
      </AnimatePresence>

      {/* Captions - Centered and Static (HUD style) */}
      <div className="caption-container z-50 fixed bottom-20">
        <AnimatePresence mode='wait'>
          <motion.p
            key={currentCaptionIndex}
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 1 }}
            className="caption-text text-3xl md:text-5xl font-dancing font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          >
            {captions[currentCaptionIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

    </div>
  );
};

export default MemoryLane;
