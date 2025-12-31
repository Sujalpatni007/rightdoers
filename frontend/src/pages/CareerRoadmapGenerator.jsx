import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { 
  ArrowLeft, ArrowRight, GraduationCap, Building, MapPin, 
  BookOpen, Target, Briefcase, TrendingUp, Clock, Coins,
  Phone, Check, Star, Search, Filter, ChevronDown, ChevronRight,
  School, University, Award, Calendar, DollarSign, Users
} from "lucide-react";
import { toast } from "sonner";

// CAREER ROADMAP TEMPLATE (Based on Tech Entrepreneur Model)
const CAREER_ROADMAPS = {
  tech_entrepreneur: {
    title: "Tech Entrepreneur",
    titleHi: "टेक उद्यमी",
    specialization: "Computer Science + International Business",
    icon: "🚀",
    salary: {
      entry: "₹8-15 LPA",
      mid: "₹20-50 LPA",
      senior: "₹50 LPA - ₹5 Cr+",
      global: "$80K-$500K+"
    },
    phases: [
      {
        name: "FOUNDATION",
        nameHi: "नींव निर्माण",
        years: "0-2 years",
        steps: [
          { title: "Technical Expertise", desc: "B.Tech CS/IT, Programming, Cloud, AI/ML basics", icon: "💻" },
          { title: "Business Acumen", desc: "Minor in Business/MBA prep, Finance basics", icon: "📊" },
          { title: "Entrepreneurial Mindset", desc: "Hackathons, Side projects, Startup internships", icon: "🧠" },
          { title: "Global Perspective", desc: "Study abroad, Languages, International networks", icon: "🌍" }
        ]
      },
      {
        name: "VENTURE BUILDING",
        nameHi: "उद्यम निर्माण",
        years: "3-7 years",
        steps: [
          { title: "Validate Idea", desc: "Market research, MVP, Customer feedback", icon: "✅" },
          { title: "Secure Funding", desc: "Angel/VC pitch, Seed round ₹2-10 Cr", icon: "💰" },
          { title: "Build Team", desc: "Hire co-founders, Technical team, Advisors", icon: "👥" },
          { title: "Scale & Expand", desc: "Series A-B, International markets, 50+ team", icon: "📈" }
        ]
      },
      {
        name: "ECOSYSTEM LEADER",
        nameHi: "पारिस्थितिकी नेता",
        years: "8+ years",
        steps: [
          { title: "Diversify & Invest", desc: "Angel investing, Multiple ventures", icon: "🎯" },
          { title: "Mentor & Give Back", desc: "Guide next-gen entrepreneurs", icon: "🙏" },
          { title: "Industry Leadership", desc: "Board roles, Policy influence, IPO/Exit", icon: "👑" }
        ]
      }
    ],
    education: {
      undergrad: ["B.Tech CS + MBA Minor", "BITS Pilani CS+Economics", "IIT CS + Management"],
      postgrad: ["MBA (Tech Management)", "MS Computer Science", "MS International Business"],
      certifications: ["AWS/Azure Cloud", "PMP", "Y Combinator Startup School"]
    },
    hotSectors: ["AI/ML (40% CAGR)", "FinTech (25% CAGR)", "HealthTech (35% CAGR)", "EdTech (30% CAGR)"]
  }
};

