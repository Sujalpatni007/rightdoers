import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  ArrowRight, 
  Brain, 
  Sparkles, 
  Check,
  Heart,
  Shield,
  Users,
  Star,
  Target,
  Rocket,
  Coins,
  MessageCircle,
  Send,
  Mic,
  Volume2
} from "lucide-react";
import { toast } from "sonner";
import { useAuth, API } from "@/App";
import { useLanguage } from "@/context/LanguageContext";
import AstroDoer from "@/components/AstroDoer";

// Multi-lingual Assessment Content
const ASSESSMENT_CONTENT = {
  en: {
    title: "Agent AIMEE",
    subtitle: "AI Analyzer for Your Career Journey",
    welcome: "Hi! I'm AIMEE, your AI career companion. Let's discover your unique talents together!",
    sections: {
      character: "CHARACTER",
      career: "CAREER CHOICE",
      skills: "SKILLS-SALARY"
    },
    characterTitle: "Core Concerns",
    careerTitle: "Why This Career?",
    skillsTitle: "Skills-Salary Match",
    dcoinReward: "D-COIN Reward",
    letsStart: "Let's Start",
    continue: "Continue",
    seeResults: "See My Results",
    analyzingText: "AIMEE is analyzing your profile...",
    completeText: "Analysis Complete!",
    doersIdReady: "Your DoersID is ready!"
  },
  hi: {
    title: "एजेंट AIMEE",
    subtitle: "आपके करियर यात्रा के लिए AI विश्लेषक",
    welcome: "नमस्ते! मैं AIMEE हूं, आपका AI करियर साथी। चलिए साथ में आपकी अनूठी प्रतिभाओं की खोज करते हैं!",
    sections: {
      character: "चरित्र",
      career: "करियर चुनाव",
      skills: "कौशल-वेतन"
    },
    characterTitle: "मूल चिंताएं",
    careerTitle: "यह करियर क्यों?",
    skillsTitle: "कौशल-वेतन मिलान",
    dcoinReward: "D-COIN पुरस्कार",
    letsStart: "शुरू करें",
    continue: "जारी रखें",
    seeResults: "मेरे परिणाम देखें",
    analyzingText: "AIMEE आपकी प्रोफाइल का विश्लेषण कर रही है...",
    completeText: "विश्लेषण पूर्ण!",
    doersIdReady: "आपका DoersID तैयार है!"
  },
  kn: {
    title: "ಏಜೆಂಟ್ AIMEE",
    subtitle: "ನಿಮ್ಮ ವೃತ್ತಿ ಪ್ರಯಾಣಕ್ಕೆ AI ವಿಶ್ಲೇಷಕ",
    welcome: "ನಮಸ್ಕಾರ! ನಾನು AIMEE, ನಿಮ್ಮ AI ವೃತ್ತಿ ಸಹಚರ. ನಿಮ್ಮ ಅನನ್ಯ ಪ್ರತಿಭೆಗಳನ್ನು ಒಟ್ಟಿಗೆ ಕಂಡುಹಿಡಿಯೋಣ!",
    sections: {
      character: "ಸ್ವಭಾವ",
      career: "ವೃತ್ತಿ ಆಯ್ಕೆ",
      skills: "ಕೌಶಲ್ಯ-ಸಂಬಳ"
    },
    characterTitle: "ಮೂಲ ಕಾಳಜಿಗಳು",
    careerTitle: "ಈ ವೃತ್ತಿ ಏಕೆ?",
    skillsTitle: "ಕೌಶಲ್ಯ-ಸಂಬಳ ಹೊಂದಾಣಿಕೆ",
    dcoinReward: "D-COIN ಪ್ರತಿಫಲ",
    letsStart: "ಪ್ರಾರಂಭಿಸೋಣ",
    continue: "ಮುಂದುವರಿಸಿ",
    seeResults: "ನನ್ನ ಫಲಿತಾಂಶಗಳನ್ನು ನೋಡಿ",
    analyzingText: "AIMEE ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಅನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...",
    completeText: "ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣ!",
    doersIdReady: "ನಿಮ್ಮ DoersID ಸಿದ್ಧವಾಗಿದೆ!"
  },
  ta: {
    title: "ஏஜென்ட் AIMEE",
    subtitle: "உங்கள் தொழில் பயணத்திற்கான AI பகுப்பாய்வாளர்",
    welcome: "வணக்கம்! நான் AIMEE, உங்கள் AI தொழில் துணைவர். உங்கள் தனித்துவமான திறமைகளை கண்டறிவோம்!",
    sections: {
      character: "குணம்",
      career: "தொழில் தேர்வு",
      skills: "திறன்-சம்பளம்"
    },
    characterTitle: "முக்கிய கவலைகள்",
    careerTitle: "இந்த தொழில் ஏன்?",
    skillsTitle: "திறன்-சம்பள பொருத்தம்",
    dcoinReward: "D-COIN வெகுமதி",
    letsStart: "தொடங்குவோம்",
    continue: "தொடரவும்",
    seeResults: "என் முடிவுகளைப் பார்",
    analyzingText: "AIMEE உங்கள் சுயவிவரத்தை பகுப்பாய்வு செய்கிறது...",
    completeText: "பகுப்பாய்வு முடிந்தது!",
    doersIdReady: "உங்கள் DoersID தயார்!"
  },
  te: {
    title: "ఏజెంట్ AIMEE",
    subtitle: "మీ కెరీర్ ప్రయాణం కోసం AI విశ్లేషకుడు",
    welcome: "హాయ్! నేను AIMEE, మీ AI కెరీర్ సహచరుడు. మీ ప్రత్యేక ప్రతిభలను కలిసి కనుగొందాం!",
    sections: {
      character: "స్వభావం",
      career: "కెరీర్ ఎంపిక",
      skills: "నైపుణ్యాలు-జీతం"
    },
    characterTitle: "ముఖ్య ఆందోళనలు",
    careerTitle: "ఈ కెరీర్ ఎందుకు?",
    skillsTitle: "నైపుణ్యాలు-జీతం సరిపోలిక",
    dcoinReward: "D-COIN బహుమతి",
    letsStart: "ప్రారంభించండి",
    continue: "కొనసాగించు",
    seeResults: "నా ఫలితాలు చూడు",
    analyzingText: "AIMEE మీ ప్రొఫైల్‌ను విశ్లేషిస్తోంది...",
    completeText: "విశ్లేషణ పూర్తి!",
    doersIdReady: "మీ DoersID సిద్ధంగా ఉంది!"
  }
};

