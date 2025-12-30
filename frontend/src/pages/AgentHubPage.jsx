import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Brain,
  Target,
  BookOpen,
  Briefcase,
  TrendingUp,
  MessageCircle,
  Sparkles,
  Send,
  Bot,
  User,
  Zap,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/App";

const AGENTS = [
  {
    id: "career",
    name: "Career Discovery Agent",
    icon: Target,
    color: "from-blue-500 to-indigo-600",
    description: "Analyzes your PASS Code + interests to recommend perfect careers",
    capabilities: ["PASS Code Analysis", "Interest Mapping", "Career Matching", "Salary Insights"]
  },
  {
    id: "learning",
    name: "Learning Path Agent",
    icon: BookOpen,
    color: "from-green-500 to-emerald-600",
    description: "Creates personalized Task-Based curriculum for your goals",
    capabilities: ["Curriculum Design", "Task Scheduling", "Progress Tracking", "Skill Verification"]
  },
  {
    id: "job",
    name: "Job Matching Agent",
    icon: Briefcase,
    color: "from-purple-500 to-pink-600",
    description: "Mercor-style AI matching for all population levels L1-L5",
    capabilities: ["Semantic Search", "AI Interviews", "Candidate Ranking", "Employer Matching"]
  },
  {
    id: "progress",
    name: "Progress Tracking Agent",
    icon: TrendingUp,
    color: "from-amber-500 to-orange-600",
    description: "Monitors your journey and triggers interventions when needed",
    capabilities: ["Milestone Tracking", "Performance Analytics", "Intervention Alerts", "Career Pivots"]
  }
];

const SAMPLE_CONVERSATIONS = {
  career: [
    { role: "agent", message: "Hi! I'm your Career Discovery Agent. Based on your PASS Code (87/100) and interests in Science, I can help you find the perfect career path. Would you like me to analyze your profile?" },
    { role: "user", message: "Yes, please analyze my profile" },
    { role: "agent", message: "Great! Analyzing... \n\n🎯 **Top Match: Nuclear Engineer** (94% fit)\n- Aligns with your Science interest\n- Matches your problem-solving strength\n- High demand in India's 100GW nuclear mission\n\n💰 Salary: ₹75K-1.4L/month\n🏛️ Top Employer: PowerMech Projects\n\nWould you like to explore this career path?" }
  ],
  learning: [
    { role: "agent", message: "Hello! I'm your Learning Path Agent. I've designed a personalized 4-year curriculum for Nuclear Engineering. Ready to start Year 9 tasks?" },
    { role: "user", message: "What's my first task?" },
    { role: "agent", message: "📚 **Week 1 Task: Read Nuclear Physics Introduction**\n\nBook: 'Introduction to Nuclear Physics' by Kenneth Krane\nChapters: 1-2 (Basic Concepts)\nTime: 2 hours\nPoints: +100 XP\n\n✅ This builds foundation for reactor theory\n\nShall I set a reminder and track your progress?" }
  ],
  job: [
    { role: "agent", message: "Hi! I'm your Job Matching Agent. I've found 127 opportunities matching your Nuclear Engineer profile. Top match: PowerMech Projects (94% fit). Want me to prepare you for their AI interview?" },
    { role: "user", message: "Yes, help me prepare" },
    { role: "agent", message: "🎯 **PowerMech Interview Prep**\n\n**Technical Questions:**\n1. Explain nuclear fission process\n2. Safety protocols in reactor design\n3. MCNP simulation basics\n\n**Behavioral Questions:**\n1. Describe a complex problem you solved\n2. How do you handle safety-critical situations?\n\nWould you like to do a mock AI interview now?" }
  ],
  progress: [
    { role: "agent", message: "Weekly Progress Report 📊\n\n✅ Tasks Completed: 5/7\n💰 Points Earned: 450 XP\n🔥 Streak: 12 days\n🏆 Rank: #4 in cohort\n\n⚠️ Alert: Mathematics practice is behind schedule. Would you like me to adjust your learning plan?" },
    { role: "user", message: "Yes, adjust my plan" },
    { role: "agent", message: "🔄 **Plan Adjusted!**\n\nI've:\n1. Extended Math module by 1 week\n2. Added 2 extra practice sessions\n3. Scheduled a doubt-clearing session\n\nNew completion target: Jan 15\nProjected success rate: 92%\n\nYou're on track for Nuclear Engineer path! Keep going! 🚀" }
  ]
};

