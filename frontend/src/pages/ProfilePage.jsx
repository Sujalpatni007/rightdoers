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
  Share2,
  QrCode,
  Trophy,
  Target,
  Zap,
  Wallet
} from "lucide-react";
import { toast } from "sonner";
import { useAuth, API } from "@/App";
import BottomNavNew from "@/components/BottomNavNew";
import axios from "axios";

const CLUB_COLORS = {
  "Power Keepers": "from-red-500 to-rose-600",
  "Wellness Seekers": "from-green-500 to-emerald-600",
  "Problem Solvers": "from-blue-500 to-indigo-600",
  "Knowledge Givers": "from-purple-500 to-violet-600",
  "Profit Maximizers": "from-amber-500 to-orange-600",
};

const CLUB_ICONS = {
  "Power Keepers": "🛡️",
  "Wellness Seekers": "💚",
  "Problem Solvers": "🧩",
  "Knowledge Givers": "📚",
  "Profit Maximizers": "💰",
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

  const handleShare = async () => {
    const doersId = `RDW-${user?.pincode || '000000'}-${(user?.division || 'GEN').slice(0, 3).toUpperCase()}-L1`;
    const shareText = `🎯 Check out my DoersID!\n\n📋 ID: ${doersId}\n🏆 PASS Score: ${passScore}/100\n🎪 Club: ${user?.club}\n\nJoin Right Doers World!\n#RightDoers #FutureOfWork`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My DoersID', text: shareText, url: 'https://hi-ai-app.com' });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("DoersID copied to clipboard!");
    }
  };

  const passScore = Math.round(((user?.psy_score || 0) + (user?.skill_score || 0)) / 2);
  const clubColor = CLUB_COLORS[user?.club] || "from-indigo-500 to-purple-600";
  const clubIcon = CLUB_ICONS[user?.club] || "✨";
  const doersId = `RDW-${user?.pincode || '000000'}-${(user?.division || 'GEN').slice(0, 3).toUpperCase()}-L1-${new Date().getFullYear()}`;

  // Calculate level based on score
  const level = passScore >= 80 ? "L2" : "L1";
  const nextLevelScore = level === "L1" ? 80 : 100;
  const levelProgress = (passScore / nextLevelScore) * 100;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className={`bg-gradient-to-br ${clubColor} text-white p-4 pb-28`}>
        <div className="flex items-center justify-between mb-6">
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
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={handleShare}
            data-testid="share-profile-btn"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-4xl font-bold">
            {user?.name?.charAt(0) || "D"}
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">{user?.name || "Doer"}</h2>
            <p className="text-white/70 flex items-center gap-1">
              <Phone className="w-4 h-4" /> +91 {user?.phone}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl">{clubIcon}</span>
              <span className="font-medium">{user?.club || "Member"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* DoersID Card - Floating */}
      <div className="px-4 -mt-16 relative z-10 mb-6">
        <div className="bg-white rounded-2xl shadow-xl p-4 border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-slate-500 text-sm">DoersID</p>
              <p className="font-mono font-bold text-lg text-slate-900">{doersId}</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <QrCode className="w-6 h-6 text-slate-600" />
            </div>
          </div>
          
          {/* PASS Score */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">PASS Score</span>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-2xl text-indigo-600">{passScore}</span>
                <span className="text-slate-400">/100</span>
              </div>
            </div>
            <Progress value={passScore} className="h-2 mb-2" />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Psy: {user?.psy_score || 0}</span>
              <span>Skill: {user?.skill_score || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-slate-900">Level Progress</span>
            </div>
            <Badge className="bg-indigo-100 text-indigo-700">{level} → {level === "L1" ? "L2" : "L3"}</Badge>
          </div>
          <Progress value={levelProgress} className="h-3 mb-2" />
          <p className="text-sm text-slate-500">
            {nextLevelScore - passScore} more points to reach {level === "L1" ? "L2" : "L3"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 border text-center">
            <Briefcase className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="font-bold text-xl text-slate-900">{applications.length}</p>
            <p className="text-xs text-slate-500">Applied</p>
          </div>
          <div className="bg-white rounded-xl p-4 border text-center">
            <Star className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <p className="font-bold text-xl text-slate-900">0</p>
            <p className="text-xs text-slate-500">Interviews</p>
          </div>
          <div className="bg-white rounded-xl p-4 border text-center">
            <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="font-bold text-xl text-slate-900">0</p>
            <p className="text-xs text-slate-500">Offers</p>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-slate-900">Profile Details</h3>
          </div>
          <div className="divide-y">
            <div className="flex items-center justify-between p-4">
              <span className="text-slate-500">Division</span>
              <Badge variant="outline">{user?.division || "Not set"}</Badge>
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-slate-500">Club</span>
              <span className={`bg-gradient-to-r ${clubColor} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                {user?.club || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-slate-500">Location</span>
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-4 h-4 text-slate-400" /> {user?.pincode || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-slate-500">Age Group</span>
              <span className="font-medium">{user?.age_group || "—"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 mb-6">
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
