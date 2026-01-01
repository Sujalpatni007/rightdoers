import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Wifi,
  WifiOff,
  Globe,
  Send,
  Mic,
  MapPin,
  GraduationCap,
  Briefcase,
  Heart,
  Users,
  Sparkles,
  MessageCircle,
  ChevronRight,
  RefreshCw,
  Download,
  Smartphone,
  Signal,
  Building2,
  CloudOff,
  HardDrive,
  Zap
} from "lucide-react";
import axios from "axios";
import { usePWA, useOfflineStorage } from "@/hooks/usePWA";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Supported Languages
const LANGUAGES = [
  { code: "en", name: "English", native: "English", flag: "🇬🇧" },
  { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳", region: "Srikakulum" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳", region: "Chickmagalur" },
  { code: "hi", name: "Hindi", native: "हिंदी", flag: "🇮🇳", region: "Pan-India" },
];

// Quick Questions for Rural Users
const QUICK_QUESTIONS = {
  en: [
    "What career suits me?",
    "How to improve my income?",
    "Government schemes for jobs",
    "Skill training near me"
  ],
  te: [
    "నాకు ఏ కెరీర్ సరిపోతుంది?",
    "నా ఆదాయాన్ని ఎలా పెంచుకోవాలి?",
    "ఉద్యోగాల కోసం ప్రభుత్వ పథకాలు",
    "నా సమీపంలో స్కిల్ ట్రైనింగ్"
  ],
  kn: [
    "ನನಗೆ ಯಾವ ವೃತ್ತಿ ಸರಿಹೊಂದುತ್ತದೆ?",
    "ನನ್ನ ಆದಾಯವನ್ನು ಹೇಗೆ ಸುಧಾರಿಸುವುದು?",
    "ಉದ್ಯೋಗಗಳಿಗೆ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    "ನನ್ನ ಹತ್ತಿರ ಕೌಶಲ್ಯ ತರಬೇತಿ"
  ],
  hi: [
    "मेरे लिए कौन सा करियर सही है?",
    "अपनी आय कैसे बढ़ाएं?",
    "नौकरियों के लिए सरकारी योजनाएं",
    "मेरे पास स्किल ट्रेनिंग"
  ]
};

// Career Categories for LIG Workers
const CAREER_CATEGORIES = [
  { id: "digital", icon: Smartphone, name_en: "Digital Skills", name_te: "డిజిటల్ నైపుణ్యాలు", name_kn: "ಡಿಜಿಟಲ್ ಕೌಶಲ್ಯಗಳು" },
  { id: "agriculture", icon: Heart, name_en: "Agriculture Tech", name_te: "వ్యవసాయ టెక్", name_kn: "ಕೃಷಿ ತಂತ್ರಜ್ಞಾನ" },
  { id: "healthcare", icon: Heart, name_en: "Healthcare", name_te: "ఆరోగ్య సేవలు", name_kn: "ಆರೋಗ್ಯ ಸೇವೆ" },
  { id: "skilled", icon: Briefcase, name_en: "Skilled Trades", name_te: "నైపుణ్య వృత్తులు", name_kn: "ಕುಶಲ ವೃತ್ತಿಗಳು" },
];

