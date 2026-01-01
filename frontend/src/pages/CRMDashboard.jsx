import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Users,
  Briefcase,
  Target,
  TrendingUp,
  Globe,
  Rocket,
  Sparkles,
  Building2,
  IndianRupee,
  Calendar,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Zap,
  Heart,
  Ambulance,
  Scale,
  RefreshCw,
  Bot,
  Share2
} from "lucide-react";
import { toast } from "sonner";
import { API } from "@/App";
import axios from "axios";

// GTM Path Stages
const GTM_STAGES = [
  { id: "audience", name: "Audience", icon: "👥", color: "from-blue-500 to-cyan-500" },
  { id: "vibed", name: "Vibe Code", icon: "✨", color: "from-purple-500 to-pink-500" },
  { id: "engaged", name: "Community+", icon: "🤝", color: "from-green-500 to-emerald-500" },
  { id: "launched", name: "Launched", icon: "🚀", color: "from-orange-500 to-amber-500" },
  { id: "ai_automated", name: "AI Agents", icon: "🤖", color: "from-indigo-500 to-purple-500" },
  { id: "repeat", name: "Repeat", icon: "🔄", color: "from-pink-500 to-rose-500" }
];

// Business Vertical Icons
const VERTICAL_ICONS = {
  women_entrepreneurs: Heart,
  legal_upskill: Scale,
  ambulance_aggregator: Ambulance,
  edtech: Sparkles,
  healthtech: Heart,
  fintech: IndianRupee,
  default: Building2
};

// Order Status Colors
const STATUS_COLORS = {
  draft: "bg-gray-500/20 text-gray-400",
  active: "bg-blue-500/20 text-blue-400",
  in_progress: "bg-amber-500/20 text-amber-400",
  review: "bg-purple-500/20 text-purple-400",
  completed: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400"
};

