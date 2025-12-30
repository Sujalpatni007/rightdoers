import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  Search,
  Filter,
  ChevronRight,
  Zap,
  Building2,
  UserCheck,
  AlertTriangle,
  Star,
  Download
} from "lucide-react";
import { useAuth } from "@/App";

const PIPELINE_STATS = {
  totalCandidates: 2847,
  matchedForYou: 127,
  shortlisted: 23,
  interviewed: 8,
  avgHiringTime: 14,
  industryAvg: 90,
  costSavings: 66
};

const TOP_CANDIDATES = [
  {
    id: 1,
    name: "Rohan Kumar",
    avatar: "👨‍🎓",
    level: "L2",
    passScore: 87,
    division: "Science",
    skills: ["Nuclear Physics", "MATLAB", "Safety Systems"],
    certifications: ["Nuclear Science", "Radiation Safety"],
    status: "Available",
    match: 94
  },
  {
    id: 2,
    name: "Aadhya Sharma",
    avatar: "👩‍🎓",
    level: "L2",
    passScore: 91,
    division: "Science",
    skills: ["Reactor Design", "Python", "Thermodynamics"],
    certifications: ["Nuclear Science", "IAEA Safety"],
    status: "Available",
    match: 92
  },
  {
    id: 3,
    name: "Arjun Reddy",
    avatar: "👨‍🔬",
    level: "L3",
    passScore: 85,
    division: "Technology",
    skills: ["MCNP Simulation", "Control Systems", "AutoCAD"],
    certifications: ["Nuclear Engineering"],
    status: "In Process",
    match: 88
  }
];

const COMPETITOR_ALERT = {
  message: "3 competitors are viewing similar talent pools",
  companies: ["L&T Nuclear", "Tata Power", "Adani Energy"]
};

export default function CorporateDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-slate-100 pb-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-4 pb-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏭</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-lg">PowerMech Projects</h1>
              <p className="text-white/70 text-sm">Nuclear Talent Pipeline</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>

        {/* FOMO Alert */}
        <div className="bg-amber-500/20 border border-amber-400/30 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <p className="text-amber-200 text-sm flex-1">{COMPETITOR_ALERT.message}</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-white/10 border-0">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{PIPELINE_STATS.totalCandidates}</p>
              <p className="text-white/60 text-xs">Nuclear-Ready Candidates</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-0">
            <CardContent className="p-4 text-center">
              <UserCheck className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{PIPELINE_STATS.matchedForYou}</p>
              <p className="text-white/60 text-xs">Matched for YOU</p>
            </CardContent>
          </Card>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="px-4 -mt-12 relative z-10 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <Card className="shadow-lg">
            <CardContent className="p-3 text-center">
              <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="font-bold text-lg">{PIPELINE_STATS.avgHiringTime}d</p>
              <p className="text-slate-500 text-[10px]">Avg Hire Time</p>
              <p className="text-green-500 text-[10px]">vs {PIPELINE_STATS.industryAvg}d industry</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-3 text-center">
              <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <p className="font-bold text-lg">{PIPELINE_STATS.costSavings}%</p>
              <p className="text-slate-500 text-[10px]">Cost Savings</p>
              <p className="text-green-500 text-[10px]">vs traditional</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-3 text-center">
              <TrendingUp className="w-5 h-5 text-purple-500 mx-auto mb-1" />
              <p className="font-bold text-lg">94%</p>
              <p className="text-slate-500 text-[10px]">Retention Rate</p>
              <p className="text-green-500 text-[10px]">12-month</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search candidates..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Pipeline Builder CTA */}
      <div className="px-4 mb-4">
        <Button 
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 h-14"
          onClick={() => navigate("/corporate/pipeline-builder")}
        >
          <Zap className="mr-2" /> Build Custom Talent Pipeline
        </Button>
      </div>

      {/* Top Matches */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900">Top Matches for You</h2>
          <Button variant="link" className="text-indigo-600 p-0 h-auto">
            View All <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {TOP_CANDIDATES.map((candidate) => (
            <Card key={candidate.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{candidate.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-slate-900">{candidate.name}</h3>
                      <Badge className={`${candidate.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'} border-0`}>
                        {candidate.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{candidate.level}</Badge>
                      <span className="text-slate-500 text-sm">{candidate.division}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-sm font-medium text-indigo-600">PASS: {candidate.passScore}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {candidate.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} className="bg-slate-100 text-slate-600 border-0 text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-semibold">{candidate.match}% match</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Profile</Button>
                        <Button size="sm" className="bg-indigo-600">Shortlist</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ROI Card */}
      <div className="px-4 py-6">
        <Card className="bg-gradient-to-r from-green-600 to-emerald-600 border-0 text-white">
          <CardContent className="p-5">
            <h3 className="font-display font-bold text-lg mb-2">Partnership ROI</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-white/70 text-sm">Traditional Hiring</p>
                <p className="text-xl font-bold line-through text-white/50">₹2.5L/hire</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">With Right Doers</p>
                <p className="text-xl font-bold">₹85K/hire</p>
              </div>
            </div>
            <Button className="w-full bg-white text-green-700 hover:bg-white/90">
              Schedule MOU Discussion
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
