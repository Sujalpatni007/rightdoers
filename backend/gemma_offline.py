"""
Gemma Offline AI Service - DOERS Career Guidance
For Rural India: Srikakulum (Telugu) & Chickmagalur (Kannada)

Uses Gemma 3n (270M parameters) - designed for offline, on-device inference
on basic Android phones (₹5,000-10,000 range)

Architecture:
1. Backend service with sync-when-online capability
2. Offline-first with cached career guidance responses
3. Multi-lingual support: Telugu, Kannada, Hindi, English
"""

import os
import json
import hashlib
import asyncio
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import logging
import uuid

load_dotenv()

logger = logging.getLogger(__name__)

# ============================================
# SUPPORTED LANGUAGES FOR RURAL INDIA
# ============================================

RURAL_LANGUAGES = {
    "te": {
        "name": "Telugu",
        "native": "తెలుగు",
        "region": "Srikakulum, Andhra Pradesh",
        "font": "Noto Sans Telugu",
        "greeting": "నమస్కారం",
        "direction": "ltr"
    },
    "kn": {
        "name": "Kannada",
        "native": "ಕನ್ನಡ",
        "region": "Chickmagalur, Karnataka",
        "font": "Noto Sans Kannada",
        "greeting": "ನಮಸ್ಕಾರ",
        "direction": "ltr"
    },
    "hi": {
        "name": "Hindi",
        "native": "हिंदी",
        "region": "Pan-India",
        "font": "Noto Sans Devanagari",
        "greeting": "नमस्ते",
        "direction": "ltr"
    },
    "en": {
        "name": "English",
        "native": "English",
        "region": "Universal",
        "font": "Inter",
        "greeting": "Hello",
        "direction": "ltr"
    }
}

# ============================================
# OFFLINE CAREER GUIDANCE DATA
# Pre-cached for areas with no network
# ============================================

