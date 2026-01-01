import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  GraduationCap,
  Target,
  Brain,
  Rocket,
  BookOpen,
  Star,
  Award,
  TrendingUp,
  Users,
  Compass,
  ChevronRight,
  Sparkles,
  Zap,
  Map,
  Play,
  CheckCircle,
  Lock,
  Coins
} from "lucide-react";
import { toast } from "sonner";
import { API } from "@/App";
import axios from "axios";

// 5E Journey Phases
const FIVE_E_PHASES = [
  { id: "explore", name: "EXPLORE", emoji: "🔍", color: "from-blue-500 to-cyan-500", desc: "Discover Your Path" },
  { id: "educate", name: "EDUCATE", emoji: "📚", color: "from-purple-500 to-pink-500", desc: "Build Knowledge" },
  { id: "employ", name: "EMPLOY", emoji: "💼", color: "from-green-500 to-emerald-500", desc: "Gain Experience" },
  { id: "enterprise", name: "ENTERPRISE", emoji: "🚀", color: "from-orange-500 to-amber-500", desc: "Create Impact" },
  { id: "excel", name: "EXCEL", emoji: "⭐", color: "from-yellow-500 to-red-500", desc: "Lead & Transform" }
];

// Career Capsules for Teens
const TEEN_CAPSULES = [
  { id: 1, title: "Fashion Design Basics", category: "Arts", duration: "15 min", coins: 25, completed: true },
  { id: 2, title: "Coding Your First App", category: "Tech", duration: "20 min", coins: 30, completed: true },
  { id: 3, title: "Digital Marketing 101", category: "Business", duration: "15 min", coins: 25, completed: false },
  { id: 4, title: "Healthcare Heroes", category: "Health", duration: "15 min", coins: 25, completed: false },
  { id: 5, title: "Sustainable Futures", category: "Environment", duration: "20 min", coins: 30, completed: false, locked: true }
];

// Assessment Status
const ASSESSMENTS = [
  { id: "personality", name: "Personality (MBTI)", completed: true, score: 85 },
  { id: "interest", name: "Career Interest (RIASEC)", completed: true, score: 78 },
  { id: "learning", name: "Learning Style (VARK)", completed: false, score: 0 },
  { id: "eq", name: "Emotional Intelligence", completed: false, score: 0 },
  { id: "intelligence", name: "Multiple Intelligence", completed: false, score: 0 },
  { id: "aptitude", name: "Aptitude & Skills", completed: false, score: 0 }
];