// SCHOOL/COLLEGE DATABASE (Sample - Real data would come from backend)
const INSTITUTIONS = {
  schools_10th: [
    { name: "Kendriya Vidyalaya", type: "Government", fee: "₹500/month", rating: 4.2, location: "Pan India", seats: 50, sports: true, arts: true },
    { name: "DAV Public School", type: "Private", fee: "₹3,000/month", rating: 4.5, location: "Pan India", seats: 40, sports: true, arts: true },
    { name: "Delhi Public School", type: "Private", fee: "₹8,000/month", rating: 4.7, location: "Metro Cities", seats: 35, sports: true, arts: true },
    { name: "Navodaya Vidyalaya", type: "Government", fee: "Free", rating: 4.3, location: "Rural/Semi-urban", seats: 80, sports: true, arts: false },
    { name: "Army Public School", type: "Government", fee: "₹2,000/month", rating: 4.4, location: "Cantonment", seats: 30, sports: true, arts: true }
  ],
  streams_11th: [
    { name: "Science - PCM", subjects: ["Physics", "Chemistry", "Maths"], careers: ["Engineering", "Technology", "Research"], icon: "🔬" },
    { name: "Science - PCB", subjects: ["Physics", "Chemistry", "Biology"], careers: ["Medicine", "Healthcare", "Biotech"], icon: "🧬" },
    { name: "Commerce", subjects: ["Accountancy", "Economics", "Business Studies"], careers: ["CA", "Finance", "Management"], icon: "💼" },
    { name: "Humanities", subjects: ["History", "Political Science", "Economics"], careers: ["Law", "Civil Services", "Journalism"], icon: "📚" }
  ],
  colleges_engineering: [
    { name: "IIT Bombay", type: "Government", fee: "₹2.2L/year", ranking: 1, cutoff: "JEE Top 500", location: "Mumbai", seats: 1200 },
    { name: "IIT Delhi", type: "Government", fee: "₹2.2L/year", ranking: 2, cutoff: "JEE Top 800", location: "Delhi", seats: 1100 },
    { name: "BITS Pilani", type: "Private", fee: "₹5L/year", ranking: 5, cutoff: "BITSAT 350+", location: "Pilani", seats: 2000 },
    { name: "NIT Trichy", type: "Government", fee: "₹1.5L/year", ranking: 10, cutoff: "JEE Top 5000", location: "Trichy", seats: 1000 },
    { name: "VIT Vellore", type: "Private", fee: "₹3.5L/year", ranking: 15, cutoff: "VITEEE 80%", location: "Vellore", seats: 5000 }
  ],
  colleges_law: [
    { name: "NLSIU Bangalore", type: "Government", fee: "₹2.5L/year", ranking: 1, cutoff: "CLAT Top 50", location: "Bangalore", seats: 120 },
    { name: "NALSAR Hyderabad", type: "Government", fee: "₹2.3L/year", ranking: 2, cutoff: "CLAT Top 100", location: "Hyderabad", seats: 120 },
    { name: "NLU Delhi", type: "Government", fee: "₹2.5L/year", ranking: 3, cutoff: "CLAT Top 150", location: "Delhi", seats: 100 },
    { name: "WBNUJS Kolkata", type: "Government", fee: "₹2L/year", ranking: 4, cutoff: "CLAT Top 200", location: "Kolkata", seats: 100 },
    { name: "Symbiosis Law", type: "Private", fee: "₹4L/year", ranking: 10, cutoff: "SLAT 60%", location: "Pune", seats: 300 }
  ]
};

// AFFORDABILITY INDEX (Purchase Parity)
const AFFORDABILITY_TIERS = {
  budget: { label: "Budget Friendly", max: 50000, icon: "💚" },
  moderate: { label: "Moderate", max: 200000, icon: "💛" },
  premium: { label: "Premium", max: 500000, icon: "🧡" },
  elite: { label: "Elite", max: 2000000, icon: "❤️" }
};

