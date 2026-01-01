import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { 
  ArrowLeft, ArrowRight, Building, MapPin, Users, Target,
  TrendingUp, Award, Clock, CheckCircle, AlertTriangle, XCircle,
  Globe, Star, Briefcase, Code, DollarSign, BarChart3, Zap,
  Send, Play, Calendar, Phone, Eye, ChevronRight, Crown,
  Network, Megaphone, MessageSquare, FileText, Coins, Brain,
  Lightbulb, RefreshCw, Mail, ExternalLink
} from "lucide-react";
import { toast } from "sonner";

// NEIL PATEL - MARKETING STRATEGIST REFERENCE
const NEIL_PATEL_INSIGHTS = {
  name: "Neil Patel",
  title: "Marketing Strategist Reference",
  framework: "Search Everywhere Optimization (G.E.O)",
  keyInsights: [
    "73% of searches happen OUTSIDE Google",
    "Visibility ≠ Success → VALIDATION = Success",
    "AI doesn't scroll, it SUMMARIZES who gets mentioned",
    "Strategic presence beats omni-presence"
  ],
  riceFramework: {
    R: "Reach - How many people search on that platform daily?",
    I: "Impact - How much business impact could this have?",
    C: "Confidence - How confident are you that you can succeed?",
    E: "Ease - How easy is it for you to execute?"
  },
  source: "youtube.com/watch?v=39o0uYPo4jU"
};

// 5C FRAMEWORK - CAPTAIN'S DECISION MAKING
const FIVE_C_FRAMEWORK = [
  {
    id: "connections",
    name: "MY CONNECTIONS",
    icon: Network,
    color: "#3B82F6",
    tagline: "Network is Net Worth",
    metrics: [
      { label: "Active Partnerships", value: "47", trend: "+12%" },
      { label: "Investor Pipeline", value: "23", trend: "+8%" },
      { label: "Mentor Network", value: "15", trend: "+3%" }
    ],
    actions: ["View Network Map", "Add Connection", "Schedule Meeting"]
  },
  {
    id: "campaigns",
    name: "MY CAMPAIGNS",
    icon: Megaphone,
    color: "#EF4444",
    tagline: "Hit the RIGHT message at the RIGHT time",
    metrics: [
      { label: "Active Campaigns", value: "8", trend: "+2" },
      { label: "Reach (This Week)", value: "125K", trend: "+45%" },
      { label: "Conversion Rate", value: "4.2%", trend: "+0.8%" }
    ],
    actions: ["D.P. College Campaign", "Dubai Summit", "TalentON Launch"]
  },
  {
    id: "communications",
    name: "MY COMMUNICATIONS",
    icon: MessageSquare,
    color: "#22C55E",
    tagline: "Decision-Making Behavior-Based Messaging",
    metrics: [
      { label: "Messages Sent", value: "342", trend: "+15%" },
      { label: "Response Rate", value: "67%", trend: "+5%" },
      { label: "Avg Response Time", value: "2.4h", trend: "-0.5h" }
    ],
    actions: ["WhatsApp Broadcast", "Email Sequence", "LinkedIn Outreach"]
  },
  {
    id: "content",
    name: "MY CONTENT",
    icon: FileText,
    color: "#8B5CF6",
    tagline: "Platform-Specific Strategy",
    metrics: [
      { label: "Content Pieces", value: "156", trend: "+24" },
      { label: "Engagement Rate", value: "8.7%", trend: "+1.2%" },
      { label: "AI Citations", value: "12", trend: "+4" }
    ],
    actions: ["Create TikTok", "Write LinkedIn Post", "Record Podcast"]
  },
  {
    id: "currency",
    name: "MY CURRENCY",
    icon: Coins,
    color: "#F59E0B",
    tagline: "D-COIN Economy Metrics",
    metrics: [
      { label: "D-COIN Circulation", value: "50K", trend: "+20%" },
      { label: "MRR", value: "$12.5K", trend: "+18%" },
      { label: "LTV/CAC Ratio", value: "4.2x", trend: "+0.5x" }
    ],
    actions: ["View Treasury", "Issue Rewards", "Check Transactions"]
  }
];

// FEEDBACK-FIX-FAX CYCLE
const FFF_CYCLE = {
  feedback: {
    title: "FEEDBACK",
    desc: "Context-Based Insights",
    items: ["User Analytics", "Campaign Performance", "Market Signals"]
  },
  fix: {
    title: "FIX",
    desc: "Case Study Fed Actions",
    items: ["A/B Test Results", "Competitor Analysis", "Best Practices"]
  },
  fax: {
    title: "FAX TO FOUNDER",
    desc: "Decision Brief",
    items: ["Executive Summary", "Recommendations", "Action Items"]
  }
};

