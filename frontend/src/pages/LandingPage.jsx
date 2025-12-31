import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export default function LandingPage() {
  const navigate = useNavigate();
  const [activePersona, setActivePersona] = useState(0);
  const [wheelRotation, setWheelRotation] = useState(0);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header - HI AI-APP.COM Brand */}
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
            <span className="text-white font-bold text-lg">HI</span>
          </div>
          <div>
            <span className="font-display font-bold text-orange-400 text-lg">HI AI</span>
            <span className="text-white font-display">-APP</span>
            <span className="text-blue-400 font-display">.COM</span>
          </div>
        </div>
        <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 px-3">
          <Rocket className="w-3 h-3 mr-1" /> ESG Moonshot
        </Badge>
      </header>

      {/* Domain Story Banner */}
      <div className="px-4 py-2">
        <div className="flex justify-center gap-2 text-xs">
          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">.COM</span>
          <span className="text-white/30">→</span>
          <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">APP</span>
          <span className="text-white/30">→</span>
          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">AI</span>
          <span className="text-white/30">→</span>
          <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded font-bold">HI</span>
        </div>
        <p className="text-center text-white/40 text-[10px] mt-1">
          4 Generations of Tech • Millennial → Gen Z → Alpha → Beta
        </p>
      </div>

      {/* The Billion Dollar Question */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-4 text-center">
          <Badge className="mb-2 bg-orange-500/20 text-orange-300 border-0 px-3">
            <Brain className="w-3 h-3 mr-1" /> THE QUESTION
          </Badge>
          
          <h2 className="font-display text-lg font-bold text-white mb-2">
            Will AI <span className="text-red-400">replace</span> me?
            <span className="text-white/40 mx-2">or</span>
            <span className="text-green-400">empower</span> me?
          </h2>
          
          <p className="text-orange-300 text-sm">
            Let <span className="font-bold">Agent AIMEE</span> Analyze Your Unique Talents
          </p>
        </div>
      </div>

      {/* Persona Swipe Cards - IDFC First Style */}
      <div className="px-4 py-4">
        <p className="text-white/60 text-xs text-center mb-3 uppercase tracking-widest">Who Are You?</p>
        
        <div className="relative">
          {/* Card */}
          <Card className={`bg-gradient-to-br ${personas[activePersona].color} border-0 text-white overflow-hidden`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-5xl mb-2 block">{personas[activePersona].icon}</span>
                  <h3 className="font-display font-bold text-2xl">{personas[activePersona].title}</h3>
                  <p className="text-white/80">{personas[activePersona].subtitle}</p>
                </div>
                <Badge className="bg-white/20 text-white border-0 px-3">
                  <Coins className="w-3 h-3 mr-1" /> {personas[activePersona].dcoin}
                </Badge>
              </div>
              
              <p className="text-white/90 font-medium mb-4">{personas[activePersona].description}</p>
              
              <div className="flex gap-2 mb-4">
                {personas[activePersona].features.map((feature, idx) => (
                  <Badge key={idx} variant="outline" className="border-white/30 text-white text-[10px]">
                    {feature}
                  </Badge>
                ))}
              </div>
              
              <Button 
                className="w-full bg-white text-slate-900 hover:bg-white/90 font-semibold"
                onClick={() => navigate(personas[activePersona].path)}
              >
                Start as {personas[activePersona].subtitle}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Swipe Controls */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <button 
              onClick={prevPersona}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex gap-2">
              {personas.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePersona(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === activePersona ? "bg-orange-500 w-6" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextPersona}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5 Wheels Animation - Olympic Rings Style */}
      <div className="px-4 py-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-center text-white/50 text-xs uppercase tracking-widest mb-3">The 5 Wheels Engine</p>
          
          <div className="flex justify-center items-center gap-2 mb-3">
            {[
              { color: "text-blue-400", label: "Learn" },
              { color: "text-green-400", label: "Earn" },
              { color: "text-amber-400", label: "Live" },
              { color: "text-purple-400", label: "Work" },
              { color: "text-red-400", label: "World" },
            ].map((wheel, idx) => (
              <div 
                key={idx} 
                className="relative"
                style={{ transform: `rotate(${wheelRotation + idx * 72}deg)` }}
              >
                <div className={`w-10 h-10 rounded-full border-2 ${wheel.color.replace('text-', 'border-')} flex items-center justify-center`}>
                  <div className={`w-2 h-2 rounded-full ${wheel.color.replace('text-', 'bg-')}`} />
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-3 text-[10px]">
            <span className="text-blue-400">Learn</span>
            <span className="text-white/30">•</span>
            <span className="text-green-400">Earn</span>
            <span className="text-white/30">•</span>
            <span className="text-amber-400">Live</span>
            <span className="text-white/30">•</span>
            <span className="text-purple-400">Work Wheel</span>
            <span className="text-white/30">•</span>
            <span className="text-red-400">World Wheel</span>
          </div>
        </div>
      </div>

      {/* 8 Super App Icons Grid */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-4 gap-3">
          {appIcons.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95"
              data-testid={`icon-${item.id}`}
            >
              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-1.5 shadow-lg">
                <span className="text-lg">{item.icon}</span>
              </div>
              <span className="text-white text-[10px] font-semibold text-center leading-tight">{item.label}</span>
              <span className="text-white/40 text-[8px] text-center">{item.sublabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* D-COIN Flywheel */}
      <div className="px-4 py-3">
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💎</span>
              <div>
                <p className="text-white font-semibold text-sm">D-COIN</p>
                <p className="text-white/50 text-[10px]">Doers Delivery Coin</p>
              </div>
            </div>
            <Badge className="bg-white/10 text-white/70 border-0 text-[10px]">Energy Exchange</Badge>
          </div>
          <p className="text-amber-300 text-xs text-center italic">
            "My Energy = Your Energy = Both Happy in Harmony"
          </p>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {["Learn", "Earn", "Live"].map((item) => (
              <div key={item} className="text-center py-2 bg-white/5 rounded-lg">
                <p className="text-white text-xs font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

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
      <div className="px-4 py-6">
        <Button 
          className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-base font-semibold flex items-center justify-center gap-2 rounded-xl shadow-lg"
          onClick={() => navigate("/auth?role=doer")}
          data-testid="start-btn"
        >
          <Play className="w-5 h-5" />
          Start Your Journey
          <ArrowRight className="w-5 h-5" />
        </Button>
        <p className="text-center text-white/40 text-xs mt-3">
          Dream → Do → Done • Right People @ Right Place
        </p>
      </div>

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
