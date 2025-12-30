import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Award, 
  Phone, 
  MessageCircle,
  Check,
  X,
  Clock,
  Star
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { API } from "@/App";

export default function ApplicantsPage() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobRes, appsRes] = await Promise.all([
        axios.get(`${API}/jobs/${jobId}`),
        axios.get(`${API}/applications/job/${jobId}`)
      ]);
      setJob(jobRes.data);
      setApplicants(appsRes.data);
    } catch (error) {
      toast.error("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (applicantId, action) => {
    toast.success(`Candidate ${action}!`);
    setApplicants(applicants.map(a => 
      a.id === applicantId ? { ...a, status: action } : a
    ));
  };

  const filteredApplicants = applicants.filter(a => {
    if (tab === "all") return true;
    return a.status === tab;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b p-4 sticky top-0 z-40">
        <div className="flex items-center gap-3 mb-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/employer")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-lg">{job?.title || "Job"}</h1>
            <p className="text-sm text-slate-500">{applicants.length} applicants</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="applied">New</TabsTrigger>
            <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      {/* Content */}
      <div className="p-4 space-y-3">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-14 h-14 bg-slate-200 rounded-xl" />
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))
        ) : filteredApplicants.length > 0 ? (
          filteredApplicants.map((app) => {
            const passScore = Math.round(((app.doer?.psy_score || 0) + (app.doer?.skill_score || 0)) / 2);
            return (
              <div key={app.id} className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {app.doer?.name?.charAt(0) || "D"}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{app.doer?.name || "Candidate"}</h3>
                      {app.status === "shortlisted" && (
                        <Badge className="bg-green-100 text-green-700">Shortlisted</Badge>
                      )}
                      {app.status === "rejected" && (
                        <Badge variant="outline" className="text-slate-400">Rejected</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
                      <span>{app.doer?.division || "General"}</span>
                      <Badge variant="outline" className="text-xs">{app.doer?.level || "L1"}</Badge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {app.doer?.pincode || "---"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Applied recently
                      </span>
                    </div>
                  </div>

                  {/* PASS Score */}
                  <div className="text-center flex-shrink-0">
                    <div className="w-14 h-14 bg-indigo-100 rounded-xl flex flex-col items-center justify-center">
                      <span className="font-bold text-xl text-indigo-600">{passScore}</span>
                      <span className="text-xs text-indigo-400">PASS</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {app.status === "applied" && (
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleAction(app.id, "rejected")}
                    >
                      <X className="w-4 h-4 mr-1" /> Reject
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleAction(app.id, "shortlisted")}
                    >
                      <Check className="w-4 h-4 mr-1" /> Shortlist
                    </Button>
                  </div>
                )}

                {app.status === "shortlisted" && (
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" className="flex-1">
                      <Phone className="w-4 h-4 mr-1" /> Call
                    </Button>
                    <Button className="flex-1 bg-indigo-600">
                      <MessageCircle className="w-4 h-4 mr-1" /> Message
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-900 mb-2">No applicants yet</h3>
            <p className="text-slate-500 text-sm">Share your job posting to get applicants</p>
          </div>
        )}
      </div>
    </div>
  );
}
