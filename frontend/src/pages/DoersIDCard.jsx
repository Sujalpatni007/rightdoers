import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Download, ArrowRight, Sparkles, MapPin, Award, QrCode } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/App";

const CLUB_COLORS = {
  "Power Keepers": "from-red-500 to-rose-600",
  "Wellness Seekers": "from-green-500 to-emerald-600",
  "Problem Solvers": "from-blue-500 to-indigo-600",
  "Knowledge Givers": "from-purple-500 to-violet-600",
  "Profit Maximizers": "from-amber-500 to-orange-600",
};

const CLUB_ICONS = {
  "Power Keepers": "🛡️",
  "Wellness Seekers": "💚",
  "Problem Solvers": "🧩",
  "Knowledge Givers": "📚",
  "Profit Maximizers": "💰",
};

export default function DoersIDCard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const passScore = Math.round(((user?.psy_score || 0) + (user?.skill_score || 0)) / 2);
  const clubColor = CLUB_COLORS[user?.club] || "from-indigo-500 to-purple-600";
  const clubIcon = CLUB_ICONS[user?.club] || "✨";

  // Generate DoersID
  const doersId = `RDW-${user?.pincode || '000000'}-${(user?.division || 'GEN').slice(0, 3).toUpperCase()}-L1-${new Date().getFullYear()}`;

  const handleShare = async () => {
    const shareText = `🎯 I just got my DoersID!\n\n📋 ID: ${doersId}\n🏆 PASS Score: ${passScore}/100\n🎪 Club: ${user?.club}\n\nJoin Right Doers World - The Future of Work!\n#RightDoers #DoersID #FutureOfWork`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My DoersID Card',
          text: shareText,
          url: 'https://hi-ai-app.com'
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Copied to clipboard! Share your DoersID!");
    }
  };

  const handleDownload = () => {
    toast.success("DoersID Card saved! (Feature coming soon)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Congratulations Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-2">
            Congratulations! 🎉
          </h1>
          <p className="text-white/60">Your DoersID is ready</p>
        </div>

        {/* DoersID Card */}
        <div className={`bg-gradient-to-br ${clubColor} rounded-3xl p-6 shadow-2xl relative overflow-hidden mb-6`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>

          {/* Card Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-white" />
                <span className="font-display font-bold text-white">Right Doers</span>
              </div>
              <Badge className="bg-white/20 text-white border-0 text-xs">
                DoersID
              </Badge>
            </div>

            {/* Profile Section */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
                {user?.name?.charAt(0) || "D"}
              </div>
              <div className="flex-1">
                <h2 className="font-display font-bold text-xl text-white mb-1">
                  {user?.name || "Doer"}
                </h2>
                <p className="text-white/70 text-sm mb-2">{user?.division || "General"}</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{clubIcon}</span>
                  <span className="text-white font-semibold">{user?.club || "Member"}</span>
                </div>
              </div>
            </div>

            {/* ID Number */}
            <div className="bg-white/10 rounded-xl p-3 mb-4">
              <p className="text-white/50 text-xs uppercase mb-1">DoersID Number</p>
              <p className="font-mono font-bold text-lg text-white tracking-wider">
                {doersId}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-white/50 text-xs">PASS Score</p>
                <p className="font-bold text-2xl text-white">{passScore}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-white/50 text-xs">Level</p>
                <p className="font-bold text-2xl text-white">L1</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-white/50 text-xs">Pincode</p>
                <p className="font-bold text-lg text-white">{user?.pincode || "---"}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-white/50 text-xs">
              <span>Valid: {new Date().getFullYear()}</span>
              <span>hi-ai-app.com</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button 
            variant="outline" 
            className="flex-1 h-12 bg-white/5 border-white/20 text-white hover:bg-white/10"
            onClick={handleShare}
            data-testid="share-doersid-btn"
          >
            <Share2 className="w-5 h-5 mr-2" /> Share
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 h-12 bg-white/5 border-white/20 text-white hover:bg-white/10"
            onClick={handleDownload}
            data-testid="download-doersid-btn"
          >
            <Download className="w-5 h-5 mr-2" /> Download
          </Button>
        </div>

        {/* Continue Button */}
        <Button 
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
          onClick={() => navigate("/dashboard")}
          data-testid="continue-to-dashboard-btn"
        >
          Explore Opportunities <ArrowRight className="ml-2" />
        </Button>

        {/* Quote */}
        <p className="text-center text-white/40 text-sm mt-6 italic">
          "Choose a job that feels like play to you"
        </p>
      </div>
    </div>
  );
}