// SECTION 1: CHARACTER Assessment - Core Concerns (Maslow-based)
const CHARACTER_QUESTIONS = {
  en: [
    {
      id: "char_1",
      category: "safety",
      icon: "🛡️",
      question: "What matters most to you right now?",
      subtext: "Choose what resonates with your current situation",
      options: [
        { id: "a", text: "Financial stability & regular income", value: "survival", score: 1 },
        { id: "b", text: "Job security & career growth", value: "safety", score: 2 },
        { id: "c", text: "Recognition & respect from others", value: "esteem", score: 3 },
        { id: "d", text: "Doing meaningful work I love", value: "purpose", score: 4 }
      ]
    },
    {
      id: "char_2",
      category: "belonging",
      icon: "🤝",
      question: "In your ideal workplace, you want to...",
      subtext: "Think about your preferred work environment",
      options: [
        { id: "a", text: "Work independently with clear tasks", value: "independent", score: 2 },
        { id: "b", text: "Be part of a close-knit team", value: "collaborative", score: 3 },
        { id: "c", text: "Lead and inspire others", value: "leadership", score: 4 },
        { id: "d", text: "Create and innovate freely", value: "creative", score: 4 }
      ]
    },
    {
      id: "char_3",
      category: "growth",
      icon: "🌱",
      question: "When facing a challenge, you typically...",
      subtext: "How do you respond to difficulties?",
      options: [
        { id: "a", text: "Seek help from others immediately", value: "support_seeking", score: 2 },
        { id: "b", text: "Try to solve it step by step", value: "methodical", score: 3 },
        { id: "c", text: "See it as an opportunity to learn", value: "growth_mindset", score: 4 },
        { id: "d", text: "Find creative alternatives", value: "innovative", score: 4 }
      ]
    },
    {
      id: "char_4",
      category: "values",
      icon: "💎",
      question: "What would make you feel successful?",
      subtext: "Your definition of success",
      options: [
        { id: "a", text: "Earning enough to support my family", value: "provider", score: 2 },
        { id: "b", text: "Being the best at what I do", value: "excellence", score: 3 },
        { id: "c", text: "Making a positive impact on society", value: "impact", score: 4 },
        { id: "d", text: "Achieving work-life balance & happiness", value: "harmony", score: 4 }
      ]
    },
    {
      id: "char_5",
      category: "motivation",
      icon: "🔥",
      question: "What drives you to work hard?",
      subtext: "Your primary motivation",
      options: [
        { id: "a", text: "Fear of failure or falling behind", value: "fear", score: 1 },
        { id: "b", text: "Desire for rewards & recognition", value: "reward", score: 2 },
        { id: "c", text: "Passion for what I do", value: "passion", score: 4 },
        { id: "d", text: "Want to prove my capabilities", value: "proving", score: 3 }
      ]
    }
  ],
  hi: [
    {
      id: "char_1",
      category: "safety",
      icon: "🛡️",
      question: "अभी आपके लिए सबसे महत्वपूर्ण क्या है?",
      subtext: "वह चुनें जो आपकी वर्तमान स्थिति से मेल खाता हो",
      options: [
        { id: "a", text: "वित्तीय स्थिरता और नियमित आय", value: "survival", score: 1 },
        { id: "b", text: "नौकरी की सुरक्षा और करियर विकास", value: "safety", score: 2 },
        { id: "c", text: "दूसरों से मान्यता और सम्मान", value: "esteem", score: 3 },
        { id: "d", text: "अर्थपूर्ण काम करना जो मुझे पसंद है", value: "purpose", score: 4 }
      ]
    },
    {
      id: "char_2",
      category: "belonging",
      icon: "🤝",
      question: "आदर्श कार्यस्थल में आप क्या चाहते हैं?",
      subtext: "अपने पसंदीदा कार्य वातावरण के बारे में सोचें",
      options: [
        { id: "a", text: "स्पष्ट कार्यों के साथ स्वतंत्र रूप से काम करना", value: "independent", score: 2 },
        { id: "b", text: "एक करीबी टीम का हिस्सा बनना", value: "collaborative", score: 3 },
        { id: "c", text: "दूसरों का नेतृत्व और प्रेरणा देना", value: "leadership", score: 4 },
        { id: "d", text: "स्वतंत्र रूप से बनाना और नवाचार करना", value: "creative", score: 4 }
      ]
    },
    {
      id: "char_3",
      category: "growth",
      icon: "🌱",
      question: "चुनौती का सामना करते समय आप आमतौर पर...",
      subtext: "आप कठिनाइयों पर कैसे प्रतिक्रिया करते हैं?",
      options: [
        { id: "a", text: "तुरंत दूसरों से मदद मांगते हैं", value: "support_seeking", score: 2 },
        { id: "b", text: "कदम दर कदम हल करने की कोशिश करते हैं", value: "methodical", score: 3 },
        { id: "c", text: "इसे सीखने के अवसर के रूप में देखते हैं", value: "growth_mindset", score: 4 },
        { id: "d", text: "रचनात्मक विकल्प खोजते हैं", value: "innovative", score: 4 }
      ]
    },
    {
      id: "char_4",
      category: "values",
      icon: "💎",
      question: "आपको सफल महसूस क्या कराएगा?",
      subtext: "सफलता की आपकी परिभाषा",
      options: [
        { id: "a", text: "परिवार का समर्थन करने के लिए पर्याप्त कमाई", value: "provider", score: 2 },
        { id: "b", text: "जो करता हूं उसमें सर्वश्रेष्ठ होना", value: "excellence", score: 3 },
        { id: "c", text: "समाज पर सकारात्मक प्रभाव डालना", value: "impact", score: 4 },
        { id: "d", text: "कार्य-जीवन संतुलन और खुशी प्राप्त करना", value: "harmony", score: 4 }
      ]
    },
    {
      id: "char_5",
      category: "motivation",
      icon: "🔥",
      question: "आपको कड़ी मेहनत करने के लिए क्या प्रेरित करता है?",
      subtext: "आपकी प्राथमिक प्रेरणा",
      options: [
        { id: "a", text: "असफलता या पीछे रह जाने का डर", value: "fear", score: 1 },
        { id: "b", text: "पुरस्कार और मान्यता की इच्छा", value: "reward", score: 2 },
        { id: "c", text: "जो करता हूं उसके लिए जुनून", value: "passion", score: 4 },
        { id: "d", text: "अपनी क्षमताओं को साबित करना चाहता हूं", value: "proving", score: 3 }
      ]
    }
  ]
};

