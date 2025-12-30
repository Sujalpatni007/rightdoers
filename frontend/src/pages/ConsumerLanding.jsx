import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft,
  Search,
  MapPin,
  Briefcase,
  ChevronRight,
  Heart,
  Shield,
  Laptop,
  GraduationCap,
  Banknote,
  Truck,
  Utensils,
  Dumbbell,
  Palette,
  Microscope,
  Scale,
  FileText,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/App";

const SERVICE_CATEGORIES = [
  { id: "Health", name: "Health & Care", icon: Heart, color: "bg-red-500", services: ["Nurse", "Caretaker", "Physiotherapist", "Doctor Visit"] },
  { id: "Technology", name: "Tech Services", icon: Laptop, color: "bg-blue-500", services: ["Computer Repair", "App Developer", "IT Support", "Web Design"] },
  { id: "Education", name: "Education", icon: GraduationCap, color: "bg-purple-500", services: ["Tutor", "Music Teacher", "Language Coach", "Career Counselor"] },
  { id: "Finance & Banking", name: "Finance", icon: Banknote, color: "bg-amber-500", services: ["CA Services", "Tax Filing", "Financial Advisor", "Loan Agent"] },
  { id: "Transport & Logistics", name: "Transport", icon: Truck, color: "bg-cyan-500", services: ["Driver", "Delivery", "Packers & Movers", "Courier"] },
  { id: "Food & Agriculture", name: "Food & Home", icon: Utensils, color: "bg-orange-500", services: ["Cook", "House Help", "Gardener", "Caterer"] },
  { id: "Sport", name: "Fitness", icon: Dumbbell, color: "bg-green-500", services: ["Personal Trainer", "Yoga Instructor", "Sports Coach", "Dietitian"] },
  { id: "Art", name: "Creative", icon: Palette, color: "bg-pink-500", services: ["Photographer", "Designer", "Video Editor", "Content Writer"] },
  { id: "Science", name: "Science", icon: Microscope, color: "bg-indigo-500", services: ["Lab Technician", "Research Assistant", "Data Analyst", "QC Inspector"] },
  { id: "Legal", name: "Legal", icon: Scale, color: "bg-slate-500", services: ["Lawyer", "Notary", "Document Writer", "Legal Advisor"] },
  { id: "Security", name: "Security", icon: Shield, color: "bg-gray-600", services: ["Security Guard", "CCTV Operator", "Bouncer", "Investigation"] },
  { id: "Policy", name: "Admin", icon: FileText, color: "bg-teal-500", services: ["Office Admin", "Data Entry", "Receptionist", "HR Services"] },
];

export default function ConsumerLanding() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [pincode, setPincode] = useState("");

  const filteredCategories = SERVICE_CATEGORIES.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.services.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-green-600 to-emerald-700 text-white p-4 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate("/welcome")}
            data-testid="consumer-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-xl font-bold">How Can I Help You?</h1>
            <p className="text-white/70 text-sm">Find verified Doers at your pincode</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search services... (Nurse, Tutor, Driver)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12 bg-white text-slate-900 border-0 rounded-xl"
            data-testid="service-search"
          />
        </div>
      </header>

      {/* Pincode Selector */}
      <div className="px-4 -mt-16 relative z-10 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-500">Your Location</p>
              <Input
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="h-10 border-0 p-0 text-lg font-semibold focus-visible:ring-0"
                data-testid="consumer-pincode"
              />
            </div>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Find
            </Button>
          </div>
        </div>
      </div>

      {/* Service Categories */}
      <div className="px-4 pb-8">
        <h2 className="font-display font-semibold text-slate-900 mb-4">Browse Services</h2>
        <div className="grid grid-cols-2 gap-3">
          {filteredCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/providers/${cat.id}`)}
              className="bg-white rounded-xl p-4 text-left shadow-sm border hover:shadow-md transition-all group"
              data-testid={`category-${cat.id.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`}
            >
              <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <cat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{cat.name}</h3>
              <p className="text-xs text-slate-500">{cat.services.slice(0, 2).join(", ")}...</p>
              <ChevronRight className="w-5 h-5 text-slate-300 absolute top-4 right-4 group-hover:text-slate-500" />
            </button>
          ))}
        </div>
      </div>

      {/* AIMEE Helper */}
      <div className="px-4 pb-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-lg">Can't find what you need?</h3>
              <p className="text-white/70 text-sm">Ask AIMEE to help you</p>
            </div>
            <Button 
              className="bg-white text-purple-600 hover:bg-white/90"
              onClick={() => navigate("/auth?role=consumer")}
            >
              Ask
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
