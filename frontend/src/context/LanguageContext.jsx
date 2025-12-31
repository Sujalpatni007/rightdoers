import { createContext, useContext, useState, useEffect } from 'react';
import { translations, getLanguageFromPincode, LANGUAGES } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [pincode, setPincode] = useState('');

  // Auto-detect language from pincode
  useEffect(() => {
    if (pincode && pincode.length >= 2) {
      const detectedLang = getLanguageFromPincode(pincode);
      setLanguage(detectedLang);
    }
  }, [pincode]);

  // Load saved language preference
  useEffect(() => {
    const savedLang = localStorage.getItem('hi-ai-language');
    const savedPincode = localStorage.getItem('hi-ai-pincode');
    if (savedLang) setLanguage(savedLang);
    if (savedPincode) setPincode(savedPincode);
  }, []);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('hi-ai-language', language);
  }, [language]);

  // Translation function
  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  // Get current language info
  const currentLanguage = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const value = {
    language,
    setLanguage,
    pincode,
    setPincode,
    t,
    currentLanguage,
    languages: LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
