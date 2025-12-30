import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  ArrowRight, 
  GraduationCap, 
  DollarSign, 
  TrendingUp, 
  Building2, 
  Star, 
  Briefcase,
  Users,
  Target,
  Zap,
  BookOpen,
  Award,
  Globe,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/App";

const NUCLEAR_ENGINEER_DATA = {
  id: "nuclear_engineer",
  title: "Nuclear Engineer",
  icon: "☢️",
  color: "from-amber-500 to-orange-600",
  tagline: "Power the Future of India",
  
  overview: `Nuclear Engineers design, develop, and operate nuclear power plants and systems. With India's ambitious target of 100GW nuclear capacity by 2047 (up from 8.8GW today), this field offers unprecedented opportunities.

You'll work on reactor design, safety systems, radiation protection, and sustainable energy solutions. This is not just a career - it's a chance to shape India's energy independence.`,

  whyNow: {
    title: "India's Nuclear Mission 2047",
    points: [
      "Target: 100GW nuclear capacity (12x growth)",
      "Investment: ₹20,000 Cr Nuclear Energy Mission",
      "SHANTI Bill 2025: Private sector now allowed",
      "50,000+ new jobs expected by 2035"
    ]
  },

  education: {
    path: [
      { level: "10+2", duration: "2 years", focus: "Physics, Chemistry, Mathematics", status: "foundation" },
      { level: "B.Tech", duration: "4 years", focus: "Nuclear Engineering / Mechanical / Electrical", status: "core" },
      { level: "M.Tech", duration: "2 years", focus: "Nuclear Engineering / Reactor Physics", status: "specialization" },
      { level: "Ph.D", duration: "3-5 years", focus: "Research in Fusion / Advanced Reactors", status: "optional" }
    ],
    topInstitutes: [
      "IIT Kanpur", "IIT Madras", "BARC Training School", 
      "IGCAR", "NPCIL Academy", "Homi Bhabha National Institute"
    ],
    entranceExams: ["JEE Advanced", "GATE", "BARC OCES/DGFS"]
  },

  salary: {
    entry: { level: "L1-L2", range: "₹60,000 - ₹85,000/mo", title: "Junior Engineer" },
    mid: { level: "L3", range: "₹1,00,000 - ₹1,50,000/mo", title: "Senior Engineer" },
    senior: { level: "L4", range: "₹2,00,000 - ₹5,00,000/mo", title: "Lead/Manager" },
    expert: { level: "L5", range: "₹5,00,000+/mo", title: "Director/Chief Scientist" }
  },

  employers: [
    { name: "PowerMech Projects", type: "Private", logo: "🏭", hiring: true, jobs: 127 },
    { name: "NPCIL", type: "Government", logo: "🏢", hiring: true, jobs: 450 },
    { name: "BARC", type: "Government", logo: "⚛️", hiring: true, jobs: 280 },
    { name: "L&T", type: "Private", logo: "🛠️", hiring: true, jobs: 95 },
    { name: "BHAVINI", type: "Government", logo: "⚡", hiring: true, jobs: 60 },
    { name: "Tata Power", type: "Private", logo: "💡", hiring: false, jobs: 0 }
  ],

  skills: {
    technical: [
      "Nuclear Physics & Reactor Theory",
      "Thermodynamics & Heat Transfer",
      "Radiation Safety & Protection",
      "MCNP / RELAP Simulation",
      "Control Systems",
      "Materials Science"
    ],
    software: ["MCNP", "MATLAB", "Python", "ANSYS", "AutoCAD", "OpenMC"],
    soft: ["Problem Solving", "Attention to Detail", "Team Collaboration", "Communication"]
  },

  certifications: [
    "Radiation Safety Officer (RSO)",
    "Nuclear Reactor Design (IAEA)",
    "Advanced Thermohydraulics",
    "Nuclear Fuel Cycle Management"
  ],

  demandStats: {
    currentOpenings: 2847,
    avgSalary: "₹1.2L/mo",
    growthRate: "24%",
    competitionRatio: "1:8"
  }
};

