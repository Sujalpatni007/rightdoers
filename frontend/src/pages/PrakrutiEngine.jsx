import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { 
  ArrowLeft, ArrowRight, Zap, Coins, Users, Target, Star, 
  Brain, Sparkles, Globe, Building, Heart, Shield, CircleDot,
  Flame, Wind, Droplets, Mountain, Sun, Moon, Crown, Gem
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import AstroDoer from "../components/AstroDoer";
import { toast } from "sonner";

// PRAKRUTI TYPES - Based on Ayurvedic Tridosha + Extended
const PRAKRUTI_TYPES = {
  vata: {
    id: "vata",
    name: "VATA",
    meaning: "Air & Space",
    icon: Wind,
    color: "#8B5CF6",
    traits: ["Creative", "Quick Thinking", "Adaptable", "Energetic"],
    careers: ["Technology", "Art", "Innovation", "Research"],
    element: "🌬️",
    character: "The Innovator",
    pandava: "Arjuna",
    rashi: ["Gemini", "Libra", "Aquarius"]
  },
  pitta: {
    id: "pitta",
    name: "PITTA",
    meaning: "Fire & Water",
    icon: Flame,
    color: "#F59E0B",
    traits: ["Leadership", "Ambitious", "Focused", "Decisive"],
    careers: ["Policy", "Legal", "Finance", "Management"],
    element: "🔥",
    character: "The Leader",
    pandava: "Yudhishthira",
    rashi: ["Aries", "Leo", "Sagittarius"]
  },
  kapha: {
    id: "kapha",
    name: "KAPHA",
    meaning: "Earth & Water",
    icon: Mountain,
    color: "#10B981",
    traits: ["Nurturing", "Patient", "Reliable", "Supportive"],
    careers: ["Health", "Education", "Food", "Hospitality"],
    element: "🌍",
    character: "The Nurturer",
    pandava: "Bhima",
    rashi: ["Taurus", "Virgo", "Capricorn"]
  },
  vata_pitta: {
    id: "vata_pitta",
    name: "VATA-PITTA",
    meaning: "Creative Leader",
    icon: Sun,
    color: "#EC4899",
    traits: ["Visionary", "Dynamic", "Strategic", "Charismatic"],
    careers: ["Entrepreneurship", "Science", "Security"],
    element: "☀️",
    character: "The Visionary",
    pandava: "Nakula",
    rashi: ["Cancer", "Scorpio", "Pisces"]
  },
  tridosha: {
    id: "tridosha",
    name: "TRIDOSHA",
    meaning: "Perfect Balance",
    icon: Crown,
    color: "#6366F1",
    traits: ["Balanced", "Wise", "Harmonious", "Universal"],
    careers: ["All Divisions", "Leadership", "Mentorship"],
    element: "👑",
    character: "The Harmonizer",
    pandava: "Sahadeva",
    rashi: ["All Signs"]
  }
};

// 5 CHARACTER CLUBS - PANCHA PANDAVAS (Order: Internal → External)
const CHARACTER_CLUBS = {
  dharma: {
    name: "DHARMA CLUB",
    pandava: "Yudhishthira",
    quality: "POWER KEEPER",
    icon: Shield,
    color: "#3B82F6",
    divisions: ["Policy", "Legal"],
    motto: "Foundation of All Power"
  },
  shakti: {
    name: "SHAKTI CLUB",
    pandava: "Bhima",
    quality: "WELLNESS SEEKER",
    icon: Heart,
    color: "#EF4444",
    divisions: ["Health", "Sports", "Food"],
    motto: "Health is True Wealth"
  },
  vidya: {
    name: "VIDYA CLUB",
    pandava: "Arjuna",
    quality: "PROBLEM SOLVER",
    icon: Target,
    color: "#8B5CF6",
    divisions: ["Technology", "Science", "Security"],
    motto: "Every Problem Has a Solution"
  },
  gyana: {
    name: "GYANA CLUB",
    pandava: "Sahadeva",
    quality: "KNOWLEDGE GIVER",
    icon: Brain,
    color: "#10B981",
    divisions: ["Education", "Transport"],
    motto: "Knowledge is Liberation"
  },
  kala: {
    name: "KALA CLUB",
    pandava: "Nakula",
    quality: "PROFIT MAXIMIZER",
    icon: Coins,
    color: "#F59E0B",
    divisions: ["Finance", "Art", "Hospitality"],
    motto: "Talent Creates Value"
  }
};

// CIRCULAR ECONOMY ENGINE - D-COIN TOKENIZATION
const ECONOMY_LAYERS = [
  {
    level: "L1",
    name: "EARN",
    description: "Complete Daily Capsules",
    dcoin: "+5 to +50",
    icon: Coins,
    color: "#F59E0B"
  },
  {
    level: "L2",
    name: "STAKE",
    description: "Lock D-COIN for Benefits",
    dcoin: "+10% APY",
    icon: Gem,
    color: "#8B5CF6"
  },
  {
    level: "L3",
    name: "SPEND",
    description: "Access Premium Content",
    dcoin: "-50 to -500",
    icon: Star,
    color: "#EC4899"
  },
  {
    level: "L4",
    name: "GIFT",
    description: "Mentor & Support Others",
    dcoin: "+Karma Points",
    icon: Heart,
    color: "#EF4444"
  },
  {
    level: "L5",
    name: "INVEST",
    description: "Co-Found Projects",
    dcoin: "Equity Tokens",
    icon: Building,
    color: "#10B981"
  }
];

// GLOCAL GURUKUL - CIRCULAR LEARN-EARN-LIFE MODEL
const CIRCULAR_MODEL = {
  learn: { icon: "📚", name: "LEARN", color: "#3B82F6" },
  earn: { icon: "💰", name: "EARN", color: "#F59E0B" },
  life: { icon: "🌟", name: "LIFE", color: "#10B981" }
};

// GLOCAL PROFICORN INITIATIVES
const GLOCAL_INITIATIVES = [
  {
    id: "ofoe",
    name: "OFOE",
    fullName: "One Family One Entrepreneur",
    description: "Every family has one business builder",
    icon: Users,
    target: "10M Families",
    color: "#3B82F6"
  },
  {
    id: "odop",
    name: "ODOP",
    fullName: "One District One Product",
    description: "Each district's unique specialty",
    icon: Globe,
    target: "750 Districts",
    color: "#10B981"
  },
  {
    id: "pass",
    name: "PASS CODE",
    fullName: "Product And Services Solutions",
    description: "Personalized career pathways",
    icon: Target,
    target: "1B+ Users",
    color: "#8B5CF6"
  }
];

export default function PrakrutiEngine() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const [activeSection, setActiveSection] = useState("prakruti");
  const [selectedPrakruti, setSelectedPrakruti] = useState(null);
  const [userDcoin, setUserDcoin] = useState(150);

  const renderPrakrutiDiscovery = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
          <Brain className="w-3 h-3 mr-1" /> PRAKRUTI POWER ENGINE
        </Badge>
        <h2 className="text-2xl font-bold text-white mb-2">Discover Your PRAKRUTI</h2>
        <p className="text-white/60 text-sm">Your unique character energy based on Ayurvedic wisdom</p>
      </div>

      {/* THE RIGHT DOERS TRINITY */}
      <Card className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border-amber-500/20">
        <CardContent className="p-4">
          <p className="text-center text-white/60 text-xs uppercase tracking-wider mb-3">
            THE RIGHT DOERS TRINITY
          </p>
          <div className="flex justify-around items-center">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🙏</span>
              </div>
              <p className="text-amber-400 text-xs font-bold">BRAHMA</p>
              <p className="text-white/50 text-[10px]">Human Expert</p>
            </div>
            <ArrowRight className="w-5 h-5 text-white/30" />
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🤖</span>
              </div>
              <p className="text-purple-400 text-xs font-bold">VISHNU</p>
              <p className="text-white/50 text-[10px]">AI Agent</p>
            </div>
            <ArrowRight className="w-5 h-5 text-white/30" />
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🦾</span>
              </div>
              <p className="text-blue-400 text-xs font-bold">MAHESHWARA</p>
              <p className="text-white/50 text-[10px]">Robo Helper</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PRAKRUTI Types */}
      <div className="grid grid-cols-2 gap-3">
        {Object.values(PRAKRUTI_TYPES).map((prakruti, idx) => (
          <motion.div
            key={prakruti.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all ${
                selectedPrakruti?.id === prakruti.id 
                  ? 'ring-2 ring-purple-500 bg-white/10' 
                  : 'bg-white/5 hover:bg-white/10'
              } border-white/10`}
              onClick={() => setSelectedPrakruti(prakruti)}
              data-testid={`prakruti-${prakruti.id}`}
            >
              <CardContent className="p-4 text-center">
                <div 
                  className="w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: prakruti.color + '30' }}
                >
                  {prakruti.element}
                </div>
                <h3 className="text-white font-bold text-sm">{prakruti.name}</h3>
                <p className="text-white/50 text-[10px]">{prakruti.meaning}</p>
                <Badge className="mt-2 bg-white/10 text-white/70 border-0 text-[10px]">
                  {prakruti.pandava}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Selected Prakruti Details */}
      {selectedPrakruti && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2">
                <span className="text-2xl">{selectedPrakruti.element}</span>
                {selectedPrakruti.name} - {selectedPrakruti.character}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-white/50 text-xs mb-2">Core Traits</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPrakruti.traits.map((trait, idx) => (
                    <Badge key={idx} className="bg-purple-500/20 text-purple-300 border-0 text-[10px]">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-white/50 text-xs mb-2">Ideal Careers</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPrakruti.careers.map((career, idx) => (
                    <Badge key={idx} className="bg-blue-500/20 text-blue-300 border-0 text-[10px]">
                      {career}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-white/50 text-xs mb-2">Compatible Rashis</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPrakruti.rashi.map((r, idx) => (
                    <Badge key={idx} className="bg-amber-500/20 text-amber-300 border-0 text-[10px]">
                      {r}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                onClick={() => toast.success(`${selectedPrakruti.name} selected! Taking assessment...`)}
                data-testid="select-prakruti-btn"
              >
                Confirm My PRAKRUTI <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );

  const renderCharacterClubs = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Badge className="mb-4 bg-amber-500/20 text-amber-300 border-amber-500/30">
          <Crown className="w-3 h-3 mr-1" /> PANCHA PANDAVA CLUBS
        </Badge>
        <h2 className="text-2xl font-bold text-white mb-2">5 Character Clubs</h2>
        <p className="text-white/60 text-sm">Ancient wisdom for modern career paths</p>
      </div>

      <div className="space-y-3">
        {Object.values(CHARACTER_CLUBS).map((club, idx) => (
          <motion.div
            key={club.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: club.color + '30' }}
                  >
                    <club.icon className="w-7 h-7" style={{ color: club.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold">{club.name}</h3>
                    <p className="text-white/50 text-sm">{club.quality}</p>
                    <p className="text-white/30 text-xs italic">&quot;{club.motto}&quot;</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-white/10 text-white/70 border-0 text-[10px]">
                      {club.pandava}
                    </Badge>
                    <div className="flex gap-1 mt-2">
                      {club.divisions.slice(0, 2).map((div, i) => (
                        <Badge key={i} className="bg-purple-500/20 text-purple-300 border-0 text-[8px]">
                          {div}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCircularEconomy = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
          <Coins className="w-3 h-3 mr-1" /> D-COIN ECONOMY
        </Badge>
        <h2 className="text-2xl font-bold text-white mb-2">Circular Economic Engine</h2>
        <p className="text-white/60 text-sm">LEARN → EARN → LIFE • GLOCAL Proficorns</p>
      </div>

      {/* User D-COIN Balance */}
      <Card className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/30">
        <CardContent className="p-4 text-center">
          <Coins className="w-10 h-10 text-amber-400 mx-auto mb-2" />
          <p className="text-white/60 text-xs">Your D-COIN Balance</p>
          <p className="text-3xl font-bold text-amber-400">{userDcoin}</p>
          <p className="text-white/40 text-[10px]">≈ ₹{(userDcoin * 0.5).toFixed(2)} value</p>
        </CardContent>
      </Card>

      {/* Economy Layers */}
      <div className="space-y-3">
        {ECONOMY_LAYERS.map((layer, idx) => (
          <motion.div
            key={layer.level}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: layer.color + '30' }}
                  >
                    <layer.icon className="w-6 h-6" style={{ color: layer.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-white/10 text-white/70 border-0 text-[10px]">
                        {layer.level}
                      </Badge>
                      <h3 className="text-white font-bold">{layer.name}</h3>
                    </div>
                    <p className="text-white/50 text-sm">{layer.description}</p>
                  </div>
                  <Badge style={{ backgroundColor: layer.color + '30', color: layer.color, border: 'none' }}>
                    {layer.dcoin}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* GLOCAL Initiatives */}
      <div className="space-y-3">
        <p className="text-white/60 text-xs uppercase tracking-wider text-center">GLOCAL INITIATIVES</p>
        {GLOCAL_INITIATIVES.map((initiative, idx) => (
          <Card key={initiative.id} className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <initiative.icon className="w-8 h-8" style={{ color: initiative.color }} />
                <div className="flex-1">
                  <h4 className="text-white font-bold text-sm">{initiative.name}</h4>
                  <p className="text-white/50 text-[10px]">{initiative.fullName}</p>
                </div>
                <Badge className="bg-white/10 text-white/70 border-0 text-[10px]">
                  {initiative.target}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => navigate(-1)}
            data-testid="back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-white font-bold">PRAKRUTI ENGINE</h1>
            <p className="text-white/50 text-xs">GLOCAL GURUKUL • Global Talent NEST</p>
          </div>
          <Badge className="bg-amber-500/20 text-amber-400 border-0">
            <Coins className="w-3 h-3 mr-1" /> {userDcoin}
          </Badge>
        </div>
      </header>

      {/* Section Tabs */}
      <div className="flex justify-center gap-2 p-4 bg-slate-900/50">
        {[
          { id: "prakruti", label: "PRAKRUTI", icon: "🧬" },
          { id: "clubs", label: "CLUBS", icon: "👥" },
          { id: "economy", label: "D-COIN", icon: "💰" }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeSection === tab.id ? "default" : "outline"}
            size="sm"
            className={activeSection === tab.id 
              ? "bg-purple-500 text-white" 
              : "border-white/20 text-white/60"
            }
            onClick={() => setActiveSection(tab.id)}
            data-testid={`tab-${tab.id}`}
          >
            <span className="mr-1">{tab.icon}</span> {tab.label}
          </Button>
        ))}
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {activeSection === "prakruti" && renderPrakrutiDiscovery()}
            {activeSection === "clubs" && renderCharacterClubs()}
            {activeSection === "economy" && renderCircularEconomy()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ASTRO Mascot */}
      <AstroDoer message="Discover your PRAKRUTI power!" size="sm" showBubble={false} />
    </div>
  );
}
