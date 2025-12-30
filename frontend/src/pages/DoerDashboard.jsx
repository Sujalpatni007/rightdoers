import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Home, 
  Briefcase, 
  Sparkles, 
  User, 
  Bell,
  MapPin,
  TrendingUp,
  ChevronRight,
  Building2,
  Clock
} from "lucide-react";
import axios from "axios";
import { useAuth, API } from "@/App";

const LEVEL_INFO = {
  L1: { label: "Entry Level", salary: "₹15K-30K", color: "bg-green-500" },
  L2: { label: "Junior", salary: "₹30K-60K", color: "bg-blue-500" },
  L3: { label: "Mid-Level", salary: "₹60K-1.5L", color: "bg-purple-500" },
  L4: { label: "Expert", salary: "₹1.5L-15L+", color: "bg-amber-500" },
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

  const passScore = ((user?.psy_score || 0) + (user?.skill_score || 0)) / 2;

  return (
    <div className="min-h-screen bg-slate-50 pb-nav">
      {/* Header */}
      <header className="bg-primary text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/70 text-sm">Welcome back,</p>
            <h1 className="font-display text-xl font-bold">{user?.name || "Doer"}</h1>
          </div>
          <button 
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            onClick={() => navigate("/profile")}
            data-testid="profile-btn"
          >
            <User className="w-5 h-5" />
          </button>
        </div>

        {/* PASS Score Card */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm">Your PASS Score</span>
            <Badge className="bg-white/20 text-white border-0">{user?.club || "Member"}</Badge>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="font-display text-3xl font-bold">{Math.round(passScore)}</span>
            <span className="text-white/70 text-sm pb-1">/ 100</span>
          </div>
          <Progress value={passScore} className="h-2 bg-white/20" />
          <div className="flex justify-between mt-2 text-xs text-white/70">
            <span>Psy: {user?.psy_score || 0}</span>
            <span>Skill: {user?.skill_score || 0}</span>
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="px-4 -mt-4 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-4 grid grid-cols-3 gap-4">
          <button 
            className="flex flex-col items-center gap-2 text-center"
            onClick={() => navigate("/jobs")}
            data-testid="quick-jobs-btn"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs font-medium text-slate-600">Find Jobs</span>
          </button>
          <button 
            className="flex flex-col items-center gap-2 text-center"
            onClick={() => navigate("/aimee")}
            data-testid="quick-aimee-btn"
          >
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-6 h-6 text-secondary" />
            </div>
            <span className="text-xs font-medium text-slate-600">Ask AIMEE</span>
          </button>
          <button 
            className="flex flex-col items-center gap-2 text-center"
            onClick={() => navigate("/profile")}
            data-testid="quick-profile-btn"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <span className="text-xs font-medium text-slate-600">My Progress</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Applications */}
        {applications.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-slate-900">My Applications</h2>
              <span className="text-sm text-slate-500">{applications.length} active</span>
            </div>
            <div className="space-y-3">
              {applications.slice(0, 2).map((app) => (
                <div key={app.id} className="bg-white rounded-xl p-4 border shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{app.job?.title || "Job"}</h3>
                      <p className="text-sm text-slate-500">{app.job?.company_name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs capitalize">{app.status}</Badge>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Applied recently
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommended Jobs */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-slate-900">Jobs For You</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/jobs")}
              data-testid="view-all-jobs-btn"
            >
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 border animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} onClick={() => navigate(`/jobs?selected=${job.id}`)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-xl border">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No jobs found for your profile</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => navigate("/jobs")}
              >
                Browse all jobs
              </Button>
            </div>
          )}
        </section>

        {/* AIMEE Prompt */}
        <section className="bg-gradient-to-r from-primary to-pink-500 rounded-xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg mb-1">Need help finding jobs?</h3>
              <p className="text-white/80 text-sm mb-4">
                Chat with AIMEE, your AI career assistant
              </p>
              <Button 
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => navigate("/aimee")}
                data-testid="aimee-prompt-btn"
              >
                Talk to AIMEE
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Navigation */}
      <BottomNav active="home" />
    </div>
  );
}

// Job Card Component
function JobCard({ job, onClick }) {
  const levelInfo = LEVEL_INFO[job.level] || LEVEL_INFO.L1;
  
  return (
    <button 
      className="w-full text-left card-job"
      onClick={onClick}
      data-testid={`job-card-${job.id}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-slate-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">{job.title}</h3>
          <p className="text-sm text-slate-500 truncate">{job.company_name}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge className={`${levelInfo.color} text-white text-xs`}>{job.level}</Badge>
            <span className="text-xs text-slate-500">{levelInfo.salary}</span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {job.pincode}
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
      </div>
    </button>
  );
}

// Bottom Navigation Component
export function BottomNav({ active }) {
  const navigate = useNavigate();
  
  const items = [
    { id: "home", icon: Home, label: "Home", path: "/dashboard" },
    { id: "jobs", icon: Briefcase, label: "Jobs", path: "/jobs" },
    { id: "aimee", icon: Sparkles, label: "AIMEE", path: "/aimee" },
    { id: "profile", icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t safe-bottom z-50">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              active === item.id ? "text-primary" : "text-slate-400"
            }`}
            data-testid={`nav-${item.id}`}
          >
            <item.icon className={`w-6 h-6 ${active === item.id ? "fill-primary/20" : ""}`} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
