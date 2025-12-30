import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Sparkles, Phone, ArrowLeft, User, Building2, Shield, Briefcase } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth, API } from "@/App";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState(searchParams.get("role") || "doer");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const roleConfig = {
    doer: { icon: User, label: "Talent", color: "from-blue-500 to-indigo-600" },
    consumer: { icon: Briefcase, label: "Consumer", color: "from-green-500 to-emerald-600" },
    employer: { icon: Building2, label: "Employer", color: "from-orange-500 to-amber-600" },
    admin: { icon: Shield, label: "Government", color: "from-purple-500 to-violet-600" }
  };

  const currentRole = roleConfig[role] || roleConfig.doer;
  const RoleIcon = currentRole.icon;

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
        navigateByRole(res.data.user);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const navigateByRole = (user) => {
    if (user.role === "employer") {
      navigate("/employer");
    } else if (user.role === "admin") {
      navigate("/government");
    } else if (user.role === "consumer") {
      navigate("/services");
    } else {
      // Doer - check if onboarding complete
      if (!user.division) {
        navigate("/onboarding");
      } else if (!user.psy_score || user.psy_score === 0) {
        navigate("/psychometric");
      } else {
        navigate("/dashboard");
      }
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
      navigateByRole(res.data);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={() => step === "phone" ? navigate("/welcome") : setStep(step === "register" ? "otp" : "phone")}
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
            <div className={`w-20 h-20 bg-gradient-to-br ${currentRole.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl`}>
              <RoleIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">
              {currentRole.label} Login
            </h1>
            <p className="text-white/50 mt-1">Right Doers World</p>
          </div>

          {/* Phone Step */}
          {step === "phone" && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-white text-center mb-6">
                Enter your phone number
              </h2>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white/60">
                    <span className="text-lg">🇮🇳</span>
                    <span className="text-sm font-medium">+91</span>
                  </div>
                  <Input
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="pl-20 h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    data-testid="phone-input"
                  />
                </div>
                <Button 
                  className={`w-full h-14 text-lg font-semibold bg-gradient-to-r ${currentRole.color} hover:opacity-90`}
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
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-white text-center mb-2">
                Enter OTP
              </h2>
              <p className="text-white/50 text-center text-sm mb-6">
                Sent to +91 {phone}
              </p>

              <div className="flex justify-center mb-6">
                <InputOTP 
                  maxLength={6} 
                  value={otp} 
                  onChange={setOtp}
                  data-testid="otp-input"
                >
                  <InputOTPGroup className="gap-2">
                    {[0,1,2,3,4,5].map((i) => (
                      <InputOTPSlot 
                        key={i} 
                        index={i} 
                        className="w-12 h-14 text-xl bg-white/10 border-white/20 text-white rounded-xl" 
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button 
                className={`w-full h-14 text-lg font-semibold bg-gradient-to-r ${currentRole.color} hover:opacity-90`}
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                data-testid="verify-otp-btn"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>

              <button 
                className="w-full mt-4 text-white/60 text-sm font-medium hover:text-white/80"
                onClick={handleSendOTP}
              >
                Resend OTP
              </button>
            </div>
          )}

          {/* Register Step */}
          {step === "register" && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-white text-center mb-6">
                Complete Your Profile
              </h2>

              <div className="space-y-4">
                <div>
                  <Label className="text-white/70">Full Name</Label>
                  <Input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    data-testid="name-input"
                  />
                </div>

                {role === "employer" && (
                  <div>
                    <Label className="text-white/70">Company Name</Label>
                    <Input
                      placeholder="Enter company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="h-12 mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      data-testid="company-input"
                    />
                  </div>
                )}

                <Button 
                  className={`w-full h-14 text-lg font-semibold bg-gradient-to-r ${currentRole.color} hover:opacity-90`}
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
