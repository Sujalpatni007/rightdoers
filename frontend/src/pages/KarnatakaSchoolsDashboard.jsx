import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  School,
  Users,
  TrendingUp,
  Target,
  Brain,
  Heart,
  BookOpen,
  Award,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Download,
  BarChart3
} from "lucide-react";

const DASHBOARD_STATS = {
  totalStudents: "2,45,678",
  pmPoshanCoverage: "98.2%",
  healthyBMI: "82.7%",
  learningReadiness: "76.4%",
  schools: 50,
  districts: 10,
  talentPipelineMatch: "89.3%"
};

const OUTCOME_METRICS = [
  { name: "Career Awareness", target: 70, achieved: 78, status: "exceeded" },
  { name: "Educational Pathway Clarity", target: 85, achieved: 91, status: "exceeded" },
  { name: "Self-Efficacy Development", target: 50, achieved: 62, status: "exceeded" },
  { name: "Academic Performance", target: 15, achieved: 12, status: "in_progress" },
  { name: "Parent-Student Alignment", target: 80, achieved: 87, status: "exceeded" },
  { name: "Program Scalability", target: 100, achieved: 100, status: "complete" }
];

const KPI_SCORES = [
  { name: "Career Clarity Index", current: 7.8, baseline: 4.1, target: 7.0, improvement: "+90%" },
  { name: "Goal Setting Proficiency", current: 8.1, baseline: 3.9, target: 7.5, improvement: "+108%" },
  { name: "Skills Readiness Score", current: 74, baseline: 56, target: 70, improvement: "+32%", isPercentage: true },
  { name: "Student Satisfaction Rate", current: 94, baseline: 0, target: 85, improvement: "NPS +78", isPercentage: true }
];

const SCHOOL_DATA = [
  { name: "KPS Marenahalli", level: "Primary (1-5)", students: 342, district: "Bangalore Rural", preAvg: 48, postAvg: 71, improvement: 48, nutrition: 76, bmi: 20.1, cognitive: 90 },
  { name: "KPS Doddaballapur", level: "Secondary (6-12)", students: 856, district: "Doddaballapur", preAvg: 52, postAvg: 78, improvement: 50, nutrition: 90, bmi: 20.3, cognitive: 84 },
  { name: "Govt First Grade College, Devanahalli", level: "Undergraduate", students: 649, district: "Devanahalli", preAvg: 58, postAvg: 89, improvement: 53, nutrition: 80, bmi: 17.5, cognitive: 92 },
  { name: "Govt High School 1", level: "Secondary", students: 497, district: "Bengaluru Urban", preAvg: 45, postAvg: 73, improvement: 62, nutrition: 76, bmi: 20.1, cognitive: 90 },
  { name: "Karnataka Public School 2", level: "Secondary", students: 497, district: "Bengaluru Urban", preAvg: 50, postAvg: 91, improvement: 82, nutrition: 90, bmi: 20.3, cognitive: 84 }
];

const DISTRICT_READINESS = [
  { name: "Bengaluru", readiness: 92, color: "bg-green-500" },
  { name: "Mysuru", readiness: 88, color: "bg-green-500" },
  { name: "Hubli", readiness: 85, color: "bg-blue-500" },
  { name: "Tumakuru", readiness: 81, color: "bg-blue-500" },
  { name: "Mangaluru", readiness: 79, color: "bg-blue-500" },
  { name: "Belagavi", readiness: 77, color: "bg-amber-500" },
  { name: "Davangere", readiness: 74, color: "bg-amber-500" },
  { name: "Ballari", readiness: 71, color: "bg-amber-500" },
  { name: "Vijayapura", readiness: 69, color: "bg-red-500" },
  { name: "Kalaburagi", readiness: 68, color: "bg-red-500" }
];

const TALENT_CLUBS = [
  { name: "Science Club", icon: "🔬", students: 12500, growth: "+24%" },
  { name: "Technology Club", icon: "💻", students: 18200, growth: "+35%" },
  { name: "Arts Club", icon: "🎨", students: 8900, growth: "+18%" },
  { name: "Sports Club", icon: "⚽", students: 15600, growth: "+22%" },
  { name: "Finance Club", icon: "💰", students: 6200, growth: "+28%" },
  { name: "Health Club", icon: "🏥", students: 9400, growth: "+20%" }
];

