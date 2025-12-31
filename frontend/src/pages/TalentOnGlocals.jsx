import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { 
  ArrowLeft, ArrowRight, Globe, Users, Building, MapPin,
  GraduationCap, Briefcase, Target, Zap, Star, CheckCircle,
  Play, Calendar, Video, Phone, Send, TrendingUp, Award,
  Clock, ChevronRight, Sparkles, Brain, Rocket
} from "lucide-react";
import { toast } from "sonner";

// CAMPUS HUBS - Captain's Network
const CAMPUS_HUBS = [
  { 
    name: "Dayananda Sagar University", 
    location: "Bengaluru, India", 
    flag: "🇮🇳",
    type: "Tech + Engineering Hub",
    status: "Active Partner",
    event: "India-Japan Conclave Host"
  },
  { 
    name: "O.P. Jindal Global University", 
    location: "Sonipat, India", 
    flag: "🇮🇳",
    type: "Policy + Legal Hub",
    status: "Active Partner",
    event: "Conclave Organizer"
  },
  { 
    name: "The University of Tokyo", 
    location: "Tokyo, Japan", 
    flag: "🇯🇵",
    type: "Student Exchange Hub",
    status: "Partnership",
    event: "India-Japan Bridge"
  },
  { 
    name: "Dubai American University", 
    location: "Dubai, UAE", 
    flag: "🇦🇪",
    type: "Global Convergence Hub",
    status: "ISF Partner",
    event: "Dubai Summit Jan 2026"
  },
  { 
    name: "Jain University", 
    location: "Bengaluru, India", 
    flag: "🇮🇳",
    type: "Business + Arts Hub",
    status: "Upcoming",
    event: "Campus Drive Feb 2026"
  }
];

// TALENT PIPELINE STAGES
const PIPELINE_STAGES = [
  { 
    stage: 1, 
    name: "APPLY", 
    nameHi: "आवेदन",
    desc: "Global Online Application",
    icon: Send,
    color: "#3B82F6",
    count: "10,000+",
    time: "5 mins"
  },
  { 
    stage: 2, 
    name: "PRAKRUTI", 
    nameHi: "प्रकृति",
    desc: "Persona Assessment",
    icon: Brain,
    color: "#8B5CF6",
    count: "7,500+",
    time: "15 mins"
  },
  { 
    stage: 3, 
    name: "AI INTERVIEW", 
    nameHi: "AI साक्षात्कार",
    desc: "Agentic AIMEE Interview",
    icon: Video,
    color: "#EC4899",
    count: "5,000+",
    time: "20 mins"
  },
  { 
    stage: 4, 
    name: "EXPERT REVIEW", 
    nameHi: "विशेषज्ञ समीक्षा",
    desc: "Human Expert Panel",
    icon: Users,
    color: "#F59E0B",
    count: "2,000+",
    time: "30 mins"
  },
  { 
    stage: 5, 
    name: "CAMPUS", 
    nameHi: "कैंपस",
    desc: "Physical Assessment",
    icon: Building,
    color: "#10B981",
    count: "500+",
    time: "1 day"
  },
  { 
    stage: 6, 
    name: "OFFER", 
    nameHi: "प्रस्ताव",
    desc: "Placement Offer",
    icon: Award,
    color: "#EF4444",
    count: "200+",
    time: "Instant"
  }
];

// GTM DIFFERENTIATORS vs Competitors
const GTM_DIFFERENTIATORS = {
  vs_myanatomy: {
    competitor: "MyAnatomy",
    their_weakness: "No community, B2B only, Enterprise pricing",
    our_strength: "PRAKRUTI Persona + D-COIN gamification + FREE tier",
    tagline: "Not just assessment, TRANSFORMATION"
  },
  vs_mercor: {
    competitor: "Mercor",
    their_weakness: "US-focused, Tech roles only, No cultural fit",
    our_strength: "GLOCAL (India→Global), 12 Divisions, Indic identity",
    tagline: "Built for Bharat, Ready for World"
  },
  vs_unstop: {
    competitor: "Unstop",
    their_weakness: "Competition-based, No deep profiling, No AI interviews",
    our_strength: "Full NEST pipeline, Agentic AIMEE, Campus-to-Career",
    tagline: "Not competitions, CAREER JOURNEYS"
  }
};