export default function CareerRoadmapGenerator() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("roadmap");
  const [selectedRoadmap, setSelectedRoadmap] = useState("tech_entrepreneur");
  const [affordabilityFilter, setAffordabilityFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("schools_10th");

  const roadmap = CAREER_ROADMAPS[selectedRoadmap];

  const renderRoadmap = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
          <Target className="w-3 h-3 mr-1" /> FREE करियर रोडमैप
        </Badge>
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <span className="text-3xl">{roadmap.icon}</span>
          {roadmap.title}
        </h2>
        <p className="text-white/60 text-sm">{roadmap.specialization}</p>
      </div>

      {/* Salary Overview */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
        <CardContent className="p-4">
          <p className="text-green-400 text-xs uppercase tracking-wider mb-3 text-center">💰 Salary Progression</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-white/50 text-[10px]">Entry</p>
              <p className="text-green-400 font-bold text-sm">{roadmap.salary.entry}</p>
            </div>
            <div>
              <p className="text-white/50 text-[10px]">Mid</p>
              <p className="text-green-400 font-bold text-sm">{roadmap.salary.mid}</p>
            </div>
            <div>
              <p className="text-white/50 text-[10px]">Senior</p>
              <p className="text-green-400 font-bold text-sm">{roadmap.salary.senior}</p>
            </div>
            <div>
              <p className="text-white/50 text-[10px]">Global</p>
              <p className="text-green-400 font-bold text-sm">{roadmap.salary.global}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase-wise Roadmap */}
      {roadmap.phases.map((phase, phaseIdx) => (
        <Card key={phase.name} className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Badge className="bg-purple-500/30 text-purple-300 border-0">
                  Phase {phaseIdx + 1}
                </Badge>
                {phase.name}
              </span>
              <Badge className="bg-white/10 text-white/60 border-0 text-xs">
                <Clock className="w-3 h-3 mr-1" /> {phase.years}
              </Badge>
            </CardTitle>
            <p className="text-white/50 text-xs">{phase.nameHi}</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {phase.steps.map((step, stepIdx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: stepIdx * 0.1 }}
                className="flex items-start gap-3 p-2 bg-white/5 rounded-lg"
              >
                <span className="text-xl">{step.icon}</span>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{step.title}</p>
                  <p className="text-white/50 text-xs">{step.desc}</p>
                </div>
                <Check className="w-4 h-4 text-green-400 opacity-30" />
              </motion.div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Hot Sectors */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20">
        <CardContent className="p-4">
          <p className="text-orange-400 text-xs uppercase tracking-wider mb-3">🔥 Hot Sectors (2024-2027)</p>
          <div className="flex flex-wrap gap-2">
            {roadmap.hotSectors.map((sector, idx) => (
              <Badge key={idx} className="bg-orange-500/20 text-orange-300 border-0 text-xs">
                {sector}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Education Path */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            Education Pathway
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-white/50 text-xs mb-1">Undergraduate</p>
            <div className="flex flex-wrap gap-1">
              {roadmap.education.undergrad.map((edu, idx) => (
                <Badge key={idx} className="bg-blue-500/20 text-blue-300 border-0 text-[10px]">
                  {edu}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-white/50 text-xs mb-1">Postgraduate</p>
            <div className="flex flex-wrap gap-1">
              {roadmap.education.postgrad.map((edu, idx) => (
                <Badge key={idx} className="bg-purple-500/20 text-purple-300 border-0 text-[10px]">
                  {edu}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-white/50 text-xs mb-1">Certifications</p>
            <div className="flex flex-wrap gap-1">
              {roadmap.education.certifications.map((cert, idx) => (
                <Badge key={idx} className="bg-green-500/20 text-green-300 border-0 text-[10px]">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdmissionAssistance = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
          <School className="w-3 h-3 mr-1" /> प्रवेश सहायता • Admission Assistance
        </Badge>
        <h2 className="text-xl font-bold text-white mb-2">Find Your Perfect Match</h2>
        <p className="text-white/60 text-sm">School • Stream • College Selector</p>
      </div>

      {/* Category Selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { id: "schools_10th", label: "Schools (10th)", icon: School },
          { id: "streams_11th", label: "11th Stream", icon: BookOpen },
          { id: "colleges_engineering", label: "Engineering", icon: Building },
          { id: "colleges_law", label: "Law", icon: Briefcase }
        ].map((cat) => (
          <Button
            key={cat.id}
            size="sm"
            variant={selectedCategory === cat.id ? "default" : "outline"}
            className={selectedCategory === cat.id 
              ? "bg-blue-500 text-white" 
              : "border-white/20 text-white/60"
            }
            onClick={() => setSelectedCategory(cat.id)}
          >
            <cat.icon className="w-3 h-3 mr-1" /> {cat.label}
          </Button>
        ))}
      </div>

      {/* Affordability Filter */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-3">
          <p className="text-white/60 text-xs mb-2">💰 Affordability (Purchase Parity Index)</p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={affordabilityFilter === "all" ? "default" : "outline"}
              className={affordabilityFilter === "all" ? "bg-purple-500" : "border-white/20 text-white/60"}
              onClick={() => setAffordabilityFilter("all")}
            >
              All
            </Button>
            {Object.entries(AFFORDABILITY_TIERS).map(([key, tier]) => (
              <Button
                key={key}
                size="sm"
                variant={affordabilityFilter === key ? "default" : "outline"}
                className={affordabilityFilter === key ? "bg-purple-500" : "border-white/20 text-white/60"}
                onClick={() => setAffordabilityFilter(key)}
              >
                {tier.icon} {tier.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stream Selector (for 11th) */}
      {selectedCategory === "streams_11th" && (
        <div className="space-y-3">
          {INSTITUTIONS.streams_11th.map((stream, idx) => (
            <motion.div
              key={stream.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all ${
                  selectedStream === stream.name 
                    ? 'ring-2 ring-blue-500 bg-blue-500/10' 
                    : 'bg-white/5 hover:bg-white/10'
                } border-white/10`}
                onClick={() => setSelectedStream(stream.name)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{stream.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-white font-bold">{stream.name}</h3>
                      <p className="text-white/50 text-xs">{stream.subjects.join(" • ")}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {stream.careers.map((career, i) => (
                          <Badge key={i} className="bg-white/10 text-white/70 border-0 text-[10px]">
                            {career}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Institution List (Schools/Colleges) */}
      {selectedCategory !== "streams_11th" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-white/60 text-xs">
              {INSTITUTIONS[selectedCategory]?.length || 0} institutions found
            </p>
            <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
              <Phone className="w-3 h-3 mr-1" /> AI Seat Verification
            </Badge>
          </div>

          {INSTITUTIONS[selectedCategory]?.map((inst, idx) => (
            <motion.div
              key={inst.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-bold text-sm">{inst.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`border-0 text-[10px] ${
                          inst.type === "Government" 
                            ? "bg-green-500/20 text-green-400" 
                            : "bg-blue-500/20 text-blue-400"
                        }`}>
                          {inst.type}
                        </Badge>
                        <span className="text-white/50 text-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {inst.location}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span className="text-white text-sm">{inst.rating || inst.ranking}</span>
                      </div>
                      <p className="text-green-400 font-bold text-sm">{inst.fee}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-white/10 text-white/60 border-0 text-[10px]">
                        <Users className="w-3 h-3 mr-1" /> {inst.seats} seats
                      </Badge>
                      {inst.cutoff && (
                        <Badge className="bg-orange-500/20 text-orange-400 border-0 text-[10px]">
                          {inst.cutoff}
                        </Badge>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-green-500 hover:bg-green-600 text-white text-xs h-7"
                      onClick={() => toast.success(`Checking seat availability at ${inst.name}...`)}
                    >
                      <Phone className="w-3 h-3 mr-1" /> Check Seats
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Agentic AI Call Feature */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardContent className="p-4 text-center">
          <Phone className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <h3 className="text-white font-bold mb-1">🤖 Agentic AI Assistance</h3>
          <p className="text-white/60 text-sm mb-3">
            Our AI agent can call institutions to verify seat availability in real-time
          </p>
          <Button 
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            onClick={() => toast.success("AI Agent activated! Will call and confirm seats.")}
          >
            <Phone className="w-4 h-4 mr-2" /> Activate AI Seat Verification
          </Button>
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
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-white font-bold">करियर रोडमैप</h1>
            <p className="text-white/50 text-xs">FREE Skilling • Powered by DOERS-WORLD</p>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
            FREE
          </Badge>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex justify-center gap-2 p-4 bg-slate-900/50">
        {[
          { id: "roadmap", label: "ROADMAP", icon: "🗺️" },
          { id: "admission", label: "ADMISSION", icon: "🎓" }
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
            {activeTab === "roadmap" && renderRoadmap()}
            {activeTab === "admission" && renderAdmissionAssistance()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
