import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { 
  ArrowLeft, ArrowRight, Check, Crown, Building, Users, Globe,
  Briefcase, GraduationCap, Target, Zap, Star, Coins, Shield,
  ChevronRight, Play, Award, TrendingUp, MapPin
} from "lucide-react";
import { toast } from "sonner";

// GLOBAL CURRENCIES - Payment Gateway Style
const CURRENCIES = {
  USD: { symbol: "$", name: "US Dollar", flag: "🇺🇸", rate: 1 },
  AED: { symbol: "د.إ", name: "UAE Dirham", flag: "🇦🇪", rate: 3.67 },
  INR: { symbol: "₹", name: "Indian Rupee", flag: "🇮🇳", rate: 83.5, upiEnabled: true },
  EUR: { symbol: "€", name: "Euro", flag: "🇪🇺", rate: 0.92 },
  GBP: { symbol: "£", name: "British Pound", flag: "🇬🇧", rate: 0.79 },
  SGD: { symbol: "S$", name: "Singapore Dollar", flag: "🇸🇬", rate: 1.34 },
  SAR: { symbol: "﷼", name: "Saudi Riyal", flag: "🇸🇦", rate: 3.75 },
  QAR: { symbol: "﷼", name: "Qatari Riyal", flag: "🇶🇦", rate: 3.64 },
  KWD: { symbol: "د.ك", name: "Kuwaiti Dinar", flag: "🇰🇼", rate: 0.31 },
  AUD: { symbol: "A$", name: "Australian Dollar", flag: "🇦🇺", rate: 1.53 },
  CAD: { symbol: "C$", name: "Canadian Dollar", flag: "🇨🇦", rate: 1.36 }
};

// UPI QR CODE DATA (Persona-wise)
const UPI_QR_DATA = {
  starter: {
    upiId: "doers.starter@paytm",
    merchantName: "DOERS STARTER",
    amount: { monthly: 749, yearly: 8249 }
  },
  professional: {
    upiId: "doers.pro@paytm",
    merchantName: "DOERS PRO",
    amount: { monthly: 2419, yearly: 24959 }
  },
  enterprise: {
    upiId: "doers.enterprise@paytm",
    merchantName: "DOERS ENTERPRISE",
    amount: { monthly: 16619, yearly: 166919 }
  },
  government: {
    upiId: "doers.nation@paytm",
    merchantName: "DOERS NATION",
    amount: { custom: true }
  }
};

// PRICING TIERS - LIC Style Bundles (Adaptive to Buying Capacity)
const PRICING_TIERS = {
  starter: {
    id: "starter",
    name: "DOER STARTER",
    tagline: "For Individual Learners",
    price: { monthly: 9, yearly: 99, currency: "USD" },
    priceAED: { monthly: 35, yearly: 365 },
    color: "#3B82F6",
    icon: GraduationCap,
    features: [
      "Daily Career Capsules (All 12 Divisions)",
      "PRAKRUTI Assessment",
      "DoersID Basic Profile",
      "100 D-COIN Monthly",
      "Community Access"
    ],
    popular: false,
    capacity: "Individual"
  },
  professional: {
    id: "professional",
    name: "DOER PRO",
    tagline: "For Career Builders",
    price: { monthly: 29, yearly: 299, currency: "USD" },
    priceAED: { monthly: 109, yearly: 1099 },
    color: "#8B5CF6",
    icon: Briefcase,
    features: [
      "Everything in Starter",
      "AI Career Coach (Personal Agent)",
      "DoersID Verified Profile",
      "500 D-COIN Monthly",
      "Job Matching (NEST L1-L3)",
      "Certificate of Completion",
      "Priority Support"
    ],
    popular: true,
    capacity: "Professional"
  },
  enterprise: {
    id: "enterprise",
    name: "DOER ENTERPRISE",
    tagline: "For Organizations",
    price: { monthly: 199, yearly: 1999, currency: "USD" },
    priceAED: { monthly: 735, yearly: 7350 },
    color: "#F59E0B",
    icon: Building,
    features: [
      "Everything in Pro",
      "Unlimited Team Members",
      "Custom Division Content",
      "Talent Pipeline Dashboard",
      "API Access",
      "White-label Option",
      "Dedicated Account Manager",
      "NEST L1-L5 Full Access"
    ],
    popular: false,
    capacity: "Enterprise (50+ users)"
  },
  government: {
    id: "government",
    name: "DOER NATION",
    tagline: "For Governments & Large Scale",
    price: { custom: true, startingFrom: 50000, currency: "USD" },
    priceAED: { custom: true, startingFrom: 183750 },
    color: "#10B981",
    icon: Globe,
    features: [
      "Everything in Enterprise",
      "National Talent Pipeline (GBIT Model)",
      "Multi-language Support",
      "Blockchain DoersID Verification",
      "Custom AI Agents per Division",
      "Data Sovereignty Compliance",
      "Government Dashboard & Analytics",
      "OFOE/ODOP Integration",
      "Dedicated Implementation Team"
    ],
    popular: false,
    capacity: "Nation (100K+ users)"
  }
};

