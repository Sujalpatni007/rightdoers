import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, MapPin, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth, API } from "@/App";

const DIVISIONS = [
  { id: "Policy", name: "Policy", icon: "📋", club: "Power Keepers", color: "club-power" },
  { id: "Legal", name: "Legal", icon: "⚖️", club: "Power Keepers", color: "club-power" },
  { id: "Security", name: "Security", icon: "🛡️", club: "Power Keepers", color: "club-power" },
  { id: "Sport", name: "Sport", icon: "⚽", club: "Wellness Seekers", color: "club-wellness" },
  { id: "Food & Agriculture", name: "Food & Agri", icon: "🌾", club: "Wellness Seekers", color: "club-wellness" },
  { id: "Health", name: "Health", icon: "🏥", club: "Wellness Seekers", color: "club-wellness" },
  { id: "Science", name: "Science", icon: "🔬", club: "Problem Solvers", color: "club-problem" },
  { id: "Technology", name: "Technology", icon: "💻", club: "Problem Solvers", color: "club-problem" },
  { id: "Transport & Logistics", name: "Transport", icon: "🚚", club: "Problem Solvers", color: "club-problem" },
  { id: "Art", name: "Art", icon: "🎨", club: "Knowledge Givers", color: "club-knowledge" },
  { id: "Education", name: "Education", icon: "📚", club: "Knowledge Givers", color: "club-knowledge" },
  { id: "Finance & Banking", name: "Finance", icon: "💰", club: "Profit Maximizers", color: "club-profit" },
];

const CLUBS = [
  { name: "Power Keepers", color: "club-power", desc: "Policy, Legal, Security" },
  { name: "Wellness Seekers", color: "club-wellness", desc: "Sport, Food, Health" },
  { name: "Problem Solvers", color: "club-problem", desc: "Science, Tech, Transport" },
  { name: "Knowledge Givers", color: "club-knowledge", desc: "Art, Education" },
  { name: "Profit Maximizers", color: "club-profit", desc: "Finance & Banking" },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  const [step, setStep] = useState(1);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const getClubForDivision = (divId) => {
    const div = DIVISIONS.find(d => d.id === divId);
    return div?.club || "";
  };

  const handleNext = async () => {
    if (step === 1 && !selectedDivision) {
      toast.error("Please select your interest area");
      return;
    }
    if (step === 2 && pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      setLoading(true);
      try {
        const updates = {
          division: selectedDivision,
          pincode: pincode
        };
        
        await axios.put(`${API}/users/${user.id}`, updates);
        updateUser({ 
          ...updates, 
          club: getClubForDivision(selectedDivision) 
        });
        
        toast.success("Profile completed! Welcome to Right Doers World!");
        navigate("/dashboard");
      } catch (error) {
        toast.error("Failed to update profile");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
          data-testid="onboard-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <Progress value={progress} className="h-2" />
        </div>
        <span className="text-sm text-slate-500 font-medium">{step}/{totalSteps}</span>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 pb-8">
        {/* Step 1: Select Division */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">
                What interests you?
              </h1>
              <p className="text-slate-500">
                Select your preferred industry to find matching opportunities
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {DIVISIONS.map((div) => (
                <button
                  key={div.id}
                  onClick={() => setSelectedDivision(div.id)}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all
                    ${selectedDivision === div.id 
                      ? "border-primary bg-primary/5 shadow-md" 
                      : "border-slate-200 bg-white hover:border-primary/50"}
                  `}
                  data-testid={`division-${div.id.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {selectedDivision === div.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="text-3xl mb-2">{div.icon}</div>
                  <p className="font-medium text-sm text-slate-900">{div.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{div.club}</p>
                </button>
              ))}
            </div>

            {selectedDivision && (
              <div className="mt-6 p-4 bg-white rounded-xl border animate-scale-in">
                <p className="text-sm text-slate-500 mb-2">You'll be part of:</p>
                <div className={`${DIVISIONS.find(d => d.id === selectedDivision)?.color} text-white px-4 py-2 rounded-lg inline-block font-semibold`}>
                  {getClubForDivision(selectedDivision)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Enter Pincode */}
        {step === 2 && (
          <div className="animate-fade-in max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">
                Where are you located?
              </h1>
              <p className="text-slate-500">
                Enter your pincode to find jobs near you
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                type="text"
                placeholder="Enter 6-digit pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="h-14 text-xl text-center font-mono mt-2"
                data-testid="pincode-input"
              />
              <p className="text-sm text-slate-500 mt-3 text-center">
                We'll show you jobs available in and around your area
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="animate-fade-in max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">
                You're all set!
              </h1>
              <p className="text-slate-500">
                Welcome to the future of work
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-slate-500">Name</span>
                <span className="font-semibold">{user?.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-slate-500">Division</span>
                <Badge variant="outline">{selectedDivision}</Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-slate-500">Club</span>
                <span className={`${DIVISIONS.find(d => d.id === selectedDivision)?.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                  {getClubForDivision(selectedDivision)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500">Pincode</span>
                <span className="font-mono font-semibold">{pincode}</span>
              </div>
            </div>

            <p className="text-center text-sm text-slate-500 mt-6">
              "Choose a job that feels like play to you"
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-white border-t">
        <Button 
          className="w-full btn-primary"
          onClick={handleNext}
          disabled={loading}
          data-testid="onboard-next-btn"
        >
          {loading ? "Setting up..." : step === totalSteps ? "Start Exploring" : "Continue"}
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
