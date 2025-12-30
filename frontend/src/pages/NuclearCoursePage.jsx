import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Lock,
  Check,
  Play,
  Clock,
  Award,
  ChevronRight,
  Download,
  Share2
} from "lucide-react";
import { toast } from "sonner";
import confetti from 'canvas-confetti';
import { useAuth } from "@/App";

const COURSE_DATA = {
  id: "nuclear-science",
  title: "Nuclear Science Course",
  icon: "☢️",
  duration: "3 months",
  totalTopics: 5,
  completedTopics: 0,
  topics: [
    { id: 1, name: "Quantum Mechanics", duration: "2 weeks", status: "locked", lessons: 8 },
    { id: 2, name: "Nuclear Power Plants", duration: "3 weeks", status: "locked", lessons: 12 },
    { id: 3, name: "Nuclear Waste Management", duration: "2 weeks", status: "locked", lessons: 6 },
    { id: 4, name: "Nuclear Safety", duration: "2 weeks", status: "locked", lessons: 8 },
    { id: 5, name: "Radiation Protection", duration: "3 weeks", status: "locked", lessons: 10 }
  ],
  certification: {
    name: "Nuclear Science Fundamentals",
    issuer: "Right Doers Academy",
    validFor: "Lifetime"
  }
};

export default function NuclearCoursePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const handleEnroll = () => {
    setEnrolled(true);
    toast.success("Successfully enrolled in Nuclear Science Course!");
  };

  const handleCompleteCourse = () => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setShowCertificate(true);
  };

  const progress = (COURSE_DATA.completedTopics / COURSE_DATA.totalTopics) * 100;

  if (showCertificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-4">
            🎉 CONGRATULATIONS!
          </Badge>
          
          <h1 className="font-display text-2xl font-bold text-white mb-6">
            You have been successfully certified in
          </h1>

          {/* Certificate Card */}
          <Card className="bg-gradient-to-br from-amber-100 to-orange-100 border-amber-300 mb-6">
            <CardContent className="p-6">
              <div className="border-4 border-amber-400 rounded-lg p-6">
                <Award className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                <p className="text-amber-800 text-sm uppercase tracking-wide mb-2">Certificate of Completion</p>
                <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">
                  {COURSE_DATA.certification.name}
                </h2>
                <p className="text-slate-600 mb-4">Awarded to</p>
                <p className="font-display text-xl font-bold text-slate-900 mb-4">
                  {user?.name || 'Student'}
                </p>
                <div className="flex justify-center gap-4 text-sm text-slate-500">
                  <span>Issued by: {COURSE_DATA.certification.issuer}</span>
                </div>
                <p className="text-slate-400 text-xs mt-4">
                  Date: {new Date().toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <Button 
              variant="outline"
              className="flex-1 h-12 border-white/20 text-white hover:bg-white/10"
              onClick={() => toast.success("Certificate downloaded!")}
            >
              <Download className="mr-2 w-4 h-4" /> Download
            </Button>
            <Button 
              variant="outline"
              className="flex-1 h-12 border-white/20 text-white hover:bg-white/10"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'My Certificate',
                    text: `I just completed the Nuclear Science Course on Right Doers World! 🎓`,
                    url: 'https://hi-ai-app.com'
                  });
                }
              }}
            >
              <Share2 className="mr-2 w-4 h-4" /> Share
            </Button>
          </div>

          <Button 
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600"
            onClick={() => navigate("/progress-dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1" />
          <Badge className="bg-white/20 text-white border-0">
            {COURSE_DATA.duration}
          </Badge>
        </div>

        <div className="text-center">
          <span className="text-5xl mb-4 block">{COURSE_DATA.icon}</span>
          <h1 className="font-display text-2xl font-bold mb-2">{COURSE_DATA.title}</h1>
          <p className="text-white/70">{COURSE_DATA.totalTopics} Topics • Certificate Included</p>
        </div>

        {enrolled && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/70">Progress</span>
              <span className="text-white">{COURSE_DATA.completedTopics}/{COURSE_DATA.totalTopics} completed</span>
            </div>
            <Progress value={progress} className="h-2 bg-white/20" />
          </div>
        )}
      </header>

      {/* Content */}
      <div className="px-4 py-4 -mt-4">
        {/* Topics List */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-semibold text-slate-900 mb-4">Course Topics</h3>
            <div className="space-y-3">
              {COURSE_DATA.topics.map((topic, index) => (
                <button
                  key={topic.id}
                  data-testid={`topic-${topic.id}`}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                    enrolled && index === 0 
                      ? 'bg-indigo-50 border border-indigo-200' 
                      : 'bg-slate-50'
                  }`}
                  onClick={() => enrolled && index === 0 && toast.info("Starting lesson...")}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    enrolled && index === 0 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    {enrolled && index === 0 ? (
                      <Play className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium ${
                      enrolled && index === 0 ? 'text-slate-900' : 'text-slate-400'
                    }`}>{topic.name}</p>
                    <p className="text-slate-400 text-xs">
                      {topic.lessons} lessons • {topic.duration}
                    </p>
                  </div>
                  {enrolled && index === 0 && (
                    <ChevronRight className="w-5 h-5 text-indigo-500" />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certification Info */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Award className="w-12 h-12 text-amber-600" />
              <div>
                <h4 className="font-semibold text-slate-900">Certification Included</h4>
                <p className="text-slate-600 text-sm">
                  Complete all topics to earn your {COURSE_DATA.certification.name} certificate.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        {!enrolled ? (
          <Button 
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600"
            onClick={handleEnroll}
            data-testid="enroll-btn"
          >
            Get Certified Now!
          </Button>
        ) : (
          <Button 
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600"
            onClick={handleCompleteCourse}
          >
            <Check className="mr-2" /> Complete Course (Demo)
          </Button>
        )}
      </div>
    </div>
  );
}
