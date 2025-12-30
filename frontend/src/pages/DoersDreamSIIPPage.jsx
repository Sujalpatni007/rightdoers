import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowLeft, 
  Zap, 
  Users,
  QrCode,
  Calculator,
  TrendingUp,
  Shield,
  Heart,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  IndianRupee
} from "lucide-react";
import { toast } from "sonner";
import Confetti from "react-confetti";

const PLANS = [
  {
    id: "starter",
    name: "Dream Starter",
    monthlyInvestment: 1000,
    duration: 30,
    maturityValue: 3500000,
    monthlyWithdrawal: 35000,
    color: "from-green-500 to-emerald-600",
    icon: "🌱",
    features: ["Basic Career Guidance", "E-COIN Rewards", "1 Child Coverage"]
  },
  {
    id: "family",
    name: "Family Dream",
    monthlyInvestment: 3000,
    duration: 30,
    maturityValue: 10500000,
    monthlyWithdrawal: 100000,
    color: "from-amber-500 to-orange-600",
    icon: "👨‍👩‍👧‍👦",
    popular: true,
    features: ["Full Career Ecosystem", "Premium E-COIN", "2 Children Coverage", "AI Mentor Access"]
  },
  {
    id: "premium",
    name: "Legacy Builder",
    monthlyInvestment: 5000,
    duration: 30,
    maturityValue: 17500000,
    monthlyWithdrawal: 175000,
    color: "from-purple-500 to-indigo-600",
    icon: "👑",
    features: ["Complete Flywheel Access", "Unlimited E-COIN", "Full Family Coverage", "1-on-1 Mentorship", "Global Opportunities"]
  }
];

