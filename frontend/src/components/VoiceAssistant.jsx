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
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { API } from "@/App";
import axios from "axios";

// Session key for greeting tracking
const GREETING_SHOWN_KEY = "aimee_greeting_shown";

// Voice Command Examples
const VOICE_EXAMPLES = [
  { text: "What jobs match my skills?", icon: Search, category: "Jobs" },
  { text: "How do I improve my score?", icon: Sparkles, category: "Tips" },
  { text: "Go to my profile", icon: Navigation, category: "Navigate" }
];

export default function VoiceAssistant({
  onClose,
  isOpen = false,
  position = "bottom-right"
}) {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);
  const [showExamples, setShowExamples] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasGreeted, setHasGreeted] = useState(false);

  const recognitionRef = useRef(null);
  const isRecognitionActiveRef = useRef(false);
  const firstOpenRef = useRef(true);

  // Initialize Speech Recognition
  useEffect(() => {
    console.log("🎙️ [AIMEE] Initializing Voice Assistant...");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("❌ [AIMEE] SpeechRecognition NOT supported");
      setIsAvailable(false);
      setErrorMessage("Speech not supported. Try Chrome.");
      return;
    }

    setIsAvailable(true);

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log("🎧 [AIMEE] Listening...");
        isRecognitionActiveRef.current = true;
      };

      recognition.onresult = (event) => {
        if (event.results?.[0]?.[0]) {
          const transcript = event.results[0][0].transcript;
          console.log(`📝 [AIMEE] You said: "${transcript}"`);
          setTranscription(transcript);
          setIsListening(false);
          isRecognitionActiveRef.current = false;
          processWithGemini(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.error("❌ [AIMEE] Error:", event.error);
        isRecognitionActiveRef.current = false;
        setIsListening(false);
        setIsProcessing(false);

        const errorMsgs = {
          'not-allowed': "Mic blocked. Allow in settings.",
          'no-speech': "Didn't hear anything. Try again.",
          'network': "Network issue. Check connection.",
          'audio-capture': "No mic found."
        };
        setErrorMessage(errorMsgs[event.error] || `Error: ${event.error}`);
      };

      recognition.onend = () => {
        isRecognitionActiveRef.current = false;
        setIsListening(false);
      };

      recognitionRef.current = recognition;

    } catch (error) {
      console.error("❌ [AIMEE] Setup failed:", error);
      setIsAvailable(false);
    }

    // Preload TTS voices
    if ('speechSynthesis' in window) {
      speechSynthesis.getVoices();
    }

    // Check if greeting was already shown this session
    setHasGreeted(sessionStorage.getItem(GREETING_SHOWN_KEY) === 'true');

    return () => {
      if (recognitionRef.current && isRecognitionActiveRef.current) {
        try { recognitionRef.current.abort(); } catch (e) { }
      }
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  // Voice-first greeting on first open
  useEffect(() => {
    if (isOpen && firstOpenRef.current && !hasGreeted && isAvailable) {
      firstOpenRef.current = false;

      // Delay to ensure UI is ready
      setTimeout(() => {
        console.log("👋 [AIMEE] First open - speaking greeting...");
        speakAndListen("Hello Doer! How can I help you?");
        sessionStorage.setItem(GREETING_SHOWN_KEY, 'true');
        setHasGreeted(true);
      }, 500);
    }
  }, [isOpen, hasGreeted, isAvailable]);

  // Speak text and then start listening
  const speakAndListen = useCallback((text) => {
    if (!text || !('speechSynthesis' in window)) return;

    console.log("🔊 [AIMEE] Speaking:", text);
    setIsSpeaking(true);
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1; // Slightly faster for snappiness
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to get a good voice
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(v =>
      v.name.includes('Samantha') || v.name.includes('Google US English')
    ) || voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => {
      console.log("🔊 [AIMEE] Done speaking, starting to listen...");
      setIsSpeaking(false);
      // Auto-start listening after speaking
      setTimeout(() => startListening(), 300);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  }, []);

  // Start listening
  const startListening = useCallback(async () => {
    console.log("🎤 [AIMEE] Starting mic...");
    setErrorMessage("");

    if (!recognitionRef.current) {
      setErrorMessage("Speech not available. Try Chrome.");
      return;
    }

    if (isRecognitionActiveRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { }
      await new Promise(r => setTimeout(r, 100));
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());

      setTranscription("");
      setShowExamples(false);
      setIsListening(true);

      recognitionRef.current.start();

    } catch (error) {
      console.error("❌ [AIMEE] Mic error:", error);
      setIsListening(false);
      setErrorMessage("Mic blocked. Check permissions.");
    }
  }, []);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isRecognitionActiveRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { }
    }
    setIsListening(false);
  }, []);

  // Process with Gemini - voice optimized
  const processWithGemini = async (transcript) => {
    if (!transcript?.trim()) return;

    console.log("🤖 [AIMEE] Processing:", transcript);
    setIsProcessing(true);

    try {
      const res = await axios.post(`${API}/aimee/chat-simple`, {
        message: transcript,
        context: [],
        is_voice: true
      }, { timeout: 15000 });

      const { displayText: dt, spokenText, followUp: fu } = res.data;

      console.log("✅ [AIMEE] Response:", { displayText: dt, spokenText, followUp: fu });

      setDisplayText(dt || res.data.response);
      setFollowUp(fu || "");

      // Speak the short response, then ask follow-up and listen
      const toSpeak = spokenText || dt?.slice(0, 80) || "Here's what I found.";
      const fullSpoken = fu ? `${toSpeak} ${fu}` : toSpeak;

      speakAndListen(fullSpoken);

      // Check for navigation
      handleNavigationCommand(transcript);

    } catch (error) {
      console.error("❌ [AIMEE] API error:", error);
      setErrorMessage("Couldn't reach AI. Try again.");
      setDisplayText("Having trouble connecting. Please try again.");
      speakAndListen("Sorry, I had trouble. Try again?");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle navigation commands
  const handleNavigationCommand = (transcript) => {
    const lower = transcript.toLowerCase();
    const navMap = {
      'go to pricing': '/pricing',
      'my profile': '/profile',
      'dashboard': '/dashboard',
      'jobs': '/jobs4me',
      'assessment': '/psychometric'
    };

    for (const [cmd, path] of Object.entries(navMap)) {
      if (lower.includes(cmd)) {
        setTimeout(() => { navigate(path); onClose?.(); }, 2500);
        break;
      }
    }
  };

  // Handle example click
  const handleExampleClick = (example) => {
    setShowExamples(false);
    setTranscription(example.text);
    processWithGemini(example.text);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-24 right-4 z-50 w-80"
        data-testid="voice-assistant"
      >
        <Card className="bg-slate-900/95 backdrop-blur-lg border-purple-500/30 shadow-2xl">
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Mic className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">AIMEE</h3>
                  <Badge className={`${isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} border-0 text-[10px]`}>
                    {isSpeaking ? '🔊 Speaking' : isListening ? '🎧 Listening' : isAvailable ? 'Ready' : 'Unavailable'}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white h-8 w-8" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2 mb-3">
                <p className="text-red-300 text-xs flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {errorMessage}
                </p>
              </div>
            )}

            {/* Conversation Display */}
            {(transcription || displayText) && (
              <div className="space-y-2 mb-3">
                {transcription && (
                  <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-white/50 text-[10px]">You:</p>
                    <p className="text-white text-sm">"{transcription}"</p>
                  </div>
                )}
                {displayText && (
                  <div className="bg-purple-500/10 rounded-lg p-2">
                    <p className="text-purple-400 text-[10px] flex items-center gap-1">
                      <Volume2 className="w-3 h-3" /> AIMEE:
                    </p>
                    <p className="text-white text-sm">{displayText}</p>
                    {followUp && <p className="text-purple-300 text-xs mt-1 italic">{followUp}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Examples */}
            {showExamples && !isListening && !isProcessing && !isSpeaking && (
              <div className="space-y-1 mb-3">
                <p className="text-white/50 text-[10px]">Try asking:</p>
                {VOICE_EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => handleExampleClick(ex)}
                    className="w-full flex items-center gap-2 p-2 bg-white/5 hover:bg-white/10 rounded text-left text-xs text-white/80"
                  >
                    <ex.icon className="w-3 h-3 text-purple-400" />
                    "{ex.text}"
                  </button>
                ))}
              </div>
            )}

            {/* Status Animations */}
            {(isListening || isProcessing || isSpeaking) && (
              <div className="flex flex-col items-center py-3">
                {isSpeaking ? (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-2"
                    >
                      <Volume2 className="w-6 h-6 text-white" />
                    </motion.div>
                    <p className="text-white text-sm">Speaking...</p>
                  </>
                ) : isListening ? (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-2"
                    >
                      <Mic className="w-6 h-6 text-white" />
                    </motion.div>
                    <p className="text-white text-sm">Listening...</p>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-10 h-10 text-purple-400 animate-spin mb-2" />
                    <p className="text-white text-sm">Thinking...</p>
                  </>
                )}
              </div>
            )}

            {/* Main Button */}
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing || isSpeaking || !isAvailable}
              className={`w-full h-12 font-bold ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}
            >
              {isProcessing || isSpeaking ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isListening ? (
                <><MicOff className="w-5 h-5 mr-2" /> Stop</>
              ) : (
                <><Mic className="w-5 h-5 mr-2" /> Speak</>
              )}
            </Button>

            <p className="text-center text-white/30 text-[10px] mt-2">Voice-first AI Career Assistant</p>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export function VoiceButton({ onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg flex items-center justify-center z-40"
    >
      <Mic className="w-6 h-6 text-white" />
    </motion.button>
  );
}
