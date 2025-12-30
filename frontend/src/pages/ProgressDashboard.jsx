import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  Trophy, 
  Gift, 
  Target,
  Zap,
  Calendar,
  Check,
  Clock,
  Star,
  Flame,
  Award,
  ChevronRight,
  BookOpen,
  Play
} from "lucide-react";
import { useAuth } from "@/App";

const WEEKLY_TASKS = [
  { id: 1, title: "Read 'Intro Nuclear Physics' - Chapter 1", points: 100, status: "completed", day: "Mon" },
  { id: 2, title: "Complete Math Homework", points: 50, status: "completed", day: "Tue" },
  { id: 3, title: "Watch Nuclear Safety Video", points: 75, status: "in_progress", day: "Wed" },
  { id: 4, title: "Science Club Meeting", points: 60, status: "not_started", day: "Thu" },
  { id: 5, title: "Quiz: Nuclear Basics", points: 150, status: "not_started", day: "Fri" },
  { id: 6, title: "Weekend Project Work", points: 200, status: "not_started", day: "Sat" }
];

const ACHIEVEMENTS = [
  { id: 1, name: "First Steps", icon: "👣", description: "Complete your first task", unlocked: true, rarity: "common" },
  { id: 2, name: "Fast Learner", icon: "⚡", description: "Complete 5 tasks in one week", unlocked: true, rarity: "rare" },
  { id: 3, name: "The Mountain Mover", icon: "⛰️", description: "Reach 1000 points", unlocked: true, rarity: "epic" },
  { id: 4, name: "Nuclear Pioneer", icon: "☢️", description: "Complete Nuclear Science module", unlocked: false, rarity: "legendary" },
  { id: 5, name: "Best Performer", icon: "🏆", description: "Top 10% in your cohort", unlocked: false, rarity: "legendary" },
  { id: 6, name: "Consistency King", icon: "🔥", description: "7-day streak", unlocked: false, rarity: "rare" }
];

const LEADERBOARD = [
  { rank: 1, name: "Aadhya S.", points: 2450, avatar: "👩‍🎓" },
  { rank: 2, name: "Rohan K.", points: 2180, avatar: "👨‍🎓" },
  { rank: 3, name: "Priya M.", points: 1950, avatar: "👩‍💻" },
  { rank: 4, name: "Arjun R.", points: 1820, avatar: "👨‍🔬" },
  { rank: 5, name: "Sneha T.", points: 1740, avatar: "👩‍🔬" }
];

