import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "@/App";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Shield,
  Users,
  Target,
  Zap,
  ChevronRight,
  Send,
  Radar,
  Award,
  TrendingUp,
  Building2,
  Handshake,
  Briefcase,
  UserCircle,
  Palette,
  Link2,
  Bot,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Radio,
  Activity,
  Rocket,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Military-style color scheme
const MILITARY_THEME = {
  primary: "#0a1628",      // Dark navy
  secondary: "#1a2744",    // Navy blue
  accent: "#00ff88",       // Tactical green
  warning: "#fbbf24",      // Amber
  danger: "#ef4444",       // Red alert
  text: "#e2e8f0",         // Light gray
  muted: "#64748b",        // Slate
};

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

export default function CaptainCommandCentre() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verticals, setVerticals] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [selectedVertical, setSelectedVertical] = useState(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showOnboardingDialog, setShowOnboardingDialog] = useState(false);
  const [assignForm, setAssignForm] = useState({
    leader_name: "",
    leader_phone: "",
    leader_email: "",
    designation: "Vertical Director",
  });
  const [onboardingChat, setOnboardingChat] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [onboardingSession, setOnboardingSession] = useState(null);
  const [kataSystem, setKataSystem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [verticalsRes, metricsRes, kataRes] = await Promise.all([
        axios.get(`${API}/captain/verticals`),
        axios.get(`${API}/captain/dashboard-metrics`),
        axios.get(`${API}/captain/kata-system`),
      ]);
      setVerticals(verticalsRes.data.verticals || []);
      setMetrics(metricsRes.data);
      setKataSystem(kataRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load Command Centre data");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignLeader = async () => {
    if (!assignForm.leader_name || !assignForm.leader_phone) {
      toast.error("Name and phone are required");
      return;
    }

    try {
      const response = await axios.post(`${API}/captain/assign-leader`, {
        vertical: selectedVertical.code,
        ...assignForm,
      });
      
      if (response.data.success) {
        toast.success(`Leader assigned to ${selectedVertical.name}`);
        setShowAssignDialog(false);
        setAssignForm({ leader_name: "", leader_phone: "", leader_email: "", designation: "Vertical Director" });
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to assign leader");
    }
  };

  const startOnboarding = async (vertical) => {
    try {
      const userId = `user_${Date.now()}`;
      const response = await axios.post(`${API}/captain/onboarding/start`, {
        user_id: userId,
        user_name: vertical.leader?.leader_name || "New Leader",
        vertical: vertical.code,
      });
      
      if (response.data.success) {
        setOnboardingSession(response.data);
        setOnboardingChat([
          { role: "assistant", content: response.data.welcome_message, source: "cached" },
          { role: "assistant", content: `**First Mission:** ${response.data.first_task}`, source: "cached" },
          { role: "assistant", content: `💡 **Pro Tip:** ${response.data.tips}`, source: "cached" },
        ]);
        setSelectedVertical(vertical);
        setShowOnboardingDialog(true);
      }
    } catch (error) {
      toast.error("Failed to start onboarding");
    }
  };

  const sendOnboardingMessage = async () => {
    if (!chatInput.trim() || !onboardingSession) return;

    const userMessage = chatInput;
    setChatInput("");
    setOnboardingChat(prev => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await axios.post(`${API}/captain/onboarding/chat`, {
        session_id: onboardingSession.session_id,
        message: userMessage,
        use_ai: true,
      });
      
      setOnboardingChat(prev => [...prev, {
        role: "assistant",
        content: response.data.response,
        source: response.data.source,
        isOfflineCapable: response.data.is_offline_capable,
      }]);
    } catch (error) {
      // Fallback to cached response
      setOnboardingChat(prev => [...prev, {
        role: "assistant",
        content: "I'm here to guide you through your onboarding. Ask about your first task, kata progress, or tips for success.",
        source: "offline_fallback",
        isOfflineCapable: true,
      }]);
    }
  };

  const getStatusBadge = (vertical) => {
    if (vertical.leader) {
      const status = vertical.leader.onboarding_status;
      if (status === "orbit") {
        return <Badge className="bg-green-500 text-white" data-testid={`status-${vertical.code}-orbit`}>🎖️ ORBIT</Badge>;
      } else if (status === "in_progress") {
        return <Badge className="bg-amber-500 text-white" data-testid={`status-${vertical.code}-progress`}>⏳ ONBOARDING</Badge>;
      }
      return <Badge className="bg-blue-500 text-white" data-testid={`status-${vertical.code}-assigned`}>✓ ASSIGNED</Badge>;
    }
    return <Badge variant="outline" className="border-amber-500 text-amber-500" data-testid={`status-${vertical.code}-vacant`}>VACANT</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#00ff88]/30 rounded-full animate-ping"></div>
            <div className="absolute inset-2 border-4 border-[#00ff88]/50 rounded-full animate-pulse"></div>
            <Radar className="absolute inset-4 w-16 h-16 text-[#00ff88] animate-spin" style={{ animationDuration: "3s" }} />
          </div>
          <p className="text-[#00ff88] font-mono text-lg">INITIALIZING COMMAND CENTRE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] text-white" data-testid="captain-command-centre">
      {/* Header - Military Command Style */}
      <header className="bg-gradient-to-r from-[#0a1628] via-[#1a2744] to-[#0a1628] border-b border-[#00ff88]/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/welcome")}
              className="text-[#00ff88] hover:bg-[#00ff88]/10"
              data-testid="back-button"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-[#00ff88]" />
                <h1 className="text-2xl font-bold font-mono tracking-wider">CAPTAIN COMMAND CENTRE</h1>
              </div>
              <p className="text-[#64748b] text-sm font-mono">DOERS TRINITY | HUMAN + AI + ROBO</p>
            </div>
          </div>
          
          {/* Status Indicators */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse"></div>
              <span className="text-[#00ff88] font-mono text-sm">SYSTEMS ONLINE</span>
            </div>
            <div className="text-right">
              <p className="text-[#64748b] text-xs font-mono">MISSION STATUS</p>
              <p className="text-[#00ff88] font-bold font-mono">{metrics?.mission_status || "OPERATIONAL"}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Command Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#1a2744] border-[#00ff88]/30" data-testid="metric-verticals">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#64748b] text-xs font-mono">VERTICALS</p>
                  <p className="text-3xl font-bold text-[#00ff88]">{metrics?.metrics?.total_verticals || 7}</p>
                </div>
                <Target className="w-8 h-8 text-[#00ff88]/50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1a2744] border-[#00ff88]/30" data-testid="metric-leaders">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#64748b] text-xs font-mono">LEADERS ASSIGNED</p>
                  <p className="text-3xl font-bold text-[#00ff88]">{metrics?.metrics?.leaders_assigned || 0}</p>
                </div>
                <Users className="w-8 h-8 text-[#00ff88]/50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1a2744] border-[#00ff88]/30" data-testid="metric-onboarding">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#64748b] text-xs font-mono">ONBOARDING</p>
                  <p className="text-3xl font-bold text-amber-500">{metrics?.metrics?.onboarding_in_progress || 0}</p>
                </div>
                <Clock className="w-8 h-8 text-amber-500/50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1a2744] border-[#00ff88]/30" data-testid="metric-health">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#64748b] text-xs font-mono">HEALTH SCORE</p>
                  <p className="text-3xl font-bold text-[#00ff88]">{metrics?.metrics?.health_score || 0}%</p>
                </div>
                <Activity className="w-8 h-8 text-[#00ff88]/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 7 Business Verticals Grid */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Radio className="w-5 h-5 text-[#00ff88]" />
            <h2 className="text-xl font-bold font-mono">7 BUSINESS VERTICALS</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {verticals.map((vertical) => {
              const IconComponent = VERTICAL_ICONS[vertical.code] || Target;
              return (
                <Card
                  key={vertical.code}
                  className="bg-[#1a2744] border-[#00ff88]/20 hover:border-[#00ff88]/50 transition-all cursor-pointer group"
                  style={{ borderLeftColor: vertical.color, borderLeftWidth: "4px" }}
                  onClick={() => setSelectedVertical(vertical)}
                  data-testid={`vertical-card-${vertical.code}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${vertical.color}20` }}
                        >
                          <IconComponent className="w-5 h-5" style={{ color: vertical.color }} />
                        </div>
                        <div>
                          <CardTitle className="text-base font-mono">{vertical.code}</CardTitle>
                          <p className="text-xs text-[#64748b]">{vertical.name}</p>
                        </div>
                      </div>
                      {getStatusBadge(vertical)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[#64748b] mb-3">{vertical.mission}</p>
                    
                    {vertical.leader ? (
                      <div className="bg-[#0a1628] rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <UserCircle className="w-4 h-4 text-[#00ff88]" />
                          <span className="text-sm font-medium">{vertical.leader.leader_name}</span>
                        </div>
                        <p className="text-xs text-[#64748b]">{vertical.leader.designation}</p>
                        <div className="mt-2 flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-[#00ff88]/10 text-[#00ff88] hover:bg-[#00ff88]/20 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              startOnboarding(vertical);
                            }}
                            data-testid={`onboarding-btn-${vertical.code}`}
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            ONBOARD
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        className="w-full bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/30"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVertical(vertical);
                          setShowAssignDialog(true);
                        }}
                        data-testid={`assign-btn-${vertical.code}`}
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        ASSIGN LEADER
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Kata System Overview */}
        {kataSystem && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-[#00ff88]" />
              <h2 className="text-xl font-bold font-mono">16-KATA ONBOARDING SYSTEM</h2>
              <span className="text-xs text-[#64748b] font-mono">Inspired by Varun Mayya</span>
            </div>
            
            <Card className="bg-[#1a2744] border-[#00ff88]/30" data-testid="kata-system-card">
              <CardContent className="p-6">
                <p className="text-[#64748b] mb-4 italic">"{kataSystem.philosophy}"</p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Object.entries(kataSystem.katas).map(([num, kata]) => (
                    <div
                      key={num}
                      className="bg-[#0a1628] rounded-lg p-4 border border-[#00ff88]/20"
                      data-testid={`kata-${num}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#00ff88]/20 flex items-center justify-center">
                          <span className="text-[#00ff88] font-bold font-mono">{num}</span>
                        </div>
                        <div>
                          <h4 className="font-mono font-bold text-sm">{kata.name}</h4>
                          <p className="text-xs text-[#64748b]">{kata.duration}</p>
                        </div>
                      </div>
                      <ul className="text-xs text-[#64748b] space-y-1">
                        {kata.objectives.slice(0, 2).map((obj, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <ChevronRight className="w-3 h-3 mt-0.5 text-[#00ff88]" />
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-[#00ff88]/10 rounded-lg border border-[#00ff88]/30">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#00ff88]" />
                    <span className="font-mono font-bold text-[#00ff88]">ORBIT STATUS</span>
                  </div>
                  <p className="text-sm text-[#64748b] mt-1">{kataSystem.orbit_definition}</p>
                  <p className="text-xs text-[#00ff88] mt-1">Target: {kataSystem.total_duration}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Assign Leader Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="bg-[#1a2744] border-[#00ff88]/30 text-white max-w-md" data-testid="assign-leader-dialog">
          <DialogHeader>
            <DialogTitle className="font-mono flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#00ff88]" />
              ASSIGN VERTICAL LEADER
            </DialogTitle>
            <DialogDescription className="text-[#64748b]">
              {selectedVertical?.name} ({selectedVertical?.code})
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-xs font-mono text-[#64748b]">LEADER NAME *</label>
              <Input
                value={assignForm.leader_name}
                onChange={(e) => setAssignForm({ ...assignForm, leader_name: e.target.value })}
                placeholder="Enter leader name"
                className="bg-[#0a1628] border-[#00ff88]/30 text-white mt-1"
                data-testid="leader-name-input"
              />
            </div>
            
            <div>
              <label className="text-xs font-mono text-[#64748b]">PHONE NUMBER *</label>
              <Input
                value={assignForm.leader_phone}
                onChange={(e) => setAssignForm({ ...assignForm, leader_phone: e.target.value })}
                placeholder="+91 XXXXXXXXXX"
                className="bg-[#0a1628] border-[#00ff88]/30 text-white mt-1"
                data-testid="leader-phone-input"
              />
            </div>
            
            <div>
              <label className="text-xs font-mono text-[#64748b]">EMAIL (Optional)</label>
              <Input
                value={assignForm.leader_email}
                onChange={(e) => setAssignForm({ ...assignForm, leader_email: e.target.value })}
                placeholder="leader@example.com"
                className="bg-[#0a1628] border-[#00ff88]/30 text-white mt-1"
                data-testid="leader-email-input"
              />
            </div>
            
            <div>
              <label className="text-xs font-mono text-[#64748b]">DESIGNATION</label>
              <Input
                value={assignForm.designation}
                onChange={(e) => setAssignForm({ ...assignForm, designation: e.target.value })}
                placeholder="Vertical Director"
                className="bg-[#0a1628] border-[#00ff88]/30 text-white mt-1"
                data-testid="leader-designation-input"
              />
            </div>
            
            <Button
              onClick={handleAssignLeader}
              className="w-full bg-[#00ff88] text-[#0a1628] hover:bg-[#00ff88]/90 font-mono font-bold"
              data-testid="confirm-assign-btn"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              CONFIRM ASSIGNMENT
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Onboarding Dialog */}
      <Dialog open={showOnboardingDialog} onOpenChange={setShowOnboardingDialog}>
        <DialogContent className="bg-[#1a2744] border-[#00ff88]/30 text-white max-w-2xl max-h-[80vh]" data-testid="onboarding-dialog">
          <DialogHeader>
            <DialogTitle className="font-mono flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#00ff88]" />
              AI ONBOARDING KIT - {selectedVertical?.code}
            </DialogTitle>
            <DialogDescription className="text-[#64748b]">
              Hybrid Mode: AI when online, cached responses when offline
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {onboardingChat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === "user"
                        ? "bg-[#00ff88]/20 text-white"
                        : "bg-[#0a1628] border border-[#00ff88]/30"
                    }`}
                    data-testid={`chat-message-${idx}`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    {msg.source && (
                      <div className="flex items-center gap-1 mt-2">
                        {msg.isOfflineCapable && (
                          <Badge variant="outline" className="text-xs border-[#00ff88]/30 text-[#00ff88]">
                            📱 Offline Ready
                          </Badge>
                        )}
                        <span className="text-xs text-[#64748b]">
                          {msg.source === "cached" ? "💾 Cached" : msg.source === "ai_fallback" ? "🤖 AI" : "📡 Live"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2 mt-4">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendOnboardingMessage()}
              placeholder="Ask about your mission, first task, or kata progress..."
              className="bg-[#0a1628] border-[#00ff88]/30 text-white"
              data-testid="onboarding-chat-input"
            />
            <Button
              onClick={sendOnboardingMessage}
              className="bg-[#00ff88] text-[#0a1628] hover:bg-[#00ff88]/90"
              data-testid="send-chat-btn"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
