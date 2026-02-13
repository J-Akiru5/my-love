import { motion } from 'framer-motion';
import { useEffect } from 'react';

const RippleReveal = ({ onComplete }) => {
  
  useEffect(() => {
    // Apply the displacement filter to the entire body/root to warp everything
    const root = document.getElementById('root');
    if (root) {
        root.style.filter = 'url(#water-ripple-filter)';
    }

    // Cleanup after animation
    const timer = setTimeout(() => {
        if (root) root.style.filter = 'none';
        onComplete();
    }, 2500); // 2.5s duration

    return () => {
        if (root) root.style.filter = 'none';
        clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      {/* 
          SVG Filter Definition 
          This is invisible but referenced by the CSS filter: url(#water-ripple-filter)
      */}
      <svg width="0" height="0">
        <filter id="water-ripple-filter">
          {/* 
              Turbulence generates the noise texture.
              DisplacementMap uses that noise to warp the source graphic (the screen).
           */}
           <feTurbulence 
                type="fractalNoise" 
                baseFrequency="0.01" 
                numOctaves="2" 
                result="ripple" 
            >
                {/* Animate the frequency to make it move/expand */}
                <animate 
                    attributeName="baseFrequency" 
                    dur="2.5s" 
                    values="0.01; 0.05; 0.02; 0.0" 
                    keyTimes="0; 0.5; 0.8; 1"
                />
            </feTurbulence>
            
            <feDisplacementMap 
                in="SourceGraphic" 
                in2="ripple" 
                scale="100" 
                xChannelSelector="R" 
                yChannelSelector="G"
            >
                {/* Animate the scale of distortion: High -> Low (calm) */}
                <animate 
                    attributeName="scale" 
                    dur="2.5s" 
                    values="0; 500; 100; 0"
                    keyTimes="0; 0.2; 0.6; 1"
                />
            </feDisplacementMap>
        </filter>
      </svg>
      
      {/* Optional: A visual expanding ring to accompany the distortion */}
      <motion.div
        initial={{ scale: 0, opacity: 0.8, borderWidth: "20px" }}
        animate={{ scale: 15, opacity: 0, borderWidth: "0px" }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute w-40 h-40 rounded-full border-cyan-400 blur-md mix-blend-overlay"
      />
    </div>
  );
};

export default RippleReveal;
