import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Users, 
  Heart,
  BookOpen,
  DollarSign,
  Brain,
  Target,
  TrendingUp,
  Star,
  MessageCircle,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  Award,
  GraduationCap,
  Briefcase,
  Music,
  Calculator,
  RefreshCw,
  AlertCircle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useAuth, API } from "@/App";
import axios from "axios";

// Icon mapping for dynamic needs
const ICON_MAP = {
  DollarSign,
  TrendingUp,
  Target,
  BookOpen,
  Briefcase,
  Heart,
  Calculator,
  Music,
  Brain,
  Star
};

// Default MIG FAMILY DATA - "One Family, Different Dreams" (fallback)
const DEFAULT_FAMILY_MEMBERS = [
  {
    id: "father",
    name: "ತಂದೆ (Father)",
    nameEn: "Father",
    role: "Provider & Planner",
    avatar: "👨",
    color: "#3B82F6",
    needs: [
      { id: "finance", name: "Financial Guide", nameKn: "ಆರ್ಥಿಕ ಮಾರ್ಗದರ್ಶಿ", icon: DollarSign, progress: 65, status: "active" },
      { id: "enhance", name: "Wealth Enhancer", nameKn: "ಸಂಪತ್ತು ವರ್ಧಕ", icon: TrendingUp, progress: 45, status: "pending" },
      { id: "track", name: "Investment Tracker", nameKn: "ಹೂಡಿಕೆ ಟ್ರ್ಯಾಕರ್", icon: Target, progress: 80, status: "active" }
    ],
    doersScore: 720,
    currentGoal: "Retirement Planning",
    nextAction: "Review mutual fund portfolio"
  },
  {
    id: "mother",
    name: "ತಾಯಿ (Mother)",
    nameEn: "Mother",
    role: "Nurturer & Learner",
    avatar: "👩",
    color: "#EC4899",
    needs: [
      { id: "upskill", name: "Upskilling Assistant", nameKn: "ಕೌಶಲ್ಯ ಸಹಾಯಕ", icon: BookOpen, progress: 55, status: "active" },
      { id: "career", name: "Career Restart", nameKn: "ವೃತ್ತಿ ಮರುಪ್ರಾರಂಭ", icon: Briefcase, progress: 30, status: "pending" },
      { id: "wellness", name: "Wellness Coach", nameKn: "ಆರೋಗ್ಯ ತರಬೇತುದಾರ", icon: Heart, progress: 70, status: "active" }
    ],
    doersScore: 680,
    currentGoal: "Learn Digital Marketing",
    nextAction: "Complete Module 3 of course"
  },
  {
    id: "daughter",
    name: "ಮಗಳು (Daughter)",
    nameEn: "Daughter",
    role: "First Student • Bharatanatyam Dancer",
    avatar: "👧",
    color: "#8B5CF6",
    isFirstStudent: true,
    needs: [
      { id: "therapy", name: "AI Therapist", nameKn: "AI ಚಿಕಿತ್ಸಕ", icon: Heart, progress: 40, status: "active" },
      { id: "maths", name: "Maths Tutor", nameKn: "ಗಣಿತ ಶಿಕ್ಷಕ", icon: Calculator, progress: 75, status: "active" },
      { id: "dance", name: "Dance Coach", nameKn: "ನೃತ್ಯ ತರಬೇತುದಾರ", icon: Music, progress: 90, status: "completed" }
    ],
    doersScore: 810,
    currentGoal: "Score 90% in Maths",
    nextAction: "Practice Algebra Chapter 5"
  }
];

// Default Family Goals
const DEFAULT_FAMILY_GOALS = [
  { id: 1, title: "Dubai Vacation 2026", progress: 35, target: "₹3,00,000", saved: "₹1,05,000" },
  { id: 2, title: "Daughter's Higher Education", progress: 20, target: "₹15,00,000", saved: "₹3,00,000" },
  { id: 3, title: "Home Renovation", progress: 60, target: "₹5,00,000", saved: "₹3,00,000" }
];

