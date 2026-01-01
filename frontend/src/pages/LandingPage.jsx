import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  ArrowRight,
  Brain,
  GraduationCap,
  Users,
  Handshake,
  Star,
  Play,
  Globe,
  Zap,
  ChevronDown,
  IdCard
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import AstroDoer from "@/components/AstroDoer";

// 12 Divisions for the Flywheel
const DIVISIONS = [
  { id: "policy", name: "Policy", icon: "🏛️", color: "#8B5CF6" },
  { id: "legal", name: "Legal", icon: "⚖️", color: "#6366F1" },
  { id: "security", name: "Security", icon: "🛡️", color: "#EF4444" },
  { id: "sport", name: "Sport", icon: "🏆", color: "#F97316" },
  { id: "food", name: "Food", icon: "🍽️", color: "#22C55E" },
  { id: "health", name: "Health", icon: "🏥", color: "#EC4899" },
  { id: "science", name: "Science", icon: "🔬", color: "#06B6D4" },
  { id: "tech", name: "Tech", icon: "💻", color: "#8B5CF6" },
  { id: "transport", name: "Transport", icon: "✈️", color: "#0EA5E9" },
  { id: "art", name: "Art", icon: "🎨", color: "#F472B6" },
  { id: "education", name: "Education", icon: "📚", color: "#14B8A6" },
  { id: "finance", name: "Finance", icon: "💰", color: "#EAB308" },
];

// 5 Entry Points (The 5 P's - PANCHA PANDAVA)
const ENTRY_POINTS = {
  en: [
    {
      id: "pupil",
      title: "PUPIL",
      subtitle: "Students & Learners",
      description: "Skilling Solutions for Industry 4.0 & 5.0",
      icon: GraduationCap,
      color: "from-blue-500 to-indigo-600",
      path: "/role-play",
      features: ["Ability Assessment", "Career Guidance", "Skill Courses"]
    },
    {
      id: "people",
      title: "PEOPLE",
      subtitle: "Consumers & Job Seekers",
      description: "Find work that feels like PLAY",
      icon: Users,
      color: "from-green-500 to-emerald-600",
      path: "/auth?role=doer&type=people",
      features: ["Agent AIMEE Analysis", "Jobs4Me Matching", "D-COIN Rewards"]
    },
    {
      id: "profiles",
      title: "PROFILES",
      subtitle: "D.P. - Doers Profiler",
      description: "Your TALENT CARD • DoersScore™",
      icon: IdCard,
      color: "from-pink-500 to-rose-600",
      path: "/dp",
      features: ["Talent Card", "DoersScore™", "Send Your Profiler"]
    },
    {
      id: "partners",
      title: "PARTNERS",
      subtitle: "B2G • B2B • B2C • B2D",
      description: "Build the future workforce together",
      icon: Handshake,
      color: "from-purple-500 to-violet-600",
      path: "/auth?role=employer&type=partner",
      features: ["Talent Pipeline", "Corporate Training", "Government Programs"]
    },
    {
      id: "performers",
      title: "PERFORMERS",
      subtitle: "Ready to Work",
      description: "Showcase your talents to the world",
      icon: Star,
      color: "from-amber-500 to-orange-600",
      path: "/auth?role=doer&type=performer",
      features: ["DoersID Card", "Gig Marketplace", "Career Growth"]
    }
  ],
  hi: [
    {
      id: "pupil",
      title: "विद्यार्थी",
      subtitle: "छात्र और सीखने वाले",
      description: "इंडस्ट्री 4.0 और 5.0 के लिए स्किलिंग",
      icon: GraduationCap,
      color: "from-blue-500 to-indigo-600",
      path: "/role-play",
      features: ["योग्यता मूल्यांकन", "करियर मार्गदर्शन", "कौशल पाठ्यक्रम"]
    },
    {
      id: "people",
      title: "लोग",
      subtitle: "उपभोक्ता और नौकरी चाहने वाले",
      description: "ऐसा काम खोजें जो खेल जैसा लगे",
      icon: Users,
      color: "from-green-500 to-emerald-600",
      path: "/auth?role=doer&type=people",
      features: ["Agent AIMEE विश्लेषण", "Jobs4Me मैचिंग", "D-COIN पुरस्कार"]
    },
    {
      id: "profiles",
      title: "प्रोफाइल",
      subtitle: "D.P. - डोअर्स प्रोफाइलर",
      description: "आपका टैलेंट कार्ड • DoersScore™",
      icon: IdCard,
      color: "from-pink-500 to-rose-600",
      path: "/dp",
      features: ["टैलेंट कार्ड", "DoersScore™", "प्रोफाइलर भेजें"]
    },
    {
      id: "partners",
      title: "साझेदार",
      subtitle: "B2G • B2B • B2C • B2D",
      description: "भविष्य की कार्यबल साथ मिलकर बनाएं",
      icon: Handshake,
      color: "from-purple-500 to-violet-600",
      path: "/auth?role=employer&type=partner",
      features: ["टैलेंट पाइपलाइन", "कॉर्पोरेट ट्रेनिंग", "सरकारी कार्यक्रम"]
    },
    {
      id: "performers",
      title: "प्रदर्शक",
      subtitle: "काम के लिए तैयार",
      description: "अपनी प्रतिभा दुनिया को दिखाएं",
      icon: Star,
      color: "from-amber-500 to-orange-600",
      path: "/auth?role=doer&type=performer",
      features: ["DoersID कार्ड", "गिग मार्केटप्लेस", "करियर विकास"]
    }
  ]
};

