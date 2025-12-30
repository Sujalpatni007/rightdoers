import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/App";

const AMAZING_PEOPLE = [
  {
    id: 1,
    name: "Dr. APJ Abdul Kalam",
    title: "11th President of India",
    subtitle: "Missile Man & Nuclear Visionary",
    image: "🚀",
    bio: "From a humble fisherman's son to the President of India, Dr. Kalam led India's nuclear and missile programs. He believed every young person has the potential to achieve greatness through dedication and curiosity.",
    traits: ["Curious", "Resilient", "Visionary", "Humble"],
    career: "Nuclear Engineer → Scientist → President",
    quote: "Dream is not that which you see while sleeping, it is something that does not let you sleep.",
    division: "Science",
    relevance: "nuclear"
  },
  {
    id: 2,
    name: "Dr. Homi J. Bhabha",
    title: "Father of Indian Nuclear Programme",
    subtitle: "Founder of BARC & TIFR",
    image: "⚛️",
    bio: "Dr. Bhabha envisioned India's three-stage nuclear power program in 1954. His foresight laid the foundation for India's nuclear energy independence. He proved that a developing nation can achieve scientific excellence.",
    traits: ["Innovative", "Strategic", "Determined", "Patriotic"],
    career: "Physicist → Institution Builder → Nuclear Pioneer",
    quote: "No power on Earth can stop an idea whose time has come.",
    division: "Science",
    relevance: "nuclear"
  },
  {
    id: 3,
    name: "Dr. Tessy Thomas",
    title: "Missile Woman of India",
    subtitle: "Project Director, Agni-IV & Agni-V",
    image: "🎯",
    bio: "Dr. Tessy Thomas broke barriers as the first woman to head a missile project in India. She led the development of Agni-IV and Agni-V missiles, proving that gender is no barrier to excellence in science and technology.",
    traits: ["Pioneer", "Leader", "Persistent", "Inspiring"],
    career: "Engineer → Scientist → Project Director",
    quote: "Nothing is impossible. If you dream it, you can achieve it.",
    division: "Technology",
    relevance: "nuclear"
  },
  {
    id: 4,
    name: "Sundar Pichai",
    title: "CEO of Google & Alphabet",
    subtitle: "From Chennai to Silicon Valley",
    image: "🌐",
    bio: "From a middle-class family in Chennai without a computer at home, Sundar rose to lead one of the world's most valuable companies. His journey shows that talent combined with opportunity can achieve anything.",
    traits: ["Adaptable", "Innovative", "Calm", "Strategic"],
    career: "Engineer → Product Manager → CEO",
    quote: "Wear your failures as a badge of honor.",
    division: "Technology",
    relevance: "tech"
  }
];

export default function AmazingPeoplePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const currentPerson = AMAZING_PEOPLE[currentIndex];
  const progress = ((currentIndex + 1) / AMAZING_PEOPLE.length) * 100;

  const handleYes = () => {
    if (!selectedPeople.includes(currentPerson.id)) {
      setSelectedPeople([...selectedPeople, currentPerson.id]);
    }
    if (currentIndex < AMAZING_PEOPLE.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Save and continue
      updateUser({ inspirations: selectedPeople.concat(currentPerson.id) });
      navigate("/self-rating");
    }
  };

  const handleSkip = () => {
    if (currentIndex < AMAZING_PEOPLE.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      updateUser({ inspirations: selectedPeople });
      navigate("/self-rating");
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={handleBack}
          data-testid="amazing-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <Progress value={progress} className="h-2 bg-white/10" />
        </div>
        <span className="text-sm text-white/50 font-medium">{currentIndex + 1}/{AMAZING_PEOPLE.length}</span>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 pb-32 overflow-y-auto">
        <div className="max-w-md mx-auto">
          {/* Section Title */}
          <div className="text-center mb-6">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-3">
              ✨ AMAZING PEOPLE
            </Badge>
            <h1 className="font-display text-2xl font-bold text-white mb-2">
              Who Inspires You?
            </h1>
            <p className="text-white/50 text-sm">
              Learn from those who walked the path before you
            </p>
          </div>

          {/* Person Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 mb-6 animate-fade-in" key={currentPerson.id}>
            {/* Avatar & Name */}
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-5xl shadow-2xl">
                {currentPerson.image}
              </div>
              <h2 className="font-display font-bold text-xl text-white">
                {currentPerson.name}
              </h2>
              <p className="text-amber-400 font-medium text-sm">{currentPerson.title}</p>
              <p className="text-white/50 text-xs mt-1">{currentPerson.subtitle}</p>
            </div>

            {/* Career Path */}
            <div className="bg-white/5 rounded-xl p-3 mb-4">
              <p className="text-white/40 text-xs uppercase mb-1">Career Journey</p>
              <p className="text-white font-medium text-sm">{currentPerson.career}</p>
            </div>

            {/* Bio */}
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              {currentPerson.bio}
            </p>

            {/* Quote */}
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4 mb-4">
              <p className="text-amber-300 text-sm italic">
                "{currentPerson.quote}"
              </p>
            </div>

            {/* Traits */}
            <div className="flex flex-wrap gap-2">
              {currentPerson.traits.map((trait) => (
                <Badge key={trait} variant="outline" className="text-white/70 border-white/20">
                  {trait}
                </Badge>
              ))}
            </div>
          </div>

          {/* Question */}
          <div className="text-center">
            <p className="text-white/70 mb-4">
              Does <span className="text-amber-400 font-semibold">{currentPerson.name}</span> inspire you?
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
        <div className="max-w-md mx-auto flex gap-3">
          <Button 
            variant="outline"
            className="flex-1 h-14 text-lg border-white/20 text-white hover:bg-white/10"
            onClick={handleSkip}
            data-testid="skip-btn"
          >
            Skip
          </Button>
          <Button 
            className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90"
            onClick={handleYes}
            data-testid="yes-inspire-btn"
          >
            <Heart className="w-5 h-5 mr-2 fill-white" /> Yes!
          </Button>
        </div>
        
        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {AMAZING_PEOPLE.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? "bg-amber-400 w-6" : 
                selectedPeople.includes(AMAZING_PEOPLE[i].id) ? "bg-green-500" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