// ABU DHABI TALENT PIPELINE - Special Feature
const ABU_DHABI_PIPELINE = {
  name: "Abu Dhabi Talent NEST",
  description: "Comprehensive Talent Pipeline for the UAE Vision 2031",
  sectors: [
    { name: "Technology & AI", talent: "15,000+", growth: "+45%" },
    { name: "Finance & Banking", talent: "12,000+", growth: "+32%" },
    { name: "Healthcare", talent: "8,500+", growth: "+28%" },
    { name: "Energy & Sustainability", talent: "6,200+", growth: "+52%" },
    { name: "Tourism & Hospitality", talent: "18,000+", growth: "+38%" },
    { name: "Legal & Policy", talent: "4,500+", growth: "+22%" }
  ],
  nestLevels: {
    L1: { count: "25,000", label: "Aspirants" },
    L2: { count: "18,500", label: "Trained" },
    L3: { count: "12,000", label: "Certified" },
    L4: { count: "6,500", label: "Employed" },
    L5: { count: "2,200", label: "Experts" }
  }
};

// INVESTOR DEMO FLOW
const DEMO_STEPS = [
  {
    id: 1,
    title: "The Problem",
    subtitle: "Will AI take my job?",
    content: "1 Billion+ people face career uncertainty in the AI era",
    icon: "🤔"
  },
  {
    id: 2,
    title: "Our Solution",
    subtitle: "HI AI-APP.COM",
    content: "PRAKRUTI-Powered Career Transformation Platform",
    icon: "💡"
  },
  {
    id: 3,
    title: "The Engine",
    subtitle: "LEARN → EARN → LIFE",
    content: "Circular economy with D-COIN tokenization",
    icon: "⚙️"
  },
  {
    id: 4,
    title: "Market Size",
    subtitle: "$50B+ Global EdTech",
    content: "Starting with India (1.4B) → Middle East → Global",
    icon: "📈"
  },
  {
    id: 5,
    title: "Traction",
    subtitle: "ISF JUNICORNS MoU",
    content: "First paid customers in Middle East ready",
    icon: "🤝"
  }
];