// Transform backend family data to frontend format
const transformBackendFamily = (backendFamily) => {
  if (!backendFamily) return null;
  
  const roleColors = {
    father: "#3B82F6",
    mother: "#EC4899",
    daughter: "#8B5CF6",
    son: "#22C55E"
  };
  
  const roleIcons = {
    father: "👨",
    mother: "👩",
    daughter: "👧",
    son: "👦"
  };
  
  // Transform members
  const members = (backendFamily.members || []).map((member, idx) => ({
    id: member.id || member.role || `member-${idx}`,
    name: member.name_regional ? `${member.name_regional} (${member.name})` : member.name,
    nameEn: member.name,
    role: member.role_description || member.role,
    avatar: member.avatar || roleIcons[member.role] || "👤",
    color: member.color || roleColors[member.role] || "#6366F1",
    isFirstStudent: member.is_first_student || false,
    needs: (member.needs || []).map(need => ({
      id: need.id,
      name: need.name,
      nameKn: need.name_regional || need.name,
      icon: ICON_MAP[need.icon_name] || Brain,
      progress: need.progress || 0,
      status: need.status || "pending"
    })),
    doersScore: member.doers_score || 650,
    currentGoal: member.current_goal || "Set a goal",
    nextAction: member.next_action || "Choose your next step"
  }));
  
  // Transform goals
  const goals = (backendFamily.goals || []).map((goal, idx) => ({
    id: goal.id || idx + 1,
    title: goal.title,
    progress: goal.progress || Math.round((goal.saved_amount / goal.target_amount) * 100) || 0,
    target: `₹${(goal.target_amount || 0).toLocaleString('en-IN')}`,
    saved: `₹${(goal.saved_amount || 0).toLocaleString('en-IN')}`
  }));
  
  return {
    id: backendFamily.id,
    name: backendFamily.name,
    familyType: backendFamily.family_type || "MIG",
    familyDoersScore: backendFamily.family_doers_score || 700,
    members: members.length > 0 ? members : DEFAULT_FAMILY_MEMBERS,
    goals: goals.length > 0 ? goals : DEFAULT_FAMILY_GOALS,
    primaryLanguage: backendFamily.primary_language || "en"
  };
};

