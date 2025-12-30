import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, GraduationCap, DollarSign, TrendingUp, Building2, Star, ChevronRight, Info } from "lucide-react";
import { useAuth } from "@/App";

const CAREER_DATA = {
  nuclear_engineer: {
    id: "nuclear_engineer",
    title: "Nuclear Engineer",
    icon: "☢️",
    color: "from-amber-500 to-orange-600",
    description: "Design, develop and operate nuclear power plants. Work on reactor systems, safety protocols, and sustainable energy solutions for India's 100GW nuclear mission by 2047.",
    education: {
      bachelors: "3-4 years",
      masters: "1-2 years",
      recommended: "B.Tech in Nuclear Engineering from IIT/BARC"
    },
    salary: {
      starting: "₹75,000",
      tenYear: "₹1,40,000",
      growth: "87%"
    },
    employers: ["BARC", "NPCIL", "PowerMech", "L&T", "BHAVINI"],
    demand: "Very High",
    jobsAvailable: 2847,
    skills: ["Nuclear Physics", "Thermodynamics", "Safety Systems", "MCNP", "MATLAB"],
    relevance: 98
  },
  data_scientist: {
    id: "data_scientist",
    title: "Data Scientist",
    icon: "📊",
    color: "from-blue-500 to-indigo-600",
    description: "Analyze complex data sets to help organizations make data-driven decisions. Work with AI, machine learning, and statistical modeling.",
    education: {
      bachelors: "3-4 years",
      masters: "1-2 years",
      recommended: "B.Tech/M.Tech in CS/Statistics"
    },
    salary: {
      starting: "₹1,00,000",
      tenYear: "₹1,50,000",
      growth: "50%"
    },
    employers: ["Google", "Microsoft", "Amazon", "Flipkart", "TCS"],
    demand: "High",
    jobsAvailable: 5420,
    skills: ["Python", "ML/AI", "SQL", "Statistics", "TensorFlow"],
    relevance: 85
  },
  scientist: {
    id: "scientist",
    title: "Scientist",
    icon: "🔬",
    color: "from-purple-500 to-violet-600",
    description: "Conduct research in various scientific fields. Contribute to breakthrough discoveries in physics, chemistry, biology, or interdisciplinary areas.",
    education: {
      bachelors: "3-4 years",
      masters: "2+ years",
      recommended: "Ph.D. in specialized field"
    },
    salary: {
      starting: "₹60,000",
      tenYear: "₹1,20,000",
      growth: "100%"
    },
    employers: ["ISRO", "DRDO", "CSIR", "IISc", "TIFR"],
    demand: "Medium",
    jobsAvailable: 1250,
    skills: ["Research Methods", "Data Analysis", "Lab Techniques", "Publication", "Grant Writing"],
    relevance: 82
  },
  submariner: {
    id: "submariner",
    title: "Submariner",
    icon: "🚢",
    color: "from-slate-600 to-slate-800",
    description: "Operate and maintain submarine systems for the Indian Navy. Work on nuclear-powered vessels requiring specialized training.",
    education: {
      bachelors: "NA",
      masters: "NA",
      recommended: "Naval Academy + Specialized Training"
    },
    salary: {
      starting: "₹88,000",
      tenYear: "₹1,30,000",
      growth: "48%"
    },
    employers: ["Indian Navy"],
    demand: "Limited",
    jobsAvailable: 120,
    skills: ["Naval Operations", "Nuclear Systems", "Leadership", "Technical Maintenance"],
    relevance: 65
  }
};

