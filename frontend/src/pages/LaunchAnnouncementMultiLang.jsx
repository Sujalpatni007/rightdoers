import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  Globe,
  Calendar,
  MapPin,
  Play,
  Share2,
  Sparkles,
  Users,
  Trophy,
  Star,
  PartyPopper,
  Zap,
  Twitter,
  Linkedin,
  Mail,
  Copy,
  Check,
  Languages,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

// Multi-lingual translations
const TRANSLATIONS = {
  en: {
    code: "en",
    name: "English",
    flag: "🇬🇧",
    dir: "ltr",
    fontClass: "",
    content: {
      badge: "GLOBAL LAUNCH ANNOUNCEMENT",
      happyNewYear: "Happy New Year",
      year: "2026!",
      subtitle: "We're thrilled to announce the global launch of",
      appName: "HI AI APP",
      atThe: "at the",
      summit: "Dubai Global Innovation Summit",
      countdown: "Launch Countdown",
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
      officialLaunch: "OFFICIAL LAUNCH",
      summitTitle: "Dubai Global Innovation Summit",
      summitDesc: "Join us as we unveil the future of Human Potential Management & Transformation. The DOERS Trinity - Human + AI + Robo Doer - goes global!",
      date: "January 9, 2026",
      location: "Dubai, UAE",
      broadcast: "Live Global Broadcast",
      comingSoon: "Coming Soon: Launch Video",
      whatLaunching: "What We're Launching",
      verticals: "7 Business Verticals",
      verticalsDesc: "B2G, B2A, B2B, B2C, B2D, D2D, A2A - Complete career ecosystem",
      aimee: "AIMEE AI Assistant",
      aimeeDesc: "Your AI-powered career transformation companion",
      commandCentre: "Captain Command Centre",
      commandDesc: "Military-grade HQ for managing the DOERS Trinity",
      captainMessage: "MESSAGE FROM THE CAPTAIN",
      motto: "From Dream to Destination",
      message: "As we step into 2026, I'm filled with gratitude and excitement. HI AI APP represents our mission to transform human potential - from 7G Neom City to No-Network Nagara Village. This Dubai launch marks the beginning of a shared, foresighted future for all Doers worldwide.",
      signature: "Captain, Right Doers World Pvt Ltd",
      share: "Share the Announcement",
      copyLink: "Copy Link",
      copied: "Copied!",
      viewMission: "View Mission Board",
      viewCommand: "Captain Command Centre",
      footer1: "Right Doers World Pvt Ltd | Global Capability Centre for Human Xperts",
      footer2: "15th Floor, World Trade Centre, Bangalore, India",
      worldExpo: "WORLD EXPO 2031 BOUND"
    }
  },
  hi: {
    code: "hi",
    name: "हिंदी",
    flag: "🇮🇳",
    dir: "ltr",
    fontClass: "font-hindi",
    content: {
      badge: "वैश्विक लॉन्च घोषणा",
      happyNewYear: "नव वर्ष की",
      year: "शुभकामनाएं 2026!",
      subtitle: "हमें गर्व है कि हम वैश्विक लॉन्च की घोषणा कर रहे हैं",
      appName: "HI AI APP",
      atThe: "",
      summit: "दुबई ग्लोबल इनोवेशन समिट में",
      countdown: "लॉन्च काउंटडाउन",
      days: "दिन",
      hours: "घंटे",
      minutes: "मिनट",
      seconds: "सेकंड",
      officialLaunch: "आधिकारिक लॉन्च",
      summitTitle: "दुबई ग्लोबल इनोवेशन समिट",
      summitDesc: "मानव क्षमता प्रबंधन और परिवर्तन के भविष्य का अनावरण करने के लिए हमसे जुड़ें। DOERS ट्रिनिटी - मानव + AI + रोबो डोअर - वैश्विक हो रहा है!",
      date: "9 जनवरी, 2026",
      location: "दुबई, यूएई",
      broadcast: "लाइव ग्लोबल प्रसारण",
      comingSoon: "जल्द आ रहा है: लॉन्च वीडियो",
      whatLaunching: "हम क्या लॉन्च कर रहे हैं",
      verticals: "7 व्यावसायिक वर्टिकल",
      verticalsDesc: "B2G, B2A, B2B, B2C, B2D, D2D, A2A - संपूर्ण करियर इकोसिस्टम",
      aimee: "AIMEE AI सहायक",
      aimeeDesc: "आपका AI-संचालित करियर परिवर्तन साथी",
      commandCentre: "कैप्टन कमांड सेंटर",
      commandDesc: "DOERS ट्रिनिटी के प्रबंधन के लिए मिलिट्री-ग्रेड मुख्यालय",
      captainMessage: "कैप्टन का संदेश",
      motto: "सपने से मंज़िल तक",
      message: "जैसे ही हम 2026 में कदम रख रहे हैं, मैं कृतज्ञता और उत्साह से भरा हूं। HI AI APP मानव क्षमता को बदलने के हमारे मिशन का प्रतिनिधित्व करता है - 7G नियोम सिटी से नो-नेटवर्क नगर गांव तक। यह दुबई लॉन्च दुनिया भर के सभी Doers के लिए एक साझा, दूरदर्शी भविष्य की शुरुआत है।",
      signature: "कैप्टन, राइट डोअर्स वर्ल्ड प्राइवेट लिमिटेड",
      share: "घोषणा साझा करें",
      copyLink: "लिंक कॉपी करें",
      copied: "कॉपी हो गया!",
      viewMission: "मिशन बोर्ड देखें",
      viewCommand: "कैप्टन कमांड सेंटर",
      footer1: "राइट डोअर्स वर्ल्ड प्राइवेट लिमिटेड | ह्यूमन एक्सपर्ट्स के लिए ग्लोबल कैपेबिलिटी सेंटर",
      footer2: "15वीं मंज़िल, वर्ल्ड ट्रेड सेंटर, बैंगलोर, भारत",
      worldExpo: "वर्ल्ड एक्सपो 2031 की ओर"
    }
  },
  kn: {
    code: "kn",
    name: "ಕನ್ನಡ",
    flag: "🇮🇳",
    dir: "ltr",
    fontClass: "font-kannada",
    content: {
      badge: "ಜಾಗತಿಕ ಲಾಂಚ್ ಘೋಷಣೆ",
      happyNewYear: "ಹೊಸ ವರ್ಷದ",
      year: "ಶುಭಾಶಯಗಳು 2026!",
      subtitle: "ನಾವು ಜಾಗತಿಕ ಲಾಂಚ್ ಘೋಷಿಸಲು ಹರ್ಷಿತರಾಗಿದ್ದೇವೆ",
      appName: "HI AI APP",
      atThe: "",
      summit: "ದುಬೈ ಗ್ಲೋಬಲ್ ಇನ್ನೋವೇಶನ್ ಸಮ್ಮಿಟ್‌ನಲ್ಲಿ",
      countdown: "ಲಾಂಚ್ ಕೌಂಟ್‌ಡೌನ್",
      days: "ದಿನಗಳು",
      hours: "ಗಂಟೆಗಳು",
      minutes: "ನಿಮಿಷಗಳು",
      seconds: "ಸೆಕೆಂಡುಗಳು",
      officialLaunch: "ಅಧಿಕೃತ ಲಾಂಚ್",
      summitTitle: "ದುಬೈ ಗ್ಲೋಬಲ್ ಇನ್ನೋವೇಶನ್ ಸಮ್ಮಿಟ್",
      summitDesc: "ಮಾನವ ಸಾಮರ್ಥ್ಯ ನಿರ್ವಹಣೆ ಮತ್ತು ಪರಿವರ್ತನೆಯ ಭವಿಷ್ಯವನ್ನು ಅನಾವರಣಗೊಳಿಸಲು ನಮ್ಮೊಂದಿಗೆ ಸೇರಿ. DOERS ಟ್ರಿನಿಟಿ - ಮಾನವ + AI + ರೋಬೋ ಡೋಅರ್ - ಜಾಗತಿಕವಾಗುತ್ತಿದೆ!",
      date: "ಜನವರಿ 9, 2026",
      location: "ದುಬೈ, ಯುಎಇ",
      broadcast: "ಲೈವ್ ಗ್ಲೋಬಲ್ ಪ್ರಸಾರ",
      comingSoon: "ಶೀಘ್ರದಲ್ಲೇ: ಲಾಂಚ್ ವೀಡಿಯೋ",
      whatLaunching: "ನಾವು ಏನು ಲಾಂಚ್ ಮಾಡುತ್ತಿದ್ದೇವೆ",
      verticals: "7 ವ್ಯಾಪಾರ ವರ್ಟಿಕಲ್‌ಗಳು",
      verticalsDesc: "B2G, B2A, B2B, B2C, B2D, D2D, A2A - ಸಂಪೂರ್ಣ ವೃತ್ತಿ ಪರಿಸರ ವ್ಯವಸ್ಥೆ",
      aimee: "AIMEE AI ಸಹಾಯಕ",
      aimeeDesc: "ನಿಮ್ಮ AI-ಚಾಲಿತ ವೃತ್ತಿ ಪರಿವರ್ತನೆ ಸಂಗಾತಿ",
      commandCentre: "ಕ್ಯಾಪ್ಟನ್ ಕಮಾಂಡ್ ಸೆಂಟರ್",
      commandDesc: "DOERS ಟ್ರಿನಿಟಿ ನಿರ್ವಹಣೆಗಾಗಿ ಮಿಲಿಟರಿ-ಗ್ರೇಡ್ ಪ್ರಧಾನ ಕಚೇರಿ",
      captainMessage: "ಕ್ಯಾಪ್ಟನ್‌ರ ಸಂದೇಶ",
      motto: "ಕನಸಿನಿಂದ ಗಮ್ಯಸ್ಥಾನಕ್ಕೆ",
      message: "ನಾವು 2026 ರಲ್ಲಿ ಹೆಜ್ಜೆ ಇಡುತ್ತಿದ್ದಂತೆ, ನಾನು ಕೃತಜ್ಞತೆ ಮತ್ತು ಉತ್ಸಾಹದಿಂದ ತುಂಬಿದ್ದೇನೆ. HI AI APP ಮಾನವ ಸಾಮರ್ಥ್ಯವನ್ನು ಪರಿವರ್ತಿಸುವ ನಮ್ಮ ಮಿಷನ್ ಅನ್ನು ಪ್ರತಿನಿಧಿಸುತ್ತದೆ - 7G ನಿಯೋಮ್ ಸಿಟಿಯಿಂದ ನೋ-ನೆಟ್‌ವರ್ಕ್ ನಗರ ಗ್ರಾಮದವರೆಗೆ. ಈ ದುಬೈ ಲಾಂಚ್ ವಿಶ್ವಾದ್ಯಂತ ಎಲ್ಲಾ Doers ಗಳಿಗೆ ಹಂಚಿಕೊಂಡ, ದೂರದೃಷ್ಟಿಯ ಭವಿಷ್ಯದ ಆರಂಭವನ್ನು ಸೂಚಿಸುತ್ತದೆ.",
      signature: "ಕ್ಯಾಪ್ಟನ್, ರೈಟ್ ಡೋಅರ್ಸ್ ವರ್ಲ್ಡ್ ಪ್ರೈವೇಟ್ ಲಿಮಿಟೆಡ್",
      share: "ಘೋಷಣೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ",
      copyLink: "ಲಿಂಕ್ ನಕಲಿಸಿ",
      copied: "ನಕಲಾಗಿದೆ!",
      viewMission: "ಮಿಷನ್ ಬೋರ್ಡ್ ನೋಡಿ",
      viewCommand: "ಕ್ಯಾಪ್ಟನ್ ಕಮಾಂಡ್ ಸೆಂಟರ್",
      footer1: "ರೈಟ್ ಡೋಅರ್ಸ್ ವರ್ಲ್ಡ್ ಪ್ರೈವೇಟ್ ಲಿಮಿಟೆಡ್ | ಹ್ಯೂಮನ್ ಎಕ್ಸ್‌ಪರ್ಟ್ಸ್‌ಗಾಗಿ ಗ್ಲೋಬಲ್ ಕೆಪ್ಯಾಬಿಲಿಟಿ ಸೆಂಟರ್",
      footer2: "15ನೇ ಮಹಡಿ, ವರ್ಲ್ಡ್ ಟ್ರೇಡ್ ಸೆಂಟರ್, ಬೆಂಗಳೂರು, ಭಾರತ",
      worldExpo: "ವರ್ಲ್ಡ್ ಎಕ್ಸ್‌ಪೋ 2031 ಕಡೆಗೆ"
    }
  },
  te: {
    code: "te",
    name: "తెలుగు",
    flag: "🇮🇳",
    dir: "ltr",
    fontClass: "font-telugu",
    content: {
      badge: "గ్లోబల్ లాంచ్ ప్రకటన",
      happyNewYear: "నూతన సంవత్సర",
      year: "శుభాకాంక్షలు 2026!",
      subtitle: "గ్లోబల్ లాంచ్ ప్రకటించడం మాకు సంతోషంగా ఉంది",
      appName: "HI AI APP",
      atThe: "",
      summit: "దుబాయ్ గ్లోబల్ ఇన్నోవేషన్ సమ్మిట్‌లో",
      countdown: "లాంచ్ కౌంట్‌డౌన్",
      days: "రోజులు",
      hours: "గంటలు",
      minutes: "నిమిషాలు",
      seconds: "సెకన్లు",
      officialLaunch: "అధికారిక లాంచ్",
      summitTitle: "దుబాయ్ గ్లోబల్ ఇన్నోవేషన్ సమ్మిట్",
      summitDesc: "మానవ సామర్థ్య నిర్వహణ మరియు పరివర్తన భవిష్యత్తును ఆవిష్కరించడానికి మాతో చేరండి. DOERS ట్రినిటీ - మానవ + AI + రోబో డోయర్ - గ్లోబల్ అవుతోంది!",
      date: "జనవరి 9, 2026",
      location: "దుబాయ్, యుఎఇ",
      broadcast: "లైవ్ గ్లోబల్ ప్రసారం",
      comingSoon: "త్వరలో: లాంచ్ వీడియో",
      whatLaunching: "మేము ఏమి లాంచ్ చేస్తున్నాము",
      verticals: "7 బిజినెస్ వర్టికల్స్",
      verticalsDesc: "B2G, B2A, B2B, B2C, B2D, D2D, A2A - పూర్తి కెరీర్ ఎకోసిస్టమ్",
      aimee: "AIMEE AI అసిస్టెంట్",
      aimeeDesc: "మీ AI-ఆధారిత కెరీర్ పరివర్తన సహచరుడు",
      commandCentre: "కెప్టెన్ కమాండ్ సెంటర్",
      commandDesc: "DOERS ట్రినిటీ నిర్వహణ కోసం మిలిటరీ-గ్రేడ్ హెడ్‌క్వార్టర్స్",
      captainMessage: "కెప్టెన్ సందేశం",
      motto: "కలల నుండి గమ్యస్థానం వరకు",
      message: "మనం 2026లో అడుగు పెడుతున్నప్పుడు, నేను కృతజ్ఞత మరియు ఉత్సాహంతో నిండిపోయాను. HI AI APP మానవ సామర్థ్యాన్ని మార్చడానికి మా మిషన్‌ను సూచిస్తుంది - 7G నియోమ్ సిటీ నుండి నో-నెట్‌వర్క్ నగర విలేజ్ వరకు. ఈ దుబాయ్ లాంచ్ ప్రపంచవ్యాప్తంగా అన్ని Doers కోసం భాగస్వామ్య, దూరదృష్టి గల భవిష్యత్తు ప్రారంభాన్ని సూచిస్తుంది.",
      signature: "కెప్టెన్, రైట్ డోయర్స్ వరల్డ్ ప్రైవేట్ లిమిటెడ్",
      share: "ప్రకటనను షేర్ చేయండి",
      copyLink: "లింక్ కాపీ చేయండి",
      copied: "కాపీ అయింది!",
      viewMission: "మిషన్ బోర్డ్ చూడండి",
      viewCommand: "కెప్టెన్ కమాండ్ సెంటర్",
      footer1: "రైట్ డోయర్స్ వరల్డ్ ప్రైవేట్ లిమిటెడ్ | హ్యూమన్ ఎక్స్‌పర్ట్స్ కోసం గ్లోబల్ కేపబిలిటీ సెంటర్",
      footer2: "15వ అంతస్తు, వరల్డ్ ట్రేడ్ సెంటర్, బెంగళూరు, భారతదేశం",
      worldExpo: "వరల్డ్ ఎక్స్‌పో 2031 వైపు"
    }
  },
  ar: {
    code: "ar",
    name: "العربية",
    flag: "🇦🇪",
    dir: "rtl",
    fontClass: "font-arabic",
    content: {
      badge: "إعلان الإطلاق العالمي",
      happyNewYear: "سنة جديدة",
      year: "سعيدة 2026!",
      subtitle: "يسعدنا أن نعلن عن الإطلاق العالمي لـ",
      appName: "HI AI APP",
      atThe: "في",
      summit: "قمة دبي العالمية للابتكار",
      countdown: "العد التنازلي للإطلاق",
      days: "أيام",
      hours: "ساعات",
      minutes: "دقائق",
      seconds: "ثواني",
      officialLaunch: "الإطلاق الرسمي",
      summitTitle: "قمة دبي العالمية للابتكار",
      summitDesc: "انضموا إلينا للكشف عن مستقبل إدارة وتحويل الإمكانات البشرية. ثالوث DOERS - الإنسان + الذكاء الاصطناعي + روبو دوير - ينطلق عالمياً!",
      date: "9 يناير 2026",
      location: "دبي، الإمارات",
      broadcast: "بث عالمي مباشر",
      comingSoon: "قريباً: فيديو الإطلاق",
      whatLaunching: "ماذا نطلق",
      verticals: "7 قطاعات أعمال",
      verticalsDesc: "B2G, B2A, B2B, B2C, B2D, D2D, A2A - نظام بيئي مهني متكامل",
      aimee: "مساعد AIMEE الذكي",
      aimeeDesc: "رفيقك المدعوم بالذكاء الاصطناعي لتحويل المسار المهني",
      commandCentre: "مركز قيادة الكابتن",
      commandDesc: "مقر عسكري لإدارة ثالوث DOERS",
      captainMessage: "رسالة من الكابتن",
      motto: "من الحلم إلى الوجهة",
      message: "مع دخولنا عام 2026، أنا ممتلئ بالامتنان والحماس. يمثل HI AI APP مهمتنا لتحويل الإمكانات البشرية - من مدينة نيوم 7G إلى قرية ناغارا بدون شبكة. يمثل إطلاق دبي هذا بداية مستقبل مشترك ومستبصر لجميع الدوريين حول العالم.",
      signature: "الكابتن، رايت دورز وورلد المحدودة",
      share: "شارك الإعلان",
      copyLink: "نسخ الرابط",
      copied: "تم النسخ!",
      viewMission: "عرض لوحة المهمة",
      viewCommand: "مركز قيادة الكابتن",
      footer1: "رايت دورز وورلد المحدودة | مركز القدرات العالمية للخبراء البشريين",
      footer2: "الطابق 15، مركز التجارة العالمي، بنغالور، الهند",
      worldExpo: "نحو إكسبو 2031"
    }
  }
};

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "हिंदी", flag: "🇮🇳" },
  { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "te", name: "తెలుగు", flag: "🇮🇳" },
  { code: "ar", name: "العربية", flag: "🇦🇪" },
];

