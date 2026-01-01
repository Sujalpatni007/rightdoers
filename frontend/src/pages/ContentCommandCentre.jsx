import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Sparkles,
  Globe,
  Share2,
  FileText,
  Rocket,
  Users,
  GraduationCap,
  Building2,
  Target,
  Languages,
  Download,
  Send,
  Image as ImageIcon,
  Video,
  Quote,
  Award,
  Shield,
  FileSignature,
  Briefcase,
  ChevronRight,
  Zap,
  TrendingUp,
  Heart,
  Star,
  RefreshCw
} from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Indian Languages
const LANGUAGES = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिंदी" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
];

// Reel Templates
const REEL_TEMPLATES = [
  { id: "doers_journey", name: "My DOERS Journey", icon: Rocket, color: "from-purple-500 to-indigo-600" },
  { id: "talent_card_reveal", name: "Talent Card Reveal", icon: Award, color: "from-amber-500 to-orange-600" },
  { id: "success_story", name: "Success Story Spotlight", icon: Star, color: "from-emerald-500 to-teal-600" },
  { id: "career_mantra", name: "Career Mantra", icon: Quote, color: "from-pink-500 to-rose-600" },
  { id: "new_year_wish", name: "New Year Career Wish 2026", icon: Sparkles, color: "from-blue-500 to-cyan-600" },
  { id: "5e_journey", name: "5E Journey Progress", icon: TrendingUp, color: "from-violet-500 to-purple-600" },
];

// Target Audiences
const AUDIENCES = [
  { id: "entrepreneur", name: "Entrepreneurs", icon: Rocket, description: "Startup founders & business builders" },
  { id: "student", name: "Students", icon: GraduationCap, description: "Career seekers & graduates" },
  { id: "corporate", name: "Corporate Professionals", icon: Building2, description: "Working professionals" },
  { id: "repeater", name: "Career Comeback", icon: RefreshCw, description: "Those seeking second chances" },
];

