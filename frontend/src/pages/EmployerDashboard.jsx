import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Briefcase, 
  Users, 
  TrendingUp, 
  LogOut,
  Building2,
  MapPin,
  ChevronRight,
  Eye,
  Clock,
  Target
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth, API } from "@/App";

const LEVEL_COLORS = {
  L1: "bg-green-500",
  L2: "bg-blue-500",
  L3: "bg-purple-500",
  L4: "bg-amber-500",
};

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API}/jobs/employer/${user.id}`);
      setJobs(res.data);
    } catch (error) {
      console.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const totalApplications = jobs.reduce((acc, job) => acc + (job.applications_count || 0), 0);
  const activeJobs = jobs.filter(j => j.is_active).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-orange-600 to-amber-700 text-white p-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center font-bold text-xl">
              {user?.company_name?.charAt(0) || user?.name?.charAt(0) || "C"}
            </div>
            <div>
              <p className="text-white/70 text-sm">Welcome,</p>
              <h1 className="font-display font-bold text-lg">{user?.company_name || user?.name}</h1>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={handleLogout}
            data-testid="employer-logout-btn"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <Briefcase className="w-6 h-6 mx-auto mb-1" />
            <p className="font-bold text-2xl">{activeJobs}</p>
            <p className="text-white/70 text-xs">Active Jobs</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <Users className="w-6 h-6 mx-auto mb-1" />
            <p className="font-bold text-2xl">{totalApplications}</p>
            <p className="text-white/70 text-xs">Applications</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <Target className="w-6 h-6 mx-auto mb-1" />
            <p className="font-bold text-2xl">0</p>
            <p className="text-white/70 text-xs">Hired</p>
          </div>
        </div>
      </header>

      {/* Post Job Button - Floating */}
      <div className="px-4 -mt-8 relative z-10 mb-6">
        <Button 
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg"
          onClick={() => navigate("/employer/post")}
          data-testid="post-job-btn"
        >
          <Plus className="w-6 h-6 mr-2" /> Post New Job
        </Button>
      </div>

      {/* Jobs List */}
      <div className="px-4 pb-8">
        <h2 className="font-display font-semibold text-slate-900 mb-4">Your Job Postings</h2>
        
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-3">
            {jobs.map((job) => (
              <button
                key={job.id}
                onClick={() => navigate(`/employer/applicants/${job.id}`)}
                className="w-full text-left bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-all"
                data-testid={`employer-job-${job.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{job.title}</h3>
                    <p className="text-sm text-slate-500">{job.division}</p>
                  </div>
                  <Badge className={`${LEVEL_COLORS[job.level]} text-white`}>{job.level}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {job.pincode}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Active
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                      <Users className="w-3 h-3 mr-1" /> {job.applications_count || 0}
                    </Badge>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">No jobs posted yet</h3>
              <p className="text-slate-500 text-sm mb-4">Post your first job to start receiving applications</p>
              <Button onClick={() => navigate("/employer/post")}>
                <Plus className="w-4 h-4 mr-2" /> Post a Job
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tips Card */}
      <div className="px-4 pb-8">
        <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
          <CardContent className="p-5">
            <h3 className="font-display font-semibold text-lg mb-2">💡 Hiring Tip</h3>
            <p className="text-white/80 text-sm">
              Jobs with detailed descriptions and clear requirements get 3x more qualified applicants. 
              Use the AI Assist feature when posting!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