OFFLINE_CAREER_GUIDANCE = {
    "lig_workers": {
        "name": "LIG Workers (Low Income Group)",
        "en": {
            "sectors": [
                {
                    "name": "Digital Skills",
                    "description": "Learn computer basics, data entry, mobile app usage",
                    "salary_range": "₹8,000 - ₹15,000/month",
                    "training_duration": "3-6 months",
                    "job_opportunities": ["Data Entry Operator", "Digital Assistant", "Mobile Banking Helper"]
                },
                {
                    "name": "Agriculture Technology",
                    "description": "Modern farming techniques, crop management apps",
                    "salary_range": "₹10,000 - ₹20,000/month",
                    "training_duration": "3 months",
                    "job_opportunities": ["Farm Advisor", "AgriTech Assistant", "Crop Health Monitor"]
                },
                {
                    "name": "Healthcare Support",
                    "description": "ASHA worker training, basic health monitoring",
                    "salary_range": "₹6,000 - ₹12,000/month",
                    "training_duration": "6 months",
                    "job_opportunities": ["ASHA Worker", "Health Assistant", "Medicine Distributor"]
                },
                {
                    "name": "Skilled Trades",
                    "description": "Electrical, plumbing, carpentry with certification",
                    "salary_range": "₹12,000 - ₹25,000/month",
                    "training_duration": "6-12 months",
                    "job_opportunities": ["Certified Electrician", "Plumber", "Carpenter"]
                }
            ]
        },
        "te": {
            "sectors": [
                {
                    "name": "డిజిటల్ నైపుణ్యాలు",
                    "description": "కంప్యూటర్ బేసిక్స్, డేటా ఎంట్రీ, మొబైల్ యాప్ వినియోగం నేర్చుకోండి",
                    "salary_range": "₹8,000 - ₹15,000/నెల",
                    "training_duration": "3-6 నెలలు",
                    "job_opportunities": ["డేటా ఎంట్రీ ఆపరేటర్", "డిజిటల్ అసిస్టెంట్", "మొబైల్ బ్యాంకింగ్ హెల్పర్"]
                },
                {
                    "name": "వ్యవసాయ సాంకేతికత",
                    "description": "ఆధునిక వ్యవసాయ పద్ధతులు, పంట నిర్వహణ యాప్‌లు",
                    "salary_range": "₹10,000 - ₹20,000/నెల",
                    "training_duration": "3 నెలలు",
                    "job_opportunities": ["ఫార్మ్ అడ్వైజర్", "అగ్రిటెక్ అసిస్టెంట్", "పంట ఆరోగ్య మానిటర్"]
                },
                {
                    "name": "ఆరోగ్య సహాయం",
                    "description": "ఆశా వర్కర్ శిక్షణ, ప్రాథమిక ఆరోగ్య పర్యవేక్షణ",
                    "salary_range": "₹6,000 - ₹12,000/నెల",
                    "training_duration": "6 నెలలు",
                    "job_opportunities": ["ఆశా వర్కర్", "హెల్త్ అసిస్టెంట్", "మెడిసిన్ డిస్ట్రిబ్యూటర్"]
                },
                {
                    "name": "నైపుణ్య వృత్తులు",
                    "description": "ఎలక్ట్రికల్, ప్లంబింగ్, కార్పెంట్రీ ధృవీకరణతో",
                    "salary_range": "₹12,000 - ₹25,000/నెల",
                    "training_duration": "6-12 నెలలు",
                    "job_opportunities": ["సర్టిఫైడ్ ఎలక్ట్రీషియన్", "ప్లంబర్", "కార్పెంటర్"]
                }
            ]
        },
        "kn": {
            "sectors": [
                {
                    "name": "ಡಿಜಿಟಲ್ ಕೌಶಲ್ಯಗಳು",
                    "description": "ಕಂಪ್ಯೂಟರ್ ಮೂಲಭೂತ, ಡೇಟಾ ಎಂಟ್ರಿ, ಮೊಬೈಲ್ ಆಪ್ ಬಳಕೆ ಕಲಿಯಿರಿ",
                    "salary_range": "₹8,000 - ₹15,000/ತಿಂಗಳು",
                    "training_duration": "3-6 ತಿಂಗಳು",
                    "job_opportunities": ["ಡೇಟಾ ಎಂಟ್ರಿ ಆಪರೇಟರ್", "ಡಿಜಿಟಲ್ ಸಹಾಯಕ", "ಮೊಬೈಲ್ ಬ್ಯಾಂಕಿಂಗ್ ಸಹಾಯಕ"]
                },
                {
                    "name": "ಕೃಷಿ ತಂತ್ರಜ್ಞಾನ",
                    "description": "ಆಧುನಿಕ ಕೃಷಿ ತಂತ್ರಗಳು, ಬೆಳೆ ನಿರ್ವಹಣೆ ಆಪ್‌ಗಳು",
                    "salary_range": "₹10,000 - ₹20,000/ತಿಂಗಳು",
                    "training_duration": "3 ತಿಂಗಳು",
                    "job_opportunities": ["ಕೃಷಿ ಸಲಹೆಗಾರ", "ಅಗ್ರಿಟೆಕ್ ಸಹಾಯಕ", "ಬೆಳೆ ಆರೋಗ್ಯ ಮಾನಿಟರ್"]
                },
                {
                    "name": "ಆರೋಗ್ಯ ಬೆಂಬಲ",
                    "description": "ಆಶಾ ಕೆಲಸಗಾರ ತರಬೇತಿ, ಮೂಲಭೂತ ಆರೋಗ್ಯ ಮೇಲ್ವಿಚಾರಣೆ",
                    "salary_range": "₹6,000 - ₹12,000/ತಿಂಗಳು",
                    "training_duration": "6 ತಿಂಗಳು",
                    "job_opportunities": ["ಆಶಾ ಕೆಲಸಗಾರ", "ಆರೋಗ್ಯ ಸಹಾಯಕ", "ಔಷಧ ವಿತರಕ"]
                },
                {
                    "name": "ಕುಶಲ ವೃತ್ತಿಗಳು",
                    "description": "ವಿದ್ಯುತ್, ಪ್ಲಂಬಿಂಗ್, ಮರಗೆಲಸ ಪ್ರಮಾಣೀಕರಣದೊಂದಿಗೆ",
                    "salary_range": "₹12,000 - ₹25,000/ತಿಂಗಳು",
                    "training_duration": "6-12 ತಿಂಗಳು",
                    "job_opportunities": ["ಪ್ರಮಾಣಿತ ಎಲೆಕ್ಟ್ರಿಶಿಯನ್", "ಪ್ಲಂಬರ್", "ಮರಗೆಲಸಗಾರ"]
                }
            ]
        }
    },
    "students": {
        "name": "Students & Youth",
        "en": {
            "paths": [
                {
                    "education_level": "10th Pass",
                    "options": [
                        "ITI Courses (Electrician, Fitter, Mechanic)",
                        "Diploma in Computer Applications",
                        "Skill India Programmes",
                        "Apprenticeship Schemes"
                    ]
                },
                {
                    "education_level": "12th Pass",
                    "options": [
                        "Polytechnic Diploma",
                        "B.Voc (Bachelor of Vocation)",
                        "Online Degree Programs",
                        "Government Job Preparation (Railway, SSC, Bank)"
                    ]
                },
                {
                    "education_level": "Graduate",
                    "options": [
                        "Digital Marketing Certification",
                        "Software Development Bootcamp",
                        "Government Services (UPSC, State PSC)",
                        "Entrepreneurship Programs"
                    ]
                }
            ]
        }
    },
    "women_empowerment": {
        "name": "Women Empowerment",
        "en": {
            "opportunities": [
                {
                    "name": "Self Help Groups (SHG)",
                    "description": "Join local SHGs for micro-finance and business support",
                    "income_potential": "₹5,000 - ₹15,000/month"
                },
                {
                    "name": "Anganwadi Worker",
                    "description": "Government program for child and maternal healthcare",
                    "income_potential": "₹4,500 - ₹10,000/month + benefits"
                },
                {
                    "name": "Tailoring & Fashion",
                    "description": "Learn tailoring, embroidery, fashion designing",
                    "income_potential": "₹8,000 - ₹20,000/month"
                },
                {
                    "name": "Beauty & Wellness",
                    "description": "Beauty parlor, mehendi, spa services",
                    "income_potential": "₹10,000 - ₹30,000/month"
                }
            ]
        }
    }
}