// WTC BANGALORE FACTS
const WTC_FACTS = {
  name: "World Trade Centre Bengaluru",
  address: "Brigade Gateway, Malleswaram West",
  floor: "15th Floor - RIGHT DOERS GCC",
  height: "128 meters (420 ft)",
  floors: "30 Floors + 2 Basements",
  opened: "2010",
  developer: "Brigade Group",
  network: "Part of 92 WTC Network Globally",
  distinction: "First Integrated Campus of India",
  features: [
    "Triple-height Atrium Lobby",
    "Helipad on Rooftop",
    "Observation Deck",
    "500m from Metro Station",
    "Skywalk to Sheraton Hotel",
    "Adjacent to Orion Mall"
  ],
  campus: [
    "Orion Mall (Shopping)",
    "Sheraton Grand Hotel",
    "Manipal Hospital",
    "Brigade School",
    "Residential Apartments",
    "Multi-level Parking"
  ],
  image: "https://images.unsplash.com/photo-1720954006045-6b801f7f919e?w=800"
};

// PRIORITY PROJECT PIPELINE (From Founder's Office)
const PROJECT_PIPELINE = [
  {
    id: "P001",
    name: "Dubai Summit Launch",
    priority: "P0 - CRITICAL",
    deadline: "Jan 9, 2026",
    status: "in_progress",
    owner: "Founder",
    division: "All",
    progress: 85,
    color: "#EF4444"
  },
  {
    id: "P002",
    name: "Abu Dhabi Royal Proposal",
    priority: "P0 - CRITICAL",
    deadline: "Jan 15, 2026",
    status: "in_progress",
    owner: "Founder",
    division: "Policy",
    progress: 60,
    color: "#EF4444"
  },
  {
    id: "P003",
    name: "ISF JUNICORNS Integration",
    priority: "P1 - HIGH",
    deadline: "Jan 30, 2026",
    status: "pending",
    owner: "Tech Lead",
    division: "Technology",
    progress: 40,
    color: "#F59E0B"
  },
  {
    id: "P004",
    name: "Campus Drive - WTC Bangalore",
    priority: "P1 - HIGH",
    deadline: "Feb 15, 2026",
    status: "planning",
    owner: "HR Lead",
    division: "All",
    progress: 25,
    color: "#F59E0B"
  },
  {
    id: "P005",
    name: "Agentic AIMEE AI Interview",
    priority: "P2 - MEDIUM",
    deadline: "Mar 1, 2026",
    status: "planning",
    owner: "AI Lead",
    division: "Technology",
    progress: 15,
    color: "#3B82F6"
  }
];

// SHOW YOUR SKILL - Case Studies
const SKILL_CHALLENGES = [
  {
    id: "SC001",
    title: "Build AI Career Coach",
    division: "Technology",
    difficulty: "Advanced",
    reward: "500 D-COIN + Interview Fast-Track",
    deadline: "7 days",
    applicants: 245,
    icon: "🤖"
  },
  {
    id: "SC002",
    title: "Design PRAKRUTI Assessment",
    division: "Education",
    difficulty: "Intermediate",
    reward: "300 D-COIN + Direct Hire",
    deadline: "5 days",
    applicants: 189,
    icon: "🧬"
  },
  {
    id: "SC003",
    title: "Legal Framework for UAE",
    division: "Legal",
    difficulty: "Expert",
    reward: "750 D-COIN + Partner Track",
    deadline: "10 days",
    applicants: 67,
    icon: "⚖️"
  },
  {
    id: "SC004",
    title: "Marketing Campaign GTM",
    division: "Art",
    difficulty: "Intermediate",
    reward: "400 D-COIN + Internship",
    deadline: "3 days",
    applicants: 312,
    icon: "🎨"
  }
];

// DOER DIVISIONS DASHBOARD
const DIVISION_METRICS = [
  { name: "Technology", head: "Gautham", efficiency: 92, tasks: 15, completed: 12, icon: "💻" },
  { name: "Policy", head: "Nikhil", efficiency: 88, tasks: 8, completed: 6, icon: "🏛️" },
  { name: "Legal", head: "Venkat", efficiency: 95, tasks: 10, completed: 9, icon: "⚖️" },
  { name: "Finance", head: "Srinivas", efficiency: 90, tasks: 12, completed: 10, icon: "💰" },
  { name: "Health", head: "Dr. Preetham", efficiency: 87, tasks: 6, completed: 5, icon: "🏥" },
  { name: "Education", head: "Chaitali", efficiency: 94, tasks: 20, completed: 18, icon: "📚" }
];