export default function InvestorPitch() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("demo");
  const [currentDemoStep, setCurrentDemoStep] = useState(0);
  const [selectedTier, setSelectedTier] = useState("professional");
  const [billingCycle, setBillingCycle] = useState("yearly");
  const [currency, setCurrency] = useState("USD");
  const [showQR, setShowQR] = useState(false);
  const [qrTier, setQrTier] = useState(null);

  // Calculate price in selected currency
  const getPrice = (basePrice, currencyCode) => {
    const rate = CURRENCIES[currencyCode].rate;
    return Math.round(basePrice * rate);
  };

  // Generate UPI QR URL
  const generateUPIUrl = (tier, cycle) => {
    const qrData = UPI_QR_DATA[tier];
    if (!qrData || qrData.amount.custom) return null;
    const amount = qrData.amount[cycle];
    return `upi://pay?pa=${qrData.upiId}&pn=${qrData.merchantName}&am=${amount}&cu=INR&tn=DOERS_${tier.toUpperCase()}_${cycle.toUpperCase()}`;
  };

  const renderDemoFlow = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
          <Play className="w-3 h-3 mr-1" /> INVESTOR DEMO
        </Badge>
        <h2 className="text-2xl font-bold text-white mb-2">HI AI-APP.COM</h2>
        <p className="text-white/60 text-sm">Global Innovation Summit Dubai 2026</p>
      </div>

      {/* Demo Progress */}
      <div className="flex justify-center gap-2">
        {DEMO_STEPS.map((step, idx) => (
          <div
            key={step.id}
            className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
              idx === currentDemoStep ? 'bg-purple-500 scale-125' : 
              idx < currentDemoStep ? 'bg-green-500' : 'bg-white/20'
            }`}
            onClick={() => setCurrentDemoStep(idx)}
          />
        ))}
      </div>

      {/* Demo Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDemoStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardContent className="p-8 text-center">
              <span className="text-6xl mb-4 block">{DEMO_STEPS[currentDemoStep].icon}</span>
              <Badge className="mb-4 bg-white/10 text-white/70 border-0">
                Step {currentDemoStep + 1} of {DEMO_STEPS.length}
              </Badge>
              <h3 className="text-3xl font-bold text-white mb-2">
                {DEMO_STEPS[currentDemoStep].title}
              </h3>
              <p className="text-purple-300 text-xl mb-4">
                {DEMO_STEPS[currentDemoStep].subtitle}
              </p>
              <p className="text-white/70">
                {DEMO_STEPS[currentDemoStep].content}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          className="border-white/20 text-white"
          onClick={() => setCurrentDemoStep(Math.max(0, currentDemoStep - 1))}
          disabled={currentDemoStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <Button
          className="bg-gradient-to-r from-purple-500 to-pink-500"
          onClick={() => {
            if (currentDemoStep < DEMO_STEPS.length - 1) {
              setCurrentDemoStep(currentDemoStep + 1);
            } else {
              setActiveTab("pricing");
              toast.success("Demo Complete! View Pricing Options");
            }
          }}
        >
          {currentDemoStep < DEMO_STEPS.length - 1 ? "Next" : "View Pricing"} 
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="border-white/20 text-white"
          onClick={() => navigate("/prakruti")}
        >
          <Zap className="w-4 h-4 mr-2" /> PRAKRUTI Engine
        </Button>
        <Button
          variant="outline"
          className="border-white/20 text-white"
          onClick={() => navigate("/role-play")}
        >
          <GraduationCap className="w-4 h-4 mr-2" /> Daily Capsules
        </Button>
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Badge className="mb-4 bg-amber-500/20 text-amber-300 border-amber-500/30">
          <Coins className="w-3 h-3 mr-1" /> PRICING
        </Badge>
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Plan</h2>
        <p className="text-white/60 text-sm">Adaptive bundles for every capacity</p>
      </div>

      {/* Currency & Billing Toggle */}
      <div className="flex justify-center gap-4">
        <div className="flex bg-white/10 rounded-lg p-1">
          <Button
            size="sm"
            variant={currency === "USD" ? "default" : "ghost"}
            className={currency === "USD" ? "bg-purple-500" : "text-white/60"}
            onClick={() => setCurrency("USD")}
          >
            USD $
          </Button>
          <Button
            size="sm"
            variant={currency === "AED" ? "default" : "ghost"}
            className={currency === "AED" ? "bg-purple-500" : "text-white/60"}
            onClick={() => setCurrency("AED")}
          >
            AED د.إ
          </Button>
        </div>
        <div className="flex bg-white/10 rounded-lg p-1">
          <Button
            size="sm"
            variant={billingCycle === "monthly" ? "default" : "ghost"}
            className={billingCycle === "monthly" ? "bg-purple-500" : "text-white/60"}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </Button>
          <Button
            size="sm"
            variant={billingCycle === "yearly" ? "default" : "ghost"}
            className={billingCycle === "yearly" ? "bg-purple-500" : "text-white/60"}
            onClick={() => setBillingCycle("yearly")}
          >
            Yearly (Save 15%)
          </Button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="space-y-4">
        {Object.values(PRICING_TIERS).map((tier) => {
          const priceData = currency === "USD" ? tier.price : tier.priceAED;
          const price = priceData.custom ? priceData.startingFrom : priceData[billingCycle];
          const isSelected = selectedTier === tier.id;
          
          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card 
                className={`cursor-pointer transition-all ${
                  isSelected 
                    ? 'ring-2 ring-purple-500 bg-white/10' 
                    : 'bg-white/5 hover:bg-white/10'
                } border-white/10 ${tier.popular ? 'relative' : ''}`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {tier.popular && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                    MOST POPULAR
                  </Badge>
                )}
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: tier.color + '30' }}
                    >
                      <tier.icon className="w-7 h-7" style={{ color: tier.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold">{tier.name}</h3>
                      <p className="text-white/50 text-sm">{tier.tagline}</p>
                      <Badge className="mt-1 bg-white/10 text-white/60 border-0 text-[10px]">
                        {tier.capacity}
                      </Badge>
                    </div>
                    <div className="text-right">
                      {priceData.custom ? (
                        <div>
                          <p className="text-white/50 text-xs">Starting from</p>
                          <p className="text-2xl font-bold text-white">
                            {currency === "USD" ? "$" : "د.إ"}{price.toLocaleString()}
                          </p>
                          <p className="text-white/50 text-xs">/year</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-2xl font-bold text-white">
                            {currency === "USD" ? "$" : "د.إ"}{price}
                          </p>
                          <p className="text-white/50 text-xs">/{billingCycle === "monthly" ? "mo" : "yr"}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <div className="grid grid-cols-1 gap-2">
                        {tier.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-400" />
                            <span className="text-white/80">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500"
                        onClick={() => toast.success(`${tier.name} selected! Contact for demo.`)}
                      >
                        Get Started <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderAbuDhabi = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
          <MapPin className="w-3 h-3 mr-1" /> SPECIAL PROPOSAL
        </Badge>
        <h2 className="text-2xl font-bold text-white mb-2">Abu Dhabi Talent NEST</h2>
        <p className="text-white/60 text-sm">UAE Vision 2031 Talent Pipeline</p>
      </div>

      {/* NEST Levels Overview */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
        <CardContent className="p-4">
          <p className="text-white/60 text-xs uppercase tracking-wider mb-3 text-center">
            Talent Pipeline (NEST Levels)
          </p>
          <div className="flex justify-between items-end gap-2">
            {Object.entries(ABU_DHABI_PIPELINE.nestLevels).map(([level, data], idx) => (
              <div key={level} className="flex-1 text-center">
                <div 
                  className="bg-green-500/30 rounded-t-lg mx-auto mb-1"
                  style={{ 
                    height: `${20 + (idx * 15)}px`, 
                    width: '100%',
                    maxWidth: '50px'
                  }}
                />
                <p className="text-green-400 font-bold text-sm">{data.count}</p>
                <p className="text-white/50 text-[10px]">{level}</p>
                <p className="text-white/30 text-[8px]">{data.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sector Breakdown */}
      <div className="space-y-3">
        <p className="text-white/60 text-xs uppercase tracking-wider">Sectors & Growth</p>
        {ABU_DHABI_PIPELINE.sectors.map((sector, idx) => (
          <Card key={idx} className="bg-white/5 border-white/10">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold text-sm">{sector.name}</h4>
                  <p className="text-white/50 text-xs">{sector.talent} talents</p>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-0">
                  <TrendingUp className="w-3 h-3 mr-1" /> {sector.growth}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/30">
        <CardContent className="p-4 text-center">
          <Crown className="w-10 h-10 text-amber-400 mx-auto mb-2" />
          <h3 className="text-white font-bold mb-1">Royal Family Proposal</h3>
          <p className="text-white/60 text-sm mb-4">
            Custom implementation for Abu Dhabi Government
          </p>
          <Button 
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black"
            onClick={() => toast.success("Proposal request sent!")}
          >
            <Shield className="w-4 h-4 mr-2" /> Request Custom Proposal
          </Button>
        </CardContent>
      </Card>
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
            onClick={() => navigate("/welcome")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-white font-bold">INVESTOR PITCH</h1>
            <p className="text-white/50 text-xs">Dubai Summit Jan 9-11, 2026</p>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
            LIVE
          </Badge>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex justify-center gap-2 p-4 bg-slate-900/50">
        {[
          { id: "demo", label: "DEMO", icon: "🎬" },
          { id: "pricing", label: "PRICING", icon: "💰" },
          { id: "abudhabi", label: "ABU DHABI", icon: "🏛️" }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            size="sm"
            className={activeTab === tab.id 
              ? "bg-purple-500 text-white" 
              : "border-white/20 text-white/60"
            }
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="mr-1">{tab.icon}</span> {tab.label}
          </Button>
        ))}
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {activeTab === "demo" && renderDemoFlow()}
            {activeTab === "pricing" && renderPricing()}
            {activeTab === "abudhabi" && renderAbuDhabi()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
