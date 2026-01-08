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
  const [errorMessage, setErrorMessage] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  const recognitionRef = useRef(null);
  const isRecognitionActiveRef = useRef(false);

  // Initialize Speech Recognition
  useEffect(() => {
    console.log("🎙️ [Voice AI] Initializing...");

    // Check for SpeechRecognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("❌ [Voice AI] SpeechRecognition NOT supported in this browser");
      setIsAvailable(false);
      setErrorMessage("Speech recognition not supported. Try Chrome or Edge.");
      return;
    }

    console.log("✅ [Voice AI] SpeechRecognition API available");
    setIsAvailable(true);

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log("🎧 [Voice AI] Recognition started");
        isRecognitionActiveRef.current = true;
        setDebugInfo("Listening...");
      };

      recognition.onresult = (event) => {
        console.log("📝 [Voice AI] Result event received");
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcript = event.results[0][0].transcript;
          const confidence = event.results[0][0].confidence;
          console.log(`📝 [Voice AI] Transcript: "${transcript}" (confidence: ${(confidence * 100).toFixed(1)}%)`);
          setTranscription(transcript);
          setDebugInfo(`Got: "${transcript}"`);
          setIsListening(false);
          isRecognitionActiveRef.current = false;
          processWithGemini(transcript);
        } else {
          console.warn("⚠️ [Voice AI] No transcript in result");
          setErrorMessage("Couldn't understand that. Please try again.");
          setIsListening(false);
        }
      };

      recognition.onerror = (event) => {
        console.error("❌ [Voice AI] Recognition error:", event.error, event);
        isRecognitionActiveRef.current = false;
        setIsListening(false);
        setIsProcessing(false);

        let errorMsg = "";
        switch (event.error) {
          case 'not-allowed':
          case 'permission-denied':
            errorMsg = "Microphone blocked. Click the lock icon in address bar to allow.";
            break;
          case 'no-speech':
            errorMsg = "No speech detected. Please speak louder or closer to the mic.";
            break;
          case 'audio-capture':
            errorMsg = "No microphone found. Please connect a microphone.";
            break;
          case 'network':
            errorMsg = "Network error. Check your internet connection.";
            // This is the "Network Error" the user is seeing
            console.error("🌐 [Voice AI] NETWORK ERROR - This requires HTTPS or localhost");
            break;
          case 'aborted':
            errorMsg = "Recognition stopped.";
            break;
          case 'service-not-allowed':
            errorMsg = "Speech service blocked. Are you on HTTPS?";
            break;
          default:
            errorMsg = `Voice error: ${event.error}`;
        }

        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      };

      recognition.onend = () => {
        console.log("🔚 [Voice AI] Recognition ended");
        isRecognitionActiveRef.current = false;
        setIsListening(false);
      };

      recognition.onnomatch = () => {
        console.warn("⚠️ [Voice AI] No match found");
        setErrorMessage("Couldn't understand. Please try again.");
      };

      recognitionRef.current = recognition;
      console.log("✅ [Voice AI] Recognition object created successfully");

    } catch (error) {
      console.error("❌ [Voice AI] Failed to create recognition:", error);
      setIsAvailable(false);
      setErrorMessage(`Setup failed: ${error.message}`);
    }

    // Preload voices for TTS
    if ('speechSynthesis' in window) {
      speechSynthesis.getVoices();
      speechSynthesis.onvoiceschanged = () => {
        console.log("🔊 [Voice AI] Voices loaded:", speechSynthesis.getVoices().length);
      };
    }

    return () => {
      if (recognitionRef.current && isRecognitionActiveRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.warn("[Voice AI] Cleanup abort failed:", e);
        }
      }
    };
  }, []);

  // Start listening with Web Speech API
  const startListening = useCallback(async () => {
    console.log("🎤 [Voice AI] Mic clicked");
    setErrorMessage("");
    setDebugInfo("");

    if (!recognitionRef.current) {
      const errMsg = "Speech recognition not available. Try Chrome or Edge on HTTPS.";
      console.error("❌ [Voice AI]", errMsg);
      setErrorMessage(errMsg);
      toast.error(errMsg);
      return;
    }

    // Prevent double-start
    if (isRecognitionActiveRef.current) {
      console.warn("⚠️ [Voice AI] Recognition already active, stopping first");
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn("[Voice AI] Stop failed:", e);
      }
      await new Promise(r => setTimeout(r, 100));
    }

    try {
      // Request microphone permission explicitly
      console.log("🎧 [Voice AI] Requesting microphone permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("✅ [Voice AI] Audio permission granted");

      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach(track => track.stop());

      // Clear previous state
      setTranscription("");
      setResponse("");
      setShowExamples(false);
      setIsListening(true);

      console.log("🎙️ [Voice AI] Starting recognition...");
      recognitionRef.current.start();
      toast.info("🎙️ Listening... Speak now!");

    } catch (error) {
      console.error("❌ [Voice AI] Microphone error:", error);
      setIsListening(false);

      let errMsg = "Microphone error";
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errMsg = "Microphone blocked. Click lock icon in address bar to enable.";
      } else if (error.name === 'NotFoundError') {
        errMsg = "No microphone found.";
      } else if (error.name === 'NotReadableError') {
        errMsg = "Microphone is in use by another app.";
      } else {
        errMsg = `Mic error: ${error.message || error.name}`;
      }

      setErrorMessage(errMsg);
      toast.error(errMsg);
    }
  }, []);

  // Stop listening
  const stopListening = useCallback(() => {
    console.log("🛑 [Voice AI] Stop requested");
    if (recognitionRef.current && isRecognitionActiveRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn("[Voice AI] Stop error:", e);
      }
    }
    setIsListening(false);
  }, []);

  // Process transcript with Gemini via backend
  const processWithGemini = async (transcript) => {
    if (!transcript || transcript.trim() === "") {
      console.warn("⚠️ [Voice AI] Empty transcript, skipping Gemini");
      return;
    }

    console.log("🤖 [Voice AI] Sending to Gemini:", transcript);
    setIsProcessing(true);
    setDebugInfo("Thinking...");

    try {
      const payload = { message: transcript, context: [] };
      console.log("📡 [Voice AI] API URL:", `${API}/aimee/chat-simple`);
      console.log("📡 [Voice AI] Payload:", JSON.stringify(payload));

      const res = await axios.post(`${API}/aimee/chat-simple`, payload, {
        timeout: 30000, // 30 second timeout
        headers: { 'Content-Type': 'application/json' }
      });

      console.log("📡 [Voice AI] Response status:", res.status);
      console.log("📡 [Voice AI] Response data:", res.data);

      const geminiResponse = res.data?.response;

      if (!geminiResponse) {
        throw new Error("Empty response from Gemini");
      }

      console.log("✅ [Voice AI] Gemini response:", geminiResponse);
      setResponse(geminiResponse);
      setDebugInfo("Got response!");

      // Speak the response
      speakResponse(geminiResponse);

      // Check for navigation commands
      handleNavigationCommand(transcript);

    } catch (error) {
      console.error("❌ [Voice AI] Gemini error:", error);

      let errorMsg = "AI error. Please try again.";

      if (error.code === 'ECONNABORTED') {
        errorMsg = "Request timed out. Check your connection.";
      } else if (error.response) {
        // Server responded with error
        console.error("📡 [Voice AI] Server error:", error.response.status, error.response.data);
        errorMsg = `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response (NETWORK ERROR)
        console.error("🌐 [Voice AI] NETWORK ERROR - No response received");
        console.error("🌐 [Voice AI] Is backend running? Check:", API);
        errorMsg = "Network error. Is the backend running?";
        setDebugInfo(`Cannot reach: ${API}`);
      } else {
        errorMsg = error.message || "Unknown error";
      }

      setErrorMessage(errorMsg);
      setResponse(errorMsg);

      // Still try to speak the error
      speakResponse("Sorry, I couldn't process that. Please try again.");

    } finally {
      setIsProcessing(false);
    }
  };

  // Text-to-Speech response
  const speakResponse = (text) => {
    console.log("🔊 [Voice AI] Speaking response...");

    if (!text || text.trim() === "") {
      console.warn("⚠️ [Voice AI] Empty text, not speaking");
      return;
    }

    if (!('speechSynthesis' in window)) {
      console.error("❌ [Voice AI] TTS not supported");
      setErrorMessage("Text-to-speech not supported in this browser.");
      return;
    }

    try {
      // Cancel any ongoing speech to prevent overlap
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = 'en-US';

      // Get voices and try to use a good one
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(v =>
        v.name.includes('Samantha') ||
        v.name.includes('Google US English') ||
        v.name.includes('Microsoft Zira') ||
        (v.lang === 'en-US' && v.name.includes('Female'))
      ) || voices.find(v => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log("🔊 [Voice AI] Using voice:", preferredVoice.name);
      }

      utterance.onstart = () => console.log("🔊 [Voice AI] Speech started");
      utterance.onend = () => console.log("🔊 [Voice AI] Speech ended");
      utterance.onerror = (e) => console.error("❌ [Voice AI] Speech error:", e);

      speechSynthesis.speak(utterance);

    } catch (error) {
      console.error("❌ [Voice AI] TTS error:", error);
      setErrorMessage(`Speech error: ${error.message}`);
    }
  };

  // Handle navigation commands in transcript
  const handleNavigationCommand = (transcript) => {
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
        console.log("🧭 [Voice AI] Navigating to:", path);
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
    console.log("📌 [Voice AI] Example clicked:", example.text);
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
                    {isAvailable === null ? 'Checking...' : isAvailable ? 'Ready' : 'Not Supported'}
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

            {/* Error Display */}
            {errorMessage && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-300 text-xs">{errorMessage}</p>
                </div>
              </div>
            )}

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
                  <p className="text-white/60 text-xs">Speak clearly</p>
                </div>
              )}

              {/* Processing Animation */}
              {isProcessing && (
                <div className="flex flex-col items-center py-4">
                  <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-2" />
                  <p className="text-white text-sm">Thinking...</p>
                  {debugInfo && <p className="text-white/40 text-xs">{debugInfo}</p>}
                </div>
              )}

              {/* Main Button */}
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing || isAvailable === false}
                className={`w-full h-14 text-lg font-bold ${isListening
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                  } ${isAvailable === false ? 'opacity-50 cursor-not-allowed' : ''}`}
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

              {/* Debug Info */}
              {debugInfo && !isProcessing && (
                <p className="text-center text-white/30 text-[10px]">{debugInfo}</p>
              )}

              {/* Powered by badge */}
              <div className="text-center">
                <Badge className="bg-white/10 text-white/60 border-0 text-[10px]">
                  🎙️ Web Speech + Gemini AI
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