export default function DoersDreamSIIPPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("family");
  const [monthlyAmount, setMonthlyAmount] = useState(3000);
  const [showConfetti, setShowConfetti] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([
    { name: "", relation: "Self", age: "" },
    { name: "", relation: "Child", age: "" }
  ]);

  // Calculate returns (simplified compound growth at 12% CAGR)
  const years = 30;
  const rate = 0.12;
  const totalInvested = monthlyAmount * 12 * years;
  const maturityValue = Math.round(monthlyAmount * ((Math.pow(1 + rate/12, 12*years) - 1) / (rate/12)) * (1 + rate/12));
  const monthlyPension = Math.round(maturityValue * 0.01); // 1% monthly withdrawal

  const handleEnroll = () => {
    setShowConfetti(true);
    toast.success(
      <div className="flex items-center gap-2">
        <Heart className="w-5 h-5 text-red-500" />
        <div>
          <p className="font-semibold">Dream Enrolled! 🎉</p>
          <p className="text-sm">One Family • One Plan • Impact Delivered</p>
        </div>
      </div>,
      { duration: 5000 }
    );
    setTimeout(() => setShowConfetti(false), 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-8">
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
      
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white p-4 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-xl">Doers Dream SIIP</h1>
            <p className="text-white/70 text-sm">One Family • One Plan • Different Dreams</p>
          </div>
          <Badge className="bg-white/20 text-white border-0">
            <Shield className="w-3 h-3 mr-1" /> Secured
          </Badge>
        </div>

        {/* Hero Message */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
          <p className="text-white/70 text-xs uppercase tracking-widest mb-2">Systematic Investment in Impact Plan</p>
          <h2 className="font-display font-bold text-2xl mb-2">
            ₹3K/Month Today = ₹1 Lac/Month Tomorrow
          </h2>
          <p className="text-white/80 text-sm">
            Invest for 30 years • Withdraw for 30 years • Legacy Forever
          </p>
        </div>
      </header>

      {/* Calculator Section */}
      <div className="px-4 -mt-4 relative z-10 mb-6">
        <Card className="shadow-lg border-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-slate-900">Dream Calculator</h3>
            </div>

            {/* Monthly Investment Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 text-sm">Monthly Investment</span>
                <div className="flex items-center gap-1 font-bold text-amber-600">
                  <IndianRupee className="w-4 h-4" />
                  <span className="text-xl">{monthlyAmount.toLocaleString()}</span>
                </div>
              </div>
              <Slider
                value={[monthlyAmount]}
                onValueChange={(v) => setMonthlyAmount(v[0])}
                min={1000}
                max={10000}
                step={500}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>₹1,000</span>
                <span>₹10,000</span>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <p className="text-slate-500 text-xs mb-1">Total Invested (30 yrs)</p>
                <p className="font-bold text-lg text-amber-700">₹{(totalInvested/100000).toFixed(1)} Lac</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-slate-500 text-xs mb-1">Maturity Value</p>
                <p className="font-bold text-lg text-green-700">₹{(maturityValue/10000000).toFixed(2)} Cr</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <p className="text-slate-500 text-xs mb-1">Monthly Pension</p>
                <p className="font-bold text-lg text-purple-700">₹{monthlyPension.toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <p className="text-slate-500 text-xs mb-1">Pension Duration</p>
                <p className="font-bold text-lg text-blue-700">30 Years</p>
              </div>
            </div>

            <p className="text-center text-slate-500 text-xs italic">
              *Assuming 12% CAGR • Actual returns may vary
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Plans Section */}
      <div className="px-4 mb-6">
        <h3 className="font-display font-semibold text-slate-900 mb-4">Choose Your Family Plan</h3>
        <div className="space-y-4">
          {PLANS.map((plan) => (
            <Card 
              key={plan.id}
              className={`overflow-hidden border-2 cursor-pointer transition-all ${
                selectedPlan === plan.id 
                  ? 'border-amber-500 shadow-lg' 
                  : 'border-transparent hover:border-slate-200'
              }`}
              onClick={() => {
                setSelectedPlan(plan.id);
                setMonthlyAmount(plan.monthlyInvestment);
              }}
            >
              <CardContent className="p-0">
                <div className="flex">
                  <div className={`w-20 bg-gradient-to-br ${plan.color} flex flex-col items-center justify-center p-3 text-white`}>
                    <span className="text-3xl mb-1">{plan.icon}</span>
                    {plan.popular && (
                      <Badge className="bg-white/20 text-white border-0 text-[10px]">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900">{plan.name}</h4>
                        <p className="text-amber-600 font-bold">₹{plan.monthlyInvestment.toLocaleString()}/month</p>
                      </div>
                      {selectedPlan === plan.id && (
                        <CheckCircle2 className="w-6 h-6 text-amber-500" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {plan.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] px-2 py-0 bg-slate-50">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t flex justify-between text-xs text-slate-500">
                      <span>Maturity: ₹{(plan.maturityValue/10000000).toFixed(1)} Cr</span>
                      <span>Pension: ₹{(plan.monthlyWithdrawal/1000)}K/mo</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Family Members */}
      <div className="px-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-slate-900">Family Members</h3>
            </div>
            <div className="space-y-3">
              {familyMembers.map((member, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input 
                    placeholder="Name" 
                    className="flex-1"
                    value={member.name}
                    onChange={(e) => {
                      const updated = [...familyMembers];
                      updated[idx].name = e.target.value;
                      setFamilyMembers(updated);
                    }}
                  />
                  <Badge variant="outline" className="px-3">
                    {member.relation}
                  </Badge>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setFamilyMembers([...familyMembers, { name: "", relation: "Member", age: "" }])}
              >
                + Add Family Member
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Code Section */}
      <div className="px-4 mb-6">
        <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 border-0 text-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center">
                <QrCode className="w-12 h-12 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-white/70 text-xs uppercase tracking-wide">Go-To-Market</p>
                <h3 className="font-display font-bold text-lg">Scan & Enroll</h3>
                <p className="text-white/80 text-sm">Available at shops across India</p>
                <p className="text-white/60 text-xs mt-1">Every shop • Every pincode</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partners */}
      <div className="px-4 mb-6">
        <p className="text-center text-slate-500 text-xs uppercase tracking-widest mb-3">Trusted Partners</p>
        <div className="flex justify-center gap-4">
          {["ICICI Bank", "LIC", "SBI"].map((partner) => (
            <Badge key={partner} variant="outline" className="px-4 py-2 bg-white">
              {partner}
            </Badge>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-6">
        <Button 
          className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-lg font-semibold"
          onClick={handleEnroll}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Start Dream SIIP @ ₹{monthlyAmount.toLocaleString()}/month
        </Button>
        <p className="text-center text-slate-500 text-xs mt-3">
          One Family • Different Dreams • One Technology • Impact Delivered ✨
        </p>
      </div>

      {/* Philosophy Footer */}
      <div className="px-4">
        <div className="bg-amber-50 rounded-xl p-4 text-center">
          <GraduationCap className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <p className="font-semibold text-slate-900">Secure Your Child&apos;s Future</p>
          <p className="text-slate-600 text-sm mt-1">
            Like a family hotel dinner = ₹3K/month
          </p>
          <p className="text-slate-500 text-xs mt-2 italic">
            But this investment transforms into ₹1 Lac/month for your child&apos;s entire career
          </p>
        </div>
      </div>
    </div>
  );
}
