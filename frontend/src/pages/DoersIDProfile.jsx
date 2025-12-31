import { useState, useEffect, useRef } from "react";
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
  Heart,
  Shield,
  Users,
  Star,
  Target,
  Rocket,
  Coins,
  Download,
  Share2,
  BookOpen,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Award,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/App";
import { useLanguage } from "@/context/LanguageContext";

// Career Clusters with colors
const CAREER_CLUSTERS = [
  { id: "human_service", name: "Human Service & Social Science", icon: "👥", color: "#EC4899" },
  { id: "arts", name: "Arts & Language Arts", icon: "🎨", color: "#8B5CF6" },
  { id: "health", name: "Health Science", icon: "🏥", color: "#EF4444" },
  { id: "science", name: "Science, Maths & Engineering", icon: "🔬", color: "#06B6D4" },
  { id: "technology", name: "Information Technology", icon: "💻", color: "#3B82F6" },
  { id: "business", name: "Business Management", icon: "📊", color: "#10B981" },
  { id: "finance", name: "Accounts & Finance", icon: "💰", color: "#F59E0B" },
  { id: "manufacturing", name: "Manufacturing", icon: "🏭", color: "#6366F1" },
  { id: "hospitality", name: "Hospitality & Tourism", icon: "🏨", color: "#14B8A6" },
  { id: "legal", name: "Legal Services", icon: "⚖️", color: "#7C3AED" },
  { id: "media", name: "Media & Communication", icon: "📺", color: "#F472B6" },
  { id: "agriculture", name: "Agriculture", icon: "🌾", color: "#22C55E" },
];

// MBTI Personality Types
const PERSONALITY_TYPES = {
  INTJ: { name: "Architect", desc: "Strategic, independent thinkers", careers: ["Engineer", "Scientist", "Analyst"] },
  INTP: { name: "Logician", desc: "Innovative inventors", careers: ["Developer", "Researcher", "Designer"] },
  ENTJ: { name: "Commander", desc: "Bold, strategic leaders", careers: ["Executive", "Entrepreneur", "Manager"] },
  ENTP: { name: "Debater", desc: "Smart, curious thinkers", careers: ["Lawyer", "Consultant", "Inventor"] },
  INFJ: { name: "Advocate", desc: "Quiet, mystical idealists", careers: ["Counselor", "Writer", "HR"] },
  INFP: { name: "Mediator", desc: "Poetic, kind healers", careers: ["Artist", "Therapist", "Designer"] },
  ENFJ: { name: "Protagonist", desc: "Charismatic, inspiring leaders", careers: ["Teacher", "Coach", "HR Manager"] },
  ENFP: { name: "Campaigner", desc: "Enthusiastic, creative spirits", careers: ["Marketing", "Trainer", "Entertainer"] },
  ISTJ: { name: "Logistician", desc: "Practical, fact-minded", careers: ["Accountant", "Admin", "Inspector"] },
  ISFJ: { name: "Defender", desc: "Dedicated protectors", careers: ["Nurse", "Teacher", "Social Worker"] },
  ESTJ: { name: "Executive", desc: "Excellent administrators", careers: ["Manager", "Judge", "Officer"] },
  ESFJ: { name: "Consul", desc: "Caring, social helpers", careers: ["Nurse", "Teacher", "Event Planner"] },
  ISTP: { name: "Virtuoso", desc: "Bold, practical experimenters", careers: ["Mechanic", "Engineer", "Pilot"] },
  ISFP: { name: "Adventurer", desc: "Flexible, charming artists", careers: ["Designer", "Chef", "Vet"] },
  ESTP: { name: "Entrepreneur", desc: "Smart, energetic perceivers", careers: ["Sales", "Marketing", "Athlete"] },
  ESFP: { name: "Entertainer", desc: "Spontaneous, energetic", careers: ["Actor", "Host", "Coach"] },
};

// RIASEC Interest Types
const RIASEC_TYPES = {
  R: { name: "Realistic", desc: "Hands-on, practical", icon: "🔧", color: "#EF4444" },
  I: { name: "Investigative", desc: "Analytical, intellectual", icon: "🔬", color: "#3B82F6" },
  A: { name: "Artistic", desc: "Creative, expressive", icon: "🎨", color: "#8B5CF6" },
  S: { name: "Social", desc: "Helping, teaching", icon: "👥", color: "#EC4899" },
  E: { name: "Enterprising", desc: "Leading, persuading", icon: "📈", color: "#F59E0B" },
  C: { name: "Conventional", desc: "Organizing, detail-oriented", icon: "📋", color: "#10B981" },
};