// SECTION 2: CAREER CHOICE - Why This Career? (Maslow Growth Matrix)
const CAREER_QUESTIONS = {
  en: [
    {
      id: "career_1",
      category: "interest",
      icon: "💡",
      question: "What type of work excites you the most?",
      subtext: "Think about activities that make time fly",
      options: [
        { id: "a", text: "Working with numbers, data & analysis", value: "analytical", division: "Finance & Banking" },
        { id: "b", text: "Helping & caring for people", value: "caring", division: "Health" },
        { id: "c", text: "Building, creating & fixing things", value: "technical", division: "Technology" },
        { id: "d", text: "Teaching, guiding & mentoring", value: "educational", division: "Education" },
        { id: "e", text: "Solving problems & strategizing", value: "strategic", division: "Policy" },
        { id: "f", text: "Physical work & being active", value: "physical", division: "Sport" }
      ]
    },
    {
      id: "career_2",
      category: "reason",
      icon: "🎯",
      question: "Why do you want to work?",
      subtext: "Be honest - there's no wrong answer",
      maslowLevel: true,
      options: [
        { id: "a", text: "I need money to survive and support family", value: "survival", level: "L1", salary: "₹15K-30K" },
        { id: "b", text: "I want stable income and job security", value: "security", level: "L2", salary: "₹30K-60K" },
        { id: "c", text: "I want career growth and recognition", value: "growth", level: "L3", salary: "₹60K-1.5L" },
        { id: "d", text: "I want to become an expert in my field", value: "mastery", level: "L4", salary: "₹1.5L-5L" },
        { id: "e", text: "I want to make a meaningful impact", value: "purpose", level: "L5", salary: "₹5L+" }
      ]
    },
    {
      id: "career_3",
      category: "environment",
      icon: "🏢",
      question: "Where would you like to work?",
      subtext: "Your preferred work setting",
      options: [
        { id: "a", text: "Government job - stability & benefits", value: "government", type: "secure" },
        { id: "b", text: "Private company - growth & salary", value: "corporate", type: "growth" },
        { id: "c", text: "Startup - innovation & ownership", value: "startup", type: "dynamic" },
        { id: "d", text: "My own business - freedom & control", value: "entrepreneur", type: "independent" },
        { id: "e", text: "Remote/Gig work - flexibility", value: "gig", type: "flexible" }
      ]
    },
    {
      id: "career_4",
      category: "aspiration",
      icon: "🚀",
      question: "In 5 years, where do you see yourself?",
      subtext: "Your career aspiration",
      options: [
        { id: "a", text: "Doing the same job but earning more", value: "stable", ambition: "low" },
        { id: "b", text: "Promoted to a senior position", value: "growth", ambition: "medium" },
        { id: "c", text: "Leading a team or department", value: "leadership", ambition: "high" },
        { id: "d", text: "Running my own company", value: "entrepreneur", ambition: "very_high" },
        { id: "e", text: "Recognized expert in my field", value: "expert", ambition: "high" }
      ]
    }
  ],
  hi: [
    {
      id: "career_1",
      category: "interest",
      icon: "💡",
      question: "किस प्रकार का काम आपको सबसे ज्यादा उत्साहित करता है?",
      subtext: "उन गतिविधियों के बारे में सोचें जिनमें समय कैसे बीत जाता है पता नहीं चलता",
      options: [
        { id: "a", text: "संख्याओं, डेटा और विश्लेषण के साथ काम", value: "analytical", division: "Finance & Banking" },
        { id: "b", text: "लोगों की मदद और देखभाल", value: "caring", division: "Health" },
        { id: "c", text: "चीजें बनाना, निर्माण और ठीक करना", value: "technical", division: "Technology" },
        { id: "d", text: "पढ़ाना, मार्गदर्शन और सिखाना", value: "educational", division: "Education" },
        { id: "e", text: "समस्या समाधान और रणनीति बनाना", value: "strategic", division: "Policy" },
        { id: "f", text: "शारीरिक काम और सक्रिय रहना", value: "physical", division: "Sport" }
      ]
    },
    {
      id: "career_2",
      category: "reason",
      icon: "🎯",
      question: "आप काम क्यों करना चाहते हैं?",
      subtext: "ईमानदार रहें - कोई गलत जवाब नहीं है",
      maslowLevel: true,
      options: [
        { id: "a", text: "मुझे जीवित रहने और परिवार का समर्थन करने के लिए पैसे चाहिए", value: "survival", level: "L1", salary: "₹15K-30K" },
        { id: "b", text: "मुझे स्थिर आय और नौकरी की सुरक्षा चाहिए", value: "security", level: "L2", salary: "₹30K-60K" },
        { id: "c", text: "मुझे करियर विकास और मान्यता चाहिए", value: "growth", level: "L3", salary: "₹60K-1.5L" },
        { id: "d", text: "मैं अपने क्षेत्र में विशेषज्ञ बनना चाहता हूं", value: "mastery", level: "L4", salary: "₹1.5L-5L" },
        { id: "e", text: "मैं सार्थक प्रभाव डालना चाहता हूं", value: "purpose", level: "L5", salary: "₹5L+" }
      ]
    },
    {
      id: "career_3",
      category: "environment",
      icon: "🏢",
      question: "आप कहाँ काम करना चाहेंगे?",
      subtext: "आपकी पसंदीदा कार्य सेटिंग",
      options: [
        { id: "a", text: "सरकारी नौकरी - स्थिरता और लाभ", value: "government", type: "secure" },
        { id: "b", text: "निजी कंपनी - विकास और वेतन", value: "corporate", type: "growth" },
        { id: "c", text: "स्टार्टअप - नवाचार और स्वामित्व", value: "startup", type: "dynamic" },
        { id: "d", text: "अपना व्यवसाय - स्वतंत्रता और नियंत्रण", value: "entrepreneur", type: "independent" },
        { id: "e", text: "रिमोट/गिग वर्क - लचीलापन", value: "gig", type: "flexible" }
      ]
    },
    {
      id: "career_4",
      category: "aspiration",
      icon: "🚀",
      question: "5 साल में आप खुद को कहाँ देखते हैं?",
      subtext: "आपकी करियर आकांक्षा",
      options: [
        { id: "a", text: "वही काम लेकिन ज्यादा कमाई", value: "stable", ambition: "low" },
        { id: "b", text: "वरिष्ठ पद पर पदोन्नति", value: "growth", ambition: "medium" },
        { id: "c", text: "टीम या विभाग का नेतृत्व", value: "leadership", ambition: "high" },
        { id: "d", text: "अपनी खुद की कंपनी चलाना", value: "entrepreneur", ambition: "very_high" },
        { id: "e", text: "अपने क्षेत्र में मान्यता प्राप्त विशेषज्ञ", value: "expert", ambition: "high" }
      ]
    }
  ]
};

