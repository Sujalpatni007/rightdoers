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
    <div className={`min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto relative">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 animate-spin-slow opacity-50 blur-xl"></div>
            
            {/* Main logo container */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-2xl">
              <Sparkles className="w-16 h-16 text-white animate-pulse" />
            </div>
            
            {/* Rising sun effect */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-12 bg-gradient-to-t from-orange-500/50 to-transparent rounded-t-full blur-md"></div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
          Right Doers
        </h1>
        <p className="text-2xl md:text-3xl font-display text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 font-semibold mb-4">
          WORLD
        </p>
        
        {/* Tagline */}
        <p className="text-white/80 text-lg font-body tracking-wide">
          Dream → Do → Done
        </p>
        
        {/* Subtitle */}
        <p className="text-white/50 text-sm mt-2 font-body">
          The Future of Work
        </p>

        {/* Loading indicator */}
        <div className="mt-12 flex justify-center gap-2">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