export default function ContentCommandCentre() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("reels");
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  
  // Reel Creator State
  const [reelTemplate, setReelTemplate] = useState("career_mantra");
  const [reelMessage, setReelMessage] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState(["en", "hi", "kn"]);
  const [translations, setTranslations] = useState({});
  const [generatedImage, setGeneratedImage] = useState(null);
  
  // Share Card State
  const [cardName, setCardName] = useState("");
  const [cardScore, setCardScore] = useState(750);
  const [cardLevel, setCardLevel] = useState("PROFESSIONAL");
  const [cardSkills, setCardSkills] = useState("Communication, Leadership, Problem Solving");
  const [cardCareer, setCardCareer] = useState("Product Manager");
  
  // Mantra State
  const [mantraAudience, setMantraAudience] = useState("entrepreneur");
  const [currentMantra, setCurrentMantra] = useState(null);
  const [mantraImage, setMantraImage] = useState(null);
  
  // Legal Docs State
  const [ndaName, setNdaName] = useState("");
  const [ndaEmail, setNdaEmail] = useState("");
  const [ndaPhone, setNdaPhone] = useState("");
  
  const [offerName, setOfferName] = useState("");
  const [offerEmail, setOfferEmail] = useState("");
  const [offerPosition, setOfferPosition] = useState("");
  const [offerDivision, setOfferDivision] = useState("Technology");
  const [offerSalary, setOfferSalary] = useState(1200000);
  const [offerJoiningDate, setOfferJoiningDate] = useState("");

  // Translate content to multiple languages
  const handleTranslate = async () => {
    if (!reelMessage.trim()) {
      toast.error("Please enter a message to translate");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/content/translate`, {
        text: reelMessage,
        languages: selectedLanguages
      });
      setTranslations(response.data.translations);
      toast.success(`Translated to ${selectedLanguages.length} languages!`);
    } catch (error) {
      console.error("Translation error:", error);
      // Fallback: just show original in all languages
      const fallback = {};
      selectedLanguages.forEach(lang => {
        fallback[lang] = reelMessage;
      });
      setTranslations(fallback);
      toast.info("Using original text (AI translation coming soon)");
    } finally {
      setLoading(false);
    }
  };

  // Generate AI image for reel
  const handleGenerateReelImage = async () => {
    setLoading(true);
    try {
      const template = REEL_TEMPLATES.find(t => t.id === reelTemplate);
      const response = await axios.post(`${API}/content/generate-image`, {
        template: reelTemplate,
        message: reelMessage || `${template?.name} - Career Transformation`,
        style: "vibrant"
      });
      
      if (response.data.image_base64) {
        setGeneratedImage(`data:image/png;base64,${response.data.image_base64}`);
        toast.success("Image generated successfully!");
      }
    } catch (error) {
      console.error("Image generation error:", error);
      toast.error("Image generation unavailable. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Generate Share Card
  const handleGenerateShareCard = async () => {
    if (!cardName.trim()) {
      toast.error("Please enter a name");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/content/share-card`, {
        name: cardName,
        doers_score: cardScore,
        adaptive_level: cardLevel,
        top_skills: cardSkills.split(",").map(s => s.trim()),
        career_match: cardCareer
      });
      
      setGeneratedContent(response.data);
      if (response.data.image_base64) {
        setGeneratedImage(`data:image/png;base64,${response.data.image_base64}`);
      }
      toast.success("Share Card created!");
    } catch (error) {
      console.error("Share card error:", error);
      toast.error("Error generating share card");
    } finally {
      setLoading(false);
    }
  };

  // Get Random Mantra
  const handleGetMantra = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/content/mantra/${mantraAudience}`);
      setCurrentMantra(response.data);
      
      // Also generate image
      if (response.data.image_base64) {
        setMantraImage(`data:image/png;base64,${response.data.image_base64}`);
      }
      toast.success("New mantra loaded!");
    } catch (error) {
      console.error("Mantra error:", error);
      // Fallback mantras
      const fallbacks = {
        entrepreneur: "Build your dream or someone else will hire you to build theirs.",
        student: "Your career is a marathon, not a sprint. Start strong.",
        corporate: "Work that feels like play creates extraordinary results.",
        repeater: "Failure is feedback. Use it to fuel your comeback."
      };
      setCurrentMantra({
        text: fallbacks[mantraAudience],
        category: "motivation",
        audience: mantraAudience
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate NDA
  const handleGenerateNDA = async () => {
    if (!ndaName || !ndaEmail) {
      toast.error("Please fill in recipient details");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/content/legal/nda`, {
        recipient_name: ndaName,
        recipient_email: ndaEmail,
        recipient_phone: ndaPhone,
        effective_date: new Date().toISOString().split('T')[0]
      });
      
      // Open in new tab or download
      const blob = new Blob([response.data.html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      toast.success("NDA generated!");
    } catch (error) {
      console.error("NDA error:", error);
      toast.error("Error generating NDA");
    } finally {
      setLoading(false);
    }
  };

  // Generate Offer Letter
  const handleGenerateOffer = async () => {
    if (!offerName || !offerEmail || !offerPosition) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/content/legal/offer`, {
        candidate_name: offerName,
        candidate_email: offerEmail,
        position: offerPosition,
        division: offerDivision,
        salary_annual: offerSalary,
        joining_date: offerJoiningDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      
      const blob = new Blob([response.data.html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      toast.success("Offer Letter generated!");
    } catch (error) {
      console.error("Offer error:", error);
      toast.error("Error generating offer letter");
    } finally {
      setLoading(false);
    }
  };

  // Toggle language selection
  const toggleLanguage = (code) => {
    if (selectedLanguages.includes(code)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== code));
    } else {
      setSelectedLanguages([...selectedLanguages, code]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/welcome")}
                className="text-white/70 hover:text-white"
              >
                ← Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-amber-400" />
                  Content Command Centre
                </h1>
                <p className="text-white/60 text-sm">Create viral, multi-lingual content for your GTM strategy</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                <Zap className="h-3 w-3 mr-1" /> AI Powered
              </Badge>
              <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/50">
                🎯 GTM Ready
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">10K</p>
              <p className="text-purple-300 text-xs">Users Target</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-600/30 to-amber-800/30 border-amber-500/30">
            <CardContent className="p-4 text-center">
              <Globe className="h-8 w-8 text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">10+</p>
              <p className="text-amber-300 text-xs">Languages</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-600/30 to-emerald-800/30 border-emerald-500/30">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">5</p>
              <p className="text-emerald-300 text-xs">Segments</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-rose-600/30 to-rose-800/30 border-rose-500/30">
            <CardContent className="p-4 text-center">
              <Rocket className="h-8 w-8 text-rose-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">7</p>
              <p className="text-rose-300 text-xs">Days to Dubai</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-black/30 border border-white/10 p-1 w-full justify-start overflow-x-auto">
            <TabsTrigger value="reels" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Video className="h-4 w-4 mr-2" /> Reel Creator
            </TabsTrigger>
            <TabsTrigger value="cards" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Award className="h-4 w-4 mr-2" /> Share Cards
            </TabsTrigger>
            <TabsTrigger value="mantras" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
              <Quote className="h-4 w-4 mr-2" /> Career Mantras
            </TabsTrigger>
            <TabsTrigger value="legal" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Shield className="h-4 w-4 mr-2" /> Legal Docs
            </TabsTrigger>
          </TabsList>

          {/* REEL CREATOR TAB */}
          <TabsContent value="reels" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Template Selection */}
              <Card className="bg-black/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Video className="h-5 w-5 text-purple-400" />
                    Select Template
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {REEL_TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setReelTemplate(template.id)}
                        data-testid={`template-${template.id}`}
                        className={`p-4 rounded-lg border transition-all ${
                          reelTemplate === template.id
                            ? `bg-gradient-to-r ${template.color} border-white/30`
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <template.icon className="h-6 w-6 text-white mx-auto mb-2" />
                        <p className="text-white text-sm font-medium">{template.name}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Message Input */}
              <Card className="bg-black/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Languages className="h-5 w-5 text-amber-400" />
                    Multi-Lingual Message
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white/70">Your Message (English)</Label>
                    <Textarea
                      placeholder="Enter your message... e.g., 'New Year 2026 wishes from Right Doers World!'"
                      value={reelMessage}
                      onChange={(e) => setReelMessage(e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-2"
                      rows={3}
                      data-testid="reel-message-input"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white/70 mb-2 block">Select Languages</Label>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map((lang) => (
                        <Badge
                          key={lang.code}
                          variant={selectedLanguages.includes(lang.code) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            selectedLanguages.includes(lang.code)
                              ? "bg-purple-600 text-white"
                              : "bg-transparent text-white/70 border-white/20"
                          }`}
                          onClick={() => toggleLanguage(lang.code)}
                          data-testid={`lang-${lang.code}`}
                        >
                          {lang.native}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleTranslate}
                      disabled={loading}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      data-testid="translate-btn"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Translate All
                    </Button>
                    <Button
                      onClick={handleGenerateReelImage}
                      disabled={loading}
                      className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                      data-testid="generate-image-btn"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Generate Image
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Translations Display */}
            {Object.keys(translations).length > 0 && (
              <Card className="bg-black/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Translations Ready</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(translations).map(([lang, text]) => (
                      <div key={lang} className="p-4 bg-white/5 rounded-lg">
                        <Badge className="mb-2 bg-purple-600">{LANGUAGES.find(l => l.code === lang)?.native || lang}</Badge>
                        <p className="text-white/90">{text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated Image */}
            {generatedImage && (
              <Card className="bg-black/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Generated Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <img src={generatedImage} alt="Generated" className="max-w-md rounded-lg shadow-xl" />
                  </div>
                  <div className="flex justify-center gap-2 mt-4">
                    <Button variant="outline" className="border-white/20 text-white">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Share2 className="h-4 w-4 mr-2" /> Share to WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* SHARE CARDS TAB */}
          <TabsContent value="cards" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-400" />
                    DoersScore™ Share Card
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Create viral-ready talent cards to share on social media
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white/70">Full Name</Label>
                    <Input
                      placeholder="Enter your name"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-1"
                      data-testid="card-name-input"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/70">DoersScore™</Label>
                      <Input
                        type="number"
                        min={300}
                        max={900}
                        value={cardScore}
                        onChange={(e) => setCardScore(parseInt(e.target.value))}
                        className="bg-white/5 border-white/10 text-white mt-1"
                        data-testid="card-score-input"
                      />
                    </div>
                    <div>
                      <Label className="text-white/70">Adaptive Level</Label>
                      <Select value={cardLevel} onValueChange={setCardLevel}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PARA">PARA</SelectItem>
                          <SelectItem value="ASSOCIATE">ASSOCIATE</SelectItem>
                          <SelectItem value="MANAGER">MANAGER</SelectItem>
                          <SelectItem value="PROFESSIONAL">PROFESSIONAL</SelectItem>
                          <SelectItem value="EXPERT">EXPERT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white/70">Top Skills (comma separated)</Label>
                    <Input
                      placeholder="Communication, Leadership, Problem Solving"
                      value={cardSkills}
                      onChange={(e) => setCardSkills(e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-1"
                      data-testid="card-skills-input"
                    />
                  </div>

                  <div>
                    <Label className="text-white/70">Career Match</Label>
                    <Input
                      placeholder="e.g., Product Manager, Fashion Designer"
                      value={cardCareer}
                      onChange={(e) => setCardCareer(e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-1"
                      data-testid="card-career-input"
                    />
                  </div>

                  <Button
                    onClick={handleGenerateShareCard}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                    data-testid="generate-card-btn"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Share Card
                  </Button>
                </CardContent>
              </Card>

              {/* Preview Card */}
              <Card className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-white/60 text-sm">PREVIEW</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-white/10 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-purple-400 font-bold text-lg">🚀 RIGHT DOERS</span>
                      <Badge className="bg-amber-500 text-black">Verified</Badge>
                    </div>
                    
                    <div className="text-center py-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{cardName.charAt(0) || "?"}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">{cardName || "Your Name"}</h3>
                      <p className="text-purple-400">{cardCareer || "Your Career"}</p>
                    </div>

                    <div className="bg-black/30 rounded-lg p-4 my-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">DoersScore™</span>
                        <span className="text-3xl font-bold text-amber-400">{cardScore}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                          style={{ width: `${((cardScore - 300) / 600) * 100}%` }}
                        />
                      </div>
                      <p className="text-right text-xs text-white/50 mt-1">{cardLevel}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {cardSkills.split(",").slice(0, 3).map((skill, i) => (
                        <Badge key={i} variant="outline" className="border-purple-500/50 text-purple-300">
                          {skill.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* CAREER MANTRAS TAB */}
          <TabsContent value="mantras" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Quote className="h-5 w-5 text-pink-400" />
                    Daily Career Mantra
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Inspirational quotes for dreamers, doers & disrupters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white/70 mb-3 block">Select Audience</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {AUDIENCES.map((audience) => (
                        <button
                          key={audience.id}
                          onClick={() => setMantraAudience(audience.id)}
                          data-testid={`audience-${audience.id}`}
                          className={`p-4 rounded-lg border transition-all text-left ${
                            mantraAudience === audience.id
                              ? "bg-pink-600/30 border-pink-500/50"
                              : "bg-white/5 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          <audience.icon className={`h-6 w-6 mb-2 ${
                            mantraAudience === audience.id ? "text-pink-400" : "text-white/70"
                          }`} />
                          <p className="text-white font-medium">{audience.name}</p>
                          <p className="text-white/50 text-xs">{audience.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleGetMantra}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                    data-testid="get-mantra-btn"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Get New Mantra
                  </Button>
                </CardContent>
              </Card>

              {/* Mantra Display */}
              <Card className="bg-gradient-to-br from-pink-900/30 to-rose-900/30 border-pink-500/30">
                <CardContent className="p-6 flex flex-col justify-center min-h-[300px]">
                  {currentMantra ? (
                    <div className="text-center">
                      <Quote className="h-12 w-12 text-pink-400 mx-auto mb-4 opacity-50" />
                      <p className="text-2xl text-white font-medium leading-relaxed mb-4">
                        &quot;{currentMantra.text}&quot;
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <Badge className="bg-pink-600">{currentMantra.category}</Badge>
                        <Badge variant="outline" className="border-pink-500/50 text-pink-300">
                          For {AUDIENCES.find(a => a.id === currentMantra.audience)?.name}
                        </Badge>
                      </div>
                      <div className="flex justify-center gap-2 mt-6">
                        <Button variant="outline" className="border-white/20 text-white">
                          <Download className="h-4 w-4 mr-2" /> Download
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Share2 className="h-4 w-4 mr-2" /> Share
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-white/50">
                      <Quote className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <p>Click &quot;Get New Mantra&quot; to generate an inspirational quote</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* LEGAL DOCS TAB */}
          <TabsContent value="legal" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* NDA Generator */}
              <Card className="bg-black/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-400" />
                    NDA Generator
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Generate Non-Disclosure Agreements for team members
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white/70">Recipient Name</Label>
                    <Input
                      placeholder="Full legal name"
                      value={ndaName}
                      onChange={(e) => setNdaName(e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-1"
                      data-testid="nda-name-input"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70">Email</Label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={ndaEmail}
                      onChange={(e) => setNdaEmail(e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-1"
                      data-testid="nda-email-input"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70">WhatsApp Number</Label>
                    <Input
                      placeholder="+91 98765 43210"
                      value={ndaPhone}
                      onChange={(e) => setNdaPhone(e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-1"
                      data-testid="nda-phone-input"
                    />
                  </div>
                  <Button
                    onClick={handleGenerateNDA}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    data-testid="generate-nda-btn"
                  >
                    <FileSignature className="h-4 w-4 mr-2" />
                    Generate NDA
                  </Button>
                </CardContent>
              </Card>

              {/* Offer Letter Generator */}
              <Card className="bg-black/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-400" />
                    Offer Letter Generator
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Create professional offer letters for new hires
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/70">Candidate Name</Label>
                      <Input
                        placeholder="Full name"
                        value={offerName}
                        onChange={(e) => setOfferName(e.target.value)}
                        className="bg-white/5 border-white/10 text-white mt-1"
                        data-testid="offer-name-input"
                      />
                    </div>
                    <div>
                      <Label className="text-white/70">Email</Label>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={offerEmail}
                        onChange={(e) => setOfferEmail(e.target.value)}
                        className="bg-white/5 border-white/10 text-white mt-1"
                        data-testid="offer-email-input"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/70">Position</Label>
                      <Input
                        placeholder="e.g., Division Director"
                        value={offerPosition}
                        onChange={(e) => setOfferPosition(e.target.value)}
                        className="bg-white/5 border-white/10 text-white mt-1"
                        data-testid="offer-position-input"
                      />
                    </div>
                    <div>
                      <Label className="text-white/70">Division</Label>
                      <Select value={offerDivision} onValueChange={setOfferDivision}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Legal">Legal</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Health">Health</SelectItem>
                          <SelectItem value="Security">Security</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/70">Annual CTC (₹)</Label>
                      <Input
                        type="number"
                        value={offerSalary}
                        onChange={(e) => setOfferSalary(parseInt(e.target.value))}
                        className="bg-white/5 border-white/10 text-white mt-1"
                        data-testid="offer-salary-input"
                      />
                    </div>
                    <div>
                      <Label className="text-white/70">Joining Date</Label>
                      <Input
                        type="date"
                        value={offerJoiningDate}
                        onChange={(e) => setOfferJoiningDate(e.target.value)}
                        className="bg-white/5 border-white/10 text-white mt-1"
                        data-testid="offer-date-input"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleGenerateOffer}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    data-testid="generate-offer-btn"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Offer Letter
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* DOERS Legal AI Info */}
            <Card className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border-emerald-500/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/20 rounded-lg">
                    <Shield className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">DOERS LEGAL AI Division</h3>
                    <p className="text-white/70 mb-4">
                      Responsible AI Governance & Compliance Services - One of the most profitable AI businesses for 2026.
                      Automated NDA signing, digital signatures via WhatsApp, and smart contract management.
                    </p>
                    <div className="flex gap-2">
                      <Badge className="bg-emerald-600">$50K-$100K/month potential</Badge>
                      <Badge variant="outline" className="border-emerald-500/50 text-emerald-300">High Effort • High Reward</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