export default function AgentHubPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSelectAgent = (agent) => {
    setSelectedAgent(agent);
    setMessages(SAMPLE_CONVERSATIONS[agent.id] || []);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    setMessages([...messages, { role: "user", message: inputMessage }]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "agent",
        message: "I understand! Let me analyze that for you... Based on your profile, I recommend focusing on the Nuclear Engineering path. Would you like more specific guidance?"
      }]);
      setIsTyping(false);
    }, 1500);
  };

  if (selectedAgent) {
    const agent = selectedAgent;
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Agent Header */}
        <header className={`bg-gradient-to-r ${agent.color} text-white p-4`}>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setSelectedAgent(null)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <agent.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h1 className="font-semibold">{agent.name}</h1>
              <p className="text-white/70 text-xs">Powered by TalentON.AI</p>
            </div>
            <Badge className="bg-white/20 text-white border-0">
              <Zap className="w-3 h-3 mr-1" /> Active
            </Badge>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'agent' && (
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${agent.color} flex items-center justify-center flex-shrink-0`}>
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl p-3 ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-sm' 
                  : 'bg-white shadow-sm rounded-bl-sm'
              }`}>
                <p className={`text-sm whitespace-pre-line ${
                  msg.role === 'user' ? 'text-white' : 'text-slate-700'
                }`}>{msg.message}</p>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${agent.color} flex items-center justify-center`}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white shadow-sm rounded-2xl rounded-bl-sm p-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <Input 
              placeholder="Ask your agent..." 
              className="flex-1"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button 
              className={`bg-gradient-to-r ${agent.color}`}
              onClick={handleSendMessage}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pb-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 pb-8">
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
            <h1 className="font-display font-bold text-xl">TalentON.AI Agents</h1>
            <p className="text-white/70 text-sm">Agentic AI Workflow System</p>
          </div>
        </div>

        {/* Agent Orchestrator */}
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-8 h-8 text-white" />
              <div>
                <h3 className="font-semibold text-white">Master Orchestrator</h3>
                <p className="text-white/60 text-xs">Coordinates all agents for your success</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {AGENTS.map((agent) => (
                <div key={agent.id} className="text-center">
                  <div className={`w-10 h-10 mx-auto rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center mb-1`}>
                    <agent.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-white/60 text-[10px]">{agent.id}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </header>

      {/* Agents List */}
      <div className="px-4 py-4 space-y-4">
        <h2 className="font-semibold text-white">Your AI Agents</h2>
        
        {AGENTS.map((agent) => (
          <Card 
            key={agent.id} 
            className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-all"
            onClick={() => handleSelectAgent(agent)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center flex-shrink-0`}>
                  <agent.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{agent.name}</h3>
                  <p className="text-white/50 text-sm mb-3">{agent.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.slice(0, 3).map((cap) => (
                      <Badge key={cap} className="bg-white/10 text-white/70 border-0 text-xs">
                        {cap}
                      </Badge>
                    ))}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-4">
        <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h3 className="font-semibold text-white">Quick Agent Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 justify-start"
                onClick={() => handleSelectAgent(AGENTS[0])}
              >
                🎯 Find My Career
              </Button>
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 justify-start"
                onClick={() => handleSelectAgent(AGENTS[1])}
              >
                📚 Get Learning Plan
              </Button>
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 justify-start"
                onClick={() => handleSelectAgent(AGENTS[2])}
              >
                💼 Match Jobs
              </Button>
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 justify-start"
                onClick={() => handleSelectAgent(AGENTS[3])}
              >
                📊 Check Progress
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
