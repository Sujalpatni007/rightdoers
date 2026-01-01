import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "@/App";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Rocket,
  Target,
  Trophy,
  Zap,
  Clock,
  Users,
  TrendingUp,
  ArrowLeft,
  RefreshCw,
  Star,
  Activity,
  Building2,
  Handshake,
  Briefcase,
  UserCircle,
  Palette,
  Link2,
  Bot,
  Flame,
  Award,
  ChevronRight,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Vertical icons mapping
const VERTICAL_ICONS = {
  B2G: Building2,
  B2A: Handshake,
  B2B: Briefcase,
  B2C: UserCircle,
  B2D: Palette,
  D2D: Link2,
  A2A: Bot,
};

export default function MissionBoard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [missionData, setMissionData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  const fetchData = useCallback(async () => {
    try {
      const [missionRes, activityRes, leaderboardRes] = await Promise.all([
        axios.get(`${API}/captain/mission-board`),
        axios.get(`${API}/captain/mission-board/activity`),
        axios.get(`${API}/captain/mission-board/leaderboard`),
      ]);
      setMissionData(missionRes.data);
      setActivities(activityRes.data.activities || []);
      setLeaderboard(leaderboardRes.data.leaderboard || []);
    } catch (error) {
      console.error("Error fetching mission data:", error);
      toast.error("Failed to load mission board");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Countdown timer
  useEffect(() => {
    if (!missionData?.launch_date) return;
    
    const updateCountdown = () => {
      const launch = new Date(missionData.launch_date);
      const now = new Date();
      const diff = launch - now;
      
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [missionData?.launch_date]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    toast.success("Mission board refreshed");
  };

  const getStatusGlow = (status) => {
    switch (status) {
      case "LAUNCH_READY": return "shadow-[0_0_30px_rgba(0,255,136,0.5)]";
      case "FINAL_PREP": return "shadow-[0_0_25px_rgba(34,197,94,0.4)]";
      case "ON_TRACK": return "shadow-[0_0_20px_rgba(234,179,8,0.4)]";
      case "ACCELERATE": return "shadow-[0_0_20px_rgba(249,115,22,0.4)]";
      default: return "shadow-[0_0_15px_rgba(239,68,68,0.4)]";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#00ff88]/30 rounded-full animate-ping"></div>
            <div className="absolute inset-4 border-4 border-[#00ff88]/50 rounded-full animate-pulse"></div>
            <Rocket className="absolute inset-8 w-16 h-16 text-[#00ff88] animate-bounce" />
          </div>
          <p className="text-[#00ff88] font-mono text-xl tracking-wider">LOADING MISSION BOARD...</p>
          <p className="text-[#64748b] font-mono text-sm mt-2">Dubai Launch T-minus</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] text-white overflow-hidden" data-testid="mission-board">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00ff88]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-[#0a1628] via-[#1a2744] to-[#0a1628] border-b border-[#00ff88]/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/command-centre")}
              className="text-[#00ff88] hover:bg-[#00ff88]/10"
              data-testid="back-button"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <Rocket className="w-8 h-8 text-[#00ff88]" />
                <h1 className="text-2xl font-bold font-mono tracking-wider">MISSION BOARD</h1>
              </div>
              <p className="text-[#64748b] text-sm font-mono">{missionData?.launch_target}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="text-[#00ff88] hover:bg-[#00ff88]/10 font-mono"
              disabled={refreshing}
              data-testid="refresh-btn"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              REFRESH
            </Button>
            <div className="text-right">
              <p className="text-[#64748b] text-xs font-mono">MISSION STATUS</p>
              <Badge 
                className="font-mono font-bold animate-pulse"
                style={{ backgroundColor: `${missionData?.status_color}30`, color: missionData?.status_color }}
                data-testid="mission-status-badge"
              >
                {missionData?.mission_status}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        {/* Countdown Timer */}
        <div className={`mb-8 p-6 rounded-2xl bg-gradient-to-r from-[#1a2744] to-[#0a1628] border border-[#00ff88]/30 ${getStatusGlow(missionData?.mission_status)}`} data-testid="countdown-section">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#00ff88]/20 flex items-center justify-center">
                <Flame className="w-8 h-8 text-[#00ff88] animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-mono text-[#00ff88]">DUBAI GLOBAL LAUNCH</h2>
                <p className="text-[#64748b] text-sm font-mono">T-MINUS COUNTDOWN</p>
              </div>
            </div>
            
            {/* Countdown Numbers */}
            <div className="flex gap-4" data-testid="countdown-timer">
              {[
                { value: countdown.days, label: "DAYS" },
                { value: countdown.hours, label: "HRS" },
                { value: countdown.mins, label: "MIN" },
                { value: countdown.secs, label: "SEC" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 rounded-lg bg-[#0a1628] border border-[#00ff88]/30 flex items-center justify-center">
                    <span className="text-2xl font-bold font-mono text-[#00ff88]">
                      {String(item.value).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="text-[#64748b] text-xs font-mono mt-1">{item.label}</p>
                </div>
              ))}
            </div>
            
            {/* Launch Readiness */}
            <div className="text-center">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#1a2744" strokeWidth="8" fill="none" />
                  <circle
                    cx="48" cy="48" r="40"
                    stroke={missionData?.status_color}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(missionData?.launch_readiness_percent || 0) * 2.51} 251`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold font-mono" style={{ color: missionData?.status_color }}>
                    {missionData?.launch_readiness_percent}%
                  </span>
                </div>
              </div>
              <p className="text-[#64748b] text-xs font-mono mt-1">LAUNCH READY</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Verticals Progress - Left Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-mono flex items-center gap-2">
                <Target className="w-5 h-5 text-[#00ff88]" />
                7 VERTICALS STATUS
              </h3>
              <Badge className="bg-[#00ff88]/20 text-[#00ff88] font-mono">
                {missionData?.verticals_ready}/{missionData?.verticals_total} READY
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {missionData?.verticals_progress?.map((vertical) => {
                const IconComponent = VERTICAL_ICONS[vertical.code] || Target;
                return (
                  <Card
                    key={vertical.code}
                    className={`bg-[#1a2744]/80 border-l-4 transition-all hover:scale-[1.02] ${
                      vertical.is_orbit ? "border-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.3)]" : ""
                    }`}
                    style={{ borderLeftColor: vertical.color }}
                    data-testid={`vertical-progress-${vertical.code}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${vertical.color}30` }}
                          >
                            <IconComponent className="w-4 h-4" style={{ color: vertical.color }} />
                          </div>
                          <div>
                            <p className="font-mono font-bold text-sm">{vertical.code}</p>
                            <p className="text-[#64748b] text-xs">{vertical.name}</p>
                          </div>
                        </div>
                        {vertical.is_orbit ? (
                          <Badge className="bg-[#00ff88] text-[#0a1628] font-mono text-xs animate-pulse">
                            🚀 ORBIT
                          </Badge>
                        ) : (
                          <span className="text-lg font-bold font-mono" style={{ color: vertical.color }}>
                            {vertical.readiness_percent}%
                          </span>
                        )}
                      </div>
                      
                      <Progress
                        value={vertical.readiness_percent}
                        className="h-2 mb-2"
                        style={{ "--progress-color": vertical.color }}
                      />
                      
                      <div className="flex items-center justify-between text-xs">
                        {vertical.leader_name ? (
                          <span className="text-[#00ff88] flex items-center gap-1">
                            <UserCircle className="w-3 h-3" />
                            {vertical.leader_name}
                          </span>
                        ) : (
                          <span className="text-amber-500">⚠️ No Leader</span>
                        )}
                        {vertical.team_size > 0 && (
                          <span className="text-[#64748b] flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {vertical.team_size}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Right Column - Leaderboard & Activity */}
          <div className="space-y-4">
            {/* Leaderboard */}
            <Card className="bg-[#1a2744] border-[#00ff88]/30" data-testid="leaderboard-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-mono flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  VERTICAL LEADERBOARD
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard.slice(0, 5).map((v, i) => (
                    <div
                      key={v.code}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        i === 0 ? "bg-amber-500/10 border border-amber-500/30" : "bg-[#0a1628]"
                      }`}
                      data-testid={`leaderboard-${v.code}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{v.badge}</span>
                        <span className="font-mono text-sm">{v.code}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={v.readiness_percent} className="w-16 h-2" />
                        <span className="font-mono text-xs" style={{ color: v.color }}>
                          {v.readiness_percent}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card className="bg-[#1a2744] border-[#00ff88]/30" data-testid="activity-feed-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-mono flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#00ff88]" />
                  LIVE ACTIVITY
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[280px]">
                  <div className="space-y-3">
                    {activities.length > 0 ? activities.map((activity, i) => (
                      <div
                        key={activity.id || i}
                        className="flex items-start gap-3 p-2 rounded-lg bg-[#0a1628] border-l-2"
                        style={{ borderLeftColor: activity.vertical_color }}
                        data-testid={`activity-${i}`}
                      >
                        <span className="text-lg">{activity.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{activity.title}</p>
                          <p className="text-xs text-[#64748b] truncate">{activity.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs border-[#00ff88]/30 text-[#00ff88]">
                              +{activity.points} pts
                            </Badge>
                            <span className="text-[#64748b] text-xs">
                              {new Date(activity.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-[#64748b]">
                        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No recent activity</p>
                        <p className="text-xs">Assign leaders to get started!</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <Button
            size="lg"
            className="bg-[#00ff88] text-[#0a1628] hover:bg-[#00ff88]/90 font-mono font-bold px-8"
            onClick={() => navigate("/command-centre")}
            data-testid="goto-command-centre-btn"
          >
            <Zap className="w-5 h-5 mr-2" />
            GO TO COMMAND CENTRE
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
}
