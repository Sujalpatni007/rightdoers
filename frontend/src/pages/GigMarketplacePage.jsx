import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Zap, 
  MapPin, 
  Clock,
  Search,
  Filter,
  Briefcase,
  CheckCircle2,
  Star,
  Users,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/App";
import BottomNavNew from "@/components/BottomNavNew";
import Confetti from "react-confetti";

const GIGS = [
  {
    id: "g1",
    title: "AI Content Writing Task",
    description: "Write 3 blog posts about sustainable energy using AI assistance",
    ecoin: 500,
    duration: "2-3 hours",
    pincode: "560001",
    pincodeMatch: true,
    club: "Communications",
    clubIcon: "💬",
    clubColor: "bg-blue-100 text-blue-700",
    difficulty: "Easy",
    postedBy: "GreenTech Solutions",
    applicants: 12,
    status: "open",
    skills: ["Writing", "AI Tools", "Research"]
  },
  {
    id: "g2",
    title: "Data Analysis Project",
    description: "Analyze sales data and create visualization dashboard",
    ecoin: 800,
    duration: "4-5 hours",
    pincode: "560002",
    pincodeMatch: true,
    club: "Calculation",
    clubIcon: "🧮",
    clubColor: "bg-amber-100 text-amber-700",
    difficulty: "Medium",
    postedBy: "DataMinds Corp",
    applicants: 8,
    status: "open",
    skills: ["Excel", "Python", "Data Viz"]
  },
  {
    id: "g3",
    title: "Elderly Care Assistance",
    description: "Virtual companion call - 1 hour conversation with senior citizen",
    ecoin: 300,
    duration: "1 hour",
    pincode: "560001",
    pincodeMatch: true,
    club: "Care",
    clubIcon: "💚",
    clubColor: "bg-green-100 text-green-700",
    difficulty: "Easy",
    postedBy: "SilverCare Foundation",
    applicants: 5,
    status: "open",
    skills: ["Empathy", "Communication", "Patience"]
  },
  {
    id: "g4",
    title: "Logo Design Task",
    description: "Design modern logo for a local startup - 3 concepts required",
    ecoin: 650,
    duration: "3-4 hours",
    pincode: "560003",
    pincodeMatch: false,
    club: "Creativity",
    clubIcon: "🎨",
    clubColor: "bg-pink-100 text-pink-700",
    difficulty: "Medium",
    postedBy: "InnoStart Labs",
    applicants: 18,
    status: "open",
    skills: ["Graphic Design", "Illustrator", "Branding"]
  },
  {
    id: "g5",
    title: "Research Survey Analysis",
    description: "Analyze 100 survey responses and create summary report",
    ecoin: 450,
    duration: "2-3 hours",
    pincode: "560001",
    pincodeMatch: true,
    club: "Curiosity",
    clubIcon: "🔬",
    clubColor: "bg-purple-100 text-purple-700",
    difficulty: "Easy",
    postedBy: "Research Hub India",
    applicants: 7,
    status: "open",
    skills: ["Analysis", "Report Writing", "Statistics"]
  },
  {
    id: "g6",
    title: "Social Media Content Creation",
    description: "Create 10 Instagram posts with captions for wellness brand",
    ecoin: 550,
    duration: "3-4 hours",
    pincode: "560004",
    pincodeMatch: false,
    club: "Creativity",
    clubIcon: "🎨",
    clubColor: "bg-pink-100 text-pink-700",
    difficulty: "Easy",
    postedBy: "WellnessFirst",
    applicants: 22,
    status: "open",
    skills: ["Social Media", "Canva", "Copywriting"]
  }
];

const FILTERS = ["All", "Pincode Match", "Communications", "Care", "Curiosity", "Creativity", "Calculation"];