// PASS MATRIX - People Performance
const PASS_METRICS = {
  title: "PASS Matrix",
  fullForm: "Personalized Aspiration Appropriateness Skilling Salary",
  description: "Human Expert Performance Framework",
  metrics: [
    { name: "P - Personalization", score: 85, desc: "Cultural & Role Fit" },
    { name: "A - Aspiration", score: 90, desc: "Growth Mindset & Goals" },
    { name: "S - Skilling", score: 78, desc: "Learning & Development" },
    { name: "S - Salary", score: 82, desc: "Compensation vs Output" }
  ]
};

// CODE MATRIX - Company Operations
const CODE_METRICS = {
  title: "CODE Matrix",
  fullForm: "Customized Operations Delivery Efficiency",
  description: "Company Performance Framework",
  metrics: [
    { name: "C - Customization", score: 88, desc: "Product-Market Fit" },
    { name: "O - Operations", score: 85, desc: "Process Efficiency" },
    { name: "D - Delivery", score: 92, desc: "On-Time Completion" },
    { name: "E - Efficiency", score: 87, desc: "Resource Utilization" }
  ]
};

// ESG PAYROLL - Governance
const ESG_METRICS = {
  title: "ESG Payroll Governance",
  fullForm: "Efficiency-Salary-Governance",
  description: "Quarterly Investor Reporting Framework",
  metrics: [
    { name: "E - Efficiency", value: "87%", target: "90%", status: "warning" },
    { name: "S - Salary", value: "₹2.5 Cr", target: "₹3 Cr", status: "good" },
    { name: "G - Governance", value: "95%", target: "95%", status: "excellent" }
  ]
};

