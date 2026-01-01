import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  Globe,
  Calendar,
  MapPin,
  Play,
  Share2,
  ChevronRight,
  Sparkles,
  Users,
  Trophy,
  Star,
  Heart,
  PartyPopper,
  Zap,
  ArrowRight,
  Twitter,
  Linkedin,
  Mail,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export default function LaunchAnnouncement() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  // Dubai Launch Date: January 9, 2026
  const LAUNCH_DATE = new Date("2026-01-09T09:00:00+04:00");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = LAUNCH_DATE - now;
      
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Confetti effect
  useEffect(() => {
    const timeout = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  const shareUrl = "https://doerworld-app.preview.emergentagent.com/launch-announcement";
  const shareText = "🚀 HI AI APP launching at Dubai Global Innovation Summit 2026! Join the future of Human Potential Management. #HIAI #DubaiLaunch #FutureOfWork";

  const handleShare = (platform) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      email: `mailto:?subject=HI AI APP - Dubai Launch 2026&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
    };
    
    if (urls[platform]) {
      window.open(urls[platform], "_blank");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a1a] text-white overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: Math.random() * window.innerWidth, opacity: 1 }}
              animate={{ y: window.innerHeight + 20, opacity: 0 }}
              transition={{ duration: 3 + Math.random() * 2, delay: Math.random() * 2 }}
              className="absolute w-3 h-3 rounded-full"
              style={{ backgroundColor: ["#FFD700", "#00FF88", "#FF6B6B", "#4ECDC4", "#9B59B6"][i % 5] }}
            />
          ))}
        </div>
      )}

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[150px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">HI AI APP</span>
          </div>
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-4 py-2 animate-pulse">
            🎆 HAPPY NEW YEAR 2026!
          </Badge>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        {/* Hero Section */}
        <section className="text-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-white/10 text-amber-400 border border-amber-400/30 mb-6 px-4 py-2">
              <PartyPopper className="w-4 h-4 mr-2 inline" />
              GLOBAL LAUNCH ANNOUNCEMENT
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Happy New Year
              </span>
              <br />
              <span className="text-white">2026!</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-8">
              We're thrilled to announce the global launch of{" "}
              <span className="text-purple-400 font-bold">HI AI APP</span> at the{" "}
              <span className="text-cyan-400 font-bold">Dubai Global Innovation Summit</span>
            </p>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-white/50 text-sm mb-4 uppercase tracking-wider">Launch Countdown</p>
            <div className="flex justify-center gap-4">
              {[
                { value: countdown.days, label: "Days" },
                { value: countdown.hours, label: "Hours" },
                { value: countdown.mins, label: "Minutes" },
                { value: countdown.secs, label: "Seconds" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <motion.div
                    key={item.value}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-purple-600/30 to-cyan-600/30 border border-white/10 flex items-center justify-center backdrop-blur-sm"
                  >
                    <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                      {String(item.value).padStart(2, "0")}
                    </span>
                  </motion.div>
                  <p className="text-white/50 text-xs mt-2">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Event Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border border-white/10 backdrop-blur-lg overflow-hidden">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="bg-amber-500/20 text-amber-400 border-0 mb-4">
                    🎯 OFFICIAL LAUNCH
                  </Badge>
                  <h2 className="text-3xl font-bold mb-4">
                    Dubai Global Innovation Summit
                  </h2>
                  <p className="text-white/70 mb-6">
                    Join us as we unveil the future of Human Potential Management & Transformation. 
                    The DOERS Trinity - Human + AI + Robo Doer - goes global!
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-white/80">
                      <Calendar className="w-5 h-5 text-amber-400" />
                      <span>January 9, 2026</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <MapPin className="w-5 h-5 text-cyan-400" />
                      <span>Dubai, UAE</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <Globe className="w-5 h-5 text-purple-400" />
                      <span>Live Global Broadcast</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="aspect-video rounded-2xl bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border border-white/10 flex items-center justify-center overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 group-hover:opacity-50 transition-opacity"></div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-20 h-20 rounded-full bg-white/10 backdrop-blur flex items-center justify-center"
                    >
                      <Play className="w-10 h-10 text-white fill-white" />
                    </motion.div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white/80 text-sm">Coming Soon: Launch Video</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* What We're Launching */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            <Rocket className="w-6 h-6 inline mr-2 text-amber-400" />
            What We're Launching
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "7 Business Verticals",
                desc: "B2G, B2A, B2B, B2C, B2D, D2D, A2A - Complete career ecosystem",
                color: "from-purple-500 to-indigo-500"
              },
              {
                icon: Sparkles,
                title: "AIMEE AI Assistant",
                desc: "Your AI-powered career transformation companion",
                color: "from-cyan-500 to-teal-500"
              },
              {
                icon: Trophy,
                title: "Captain Command Centre",
                desc: "Military-grade HQ for managing the DOERS Trinity",
                color: "from-amber-500 to-orange-500"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Captain's Message */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/30">
            <CardContent className="p-8 text-center">
              <Badge className="bg-amber-500/20 text-amber-400 border-0 mb-4">
                📜 MESSAGE FROM THE CAPTAIN
              </Badge>
              <h3 className="text-2xl font-bold mb-4">
                "From Dream to Destination"
              </h3>
              <p className="text-white/80 max-w-2xl mx-auto mb-6 text-lg italic">
                "As we step into 2026, I'm filled with gratitude and excitement. HI AI APP represents our mission 
                to transform human potential - from 7G Neom City to No-Network Nagara Village. 
                This Dubai launch marks the beginning of a shared, foresighted future for all Doers worldwide."
              </p>
              <p className="text-amber-400 font-bold">
                - Captain, Right Doers World Pvt Ltd
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Share Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="text-center"
        >
          <h3 className="text-xl font-bold mb-6">
            <Share2 className="w-5 h-5 inline mr-2" />
            Share the Announcement
          </h3>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <Button
              onClick={() => handleShare("twitter")}
              className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/80"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            <Button
              onClick={() => handleShare("linkedin")}
              className="bg-[#0A66C2] hover:bg-[#0A66C2]/80"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
            <Button
              onClick={() => handleShare("email")}
              className="bg-gray-600 hover:bg-gray-600/80"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="border-white/20"
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>

          {/* CTA Buttons */}
          <div className="mt-12 flex justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-8"
              onClick={() => navigate("/mission-board")}
            >
              <Rocket className="w-5 h-5 mr-2" />
              View Mission Board
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
              onClick={() => navigate("/command-centre")}
            >
              <Zap className="w-5 h-5 mr-2" />
              Captain Command Centre
            </Button>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="mt-20 text-center text-white/40 text-sm">
          <p>Right Doers World Pvt Ltd | Global Capability Centre for Human Xperts</p>
          <p>15th Floor, World Trade Centre, Bangalore, India</p>
          <p className="mt-4">
            <Star className="w-4 h-4 inline text-amber-400" />
            {" "}WORLD EXPO 2031 BOUND{" "}
            <Star className="w-4 h-4 inline text-amber-400" />
          </p>
        </footer>
      </main>
    </div>
  );
}