export default function ProgressDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("tasks");
  const [currentWeek, setCurrentWeek] = useState([6, 13, 20, 27]); // Days of month

  const totalPoints = 1040;
  const weeklyProgress = 60;
  const streak = 5;
  const level = "Year 9";

  const completedTasks = WEEKLY_TASKS.filter(t => t.status === "completed").length;
  const totalTasks = WEEKLY_TASKS.length;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-4 pb-20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/70 text-sm">Welcome back,</p>
            <h1 className="font-display text-xl font-bold">{user?.name || 'Champion'}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-semibold">{streak} day streak</span>
            </div>
          </div>
        </div>

        {/* Points Card */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white/70 text-sm">Total Points</p>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold">{totalPoints}</span>
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div className="text-right">
              <Badge className="bg-amber-500 text-white border-0 mb-1">{level}</Badge>
              <p className="text-white/60 text-xs">Nuclear Engineer Path</p>
            </div>
          </div>
          
          {/* Week Progress */}
          <div className="flex items-center gap-2 mb-2">
            {currentWeek.map((day, i) => (
              <div 
                key={i}
                className={`flex-1 text-center py-2 rounded-lg ${
                  i < 2 ? 'bg-green-500/30' : i === 2 ? 'bg-amber-500/30 ring-2 ring-amber-400' : 'bg-white/10'
                }`}
              >
                <p className="text-xs text-white/60">{['Mon', 'Tue', 'Wed', 'Thu'][i] || ''}</p>
                <p className="font-semibold">{day}</p>
              </div>
            ))}
          </div>
          <Progress value={weeklyProgress} className="h-2 bg-white/20" />
          <p className="text-white/60 text-xs mt-2 text-center">
            {completedTasks}/{totalTasks} tasks completed this week
          </p>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="px-4 -mt-12 relative z-10 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <Card className="shadow-lg">
            <CardContent className="p-3 text-center">
              <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-1" />
              <p className="font-bold text-lg">3</p>
              <p className="text-slate-500 text-xs">Achievements</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-3 text-center">
              <Target className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <p className="font-bold text-lg">60%</p>
              <p className="text-slate-500 text-xs">Week Progress</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-3 text-center">
              <Star className="w-6 h-6 text-purple-500 mx-auto mb-1" />
              <p className="font-bold text-lg">#4</p>
              <p className="text-slate-500 text-xs">Rank</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-3">
            {WEEKLY_TASKS.map((task) => (
              <Card key={task.id} className={`${
                task.status === 'completed' ? 'bg-green-50 border-green-200' :
                task.status === 'in_progress' ? 'bg-amber-50 border-amber-200' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      task.status === 'completed' ? 'bg-green-500' :
                      task.status === 'in_progress' ? 'bg-amber-500' : 'bg-slate-200'
                    }`}>
                      {task.status === 'completed' ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : task.status === 'in_progress' ? (
                        <Play className="w-5 h-5 text-white" />
                      ) : (
                        <Clock className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        task.status === 'completed' ? 'text-green-700 line-through' : 'text-slate-900'
                      }`}>{task.title}</p>
                      <p className="text-sm text-slate-500">{task.day}</p>
                    </div>
                    <Badge className={`${
                      task.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    } border-0`}>
                      +{task.points}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {ACHIEVEMENTS.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`${
                    achievement.unlocked 
                      ? achievement.rarity === 'legendary' ? 'bg-gradient-to-br from-amber-100 to-orange-100 border-amber-300' :
                        achievement.rarity === 'epic' ? 'bg-gradient-to-br from-purple-100 to-violet-100 border-purple-300' :
                        achievement.rarity === 'rare' ? 'bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-300' :
                        'bg-white' 
                      : 'bg-slate-100 opacity-50'
                  }`}
                >
                  <CardContent className="p-3 text-center">
                    <span className="text-3xl block mb-2">
                      {achievement.unlocked ? achievement.icon : '🔒'}
                    </span>
                    <p className="font-medium text-xs truncate">{achievement.name}</p>
                    {achievement.unlocked && (
                      <Badge className={`mt-1 text-[10px] ${
                        achievement.rarity === 'legendary' ? 'bg-amber-500' :
                        achievement.rarity === 'epic' ? 'bg-purple-500' :
                        achievement.rarity === 'rare' ? 'bg-blue-500' : 'bg-slate-500'
                      } text-white border-0`}>
                        {achievement.rarity}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-2">
            {LEADERBOARD.map((person, i) => (
              <Card key={person.rank} className={`${
                person.name.includes('Rohan') ? 'bg-indigo-50 border-indigo-200' : ''
              }`}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      person.rank === 1 ? 'bg-amber-500 text-white' :
                      person.rank === 2 ? 'bg-slate-400 text-white' :
                      person.rank === 3 ? 'bg-orange-400 text-white' : 'bg-slate-200'
                    }`}>
                      {person.rank}
                    </div>
                    <span className="text-2xl">{person.avatar}</span>
                    <div className="flex-1">
                      <p className="font-semibold">{person.name}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="font-bold">{person.points}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Rewards CTA */}
      <div className="px-4 py-6">
        <button
          onClick={() => navigate("/rewards")}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-5 text-white text-left"
        >
          <div className="flex items-center gap-4">
            <Gift className="w-10 h-10" />
            <div className="flex-1">
              <h3 className="font-display font-semibold text-lg">Redeem Rewards</h3>
              <p className="text-white/70 text-sm">Use your points for courses & more</p>
            </div>
            <ChevronRight className="w-6 h-6" />
          </div>
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t safe-bottom z-50 shadow-lg">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {[
            { id: "home", icon: Home, label: "Home", path: "/dashboard" },
            { id: "progress", icon: Target, label: "Progress", path: "/progress-dashboard", active: true },
            { id: "achievements", icon: Trophy, label: "Trophies", path: "/progress-dashboard" },
            { id: "rewards", icon: Gift, label: "Rewards", path: "/rewards" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-4 py-2 ${
                item.active ? "text-indigo-600" : "text-slate-400"
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
