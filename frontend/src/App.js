import { useState, useEffect, createContext, useContext } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// Pages
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import OnboardingPage from "@/pages/OnboardingPage";
import DoerDashboard from "@/pages/DoerDashboard";
import EmployerDashboard from "@/pages/EmployerDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import JobsPage from "@/pages/JobsPage";
import AimeePage from "@/pages/AimeePage";
import ProfilePage from "@/pages/ProfilePage";

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary font-display text-2xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectPath = user.role === "employer" ? "/employer" : user.role === "admin" ? "/admin" : "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Seed data on first load
const seedData = async () => {
  try {
    await axios.post(`${API}/seed`);
  } catch (error) {
    console.log("Seed data already exists or error:", error.message);
  }
};

function AppContent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    seedData();
  }, []);

  // Redirect based on role after login
  useEffect(() => {
    if (user && window.location.pathname === "/auth") {
      if (!user.division && user.role === "doer") {
        navigate("/onboarding");
      } else {
        const path = user.role === "employer" ? "/employer" : user.role === "admin" ? "/admin" : "/dashboard";
        navigate(path);
      }
    }
  }, [user, navigate]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <OnboardingPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={["doer"]}>
          <DoerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/jobs" element={
        <ProtectedRoute allowedRoles={["doer"]}>
          <JobsPage />
        </ProtectedRoute>
      } />
      <Route path="/aimee" element={
        <ProtectedRoute allowedRoles={["doer"]}>
          <AimeePage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/employer" element={
        <ProtectedRoute allowedRoles={["employer"]}>
          <EmployerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <AppContent />
          <Toaster richColors position="top-center" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
