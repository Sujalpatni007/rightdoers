import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check,
  Lock,
  BookOpen,
  Beaker,
  Brain,
  GraduationCap,
  Trophy,
  Star,
  ChevronDown,
  ChevronUp,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/App";
import confetti from 'canvas-confetti';

const CURRICULUM_DATA = {
  career: "Nuclear Engineer",
  totalYears: 4,
  years: [
    {
      id: "year9",
      name: "Year 9",
      subtitle: "Foundation Building",
      color: "from-green-500 to-emerald-600",
      icon: "🌱",
      tasks: [
        { id: "y9_t1", title: "Read 1 book every 2 weeks", description: "Start with 'Intro to Nuclear Physics' by Kenneth Krane", points: 100, type: "reading" },
        { id: "y9_t2", title: "Ask teacher for 20 mins extra maths homework", description: "Focus on calculus and algebra fundamentals", points: 50, type: "academics" },
        { id: "y9_t3", title: "Join Science Club", description: "Participate in science experiments and discussions", points: 75, type: "activity" },
        { id: "y9_t4", title: "Watch 'Chernobyl' documentary series", description: "Understand nuclear safety importance", points: 50, type: "learning" },
        { id: "y9_t5", title: "Build a simple solar cell project", description: "Learn basics of energy conversion", points: 150, type: "project" }
      ],
      totalPoints: 425
    },
    {
      id: "year10",
      name: "Year 10",
      subtitle: "Skill Development",
      color: "from-blue-500 to-indigo-600",
      icon: "📚",
      tasks: [
        { id: "y10_t1", title: "Improve Mathematics & Environmental Science scores", description: "Target 90%+ in board exams", points: 200, type: "academics" },
        { id: "y10_t2", title: "Complete online course: Nuclear Energy Basics", description: "MIT OpenCourseWare or Coursera", points: 300, type: "course" },
        { id: "y10_t3", title: "Consider studying Nuclear Fusion in Year 11", description: "Research and prepare for advanced topics", points: 100, type: "planning" },
        { id: "y10_t4", title: "Science Fair: Energy Project", description: "Build nuclear fission/fusion demonstration model", points: 250, type: "project" },
        { id: "y10_t5", title: "Visit BARC/Nuclear facility (virtual tour)", description: "Experience real nuclear operations", points: 150, type: "exposure" }
      ],
      totalPoints: 1000
    },
    {
      id: "year11",
      name: "Year 11",
      subtitle: "Specialization",
      color: "from-purple-500 to-violet-600",
      icon: "🎯",
      tasks: [
        { id: "y11_t1", title: "Take Myers-Briggs Personality Test (MBTI)", description: "Understand your working style for career fit", points: 100, type: "assessment" },
        { id: "y11_t2", title: "Focus daily revision on Physics & Chemistry", description: "2 hours minimum dedicated study", points: 150, type: "academics" },
        { id: "y11_t3", title: "Start JEE Preparation", description: "Join coaching or self-study program", points: 300, type: "exam_prep" },
        { id: "y11_t4", title: "Complete IAEA Radiation Safety e-learning", description: "Free certification from International Atomic Energy Agency", points: 400, type: "certification" },
        { id: "y11_t5", title: "Research IIT Nuclear Engineering programs", description: "Identify target colleges and cutoffs", points: 100, type: "planning" },
        { id: "y11_t6", title: "Internship: Lab assistant (summer)", description: "Apply to local research labs or universities", points: 500, type: "internship" }
      ],
      totalPoints: 1550
    },
    {
      id: "year12",
      name: "Year 12",
      subtitle: "Launch Preparation",
      color: "from-amber-500 to-orange-600",
      icon: "🚀",
      tasks: [
        { id: "y12_t1", title: "JEE Advanced: Target Rank < 5000", description: "Intensive preparation for IIT admission", points: 500, type: "exam_prep" },
        { id: "y12_t2", title: "Apply to BARC Training School (OCES)", description: "Backup option for nuclear career", points: 200, type: "application" },
        { id: "y12_t3", title: "Complete 12th Board with 90%+", description: "Strong academics for college admission", points: 300, type: "academics" },
        { id: "y12_t4", title: "University applications submitted", description: "IIT Kanpur, IIT Madras, BITS Pilani", points: 150, type: "application" },
        { id: "y12_t5", title: "Final Project: Nuclear Reactor Simulation", description: "Use OpenMC or MCNP for basic simulation", points: 600, type: "project" },
        { id: "y12_t6", title: "Connect with Nuclear Engineering Alumni", description: "LinkedIn networking, career guidance", points: 100, type: "networking" }
      ],
      totalPoints: 1850
    }
  ]
};

