import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Users, Briefcase, TrendingUp, MapPin, Target } from "lucide-react";

const DISTRICT_DATA = {
  visakhapatnam: { name: "Visakhapatnam", doers: 28500, jobs: 1200, placements: 950, pincodes: 52 },
  east_godavari: { name: "East Godavari", doers: 22100, jobs: 890, placements: 720, pincodes: 48 },
  krishna: { name: "Krishna", doers: 21500, jobs: 850, placements: 690, pincodes: 45 },
  guntur: { name: "Guntur", doers: 19800, jobs: 720, placements: 580, pincodes: 42 },
  chittoor: { name: "Chittoor", doers: 18200, jobs: 680, placements: 510, pincodes: 38 },
  west_godavari: { name: "West Godavari", doers: 17200, jobs: 620, placements: 480, pincodes: 35 },
  nellore: { name: "Nellore", doers: 16800, jobs: 610, placements: 470, pincodes: 32 },
  kurnool: { name: "Kurnool", doers: 14200, jobs: 520, placements: 380, pincodes: 30 },
  kadapa: { name: "Kadapa", doers: 13100, jobs: 440, placements: 340, pincodes: 28 },
  anantapur: { name: "Anantapur", doers: 12500, jobs: 450, placements: 320, pincodes: 26 },
  prakasam: { name: "Prakasam", doers: 11200, jobs: 380, placements: 280, pincodes: 24 },
  vizianagaram: { name: "Vizianagaram", doers: 10500, jobs: 350, placements: 260, pincodes: 22 },
  srikakulam: { name: "Srikakulam", doers: 9800, jobs: 320, placements: 240, pincodes: 20 },
};

export default function DistrictDashboard() {
  const navigate = useNavigate();
  const { districtId } = useParams();
  
  const district = DISTRICT_DATA[districtId] || DISTRICT_DATA.visakhapatnam;
  const placementRate = Math.round((district.placements / district.doers) * 100);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate("/government")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-xl font-bold">{district.name}</h1>
            <p className="text-white/70 text-sm flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {district.pincodes} Pincodes
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <Users className="w-5 h-5 mx-auto mb-1" />
            <p className="font-bold text-xl">{(district.doers / 1000).toFixed(1)}K</p>
            <p className="text-white/70 text-xs">Doers</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <Briefcase className="w-5 h-5 mx-auto mb-1" />
            <p className="font-bold text-xl">{district.jobs}</p>
            <p className="text-white/70 text-xs">Jobs</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <Target className="w-5 h-5 mx-auto mb-1" />
            <p className="font-bold text-xl">{district.placements}</p>
            <p className="text-white/70 text-xs">Placed</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Placement Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Placement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-2">
              <span className="font-display text-4xl font-bold text-indigo-600">{placementRate}%</span>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <Progress value={placementRate} className="h-3" />
          </CardContent>
        </Card>

        {/* Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Talent by Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { level: "L1", pct: 45, color: "bg-green-500" },
                { level: "L2", pct: 30, color: "bg-blue-500" },
                { level: "L3", pct: 18, color: "bg-purple-500" },
                { level: "L4", pct: 6, color: "bg-amber-500" },
                { level: "L5", pct: 1, color: "bg-pink-500" },
              ].map((item) => (
                <div key={item.level} className="flex items-center gap-3">
                  <Badge className={`${item.color} text-white w-10 justify-center`}>{item.level}</Badge>
                  <Progress value={item.pct} className="flex-1 h-2" />
                  <span className="text-sm text-slate-500 w-10">{item.pct}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Division Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">By Division</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Technology", count: Math.floor(district.doers * 0.22) },
                { name: "Health", count: Math.floor(district.doers * 0.18) },
                { name: "Education", count: Math.floor(district.doers * 0.15) },
                { name: "Transport", count: Math.floor(district.doers * 0.12) },
                { name: "Food & Agri", count: Math.floor(district.doers * 0.10) },
                { name: "Others", count: Math.floor(district.doers * 0.23) },
              ].map((div) => (
                <div key={div.name} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-sm text-slate-500">{div.name}</p>
                  <p className="font-bold text-lg">{(div.count / 1000).toFixed(1)}K</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Pincodes */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Top Pincodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="font-mono">{530000 + i * 10}</span>
                  <div className="text-right">
                    <span className="font-bold">{Math.floor(district.doers / 10 / i)}</span>
                    <span className="text-slate-400 text-sm ml-1">doers</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
