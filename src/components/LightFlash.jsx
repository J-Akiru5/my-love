import { motion } from 'framer-motion';
import { useEffect } from 'react';

const LightFlash = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 2,
        times: [0, 0.15, 0.4, 1],
        ease: "easeInOut"
      }}
      style={{
        background: 'radial-gradient(circle at center, #ffffff, #fff5f5, #ffe0ec)',
      }}
    />
  );
};

export default LightFlash;
