import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  ArrowRight, 
  Brain, 
  Sparkles, 
  Check,
  Target,
  TrendingUp,
  Award,
  Zap,
  Activity,
  Download,
  Share2,
  Shield,
  Star,
  ChevronRight,
  Users,
  BookOpen,
  Lightbulb,
  BarChart3,
  Clock,
  RefreshCw,
  MessageCircle,
  Linkedin,
  Twitter,
  Facebook,
  Mail,
  Copy,
  X,
  Send
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/App";

// Adaptive Question Levels (Para → Professional)
const ASSESSMENT_LEVELS = {
  PARA: { name: "Para", desc: "Entry Level", minScore: 0, maxScore: 40, color: "#94A3B8" },
  ASSOCIATE: { name: "Associate", desc: "Junior Professional", minScore: 41, maxScore: 60, color: "#22C55E" },
  MANAGER: { name: "Manager", desc: "Mid-Level", minScore: 61, maxScore: 75, color: "#3B82F6" },
  PROFESSIONAL: { name: "Professional", desc: "Senior Expert", minScore: 76, maxScore: 90, color: "#8B5CF6" },
  EXPERT: { name: "Expert", desc: "Industry Leader", minScore: 91, maxScore: 100, color: "#F59E0B" }
};

// EduMilestones 6 Dimensions
const ASSESSMENT_DIMENSIONS = [
  { 
    id: "personality", 
    name: "Personality", 
    theory: "Carl Jung", 
    icon: "🎭",
    description: "Core character traits and behavioral tendencies",
    reliability: 0.95,
    sampleSize: 32000
  },
  { 
    id: "interest", 
    name: "Career Interest", 
    theory: "John Holland (RIASEC)", 
    icon: "🎯",
    description: "Professional interests and career orientations",
    reliability: 0.94,
    sampleSize: 22000
  },
  { 
    id: "learning", 
    name: "Learning Style", 
    theory: "Neil Fleming (VARK)", 
    icon: "📚",
    description: "How you absorb and process information",
    reliability: 0.89,
    sampleSize: 14000
  },
  { 
    id: "eq", 
    name: "Emotional Intelligence", 
    theory: "Daniel Goleman", 
    icon: "💗",
    description: "Self-awareness, empathy, and social skills",
    reliability: 0.89,
    sampleSize: 9000
  },
  { 
    id: "intelligence", 
    name: "Multiple Intelligence", 
    theory: "Howard Gardner", 
    icon: "🧠",
    description: "Your unique cognitive strengths",
    reliability: 0.91,
    sampleSize: 28000
  },
  { 
    id: "aptitude", 
    name: "Aptitude & Skills", 
    theory: "David Battery (DBDA)", 
    icon: "⚡",
    description: "Practical abilities and skill competencies",
    reliability: 0.88,
    sampleSize: 18000
  }
];

// Efficiency Value Calculation
const calculateEfficiencyValue = (naturalFit, developedSkills, learningAgility) => {
  // Formula: Efficiency = (Developed Skills × 0.6) + (Natural Fit × 0.3) + (Learning Agility × 0.1)
  return Math.round((developedSkills * 0.6) + (naturalFit * 0.3) + (learningAgility * 0.1));
};

