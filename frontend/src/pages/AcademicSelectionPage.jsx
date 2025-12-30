import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/App";

const SUBJECTS = [
  { id: "physics", name: "Physics", icon: "⚛️", category: "Science" },
  { id: "mathematics", name: "Mathematics", icon: "📊", category: "Science" },
  { id: "chemistry", name: "Chemistry", icon: "🧪", category: "Science" },
  { id: "biology", name: "Biology", icon: "🧬", category: "Science" },
  { id: "computer_science", name: "Computer Science", icon: "💻", category: "Technology" },
  { id: "english", name: "English", icon: "📝", category: "Language" },
  { id: "economics", name: "Economics", icon: "💰", category: "Commerce" },
  { id: "history", name: "History", icon: "🏛️", category: "Arts" },
  { id: "geography", name: "Geography", icon: "🌍", category: "Arts" },
  { id: "arts", name: "Fine Arts", icon: "🎨", category: "Arts" }
];

const CAREER_INTERESTS = [
  { id: "nuclear_engineer", name: "Nuclear Engineer", icon: "☢️", hot: true, division: "Science" },
  { id: "scientist", name: "Scientist", icon: "🔬", hot: false, division: "Science" },
  { id: "doctor", name: "Doctor", icon: "👨‍⚕️", hot: false, division: "Health" },
  { id: "data_scientist", name: "Data Scientist", icon: "📊", hot: true, division: "Technology" },
  { id: "software_engineer", name: "Software Engineer", icon: "💻", hot: true, division: "Technology" },
  { id: "teacher", name: "Teacher", icon: "👩‍🏫", hot: false, division: "Education" },
  { id: "marketing_manager", name: "Marketing Manager", icon: "📣", hot: false, division: "Finance & Banking" },
  { id: "nurse", name: "Nurse", icon: "👩‍⚕️", hot: false, division: "Health" },
  { id: "physio_therapist", name: "Physiotherapist", icon: "🧘", hot: false, division: "Health" },
  { id: "submariner", name: "Submariner", icon: "🚢", hot: false, division: "Security" },
  { id: "power_plant_operator", name: "Power Plant Operator", icon: "⚡", hot: true, division: "Science" },
  { id: "manufacturing_engineer", name: "Manufacturing Engineer", icon: "🏭", hot: false, division: "Technology" }
];

export default function AcademicSelectionPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  const [step, setStep] = useState(1); // 1 = subjects, 2 = careers
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedCareers, setSelectedCareers] = useState([]);

  const toggleSubject = (subjectId) => {
    if (selectedSubjects.includes(subjectId)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subjectId));
    } else {
      setSelectedSubjects([...selectedSubjects, subjectId]);
    }
  };

  const toggleCareer = (careerId) => {
    if (selectedCareers.includes(careerId)) {
      setSelectedCareers(selectedCareers.filter(c => c !== careerId));
    } else if (selectedCareers.length < 3) {
      setSelectedCareers([...selectedCareers, careerId]);
    } else {
      toast.error("Maximum 3 career interests allowed");
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (selectedSubjects.length === 0) {
        toast.error("Please select at least one subject");
        return;
      }
      setStep(2);
    } else {
      if (selectedCareers.length === 0) {
        toast.error("Please select at least one career interest");
        return;
      }
      // Save and navigate to career recommendations
      updateUser({ 
        subjects: selectedSubjects, 
        careerInterests: selectedCareers 
      });
      navigate("/career-recommendations");
    }
  };

  const clearAll = () => {
    if (step === 1) {
      setSelectedSubjects([]);
    } else {
      setSelectedCareers([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={() => step === 1 ? navigate(-1) : setStep(1)}
          data-testid="academic-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <Progress value={step === 1 ? 75 : 90} className="h-2 bg-white/10" />
        </div>
        <span className="text-sm text-white/50 font-medium">Step {step === 1 ? '4a' : '4b'}/4</span>
      </header>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setStep(1)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              step === 1 
                ? "bg-white/20 text-white" 
                : "bg-white/5 text-white/50"
            }`}
          >
            <Check className={`w-4 h-4 inline mr-2 ${selectedSubjects.length > 0 ? "text-green-400" : "text-white/30"}`} />
            1. My Subjects
          </button>
          <button
            onClick={() => selectedSubjects.length > 0 && setStep(2)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              step === 2 
                ? "bg-white/20 text-white" 
                : "bg-white/5 text-white/50"
            }`}
          >
            <Check className={`w-4 h-4 inline mr-2 ${selectedCareers.length > 0 ? "text-green-400" : "text-white/30"}`} />
            2. My Careers
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-32 overflow-y-auto">
        <div className="max-w-md mx-auto">
          {step === 1 ? (
            /* Subject Selection */
            <>
              <div className="text-center mb-6">
                <h1 className="font-display text-2xl font-bold text-white mb-2">
                  CHOOSE YOUR ACADEMICS
                </h1>
                <p className="text-white/50">
                  Select your subject interests
                </p>
              </div>

              <div className="space-y-2">
                {SUBJECTS.map((subject) => {
                  const isSelected = selectedSubjects.includes(subject.id);
                  return (
                    <button
                      key={subject.id}
                      onClick={() => toggleSubject(subject.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? "border-indigo-500 bg-indigo-500/20" 
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                      data-testid={`subject-${subject.id}`}
                    >
                      <span className="text-2xl">{subject.icon}</span>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-white">{subject.name}</p>
                        <p className="text-xs text-white/40">{subject.category}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected 
                          ? "border-indigo-500 bg-indigo-500" 
                          : "border-white/30"
                      }`}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Career Selection */
            <>
              <div className="text-center mb-6">
                <h1 className="font-display text-2xl font-bold text-white mb-2">
                  CAREER INTERESTS
                </h1>
                <p className="text-white/50">
                  Select up to 3 careers that excite you
                </p>
              </div>

              <div className="space-y-2">
                {CAREER_INTERESTS.map((career) => {
                  const isSelected = selectedCareers.includes(career.id);
                  const rank = selectedCareers.indexOf(career.id) + 1;
                  return (
                    <button
                      key={career.id}
                      onClick={() => toggleCareer(career.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all relative ${
                        isSelected 
                          ? "border-amber-500 bg-amber-500/20" 
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                      data-testid={`career-${career.id}`}
                    >
                      {career.hot && (
                        <Badge className="absolute -top-2 -right-2 bg-red-500 text-white border-0 text-[10px] px-2">
                          🔥 HOT
                        </Badge>
                      )}
                      <span className="text-2xl">{career.icon}</span>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-white">{career.name}</p>
                        <p className="text-xs text-white/40">{career.division}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected 
                          ? "border-amber-500 bg-amber-500" 
                          : "border-white/30"
                      }`}>
                        {isSelected && <span className="text-white text-xs font-bold">{rank}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Clear All */}
          <button
            onClick={clearAll}
            className="w-full mt-4 py-2 text-center text-white/50 text-sm hover:text-white/70"
          >
            <X className="w-4 h-4 inline mr-1" /> Clear All
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-white/50 text-sm">
              {step === 1 
                ? `${selectedSubjects.length} subjects selected` 
                : `${selectedCareers.length}/3 careers selected`}
            </span>
            {step === 1 && selectedSubjects.length > 0 && (
              <Badge className="bg-green-500/20 text-green-400 border-0">
                Ready ✓
              </Badge>
            )}
          </div>
          <Button 
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
            onClick={handleNext}
            data-testid="academic-continue-btn"
          >
            {step === 1 ? "Continue to Careers" : "Get Started"} <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
