import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0); // 0: Astro, 1: Welcome, 2: Fade out

  useEffect(() => {
    // Stage 0 → 1: Show Astro for 1.5s
    const timer1 = setTimeout(() => setStage(1), 1500);
    // Stage 1 → 2: Show Welcome for 1.5s
    const timer2 = setTimeout(() => setStage(2), 3000);
    // Navigate after fade
    const timer3 = setTimeout(() => navigate("/welcome"), 3500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Stage 0: ASTRO DOER Loading */}
        {stage === 0 && (
          <motion.div
            key="astro"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Cosmic glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" />
            </div>
            
            {/* ASTRO DOER SVG */}
            <motion.div 
              className="relative w-64 h-64 mx-auto mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <img 
                src="/141.svg" 
                alt="ASTRO DOER" 
                className="w-full h-full object-contain"
              />
            </motion.div>
            
            {/* Loading text */}
            <motion.p 
              className="text-white/60 text-sm"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading...
            </motion.p>
            
            {/* Loading dots */}
            <div className="mt-4 flex justify-center gap-2">
              <motion.div 
                className="w-2 h-2 bg-purple-400 rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              />
              <motion.div 
                className="w-2 h-2 bg-pink-400 rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
              />
              <motion.div 
                className="w-2 h-2 bg-orange-400 rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {/* Stage 1: RIGHT DOERS WELCOMES YOU */}
        {stage === 1 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center px-6"
          >
            {/* Cosmic background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[500px] h-[500px] bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
            </div>
            
            {/* Sketch/IKIGAI Image */}
            <motion.div 
              className="relative w-72 h-48 mx-auto mb-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src="/140.svg" 
                alt="Right Doers" 
                className="w-full h-full object-contain rounded-2xl"
              />
            </motion.div>
            
            {/* Welcome Text */}
            <motion.h1 
              className="font-display text-3xl md:text-4xl font-bold text-white mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-orange-400">RIGHT DOERS</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 font-semibold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              WELCOMES YOU
            </motion.p>
            
            {/* Tagline */}
            <motion.p 
              className="text-white/70 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Say WOW • Get What You Want
            </motion.p>
          </motion.div>
        )}

        {/* Stage 2: Fade to Landing */}
        {stage === 2 && (
          <motion.div
            key="fadeout"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl font-bold text-white">
              <span className="text-orange-400">HI</span> AI-APP<span className="text-blue-400">.COM</span>
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
