import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  ArrowRight,
  QrCode,
  Zap,
  Brain,
  Gamepad2,
  Briefcase,
  GraduationCap,
  Users,
  Home,
  Bot,
  Target,
  Trophy,
  Rocket,
  Heart,
  Globe,
  Star,
  Play
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  // 12 Icon Grid - Super App Style (Google Pay / IDFC First Bank)
  const appIcons = [
    { id: "doersid", icon: "🆔", label: "DoersID", sublabel: "Who Are You?", path: "/auth?role=doer", color: "bg-blue-500", badge: null },
    { id: "aimee", icon: "🤖", label: "AIMEE AI", sublabel: "Talent Analyzer", path: "/aimee", color: "bg-purple-500", badge: "+100" },
    { id: "roleplay", icon: "🎮", label: "Role Play", sublabel: "Simulation", path: "/clubs", color: "bg-pink-500", badge: "E-COIN" },
    { id: "jobs4me", icon: "💼", label: "Jobs4Me", sublabel: "L1-L5 Match", path: "/gigs", color: "bg-amber-500", badge: "₹" },
    { id: "worldwheel", icon: "🌍", label: "World Wheel", sublabel: "1000+ Roles", path: "/world-wheel", color: "bg-green-500", badge: null },
    { id: "workwheel", icon: "⚙️", label: "Work Wheel", sublabel: "Human-AI-Robo", path: "/work-wheel", color: "bg-indigo-500", badge: null },
    { id: "ecoin", icon: "⚡", label: "E-COIN", sublabel: "Earn Energy", path: "/ecoin", color: "bg-orange-500", badge: null },
    { id: "clubs", icon: "🎪", label: "5 Clubs", sublabel: "Capability", path: "/clubs", color: "bg-cyan-500", badge: "5C" },
    { id: "learn", icon: "📚", label: "Capsules", sublabel: "AI Skilling", path: "/learn", color: "bg-rose-500", badge: null },
    { id: "siip", icon: "🏠", label: "Dream SIIP", sublabel: "Family Plan", path: "/dream-siip", color: "bg-emerald-500", badge: "₹3K" },
    { id: "govt", icon: "🏛️", label: "Karnataka", sublabel: "Govt Model", path: "/karnataka", color: "bg-violet-500", badge: null },
    { id: "corporate", icon: "🏢", label: "PowerMech", sublabel: "Corporate", path: "/corporate", color: "bg-slate-500", badge: null },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-white text-lg tracking-tight">TalentON</span>
            <span className="text-orange-400 font-display font-bold">.AI</span>
          </div>
        </div>
        <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 px-3">
          <Globe className="w-3 h-3 mr-1" /> Viksit Bharat
        </Badge>
      </header>

      {/* Hero - The Billion Dollar Question */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-2xl p-5 text-center">
          <Badge className="mb-3 bg-orange-500/20 text-orange-300 border-0 px-4 py-1">
            <Brain className="w-4 h-4 mr-2" /> THE BILLION DOLLAR QUESTION
          </Badge>
          
          <h2 className="font-display text-xl md:text-2xl font-bold text-white mb-3 leading-tight">
            Will AI <span className="text-red-400">take my job</span>?
            <span className="text-white/40 mx-2">or</span>
            <span className="text-green-400">make life better</span>?
          </h2>
          
          <p className="text-orange-300 text-sm font-medium">
            Let AIMEE AI Analyze Your Unique Talents ✨
          </p>
        </div>
      </div>

      {/* Main Hero */}
      <div className="px-4 py-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Play className="w-5 h-5 text-orange-400" />
          <p className="text-orange-400 font-bold text-lg tracking-wide">
            Find a Job That Feels Like Play
          </p>
        </div>
        
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2 leading-tight tracking-tight">
          Welcome to <span className="text-blue-400">Right Doers</span> World
        </h1>
        
        <p className="text-white/70 text-sm mb-4">
          Human • AI • Robo — Collaborative System
        </p>

        {/* E-COIN Incentive */}
        <div className="inline-flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-full border border-amber-500/30">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-amber-300 text-sm font-medium">Complete AIMEE Analysis = Earn 100 E-COIN</span>
        </div>
      </div>

      {/* 12 Icon Grid - Super App Style */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
          {appIcons.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 active:scale-95"
              data-testid={`icon-${item.id}`}
            >
              {/* Badge */}
              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              
              {/* Icon */}
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-2 shadow-lg`}>
                <span className="text-xl">{item.icon}</span>
              </div>
              
              {/* Labels */}
              <span className="text-white text-xs font-semibold text-center leading-tight">{item.label}</span>
              <span className="text-white/50 text-[10px] text-center">{item.sublabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AIMEE CTA Banner */}
      <div className="px-4 py-2">
        <button
          onClick={() => navigate("/auth?role=doer")}
          className="w-full max-w-lg mx-auto block bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 hover:from-blue-500 hover:to-indigo-500 transition-all group"
          data-testid="aimee-cta"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white/70 text-xs uppercase tracking-wide">Agent AIMEE</p>
              <p className="text-white font-bold text-lg">AI Analyzer of Unique Talents</p>
              <p className="text-blue-200 text-xs">Discover WHO YOU ARE → Get DoersID</p>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="w-5 h-5 text-yellow-400 mb-1" />
              <span className="text-yellow-300 text-xs font-bold">+100</span>
            </div>
          </div>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-w-lg mx-auto">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="font-display font-bold text-xl text-white">12</p>
              <p className="text-white/50 text-[10px]">Divisions</p>
            </div>
            <div>
              <p className="font-display font-bold text-xl text-white">1000+</p>
              <p className="text-white/50 text-[10px]">Roles</p>
            </div>
            <div>
              <p className="font-display font-bold text-xl text-orange-400">L1-L5</p>
              <p className="text-white/50 text-[10px]">Levels</p>
            </div>
            <div>
              <p className="font-display font-bold text-xl text-green-400">7I</p>
              <p className="text-white/50 text-[10px]">Framework</p>
            </div>
          </div>
        </div>
      </div>

      {/* E-COIN Flywheel Mini */}
      <div className="px-4 py-2">
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold text-sm">E-COIN Flywheel</span>
            </div>
            <Badge className="bg-white/10 text-white/70 border-0 text-[10px]">Energy Exchange</Badge>
          </div>
          <p className="text-amber-300 text-xs text-center">
            My Energy = Your Energy = Both Happy in Harmony ✨
          </p>
          <div className="grid grid-cols-4 gap-1 mt-3">
            {["Learn", "Earn", "Grow", "Live"].map((item, i) => (
              <div key={item} className="text-center py-1.5 bg-white/5 rounded-lg">
                <p className="text-white text-xs font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Code GTM */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-r from-indigo-600/80 to-purple-600/80 rounded-xl p-4 max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
              <QrCode className="w-10 h-10 text-indigo-600" />
            </div>
            <div className="text-white">
              <p className="font-bold text-sm">Scan & Discover WHO YOU ARE</p>
              <p className="text-white/70 text-xs">Every shop • Every pincode</p>
              <div className="flex items-center gap-1 mt-1">
                <Zap className="w-3 h-3 text-yellow-300" />
                <span className="text-yellow-300 text-xs font-medium">+100 E-COIN on first scan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start CTA */}
      <div className="px-4 py-6">
        <Button 
          className="w-full max-w-lg mx-auto h-14 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-base font-semibold flex items-center justify-center gap-2 rounded-xl shadow-lg"
          onClick={() => navigate("/auth?role=doer")}
          data-testid="start-btn"
        >
          <Gamepad2 className="w-5 h-5" />
          Start Your Journey → It Feels Like Play!
          <ArrowRight className="w-5 h-5" />
        </Button>
        <p className="text-center text-white/40 text-xs mt-3 max-w-lg mx-auto">
          Dream → Do → Done • Right People @ Right Place
        </p>
      </div>

      {/* Footer */}
      <footer className="px-4 py-6 text-center">
        <p className="text-white/40 text-xs">
          © 2025 TalentON.AI • Right Doers World LLP
        </p>
        <p className="text-white/30 text-[10px] mt-1">
          Human Potential Management & Transformation Company
        </p>
        <p className="text-white/20 text-[10px] mt-1">
          Powered by ISF Network • Google AI Future Fund
        </p>
      </footer>
    </div>
  );
}
