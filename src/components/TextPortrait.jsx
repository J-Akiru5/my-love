import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import portraitImage from '../assets/Gwapa.jpg';
import './TextPortrait.css';

// Google Drive video embed link
const VIDEO_URL = "https://drive.google.com/file/d/11enSLDu3zFSj-_1kxvaKESrnUr1x_kbM/preview";

// Import Specific High Quality Images for "Hidden Words"
const hqImagesModules = import.meta.glob('../assets/images/*A7K*.{jpg,jpeg,png,JPG}', { eager: true });
const hqImages = Object.values(hqImagesModules).map(mod => mod.default);

const TextPortrait = ({ audioRef }) => {
    const [hearts, setHearts] = useState([]);
    const [activeImage, setActiveImage] = useState(null);
    const [textContent, setTextContent] = useState({ part1: [], loopText: "" });
    const [videoPlaying, setVideoPlaying] = useState(false);

    // Lower music volume when this component mounts
    useEffect(() => {
        if (audioRef && audioRef.current) {
            // Smoothly fade out music volume
            const fadeAudio = setInterval(() => {
                if (audioRef.current.volume > 0.15) {
                    audioRef.current.volume -= 0.05;
                } else {
                    clearInterval(fadeAudio);
                }
            }, 200);

            return () => clearInterval(fadeAudio);
        }
    }, [audioRef]);

    // Interactive Words Configuration - Mapped to all HQ Images
    const interactiveKeywords = {
        // Core words
        "Lighthouse": hqImages[0],
        "heart": hqImages[1],
        "journey": hqImages[2],
        "Light": hqImages[3],
        
        // Extended words for remaining images
        "special": hqImages[4],
        "attention": hqImages[5],
        "person": hqImages[6],
        "love": hqImages[7],
        "victory": hqImages[8],
        "timing": hqImages[9] || hqImages[0], // Fallbacks if fewer than 10
        "wait": hqImages[10] || hqImages[1],
        "Lord": hqImages[11] || hqImages[2]
    };

    // Helper to render text with interactive words
    const renderInteractiveText = (text) => {
        const words = text.split(' ');
        return words.map((word, i) => {
            // Clean punctuation for matching
            const cleanWord = word.replace(/[^a-zA-Z]/g, '');
            const imageSrc = interactiveKeywords[cleanWord] || interactiveKeywords[word];

            if (imageSrc) {
                return (
                    <span 
                        key={i} 
                        className="interactive-word"
                        // Hover for Desktop
                        onMouseEnter={() => setActiveImage(imageSrc)}
                        onMouseLeave={() => setActiveImage(null)}
                        // Click/Tap for Mobile
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent heart generation
                            setActiveImage(imageSrc === activeImage ? null : imageSrc);
                        }}
                    >
                        {word}{' '}
                    </span>
                );
            }
            return word + ' ';
        });
    };

    const letter = `To: My Lighthouse Dec. 2, 2024. I just want you to know that you are the person that I want, the one who caught my attention, my interest, and my heart. I'm so thankful kay Lord because I have met a girl like you. Someone who is willing to support me, who can accept me for who I am, and someone who believes in me and in the potential that I have. I just realized something na if the Lord wants something to happen, it will happen no matter what the circumstances are. With God's proper place and timing, everything will come to its place. Isaiah 60:22 - "When the time is right, I, the Lord will make it happen." That is why I prayed to him na mahulat lang ako sa girl nga itao nya sa akon and I trusted him. Then I met you. You are special to me and I want you to know that I treat you differently from others. I want to be with you, I want to be as close to you as possible. I want you. That is what I mean sa answer ko sa question mo, sorry if wala ko na say mayad sa imo. I think I already fell in love with you. I want you to join me in every journey, in the highs and lows, in the good times and in bad, and in every victory that you and I can accomplish. You are the first and I want you to be the last. Allow me to serve you and support you on your goals in life, alongside with the Lord. So this time ako naman ang mamangkot; Are you willing to join me in my journey? From: The man attracted to your Light. `;
    const lyrics = `Goin' out tonight, changes into something red... `;
    
    useEffect(() => {
        const part1 = renderInteractiveText(letter);
        const loopText = (letter + " " + lyrics + " ").repeat(250); // High density
        setTextContent({ part1, loopText });
    }, []);

    const addHeart = (e) => {
        // Don't spawn heart if clicking interactive word (handled by stopPropagation)
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const newHeart = {
            id: Date.now(),
            x,
            y,
            emoji: ['❤️', '💖', '💝', '💕'][Math.floor(Math.random() * 4)]
        };
        
        setHearts(prev => [...prev, newHeart]);
        setTimeout(() => setHearts(prev => prev.filter(h => h.id !== newHeart.id)), 1500);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="portrait-container"
            onClick={addHeart}
        >
            {/* Text Layer - Mixed Interactive content and Filler */}
            <div className="text-layer">
                {textContent.part1}
                {textContent.loopText}
            </div>

            {/* Image Layer */}
            <div className="image-layer">
                 <img src={portraitImage} alt="Portrait Overlay" />
            </div>

            {/* Watermark */}
             <div className="watermark flex flex-col items-start gap-0">
                <span className="text-white drop-shadow-md">Hazel Dato-on</span>
                <span className="text-5xl text-red-600 block ml-14 -mt-2 drop-shadow-md font-bold" style={{ opacity: 1 }}>My Love</span>
            </div>

            {/* Video Overlay - Lower Right with Play Button */}
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1 }}
                className="video-overlay"
            >
                {!videoPlaying && (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setVideoPlaying(true)}
                        className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-lg cursor-pointer group"
                    >
                        <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-pink-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                    </motion.button>
                )}
                
                {videoPlaying ? (
                    <iframe 
                        src={VIDEO_URL}
                        className="w-full h-full rounded-lg"
                        allow="autoplay"
                        allowFullScreen
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-300 rounded-lg flex items-center justify-center">
                        <span className="text-4xl">🎥</span>
                    </div>
                )}
            </motion.div>

            {/* Hidden Word Reveal Popup (Modal) */}
            <AnimatePresence>
                {activeImage && (
                    <div 
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveImage(null); // Close on backdrop click
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            className="relative p-2"
                        >
                            <img 
                                src={activeImage} 
                                alt="Hidden Memory" 
                                className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-2xl border-4 border-gold/50"
                                style={{ boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)' }}
                            />
                            <p className="text-white text-center mt-4 font-bold animate-pulse">Tap anywhere to close</p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Interactive Hearts */}
            <AnimatePresence>
                {hearts.map(heart => (
                    <motion.div
                        key={heart.id}
                        initial={{ opacity: 1, y: heart.y, x: heart.x, scale: 0.5 }}
                        animate={{ opacity: 0, y: heart.y - 100, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        style={{ 
                            position: 'absolute', 
                            zIndex: 100,
                            pointerEvents: 'none',
                            fontSize: '2rem' 
                        }}
                    >
                        {heart.emoji}
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
};

export default TextPortrait;
