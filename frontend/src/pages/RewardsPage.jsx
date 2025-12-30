import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Gift, 
  Zap,
  BookOpen,
  Calendar,
  Headphones,
  Film,
  Award,
  Lock,
  Check,
  ShoppingCart
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/App";

const REWARDS = {
  courses: [
    { id: "c1", name: "Nuclear Science Course", description: "Complete certification in Nuclear fundamentals", points: 400, icon: "☢️", type: "course", provider: "LinkedIn Learning" },
    { id: "c2", name: "Python for Engineers", description: "Learn programming for scientific computing", points: 300, icon: "🐍", type: "course", provider: "Coursera" },
    { id: "c3", name: "Radiation Safety Basics", description: "IAEA certified course", points: 500, icon: "🛡️", type: "course", provider: "IAEA" }
  ],
  events: [
    { id: "e1", name: "Science Museum Visit", description: "Guided tour of nuclear exhibition", points: 800, icon: "🏛️", type: "event", date: "Jan 15, 2025" },
    { id: "e2", name: "BARC Virtual Tour", description: "Online walkthrough of research facilities", points: 0, icon: "🏢", type: "event", date: "Jan 20, 2025", free: true },
    { id: "e3", name: "Career Talk: Nuclear Engineers", description: "Meet professionals from NPCIL", points: 200, icon: "🎙️", type: "event", date: "Feb 5, 2025" }
  ],
  media: [
    { id: "m1", name: "Rare Earth Elements", description: "Audiobook about nuclear materials", points: 350, icon: "🎧", type: "audiobook" },
    { id: "m2", name: "Oppenheimer", description: "Movie about the atomic age", points: 700, icon: "🎬", type: "movie" },
    { id: "m3", name: "Chernobyl Series", description: "HBO documentary series", points: 600, icon: "📺", type: "series" }
  ]
};

export default function RewardsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("courses");
  const [cart, setCart] = useState([]);

  const availablePoints = 1040;

  const handleRedeem = (item) => {
    if (item.points > availablePoints) {
      toast.error("Not enough points!");
      return;
    }
    if (item.points === 0 || item.free) {
      toast.success(`Enrolled in ${item.name}!`);
      return;
    }
    toast.success(`Redeemed: ${item.name} for ${item.points} points!`);
  };

  const renderItem = (item) => (
    <Card key={item.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl">
            {item.icon}
          </div>
          <div className="flex-1 p-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">{item.name}</h4>
                <p className="text-slate-500 text-xs mt-0.5">{item.description}</p>
                {item.provider && (
                  <p className="text-indigo-600 text-xs mt-1">Source: {item.provider}</p>
                )}
                {item.date && (
                  <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.date}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <Badge className={`${
                item.free || item.points === 0 
                  ? 'bg-green-100 text-green-700' 
                  : item.points <= availablePoints 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-slate-100 text-slate-500'
              } border-0`}>
                {item.free || item.points === 0 ? 'FREE' : `${item.points} PTS`}
              </Badge>
              <Button 
                size="sm" 
                className={`${
                  item.points <= availablePoints || item.free
                    ? 'bg-indigo-600 hover:bg-indigo-700' 
                    : 'bg-slate-300'
                }`}
                onClick={() => handleRedeem(item)}
                disabled={item.points > availablePoints && !item.free}
              >
                {item.type === 'course' ? 'Enroll' : 
                 item.type === 'event' ? 'Book' : 'Avail'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-xl">Rewards Store</h1>
            <p className="text-white/70 text-sm">Redeem your hard-earned points</p>
          </div>
        </div>

        {/* Points Balance */}
        <div className="bg-white/20 backdrop-blur rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Available Points</p>
            <div className="flex items-center gap-2">
              <span className="font-display text-3xl font-bold">{availablePoints}</span>
              <Zap className="w-6 h-6 text-yellow-300" />
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-sm">Sort by</p>
            <select className="bg-white/20 border-0 rounded-lg px-3 py-1 text-white text-sm">
              <option>All</option>
              <option>Points: Low to High</option>
              <option>Points: High to Low</option>
            </select>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="courses" className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" /> Courses
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Events
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-1">
              <Film className="w-4 h-4" /> Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-3">
            {REWARDS.courses.map(renderItem)}
          </TabsContent>

          <TabsContent value="events" className="space-y-3">
            {REWARDS.events.map(renderItem)}
          </TabsContent>

          <TabsContent value="media" className="space-y-3">
            {REWARDS.media.map(renderItem)}
          </TabsContent>
        </Tabs>
      </div>

      {/* Featured Course Banner */}
      <div className="px-4 py-4">
        <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 border-0 text-white overflow-hidden">
          <CardContent className="p-5">
            <Badge className="bg-white/20 text-white border-0 mb-3">
              ⭐ FEATURED
            </Badge>
            <h3 className="font-display font-bold text-xl mb-2">Nuclear Science Course</h3>
            <p className="text-white/70 text-sm mb-4">
              Complete certification with modules on Quantum Mechanics, Nuclear Power Plants, 
              Nuclear Waste, Safety & Radiation.
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs">Duration: 3 months</p>
                <p className="text-white/60 text-xs">5 Topics</p>
              </div>
              <Button 
                className="bg-white text-purple-600 hover:bg-white/90"
                onClick={() => navigate("/course/nuclear-science")}
              >
                Get Certified Now!
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