export default function GemmaOffline() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [careerData, setCareerData] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const messagesEndRef = useRef(null);
  
  // PWA Hooks
  const { 
    isOnline, 
    isInstallable, 
    isInstalled,
    installApp, 
    swVersion,
    cacheGemmaData 
  } = usePWA();
  
  const { 
    isReady: dbReady,
    saveConversation,
    getConversations,
    saveCareerData: saveCareerToDb,
    getCareerData: getCareerFromDb
  } = useOfflineStorage();

  // Show install banner for rural users
  useEffect(() => {
    if (isInstallable && !isInstalled && (language === "te" || language === "kn")) {
      setTimeout(() => setShowInstallBanner(true), 3000);
    }
  }, [isInstallable, isInstalled, language]);

  // Handle network status changes
  useEffect(() => {
    if (isOnline) {
      toast.success(language === "te" ? "ఆన్‌లైన్‌కు కనెక్ట్ అయింది!" : 
                    language === "kn" ? "ಆನ್‌ಲೈನ್‌ಗೆ ಸಂಪರ್ಕಗೊಂಡಿದೆ!" : 
                    "Connected to internet!");
    }
  }, [isOnline, language]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch and cache career data on mount
  useEffect(() => {
    fetchCareerData();
  }, [language, dbReady]);

  const fetchCareerData = async () => {
    try {
      // Try to get from IndexedDB first (offline-first)
      if (dbReady) {
        const cachedData = await getCareerFromDb("lig_workers", language);
        if (cachedData) {
          setCareerData(cachedData);
          console.log("[Gemma] Using cached career data from IndexedDB");
        }
      }
      
      // If online, fetch fresh data and cache it
      if (isOnline) {
        const response = await axios.get(`${API}/gemma/career-data?language=${language}`);
        setCareerData(response.data);
        
        // Cache in IndexedDB for offline use
        if (dbReady) {
          await saveCareerToDb("lig_workers", language, response.data);
          console.log("[Gemma] Career data cached to IndexedDB");
        }
        
        // Also cache in service worker
        cacheGemmaData({ careerData: response.data, language });
      }
    } catch (error) {
      console.log("[Gemma] Using offline career data");
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      const response = await axios.post(`${API}/gemma/chat`, {
        query: text,
        language: language,
        is_offline: !isOnline,
        region: language === "te" ? "Srikakulum" : language === "kn" ? "Chickmagalur" : null
      });

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: response.data.response,
        is_cached: response.data.is_cached,
        related_resources: response.data.related_resources,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Save conversation to IndexedDB for offline history
      if (dbReady) {
        await saveConversation({
          query: text,
          response: response.data.response,
          language: language,
          is_cached: response.data.is_cached
        });
      }
      
      // Also save to localStorage as backup
      saveToOfflineCache(text, response.data.response, language);
      
    } catch (error) {
      console.error("[Gemma] Chat error:", error);
      
      // Fallback offline response
      const offlineResponse = getOfflineResponse(text, language);
      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: offlineResponse,
        is_cached: true,
        offline_fallback: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Save fallback conversation
      if (dbReady) {
        await saveConversation({
          query: text,
          response: offlineResponse,
          language: language,
          is_cached: true,
          offline_fallback: true
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getOfflineResponse = (query, lang) => {
    // Basic offline responses
    const responses = {
      en: "I'm here to help with career guidance. You can ask about: job opportunities, government schemes (PMKVY, Mudra), skill training, and career paths suitable for your education level.",
      te: "నేను కెరీర్ మార్గదర్శనంలో సహాయం చేయడానికి ఇక్కడ ఉన్నాను. మీరు అడగవచ్చు: ఉద్యోగ అవకాశాలు, ప్రభుత్వ పథకాలు (PMKVY, ముద్ర), స్కిల్ ట్రైనింగ్, మీ విద్యా స్థాయికి అనుకూలమైన కెరీర్ మార్గాలు.",
      kn: "ನಾನು ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನದಲ್ಲಿ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ. ನೀವು ಕೇಳಬಹುದು: ಉದ್ಯೋಗಾವಕಾಶಗಳು, ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು (PMKVY, ಮುದ್ರಾ), ಕೌಶಲ್ಯ ತರಬೇತಿ, ನಿಮ್ಮ ಶಿಕ್ಷಣ ಮಟ್ಟಕ್ಕೆ ಸೂಕ್ತ ವೃತ್ತಿ ಮಾರ್ಗಗಳು.",
      hi: "मैं करियर मार्गदर्शन में मदद के लिए यहां हूं। आप पूछ सकते हैं: नौकरी के अवसर, सरकारी योजनाएं (PMKVY, मुद्रा), स्किल ट्रेनिंग, आपके शिक्षा स्तर के लिए उपयुक्त करियर पथ।"
    };
    return responses[lang] || responses.en;
  };

  const saveToOfflineCache = (query, response, lang) => {
    try {
      const cacheKey = `gemma_cache_${lang}`;
      const existingCache = JSON.parse(localStorage.getItem(cacheKey) || "{}");
      existingCache[query.toLowerCase().trim()] = {
        response,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(cacheKey, JSON.stringify(existingCache));
    } catch (e) {
      console.log("Cache save error:", e);
    }
  };

  const handleQuickQuestion = (question) => {
    sendMessage(question);
  };

  const getLanguageText = (key) => {
    const texts = {
      greeting: {
        en: "Hello! I'm your Career Guide AI",
        te: "నమస్కారం! నేను మీ కెరీర్ గైడ్ AI",
        kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶಿ AI",
        hi: "नमस्ते! मैं आपका करियर गाइड AI हूं"
      },
      askAnything: {
        en: "Ask me anything about careers...",
        te: "కెరీర్ల గురించి ఏదైనా అడగండి...",
        kn: "ವೃತ್ತಿಗಳ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ...",
        hi: "करियर के बारे में कुछ भी पूछें..."
      },
      quickQuestions: {
        en: "Quick Questions",
        te: "శీఘ్ర ప్రశ్నలు",
        kn: "ತ್ವರಿತ ಪ್ರಶ್ನೆಗಳು",
        hi: "त्वरित प्रश्न"
      },
      offlineMode: {
        en: "Offline Mode - Using cached data",
        te: "ఆఫ్‌లైన్ మోడ్ - క్యాష్ డేటా వాడుతోంది",
        kn: "ಆಫ್‌ಲೈನ್ ಮೋಡ್ - ಕ್ಯಾಶ್ ಡೇಟಾ ಬಳಸುತ್ತಿದೆ",
        hi: "ऑफ़लाइन मोड - कैश्ड डेटा का उपयोग"
      },
      send: {
        en: "Send",
        te: "పంపండి",
        kn: "ಕಳುಹಿಸಿ",
        hi: "भेजें"
      }
    };
    return texts[key]?.[language] || texts[key]?.en || key;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900">
      {/* Offline/Online Status Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 py-2 px-4 flex items-center justify-center gap-2 ${
        isOnline ? "bg-emerald-600" : "bg-amber-600"
      }`}>
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4 text-white" />
            <span className="text-white text-sm font-medium">Online - Full AI Available</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-white" />
            <span className="text-white text-sm font-medium">{getLanguageText("offlineMode")}</span>
          </>
        )}
      </div>

      {/* Header */}
      <div className="pt-14 bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate("/welcome")}
                className="text-white/70 hover:text-white"
              >
                ← Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-400" />
                  Gemma Offline AI
                </h1>
                <p className="text-white/60 text-xs">
                  {language === "te" ? "గ్రామీణ భారతదేశం కోసం" : 
                   language === "kn" ? "ಗ್ರಾಮೀಣ ಭಾರತಕ್ಕಾಗಿ" : 
                   "For Rural India"}
                </p>
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="flex gap-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  data-testid={`lang-btn-${lang.code}`}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    language === lang.code
                      ? "bg-emerald-600 text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  <span className="mr-1">{lang.flag}</span>
                  {lang.native}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Region Info */}
        {(language === "te" || language === "kn") && (
          <Card className="bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border-emerald-500/30 mb-6">
            <CardContent className="p-4 flex items-center gap-4">
              <MapPin className="h-8 w-8 text-emerald-400" />
              <div>
                <p className="text-white font-medium">
                  {language === "te" ? "శ్రీకాకుళం, ఆంధ్ర ప్రదేశ్" : "ಚಿಕ್ಕಮಗಳೂರು, ಕರ್ನಾಟಕ"}
                </p>
                <p className="text-white/60 text-sm">
                  {language === "te" ? "LIG కార్మికులు & కుటుంబాల కోసం" : "LIG ಕೆಲಸಗಾರರು & ಕುಟುಂಬಗಳಿಗಾಗಿ"}
                </p>
              </div>
              <Badge className="ml-auto bg-emerald-500/30 text-emerald-300 border-0">
                <Signal className="h-3 w-3 mr-1" />
                {language === "te" ? "ఆఫ్‌లైన్ సిద్ధం" : "ಆಫ್‌ಲೈನ್ ಸಿದ್ಧ"}
              </Badge>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Chat Section */}
          <div className="md:col-span-2">
            <Card className="bg-black/40 border-white/10 h-[500px] flex flex-col">
              <CardHeader className="border-b border-white/10 py-3">
                <CardTitle className="text-white flex items-center gap-2 text-lg">
                  <MessageCircle className="h-5 w-5 text-emerald-400" />
                  {getLanguageText("greeting")}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <Sparkles className="h-12 w-12 text-emerald-400 mx-auto mb-4 opacity-50" />
                    <p className="text-white/50">{getLanguageText("askAnything")}</p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-xl ${
                        message.role === "user"
                          ? "bg-emerald-600 text-white"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.is_cached && (
                        <Badge variant="outline" className="mt-2 text-xs border-white/20 text-white/50">
                          <Download className="h-3 w-3 mr-1" /> Offline
                        </Badge>
                      )}
                      {message.related_resources?.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-white/10">
                          <p className="text-xs text-white/50 mb-1">Related:</p>
                          {message.related_resources.map((res, i) => (
                            <Badge key={i} variant="outline" className="mr-1 mb-1 text-xs border-emerald-500/50 text-emerald-300">
                              {res.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 p-3 rounded-xl">
                      <RefreshCw className="h-5 w-5 text-emerald-400 animate-spin" />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(query);
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={getLanguageText("askAnything")}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    disabled={loading}
                    data-testid="chat-input"
                  />
                  <Button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    data-testid="send-btn"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </div>

          {/* Quick Questions & Categories */}
          <div className="space-y-4">
            {/* Quick Questions */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="py-3">
                <CardTitle className="text-white text-sm">{getLanguageText("quickQuestions")}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-2">
                {QUICK_QUESTIONS[language]?.map((question, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(question)}
                    data-testid={`quick-q-${i}`}
                    className="w-full p-3 text-left text-sm bg-white/5 hover:bg-white/10 rounded-lg text-white/80 transition-all flex items-center gap-2"
                  >
                    <ChevronRight className="h-4 w-4 text-emerald-400" />
                    {question}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Career Categories */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="py-3">
                <CardTitle className="text-white text-sm">
                  {language === "te" ? "కెరీర్ వర్గాలు" : 
                   language === "kn" ? "ವೃತ್ತಿ ವರ್ಗಗಳು" : 
                   "Career Categories"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 grid grid-cols-2 gap-2">
                {CAREER_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => sendMessage(`Tell me about ${cat.name_en} careers`)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-center"
                  >
                    <cat.icon className="h-6 w-6 text-emerald-400 mx-auto mb-1" />
                    <p className="text-white/80 text-xs">
                      {language === "te" ? cat.name_te : 
                       language === "kn" ? cat.name_kn : 
                       cat.name_en}
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Office Location */}
            <Card className="bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border-purple-500/30">
              <CardContent className="p-4">
                <Building2 className="h-6 w-6 text-purple-400 mb-2" />
                <p className="text-white font-bold text-sm">Right Doers World Pvt Ltd</p>
                <p className="text-white/60 text-xs">Global Capability Centre for Human Xperts</p>
                <p className="text-white/60 text-xs">15th Floor, World Trade Centre</p>
                <p className="text-white/60 text-xs">Bangalore, India</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
