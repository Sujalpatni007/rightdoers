/**
 * HI AI-APP.COM - Division Director Dashboards
 * 12 Doers Divisions with Revenue Matrix, CapEx/OpEx Charts
 * Linked to Captain Command Centre for IPO 2031 Readiness
 * Focus: Deep Tech (Robotics, GPU Manufacturing)
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Building2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Briefcase,
  Crown,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  CircleDot,
  Shield,
  Scale,
  Heart,
  Microscope,
  Cpu,
  Truck,
  Palette,
  GraduationCap,
  Landmark,
  Wheat,
  Activity,
  Trophy,
  Star,
  Rocket,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { useAuth, API } from "@/App";
import axios from "axios";

// 12 DOERS DIVISIONS - With Deep Tech Priority
const DIVISIONS = [
  { 
    id: "technology", 
    name: "Technology", 
    icon: Cpu, 
    color: "#8B5CF6",
    priority: "DEEP_TECH",
    focusArea: "GPU Chip Manufacturing, AI Infrastructure",
    club: "Problem Solvers"
  },
  { 
    id: "science", 
    name: "Science", 
    icon: Microscope, 
    color: "#3B82F6",
    priority: "DEEP_TECH",
    focusArea: "Robotic Manufacturing, R&D",
    club: "Problem Solvers"
  },
  { 
    id: "finance", 
    name: "Finance & Banking", 
    icon: Landmark, 
    color: "#F59E0B",
    priority: "HIGH",
    focusArea: "IPO Readiness, Fund Allocation",
    club: "Profit Maximizers"
  },
  { 
    id: "health", 
    name: "Health", 
    icon: Heart, 
    color: "#EF4444",
    priority: "HIGH",
    focusArea: "AI Diagnostics, HealthTech",
    club: "Wellness Seekers"
  },
  { 
    id: "education", 
    name: "Education", 
    icon: GraduationCap, 
    color: "#22C55E",
    priority: "HIGH",
    focusArea: "Student Acquisition, EdTech",
    club: "Knowledge Givers"
  },
  { 
    id: "policy", 
    name: "Policy", 
    icon: Shield, 
    color: "#64748B",
    priority: "MEDIUM",
    focusArea: "Government Relations, Compliance",
    club: "Power Keepers"
  },
  { 
    id: "legal", 
    name: "Legal", 
    icon: Scale, 
    color: "#0EA5E9",
    priority: "MEDIUM",
    focusArea: "IP Protection, Contracts",
    club: "Power Keepers"
  },
  { 
    id: "security", 
    name: "Security", 
    icon: Shield, 
    color: "#1E293B",
    priority: "MEDIUM",
    focusArea: "Cybersecurity, Data Protection",
    club: "Power Keepers"
  },
  { 
    id: "transport", 
    name: "Transport & Logistics", 
    icon: Truck, 
    color: "#EA580C",
    priority: "MEDIUM",
    focusArea: "Autonomous Vehicles, Supply Chain",
    club: "Problem Solvers"
  },
  { 
    id: "food_agri", 
    name: "Food & Agriculture", 
    icon: Wheat, 
    color: "#84CC16",
    priority: "STANDARD",
    focusArea: "AgriTech, Farm Automation",
    club: "Wellness Seekers"
  },
  { 
    id: "sport", 
    name: "Sport", 
    icon: Activity, 
    color: "#EC4899",
    priority: "STANDARD",
    focusArea: "Sports Analytics, Fitness Tech",
    club: "Wellness Seekers"
  },
  { 
    id: "art", 
    name: "Art & Creative", 
    icon: Palette, 
    color: "#A855F7",
    priority: "STANDARD",
    focusArea: "Content Creation, Design",
    club: "Knowledge Givers"
  }
];

// Priority colors and badges
const PRIORITY_CONFIG = {
  DEEP_TECH: { color: "#8B5CF6", label: "🚀 Deep Tech Priority", bgClass: "from-purple-600/30 to-indigo-600/30" },
  HIGH: { color: "#F59E0B", label: "⚡ High Priority", bgClass: "from-amber-600/30 to-orange-600/30" },
  MEDIUM: { color: "#3B82F6", label: "📊 Medium Priority", bgClass: "from-blue-600/30 to-cyan-600/30" },
  STANDARD: { color: "#22C55E", label: "✓ Standard", bgClass: "from-green-600/30 to-emerald-600/30" }
};

// Generate realistic division metrics
const generateDivisionMetrics = (division) => {
  const isDeepTech = division.priority === "DEEP_TECH";
  const isHigh = division.priority === "HIGH";
  
  const baseRevenue = isDeepTech ? 2500000 : isHigh ? 1500000 : 800000;
  const variability = Math.random() * 0.3 + 0.85; // 85% - 115%
  
  return {
    // Revenue Matrix - KEY METRIC
    revenue: {
      current: Math.round(baseRevenue * variability),
      target: Math.round(baseRevenue * 1.2),
      lastMonth: Math.round(baseRevenue * (variability - 0.1)),
      growth: Math.round((variability - 0.9) * 100 * 10) / 10
    },
    // CapEx (Capital Expenditure)
    capex: {
      budget: Math.round(baseRevenue * 0.3),
      spent: Math.round(baseRevenue * 0.3 * Math.random() * 0.8),
      allocated: isDeepTech ? ["GPU Infrastructure", "R&D Labs", "Robotics"] : ["Equipment", "Software", "Training"]
    },
    // OpEx (Operating Expenditure)
    opex: {
      budget: Math.round(baseRevenue * 0.5),
      spent: Math.round(baseRevenue * 0.5 * Math.random() * 0.9),
      categories: {
        salaries: Math.round(baseRevenue * 0.25),
        marketing: Math.round(baseRevenue * 0.1),
        operations: Math.round(baseRevenue * 0.1),
        others: Math.round(baseRevenue * 0.05)
      }
    },
    // Talent Pipeline
    talent: {
      total: Math.round(50 + Math.random() * 150),
      active: Math.round(30 + Math.random() * 80),
      placements: Math.round(10 + Math.random() * 40),
      pending: Math.round(5 + Math.random() * 20)
    },
    // Performance Score (for pay variability)
    performance: {
      score: Math.round(60 + Math.random() * 35),
      productContribution: Math.round(40 + Math.random() * 50),
      salesContribution: Math.round(20 + Math.random() * 30),
      isProductFocused: Math.random() > 0.5
    }
  };
};

// Division Selector Component
const DivisionSelector = ({ divisions, selectedId, onSelect }) => (
  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-6">
    {divisions.map((div) => (
      <motion.button
        key={div.id}
        className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all ${
          selectedId === div.id 
            ? "bg-white/20 border-2 border-white/40" 
            : "bg-white/5 hover:bg-white/10 border border-white/10"
        }`}
        onClick={() => onSelect(div.id)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        data-testid={`division-${div.id}`}
      >
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: div.color + "30" }}
        >
          <div.icon className="w-5 h-5" style={{ color: div.color }} />
        </div>
        <span className="text-white text-[10px] text-center leading-tight">{div.name}</span>
        {div.priority === "DEEP_TECH" && (
          <Badge className="bg-purple-500/30 text-purple-300 border-0 text-[8px] px-1">
            🚀
          </Badge>
        )}
      </motion.button>
    ))}
  </div>
);

// Revenue Chart Component (Simplified bar chart)
const RevenueChart = ({ data, color }) => {
  const max = Math.max(data.current, data.target, data.lastMonth);
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-20 text-white/60 text-xs">This Month</div>
        <div className="flex-1 h-6 bg-white/10 rounded-lg overflow-hidden relative">
          <motion.div 
            className="h-full rounded-lg"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${(data.current / max) * 100}%` }}
            transition={{ duration: 1 }}
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xs font-bold">
            ₹{(data.current / 100000).toFixed(1)}L
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-20 text-white/60 text-xs">Target</div>
        <div className="flex-1 h-6 bg-white/10 rounded-lg overflow-hidden relative">
          <motion.div 
            className="h-full rounded-lg bg-amber-500/50"
            initial={{ width: 0 }}
            animate={{ width: `${(data.target / max) * 100}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 text-xs">
            ₹{(data.target / 100000).toFixed(1)}L
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-20 text-white/60 text-xs">Last Month</div>
        <div className="flex-1 h-6 bg-white/10 rounded-lg overflow-hidden relative">
          <motion.div 
            className="h-full rounded-lg bg-white/30"
            initial={{ width: 0 }}
            animate={{ width: `${(data.lastMonth / max) * 100}%` }}
            transition={{ duration: 1, delay: 0.4 }}
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 text-xs">
            ₹{(data.lastMonth / 100000).toFixed(1)}L
          </span>
        </div>
      </div>
    </div>
  );
};

// CapEx/OpEx Pie Chart (Simplified)
const ExpenseChart = ({ capex, opex }) => {
  const total = capex.budget + opex.budget;
  const capexPercent = (capex.budget / total) * 100;
  const opexPercent = (opex.budget / total) * 100;
  
  return (
    <div className="flex items-center gap-6">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3B82F6" strokeWidth="3" 
            strokeDasharray={`${capexPercent} ${100 - capexPercent}`} />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22C55E" strokeWidth="3"
            strokeDasharray={`${opexPercent} ${100 - opexPercent}`} 
            strokeDashoffset={`-${capexPercent}`} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-xs font-bold">₹{(total / 100000).toFixed(0)}L</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span className="text-white/70 text-xs">CapEx: ₹{(capex.budget / 100000).toFixed(1)}L</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span className="text-white/70 text-xs">OpEx: ₹{(opex.budget / 100000).toFixed(1)}L</span>
        </div>
      </div>
    </div>
  );
};

export default function DivisionDashboards() {
  const navigate = useNavigate();
  const { divisionId } = useParams();
  const { user } = useAuth();
  
  const [selectedDivision, setSelectedDivision] = useState(divisionId || "technology");
  const [metrics, setMetrics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("overview"); // overview, revenue, expenses, talent

  const division = DIVISIONS.find(d => d.id === selectedDivision) || DIVISIONS[0];
  const priorityConfig = PRIORITY_CONFIG[division.priority];

  // Fetch/generate metrics for selected division
  useEffect(() => {
    let isMounted = true;
    
    // Simulate API call - in production this would be a real backend call
    const loadMetrics = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (isMounted) {
        const newMetrics = {};
        DIVISIONS.forEach(div => {
          newMetrics[div.id] = generateDivisionMetrics(div);
        });
        setMetrics(newMetrics);
        setIsLoading(false);
      }
    };
    
    loadMetrics();
    
    return () => { isMounted = false; };
  }, []);

  const divisionMetrics = metrics[selectedDivision] || generateDivisionMetrics(division);

  // Calculate fund allocation efficiency
  const fundEfficiency = divisionMetrics.revenue.current / 
    (divisionMetrics.capex.spent + divisionMetrics.opex.spent) || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <motion.div className="text-center">
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Building2 className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-white text-xl font-bold mb-2">Loading Division Data</h2>
          <p className="text-white/50">Preparing revenue matrices...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => navigate('/captain-command')}
            data-testid="division-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-white font-bold flex items-center gap-2 justify-center">
              <Building2 className="w-5 h-5" style={{ color: division.color }} />
              Division Dashboards
            </h1>
            <p className="text-white/50 text-xs">IPO 2031 • Soonicorn Journey</p>
          </div>
          <Badge className={`bg-gradient-to-r ${priorityConfig.bgClass} text-white border-0 text-xs`}>
            {priorityConfig.label}
          </Badge>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6 pb-24">
        
        {/* Division Selector */}
        <DivisionSelector 
          divisions={DIVISIONS} 
          selectedId={selectedDivision}
          onSelect={setSelectedDivision}
        />

        {/* Selected Division Header */}
        <motion.div
          key={selectedDivision}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={`bg-gradient-to-r ${priorityConfig.bgClass} border-white/20`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: division.color + "40" }}
                >
                  <division.icon className="w-8 h-8" style={{ color: division.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-white text-xl font-bold">{division.name}</h2>
                    <Badge className="bg-white/20 text-white border-0 text-xs">
                      {division.club}
                    </Badge>
                  </div>
                  <p className="text-white/70 text-sm mb-2">{division.focusArea}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {divisionMetrics.revenue.growth >= 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-green-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                      )}
                      <span className={divisionMetrics.revenue.growth >= 0 ? "text-green-400" : "text-red-400"}>
                        {divisionMetrics.revenue.growth}% Growth
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white/60 text-sm">
                      <Users className="w-4 h-4" />
                      {divisionMetrics.talent.total} Talents
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-xs">Revenue This Month</p>
                  <p className="text-3xl font-bold text-white">
                    ₹{(divisionMetrics.revenue.current / 100000).toFixed(1)}L
                  </p>
                  <p className="text-white/40 text-xs">
                    Target: ₹{(divisionMetrics.revenue.target / 100000).toFixed(1)}L
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <p className="text-white/50 text-xs">Fund Efficiency</p>
              <p className="text-xl font-bold text-white">{fundEfficiency.toFixed(2)}x</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-amber-400" />
              <p className="text-white/50 text-xs">Target Achievement</p>
              <p className="text-xl font-bold text-white">
                {Math.round((divisionMetrics.revenue.current / divisionMetrics.revenue.target) * 100)}%
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Briefcase className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <p className="text-white/50 text-xs">Placements</p>
              <p className="text-xl font-bold text-white">{divisionMetrics.talent.placements}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <p className="text-white/50 text-xs">Performance</p>
              <p className="text-xl font-bold text-white">{divisionMetrics.performance.score}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Matrix - KEY */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-green-400" />
                Revenue Matrix (KEY)
              </span>
              <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                Optimal Fund Allocation
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={divisionMetrics.revenue} color={division.color} />
          </CardContent>
        </Card>

        {/* CapEx & OpEx */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* CapEx */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <PieChart className="w-4 h-4 text-blue-400" />
                CapEx (Capital Expenditure)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">Budget Utilization</span>
                  <span className="text-white">
                    ₹{(divisionMetrics.capex.spent / 100000).toFixed(1)}L / ₹{(divisionMetrics.capex.budget / 100000).toFixed(1)}L
                  </span>
                </div>
                <Progress 
                  value={(divisionMetrics.capex.spent / divisionMetrics.capex.budget) * 100} 
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <p className="text-white/50 text-xs">Allocated For:</p>
                {divisionMetrics.capex.allocated.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <CircleDot className="w-3 h-3 text-blue-400" />
                    <span className="text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* OpEx */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <LineChart className="w-4 h-4 text-green-400" />
                OpEx (Operating Expenditure)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">Budget Utilization</span>
                  <span className="text-white">
                    ₹{(divisionMetrics.opex.spent / 100000).toFixed(1)}L / ₹{(divisionMetrics.opex.budget / 100000).toFixed(1)}L
                  </span>
                </div>
                <Progress 
                  value={(divisionMetrics.opex.spent / divisionMetrics.opex.budget) * 100} 
                  className="h-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/5 rounded-lg p-2">
                  <p className="text-white/40">Salaries</p>
                  <p className="text-white font-bold">₹{(divisionMetrics.opex.categories.salaries / 100000).toFixed(1)}L</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2">
                  <p className="text-white/40">Marketing</p>
                  <p className="text-white font-bold">₹{(divisionMetrics.opex.categories.marketing / 100000).toFixed(1)}L</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2">
                  <p className="text-white/40">Operations</p>
                  <p className="text-white font-bold">₹{(divisionMetrics.opex.categories.operations / 100000).toFixed(1)}L</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2">
                  <p className="text-white/40">Others</p>
                  <p className="text-white font-bold">₹{(divisionMetrics.opex.categories.others / 100000).toFixed(1)}L</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pay Variability - Product vs Sales */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              Pay Variability Matrix (Founder&apos;s Focus)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Product Contributors */}
              <div className={`p-4 rounded-xl ${
                divisionMetrics.performance.isProductFocused 
                  ? "bg-green-500/20 border border-green-500/30"
                  : "bg-white/5 border border-white/10"
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Rocket className="w-5 h-5 text-green-400" />
                  <span className="text-white font-bold">Product Contributors</span>
                  {divisionMetrics.performance.isProductFocused && (
                    <Badge className="bg-green-500/30 text-green-300 border-0 text-xs ml-auto">
                      Rewarded
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Progress value={divisionMetrics.performance.productContribution} className="flex-1 h-3" />
                  <span className="text-white font-bold">{divisionMetrics.performance.productContribution}%</span>
                </div>
                <p className="text-white/50 text-xs">
                  Product development & enhancement contributions
                </p>
              </div>

              {/* Sales Agents */}
              <div className={`p-4 rounded-xl ${
                !divisionMetrics.performance.isProductFocused 
                  ? "bg-blue-500/20 border border-blue-500/30"
                  : "bg-white/5 border border-white/10"
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-bold">Sales Cut Agents</span>
                  {!divisionMetrics.performance.isProductFocused && (
                    <Badge className="bg-blue-500/30 text-blue-300 border-0 text-xs ml-auto">
                      Standard
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Progress value={divisionMetrics.performance.salesContribution} className="flex-1 h-3" />
                  <span className="text-white font-bold">{divisionMetrics.performance.salesContribution}%</span>
                </div>
                <p className="text-white/50 text-xs">
                  Sales & business development contributions
                </p>
              </div>
            </div>

            {/* Founder's Note */}
            <div className="mt-4 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <p className="text-amber-400 text-sm">
                <Crown className="w-4 h-4 inline mr-2" />
                <strong>Founder's Priority:</strong> Reward those who contribute to product development & enhancement. 
                Sales agents receive standard commission cuts. This season of student uncertainty is crucial for business growth.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Deep Tech Focus Alert (for Technology & Science) */}
        {division.priority === "DEEP_TECH" && (
          <Card className="bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/30 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">🚀 Deep Tech Priority Division</h3>
                  <p className="text-white/70 text-sm mb-2">
                    World is entering the Great Robotic Takeover era. GPU chip making with robotic manufacturing 
                    is key for our focused investments.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-purple-500/30 text-purple-300 border-0 text-xs">GPU Infrastructure</Badge>
                    <Badge className="bg-purple-500/30 text-purple-300 border-0 text-xs">Robotic Manufacturing</Badge>
                    <Badge className="bg-purple-500/30 text-purple-300 border-0 text-xs">AI/ML Research</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Link to Captain Command */}
        <Button 
          className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500"
          onClick={() => navigate('/captain-command')}
          data-testid="goto-captain-command"
        >
          <Crown className="w-5 h-5 mr-2" />
          Return to Captain Command Centre
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </main>
    </div>
  );
}
