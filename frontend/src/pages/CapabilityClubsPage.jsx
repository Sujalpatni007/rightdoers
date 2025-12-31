import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Zap, 
  Users, 
  Trophy,
  Flame,
  Star,
  Lock,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/App";
import BottomNavNew from "@/components/BottomNavNew";

const CAPABILITY_CLUBS = [
  {
    id: "communications",
    name: "Communications",
    icon: "💬",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "Master the art of expression & connection",
    members: 2847,
    gigs: 156,
    skills: ["Public Speaking", "Writing", "Negotiation", "Storytelling"],
    streak: 7,
    progress: 68,
    energyFlow: 1250,
    unlocked: true
  },
  {
    id: "care",
    name: "Care",
    icon: "💚",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    description: "Nurture wellness & human connection",
    members: 1923,
    gigs: 89,
    skills: ["Empathy", "Healthcare", "Counseling", "First Aid"],
    streak: 3,
    progress: 45,
    energyFlow: 890,
    unlocked: true
  },
  {
    id: "curiosity",
    name: "Curiosity",
    icon: "🔬",
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    description: "Explore, discover & innovate",
    members: 3156,
    gigs: 234,
    skills: ["Research", "Analysis", "Critical Thinking", "Problem Solving"],
    streak: 12,
    progress: 82,
    energyFlow: 2100,
    unlocked: true
  },
  {
    id: "creativity",
    name: "Creativity",
    icon: "🎨",
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    description: "Design, create & inspire",
    members: 2341,
    gigs: 178,
    skills: ["Design", "Art", "Music", "Content Creation"],
    streak: 5,
    progress: 56,
    energyFlow: 1560,
    unlocked: true
  },
  {
    id: "calculation",
    name: "Calculation",
    icon: "🧮",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description: "Analyze, compute & optimize",
    members: 1876,
    gigs: 145,
    skills: ["Data Analysis", "Finance", "Statistics", "Coding"],
    streak: 0,
    progress: 23,
    energyFlow: 670,
    unlocked: false
  }
];

export default function CapabilityClubsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedClub, setSelectedClub] = useState(null);

  const totalEnergy = CAPABILITY_CLUBS.reduce((sum, club) => sum + club.energyFlow, 0);
  const userStreak = Math.max(...CAPABILITY_CLUBS.map(c => c.streak));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate("/dashboard")}
            data-testid="clubs-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-xl">Capability Clubs</h1>
            <p className="text-white/70 text-sm">5C Framework • My Energy = Your Energy</p>
          </div>
          <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full">
            <Flame className="w-4 h-4 text-orange-300" />
            <span className="font-bold text-sm">{userStreak}</span>
          </div>
        </div>

        {/* Energy Flow Summary */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wide">Total Energy Flow</p>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-300" />
                <span className="font-display text-2xl font-bold">{totalEnergy.toLocaleString()}</span>
                <span className="text-white/60 text-sm">D-COIN</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs">Clubs Active</p>
              <p className="font-bold text-lg">{CAPABILITY_CLUBS.filter(c => c.unlocked).length}/5</p>
            </div>
          </div>
          <p className="text-white/50 text-xs text-center italic">
            &ldquo;Give Energy, Receive Harmony&rdquo; ✨
          </p>
        </div>
      </header>

      {/* Clubs Grid */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-slate-900">Your 5 Clubs</h2>
          <Badge variant="outline" className="bg-white">
            <Sparkles className="w-3 h-3 mr-1" /> Prakruti Powered
          </Badge>
        </div>

        <div className="space-y-4">
          {CAPABILITY_CLUBS.map((club) => (
            <Card 
              key={club.id}
              className={`overflow-hidden border-2 transition-all duration-300 ${
                club.unlocked 
                  ? `${club.borderColor} hover:shadow-lg cursor-pointer` 
                  : 'border-slate-200 opacity-60'
              }`}
              onClick={() => club.unlocked && setSelectedClub(club)}
              data-testid={`club-${club.id}`}
            >
              <CardContent className="p-0">
                <div className="flex">
                  {/* Icon Section */}
                  <div className={`w-24 bg-gradient-to-br ${club.color} flex flex-col items-center justify-center p-4 text-white`}>
                    <span className="text-4xl mb-1">{club.icon}</span>
                    {club.unlocked ? (
                      <div className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-300" />
                        <span className="text-xs font-bold">{club.streak}</span>
                      </div>
                    ) : (
                      <Lock className="w-4 h-4 text-white/60" />
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-display font-bold text-slate-900">{club.name}</h3>
                        <p className="text-slate-500 text-xs">{club.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>

                    {/* Progress */}
                    {club.unlocked && (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <Progress value={club.progress} className="h-2 flex-1" />
                          <span className="text-xs font-medium text-slate-600">{club.progress}%</span>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-4 text-xs">
                          <span className="flex items-center gap-1 text-slate-500">
                            <Users className="w-3 h-3" /> {club.members.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1 text-amber-600 font-medium">
                            <Zap className="w-3 h-3" /> {club.energyFlow} D-COIN
                          </span>
                          <Badge variant="outline" className="text-[10px] px-2 py-0">
                            {club.gigs} Gigs
                          </Badge>
                        </div>
                      </>
                    )}

                    {!club.unlocked && (
                      <p className="text-slate-400 text-xs mt-2">
                        Complete Curiosity quiz to unlock
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Daily Challenge Banner */}
      <div className="px-4 pb-6">
        <Card className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-white/70 text-xs uppercase tracking-wide">Daily Challenge</p>
                <h3 className="font-semibold">Complete 1 Curiosity Quiz</h3>
                <p className="text-white/70 text-sm">Earn +50 D-COIN & unlock Gig access</p>
              </div>
              <Button 
                className="bg-white text-amber-600 hover:bg-white/90"
                size="sm"
                onClick={() => navigate("/psychometric")}
              >
                Start
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Overview */}
      <div className="px-4 pb-6">
        <h3 className="font-display font-semibold text-slate-900 mb-3">Your Top Skills</h3>
        <div className="flex flex-wrap gap-2">
          {["Public Speaking", "Research", "Design", "Data Analysis", "Empathy"].map((skill) => (
            <Badge 
              key={skill} 
              variant="outline" 
              className="bg-white px-3 py-1.5 text-sm"
            >
              <Star className="w-3 h-3 mr-1 text-amber-500" /> {skill}
            </Badge>
          ))}
        </div>
      </div>

      <BottomNavNew active="clubs" />
    </div>
  );
}
