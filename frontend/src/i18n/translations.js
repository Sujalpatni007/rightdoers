// Multi-lingual translations for HI AI-APP.COM
// Languages: English, Hindi, Kannada, Tamil, Telugu

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
];

// Pincode-based language detection
export const PINCODE_LANGUAGE_MAP = {
  // Karnataka - Kannada
  '56': 'kn', '57': 'kn', '58': 'kn', '59': 'kn',
  // Tamil Nadu - Tamil  
  '60': 'ta', '61': 'ta', '62': 'ta', '63': 'ta', '64': 'ta',
  // Andhra Pradesh & Telangana - Telugu
  '50': 'te', '51': 'te', '52': 'te', '53': 'te',
  // Delhi NCR, UP, MP, Rajasthan - Hindi
  '11': 'hi', '20': 'hi', '21': 'hi', '22': 'hi', '30': 'hi', '31': 'hi', '45': 'hi', '46': 'hi',
  // Maharashtra - Hindi (Marathi later)
  '40': 'hi', '41': 'hi', '42': 'hi', '43': 'hi', '44': 'hi',
};

export const translations = {
  en: {
    // Header
    brand: 'HI AI-APP.COM',
    tagline: 'Right Doers World',
    
    // Billion Dollar Question
    billionQuestion: 'THE BILLION DOLLAR QUESTION',
    willAI: 'Will AI',
    replaceMe: 'replace me',
    or: 'or',
    empowerMe: 'empower me',
    letAimee: 'Let Agent AIMEE Analyze Your Unique Talents',
    
    // Hero
    welcome: 'Welcome to',
    rightDoers: 'Right Doers',
    world: 'World',
    whoAreYou: 'WHO ARE YOU?',
    findJob: 'Find a Job That Feels Like Play',
    humanAiRobo: 'Human • AI • Robo — Collaborative System',
    completeAimee: 'Complete AIMEE Analysis = Earn 100 D-COIN',
    
    // Personas
    imDoer: "I'm a Doer",
    candidate: 'Candidate',
    needDoer: 'I Need a Doer',
    consumer: 'Consumer',
    hireDoers: 'We Hire Doers',
    corporate: 'Corporate',
    
    // Features
    agentAimee: 'Agent AIMEE',
    aiAnalyzer: 'AI Analyzer',
    doersId: 'DoersID',
    whoYouAre: 'Who Are You?',
    rolePlay: 'Role Play',
    simulation: 'Simulation',
    jobs4me: 'Jobs4Me',
    l1l5: 'L1-L5',
    worldWheel: 'World Wheel',
    roles1000: '1000+ Roles',
    dCoin: 'D-COIN',
    deliverValue: 'Deliver Value',
    clubs5: '5 Clubs',
    framework5c: '5C Framework',
    dreamSiip: 'Dream SIIP',
    familyPlan: 'Family Plan',
    
    // Flywheel
    learn: 'Learn',
    earn: 'Earn',
    live: 'Live',
    energyHarmony: 'My Energy = Your Energy = Both Happy in Harmony',
    
    // CTA
    startJourney: 'Start Your Journey',
    dreamDoDone: 'Dream → Do → Done',
    rightPeople: 'Right People @ Right Place',
    
    // Astro Doer Messages
    astroHi: 'Hi there! I\'m Astro! 🚀',
    astroWelcome: 'Welcome to your career adventure!',
    astroWow: 'WOW! You\'re doing great!',
    astroStreak: 'Amazing streak! Keep it up!',
    astroMiss: 'Hey! Don\'t abandon your mission!',
    astroCelebrate: 'You earned D-COIN! 🎉',
    
    // Navigation
    home: 'Home',
    clubs: 'Clubs',
    gigs: 'Gigs',
    profile: 'Profile',
  },
  
  hi: {
    // Header
    brand: 'HI AI-APP.COM',
    tagline: 'राइट डूअर्स वर्ल्ड',
    
    // Billion Dollar Question
    billionQuestion: 'अरबों का सवाल',
    willAI: 'क्या AI',
    replaceMe: 'मेरी जगह लेगा',
    or: 'या',
    empowerMe: 'मुझे सशक्त करेगा',
    letAimee: 'Agent AIMEE को अपनी प्रतिभा का विश्लेषण करने दें',
    
    // Hero
    welcome: 'स्वागत है',
    rightDoers: 'राइट डूअर्स',
    world: 'वर्ल्ड में',
    whoAreYou: 'आप कौन हैं?',
    findJob: 'एक ऐसी नौकरी खोजें जो खेल जैसी लगे',
    humanAiRobo: 'मानव • AI • रोबो — सहयोगी प्रणाली',
    completeAimee: 'AIMEE विश्लेषण पूरा करें = 100 D-COIN कमाएं',
    
    // Personas
    imDoer: 'मैं एक Doer हूं',
    candidate: 'उम्मीदवार',
    needDoer: 'मुझे Doer चाहिए',
    consumer: 'उपभोक्ता',
    hireDoers: 'हम Doers को नियुक्त करते हैं',
    corporate: 'कॉर्पोरेट',
    
    // Features
    agentAimee: 'Agent AIMEE',
    aiAnalyzer: 'AI विश्लेषक',
    doersId: 'DoersID',
    whoYouAre: 'आप कौन हैं?',
    rolePlay: 'भूमिका खेल',
    simulation: 'सिमुलेशन',
    jobs4me: 'Jobs4Me',
    l1l5: 'L1-L5',
    worldWheel: 'वर्ल्ड व्हील',
    roles1000: '1000+ भूमिकाएं',
    dCoin: 'D-COIN',
    deliverValue: 'मूल्य प्रदान करें',
    clubs5: '5 क्लब',
    framework5c: '5C फ्रेमवर्क',
    dreamSiip: 'ड्रीम SIIP',
    familyPlan: 'परिवार योजना',
    
    // Flywheel
    learn: 'सीखें',
    earn: 'कमाएं',
    live: 'जिएं',
    energyHarmony: 'मेरी ऊर्जा = आपकी ऊर्जा = दोनों सुखी',
    
    // CTA
    startJourney: 'अपनी यात्रा शुरू करें',
    dreamDoDone: 'सपना → करो → पूरा',
    rightPeople: 'सही लोग @ सही जगह',
    
    // Astro Doer Messages
    astroHi: 'नमस्ते! मैं एस्ट्रो हूं! 🚀',
    astroWelcome: 'आपके करियर एडवेंचर में स्वागत है!',
    astroWow: 'वाह! आप बहुत अच्छा कर रहे हैं!',
    astroStreak: 'शानदार स्ट्रीक! जारी रखें!',
    astroMiss: 'अरे! अपना मिशन मत छोड़ो!',
    astroCelebrate: 'आपने D-COIN कमाया! 🎉',
    
    // Navigation
    home: 'होम',
    clubs: 'क्लब',
    gigs: 'गिग्स',
    profile: 'प्रोफाइल',
  },
  
  kn: {
    // Header
    brand: 'HI AI-APP.COM',
    tagline: 'ರೈಟ್ ಡೂಅರ್ಸ್ ವರ್ಲ್ಡ್',
    
    // Billion Dollar Question
    billionQuestion: 'ಶತಕೋಟಿ ಪ್ರಶ್ನೆ',
    willAI: 'AI',
    replaceMe: 'ನನ್ನನ್ನು ಬದಲಾಯಿಸುತ್ತಾ',
    or: 'ಅಥವಾ',
    empowerMe: 'ಸಬಲಗೊಳಿಸುತ್ತಾ',
    letAimee: 'Agent AIMEE ನಿಮ್ಮ ಪ್ರತಿಭೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಿ',
    
    // Hero
    welcome: 'ಸ್ವಾಗತ',
    rightDoers: 'ರೈಟ್ ಡೂಅರ್ಸ್',
    world: 'ವರ್ಲ್ಡ್',
    whoAreYou: 'ನೀವು ಯಾರು?',
    findJob: 'ಆಟದಂತೆ ಅನಿಸುವ ಕೆಲಸ ಹುಡುಕಿ',
    humanAiRobo: 'ಮಾನವ • AI • ರೋಬೋ — ಸಹಕಾರಿ ವ್ಯವಸ್ಥೆ',
    completeAimee: 'AIMEE ವಿಶ್ಲೇಷಣೆ = 100 D-COIN ಗಳಿಸಿ',
    
    // Personas
    imDoer: 'ನಾನು Doer',
    candidate: 'ಅಭ್ಯರ್ಥಿ',
    needDoer: 'ನನಗೆ Doer ಬೇಕು',
    consumer: 'ಗ್ರಾಹಕ',
    hireDoers: 'ನಾವು Doers ನೇಮಕ ಮಾಡುತ್ತೇವೆ',
    corporate: 'ಕಾರ್ಪೊರೇಟ್',
    
    // Features
    agentAimee: 'Agent AIMEE',
    aiAnalyzer: 'AI ವಿಶ್ಲೇಷಕ',
    doersId: 'DoersID',
    whoYouAre: 'ನೀವು ಯಾರು?',
    rolePlay: 'ಪಾತ್ರಾಭಿನಯ',
    simulation: 'ಸಿಮ್ಯುಲೇಶನ್',
    jobs4me: 'Jobs4Me',
    l1l5: 'L1-L5',
    worldWheel: 'ವರ್ಲ್ಡ್ ವೀಲ್',
    roles1000: '1000+ ಪಾತ್ರಗಳು',
    dCoin: 'D-COIN',
    deliverValue: 'ಮೌಲ್ಯ ನೀಡಿ',
    clubs5: '5 ಕ್ಲಬ್‌ಗಳು',
    framework5c: '5C ಚೌಕಟ್ಟು',
    dreamSiip: 'ಡ್ರೀಮ್ SIIP',
    familyPlan: 'ಕುಟುಂಬ ಯೋಜನೆ',
    
    // Flywheel
    learn: 'ಕಲಿಯಿರಿ',
    earn: 'ಗಳಿಸಿ',
    live: 'ಬಾಳಿ',
    energyHarmony: 'ನನ್ನ ಶಕ್ತಿ = ನಿಮ್ಮ ಶಕ್ತಿ = ಇಬ್ಬರೂ ಸಂತೋಷ',
    
    // CTA
    startJourney: 'ನಿಮ್ಮ ಪ್ರಯಾಣ ಪ್ರಾರಂಭಿಸಿ',
    dreamDoDone: 'ಕನಸು → ಮಾಡು → ಸಾಧಿಸು',
    rightPeople: 'ಸರಿಯಾದ ಜನರು @ ಸರಿಯಾದ ಸ್ಥಳ',
    
    // Astro Doer Messages
    astroHi: 'ನಮಸ್ಕಾರ! ನಾನು ಆಸ್ಟ್ರೋ! 🚀',
    astroWelcome: 'ನಿಮ್ಮ ವೃತ್ತಿ ಸಾಹಸಕ್ಕೆ ಸ್ವಾಗತ!',
    astroWow: 'ವಾವ್! ನೀವು ಅದ್ಭುತವಾಗಿ ಮಾಡುತ್ತಿದ್ದೀರಿ!',
    astroStreak: 'ಅದ್ಭುತ ಸ್ಟ್ರೀಕ್! ಮುಂದುವರಿಸಿ!',
    astroMiss: 'ಹೇ! ನಿಮ್ಮ ಮಿಷನ್ ಬಿಡಬೇಡಿ!',
    astroCelebrate: 'ನೀವು D-COIN ಗಳಿಸಿದ್ದೀರಿ! 🎉',
    
    // Navigation
    home: 'ಮನೆ',
    clubs: 'ಕ್ಲಬ್',
    gigs: 'ಗಿಗ್ಸ್',
    profile: 'ಪ್ರೊಫೈಲ್',
  },
  
  ta: {
    // Header
    brand: 'HI AI-APP.COM',
    tagline: 'ரைட் டூயர்ஸ் வேர்ல்ட்',
    
    // Billion Dollar Question
    billionQuestion: 'பில்லியன் டாலர் கேள்வி',
    willAI: 'AI',
    replaceMe: 'என்னை மாற்றுமா',
    or: 'அல்லது',
    empowerMe: 'வலுப்படுத்துமா',
    letAimee: 'Agent AIMEE உங்கள் திறமையை பகுப்பாய்வு செய்யட்டும்',
    
    // Hero
    welcome: 'வரவேற்கிறோம்',
    rightDoers: 'ரைட் டூயர்ஸ்',
    world: 'வேர்ல்ட்',
    whoAreYou: 'நீங்கள் யார்?',
    findJob: 'விளையாட்டு போன்ற வேலையைக் கண்டறியுங்கள்',
    humanAiRobo: 'மனிதன் • AI • ரோபோ — கூட்டு அமைப்பு',
    completeAimee: 'AIMEE பகுப்பாய்வு = 100 D-COIN பெறுங்கள்',
    
    // Personas
    imDoer: 'நான் Doer',
    candidate: 'விண்ணப்பதாரர்',
    needDoer: 'எனக்கு Doer தேவை',
    consumer: 'நுகர்வோர்',
    hireDoers: 'நாங்கள் Doers நியமிக்கிறோம்',
    corporate: 'கார்ப்பரேட்',
    
    // Features
    agentAimee: 'Agent AIMEE',
    aiAnalyzer: 'AI பகுப்பாய்வி',
    doersId: 'DoersID',
    whoYouAre: 'நீங்கள் யார்?',
    rolePlay: 'பாத்திர நாடகம்',
    simulation: 'சிமுலேஷன்',
    jobs4me: 'Jobs4Me',
    l1l5: 'L1-L5',
    worldWheel: 'வேர்ல்ட் வீல்',
    roles1000: '1000+ பாத்திரங்கள்',
    dCoin: 'D-COIN',
    deliverValue: 'மதிப்பு வழங்கு',
    clubs5: '5 கிளப்கள்',
    framework5c: '5C கட்டமைப்பு',
    dreamSiip: 'ட்ரீம் SIIP',
    familyPlan: 'குடும்ப திட்டம்',
    
    // Flywheel
    learn: 'கற்றுக்கொள்',
    earn: 'சம்பாதி',
    live: 'வாழ்',
    energyHarmony: 'என் ஆற்றல் = உங்கள் ஆற்றல் = இருவரும் மகிழ்ச்சி',
    
    // CTA
    startJourney: 'உங்கள் பயணத்தைத் தொடங்குங்கள்',
    dreamDoDone: 'கனவு → செய் → முடி',
    rightPeople: 'சரியான நபர்கள் @ சரியான இடம்',
    
    // Astro Doer Messages
    astroHi: 'வணக்கம்! நான் ஆஸ்ட்ரோ! 🚀',
    astroWelcome: 'உங்கள் தொழில் சாகசத்திற்கு வரவேற்கிறோம்!',
    astroWow: 'வாவ்! நீங்கள் அருமையாக செய்கிறீர்கள்!',
    astroStreak: 'அற்புதமான ஸ்ட்ரீக்! தொடருங்கள்!',
    astroMiss: 'ஏய்! உங்கள் மிஷனை விடாதீர்கள்!',
    astroCelebrate: 'நீங்கள் D-COIN சம்பாதித்தீர்கள்! 🎉',
    
    // Navigation
    home: 'முகப்பு',
    clubs: 'கிளப்',
    gigs: 'கிக்ஸ்',
    profile: 'சுயவிவரம்',
  },
  
  te: {
    // Header
    brand: 'HI AI-APP.COM',
    tagline: 'రైట్ డూయర్స్ వరల్డ్',
    
    // Billion Dollar Question
    billionQuestion: 'బిలియన్ డాలర్ ప్రశ్న',
    willAI: 'AI',
    replaceMe: 'నన్ను భర్తీ చేస్తుందా',
    or: 'లేదా',
    empowerMe: 'శక్తివంతం చేస్తుందా',
    letAimee: 'Agent AIMEE మీ ప్రతిభను విశ్లేషించనివ్వండి',
    
    // Hero
    welcome: 'స్వాగతం',
    rightDoers: 'రైట్ డూయర్స్',
    world: 'వరల్డ్',
    whoAreYou: 'మీరు ఎవరు?',
    findJob: 'ఆట లాగా అనిపించే ఉద్యోగం కనుగొనండి',
    humanAiRobo: 'మానవుడు • AI • రోబో — సహకార వ్యవస్థ',
    completeAimee: 'AIMEE విశ్లేషణ = 100 D-COIN సంపాదించండి',
    
    // Personas
    imDoer: 'నేను Doer',
    candidate: 'అభ్యర్థి',
    needDoer: 'నాకు Doer కావాలి',
    consumer: 'వినియోగదారు',
    hireDoers: 'మేము Doers ను నియమిస్తాము',
    corporate: 'కార్పొరేట్',
    
    // Features
    agentAimee: 'Agent AIMEE',
    aiAnalyzer: 'AI విశ్లేషకుడు',
    doersId: 'DoersID',
    whoYouAre: 'మీరు ఎవరు?',
    rolePlay: 'పాత్ర ఆట',
    simulation: 'సిమ్యులేషన్',
    jobs4me: 'Jobs4Me',
    l1l5: 'L1-L5',
    worldWheel: 'వరల్డ్ వీల్',
    roles1000: '1000+ పాత్రలు',
    dCoin: 'D-COIN',
    deliverValue: 'విలువ అందించు',
    clubs5: '5 క్లబ్‌లు',
    framework5c: '5C ఫ్రేమ్‌వర్క్',
    dreamSiip: 'డ్రీమ్ SIIP',
    familyPlan: 'కుటుంబ ప్రణాళిక',
    
    // Flywheel
    learn: 'నేర్చుకో',
    earn: 'సంపాదించు',
    live: 'జీవించు',
    energyHarmony: 'నా శక్తి = మీ శక్తి = ఇద్దరూ సంతోషం',
    
    // CTA
    startJourney: 'మీ ప్రయాణాన్ని ప్రారంభించండి',
    dreamDoDone: 'కల → చేయి → పూర్తి',
    rightPeople: 'సరైన వ్యక్తులు @ సరైన స్థలం',
    
    // Astro Doer Messages
    astroHi: 'హాయ్! నేను ఆస్ట్రో! 🚀',
    astroWelcome: 'మీ కెరీర్ అడ్వెంచర్‌కు స్వాగతం!',
    astroWow: 'వావ్! మీరు అద్భుతంగా చేస్తున్నారు!',
    astroStreak: 'అద్భుతమైన స్ట్రీక్! కొనసాగించండి!',
    astroMiss: 'హే! మీ మిషన్ వదలకండి!',
    astroCelebrate: 'మీరు D-COIN సంపాదించారు! 🎉',
    
    // Navigation
    home: 'హోమ్',
    clubs: 'క్లబ్',
    gigs: 'గిగ్స్',
    profile: 'ప్రొఫైల్',
  }
};

export const getLanguageFromPincode = (pincode) => {
  if (!pincode || pincode.length < 2) return 'en';
  const prefix = pincode.substring(0, 2);
  return PINCODE_LANGUAGE_MAP[prefix] || 'en';
};

export const t = (key, lang = 'en') => {
  return translations[lang]?.[key] || translations.en[key] || key;
};