export default function DoerTeensDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(1); // 1 = Explore
  const [dCoins, setDCoins] = useState(275);
  const [anushreeProfile, setAnushreeProfile] = useState(null);

  useEffect(() => {
    fetchProvenProfile();
  }, []);

  const fetchProvenProfile = async () => {
    try {
      const response = await axios.get(`${API}/proven-profiles/featured/anushree`);
      setAnushreeProfile(response.data);
    } catch (error) {
      console.error("Error fetching Anushree profile:", error);
    }
  };

  const completedAssessments = ASSESSMENTS.filter(a => a.completed).length;
  const totalAssessments = ASSESSMENTS.length;
  const doersScore = 680; // Will come from profile

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-purple-900/80 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => navigate(-1)}
            data-testid="teens-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-white font-bold flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-400" />
              DOER TEENS
            </h1>
            <Badge className="bg-purple-500/20 text-purple-400 border-0 text-[10px] mt-1">
              🎓 Career Clarity
            </Badge>
          </div>
          <div className="flex items-center gap-1 bg-amber-500/20 px-3 py-1 rounded-full">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-bold">{dCoins}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* DoersScore Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 border-0 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Your DoersScore™</p>
                  <h2 className="text-white text-4xl font-bold">{doersScore}<span className="text-xl text-white/60">/900</span></h2>
                  <Badge className="bg-white/20 text-white border-0 mt-2">
                    Level: ASSOCIATE
                  </Badge>
                </div>
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <Target className="w-8 h-8 text-white mx-auto" />
                    <span className="text-white/60 text-xs">Top 35%</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button
                  className="flex-1 bg-white/20 hover:bg-white/30"
                  onClick={() => navigate("/dp")}
                  data-testid="teens-view-profile"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  View Full Profile
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 text-white"
                  onClick={() => navigate("/compare")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Compare
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* 5E Journey Progress */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Rocket className="w-5 h-5 text-orange-400" />
              Your 5E Journey
            </h3>
            <Badge className="bg-white/10 text-white/60 border-0">
              Phase {currentPhase}/5
            </Badge>
          </div>
          
          {/* Journey Progress Bar */}
          <div className="relative">
            <div className="flex justify-between mb-2">
              {FIVE_E_PHASES.map((phase, idx) => (
                <motion.div
                  key={phase.id}
                  whileHover={{ scale: 1.1 }}
                  className={`flex flex-col items-center cursor-pointer ${idx < currentPhase ? 'opacity-100' : 'opacity-50'}`}
                  onClick={() => toast.info(`${phase.name}: ${phase.desc}`)}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${idx < currentPhase ? `bg-gradient-to-br ${phase.color}` : 'bg-white/10'}`}>
                    {phase.emoji}
                  </div>
                  <span className="text-white/60 text-xs mt-1">{phase.name}</span>
                </motion.div>
              ))}
            </div>
            <Progress value={(currentPhase / 5) * 100} className="h-2 bg-white/10" />
          </div>
        </section>

        {/* 6D Assessment Progress */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                6D Assessment
              </span>
              <Badge className="bg-purple-500/20 text-purple-400 border-0">
                {completedAssessments}/{totalAssessments} Done
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {ASSESSMENTS.map((assessment) => (
                <div
                  key={assessment.id}
                  className={`p-3 rounded-xl ${assessment.completed ? 'bg-green-500/10 border border-green-500/30' : 'bg-white/5'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm">{assessment.name}</span>
                    {assessment.completed ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-white/30" />
                    )}
                  </div>
                  {assessment.completed && (
                    <div className="flex items-center gap-2">
                      <Progress value={assessment.score} className="h-1.5 flex-1 bg-white/10" />
                      <span className="text-green-400 text-xs">{assessment.score}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button
              className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500"
              onClick={() => navigate("/psychometric")}
              data-testid="teens-continue-assessment"
            >
              Continue Assessment
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Anushree's Story - Inspiration */}
        {anushreeProfile && (
          <Card className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center text-3xl">
                  👩‍🎨
                </div>
                <div className="flex-1">
                  <Badge className="bg-amber-500/20 text-amber-400 border-0 text-xs mb-1">
                    <Star className="w-3 h-3 mr-1" /> Success Story
                  </Badge>
                  <h3 className="text-white font-bold">{anushreeProfile.name}</h3>
                  <p className="text-white/60 text-sm">
                    From {anushreeProfile.original_aspiration} → {anushreeProfile.current_role?.split(' ').slice(0, 4).join(' ')}...
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-amber-500/30 text-amber-400"
                  onClick={() => navigate("/proven-profiles")}
                  data-testid="teens-view-anushree"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Inspire Me
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Career Capsules */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Career Capsules
            </h3>
            <Badge className="bg-white/10 text-white/60 border-0">
              {TEEN_CAPSULES.filter(c => c.completed).length}/{TEEN_CAPSULES.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {TEEN_CAPSULES.map((capsule) => (
              <motion.div
                key={capsule.id}
                whileHover={{ scale: capsule.locked ? 1 : 1.02 }}
                className={capsule.locked ? 'opacity-50' : ''}
              >
                <Card className={`bg-white/5 border-white/10 ${capsule.completed ? 'border-l-4 border-l-green-500' : ''}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {capsule.locked ? (
                        <Lock className="w-5 h-5 text-white/30" />
                      ) : capsule.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Play className="w-5 h-5 text-blue-400" />
                      )}
                      <div>
                        <h4 className="text-white font-medium">{capsule.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-white/10 text-white/60 border-0 text-xs">
                            {capsule.category}
                          </Badge>
                          <span className="text-white/40 text-xs">{capsule.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Coins className="w-3 h-3 text-amber-400" />
                        <span className="text-amber-400 text-sm">+{capsule.coins}</span>
                      </div>
                      {!capsule.completed && !capsule.locked && (
                        <ChevronRight className="w-5 h-5 text-white/40" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Career Roadmap CTA */}
        <Card className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Map className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Career Roadmap</h3>
                  <p className="text-white/60 text-sm">Generate your personalized path</p>
                </div>
              </div>
              <Button
                className="bg-gradient-to-r from-green-500 to-emerald-500"
                onClick={() => navigate("/career-roadmap")}
                data-testid="teens-roadmap"
              >
                Generate
                <Zap className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-auto py-4 border-white/20 text-white flex-col gap-2"
            onClick={() => navigate("/jobs4me")}
          >
            <Target className="w-6 h-6 text-blue-400" />
            <span>Jobs4Me</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 border-white/20 text-white flex-col gap-2"
            onClick={() => navigate("/streaks")}
          >
            <TrendingUp className="w-6 h-6 text-orange-400" />
            <span>Daily Streak</span>
          </Button>
        </div>
      </main>
    </div>
  );
}