# ============================================
# CACHED RESPONSES FOR OFFLINE USE
# ============================================

OFFLINE_FAQ = {
    "en": {
        "what_career_suits_me": "Based on your interests and education, I recommend exploring: 1) Digital Skills for steady office jobs, 2) Skilled Trades for higher income, 3) Agriculture Tech if you have farming background. What's your education level?",
        "how_to_improve_income": "To improve income: 1) Get certified skills through ITI/Skill India, 2) Join government schemes like PMKVY, 3) Learn digital skills (computer, mobile apps), 4) Start small business with SHG support.",
        "government_schemes": "Key government schemes: 1) PMKVY (Pradhan Mantri Kaushal Vikas Yojana), 2) Mudra Loan for business, 3) Skill India Digital, 4) National Apprenticeship Scheme. Visit your nearest Common Service Centre for help.",
        "default": "I'm here to help with career guidance. You can ask about: 1) Career options for your education level, 2) Government schemes, 3) Skill development programs, 4) Job opportunities in your area."
    },
    "te": {
        "what_career_suits_me": "మీ ఆసక్తులు మరియు విద్య ఆధారంగా, నేను సిఫార్సు చేస్తున్నాను: 1) స్థిరమైన ఆఫీస్ ఉద్యోగాల కోసం డిజిటల్ స్కిల్స్, 2) అధిక ఆదాయం కోసం నైపుణ్య వృత్తులు, 3) వ్యవసాయ నేపథ్యం ఉంటే వ్యవసాయ టెక్. మీ విద్యా స్థాయి ఏమిటి?",
        "how_to_improve_income": "ఆదాయాన్ని మెరుగుపరచడానికి: 1) ITI/స్కిల్ ఇండియా ద్వారా సర్టిఫైడ్ స్కిల్స్ పొందండి, 2) PMKVY వంటి ప్రభుత్వ పథకాలలో చేరండి, 3) డిజిటల్ స్కిల్స్ నేర్చుకోండి, 4) SHG సపోర్ట్‌తో చిన్న వ్యాపారం ప్రారంభించండి.",
        "government_schemes": "ముఖ్య ప్రభుత్వ పథకాలు: 1) PMKVY, 2) వ్యాపారం కోసం ముద్ర లోన్, 3) స్కిల్ ఇండియా డిజిటల్, 4) నేషనల్ అప్రెంటిస్‌షిప్ స్కీమ్. సహాయం కోసం మీ సమీపంలోని కామన్ సర్వీస్ సెంటర్ సందర్శించండి.",
        "default": "నేను కెరీర్ మార్గదర్శనంలో సహాయం చేయడానికి ఇక్కడ ఉన్నాను. మీరు అడగవచ్చు: 1) మీ విద్యా స్థాయికి కెరీర్ ఆప్షన్లు, 2) ప్రభుత్వ పథకాలు, 3) స్కిల్ డెవలప్‌మెంట్ ప్రోగ్రామ్‌లు, 4) మీ ప్రాంతంలో ఉద్యోగ అవకాశాలు."
    },
    "kn": {
        "what_career_suits_me": "ನಿಮ್ಮ ಆಸಕ್ತಿಗಳು ಮತ್ತು ಶಿಕ್ಷಣದ ಆಧಾರದ ಮೇಲೆ, ನಾನು ಶಿಫಾರಸು ಮಾಡುತ್ತೇನೆ: 1) ಸ್ಥಿರ ಕಚೇರಿ ಕೆಲಸಗಳಿಗೆ ಡಿಜಿಟಲ್ ಕೌಶಲ್ಯಗಳು, 2) ಹೆಚ್ಚಿನ ಆದಾಯಕ್ಕೆ ಕುಶಲ ವ್ಯಾಪಾರಗಳು, 3) ಕೃಷಿ ಹಿನ್ನೆಲೆ ಇದ್ದರೆ ಕೃಷಿ ತಂತ್ರಜ್ಞಾನ. ನಿಮ್ಮ ಶಿಕ್ಷಣ ಮಟ್ಟ ಏನು?",
        "how_to_improve_income": "ಆದಾಯವನ್ನು ಸುಧಾರಿಸಲು: 1) ITI/ಸ್ಕಿಲ್ ಇಂಡಿಯಾ ಮೂಲಕ ಪ್ರಮಾಣಿತ ಕೌಶಲ್ಯಗಳನ್ನು ಪಡೆಯಿರಿ, 2) PMKVY ನಂತಹ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳಲ್ಲಿ ಸೇರಿ, 3) ಡಿಜಿಟಲ್ ಕೌಶಲ್ಯಗಳನ್ನು ಕಲಿಯಿರಿ, 4) SHG ಬೆಂಬಲದೊಂದಿಗೆ ಸಣ್ಣ ವ್ಯಾಪಾರ ಪ್ರಾರಂಭಿಸಿ.",
        "government_schemes": "ಪ್ರಮುಖ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು: 1) PMKVY, 2) ವ್ಯಾಪಾರಕ್ಕೆ ಮುದ್ರಾ ಸಾಲ, 3) ಸ್ಕಿಲ್ ಇಂಡಿಯಾ ಡಿಜಿಟಲ್, 4) ರಾಷ್ಟ್ರೀಯ ಅಪ್ರೆಂಟಿಸ್‌ಶಿಪ್ ಯೋಜನೆ. ಸಹಾಯಕ್ಕಾಗಿ ನಿಮ್ಮ ಹತ್ತಿರದ ಕಾಮನ್ ಸರ್ವೀಸ್ ಸೆಂಟರ್ ಭೇಟಿ ಮಾಡಿ.",
        "default": "ನಾನು ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನದಲ್ಲಿ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ. ನೀವು ಕೇಳಬಹುದು: 1) ನಿಮ್ಮ ಶಿಕ್ಷಣ ಮಟ್ಟಕ್ಕೆ ವೃತ್ತಿ ಆಯ್ಕೆಗಳು, 2) ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, 3) ಕೌಶಲ್ಯ ಅಭಿವೃದ್ಧಿ ಕಾರ್ಯಕ್ರಮಗಳು, 4) ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ಉದ್ಯೋಗಾವಕಾಶಗಳು."
    }
}

