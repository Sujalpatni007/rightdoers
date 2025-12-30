import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Award, 
  ChevronRight,
  BookOpen,
  Target,
  Zap,
  Lock,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/App";
import BottomNavNew from "@/components/BottomNavNew";

const COURSES = {
  featured: [
    { id: 1, title: "Career Discovery 101", duration: "10 min", level: "L1", progress: 0, thumbnail: "🎯", locked: false },
    { id: 2, title: "Interview Skills Masterclass", duration: "25 min", level: "L1", progress: 0, thumbnail: "🎤", locked: false },
    { id: 3, title: "Build Your Personal Brand", duration: "15 min", level: "L2", progress: 0, thumbnail: "⭐", locked: true },
  ],
  tech: [
    { id: 4, title: "Python in 30 Days", duration: "30 hrs", level: "L2", progress: 45, thumbnail: "🐍", locked: false },
    { id: 5, title: "Web Development Basics", duration: "20 hrs", level: "L1", progress: 0, thumbnail: "🌐", locked: false },
    { id: 6, title: "AI & Machine Learning", duration: "40 hrs", level: "L3", progress: 0, thumbnail: "🤖", locked: true },
  ],
  soft: [
    { id: 7, title: "Communication Excellence", duration: "2 hrs", level: "L1", progress: 100, thumbnail: "💬", locked: false },
    { id: 8, title: "Leadership Fundamentals", duration: "5 hrs", level: "L2", progress: 30, thumbnail: "👑", locked: false },
    { id: 9, title: "Problem Solving", duration: "3 hrs", level: "L1", progress: 0, thumbnail: "🧩", locked: false },
  ]
};

const LEVEL_COLORS = {
  L1: "bg-green-500",
  L2: "bg-blue-500",
  L3: "bg-purple-500",
  L4: "bg-amber-500",
};

export default function LearnPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState("featured");

  const totalCompleted = 1;
  const totalCourses = 9;
  const xpPoints = 450;

  const handleStartCourse = (course) => {
    if (course.locked) {
      toast.error("Complete previous levels to unlock this course");
      return;
    }
    toast.success(`Starting: ${course.title}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-4 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-xl font-bold">Glocal Gurukul</h1>
            <p className="text-white/70 text-sm">Learn & Level Up</p>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white/70 text-sm">Your Progress</p>
              <p className="font-display font-bold text-2xl">{totalCompleted}/{totalCourses} Courses</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-amber-300">
                <Zap className="w-5 h-5" />
                <span className="font-bold text-xl">{xpPoints}</span>
              </div>
              <p className="text-white/60 text-xs">XP Points</p>
            </div>
          </div>
          <Progress value={(totalCompleted / totalCourses) * 100} className="h-2 bg-white/20" />
        </div>
      </header>

      {/* Level Progress */}
      <div className="px-4 -mt-12 relative z-10 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-slate-900">Level Progress</span>
            <Badge className="bg-green-100 text-green-700">L1 → L2</Badge>
          </div>
          <div className="flex items-center gap-3">
            {["L1", "L2", "L3", "L4", "L5"].map((level, i) => (
              <div key={level} className="flex-1 text-center">
                <div className={`
                  w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center text-white font-bold text-sm
                  ${i === 0 ? "bg-green-500" : i === 1 ? "bg-green-200 text-green-700" : "bg-slate-200 text-slate-400"}
                `}>
                  {i === 0 ? <CheckCircle className="w-5 h-5" /> : level}
                </div>
                <span className="text-xs text-slate-500">{level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Tabs */}
      <div className="px-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="tech">Tech Skills</TabsTrigger>
            <TabsTrigger value="soft">Soft Skills</TabsTrigger>
          </TabsList>

          {Object.entries(COURSES).map(([key, courses]) => (
            <TabsContent key={key} value={key} className="space-y-3">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => handleStartCourse(course)}
                  className={`w-full text-left bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-all ${course.locked ? "opacity-60" : ""}`}
                  data-testid={`course-${course.id}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className={`w-16 h-16 ${LEVEL_COLORS[course.level]} rounded-xl flex items-center justify-center text-3xl`}>
                      {course.locked ? <Lock className="w-6 h-6 text-white" /> : course.thumbnail}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 truncate">{course.title}</h3>
                        {course.progress === 100 && (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {course.duration}
                        </span>
                        <Badge variant="outline" className="text-xs">{course.level}</Badge>
                      </div>
                      {course.progress > 0 && course.progress < 100 && (
                        <div className="mt-2">
                          <Progress value={course.progress} className="h-1" />
                        </div>
                      )}
                    </div>

                    {/* Action */}
                    <div className="flex-shrink-0">
                      {course.locked ? (
                        <Lock className="w-5 h-5 text-slate-300" />
                      ) : course.progress === 100 ? (
                        <Badge className="bg-green-100 text-green-700">Done</Badge>
                      ) : course.progress > 0 ? (
                        <Badge className="bg-blue-100 text-blue-700">{course.progress}%</Badge>
                      ) : (
                        <Play className="w-8 h-8 text-indigo-600" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Daily Challenge */}
      <div className="px-4 py-6">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Target className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <Badge className="bg-white/20 text-white border-0 mb-1">Daily Challenge</Badge>
              <h3 className="font-display font-semibold">Complete 1 course today</h3>
              <p className="text-white/70 text-sm">Earn 100 XP bonus</p>
            </div>
            <ChevronRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      <BottomNav active="learn" />
    </div>
  );
}