// Sample profile data structure (Suraj Kulkarni example)
const getSampleProfile = (name) => ({
  name: name || "Doer",
  doersId: `DP-${Date.now().toString(36).toUpperCase()}`,
  
  // Natural Fit (Personality alignment to role)
  naturalFit: {
    score: 68,
    roleTarget: "Software Developer",
    gap: 27,
    details: {
      personality: 72,
      interest: 65,
      eq: 70
    }
  },
  
  // Developed Skills (Actual competencies)
  developedSkills: {
    score: 95,
    skills: [
      { name: "Problem Solving", level: 92, growth: "+15%" },
      { name: "Technical Coding", level: 98, growth: "+22%" },
      { name: "Communication", level: 88, growth: "+12%" },
      { name: "Team Collaboration", level: 94, growth: "+18%" }
    ]
  },
  
  // Learning Agility
  learningAgility: {
    score: 85,
    style: "Visual-Kinesthetic",
    adaptability: 88,
    growthMindset: 90
  },
  
  // DoersScore (CIBIL-style)
  doersScore: {
    value: 847,
    maxValue: 900,
    percentile: 92,
    trend: "rising",
    lastUpdated: new Date().toISOString()
  },
  
  // 6 Dimension Scores
  dimensions: {
    personality: { score: 78, level: "PROFESSIONAL" },
    interest: { score: 85, level: "PROFESSIONAL" },
    learning: { score: 72, level: "MANAGER" },
    eq: { score: 83, level: "PROFESSIONAL" },
    intelligence: { score: 88, level: "PROFESSIONAL" },
    aptitude: { score: 75, level: "MANAGER" }
  },
  
  // Career Suitability
  suitability: {
    currentRole: "Software Developer",
    matchScore: 89,
    alternateRoles: [
      { role: "Product Manager", match: 82 },
      { role: "Tech Lead", match: 91 },
      { role: "Solution Architect", match: 78 }
    ]
  },
  
  // Skill Development Journey
  skillJourney: {
    startDate: "2020-01-15",
    milestones: [
      { date: "2020-06", skill: "Python", improvement: 45 },
      { date: "2021-03", skill: "Leadership", improvement: 32 },
      { date: "2022-09", skill: "System Design", improvement: 55 },
      { date: "2024-01", skill: "AI/ML", improvement: 40 }
    ],
    totalImprovement: 172
  },
  
  // Verification
  verification: {
    rightDoersPowered: true,
    verifiedDate: new Date().toISOString(),
    credentialId: `RDVC-${Date.now().toString(36).toUpperCase()}`
  }
});