# ============================================
# PYDANTIC MODELS
# ============================================

class GemmaQuery(BaseModel):
    """Query for Gemma offline AI"""
    query: str
    language: str = Field(default="en", pattern="^(en|te|kn|hi)$")
    user_context: Optional[Dict[str, Any]] = None
    education_level: Optional[str] = None
    region: Optional[str] = None
    is_offline: bool = False

class GemmaResponse(BaseModel):
    """Response from Gemma AI"""
    id: str = Field(default_factory=lambda: f"GEMMA-{str(uuid.uuid4())[:8].upper()}")
    response: str
    language: str
    is_cached: bool = False
    cache_key: Optional[str] = None
    related_resources: List[Dict[str, Any]] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class OfflineCacheEntry(BaseModel):
    """Cached response for offline use"""
    cache_key: str
    query_hash: str
    response: str
    language: str
    category: str
    created_at: str
    expires_at: str
    access_count: int = 0

# ============================================
# GEMMA OFFLINE SERVICE
# ============================================

class GemmaOfflineService:
    """
    Gemma 3n Offline AI Service for Rural India
    
    Features:
    - Offline-first with pre-cached responses
    - Telugu and Kannada language support
    - Career guidance for LIG workers
    - Sync-when-online capability
    """
    
    def __init__(self):
        self.api_key = os.environ.get("EMERGENT_LLM_KEY")
        self.ollama_url = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")
        self.model_name = "gemma-3-270m"  # Gemma 3n for mobile
        self.cache = {}
        self._load_offline_cache()
    
    def _load_offline_cache(self):
        """Pre-load offline cache with common responses"""
        for lang, faqs in OFFLINE_FAQ.items():
            for key, response in faqs.items():
                cache_key = f"{lang}:{key}"
                self.cache[cache_key] = {
                    "response": response,
                    "language": lang,
                    "is_cached": True
                }
        logger.info(f"Loaded {len(self.cache)} offline cache entries")
    
    def _generate_cache_key(self, query: str, language: str) -> str:
        """Generate cache key from query"""
        normalized = query.lower().strip()
        hash_input = f"{language}:{normalized}"
        return hashlib.md5(hash_input.encode()).hexdigest()[:12]
    
    def _match_offline_query(self, query: str, language: str) -> Optional[str]:
        """Match query to pre-cached response using keyword matching"""
        query_lower = query.lower()
        
        # Keyword matching for common questions
        keyword_map = {
            "career": "what_career_suits_me",
            "job": "what_career_suits_me",
            "work": "what_career_suits_me",
            "income": "how_to_improve_income",
            "salary": "how_to_improve_income",
            "money": "how_to_improve_income",
            "government": "government_schemes",
            "scheme": "government_schemes",
            "pmkvy": "government_schemes",
            "mudra": "government_schemes",
        }
        
        # Telugu keywords
        telugu_keywords = {
            "కెరీర్": "what_career_suits_me",
            "ఉద్యోగం": "what_career_suits_me",
            "ఆదాయం": "how_to_improve_income",
            "ప్రభుత్వ": "government_schemes",
        }
        
        # Kannada keywords
        kannada_keywords = {
            "ವೃತ್ತಿ": "what_career_suits_me",
            "ಕೆಲಸ": "what_career_suits_me",
            "ಆದಾಯ": "how_to_improve_income",
            "ಸರ್ಕಾರ": "government_schemes",
        }
        
        all_keywords = {**keyword_map}
        if language == "te":
            all_keywords.update(telugu_keywords)
        elif language == "kn":
            all_keywords.update(kannada_keywords)
        
        for keyword, faq_key in all_keywords.items():
            if keyword in query_lower:
                cache_key = f"{language}:{faq_key}"
                if cache_key in self.cache:
                    return self.cache[cache_key]["response"]
        
        # Return default response
        default_key = f"{language}:default"
        if default_key in self.cache:
            return self.cache[default_key]["response"]
        
        return None
    
    def get_career_data(self, category: str, language: str) -> Dict[str, Any]:
        """Get pre-loaded career guidance data for offline use"""
        if category in OFFLINE_CAREER_GUIDANCE:
            data = OFFLINE_CAREER_GUIDANCE[category]
            lang_data = data.get(language, data.get("en", {}))
            return {
                "name": data.get("name"),
                "data": lang_data,
                "language": language
            }
        return {}
    
    async def get_offline_response(self, query: GemmaQuery) -> GemmaResponse:
        """Get response using offline cache"""
        # Try to match from cache
        cached_response = self._match_offline_query(query.query, query.language)
        
        if cached_response:
            return GemmaResponse(
                response=cached_response,
                language=query.language,
                is_cached=True,
                cache_key=self._generate_cache_key(query.query, query.language),
                related_resources=self._get_related_resources(query)
            )
        
        # If no cache match, return helpful default
        lang_info = RURAL_LANGUAGES.get(query.language, RURAL_LANGUAGES["en"])
        default_response = f"{lang_info['greeting']}! " + OFFLINE_FAQ.get(query.language, OFFLINE_FAQ["en"]).get("default", "")
        
        return GemmaResponse(
            response=default_response,
            language=query.language,
            is_cached=True,
            related_resources=self._get_related_resources(query)
        )
    
    async def get_online_response(self, query: GemmaQuery) -> GemmaResponse:
        """Get response using online Gemma API or LLM"""
        try:
            from emergentintegrations.llm.chat import LlmChat, UserMessage
            
            # Build system prompt
            lang_info = RURAL_LANGUAGES.get(query.language, RURAL_LANGUAGES["en"])
            
            system_prompt = f"""You are DOERS Career Guide AI, helping people in rural India find career opportunities.
            
Current user language: {lang_info['name']} ({lang_info['native']})
Region focus: {lang_info['region']}

Your role:
1. Provide practical career guidance for LIG (Low Income Group) workers
2. Recommend government schemes like PMKVY, Mudra Loan, Skill India
3. Suggest skill development paths based on education level
4. Be encouraging and use simple language
5. ALWAYS respond in {lang_info['name']} language

Context about the user:
- Education level: {query.education_level or 'Not specified'}
- Region: {query.region or lang_info['region']}

Provide helpful, practical career advice."""

            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"gemma_{uuid.uuid4()}",
                system_message=system_prompt
            ).with_model("gemini", "gemini-3-flash-preview")
            
            user_message = UserMessage(text=query.query)
            response = await chat.send_message(user_message)
            
            # Cache the response for future offline use
            cache_key = self._generate_cache_key(query.query, query.language)
            self.cache[cache_key] = {
                "response": response,
                "language": query.language,
                "is_cached": False
            }
            
            return GemmaResponse(
                response=response,
                language=query.language,
                is_cached=False,
                cache_key=cache_key,
                related_resources=self._get_related_resources(query)
            )
            
        except Exception as e:
            logger.error(f"Online response error: {e}")
            # Fallback to offline response
            return await self.get_offline_response(query)
    
    def _get_related_resources(self, query: GemmaQuery) -> List[Dict[str, Any]]:
        """Get related career resources based on query"""
        resources = []
        
        # Add relevant career data
        career_data = self.get_career_data("lig_workers", query.language)
        if career_data.get("data"):
            sectors = career_data["data"].get("sectors", [])[:3]
            for sector in sectors:
                resources.append({
                    "type": "career_path",
                    "name": sector.get("name"),
                    "salary_range": sector.get("salary_range")
                })
        
        return resources
    
    async def process_query(self, query: GemmaQuery) -> GemmaResponse:
        """Main entry point - decides offline vs online processing"""
        if query.is_offline:
            return await self.get_offline_response(query)
        else:
            return await self.get_online_response(query)
    
    def get_supported_languages(self) -> Dict[str, Dict]:
        """Get list of supported languages"""
        return RURAL_LANGUAGES
    
    def get_offline_career_data(self) -> Dict[str, Any]:
        """Get all offline career data for sync"""
        return OFFLINE_CAREER_GUIDANCE

