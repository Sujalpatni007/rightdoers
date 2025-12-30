import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Home, Share2, Sparkles } from "lucide-react";
import confetti from 'canvas-confetti';
import { useAuth } from "@/App";

export default function CurriculumSuccessPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Multiple confetti bursts
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f59e0b', '#8b5cf6', '#06b6d4']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f59e0b', '#8b5cf6', '#06b6d4']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-2xl">
          <Check className="w-12 h-12 text-white" />
        </div>

        {/* Title */}
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-4">
          🎉 AMAZING!
        </Badge>
        
        <h1 className="font-display text-3xl font-bold text-white mb-4">
          Curriculum Added!
        </h1>

        {/* Career Message */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 mb-6">
          <div className="text-5xl mb-4">☢️</div>
          <p className="text-white/70 mb-2">You have successfully added</p>
          <h2 className="font-display text-xl font-bold text-white mb-4">
            Talent ON Career Program
          </h2>
          <p className="text-amber-400 font-semibold">
            "We see a future <span className="text-white">Nuclear Engineer</span> in you, {user?.name || 'Champion'}!"
          </p>
        </div>

        {/* Stats Preview */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-2xl font-bold text-white">4</p>
            <p className="text-white/50 text-xs">Years</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-2xl font-bold text-white">23</p>
            <p className="text-white/50 text-xs">Tasks</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-2xl font-bold text-amber-400">4,825</p>
            <p className="text-white/50 text-xs">Points</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
            onClick={() => navigate("/progress-dashboard")}
            data-testid="go-dashboard-btn"
          >
            <Sparkles className="mr-2 w-5 h-5" /> Go to Dashboard
          </Button>
          
          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="flex-1 h-12 border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate("/")}
            >
              <Home className="mr-2 w-4 h-4" /> Home
            </Button>
            <Button 
              variant="outline"
              className="flex-1 h-12 border-white/20 text-white hover:bg-white/10"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'My Career Path',
                    text: `I just started my journey to become a Nuclear Engineer with Right Doers World! 🚀`,
                    url: 'https://hi-ai-app.com'
                  });
                }
              }}
            >
              <Share2 className="mr-2 w-4 h-4" /> Share
            </Button>
          </div>
        </div>

        {/* Quote */}
        <p className="text-white/40 text-sm mt-8 italic">
          "The future belongs to those who prepare for it today" - Malcolm X
        </p>
      </div>
    </div>
  );
}
