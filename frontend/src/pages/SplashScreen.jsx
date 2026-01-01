import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Rocket } from "lucide-react";

export default function SplashScreen() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 2000),  // Astro on Mars
      setTimeout(() => setStage(2), 4000),  // Reasoning
      setTimeout(() => setStage(3), 5500),  // Welcome
      setTimeout(() => navigate("/welcome"), 6500)
    ];
    return () => timers.forEach(clearTimeout);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Stage 0: ASTRO DOER on Mars - Moonshot Mindset */}
        {stage === 0 && (
          <motion.div
            key="mars"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center z-10"
          >
            {/* Mars glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 bg-orange-600/20 rounded-full blur-3xl" />
            </div>
            
            {/* Astro Doer SVG */}
            <motion.div 
              className="relative w-64 h-64 mx-auto mb-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <img src="/141.svg" alt="ASTRO DOER" className="w-full h-full object-contain" />
            </motion.div>
            
            <motion.p
              className="text-orange-400 text-sm font-medium mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              🚀 MOONSHOT MINDSET
            </motion.p>
            <motion.h2
              className="text-white text-2xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Reading the <span className="text-orange-400">WOW</span>
            </motion.h2>
            <motion.p
              className="text-white/60 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Way of Work
            </motion.p>
          </motion.div>
        )}

        {/* Stage 1: Reasoning Robo - DeepMind */}
        {stage === 1 && (
          <motion.div
            key="reasoning"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center z-10"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
            </div>
            
            <motion.div 
              className="relative w-56 h-56 mx-auto mb-4"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <img src="/140.svg" alt="AI Reasoning" className="w-full h-full object-contain" />
            </motion.div>
            
            <motion.p
              className="text-blue-400 text-sm font-medium mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              🧠 POWERED BY DEEP REASONING
            </motion.p>
            <motion.h2
              className="text-white text-xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              An <span className="text-purple-400">AGENTIC AI</span> Built For
            </motion.h2>
          </motion.div>
        )}

        {/* Stage 2: The 4 D's */}
        {stage === 2 && (
          <motion.div
            key="4ds"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center z-10 px-6"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 rounded-full blur-3xl" />
            </div>
            
            <motion.div className="space-y-3">
              {["DREAMERS", "DOERS", "DISRUPTERS", "DEEP HUMANS"].map((word, i) => (
                <motion.h1
                  key={word}
                  className={`text-3xl md:text-4xl font-bold ${
                    i === 0 ? 'text-purple-400' :
                    i === 1 ? 'text-pink-400' :
                    i === 2 ? 'text-orange-400' :
                    'text-emerald-400'
                  }`}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                >
                  {word}
                </motion.h1>
              ))}
            </motion.div>
            
            <motion.p
              className="text-white/60 text-sm mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Towards a shared foresighted future
            </motion.p>
          </motion.div>
        )}

        {/* Stage 3: Welcome to Doers World */}
        {stage === 3 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center z-10"
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
              <span className="text-orange-400">HI</span> AI
            </h1>
            <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 font-bold mb-4">
              WELCOME TO DOERS WORLD
            </p>
            <p className="text-white/50 text-sm">
              World Expo 2031 • The Impact Begins Now
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading bar */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 6, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
}