// Localized WhatsApp messages for viral sharing
const WHATSAPP_MESSAGES = {
  en: `🎆 *Happy New Year 2026!* 🎆

🚀 *BIG NEWS:* HI AI APP is launching at the *Dubai Global Innovation Summit* on January 9, 2026!

✨ The future of career transformation is here:
• 7 Business Verticals (B2G to A2A)
• AIMEE - AI Career Assistant
• Captain Command Centre

🌍 From 7G Neom City to rural villages - AI for everyone!

👉 Check it out: `,

  hi: `🎆 *नव वर्ष की शुभकामनाएं 2026!* 🎆

🚀 *बड़ी खबर:* HI AI APP 9 जनवरी 2026 को *दुबई ग्लोबल इनोवेशन समिट* में लॉन्च हो रहा है!

✨ करियर ट्रांसफॉर्मेशन का भविष्य यहाँ है:
• 7 बिज़नेस वर्टिकल (B2G से A2A)
• AIMEE - AI करियर असिस्टेंट
• कैप्टन कमांड सेंटर

🌍 7G नियोम सिटी से गांवों तक - सबके लिए AI!

👉 देखें: `,

  kn: `🎆 *ಹೊಸ ವರ್ಷದ ಶುಭಾಶಯಗಳು 2026!* 🎆

🚀 *ದೊಡ್ಡ ಸುದ್ದಿ:* HI AI APP ಜನವರಿ 9, 2026 ರಂದು *ದುಬೈ ಗ್ಲೋಬಲ್ ಇನ್ನೋವೇಶನ್ ಸಮ್ಮಿಟ್*ನಲ್ಲಿ ಲಾಂಚ್ ಆಗುತ್ತಿದೆ!

✨ ವೃತ್ತಿ ಪರಿವರ್ತನೆಯ ಭವಿಷ್ಯ ಇಲ್ಲಿದೆ:
• 7 ವ್ಯಾಪಾರ ವರ್ಟಿಕಲ್‌ಗಳು
• AIMEE - AI ವೃತ್ತಿ ಸಹಾಯಕ
• ಕ್ಯಾಪ್ಟನ್ ಕಮಾಂಡ್ ಸೆಂಟರ್

🌍 7G ನಿಯೋಮ್ ಸಿಟಿಯಿಂದ ಹಳ್ಳಿಗಳವರೆಗೆ - ಎಲ್ಲರಿಗೂ AI!

👉 ನೋಡಿ: `,

  te: `🎆 *నూతన సంవత్సర శుభాకాంక్షలు 2026!* 🎆

🚀 *పెద్ద వార్త:* HI AI APP జనవరి 9, 2026న *దుబాయ్ గ్లోబల్ ఇన్నోవేషన్ సమ్మిట్*లో లాంచ్ అవుతోంది!

✨ కెరీర్ ట్రాన్స్‌ఫర్మేషన్ భవిష్యత్తు ఇక్కడ ఉంది:
• 7 బిజినెస్ వర్టికల్స్
• AIMEE - AI కెరీర్ అసిస్టెంట్
• కెప్టెన్ కమాండ్ సెంటర్

🌍 7G నియోమ్ సిటీ నుండి గ్రామాల వరకు - అందరికీ AI!

👉 చూడండి: `,

  ar: `🎆 *سنة جديدة سعيدة 2026!* 🎆

🚀 *خبر كبير:* HI AI APP ينطلق في *قمة دبي العالمية للابتكار* في 9 يناير 2026!

✨ مستقبل تحويل المسار المهني هنا:
• 7 قطاعات أعمال
• AIMEE - مساعد مهني ذكي
• مركز قيادة الكابتن

🌍 من مدينة نيوم 7G إلى القرى - الذكاء الاصطناعي للجميع!

👉 شاهد: `
};

