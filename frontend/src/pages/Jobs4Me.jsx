import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Search,
  MapPin,
  Briefcase,
  Building2,
  IndianRupee,
  Clock,
  ExternalLink,
  Filter,
  Sparkles,
  Target,
  TrendingUp,
  Star,
  CheckCircle,
  XCircle,
  ChevronRight,
  Zap,
  RefreshCw,
  Globe,
  Users,
  Award,
  Brain
} from "lucide-react";
import { toast } from "sonner";
import { API, useAuth } from "@/App";
import axios from "axios";

// Job Card Component
const JobCard = ({ job, onApply }) => {
  const getMatchColor = (score) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-blue-500 to-cyan-500";
    if (score >= 40) return "from-amber-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getRecommendationBadge = (rec) => {
    const badges = {
      perfect_match: { label: "Perfect Match", color: "bg-green-500/20 text-green-400", icon: Star },
      good_match: { label: "Good Match", color: "bg-blue-500/20 text-blue-400", icon: CheckCircle },
      stretch_role: { label: "Stretch Role", color: "bg-amber-500/20 text-amber-400", icon: TrendingUp },
      develop_first: { label: "Develop First", color: "bg-red-500/20 text-red-400", icon: Target }
    };
    return badges[rec] || badges.good_match;
  };

  const badge = getRecommendationBadge(job.recommendation);
  const BadgeIcon = badge.icon;

  const formatSalary = (min, max, currency = "INR") => {
    if (!min && !max) return "Not disclosed";
    const format = (val) => {
      if (val >= 10000000) return `${(val / 10000000).toFixed(1)}Cr`;
      if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
      if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
      return val;
    };
    if (min && max) return `₹${format(min)} - ₹${format(max)}`;
    if (min) return `₹${format(min)}+`;
    return `Up to ₹${format(max)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      data-testid={`job-card-${job.id}`}
    >
      <Card className="bg-white/5 border-white/10 overflow-hidden">
        {/* Match Score Header */}
        <div className={`bg-gradient-to-r ${getMatchColor(job.match_score)} p-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{job.match_score}%</span>
              </div>
              <div>
                <p className="text-white text-xs opacity-80">Match Score</p>
                <Badge className={`${badge.color} border-0 text-xs mt-0.5`}>
                  <BadgeIcon className="w-3 h-3 mr-1" />
                  {badge.label}
                </Badge>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-0 text-xs">
              {job.source}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Job Title & Company */}
          <div className="flex items-start gap-3 mb-3">
            {job.company_logo ? (
              <img src={job.company_logo} alt={job.company_name} className="w-12 h-12 rounded-lg object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-400" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg line-clamp-1">{job.title}</h3>
              <p className="text-white/60 text-sm">{job.company_name}</p>
            </div>
          </div>

          {/* Job Details */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className="bg-white/10 text-white/80 border-0 text-xs">
              <MapPin className="w-3 h-3 mr-1" />
              {job.location}
            </Badge>
            <Badge className="bg-white/10 text-white/80 border-0 text-xs">
              <Briefcase className="w-3 h-3 mr-1" />
              {job.job_type}
            </Badge>
            {job.is_remote && (
              <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                <Globe className="w-3 h-3 mr-1" />
                Remote
              </Badge>
            )}
            <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
              <IndianRupee className="w-3 h-3 mr-1" />
              {formatSalary(job.salary_min, job.salary_max)}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-white/60 text-sm line-clamp-2 mb-3">{job.description}</p>

          {/* Skills */}
          {job.required_skills?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {job.required_skills.slice(0, 4).map((skill, idx) => (
                <Badge key={idx} className="bg-purple-500/20 text-purple-300 border-0 text-xs">
                  {skill}
                </Badge>
              ))}
              {job.required_skills.length > 4 && (
                <Badge className="bg-white/10 text-white/60 border-0 text-xs">
                  +{job.required_skills.length - 4}
                </Badge>
              )}
            </div>
          )}

          {/* Match Reasons */}
          {job.match_reasons?.length > 0 && (
            <div className="bg-white/5 rounded-lg p-3 mb-3">
              <p className="text-white/60 text-xs mb-2">Why this matches you:</p>
              <div className="space-y-1">
                {job.match_reasons.slice(0, 3).map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80 text-xs">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improvement Suggestions */}
          {job.improvement_suggestions?.length > 0 && job.recommendation !== "perfect_match" && (
            <div className="bg-amber-500/10 rounded-lg p-3 mb-3">
              <p className="text-amber-400 text-xs mb-2">To improve your chances:</p>
              {job.improvement_suggestions.slice(0, 2).map((suggestion, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Sparkles className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/70 text-xs">{suggestion}</span>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
              onClick={() => window.open(job.apply_url, "_blank")}
              data-testid={`apply-btn-${job.id}`}
            >
              Apply Now
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white"
              data-testid={`save-btn-${job.id}`}
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Filter Modal
const FilterSection = ({ filters, setFilters, onApply }) => (
  <Card className="bg-white/5 border-white/10 mb-4">
    <CardContent className="p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-white/60 text-xs block mb-2">Job Type</label>
          <select
            className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white text-sm"
            value={filters.jobType}
            onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        <div>
          <label className="text-white/60 text-xs block mb-2">Remote Only</label>
          <select
            className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white text-sm"
            value={filters.remoteOnly}
            onChange={(e) => setFilters({ ...filters, remoteOnly: e.target.value === "true" })}
          >
            <option value="false">All Jobs</option>
            <option value="true">Remote Only</option>
          </select>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function Jobs4Me() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("India");
  const [jobs, setJobs] = useState([]);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    jobType: "",
    remoteOnly: false
  });
  const [summary, setSummary] = useState(null);
  const [profileData, setProfileData] = useState(null);

  // Load user profile for matching
  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const userId = user?.id || localStorage.getItem("rdw_user_id") || "demo-user";
      const response = await axios.get(`${API}/profiles/user/${userId}`);
      
      // Transform to matcher input format
      setProfileData({
        doers_score: response.data.doers_score || 650,
        efficiency_value: response.data.efficiency_value || 70,
        adaptive_level: response.data.adaptive_level || "ASSOCIATE",
        career_interests: {
          "Artistic": 60,
          "Enterprising": 55,
          "Social": 50,
          "Investigative": 45,
          "Realistic": 40,
          "Conventional": 35
        },
        skills: response.data.skills?.map(s => s.name) || ["Problem Solving", "Communication"],
        preferred_location: "India",
        open_to_remote: true
      });
    } catch (error) {
      console.log("Using default profile for matching");
      setProfileData({
        doers_score: 650,
        efficiency_value: 70,
        adaptive_level: "ASSOCIATE",
        career_interests: {
          "Artistic": 60,
          "Enterprising": 55,
          "Social": 50
        },
        skills: ["Problem Solving", "Communication"],
        preferred_location: "India",
        open_to_remote: true
      });
    }
  };

  const searchJobs = useCallback(async (query = searchQuery) => {
    if (!profileData) {
      toast.error("Profile not loaded yet");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/jobs/match`, {
        ...profileData,
        query: query || "jobs",
        preferred_location: location
      });

      setMatchedJobs(response.data.matched_jobs || []);
      setSummary(response.data.summary);
      
      if (response.data.matched_jobs?.length > 0) {
        toast.success(`Found ${response.data.matched_jobs.length} matched jobs!`);
      } else {
        toast.info("No jobs found. Try a different search.");
      }
    } catch (error) {
      console.error("Job search error:", error);
      toast.error("Failed to search jobs");
      
      // Fallback to simple search
      try {
        const fallbackResponse = await axios.get(`${API}/jobs/aggregated`, {
          params: { query: query || "jobs", location }
        });
        setMatchedJobs(fallbackResponse.data.jobs || []);
      } catch (e) {
        console.error("Fallback search failed:", e);
      }
    } finally {
      setIsLoading(false);
    }
  }, [profileData, location, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    searchJobs(searchQuery);
  };

  // Initial search on load
  useEffect(() => {
    if (profileData) {
      searchJobs("");
    }
  }, [profileData]);

  // Apply filters
  const filteredJobs = matchedJobs.filter(job => {
    if (filters.jobType && job.job_type !== filters.jobType) return false;
    if (filters.remoteOnly && !job.is_remote) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => navigate(-1)}
            data-testid="j4m-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-white font-bold flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              Jobs4Me
            </h1>
            <Badge className="bg-purple-500/20 text-purple-400 border-0 text-[10px] mt-1">
              AI-Powered Matching
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => setShowFilters(!showFilters)}
            data-testid="j4m-filter-btn"
          >
            <Filter className={`w-5 h-5 ${showFilters ? "text-purple-400" : ""}`} />
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4 pb-24">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input
              type="text"
              placeholder="Search jobs (e.g., Fashion Designer, Software Developer)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
              data-testid="j4m-search-input"
            />
          </div>
          <Button type="submit" className="bg-purple-500" disabled={isLoading} data-testid="j4m-search-btn">
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </form>

        {/* Location */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-white/40" />
          <Input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 w-40"
            data-testid="j4m-location-input"
          />
          <div className="flex-1" />
          <Badge className="bg-white/10 text-white/60 border-0 text-xs">
            Sources: LinkedIn, Indeed, Naukri, Mercor
          </Badge>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <FilterSection filters={filters} setFilters={setFilters} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Summary */}
        {profileData && (
          <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-xs">Your DoersScore™</p>
                    <p className="text-white text-xl font-bold">{profileData.doers_score}/900</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs">Level</p>
                  <Badge className="bg-purple-500/30 text-purple-300 border-0">
                    {profileData.adaptive_level}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        {summary && (
          <div className="grid grid-cols-4 gap-2">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-white">{summary.total_jobs}</p>
                <p className="text-white/60 text-xs">Jobs Found</p>
              </CardContent>
            </Card>
            <Card className="bg-green-500/10 border-green-500/30">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-green-400">{summary.perfect_matches}</p>
                <p className="text-white/60 text-xs">Perfect</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-500/10 border-blue-500/30">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-blue-400">{summary.good_matches}</p>
                <p className="text-white/60 text-xs">Good</p>
              </CardContent>
            </Card>
            <Card className="bg-amber-500/10 border-amber-500/30">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-amber-400">{summary.avg_match_score}%</p>
                <p className="text-white/60 text-xs">Avg Match</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <p className="text-white font-medium">AI is matching jobs to your profile...</p>
            <p className="text-white/60 text-sm">Searching LinkedIn, Indeed, Naukri, Mercor</p>
          </div>
        )}

        {/* Job List */}
        {!isLoading && (
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-8 text-center">
                  <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60">No jobs found</p>
                  <p className="text-white/40 text-sm mt-1">Try a different search query or location</p>
                  <Button
                    className="mt-4"
                    onClick={() => searchJobs("")}
                    data-testid="j4m-reload-btn"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Load All Jobs
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            )}
          </div>
        )}

        {/* Quick Actions */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <h4 className="text-white font-medium mb-3">Quick Searches</h4>
            <div className="flex flex-wrap gap-2">
              {["Fashion Designer", "Software Developer", "Data Analyst", "Marketing", "Remote Jobs", "Entry Level"].map((q) => (
                <Button
                  key={q}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white/80 hover:bg-white/10"
                  onClick={() => {
                    setSearchQuery(q);
                    searchJobs(q);
                  }}
                  data-testid={`quick-search-${q.toLowerCase().replace(" ", "-")}`}
                >
                  {q}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Anushree Demo Link */}
        <Card className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl">
                👩‍🎨
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">See Anushree's Job Matches</h4>
                <p className="text-white/60 text-sm">View jobs matched to our featured success story</p>
              </div>
              <Button
                variant="outline"
                className="border-amber-500/30 text-amber-400"
                onClick={() => navigate("/proven-profiles")}
                data-testid="j4m-anushree-btn"
              >
                View
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
