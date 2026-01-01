import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Loader2,
  Volume2,
  X,
  Sparkles,
  Navigation,
  Search,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";
import { API } from "@/App";
import axios from "axios";

// Voice Command Examples
const VOICE_EXAMPLES = [
  { text: "Go to pricing", icon: Navigation, category: "Navigate" },
  { text: "Show my profile", icon: Navigation, category: "Navigate" },
  { text: "Search jobs for designer", icon: Search, category: "Search" },
  { text: "Start assessment", icon: Sparkles, category: "Action" },
  { text: "What is my Doer score?", icon: HelpCircle, category: "Question" }
];

export default function VoiceAssistant({ 
  onClose, 
  isOpen = false,
  position = "bottom-right" // bottom-right, bottom-center, floating
}) {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [response, setResponse] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);
  const [showExamples, setShowExamples] = useState(true);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  // Check Voice AI availability
  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    try {
      const res = await axios.get(`${API}/voice/status`);
      setIsAvailable(res.data.available);
    } catch (error) {
      setIsAvailable(false);
    }
  };

  // Start recording
  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000
        } 
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };
      
      mediaRecorder.start();
      setIsListening(true);
      setTranscription("");
      setResponse("");
      setShowExamples(false);
      
    } catch (error) {
      console.error("Microphone error:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  }, []);

  // Stop recording
  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    setIsListening(false);
    setIsProcessing(true);
  }, []);

  // Process audio with backend
  const processAudio = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'voice_command.webm');
      
      const res = await axios.post(`${API}/voice/command`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const data = res.data;
      
      if (data.success) {
        setTranscription(data.transcription?.text || "");
        setResponse(data.response_text || "");
        
        // Speak the response
        speakResponse(data.response_text);
        
        // Execute suggested action
        if (data.suggested_action) {
          setTimeout(() => {
            executeAction(data.suggested_action);
          }, 1500);
        }
      } else {
        setResponse(data.response_text || "I couldn't understand that.");
        toast.error(data.response_text);
      }
      
    } catch (error) {
      console.error("Voice processing error:", error);
      setResponse("Sorry, there was an error processing your voice command.");
      toast.error("Voice processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // Text-to-speech response
  const speakResponse = (text) => {
    if ('speechSynthesis' in window && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      speechSynthesis.speak(utterance);
    }
  };

  // Execute navigation/action
  const executeAction = (action) => {
    if (!action) return;
    
    if (action.startsWith("NAVIGATE:")) {
      const path = action.replace("NAVIGATE:", "");
      navigate(path);
      if (onClose) onClose();
    } else if (action.startsWith("SEARCH:")) {
      const query = action.replace("SEARCH:", "");
      navigate(`/jobs4me?q=${encodeURIComponent(query)}`);
      if (onClose) onClose();
    } else if (action === "ACTION:logout") {
      localStorage.clear();
      navigate("/");
      if (onClose) onClose();
    }
  };

  // Handle example click
  const handleExampleClick = async (example) => {
    setShowExamples(false);
    setIsProcessing(true);
    setTranscription(example.text);
    
    try {
      const res = await axios.post(`${API}/voice/parse-text?text=${encodeURIComponent(example.text)}`);
      const data = res.data;
      
      setResponse(data.response_text || "");
      speakResponse(data.response_text);
      
      if (data.suggested_action) {
        setTimeout(() => {
          executeAction(data.suggested_action);
        }, 1500);
      }
    } catch (error) {
      toast.error("Failed to process command");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  // Position classes
  const positionClasses = {
    "bottom-right": "fixed bottom-24 right-4",
    "bottom-center": "fixed bottom-24 left-1/2 -translate-x-1/2",
    "floating": "fixed bottom-4 right-4"
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={`${positionClasses[position]} z-50 w-80`}
        data-testid="voice-assistant"
      >
        <Card className="bg-slate-900/95 backdrop-blur-lg border-purple-500/30 shadow-2xl">
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Mic className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Voice AI</h3>
                  <Badge className={`${isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} border-0 text-[10px]`}>
                    {isAvailable ? 'Ready' : 'Unavailable'}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/60 hover:text-white h-8 w-8"
                onClick={onClose}
                data-testid="voice-close-btn"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Main Content */}
            <div className="space-y-4">
              {/* Status Display */}
              {(transcription || response) && (
                <div className="space-y-2">
                  {transcription && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-white/60 text-xs mb-1">You said:</p>
                      <p className="text-white text-sm">"{transcription}"</p>
                    </div>
                  )}
                  {response && (
                    <div className="bg-purple-500/10 rounded-lg p-3">
                      <p className="text-purple-400 text-xs mb-1 flex items-center gap-1">
                        <Volume2 className="w-3 h-3" /> Response:
                      </p>
                      <p className="text-white text-sm">{response}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Examples */}
              {showExamples && !isListening && !isProcessing && (
                <div className="space-y-2">
                  <p className="text-white/60 text-xs">Try saying:</p>
                  <div className="grid grid-cols-1 gap-1">
                    {VOICE_EXAMPLES.map((example, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleExampleClick(example)}
                        className="flex items-center gap-2 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-colors"
                      >
                        <example.icon className="w-4 h-4 text-purple-400" />
                        <span className="text-white/80 text-xs flex-1">"{example.text}"</span>
                        <Badge className="bg-white/10 text-white/50 border-0 text-[10px]">
                          {example.category}
                        </Badge>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Listening Animation */}
              {isListening && (
                <div className="flex flex-col items-center py-4">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-2"
                  >
                    <Mic className="w-8 h-8 text-white" />
                  </motion.div>
                  <p className="text-white text-sm">Listening...</p>
                  <p className="text-white/60 text-xs">Tap mic to stop</p>
                </div>
              )}

              {/* Processing Animation */}
              {isProcessing && (
                <div className="flex flex-col items-center py-4">
                  <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-2" />
                  <p className="text-white text-sm">Processing...</p>
                </div>
              )}

              {/* Main Button */}
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing || !isAvailable}
                className={`w-full h-14 text-lg font-bold ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                }`}
                data-testid="voice-mic-btn"
              >
                {isProcessing ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : isListening ? (
                  <>
                    <MicOff className="w-6 h-6 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-6 h-6 mr-2" />
                    Start Speaking
                  </>
                )}
              </Button>

              {/* 8 T's Badge */}
              <div className="text-center">
                <Badge className="bg-white/10 text-white/60 border-0 text-[10px]">
                  💬 TALK - Part of 8 T's Workflow
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

// Floating Voice Button Component
export function VoiceButton({ onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg flex items-center justify-center z-40"
      data-testid="voice-fab"
    >
      <Mic className="w-6 h-6 text-white" />
    </motion.button>
  );
}
