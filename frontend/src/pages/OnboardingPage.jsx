import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, MapPin, Sparkles, Check, CalendarIcon, User } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth, API } from "@/App";
import { format } from "date-fns";

const DIVISIONS = [
  { id: "Policy", name: "Policy", icon: "📋", club: "Power Keepers", color: "from-red-500 to-rose-600", clubColor: "bg-red-500" },
  { id: "Legal", name: "Legal", icon: "⚖️", club: "Power Keepers", color: "from-red-500 to-rose-600", clubColor: "bg-red-500" },
  { id: "Security", name: "Security", icon: "🛡️", club: "Power Keepers", color: "from-red-500 to-rose-600", clubColor: "bg-red-500" },
  { id: "Sport", name: "Sport", icon: "⚽", club: "Wellness Seekers", color: "from-green-500 to-emerald-600", clubColor: "bg-green-500" },
  { id: "Food & Agriculture", name: "Food & Agri", icon: "🌾", club: "Wellness Seekers", color: "from-green-500 to-emerald-600", clubColor: "bg-green-500" },
  { id: "Health", name: "Health", icon: "🏥", club: "Wellness Seekers", color: "from-green-500 to-emerald-600", clubColor: "bg-green-500" },
  { id: "Science", name: "Science", icon: "🔬", club: "Problem Solvers", color: "from-blue-500 to-indigo-600", clubColor: "bg-blue-500" },
  { id: "Technology", name: "Technology", icon: "💻", club: "Problem Solvers", color: "from-blue-500 to-indigo-600", clubColor: "bg-blue-500" },
  { id: "Transport & Logistics", name: "Transport", icon: "🚚", club: "Problem Solvers", color: "from-blue-500 to-indigo-600", clubColor: "bg-blue-500" },
  { id: "Art", name: "Art", icon: "🎨", club: "Knowledge Givers", color: "from-purple-500 to-violet-600", clubColor: "bg-purple-500" },
  { id: "Education", name: "Education", icon: "📚", club: "Knowledge Givers", color: "from-purple-500 to-violet-600", clubColor: "bg-purple-500" },
  { id: "Finance & Banking", name: "Finance", icon: "💰", club: "Profit Maximizers", color: "from-amber-500 to-orange-600", clubColor: "bg-amber-500" },
];

