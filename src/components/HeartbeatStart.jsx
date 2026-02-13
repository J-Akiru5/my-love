import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HeartbeatStart = ({ onStart }) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [noButtonClicks, setNoButtonClicks] = useState(0);

  const handleYesClick = () => {
    setShowInput(true);
  };

  const handleNoClick = (e) => {
    e.stopPropagation();
    setNoButtonClicks(prev => prev + 1);
    
    // Generate random position within viewport bounds
    const maxX = window.innerWidth > 768 ? 300 : 150;
    const maxY = window.innerWidth > 768 ? 200 : 100;
    
    setNoButtonPosition({
      x: (Math.random() - 0.5) * maxX,
      y: (Math.random() - 0.5) * maxY
    });
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    const cleanInput = inputValue.toLowerCase().replace(/[^a-z0-9]/g, '');
    const isValid = 
        (cleanInput.includes('dec') && cleanInput.includes('2') && cleanInput.includes('2024')) ||
        (cleanInput.includes('12') && cleanInput.includes('02') && cleanInput.includes('2024')) ||
        (cleanInput.includes('december') && cleanInput.includes('2') && cleanInput.includes('2024'));

    if (isValid) {
        onStart();
    } else {
        setError(true);
        setTimeout(() => setError(false), 1000); 
    }
  };

  return (
    <div className={`relative w-full h-screen flex flex-col justify-center items-center overflow-hidden transition-all duration-1000 ${showInput ? 'bg-black' : 'animate-gradient-mesh'}`}>
      
      {/* Background Particles (Visible in Phase 1) - Updated to Romantic Colors */}
      {!showInput && [...Array(30)].map((_, i) => (
        <motion.div
            key={i}
            className="absolute rounded-full blur-xl"
            initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                opacity: 0.1,
                scale: 0.5
            }}
            animate={{ 
                y: [0, -40, 0],
                x: [0, 20, 0],
                opacity: [0.1, 0.5, 0.1]
            }}
            transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                backgroundColor: ['#ffc0cb', '#e6e6fa', '#87ceeb'][Math.floor(Math.random() * 3)] // Pink, Lavender, Sky Blue
            }}
        />
      ))}

      <AnimatePresence mode='wait'>
        {!showInput ? (
            <motion.div
                key="landing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                className="z-10 relative p-8 md:p-12 rounded-3xl bg-white/5 backdrop-blur-xl glass-card-glow flex flex-col items-center gap-8 md:gap-12 max-w-[90%] md:max-w-3xl mx-4 border border-white/20"
            >
                <div className="text-center">
                    <motion.h1 
                        className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] font-dancing mb-2"
                        animate={{ scale: [1, 1.02, 1], textShadow: ["0px 0px 10px rgba(255,255,255,0.2)", "0px 0px 20px rgba(255,192,203,0.6)", "0px 0px 10px rgba(255,255,255,0.2)"] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                    >
                        Will you be my Valentine?
                    </motion.h1>
                </div>

                <div className="flex gap-6 md:gap-12 justify-center items-center w-full">
                    {/* The BIG RED BUTTON */}
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-red-500/90 hover:bg-red-600 text-white px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-xl md:text-3xl shadow-[0_0_30px_rgba(239,68,68,0.4)] border-2 border-red-300/50 transition-all cursor-pointer relative overflow-hidden group"
                        onClick={handleYesClick}
                    >
                        <span className="relative z-10">YES ❤️</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
                    </motion.button>

                    {/* The Chasing NO Button */}
                    <motion.button
                        animate={{ 
                            x: noButtonPosition.x, 
                            y: noButtonPosition.y,
                            scale: Math.max(0.3, 1 - noButtonClicks * 0.1)
                        }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        onMouseEnter={handleNoClick}
                        onClick={handleNoClick}
                        onTouchStart={handleNoClick}
                        className="bg-white/10 backdrop-blur-md text-gray-300 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-lg md:text-xl border border-white/10 touch-none select-none"
                        style={{ willChange: 'transform' }}
                    >
                        NO 💔
                    </motion.button>
                </div>
            </motion.div>
        ) : (
            <motion.div 
                key="password"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="flex flex-col items-center gap-6 z-20"
            >
                <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                    className="text-8xl filter drop-shadow-[0_0_20px_rgba(255,0,0,0.8)] cursor-default select-none"
                >
                    ❤️
                </motion.div>
                
                <h2 className="text-white text-2xl font-normal font-sans tracking-widest uppercase opacity-80">
                    When did it all start?
                </h2>
                
                <form onSubmit={handleUnlock} className="flex flex-col items-center gap-4 w-full max-w-md">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder=""
                        className={`bg-transparent border-b-2 text-center text-white text-xl p-2 outline-none w-full transition-all
                            ${error ? 'border-red-500 animate-shake text-red-500' : 'border-white/50 focus:border-red-500'}`}
                        autoFocus
                    />
                     
                    {error && (
                        <motion.p className="text-red-500 text-sm font-mono mt-2">
                            ACCESS DENIED. TRY: DEC 2, 2024
                        </motion.p>
                    )}
                    
                    <motion.button 
                        whileHover={{ scale: 1.1, textShadow: "0 0 8px rgb(255, 255, 255)" }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="text-white/50 hover:text-white uppercase tracking-widest text-sm mt-8 transition-colors"
                    >
                        [ Enter ]
                    </motion.button>
                </form>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeartbeatStart;