# ============================================
# DOERS SCORE CALCULATOR FOR RURAL USERS
# ============================================

def calculate_rural_doers_score(
    education_level: str,
    skills: List[str],
    work_experience_years: int,
    certifications: int,
    language_proficiency: Dict[str, str]
) -> int:
    """
    Calculate DoersScore™ for rural users
    Scale: 300-900 (like CIBIL)
    """
    base_score = 500
    
    # Education points
    education_scores = {
        "below_10th": 0,
        "10th_pass": 30,
        "12th_pass": 60,
        "diploma": 80,
        "graduate": 100,
        "postgraduate": 120
    }
    base_score += education_scores.get(education_level, 0)
    
    # Skills points (10 each, max 50)
    base_score += min(len(skills) * 10, 50)
    
    # Experience points (10 per year, max 100)
    base_score += min(work_experience_years * 10, 100)
    
    # Certifications (20 each, max 80)
    base_score += min(certifications * 20, 80)
    
    # Language proficiency bonus
    for lang, level in language_proficiency.items():
        if level == "fluent":
            base_score += 15
        elif level == "conversational":
            base_score += 10
        elif level == "basic":
            base_score += 5
    
    # Ensure score is in valid range
    return max(300, min(900, base_score))

# ============================================
# GLOBAL SERVICE INSTANCE
# ============================================

gemma_service = GemmaOfflineService()
