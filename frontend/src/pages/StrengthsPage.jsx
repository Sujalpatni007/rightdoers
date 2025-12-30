import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { useAuth } from "@/App";

const STRENGTHS = [
  { id: "listening", label: "Listening", icon: "👂", score: 0 },
  { id: "speaking", label: "Speaking", icon: "🗣️", score: 0 },
  { id: "problem_solving", label: "Problem Solving", icon: "🧩", score: 0 },
  { id: "creativity", label: "Creativity", icon: "💡", score: 0 },
  { id: "staying_positive", label: "Staying Positive", icon: "🌱", score: 0 },
  { id: "aiming_high", label: "Aiming High", icon: "🎯", score: 0 },
  { id: "leadership", label: "Leadership", icon: "👑", score: 0 },
  { id: "teamwork", label: "Teamwork", icon: "🤝", score: 0 }
];

const TRAIT_BARS = [
  { id: "creative", label: "CREATIVE", color: "bg-purple-500" },
  { id: "adaptable", label: "ADAPTABLE", color: "bg-blue-500" },
  { id: "resilient", label: "RESILIENT", color: "bg-orange-500" },
  { id: "teamwork", label: "TEAMWORK", color: "bg-green-500" }
];

export default function StrengthsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  // Calculate scores from self-ratings
  const selfRatings = user?.selfRatings || { creative: 5, adaptable: 5, resilient: 5, teamwork: 5 };
  
  // Generate strength scores based on self-ratings
  const calculateStrengthScores = () => {
    const avgRating = Object.values(selfRatings).reduce((a, b) => a + b, 0) / 4;
    return STRENGTHS.map(s => ({
      ...s,
      score: Math.min(100, Math.round(avgRating * 10 + Math.random() * 20))
    }));
  };

  const [strengths] = useState(calculateStrengthScores());

  const handleContinue = () => {
    updateUser({ strengths: strengths });
    navigate("/academic-selection");
  };

  // Get top 3 strengths
  const topStrengths = [...strengths].sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={() => navigate(-1)}
          data-testid="strengths-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <Progress value={60} className="h-2 bg-white/10" />
        </div>
        <span className="text-sm text-white/50 font-medium">Step 3/4</span>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 pb-32 overflow-y-auto">
        <div className="max-w-md mx-auto">
          {/* Section Title */}
          <div className="text-center mb-6">
            <h1 className="font-display text-2xl font-bold text-white mb-2">
              MY PERSONALITY
            </h1>
            <p className="text-white/50">
              Your strengths & skills revealed
            </p>
          </div>

          {/* Strengths Grid */}
          <div className="mb-8">
            <h2 className="text-white/70 text-sm font-semibold uppercase tracking-wide mb-4">
              MY STRENGTHS & SKILLS
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {strengths.map((strength) => {
                const isTop = topStrengths.find(s => s.id === strength.id);
                return (
                  <div 
                    key={strength.id}
                    className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                      isTop 
                        ? "bg-amber-500/20 border-amber-500/30" 
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <span className="text-2xl mb-1">{strength.icon}</span>
                    <span className="text-white text-[10px] text-center font-medium">
                      {strength.label}
                    </span>
                    {isTop && (
                      <Badge className="mt-1 text-[8px] px-1 py-0 bg-amber-500 text-white border-0">
                        TOP
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trait Bars */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
            <h2 className="text-white/70 text-sm font-semibold uppercase tracking-wide mb-4">
              YOUR TRAIT LEVELS
            </h2>
            <div className="space-y-4">
              {TRAIT_BARS.map((trait) => {
                const score = selfRatings[trait.id] * 10;
                return (
                  <div key={trait.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-white text-sm font-medium">{trait.label}</span>
                      <span className="text-white/60 text-sm">{score}%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${trait.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Strengths Summary */}
          <div className="mt-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-4">
            <h3 className="text-amber-400 font-semibold mb-3">🏆 Your Top Strengths</h3>
            <div className="flex flex-wrap gap-2">
              {topStrengths.map((s, i) => (
                <Badge key={s.id} className="bg-white/10 text-white border-0">
                  {i + 1}. {s.icon} {s.label} ({s.score}%)
                </Badge>
              ))}
            </div>
          </div>

          {/* View Details Link */}
          <button className="w-full mt-4 py-3 text-center text-indigo-400 text-sm font-medium hover:text-indigo-300 flex items-center justify-center gap-2">
            <Eye className="w-4 h-4" /> VIEW DETAILS
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
        <Button 
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 max-w-md mx-auto"
          onClick={handleContinue}
          data-testid="strengths-continue-btn"
        >
          NEXT <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