// 12 DIVISIONS FOR JOB ROLES
const JOB_DIVISIONS = [
  { name: "Technology", icon: "💻", roles: ["Software Engineer", "AI/ML Engineer", "Data Scientist"] },
  { name: "Policy", icon: "🏛️", roles: ["Policy Analyst", "Government Relations", "Public Affairs"] },
  { name: "Legal", icon: "⚖️", roles: ["Corporate Lawyer", "Legal Counsel", "Compliance"] },
  { name: "Finance", icon: "💰", roles: ["Investment Analyst", "CA", "Financial Planner"] },
  { name: "Health", icon: "🏥", roles: ["Healthcare Manager", "Medical Tech", "Wellness Coach"] },
  { name: "Education", icon: "📚", roles: ["EdTech Designer", "Curriculum Developer", "Trainer"] },
  { name: "Science", icon: "🔬", roles: ["Research Scientist", "Lab Manager", "Biotech"] },
  { name: "Security", icon: "🛡️", roles: ["Cybersecurity", "Risk Analyst", "Defence Tech"] },
  { name: "Sports", icon: "⚽", roles: ["Sports Manager", "Fitness Tech", "Athletes"] },
  { name: "Art", icon: "🎨", roles: ["Creative Director", "UX Designer", "Content Creator"] },
  { name: "Food", icon: "🍽️", roles: ["F&B Manager", "Nutritionist", "AgriTech"] },
  { name: "Hospitality", icon: "🏨", roles: ["Hotel Manager", "Tourism", "Event Management"] }
];

