import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Brain,
  Bot,
  User,
  Cpu,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ChevronRight
} from "lucide-react";

const WORK_MODES = [
  {
    id: "human-led",
    title: "Human-Led",
    icon: User,
    color: "from-blue-500 to-indigo-600",
    description: "Human primary, AI assists",
    percentage: 35,
    examples: ["Creative Director", "Therapist", "Judge", "Surgeon"],
    skills: ["Emotional Intelligence", "Complex Decision Making", "Ethical Judgment"]
  },
  {
    id: "human-ai",
    title: "Human-AI Collaborative",
    icon: Brain,
    color: "from-purple-500 to-pink-600",
    description: "Equal partnership",
    percentage: 45,
    examples: ["Data Scientist", "Nuclear Engineer", "Architect", "Marketing Manager"],
    skills: ["AI Tool Proficiency", "Prompt Engineering", "Data Interpretation"]
  },
  {
    id: "ai-led",
    title: "AI-Led",
    icon: Bot,
    color: "from-amber-500 to-orange-600",
    description: "AI primary, Human oversees",
    percentage: 15,
    examples: ["Trading Analyst", "Quality Inspector", "Content Moderator"],
    skills: ["AI Supervision", "Exception Handling", "Quality Assurance"]
  },
  {
    id: "robo-human",
    title: "Robo-Human",
    icon: Cpu,
    color: "from-slate-500 to-slate-700",
    description: "Physical automation + Human expertise",
    percentage: 5,
    examples: ["Robotics Technician", "Warehouse Manager", "Drone Operator"],
    skills: ["Robot Maintenance", "Safety Protocols", "System Integration"]
  }
];

const FUTURE_SKILLS = [
  { name: "AI Collaboration", growth: "+195%", category: "Critical" },
  { name: "People Management", growth: "+138%", category: "High" },
  { name: "Process Optimization", growth: "+114%", category: "High" },
  { name: "Business Analysis", growth: "+90%", category: "Medium" },
  { name: "Teaching & Training", growth: "+90%", category: "Medium" },
  { name: "Quality Assurance", growth: "+87%", category: "Medium" }
];

const DECLINING_SKILLS = [
  { name: "General Research", decline: "-140", risk: "High" },
  { name: "Writing & Editing", decline: "-134", risk: "High" },
  { name: "Mathematical Modeling", decline: "-133", risk: "High" },
  { name: "Basic Technical Knowledge", decline: "-115", risk: "Medium" },
  { name: "Customer Service (Basic)", decline: "-83", risk: "Medium" }
];

export default function WorkWheelPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("modes");
  const [selectedMode, setSelectedMode] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 pb-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white p-4 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-xl">Work Wheel</h1>
            <p className="text-white/70 text-sm">Human • AI • Robo Collaborative System</p>
          </div>
        </div>

        {/* Future of Work Stats */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4">
          <p className="text-white/60 text-xs uppercase tracking-wide mb-2">Web 4.0 - The Metaweb</p>
          <h2 className="font-display font-bold text-lg mb-3">Future-Ready Work Modes</h2>
          <div className="space-y-2">
            {WORK_MODES.map((mode) => (
              <div key={mode.id} className="flex items-center gap-3">
                <mode.icon className="w-4 h-4 text-white/70" />
                <span className="text-white/80 text-sm flex-1">{mode.title}</span>
                <span className="text-white font-semibold">{mode.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 bg-white/5">
            <TabsTrigger value="modes" className="data-[state=active]:bg-white/10 text-white">Work Modes</TabsTrigger>
            <TabsTrigger value="growing" className="data-[state=active]:bg-white/10 text-white">Growing</TabsTrigger>
            <TabsTrigger value="declining" className="data-[state=active]:bg-white/10 text-white">At Risk</TabsTrigger>
          </TabsList>

          {/* Work Modes Tab */}
          <TabsContent value="modes" className="mt-4 space-y-4">
            {WORK_MODES.map((mode) => (
              <Card 
                key={mode.id} 
                className={`bg-gradient-to-r ${mode.color} border-0 text-white cursor-pointer transition-all ${
                  selectedMode === mode.id ? 'ring-2 ring-white' : ''
                }`}
                onClick={() => setSelectedMode(selectedMode === mode.id ? null : mode.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <mode.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{mode.title}</h3>
                      <p className="text-white/70 text-sm">{mode.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">{mode.percentage}%</p>
                      <p className="text-white/60 text-xs">of jobs</p>
                    </div>
                  </div>

                  {selectedMode === mode.id && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="mb-3">
                        <p className="text-white/60 text-xs uppercase mb-2">Example Roles</p>
                        <div className="flex flex-wrap gap-2">
                          {mode.examples.map((ex) => (
                            <Badge key={ex} className="bg-white/20 text-white border-0">{ex}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs uppercase mb-2">Key Skills Needed</p>
                        <div className="flex flex-wrap gap-2">
                          {mode.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-white border-white/30">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Growing Skills Tab */}
          <TabsContent value="growing" className="mt-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h3 className="font-semibold text-white">Fastest Growing Skills (2023-2025)</h3>
            </div>
            <div className="space-y-3">
              {FUTURE_SKILLS.map((skill, i) => (
                <Card key={i} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="font-medium text-white">{skill.name}</span>
                      </div>
                      <Badge className={`border-0 ${
                        skill.category === 'Critical' ? 'bg-red-500/20 text-red-400' :
                        skill.category === 'High' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {skill.growth}
                      </Badge>
                    </div>
                    <Progress value={parseInt(skill.growth) / 2} className="h-2 bg-white/10" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Declining Skills Tab */}
          <TabsContent value="declining" className="mt-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="font-semibold text-white">Skills at Risk of Automation</h3>
            </div>
            <p className="text-white/50 text-sm mb-4">
              These skills are seeing decreased demand. Consider upskilling or pivoting.
            </p>
            <div className="space-y-3">
              {DECLINING_SKILLS.map((skill, i) => (
                <Card key={i} className="bg-red-500/10 border-red-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <span className="font-medium text-white">{skill.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-red-400 font-bold">{skill.decline}</p>
                        <p className="text-white/40 text-xs">job postings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Reskilling CTA */}
            <Card className="mt-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30">
              <CardContent className="p-4">
                <h4 className="font-semibold text-white mb-2">🎯 Don't Worry - Reskill!</h4>
                <p className="text-white/70 text-sm mb-3">
                  Right Doers World provides personalized reskilling paths based on your current skills.
                </p>
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={() => navigate("/learn")}
                >
                  Start Reskilling Journey
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Agent Integration Banner */}
      <div className="px-4 py-4">
        <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="font-semibold text-white">TalentON.AI Agents</h3>
                <p className="text-white/60 text-xs">Powered by Agentic AI Workflow</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Career Agent", icon: "🎯" },
                { name: "Learning Agent", icon: "📚" },
                { name: "Job Agent", icon: "💼" },
                { name: "Progress Agent", icon: "📊" }
              ].map((agent) => (
                <div key={agent.name} className="bg-white/10 rounded-lg p-2 flex items-center gap-2">
                  <span className="text-lg">{agent.icon}</span>
                  <span className="text-white/80 text-xs">{agent.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