// L1-L5 Level Framework
const LEVELS = {
  L1: { name: "Entry", salary: "₹15K-30K", desc: "Fresher / Learning", color: "#94A3B8" },
  L2: { name: "Junior", salary: "₹30K-60K", desc: "1-3 years experience", color: "#22C55E" },
  L3: { name: "Mid", salary: "₹60K-1.5L", desc: "3-7 years experience", color: "#3B82F6" },
  L4: { name: "Senior", salary: "₹1.5L-5L", desc: "7-15 years experience", color: "#8B5CF6" },
  L5: { name: "Expert", salary: "₹5L+", desc: "15+ years / Leadership", color: "#F59E0B" },
};

export default function DoersIDProfile({ profileData }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const scrollRef = useRef(null);
  
  // Mock data for demonstration - in production this comes from assessment
  const [profile, setProfile] = useState(profileData || {
    // Basic Info
    name: user?.name || "Doer Profile",
    phone: user?.phone || "",
    location: "Bengaluru, Karnataka",
    doersId: `DOE-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    stage: "clarity", // unaware, confused, exploring, clarity, future_ready
    
    // PASS Code
    passCode: {
      psy: 78,
      skill: 72,
      overall: 75,
      level: "L3",
      confidence: 92
    },
    
    // Personality (MBTI-style)
    personality: {
      type: "INFP",
      dimensions: {
        EI: { value: 43, label: "Introvert" },
        SN: { value: 71, label: "iNtuitive" },
        TF: { value: 57, label: "Feeling" },
        JP: { value: 57, label: "Perceiving" }
      }
    },
    
    // Career Interests (RIASEC)
    interests: {
      primary: "S",
      secondary: "A",
      tertiary: "R",
      scores: {
        R: 66, I: 60, A: 66, S: 100, E: 47, C: 35
      }
    },
    
    // Motivators
    motivators: {
      high: ["Continuous Learning", "Creativity", "Social Service"],
      medium: ["High Paced Environment", "Adventure"],
      low: ["Structured Work", "Independence"]
    },
    
    // Learning Style
    learningStyle: {
      primary: "Auditory",
      scores: { auditory: 38, visual: 38, kinesthetic: 25, readWrite: 0 }
    },
    
    // EQ Analysis
    eq: {
      selfAwareness: 70,
      managingEmotions: 77,
      motivation: 93,
      empathy: 93,
      relationshipMgmt: 83,
      overall: 83
    },
    
    // Skills & Abilities
    skills: {
      numerical: 60,
      logical: 40,
      verbal: 80,
      administrative: 40,
      spatial: 100,
      leadership: 80,
      social: 100,
      mechanical: 30
    },
    
    // Career Clusters (sorted by match %)
    clusters: [
      { id: "human_service", name: "Human Service", match: 87 },
      { id: "arts", name: "Arts & Language", match: 77 },
      { id: "health", name: "Health Science", match: 64 },
      { id: "hospitality", name: "Hospitality", match: 59 },
    ],
    
    // Career Recommendations
    recommendations: {
      topChoice: {
        title: "UI/UX Designer",
        cluster: "Arts & Language",
        psyMatch: 73,
        skillMatch: 100,
        salaryRange: "₹6L - ₹25L",
        growthRate: "25% YoY",
        demandLevel: "Very High"
      },
      goodChoices: [
        { title: "Counselling Psychologist", psyMatch: 88, skillMatch: 90 },
        { title: "Product Designer", psyMatch: 73, skillMatch: 88 },
        { title: "Corporate Trainer", psyMatch: 74, skillMatch: 90 },
      ],
      optional: [
        { title: "School Teacher", psyMatch: 70, skillMatch: 93 },
        { title: "Content Creator", psyMatch: 65, skillMatch: 85 },
      ]
    },
    
    // Gap Analysis
    gaps: {
      needsImprovement: [
        { skill: "Logical Ability", current: 40, required: 60, priority: "high" },
        { skill: "Administrative Skills", current: 40, required: 70, priority: "medium" },
        { skill: "Mechanical Ability", current: 30, required: 50, priority: "low" },
      ],
      strengths: [
        { skill: "Spatial Visualization", score: 100 },
        { skill: "Social Cooperation", score: 100 },
        { skill: "Empathy", score: 93 },
        { skill: "Motivation", score: 93 },
      ]
    },
    
    // Education Roadmap
    educationRoadmap: {
      current: "Graduate",
      recommended: [
        { level: "Graduation", courses: ["B.Des in UI/UX", "BFA", "B.Sc Graphic Design"] },
        { level: "Post Graduation", courses: ["M.Des in User Experience", "MA Graphic Design"] },
        { level: "Certifications", courses: ["Google UX Certificate", "Adobe Certified", "Figma Expert"] },
      ]
    },
    
    // Salary Impact Skills
    salarySkills: [
      { skill: "Figma/Sketch", impact: 95 },
      { skill: "User Research", impact: 90 },
      { skill: "Prototyping", impact: 85 },
      { skill: "Design Systems", impact: 80 },
      { skill: "HTML/CSS Basics", impact: 70 },
    ],
    
    // D-COIN Balance
    dcoins: 175,
    
    // Verification Status
    verification: {
      aimeeVerified: true,
      doubleChecked: true,
      confidenceLevel: 92,
      lastUpdated: new Date().toISOString()
    }
  });

  const personalityInfo = PERSONALITY_TYPES[profile.personality.type] || PERSONALITY_TYPES.INFP;
  const levelInfo = LEVELS[profile.passCode.level] || LEVELS.L3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-white font-bold">DoersID Profile</h1>
            <p className="text-white/50 text-xs">{profile.doersId}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-white">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Single Scroll Content */}
      <main ref={scrollRef} className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* SECTION 1: PASS Code Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden"
        >
          <Card className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 border-0 text-white">
            <CardContent className="p-6">
              {/* Verification Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/20 text-white border-0 text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {profile.verification.confidenceLevel}% Verified
                </Badge>
              </div>
              
              {/* Profile Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
                  🎯
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold">{profile.name}</h2>
                  <p className="text-white/70 text-sm">{profile.doersId}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3 h-3 text-white/50" />
                    <span className="text-white/50 text-xs">{profile.location}</span>
                  </div>
                </div>
              </div>
              
              {/* PASS Code Display */}
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-4">
                <p className="text-white/60 text-xs uppercase tracking-wider mb-2 text-center">
                  Your PASS Code
                </p>
                <div className="text-center">
                  <span className="text-6xl font-bold">{profile.passCode.overall}</span>
                  <span className="text-2xl text-white/60">/100</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{profile.passCode.psy}</p>
                    <p className="text-[10px] text-white/60">PSY Score</p>
                  </div>
                  <div className="text-center border-x border-white/20">
                    <p className="text-2xl font-bold">{profile.passCode.skill}</p>
                    <p className="text-[10px] text-white/60">SKILL Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-300">{profile.passCode.level}</p>
                    <p className="text-[10px] text-white/60">{levelInfo.salary}</p>
                  </div>
                </div>
              </div>
              
              {/* D-COIN Balance */}
              <div className="flex items-center justify-between bg-amber-500/20 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💎</span>
                  <span className="font-bold">{profile.dcoins} D-COIN</span>
                </div>
                <Badge className="bg-white/20 text-white border-0">Energy Balance</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* SECTION 2: Career Personality (MBTI) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Career Personality
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Personality Type Badge */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{profile.personality.type}</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">The {personalityInfo.name}</h3>
                  <p className="text-white/60 text-sm">{personalityInfo.desc}</p>
                </div>
              </div>
              
              {/* Dimensions */}
              <div className="space-y-3">
                {Object.entries(profile.personality.dimensions).map(([key, dim]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">{key === 'EI' ? 'E ↔ I' : key === 'SN' ? 'S ↔ N' : key === 'TF' ? 'T ↔ F' : 'J ↔ P'}</span>
                      <span className="text-white font-medium">{dim.label} ({dim.value}%)</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{ width: `${dim.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* SECTION 3: Career Interests (RIASEC) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Career Interests (RIASEC)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Primary Interest Code */}
              <div className="flex justify-center gap-2 mb-4">
                {[profile.interests.primary, profile.interests.secondary, profile.interests.tertiary].map((code, idx) => (
                  <div 
                    key={code}
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{ 
                      backgroundColor: RIASEC_TYPES[code]?.color + '30',
                      border: `2px solid ${RIASEC_TYPES[code]?.color}`
                    }}
                  >
                    {RIASEC_TYPES[code]?.icon}
                  </div>
                ))}
              </div>
              <p className="text-center text-white/60 text-sm mb-4">
                Your Code: <span className="text-white font-bold">{profile.interests.primary}{profile.interests.secondary}{profile.interests.tertiary}</span>
              </p>
              
              {/* Interest Scores */}
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(profile.interests.scores).map(([code, score]) => (
                  <div key={code} className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                    <span className="text-lg">{RIASEC_TYPES[code]?.icon}</span>
                    <div className="flex-1">
                      <p className="text-white text-xs font-medium">{RIASEC_TYPES[code]?.name}</p>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${score}%`,
                            backgroundColor: RIASEC_TYPES[code]?.color
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-white/60 text-xs">{score}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* SECTION 4: EQ Analysis */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                Emotional Intelligence (EQ)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#1e293b" strokeWidth="8" fill="none" />
                    <circle 
                      cx="48" cy="48" r="40" 
                      stroke="url(#eqGradient)" 
                      strokeWidth="8" 
                      fill="none"
                      strokeDasharray={`${profile.eq.overall * 2.51} 251`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="eqGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#EC4899" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{profile.eq.overall}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                {[
                  { name: "Self Awareness", score: profile.eq.selfAwareness, icon: "👁️" },
                  { name: "Managing Emotions", score: profile.eq.managingEmotions, icon: "🎭" },
                  { name: "Motivation", score: profile.eq.motivation, icon: "🔥" },
                  { name: "Empathy", score: profile.eq.empathy, icon: "💗" },
                  { name: "Relationship Mgmt", score: profile.eq.relationshipMgmt, icon: "🤝" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="text-sm">{item.icon}</span>
                    <span className="text-white/60 text-xs flex-1">{item.name}</span>
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <span className="text-white text-xs font-medium w-8">{item.score}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* SECTION 5: Skills & Abilities */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Skills & Abilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Numerical", score: profile.skills.numerical, icon: "🔢" },
                  { name: "Logical", score: profile.skills.logical, icon: "🧠" },
                  { name: "Verbal", score: profile.skills.verbal, icon: "💬" },
                  { name: "Administrative", score: profile.skills.administrative, icon: "📋" },
                  { name: "Spatial", score: profile.skills.spatial, icon: "🎨" },
                  { name: "Leadership", score: profile.skills.leadership, icon: "👑" },
                  { name: "Social", score: profile.skills.social, icon: "🤝" },
                  { name: "Mechanical", score: profile.skills.mechanical, icon: "⚙️" },
                ].map((skill) => (
                  <div key={skill.name} className="bg-white/5 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg">{skill.icon}</span>
                      <span className={`text-sm font-bold ${
                        skill.score >= 80 ? 'text-green-400' : 
                        skill.score >= 60 ? 'text-blue-400' : 
                        skill.score >= 40 ? 'text-amber-400' : 'text-red-400'
                      }`}>{skill.score}%</span>
                    </div>
                    <p className="text-white/80 text-xs">{skill.name}</p>
                    <div className="h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          skill.score >= 80 ? 'bg-green-500' : 
                          skill.score >= 60 ? 'bg-blue-500' : 
                          skill.score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* SECTION 6: Career Clusters Match */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <PieChart className="w-5 h-5 text-cyan-400" />
                Career Clusters Match
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.clusters.map((cluster, idx) => {
                  const clusterInfo = CAREER_CLUSTERS.find(c => c.id === cluster.id);
                  return (
                    <div key={cluster.id} className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                        style={{ backgroundColor: clusterInfo?.color + '30' }}
                      >
                        {clusterInfo?.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{cluster.name}</p>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${cluster.match}%`,
                              backgroundColor: clusterInfo?.color
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-white font-bold">{cluster.match}%</span>
                      {idx === 0 && <Badge className="bg-green-500/20 text-green-400 border-0 text-[10px]">Best Fit</Badge>}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* SECTION 7: TOP CAREER RECOMMENDATION */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-green-600 to-emerald-700 border-0">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-300" />
                  TOP CHOICE
                </CardTitle>
                <Badge className="bg-white/20 text-white border-0">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Double Verified
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-4">
                <h3 className="text-white text-2xl font-bold mb-2">{profile.recommendations.topChoice.title}</h3>
                <p className="text-white/70 text-sm mb-4">{profile.recommendations.topChoice.cluster}</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-white/60 text-xs">PSY Match</p>
                    <p className="text-2xl font-bold text-white">{profile.recommendations.topChoice.psyMatch}%</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-white/60 text-xs">SKILL Match</p>
                    <p className="text-2xl font-bold text-white">{profile.recommendations.topChoice.skillMatch}%</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-white/60 text-xs">Salary Range</p>
                    <p className="text-white font-bold">{profile.recommendations.topChoice.salaryRange}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-xs">Growth</p>
                    <p className="text-green-300 font-bold">{profile.recommendations.topChoice.growthRate}</p>
                  </div>
                </div>
              </div>
              
              {/* Good Choices */}
              <div className="space-y-2">
                <p className="text-white/60 text-xs uppercase tracking-wider">Good Choices</p>
                {profile.recommendations.goodChoices.map((rec, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                    <span className="text-white text-sm">{rec.title}</span>
                    <div className="flex gap-2">
                      <Badge className="bg-purple-500/20 text-purple-300 border-0 text-[10px]">
                        PSY {rec.psyMatch}%
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-300 border-0 text-[10px]">
                        SKILL {rec.skillMatch}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* SECTION 8: Gap Analysis */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                Gap Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Strengths */}
              <div className="mb-4">
                <p className="text-green-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Strengths
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.gaps.strengths.map((s, idx) => (
                    <Badge key={idx} className="bg-green-500/20 text-green-400 border-0">
                      {s.skill} ({s.score}%)
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Needs Improvement */}
              <div>
                <p className="text-amber-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Needs Development
                </p>
                <div className="space-y-2">
                  {profile.gaps.needsImprovement.map((gap, idx) => (
                    <div key={idx} className="bg-white/5 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm">{gap.skill}</span>
                        <Badge className={`border-0 text-[10px] ${
                          gap.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          gap.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {gap.priority} priority
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 text-xs">Current: {gap.current}%</span>
                        <ArrowRight className="w-3 h-3 text-white/40" />
                        <span className="text-green-400 text-xs">Target: {gap.required}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* SECTION 9: Education Roadmap */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                Education Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.educationRoadmap.recommended.map((level, idx) => (
                  <div key={idx} className="relative pl-6">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-blue-500" />
                    {idx !== profile.educationRoadmap.recommended.length - 1 && (
                      <div className="absolute left-1.5 top-4 w-0.5 h-full bg-blue-500/30" />
                    )}
                    
                    <p className="text-white font-medium text-sm mb-2">{level.level}</p>
                    <div className="flex flex-wrap gap-1">
                      {level.courses.map((course, cIdx) => (
                        <Badge key={cIdx} className="bg-white/10 text-white/80 border-0 text-[10px]">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* SECTION 10: Salary Impact Skills */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Skills That Boost Salary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {profile.salarySkills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-white/80 text-sm flex-1">{skill.skill}</span>
                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                        style={{ width: `${skill.impact}%` }}
                      />
                    </div>
                    <span className="text-green-400 text-xs font-medium w-10">+{skill.impact}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="pb-8"
        >
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 border-0">
            <CardContent className="p-6 text-center">
              <h3 className="text-white text-xl font-bold mb-2">Ready to Start Your Journey?</h3>
              <p className="text-white/80 text-sm mb-4">
                Explore courses, find jobs, and earn D-COIN rewards
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  className="bg-white text-orange-600 hover:bg-white/90 font-semibold"
                  onClick={() => navigate('/gigs')}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Find Jobs
                </Button>
                <Button 
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/clubs')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Learn Skills
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Footer */}
        <footer className="text-center py-4">
          <p className="text-white/30 text-[10px]">
            Report Generated: {new Date(profile.createdAt).toLocaleDateString()}
          </p>
          <p className="text-white/20 text-[10px]">
            HI AI-APP.COM | Agent AIMEE AI Analyzer | Double-Verified ✓
          </p>
        </footer>
      </main>
    </div>
  );
}
