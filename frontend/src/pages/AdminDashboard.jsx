import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Briefcase, 
  Building2, 
  TrendingUp,
  LogOut,
  RefreshCw,
  Sparkles,
  MapPin
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth, API } from "@/App";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const CLUB_COLORS = {
    "Power Keepers": "bg-red-500",
    "Wellness Seekers": "bg-green-500",
    "Problem Solvers": "bg-blue-500",
    "Knowledge Givers": "bg-purple-500",
    "Profit Maximizers": "bg-amber-500",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/70 text-sm">Captain Right Doer</p>
            <h1 className="font-display text-xl font-bold">{user?.name || "Admin"}</h1>
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
              onClick={handleLogout}
              data-testid="admin-logout-btn"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/10 rounded-xl p-4">
            <Users className="w-6 h-6 mb-2" />
            <p className="font-bold text-2xl">{stats?.total_doers || 0}</p>
            <p className="text-white/70 text-xs">Total Doers</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <Building2 className="w-6 h-6 mb-2" />
            <p className="font-bold text-2xl">{stats?.total_employers || 0}</p>
            <p className="text-white/70 text-xs">Employers</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <Briefcase className="w-6 h-6 mb-2" />
            <p className="font-bold text-2xl">{stats?.total_jobs || 0}</p>
            <p className="text-white/70 text-xs">Active Jobs</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <TrendingUp className="w-6 h-6 mb-2" />
            <p className="font-bold text-2xl">{stats?.total_applications || 0}</p>
            <p className="text-white/70 text-xs">Applications</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Division Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Doers by Division</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/4 mb-2" />
                    <div className="h-2 bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {stats?.division_stats?.map((div) => {
                  const maxCount = Math.max(...(stats?.division_stats?.map(d => d.count) || [1]));
                  const percentage = maxCount > 0 ? (div.count / maxCount) * 100 : 0;
                  return (
                    <div key={div.division}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">{div.division}</span>
                        <span className="text-sm text-slate-500">{div.count}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Recent Job Postings</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-3 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : stats?.recent_jobs?.length > 0 ? (
              <div className="space-y-3">
                {stats.recent_jobs.map((job) => (
                  <div key={job.id} className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{job.title}</p>
                        <p className="text-sm text-slate-500">{job.company_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{job.level}</Badge>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {job.pincode}
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-0">
                        {job.applications_count || 0} apps
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No recent jobs</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Platform Info */}
        <div className="bg-gradient-to-r from-primary to-pink-500 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <div>
              <h3 className="font-display font-bold text-lg">Right Doers World</h3>
              <p className="text-white/70 text-sm">The Future of Work Platform</p>
            </div>
          </div>
          <p className="text-white/80 text-sm">
            Captain, you're overseeing the ecosystem that connects the right people to the right places. 
            Every match we make is a dream realized.
          </p>
        </div>
      </div>
    </div>
  );
}
