import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  Building2, 
  Landmark,
  ArrowRight,
  QrCode,
  Globe,
  Users,
  Target,
  Rocket,
  Zap,
  Brain,
  Gamepad2,
  Home,
  HelpCircle
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [showBillionQuestion, setShowBillionQuestion] = useState(true);

  // The 4 Core Products
  const coreProducts = [
    {
      id: "doersid",
      number: "01",
      icon: "🆔",
      title: "RIGHT DOERS",
      subtitle: "Proven Profile Types",
      description: "DoersID • Work Wheel • Human-AI-Robo",
      color: "from-blue-500 to-indigo-600",
      path: "/auth?role=doer",
      badge: "WHO ARE YOU?",
      testId: "product-doersid"
    },
    {
      id: "roleplay",
      number: "02",
      icon: "🎮",
      title: "ROLE PLAY",
      subtitle: "AI Skill Capsules",
      description: "E-COIN Gamified • Experiential Learning",
      color: "from-purple-500 to-pink-600",
      path: "/clubs",
      badge: "EARN E-COIN",
      testId: "product-roleplay"
    },
    {
      id: "jobs4me",
      number: "03",
      icon: "💼",
      title: "JOBS4ME",
      subtitle: "Skill-Salary Matching",
      description: "PASS Code • L1-L5 Matrix • Real Payments",
      color: "from-amber-500 to-orange-600",
      path: "/gigs",
      badge: "GET MATCHED",
      testId: "product-jobs4me"
    },
    {
      id: "habitat",
      number: "04",
      icon: "🏠",
      title: "HAPPY HARMONY",
      subtitle: "SIIP Family Plan",
      description: "One Family • Different Dreams • Impact Delivered",
      color: "from-green-500 to-emerald-600",
      path: "/dream-siip",
      badge: "SECURE FUTURE",
      testId: "product-habitat"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-white text-lg">HI AI</span>
            <span className="text-orange-400 font-display font-bold ml-1">-APP.COM</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <Globe className="w-3 h-3 mr-1" /> Global Launch 2025
          </Badge>
        </div>
      </header>

      {/* The Billion Dollar Question Hook */}
      {showBillionQuestion && (
        <div className="px-4 py-6">
          <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-2xl p-6 text-center">
            <Badge className="mb-3 bg-orange-500/30 text-orange-300 border-orange-500/40 px-4 py-1">
              <Brain className="w-4 h-4 mr-2" /> THE BILLION DOLLAR QUESTION
            </Badge>
            
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
              Will AI <span className="text-red-400">take away</span> my jobs?
              <br />
              <span className="text-white/60">OR</span>
              <br />
              Will AI <span className="text-green-400">make my life</span> better?
            </h2>
            
            <p className="text-orange-300 font-medium mb-4">
              Discover Your Answer → Know Your Future
            </p>
            
            <Button 
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-8"
              onClick={() => setShowBillionQuestion(false)}
            >
              <HelpCircle className="w-5 h-5 mr-2" />
              WHO AM I? Find Out Now
            </Button>
          </div>
        </div>
      )}

      {/* Hero Section - WHO ARE YOU? */}
      <div className="px-4 py-6 text-center">
        <Badge className="mb-4 bg-white/10 text-white border-white/20 px-4 py-1.5 text-sm tracking-wide">
          <Rocket className="w-4 h-4 mr-2" /> WELCOME TO RIGHT DOERS WORLD
        </Badge>
        
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
          WHO ARE <span className="text-orange-400">YOU</span>?
        </h1>
        
        <p className="text-white/80 text-lg mb-2 font-medium tracking-wide">
          Right People @ Right Place
        </p>
        <p className="text-orange-400 font-bold text-xl mb-4 tracking-wide">
          Dream → Do → Done
        </p>
        
        {/* E-COIN Incentive Hook */}
        <div className="inline-flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-full border border-amber-500/30 mb-6">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span className="text-amber-300 font-medium">Complete Assessment = Earn 100 E-COIN</span>
          <Zap className="w-5 h-5 text-yellow-400" />
        </div>

        {/* World Wheel Tagline */}
        <div className="max-w-lg mx-auto">
          <p className="text-indigo-300 text-sm font-medium tracking-wider uppercase">
            Human • AI • Robo — Collaborative System
          </p>
          <p className="text-white/50 text-xs mt-2">
            1000+ Future Ready Profile Proof • Prakruti Powered • Big 5 Assessment
          </p>
        </div>
      </div>

      {/* 4 Core Products Grid */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {coreProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => navigate(product.path)}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-left hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              data-testid={product.testId}
            >
              {/* Number Badge */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-white/50 text-xs font-bold">{product.number}</span>
              </div>

              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                <span className="text-2xl">{product.icon}</span>
              </div>
              
              {/* Badge */}
              <Badge className={`mb-2 bg-gradient-to-r ${product.color} text-white border-0 text-[10px]`}>
                {product.badge}
              </Badge>
              
              {/* Content */}
              <h3 className="font-display font-bold text-white text-sm mb-0.5 tracking-wide">
                {product.title}
              </h3>
              <p className="text-white/70 text-xs mb-1">{product.subtitle}</p>
              <p className="text-white/40 text-[10px] leading-relaxed">{product.description}</p>
              
              {/* Arrow */}
              <ArrowRight className="absolute bottom-3 right-3 w-4 h-4 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* E-COIN Flywheel Banner */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-5 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              <span className="font-display font-bold text-white">E-COIN FLYWHEEL</span>
            </div>
            <Badge className="bg-white/10 text-white border-0">
              Energy Exchange
            </Badge>
          </div>
          <p className="text-amber-300 text-sm mb-3">
            <strong>My Energy = Your Energy = Both Happy in Harmony</strong>
          </p>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-white font-bold">Learn</p>
              <p className="text-white/50">+E-COIN</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-white font-bold">Earn</p>
              <p className="text-white/50">+E-COIN</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-white font-bold">Grow</p>
              <p className="text-white/50">+E-COIN</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-white font-bold">Live</p>
              <p className="text-white/50">Harmony</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section - Work Wheel */}
      <div className="px-4 py-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 max-w-2xl mx-auto">
          <div className="text-center mb-4">
            <p className="text-white/50 text-xs uppercase tracking-widest">Work Wheel × World Wheel</p>
          </div>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="font-display font-bold text-2xl text-white">12</p>
              <p className="text-white/60 text-xs font-medium">Divisions</p>
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-white">1000+</p>
              <p className="text-white/60 text-xs font-medium">Job Roles</p>
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-white">L1-L5</p>
              <p className="text-white/60 text-xs font-medium">Levels</p>
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-orange-400">7I</p>
              <p className="text-white/60 text-xs font-medium">Framework</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <p className="text-white/40 text-xs tracking-wide">
              Individual → Industry → Institutions → India → International → Impact → Innovation
            </p>
          </div>
        </div>
      </div>

      {/* QR Code GTM Section */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
              <QrCode className="w-12 h-12 text-indigo-600" />
            </div>
            <div className="text-white flex-1">
              <p className="font-display font-bold text-lg">Scan & Discover WHO YOU ARE</p>
              <p className="text-white/70 text-sm">Available at shops across India</p>
              <p className="text-white/50 text-xs mt-1">Every shop • Every pincode • Every dream</p>
              <div className="flex items-center gap-2 mt-2">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-yellow-300 text-xs font-medium">+100 E-COIN on first scan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Assessment CTA */}
      <div className="px-4 py-6">
        <Button 
          className="w-full max-w-2xl mx-auto h-14 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-lg font-semibold flex items-center justify-center gap-2"
          onClick={() => navigate("/auth?role=doer")}
          data-testid="start-assessment-btn"
        >
          <Brain className="w-6 h-6" />
          Start Big 5 Assessment → Get DoersID
          <Zap className="w-5 h-5 text-yellow-300" />
        </Button>
        <p className="text-center text-white/40 text-xs mt-3 max-w-2xl mx-auto">
          Complete your Prakruti-powered assessment • Earn E-COIN • Unlock your potential
        </p>
      </div>

      {/* Footer */}
      <footer className="px-4 py-8 text-center">
        <p className="text-white/40 text-sm">
          © 2025 Right Doers World LLP • HI AI-APP.COM
        </p>
        <p className="text-white/30 text-xs mt-1">
          Human Potential Management & Transformation Company
        </p>
        <p className="text-white/20 text-xs mt-1">
          Powered by ISF Network • Google AI Future Fund
        </p>
      </footer>
    </div>
  );
}