export default function CareerDetailPage() {
  const navigate = useNavigate();
  const { careerId } = useParams();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const career = NUCLEAR_ENGINEER_DATA; // For demo, always show nuclear engineer

  const handleSelectCareer = () => {
    updateUser({ selectedCareer: career.id });
    toast.success(`${career.title} added to your path!`);
    navigate("/curriculum");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Hero Header */}
      <header className={`bg-gradient-to-br ${career.color} text-white p-4 pb-8`}>
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
            data-testid="career-detail-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1" />
          <Badge className="bg-white/20 text-white border-0">
            🔥 High Demand
          </Badge>
        </div>

        <div className="text-center">
          <span className="text-6xl mb-4 block">{career.icon}</span>
          <h1 className="font-display text-3xl font-bold mb-2">{career.title}</h1>
          <p className="text-white/80">{career.tagline}</p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-2xl font-bold">{career.demandStats.currentOpenings}</p>
              <p className="text-white/60 text-xs">Open Jobs</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-2xl font-bold">{career.demandStats.avgSalary}</p>
              <p className="text-white/60 text-xs">Avg Salary</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-2xl font-bold">{career.demandStats.growthRate}</p>
              <p className="text-white/60 text-xs">Growth Rate</p>
            </div>
          </div>
        </div>
      </header>

      {/* PowerMech Partnership Banner */}
      <div className="px-4 -mt-4 relative z-10 mb-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏭</span>
            </div>
            <div className="flex-1 text-white">
              <p className="font-semibold">PowerMech Projects</p>
              <p className="text-white/70 text-sm">Hiring 127 Nuclear Engineers for upcoming projects</p>
            </div>
            <Badge className="bg-green-500 text-white border-0">HIRING</Badge>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["overview", "education", "salary", "employers", "skills"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? "bg-white text-slate-900" 
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-32">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-5">
                <h3 className="font-semibold text-white mb-3">About This Career</h3>
                <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
                  {career.overview}
                </p>
              </CardContent>
            </Card>

            {/* Why Now */}
            <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30">
              <CardContent className="p-5">
                <h3 className="font-semibold text-amber-400 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5" /> {career.whyNow.title}
                </h3>
                <ul className="space-y-2">
                  {career.whyNow.points.map((point, i) => (
                    <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "education" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Education Pathway</h3>
            <div className="space-y-3">
              {career.education.path.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.status === 'foundation' ? 'bg-green-500' :
                      step.status === 'core' ? 'bg-blue-500' :
                      step.status === 'specialization' ? 'bg-purple-500' : 'bg-slate-500'
                    }`}>
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    {i < career.education.path.length - 1 && (
                      <div className="w-0.5 h-full bg-white/20 my-1" />
                    )}
                  </div>
                  <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">{step.level}</h4>
                      <Badge variant="outline" className="text-white/60 border-white/20">
                        {step.duration}
                      </Badge>
                    </div>
                    <p className="text-white/60 text-sm">{step.focus}</p>
                  </div>
                </div>
              ))}
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <h4 className="font-semibold text-white mb-3">Top Institutes</h4>
                <div className="flex flex-wrap gap-2">
                  {career.education.topInstitutes.map((inst) => (
                    <Badge key={inst} variant="outline" className="text-white/70 border-white/20">
                      {inst}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <h4 className="font-semibold text-white mb-3">Entrance Exams</h4>
                <div className="flex flex-wrap gap-2">
                  {career.education.entranceExams.map((exam) => (
                    <Badge key={exam} className="bg-indigo-500/20 text-indigo-300 border-0">
                      {exam}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "salary" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Salary Progression</h3>
            {Object.entries(career.salary).map(([key, data]) => (
              <div key={key} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-semibold text-white">{data.title}</p>
                    <Badge className="mt-1 bg-white/10 text-white/60 border-0">{data.level}</Badge>
                  </div>
                  <p className="text-xl font-bold text-green-400">{data.range}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "employers" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Top Employers</h3>
            {career.employers.map((emp) => (
              <div key={emp.name} className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-4">
                <span className="text-3xl">{emp.logo}</span>
                <div className="flex-1">
                  <p className="font-semibold text-white">{emp.name}</p>
                  <p className="text-white/50 text-sm">{emp.type}</p>
                </div>
                {emp.hiring ? (
                  <div className="text-right">
                    <Badge className="bg-green-500 text-white border-0">HIRING</Badge>
                    <p className="text-green-400 text-sm mt-1">{emp.jobs} jobs</p>
                  </div>
                ) : (
                  <Badge variant="outline" className="text-white/40 border-white/20">Coming Soon</Badge>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "skills" && (
          <div className="space-y-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <h4 className="font-semibold text-white mb-3">Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {career.skills.technical.map((skill) => (
                    <Badge key={skill} className="bg-blue-500/20 text-blue-300 border-0">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <h4 className="font-semibold text-white mb-3">Software & Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {career.skills.software.map((tool) => (
                    <Badge key={tool} className="bg-purple-500/20 text-purple-300 border-0">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <h4 className="font-semibold text-white mb-3">Certifications</h4>
                <div className="space-y-2">
                  {career.certifications.map((cert) => (
                    <div key={cert} className="flex items-center gap-2 text-white/70 text-sm">
                      <Award className="w-4 h-4 text-amber-400" />
                      {cert}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
        <Button 
          className={`w-full h-14 text-lg font-semibold bg-gradient-to-r ${career.color} hover:opacity-90`}
          onClick={handleSelectCareer}
          data-testid="select-career-btn"
        >
          Select Nuclear Engineer <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