export default function CurriculumPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [expandedYear, setExpandedYear] = useState("year9");
  const [addedToPath, setAddedToPath] = useState(false);

  const totalPoints = CURRICULUM_DATA.years.reduce((sum, y) => sum + y.totalPoints, 0);

  const handleAddToCurriculum = () => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setAddedToPath(true);
    updateUser({ 
      curriculum: CURRICULUM_DATA,
      selectedCareer: "nuclear_engineer"
    });

    setTimeout(() => {
      navigate("/curriculum-success");
    }, 1500);
  };

  const toggleYear = (yearId) => {
    setExpandedYear(expandedYear === yearId ? null : yearId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
            data-testid="curriculum-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-xl">Your Career Curriculum</h1>
            <p className="text-white/70 text-sm">Personalized for {user?.name || 'You'}</p>
          </div>
        </div>

        {/* Career Card */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl">☢️</span>
            <div className="flex-1">
              <p className="font-bold text-lg">{CURRICULUM_DATA.career}</p>
              <p className="text-white/70 text-sm">{CURRICULUM_DATA.totalYears} Year Journey</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{totalPoints}</p>
              <p className="text-white/60 text-xs">Total Points</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6 pb-32">
        {/* Year Cards */}
        <div className="space-y-4">
          {CURRICULUM_DATA.years.map((year, index) => {
            const isExpanded = expandedYear === year.id;
            const isLocked = index > 0; // For demo, only year 9 is unlocked
            
            return (
              <div key={year.id} className="relative">
                {/* Connection Line */}
                {index > 0 && (
                  <div className="absolute left-6 -top-4 w-0.5 h-4 bg-white/20" />
                )}

                <Card className={`overflow-hidden border-0 ${
                  isExpanded ? 'bg-white/10' : 'bg-white/5'
                } transition-all`}>
                  {/* Year Header */}
                  <button
                    onClick={() => toggleYear(year.id)}
                    className="w-full p-4 flex items-center gap-4"
                    data-testid={`year-${year.id}`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${year.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {isLocked ? <Lock className="w-5 h-5 text-white/50" /> : year.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{year.name}</h3>
                        {index === 0 && (
                          <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                            CURRENT
                          </Badge>
                        )}
                      </div>
                      <p className="text-white/50 text-sm">{year.subtitle}</p>
                    </div>
                    <div className="text-right mr-2">
                      <p className="text-white font-semibold">{year.totalPoints} pts</p>
                      <p className="text-white/40 text-xs">{year.tasks.length} tasks</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-white/50" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white/50" />
                    )}
                  </button>

                  {/* Expanded Tasks */}
                  {isExpanded && (
                    <CardContent className="pt-0 pb-4 px-4">
                      <div className="space-y-3 ml-4 border-l-2 border-white/10 pl-4">
                        {year.tasks.map((task, taskIndex) => (
                          <div 
                            key={task.id}
                            className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all"
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                task.type === 'reading' ? 'bg-blue-500/20 text-blue-400' :
                                task.type === 'academics' ? 'bg-green-500/20 text-green-400' :
                                task.type === 'project' ? 'bg-purple-500/20 text-purple-400' :
                                task.type === 'course' ? 'bg-amber-500/20 text-amber-400' :
                                task.type === 'certification' ? 'bg-pink-500/20 text-pink-400' :
                                'bg-white/10 text-white/60'
                              }`}>
                                {task.type === 'reading' ? <BookOpen className="w-4 h-4" /> :
                                 task.type === 'academics' ? <GraduationCap className="w-4 h-4" /> :
                                 task.type === 'project' ? <Beaker className="w-4 h-4" /> :
                                 task.type === 'course' ? <Brain className="w-4 h-4" /> :
                                 <Star className="w-4 h-4" />}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-white text-sm">{task.title}</p>
                                <p className="text-white/50 text-xs mt-1">{task.description}</p>
                              </div>
                              <Badge className="bg-amber-500/20 text-amber-400 border-0 text-xs">
                                +{task.points}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            );
          })}
        </div>

        {/* Summary Card */}
        <Card className="mt-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">Total Journey</h4>
                <p className="text-white/60 text-sm">{CURRICULUM_DATA.years.reduce((sum, y) => sum + y.tasks.length, 0)} tasks across 4 years</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-amber-400">{totalPoints}</p>
                <p className="text-white/50 text-xs">Total Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
        <Button 
          className={`w-full h-14 text-lg font-semibold transition-all ${
            addedToPath 
              ? "bg-green-500 hover:bg-green-600" 
              : "bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90"
          }`}
          onClick={handleAddToCurriculum}
          disabled={addedToPath}
          data-testid="add-curriculum-btn"
        >
          {addedToPath ? (
            <><Check className="mr-2 w-5 h-5" /> Added to Your Path!</>
          ) : (
            <><Plus className="mr-2 w-5 h-5" /> ADD TO CURRICULUM</>
          )}
        </Button>
      </div>
    </div>
  );
}