// SECTION 3: SKILLS-SALARY MATCHER (L1-L5 Framework)
const SKILLS_QUESTIONS = {
  en: [
    {
      id: "skill_1",
      category: "education",
      icon: "🎓",
      question: "What is your highest education?",
      subtext: "Select your current education level",
      options: [
        { id: "a", text: "Below 10th", value: "below_10", level: "L1", maxSalary: 20000 },
        { id: "b", text: "10th / 12th Pass", value: "12th", level: "L1", maxSalary: 30000 },
        { id: "c", text: "Diploma / ITI", value: "diploma", level: "L2", maxSalary: 45000 },
        { id: "d", text: "Graduate (BA/BSc/BCom)", value: "graduate", level: "L2", maxSalary: 60000 },
        { id: "e", text: "Professional (BTech/MBBS/CA)", value: "professional", level: "L3", maxSalary: 150000 },
        { id: "f", text: "Post Graduate / PhD", value: "postgrad", level: "L4", maxSalary: 300000 }
      ]
    },
    {
      id: "skill_2",
      category: "experience",
      icon: "💼",
      question: "How many years of work experience do you have?",
      subtext: "Include internships and part-time work",
      options: [
        { id: "a", text: "Fresher (No experience)", value: "0", years: 0, multiplier: 1 },
        { id: "b", text: "0-2 years", value: "0-2", years: 1, multiplier: 1.2 },
        { id: "c", text: "2-5 years", value: "2-5", years: 3, multiplier: 1.5 },
        { id: "d", text: "5-10 years", value: "5-10", years: 7, multiplier: 2 },
        { id: "e", text: "10+ years", value: "10+", years: 12, multiplier: 2.5 }
      ]
    },
    {
      id: "skill_3",
      category: "skills",
      icon: "⚡",
      question: "Rate your top skills",
      subtext: "Select all that apply to you",
      multiSelect: true,
      options: [
        { id: "a", text: "Computer / MS Office", value: "computer", weight: 1.1 },
        { id: "b", text: "English Communication", value: "english", weight: 1.15 },
        { id: "c", text: "Technical / Domain Skills", value: "technical", weight: 1.2 },
        { id: "d", text: "Leadership / Management", value: "leadership", weight: 1.25 },
        { id: "e", text: "Problem Solving", value: "problem_solving", weight: 1.1 },
        { id: "f", text: "AI / Digital Tools", value: "ai_digital", weight: 1.3 }
      ]
    },
    {
      id: "skill_4",
      category: "salary",
      icon: "💰",
      question: "What salary do you expect per month?",
      subtext: "Be realistic based on your experience",
      options: [
        { id: "a", text: "₹15,000 - ₹30,000", value: "15-30k", level: "L1", range: [15000, 30000] },
        { id: "b", text: "₹30,000 - ₹60,000", value: "30-60k", level: "L2", range: [30000, 60000] },
        { id: "c", text: "₹60,000 - ₹1,50,000", value: "60k-1.5L", level: "L3", range: [60000, 150000] },
        { id: "d", text: "₹1,50,000 - ₹5,00,000", value: "1.5L-5L", level: "L4", range: [150000, 500000] },
        { id: "e", text: "₹5,00,000+", value: "5L+", level: "L5", range: [500000, 1000000] }
      ]
    }
  ],
  hi: [
    {
      id: "skill_1",
      category: "education",
      icon: "🎓",
      question: "आपकी उच्चतम शिक्षा क्या है?",
      subtext: "अपना वर्तमान शिक्षा स्तर चुनें",
      options: [
        { id: "a", text: "10वीं से नीचे", value: "below_10", level: "L1", maxSalary: 20000 },
        { id: "b", text: "10वीं / 12वीं पास", value: "12th", level: "L1", maxSalary: 30000 },
        { id: "c", text: "डिप्लोमा / ITI", value: "diploma", level: "L2", maxSalary: 45000 },
        { id: "d", text: "स्नातक (BA/BSc/BCom)", value: "graduate", level: "L2", maxSalary: 60000 },
        { id: "e", text: "व्यावसायिक (BTech/MBBS/CA)", value: "professional", level: "L3", maxSalary: 150000 },
        { id: "f", text: "स्नातकोत्तर / PhD", value: "postgrad", level: "L4", maxSalary: 300000 }
      ]
    },
    {
      id: "skill_2",
      category: "experience",
      icon: "💼",
      question: "आपके पास कितने साल का कार्य अनुभव है?",
      subtext: "इंटर्नशिप और पार्ट-टाइम काम शामिल करें",
      options: [
        { id: "a", text: "फ्रेशर (कोई अनुभव नहीं)", value: "0", years: 0, multiplier: 1 },
        { id: "b", text: "0-2 साल", value: "0-2", years: 1, multiplier: 1.2 },
        { id: "c", text: "2-5 साल", value: "2-5", years: 3, multiplier: 1.5 },
        { id: "d", text: "5-10 साल", value: "5-10", years: 7, multiplier: 2 },
        { id: "e", text: "10+ साल", value: "10+", years: 12, multiplier: 2.5 }
      ]
    },
    {
      id: "skill_3",
      category: "skills",
      icon: "⚡",
      question: "अपने शीर्ष कौशलों को रेट करें",
      subtext: "वह सभी चुनें जो आप पर लागू होते हैं",
      multiSelect: true,
      options: [
        { id: "a", text: "कंप्यूटर / MS Office", value: "computer", weight: 1.1 },
        { id: "b", text: "अंग्रेजी संचार", value: "english", weight: 1.15 },
        { id: "c", text: "तकनीकी / डोमेन कौशल", value: "technical", weight: 1.2 },
        { id: "d", text: "नेतृत्व / प्रबंधन", value: "leadership", weight: 1.25 },
        { id: "e", text: "समस्या समाधान", value: "problem_solving", weight: 1.1 },
        { id: "f", text: "AI / डिजिटल टूल्स", value: "ai_digital", weight: 1.3 }
      ]
    },
    {
      id: "skill_4",
      category: "salary",
      icon: "💰",
      question: "आप प्रति माह कितना वेतन चाहते हैं?",
      subtext: "अपने अनुभव के आधार पर यथार्थवादी रहें",
      options: [
        { id: "a", text: "₹15,000 - ₹30,000", value: "15-30k", level: "L1", range: [15000, 30000] },
        { id: "b", text: "₹30,000 - ₹60,000", value: "30-60k", level: "L2", range: [30000, 60000] },
        { id: "c", text: "₹60,000 - ₹1,50,000", value: "60k-1.5L", level: "L3", range: [60000, 150000] },
        { id: "d", text: "₹1,50,000 - ₹5,00,000", value: "1.5L-5L", level: "L4", range: [150000, 500000] },
        { id: "e", text: "₹5,00,000+", value: "5L+", level: "L5", range: [500000, 1000000] }
      ]
    }
  ]
};

