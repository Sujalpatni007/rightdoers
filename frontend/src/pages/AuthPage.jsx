import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Sparkles, Phone, ArrowLeft, User, Building2, Shield } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth, API } from "@/App";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  
  const [step, setStep] = useState("phone"); // phone, otp, register
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState(searchParams.get("role") || "doer");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/send-otp`, { phone });
      toast.success(`OTP sent! (Demo: ${res.data.otp})`);
      setStep("otp");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/verify-otp`, { phone, otp });
      
      if (res.data.is_new_user) {
        setIsNewUser(true);
        setStep("register");
      } else {
        login(res.data.user);
        toast.success("Welcome back!");
        const path = res.data.user.role === "employer" ? "/employer" : 
                     res.data.user.role === "admin" ? "/admin" : 
                     res.data.user.division ? "/dashboard" : "/onboarding";
        navigate(path);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (role === "employer" && !companyName.trim()) {
      toast.error("Please enter your company name");
      return;
    }

    setLoading(true);
    try {
      const userData = {
        phone,
        name,
        role,
        company_name: role === "employer" ? companyName : null
      };
      
      const res = await axios.post(`${API}/users`, userData);
      login(res.data);
      toast.success("Account created successfully!");
      
      if (role === "doer") {
        navigate("/onboarding");
      } else {
        navigate(role === "employer" ? "/employer" : "/admin");
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => step === "phone" ? navigate("/") : setStep(step === "register" ? "otp" : "phone")}
          data-testid="auth-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 pb-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Right Doers World</h1>
            <p className="text-slate-500 mt-1">The Future of Work</p>
          </div>

          {/* Phone Step */}
          {step === "phone" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-center mb-6">
                Enter your phone number
              </h2>

              {/* Role Tabs */}
              <Tabs value={role} onValueChange={setRole} className="mb-6">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="doer" data-testid="role-doer-tab">
                    <User className="w-4 h-4 mr-1" /> Doer
                  </TabsTrigger>
                  <TabsTrigger value="employer" data-testid="role-employer-tab">
                    <Building2 className="w-4 h-4 mr-1" /> Employer
                  </TabsTrigger>
                  <TabsTrigger value="admin" data-testid="role-admin-tab">
                    <Shield className="w-4 h-4 mr-1" /> Admin
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="pl-12 h-14 text-lg"
                    data-testid="phone-input"
                  />
                </div>
                <Button 
                  className="w-full btn-primary"
                  onClick={handleSendOTP}
                  disabled={loading || phone.length !== 10}
                  data-testid="send-otp-btn"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
              </div>
            </div>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-center mb-2">
                Enter OTP
              </h2>
              <p className="text-slate-500 text-center text-sm mb-6">
                Sent to +91 {phone}
              </p>

              <div className="flex justify-center mb-6">
                <InputOTP 
                  maxLength={6} 
                  value={otp} 
                  onChange={setOtp}
                  data-testid="otp-input"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-12 h-14 text-xl" />
                    <InputOTPSlot index={1} className="w-12 h-14 text-xl" />
                    <InputOTPSlot index={2} className="w-12 h-14 text-xl" />
                    <InputOTPSlot index={3} className="w-12 h-14 text-xl" />
                    <InputOTPSlot index={4} className="w-12 h-14 text-xl" />
                    <InputOTPSlot index={5} className="w-12 h-14 text-xl" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button 
                className="w-full btn-primary"
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                data-testid="verify-otp-btn"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>

              <button 
                className="w-full mt-4 text-primary text-sm font-medium hover:underline"
                onClick={handleSendOTP}
              >
                Resend OTP
              </button>
            </div>
          )}

          {/* Register Step */}
          {step === "register" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-center mb-6">
                Complete Your Profile
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 mt-1"
                    data-testid="name-input"
                  />
                </div>

                {role === "employer" && (
                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      placeholder="Enter company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="h-12 mt-1"
                      data-testid="company-input"
                    />
                  </div>
                )}

                <Button 
                  className="w-full btn-primary"
                  onClick={handleRegister}
                  disabled={loading}
                  data-testid="register-btn"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
