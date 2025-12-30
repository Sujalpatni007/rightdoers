import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, Briefcase, User } from "lucide-react";

export default function BottomNavNew({ active }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const items = [
    { id: "home", icon: Home, label: "Home", path: "/dashboard" },
    { id: "clubs", icon: Users, label: "Clubs", path: "/clubs" },
    { id: "gigs", icon: Briefcase, label: "Gigs", path: "/gigs" },
    { id: "profile", icon: User, label: "Profile", path: "/profile" },
  ];

  const currentActive = active || items.find(item => location.pathname === item.path)?.id || "home";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t safe-bottom z-50 shadow-lg">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 px-6 py-2 transition-all duration-200 ${
              currentActive === item.id 
                ? "text-amber-600 scale-105" 
                : "text-slate-400 hover:text-slate-600"
            }`}
            data-testid={`nav-${item.id}`}
          >
            <div className={`relative ${
              currentActive === item.id ? "" : ""
            }`}>
              {item.id === "gigs" && currentActive !== "gigs" && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              )}
              <item.icon className={`w-6 h-6 ${
                currentActive === item.id ? "stroke-[2.5px]" : ""
              }`} />
            </div>
            <span className={`text-xs font-medium ${
              currentActive === item.id ? "font-semibold" : ""
            }`}>{item.label}</span>
            {currentActive === item.id && (
              <div className="absolute bottom-0 w-12 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
