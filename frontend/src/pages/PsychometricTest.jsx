import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Brain, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth, API } from "@/App";

// Big 5 Personality Questions (OCEAN Model)
const QUESTIONS = [
  { id: 1, text: "I enjoy solving complex puzzles and problems", trait: "openness", emoji: "🧩" },
  { id: 2, text: "I prefer to plan things in advance", trait: "conscientiousness", emoji: "📋" },
  { id: 3, text: "I feel energized after meeting new people", trait: "extraversion", emoji: "🎉" },
  { id: 4, text: "I often help others without expecting anything", trait: "agreeableness", emoji: "🤝" },
  { id: 5, text: "I stay calm under pressure", trait: "stability", emoji: "🧘" },
  { id: 6, text: "I love learning new skills and technologies", trait: "openness", emoji: "💡" },
  { id: 7, text: "I complete tasks before deadlines", trait: "conscientiousness", emoji: "⏰" },
  { id: 8, text: "I enjoy being the center of attention", trait: "extraversion", emoji: "🌟" },
  { id: 9, text: "I trust people easily", trait: "agreeableness", emoji: "💚" },
  { id: 10, text: "I rarely feel anxious or worried", trait: "stability", emoji: "😌" },
  { id: 11, text: "I enjoy creative activities like art or music", trait: "openness", emoji: "🎨" },
  { id: 12, text: "I pay attention to small details", trait: "conscientiousness", emoji: "🔍" },
  { id: 13, text: "I make friends easily", trait: "extraversion", emoji: "👋" },
  { id: 14, text: "I avoid conflicts and arguments", trait: "agreeableness", emoji: "☮️" },
  { id: 15, text: "I bounce back quickly from setbacks", trait: "stability", emoji: "💪" },
];

const SCALE_OPTIONS = [
  { value: 1, label: "Strongly Disagree", color: "bg-red-500" },
  { value: 2, label: "Disagree", color: "bg-orange-500" },
  { value: 3, label: "Neutral", color: "bg-yellow-500" },
  { value: 4, label: "Agree", color: "bg-lime-500" },
  { value: 5, label: "Strongly Agree", color: "bg-green-500" },
];

export default function PsychometricTest() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);

  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;
  const question = QUESTIONS[currentQ];

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [question.id]: value });
    
    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300);
    }
  };

  const calculateScore = () => {
    const traits = { openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, stability: 0 };
    const traitCounts = { openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, stability: 0 };
    
    QUESTIONS.forEach((q) => {
      if (answers[q.id]) {
        traits[q.trait] += answers[q.id];
        traitCounts[q.trait]++;
      }
    });
    
    // Calculate percentages
    const scores = {};
    Object.keys(traits).forEach((trait) => {
      scores[trait] = Math.round((traits[trait] / (traitCounts[trait] * 5)) * 100);
    });
    
    // Overall psy score (average)
    const psyScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 5);
    
    return { traits: scores, psyScore };
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < QUESTIONS.length) {
      toast.error("Please answer all questions");
      return;
    }

    setLoading(true);
    try {
      const { traits, psyScore } = calculateScore();
      
      // Generate skill score based on answers (mock for now)
      const skillScore = Math.round(50 + Math.random() * 40);
      
      await axios.put(`${API}/users/${user.id}`, {
        psy_score: psyScore,
        skill_score: skillScore,
        personality_traits: traits
      });
      
      updateUser({ psy_score: psyScore, skill_score: skillScore, personality_traits: traits });
      
      setResult({ traits, psyScore, skillScore });
      setShowResult(true);
    } catch (error) {
      toast.error("Failed to save results");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate("/doersid");
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-2">
              Test Complete!
            </h1>
            <p className="text-white/50">Here's what we discovered about you</p>
          </div>

          {/* PASS Score Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 mb-6 shadow-2xl">
            <div className="text-center mb-4">
              <p className="text-white/70 text-sm uppercase tracking-wide">Your PASS Score</p>
              <p className="font-display text-6xl font-bold text-white mt-2">
                {Math.round((result.psyScore + result.skillScore) / 2)}
              </p>
              <p className="text-white/50 text-sm mt-1">out of 100</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-white/60 text-xs">Psychological</p>
                <p className="font-bold text-2xl text-white">{result.psyScore}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-white/60 text-xs">Skill Potential</p>
                <p className="font-bold text-2xl text-white">{result.skillScore}</p>
              </div>
            </div>
          </div>

          {/* Traits Breakdown */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
            <h3 className="font-semibold text-white mb-4">Your Personality Traits</h3>
            <div className="space-y-3">
              {Object.entries(result.traits).map(([trait, score]) => (
                <div key={trait}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70 capitalize">{trait}</span>
                    <span className="text-white font-medium">{score}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button 
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
            onClick={handleContinue}
            data-testid="view-doersid-btn"
          >
            View Your DoersID <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={() => currentQ > 0 ? setCurrentQ(currentQ - 1) : navigate(-1)}
          data-testid="psy-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <Progress value={progress} className="h-2 bg-white/10" />
        </div>
        <span className="text-sm text-white/50 font-medium">{currentQ + 1}/{QUESTIONS.length}</span>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-white/50 text-sm uppercase tracking-wide">Big 5 Personality Test</h2>
          </div>

          {/* Question Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6 animate-fade-in" key={currentQ}>
            <div className="text-6xl text-center mb-4">{question.emoji}</div>
            <p className="text-white text-xl font-medium text-center leading-relaxed">
              "{question.text}"
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {SCALE_OPTIONS.map((option) => {
              const isSelected = answers[question.id] === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`
                    w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3
                    ${isSelected 
                      ? "border-white bg-white/20" 
                      : "border-white/10 bg-white/5 hover:border-white/30"}
                  `}
                  data-testid={`answer-${option.value}`}
                >
                  <div className={`w-6 h-6 rounded-full ${option.color} flex items-center justify-center`}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-white font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      {currentQ === QUESTIONS.length - 1 && Object.keys(answers).length >= QUESTIONS.length && (
        <div className="p-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
          <Button 
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
            onClick={handleSubmit}
            disabled={loading}
            data-testid="submit-test-btn"
          >
            {loading ? "Analyzing..." : "See My Results"} <Sparkles className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
