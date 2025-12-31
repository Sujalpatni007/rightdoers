import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Astro Doer - The playful mascot (like Duolingo's Duo)
// Personality: Playful friend, Gen Z appeal

const ASTRO_MOODS = {
  happy: '😊',
  excited: '🤩',
  thinking: '🤔',
  wow: '😮',
  celebrate: '🥳',
  wave: '👋',
  sleeping: '😴',
  rocket: '🚀',
  star: '⭐',
  fire: '🔥',
};

const ASTRO_MESSAGES = {
  en: {
    greeting: ["Hey there! Ready to explore? 🚀", "What's up, future star! ✨", "Let's make today awesome!"],
    streak: ["Fire streak! 🔥", "You're on a roll!", "Unstoppable!"],
    complete: ["WOW! Nailed it! 🎉", "You're a rockstar!", "Mission complete!"],
    encourage: ["You got this! 💪", "Almost there!", "Keep pushing!"],
    miss: ["Hey! Don't leave me! 😢", "Come back, friend!", "Your mission awaits!"],
    dcoin: ["Cha-ching! +D-COIN 💎", "Money moves! 💰", "You're earning!"],
  },
  hi: {
    greeting: ["नमस्ते! तैयार हो? 🚀", "क्या हाल है, सुपरस्टार! ✨", "आज का दिन शानदार बनाएं!"],
    streak: ["फायर स्ट्रीक! 🔥", "तुम आग पर हो!", "अजेय!"],
    complete: ["वाह! बहुत बढ़िया! 🎉", "तुम रॉकस्टार हो!", "मिशन पूरा!"],
    encourage: ["तुम कर सकते हो! 💪", "बस थोड़ा और!", "आगे बढ़ो!"],
    miss: ["अरे! मुझे छोड़ मत जाओ! 😢", "वापस आओ, दोस्त!", "तुम्हारा मिशन इंतजार कर रहा है!"],
    dcoin: ["छन-छन! +D-COIN 💎", "पैसे कमाओ! 💰", "कमाई हो रही है!"],
  },
  kn: {
    greeting: ["ಹಾಯ್! ಸಿದ್ಧವಾ? 🚀", "ಏನು ಸಮಾಚಾರ, ಸೂಪರ್‌ಸ್ಟಾರ್! ✨", "ಇಂದು ಅದ್ಭುತವಾಗಿ ಮಾಡೋಣ!"],
    streak: ["ಫೈರ್ ಸ್ಟ್ರೀಕ್! 🔥", "ನೀವು ಉರಿಯುತ್ತಿದ್ದೀರಿ!", "ಅಜೇಯ!"],
    complete: ["ವಾವ್! ಅದ್ಭುತ! 🎉", "ನೀವು ರಾಕ್‌ಸ್ಟಾರ್!", "ಮಿಷನ್ ಪೂರ್ಣ!"],
    encourage: ["ನಿಮಗೆ ಸಾಧ್ಯ! 💪", "ಸ್ವಲ್ಪವೇ ಬಾಕಿ!", "ಮುಂದುವರಿಸಿ!"],
    miss: ["ಹೇ! ನನ್ನನ್ನು ಬಿಡಬೇಡಿ! 😢", "ಹಿಂತಿರುಗಿ ಬನ್ನಿ!", "ನಿಮ್ಮ ಮಿಷನ್ ಕಾಯುತ್ತಿದೆ!"],
    dcoin: ["ಛಣ-ಛಣ! +D-COIN 💎", "ಹಣ ಬರುತ್ತಿದೆ! 💰", "ಸಂಪಾದಿಸುತ್ತಿದ್ದೀರಿ!"],
  },
  ta: {
    greeting: ["ஹாய்! தயாரா? 🚀", "என்ன விசேஷம், சூப்பர்ஸ்டார்! ✨", "இன்று அற்புதமாக இருக்கட்டும்!"],
    streak: ["ஃபயர் ஸ்ட்ரீக்! 🔥", "நீங்கள் எரிகிறீர்கள்!", "அஜெய்!"],
    complete: ["வாவ்! அருமை! 🎉", "நீங்கள் ராக்ஸ்டார்!", "மிஷன் முடிந்தது!"],
    encourage: ["உங்களால் முடியும்! 💪", "கொஞ்சம் மட்டுமே!", "தொடருங்கள்!"],
    miss: ["ஏய்! என்னை விட்டு போகாதே! 😢", "திரும்பி வா!", "உங்கள் மிஷன் காத்திருக்கிறது!"],
    dcoin: ["சன்-சன்! +D-COIN 💎", "பணம் வருகிறது! 💰", "சம்பாதிக்கிறீர்கள்!"],
  },
  te: {
    greeting: ["హాయ్! సిద్ధమా? 🚀", "ఏంటి సమాచారం, సూపర్‌స్టార్! ✨", "ఈరోజు అద్భుతంగా చేద్దాం!"],
    streak: ["ఫైర్ స్ట్రీక్! 🔥", "మీరు మండుతున్నారు!", "అజేయులు!"],
    complete: ["వావ్! అద్భుతం! 🎉", "మీరు రాక్‌స్టార్!", "మిషన్ పూర్తి!"],
    encourage: ["మీరు చేయగలరు! 💪", "కొంచెమే మిగిలింది!", "కొనసాగించండి!"],
    miss: ["హేయ్! నన్ను వదలకండి! 😢", "తిరిగి రండి!", "మీ మిషన్ వేచి ఉంది!"],
    dcoin: ["ఛన్-ఛన్! +D-COIN 💎", "డబ్బు వస్తోంది! 💰", "సంపాదిస్తున్నారు!"],
  },
};

export function AstroDoer({ 
  mood = 'happy', 
  message = null, 
  messageType = 'greeting',
  lang = 'en',
  size = 'md',
  animate = true,
  showBubble = true,
  onTap = null 
}) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [isWaving, setIsWaving] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
    xl: 'w-32 h-32 text-6xl',
  };

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
    } else {
      const messages = ASTRO_MESSAGES[lang]?.[messageType] || ASTRO_MESSAGES.en[messageType];
      setCurrentMessage(messages[Math.floor(Math.random() * messages.length)]);
    }
  }, [message, messageType, lang]);

  const handleTap = () => {
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1000);
    onTap?.();
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      {/* Speech Bubble */}
      <AnimatePresence>
        {showBubble && currentMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-4 py-2 shadow-lg border border-slate-200 max-w-[200px] z-10"
          >
            <p className="text-sm text-slate-700 text-center font-medium">
              {currentMessage}
            </p>
            {/* Bubble tail */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-slate-200 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Astro Character */}
      <motion.button
        onClick={handleTap}
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-xl cursor-pointer`}
        animate={animate ? {
          y: [0, -5, 0],
          rotate: isWaving ? [0, -10, 10, -10, 0] : 0,
        } : {}}
        transition={{
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 0.5 }
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Astronaut helmet */}
        <div className="relative">
          <span className="filter drop-shadow-lg">
            🧑‍🚀
          </span>
          {/* Mood indicator */}
          <span className="absolute -bottom-1 -right-1 text-lg">
            {ASTRO_MOODS[mood] || ASTRO_MOODS.happy}
          </span>
        </div>
      </motion.button>

      {/* Name tag */}
      <motion.p 
        className="text-xs font-bold text-purple-600 mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        ASTRO
      </motion.p>
    </div>
  );
}

// Floating Astro for corners of the screen
export function FloatingAstro({ 
  position = 'bottom-right', 
  lang = 'en',
  onInteract = null 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [streak, setStreak] = useState(7);

  const positionClasses = {
    'bottom-right': 'bottom-20 right-4',
    'bottom-left': 'bottom-20 left-4',
    'top-right': 'top-20 right-4',
    'top-left': 'top-20 left-4',
  };

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-50`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", delay: 1 }}
    >
      <div className="relative">
        {/* Streak badge */}
        <motion.div
          className="absolute -top-2 -left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          🔥 {streak}
        </motion.div>

        <AstroDoer
          mood="excited"
          messageType="greeting"
          lang={lang}
          size="md"
          showBubble={isExpanded}
          onTap={() => {
            setIsExpanded(!isExpanded);
            onInteract?.();
          }}
        />
      </div>
    </motion.div>
  );
}

export default AstroDoer;
