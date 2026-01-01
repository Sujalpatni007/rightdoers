import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Loader2,
  Bot,
  User,
  ChevronDown,
  Settings
} from "lucide-react";
import { toast } from "sonner";
import { API } from "@/App";
import axios from "axios";

// AIMEE Personality
const AIMEE_INTRO = "Hi! I'm AIMEE, your AI-powered career transformation assistant. I can help you with career guidance, skill assessments, job matching, and more. How can I help you today?";

const QUICK_ACTIONS = [
  { label: "My DoersScore", prompt: "What is my DoersScore and what does it mean?" },
  { label: "Career Path", prompt: "Suggest career paths based on my profile" },
  { label: "Job Matches", prompt: "Find jobs that match my skills" },
  { label: "Skill Gaps", prompt: "What skills should I develop?" }
];

export default function AIMEEChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: AIMEE_INTRO, timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ttsAvailable, setTtsAvailable] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("nova");
  
  const messagesEndRef = useRef(null);
  const audioRef = useRef(new Audio());
  const inputRef = useRef(null);

  useEffect(() => {
    checkTTSStatus();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const checkTTSStatus = async () => {
    try {
      const res = await axios.get(`${API}/aimee/voice/status`);
      setTtsAvailable(res.data.available);
    } catch (error) {
      setTtsAvailable(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const playAIMEEVoice = async (text) => {
    if (!isTTSEnabled || !ttsAvailable || !text) return;
    
    try {
      setIsPlaying(true);
      
      const response = await axios.post(`${API}/aimee/speak`, null, {
        params: { text: text.substring(0, 500), voice: selectedVoice, speed: 1.0 }
      });
      
      if (response.data.success && response.data.audio_base64) {
        const audioData = `data:audio/mp3;base64,${response.data.audio_base64}`;
        audioRef.current.src = audioData;
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.onerror = () => setIsPlaying(false);
        await audioRef.current.play();
      }
    } catch (error) {
      console.error("TTS error:", error);
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const sendMessage = async (text = input) => {
    if (!text.trim()) return;
    
    const userMessage = { role: "user", content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Call AIMEE chat API
      const response = await axios.post(`${API}/aimee/chat`, {
        message: text,
        context: messages.slice(-10).map(m => ({ role: m.role, content: m.content }))
      });
      
      const assistantMessage = {
        role: "assistant",
        content: response.data.response || "I understand. Let me help you with that.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Play voice response
      if (isTTSEnabled && assistantMessage.content) {
        await playAIMEEVoice(assistantMessage.content);
      }
      
    } catch (error) {
      console.error("Chat error:", error);
      
      // Fallback response
      const fallbackMessage = {
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment, or explore the app to discover your career potential!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-24 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]"
        data-testid="aimee-chat"
      >
        <Card className="bg-slate-900/95 backdrop-blur-lg border-purple-500/30 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold flex items-center gap-2">
                    AIMEE
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </h3>
                  <p className="text-white/70 text-xs">AI Career Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* TTS Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`text-white h-8 w-8 ${!isTTSEnabled ? 'opacity-50' : ''}`}
                  onClick={() => {
                    if (isPlaying) stopAudio();
                    setIsTTSEnabled(!isTTSEnabled);
                    toast.info(isTTSEnabled ? 'Voice disabled' : 'Voice enabled');
                  }}
                  data-testid="aimee-tts-toggle"
                >
                  {isTTSEnabled ? (
                    <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse text-amber-300' : ''}`} />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </Button>
                
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white h-8 w-8"
                  onClick={onClose}
                  data-testid="aimee-close"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* TTS Status */}
            {ttsAvailable && (
              <div className="mt-2 flex items-center gap-2">
                <Badge className="bg-white/20 text-white/80 border-0 text-[10px]">
                  🎤 Voice: {selectedVoice}
                </Badge>
                {isPlaying && (
                  <Badge className="bg-amber-500/30 text-amber-300 border-0 text-[10px] animate-pulse">
                    Speaking...
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          {/* Messages */}
          <CardContent className="p-0">
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((message, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.role === "user"
                        ? "bg-purple-600 text-white rounded-br-none"
                        : "bg-white/10 text-white rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-[10px] opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 rounded-2xl rounded-bl-none p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                      <span className="text-white/60 text-sm">AIMEE is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Quick Actions */}
            <div className="px-4 pb-2">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {QUICK_ACTIONS.map((action, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0 border-white/20 text-white/80 hover:bg-white/10 text-xs"
                    onClick={() => sendMessage(action.prompt)}
                    disabled={isLoading}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Input */}
            <div className="p-4 pt-2 border-t border-white/10">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask AIMEE anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  data-testid="aimee-input"
                />
                <Button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !input.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                  data-testid="aimee-send"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

// AIMEE Chat Button Component
export function AIMEEButton({ onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-24 left-6 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center z-40"
      data-testid="aimee-fab"
    >
      <Bot className="w-6 h-6 text-white" />
    </motion.button>
  );
}
