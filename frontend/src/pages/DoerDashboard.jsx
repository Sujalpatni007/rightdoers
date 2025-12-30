import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Home, 
  Briefcase, 
  Sparkles, 
  User, 
  BookOpen,
  MapPin,
  TrendingUp,
  ChevronRight,
  Building2,
  Clock,
  Bell,
  Award,
  Zap,
  Users,
  Flame
} from "lucide-react";
import axios from "axios";
import { useAuth, API } from "@/App";
import BottomNavNew from "@/components/BottomNavNew";

const LEVEL_INFO = {
  L1: { label: "Entry Level", salary: "₹15K-30K", color: "bg-green-500" },
  L2: { label: "Junior", salary: "₹30K-60K", color: "bg-blue-500" },
  L3: { label: "Mid-Level", salary: "₹60K-1.5L", color: "bg-purple-500" },
  L4: { label: "Expert", salary: "₹1.5L-15L+", color: "bg-amber-500" },
  L5: { label: "NET Talent", salary: "Unicorn", color: "bg-pink-500" },
};

const CLUB_COLORS = {
  "Power Keepers": "from-red-500 to-rose-600",
  "Wellness Seekers": "from-green-500 to-emerald-600",
  "Problem Solvers": "from-blue-500 to-indigo-600",
  "Knowledge Givers": "from-purple-500 to-violet-600",
  "Profit Maximizers": "from-amber-500 to-orange-600",
};

export default function DoerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        axios.get(`${API}/jobs`, { params: { division: user?.division, limit: 5 } }),
        user?.id ? axios.get(`${API}/applications/doer/${user.id}`) : Promise.resolve({ data: [] })
      ]);
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const passScore = Math.round(((user?.psy_score || 0) + (user?.skill_score || 0)) / 2);
  const clubColor = CLUB_COLORS[user?.club] || "from-indigo-500 to-purple-600";
  const doersId = `RDW-${user?.pincode || '000000'}-${(user?.division || 'GEN').slice(0, 3).toUpperCase()}-L1`;
  const ecoinBalance = 1650; // Will be fetched from backend later
  const userStreak = 7;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className={`bg-gradient-to-br ${clubColor} text-white p-4 pb-20 relative`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/70 text-sm">Welcome back,</p>
            <h1 className="font-display text-xl font-bold">{user?.name || "Doer"}</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Streak Badge */}
            <div className="flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full">
              <Flame className="w-4 h-4 text-orange-300" />
              <span className="font-bold text-sm">{userStreak}</span>
            </div>
            <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </button>
            <button 
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
              onClick={() => navigate("/profile")}
              data-testid="profile-btn"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* E-COIN Balance + DoersID Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* E-COIN Balance */}
          <button 
            className="bg-gradient-to-r from-amber-500/30 to-orange-500/30 backdrop-blur rounded-xl p-3 text-left"
            onClick={() => navigate("/ecoin")}
            data-testid="ecoin-balance-btn"
          >
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-yellow-300" />
              <span className="text-xs text-white/70">E-COIN</span>
            </div>
            <p className="font-display font-bold text-xl">{ecoinBalance.toLocaleString()}</p>
            <p className="text-[10px] text-white/50 italic">Energy Balance</p>
          </button>
          
          {/* DoersID Mini */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center font-bold text-xs">
                {user?.name?.charAt(0) || "D"}
              </div>
              <span className="text-xs text-white/60">DoersID</span>
            </div>
            <p className="font-mono text-xs font-semibold truncate">{doersId}</p>
            <Badge className="bg-white/20 text-white border-0 text-[10px] mt-1">L1</Badge>
          </div>
        </div>
      </header>

      {/* PASS Score Card - Floating */}
      <div className="px-4 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-slate-500 text-sm">Your PASS Score</p>
              <div className="flex items-end gap-1">
                <span className="font-display text-4xl font-bold text-slate-900">{passScore}</span>
                <span className="text-slate-400 text-sm pb-1">/100</span>
              </div>
            </div>
            <div className={`w-16 h-16 bg-gradient-to-br ${clubColor} rounded-xl flex items-center justify-center shadow-lg`}>
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
          <Progress value={passScore} className="h-2 mb-3" />
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Psy: {user?.psy_score || 0}</span>
            <span className="text-slate-500">Skill: {user?.skill_score || 0}</span>
            <span className="text-indigo-600 font-medium">Level up at 80+</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Briefcase, label: "Jobs", path: "/jobs", color: "bg-blue-500", testId: "quick-jobs" },
            { icon: Sparkles, label: "AIMEE", path: "/aimee", color: "bg-purple-500", testId: "quick-aimee" },
            { icon: BookOpen, label: "Learn", path: "/learn", color: "bg-green-500", testId: "quick-learn" },
            { icon: TrendingUp, label: "Progress", path: "/profile", color: "bg-orange-500", testId: "quick-progress" },
          ].map((item) => (
            <button 
              key={item.label}
              className="flex flex-col items-center gap-2"
              onClick={() => navigate(item.path)}
              data-testid={item.testId}
            >
              <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-slate-600">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Applications */}
      {applications.length > 0 && (
        <section className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-slate-900">My Applications</h2>
            <Badge variant="outline">{applications.length} active</Badge>
          </div>
          <div className="space-y-2">
            {applications.slice(0, 2).map((app) => (
              <div key={app.id} className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">{app.job?.title || "Job"}</h3>
                    <p className="text-sm text-slate-500">{app.job?.company_name}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">{app.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Jobs For You */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-slate-900">Jobs For You</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/jobs")}
            className="text-indigo-600"
            data-testid="view-all-jobs"
          >
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-3">
            {jobs.map((job) => {
              const levelInfo = LEVEL_INFO[job.level] || LEVEL_INFO.L1;
              return (
                <button
                  key={job.id}
                  className="w-full text-left bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/jobs?selected=${job.id}`)}
                  data-testid={`job-card-${job.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900">{job.title}</h3>
                      <p className="text-sm text-slate-500">{job.company_name}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge className={`${levelInfo.color} text-white text-xs`}>{job.level}</Badge>
                        <span className="text-xs text-indigo-600 font-medium">{levelInfo.salary}</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {job.pincode}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-xl border">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No matching jobs yet</p>
          </div>
        )}
      </section>

      {/* AIMEE CTA */}
      <section className="px-4 mb-6">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-lg">Ask AIMEE</h3>
              <p className="text-white/70 text-sm">Your AI career guide is ready to help</p>
            </div>
            <Button 
              className="bg-white text-indigo-600 hover:bg-white/90"
              onClick={() => navigate("/aimee")}
              data-testid="aimee-cta"
            >
              Chat Now
            </Button>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <BottomNav active="home" />
    </div>
  );
}

// Bottom Navigation Component
export function BottomNav({ active }) {
  const navigate = useNavigate();
  
  const items = [
    { id: "home", icon: Home, label: "Home", path: "/dashboard" },
    { id: "jobs", icon: Briefcase, label: "Jobs", path: "/jobs" },
    { id: "aimee", icon: Sparkles, label: "AIMEE", path: "/aimee" },
    { id: "learn", icon: BookOpen, label: "Learn", path: "/learn" },
    { id: "profile", icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t safe-bottom z-50 shadow-lg">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              active === item.id ? "text-indigo-600" : "text-slate-400"
            }`}
            data-testid={`nav-${item.id}`}
          >
            <item.icon className={`w-6 h-6 ${item.id === "aimee" && active !== "aimee" ? "text-purple-500" : ""}`} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
