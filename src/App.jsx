import { useState, useRef, useEffect } from 'react';
import HeartbeatStart from './components/HeartbeatStart';
import MemoryLane from './components/MemoryLane';
import TextPortrait from './components/TextPortrait';
import GlitchOverlay from './components/GlitchOverlay';
import LightFlash from './components/LightFlash';
import './index.css';

// Importing audio
import nightChangesAudio from './assets/audio/night-changes.mp3';

function App() {
  const [stage, setStage] = useState('start'); // 'start' | 'memories' | 'glitch' | 'flash' | 'portrait'
  const audioRef = useRef(new Audio(nightChangesAudio));
  const loopCountRef = useRef(0);
  
  // Handle start (After Password Unlock)
  const handleStart = () => {
    // Play audio with loop tracking
    audioRef.current.volume = 0.5;
    
    // Track loops and stop after 5
    audioRef.current.addEventListener('ended', () => {
      loopCountRef.current += 1;
      if (loopCountRef.current < 5) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    });
    
    audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    
    setStage('memories');
  };

  // Handle completion of memories (4:00 mark)
  const handleMemoriesComplete = () => {
    // Music continues playing...
    setStage('glitch');
  };

  // Glitch finishes -> Light flash starts
  const handleGlitchComplete = () => {
    setStage('flash');
  };

  // Flash finishes -> Show Portrait
  const handleFlashComplete = () => {
    setStage('portrait');
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden text-white font-sans relative">
      {stage === 'start' && <HeartbeatStart onStart={handleStart} />}
      
      {stage === 'memories' && (
        <MemoryLane onComplete={handleMemoriesComplete} />
      )}

      {/* Sparkle/Transition Overlay (Replacing Glitch) */}
      {stage === 'glitch' && (
        <GlitchOverlay onComplete={handleGlitchComplete} />
      )}

      {/* Light Flash Transition */}
      {stage === 'flash' && (
        <>
            <LightFlash onComplete={handleFlashComplete} />
            {/* Pre-render portrait behind flash for smooth reveal */}
            <div className="absolute inset-0 z-0">
                <TextPortrait audioRef={audioRef} />
            </div>
        </>
      )}
      
      {stage === 'portrait' && <TextPortrait audioRef={audioRef} />}
    </div>
  );
}

export default App;
