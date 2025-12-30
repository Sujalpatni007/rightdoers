import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { 
  Search, 
  Filter, 
  MapPin, 
  Building2, 
  Clock, 
  ChevronRight,
  Briefcase,
  ArrowLeft,
  Check,
  X
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth, API } from "@/App";
import { BottomNav } from "./DoerDashboard";

const LEVEL_INFO = {
  L1: { label: "Entry Level", salary: "₹15K-30K", color: "bg-green-500" },
  L2: { label: "Junior", salary: "₹30K-60K", color: "bg-blue-500" },
  L3: { label: "Mid-Level", salary: "₹60K-1.5L", color: "bg-purple-500" },
  L4: { label: "Expert", salary: "₹1.5L-15L+", color: "bg-amber-500" },
};

const DIVISIONS = [
  "All", "Technology", "Health", "Education", "Finance & Banking", 
  "Security", "Legal", "Transport & Logistics", "Food & Agriculture",
  "Art", "Sport", "Science", "Policy"
];

export default function JobsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [division, setDivision] = useState("All");
  const [level, setLevel] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [division, level]);

  useEffect(() => {
    const selected = searchParams.get("selected");
    if (selected && jobs.length > 0) {
      const job = jobs.find(j => j.id === selected);
      if (job) setSelectedJob(job);
    }
  }, [searchParams, jobs]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (division !== "All") params.division = division;
      if (level !== "All") params.level = level;
      if (search) params.search = search;
      
      const res = await axios.get(`${API}/jobs`, { params });
      setJobs(res.data);
    } catch (error) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchJobs();
  };

  const handleApply = async () => {
    if (!selectedJob || !user?.id) return;
    
    setApplying(true);
    try {
      await axios.post(`${API}/applications?job_id=${selectedJob.id}&doer_id=${user.id}`);
      toast.success("Application submitted successfully! 🎉");
      setSelectedJob(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-nav">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="p-4 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/dashboard")}
            data-testid="jobs-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 h-11"
              data-testid="jobs-search-input"
            />
          </div>
          <Button size="icon" variant="outline" onClick={handleSearch} data-testid="jobs-search-btn">
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* Filters */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
          <Select value={division} onValueChange={setDivision}>
            <SelectTrigger className="w-36 h-9" data-testid="division-filter">
              <SelectValue placeholder="Division" />
            </SelectTrigger>
            <SelectContent>
              {DIVISIONS.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="w-28 h-9" data-testid="level-filter">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Levels</SelectItem>
              <SelectItem value="L1">L1 - Entry</SelectItem>
              <SelectItem value="L2">L2 - Junior</SelectItem>
              <SelectItem value="L3">L3 - Mid</SelectItem>
              <SelectItem value="L4">L4 - Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Jobs List */}
      <div className="p-4 space-y-3">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border animate-pulse">
              <div className="h-5 bg-slate-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-slate-200 rounded w-1/3" />
            </div>
          ))
        ) : jobs.length > 0 ? (
          jobs.map((job) => {
            const levelInfo = LEVEL_INFO[job.level] || LEVEL_INFO.L1;
            return (
              <button
                key={job.id}
                className="w-full text-left card-job"
                onClick={() => setSelectedJob(job)}
                data-testid={`job-item-${job.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900">{job.title}</h3>
                    <p className="text-sm text-slate-500">{job.company_name}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge className={`${levelInfo.color} text-white text-xs`}>{job.level}</Badge>
                      <span className="text-xs text-primary font-medium">
                        ₹{(job.salary_min / 1000).toFixed(0)}K - ₹{job.salary_max >= 100000 ? `${(job.salary_max / 100000).toFixed(1)}L` : `${(job.salary_max / 1000).toFixed(0)}K`}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job.pincode}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-900 mb-2">No jobs found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Job Detail Sheet */}
      <Sheet open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
          {selectedJob && (
            <>
              <SheetHeader className="text-left pb-4 border-b">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <SheetTitle className="font-display text-xl">{selectedJob.title}</SheetTitle>
                    <SheetDescription className="text-base">{selectedJob.company_name}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="py-4 space-y-6 overflow-y-auto max-h-[calc(85vh-200px)]">
                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500 mb-1">Salary</p>
                    <p className="font-semibold text-primary">
                      ₹{(selectedJob.salary_min / 1000).toFixed(0)}K - ₹{selectedJob.salary_max >= 100000 ? `${(selectedJob.salary_max / 100000).toFixed(1)}L` : `${(selectedJob.salary_max / 1000).toFixed(0)}K`}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500 mb-1">Level</p>
                    <Badge className={`${LEVEL_INFO[selectedJob.level]?.color} text-white`}>
                      {selectedJob.level} - {LEVEL_INFO[selectedJob.level]?.label}
                    </Badge>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500 mb-1">Location</p>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {selectedJob.pincode}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500 mb-1">Division</p>
                    <p className="font-medium">{selectedJob.division}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                  <p className="text-slate-600">{selectedJob.description}</p>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Requirements</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.requirements?.map((req, i) => (
                      <Badge key={i} variant="outline">{req}</Badge>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Posted recently
                  </span>
                  <span>{selectedJob.applications_count || 0} applications</span>
                </div>
              </div>

              {/* Apply Button */}
              <div className="pt-4 border-t">
                <Button 
                  className="w-full btn-primary"
                  onClick={handleApply}
                  disabled={applying}
                  data-testid="apply-job-btn"
                >
                  {applying ? "Applying..." : "Apply Now"}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <BottomNav active="jobs" />
    </div>
  );
}
