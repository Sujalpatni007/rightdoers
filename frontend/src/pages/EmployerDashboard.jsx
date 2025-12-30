import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Briefcase, 
  Users, 
  TrendingUp, 
  LogOut,
  Building2,
  MapPin,
  Clock,
  Eye,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth, API } from "@/App";

const DIVISIONS = [
  "Policy", "Legal", "Security", "Sport", "Food & Agriculture", "Health",
  "Science", "Technology", "Transport & Logistics", "Art", "Education", "Finance & Banking"
];

const LEVELS = [
  { value: "L1", label: "L1 - Entry Level (₹15K-30K)" },
  { value: "L2", label: "L2 - Junior (₹30K-60K)" },
  { value: "L3", label: "L3 - Mid-Level (₹60K-1.5L)" },
  { value: "L4", label: "L4 - Expert (₹1.5L-15L+)" },
];

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostJob, setShowPostJob] = useState(false);
  const [posting, setPosting] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [division, setDivision] = useState("");
  const [level, setLevel] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [pincode, setPincode] = useState("");
  const [requirements, setRequirements] = useState("");

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    if (!user?.id) return;
    try {
      const res = await axios.get(`${API}/jobs/employer/${user.id}`);
      setJobs(res.data);
    } catch (error) {
      console.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async () => {
    if (!title || !description || !division || !level || !salaryMin || !salaryMax || !pincode) {
      toast.error("Please fill all required fields");
      return;
    }

    setPosting(true);
    try {
      const jobData = {
        title,
        description,
        company_name: user?.company_name || user?.name,
        division,
        level,
        salary_min: parseInt(salaryMin),
        salary_max: parseInt(salaryMax),
        pincode,
        requirements: requirements.split(",").map(r => r.trim()).filter(Boolean),
        employer_id: user.id
      };

      await axios.post(`${API}/jobs`, jobData);
      toast.success("Job posted successfully! 🎉");
      setShowPostJob(false);
      resetForm();
      fetchJobs();
    } catch (error) {
      toast.error("Failed to post job");
    } finally {
      setPosting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDivision("");
    setLevel("");
    setSalaryMin("");
    setSalaryMax("");
    setPincode("");
    setRequirements("");
  };

  const viewApplicants = async (job) => {
    setSelectedJob(job);
    try {
      const res = await axios.get(`${API}/applications/job/${job.id}`);
      setApplicants(res.data);
    } catch (error) {
      toast.error("Failed to load applicants");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const totalApplications = jobs.reduce((acc, job) => acc + (job.applications_count || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-primary text-white p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/70 text-sm">Welcome,</p>
            <h1 className="font-display text-xl font-bold">{user?.company_name || user?.name}</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={handleLogout}
            data-testid="employer-logout-btn"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <Briefcase className="w-6 h-6 mx-auto mb-2" />
            <p className="font-bold text-2xl">{jobs.length}</p>
            <p className="text-white/70 text-xs">Active Jobs</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2" />
            <p className="font-bold text-2xl">{totalApplications}</p>
            <p className="text-white/70 text-xs">Applications</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2" />
            <p className="font-bold text-2xl">0</p>
            <p className="text-white/70 text-xs">Hired</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Post Job Button */}
        <Button 
          className="w-full btn-secondary"
          onClick={() => setShowPostJob(true)}
          data-testid="post-job-btn"
        >
          <Plus className="w-5 h-5 mr-2" /> Post New Job
        </Button>

        {/* Jobs List */}
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-900 mb-4">Your Job Postings</h2>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 border animate-pulse">
                  <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-3">
              {jobs.map((job) => (
                <button
                  key={job.id}
                  className="w-full text-left bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => viewApplicants(job)}
                  data-testid={`employer-job-${job.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{job.title}</h3>
                      <p className="text-sm text-slate-500">{job.division} • {job.level}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {job.pincode}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {job.applications_count || 0} applicants
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border">
              <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">No jobs posted yet</h3>
              <p className="text-slate-500 text-sm mb-4">Post your first job to start receiving applications</p>
              <Button onClick={() => setShowPostJob(true)}>Post a Job</Button>
            </div>
          )}
        </div>
      </div>

      {/* Post Job Dialog */}
      <Dialog open={showPostJob} onOpenChange={setShowPostJob}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Post a New Job</DialogTitle>
            <DialogDescription>Find the right talent for your organization</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Software Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                data-testid="job-title-input"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role and responsibilities"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                data-testid="job-description-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Division *</Label>
                <Select value={division} onValueChange={setDivision}>
                  <SelectTrigger data-testid="job-division-select">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIVISIONS.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Level *</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger data-testid="job-level-select">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((l) => (
                      <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salaryMin">Min Salary (₹) *</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  placeholder="15000"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  data-testid="job-salary-min-input"
                />
              </div>
              <div>
                <Label htmlFor="salaryMax">Max Salary (₹) *</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  placeholder="30000"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  data-testid="job-salary-max-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pincode">Location Pincode *</Label>
              <Input
                id="pincode"
                placeholder="560001"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                data-testid="job-pincode-input"
              />
            </div>

            <div>
              <Label htmlFor="requirements">Requirements (comma-separated)</Label>
              <Input
                id="requirements"
                placeholder="e.g., React, Python, Communication"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                data-testid="job-requirements-input"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowPostJob(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handlePostJob} disabled={posting} className="flex-1" data-testid="submit-job-btn">
              {posting ? "Posting..." : "Post Job"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Applicants Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{selectedJob?.title}</DialogTitle>
            <DialogDescription>View and manage applicants</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {applicants.length > 0 ? (
              <div className="space-y-3">
                {applicants.map((app) => (
                  <div key={app.id} className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                        {app.doer?.name?.charAt(0) || "D"}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{app.doer?.name || "Doer"}</p>
                        <p className="text-sm text-slate-500">
                          {app.doer?.division} • Score: {((app.doer?.psy_score || 0) + (app.doer?.skill_score || 0)) / 2}
                        </p>
                      </div>
                      <Badge variant="outline" className="capitalize">{app.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No applications yet</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
