import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sparkles, 
  Send, 
  ArrowLeft, 
  Building2, 
  MapPin,
  ChevronRight,
  Mic,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth, API } from "@/App";
import { BottomNav } from "./DoerDashboard";

const QUICK_PROMPTS = [
  "Find jobs near me",
  "What jobs match my skills?",
  "Show entry level jobs",
  "Tech jobs in Bangalore"
];

export default function AimeePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const scrollRef = useRef(null);
  
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi ${user?.name || "there"}! 👋 I'm AIMEE, your AI career assistant.\n\nI'm here to help you find work that feels like PLAY. Tell me what you're looking for, and I'll find the perfect matches for you!\n\n"Choose a job that feels like play to you, but looks like work to others." - Naval Ravikant`
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(`aimee_${user?.id}_${Date.now()}`);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    
    const userMessage = { role: "user", content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/aimee/chat`, {
        message: text,
        user_id: user?.id,
        session_id: sessionId
      });

      const assistantMessage = {
        role: "assistant",
        content: res.data.response,
        jobs: res.data.recommended_jobs
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error("Failed to get response from AIMEE");
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-nav">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-pink-500 text-white p-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate("/dashboard")}
            data-testid="aimee-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg">AIMEE</h1>
              <p className="text-white/70 text-xs">AI Career Assistant</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4 max-w-2xl mx-auto">
          {messages.map((msg, i) => (
            <div 
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] ${
                msg.role === "user" 
                  ? "bg-primary text-white rounded-2xl rounded-br-md" 
                  : "bg-white border rounded-2xl rounded-bl-md shadow-sm"
              } p-4`}>
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-primary">AIMEE</span>
                  </div>
                )}
                <p className={`whitespace-pre-wrap ${msg.role === "user" ? "" : "text-slate-700"}`}>
                  {msg.content}
                </p>
                
                {/* Recommended Jobs */}
                {msg.jobs && msg.jobs.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-medium text-slate-500 uppercase">Recommended Jobs</p>
                    {msg.jobs.map((job) => (
                      <button
                        key={job.id}
                        onClick={() => navigate(`/jobs?selected=${job.id}`)}
                        className="w-full text-left bg-slate-50 hover:bg-slate-100 rounded-xl p-3 transition-colors"
                        data-testid={`aimee-job-${job.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 truncate">{job.title}</p>
                            <p className="text-sm text-slate-500 truncate">{job.company_name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{job.level}</Badge>
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {job.pincode}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-2xl rounded-bl-md p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  <span className="text-sm text-slate-500">AIMEE is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-slate-500 mb-2">Quick prompts:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="bg-white border rounded-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:border-primary transition-colors"
                data-testid={`quick-prompt-${prompt.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center gap-2 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <Input
              placeholder="Ask AIMEE anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12 h-12 rounded-full"
              disabled={loading}
              data-testid="aimee-input"
            />
            <button 
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              disabled
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
          <Button
            size="icon"
            className="w-12 h-12 rounded-full bg-primary"
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            data-testid="aimee-send-btn"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <BottomNav active="aimee" />
    </div>
  );
}
