import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  Sparkles, ArrowRight, Brain, Users, Handshake, Star, Zap,
  GraduationCap, IdCard, Rocket, Share2, Trophy, Search, Award, Globe
} from "lucide-react";

// 5 Entry Points
const ENTRY_POINTS = [
  { id: "pupil", title: "PUPIL", icon: GraduationCap, color: "from-blue-500 to-indigo-600", path: "/role-play" },
  { id: "people", title: "PEOPLE", icon: Users, color: "from-green-500 to-emerald-600", path: "/auth?role=doer" },
  { id: "profiles", title: "PROFILES", icon: IdCard, color: "from-pink-500 to-rose-600", path: "/dp" },
  { id: "partners", title: "PARTNERS", icon: Handshake, color: "from-purple-500 to-violet-600", path: "/auth?role=employer" },
  { id: "performers", title: "PERFORMERS", icon: Star, color: "from-amber-500 to-orange-600", path: "/auth?role=doer&type=performer" }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [selectedEntry, setSelectedEntry] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 overflow-x-hidden">
      {/* Cosmic background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">HI AI</h1>
            <p className="text-white/40 text-[10px]">APP.COM</p>
          </div>
        </div>
        <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">
          <Rocket className="w-3 h-3 mr-1" /> PRODUCT LIVE
        </Badge>
      </header>

      <main className="relative z-10 px-4 pb-24 max-w-lg mx-auto">
        
        {/* Hero Section */}
        <section className="text-center py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-3 bg-orange-500/20 text-orange-300 border-orange-500/30">
              🌍 WORLD EXPO 2031 BOUND
            </Badge>
          </motion.div>
          
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white mb-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">Doers World</span>
          </motion.h1>
          
          <motion.p
            className="text-white/60 text-sm mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            An AGENTIC AI for Dreamers • Doers • Disrupters • Deep Humans
          </motion.p>
        </section>

        {/* THE HOLY TRINITY */}
        <section className="mb-8">
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { icon: "👤", title: "Human Xperts", color: "from-blue-500/20" },
              { icon: "🤖", title: "AI Agents", color: "from-purple-500/20" },
              { icon: "🦾", title: "Robo Helpers", color: "from-pink-500/20" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`bg-gradient-to-br ${item.color} to-transparent rounded-xl p-3 text-center border border-white/10`}
              >
                <span className="text-2xl">{item.icon}</span>
                <p className="text-white/80 text-[10px] mt-1">{item.title}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-white/40 text-xs">The Right Doers Trinity • Shared Foresighted Future</p>
        </section>

        {/* DIRECT ENTRY BUTTONS */}
        <section className="space-y-3 mb-8">
          <h2 className="text-white/60 text-xs uppercase tracking-wider text-center mb-2">🎯 Quick Launch</h2>
          
          {/* Content Command Centre - GTM */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Card 
              className="bg-gradient-to-r from-purple-600/30 to-pink-600/20 border-purple-500/30 cursor-pointer hover:border-purple-400/50 transition-all"
              onClick={() => navigate('/content')}
              data-testid="content-command-btn"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/30 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-300" />
                </div>
                <div className="flex-1">
                  <p className="text-purple-300 font-bold">Content Command Centre</p>
                  <p className="text-white/50 text-xs">Multi-lingual Reels • Share Cards • GTM</p>
                </div>
                <Badge className="bg-pink-500/30 text-pink-300 border-0">
                  <Rocket className="w-3 h-3 mr-1" /> NEW
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Gemma Offline AI - Rural India */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48 }}
          >
            <Card 
              className="bg-gradient-to-r from-emerald-600/30 to-teal-600/20 border-emerald-500/30 cursor-pointer hover:border-emerald-400/50 transition-all"
              onClick={() => navigate('/gemma')}
              data-testid="gemma-offline-btn"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/30 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-emerald-300" />
                </div>
                <div className="flex-1">
                  <p className="text-emerald-300 font-bold">Gemma Offline AI</p>
                  <p className="text-white/50 text-xs">Telugu • Kannada • Rural India • No Network</p>
                </div>
                <Badge className="bg-teal-500/30 text-teal-300 border-0">
                  🇮🇳 Rural
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Junicorn Finder + ISF */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card 
              className="bg-gradient-to-r from-indigo-600/30 to-blue-600/20 border-indigo-500/30 cursor-pointer hover:border-indigo-400/50 transition-all"
              onClick={() => window.open('https://dev.junicornshub.com', '_blank')}
              data-testid="junicorn-btn"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/30 flex items-center justify-center">
                  <Search className="w-6 h-6 text-indigo-300" />
                </div>
                <div className="flex-1">
                  <p className="text-indigo-300 font-bold">Junicorn Finder</p>
                  <p className="text-white/50 text-xs">ISF Badging • Startup Discovery</p>
                </div>
                <Badge className="bg-indigo-500/30 text-indigo-300 border-0">
                  <Award className="w-3 h-3 mr-1" /> ISF
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          {/* TalentON Hackathon */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card 
              className="bg-gradient-to-r from-orange-600/30 to-amber-600/20 border-orange-500/30 cursor-pointer hover:border-orange-400/50 transition-all"
              onClick={() => navigate('/talenton')}
              data-testid="hackathon-btn"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/30 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-orange-300" />
                </div>
                <div className="flex-1">
                  <p className="text-orange-300 font-bold">TalentON Hackathon</p>
                  <p className="text-white/50 text-xs">Global Talent Competition</p>
                </div>
                <Badge className="bg-orange-500/30 text-orange-300 border-0">
                  <Zap className="w-3 h-3 mr-1" /> LIVE
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* WILL AI? Question Cards */}
        <section className="mb-8">
          <h2 className="text-white text-xl font-bold text-center mb-4">Will <span className="text-purple-400">AI</span> ...?</h2>
          
          <div className="space-y-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/aimee-analyzer?concern=jobs")}
              className="cursor-pointer"
              data-testid="question-jobs"
            >
              <Card className="bg-gradient-to-r from-rose-500/20 to-red-500/10 border-rose-500/30 hover:border-rose-400/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <span className="text-2xl">😰</span>
                  <div className="flex-1">
                    <p className="text-rose-300 font-bold">Take away my job?</p>
                    <p className="text-white/50 text-xs">I need guidance</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-rose-400" />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/aimee-analyzer?concern=growth")}
              className="cursor-pointer"
              data-testid="question-life"
            >
              <Card className="bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border-emerald-500/30 hover:border-emerald-400/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <span className="text-2xl">🚀</span>
                  <div className="flex-1">
                    <p className="text-emerald-300 font-bold">Make my life better?</p>
                    <p className="text-white/50 text-xs">I want to grow</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-emerald-400" />
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          <p className="text-center text-white/40 text-xs mt-3">👆 Pick • Agent AIMEE will guide you</p>
        </section>

        {/* COSMIC FLYWHEEL */}
        <section className="mb-8">
          <h2 className="text-white text-xl font-bold text-center mb-4">Who Are You?</h2>
          
          <div className="relative w-72 h-72 mx-auto">
            {/* Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 blur-2xl" />
            
            {/* Rotating entries */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              {ENTRY_POINTS.map((entry, idx) => {
                const angle = (idx * 72) - 90;
                const x = 50 + 40 * Math.cos((angle * Math.PI) / 180);
                const y = 50 + 40 * Math.sin((angle * Math.PI) / 180);
                
                return (
                  <motion.div
                    key={entry.id}
                    className="absolute cursor-pointer"
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => navigate(entry.path)}
                    data-testid={`flywheel-${entry.id}`}
                  >
                    <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${entry.color} flex flex-col items-center justify-center shadow-lg border border-white/20`}>
                        <entry.icon className="w-5 h-5 text-white" />
                        <span className="text-white text-[8px] font-bold">{entry.title}</span>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CENTER - AIMEE */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl border-2 border-white/30 flex flex-col items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{ boxShadow: ["0 0 20px rgba(139,92,246,0.3)", "0 0 40px rgba(139,92,246,0.5)", "0 0 20px rgba(139,92,246,0.3)"] }}
                transition={{ duration: 2, repeat: Infinity }}
                onClick={() => navigate('/aimee-analyzer')}
                data-testid="flywheel-center-aimee"
              >
                <Brain className="w-8 h-8 text-white mb-1" />
                <span className="text-white font-bold text-sm">AIMEE</span>
                <span className="text-white/70 text-[9px]">Start Here</span>
              </motion.button>
            </div>
          </div>
        </section>

        {/* VIRAL SHARE */}
        <section className="mb-8">
          <Card className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/30">
            <CardContent className="p-4 text-center">
              <h3 className="text-white font-bold mb-1">JOIN THE WAVE</h3>
              <p className="text-white/60 text-xs mb-3">Share your D.P. • DID YOU KNOW? • The Gold Rush is HERE</p>
              <Button 
                className="bg-gradient-to-r from-pink-500 to-purple-500"
                onClick={() => navigate('/dp')}
              >
                <Share2 className="w-4 h-4 mr-2" /> Get Your Talent Card
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Footer Tagline */}
        <section className="text-center">
          <p className="text-white/30 text-xs">
            🌍 Find Right Doers • Human Xperts • AI Xpert Agents • Robo Helpers
          </p>
          <p className="text-white/20 text-[10px] mt-1">
            HI AI-APP.COM • Way of Work • Soonicorn 2026
          </p>
        </section>
      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-20">
        <div className="max-w-lg mx-auto">
          <Button 
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
            onClick={() => navigate('/aimee-analyzer')}
            data-testid="main-cta"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            ASK AGENT AIMEE
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
