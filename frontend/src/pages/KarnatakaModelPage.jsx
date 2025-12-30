import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Landmark,
  Users,
  TrendingUp,
  Building2,
  MapPin,
  DollarSign,
  GraduationCap,
  Briefcase,
  Target,
  Globe,
  ChevronRight,
  Download,
  Calendar
} from "lucide-react";

const KARNATAKA_STATS = {
  totalPopulation: "6.8 Cr",
  youthPopulation: "2.1 Cr",
  unemployed: "12.4 L",
  skilled: "45%",
  targetPlacement: "5 L",
  budget: "₹9,000 Cr",
  timeline: "2025-2028"
};

const PROGRAM_INITIATIVES = [
  { name: "Skill Schools", investment: "₹1,200 Cr", impact: "500+ centers", status: "Planning" },
  { name: "Tech Talent 2.0", investment: "₹2,500 Cr", impact: "AIML Focus", status: "Active" },
  { name: "TalentON.ai Platform", investment: "₹1,800 Cr", impact: "AI Matching", status: "Building" },
  { name: "ODOP Implementation", investment: "₹1,500 Cr", impact: "31 Districts", status: "Planning" },
  { name: "Circular Economy", investment: "₹1,300 Cr", impact: "Sustainable", status: "Concept" },
  { name: "Career Helper Policy", investment: "₹700 Cr", impact: "Embedded Skill", status: "Active" }
];

const SECTOR_DISTRIBUTION = [
  { sector: "Technology", percentage: 28, jobs: "140K", growth: "+24%" },
  { sector: "Healthcare", percentage: 18, jobs: "90K", growth: "+18%" },
  { sector: "Manufacturing", percentage: 15, jobs: "75K", growth: "+12%" },
  { sector: "Nuclear/Energy", percentage: 8, jobs: "40K", growth: "+35%" },
  { sector: "Finance", percentage: 12, jobs: "60K", growth: "+15%" },
  { sector: "Education", percentage: 10, jobs: "50K", growth: "+10%" },
  { sector: "Others", percentage: 9, jobs: "45K", growth: "+8%" }
];

const DISTRICT_DATA = [
  { name: "Bangalore Urban", enrolled: "2.5L", placed: "1.8L", rate: "72%" },
  { name: "Mysore", enrolled: "85K", placed: "52K", rate: "61%" },
  { name: "Hubli-Dharwad", enrolled: "62K", placed: "35K", rate: "56%" },
  { name: "Mangalore", enrolled: "48K", placed: "31K", rate: "65%" },
  { name: "Belgaum", enrolled: "41K", placed: "22K", rate: "54%" }
];

const PARTNER_CORPORATES = [
  { name: "PowerMech Projects", sector: "Nuclear", commitment: "500 jobs", status: "MOU Signed" },
  { name: "Infosys", sector: "IT", commitment: "2000 jobs", status: "Active" },
  { name: "Wipro", sector: "IT", commitment: "1500 jobs", status: "Active" },
  { name: "Biocon", sector: "Pharma", commitment: "800 jobs", status: "Negotiating" },
  { name: "Toyota Kirloskar", sector: "Manufacturing", commitment: "600 jobs", status: "Active" }
];

