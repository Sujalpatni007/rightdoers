import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth, API } from "@/App";

const DIVISIONS = [
  "Policy", "Legal", "Security", "Sport", "Food & Agriculture", "Health",
  "Science", "Technology", "Transport & Logistics", "Art", "Education", "Finance & Banking"
];

const LEVELS = [
  { value: "L1", label: "L1 - Entry Level (₹15K-30K)", min: 15000, max: 30000 },
  { value: "L2", label: "L2 - Junior (₹30K-60K)", min: 30000, max: 60000 },
  { value: "L3", label: "L3 - Mid-Level (₹60K-1.5L)", min: 60000, max: 150000 },
  { value: "L4", label: "L4 - Expert (₹1.5L-15L+)", min: 150000, max: 1500000 },
];

export default function PostJobPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    division: "",
    level: "",
    salaryMin: "",
    salaryMax: "",
    pincode: "",
    requirements: ""
  });

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Auto-fill salary based on level
    if (field === "level") {
      const levelInfo = LEVELS.find(l => l.value === value);
      if (levelInfo) {
        setFormData(prev => ({
          ...prev,
          level: value,
          salaryMin: levelInfo.min.toString(),
          salaryMax: levelInfo.max.toString()
        }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.division || !formData.level || !formData.pincode) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        company_name: user?.company_name || user?.name,
        division: formData.division,
        level: formData.level,
        salary_min: parseInt(formData.salaryMin),
        salary_max: parseInt(formData.salaryMax),
        pincode: formData.pincode,
        requirements: formData.requirements.split(",").map(r => r.trim()).filter(Boolean),
        employer_id: user.id
      };

      await axios.post(`${API}/jobs`, jobData);
      toast.success("Job posted successfully! 🎉");
      navigate("/employer");
    } catch (error) {
      toast.error("Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  const handleAIAssist = () => {
    if (!formData.title) {
      toast.error("Enter job title first");
      return;
    }
    
    // AI-generated description based on title
    const descriptions = {
      default: `We are looking for a talented ${formData.title} to join our team. The ideal candidate will have strong skills in their domain and a passion for excellence.

Key Responsibilities:
• Execute tasks efficiently and meet deadlines
• Collaborate with team members
• Continuously learn and improve

Requirements:
• Relevant experience or education
• Strong communication skills
• Problem-solving ability`
    };
    
    setFormData(prev => ({
      ...prev,
      description: descriptions.default
    }));
    toast.success("AI generated description!");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b p-4 flex items-center gap-3 sticky top-0 z-40">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/employer")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-display text-xl font-bold">Post a Job</h1>
      </header>

      {/* Form */}
      <div className="p-4 pb-24 max-w-lg mx-auto">
        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label>Job Title *</Label>
            <Input
              placeholder="e.g., Software Developer, Nurse, Teacher"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="h-12 mt-1"
              data-testid="job-title-input"
            />
          </div>

          {/* Division */}
          <div>
            <Label>Division *</Label>
            <Select value={formData.division} onValueChange={(v) => updateField("division", v)}>
              <SelectTrigger className="h-12 mt-1" data-testid="job-division-select">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {DIVISIONS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Level */}
          <div>
            <Label>Job Level *</Label>
            <Select value={formData.level} onValueChange={(v) => updateField("level", v)}>
              <SelectTrigger className="h-12 mt-1" data-testid="job-level-select">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map((l) => (
                  <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Salary */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Min Salary (₹) *</Label>
              <Input
                type="number"
                placeholder="15000"
                value={formData.salaryMin}
                onChange={(e) => updateField("salaryMin", e.target.value)}
                className="h-12 mt-1"
                data-testid="job-salary-min"
              />
            </div>
            <div>
              <Label>Max Salary (₹) *</Label>
              <Input
                type="number"
                placeholder="30000"
                value={formData.salaryMax}
                onChange={(e) => updateField("salaryMax", e.target.value)}
                className="h-12 mt-1"
                data-testid="job-salary-max"
              />
            </div>
          </div>

          {/* Pincode */}
          <div>
            <Label>Location Pincode *</Label>
            <Input
              placeholder="560001"
              value={formData.pincode}
              onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="h-12 mt-1"
              maxLength={6}
              data-testid="job-pincode"
            />
          </div>

          {/* Description with AI */}
          <div>
            <div className="flex items-center justify-between">
              <Label>Job Description *</Label>
              <Button
                variant="ghost"
                size="sm"
                className="text-indigo-600"
                onClick={handleAIAssist}
              >
                <Sparkles className="w-4 h-4 mr-1" /> AI Assist
              </Button>
            </div>
            <Textarea
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="mt-1 min-h-[150px]"
              data-testid="job-description"
            />
          </div>

          {/* Requirements */}
          <div>
            <Label>Requirements (comma-separated)</Label>
            <Input
              placeholder="e.g., Communication, Excel, 2 years experience"
              value={formData.requirements}
              onChange={(e) => updateField("requirements", e.target.value)}
              className="h-12 mt-1"
              data-testid="job-requirements"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button 
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-orange-500 to-amber-600"
          onClick={handleSubmit}
          disabled={loading}
          data-testid="submit-job-btn"
        >
          {loading ? "Posting..." : "Post Job"}
        </Button>
      </div>
    </div>
  );
}
