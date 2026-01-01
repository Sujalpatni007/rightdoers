import { useState, useEffect, createContext, useContext } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { LanguageProvider } from "@/context/LanguageContext";

// Pages
import SplashScreen from "@/pages/SplashScreen";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import OnboardingPage from "@/pages/OnboardingPage";
import PsychometricTest from "@/pages/PsychometricTest";
import DoersIDCard from "@/pages/DoersIDCard";
import DoerDashboard from "@/pages/DoerDashboard";
import JobsPage from "@/pages/JobsPage";
import AimeePage from "@/pages/AimeePage";
import ProfilePage from "@/pages/ProfilePage";
import LearnPage from "@/pages/LearnPage";
import ConsumerLanding from "@/pages/ConsumerLanding";
import ServiceProviders from "@/pages/ServiceProviders";
import EmployerDashboard from "@/pages/EmployerDashboard";
import PostJobPage from "@/pages/PostJobPage";
import ApplicantsPage from "@/pages/ApplicantsPage";
import GovernmentDashboard from "@/pages/GovernmentDashboard";
import DistrictDashboard from "@/pages/DistrictDashboard";
import JunicornLanding from "@/pages/JunicornLanding";
import JunicornApply from "@/pages/JunicornApply";

// New Nuclear Pipeline Flow Pages
import AmazingPeoplePage from "@/pages/AmazingPeoplePage";
import SelfRatingPage from "@/pages/SelfRatingPage";
import StrengthsPage from "@/pages/StrengthsPage";
import AcademicSelectionPage from "@/pages/AcademicSelectionPage";
import CareerRecommendationsPage from "@/pages/CareerRecommendationsPage";
import CareerDetailPage from "@/pages/CareerDetailPage";
import CurriculumPage from "@/pages/CurriculumPage";
import CurriculumSuccessPage from "@/pages/CurriculumSuccessPage";
import ProgressDashboard from "@/pages/ProgressDashboard";
import RewardsPage from "@/pages/RewardsPage";
import NuclearCoursePage from "@/pages/NuclearCoursePage";
import CorporateDashboard from "@/pages/CorporateDashboard";
import PipelineBuilder from "@/pages/PipelineBuilder";
import WorldWheelPage from "@/pages/WorldWheelPage";
import WorkWheelPage from "@/pages/WorkWheelPage";
import KarnatakaModelPage from "@/pages/KarnatakaModelPage";
import KarnatakaSchoolsDashboard from "@/pages/KarnatakaSchoolsDashboard";
import AgentHubPage from "@/pages/AgentHubPage";
import CapabilityClubsPage from "@/pages/CapabilityClubsPage";
import GigMarketplacePage from "@/pages/GigMarketplacePage";
import EcoinWalletPage from "@/pages/EcoinWalletPage";
import DoersDreamSIIPPage from "@/pages/DoersDreamSIIPPage";
import AgentAimeeAnalyzer from "@/pages/AgentAimeeAnalyzer";
import DoersIDProfile from "@/pages/DoersIDProfile";
import RolePlayCapsules from "@/pages/RolePlayCapsules";
import PrakrutiEngine from "@/pages/PrakrutiEngine";
import InvestorPitch from "@/pages/InvestorPitch";
import CareerRoadmapGenerator from "@/pages/CareerRoadmapGenerator";
import TalentOnGlocals from "@/pages/TalentOnGlocals";
import FounderDashboard from "@/pages/FounderDashboard";
import DoersProfiler from "@/pages/DoersProfiler";
import DoersOneFamily from "@/pages/DoersOneFamily";
import ProfileComparison from "@/pages/ProfileComparison";
import DivisionDashboards from "@/pages/DivisionDashboards";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("rdw_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("rdw_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("rdw_user");
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("rdw_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-display text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectPath = user.role === "employer" ? "/employer" : 
                         user.role === "admin" ? "/government" : 
                         user.role === "consumer" ? "/services" : "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Seed data on first load
const seedData = async () => {
  try {
    await axios.post(`${API}/seed`);
  } catch (error) {
    console.log("Seed data ready");
  }
};

function AppContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    seedData();
  }, []);

  return (
    <Routes>
      {/* Entry Points */}
      <Route path="/" element={<SplashScreen />} />
      <Route path="/welcome" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Candidate/Talent Flow */}
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
      <Route path="/psychometric" element={<ProtectedRoute><PsychometricTest /></ProtectedRoute>} />
      <Route path="/doersid" element={<ProtectedRoute><DoersIDCard /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["doer"]}><DoerDashboard /></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute allowedRoles={["doer"]}><JobsPage /></ProtectedRoute>} />
      <Route path="/aimee" element={<ProtectedRoute><AimeePage /></ProtectedRoute>} />
      <Route path="/aimee-analyzer" element={<AgentAimeeAnalyzer />} />
      <Route path="/doers-profile" element={<DoersIDProfile />} />
      <Route path="/dp" element={<DoersProfiler />} />
      <Route path="/doers-profiler" element={<DoersProfiler />} />
      <Route path="/talent-card" element={<DoersProfiler />} />
      <Route path="/captain-command" element={<FounderDashboard />} />
      <Route path="/role-play" element={<RolePlayCapsules />} />
      <Route path="/role-play/:divisionId" element={<RolePlayCapsules />} />
      <Route path="/prakruti" element={<PrakrutiEngine />} />
      <Route path="/investor" element={<InvestorPitch />} />
      <Route path="/career-roadmap" element={<CareerRoadmapGenerator />} />
      <Route path="/talenton" element={<TalentOnGlocals />} />
      <Route path="/glocals" element={<TalentOnGlocals />} />
      <Route path="/founder" element={<FounderDashboard />} />
      <Route path="/office" element={<FounderDashboard />} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/learn" element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />
      
      {/* Nuclear Engineering Talent Pipeline Flow */}
      <Route path="/amazing-people" element={<ProtectedRoute><AmazingPeoplePage /></ProtectedRoute>} />
      <Route path="/self-rating" element={<ProtectedRoute><SelfRatingPage /></ProtectedRoute>} />
      <Route path="/strengths" element={<ProtectedRoute><StrengthsPage /></ProtectedRoute>} />
      <Route path="/academic-selection" element={<ProtectedRoute><AcademicSelectionPage /></ProtectedRoute>} />
      <Route path="/career-recommendations" element={<ProtectedRoute><CareerRecommendationsPage /></ProtectedRoute>} />
      <Route path="/career-detail/:careerId" element={<ProtectedRoute><CareerDetailPage /></ProtectedRoute>} />
      <Route path="/curriculum" element={<ProtectedRoute><CurriculumPage /></ProtectedRoute>} />
      <Route path="/curriculum-success" element={<ProtectedRoute><CurriculumSuccessPage /></ProtectedRoute>} />
      <Route path="/progress-dashboard" element={<ProtectedRoute><ProgressDashboard /></ProtectedRoute>} />
      <Route path="/rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
      <Route path="/course/nuclear-science" element={<NuclearCoursePage />} />
      
      {/* Consumer Flow */}
      <Route path="/services" element={<ConsumerLanding />} />
      <Route path="/providers/:category" element={<ServiceProviders />} />
      
      {/* Corporate/PowerMech Flow */}
      <Route path="/corporate" element={<CorporateDashboard />} />
      <Route path="/corporate/pipeline-builder" element={<PipelineBuilder />} />
      
      {/* World Wheel & Work Wheel */}
      <Route path="/world-wheel" element={<WorldWheelPage />} />
      <Route path="/work-wheel" element={<WorkWheelPage />} />
      
      {/* Government Programs */}
      <Route path="/karnataka-model" element={<KarnatakaModelPage />} />
      <Route path="/karnataka-schools" element={<KarnatakaSchoolsDashboard />} />
      
      {/* AI Agents Hub */}
      <Route path="/agents" element={<AgentHubPage />} />
      
      {/* D-COIN Ecosystem Routes */}
      <Route path="/clubs" element={<ProtectedRoute><CapabilityClubsPage /></ProtectedRoute>} />
      <Route path="/gigs" element={<ProtectedRoute><GigMarketplacePage /></ProtectedRoute>} />
      <Route path="/ecoin" element={<ProtectedRoute><EcoinWalletPage /></ProtectedRoute>} />
      <Route path="/dcoin" element={<ProtectedRoute><EcoinWalletPage /></ProtectedRoute>} />
      <Route path="/dream-siip" element={<DoersDreamSIIPPage />} />
      
      {/* DOERS ONE Family Dashboard */}
      <Route path="/family" element={<DoersOneFamily />} />
      <Route path="/doers-one" element={<DoersOneFamily />} />
      
      {/* Profile Comparison - DoersScore Battle */}
      <Route path="/compare" element={<ProfileComparison />} />
      <Route path="/battle" element={<ProfileComparison />} />
      
      {/* Division Director Dashboards */}
      <Route path="/divisions" element={<DivisionDashboards />} />
      <Route path="/divisions/:divisionId" element={<DivisionDashboards />} />
      <Route path="/director" element={<DivisionDashboards />} />
      
      {/* Employer Flow */}
      <Route path="/employer" element={<ProtectedRoute allowedRoles={["employer"]}><EmployerDashboard /></ProtectedRoute>} />
      <Route path="/employer/post" element={<ProtectedRoute allowedRoles={["employer"]}><PostJobPage /></ProtectedRoute>} />
      <Route path="/employer/applicants/:jobId" element={<ProtectedRoute allowedRoles={["employer"]}><ApplicantsPage /></ProtectedRoute>} />
      
      {/* Government Flow */}
      <Route path="/government" element={<ProtectedRoute allowedRoles={["admin"]}><GovernmentDashboard /></ProtectedRoute>} />
      <Route path="/government/district/:districtId" element={<ProtectedRoute allowedRoles={["admin"]}><DistrictDashboard /></ProtectedRoute>} />
      
      {/* Junicorn NET Flow */}
      <Route path="/junicorn" element={<JunicornLanding />} />
      <Route path="/junicorn/apply" element={<ProtectedRoute><JunicornApply /></ProtectedRoute>} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <AppContent />
            <Toaster richColors position="top-center" />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
