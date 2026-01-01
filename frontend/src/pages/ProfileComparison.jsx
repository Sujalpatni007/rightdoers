/**
 * HI AI-APP.COM - Profile Comparison ("DoersScore Battle")
 * Multi-dimensional comparison experience - Inception/Interstellar inspired
 * SHARE IT • KEEP IT • LIKE IT Journey
 * 4 Mechanisms: QR Code, Share Link, Phone Lookup, Family Leaderboard
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  QrCode,
  Share2,
  Phone,
  Users,
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Star,
  Crown,
  Copy,
  Check,
  Search,
  Sparkles,
  Layers,
  Target,
  Brain,
  Award,
  ChevronRight,
  RefreshCw,
  MessageCircle,
  Send,
  Heart,
  Bookmark,
  ThumbsUp,
  X,
  ArrowRight,
  Flame
} from "lucide-react";
import { toast } from "sonner";
import { useAuth, API } from "@/App";
import axios from "axios";
import { StreakWidget } from "./StreakSystem";

// SHARE IT • KEEP IT • LIKE IT Journey Cards
const JOURNEY_CARDS = [
  {
    id: "share",
    action: "SHARE IT",
    title: "Share with those who didn't believe YOU",
    description: "Send your Talent Card to prove your potential",
    icon: Share2,
    color: "#3B82F6",
    gradient: "from-blue-500/30 to-indigo-500/20",
    swipeDirection: "right"
  },
  {
    id: "keep",
    action: "KEEP IT",
    title: "Keep as your PERSONAL G.P.S",
    description: "Your career compass for the journey ahead",
    icon: Bookmark,
    color: "#8B5CF6",
    gradient: "from-purple-500/30 to-pink-500/20",
    swipeDirection: "up"
  },
  {
    id: "like",
    action: "LIKE IT",
    title: "Show your support",
    description: "Encourage others in their career journey",
    icon: Heart,
    color: "#EC4899",
    gradient: "from-pink-500/30 to-rose-500/20",
    swipeDirection: "left"
  },
  {
    id: "match",
    action: "MATCH IT",
    title: "See MULTIPLIER X EFFECT",
    description: "Compare and compete with friends",
    icon: Trophy,
    color: "#F59E0B",
    gradient: "from-amber-500/30 to-orange-500/20",
    swipeDirection: "right"
  }
];

// Dimension comparison data
const DIMENSIONS = [
  { id: "personality", name: "Personality", icon: "🎭", color: "#8B5CF6" },
  { id: "interest", name: "Interest", icon: "🎯", color: "#3B82F6" },
  { id: "learning", name: "Learning", icon: "📚", color: "#22C55E" },
  { id: "eq", name: "EQ", icon: "💗", color: "#EC4899" },
  { id: "intelligence", name: "Intelligence", icon: "🧠", color: "#F59E0B" },
  { id: "aptitude", name: "Aptitude", icon: "⚡", color: "#EF4444" }
];

// Comparison mode tabs - Now includes JOURNEY as first option
const COMPARISON_MODES = [
  { id: "journey", name: "Journey", icon: Sparkles, color: "#F59E0B" },
  { id: "family", name: "Family", icon: Users, color: "#EC4899" },
  { id: "qr", name: "QR Scan", icon: QrCode, color: "#8B5CF6" },
  { id: "link", name: "Link", icon: Share2, color: "#3B82F6" },
  { id: "phone", name: "Phone", icon: Phone, color: "#22C55E" }
];

// Swipeable Card Component for SHARE IT / KEEP IT / LIKE IT
const SwipeCard = ({ card, onSwipe, isActive }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  
  const handleDragEnd = (_, info) => {
    const swipeThreshold = 100;
    if (Math.abs(info.offset.x) > swipeThreshold) {
      onSwipe(info.offset.x > 0 ? "right" : "left", card);
    } else if (info.offset.y < -swipeThreshold) {
      onSwipe("up", card);
    }
  };

  if (!isActive) return null;

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, y, rotate, opacity }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
    >
      <Card className={`h-full bg-gradient-to-br ${card.gradient} border-white/20 overflow-hidden`}>
        <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
          {/* Action Badge */}
          <motion.div
            className="mb-6 px-6 py-2 rounded-full font-bold text-lg"
            style={{ backgroundColor: card.color + "40", color: card.color }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {card.action}
          </motion.div>
          
          {/* Icon */}
          <div 
            className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
            style={{ backgroundColor: card.color + "30" }}
          >
            <card.icon className="w-12 h-12" style={{ color: card.color }} />
          </div>
          
          {/* Text */}
          <h3 className="text-white text-xl font-bold mb-2">{card.title}</h3>
          <p className="text-white/60 text-sm mb-8">{card.description}</p>
          
          {/* Swipe Hints */}
          <div className="flex items-center gap-8 text-white/40 text-xs">
            <div className="flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Skip</span>
            </div>
            <div className="flex items-center gap-1">
              <ArrowRight className="w-4 h-4" />
              <span>Action</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function ProfileComparison() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  
  const [activeMode, setActiveMode] = useState("journey"); // Start with journey
  const [myProfile, setMyProfile] = useState(null);
  const [compareProfile, setCompareProfile] = useState(null);
  const [familyProfiles, setFamilyProfiles] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showBattle, setShowBattle] = useState(false);
  
  // Journey card state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [completedActions, setCompletedActions] = useState([]);
  
  // Depth layers for Inception effect
  const [depthLevel, setDepthLevel] = useState(0);

  // Handle card swipe in journey
  const handleCardSwipe = (direction, card) => {
    if (direction === "right") {
      // Action taken
      setCompletedActions(prev => [...prev, { ...card, action: "completed" }]);
      
      if (card.id === "share") {
        // Open share
        const text = `Check out my Talent Card! DoersScore: ${myProfile?.doers_score || 728}/900. Get yours at HI AI-APP.COM!`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        toast.success("Sharing your Talent Card!");
      } else if (card.id === "keep") {
        toast.success("Saved to your Personal G.P.S!");
      } else if (card.id === "like") {
        toast.success("Thanks for the love! ❤️");
      } else if (card.id === "match") {
        setActiveMode("family");
        toast.info("Let's find someone to compare with!");
      }
    } else {
      // Skipped
      setCompletedActions(prev => [...prev, { ...card, action: "skipped" }]);
    }
    
    // Move to next card
    if (currentCardIndex < JOURNEY_CARDS.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // Journey complete
      toast.success("Journey Complete! Now let's compare scores!");
      setActiveMode("family");
    }
  };

  // Fetch my profile
  const fetchMyProfile = useCallback(async () => {
    try {
      const userId = user?.id || localStorage.getItem('rdw_user_id') || 'demo-user';
      const response = await axios.get(`${API}/profiles/user/${userId}`);
      setMyProfile(response.data);
    } catch (err) {
      // Create demo profile
      setMyProfile({
        id: "DP-MYPROFILE",
        name: user?.name || "You",
        doers_score: 728,
        efficiency_value: 76,
        adaptive_level: "PROFESSIONAL",
        dimensions: {
          personality: { score: 78 },
          interest: { score: 82 },
          learning: { score: 71 },
          eq: { score: 80 },
          intelligence: { score: 85 },
          aptitude: { score: 74 }
        }
      });
    }
  }, [user]);

  // Fetch family profiles for leaderboard
  const fetchFamilyProfiles = useCallback(async () => {
    try {
      const userId = user?.id || 'demo-user';
      const response = await axios.get(`${API}/families/user/${userId}`);
      if (response.data?.members) {
        setFamilyProfiles(response.data.members.map((m, idx) => ({
          id: m.id || `member-${idx}`,
          name: m.name,
          avatar: m.avatar || "👤",
          doers_score: m.doers_score || 650,
          role: m.role
        })));
      }
    } catch {
      // Demo family
      setFamilyProfiles([
        { id: "f1", name: "Father", avatar: "👨", doers_score: 720, role: "father" },
        { id: "f2", name: "Mother", avatar: "👩", doers_score: 680, role: "mother" },
        { id: "f3", name: "You", avatar: "🎯", doers_score: 728, role: "self", isMe: true },
        { id: "f4", name: "Sister", avatar: "👧", doers_score: 810, role: "sister" }
      ]);
    }
  }, [user]);

  // Search profile by phone
  const searchByPhone = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setIsSearching(true);
    try {
      // Try to find user by phone
      const userRes = await axios.get(`${API}/users/phone/${phoneNumber}`);
      if (userRes.data?.id) {
        const profileRes = await axios.get(`${API}/profiles/user/${userRes.data.id}`);
        setCompareProfile({
          ...profileRes.data,
          name: userRes.data.name || "Friend"
        });
        setShowBattle(true);
        setDepthLevel(1);
        toast.success(`Found ${userRes.data.name}'s profile!`);
      }
    } catch {
      // Demo comparison profile
      setCompareProfile({
        id: "DP-FRIEND",
        name: "Friend",
        doers_score: Math.floor(Math.random() * 200) + 600,
        efficiency_value: Math.floor(Math.random() * 30) + 60,
        adaptive_level: "MANAGER",
        dimensions: {
          personality: { score: Math.floor(Math.random() * 30) + 60 },
          interest: { score: Math.floor(Math.random() * 30) + 60 },
          learning: { score: Math.floor(Math.random() * 30) + 60 },
          eq: { score: Math.floor(Math.random() * 30) + 60 },
          intelligence: { score: Math.floor(Math.random() * 30) + 60 },
          aptitude: { score: Math.floor(Math.random() * 30) + 60 }
        }
      });
      setShowBattle(true);
      setDepthLevel(1);
      toast.info("Demo comparison loaded");
    } finally {
      setIsSearching(false);
    }
  };

  // Generate shareable link
  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    const shareLink = `${baseUrl}/compare?with=${myProfile?.id || 'demo'}`;
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    toast.success("Comparison link copied!");
  };

  // Compare with family member
  const compareWithMember = (member) => {
    if (member.isMe) {
      toast.info("That's you! 😊");
      return;
    }
    setCompareProfile({
      id: member.id,
      name: member.name,
      doers_score: member.doers_score,
      efficiency_value: Math.floor(member.doers_score / 10),
      adaptive_level: member.doers_score >= 750 ? "PROFESSIONAL" : "MANAGER",
      dimensions: {
        personality: { score: Math.floor(Math.random() * 20) + 65 },
        interest: { score: Math.floor(Math.random() * 20) + 65 },
        learning: { score: Math.floor(Math.random() * 20) + 65 },
        eq: { score: Math.floor(Math.random() * 20) + 65 },
        intelligence: { score: Math.floor(Math.random() * 20) + 65 },
        aptitude: { score: Math.floor(Math.random() * 20) + 65 }
      }
    });
    setShowBattle(true);
    setDepthLevel(1);
  };

  useEffect(() => {
    Promise.all([fetchMyProfile(), fetchFamilyProfiles()]).finally(() => {
      setIsLoading(false);
    });
    
    // Check for comparison parameter
    const compareWith = searchParams.get('with');
    if (compareWith) {
      setActiveMode('link');
    }
  }, [fetchMyProfile, fetchFamilyProfiles, searchParams]);

  // Calculate winner for a dimension
  const getWinner = (myScore, theirScore) => {
    if (myScore > theirScore) return "me";
    if (theirScore > myScore) return "them";
    return "tie";
  };

  // Get trend icon
  const getTrendIcon = (diff) => {
    if (diff > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (diff < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-yellow-400" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-6 relative"
            animate={{ rotateY: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            {/* Multi-dimensional loading - Inception style */}
            {[0, 1, 2].map((layer) => (
              <motion.div
                key={layer}
                className="absolute inset-0 rounded-2xl border-2 border-purple-500/50"
                style={{ transform: `translateZ(${layer * 20}px) scale(${1 - layer * 0.1})` }}
                animate={{ rotate: layer % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 4 + layer, repeat: Infinity, ease: "linear" }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <Layers className="w-10 h-10 text-purple-400" />
            </div>
          </motion.div>
          <h2 className="text-white text-xl font-bold mb-2">Entering Comparison Dimension</h2>
          <p className="text-white/50">Loading profiles across layers...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Inception-style depth layers background */}
      <div className="absolute inset-0 pointer-events-none">
        {[0, 1, 2, 3].map((layer) => (
          <motion.div
            key={layer}
            className="absolute inset-0 border border-purple-500/10 rounded-3xl"
            style={{
              margin: `${layer * 40}px`,
              opacity: 0.3 - layer * 0.05
            }}
            animate={{
              rotate: [0, layer % 2 === 0 ? 5 : -5, 0],
              scale: [1, 1.02, 1]
            }}
            transition={{
              duration: 8 + layer * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => showBattle ? (setShowBattle(false), setDepthLevel(0)) : navigate(-1)}
            data-testid="compare-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-white font-bold flex items-center gap-2 justify-center">
              <Trophy className="w-5 h-5 text-amber-400" />
              DoersScore Battle
            </h1>
            <p className="text-purple-400 text-xs">Compare • Compete • Grow</p>
          </div>
          <Badge className="bg-purple-500/20 text-purple-300 border-0">
            Layer {depthLevel}
          </Badge>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24 relative z-10">
        
        <AnimatePresence mode="wait">
          {!showBattle ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* My Profile Card */}
              <Card className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl">
                      🎯
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg">{myProfile?.name || "You"}</h3>
                      <p className="text-white/60 text-sm">{myProfile?.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-white">{myProfile?.doers_score || 0}</p>
                      <p className="text-purple-300 text-xs">DoersScore™</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Streak Widget */}
              <StreakWidget onPress={() => navigate('/streaks')} />

              {/* Comparison Mode Tabs */}
              <div className="grid grid-cols-5 gap-2">
                {COMPARISON_MODES.map((mode) => (
                  <Button
                    key={mode.id}
                    variant={activeMode === mode.id ? "default" : "ghost"}
                    className={`flex-col h-auto py-3 ${
                      activeMode === mode.id 
                        ? "bg-white/10 border border-white/20" 
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => setActiveMode(mode.id)}
                    data-testid={`compare-mode-${mode.id}`}
                  >
                    <mode.icon className="w-5 h-5 mb-1" style={{ color: mode.color }} />
                    <span className="text-[10px] text-white/80">{mode.name}</span>
                  </Button>
                ))}
              </div>

              {/* Mode Content */}
              <AnimatePresence mode="wait">
                {/* JOURNEY Mode - SHARE IT / KEEP IT / LIKE IT */}
                {activeMode === "journey" && (
                  <motion.div
                    key="journey"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                      {JOURNEY_CARDS.map((card, idx) => (
                        <div 
                          key={card.id}
                          className={`w-3 h-3 rounded-full transition-all ${
                            idx < currentCardIndex 
                              ? "bg-green-500" 
                              : idx === currentCardIndex 
                                ? "bg-amber-500 scale-125" 
                                : "bg-white/20"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Swipeable Card Stack */}
                    <div className="relative h-80 mx-auto max-w-sm">
                      <AnimatePresence>
                        {JOURNEY_CARDS.map((card, idx) => (
                          <SwipeCard
                            key={card.id}
                            card={card}
                            isActive={idx === currentCardIndex}
                            onSwipe={handleCardSwipe}
                          />
                        ))}
                      </AnimatePresence>
                      
                      {/* Journey Complete */}
                      {currentCardIndex >= JOURNEY_CARDS.length && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute inset-0 flex flex-col items-center justify-center"
                        >
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                            <Check className="w-12 h-12 text-white" />
                          </div>
                          <h3 className="text-white text-xl font-bold mb-2">Journey Complete!</h3>
                          <p className="text-white/60 text-sm mb-4">Now compare with friends & family</p>
                          <Button 
                            onClick={() => setActiveMode("family")}
                            className="bg-gradient-to-r from-purple-500 to-pink-500"
                          >
                            Start Comparing <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </motion.div>
                      )}
                    </div>

                    {/* Action Buttons Below Card */}
                    {currentCardIndex < JOURNEY_CARDS.length && (
                      <div className="flex justify-center gap-4 mt-4">
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-16 h-16 rounded-full border-red-500/50 text-red-400 hover:bg-red-500/20"
                          onClick={() => handleCardSwipe("left", JOURNEY_CARDS[currentCardIndex])}
                        >
                          <X className="w-6 h-6" />
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-16 h-16 rounded-full border-green-500/50 text-green-400 hover:bg-green-500/20"
                          onClick={() => handleCardSwipe("right", JOURNEY_CARDS[currentCardIndex])}
                        >
                          <Check className="w-6 h-6" />
                        </Button>
                      </div>
                    )}

                    {/* Instructions */}
                    <p className="text-center text-white/40 text-xs">
                      Swipe right to act • Swipe left to skip • Or tap buttons
                    </p>
                  </motion.div>
                )}

                {/* QR Code Mode */}
                {activeMode === "qr" && (
                  <motion.div
                    key="qr"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-6 text-center">
                        <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-2xl p-4 relative">
                          {/* QR Code Placeholder - would use a QR library in production */}
                          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center">
                            <QrCode className="w-20 h-20 text-white/50" />
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <span className="text-xl">🎯</span>
                          </div>
                        </div>
                        <h3 className="text-white font-bold mb-2">Scan to Compare</h3>
                        <p className="text-white/50 text-sm mb-4">
                          Let your friend scan this QR to start a DoersScore Battle!
                        </p>
                        <Button 
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => toast.info("QR Scanner coming soon!")}
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          Scan Friend&apos;s QR
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Share Link Mode */}
                {activeMode === "link" && (
                  <motion.div
                    key="link"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-6">
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                            <Share2 className="w-8 h-8 text-blue-400" />
                          </div>
                          <h3 className="text-white font-bold mb-2">Share Comparison Link</h3>
                          <p className="text-white/50 text-sm">
                            Send this link to challenge a friend!
                          </p>
                        </div>
                        
                        <div className="flex gap-2 mb-4">
                          <Input 
                            value={`${window.location.origin}/compare?with=${myProfile?.id || 'demo'}`}
                            readOnly
                            className="bg-white/5 border-white/10 text-white text-sm"
                          />
                          <Button 
                            onClick={generateShareLink}
                            className={linkCopied ? "bg-green-600" : "bg-blue-600"}
                          >
                            {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              const url = `${window.location.origin}/compare?with=${myProfile?.id}`;
                              window.open(`https://wa.me/?text=${encodeURIComponent(`Compare DoersScores with me! ${url}`)}`, '_blank');
                            }}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            WhatsApp
                          </Button>
                          <Button 
                            className="bg-blue-500 hover:bg-blue-600"
                            onClick={() => {
                              const url = `${window.location.origin}/compare?with=${myProfile?.id}`;
                              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Compare DoersScores with me! ${url}`)}`, '_blank');
                            }}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Twitter
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Phone Lookup Mode */}
                {activeMode === "phone" && (
                  <motion.div
                    key="phone"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-6">
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-500/20 flex items-center justify-center">
                            <Phone className="w-8 h-8 text-green-400" />
                          </div>
                          <h3 className="text-white font-bold mb-2">Find by Phone</h3>
                          <p className="text-white/50 text-sm">
                            Enter friend&apos;s phone number to compare
                          </p>
                        </div>
                        
                        <div className="flex gap-2 mb-4">
                          <Input 
                            type="tel"
                            placeholder="Enter phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                            data-testid="compare-phone-input"
                          />
                          <Button 
                            onClick={searchByPhone}
                            disabled={isSearching}
                            className="bg-green-600 hover:bg-green-700"
                            data-testid="compare-phone-search"
                          >
                            {isSearching ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Search className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Family Leaderboard Mode */}
                {activeMode === "family" && (
                  <motion.div
                    key="family"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-sm flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-amber-400" />
                          Family Leaderboard
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {familyProfiles
                          .sort((a, b) => b.doers_score - a.doers_score)
                          .map((member, idx) => (
                            <motion.button
                              key={member.id}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                                member.isMe 
                                  ? "bg-purple-500/20 border border-purple-500/30" 
                                  : "bg-white/5 hover:bg-white/10"
                              }`}
                              onClick={() => compareWithMember(member)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              data-testid={`family-member-${member.id}`}
                            >
                              <div className="flex items-center justify-center w-8 h-8">
                                {idx === 0 && <Crown className="w-6 h-6 text-amber-400" />}
                                {idx === 1 && <span className="text-lg">🥈</span>}
                                {idx === 2 && <span className="text-lg">🥉</span>}
                                {idx > 2 && <span className="text-white/40 font-bold">{idx + 1}</span>}
                              </div>
                              <span className="text-2xl">{member.avatar}</span>
                              <div className="flex-1 text-left">
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-medium text-sm">{member.name}</span>
                                  {member.isMe && <Badge className="bg-purple-500/30 text-purple-300 border-0 text-[10px]">You</Badge>}
                                </div>
                                <p className="text-white/40 text-xs capitalize">{member.role}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-white font-bold">{member.doers_score}</p>
                                <p className="text-white/40 text-[10px]">DoersScore</p>
                              </div>
                              {!member.isMe && (
                                <ChevronRight className="w-4 h-4 text-white/40" />
                              )}
                            </motion.button>
                          ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Battle View - Inception Multi-Dimensional */
            <motion.div
              key="battle"
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* VS Header */}
              <div className="flex items-center justify-center gap-4 py-6">
                <motion.div 
                  className="text-center"
                  initial={{ x: -50 }}
                  animate={{ x: 0 }}
                >
                  <div className="w-20 h-20 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl">
                    🎯
                  </div>
                  <p className="text-white font-bold">{myProfile?.name}</p>
                  <p className="text-3xl font-bold text-purple-400">{myProfile?.doers_score}</p>
                </motion.div>
                
                <motion.div
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-2xl font-bold text-white">VS</span>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ x: 50 }}
                  animate={{ x: 0 }}
                >
                  <div className="w-20 h-20 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-4xl">
                    👤
                  </div>
                  <p className="text-white font-bold">{compareProfile?.name}</p>
                  <p className="text-3xl font-bold text-blue-400">{compareProfile?.doers_score}</p>
                </motion.div>
              </div>

              {/* Winner Banner */}
              <Card className={`${
                myProfile?.doers_score > compareProfile?.doers_score 
                  ? "bg-gradient-to-r from-green-600/30 to-emerald-600/30 border-green-500/30"
                  : myProfile?.doers_score < compareProfile?.doers_score
                    ? "bg-gradient-to-r from-red-600/30 to-orange-600/30 border-red-500/30"
                    : "bg-gradient-to-r from-yellow-600/30 to-amber-600/30 border-yellow-500/30"
              }`}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-white">
                    {myProfile?.doers_score > compareProfile?.doers_score 
                      ? "🏆 You Win!" 
                      : myProfile?.doers_score < compareProfile?.doers_score
                        ? `${compareProfile?.name} Wins!`
                        : "It's a Tie! 🤝"}
                  </p>
                  <p className="text-white/60 text-sm">
                    Difference: {Math.abs(myProfile?.doers_score - compareProfile?.doers_score)} points
                  </p>
                </CardContent>
              </Card>

              {/* 6 Dimensions Comparison */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    6 Dimensions Battle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {DIMENSIONS.map((dim, idx) => {
                    const myScore = myProfile?.dimensions?.[dim.id]?.score || 70;
                    const theirScore = compareProfile?.dimensions?.[dim.id]?.score || 70;
                    const winner = getWinner(myScore, theirScore);
                    
                    return (
                      <motion.div
                        key={dim.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/5 rounded-xl p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{dim.icon}</span>
                            <span className="text-white text-sm">{dim.name}</span>
                          </div>
                          {winner === "me" && <Badge className="bg-green-500/30 text-green-300 border-0 text-[10px]">You Win</Badge>}
                          {winner === "them" && <Badge className="bg-red-500/30 text-red-300 border-0 text-[10px]">They Win</Badge>}
                          {winner === "tie" && <Badge className="bg-yellow-500/30 text-yellow-300 border-0 text-[10px]">Tie</Badge>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400 text-sm w-8">{myScore}</span>
                          <div className="flex-1 flex gap-1">
                            <div 
                              className="h-2 rounded-full bg-purple-500"
                              style={{ width: `${myScore}%` }}
                            />
                          </div>
                          <div className="w-8" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400 text-sm w-8">{theirScore}</span>
                          <div className="flex-1 flex gap-1">
                            <div 
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${theirScore}%` }}
                            />
                          </div>
                          <div className="w-8 flex justify-end">
                            {getTrendIcon(myScore - theirScore)}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Share Battle Result */}
              <Button 
                className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500"
                onClick={() => {
                  const result = myProfile?.doers_score > compareProfile?.doers_score ? "won" : "lost";
                  const text = `I just ${result} a DoersScore Battle! My score: ${myProfile?.doers_score} vs ${compareProfile?.doers_score}. Challenge me at HI AI-APP.COM!`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }}
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Battle Result
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
