import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const GlitchOverlay = ({ onComplete }) => {
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Timer for Transition
    const timer = setTimeout(() => {
      setIsFinished(true);
      if (onComplete) onComplete();
    }, 2500); // 2.5 seconds of sparkles

    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  if (isFinished) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Soft Radial Gradient Background */}
      <motion.div 
        className="absolute inset-0 bg-radial-gradient from-pink-900/40 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Floating Particles/Sparkles */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            backgroundColor: ['#FFD700', '#FF69B4', '#FFFFFF'][Math.floor(Math.random() * 3)],
            width: Math.random() * 6 + 2 + 'px',
            height: Math.random() * 6 + 2 + 'px',
            boxShadow: '0 0 10px currentColor',
            left: '50%',
            top: '50%',
          }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
          animate={{
            x: (Math.random() - 0.5) * window.innerWidth,
            y: (Math.random() - 0.5) * window.innerHeight,
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5 + Math.random(),
            ease: "easeOut",
            delay: Math.random() * 0.5
          }}
        />
      ))}

      {/* Central Heart Pulse */}
      <motion.div
        className="text-9xl relative z-10 drop-shadow-[0_0_30px_rgba(255,105,180,0.8)]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
            scale: [0, 1.2, 1.5, 3],
            opacity: [0, 1, 1, 0],
            rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        💖
      </motion.div>
    </div>
  );
};

export default GlitchOverlay;
