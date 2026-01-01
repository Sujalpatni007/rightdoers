import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Baby,
  Star,
  Gamepad2,
  Trophy,
  Sparkles,
  Heart,
  Rocket,
  BookOpen,
  Award,
  Gift,
  Lock,
  Play,
  ChevronRight,
  Coins
} from "lucide-react";
import { toast } from "sonner";

// Career Stories for Kids
const CAREER_STORIES = [
  { id: 1, title: "The Brave Firefighter", career: "Firefighter", emoji: "🚒", completed: true, coins: 10 },
  { id: 2, title: "Doctor Dino's Day", career: "Doctor", emoji: "🩺", completed: true, coins: 10 },
  { id: 3, title: "Chef Cookie's Kitchen", career: "Chef", emoji: "👨‍🍳", completed: false, coins: 15 },
  { id: 4, title: "Astronaut Adventure", career: "Astronaut", emoji: "🚀", completed: false, coins: 15 },
  { id: 5, title: "Artist Palette Magic", career: "Artist", emoji: "🎨", completed: false, coins: 15, locked: true },
  { id: 6, title: "Builder Bob's World", career: "Engineer", emoji: "👷", completed: false, coins: 20, locked: true }
];

// Fun Quizzes
const FUN_QUIZZES = [
  { id: 1, title: "What Animal Are You?", type: "Personality", emoji: "🦁", completed: true },
  { id: 2, title: "Superpower Quiz", type: "Strengths", emoji: "⚡", completed: false },
  { id: 3, title: "Dream Job Match", type: "Career", emoji: "💫", completed: false }
];

// Avatar Customization
const AVATARS = ["👦", "👧", "🧒", "👶", "🦸‍♂️", "🦸‍♀️", "🧙‍♂️", "🧚‍♀️"];

// Badges
const BADGES = [
  { id: 1, name: "First Explorer", emoji: "🌟", earned: true },
  { id: 2, name: "Story Master", emoji: "📚", earned: true },
  { id: 3, name: "Quiz Champion", emoji: "🏆", earned: false },
  { id: 4, name: "Friend Maker", emoji: "🤝", earned: false },
  { id: 5, name: "7 Day Streak", emoji: "🔥", earned: false }
];