// Helper to get questions for current language
const getQuestions = (section, lang) => {
  const langKey = ['en', 'hi', 'kn', 'ta', 'te'].includes(lang) ? lang : 'en';
  
  switch(section) {
    case 'character':
      return CHARACTER_QUESTIONS[langKey] || CHARACTER_QUESTIONS.en;
    case 'career':
      return CAREER_QUESTIONS[langKey] || CAREER_QUESTIONS.en;
    case 'skills':
      return SKILLS_QUESTIONS[langKey] || SKILLS_QUESTIONS.en;
    default:
      return [];
  }
};

export default function AgentAimeeAnalyzer() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { language, t } = useLanguage();
  
  // State
  const [phase, setPhase] = useState('intro'); // intro, character, career, skills, analyzing, results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({
    character: {},
    career: {},
    skills: {}
  });
  const [multiSelectAnswers, setMultiSelectAnswers] = useState([]);
  const [earnedDcoins, setEarnedDcoins] = useState(0);
  const [results, setResults] = useState(null);
  const [showAstro, setShowAstro] = useState(true);
  
  const content = ASSESSMENT_CONTENT[language] || ASSESSMENT_CONTENT.en;
  
  // Get current section questions
  const getCurrentQuestions = () => {
    if (phase === 'character') return getQuestions('character', language);
    if (phase === 'career') return getQuestions('career', language);
    if (phase === 'skills') return getQuestions('skills', language);
    return [];
  };
  
  const questions = getCurrentQuestions();
  const currentQ = questions[currentQuestion];
  
  // Calculate progress
  const totalQuestions = 
    getQuestions('character', language).length + 
    getQuestions('career', language).length + 
    getQuestions('skills', language).length;
  
  const answeredQuestions = 
    Object.keys(answers.character).length + 
    Object.keys(answers.career).length + 
    Object.keys(answers.skills).length;
  
  const progress = (answeredQuestions / totalQuestions) * 100;
  
  // Handle answer selection
  const handleAnswer = (option) => {
    if (currentQ?.multiSelect) {
      // Handle multi-select
      if (multiSelectAnswers.includes(option.id)) {
        setMultiSelectAnswers(multiSelectAnswers.filter(id => id !== option.id));
      } else {
        setMultiSelectAnswers([...multiSelectAnswers, option.id]);
      }
      return;
    }
    
    // Single select - save answer
    const sectionKey = phase;
    setAnswers(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [currentQ.id]: option
      }
    }));
    
    // Award D-COIN for each answer
    setEarnedDcoins(prev => prev + 5);
    
    // Move to next question or section
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Section complete - move to next or analyze
        if (phase === 'character') {
          setPhase('career');
          setCurrentQuestion(0);
          setEarnedDcoins(prev => prev + 25); // Section bonus
          toast.success('+25 D-COIN! Character section complete!');
        } else if (phase === 'career') {
          setPhase('skills');
          setCurrentQuestion(0);
          setEarnedDcoins(prev => prev + 25);
          toast.success('+25 D-COIN! Career section complete!');
        } else if (phase === 'skills') {
          // Save multi-select answers first
          if (currentQ?.multiSelect && multiSelectAnswers.length > 0) {
            setAnswers(prev => ({
              ...prev,
              skills: {
                ...prev.skills,
                [currentQ.id]: multiSelectAnswers.map(id => 
                  currentQ.options.find(o => o.id === id)
                )
              }
            }));
          }
          setEarnedDcoins(prev => prev + 50); // Completion bonus
          setPhase('analyzing');
          analyzeResults();
        }
      }
    }, 300);
  };
  
  // Handle multi-select confirm
  const handleMultiSelectConfirm = () => {
    if (multiSelectAnswers.length === 0) {
      toast.error('Please select at least one option');
      return;
    }
    
    const selectedOptions = multiSelectAnswers.map(id => 
      currentQ.options.find(o => o.id === id)
    );
    
    setAnswers(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [currentQ.id]: selectedOptions
      }
    }));
    
    setEarnedDcoins(prev => prev + 5);
    setMultiSelectAnswers([]);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setEarnedDcoins(prev => prev + 50);
      setPhase('analyzing');
      analyzeResults();
    }
  };
  
  // Analyze results and calculate PASS code
  const analyzeResults = async () => {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Calculate CHARACTER score (Core Concerns)
    const characterScores = Object.values(answers.character);
    const characterScore = characterScores.reduce((sum, opt) => sum + (opt?.score || 0), 0);
    const maxCharScore = characterScores.length * 4;
    const characterPercent = Math.round((characterScore / maxCharScore) * 100);
    
    // Determine Maslow level from career answers
    const careerReason = answers.career?.career_2;
    const maslowLevel = careerReason?.level || 'L2';
    const expectedSalary = careerReason?.salary || '₹30K-60K';
    
    // Get preferred division
    const preferredDivision = answers.career?.career_1?.division || 'Technology';
    
    // Calculate SKILLS-SALARY match
    const education = answers.skills?.skill_1;
    const experience = answers.skills?.skill_2;
    const skills = answers.skills?.skill_3 || [];
    const salaryExpectation = answers.skills?.skill_4;
    
    // Calculate realistic salary based on education + experience + skills
    let baseSalary = education?.maxSalary || 30000;
    const expMultiplier = experience?.multiplier || 1;
    const skillsBonus = Array.isArray(skills) 
      ? skills.reduce((mult, s) => mult * (s?.weight || 1), 1)
      : 1;
    
    const calculatedSalary = Math.round(baseSalary * expMultiplier * skillsBonus);
    const expectedRange = salaryExpectation?.range || [30000, 60000];
    const salaryMatch = calculatedSalary >= expectedRange[0] && calculatedSalary <= expectedRange[1] * 1.2;
    
    // Determine recommended level
    let recommendedLevel = 'L1';
    if (calculatedSalary > 150000) recommendedLevel = 'L4';
    else if (calculatedSalary > 60000) recommendedLevel = 'L3';
    else if (calculatedSalary > 30000) recommendedLevel = 'L2';
    
    // Calculate overall PASS score
    const psyScore = characterPercent;
    const skillScore = Math.min(100, Math.round(calculatedSalary / 3000));
    const passScore = Math.round((psyScore + skillScore) / 2);
    
    const analysisResults = {
      passCode: {
        psy: psyScore,
        skill: skillScore,
        overall: passScore,
        level: recommendedLevel
      },
      character: {
        score: characterPercent,
        dominantTrait: characterScores[0]?.value || 'growth_mindset',
        motivation: answers.character?.char_5?.value || 'passion'
      },
      career: {
        preferredDivision,
        maslowLevel,
        expectedSalary,
        workEnvironment: answers.career?.career_3?.value || 'corporate',
        ambition: answers.career?.career_4?.ambition || 'medium'
      },
      skills: {
        education: education?.value || 'graduate',
        experience: experience?.value || '0-2',
        topSkills: Array.isArray(skills) ? skills.map(s => s?.value) : [],
        calculatedSalary,
        expectedSalaryRange: expectedRange,
        salaryMatch,
        gapAnalysis: salaryMatch ? null : {
          gap: expectedRange[0] - calculatedSalary,
          recommendation: 'Upskill in AI/Digital tools to bridge the gap'
        }
      },
      dcoinsEarned: earnedDcoins + 50
    };
    
    setResults(analysisResults);
    setPhase('results');
    
    // Update user profile
    if (user) {
      updateUser({
        psy_score: psyScore,
        skill_score: skillScore,
        pass_code: analysisResults.passCode,
        division: preferredDivision,
        level: recommendedLevel,
        personality_traits: analysisResults.character,
        aimee_analysis: analysisResults
      });
    }
  };
  
  // Render Intro Phase
  const renderIntro = () => (
    <motion.div 
      className="flex-1 flex flex-col items-center justify-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center max-w-md">
        {/* AIMEE Avatar */}
        <motion.div
          className="w-32 h-32 mx-auto mb-6 relative"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-2xl">
            <Brain className="w-16 h-16 text-white" />
          </div>
          <motion.div
            className="absolute -bottom-2 -right-2 w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center shadow-lg"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
        </motion.div>
        
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          {content.title}
        </h1>
        <p className="text-white/70 mb-6">{content.subtitle}</p>
        
        {/* Welcome message */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-8">
          <p className="text-white/90">{content.welcome}</p>
        </div>
        
        {/* Section Preview */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { key: 'character', icon: <Heart className="w-5 h-5" />, reward: '+50' },
            { key: 'career', icon: <Target className="w-5 h-5" />, reward: '+50' },
            { key: 'skills', icon: <Coins className="w-5 h-5" />, reward: '+100' }
          ].map((section, idx) => (
            <motion.div
              key={section.key}
              className="bg-white/5 border border-white/10 rounded-xl p-3 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                {section.icon}
              </div>
              <p className="text-white text-xs font-medium">{content.sections[section.key]}</p>
              <Badge className="mt-1 bg-amber-500/20 text-amber-400 border-0 text-[10px]">
                {section.reward} D-COIN
              </Badge>
            </motion.div>
          ))}
        </div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
            onClick={() => setPhase('character')}
            data-testid="start-assessment-btn"
          >
            {content.letsStart} <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
  
  // Render Question Phase
  const renderQuestion = () => {
    if (!currentQ) return null;
    
    const sectionLabel = phase === 'character' ? content.characterTitle : 
                         phase === 'career' ? content.careerTitle : 
                         content.skillsTitle;
    
    return (
      <div className="flex-1 px-4 pb-32 overflow-y-auto">
        <div className="max-w-md mx-auto">
          {/* Section Badge */}
          <div className="text-center mb-6">
            <Badge className="bg-white/10 text-white border-0 mb-3">
              {sectionLabel} • {currentQuestion + 1}/{questions.length}
            </Badge>
          </div>
          
          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 mb-6"
            >
              <div className="text-center mb-6">
                <motion.span 
                  className="text-5xl block mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {currentQ.icon}
                </motion.span>
                <h2 className="text-white text-xl font-bold mb-2">
                  {currentQ.question}
                </h2>
                <p className="text-white/50 text-sm">{currentQ.subtext}</p>
              </div>
              
              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                  const isSelected = currentQ.multiSelect 
                    ? multiSelectAnswers.includes(option.id)
                    : answers[phase]?.[currentQ.id]?.id === option.id;
                  
                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => handleAnswer(option)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-500/20' 
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      data-testid={`option-${option.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'border-purple-500 bg-purple-500' : 'border-white/30'
                        }`}>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{option.text}</p>
                          {option.salary && (
                            <span className="text-green-400 text-xs">{option.salary}/month</span>
                          )}
                          {option.level && (
                            <Badge className="ml-2 bg-blue-500/20 text-blue-400 border-0 text-[10px]">
                              {option.level}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              
              {/* Multi-select confirm button */}
              {currentQ.multiSelect && (
                <Button
                  className="w-full mt-4 bg-purple-500 hover:bg-purple-600"
                  onClick={handleMultiSelectConfirm}
                  disabled={multiSelectAnswers.length === 0}
                >
                  {content.continue} ({multiSelectAnswers.length} selected)
                </Button>
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* D-COIN Counter */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Badge className="bg-amber-500/20 text-amber-400 border-0 px-4 py-2">
              <Coins className="w-4 h-4 mr-2" />
              {earnedDcoins} D-COIN earned
            </Badge>
          </motion.div>
        </div>
      </div>
    );
  };
  
  // Render Analyzing Phase
  const renderAnalyzing = () => (
    <motion.div 
      className="flex-1 flex flex-col items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-center">
        <motion.div
          className="w-24 h-24 mx-auto mb-6 relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full rounded-full border-4 border-purple-500/30 border-t-purple-500" />
          <Brain className="w-10 h-10 text-purple-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
        
        <h2 className="text-white text-xl font-bold mb-2">{content.analyzingText}</h2>
        <p className="text-white/50">Creating your personalized career profile</p>
        
        <div className="mt-8 space-y-2">
          {['Analyzing CHARACTER...', 'Mapping CAREER path...', 'Calculating SKILLS match...'].map((step, idx) => (
            <motion.div
              key={step}
              className="flex items-center gap-2 justify-center text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 1 }}
            >
              <Check className="w-4 h-4 text-green-400" />
              <span>{step}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
  
  // Render Results Phase
  const renderResults = () => {
    if (!results) return null;
    
    return (
      <motion.div 
        className="flex-1 px-4 pb-32 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-md mx-auto">
          {/* Success Header */}
          <div className="text-center mb-6">
            <motion.div
              className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="font-display text-2xl font-bold text-white mb-2">
              {content.completeText}
            </h1>
            <p className="text-white/50">{content.doersIdReady}</p>
          </div>
          
          {/* PASS Code Card */}
          <Card className="bg-gradient-to-br from-purple-600 to-pink-600 border-0 mb-4">
            <CardContent className="p-6 text-center">
              <p className="text-white/70 text-sm uppercase tracking-wider mb-2">Your PASS Code</p>
              <p className="text-6xl font-bold text-white mb-4">{results.passCode.overall}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-white/60 text-xs">PSY Score</p>
                  <p className="text-2xl font-bold text-white">{results.passCode.psy}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-white/60 text-xs">SKILL Score</p>
                  <p className="text-2xl font-bold text-white">{results.passCode.skill}</p>
                </div>
              </div>
              <Badge className="mt-4 bg-white/20 text-white border-0 text-lg px-4 py-1">
                Level {results.passCode.level}
              </Badge>
            </CardContent>
          </Card>
          
          {/* Career Match */}
          <Card className="bg-white/5 border-white/10 mb-4">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" /> Career Match
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60">Preferred Division</span>
                  <span className="text-white font-medium">{results.career.preferredDivision}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Maslow Level</span>
                  <span className="text-purple-400 font-medium">{results.career.maslowLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Target Salary</span>
                  <span className="text-green-400 font-medium">{results.career.expectedSalary}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Skills-Salary Match */}
          <Card className={`border mb-4 ${results.skills.salaryMatch ? 'bg-green-500/10 border-green-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-400" /> Skills-Salary Analysis
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60">Calculated Salary</span>
                  <span className="text-white font-bold">₹{results.skills.calculatedSalary.toLocaleString()}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Expected Range</span>
                  <span className="text-white/80">₹{results.skills.expectedSalaryRange[0].toLocaleString()} - ₹{results.skills.expectedSalaryRange[1].toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Match Status</span>
                  {results.skills.salaryMatch ? (
                    <Badge className="bg-green-500 text-white border-0">✓ Matched</Badge>
                  ) : (
                    <Badge className="bg-amber-500 text-white border-0">Gap Found</Badge>
                  )}
                </div>
              </div>
              
              {results.skills.gapAnalysis && (
                <div className="mt-3 p-3 bg-white/5 rounded-lg">
                  <p className="text-amber-400 text-sm font-medium">💡 Recommendation:</p>
                  <p className="text-white/70 text-sm">{results.skills.gapAnalysis.recommendation}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* D-COIN Earned */}
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-4 text-center mb-6">
            <p className="text-white/70 text-sm mb-1">Total D-COIN Earned</p>
            <p className="text-4xl font-bold text-amber-400">+{results.dcoinsEarned}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={() => {
            if (phase === 'intro' || phase === 'results') {
              navigate(-1);
            } else if (currentQuestion > 0) {
              setCurrentQuestion(currentQuestion - 1);
            } else if (phase === 'career') {
              setPhase('character');
              setCurrentQuestion(getQuestions('character', language).length - 1);
            } else if (phase === 'skills') {
              setPhase('career');
              setCurrentQuestion(getQuestions('career', language).length - 1);
            } else {
              setPhase('intro');
            }
          }}
          data-testid="aimee-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          {phase !== 'intro' && phase !== 'analyzing' && phase !== 'results' && (
            <Progress value={progress} className="h-2 bg-white/10" />
          )}
        </div>
        {phase !== 'intro' && (
          <Badge className="bg-amber-500/20 text-amber-400 border-0">
            <Coins className="w-3 h-3 mr-1" /> {earnedDcoins}
          </Badge>
        )}
      </header>

      {/* Content */}
      {phase === 'intro' && renderIntro()}
      {(phase === 'character' || phase === 'career' || phase === 'skills') && renderQuestion()}
      {phase === 'analyzing' && renderAnalyzing()}
      {phase === 'results' && renderResults()}

      {/* Footer for Results */}
      {phase === 'results' && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
          <Button 
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 max-w-md mx-auto"
            onClick={() => navigate('/doers-profile')}
            data-testid="view-doersid-btn"
          >
            View My DoersID Profile <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      )}
      
      {/* Astro Doer Helper */}
      {showAstro && phase !== 'analyzing' && (
        <div className="fixed bottom-24 right-4 z-40">
          <AstroDoer 
            message={phase === 'intro' ? 'greeting' : phase === 'results' ? 'celebrate' : 'tip'} 
            size="sm" 
            showBubble={phase === 'intro'}
            autoHide={phase !== 'intro'}
          />
        </div>
      )}
    </div>
  );
}
