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
  Rocket
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  const userTypes = [
    {
      id: "talent",
      icon: GraduationCap,
      title: "I'M A TALENT",
      subtitle: "Test Your Natural Ability",
      description: "Discover your dream career path",
      color: "from-blue-500 to-indigo-600",
      path: "/auth?role=doer",
      testId: "user-type-talent"
    },
    {
      id: "consumer",
      icon: Briefcase,
      title: "I NEED SERVICE",
      subtitle: "Get Work Done",
      description: "Find verified doers at your pincode",
      color: "from-green-500 to-emerald-600",
      path: "/services",
      testId: "user-type-consumer"
    },
    {
      id: "company",
      icon: Building2,
      title: "I'M HIRING",
      subtitle: "Talent Pipeline Builder",
      description: "Build your Human-AI-Robo team",
      color: "from-orange-500 to-amber-600",
      path: "/corporate",
      testId: "user-type-company"
    },
    {
      id: "government",
      icon: Landmark,
      title: "GOVERNMENT",
      subtitle: "Talent Pipeline Programs",
      description: "Transform your state's workforce",
      color: "from-purple-500 to-violet-600",
      path: "/auth?role=admin",
      testId: "user-type-government"
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
            <span className="font-display font-bold text-white text-lg">Right Doers</span>
            <span className="text-orange-400 font-display font-bold ml-1">World</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <Globe className="w-3 h-3 mr-1" /> Global Launch
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <div className="px-4 py-8 text-center">
        <Badge className="mb-4 bg-white/10 text-white border-white/20 px-4 py-1.5 text-sm tracking-wide">
          <Rocket className="w-4 h-4 mr-2" /> HI AI-APP.COM
        </Badge>
        
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
          WHO ARE YOU?
        </h1>
        
        <p className="text-white/80 text-lg mb-2 font-medium tracking-wide">
          Right People @ Right Place
        </p>
        <p className="text-orange-400 font-bold text-xl mb-4 tracking-wide">
          Dream → Do → Done
        </p>
        
        {/* World Wheel Tagline */}
        <div className="max-w-lg mx-auto">
          <p className="text-indigo-300 text-sm font-medium tracking-wider uppercase">
            Human • AI • Robo — Collaborative System
          </p>
          <p className="text-white/50 text-xs mt-2">
            1000+ Future Ready Profile Proof • Prakruti Powered
          </p>
        </div>
      </div>

      {/* User Type Cards */}
      <div className="px-4 pb-8 grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        {userTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => navigate(type.path)}
            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-left hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            data-testid={type.testId}
          >
            {/* Icon */}
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
              <type.icon className="w-7 h-7 text-white" />
            </div>
            
            {/* Content */}
            <h3 className="font-display font-bold text-white text-base mb-1 tracking-wide">
              {type.title}
            </h3>
            <p className="text-white/70 text-sm mb-2 font-medium">{type.subtitle}</p>
            <p className="text-white/50 text-xs leading-relaxed">{type.description}</p>
            
            {/* Arrow */}
            <ArrowRight className="absolute bottom-4 right-4 w-5 h-5 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>

      {/* Stats Section - World & Work Wheel */}
      <div className="px-4 py-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto">
          <div className="text-center mb-4">
            <p className="text-white/50 text-xs uppercase tracking-widest">World Wheel × Work Wheel</p>
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

      {/* QR Code Section */}
      <div className="px-4 py-6">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
              <QrCode className="w-12 h-12 text-indigo-600" />
            </div>
            <div className="text-white">
              <p className="font-display font-bold text-lg">Scan to Join</p>
              <p className="text-white/70 text-sm">Available at shops across India</p>
              <p className="text-white/50 text-xs mt-1">Every shop, Every pincode</p>
            </div>
          </div>
        </div>
      </div>

      {/* Junicorn Section */}
      <div className="px-4 py-6">
        <button
          onClick={() => navigate("/junicorn")}
          className="w-full max-w-2xl mx-auto block bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-left hover:from-amber-400 hover:to-orange-500 transition-all group"
          data-testid="junicorn-btn"
        >
          <div className="flex items-center justify-between">
            <div>
              <Badge className="bg-white/20 text-white border-0 mb-2">
                🦄 JUNICORN NET
              </Badge>
              <h3 className="font-display font-bold text-white text-xl">
                Are You a Natural Exceptional Talent?
              </h3>
              <p className="text-white/80 text-sm mt-1">
                Join ISF Global Innovation Summit • Dubai 2025
              </p>
            </div>
            <ArrowRight className="w-8 h-8 text-white/70 group-hover:translate-x-2 transition-transform" />
          </div>
        </button>
      </div>

      {/* Quick Access Features */}
      <div className="px-4 pb-6">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-3">
          <button
            onClick={() => navigate("/world-wheel")}
            className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all"
          >
            <span className="text-2xl block mb-2">🌍</span>
            <p className="text-white text-xs font-medium">World Wheel</p>
            <p className="text-white/50 text-[10px]">1000+ Roles</p>
          </button>
          <button
            onClick={() => navigate("/work-wheel")}
            className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all"
          >
            <span className="text-2xl block mb-2">🤖</span>
            <p className="text-white text-xs font-medium">Work Wheel</p>
            <p className="text-white/50 text-[10px]">Human-AI-Robo</p>
          </button>
          <button
            onClick={() => navigate("/agents")}
            className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all"
          >
            <span className="text-2xl block mb-2">🧠</span>
            <p className="text-white text-xs font-medium">AI Agents</p>
            <p className="text-white/50 text-[10px]">TalentON.AI</p>
          </button>
        </div>
      </div>

      {/* Government Program Banner */}
      <div className="px-4 pb-6">
        <button
          onClick={() => navigate("/karnataka-model")}
          className="w-full max-w-2xl mx-auto block bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 rounded-2xl p-4 text-left hover:bg-purple-600/30 transition-all"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">🏛️</span>
            <div className="flex-1">
              <p className="text-purple-300 text-xs uppercase tracking-wide">Government Program</p>
              <p className="text-white font-semibold">Karnataka Talent Pipeline</p>
              <p className="text-white/50 text-xs">₹9,000 Cr • 500K+ Jobs Target</p>
            </div>
            <ArrowRight className="w-5 h-5 text-white/50" />
          </div>
        </button>
      </div>

      {/* Footer */}
      <footer className="px-4 py-8 text-center">
        <p className="text-white/40 text-sm">
          © 2025 Right Doers World LLP
        </p>
        <p className="text-white/30 text-xs mt-1">
          Powered by ISF Network • Google AI Future Fund
        </p>
      </footer>
    </div>
  );
}