export default function GigMarketplacePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showConfetti, setShowConfetti] = useState(false);
  const [earnedEcoin, setEarnedEcoin] = useState(0);

  const userPincode = user?.pincode || "560001";
  const userEcoin = 1250;

  const filteredGigs = GIGS.filter(gig => {
    const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          gig.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "All" ||
                          (activeFilter === "Pincode Match" && gig.pincodeMatch) ||
                          gig.club === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleApply = (gig) => {
    setShowConfetti(true);
    setEarnedEcoin(gig.ecoin);
    toast.success(
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-500" />
        <div>
          <p className="font-semibold">Energy Exchange Initiated! ⚡</p>
          <p className="text-sm text-slate-600">+{gig.ecoin} D-COIN earned</p>
          <p className="text-xs text-slate-500 italic">My Energy = Your Energy = Harmony</p>
        </div>
      </div>,
      { duration: 4000 }
    );
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-24">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-4 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate("/dashboard")}
            data-testid="gigs-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-xl">Rent a Doer</h1>
            <p className="text-white/70 text-sm">Available Tasks • Energy Exchange</p>
          </div>
        </div>

        {/* D-COIN Balance */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wide">Your D-COIN Balance</p>
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-300" />
                <span className="font-display text-3xl font-bold">{userEcoin.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs">Pincode</p>
              <Badge className="bg-white/20 text-white border-0">
                <MapPin className="w-3 h-3 mr-1" /> {userPincode}
              </Badge>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search gigs by skill or keyword..."
            className="pl-10 bg-white border-0 text-slate-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="gig-search"
          />
        </div>
      </header>

      {/* Filters */}
      <div className="px-4 py-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {FILTERS.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              className={activeFilter === filter 
                ? "bg-amber-500 hover:bg-amber-600 text-white" 
                : "bg-white"
              }
              onClick={() => setActiveFilter(filter)}
              data-testid={`filter-${filter.toLowerCase().replace(" ", "-")}`}
            >
              {filter === "Pincode Match" && <MapPin className="w-3 h-3 mr-1" />}
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Gigs Count */}
      <div className="px-4 pb-2">
        <div className="flex items-center justify-between">
          <p className="text-slate-600 text-sm">
            <span className="font-semibold text-slate-900">{filteredGigs.length}</span> gigs available
          </p>
          <Button variant="ghost" size="sm" className="text-slate-500">
            <Filter className="w-4 h-4 mr-1" /> Sort
          </Button>
        </div>
      </div>

      {/* Gig Cards */}
      <div className="px-4 space-y-4">
        {filteredGigs.map((gig) => (
          <Card 
            key={gig.id} 
            className="overflow-hidden border hover:shadow-lg transition-shadow"
            data-testid={`gig-card-${gig.id}`}
          >
            <CardContent className="p-0">
              {/* Header Row */}
              <div className="p-4 pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{gig.clubIcon}</span>
                    <Badge className={`${gig.clubColor} border-0 text-xs`}>
                      {gig.club}
                    </Badge>
                    {gig.pincodeMatch && (
                      <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                        <MapPin className="w-3 h-3 mr-1" /> Match
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-600 font-bold">
                      <Zap className="w-4 h-4" />
                      <span>{gig.ecoin}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">D-COIN</p>
                  </div>
                </div>

                <h3 className="font-semibold text-slate-900 mb-1">{gig.title}</h3>
                <p className="text-slate-500 text-sm mb-3">{gig.description}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {gig.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-[10px] px-2 py-0 bg-slate-50">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Meta Row */}
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {gig.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {gig.applicants} applied
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> {gig.difficulty}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-t">
                <div>
                  <p className="text-xs text-slate-500">Posted by</p>
                  <p className="text-sm font-medium text-slate-700">{gig.postedBy}</p>
                </div>
                <Button 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                  onClick={() => handleApply(gig)}
                  data-testid={`apply-${gig.id}`}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Apply & Earn
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredGigs.length === 0 && (
        <div className="px-4 py-12 text-center">
          <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-900 mb-2">No gigs found</h3>
          <p className="text-slate-500 text-sm">Try adjusting your filters or search term</p>
        </div>
      )}

      {/* Energy Exchange Philosophy Banner */}
      <div className="px-4 py-6">
        <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 border-0 text-white">
          <CardContent className="p-4 text-center">
            <p className="text-white/70 text-xs uppercase tracking-widest mb-2">Energy Exchange Philosophy</p>
            <p className="font-display font-bold text-lg mb-1">
              My Energy = Your Energy
            </p>
            <p className="text-white/80 text-sm">
              Both Happy in Harmony ✨
            </p>
            <p className="text-white/50 text-xs mt-2 italic">
              PASS Code System • Transmission over Transaction
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNavNew active="gigs" />
    </div>
  );
}
