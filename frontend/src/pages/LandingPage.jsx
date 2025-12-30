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
      subtitle: "Find Right Doers",
      description: "Build your dream team",
      color: "from-orange-500 to-amber-600",
      path: "/auth?role=employer",
      testId: "user-type-company"
    },
    {
      id: "government",
      icon: Landmark,
      title: "GOVERNMENT",
      subtitle: "I Want to Impact",
      description: "Population talent dashboard",
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
        <Badge className="mb-4 bg-white/10 text-white border-white/20 px-4 py-1.5">
          <Rocket className="w-4 h-4 mr-2" /> HI AI-APP.COM
        </Badge>
        
        <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
          WHO ARE YOU?
        </h1>
        
        <p className="text-white/70 text-lg mb-2 font-body">
          Right People @ Right Place
        </p>
        <p className="text-orange-400 font-semibold text-xl mb-8">
          Dream → Do → Done
        </p>
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
            <h3 className="font-display font-bold text-white text-sm mb-1">
              {type.title}
            </h3>
            <p className="text-white/60 text-xs mb-2">{type.subtitle}</p>
            <p className="text-white/40 text-xs">{type.description}</p>
            
            {/* Arrow */}
            <ArrowRight className="absolute bottom-4 right-4 w-5 h-5 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>

      {/* Stats Section */}
      <div className="px-4 py-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="font-display font-bold text-2xl text-white">12</p>
              <p className="text-white/50 text-xs">Divisions</p>
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-white">5</p>
              <p className="text-white/50 text-xs">Clubs</p>
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-white">L1-L5</p>
              <p className="text-white/50 text-xs">Levels</p>
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-orange-400">∞</p>
              <p className="text-white/50 text-xs">Dreams</p>
            </div>
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