export default function FounderDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("office");

  const renderOffice = () => (
    <div className="space-y-6">
      {/* WTC Hero */}
      <div className="relative rounded-2xl overflow-hidden">
        <img 
          src={WTC_FACTS.image} 
          alt="World Trade Centre Bangalore"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Badge className="mb-2 bg-orange-500/30 text-orange-300 border-0">
            🏢 RIGHT DOERS GCC
          </Badge>
          <h2 className="text-xl font-bold text-white">{WTC_FACTS.name}</h2>
          <p className="text-white/70 text-sm flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {WTC_FACTS.floor}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-white/5 border-white/10 text-center p-3">
          <p className="text-2xl font-bold text-white">{WTC_FACTS.height}</p>
          <p className="text-white/50 text-[10px]">Height</p>
        </Card>
        <Card className="bg-white/5 border-white/10 text-center p-3">
          <p className="text-2xl font-bold text-white">{WTC_FACTS.floors}</p>
          <p className="text-white/50 text-[10px]">Structure</p>
        </Card>
        <Card className="bg-gradient-to-r from-orange-500/20 to-green-500/20 border-white/10 text-center p-3">
          <p className="text-2xl font-bold text-white">92</p>
          <p className="text-white/50 text-[10px]">WTC Network</p>
        </Card>
      </div>

      {/* Distinction Badge */}
      <Card className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/30">
        <CardContent className="p-4 text-center">
          <Award className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <h3 className="text-white font-bold">{WTC_FACTS.distinction}</h3>
          <p className="text-white/60 text-sm">Brigade Gateway Campus • Since {WTC_FACTS.opened}</p>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" /> Office Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {WTC_FACTS.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-white/70 text-xs">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campus Amenities */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-400" /> Integrated Campus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {WTC_FACTS.campus.map((amenity, idx) => (
              <Badge key={idx} className="bg-blue-500/20 text-blue-300 border-0 text-[10px]">
                {amenity}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Button 
        className="w-full bg-gradient-to-r from-orange-500 to-green-500 text-white"
        onClick={() => setActiveTab("challenges")}
      >
        <Zap className="w-4 h-4 mr-2" /> SHOW YOUR SKILL - Apply Now!
      </Button>
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
          <Target className="w-3 h-3 mr-1" /> FROM FOUNDER'S OFFICE
        </Badge>
        <h2 className="text-xl font-bold text-white mb-2">SHOW YOUR SKILL</h2>
        <p className="text-white/60 text-sm">Case Study Challenges • Direct Hire Track</p>
      </div>

      {/* Priority Projects */}
      <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Crown className="w-4 h-4 text-red-400" />
            Priority Project Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {PROJECT_PIPELINE.slice(0, 3).map((project) => (
            <div key={project.id} className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-white font-semibold text-sm">{project.name}</h4>
                  <div className="flex gap-2 mt-1">
                    <Badge 
                      className="text-[10px] border-0"
                      style={{ backgroundColor: project.color + '30', color: project.color }}
                    >
                      {project.priority}
                    </Badge>
                    <Badge className="bg-white/10 text-white/60 border-0 text-[10px]">
                      {project.division}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs">{project.deadline}</p>
                  <p className="text-white font-bold">{project.progress}%</p>
                </div>
              </div>
              <Progress value={project.progress} className="h-1" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skill Challenges */}
      <div className="space-y-3">
        <p className="text-white/60 text-xs uppercase tracking-wider">🎯 Open Challenges</p>
        {SKILL_CHALLENGES.map((challenge, idx) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{challenge.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-sm">{challenge.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge className="bg-purple-500/20 text-purple-300 border-0 text-[10px]">
                        {challenge.division}
                      </Badge>
                      <Badge className="bg-orange-500/20 text-orange-300 border-0 text-[10px]">
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <p className="text-green-400 text-xs mt-2">🏆 {challenge.reward}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-xs">{challenge.deadline}</p>
                    <p className="text-white/40 text-[10px]">{challenge.applicants} applied</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-500"
                  onClick={() => toast.success(`Applied to: ${challenge.title}`)}
                >
                  <Send className="w-3 h-3 mr-1" /> Apply Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
          <BarChart3 className="w-3 h-3 mr-1" /> FOUNDER DASHBOARD
        </Badge>
        <h2 className="text-xl font-bold text-white mb-2">Division Performance Grid</h2>
        <p className="text-white/60 text-sm">PASS + CODE + ESG Framework</p>
      </div>

      {/* Division Metrics */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" /> Division Leaders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {DIVISION_METRICS.map((div) => (
            <div key={div.name} className="bg-white/5 rounded-lg p-2 flex items-center gap-3">
              <span className="text-xl">{div.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-white font-semibold text-sm">{div.name}</p>
                  <Badge className={`border-0 text-[10px] ${
                    div.efficiency >= 90 ? 'bg-green-500/20 text-green-400' :
                    div.efficiency >= 80 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {div.efficiency}% Efficient
                  </Badge>
                </div>
                <p className="text-white/50 text-xs">Head: {div.head} • {div.completed}/{div.tasks} tasks</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PASS Matrix */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm">{PASS_METRICS.title}</CardTitle>
          <p className="text-white/50 text-[10px]">{PASS_METRICS.fullForm}</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {PASS_METRICS.metrics.map((metric) => (
            <div key={metric.name} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white">{metric.name}</span>
                  <span className="text-purple-400">{metric.score}%</span>
                </div>
                <Progress value={metric.score} className="h-1" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CODE Matrix */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm">{CODE_METRICS.title}</CardTitle>
          <p className="text-white/50 text-[10px]">{CODE_METRICS.fullForm}</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {CODE_METRICS.metrics.map((metric) => (
            <div key={metric.name} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white">{metric.name}</span>
                  <span className="text-blue-400">{metric.score}%</span>
                </div>
                <Progress value={metric.score} className="h-1" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ESG Governance */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm">{ESG_METRICS.title}</CardTitle>
          <p className="text-white/50 text-[10px]">{ESG_METRICS.fullForm} • IPO Roadmap 2030</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {ESG_METRICS.metrics.map((metric) => (
              <div key={metric.name} className="bg-white/5 rounded-lg p-2 text-center">
                <p className="text-white font-bold">{metric.value}</p>
                <p className="text-white/40 text-[10px]">Target: {metric.target}</p>
                <Badge className={`mt-1 border-0 text-[8px] ${
                  metric.status === 'excellent' ? 'bg-green-500/20 text-green-400' :
                  metric.status === 'good' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {metric.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Investor Report Button */}
      <Button 
        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white"
        onClick={() => toast.success("Generating Q4 Investor Report...")}
      >
        <BarChart3 className="w-4 h-4 mr-2" /> Generate Investor Report
      </Button>
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
            data-testid="captain-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-white font-bold">CAPTAIN COMMAND CENTRE</h1>
            <p className="text-white/50 text-xs">WTC Bangalore • 15th Floor</p>
          </div>
          <Badge className="bg-red-500/20 text-red-400 border-0 text-xs">
            <Crown className="w-3 h-3 mr-1" /> CXO
          </Badge>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex justify-center gap-2 p-4 bg-slate-900/50">
        {[
          { id: "office", label: "OFFICE", icon: "🏢" },
          { id: "challenges", label: "CHALLENGES", icon: "🎯" },
          { id: "dashboard", label: "DASHBOARD", icon: "📊" }
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
            {activeTab === "office" && renderOffice()}
            {activeTab === "challenges" && renderChallenges()}
            {activeTab === "dashboard" && renderDashboard()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
