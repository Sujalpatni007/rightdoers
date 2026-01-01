import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  MessageCircle,
  Send,
  FileSignature,
  Shield,
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Building2,
  Phone,
  Mail,
  User,
  FileText,
  Sparkles,
  Bell,
  Users,
  AlertCircle
} from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Status badge colors
const STATUS_COLORS = {
  initiated: "bg-gray-500",
  otp_sent: "bg-blue-500",
  verified: "bg-amber-500",
  signed: "bg-green-500",
  rejected: "bg-red-500",
  pending: "bg-yellow-500",
  approved: "bg-green-500",
  simulated: "bg-purple-500"
};

export default function WhatsAppSigning() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("nda");
  const [loading, setLoading] = useState(false);
  const [serviceStatus, setServiceStatus] = useState(null);
  const [signings, setSignings] = useState([]);
  
  // NDA Form
  const [ndaRecipient, setNdaRecipient] = useState("");
  const [ndaEmail, setNdaEmail] = useState("");
  const [ndaPhone, setNdaPhone] = useState("");
  
  // Offer Form
  const [offerName, setOfferName] = useState("");
  const [offerEmail, setOfferEmail] = useState("");
  const [offerPhone, setOfferPhone] = useState("");
  const [offerPosition, setOfferPosition] = useState("");
  const [offerDivision, setOfferDivision] = useState("Technology");
  
  // Approval Form
  const [approvalType, setApprovalType] = useState("new_hire");
  const [approvalSubject, setApprovalSubject] = useState("");
  const [approvalDetails, setApprovalDetails] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [requesterPhone, setRequesterPhone] = useState("");

  // Fetch service status on mount
  useEffect(() => {
    fetchStatus();
    fetchSignings();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await axios.get(`${API}/whatsapp/status`);
      setServiceStatus(response.data);
    } catch (error) {
      console.error("Status fetch error:", error);
    }
  };

  const fetchSignings = async () => {
    try {
      const response = await axios.get(`${API}/whatsapp/signings?limit=20`);
      setSignings(response.data.signings || []);
    } catch (error) {
      console.error("Signings fetch error:", error);
    }
  };

  // Send NDA via WhatsApp
  const handleSendNDA = async () => {
    if (!ndaRecipient || !ndaPhone) {
      toast.error("Please fill in recipient name and phone number");
      return;
    }
    
    setLoading(true);
    try {
      const ndaId = `NDA-${Date.now().toString(36).toUpperCase()}`;
      
      const response = await axios.post(`${API}/whatsapp/nda/send`, {
        nda_id: ndaId,
        recipient_name: ndaRecipient,
        recipient_phone: ndaPhone,
        recipient_email: ndaEmail
      });
      
      if (response.data.success) {
        toast.success(`NDA sent to ${ndaPhone} via WhatsApp!`);
        // Clear form
        setNdaRecipient("");
        setNdaEmail("");
        setNdaPhone("");
        // Refresh signings
        fetchSignings();
      }
    } catch (error) {
      console.error("NDA send error:", error);
      toast.error("Failed to send NDA");
    } finally {
      setLoading(false);
    }
  };

  // Send Offer via WhatsApp
  const handleSendOffer = async () => {
    if (!offerName || !offerPhone || !offerPosition) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    try {
      const offerId = `OFFER-${Date.now().toString(36).toUpperCase()}`;
      
      const response = await axios.post(`${API}/whatsapp/offer/send`, {
        offer_id: offerId,
        candidate_name: offerName,
        candidate_phone: offerPhone,
        candidate_email: offerEmail,
        position: offerPosition,
        division: offerDivision
      });
      
      if (response.data.success) {
        toast.success(`Offer sent to ${offerName} via WhatsApp!`);
        // Clear form
        setOfferName("");
        setOfferEmail("");
        setOfferPhone("");
        setOfferPosition("");
        // Refresh signings
        fetchSignings();
      }
    } catch (error) {
      console.error("Offer send error:", error);
      toast.error("Failed to send offer");
    } finally {
      setLoading(false);
    }
  };

  // Request Founder Approval
  const handleRequestApproval = async () => {
    if (!approvalSubject || !requesterName || !requesterPhone) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/whatsapp/approval/request`, {
        request_type: approvalType,
        subject: approvalSubject,
        details: { description: approvalDetails },
        requester_name: requesterName,
        requester_phone: requesterPhone
      });
      
      if (response.data.success) {
        toast.success("Approval request sent to founder!");
        // Clear form
        setApprovalSubject("");
        setApprovalDetails("");
        setRequesterName("");
        setRequesterPhone("");
      }
    } catch (error) {
      console.error("Approval request error:", error);
      toast.error("Failed to send approval request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/content")}
                className="text-white/70 hover:text-white"
              >
                ← Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <MessageCircle className="h-6 w-6 text-green-400" />
                  WhatsApp NDA Signing
                </h1>
                <p className="text-white/60 text-sm">Digital signatures via WhatsApp • DOERS LEGAL AI</p>
              </div>
            </div>
            
            {/* Service Status */}
            {serviceStatus && (
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`${serviceStatus.twilio_enabled ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-purple-500/20 text-purple-400 border-purple-500/50'}`}
                >
                  {serviceStatus.twilio_enabled ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" /> Live
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 mr-1" /> Simulation Mode
                    </>
                  )}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Company Info Banner */}
        <Card className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 border-green-500/30 mb-6">
          <CardContent className="p-4 flex items-center gap-4">
            <Building2 className="h-10 w-10 text-green-400" />
            <div>
              <p className="text-white font-bold">Right Doers World Pvt. Ltd.</p>
              <p className="text-white/60 text-sm">Global Capability Centre for Human Xperts • 15th Floor, World Trade Centre, Bangalore</p>
            </div>
            <Badge className="ml-auto bg-green-500/30 text-green-300 border-0">
              <Sparkles className="h-3 w-3 mr-1" /> DOERS LEGAL AI
            </Badge>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form Section */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-black/30 border border-white/10 p-1 w-full justify-start">
                <TabsTrigger value="nda" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                  <Shield className="h-4 w-4 mr-2" /> Send NDA
                </TabsTrigger>
                <TabsTrigger value="offer" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <Briefcase className="h-4 w-4 mr-2" /> Send Offer
                </TabsTrigger>
                <TabsTrigger value="approval" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                  <Bell className="h-4 w-4 mr-2" /> Request Approval
                </TabsTrigger>
              </TabsList>

              {/* NDA Tab */}
              <TabsContent value="nda">
                <Card className="bg-black/40 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-400" />
                      Send NDA via WhatsApp
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      The recipient will receive the NDA document and OTP for digital signing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-white/70">Recipient Name *</Label>
                      <Input
                        placeholder="Full legal name"
                        value={ndaRecipient}
                        onChange={(e) => setNdaRecipient(e.target.value)}
                        className="bg-white/5 border-white/10 text-white mt-1"
                        data-testid="nda-name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white/70">WhatsApp Number *</Label>
                        <Input
                          placeholder="+91 98765 43210"
                          value={ndaPhone}
                          onChange={(e) => setNdaPhone(e.target.value)}
                          className="bg-white/5 border-white/10 text-white mt-1"
                          data-testid="nda-phone"
                        />
                      </div>
                      <div>
                        <Label className="text-white/70">Email</Label>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          value={ndaEmail}
                          onChange={(e) => setNdaEmail(e.target.value)}
                          className="bg-white/5 border-white/10 text-white mt-1"
                          data-testid="nda-email"
                        />
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-white/70 text-sm mb-2">📱 What the recipient will receive:</p>
                      <ol className="text-white/50 text-xs space-y-1 list-decimal list-inside">
                        <li>Welcome message with NDA context</li>
                        <li>Link to view NDA document</li>
                        <li>6-digit OTP for digital signing</li>
                        <li>Instructions to reply with SIGN &lt;OTP&gt;</li>
                      </ol>
                    </div>

                    <Button
                      onClick={handleSendNDA}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      data-testid="send-nda-btn"
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Send NDA via WhatsApp
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Offer Tab */}
              <TabsContent value="offer">
                <Card className="bg-black/40 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-blue-400" />
                      Send Offer Letter via WhatsApp
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Send offer letter for digital acceptance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white/70">Candidate Name *</Label>
                        <Input
                          placeholder="Full name"
                          value={offerName}
                          onChange={(e) => setOfferName(e.target.value)}
                          className="bg-white/5 border-white/10 text-white mt-1"
                          data-testid="offer-name"
                        />
                      </div>
                      <div>
                        <Label className="text-white/70">WhatsApp Number *</Label>
                        <Input
                          placeholder="+91 98765 43210"
                          value={offerPhone}
                          onChange={(e) => setOfferPhone(e.target.value)}
                          className="bg-white/5 border-white/10 text-white mt-1"
                          data-testid="offer-phone"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-white/70">Email</Label>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={offerEmail}
                        onChange={(e) => setOfferEmail(e.target.value)}
                        className="bg-white/5 border-white/10 text-white mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white/70">Position *</Label>
                        <Input
                          placeholder="e.g., Division Director"
                          value={offerPosition}
                          onChange={(e) => setOfferPosition(e.target.value)}
                          className="bg-white/5 border-white/10 text-white mt-1"
                          data-testid="offer-position"
                        />
                      </div>
                      <div>
                        <Label className="text-white/70">Division *</Label>
                        <Select value={offerDivision} onValueChange={setOfferDivision}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Legal">Legal</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Health">Health</SelectItem>
                            <SelectItem value="Security">Security</SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      onClick={handleSendOffer}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      data-testid="send-offer-btn"
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Send Offer via WhatsApp
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Approval Tab */}
              <TabsContent value="approval">
                <Card className="bg-black/40 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Bell className="h-5 w-5 text-amber-400" />
                      Request Founder Approval
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Send approval request directly to founder via WhatsApp
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white/70">Request Type *</Label>
                        <Select value={approvalType} onValueChange={setApprovalType}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new_hire">New Hire</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="budget">Budget Approval</SelectItem>
                            <SelectItem value="nda_signing">NDA Signing</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-white/70">Subject *</Label>
                        <Input
                          placeholder="Brief description"
                          value={approvalSubject}
                          onChange={(e) => setApprovalSubject(e.target.value)}
                          className="bg-white/5 border-white/10 text-white mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-white/70">Details</Label>
                      <Input
                        placeholder="Additional context..."
                        value={approvalDetails}
                        onChange={(e) => setApprovalDetails(e.target.value)}
                        className="bg-white/5 border-white/10 text-white mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white/70">Your Name *</Label>
                        <Input
                          placeholder="Your full name"
                          value={requesterName}
                          onChange={(e) => setRequesterName(e.target.value)}
                          className="bg-white/5 border-white/10 text-white mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-white/70">Your WhatsApp *</Label>
                        <Input
                          placeholder="+91 98765 43210"
                          value={requesterPhone}
                          onChange={(e) => setRequesterPhone(e.target.value)}
                          className="bg-white/5 border-white/10 text-white mt-1"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleRequestApproval}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Bell className="h-4 w-4 mr-2" />
                      )}
                      Request Approval
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Recent Signings Sidebar */}
          <div>
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <FileSignature className="h-5 w-5 text-green-400" />
                  Recent Signings
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchSignings}
                  className="text-white/50 hover:text-white absolute right-4 top-4"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
                {signings.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-white/20 mx-auto mb-2" />
                    <p className="text-white/40 text-sm">No signings yet</p>
                  </div>
                ) : (
                  signings.map((signing) => (
                    <div
                      key={signing.id}
                      className="p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-white font-medium text-sm">
                          {signing.recipient_name || signing.candidate_name}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${STATUS_COLORS[signing.status]} text-white border-0`}
                        >
                          {signing.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-white/50">
                        <p className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {signing.recipient_phone || signing.candidate_phone}
                        </p>
                        <p className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {signing.nda_id || signing.offer_id}
                        </p>
                        <p className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(signing.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {signing.signature_hash && (
                        <div className="mt-2 pt-2 border-t border-white/10">
                          <p className="text-green-400 text-xs flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Signed: {signing.signature_hash}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* How it Works */}
            <Card className="bg-black/40 border-white/10 mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">How it Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-white/60">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">1</div>
                  <p>Send NDA/Offer via WhatsApp</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">2</div>
                  <p>Recipient receives document + OTP</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">3</div>
                  <p>They reply: SIGN &lt;OTP&gt;</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">4</div>
                  <p>Digital signature generated ✅</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
