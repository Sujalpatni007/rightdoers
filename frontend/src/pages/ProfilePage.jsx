import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  MapPin, 
  Phone, 
  LogOut, 
  ChevronRight,
  Award,
  Briefcase,
  Star,
  Settings,
  ArrowLeft,
  Edit
} from "lucide-react";
import { toast } from "sonner";
import { useAuth, API } from "@/App";
import { BottomNav } from "./DoerDashboard";
import axios from "axios";

const CLUB_COLORS = {
  "Power Keepers": "club-power",
  "Wellness Seekers": "club-wellness",
  "Problem Solvers": "club-problem",
  "Knowledge Givers": "club-knowledge",
  "Profit Maximizers": "club-profit",
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (user?.id && user?.role === "doer") {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${API}/applications/doer/${user.id}`);
      setApplications(res.data);
    } catch (error) {
      console.error("Failed to fetch applications");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const passScore = ((user?.psy_score || 0) + (user?.skill_score || 0)) / 2;

  return (
    <div className="min-h-screen bg-slate-50 pb-nav">
      {/* Header */}
      <header className="bg-primary text-white p-4">
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
            data-testid="profile-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-xl font-bold">Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
              {user?.name?.charAt(0) || "D"}
            </div>
            <div className="flex-1">
              <h2 className="font-display text-xl font-bold">{user?.name || "Doer"}</h2>
              <p className="text-white/70 text-sm flex items-center gap-1">
                <Phone className="w-4 h-4" /> +91 {user?.phone}
              </p>
              {user?.pincode && (
                <p className="text-white/70 text-sm flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {user.pincode}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* PASS Score Card */}
        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-lg text-slate-900">PASS Score</h3>
              <p className="text-sm text-slate-500">Your career potential score</p>
            </div>
            <div className="text-right">
              <span className="font-display text-3xl font-bold text-primary">{Math.round(passScore)}</span>
              <span className="text-slate-400">/100</span>
            </div>
          </div>
          <Progress value={passScore} className="h-3 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500">Psychological</p>
              <p className="font-semibold text-slate-900">{user?.psy_score || 0}/100</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500">Skill Level</p>
              <p className="font-semibold text-slate-900">{user?.skill_score || 0}/100</p>
            </div>
          </div>
        </div>

        {/* Division & Club */}
        {user?.division && (
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <h3 className="font-display font-semibold text-lg text-slate-900 mb-4">Your Identity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Division</span>
                <Badge variant="outline">{user.division}</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Talent Club</span>
                <span className={`${CLUB_COLORS[user.club] || "bg-primary"} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                  {user.club}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-slate-500">DoersID</span>
                <span className="font-mono text-sm text-slate-700">{user.id?.slice(0, 8).toUpperCase()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 border text-center">
            <Briefcase className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="font-semibold text-slate-900">{applications.length}</p>
            <p className="text-xs text-slate-500">Applications</p>
          </div>
          <div className="bg-white rounded-xl p-4 border text-center">
            <Star className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-900">0</p>
            <p className="text-xs text-slate-500">Interviews</p>
          </div>
          <div className="bg-white rounded-xl p-4 border text-center">
            <Award className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="font-semibold text-slate-900">0</p>
            <p className="text-xs text-slate-500">Offers</p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-slate-400" />
              <span className="text-slate-900">Settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
          <Separator />
          <button 
            className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors text-red-600"
            onClick={handleLogout}
            data-testid="logout-btn"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>

      <BottomNav active="profile" />
    </div>
  );
}
