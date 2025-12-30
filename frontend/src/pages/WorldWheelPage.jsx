import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Search,
  Users,
  Briefcase,
  TrendingUp,
  Globe,
  ChevronRight,
  Sparkles,
  Brain,
  Zap
} from "lucide-react";

const CLUSTERS = [
  { id: "policy", name: "Policy", icon: "🏛️", color: "from-purple-500 to-violet-600", roles: 85, description: "Government, Civil Services, Journalism", subCategories: ["Politician", "Civil Servant", "Journalist", "Social Worker"] },
  { id: "legal", name: "Legal", icon: "⚖️", color: "from-slate-600 to-slate-800", roles: 62, description: "Law, Constitutional, Corporate", subCategories: ["Constitutional Law", "Criminal Law", "Corporate Law", "Civil Law"] },
  { id: "security", name: "Security", icon: "🛡️", color: "from-red-500 to-rose-600", roles: 78, description: "Military, Police, Private Security", subCategories: ["Military", "Police", "Private Security", "Cybersecurity"] },
  { id: "sport", name: "Sport", icon: "🏆", color: "from-orange-500 to-amber-600", roles: 45, description: "Athletes, Coaches, Arena Management", subCategories: ["Indoor Sports", "Outdoor Sports", "Coaching", "Sports Management"] },
  { id: "food", name: "Food", icon: "🍽️", color: "from-green-500 to-emerald-600", roles: 92, description: "Agriculture, Hospitality, Processing", subCategories: ["Agriculture", "Food Processing", "Hospitality", "Retail"] },
  { id: "health", name: "Health", icon: "🏥", color: "from-pink-500 to-rose-600", roles: 156, description: "Medical, Diagnostic, Wellness", subCategories: ["Diagnostic", "Intervention", "Preventive", "Wellness"] },
  { id: "science", name: "Science", icon: "🔬", color: "from-cyan-500 to-blue-600", roles: 124, description: "Research, Biotech, Pharma", subCategories: ["Biotech", "Agritech", "Pharma", "Research"] },
  { id: "tech", name: "Technology", icon: "💻", color: "from-indigo-500 to-purple-600", roles: 215, description: "IT, AI, Robotics, Construction", subCategories: ["Software", "AI/ML", "Robotics", "Hardware"] },
  { id: "transport", name: "Transport", icon: "✈️", color: "from-sky-500 to-blue-600", roles: 68, description: "Land, Water, Air, Space", subCategories: ["Aviation", "Shipping", "Logistics", "Space"] },
  { id: "art", name: "Art", icon: "🎨", color: "from-fuchsia-500 to-pink-600", roles: 73, description: "Design, Digital, Creative", subCategories: ["Fine Arts", "Digital Design", "Fashion", "Media"] },
  { id: "education", name: "Education", icon: "📚", color: "from-teal-500 to-cyan-600", roles: 89, description: "Teaching, Training, Psychology", subCategories: ["Schools", "Universities", "Training Centers", "Counseling"] },
  { id: "finance", name: "Finance", icon: "💰", color: "from-yellow-500 to-orange-600", roles: 98, description: "Banking, Investment, Entrepreneurship", subCategories: ["Banking", "Investment", "Accounting", "Entrepreneurship"] }
];

const TOTAL_ROLES = CLUSTERS.reduce((sum, c) => sum + c.roles, 0);

const FEATURED_ROLES = [
  { title: "Nuclear Engineer", cluster: "Science", level: "L3-L5", demand: "Very High", salary: "₹75K-1.4L", aiImpact: 85 },
  { title: "AI/ML Engineer", cluster: "Technology", level: "L2-L5", demand: "Critical", salary: "₹1L-3L", aiImpact: 95 },
  { title: "Data Scientist", cluster: "Technology", level: "L2-L4", demand: "High", salary: "₹80K-2L", aiImpact: 90 },
  { title: "Healthcare Administrator", cluster: "Health", level: "L3-L4", demand: "High", salary: "₹60K-1.2L", aiImpact: 70 },
  { title: "Renewable Energy Specialist", cluster: "Science", level: "L2-L4", demand: "High", salary: "₹50K-1L", aiImpact: 75 },
  { title: "Robotics Engineer", cluster: "Technology", level: "L3-L5", demand: "Critical", salary: "₹90K-2.5L", aiImpact: 92 }
];

