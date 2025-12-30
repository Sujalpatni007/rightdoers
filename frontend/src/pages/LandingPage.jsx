import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  MapPin, 
  Users, 
  Briefcase, 
  ArrowRight, 
  QrCode,
  Zap,
  Target,
  Trophy,
  ChevronRight
} from "lucide-react";

const DIVISIONS = [
  { name: "Technology", icon: "💻", club: "Problem Solvers", color: "bg-blue-500" },
  { name: "Health", icon: "🏥", club: "Wellness Seekers", color: "bg-green-500" },
  { name: "Education", icon: "📚", club: "Knowledge Givers", color: "bg-purple-500" },
  { name: "Finance", icon: "💰", club: "Profit Maximizers", color: "bg-amber-500" },
  { name: "Security", icon: "🛡️", club: "Power Keepers", color: "bg-red-500" },
  { name: "Legal", icon: "⚖️", club: "Power Keepers", color: "bg-slate-500" },
];

const STATS = [
  { label: "Active Jobs", value: "10K+", icon: Briefcase },
  { label: "Doers Registered", value: "50K+", icon: Users },
  { label: "Companies", value: "500+", icon: Target },
  { label: "Cities", value: "100+", icon: MapPin },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="absolute inset-0 noise-overlay" />
        
        {/* Content */}
        <div className="relative z-10 px-4 py-8 md:py-16">
          {/* Header */}
          <header className="flex items-center justify-between max-w-6xl mx-auto mb-12">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-white text-xl">Right Doers</span>
            </div>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={() => navigate("/auth")}
              data-testid="header-login-btn"
            >
              Login
            </Button>
          </header>

          {/* Hero Content */}
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="mb-4 bg-white/20 text-white border-0 px-4 py-1.5 text-sm font-medium">
              <Zap className="w-4 h-4 mr-1" /> The Future of Work is Here
            </Badge>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Find Work That Feels Like
              <span className="block text-secondary mt-2">PLAY</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto font-body">
              Right People @ Right Place. AI-powered job matching from ₹15K to ₹15L+ across 12 industries.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg"
                className="btn-secondary w-full sm:w-auto text-lg"
                onClick={() => navigate("/auth")}
                data-testid="hero-get-started-btn"
              >
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20 text-lg"
                onClick={() => navigate("/auth?role=employer")}
                data-testid="hero-hire-talent-btn"
              >
                Hire Talent
              </Button>
            </div>

            {/* QR Code Section */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 max-w-sm mx-auto border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-lg">Scan to Join</p>
                  <p className="text-white/70 text-sm">Available at shops near you</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="#F8FAFC"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 -mt-1 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat, i) => (
              <div 
                key={stat.label}
                className="bg-white rounded-xl p-6 text-center shadow-sm border hover:shadow-md transition-shadow"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="font-display font-bold text-2xl md:text-3xl text-slate-900">{stat.value}</p>
                <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divisions Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-0">12 Doers Divisions</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Your Industry, Your Future
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              From house help to software architect - we match talent at every level
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {DIVISIONS.map((div, i) => (
              <div 
                key={div.name}
                className="group bg-slate-50 hover:bg-white rounded-xl p-6 border hover:border-primary hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate("/auth")}
                data-testid={`division-${div.name.toLowerCase()}`}
              >
                <div className={`w-12 h-12 ${div.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {div.icon}
                </div>
                <h3 className="font-display font-semibold text-lg text-slate-900 mb-1">{div.name}</h3>
                <p className="text-sm text-slate-500">{div.club}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Levels Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-0">L1 → L4 Job Levels</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Every Dream Has a Starting Point
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { level: "L1", title: "Entry Level", salary: "₹15K - ₹30K", desc: "Start your journey", color: "bg-green-500" },
              { level: "L2", title: "Junior", salary: "₹30K - ₹60K", desc: "Build your skills", color: "bg-blue-500" },
              { level: "L3", title: "Mid-Level", salary: "₹60K - ₹1.5L", desc: "Grow your career", color: "bg-purple-500" },
              { level: "L4", title: "Expert", salary: "₹1.5L - ₹15L+", desc: "Lead the way", color: "bg-amber-500" },
            ].map((item, i) => (
              <div 
                key={item.level}
                className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-white font-bold mb-4`}>
                  {item.level}
                </div>
                <h3 className="font-display font-semibold text-lg text-slate-900 mb-1">{item.title}</h3>
                <p className="text-primary font-semibold mb-2">{item.salary}</p>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AIMEE Section */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Meet AIMEE
          </h2>
          <p className="text-xl text-white/80 mb-2">AI Matching & Employment Engine</p>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Your personal AI career guide. Just tell AIMEE what you're looking for, and let the magic happen.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => navigate("/auth")}
            data-testid="aimee-cta-btn"
          >
            Talk to AIMEE <ChevronRight className="ml-2" />
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <Trophy className="w-16 h-16 text-secondary mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ready to Find Your Dream Job?
          </h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            Join thousands of doers who found work that feels like play
          </p>
          <Button 
            size="lg" 
            className="btn-primary text-lg"
            onClick={() => navigate("/auth")}
            data-testid="final-cta-btn"
          >
            Start Your Journey <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-display font-bold">Right Doers World</span>
          </div>
          <p className="text-slate-400 text-sm">
            © 2025 Right Doers LLP. The Future of Work.
          </p>
        </div>
      </footer>
    </div>
  );
}