// Hook question translations
const HOOK_CONTENT = {
  en: {
    question1: "Will AI make my life better?",
    question2: "Will AI take away my job?",
    question3: "Or BOTH?",
    cta: "ASK AGENT AIMEE TO ANALYZE YOU",
    whoAreYou: "WHO ARE YOU?",
    whereEnter: "Where do you want to ENTER?",
    enterDoersWorld: "ENTER THE DOERS WORLD",
    flywheel: "12 DIVISIONS",
    wow: "WOW - Way of Work",
    tagline: "Dream → Do → Done",
    poweredBy: "Ability Assessments + Skilling Solutions = World's Workforce Creators"
  },
  hi: {
    question1: "क्या AI मेरी जिंदगी बेहतर बनाएगा?",
    question2: "क्या AI मेरी नौकरी छीन लेगा?",
    question3: "या दोनों?",
    cta: "AGENT AIMEE से विश्लेषण करवाएं",
    whoAreYou: "आप कौन हैं?",
    whereEnter: "आप कहाँ प्रवेश करना चाहते हैं?",
    enterDoersWorld: "DOERS WORLD में प्रवेश करें",
    flywheel: "12 विभाग",
    wow: "WOW - काम का तरीका",
    tagline: "सपना → करो → पूरा",
    poweredBy: "योग्यता मूल्यांकन + स्किलिंग समाधान = विश्व की कार्यबल निर्माता"
  }
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [showAstro, setShowAstro] = useState(false);

  const content = HOOK_CONTENT[language] || HOOK_CONTENT.en;
  const entryPoints = ENTRY_POINTS[language] || ENTRY_POINTS.en;

  // Rotate wheel continuously
  useEffect(() => {
    const interval = setInterval(() => {
      setWheelRotation(prev => prev + 0.5);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Show Astro after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowAstro(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 overflow-hidden relative">
      {/* Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => {
          // Pre-calculate positions for each star
          const positions = [
            { left: 15, top: 8 }, { left: 85, top: 12 }, { left: 42, top: 5 }, { left: 73, top: 18 }, { left: 28, top: 25 },
            { left: 91, top: 32 }, { left: 6, top: 45 }, { left: 55, top: 38 }, { left: 33, top: 52 }, { left: 78, top: 48 },
            { left: 12, top: 62 }, { left: 67, top: 55 }, { left: 45, top: 68 }, { left: 88, top: 72 }, { left: 22, top: 78 },
            { left: 95, top: 85 }, { left: 38, top: 88 }, { left: 62, top: 92 }, { left: 8, top: 95 }, { left: 52, top: 15 },
            { left: 18, top: 35 }, { left: 82, top: 42 }, { left: 48, top: 28 }, { left: 25, top: 58 }, { left: 72, top: 65 },
            { left: 35, top: 75 }, { left: 58, top: 82 }, { left: 92, top: 22 }, { left: 5, top: 28 }, { left: 68, top: 8 },
            { left: 42, top: 42 }, { left: 15, top: 52 }, { left: 78, top: 58 }, { left: 32, top: 65 }, { left: 85, top: 75 },
            { left: 55, top: 22 }, { left: 22, top: 15 }, { left: 65, top: 35 }, { left: 48, top: 48 }, { left: 88, top: 55 },
            { left: 12, top: 72 }, { left: 75, top: 82 }, { left: 38, top: 95 }, { left: 58, top: 5 }, { left: 95, top: 45 },
            { left: 28, top: 88 }, { left: 82, top: 92 }, { left: 45, top: 78 }, { left: 68, top: 25 }, { left: 8, top: 38 }
          ];
          const pos = positions[i % positions.length];
          const delays = [0, 0.5, 1, 1.5, 0.3, 0.8, 1.2, 0.2, 0.7, 1.8, 0.4, 0.9, 1.4, 0.6, 1.1, 1.6, 0.1, 1.3, 0.85, 1.7];
          const durations = [2.5, 3, 3.5, 2.8, 3.2, 2.6, 3.8, 2.4, 3.3, 2.9, 3.6, 2.7, 3.1, 2.3, 3.4, 2.2, 3.7, 2.1, 3.9, 4];
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: durations[i % durations.length],
                repeat: Infinity,
                delay: delays[i % delays.length],
              }}
            />
          );
        })}
      </div>

      {/* Floating Astro Doer */}
      {showAstro && (
        <div className="fixed bottom-24 right-4 z-50">
          <AstroDoer message="greeting" size="sm" showBubble={true} autoHide={true} />
        </div>
      )}

      {/* Header */}
      <motion.header 
        className="relative z-10 p-4 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <motion.div 
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <span className="text-white font-bold text-lg">HI</span>
          </motion.div>
          <div>
            <span className="font-bold text-orange-400">HI AI</span>
            <span className="text-white">-APP</span>
            <span className="text-blue-400">.COM</span>
          </div>
        </div>
        <LanguageSelector />
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-8">
        
        {/* THE HOOK QUESTION - MOONSHOT RINGS */}
        <motion.section 
          className="text-center py-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="max-w-lg mx-auto">
            {/* Cosmic glow effect */}
            <div className="absolute left-1/2 top-32 -translate-x-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <motion.div
              className="relative"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-1">
                <Brain className="w-4 h-4 mr-2" /> THE BILLION DOLLAR QUESTION
              </Badge>
            </motion.div>

            {/* MOONSHOT with CROSSING RINGS */}
            <div className="relative w-72 h-72 mx-auto mb-6" style={{ perspective: '1000px' }}>
              {/* Outer cosmic glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/10 via-purple-500/20 to-rose-500/10 blur-3xl" />
              
              {/* Ring 1 - Horizontal orbit (Will AI make life better?) */}
              <motion.div
                className="absolute inset-0"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateZ: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <div 
                  className="absolute inset-2 rounded-full border-2 border-emerald-500/40"
                  style={{ transform: 'rotateX(75deg)' }}
                />
                {/* Orbiting element */}
                <motion.div
                  className="absolute"
                  style={{ 
                    left: '50%', 
                    top: '10%',
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/40 cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => navigate("/aimee-analyzer")}
                  >
                    <span className="text-white text-[10px] font-bold whitespace-nowrap">
                      Make life better?
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Ring 2 - Tilted orbit (Will AI take away jobs?) */}
              <motion.div
                className="absolute inset-0"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateZ: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div 
                  className="absolute inset-6 rounded-full border-2 border-rose-500/40"
                  style={{ transform: 'rotateX(75deg) rotateY(30deg)' }}
                />
                {/* Orbiting element */}
                <motion.div
                  className="absolute"
                  style={{ 
                    left: '85%', 
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                >
                  <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-red-600 shadow-lg shadow-rose-500/40 cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => navigate("/aimee-analyzer")}
                  >
                    <span className="text-white text-[10px] font-bold whitespace-nowrap">
                      Take away jobs?
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Ring 3 - Counter tilted orbit */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              >
                <div 
                  className="absolute inset-10 rounded-full border border-dashed border-violet-500/30"
                  style={{ transform: 'rotateX(60deg) rotateY(-20deg)' }}
                />
              </motion.div>

              {/* CENTER MOON - Will AI? */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="relative w-24 h-24 rounded-full cursor-pointer"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/aimee-analyzer")}
                >
                  {/* Moon glow */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-violet-600 blur-md opacity-60" />
                  
                  {/* Moon surface */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-200 via-indigo-100 to-purple-200 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
                    {/* Moon texture */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute w-4 h-4 rounded-full bg-slate-400/50 top-3 left-4" />
                      <div className="absolute w-3 h-3 rounded-full bg-slate-400/40 top-8 right-5" />
                      <div className="absolute w-2 h-2 rounded-full bg-slate-400/30 bottom-4 left-6" />
                    </div>
                    
                    <span className="text-indigo-900/80 text-xs font-medium z-10">Will</span>
                    <span className="text-indigo-900 font-bold text-2xl z-10">AI</span>
                    <span className="text-indigo-900/60 text-[10px] z-10">...?</span>
                  </div>
                  
                  {/* Moonshot sparkle */}
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-full h-full text-yellow-300" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Stars around */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${15 + Math.random() * 70}%`,
                    top: `${15 + Math.random() * 70}%`,
                  }}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-6 text-base shadow-lg shadow-purple-500/30"
                onClick={() => navigate("/aimee-analyzer")}
                data-testid="ask-aimee-btn"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {content.cta}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* WHO ARE YOU? Section */}
        <motion.section 
          className="py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <div className="text-center mb-6">
            <h3 className="font-display text-3xl font-bold text-white">{content.whoAreYou}</h3>
          </div>

          {/* COSMIC FLYWHEEL - 5 Entry Points Rotating */}
          <div className="relative w-full max-w-md mx-auto aspect-square">
            {/* Outer cosmic glow rings */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 blur-3xl animate-pulse" />
            <div className="absolute inset-8 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-2xl" />
            
            {/* Rotating outer ring */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              {/* Orbit path */}
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-white/10" />
              
              {/* 5 Entry Points on orbit */}
              {entryPoints.map((entry, idx) => {
                const angle = (idx * 72) - 90; // 360/5 = 72 degrees apart
                const radius = 42; // % from center
                const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
                
                return (
                  <motion.div
                    key={entry.id}
                    className="absolute cursor-pointer"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedEntry(entry.id);
                      setTimeout(() => navigate(entry.path), 300);
                    }}
                    data-testid={`flywheel-${entry.id}`}
                  >
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    >
                      <div 
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${entry.color} flex flex-col items-center justify-center shadow-lg border-2 border-white/20 hover:border-white/50 transition-all`}
                      >
                        <entry.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white mb-1" />
                        <span className="text-white text-[8px] sm:text-[10px] font-bold text-center leading-tight">
                          {entry.title}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CENTER - Agent AIMEE Activation Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl border-4 border-white/30 flex flex-col items-center justify-center cursor-pointer overflow-hidden group"
                whileHover={{ scale: 1.1, boxShadow: "0 0 60px rgba(139, 92, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(139, 92, 246, 0.3)",
                    "0 0 40px rgba(139, 92, 246, 0.5)",
                    "0 0 20px rgba(139, 92, 246, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                onClick={() => navigate('/aimee-analyzer')}
                data-testid="flywheel-center-aimee"
              >
                {/* Inner glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/10 to-white/20 rounded-full" />
                
                {/* Sparkle effect */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="absolute top-3 left-1/2 w-4 h-4 text-yellow-300/80" />
                  <Sparkles className="absolute bottom-3 right-3 w-3 h-3 text-pink-300/80" />
                </motion.div>
                
                {/* Brain icon */}
                <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-white mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-white font-bold text-sm sm:text-base">AIMEE</span>
                <span className="text-white/70 text-[9px] sm:text-[10px]">Start Here</span>
              </motion.button>
            </div>

            {/* Orbital lines connecting to center */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {entryPoints.map((entry, idx) => {
                const angle = (idx * 72) - 90;
                const radius = 42;
                const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
                return (
                  <motion.line
                    key={entry.id}
                    x1="50%"
                    y1="50%"
                    x2={`${x}%`}
                    y2={`${y}%`}
                    stroke="url(#cosmicGradient)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                  />
                );
              })}
              <defs>
                <linearGradient id="cosmicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#EC4899" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.5" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Selected Entry Info */}
          {selectedEntry && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
            >
              <Badge className="bg-white/10 text-white border-white/20 px-4 py-2">
                Click to enter: {entryPoints.find(e => e.id === selectedEntry)?.title}
              </Badge>
            </motion.div>
          )}

          {/* Cosmic tagline */}
          <motion.p
            className="text-center text-white/40 text-xs mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            The wheel signifies progress • speed • future advancement of human civilization
          </motion.p>
        </motion.section>

        {/* DOERS WORLD FLYWHEEL */}
        <motion.section 
          className="py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="text-center mb-4">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-2">
              <Zap className="w-3 h-3 mr-1" /> {content.flywheel}
            </Badge>
            <h3 className="font-display text-xl font-bold text-white">{content.enterDoersWorld}</h3>
          </div>

          {/* Animated Flywheel */}
          <div className="relative w-64 h-64 mx-auto">
            {/* Outer glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-full blur-2xl" />
            
            {/* Rotating wheel with divisions */}
            <motion.div 
              className="absolute inset-0"
              style={{ transform: `rotate(${wheelRotation}deg)` }}
            >
              {DIVISIONS.map((div, idx) => {
                const angle = (idx * 30) * (Math.PI / 180);
                const radius = 100;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <motion.div
                    key={div.id}
                    className="absolute w-10 h-10 flex items-center justify-center"
                    style={{
                      left: `calc(50% + ${x}px - 20px)`,
                      top: `calc(50% + ${y}px - 20px)`,
                    }}
                    whileHover={{ scale: 1.3 }}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg"
                      style={{ backgroundColor: div.color + '40', boxShadow: `0 0 20px ${div.color}40` }}
                    >
                      {div.icon}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Center hub */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="w-28 h-28 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-white/20 flex flex-col items-center justify-center shadow-2xl"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Globe className="w-8 h-8 text-white/80 mb-1" />
                <span className="text-white font-bold text-xs">DOERS</span>
                <span className="text-white/60 text-[10px]">WORLD</span>
              </motion.div>
            </div>
          </div>

          {/* WOW - Way of Work */}
          <motion.div 
            className="text-center mt-4"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-amber-400 font-display font-bold text-lg">{content.wow}</p>
            <p className="text-white/50 text-xs">{content.tagline}</p>
          </motion.div>
        </motion.section>

        {/* Bottom CTA */}
        <motion.section 
          className="py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-4 text-center max-w-lg mx-auto">
            <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Project Doers</p>
            <p className="text-white text-sm font-medium">{content.poweredBy}</p>
            <div className="flex justify-center gap-2 mt-3 text-[10px]">
              <Badge className="bg-blue-500/20 text-blue-300 border-0">Industry 4.0</Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-0">Industry 5.0</Badge>
              <Badge className="bg-green-500/20 text-green-300 border-0">1 Billion+</Badge>
            </div>
          </div>
        </motion.section>

        {/* Inspiration Footer */}
        <motion.footer 
          className="py-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <p className="text-white/30 text-[10px]">
            Inspired by: Amazon Day One • Elon First Principles • Steve Jobs Vision
          </p>
          <p className="text-white/20 text-[10px] mt-1">
            HI AI-APP.COM | Right Doers World LLP | ESG Moonshot
          </p>
        </motion.footer>
      </main>

      {/* Scroll indicator */}
      <motion.div 
        className="fixed bottom-4 left-1/2 -translate-x-1/2 text-white/30"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </div>
  );
}