export default function WorldWheelPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("clusters");

  const filteredClusters = CLUSTERS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-xl">World Wheel</h1>
            <p className="text-white/70 text-sm">12 Clusters × 1000+ Roles</p>
          </div>
          <Badge className="bg-white/20 text-white border-0">
            <Globe className="w-3 h-3 mr-1" /> Global
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{CLUSTERS.length}</p>
            <p className="text-white/60 text-xs">Clusters</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{TOTAL_ROLES}+</p>
            <p className="text-white/60 text-xs">Job Roles</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">L1-L5</p>
            <p className="text-white/60 text-xs">Levels</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">7I</p>
            <p className="text-white/60 text-xs">Framework</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <Input 
            placeholder="Search clusters, roles, skills..." 
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 bg-white/5">
            <TabsTrigger value="clusters" className="data-[state=active]:bg-white/10">Clusters</TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-white/10">Trending</TabsTrigger>
            <TabsTrigger value="ai-ready" className="data-[state=active]:bg-white/10">AI-Ready</TabsTrigger>
          </TabsList>

          {/* Clusters Tab */}
          <TabsContent value="clusters" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {filteredClusters.map((cluster) => (
                <button
                  key={cluster.id}
                  onClick={() => navigate(`/cluster/${cluster.id}`)}
                  className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 text-left hover:bg-white/10 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cluster.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                    {cluster.icon}
                  </div>
                  <h3 className="font-semibold text-white mb-1">{cluster.name}</h3>
                  <p className="text-white/50 text-xs mb-2">{cluster.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-white/10 text-white/70 border-0 text-xs">
                      {cluster.roles} roles
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60" />
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          {/* Trending Tab */}
          <TabsContent value="trending" className="mt-4 space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h3 className="font-semibold text-white">Fastest Growing Roles 2025-26</h3>
            </div>
            {FEATURED_ROLES.map((role, i) => (
              <Card key={i} className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{role.title}</h4>
                    <Badge className={`border-0 ${
                      role.demand === 'Critical' ? 'bg-red-500/20 text-red-400' :
                      role.demand === 'Very High' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {role.demand}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-white/50">{role.cluster}</span>
                    <span className="text-white/30">|</span>
                    <span className="text-white/50">{role.level}</span>
                    <span className="text-white/30">|</span>
                    <span className="text-green-400">{role.salary}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* AI-Ready Tab */}
          <TabsContent value="ai-ready" className="mt-4">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold text-white">Human-AI-Robo Ready Roles</h3>
            </div>
            <p className="text-white/50 text-sm mb-4">
              Roles requiring AI collaboration skills. Higher % = More AI integration needed.
            </p>
            {FEATURED_ROLES.sort((a, b) => b.aiImpact - a.aiImpact).map((role, i) => (
              <Card key={i} className="bg-white/5 border-white/10 mb-3">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{role.title}</h4>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">{role.aiImpact}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                      style={{ width: `${role.aiImpact}%` }}
                    />
                  </div>
                  <p className="text-white/40 text-xs mt-2">AI Collaboration Index</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* 7I Framework Banner */}
      <div className="px-4 py-4">
        <Card className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-white">7I Framework</h3>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {["Individual", "Industry", "Institutions", "India", "International", "Impact", "Innovation"].map((item, i) => (
                <Badge key={i} className="bg-white/10 text-white/70 border-0">
                  {i + 1}. {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Work Wheel CTA */}
      <div className="px-4 py-4 pb-8">
        <Button 
          className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-600 text-lg font-semibold"
          onClick={() => navigate("/work-wheel")}
        >
          <Brain className="mr-2" /> Explore Work Wheel (Human-AI-Robo)
        </Button>
      </div>
    </div>
  );
}
