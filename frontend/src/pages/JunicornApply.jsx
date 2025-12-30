import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Rocket, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/App";

export default function JunicornApply() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    ageGroup: "",
    education: "",
    bigIdea: "",
    problemSolved: "",
    whyYou: "",
    portfolio: "",
    video: ""
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setSubmitted(true);
    toast.success("Application submitted! We'll review and get back to you.");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center text-white max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-4">Application Submitted! 🎉</h1>
          <p className="text-white/70 mb-8">
            Thank you for applying to Junicorn NET. Our team will review your application and contact you within 7 days.
          </p>
          <p className="text-white/50 text-sm mb-8">
            Application ID: JNC-{Date.now().toString().slice(-8)}
          </p>
          <Button 
            className="bg-white text-purple-600 hover:bg-white/90"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={() => step > 1 ? setStep(step - 1) : navigate("/junicorn")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <Progress value={progress} className="h-2 bg-white/10" />
        </div>
        <span className="text-sm text-white/50">{step}/{totalSteps}</span>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 pb-24 overflow-y-auto">
        <div className="max-w-md mx-auto">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🦄</span>
                </div>
                <h1 className="font-display text-2xl font-bold text-white mb-2">
                  Junicorn NET Application
                </h1>
                <p className="text-white/50">Step 1: Tell us about yourself</p>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Label className="text-white/70">Your Name</Label>
                  <Input 
                    value={user?.name || ""} 
                    disabled 
                    className="mt-2 bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Label className="text-white/70">Age Group</Label>
                  <Select value={formData.ageGroup} onValueChange={(v) => updateField("ageGroup", v)}>
                    <SelectTrigger className="mt-2 bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8-12">8-12 years (Young Innovator)</SelectItem>
                      <SelectItem value="13-17">13-17 years (Teen Visionary)</SelectItem>
                      <SelectItem value="18-21">18-21 years (Rising Star)</SelectItem>
                      <SelectItem value="22-25">22-25 years (Emerging Leader)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Label className="text-white/70">Current Education/Work</Label>
                  <Input 
                    placeholder="e.g., 10th Grade, B.Tech Student, Working"
                    value={formData.education}
                    onChange={(e) => updateField("education", e.target.value)}
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Your Idea */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h1 className="font-display text-2xl font-bold text-white mb-2">
                  Your Big Idea
                </h1>
                <p className="text-white/50">Step 2: Tell us what you want to build</p>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Label className="text-white/70">Describe your big idea</Label>
                  <Textarea 
                    placeholder="What do you want to create? What's your moonshot vision?"
                    value={formData.bigIdea}
                    onChange={(e) => updateField("bigIdea", e.target.value)}
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[120px]"
                  />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Label className="text-white/70">What problem does it solve?</Label>
                  <Textarea 
                    placeholder="Who will benefit? How big is the impact?"
                    value={formData.problemSolved}
                    onChange={(e) => updateField("problemSolved", e.target.value)}
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Why You */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⭐</span>
                </div>
                <h1 className="font-display text-2xl font-bold text-white mb-2">
                  Why You?
                </h1>
                <p className="text-white/50">Step 3: Convince us you're a NET</p>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Label className="text-white/70">Why are you the right person?</Label>
                  <Textarea 
                    placeholder="What makes you special? What's your unfair advantage?"
                    value={formData.whyYou}
                    onChange={(e) => updateField("whyYou", e.target.value)}
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[120px]"
                  />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Label className="text-white/70">Portfolio/Previous Work (optional)</Label>
                  <Input 
                    placeholder="Link to your work, GitHub, website, etc."
                    value={formData.portfolio}
                    onChange={(e) => updateField("portfolio", e.target.value)}
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Label className="text-white/70">Video Pitch (optional)</Label>
                  <Input 
                    placeholder="YouTube or Loom link (2 min max)"
                    value={formData.video}
                    onChange={(e) => updateField("video", e.target.value)}
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                  <p className="text-white/40 text-xs mt-2">
                    Pro tip: Video pitches get 3x more attention!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
        <Button 
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90"
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? "Submitting..." : step === totalSteps ? "Submit Application" : "Continue"}
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
