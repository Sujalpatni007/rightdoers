import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export function LanguageSelector({ variant = 'dropdown' }) {
  const { language, setLanguage, languages, currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  if (variant === 'pills') {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={language === lang.code ? 'default' : 'outline'}
            size="sm"
            className={`gap-1 ${language === lang.code ? 'bg-orange-500 hover:bg-orange-600' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
            onClick={() => setLanguage(lang.code)}
          >
            <span>{lang.flag}</span>
            <span>{lang.native}</span>
            {language === lang.code && <Check className="w-3 h-3 ml-1" />}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-white hover:bg-white/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="w-4 h-4" />
        <span>{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.native}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border p-2 min-w-[160px] z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  language === lang.code 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
              >
                <span className="text-lg">{lang.flag}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{lang.native}</p>
                  <p className="text-xs text-slate-500">{lang.name}</p>
                </div>
                {language === lang.code && (
                  <Check className="w-4 h-4 text-orange-500" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LanguageSelector;