export default function DoersProfiler() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTalentTracker, setShowTalentTracker] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    // Simulate loading profile data
    setTimeout(() => {
      setProfile(getSampleProfile(user?.name));
      setIsLoading(false);
    }, 1500);
  }, [user]);

  const efficiencyValue = profile ? calculateEfficiencyValue(
    profile.naturalFit.score,
    profile.developedSkills.score,
    profile.learningAgility.score
  ) : 0;

  const getAdaptiveLevel = (score) => {
    if (score >= 91) return ASSESSMENT_LEVELS.EXPERT;
    if (score >= 76) return ASSESSMENT_LEVELS.PROFESSIONAL;
    if (score >= 61) return ASSESSMENT_LEVELS.MANAGER;
    if (score >= 41) return ASSESSMENT_LEVELS.ASSOCIATE;
    return ASSESSMENT_LEVELS.PARA;
  };

  // Generate shareable content
  const getShareContent = () => {
    const shareText = `Check out my TalentCard! DoersScore: ${profile?.doersScore.value}/900 | Efficiency: ${efficiencyValue}% | Level: ${getAdaptiveLevel(efficiencyValue).name}

TALENTON.AI REVOLUTION - Ride the Wave!

Say HI AI. Get your D.P. (Doers Profiler) at:`;
    const shareUrl = window.location.origin + '/dp';
    return { shareText, shareUrl };
  };

  // Share functions
  const shareToWhatsApp = () => {
    const { shareText, shareUrl } = getShareContent();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp...');
  };

  const shareToLinkedIn = () => {
    const { shareUrl } = getShareContent();
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank');
    toast.success('Opening LinkedIn...');
  };

  const shareToTwitter = () => {
    const { shareText, shareUrl } = getShareContent();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
    toast.success('Opening Twitter/X...');
  };

  const shareToFacebook = () => {
    const { shareUrl } = getShareContent();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
    toast.success('Opening Facebook...');
  };

  const shareViaEmail = () => {
    const { shareText, shareUrl } = getShareContent();
    const subject = `Check out my TalentCard - DoersScore ${profile?.doersScore.value}`;
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
    window.location.href = emailUrl;
    toast.success('Opening email...');
  };

  const copyToClipboard = () => {
    const { shareText, shareUrl } = getShareContent();
    navigator.clipboard.writeText(shareText + ' ' + shareUrl);
    toast.success('Copied to clipboard!');
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
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-white text-xl font-bold mb-2">Loading Doers Profiler</h2>
          <p className="text-white/50">Preparing your D.P. (Doers Profiler)...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => navigate(-1)}
            data-testid="dp-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-white font-bold flex items-center gap-2">
              <span className="text-xl">D.P.</span>
              <span className="text-white/60 text-sm">Doers Profiler</span>
            </h1>
            <Badge className="bg-green-500/20 text-green-400 border-0 text-[10px] mt-1">
              <Shield className="w-3 h-3 mr-1" />
              Right Doers Powered™
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white"
              onClick={() => setShowShareModal(true)}
              data-testid="dp-share-btn"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white" data-testid="dp-download-btn">
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
        
        {/* TALENT CARD - Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border-0 overflow-hidden relative">
            {/* Verification Watermark */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <Shield className="w-full h-full text-white" />
            </div>
            
            <CardContent className="p-6">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl">
                    🎯
                  </div>
                  <div>
                    <h2 className="text-white text-2xl font-bold">{profile?.name}</h2>
                    <p className="text-white/70 text-sm">{profile?.doersId}</p>
                    <Badge className="mt-1 bg-white/20 text-white border-0 text-[10px]">
                      Talent Card
                    </Badge>
                  </div>
                </div>
                
                {/* DoersScore - CIBIL Style */}
                <div className="text-right">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">DoersScore™</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-white">{profile?.doersScore.value}</span>
                    <span className="text-white/60 text-sm mb-1">/{profile?.doersScore.maxValue}</span>
                  </div>
                  <Badge className={`text-[10px] border-0 ${
                    profile?.doersScore.trend === 'rising' 
                      ? 'bg-green-500/30 text-green-300' 
                      : 'bg-amber-500/30 text-amber-300'
                  }`}>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Top {100 - profile?.doersScore.percentile}%
                  </Badge>
                </div>
              </div>
              
              {/* EFFICIENCY VALUE - The Key Metric */}
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white/80 text-sm font-medium flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Efficiency Value
                  </p>
                  <Badge className="bg-amber-500/30 text-amber-300 border-0">
                    {efficiencyValue >= 85 ? 'HIGH' : efficiencyValue >= 70 ? 'MEDIUM' : 'DEVELOPING'}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="35" stroke="#ffffff20" strokeWidth="6" fill="none" />
                      <circle 
                        cx="40" cy="40" r="35" 
                        stroke="url(#effGradient)" 
                        strokeWidth="6" 
                        fill="none"
                        strokeDasharray={`${efficiencyValue * 2.2} 220`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="effGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#F59E0B" />
                          <stop offset="100%" stopColor="#22C55E" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{efficiencyValue}%</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">Natural Fit</span>
                      <span className="text-white">{profile?.naturalFit.score}%</span>
                    </div>
                    <Progress value={profile?.naturalFit.score} className="h-1.5 bg-white/20" />
                    
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">Developed Skills</span>
                      <span className="text-green-400">{profile?.developedSkills.score}%</span>
                    </div>
                    <Progress value={profile?.developedSkills.score} className="h-1.5 bg-white/20" />
                    
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">Learning Agility</span>
                      <span className="text-blue-400">{profile?.learningAgility.score}%</span>
                    </div>
                    <Progress value={profile?.learningAgility.score} className="h-1.5 bg-white/20" />
                  </div>
                </div>
                
                {/* Efficiency Insight */}
                <div className="mt-3 p-3 bg-white/5 rounded-xl">
                  <p className="text-white/70 text-xs">
                    💡 <span className="text-white font-medium">{profile?.name}</span> overcame a{' '}
                    <span className="text-amber-400">{profile?.naturalFit.gap}% personality gap</span>{' '}
                    through dedicated skill development. 
                    <span className="text-green-400"> Efficiency: HIGH</span>
                  </p>
                </div>
              </div>
              
              {/* Adaptive Level */}
              <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span className="text-white/80 text-sm">Adaptive Level</span>
                </div>
                <Badge 
                  className="border-0 text-white"
                  style={{ backgroundColor: getAdaptiveLevel(efficiencyValue).color + '50' }}
                >
                  {getAdaptiveLevel(efficiencyValue).name} (L{Object.keys(ASSESSMENT_LEVELS).indexOf(getAdaptiveLevel(efficiencyValue).name.toUpperCase()) + 1})
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: "overview", label: "Overview", icon: Target },
            { id: "tracker", label: "Talent Tracker", icon: TrendingUp },
            { id: "dimensions", label: "6 Dimensions", icon: BarChart3 },
            { id: "suitability", label: "Suitability", icon: CheckCircle }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`flex-shrink-0 ${
                activeTab === tab.id 
                  ? 'bg-purple-500 text-white' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`dp-tab-${tab.id}`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* TAB: Overview */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Role Match</p>
                      <p className="text-white font-bold text-lg">{profile?.suitability.matchScore}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <Award className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Current Role</p>
                      <p className="text-white font-bold text-sm">{profile?.suitability.currentRole}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Skill Development Journey */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Skill Development Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profile?.skillJourney.milestones.map((milestone, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-white/60 text-xs w-16">{milestone.date}</span>
                      <span className="text-white text-sm flex-1">{milestone.skill}</span>
                      <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                        +{milestone.improvement}%
                      </Badge>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-white/60 text-sm">Total Improvement</span>
                  <span className="text-green-400 font-bold text-lg">+{profile?.skillJourney.totalImprovement}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Alternate Roles */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Best-Fit Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profile?.suitability.alternateRoles.map((role, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between bg-white/5 rounded-xl p-3"
                    >
                      <span className="text-white text-sm">{role.role}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={role.match} className="w-20 h-2 bg-white/10" />
                        <span className="text-white/60 text-xs w-10">{role.match}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* TAB: Talent Tracker */}
        {activeTab === "tracker" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Efficiency Breakdown */}
            <Card className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border-amber-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Efficiency Formula
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900/50 rounded-xl p-4 font-mono text-sm">
                  <p className="text-white/60 mb-2">// Efficiency Value Calculation</p>
                  <p className="text-green-400">
                    Efficiency = (Skills × 0.6) + (NaturalFit × 0.3) + (LearningAgility × 0.1)
                  </p>
                  <div className="mt-3 pt-3 border-t border-white/10 text-white/80">
                    <p>= ({profile?.developedSkills.score} × 0.6) + ({profile?.naturalFit.score} × 0.3) + ({profile?.learningAgility.score} × 0.1)</p>
                    <p className="text-amber-400 font-bold mt-1">= {efficiencyValue}%</p>
                  </div>
                </div>
                
                <p className="text-white/60 text-xs mt-3 text-center">
                  💡 This shows that <span className="text-white">ANYONE</span> can achieve excellence through skill development,
                  even if personality is not a natural fit!
                </p>
              </CardContent>
            </Card>

            {/* Developed Skills Detail */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  Developed Skills Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile?.developedSkills.skills.map((skill, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                            {skill.growth}
                          </Badge>
                          <span className="text-white font-bold">{skill.level}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Agility */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-400" />
                  Learning Agility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-white/60 text-xs mb-1">Learning Style</p>
                    <p className="text-white font-bold">{profile?.learningAgility.style}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-white/60 text-xs mb-1">Adaptability</p>
                    <p className="text-blue-400 font-bold text-xl">{profile?.learningAgility.adaptability}%</p>
                  </div>
                </div>
                
                <div className="mt-4 bg-blue-500/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80 text-sm">Growth Mindset Score</span>
                    <span className="text-blue-400 font-bold">{profile?.learningAgility.growthMindset}%</span>
                  </div>
                  <Progress value={profile?.learningAgility.growthMindset} className="h-2 bg-white/10" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* TAB: 6 Dimensions */}
        {activeTab === "dimensions" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    EduMilestones 6D Assessment
                  </CardTitle>
                  <Badge className="bg-purple-500/20 text-purple-400 border-0 text-xs">
                    O*NET Aligned
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ASSESSMENT_DIMENSIONS.map((dim, idx) => {
                    const score = profile?.dimensions[dim.id]?.score || 0;
                    const level = profile?.dimensions[dim.id]?.level || "PARA";
                    const levelInfo = ASSESSMENT_LEVELS[level];
                    
                    return (
                      <motion.div
                        key={dim.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/5 rounded-xl p-4"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                            {dim.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-white font-medium">{dim.name}</h4>
                              <Badge 
                                className="border-0 text-white text-xs"
                                style={{ backgroundColor: levelInfo?.color + '50' }}
                              >
                                {level}
                              </Badge>
                            </div>
                            <p className="text-white/50 text-xs">{dim.theory}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full rounded-full"
                                style={{ backgroundColor: levelInfo?.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${score}%` }}
                                transition={{ duration: 1, delay: idx * 0.1 }}
                              />
                            </div>
                          </div>
                          <span className="text-white font-bold w-12 text-right">{score}%</span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2 text-xs text-white/40">
                          <span>Reliability: α={dim.reliability}</span>
                          <span>Sample: n={dim.sampleSize.toLocaleString()}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* TAB: Suitability */}
        {activeTab === "suitability" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Adaptive Level Explanation */}
            <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  Adaptive Question Levels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/60 text-sm mb-4">
                  Questions adapt from Para → Professional based on your performance
                </p>
                
                <div className="space-y-2">
                  {Object.entries(ASSESSMENT_LEVELS).map(([key, level], idx) => {
                    const isCurrentLevel = key === getAdaptiveLevel(efficiencyValue).name.toUpperCase();
                    return (
                      <div 
                        key={key}
                        className={`flex items-center gap-3 p-3 rounded-xl ${
                          isCurrentLevel ? 'bg-white/10 border border-white/20' : 'bg-white/5'
                        }`}
                      >
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: level.color }}
                        />
                        <span className="text-white font-medium flex-1">{level.name}</span>
                        <span className="text-white/50 text-xs">{level.desc}</span>
                        <span className="text-white/40 text-xs">{level.minScore}-{level.maxScore}%</span>
                        {isCurrentLevel && (
                          <Badge className="bg-purple-500/30 text-purple-300 border-0 text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Career Suitability Check */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  Career Suitability Check
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <p className="text-white/60 text-sm mb-2">Check Career Suitability for your Dream Career</p>
                  <p className="text-white/40 text-xs">Take Informed Career Decisions. Check your Career Suitability in 30 Minutes</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    className="h-auto py-4 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex flex-col items-center gap-2"
                    onClick={() => window.open('https://careerguardians.doers-world.com/signin/suitability', '_blank')}
                    data-testid="dp-professional-btn"
                  >
                    <BookOpen className="w-6 h-6" />
                    <span className="font-bold">Professional</span>
                    <span className="text-xs text-white/70">Working Professionals</span>
                  </Button>
                  
                  <Button 
                    className="h-auto py-4 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex flex-col items-center gap-2"
                    onClick={() => window.open('https://careerguardians.doers-world.com/signin/suitability', '_blank')}
                    data-testid="dp-graduate-btn"
                  >
                    <Award className="w-6 h-6" />
                    <span className="font-bold">Graduates</span>
                    <span className="text-xs text-white/70">Fresh & Recent Grads</span>
                  </Button>
                </div>
                
                <div className="mt-4 p-3 bg-amber-500/10 rounded-xl text-center">
                  <p className="text-amber-400 text-sm">
                    🎯 30-minute assessment | 6 Dimensions | O*NET Aligned
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Verification Footer */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-white font-medium text-sm">Right Doers Powered™</p>
                  <p className="text-white/50 text-xs">Credential ID: {profile?.verification.credentialId}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                  <Check className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
                <p className="text-white/40 text-[10px] mt-1">
                  {new Date(profile?.verification.verifiedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
        <div className="max-w-4xl mx-auto">
          <Button 
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
            onClick={() => navigate('/prakruti')}
            data-testid="dp-continue-btn"
          >
            Enter the Doers World <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-center text-white/40 text-xs mt-2">
            Say WOW. Get What You Want.
          </p>
        </div>
      </div>

      {/* SEND YOUR PROFILER - Viral Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 rounded-3xl w-full max-w-md border border-white/20 overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header - D.P. CAMPAIGN */}
              <div className="p-6 text-center border-b border-white/10 bg-gradient-to-b from-indigo-900/50 to-transparent">
                <Badge className="mb-3 bg-red-500/20 text-red-400 border-0 text-[10px]">
                  FROM FAKE D.P. TO REAL D.P.
                </Badge>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-white text-xl font-bold mb-1">Send Your Profiler</h2>
                <p className="text-purple-300 text-sm font-medium">HI AI-APP.COM</p>
                <p className="text-white/60 text-xs mt-1">JOIN THE AI REVOLUTION</p>
              </div>

              {/* Big 5 Action Cards */}
              <div className="px-4 py-3 space-y-2">
                <div className="flex items-center gap-3 bg-gradient-to-r from-green-500/20 to-emerald-500/10 rounded-xl p-3 border border-green-500/20">
                  <div className="w-8 h-8 rounded-lg bg-green-500/30 flex items-center justify-center text-green-400 font-bold text-sm">GET</div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">Your TALENT CARD</p>
                    <p className="text-green-400/80 text-xs">@ talenton.ai</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/10 rounded-xl p-3 border border-blue-500/20">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">SHARE</div>
                  <p className="text-white text-sm">with those who did not believe YOU</p>
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-pink-500/10 rounded-xl p-3 border border-purple-500/20">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-sm">KEEP</div>
                  <p className="text-white text-sm">with you as your PERSONAL G.P.S</p>
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500/20 to-orange-500/10 rounded-xl p-3 border border-amber-500/20">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">MATCH</div>
                  <p className="text-white text-sm">to see MULTIPLIER X EFFECT</p>
                </div>
              </div>

              {/* Preview Card */}
              <div className="px-4 py-3">
                <div className="bg-gradient-to-br from-indigo-600/30 to-purple-600/30 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                      🎯
                    </div>
                    <div>
                      <p className="text-white font-bold">{profile?.name}</p>
                      <p className="text-white/60 text-xs">{profile?.doersId}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-2xl font-bold text-white">{profile?.doersScore.value}</p>
                      <p className="text-white/50 text-xs">DoersScore</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Efficiency: <span className="text-green-400 font-bold">{efficiencyValue}%</span></span>
                    <Badge className="bg-purple-500/30 text-purple-300 border-0 text-xs">
                      {getAdaptiveLevel(efficiencyValue).name}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Share Options */}
              <div className="px-4 pb-4">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Share via</p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <Button
                    onClick={shareToWhatsApp}
                    className="h-14 flex-col gap-1 bg-green-600 hover:bg-green-700"
                    data-testid="share-whatsapp"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-[10px]">WhatsApp</span>
                  </Button>
                  <Button
                    onClick={shareToLinkedIn}
                    className="h-14 flex-col gap-1 bg-blue-700 hover:bg-blue-800"
                    data-testid="share-linkedin"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span className="text-[10px]">LinkedIn</span>
                  </Button>
                  <Button
                    onClick={shareToTwitter}
                    className="h-14 flex-col gap-1 bg-slate-800 hover:bg-slate-700"
                    data-testid="share-twitter"
                  >
                    <Twitter className="w-5 h-5" />
                    <span className="text-[10px]">X/Twitter</span>
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <Button
                    onClick={shareToFacebook}
                    className="h-14 flex-col gap-1 bg-blue-600 hover:bg-blue-700"
                    data-testid="share-facebook"
                  >
                    <Facebook className="w-5 h-5" />
                    <span className="text-[10px]">Facebook</span>
                  </Button>
                  <Button
                    onClick={shareViaEmail}
                    className="h-14 flex-col gap-1 bg-orange-600 hover:bg-orange-700"
                    data-testid="share-email"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="text-[10px]">Email</span>
                  </Button>
                  <Button
                    onClick={copyToClipboard}
                    className="h-14 flex-col gap-1 bg-slate-700 hover:bg-slate-600"
                    data-testid="share-copy"
                  >
                    <Copy className="w-5 h-5" />
                    <span className="text-[10px]">Copy</span>
                  </Button>
                </div>

                {/* Big 5 Report Download */}
                <Button
                  onClick={() => {
                    toast.success('Generating Big 5 Report PDF...');
                    // Future: Generate actual PDF
                  }}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 mb-3"
                  data-testid="download-big5-report"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Big 5 Report (PDF)
                </Button>

                {/* Viral CTA */}
                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-3 text-center border border-red-500/20">
                  <p className="text-red-400 text-xs font-bold uppercase tracking-wider">College Campaign</p>
                  <p className="text-white text-sm font-medium mt-1">
                    From FAKE D.P. → Real D.P.
                  </p>
                  <p className="text-white/50 text-[10px] mt-1">
                    Your Doers Profiler is your TRUE Display Picture
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white/60 hover:text-white"
                onClick={() => setShowShareModal(false)}
                data-testid="share-modal-close"
              >
                <X className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Missing import fix
const CheckCircle = Check;
