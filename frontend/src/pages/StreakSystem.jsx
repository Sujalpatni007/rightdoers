/**
 * HI AI-APP.COM - Streak System
 * Content + Campaign Integration (Neil Patel G.E.O Strategy)
 * Daily engagement = D-COIN rewards + Badges
 * Global streak across the app
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Flame,
  Trophy,
  Crown,
  Star,
  Zap,
  Gift,
  Shield,
  Calendar,
  TrendingUp,
  Share2,
  Target,
  Coins,
  Award,
  ChevronRight,
  Sparkles,
  Users,
  Clock,
  CheckCircle,
  Lock
} from "lucide-react";
import { toast } from "sonner";
import { useAuth, API } from "@/App";
import axios from "axios";

// STREAK BADGES - Unlockable achievements
const STREAK_BADGES = [
  { days: 3, name: "Starter", icon: "🌱", color: "#22C55E", reward: 30 },
  { days: 7, name: "Weekly Warrior", icon: "🔥", color: "#F59E0B", reward: 50 },
  { days: 14, name: "Fortnight Fighter", icon: "⚡", color: "#3B82F6", reward: 100 },
  { days: 30, name: "Monthly Master", icon: "🏆", color: "#8B5CF6", reward: 200 },
  { days: 60, name: "Dual Month Dynasty", icon: "👑", color: "#EC4899", reward: 500 },
  { days: 100, name: "Century Champion", icon: "💎", color: "#EF4444", reward: 1000 },
  { days: 365, name: "Year Legend", icon: "🌟", color: "#FFD700", reward: 5000 }
];

// DAILY ACTIONS that count toward streak
const STREAK_ACTIONS = [
  { id: "share", name: "Share Talent Card", icon: Share2, dcoins: 10, description: "Share your profile" },
  { id: "profile_view", name: "View Profile", icon: Target, dcoins: 5, description: "Check your DoersScore" },
  { id: "compare", name: "Compare Scores", icon: Users, dcoins: 15, description: "Battle with friends" },
  { id: "learn", name: "Complete Capsule", icon: Star, dcoins: 20, description: "Daily learning" },
  { id: "family", name: "Family Check-in", icon: Users, dcoins: 10, description: "View family goals" }
];

// Demo streak data
const getDemoStreakData = () => ({
  currentStreak: 12,
  longestStreak: 28,
  totalDcoins: 1250,
  todayCompleted: ["profile_view", "share"],
  streakHistory: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: i < 12 || Math.random() > 0.3
  })),
  badges: STREAK_BADGES.filter(b => b.days <= 12),
  rank: 156,
  totalUsers: 12500
});

// Streak Calendar Component
const StreakCalendar = ({ history }) => {
  const last30Days = history?.slice(0, 30) || [];
  
  return (
    <div className="grid grid-cols-7 gap-1">
      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
        <div key={i} className="text-center text-white/40 text-[10px] font-medium">
          {day}
        </div>
      ))}
      {last30Days.reverse().map((day, idx) => (
        <motion.div
          key={idx}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: idx * 0.02 }}
          className={`aspect-square rounded-md flex items-center justify-center text-xs ${
            day.completed 
              ? "bg-gradient-to-br from-orange-500 to-red-500 text-white" 
              : "bg-white/5 text-white/20"
          }`}
        >
          {day.completed ? "🔥" : ""}
        </motion.div>
      ))}
    </div>
  );
};

// Streak Widget (for embedding in other pages)
export const StreakWidget = ({ onPress }) => {
  const [streakData, setStreakData] = useState(null);
  
  useEffect(() => {
    // In production, fetch from backend
    setStreakData(getDemoStreakData());
  }, []);
  
  if (!streakData) return null;
  
  return (
    <motion.button
      onClick={onPress}
      className="w-full bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-3 border border-orange-500/30 text-left"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg">{streakData.currentStreak} Day Streak</p>
            <p className="text-orange-400/80 text-xs">Keep it going! +{10 * streakData.currentStreak} D-COINs earned</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-white/40" />
      </div>
    </motion.button>
  );
};

// Main Streak Page
export default function StreakSystem() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [streakData, setStreakData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProtection, setShowProtection] = useState(false);

  // Fetch streak data
  const fetchStreakData = useCallback(async () => {
    try {
      const userId = user?.id || localStorage.getItem('rdw_user_id') || 'demo-user';
      // In production: const response = await axios.get(`${API}/streaks/${userId}`);
      // For now, use demo data
      setStreakData(getDemoStreakData());
    } catch (err) {
      console.error('Failed to fetch streak data:', err);
      setStreakData(getDemoStreakData());
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStreakData();
  }, [fetchStreakData]);

  // Complete an action
  const completeAction = async (actionId) => {
    const action = STREAK_ACTIONS.find(a => a.id === actionId);
    if (!action) return;
    
    if (streakData?.todayCompleted?.includes(actionId)) {
      toast.info("Already completed today!");
      return;
    }

    // Update locally (in production, sync with backend)
    setStreakData(prev => ({
      ...prev,
      todayCompleted: [...(prev?.todayCompleted || []), actionId],
      totalDcoins: (prev?.totalDcoins || 0) + action.dcoins
    }));
    
    toast.success(`+${action.dcoins} D-COINs earned!`);
  };

  // Protect streak with D-COINs
  const protectStreak = () => {
    if (streakData.totalDcoins < 50) {
      toast.error("Not enough D-COINs! Need 50 to protect streak.");
      return;
    }
    
    setStreakData(prev => ({
      ...prev,
      totalDcoins: prev.totalDcoins - 50,
      streakProtected: true
    }));
    
    setShowProtection(false);
    toast.success("Streak protected for 24 hours! 🛡️");
  };

  // Calculate progress to next badge
  const getNextBadge = () => {
    const currentStreak = streakData?.currentStreak || 0;
    return STREAK_BADGES.find(b => b.days > currentStreak) || STREAK_BADGES[STREAK_BADGES.length - 1];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-orange-950/30 to-slate-950 flex items-center justify-center">
        <motion.div className="text-center">
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Flame className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-white text-xl font-bold mb-2">Loading Streak Data</h2>
          <p className="text-white/50">Calculating your fire...</p>
        </motion.div>
      </div>
    );
  }

  const nextBadge = getNextBadge();
  const progressToNext = ((streakData?.currentStreak || 0) / nextBadge.days) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-orange-950/20 to-slate-950">
      {/* Animated fire background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)`,
              left: `${20 + i * 15}%`,
              bottom: '-10%'
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-orange-500/20 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => navigate(-1)}
            data-testid="streak-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-white font-bold flex items-center gap-2 justify-center">
              <Flame className="w-5 h-5 text-orange-400" />
              Streak System
            </h1>
            <p className="text-orange-400 text-xs">Content + Campaign = Growth</p>
          </div>
          <div className="flex items-center gap-1 bg-amber-500/20 px-3 py-1 rounded-full">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-bold text-sm">{streakData?.totalDcoins || 0}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24 relative z-10">
        
        {/* Main Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-orange-600/30 via-red-600/20 to-purple-600/20 border-orange-500/30 overflow-hidden">
            <CardContent className="p-6">
              {/* Streak Counter */}
              <div className="text-center mb-6">
                <motion.div
                  className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center relative"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="absolute inset-2 rounded-full bg-slate-900/50 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white">{streakData?.currentStreak || 0}</span>
                    <span className="text-orange-300 text-xs">DAYS</span>
                  </div>
                  <Flame className="absolute -top-2 -right-2 w-8 h-8 text-orange-400" />
                </motion.div>
                <h2 className="text-white text-2xl font-bold mb-1">🔥 You&apos;re on Fire!</h2>
                <p className="text-white/60 text-sm">
                  Longest streak: <span className="text-orange-400 font-bold">{streakData?.longestStreak || 0} days</span>
                </p>
              </div>

              {/* Progress to Next Badge */}
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-sm">Next Badge: {nextBadge.name}</span>
                  <span className="text-2xl">{nextBadge.icon}</span>
                </div>
                <Progress value={progressToNext} className="h-3 mb-2" />
                <p className="text-white/40 text-xs text-right">
                  {streakData?.currentStreak || 0} / {nextBadge.days} days • +{nextBadge.reward} D-COINs
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <Coins className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                  <p className="text-white font-bold">{streakData?.totalDcoins || 0}</p>
                  <p className="text-white/40 text-[10px]">Total D-COINs</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <Trophy className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                  <p className="text-white font-bold">{streakData?.badges?.length || 0}</p>
                  <p className="text-white/40 text-[10px]">Badges</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-400" />
                  <p className="text-white font-bold">#{streakData?.rank || 0}</p>
                  <p className="text-white/40 text-[10px]">Global Rank</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Actions */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Today&apos;s Actions
              </span>
              <Badge className="bg-green-500/20 text-green-400 border-0">
                {streakData?.todayCompleted?.length || 0}/{STREAK_ACTIONS.length} Done
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {STREAK_ACTIONS.map((action) => {
              const isCompleted = streakData?.todayCompleted?.includes(action.id);
              return (
                <motion.button
                  key={action.id}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isCompleted 
                      ? "bg-green-500/20 border border-green-500/30" 
                      : "bg-white/5 hover:bg-white/10 border border-white/10"
                  }`}
                  onClick={() => !isCompleted && completeAction(action.id)}
                  whileHover={{ scale: isCompleted ? 1 : 1.02 }}
                  whileTap={{ scale: isCompleted ? 1 : 0.98 }}
                  data-testid={`action-${action.id}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isCompleted ? "bg-green-500/30" : "bg-white/10"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <action.icon className="w-5 h-5 text-white/60" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium text-sm ${isCompleted ? "text-green-400" : "text-white"}`}>
                      {action.name}
                    </p>
                    <p className="text-white/40 text-xs">{action.description}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span className={`font-bold text-sm ${isCompleted ? "text-green-400" : "text-amber-400"}`}>
                      {isCompleted ? "✓" : `+${action.dcoins}`}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </CardContent>
        </Card>

        {/* Streak Calendar */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              Streak History (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StreakCalendar history={streakData?.streakHistory} />
          </CardContent>
        </Card>

        {/* Badges Collection */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              Badge Collection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {STREAK_BADGES.map((badge) => {
                const isUnlocked = (streakData?.currentStreak || 0) >= badge.days;
                return (
                  <motion.div
                    key={badge.days}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 ${
                      isUnlocked 
                        ? "bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/30" 
                        : "bg-white/5 border border-white/10"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className={`text-2xl mb-1 ${!isUnlocked && "grayscale opacity-50"}`}>
                      {badge.icon}
                    </span>
                    <p className={`text-[10px] text-center font-medium ${isUnlocked ? "text-white" : "text-white/40"}`}>
                      {badge.name}
                    </p>
                    <p className="text-[8px] text-white/30">{badge.days}d</p>
                    {!isUnlocked && (
                      <Lock className="w-3 h-3 text-white/20 mt-1" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Streak Protection */}
        <Card className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/30 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-bold">Streak Protection</p>
                  <p className="text-blue-300/70 text-xs">Miss a day without losing streak</p>
                </div>
              </div>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowProtection(true)}
                data-testid="streak-protect-btn"
              >
                <Coins className="w-4 h-4 mr-1" />
                50
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CTA - Go Share */}
        <Button 
          className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500"
          onClick={() => navigate('/compare')}
          data-testid="streak-share-btn"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share &amp; Earn D-COINs Now
        </Button>

        {/* Protection Modal */}
        <AnimatePresence>
          {showProtection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowProtection(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 rounded-2xl p-6 max-w-sm w-full border border-white/10"
                onClick={e => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Shield className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">Protect Your Streak</h3>
                  <p className="text-white/60 text-sm">
                    Use 50 D-COINs to protect your streak for 24 hours. If you miss a day, your streak won&apos;t reset!
                  </p>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl mb-4">
                  <span className="text-white/60">Your D-COINs</span>
                  <span className="text-amber-400 font-bold">{streakData?.totalDcoins || 0}</span>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowProtection(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={protectStreak}
                    disabled={(streakData?.totalDcoins || 0) < 50}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Protect (50)
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
