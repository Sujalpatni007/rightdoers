import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Check,
  Star,
  Sparkles,
  Zap,
  Crown,
  Users,
  Brain,
  Target,
  Rocket,
  GraduationCap,
  Briefcase,
  Baby,
  Heart,
  Shield,
  Mic,
  ChevronRight,
  IndianRupee,
  Gift,
  TrendingUp,
  Award,
  Building2
} from "lucide-react";
import { toast } from "sonner";

// 8 T's Framework Icons
const EIGHT_TS = [
  { key: "talk", icon: "💬", label: "Talk", desc: "Voice Commands" },
  { key: "task", icon: "📋", label: "Task", desc: "Action Items" },
  { key: "time", icon: "⏰", label: "Time", desc: "Investment" },
  { key: "tools", icon: "🛠️", label: "Tools", desc: "Platform Features" },
  { key: "talents", icon: "🌟", label: "Talents", desc: "Skills" },
  { key: "tax", icon: "💰", label: "Tax", desc: "Cost" },
  { key: "total", icon: "📊", label: "Total", desc: "ROI" },
  { key: "trust", icon: "🤝", label: "Trust", desc: "Verified" }
];

// Pricing Tiers
const PRICING_TIERS = {
  kidz: {
    id: "kidz",
    name: "DOER KIDZ",
    tagline: "Gamified Discovery",
    ageGroup: "6-12 years",
    icon: Baby,
    emoji: "🧒",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
    monthlyPrice: { basic: 99, standard: 149, premium: 199 },
    yearlyPrice: { basic: 999, standard: 1499, premium: 1999 },
    features: [
      { name: "Career Story Games", included: true },
      { name: "Fun Skill Quizzes", included: true },
      { name: "Avatar & Badges", included: true },
      { name: "Parent Dashboard", included: true },
      { name: "5 Career Capsules/month", included: true },
      { name: "D-COIN Starter Pack (50)", included: true },
      { name: "Voice Assistant (Basic)", included: "premium" },
      { name: "Family Sharing", included: "premium" }
    ],
    cta: "Start Adventure",
    popular: false
  },
  teens: {
    id: "teens",
    name: "DOER TEENS",
    tagline: "Career Clarity",
    ageGroup: "13-19 years",
    icon: GraduationCap,
    emoji: "🎓",
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    monthlyPrice: { basic: 199, standard: 299, premium: 399 },
    yearlyPrice: { basic: 1999, standard: 2999, premium: 3999 },
    features: [
      { name: "6D Psychometric Assessment", included: true },
      { name: "DoersScore™ Profile", included: true },
      { name: "Career Roadmap Generator", included: true },
      { name: "Proven Profiles Access (Anushree+)", included: true },
      { name: "15 Career Capsules/month", included: true },
      { name: "D-COIN Pack (150)", included: true },
      { name: "5E Journey Tracking", included: true },
      { name: "Mentor Connect", included: "standard" },
      { name: "Voice AI Assistant", included: "premium" },
      { name: "Internship Matching", included: "premium" }
    ],
    cta: "Discover Path",
    popular: true,
    badge: "MOST POPULAR"
  },
  pro: {
    id: "pro",
    name: "DOER PRO",
    tagline: "Career Acceleration",
    ageGroup: "20-45 years",
    icon: Briefcase,
    emoji: "💼",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    monthlyPrice: { basic: 499, standard: 749, premium: 999 },
    yearlyPrice: { basic: 4999, standard: 7499, premium: 9999 },
    features: [
      { name: "Advanced DoersScore™", included: true },
      { name: "Jobs4Me AI Matching", included: true },
      { name: "LinkedIn/Indeed/Naukri Jobs", included: true },
      { name: "Unlimited Career Capsules", included: true },
      { name: "D-COIN Pack (300)", included: true },
      { name: "Skill Gap Analysis", included: true },
      { name: "Resume Builder", included: true },
      { name: "Interview Prep AI", included: "standard" },
      { name: "Voice Command Pro", included: "premium" },
      { name: "Priority Job Alerts", included: "premium" },
      { name: "Career Coach (1-on-1)", included: "premium" }
    ],
    cta: "Accelerate Career",
    popular: false
  },
  plus: {
    id: "plus",
    name: "DOER PLUS",
    tagline: "Premium Excellence",
    ageGroup: "All Ages",
    icon: Crown,
    emoji: "⭐",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    monthlyPrice: { basic: 1999, standard: 2999, premium: 4999 },
    yearlyPrice: { basic: 19999, standard: 29999, premium: 49999 },
    features: [
      { name: "Everything in PRO", included: true },
      { name: "DOERS ONE Family Dashboard", included: true },
      { name: "Up to 5 Family Members", included: true },
      { name: "Captain Command Centre", included: true },
      { name: "D-COIN Pack (1000)", included: true },
      { name: "Unlimited Voice AI", included: true },
      { name: "White-label Reports", included: true },
      { name: "API Access", included: "standard" },
      { name: "Enterprise Dashboard", included: "premium" },
      { name: "Dedicated Success Manager", included: "premium" },
      { name: "Custom Integrations", included: "premium" }
    ],
    cta: "Go Premium",
    popular: false,
    badge: "ENTERPRISE"
  }
};

