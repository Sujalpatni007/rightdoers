import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  ArrowRight, 
  Rocket, 
  Award, 
  Globe, 
  Users, 
  Sparkles,
  Calendar,
  MapPin,
  Trophy
} from "lucide-react";
import { useAuth } from "@/App";

export default function JunicornLanding() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleApply = () => {
    if (user) {
      navigate("/junicorn/apply");
    } else {
      navigate("/auth?role=doer&redirect=junicorn");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
      {/* Header */}
      <header className="p-4 flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={() => navigate("/welcome")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Badge className="bg-amber-500 text-white border-0">
          🦄 JUNICORN NET
        </Badge>
      </header>

      {/* Hero */}
      <div className="px-4 py-8 text-center text-white">
        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <span className="text-5xl">🦄</span>
        </div>
        
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
          Are You a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">Natural Exceptional Talent?</span>
        </h1>
        
        <p className="text-white/70 text-lg mb-2">
          NET → NEST → Junicorn → Unicorn
        </p>
        <p className="text-white/50 text-sm max-w-md mx-auto mb-8">
          One Person Billion Dollar Company in the making
        </p>

        {/* Dubai Summit Card */}
        <Card className="bg-white/10 backdrop-blur border-white/20 text-white mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Globe className="w-8 h-8" />
              <div className="text-left">
                <p className="font-display font-bold text-lg">Global Innovation Summit</p>
                <p className="text-white/70 text-sm">Dubai 2025</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-3">
                <Calendar className="w-5 h-5 mx-auto mb-1" />
                <p className="font-bold">Jan 9-11</p>
                <p className="text-white/60 text-xs">Event Dates</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <MapPin className="w-5 h-5 mx-auto mb-1" />
                <p className="font-bold">Dubai</p>
                <p className="text-white/60 text-xs">UAE</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* What We're Looking For */}
      <div className="px-4 pb-8">
        <h2 className="font-display text-xl font-bold text-white mb-4">What Makes a Junicorn?</h2>
        
        <div className="space-y-3">
          {[
            { icon: "🧠", title: "Moonshot Mindset", desc: "Think beyond limits, aim for singularity" },
            { icon: "🔬", title: "Deep Curiosity", desc: "Relentless pursuit of knowledge" },
            { icon: "🚀", title: "Builder Spirit", desc: "Create, not just consume" },
            { icon: "🌍", title: "Impact Driven", desc: "Solve problems that matter globally" },
            { icon: "💎", title: "Natural Excellence", desc: "L5 - Natural Exceptional Talent" },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 flex items-center gap-4">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Age Groups */}
      <div className="px-4 pb-8">
        <h2 className="font-display text-xl font-bold text-white mb-4">Who Can Apply?</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 border-0 text-white">
            <CardContent className="p-4 text-center">
              <p className="text-4xl mb-2">👦👧</p>
              <p className="font-bold text-lg">Ages 8-17</p>
              <p className="text-white/70 text-sm">Young Innovators</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-600 to-pink-700 border-0 text-white">
            <CardContent className="p-4 text-center">
              <p className="text-4xl mb-2">🧑‍💼</p>
              <p className="font-bold text-lg">Ages 18-25</p>
              <p className="text-white/70 text-sm">Rising Stars</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* What You Get */}
      <div className="px-4 pb-8">
        <h2 className="font-display text-xl font-bold text-white mb-4">What You Get</h2>
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Trophy, label: "ISF Mentorship" },
              { icon: Rocket, label: "Incubation" },
              { icon: Award, label: "Funding Access" },
              { icon: Globe, label: "Global Network" },
              { icon: Sparkles, label: "AI Team Support" },
              { icon: Users, label: "Expert Guidance" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-amber-400" />
                <span className="text-white text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partners */}
      <div className="px-4 pb-8">
        <p className="text-white/50 text-center text-sm mb-4">Powered by</p>
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <p className="font-display font-bold text-white">ISF Network</p>
            <p className="text-white/50 text-xs">Global Innovation</p>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center">
            <p className="font-display font-bold text-white">Google AI</p>
            <p className="text-white/50 text-xs">Future Fund</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="p-4 pb-8">
        <Button 
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500"
          onClick={handleApply}
          data-testid="junicorn-apply-btn"
        >
          Apply for Junicorn NET <ArrowRight className="ml-2" />
        </Button>
        <p className="text-center text-white/40 text-sm mt-4">
          Limited spots • Application closes Jan 5, 2025
        </p>
      </div>
    </div>
  );
}
