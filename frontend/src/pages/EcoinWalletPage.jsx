import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Zap, 
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  History,
  Gift,
  Users,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/App";
import BottomNavNew from "@/components/BottomNavNew";

const TRANSACTIONS = [
  {
    id: "t1",
    type: "earned",
    title: "AI Content Writing Task",
    description: "Completed gig for GreenTech Solutions",
    amount: 500,
    date: "2 hours ago",
    club: "Communications"
  },
  {
    id: "t2",
    type: "earned",
    title: "Daily Challenge Bonus",
    description: "Completed Curiosity quiz",
    amount: 50,
    date: "Yesterday",
    club: "Curiosity"
  },
  {
    id: "t3",
    type: "spent",
    title: "Nuclear Science Course",
    description: "Enrolled in certification program",
    amount: 400,
    date: "2 days ago",
    club: "Learning"
  },
  {
    id: "t4",
    type: "earned",
    title: "Data Analysis Project",
    description: "Completed gig for DataMinds Corp",
    amount: 800,
    date: "3 days ago",
    club: "Calculation"
  },
  {
    id: "t5",
    type: "earned",
    title: "Referral Bonus",
    description: "Friend joined through your link",
    amount: 100,
    date: "5 days ago",
    club: "Community"
  },
  {
    id: "t6",
    type: "earned",
    title: "Streak Bonus",
    description: "7-day learning streak",
    amount: 200,
    date: "1 week ago",
    club: "Achievement"
  }
];

const ENERGY_STATS = {
  given: 1250,
  received: 1650,
  harmony: 92
};

export default function EcoinWalletPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  const totalBalance = 1650;
  const monthlyEarned = 1450;
  const monthlySpent = 400;

  const filteredTransactions = TRANSACTIONS.filter(t => {
    if (activeTab === "all") return true;
    return t.type === activeTab;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-24">
      {/* Header */}
      <header className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white p-4 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
            data-testid="ecoin-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-xl">D-COIN Wallet</h1>
            <p className="text-white/70 text-sm">Energy Exchange • Harmony Balance</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <History className="w-5 h-5" />
          </Button>
        </div>

        {/* Balance Card */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
          <p className="text-white/60 text-xs uppercase tracking-widest mb-2">Total Balance</p>
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-10 h-10 text-yellow-300" />
            <span className="font-display text-5xl font-bold">{totalBalance.toLocaleString()}</span>
            <span className="text-white/60 text-lg">D-COIN</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <ArrowDownLeft className="w-4 h-4 text-green-300" />
                <span className="text-white/60 text-xs">This Month Earned</span>
              </div>
              <p className="font-bold text-lg">+{monthlyEarned}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <ArrowUpRight className="w-4 h-4 text-red-300" />
                <span className="text-white/60 text-xs">This Month Spent</span>
              </div>
              <p className="font-bold text-lg">-{monthlySpent}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Energy Flow Stats */}
      <div className="px-4 -mt-4 relative z-10 mb-6">
        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Energy Flow</h3>
              <Badge className="bg-green-100 text-green-700 border-0">
                <Sparkles className="w-3 h-3 mr-1" /> {ENERGY_STATS.harmony}% Harmony
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-amber-50 rounded-xl">
                <TrendingUp className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-amber-600">{ENERGY_STATS.given}</p>
                <p className="text-xs text-slate-500">Energy Given</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <TrendingDown className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{ENERGY_STATS.received}</p>
                <p className="text-xs text-slate-500">Energy Received</p>
              </div>
            </div>
            <p className="text-center text-slate-500 text-xs mt-4 italic">
              &ldquo;My Energy = Your Energy = Both Happy in Harmony&rdquo;
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4 bg-white"
            onClick={() => navigate("/gigs")}
          >
            <Wallet className="w-6 h-6 text-amber-600" />
            <span className="text-xs">Earn More</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4 bg-white"
            onClick={() => navigate("/rewards")}
          >
            <Gift className="w-6 h-6 text-purple-600" />
            <span className="text-xs">Redeem</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4 bg-white"
          >
            <Users className="w-6 h-6 text-blue-600" />
            <span className="text-xs">Refer</span>
          </Button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Transaction History</h3>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="earned">Earned</TabsTrigger>
            <TabsTrigger value="spent">Spent</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <Card key={tx.id} className="border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === "earned" ? "bg-green-100" : "bg-red-100"
                  }`}>
                    {tx.type === "earned" ? (
                      <ArrowDownLeft className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 text-sm">{tx.title}</h4>
                    <p className="text-slate-500 text-xs">{tx.description}</p>
                    <p className="text-slate-400 text-xs mt-1">{tx.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      tx.type === "earned" ? "text-green-600" : "text-red-600"
                    }`}>
                      {tx.type === "earned" ? "+" : "-"}{tx.amount}
                    </p>
                    <p className="text-slate-400 text-xs">D-COIN</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Philosophy Footer */}
      <div className="px-4 py-6">
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-4 text-center">
          <p className="text-indigo-600 text-xs uppercase tracking-widest mb-1">PASS Code System</p>
          <p className="text-slate-700 font-medium">Transmission over Transaction</p>
          <p className="text-slate-500 text-xs mt-1">
            Prakruti • Assessment • Skill • Score
          </p>
        </div>
      </div>

      <BottomNavNew active="profile" />
    </div>
  );
}