export default function TalentOnGlocals() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("apply");
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", division: "", experience: ""
  });
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.division) {
      toast.error("Please fill all required fields");
      return;
    }
    setApplicationSubmitted(true);
    toast.success("🎉 Application Submitted! PRAKRUTI Assessment unlocked!");
  };

  const renderApplyForm = () => (
    <div className="space-y-6">
      {/* Hero Hook */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-4"
        >
          <span className="text-6xl">🚀</span>
        </motion.div>
        <Badge className="mb-4 bg-gradient-to-r from-orange-500/20 via-white/10 to-green-500/20 text-white border-orange-500/30">
          <Globe className="w-3 h-3 mr-1" /> TALENTON.AI GLOCALS
        </Badge>
        <h1 className="text-3xl font-bold text-white mb-2">
          R U READY FOR<br/>
          <span className="bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
            FUTURE OF WORK?
          </span>
        </h1>
        <p className="text-white/60 text-sm">AI & The Future of Jobs • India-Japan Conclave Speaker</p>
      </div>

      {/* Why DOERS vs Competitors */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardContent className="p-4">
          <p className="text-purple-400 text-xs uppercase tracking-wider mb-3 text-center">
            🏆 WHY DOERS-WORLD?
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-white/5 rounded-lg">
              <p className="text-white font-bold text-sm">vs MyAnatomy</p>
              <p className="text-green-400 text-[10px]">FREE + Gamified</p>
            </div>
            <div className="p-2 bg-white/5 rounded-lg">
              <p className="text-white font-bold text-sm">vs Mercor</p>
              <p className="text-green-400 text-[10px]">GLOCAL + 12 Divisions</p>
            </div>
            <div className="p-2 bg-white/5 rounded-lg">
              <p className="text-white font-bold text-sm">vs Unstop</p>
              <p className="text-green-400 text-[10px]">AI Interview + Campus</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {applicationSubmitted ? (
        /* Post-Submission: PRAKRUTI Unlock */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Application Received!</h2>
              <p className="text-white/70 mb-4">Welcome to the DOERS-WORLD talent pipeline</p>
              
              <div className="bg-white/10 rounded-xl p-4 mb-4">
                <p className="text-purple-400 text-sm font-bold mb-2">🧬 Next Step: PRAKRUTI Assessment</p>
                <p className="text-white/60 text-xs">Discover your persona type and unlock AI Interview</p>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                onClick={() => navigate("/prakruti")}
              >
                <Brain className="w-4 h-4 mr-2" /> Start PRAKRUTI Assessment
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        /* Application Form */
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-400" />
              Global Application • आवेदन पत्र
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-white/60 text-xs">Full Name *</label>
              <input
                type="text"
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white mt-1"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-white/60 text-xs">Email *</label>
              <input
                type="email"
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white mt-1"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-white/60 text-xs">Phone (WhatsApp)</label>
              <input
                type="tel"
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white mt-1"
                placeholder="+91 XXXXX XXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-white/60 text-xs">Preferred Division *</label>
              <select
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white mt-1"
                value={formData.division}
                onChange={(e) => setFormData({...formData, division: e.target.value})}
              >
                <option value="" className="bg-slate-900">Select Division</option>
                {JOB_DIVISIONS.map((div) => (
                  <option key={div.name} value={div.name} className="bg-slate-900">
                    {div.icon} {div.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-white/60 text-xs">Experience Level</label>
              <select
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white mt-1"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
              >
                <option value="" className="bg-slate-900">Select Level</option>
                <option value="student" className="bg-slate-900">🎓 Student / Fresher</option>
                <option value="junior" className="bg-slate-900">💼 0-2 Years</option>
                <option value="mid" className="bg-slate-900">📈 3-5 Years</option>
                <option value="senior" className="bg-slate-900">⭐ 5+ Years</option>
                <option value="expert" className="bg-slate-900">👑 10+ Years (Expert)</option>
              </select>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-orange-500 via-white to-green-500 text-black font-bold"
              onClick={handleSubmit}
            >
              <Rocket className="w-4 h-4 mr-2" /> APPLY NOW • अभी आवेदन करें
            </Button>
            
            <p className="text-white/40 text-[10px] text-center">
              By applying, you join the DOERS-WORLD talent ecosystem
            </p>
          </CardContent>
        </Card>
      )}

      {/* 12 Divisions Quick View */}
      <div>
        <p className="text-white/60 text-xs uppercase tracking-wider mb-3 text-center">
          12 DOER DIVISIONS • Job Roles
        </p>
        <div className="grid grid-cols-4 gap-2">
          {JOB_DIVISIONS.map((div) => (
            <div 
              key={div.name}
              className="bg-white/5 rounded-lg p-2 text-center hover:bg-white/10 transition-all cursor-pointer"
              onClick={() => setFormData({...formData, division: div.name})}
            >
              <span className="text-xl">{div.icon}</span>
              <p className="text-white/70 text-[10px]">{div.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPipeline = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
          <TrendingUp className="w-3 h-3 mr-1" /> TALENT PIPELINE
        </Badge>
        <h2 className="text-xl font-bold text-white mb-2">6-Stage Selection Process</h2>
        <p className="text-white/60 text-sm">From Application to Offer • Global Standards</p>
      </div>

      {/* Pipeline Visualization */}
      <div className="space-y-3">
        {PIPELINE_STAGES.map((stage, idx) => (
          <motion.div
            key={stage.stage}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: stage.color + '30' }}
                  >
                    <stage.icon className="w-6 h-6" style={{ color: stage.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-white/10 text-white/60 border-0 text-[10px]">
                        Stage {stage.stage}
                      </Badge>
                      <h3 className="text-white font-bold">{stage.name}</h3>
                    </div>
                    <p className="text-white/50 text-xs">{stage.nameHi} • {stage.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{stage.count}</p>
                    <p className="text-white/40 text-[10px]">{stage.time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Conversion Funnel */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <p className="text-blue-400 text-xs uppercase tracking-wider mb-3 text-center">
            📊 Conversion Funnel
          </p>
          <div className="flex items-center justify-between text-center">
            <div>
              <p className="text-2xl font-bold text-white">10K</p>
              <p className="text-white/40 text-[10px]">Apply</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/30" />
            <div>
              <p className="text-2xl font-bold text-white">5K</p>
              <p className="text-white/40 text-[10px]">AI Interview</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/30" />
            <div>
              <p className="text-2xl font-bold text-white">500</p>
              <p className="text-white/40 text-[10px]">Campus</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/30" />
            <div>
              <p className="text-2xl font-bold text-green-400">200</p>
              <p className="text-white/40 text-[10px]">OFFER</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCampusHubs = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Badge className="mb-4 bg-orange-500/20 text-orange-300 border-orange-500/30">
          <Building className="w-3 h-3 mr-1" /> CAMPUS HUBS
        </Badge>
        <h2 className="text-xl font-bold text-white mb-2">Global Campus Network</h2>
        <p className="text-white/60 text-sm">India-Japan-UAE • Physical Assessment Centers</p>
      </div>

      {/* India-Japan Conclave Banner */}
      <Card className="bg-gradient-to-r from-blue-900/50 to-red-900/30 border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🇮🇳🤝🇯🇵</div>
            <div>
              <h3 className="text-white font-bold text-sm">India-Japan Higher Education Conclave</h3>
              <p className="text-white/60 text-xs">"AI & The Future of Jobs" • Bengaluru</p>
              <Badge className="mt-1 bg-green-500/20 text-green-400 border-0 text-[10px]">
                <Star className="w-3 h-3 mr-1" /> Captain was Speaker
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campus Hub List */}
      <div className="space-y-3">
        {CAMPUS_HUBS.map((hub, idx) => (
          <motion.div
            key={hub.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{hub.flag}</span>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-sm">{hub.name}</h3>
                    <p className="text-white/50 text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {hub.location}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-purple-500/20 text-purple-300 border-0 text-[10px]">
                        {hub.type}
                      </Badge>
                      <Badge className="bg-green-500/20 text-green-300 border-0 text-[10px]">
                        {hub.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* WTC Bangalore */}
      <Card className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/30">
        <CardContent className="p-4 text-center">
          <Building className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <h3 className="text-white font-bold">DOERS-WORLD HQ</h3>
          <p className="text-white/60 text-sm">World Trade Centre, 15th Floor</p>
          <p className="text-white/40 text-xs">Bengaluru, India</p>
          <Badge className="mt-2 bg-amber-500/30 text-amber-300 border-0">
            <Calendar className="w-3 h-3 mr-1" /> Campus Drive: February 2026
          </Badge>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => navigate("/welcome")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-white font-bold">TALENTON.AI</h1>
            <p className="text-white/50 text-xs">GLOCALS • भारत से विश्व तक</p>
          </div>
          <Badge className="bg-gradient-to-r from-orange-500/30 to-green-500/30 text-white border-0 text-xs">
            🇮🇳 HIRING
          </Badge>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex justify-center gap-2 p-4 bg-slate-900/50">
        {[
          { id: "apply", label: "APPLY", icon: "📝" },
          { id: "pipeline", label: "PIPELINE", icon: "📊" },
          { id: "campus", label: "CAMPUS", icon: "🏛️" }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            size="sm"
            className={activeTab === tab.id 
              ? "bg-purple-500 text-white" 
              : "border-white/20 text-white/60"
            }
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="mr-1">{tab.icon}</span> {tab.label}
          </Button>
        ))}
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {activeTab === "apply" && renderApplyForm()}
            {activeTab === "pipeline" && renderPipeline()}
            {activeTab === "campus" && renderCampusHubs()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
