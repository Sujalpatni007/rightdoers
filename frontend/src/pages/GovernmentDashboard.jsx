import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Briefcase, 
  Building2, 
  TrendingUp,
  LogOut,
  RefreshCw,
  MapPin,
  Globe,
  Download,
  ChevronRight,
  Award,
  Target,
  Rocket
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth, API } from "@/App";

const AP_DISTRICTS = [
  { id: "anantapur", name: "Anantapur", doers: 12500, jobs: 450, placements: 320 },
  { id: "chittoor", name: "Chittoor", doers: 18200, jobs: 680, placements: 510 },
  { id: "east_godavari", name: "East Godavari", doers: 22100, jobs: 890, placements: 720 },
  { id: "guntur", name: "Guntur", doers: 19800, jobs: 720, placements: 580 },
  { id: "krishna", name: "Krishna", doers: 21500, jobs: 850, placements: 690 },
  { id: "kurnool", name: "Kurnool", doers: 14200, jobs: 520, placements: 380 },
  { id: "nellore", name: "Nellore", doers: 16800, jobs: 610, placements: 470 },
  { id: "prakasam", name: "Prakasam", doers: 11200, jobs: 380, placements: 280 },
  { id: "srikakulam", name: "Srikakulam", doers: 9800, jobs: 320, placements: 240 },
  { id: "visakhapatnam", name: "Visakhapatnam", doers: 28500, jobs: 1200, placements: 950 },
  { id: "vizianagaram", name: "Vizianagaram", doers: 10500, jobs: 350, placements: 260 },
  { id: "west_godavari", name: "West Godavari", doers: 17200, jobs: 620, placements: 480 },
  { id: "kadapa", name: "Kadapa", doers: 13100, jobs: 440, placements: 340 },
];

const DIVISION_COLORS = {
  "Technology": "bg-blue-500",
  "Health": "bg-green-500",
  "Education": "bg-purple-500",
  "Finance & Banking": "bg-amber-500",
  "Transport & Logistics": "bg-cyan-500",
  "Security": "bg-red-500",
};

