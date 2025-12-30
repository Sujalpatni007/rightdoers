import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/App";

const RATING_TRAITS = [
  {
    id: "creative",
    label: "I AM CREATIVE",
    emoji: "🎨",
    description: "I love finding new and unique solutions",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "adaptable",
    label: "I AM ADAPTABLE",
    emoji: "🌊",
    description: "I adjust easily to new situations",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "resilient",
    label: "I AM RESILIENT",
    emoji: "💪",
    description: "I bounce back from challenges quickly",
    color: "from-orange-500 to-red-500"
  },
  {
    id: "teamwork",
    label: "I LOVE TEAMWORK",
    emoji: "🤝",
    description: "I work well with others",
    color: "from-green-500 to-emerald-500"
  }
];

export default function SelfRatingPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  const [ratings, setRatings] = useState({
    creative: 5,
    adaptable: 5,
    resilient: 5,
    teamwork: 5
  });
  const [activeSlider, setActiveSlider] = useState(null);

  const handleSliderChange = (traitId, value) => {
    setRatings({ ...ratings, [traitId]: value });
  };

  const handleContinue = () => {
    updateUser({ selfRatings: ratings });
    navigate("/strengths");
  };

  const averageScore = Math.round(
    Object.values(ratings).reduce((a, b) => a + b, 0) / Object.keys(ratings).length * 10
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={() => navigate(-1)}
          data-testid="rating-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <Progress value={50} className="h-2 bg-white/10" />
        </div>
        <span className="text-sm text-white/50 font-medium">Step 2/4</span>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 pb-32 overflow-y-auto">
        <div className="max-w-md mx-auto">
          {/* Section Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-2">
              GREAT CHOICE!
            </h1>
            <p className="text-white/50">
              How much do you identify with these traits?
            </p>
            <p className="text-amber-400 text-sm mt-2">
              *Use the sliders below to rate yourself
            </p>
          </div>

          {/* Rating Sliders */}
          <div className="space-y-6">
            {RATING_TRAITS.map((trait) => (
              <div 
                key={trait.id} 
                className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-5 transition-all ${
                  activeSlider === trait.id ? "border-white/30 bg-white/10" : "border-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{trait.emoji}</span>
                    <div>
                      <p className="font-semibold text-white text-sm">{trait.label}</p>
                      <p className="text-white/40 text-xs">{trait.description}</p>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${trait.color} flex items-center justify-center font-bold text-white text-lg shadow-lg`}>
                    {ratings[trait.id]}
                  </div>
                </div>
                
                {/* Custom Slider */}
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={ratings[trait.id]}
                    onChange={(e) => handleSliderChange(trait.id, parseInt(e.target.value))}
                    onFocus={() => setActiveSlider(trait.id)}
                    onBlur={() => setActiveSlider(null)}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-thumb"
                    style={{
                      background: `linear-gradient(to right, ${trait.color.includes('purple') ? '#a855f7' : trait.color.includes('blue') ? '#3b82f6' : trait.color.includes('orange') ? '#f97316' : '#22c55e'} 0%, ${trait.color.includes('purple') ? '#a855f7' : trait.color.includes('blue') ? '#3b82f6' : trait.color.includes('orange') ? '#f97316' : '#22c55e'} ${ratings[trait.id] * 10}%, rgba(255,255,255,0.1) ${ratings[trait.id] * 10}%, rgba(255,255,255,0.1) 100%)`
                    }}
                    data-testid={`slider-${trait.id}`}
                  />
                  <div className="flex justify-between mt-2 text-xs text-white/30">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Score Preview */}
          <div className="mt-8 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-4 text-center">
            <p className="text-white/50 text-sm mb-1">Your Self-Awareness Score</p>
            <p className="font-display text-4xl font-bold text-white">{averageScore}<span className="text-lg text-white/50">/100</span></p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
        <Button 
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 max-w-md mx-auto"
          onClick={handleContinue}
          data-testid="rating-continue-btn"
        >
          Continue <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
}