export default function KarnatakaModelPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-slate-100 pb-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 via-violet-700 to-indigo-700 text-white p-4 pb-12">
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
              <Landmark className="w-5 h-5" />
              <h1 className="font-display font-bold text-lg">Karnataka Talent Pipeline Program</h1>
            </div>
            <p className="text-white/70 text-sm">KTPPP 2025-2028</p>
          </div>
          <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" /> Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{KARNATAKA_STATS.youthPopulation}</p>
            <p className="text-white/60 text-[10px]">Youth Population</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{KARNATAKA_STATS.unemployed}</p>
            <p className="text-white/60 text-[10px]">Unemployed</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{KARNATAKA_STATS.targetPlacement}</p>
            <p className="text-white/60 text-[10px]">Target Placements</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-amber-400">{KARNATAKA_STATS.budget}</p>
            <p className="text-white/60 text-[10px]">Investment</p>
          </div>
        </div>
      </header>

      {/* Investment Highlight */}
      <div className="px-4 -mt-6 relative z-10 mb-4">
        <Card className="bg-gradient-to-r from-amber-500 to-orange-600 border-0 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Government Investment</p>
                <p className="font-display text-3xl font-bold">₹9,000+ Crores</p>
                <p className="text-white/70 text-xs">Over 4 Years (2025-2028)</p>
              </div>
              <div className="text-right">
                <Badge className="bg-white/20 text-white border-0 mb-2">Viksit Bharat</Badge>
                <p className="text-white/80 text-xs">500,000+ Tech Jobs Target</p>
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
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="districts">Districts</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <h3 className="font-semibold text-slate-900">Sector Distribution</h3>
            {SECTOR_DISTRIBUTION.map((sector) => (
              <Card key={sector.sector}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">{sector.sector}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-sm">{sector.jobs} jobs</span>
                      <Badge className="bg-green-100 text-green-700 border-0">{sector.growth}</Badge>
                    </div>
                  </div>
                  <Progress value={sector.percentage} className="h-2" />
                  <p className="text-slate-400 text-xs mt-1">{sector.percentage}% of pipeline</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Programs Tab */}
          <TabsContent value="programs" className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-900">Key Initiatives</h3>
              <Badge className="bg-purple-100 text-purple-700 border-0">
                {KARNATAKA_STATS.timeline}
              </Badge>
            </div>
            {PROGRAM_INITIATIVES.map((program) => (
              <Card key={program.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900">{program.name}</h4>
                    <Badge className={`border-0 ${
                      program.status === 'Active' ? 'bg-green-100 text-green-700' :
                      program.status === 'Building' ? 'bg-blue-100 text-blue-700' :
                      program.status === 'Planning' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {program.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Investment: <strong className="text-slate-900">{program.investment}</strong></span>
                    <span className="text-slate-500">Impact: <strong className="text-slate-900">{program.impact}</strong></span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Districts Tab */}
          <TabsContent value="districts" className="space-y-3">
            <h3 className="font-semibold text-slate-900 mb-2">District Performance</h3>
            {DISTRICT_DATA.map((district) => (
              <Card key={district.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <h4 className="font-semibold text-slate-900">{district.name}</h4>
                    </div>
                    <Badge className="bg-indigo-100 text-indigo-700 border-0">
                      {district.rate} placement
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Enrolled: <strong>{district.enrolled}</strong></span>
                    <span className="text-green-600">Placed: <strong>{district.placed}</strong></span>
                  </div>
                  <Progress value={parseInt(district.rate)} className="h-2 mt-2" />
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Partners Tab */}
          <TabsContent value="partners" className="space-y-3">
            <h3 className="font-semibold text-slate-900 mb-2">Corporate Partners</h3>
            {PARTNER_CORPORATES.map((partner) => (
              <Card key={partner.name}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{partner.name}</h4>
                      <p className="text-slate-500 text-sm">{partner.sector}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`border-0 ${
                        partner.status === 'MOU Signed' ? 'bg-green-100 text-green-700' :
                        partner.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {partner.status}
                      </Badge>
                      <p className="text-slate-600 text-sm mt-1">{partner.commitment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add Partner CTA */}
            <Card className="bg-indigo-50 border-indigo-200">
              <CardContent className="p-4">
                <Button className="w-full bg-indigo-600">
                  + Add Corporate Partner
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom CTA */}
      <div className="px-4 py-6">
        <Button 
          className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 text-lg"
          onClick={() => navigate("/government")}
        >
          <Globe className="mr-2" /> View Full Impact Dashboard
        </Button>
      </div>
    </div>
  );
}
