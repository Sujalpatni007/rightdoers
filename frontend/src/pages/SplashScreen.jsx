import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function SplashScreen() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 2500);
    const timer2 = setTimeout(() => navigate("/welcome"), 3000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [navigate]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center">
        {/* IKIGAI SVG Logo */}
        <div className="relative mb-6">
          <div className="w-48 h-48 mx-auto relative">
            {/* Outer cosmic glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-orange-500/30 animate-pulse blur-2xl"></div>
            
            {/* IKIGAI Image */}
            <img 
              src="/140.svg" 
              alt="IKIGAI - Purpose" 
              className="w-full h-full object-contain animate-spin-slow"
              style={{ animationDuration: '20s' }}
            />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
          <span className="text-orange-400">HI</span> AI-APP<span className="text-blue-400">.COM</span>
        </h1>
        <p className="text-xl md:text-2xl font-display text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 font-semibold mb-4">
          Enter the Doers World
        </p>
        
        {/* Tagline */}
        <p className="text-white/80 text-lg font-body tracking-wide">
          Say WOW • Get What You Want
        </p>
        
        {/* Subtitle */}
        <p className="text-white/50 text-sm mt-2 font-body">
          Human Potential Management & Transformation
        </p>

        {/* Loading indicator */}
        <div className="mt-10 flex justify-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
