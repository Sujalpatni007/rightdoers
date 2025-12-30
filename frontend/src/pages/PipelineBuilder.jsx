import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowLeft, 
  ArrowRight,
  Users,
  MapPin,
  GraduationCap,
  Briefcase,
  Check,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

const SKILL_LEVELS = [
  { id: "L1", name: "Entry Level", description: "Fresh graduates, basic training" },
  { id: "L2", name: "Junior", description: "1-2 years experience" },
  { id: "L3", name: "Mid-Level", description: "3-5 years experience" },
  { id: "L4", name: "Senior", description: "5-10 years experience" },
  { id: "L5", name: "Expert", description: "10+ years, specialist" }
];

const SKILLS = [
  "Nuclear Physics", "Reactor Design", "Radiation Safety", "Thermodynamics",
  "MCNP Simulation", "Control Systems", "Materials Science", "Python",
  "MATLAB", "AutoCAD", "Project Management", "Quality Assurance"
];

const LOCATIONS = [
  "All India", "Andhra Pradesh", "Tamil Nadu", "Maharashtra", 
  "Gujarat", "Karnataka", "Rajasthan"
];

export default function PipelineBuilder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    roleName: "Junior Nuclear Engineer",
    positions: 10,
    levels: ["L1", "L2"],
    skills: ["Nuclear Physics", "Radiation Safety"],
    location: "All India",
    minPassScore: 70
  });
  const [results, setResults] = useState(null);

  const handleLevelToggle = (levelId) => {
    if (config.levels.includes(levelId)) {
      setConfig({ ...config, levels: config.levels.filter(l => l !== levelId) });
    } else {
      setConfig({ ...config, levels: [...config.levels, levelId] });
    }
  };

  const handleSkillToggle = (skill) => {
    if (config.skills.includes(skill)) {
      setConfig({ ...config, skills: config.skills.filter(s => s !== skill) });
    } else if (config.skills.length < 6) {
      setConfig({ ...config, skills: [...config.skills, skill] });
    } else {
      toast.error("Maximum 6 skills allowed");
    }
  };

  const handleSearch = () => {
    // Simulate API call
    setResults({
      total: 847,
      excellent: 127,
      good: 420,
      moderate: 300
    });
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-lg">Build Talent Pipeline</h1>
            <p className="text-white/70 text-sm">Step {step} of 4</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`flex-1 h-1 rounded-full ${
                s <= step ? 'bg-white' : 'bg-white/30'
              }`} 
            />
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label className="text-slate-700">Role Name</Label>
              <Input 
                value={config.roleName}
                onChange={(e) => setConfig({ ...config, roleName: e.target.value })}
                className="mt-2"
                placeholder="e.g., Junior Nuclear Engineer"
              />
            </div>

            <div>
              <Label className="text-slate-700">Number of Positions</Label>
              <Input 
                type="number"
                value={config.positions}
                onChange={(e) => setConfig({ ...config, positions: parseInt(e.target.value) })}
                className="mt-2"
                min={1}
                max={100}
              />
            </div>

            <Button 
              className="w-full h-12 bg-indigo-600"
              onClick={() => setStep(2)}
            >
              Next: Select Skill Levels <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-900">Select Skill Levels</h2>
            <p className="text-slate-500 text-sm">Choose the experience levels you're looking for</p>

            <div className="space-y-3">
              {SKILL_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleLevelToggle(level.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    config.levels.includes(level.id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{level.id}: {level.name}</p>
                      <p className="text-slate-500 text-sm">{level.description}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      config.levels.includes(level.id)
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-slate-300'
                    }`}>
                      {config.levels.includes(level.id) && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <Button 
              className="w-full h-12 bg-indigo-600"
              onClick={() => setStep(3)}
              disabled={config.levels.length === 0}
            >
              Next: Select Skills <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-900">Required Skills</h2>
            <p className="text-slate-500 text-sm">Select up to 6 skills ({config.skills.length}/6)</p>

            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-4 py-2 rounded-full border-2 text-sm transition-all ${
                    config.skills.includes(skill)
                      ? 'border-indigo-500 bg-indigo-500 text-white'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            <div className="pt-4">
              <Label className="text-slate-700">Minimum PASS Score</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  value={[config.minPassScore]}
                  onValueChange={(v) => setConfig({ ...config, minPassScore: v[0] })}
                  max={100}
                  min={50}
                  step={5}
                  className="flex-1"
                />
                <span className="font-semibold text-indigo-600 w-12">{config.minPassScore}%</span>
              </div>
            </div>

            <div className="pt-4">
              <Label className="text-slate-700">Location Preference</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setConfig({ ...config, location: loc })}
                    className={`px-3 py-1.5 rounded-lg border text-sm ${
                      config.location === loc
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600"
              onClick={handleSearch}
              disabled={config.skills.length === 0}
            >
              <Sparkles className="mr-2 w-4 h-4" /> Find Matching Candidates
            </Button>
          </div>
        )}

        {step === 4 && results && (
          <div className="space-y-6">
            {/* Results Summary */}
            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 text-white">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4" />
                <h2 className="font-display text-4xl font-bold mb-2">{results.total}</h2>
                <p className="text-white/80">Candidates match your requirements</p>
              </CardContent>
            </Card>

            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{results.excellent}</p>
                  <p className="text-slate-500 text-xs">Excellent Match</p>
                  <p className="text-green-600 text-xs">90%+ fit</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{results.good}</p>
                  <p className="text-slate-500 text-xs">Good Match</p>
                  <p className="text-blue-600 text-xs">75-90% fit</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-amber-600">{results.moderate}</p>
                  <p className="text-slate-500 text-xs">Moderate</p>
                  <p className="text-amber-600 text-xs">60-75% fit</p>
                </CardContent>
              </Card>
            </div>

            {/* Config Summary */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Your Pipeline Configuration</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Role</span>
                    <span className="font-medium">{config.roleName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Positions</span>
                    <span className="font-medium">{config.positions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Levels</span>
                    <span className="font-medium">{config.levels.join(", ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location</span>
                    <span className="font-medium">{config.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Min PASS Score</span>
                    <span className="font-medium">{config.minPassScore}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FOMO Alert */}
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <p className="text-amber-800 text-sm">
                  ⚠️ <strong>127 candidates</strong> are already being viewed by your competitors. 
                  Act fast to secure top talent!
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-lg"
                onClick={() => navigate("/corporate")}
              >
                <Users className="mr-2" /> View Candidates
              </Button>
              <Button 
                variant="outline"
                className="w-full h-12"
                onClick={() => toast.success("Pipeline saved!")}
              >
                Save This Pipeline
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
