import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  ArrowLeft,
  Search,
  MapPin,
  Star,
  Phone,
  MessageCircle,
  Award,
  Clock,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { API } from "@/App";

// Mock service providers data
const MOCK_PROVIDERS = [
  { id: "1", name: "Priya Sharma", division: "Health", level: "L2", psy_score: 78, skill_score: 82, pincode: "560001", rating: 4.8, reviews: 124, hourly_rate: 500, available: true },
  { id: "2", name: "Rajesh Kumar", division: "Health", level: "L3", psy_score: 85, skill_score: 88, pincode: "560002", rating: 4.9, reviews: 256, hourly_rate: 800, available: true },
  { id: "3", name: "Anita Devi", division: "Health", level: "L1", psy_score: 72, skill_score: 70, pincode: "560001", rating: 4.5, reviews: 45, hourly_rate: 350, available: false },
  { id: "4", name: "Suresh Reddy", division: "Technology", level: "L3", psy_score: 90, skill_score: 92, pincode: "560003", rating: 4.9, reviews: 312, hourly_rate: 1500, available: true },
  { id: "5", name: "Meena Patel", division: "Education", level: "L2", psy_score: 80, skill_score: 85, pincode: "560001", rating: 4.7, reviews: 189, hourly_rate: 600, available: true },
];

export default function ServiceProviders() {
  const navigate = useNavigate();
  const { category } = useParams();
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, [category]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      // Try to get real users from API
      const res = await axios.get(`${API}/jobs`, { params: { division: category } });
      // For now, use mock data as we don't have service providers in DB yet
      const filteredMock = MOCK_PROVIDERS.filter(p => 
        p.division.toLowerCase() === category?.toLowerCase() || 
        !category
      );
      setProviders(filteredMock.length > 0 ? filteredMock : MOCK_PROVIDERS);
    } catch (error) {
      setProviders(MOCK_PROVIDERS);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (provider) => {
    toast.success(`Request sent to ${provider.name}!`);
    setSelectedProvider(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="p-4 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/services")}
            data-testid="providers-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display font-semibold text-lg">{category || "All"} Services</h1>
            <p className="text-sm text-slate-500">Verified Doers near you</p>
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search providers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11"
              data-testid="provider-search"
            />
          </div>
        </div>
      </header>

      {/* Providers List */}
      <div className="p-4 space-y-3">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-slate-200 rounded-xl" />
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))
        ) : providers.length > 0 ? (
          providers
            .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
            .map((provider) => {
              const passScore = Math.round((provider.psy_score + provider.skill_score) / 2);
              return (
                <button
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider)}
                  className="w-full text-left bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-all"
                  data-testid={`provider-${provider.id}`}
                >
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      {provider.name.charAt(0)}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{provider.name}</h3>
                        {provider.available && (
                          <Badge className="bg-green-100 text-green-700 text-xs">Available</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                        <Badge variant="outline" className="text-xs">{provider.level}</Badge>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {provider.rating}
                        </span>
                        <span>({provider.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {provider.pincode}
                        </span>
                        <span className="font-semibold text-indigo-600">₹{provider.hourly_rate}/hr</span>
                      </div>
                    </div>

                    {/* PASS Score */}
                    <div className="text-center">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-indigo-600">{passScore}</span>
                      </div>
                      <span className="text-xs text-slate-400">PASS</span>
                    </div>
                  </div>
                </button>
              );
            })
        ) : (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-900 mb-2">No providers found</h3>
            <p className="text-slate-500 text-sm">Try a different search or category</p>
          </div>
        )}
      </div>

      {/* Provider Detail Sheet */}
      <Sheet open={!!selectedProvider} onOpenChange={() => setSelectedProvider(null)}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
          {selectedProvider && (
            <>
              <SheetHeader className="text-left pb-4 border-b">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl">
                    {selectedProvider.name.charAt(0)}
                  </div>
                  <div>
                    <SheetTitle className="font-display text-xl">{selectedProvider.name}</SheetTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge>{selectedProvider.level}</Badge>
                      <span className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {selectedProvider.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <div className="py-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-indigo-600">
                      {Math.round((selectedProvider.psy_score + selectedProvider.skill_score) / 2)}
                    </p>
                    <p className="text-xs text-slate-500">PASS Score</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-slate-900">{selectedProvider.reviews}</p>
                    <p className="text-xs text-slate-500">Reviews</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">₹{selectedProvider.hourly_rate}</p>
                    <p className="text-xs text-slate-500">Per Hour</p>
                  </div>
                </div>

                {/* Verification Badge */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <Award className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-800">DoersID Verified</p>
                    <p className="text-sm text-green-600">Background checked & skill assessed</p>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <div className="flex-1">
                    <p className="font-medium">Availability</p>
                    <p className="text-sm text-slate-500">Mon-Sat, 9AM-6PM</p>
                  </div>
                  {selectedProvider.available ? (
                    <Badge className="bg-green-100 text-green-700">Available Now</Badge>
                  ) : (
                    <Badge variant="outline">Busy</Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="flex-1 h-12"
                  onClick={() => toast.info("Calling feature coming soon")}
                >
                  <Phone className="w-5 h-5 mr-2" /> Call
                </Button>
                <Button 
                  className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => handleBooking(selectedProvider)}
                  data-testid="book-provider-btn"
                >
                  <MessageCircle className="w-5 h-5 mr-2" /> Book Now
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