export default function KarnatakaSchoolsDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-slate-100 pb-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-4 pb-12">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <School className="w-5 h-5" />
              <h1 className="font-display font-bold text-lg">Karnataka Public Schools</h1>
            </div>
            <p className="text-white/70 text-sm">Future Readiness Dashboard • AY 2024-25</p>
          </div>
          <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{DASHBOARD_STATS.totalStudents}</p>
            <p className="text-white/60 text-[10px]">Students Enrolled</p>
            <Badge className="mt-1 bg-green-400/20 text-green-200 border-0 text-[10px]">↑12.3%</Badge>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{DASHBOARD_STATS.pmPoshanCoverage}</p>
            <p className="text-white/60 text-[10px]">PM Poshan</p>
            <Badge className="mt-1 bg-green-400/20 text-green-200 border-0 text-[10px]">↑4.5%</Badge>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{DASHBOARD_STATS.healthyBMI}</p>
            <p className="text-white/60 text-[10px]">Healthy BMI</p>
            <Badge className="mt-1 bg-green-400/20 text-green-200 border-0 text-[10px]">↑7.8%</Badge>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{DASHBOARD_STATS.learningReadiness}</p>
            <p className="text-white/60 text-[10px]">Learning Ready</p>
            <Badge className="mt-1 bg-green-400/20 text-green-200 border-0 text-[10px]">↑9.2%</Badge>
          </div>
        </div>
      </header>

      {/* Talent Pipeline Match */}
      <div className="px-4 -mt-6 relative z-10 mb-4">
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 border-0 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="w-10 h-10" />
                <div>
                  <p className="text-white/80 text-sm">TalentON.AI Pipeline Match</p>
                  <p className="font-display text-2xl font-bold">{DASHBOARD_STATS.talentPipelineMatch}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-white/20 text-white border-0">↑11.4% accuracy</Badge>
                <p className="text-white/60 text-xs mt-1">{DASHBOARD_STATS.schools} Schools • {DASHBOARD_STATS.districts} Districts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="clubs">Clubs</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <h3 className="font-semibold text-slate-900">Key Performance Indicators</h3>
            {KPI_SCORES.map((kpi) => (
              <Card key={kpi.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">{kpi.name}</span>
                    <Badge className="bg-green-100 text-green-700 border-0">
                      {kpi.improvement}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Baseline: {kpi.baseline}{kpi.isPercentage ? '%' : '/10'}</span>
                        <span>Target: {kpi.target}{kpi.isPercentage ? '%' : ''}</span>
                      </div>
                      <Progress value={(kpi.current / (kpi.isPercentage ? 100 : 10)) * 100} className="h-2" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">
                        {kpi.current}{kpi.isPercentage ? '%' : '/10'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* District Heatmap */}
            <h3 className="font-semibold text-slate-900 mt-6">District Learning Readiness</h3>
            <div className="grid grid-cols-2 gap-2">
              {DISTRICT_READINESS.map((district) => (
                <Card key={district.name} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium">{district.name}</span>
                      </div>
                      <Badge className={`${district.color} text-white border-0`}>
                        {district.readiness}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Outcomes Tab */}
          <TabsContent value="outcomes" className="space-y-4">
            <h3 className="font-semibold text-slate-900">ADB Outcome Metrics</h3>
            <p className="text-slate-500 text-sm">Performance against ADB development targets</p>
            
            {OUTCOME_METRICS.map((outcome) => (
              <Card key={outcome.name} className={`${
                outcome.status === 'exceeded' ? 'border-green-200' :
                outcome.status === 'complete' ? 'border-blue-200' :
                'border-amber-200'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {outcome.status === 'exceeded' || outcome.status === 'complete' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      )}
                      <span className="font-medium text-slate-900">{outcome.name}</span>
                    </div>
                    <Badge className={`border-0 ${
                      outcome.status === 'exceeded' ? 'bg-green-100 text-green-700' :
                      outcome.status === 'complete' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {outcome.status === 'exceeded' ? 'Target Exceeded' :
                       outcome.status === 'complete' ? 'Complete' : 'In Progress'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Progress value={(outcome.achieved / outcome.target) * 100} className="h-2" />
                      <div className="flex justify-between mt-1 text-xs text-slate-500">
                        <span>Target: {outcome.target}%</span>
                        <span>Achieved: {outcome.achieved}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Schools Tab */}
          <TabsContent value="schools" className="space-y-3">
            <h3 className="font-semibold text-slate-900">School Performance Matrix</h3>
            {SCHOOL_DATA.map((school) => (
              <Card key={school.name}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">{school.name}</h4>
                      <p className="text-slate-500 text-xs">{school.district} • {school.level}</p>
                    </div>
                    <Badge className="bg-indigo-100 text-indigo-700 border-0">
                      {school.students} students
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-lg font-bold text-green-600">+{school.improvement}%</p>
                      <p className="text-[10px] text-slate-500">Improvement</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-lg font-bold text-blue-600">{school.nutrition}%</p>
                      <p className="text-[10px] text-slate-500">Nutrition</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-lg font-bold text-purple-600">{school.cognitive}%</p>
                      <p className="text-[10px] text-slate-500">Cognitive</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-lg font-bold text-slate-600">{school.bmi}</p>
                      <p className="text-[10px] text-slate-500">Avg BMI</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Pre: {school.preAvg}%</span>
                      <span>Post: {school.postAvg}%</span>
                    </div>
                    <Progress value={school.postAvg} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Talent Clubs Tab */}
          <TabsContent value="clubs" className="space-y-4">
            <h3 className="font-semibold text-slate-900">Talent Clubs Participation</h3>
            <p className="text-slate-500 text-sm">Students enrolled in specialized interest clubs</p>
            
            <div className="grid grid-cols-2 gap-3">
              {TALENT_CLUBS.map((club) => (
                <Card key={club.name} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <span className="text-4xl block mb-2">{club.icon}</span>
                    <h4 className="font-semibold text-slate-900">{club.name}</h4>
                    <p className="text-2xl font-bold text-indigo-600 my-2">
                      {club.students.toLocaleString()}
                    </p>
                    <Badge className="bg-green-100 text-green-700 border-0">
                      {club.growth} YoY
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Total Enrolled */}
            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80">Total Club Enrollments</p>
                    <p className="text-3xl font-bold">
                      {TALENT_CLUBS.reduce((sum, c) => sum + c.students, 0).toLocaleString()}
                    </p>
                  </div>
                  <Award className="w-12 h-12 text-white/50" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Integration Banner */}
      <div className="px-4 py-6">
        <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-6 h-6 text-pink-500" />
              <h4 className="font-semibold text-slate-900">Right Doers LLP × PM Poshan × Talent Development</h4>
            </div>
            <p className="text-slate-600 text-sm">
              Integrated Education & Nutrition program ensuring holistic student development through the Education Commissioner Portal.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
