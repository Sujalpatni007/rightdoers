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
  position = "bottom-right"
}) {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [response, setResponse] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);
  const [showExamples, setShowExamples] = useState(true);

  const recognitionRef = useRef(null);

  // Check if Web Speech API is available
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsAvailable(!!SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.continuous = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("[Voice AI] Transcript:", transcript);
        setTranscription(transcript);
        setIsListening(false);
        processWithGemini(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("[Voice AI] Recognition error:", event.error);
        setIsListening(false);
        setIsProcessing(false);
        if (event.error === 'not-allowed') {
          toast.error("Microphone access denied. Please allow microphone in browser settings.");
        } else {
          toast.error(`Voice recognition error: ${event.error}`);
        }
      };

      recognitionRef.current.onend = () => {
        console.log("[Voice AI] Recognition ended");
        if (isListening) {
          setIsListening(false);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Start listening with Web Speech API
  const startListening = useCallback(async () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });

      console.log("[Voice AI] Starting to listen...");
      setTranscription("");
      setResponse("");
      setShowExamples(false);
      setIsListening(true);

      recognitionRef.current.start();
      toast.info("🎙️ Listening... Speak now!");

    } catch (error) {
      console.error("[Voice AI] Microphone error:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  }, []);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  // Process transcript with Gemini via backend
  const processWithGemini = async (transcript) => {
    console.log("[Voice AI] Sending to Gemini:", transcript);
    setIsProcessing(true);

    try {
      const res = await axios.post(`${API}/aimee/chat-simple`, {
        message: transcript,
        context: []
      });

      const geminiResponse = res.data.response;
      console.log("[Voice AI] Gemini response:", geminiResponse);
      setResponse(geminiResponse);

      // Speak the response
      speakResponse(geminiResponse);

      // Check for navigation commands
      handleNavigationCommand(transcript, geminiResponse);

    } catch (error) {
      console.error("[Voice AI] Gemini error:", error);
      const fallbackMsg = "I couldn't process that right now. Please try again.";
      setResponse(fallbackMsg);
      speakResponse(fallbackMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Text-to-Speech response
  const speakResponse = (text) => {
    if ('speechSynthesis' in window && text) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Try to use a female voice for AIMEE
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria'));
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      console.log("[Voice AI] Speaking response...");
      speechSynthesis.speak(utterance);
    }
  };

  // Handle navigation commands in transcript
  const handleNavigationCommand = (transcript, response) => {
    const lowerTranscript = transcript.toLowerCase();

    const navCommands = {
      'go to pricing': '/pricing',
      'show my profile': '/profile',
      'show profile': '/profile',
      'open dashboard': '/dashboard',
      'go to dashboard': '/dashboard',
      'show jobs': '/jobs4me',
      'find jobs': '/jobs4me',
      'start assessment': '/psychometric',
      'take assessment': '/psychometric'
    };

    for (const [command, path] of Object.entries(navCommands)) {
      if (lowerTranscript.includes(command)) {
        setTimeout(() => {
          navigate(path);
          if (onClose) onClose();
        }, 2000);
        break;
      }
    }
  };

  // Handle example click
  const handleExampleClick = async (example) => {
    setShowExamples(false);
    setTranscription(example.text);
    processWithGemini(example.text);
  };

  if (!isOpen) return null;

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
                    {isAvailable ? 'Ready' : 'Not Supported'}
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
                        <Volume2 className="w-3 h-3" /> AIMEE:
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
                  <p className="text-white text-sm">Thinking...</p>
                </div>
              )}

              {/* Main Button */}
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing || !isAvailable}
                className={`w-full h-14 text-lg font-bold ${isListening
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

              {/* Powered by badge */}
              <div className="text-center">
                <Badge className="bg-white/10 text-white/60 border-0 text-[10px]">
                  🎙️ Powered by Web Speech + Gemini AI
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