export default function LaunchAnnouncementMultiLang() {
  const navigate = useNavigate();
  const { lang } = useParams();
  const [currentLang, setCurrentLang] = useState(lang || "en");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = TRANSLATIONS[currentLang]?.content || TRANSLATIONS.en.content;
  const isRTL = TRANSLATIONS[currentLang]?.dir === "rtl";

  // Dubai Launch Date: January 9, 2026
  const LAUNCH_DATE = new Date("2026-01-09T09:00:00+04:00");

  useEffect(() => {
    if (lang && TRANSLATIONS[lang]) {
      setCurrentLang(lang);
    }
  }, [lang]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = LAUNCH_DATE - now;
      
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  const shareUrl = `https://doerworld-app.preview.emergentagent.com/announce/${currentLang}`;
  const shareText = currentLang === "ar" 
    ? "🚀 HI AI APP ينطلق في قمة دبي العالمية للابتكار 2026! #HIAI #دبي"
    : `🚀 HI AI APP launching at Dubai Global Innovation Summit 2026! #HIAI #DubaiLaunch`;

  // Get localized WhatsApp message
  const whatsappMessage = WHATSAPP_MESSAGES[currentLang] || WHATSAPP_MESSAGES.en;
  const fullWhatsappMessage = whatsappMessage + shareUrl;

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullWhatsappMessage)}`;
    window.open(whatsappUrl, "_blank");
    toast.success("Opening WhatsApp...");
  };

  const handleShare = (platform) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      email: `mailto:?subject=HI AI APP - Dubai Launch 2026&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
    };
    
    if (urls[platform]) {
      window.open(urls[platform], "_blank");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success(t.copied);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    setShowLangMenu(false);
    navigate(`/announce/${langCode}`);
  };

  return (
    <div 
      className={`min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a1a] text-white overflow-hidden ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
      data-testid="launch-announcement-multilang"
    >
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920), opacity: 1 }}
              animate={{ y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 20, opacity: 0 }}
              transition={{ duration: 3 + Math.random() * 2, delay: Math.random() * 2 }}
              className="absolute w-3 h-3 rounded-full"
              style={{ backgroundColor: ["#FFD700", "#00FF88", "#FF6B6B", "#4ECDC4", "#9B59B6"][i % 5] }}
            />
          ))}
        </div>
      )}

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Header with Language Selector */}
      <header className="relative z-20 py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">HI AI APP</span>
          </div>
          
          {/* Language Selector */}
          <div className="relative">
            <Button
              variant="outline"
              className="border-white/20 bg-white/5 hover:bg-white/10"
              onClick={() => setShowLangMenu(!showLangMenu)}
              data-testid="language-selector"
            >
              <Languages className="w-4 h-4 mr-2" />
              {LANGUAGES.find(l => l.code === currentLang)?.flag} {LANGUAGES.find(l => l.code === currentLang)?.name}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            
            <AnimatePresence>
              {showLangMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 right-0 bg-[#1a1a3a] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50"
                >
                  {LANGUAGES.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors ${
                        currentLang === language.code ? "bg-purple-500/20" : ""
                      }`}
                      data-testid={`lang-${language.code}`}
                    >
                      <span className="text-xl">{language.flag}</span>
                      <span>{language.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        {/* Hero */}
        <section className="text-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="bg-white/10 text-amber-400 border border-amber-400/30 mb-6 px-4 py-2">
              <PartyPopper className="w-4 h-4 mr-2 inline" />
              {t.badge}
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                {t.happyNewYear}
              </span>
              <br />
              <span className="text-white">{t.year}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-8">
              {t.subtitle}{" "}
              <span className="text-purple-400 font-bold">{t.appName}</span>{" "}
              {t.atThe}{" "}
              <span className="text-cyan-400 font-bold">{t.summit}</span>
            </p>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <p className="text-white/50 text-sm mb-4 uppercase tracking-wider">{t.countdown}</p>
            <div className="flex justify-center gap-4">
              {[
                { value: countdown.days, label: t.days },
                { value: countdown.hours, label: t.hours },
                { value: countdown.mins, label: t.minutes },
                { value: countdown.secs, label: t.seconds },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-purple-600/30 to-cyan-600/30 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                      {String(item.value).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="text-white/50 text-xs mt-2">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Event Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border border-white/10 backdrop-blur-lg">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="bg-amber-500/20 text-amber-400 border-0 mb-4">
                    🎯 {t.officialLaunch}
                  </Badge>
                  <h2 className="text-3xl font-bold mb-4">{t.summitTitle}</h2>
                  <p className="text-white/70 mb-6">{t.summitDesc}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-white/80">
                      <Calendar className="w-5 h-5 text-amber-400" />
                      <span>{t.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <MapPin className="w-5 h-5 text-cyan-400" />
                      <span>{t.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <Globe className="w-5 h-5 text-purple-400" />
                      <span>{t.broadcast}</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="aspect-video rounded-2xl bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border border-white/10 flex items-center justify-center cursor-pointer group">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-20 h-20 rounded-full bg-white/10 backdrop-blur flex items-center justify-center"
                    >
                      <Play className="w-10 h-10 text-white fill-white" />
                    </motion.div>
                    <p className="absolute bottom-4 left-4 right-4 text-white/80 text-sm">{t.comingSoon}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            <Rocket className="w-6 h-6 inline mr-2 text-amber-400" />
            {t.whatLaunching}
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Users, title: t.verticals, desc: t.verticalsDesc, color: "from-purple-500 to-indigo-500" },
              { icon: Sparkles, title: t.aimee, desc: t.aimeeDesc, color: "from-cyan-500 to-teal-500" },
              { icon: Trophy, title: t.commandCentre, desc: t.commandDesc, color: "from-amber-500 to-orange-500" }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Captain's Message */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/30">
            <CardContent className="p-8 text-center">
              <Badge className="bg-amber-500/20 text-amber-400 border-0 mb-4">
                📜 {t.captainMessage}
              </Badge>
              <h3 className="text-2xl font-bold mb-4">"{t.motto}"</h3>
              <p className="text-white/80 max-w-2xl mx-auto mb-6 text-lg italic">"{t.message}"</p>
              <p className="text-amber-400 font-bold">- {t.signature}</p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Share */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="text-center"
        >
          <h3 className="text-xl font-bold mb-6">
            <Share2 className="w-5 h-5 inline mr-2" />
            {t.share}
          </h3>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <Button onClick={() => handleShare("twitter")} className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/80">
              <Twitter className="w-4 h-4 mr-2" /> Twitter
            </Button>
            <Button onClick={() => handleShare("linkedin")} className="bg-[#0A66C2] hover:bg-[#0A66C2]/80">
              <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
            </Button>
            <Button onClick={() => handleShare("email")} className="bg-gray-600 hover:bg-gray-600/80">
              <Mail className="w-4 h-4 mr-2" /> Email
            </Button>
            <Button onClick={handleCopyLink} variant="outline" className="border-white/20">
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? t.copied : t.copyLink}
            </Button>
          </div>

          {/* Language Quick Links */}
          <div className="mt-8 flex justify-center gap-2 flex-wrap">
            {LANGUAGES.map((language) => (
              <Button
                key={language.code}
                variant={currentLang === language.code ? "default" : "ghost"}
                size="sm"
                onClick={() => handleLanguageChange(language.code)}
                className={currentLang === language.code ? "bg-purple-600" : "text-white/60 hover:text-white"}
              >
                {language.flag} {language.name}
              </Button>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-12 flex justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-8"
              onClick={() => navigate("/mission-board")}
            >
              <Rocket className="w-5 h-5 mr-2" />
              {t.viewMission}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
              onClick={() => navigate("/command-centre")}
            >
              <Zap className="w-5 h-5 mr-2" />
              {t.viewCommand}
            </Button>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="mt-20 text-center text-white/40 text-sm">
          <p>{t.footer1}</p>
          <p>{t.footer2}</p>
          <p className="mt-4">
            <Star className="w-4 h-4 inline text-amber-400" />
            {" "}{t.worldExpo}{" "}
            <Star className="w-4 h-4 inline text-amber-400" />
          </p>
        </footer>
      </main>
    </div>
  );
}
