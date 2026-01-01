import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Star,
  Award,
  TrendingUp,
  MapPin,
  Users,
  Leaf,
  Heart,
  ChevronRight,
  Sparkles,
  Target,
  BookOpen,
  Briefcase,
  GraduationCap,
  Rocket,
  Trophy,
  Shield,
  Share2,
  Download,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { API } from "@/App";
import axios from "axios";

// Journey Phase Card Component
const JourneyPhaseCard = ({ phase, index, isActive, onClick }) => {
  const phaseIcons = {
    "EXPLORE": "🔍",
    "EDUCATE": "📚",
    "EMPLOY": "💼",
    "ENTERPRISE": "🚀",
    "EXCEL": "⭐"
  };

  const phaseColors = {
    "EXPLORE": "from-blue-500 to-cyan-500",
    "EDUCATE": "from-purple-500 to-pink-500",
    "EMPLOY": "from-green-500 to-emerald-500",
    "ENTERPRISE": "from-orange-500 to-amber-500",
    "EXCEL": "from-yellow-500 to-red-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="cursor-pointer"
      data-testid={`journey-phase-${phase.phase_number}`}
    >
      <Card className={`border-2 transition-all ${isActive ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${phaseColors[phase.phase_name]} flex items-center justify-center text-2xl`}>
              {phaseIcons[phase.phase_name]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-white/20 text-white border-0 text-xs">
                  Phase {phase.phase_number}
                </Badge>
                {phase.duration && (
                  <span className="text-white/50 text-xs">{phase.duration}</span>
                )}
              </div>
              <h4 className="text-white font-bold">{phase.phase_name}</h4>
              <p className="text-white/60 text-sm line-clamp-2">{phase.description}</p>
            </div>
            <ChevronRight className={`w-5 h-5 transition-transform ${isActive ? 'text-purple-400 rotate-90' : 'text-white/30'}`} />
          </div>
          
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 pt-4 border-t border-white/10"
            >
              <div className="space-y-3">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Achievements</p>
                  <div className="space-y-1">
                    {phase.achievements.slice(0, 3).map((achievement, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span className="text-white/80 text-sm">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Skills Gained</p>
                  <div className="flex flex-wrap gap-1">
                    {phase.skills_gained.map((skill, idx) => (
                      <Badge key={idx} className="bg-purple-500/20 text-purple-300 border-0 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Impact Metric Card
const ImpactCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`bg-gradient-to-br ${color} rounded-xl p-4 text-center`}
  >
    <Icon className="w-8 h-8 text-white mx-auto mb-2" />
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-white/80 text-xs">{label}</p>
  </motion.div>
);

export default function ProvenProfiles() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("journey");
  const [activePhase, setActivePhase] = useState(null);

  useEffect(() => {
    fetchAnushreeProfile();
  }, []);

  const fetchAnushreeProfile = async () => {
    try {
      const response = await axios.get(`${API}/proven-profiles/featured/anushree`);
      setProfile(response.data);
      setActivePhase(0);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
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
            <Star className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-white text-xl font-bold">Loading Success Story...</h2>
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4">
        <Card className="bg-white/5 border-white/10 max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-white/60">Profile not found</p>
            <Button onClick={() => navigate(-1)} className="mt-4" data-testid="go-back-btn">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => navigate(-1)}
            data-testid="pp-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-white font-bold flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Proven Profiles
            </h1>
            <Badge className="bg-amber-500/20 text-amber-400 border-0 text-[10px] mt-1">
              Success Stories
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-white" data-testid="pp-share-btn">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Hero Profile Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 border-0 overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <CardContent className="p-6 relative">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl">
                  👩‍🎨
                </div>
                <div className="flex-1">
                  <Badge className="bg-white/20 text-white border-0 text-xs mb-2">
                    <Trophy className="w-3 h-3 mr-1" />
                    Featured Success Story
                  </Badge>
                  <h2 className="text-white text-2xl font-bold">{profile.name}</h2>
                  <p className="text-white/80 text-sm flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </p>
                  <p className="text-white/60 text-xs mt-1">Age: {profile.age}</p>
                </div>
              </div>

              {/* Journey Summary */}
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Rocket className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">Transformation Journey</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/60 text-xs">Started As</p>
                    <p className="text-white font-medium">{profile.original_aspiration}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs">Now</p>
                    <p className="text-amber-200 font-medium text-sm">{profile.current_role}</p>
                  </div>
                </div>
              </div>

              {/* DoersScore */}
              <div className="flex items-center justify-between bg-white/10 backdrop-blur rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-amber-300" />
                  <div>
                    <p className="text-white/60 text-xs">DoersScore™</p>
                    <p className="text-white text-2xl font-bold">{profile.doers_score}/900</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs">Efficiency</p>
                  <p className="text-green-300 text-xl font-bold">{profile.efficiency_value}%</p>
                </div>
              </div>

              {/* Family Background */}
              <div className="mt-4 p-3 bg-white/5 rounded-xl">
                <p className="text-white/60 text-xs mb-2">Family Background</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span>👩</span>
                    <span className="text-white/80">{profile.family_background?.mother?.occupation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👨</span>
                    <span className="text-white/80">{profile.family_background?.father?.occupation}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: "journey", label: "5E Journey", icon: Rocket },
            { id: "assessment", label: "Assessment", icon: Target },
            { id: "impact", label: "Impact", icon: TrendingUp },
            { id: "awards", label: "Awards", icon: Award }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`flex-shrink-0 ${
                activeTab === tab.id
                  ? "bg-amber-500 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`pp-tab-${tab.id}`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* TAB: 5E Journey */}
        {activeTab === "journey" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="text-center mb-4">
              <h3 className="text-white font-bold text-lg">Right Doers 5E Model</h3>
              <p className="text-white/60 text-sm">From Aspiration to Impact</p>
            </div>

            {profile.journey_phases?.map((phase, index) => (
              <JourneyPhaseCard
                key={phase.phase_number}
                phase={phase}
                index={index}
                isActive={activePhase === index}
                onClick={() => setActivePhase(activePhase === index ? null : index)}
              />
            ))}
          </motion.div>
        )}

        {/* TAB: Assessment */}
        {activeTab === "assessment" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Personality */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <span className="text-2xl">🎭</span>
                  Personality Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Badge className="bg-purple-500/30 text-purple-300 border-0 text-2xl px-4 py-2">
                    {profile.personality_type}
                  </Badge>
                  <div className="text-white/60 text-sm">
                    <p>Extrovert • iNtuitive • Thinking • Judging</p>
                    <p className="text-white/40 text-xs mt-1">Strategic leader with creative vision</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Career Interests */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  Career Interests (RIASEC)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(profile.career_interests || {}).sort((a, b) => b[1] - a[1]).map(([interest, score]) => (
                    <div key={interest} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">{interest}</span>
                        <span className={score >= 60 ? "text-green-400" : "text-white/60"}>{score}%</span>
                      </div>
                      <Progress value={score} className="h-2 bg-white/10" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills & Abilities */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Skills & Abilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(profile.skills_abilities || {}).map(([skill, score]) => (
                    <div key={skill} className="bg-white/5 rounded-lg p-3">
                      <p className="text-white/60 text-xs truncate">{skill}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={score} className="h-1.5 flex-1 bg-white/10" />
                        <span className={`text-sm font-medium ${score >= 70 ? "text-green-400" : score >= 50 ? "text-amber-400" : "text-red-400"}`}>
                          {score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Career Clusters */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-green-400" />
                  Career Clusters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profile.career_clusters?.slice(0, 5).map((cluster, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <span className="text-white text-sm">{cluster.name}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={cluster.score} className="w-20 h-2 bg-white/10" />
                        <Badge className={cluster.recommended ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/60"}>
                          {cluster.score}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* TAB: Impact */}
        {activeTab === "impact" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-4">
              <h3 className="text-white font-bold text-lg">Transformative Impact</h3>
              <p className="text-white/60 text-sm">Measurable outcomes from Anushree's enterprise</p>
            </div>

            {/* Social Impact */}
            <Card className="bg-gradient-to-br from-pink-600/20 to-purple-600/20 border-pink-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-400" />
                  Social Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <ImpactCard
                    icon={Users}
                    label="Artisans Empowered"
                    value={profile.impact_metrics?.social?.artisans_empowered || "150+"}
                    color="from-pink-500 to-rose-500"
                  />
                  <ImpactCard
                    icon={TrendingUp}
                    label="Income Increase"
                    value={profile.impact_metrics?.social?.income_increase || "300%"}
                    color="from-purple-500 to-pink-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Environmental Impact */}
            <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-400" />
                  Environmental Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <ImpactCard
                    icon={Leaf}
                    label="Textile Waste Diverted"
                    value="30 Tons"
                    color="from-green-500 to-emerald-500"
                  />
                  <ImpactCard
                    icon={Sparkles}
                    label="Sustainable Garments"
                    value="50K+"
                    color="from-emerald-500 to-teal-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Economic Impact */}
            <Card className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border-amber-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  Economic Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <ImpactCard
                    icon={Briefcase}
                    label="Jobs Created"
                    value="75+"
                    color="from-amber-500 to-orange-500"
                  />
                  <ImpactCard
                    icon={Target}
                    label="Market Reach"
                    value="6 Countries"
                    color="from-orange-500 to-red-500"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* TAB: Awards */}
        {activeTab === "awards" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Awards & Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profile.awards?.map((award, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-3 bg-gradient-to-r from-amber-500/10 to-transparent p-3 rounded-xl"
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Award className="w-5 h-5 text-amber-400" />
                      </div>
                      <p className="text-white text-sm">{award}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Salary Projections */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                  Career Path Salary (Fashion Design)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { label: "Freshers (0 yrs)", value: profile.salary_projections?.freshers_0_years },
                    { label: "Early Career (1-3 yrs)", value: profile.salary_projections?.early_career_1_3_years },
                    { label: "Mid Career (4-7 yrs)", value: profile.salary_projections?.mid_career_4_7_years },
                    { label: "Late Career (9-12 yrs)", value: profile.salary_projections?.late_career_9_12_years },
                    { label: "Expert (13+ yrs)", value: profile.salary_projections?.experienced_13_plus_years }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <span className="text-white/80 text-sm">{item.label}</span>
                      <span className="text-green-400 font-bold">
                        ₹{(item.value / 100000).toFixed(1)}L
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* CTA */}
        <Card className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <h3 className="text-white font-bold text-lg mb-2">Inspired by Anushree's Journey?</h3>
            <p className="text-white/60 text-sm mb-4">Create your own Talent Card and start your transformation</p>
            <div className="flex gap-3 justify-center">
              <Button
                className="bg-gradient-to-r from-purple-500 to-pink-500"
                onClick={() => navigate("/dp")}
                data-testid="pp-create-profile-btn"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create My D.P.
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white"
                onClick={() => navigate("/jobs4me")}
                data-testid="pp-find-jobs-btn"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Find Jobs Like Hers
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