// Story Card Component
const StoryCard = ({ story, onPlay }) => (
  <motion.div
    whileHover={{ scale: story.locked ? 1 : 1.05 }}
    whileTap={{ scale: story.locked ? 1 : 0.95 }}
    className={`cursor-pointer ${story.locked ? 'opacity-50' : ''}`}
    onClick={() => !story.locked && onPlay(story)}
  >
    <Card className={`bg-gradient-to-br ${story.completed ? 'from-green-500/20 to-emerald-500/20 border-green-500/30' : 'from-pink-500/20 to-rose-500/20 border-pink-500/30'} border-2 overflow-hidden`}>
      <CardContent className="p-4 text-center relative">
        {story.locked && (
          <div className="absolute top-2 right-2">
            <Lock className="w-4 h-4 text-white/50" />
          </div>
        )}
        {story.completed && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-green-500/30 text-green-400 border-0 text-xs">
              <Star className="w-3 h-3 mr-1" /> Done
            </Badge>
          </div>
        )}
        <div className="text-5xl mb-2">{story.emoji}</div>
        <h4 className="text-white font-bold text-sm">{story.title}</h4>
        <p className="text-white/60 text-xs">{story.career}</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          <Coins className="w-3 h-3 text-amber-400" />
          <span className="text-amber-400 text-xs font-bold">+{story.coins}</span>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function DoerKidzDashboard() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState("👦");
  const [childName, setChildName] = useState("Little Doer");
  const [dCoins, setDCoins] = useState(125);
  const [level, setLevel] = useState(3);
  const [xp, setXp] = useState(340);
  const [streak, setStreak] = useState(4);

  const handlePlayStory = (story) => {
    toast.success(`Starting: ${story.title}! 🎮`);
    // Navigate to story/game
  };

  const handleStartQuiz = (quiz) => {
    toast.success(`Let's take the ${quiz.title}! 🎯`);
    // Navigate to quiz
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-950 via-purple-950 to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-pink-900/80 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => navigate(-1)}
            data-testid="kidz-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-white font-bold flex items-center gap-2">
              <Baby className="w-5 h-5 text-pink-400" />
              DOER KIDZ
            </h1>
            <Badge className="bg-pink-500/20 text-pink-400 border-0 text-[10px] mt-1">
              🎮 Gamified Discovery
            </Badge>
          </div>
          {/* D-COIN Balance */}
          <div className="flex items-center gap-1 bg-amber-500/20 px-3 py-1 rounded-full">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-bold">{dCoins}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Profile Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 border-0 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-5xl cursor-pointer"
                  onClick={() => {
                    const nextAvatar = AVATARS[(AVATARS.indexOf(avatar) + 1) % AVATARS.length];
                    setAvatar(nextAvatar);
                    toast.success("New avatar! " + nextAvatar);
                  }}
                >
                  {avatar}
                </motion.div>
                
                <div className="flex-1">
                  <h2 className="text-white text-2xl font-bold">{childName}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-white/20 text-white border-0">
                      Level {level} 🌟
                    </Badge>
                    <Badge className="bg-amber-500/30 text-amber-300 border-0">
                      🔥 {streak} Day Streak
                    </Badge>
                  </div>
                  
                  {/* XP Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                      <span>XP: {xp}/500</span>
                      <span>Next: Level {level + 1}</span>
                    </div>
                    <Progress value={(xp / 500) * 100} className="h-3 bg-white/20" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Daily Challenge */}
        <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl">
                  🎯
                </div>
                <div>
                  <h3 className="text-white font-bold">Today's Challenge</h3>
                  <p className="text-white/60 text-sm">Complete 1 story to earn 25 D-COINS!</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500">
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Career Stories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-pink-400" />
              Career Stories
            </h3>
            <Badge className="bg-white/10 text-white/60 border-0">
              {CAREER_STORIES.filter(s => s.completed).length}/{CAREER_STORIES.length} Done
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {CAREER_STORIES.map((story) => (
              <StoryCard key={story.id} story={story} onPlay={handlePlayStory} />
            ))}
          </div>
        </section>

        {/* Fun Quizzes */}
        <section>
          <h3 className="text-white font-bold text-lg flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Fun Quizzes
          </h3>
          <div className="space-y-3">
            {FUN_QUIZZES.map((quiz) => (
              <motion.div
                key={quiz.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleStartQuiz(quiz)}
                className="cursor-pointer"
              >
                <Card className={`bg-white/5 border-white/10 ${quiz.completed ? 'opacity-60' : ''}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{quiz.emoji}</div>
                      <div>
                        <h4 className="text-white font-medium">{quiz.title}</h4>
                        <p className="text-white/60 text-xs">{quiz.type}</p>
                      </div>
                    </div>
                    {quiz.completed ? (
                      <Badge className="bg-green-500/20 text-green-400 border-0">
                        <Star className="w-3 h-3 mr-1" /> Done
                      </Badge>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-white/40" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Badges */}
        <section>
          <h3 className="text-white font-bold text-lg flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-400" />
            My Badges
          </h3>
          <div className="flex flex-wrap gap-3">
            {BADGES.map((badge) => (
              <motion.div
                key={badge.id}
                whileHover={{ scale: badge.earned ? 1.1 : 1 }}
                className={`w-16 h-16 rounded-2xl ${badge.earned ? 'bg-amber-500/20' : 'bg-white/5'} flex flex-col items-center justify-center ${!badge.earned ? 'opacity-40' : ''}`}
              >
                <span className="text-2xl">{badge.emoji}</span>
                <span className="text-white/60 text-[10px] text-center">{badge.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Parent Dashboard Link */}
        <Card className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Parent Dashboard</h3>
                  <p className="text-white/60 text-sm">Track your child's progress</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-blue-500/30 text-blue-400"
                onClick={() => navigate("/family")}
              >
                View
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