// B2B Pricing
const B2B_PLANS = [
  {
    name: "Startup",
    employees: "Up to 50",
    price: "₹49,999/year",
    features: ["50 Employee Licenses", "Basic Analytics", "Email Support"]
  },
  {
    name: "Growth",
    employees: "51-200",
    price: "₹1,49,999/year",
    features: ["200 Employee Licenses", "Advanced Analytics", "Priority Support", "Custom Branding"]
  },
  {
    name: "Enterprise",
    employees: "201+",
    price: "Custom",
    features: ["Unlimited Licenses", "White-label", "Dedicated Manager", "API Access", "SLA"]
  }
];

// Pricing Tier Component
const PricingTierCard = ({ tier, isYearly, selectedPlan, onSelectPlan, onSubscribe }) => {
  const TierIcon = tier.icon;
  const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className={`h-full relative overflow-hidden ${tier.bgColor} ${tier.borderColor} border-2 ${tier.popular ? 'ring-2 ring-purple-500' : ''}`}>
        {tier.badge && (
          <div className={`absolute top-0 right-0 bg-gradient-to-r ${tier.color} text-white text-xs font-bold px-3 py-1 rounded-bl-lg`}>
            {tier.badge}
          </div>
        )}
        
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center text-3xl`}>
              {tier.emoji}
            </div>
            <div>
              <CardTitle className="text-white text-xl">{tier.name}</CardTitle>
              <p className="text-white/60 text-sm">{tier.tagline}</p>
            </div>
          </div>
          <Badge className="bg-white/10 text-white/80 border-0 text-xs w-fit">
            {tier.ageGroup}
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Plan Selection */}
          <div className="grid grid-cols-3 gap-2">
            {["basic", "standard", "premium"].map((plan) => (
              <button
                key={plan}
                onClick={() => onSelectPlan(tier.id, plan)}
                className={`p-2 rounded-lg text-center transition-all ${
                  selectedPlan[tier.id] === plan
                    ? `bg-gradient-to-r ${tier.color} text-white`
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                <p className="text-xs capitalize">{plan}</p>
                <p className="text-lg font-bold">
                  ₹{price[plan]}
                </p>
                <p className="text-[10px] opacity-60">
                  {isYearly ? '/year' : '/mo'}
                </p>
              </button>
            ))}
          </div>
          
          {/* Features */}
          <div className="space-y-2 pt-2">
            {tier.features.map((feature, idx) => {
              const isIncluded = feature.included === true || 
                (feature.included === "standard" && ["standard", "premium"].includes(selectedPlan[tier.id])) ||
                (feature.included === "premium" && selectedPlan[tier.id] === "premium");
              
              return (
                <div 
                  key={idx} 
                  className={`flex items-center gap-2 ${isIncluded ? '' : 'opacity-40'}`}
                >
                  {isIncluded ? (
                    <Check className={`w-4 h-4 ${tier.popular ? 'text-purple-400' : 'text-green-400'}`} />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-white/30" />
                  )}
                  <span className="text-white/80 text-sm">{feature.name}</span>
                  {feature.included !== true && feature.included !== false && (
                    <Badge className="bg-white/10 text-white/50 border-0 text-[10px] ml-auto">
                      {feature.included}+
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* CTA */}
          <Button
            className={`w-full bg-gradient-to-r ${tier.color} text-white font-bold`}
            onClick={() => onSubscribe(tier.id)}
            data-testid={`subscribe-${tier.id}`}
          >
            {tier.cta}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
          
          {isYearly && (
            <p className="text-center text-green-400 text-xs">
              Save up to 17% with yearly billing
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function PricingPage() {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState({
    kidz: "standard",
    teens: "standard",
    pro: "standard",
    plus: "standard"
  });
  const [activeTab, setActiveTab] = useState("b2c"); // b2c or b2b

  const handleSelectPlan = (tierId, plan) => {
    setSelectedPlan(prev => ({ ...prev, [tierId]: plan }));
  };

  const handleSubscribe = (tierId) => {
    const tier = PRICING_TIERS[tierId];
    const plan = selectedPlan[tierId];
    const price = isYearly ? tier.yearlyPrice[plan] : tier.monthlyPrice[plan];
    
    toast.success(`Selected ${tier.name} - ${plan.charAt(0).toUpperCase() + plan.slice(1)} @ ₹${price}/${isYearly ? 'year' : 'month'}`);
    // Navigate to checkout or auth
    navigate("/auth", { state: { tier: tierId, plan, price, billing: isYearly ? 'yearly' : 'monthly' } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => navigate(-1)}
            data-testid="pricing-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-white font-bold flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-green-400" />
              Pricing
            </h1>
            <Badge className="bg-green-500/20 text-green-400 border-0 text-[10px] mt-1">
              Combo Plans
            </Badge>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Choose Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">DOER Journey</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Pricing based on your purchasing power. From Kids to Enterprises - everyone deserves career clarity.
          </p>
          
          {/* 8 T's Framework Preview */}
          <div className="flex justify-center gap-2 flex-wrap mt-4">
            {EIGHT_TS.map((t) => (
              <Badge key={t.key} className="bg-white/10 text-white/80 border-0">
                {t.icon} {t.label}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* B2C / B2B Toggle */}
        <div className="flex justify-center gap-4">
          <Button
            variant={activeTab === "b2c" ? "default" : "ghost"}
            className={activeTab === "b2c" ? "bg-purple-500" : "text-white/60"}
            onClick={() => setActiveTab("b2c")}
            data-testid="tab-b2c"
          >
            <Users className="w-4 h-4 mr-2" />
            Individual & Family
          </Button>
          <Button
            variant={activeTab === "b2b" ? "default" : "ghost"}
            className={activeTab === "b2b" ? "bg-purple-500" : "text-white/60"}
            onClick={() => setActiveTab("b2b")}
            data-testid="tab-b2b"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Business & Enterprise
          </Button>
        </div>

        {/* B2C Pricing */}
        {activeTab === "b2c" && (
          <>
            {/* Billing Toggle */}
            <div className="flex justify-center items-center gap-4">
              <span className={`text-sm ${!isYearly ? 'text-white' : 'text-white/50'}`}>Monthly</span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                data-testid="billing-toggle"
              />
              <span className={`text-sm ${isYearly ? 'text-white' : 'text-white/50'}`}>
                Yearly
                <Badge className="bg-green-500/20 text-green-400 border-0 text-xs ml-2">
                  Save 17%
                </Badge>
              </span>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.values(PRICING_TIERS).map((tier) => (
                <PricingTierCard
                  key={tier.id}
                  tier={tier}
                  isYearly={isYearly}
                  selectedPlan={selectedPlan}
                  onSelectPlan={handleSelectPlan}
                  onSubscribe={handleSubscribe}
                />
              ))}
            </div>
          </>
        )}

        {/* B2B Pricing */}
        {activeTab === "b2b" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {B2B_PLANS.map((plan, idx) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                      {plan.name === "Growth" && (
                        <Badge className="bg-purple-500/20 text-purple-400 border-0">
                          POPULAR
                        </Badge>
                      )}
                    </div>
                    <p className="text-white/60 text-sm">{plan.employees} employees</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold text-white">{plan.price}</div>
                    <div className="space-y-2">
                      {plan.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-white/80 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      data-testid={`b2b-${plan.name.toLowerCase()}`}
                    >
                      {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Combo Value Proposition */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-white font-bold text-xl mb-2 flex items-center gap-2">
                  <Gift className="w-6 h-6 text-pink-400" />
                  COMBO POWER
                </h3>
                <p className="text-white/70">
                  <strong>Like Neil Patel says:</strong> "Price based on the value you deliver, not your costs."
                  Our combo pricing ensures everyone - from school kids to enterprise teams - gets career clarity at their purchasing power.
                </p>
              </div>
              <div className="flex flex-col gap-2 text-center">
                <div className="text-4xl font-bold text-white">4 Tiers</div>
                <div className="text-white/60">3 Plans Each</div>
                <div className="text-green-400 font-bold">12 Options</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voice AI Teaser */}
        <Card className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                <Mic className="w-8 h-8 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  Voice AI Coming Soon
                  <Badge className="bg-amber-500/20 text-amber-400 border-0 text-xs">BETA</Badge>
                </h3>
                <p className="text-white/60 text-sm">
                  As Reid Hoffman says: "Human-Computer voice interaction will be the biggest thing forward."
                  Talk • Task • Time • Tools • Talents • Tax • Total • Trust
                </p>
              </div>
              <Button
                variant="outline"
                className="border-amber-500/30 text-amber-400"
                onClick={() => toast.info("Voice AI coming in DOER PLUS!")}
              >
                Join Waitlist
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4">
          <Badge className="bg-white/10 text-white/80 border-0 px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            Right Doers Powered™
          </Badge>
          <Badge className="bg-white/10 text-white/80 border-0 px-4 py-2">
            <Award className="w-4 h-4 mr-2" />
            100% IP Ownership
          </Badge>
          <Badge className="bg-white/10 text-white/80 border-0 px-4 py-2">
            <TrendingUp className="w-4 h-4 mr-2" />
            IPO Ready Q1 2031
          </Badge>
        </div>
      </main>
    </div>
  );
}