// Order Card Component
const OrderCard = ({ order, onClick }) => {
  const Icon = VERTICAL_ICONS[order.vertical] || VERTICAL_ICONS.default;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="bg-white/5 border-white/10 hover:border-purple-500/30 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-white font-bold line-clamp-1">{order.title}</h4>
                <Badge className={STATUS_COLORS[order.status] || STATUS_COLORS.draft}>
                  {order.status}
                </Badge>
              </div>
              <p className="text-white/60 text-sm">{order.client_name}</p>
              
              {/* Progress */}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">Progress</span>
                  <span className="text-white">{order.progress}%</span>
                </div>
                <Progress value={order.progress} className="h-2 bg-white/10" />
              </div>
              
              {/* Value */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 text-green-400">
                  <IndianRupee className="w-4 h-4" />
                  <span className="font-bold">{(order.contract_value / 100000).toFixed(1)}L</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Dubai Countdown Component
const DubaiCountdown = ({ current, target, daysLeft }) => {
  const progress = (current / target) * 100;
  const usersPerDay = Math.ceil((target - current) / Math.max(1, daysLeft));
  
  return (
    <Card className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border-amber-500/30">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-400" />
              Dubai Investor Meeting
            </h3>
            <p className="text-amber-400/80 text-sm">{daysLeft} days remaining</p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs">Target</p>
            <p className="text-white text-2xl font-bold">{target.toLocaleString()}</p>
            <p className="text-white/60 text-xs">users</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white">{current.toLocaleString()} users</span>
            <span className={progress >= 100 ? "text-green-400" : "text-amber-400"}>
              {progress.toFixed(1)}%
            </span>
          </div>
          <Progress value={Math.min(progress, 100)} className="h-4 bg-white/10" />
          <p className="text-white/60 text-xs text-center">
            Need <span className="text-amber-400 font-bold">{usersPerDay.toLocaleString()}</span> users/day to hit target
          </p>
        </div>
        
        {/* Viral Metrics */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <p className="text-2xl font-bold text-white">0.0</p>
            <p className="text-white/60 text-xs">Viral Coeff</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <p className="text-2xl font-bold text-white">0%</p>
            <p className="text-white/60 text-xs">Referral Rate</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <p className="text-2xl font-bold text-white">0%</p>
            <p className="text-white/60 text-xs">Share Rate</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CRMDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [pipeline, setPipeline] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const [dashRes, pipeRes] = await Promise.all([
        axios.get(`${API}/crm/dashboard`),
        axios.get(`${API}/crm/pipeline`)
      ]);
      
      setDashboard(dashRes.data);
      setPipeline(pipeRes.data);
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Failed to load CRM dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Target className="w-8 h-8 text-white" />
          </motion.div>
          <p className="text-white">Loading CRM Super App...</p>
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
            onClick={() => navigate("/captain")}
            data-testid="crm-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-white font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              CRM Super App
            </h1>
            <Badge className="bg-purple-500/20 text-purple-400 border-0 text-[10px] mt-1">
              Business to the World
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={fetchDashboard}
            data-testid="crm-refresh-btn"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Dubai Countdown */}
        <DubaiCountdown
          current={dashboard?.gtm_progress?.current || 0}
          target={dashboard?.gtm_progress?.target || 10000}
          daysLeft={dashboard?.gtm_progress?.days_to_dubai || 7}
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{dashboard?.summary?.total_leads || 0}</p>
              <p className="text-white/60 text-sm">Total Leads</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Briefcase className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{dashboard?.summary?.total_orders || 3}</p>
              <p className="text-white/60 text-sm">Active Orders</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">
                ₹{((pipeline?.total_value || 2250000) / 100000).toFixed(1)}L
              </p>
              <p className="text-white/60 text-sm">Pipeline Value</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{pipeline?.avg_vibe_score?.toFixed(0) || 50}</p>
              <p className="text-white/60 text-sm">Avg Vibe Score</p>
            </CardContent>
          </Card>
        </div>

        {/* GTM Pipeline - New Path */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Rocket className="w-5 h-5 text-orange-400" />
              GTM Pipeline (New Path)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {GTM_STAGES.map((stage) => (
                <div
                  key={stage.id}
                  className={`flex-1 min-w-[100px] bg-gradient-to-br ${stage.color} rounded-xl p-3 text-center`}
                >
                  <span className="text-2xl">{stage.icon}</span>
                  <p className="text-white font-bold text-xl mt-1">
                    {pipeline?.stages?.[stage.id] || 0}
                  </p>
                  <p className="text-white/80 text-xs">{stage.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "orders", label: "Your Orders (3)", icon: Briefcase },
            { id: "leads", label: "Leads", icon: Users },
            { id: "verticals", label: "Verticals", icon: Building2 }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={activeTab === tab.id ? "bg-purple-500" : "text-white/60"}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold">Your 3 Business Orders</h3>
              <Button size="sm" className="bg-purple-500" onClick={() => toast.info("Create new order coming soon!")}>
                <Plus className="w-4 h-4 mr-1" />
                New Order
              </Button>
            </div>
            
            <div className="grid gap-4">
              {(dashboard?.active_orders || []).map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => toast.info(`Order: ${order.title}`)}
                />
              ))}
            </div>
            
            {/* Order Details */}
            <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30">
              <CardContent className="p-4">
                <h4 className="text-white font-bold mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Women Entrepreneurs Platform</span>
                    <span className="text-white">₹5L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Legal Upskill (Kannada-English)</span>
                    <span className="text-white">₹7.5L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Ambulance Aggregator</span>
                    <span className="text-white">₹10L</span>
                  </div>
                  <hr className="border-white/10" />
                  <div className="flex justify-between font-bold">
                    <span className="text-white">Total Pipeline</span>
                    <span className="text-green-400">₹22.5L</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="Search leads..."
                  className="pl-10 bg-white/10 border-white/20 text-white"
                />
              </div>
              <Button variant="outline" className="border-white/20 text-white">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-purple-500" onClick={() => toast.info("Add lead coming soon!")}>
                <Plus className="w-4 h-4 mr-1" />
                Add Lead
              </Button>
            </div>
            
            {/* Recent Leads */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                {(dashboard?.recent_leads || []).length > 0 ? (
                  <div className="space-y-3">
                    {dashboard.recent_leads.map((lead, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{lead.name}</p>
                          <p className="text-white/60 text-sm">{lead.company || lead.email}</p>
                        </div>
                        <Badge className="bg-purple-500/20 text-purple-400 border-0">
                          Vibe: {lead.vibe_score}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-white/20 mx-auto mb-2" />
                    <p className="text-white/60">No leads yet</p>
                    <p className="text-white/40 text-sm">Start finding your audience!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Verticals Tab */}
        {activeTab === "verticals" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { id: "women_entrepreneurs", name: "Women Entrepreneurs", icon: Heart, active: true },
              { id: "legal_upskill", name: "Legal Upskill", icon: Scale, active: true },
              { id: "ambulance_aggregator", name: "Ambulance Aggregator", icon: Ambulance, active: true },
              { id: "edtech", name: "EdTech", icon: Sparkles, active: false },
              { id: "healthtech", name: "HealthTech", icon: Heart, active: false },
              { id: "fintech", name: "FinTech", icon: IndianRupee, active: false }
            ].map((vertical) => (
              <Card
                key={vertical.id}
                className={`${vertical.active ? 'bg-purple-500/10 border-purple-500/30' : 'bg-white/5 border-white/10'} hover:border-purple-500/50 transition-colors cursor-pointer`}
                onClick={() => toast.info(`${vertical.name} vertical`)}
              >
                <CardContent className="p-4 text-center">
                  <vertical.icon className={`w-8 h-8 mx-auto mb-2 ${vertical.active ? 'text-purple-400' : 'text-white/40'}`} />
                  <p className={`font-medium ${vertical.active ? 'text-white' : 'text-white/60'}`}>
                    {vertical.name}
                  </p>
                  {vertical.active && (
                    <Badge className="bg-green-500/20 text-green-400 border-0 text-xs mt-2">
                      Active Order
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-indigo-500/30">
          <CardContent className="p-4">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Quick Actions
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" className="border-white/20 text-white h-auto py-3 flex-col gap-1">
                <Bot className="w-5 h-5 text-purple-400" />
                <span className="text-xs">AI Agents</span>
              </Button>
              <Button variant="outline" className="border-white/20 text-white h-auto py-3 flex-col gap-1">
                <Share2 className="w-5 h-5 text-blue-400" />
                <span className="text-xs">Share Vibe</span>
              </Button>
              <Button variant="outline" className="border-white/20 text-white h-auto py-3 flex-col gap-1" onClick={() => navigate("/captain")}>
                <Target className="w-5 h-5 text-amber-400" />
                <span className="text-xs">Command Centre</span>
              </Button>
              <Button variant="outline" className="border-white/20 text-white h-auto py-3 flex-col gap-1" onClick={() => navigate("/director")}>
                <Building2 className="w-5 h-5 text-green-400" />
                <span className="text-xs">12 Divisions</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
