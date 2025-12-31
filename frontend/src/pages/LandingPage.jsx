import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  ArrowRight,
  ArrowLeft,
  QrCode,
  Zap,
  Brain,
  Gamepad2,
  Briefcase,
  GraduationCap,
  Users,
  Bot,
  Target,
  Rocket,
  Heart,
  Globe,
  Star,
  Play,
  ChevronRight,
  Coins,
  Building2,
  User,
  ShoppingBag
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { FloatingAstro } from "@/components/AstroDoer";

export default function LandingPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [activePersona, setActivePersona] = useState(0);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [showAstro, setShowAstro] = useState(false);

  // Show Astro mascot after initial load
  useEffect(() => {
    const timer = setTimeout(() => setShowAstro(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 5 Wheels Animation (Olympic Rings style)
  useEffect(() => {
    const interval = setInterval(() => {
      setWheelRotation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // 3 Persona Swipe Cards - Candidate, Consumer, Corporate
  const personas = [
    {
      id: "candidate",
      title: "I'm a Doer",
      subtitle: "Candidate",
      description: "Find a Job That Feels Like Play",
      icon: "🎓",
      color: "from-blue-500 to-indigo-600",
      features: ["Agent AIMEE Analysis", "DoersID", "Learn-Earn-Live"],
      path: "/auth?role=doer",
      dcoin: "+100 D-COIN"
    },
    {
      id: "consumer",
      title: "I Need a Doer",
      subtitle: "Consumer",
      description: "Rent a Doer for Any Task",
      icon: "🛒",
      color: "from-green-500 to-emerald-600",
      features: ["Book Services", "Trusted Profiles", "Secure Payments"],
      path: "/auth?role=consumer",
      dcoin: "+50 D-COIN"
    },
    {
      id: "corporate",
      title: "We Hire Doers",
      subtitle: "Corporate",
      description: "Build Your Talent Pipeline",
      icon: "🏢",
      color: "from-amber-500 to-orange-600",
      features: ["L1-L5 Matching", "PASS Code System", "Bulk Hiring"],
      path: "/auth?role=employer",
      dcoin: "Custom Plans"
    }
  ];

  // Super App Icons - 8 Icon Grid
  const appIcons = [
    { id: "aimee", icon: "🤖", label: "Agent AIMEE", sublabel: "AI Analyzer", path: "/aimee", badge: "+100" },
    { id: "doersid", icon: "🆔", label: "DoersID", sublabel: "Who Are You?", path: "/auth?role=doer", badge: null },
    { id: "roleplay", icon: "🎮", label: "Role Play", sublabel: "Simulation", path: "/clubs", badge: "D-COIN" },
    { id: "jobs4me", icon: "💼", label: "Jobs4Me", sublabel: "L1-L5", path: "/gigs", badge: "₹" },
    { id: "worldwheel", icon: "🌍", label: "World Wheel", sublabel: "1000+ Roles", path: "/world-wheel", badge: null },
    { id: "dcoin", icon: "💎", label: "D-COIN", sublabel: "Deliver Value", path: "/ecoin", badge: null },
    { id: "clubs", icon: "🎪", label: "5 Clubs", sublabel: "5C Framework", path: "/clubs", badge: "5C" },
    { id: "siip", icon: "🏠", label: "Dream SIIP", sublabel: "Family Plan", path: "/dream-siip", badge: "₹3K" },
  ];

  const nextPersona = () => setActivePersona((prev) => (prev + 1) % personas.length);
  const prevPersona = () => setActivePersona((prev) => (prev - 1 + personas.length) % personas.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Floating Astro Mascot */}
      {showAstro && <FloatingAstro position="bottom-right" lang={language} />}

      {/* Header - HI AI-APP.COM Brand */}
      <motion.header 
        className="p-4 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <motion.div 
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white font-bold text-lg">HI</span>
          </motion.div>
          <div>
            <span className="font-display font-bold text-orange-400 text-lg">HI AI</span>
            <span className="text-white font-display">-APP</span>
            <span className="text-blue-400 font-display">.COM</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 px-3 hidden sm:flex">
            <Rocket className="w-3 h-3 mr-1" /> ESG Moonshot
          </Badge>
        </div>
      </motion.header>

      {/* Domain Story Banner */}
      <motion.div 
        className="px-4 py-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex justify-center gap-2 text-xs">
          {[
            { label: ".COM", color: "bg-blue-500/20 text-blue-300" },
            { label: "APP", color: "bg-green-500/20 text-green-300" },
            { label: "AI", color: "bg-purple-500/20 text-purple-300" },
            { label: "HI", color: "bg-orange-500/20 text-orange-300 font-bold" },
          ].map((item, idx) => (
            <motion.span 
              key={item.label}
              className={`px-2 py-1 ${item.color} rounded`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
            >
              {item.label}
            </motion.span>
          ))}
        </div>
        <p className="text-center text-white/40 text-[10px] mt-1">
          4 Generations of Tech • Millennial → Gen Z → Alpha → Beta
        </p>
      </motion.div>

      {/* The Billion Dollar Question */}
      <motion.div 
        className="px-4 py-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-4 text-center">
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Badge className="mb-2 bg-orange-500/20 text-orange-300 border-0 px-3">
              <Brain className="w-3 h-3 mr-1" /> {t('billionQuestion')}
            </Badge>
          </motion.div>
          
          <h2 className="font-display text-lg font-bold text-white mb-2">
            {t('willAI')} <span className="text-red-400">{t('replaceMe')}</span>?
            <span className="text-white/40 mx-2">{t('or')}</span>
            <span className="text-green-400">{t('empowerMe')}</span>?
          </h2>
          
          <p className="text-orange-300 text-sm">
            {t('letAimee')}
          </p>
        </div>
      </motion.div>

      {/* Persona Swipe Cards - IDFC First Style */}
      <div className="px-4 py-4">
        <p className="text-white/60 text-xs text-center mb-3 uppercase tracking-widest">{t('whoAreYou')}</p>
        
        <div className="relative">
          {/* Card with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePersona}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card className={`bg-gradient-to-br ${personas[activePersona].color} border-0 text-white overflow-hidden`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <motion.span 
                        className="text-5xl mb-2 block"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {personas[activePersona].icon}
                      </motion.span>
                      <h3 className="font-display font-bold text-2xl">{personas[activePersona].title}</h3>
                      <p className="text-white/80">{personas[activePersona].subtitle}</p>
                    </div>
                    <Badge className="bg-white/20 text-white border-0 px-3">
                      <Coins className="w-3 h-3 mr-1" /> {personas[activePersona].dcoin}
                    </Badge>
                  </div>
                  
                  <p className="text-white/90 font-medium mb-4">{personas[activePersona].description}</p>
                  
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {personas[activePersona].features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Badge variant="outline" className="border-white/30 text-white text-[10px]">
                          {feature}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      className="w-full bg-white text-slate-900 hover:bg-white/90 font-semibold"
                      onClick={() => navigate(personas[activePersona].path)}
                      data-testid={`persona-btn-${personas[activePersona].id}`}
                    >
                      Start as {personas[activePersona].subtitle}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Swipe Controls */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <motion.button 
              onClick={prevPersona}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              data-testid="prev-persona-btn"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            
            <div className="flex gap-2">
              {personas.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setActivePersona(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === activePersona ? "bg-orange-500 w-6" : "bg-white/30 w-2.5"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  data-testid={`persona-dot-${idx}`}
                />
              ))}
            </div>
            
            <motion.button 
              onClick={nextPersona}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              data-testid="next-persona-btn"
            >
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* 5 Wheels Animation - Olympic Rings Style */}
      <motion.div 
        className="px-4 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-center text-white/50 text-xs uppercase tracking-widest mb-3">The 5 Wheels Engine</p>
          
          <div className="flex justify-center items-center gap-2 mb-3">
            {[
              { color: "text-blue-400", label: t('learn') },
              { color: "text-green-400", label: t('earn') },
              { color: "text-amber-400", label: t('live') },
              { color: "text-purple-400", label: "Work" },
              { color: "text-red-400", label: "World" },
            ].map((wheel, idx) => (
              <motion.div 
                key={idx} 
                className="relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 10 + idx * 2, repeat: Infinity, ease: "linear" }}
              >
                <div className={`w-10 h-10 rounded-full border-2 ${wheel.color.replace('text-', 'border-')} flex items-center justify-center`}>
                  <motion.div 
                    className={`w-2 h-2 rounded-full ${wheel.color.replace('text-', 'bg-')}`}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: idx * 0.2 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-center gap-3 text-[10px]">
            <span className="text-blue-400">{t('learn')}</span>
            <span className="text-white/30">•</span>
            <span className="text-green-400">{t('earn')}</span>
            <span className="text-white/30">•</span>
            <span className="text-amber-400">{t('live')}</span>
            <span className="text-white/30">•</span>
            <span className="text-purple-400">Work Wheel</span>
            <span className="text-white/30">•</span>
            <span className="text-red-400">World Wheel</span>
          </div>
        </div>
      </motion.div>

      {/* 8 Super App Icons Grid */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-4 gap-3">
          {appIcons.map((item, idx) => (
            <motion.button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              data-testid={`icon-${item.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + idx * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.badge && (
                <motion.span 
                  className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {item.badge}
                </motion.span>
              )}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-1.5 shadow-lg">
                <span className="text-lg">{item.icon}</span>
              </div>
              <span className="text-white text-[10px] font-semibold text-center leading-tight">{item.label}</span>
              <span className="text-white/40 text-[8px] text-center">{item.sublabel}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* D-COIN Flywheel */}
      <motion.div 
        className="px-4 py-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <motion.span 
                className="text-2xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💎
              </motion.span>
              <div>
                <p className="text-white font-semibold text-sm">{t('dCoin')}</p>
                <p className="text-white/50 text-[10px]">Doers Delivery Coin</p>
              </div>
            </div>
            <Badge className="bg-white/10 text-white/70 border-0 text-[10px]">Energy Exchange</Badge>
          </div>
          <p className="text-amber-300 text-xs text-center italic">
            &ldquo;{t('energyHarmony')}&rdquo;
          </p>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[t('learn'), t('earn'), t('live')].map((item, idx) => (
              <motion.div 
                key={item} 
                className="text-center py-2 bg-white/5 rounded-lg"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <p className="text-white text-xs font-semibold">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* QR Code GTM */}
      <div className="px-4 py-3">
        <div className="bg-gradient-to-r from-indigo-600/80 to-purple-600/80 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
              <QrCode className="w-9 h-9 text-indigo-600" />
            </div>
            <div className="text-white flex-1">
              <p className="font-bold text-sm">Scan & Discover WHO YOU ARE</p>
              <p className="text-white/60 text-xs">HI AI-APP.COM • Every shop • Every pincode</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xl">💎</span>
                <span className="text-amber-300 text-xs font-medium">+100 D-COIN on first scan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start CTA */}
      <motion.div 
        className="px-4 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-base font-semibold flex items-center justify-center gap-2 rounded-xl shadow-lg"
            onClick={() => navigate("/auth?role=doer")}
            data-testid="start-btn"
          >
            <Play className="w-5 h-5" />
            {t('startJourney')}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
        <p className="text-center text-white/40 text-xs mt-3">
          {t('dreamDoDone')} • {t('rightPeople')}
        </p>
      </motion.div>

      {/* Footer */}
      <footer className="px-4 py-6 text-center">
        <p className="text-white/40 text-xs">
          © 2025 HI AI-APP.COM • Right Doers World LLP
        </p>
        <p className="text-white/30 text-[10px] mt-1">
          ESG • Exponential Soonicorns Group • Singularity Moonshot
        </p>
        <p className="text-white/20 text-[10px] mt-1">
          Human • AI • Robo — Collaborative System
        </p>
      </footer>
    </div>
  );
}