export default function CareerRecommendationsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // Get user's career interests
  const careerInterests = user?.careerInterests || ["nuclear_engineer"];
  
  // Primary recommendation (first choice or nuclear_engineer as default for demo)
  const primaryCareer = CAREER_DATA[careerInterests[0]] || CAREER_DATA.nuclear_engineer;
  
  // Alternative recommendations based on strengths
  const alternatives = Object.values(CAREER_DATA)
    .filter(c => c.id !== primaryCareer.id)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 3);

  const handleSelectCareer = (careerId) => {
    setSelectedCareer(careerId);
    navigate(`/career-detail/${careerId}`);
  };

  const handleViewSelected = () => {
    navigate("/career-detail/nuclear_engineer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={() => navigate(-1)}
          data-testid="career-rec-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-display font-bold text-white">Career Matches</h1>
          <p className="text-white/50 text-xs">Based on your profile</p>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 pb-32 overflow-y-auto">
        <div className="max-w-md mx-auto">
          {/* Selected Careers Summary */}
          <div className="mb-6">
            <p className="text-white/50 text-sm mb-3">You have chosen:</p>
            <div className="flex flex-wrap gap-2">
              {careerInterests.map((careerId) => {
                const career = CAREER_DATA[careerId];
                if (!career) return null;
                return (
                  <Badge key={careerId} className="bg-white/10 text-white border-0 py-1 px-3">
                    {career?.icon} {career?.title}
                  </Badge>
                );
              })}
            </div>
            <button className="text-indigo-400 text-sm mt-2 hover:text-indigo-300">
              Expand Details →
            </button>
          </div>

          {/* Alternative Recommendations */}
          <div className="mb-6">
            <p className="text-white/60 text-sm mb-4">
              Based on your character strengths & academic results, you might also like:
            </p>

            <div className="space-y-4">
              {/* Primary Recommendation - Nuclear Engineer */}
              <Card className={`bg-gradient-to-br ${primaryCareer.color} border-0 overflow-hidden`}>
                <CardContent className="p-0">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{primaryCareer.icon}</span>
                        <div>
                          <Badge className="bg-white/20 text-white border-0 mb-1">
                            🎯 TOP MATCH
                          </Badge>
                          <h3 className="font-display font-bold text-xl text-white">
                            {primaryCareer.title}
                          </h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-xs">Match</p>
                        <p className="font-bold text-2xl text-white">{primaryCareer.relevance}%</p>
                      </div>
                    </div>

                    {/* Education & Salary */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
                          <GraduationCap className="w-3 h-3" /> Bachelor's
                        </div>
                        <p className="text-white font-semibold">{primaryCareer.education.bachelors}</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
                          <GraduationCap className="w-3 h-3" /> Master's
                        </div>
                        <p className="text-white font-semibold">{primaryCareer.education.masters}</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
                          <DollarSign className="w-3 h-3" /> Starting
                        </div>
                        <p className="text-white font-semibold">{primaryCareer.salary.starting}</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
                          <TrendingUp className="w-3 h-3" /> In 10 Years
                        </div>
                        <p className="text-white font-semibold">{primaryCareer.salary.tenYear}</p>
                      </div>
                    </div>

                    {/* Top Employers */}
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="w-4 h-4 text-white/50" />
                      <div className="flex flex-wrap gap-1">
                        {primaryCareer.employers.slice(0, 4).map((emp) => (
                          <Badge key={emp} variant="outline" className="text-white/80 border-white/30 text-xs">
                            {emp}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-white text-slate-900 hover:bg-white/90"
                        onClick={() => handleSelectCareer(primaryCareer.id)}
                        data-testid="select-primary-career"
                      >
                        Select
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 border-white/30 text-white hover:bg-white/10"
                        onClick={() => navigate(`/career-detail/${primaryCareer.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alternative Cards */}
              {alternatives.map((career) => (
                <button
                  key={career.id}
                  onClick={() => navigate(`/career-detail/${career.id}`)}
                  className="w-full bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 text-left hover:bg-white/10 transition-all"
                  data-testid={`alt-career-${career.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${career.color} rounded-xl flex items-center justify-center text-2xl`}>
                      {career.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{career.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-white/50">
                          <GraduationCap className="w-3 h-3 inline mr-1" />
                          {career.education.bachelors}
                        </span>
                        <span className="text-xs text-green-400">
                          {career.salary.starting}/mo
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{career.relevance}%</p>
                      <p className="text-white/40 text-xs">match</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
        <Button 
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 max-w-md mx-auto"
          onClick={handleViewSelected}
          data-testid="next-career-btn"
        >
          Continue with Nuclear Engineer <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