const AGE_GROUPS = [
  { id: "8-17", label: "8-17 years (Student)" },
  { id: "18-25", label: "18-25 years (Youth)" },
  { id: "26-40", label: "26-40 years (Professional)" },
  { id: "40+", label: "40+ years (Expert)" },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  const [step, setStep] = useState(1);
  const [dob, setDob] = useState(null);
  const [ageGroup, setAgeGroup] = useState("");
  const [gender, setGender] = useState("");
  const [pincode, setPincode] = useState("");
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [loading, setLoading] = useState(false);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleDivisionToggle = (divId) => {
    if (selectedDivisions.includes(divId)) {
      setSelectedDivisions(selectedDivisions.filter(d => d !== divId));
    } else if (selectedDivisions.length < 3) {
      setSelectedDivisions([...selectedDivisions, divId]);
    } else {
      toast.error("Maximum 3 interests allowed");
    }
  };

  const getPrimaryDivision = () => selectedDivisions[0] || null;
  
  const getClubForDivision = (divId) => {
    const div = DIVISIONS.find(d => d.id === divId);
    return div?.club || "";
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!ageGroup || !gender) {
        toast.error("Please fill all fields");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (selectedDivisions.length === 0) {
        toast.error("Please select at least one interest");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (pincode.length !== 6) {
        toast.error("Please enter a valid 6-digit pincode");
        return;
      }
      
      // Save and proceed to psychometric test
      setLoading(true);
      try {
        const updates = {
          division: getPrimaryDivision(),
          pincode: pincode,
          age_group: ageGroup,
          gender: gender,
          interests: selectedDivisions
        };
        
        await axios.put(`${API}/users/${user.id}`, updates);
        updateUser({ 
          ...updates, 
          club: getClubForDivision(getPrimaryDivision()) 
        });
        
        toast.success("Profile updated! Let's discover your talents!");
        navigate("/psychometric");
      } catch (error) {
        toast.error("Failed to update profile");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
          data-testid="onboard-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <Progress value={progress} className="h-2 bg-white/10" />
        </div>
        <span className="text-sm text-white/50 font-medium">{step}/{totalSteps}</span>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 pb-24 overflow-y-auto">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="animate-fade-in max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="font-display text-2xl font-bold text-white mb-2">
                Tell us about yourself
              </h1>
              <p className="text-white/50">
                This helps us personalize your journey
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <Label className="text-white/70">Age Group</Label>
                <Select value={ageGroup} onValueChange={setAgeGroup}>
                  <SelectTrigger className="mt-2 h-12 bg-white/10 border-white/20 text-white" data-testid="age-group-select">
                    <SelectValue placeholder="Select your age group" />
                  </SelectTrigger>
                  <SelectContent>
                    {AGE_GROUPS.map((ag) => (
                      <SelectItem key={ag.id} value={ag.id}>{ag.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <Label className="text-white/70">Gender</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {["Male", "Female", "Other"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`py-3 rounded-lg font-medium transition-all ${
                        gender === g 
                          ? "bg-indigo-500 text-white" 
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                      data-testid={`gender-${g.toLowerCase()}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Division Selection */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <h1 className="font-display text-2xl font-bold text-white mb-2">
                What's Your Rashi?
              </h1>
              <p className="text-white/50">
                Select 1-3 areas that excite you most
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
              {DIVISIONS.map((div, i) => {
                const isSelected = selectedDivisions.includes(div.id);
                const rank = selectedDivisions.indexOf(div.id) + 1;
                
                return (
                  <button
                    key={div.id}
                    onClick={() => handleDivisionToggle(div.id)}
                    className={`
                      relative p-4 rounded-xl border-2 transition-all text-center
                      ${isSelected 
                        ? "border-white bg-white/10" 
                        : "border-white/10 bg-white/5 hover:border-white/30"}
                    `}
                    data-testid={`division-${div.id.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {rank}
                      </div>
                    )}
                    <div className="text-3xl mb-2">{div.icon}</div>
                    <p className="font-medium text-sm text-white">{div.name}</p>
                    <p className="text-xs text-white/40 mt-1">{div.club}</p>
                  </button>
                );
              })}
            </div>

            {selectedDivisions.length > 0 && (
              <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl max-w-lg mx-auto animate-scale-in">
                <p className="text-sm text-white/50 mb-2">Your Talent Club:</p>
                <div className={`${DIVISIONS.find(d => d.id === selectedDivisions[0])?.clubColor} text-white px-4 py-2 rounded-lg inline-block font-semibold`}>
                  {getClubForDivision(selectedDivisions[0])}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <div className="animate-fade-in max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h1 className="font-display text-2xl font-bold text-white mb-2">
                Where are you located?
              </h1>
              <p className="text-white/50">
                Find opportunities near your pincode
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <Label className="text-white/70">Pincode</Label>
              <Input
                type="text"
                placeholder="Enter 6-digit pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="h-16 text-2xl text-center font-mono mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                data-testid="pincode-input"
              />
              <p className="text-sm text-white/40 mt-3 text-center">
                We'll show jobs & services in your area
              </p>
            </div>

            {/* Summary Preview */}
            <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-white">Your Profile Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-white/50">Name</div>
                <div className="text-white font-medium">{user?.name}</div>
                <div className="text-white/50">Age Group</div>
                <div className="text-white font-medium">{ageGroup}</div>
                <div className="text-white/50">Primary Interest</div>
                <div className="text-white font-medium">{getPrimaryDivision()}</div>
                <div className="text-white/50">Club</div>
                <div className="text-white font-medium">{getClubForDivision(getPrimaryDivision())}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
        <Button 
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
          onClick={handleNext}
          disabled={loading}
          data-testid="onboard-next-btn"
        >
          {loading ? "Saving..." : step === totalSteps ? "Continue to Talent Test" : "Continue"}
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