export default function GovernmentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/stats`);
      setStats(res.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleExport = () => {
    toast.success("Report exported! (Demo)");
  };

  // Calculate totals
  const totalDoers = AP_DISTRICTS.reduce((sum, d) => sum + d.doers, 0);
  const totalJobs = AP_DISTRICTS.reduce((sum, d) => sum + d.jobs, 0);
  const totalPlacements = AP_DISTRICTS.reduce((sum, d) => sum + d.placements, 0);
  const placementRate = Math.round((totalPlacements / totalDoers) * 100);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/70 text-sm flex items-center gap-2">
              <Rocket className="w-4 h-4" /> Population Talent Dashboard
            </p>
            <h1 className="font-display text-xl font-bold">Captain {user?.name || "Admin"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={fetchStats}
              data-testid="refresh-stats-btn"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handleExport}
              data-testid="export-btn"
            >
              <Download className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handleLogout}
              data-testid="admin-logout-btn"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <Users className="w-6 h-6 mb-2 text-blue-400" />
            <p className="font-display font-bold text-2xl">{(totalDoers / 1000).toFixed(0)}K+</p>
            <p className="text-white/70 text-xs">Registered Doers</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <Briefcase className="w-6 h-6 mb-2 text-green-400" />
            <p className="font-display font-bold text-2xl">{(totalJobs / 1000).toFixed(1)}K+</p>
            <p className="text-white/70 text-xs">Active Jobs</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <Target className="w-6 h-6 mb-2 text-amber-400" />
            <p className="font-display font-bold text-2xl">{(totalPlacements / 1000).toFixed(1)}K+</p>
            <p className="text-white/70 text-xs">Placements</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <TrendingUp className="w-6 h-6 mb-2 text-pink-400" />
            <p className="font-display font-bold text-2xl">{placementRate}%</p>
            <p className="text-white/70 text-xs">Placement Rate</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="p-4">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="districts">Districts</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Impact Card */}
          <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-2xl">I Want to IMPACT</h3>
                  <p className="text-white/70">Andhra Pradesh Talent Ecosystem</p>
                </div>
                <Award className="w-16 h-16 text-white/30" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="font-bold text-3xl">13</p>
                  <p className="text-white/70 text-sm">Districts</p>
                </div>
                <div>
                  <p className="font-bold text-3xl">670+</p>
                  <p className="text-white/70 text-sm">Pincodes</p>
                </div>
                <div>
                  <p className="font-bold text-3xl">5.4Cr</p>
                  <p className="text-white/70 text-sm">Population</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Level Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Talent by Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { level: "L1", label: "Para-Skilled", count: 95000, color: "bg-green-500" },
                  { level: "L2", label: "Professional", count: 68000, color: "bg-blue-500" },
                  { level: "L3", label: "Expert", count: 32000, color: "bg-purple-500" },
                  { level: "L4", label: "Proficorm", count: 8500, color: "bg-amber-500" },
                  { level: "L5", label: "NET Talent", count: 450, color: "bg-pink-500" },
                ].map((item) => (
                  <div key={item.level}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Badge className={`${item.color} text-white`}>{item.level}</Badge>
                        {item.label}
                      </span>
                      <span className="text-sm text-slate-500">{(item.count / 1000).toFixed(1)}K</span>
                    </div>
                    <Progress 
                      value={(item.count / 95000) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Division Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">By Division</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {stats?.division_stats?.slice(0, 6).map((div) => (
                  <div key={div.division} className="bg-slate-50 rounded-lg p-3">
                    <p className="font-medium text-sm">{div.division}</p>
                    <p className="text-2xl font-bold text-indigo-600">{div.count || Math.floor(Math.random() * 5000)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Districts Tab */}
        <TabsContent value="districts" className="space-y-3">
          {AP_DISTRICTS.map((district) => (
            <button
              key={district.id}
              onClick={() => navigate(`/government/district/${district.id}`)}
              className="w-full bg-white rounded-xl p-4 shadow-sm text-left hover:shadow-md transition-all"
              data-testid={`district-${district.id}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{district.name}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" /> {(district.doers / 1000).toFixed(1)}K Doers
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" /> {district.jobs} Jobs
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{district.placements}</p>
                  <p className="text-xs text-slate-400">Placed</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </button>
          ))}
        </TabsContent>

        {/* Pipeline Tab */}
        <TabsContent value="pipeline" className="space-y-4">
          {/* Export Pipeline */}
          <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Globe className="w-12 h-12" />
                <div>
                  <h3 className="font-display font-bold text-xl">Global Talent Export</h3>
                  <p className="text-white/80 text-sm">Abu Dhabi • USA • Japan</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="font-bold text-2xl">2.5K</p>
                  <p className="text-white/70 text-xs">Gulf Ready</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="font-bold text-2xl">850</p>
                  <p className="text-white/70 text-xs">US Visa Pool</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="font-bold text-2xl">420</p>
                  <p className="text-white/70 text-xs">Japan Ready</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* One Family One Entrepreneur */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Rocket className="w-5 h-5 text-indigo-600" />
                One Family, One Entrepreneur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Target Families</span>
                  <span className="font-bold">1.5 Cr</span>
                </div>
                <Progress value={12} className="h-3" />
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Entrepreneurs Created</span>
                  <span className="text-green-600 font-medium">18,500 (12%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Junicorn Finder */}
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            <CardContent className="p-6">
              <Badge className="bg-white/20 text-white border-0 mb-3">🦄 JUNICORN NET</Badge>
              <h3 className="font-display font-bold text-xl mb-2">Natural Exceptional Talent Finder</h3>
              <p className="text-white/70 text-sm mb-4">ISF Global Innovation Summit Candidates</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <p className="font-bold text-3xl">127</p>
                  <p className="text-white/70 text-xs">NET Applications</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <p className="font-bold text-3xl">23</p>
                  <p className="text-white/70 text-xs">Shortlisted</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Davos 2026 Banner */}
      <div className="px-4 pb-8">
        <Card className="bg-slate-900 text-white border-0">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center text-3xl">
              🌍
            </div>
            <div>
              <Badge className="bg-amber-500 text-white border-0 mb-1">DAVOS 2026</Badge>
              <h3 className="font-display font-bold">World Economic Forum Ready</h3>
              <p className="text-white/60 text-sm">AP Talent Pipeline Impact Story</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