export default function DoersOneFamily() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedMember, setSelectedMember] = useState("daughter");
  const [language, setLanguage] = useState("kn"); // kn = Kannada, en = English
  const [family, setFamily] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch or create family from backend
  const fetchFamily = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userId = user?.id || localStorage.getItem('rdw_user_id') || 'demo-user';
      
      // Try to get family by user ID (as a member)
      try {
        const response = await axios.get(`${API}/families/user/${userId}`);
        const transformedFamily = transformBackendFamily(response.data);
        setFamily(transformedFamily);
        if (response.data.primary_language) {
          setLanguage(response.data.primary_language === 'en' ? 'en' : 'kn');
        }
        console.log('Family loaded from backend:', response.data.id);
      } catch (fetchError) {
        // Family doesn't exist, create one
        if (fetchError.response?.status === 404) {
          console.log('Family not found, creating new one...');
          const createResponse = await axios.post(`${API}/families`, {
            name: user?.name ? `${user.name}'s Family` : "My Family",
            family_type: "MIG",
            primary_language: "kn",
            members: [
              { name: "Father", name_regional: "ತಂದೆ", role: "father", avatar: "👨", doers_score: 720 },
              { name: "Mother", name_regional: "ತಾಯಿ", role: "mother", avatar: "👩", doers_score: 680 },
              { name: "Daughter", name_regional: "ಮಗಳು", role: "daughter", avatar: "👧", doers_score: 810, is_first_student: true }
            ],
            goals: [
              { title: "Dubai Vacation 2026", target_amount: 300000, saved_amount: 105000 },
              { title: "Higher Education Fund", target_amount: 1500000, saved_amount: 300000 }
            ]
          });
          const transformedFamily = transformBackendFamily(createResponse.data);
          setFamily(transformedFamily);
          toast.success('Your Family Dashboard has been created!');
          console.log('New family created:', createResponse.data.id);
        } else {
          throw fetchError;
        }
      }
    } catch (err) {
      console.error('Failed to fetch/create family:', err);
      setError('Failed to load family data. Using demo data.');
      // Fallback to default data
      setFamily({
        id: 'demo-family',
        name: 'Demo Family',
        familyType: 'MIG',
        familyDoersScore: Math.round(DEFAULT_FAMILY_MEMBERS.reduce((a, m) => a + m.doersScore, 0) / DEFAULT_FAMILY_MEMBERS.length),
        members: DEFAULT_FAMILY_MEMBERS,
        goals: DEFAULT_FAMILY_GOALS,
        primaryLanguage: 'kn'
      });
      toast.warning('Using demo data - backend may be unavailable');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFamily();
  }, [fetchFamily]);

  // Get family members and active member
  const familyMembers = family?.members || DEFAULT_FAMILY_MEMBERS;
  const familyGoals = family?.goals || DEFAULT_FAMILY_GOALS;
  const familyDoersScore = family?.familyDoersScore || Math.round(familyMembers.reduce((a, m) => a + m.doersScore, 0) / familyMembers.length);
  
  const activeMember = familyMembers.find(m => m.id === selectedMember) || familyMembers[0];

  // Set initial selected member when family loads
  useEffect(() => {
    if (family?.members?.length > 0) {
      const firstStudent = family.members.find(m => m.isFirstStudent);
      if (firstStudent) {
        setSelectedMember(firstStudent.id);
      } else {
        setSelectedMember(family.members[0].id);
      }
    }
  }, [family]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Users className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-white text-xl font-bold mb-2">Loading Family Dashboard</h2>
          <p className="text-white/50">Connecting to backend...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => navigate(-1)}
            data-testid="family-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-white font-bold">DOERS ONE</h1>
            <p className="text-purple-400 text-xs">ಒಂದು ಕುಟುಂಬ, ವಿಭಿನ್ನ ಕನಸುಗಳು</p>
            <p className="text-white/50 text-[10px]">One Family, Different Dreams</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/60 text-xs"
            onClick={() => setLanguage(language === "kn" ? "en" : "kn")}
            data-testid="family-lang-toggle"
          >
            {language === "kn" ? "EN" : "ಕನ್ನಡ"}
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
        
        {/* Family Overview Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-purple-500/30 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold">{family?.familyType || "MIG"} ಕುಟುಂಬ</h2>
                    <p className="text-white/60 text-xs">{family?.name || "Middle Income Group Family"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs">Family DoersScore</p>
                  <p className="text-2xl font-bold text-white">
                    {familyDoersScore}
                  </p>
                </div>
              </div>

              {/* Family Member Avatars */}
              <div className="flex justify-center gap-4">
                {familyMembers.map((member) => (
                  <motion.button
                    key={member.id}
                    className={`relative flex flex-col items-center p-2 rounded-xl transition-all ${
                      selectedMember === member.id 
                        ? 'bg-white/20 scale-110' 
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedMember(member.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-testid={`family-member-${member.id}`}
                  >
                    <span className="text-3xl">{member.avatar}</span>
                    <span className="text-white text-[10px] mt-1">
                      {language === "kn" ? member.name.split(" ")[0] : member.nameEn}
                    </span>
                    {member.isFirstStudent && (
                      <Badge className="absolute -top-1 -right-1 bg-amber-500 text-[8px] px-1">
                        ⭐
                      </Badge>
                    )}
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Selected Member Dashboard */}
        <AnimatePresence mode="wait">
          {activeMember && (
            <motion.section
              key={activeMember.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Member Header */}
              <Card 
                className="border-2 overflow-hidden"
                style={{ 
                  backgroundColor: activeMember.color + '10',
                  borderColor: activeMember.color + '50'
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
                      style={{ backgroundColor: activeMember.color + '30' }}
                    >
                      {activeMember.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold text-lg">{activeMember.name}</h3>
                        {activeMember.isFirstStudent && (
                          <Badge className="bg-amber-500/30 text-amber-300 border-0 text-[10px]">
                            First Student
                          </Badge>
                        )}
                      </div>
                      <p className="text-white/60 text-sm">{activeMember.role}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div>
                          <p className="text-white/40 text-[10px]">DoersScore</p>
                          <p className="text-white font-bold">{activeMember.doersScore}</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-[10px]">Current Goal</p>
                          <p className="text-white text-sm">{activeMember.currentGoal}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Assistants Needed */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Brain className="w-4 h-4" style={{ color: activeMember.color }} />
                    {language === "kn" ? "AI ಸಹಾಯಕರು" : "AI Assistants Needed"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeMember.needs.map((need, idx) => (
                    <motion.div
                      key={need.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white/5 rounded-xl p-3"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: activeMember.color + '30' }}
                        >
                          <need.icon className="w-5 h-5" style={{ color: activeMember.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-white font-medium text-sm">
                              {language === "kn" ? need.nameKn : need.name}
                            </p>
                            <Badge className={`text-[10px] border-0 ${
                              need.status === 'completed' ? 'bg-green-500/30 text-green-400' :
                              need.status === 'active' ? 'bg-blue-500/30 text-blue-400' :
                              'bg-gray-500/30 text-gray-400'
                            }`}>
                              {need.status === 'completed' ? '✓' : need.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress 
                              value={need.progress} 
                              className="h-1.5 flex-1" 
                            />
                            <span className="text-white/60 text-xs">{need.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Next Action */}
              <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/30 flex items-center justify-center">
                      <Target className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-amber-400/80 text-xs">
                        {language === "kn" ? "ಮುಂದಿನ ಕ್ರಮ" : "Next Action"}
                      </p>
                      <p className="text-white font-medium">{activeMember.nextAction}</p>
                    </div>
                    <Button 
                      size="sm" 
                      className="ml-auto"
                      style={{ backgroundColor: activeMember.color }}
                      onClick={() => toast.success(`Starting: ${activeMember.nextAction}`)}
                    >
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Family Goals */}
        <section>
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                {language === "kn" ? "ಕುಟುಂಬ ಗುರಿಗಳು" : "Family Goals"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {familyGoals.map((goal) => (
                <div key={goal.id} className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white text-sm">{goal.title}</p>
                    <p className="text-green-400 text-xs">{goal.saved} / {goal.target}</p>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-3">
          <Button 
            className="h-auto py-4 flex-col gap-2 bg-gradient-to-br from-blue-600 to-indigo-600"
            onClick={() => navigate('/dp')}
            data-testid="family-view-profiles"
          >
            <Users className="w-6 h-6" />
            <span className="text-xs">{language === "kn" ? "ಪ್ರೊಫೈಲ್ ವೀಕ್ಷಿಸಿ" : "View Profiles"}</span>
          </Button>
          <Button 
            className="h-auto py-4 flex-col gap-2 bg-gradient-to-br from-green-600 to-emerald-600"
            onClick={() => toast.success("Opening Family Chat...")}
            data-testid="family-chat"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs">{language === "kn" ? "ಕುಟುಂಬ ಚಾಟ್" : "Family Chat"}</span>
          </Button>
        </section>

        {/* Special Badge for Daughter */}
        {selectedMember === "daughter" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-4 border border-purple-500/30 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <Badge className="mb-2 bg-amber-500/30 text-amber-300 border-0">
              🌟 {language === "kn" ? "ಮೊದಲ ವಿದ್ಯಾರ್ಥಿ" : "First Student"}
            </Badge>
            <h3 className="text-white font-bold mb-1">
              {language === "kn" ? "ಧನ್ಯವಾದಗಳು!" : "Thank You!"}
            </h3>
            <p className="text-white/60 text-sm">
              {language === "kn" 
                ? "ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ನಮಗೆ ಅಮೂಲ್ಯ. ನಾವು ನಿಮಗಾಗಿ ಈ ಅಪ್ಲಿಕೇಶನ್ ಅನ್ನು ನಿರ್ಮಿಸುತ್ತಿದ್ದೇವೆ!"
                : "Your feedback is invaluable. We are building this app for YOU!"
              }
            </p>
          </motion.div>
        )}
      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
        <div className="max-w-4xl mx-auto">
          <Button 
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
            onClick={() => navigate('/aimee-analyzer')}
            data-testid="family-ask-aimee"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {language === "kn" ? "AIMEE ಗೆ ಕೇಳಿ" : "Ask Agent AIMEE"}
          </Button>
        </div>
      </div>
    </div>
  );
}
