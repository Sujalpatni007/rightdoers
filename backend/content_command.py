"""
Content Command Centre - DOERS AI Content Factory
Creates viral, multi-lingual content for GTM strategy

Features:
1. Multi-lingual Reel Creator with AI Images
2. DoersScore™ Share Card Generator
3. Career Mantra Generator (Entrepreneurs, Students, Corporates)
4. Legal Document Hub (NDA, Offer Letters)
"""

import os
import base64
import asyncio
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import uuid
import logging

load_dotenv()

logger = logging.getLogger(__name__)

# Emergent LLM Key for Gemini Nano Banana
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")

# ============================================
# SUPPORTED INDIAN LANGUAGES
# ============================================

INDIAN_LANGUAGES = {
    "en": {"name": "English", "native": "English", "font": "Inter"},
    "hi": {"name": "Hindi", "native": "हिंदी", "font": "Noto Sans Devanagari"},
    "kn": {"name": "Kannada", "native": "ಕನ್ನಡ", "font": "Noto Sans Kannada"},
    "ta": {"name": "Tamil", "native": "தமிழ்", "font": "Noto Sans Tamil"},
    "te": {"name": "Telugu", "native": "తెలుగు", "font": "Noto Sans Telugu"},
    "mr": {"name": "Marathi", "native": "मराठी", "font": "Noto Sans Devanagari"},
    "bn": {"name": "Bengali", "native": "বাংলা", "font": "Noto Sans Bengali"},
    "gu": {"name": "Gujarati", "native": "ગુજરાતી", "font": "Noto Sans Gujarati"},
    "ml": {"name": "Malayalam", "native": "മലയാളം", "font": "Noto Sans Malayalam"},
    "pa": {"name": "Punjabi", "native": "ਪੰਜਾਬੀ", "font": "Noto Sans Gurmukhi"},
    "or": {"name": "Odia", "native": "ଓଡ଼ିଆ", "font": "Noto Sans Oriya"},
}

# ============================================
# CAREER MANTRA TEMPLATES
# ============================================

CAREER_MANTRAS = {
    "entrepreneur": [
        {"en": "Build your dream or someone else will hire you to build theirs.", "category": "startup"},
        {"en": "Every expert was once a beginner. Start today, succeed tomorrow.", "category": "motivation"},
        {"en": "Your startup idea might change the world. Take the first step.", "category": "startup"},
        {"en": "Fail fast, learn faster. That's the entrepreneur's superpower.", "category": "growth"},
        {"en": "Don't wait for opportunity. Create it.", "category": "action"},
    ],
    "student": [
        {"en": "Your career is a marathon, not a sprint. Start strong.", "category": "planning"},
        {"en": "Skills pay bills. Degrees open doors. Both matter.", "category": "education"},
        {"en": "The best investment you can make is in yourself.", "category": "growth"},
        {"en": "Dream big, start small, act now.", "category": "action"},
        {"en": "Your future self will thank you for learning today.", "category": "motivation"},
    ],
    "corporate": [
        {"en": "Work that feels like play creates extraordinary results.", "category": "passion"},
        {"en": "Lead with purpose. Follow with passion.", "category": "leadership"},
        {"en": "Your career GPS: Passion + Profession + Purpose.", "category": "growth"},
        {"en": "Upskill or be left behind. The choice is yours.", "category": "skills"},
        {"en": "Right people at the right place. That's the DOERS way.", "category": "matching"},
    ],
    "repeater": [
        {"en": "Failure is feedback. Use it to fuel your comeback.", "category": "motivation"},
        {"en": "Your potential isn't defined by one exam result.", "category": "growth"},
        {"en": "This setback is setting you up for a comeback.", "category": "resilience"},
        {"en": "Every great success story has chapters of failure.", "category": "inspiration"},
        {"en": "Learn, adapt, overcome. You've got this.", "category": "action"},
    ]
}

# ============================================
# CONTENT TEMPLATES
# ============================================

REEL_TEMPLATES = {
    "doers_journey": {
        "name": "My DOERS Journey",
        "description": "Share your career transformation story",
        "scenes": ["hero", "challenge", "solution", "result"],
        "style": "inspirational"
    },
    "talent_card_reveal": {
        "name": "Talent Card Reveal",
        "description": "Reveal your DoersScore™ and talents",
        "scenes": ["intro", "score_reveal", "skills_showcase", "cta"],
        "style": "professional"
    },
    "success_story": {
        "name": "Success Story Spotlight",
        "description": "Showcase proven career transformations",
        "scenes": ["before", "transformation", "after", "testimonial"],
        "style": "documentary"
    },
    "career_mantra": {
        "name": "Career Mantra",
        "description": "Daily motivation for dreamers and doers",
        "scenes": ["visual", "quote", "action"],
        "style": "motivational"
    },
    "new_year_wish": {
        "name": "New Year Career Wish",
        "description": "Send career transformation wishes for 2026",
        "scenes": ["celebration", "wish", "journey", "blessing"],
        "style": "festive"
    },
    "5e_journey": {
        "name": "5E Journey Progress",
        "description": "Explore → Educate → Employ → Enterprise → Excel",
        "scenes": ["explore", "educate", "employ", "enterprise", "excel"],
        "style": "progression"
    }
}

# ============================================
# PYDANTIC MODELS
# ============================================

class ReelContent(BaseModel):
    """Multi-lingual reel content"""
    id: str = Field(default_factory=lambda: f"REEL-{str(uuid.uuid4())[:8].upper()}")
    template: str
    title: str
    messages: Dict[str, str]  # language_code -> message
    theme: str = "cosmic"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ShareCard(BaseModel):
    """DoersScore™ Share Card"""
    id: str = Field(default_factory=lambda: f"CARD-{str(uuid.uuid4())[:8].upper()}")
    name: str
    doers_score: int
    adaptive_level: str
    top_skills: List[str]
    career_match: str
    language: str = "en"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class CareerMantra(BaseModel):
    """Daily Career Mantra"""
    id: str = Field(default_factory=lambda: f"MANTRA-{str(uuid.uuid4())[:8].upper()}")
    text: str
    translations: Dict[str, str]
    category: str
    target_audience: str
    image_prompt: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class NDADocument(BaseModel):
    """NDA Document"""
    id: str = Field(default_factory=lambda: f"NDA-{str(uuid.uuid4())[:8].upper()}")
    recipient_name: str
    recipient_email: str
    recipient_phone: str
    company_name: str = "Right Doers World Pvt. Ltd."
    effective_date: str
    jurisdiction: str = "Bangalore, India"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    status: str = "draft"  # draft, sent, signed

class OfferLetter(BaseModel):
    """Offer Letter Document"""
    id: str = Field(default_factory=lambda: f"OFFER-{str(uuid.uuid4())[:8].upper()}")
    candidate_name: str
    candidate_email: str
    position: str
    division: str
    salary_annual: int
    joining_date: str
    location: str = "Remote (India)"
    probation_months: int = 6
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    status: str = "draft"

# ============================================
# CONTENT COMMAND CENTRE SERVICE
# ============================================

class ContentCommandCentre:
    """Main Content Command Centre Service"""
    
    def __init__(self):
        self.api_key = EMERGENT_LLM_KEY
        self.available = bool(self.api_key)
    
    def is_available(self) -> bool:
        return self.available
    
    async def translate_text(self, text: str, target_language: str) -> str:
        """
        Translate text to target Indian language using LLM
        """
        if not self.available:
            return text
        
        if target_language == "en":
            return text
        
        try:
            from emergentintegrations.llm.chat import LlmChat, UserMessage
            
            lang_info = INDIAN_LANGUAGES.get(target_language, INDIAN_LANGUAGES["en"])
            
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"translate_{uuid.uuid4()}",
                system_message=f"You are a professional translator. Translate the given English text to {lang_info['name']} ({lang_info['native']}). Return ONLY the translated text, nothing else."
            ).with_model("gemini", "gemini-3-flash-preview")
            
            response = await chat.send_message(UserMessage(text=f"Translate: {text}"))
            return response.strip()
        except Exception as e:
            logger.error(f"Translation error: {e}")
            return text
    
    async def translate_to_all_languages(self, text: str, languages: List[str] = None) -> Dict[str, str]:
        """
        Translate text to multiple Indian languages
        """
        if languages is None:
            languages = ["en", "hi", "kn", "ta", "te"]  # Default: 5 major languages
        
        translations = {"en": text}
        
        for lang in languages:
            if lang != "en":
                translations[lang] = await self.translate_text(text, lang)
        
        return translations
    
    async def generate_reel_image(self, prompt: str, style: str = "vibrant") -> Optional[str]:
        """
        Generate image for reel using Gemini Nano Banana
        Returns base64 encoded image
        """
        if not self.available:
            return None
        
        try:
            from emergentintegrations.llm.chat import LlmChat, UserMessage
            
            # Enhanced prompt for viral content
            enhanced_prompt = f"""Create a stunning, viral-worthy image for a career transformation reel:
            
            Theme: {prompt}
            Style: {style}, modern, Indian context, professional yet inspiring
            
            Requirements:
            - Vibrant colors suitable for social media
            - Clean composition with space for text overlay
            - Emotionally engaging and shareable
            - High quality, 1080x1920 aspect ratio (portrait/reel format)
            - Include subtle elements representing growth, success, transformation
            """
            
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"image_{uuid.uuid4()}",
                system_message="You are a professional visual content creator specializing in viral social media content."
            ).with_model("gemini", "gemini-3-pro-image-preview").with_params(modalities=["image", "text"])
            
            text_response, images = await chat.send_message_multimodal_response(
                UserMessage(text=enhanced_prompt)
            )
            
            if images and len(images) > 0:
                return images[0].get('data')
            return None
        except Exception as e:
            logger.error(f"Image generation error: {e}")
            return None
    
    async def create_share_card_image(self, card: ShareCard) -> Optional[str]:
        """
        Generate DoersScore™ Share Card image
        """
        if not self.available:
            return None
        
        prompt = f"""Create a professional, shareable talent card image:
        
        Design: Modern digital ID card/talent card style
        Name: {card.name}
        Score: DoersScore™ {card.doers_score}/900
        Level: {card.adaptive_level}
        Top Skills: {', '.join(card.top_skills[:3])}
        Career Match: {card.career_match}
        
        Style Requirements:
        - Premium, professional look with gradient background
        - Include a circular progress indicator showing the score
        - Skill badges or icons
        - "Verified by Right Doers World" badge
        - QR code placeholder area
        - Social media ready (1:1 square format)
        - Brand colors: Deep purple, gold accents, white text
        """
        
        return await self.generate_reel_image(prompt, "professional")
    
    async def create_career_mantra_image(self, mantra: CareerMantra) -> Optional[str]:
        """
        Generate Career Mantra image
        """
        if not self.available:
            return None
        
        audience_themes = {
            "entrepreneur": "startup office, innovation, hustle, growth mindset",
            "student": "books, graduation, bright future, learning journey",
            "corporate": "professional success, leadership, boardroom, achievement",
            "repeater": "rising phoenix, second chance, resilience, comeback story"
        }
        
        theme = audience_themes.get(mantra.target_audience, "inspirational, motivational")
        
        prompt = f"""Create an inspirational career motivation image:
        
        Quote: "{mantra.text}"
        Theme: {theme}
        Audience: {mantra.target_audience}
        Category: {mantra.category}
        
        Style:
        - Stunning background image that resonates with the message
        - Space for text overlay at center or bottom
        - Warm, inspiring colors
        - Indian context where appropriate
        - Social media optimized (1:1 or 9:16)
        - Premium, shareable quality
        """
        
        return await self.generate_reel_image(prompt, "inspirational")
    
    def get_random_mantra(self, audience: str = "entrepreneur") -> Dict[str, Any]:
        """
        Get a random career mantra for the specified audience
        """
        import random
        mantras = CAREER_MANTRAS.get(audience, CAREER_MANTRAS["entrepreneur"])
        mantra = random.choice(mantras)
        return {
            "text": mantra["en"],
            "category": mantra["category"],
            "audience": audience
        }
    
    def generate_nda_html(self, nda: NDADocument) -> str:
        """
        Generate NDA document HTML
        Based on user's NDA template
        """
        return f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Non-Disclosure & Confidentiality Undertaking</title>
    <style>
        body {{ font-family: 'Arial', sans-serif; line-height: 1.8; padding: 40px; max-width: 800px; margin: 0 auto; }}
        h1 {{ color: #1a1a2e; text-align: center; border-bottom: 3px solid #4a00e0; padding-bottom: 15px; }}
        h2 {{ color: #4a00e0; margin-top: 30px; }}
        .header {{ text-align: center; margin-bottom: 40px; }}
        .logo {{ font-size: 24px; font-weight: bold; color: #4a00e0; }}
        .section {{ margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }}
        .signature-block {{ margin-top: 50px; display: flex; justify-content: space-between; }}
        .signature-area {{ width: 45%; text-align: center; padding-top: 50px; border-top: 2px solid #333; }}
        .field {{ margin: 10px 0; }}
        .field-label {{ font-weight: bold; color: #666; }}
        .field-value {{ font-size: 16px; color: #1a1a2e; }}
        .clause {{ margin: 15px 0; padding-left: 20px; }}
        .highlight {{ background: #fff3cd; padding: 2px 5px; border-radius: 3px; }}
        .footer {{ text-align: center; margin-top: 40px; font-size: 12px; color: #666; }}
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🚀 RIGHT DOERS WORLD</div>
        <p>Human Potential Management & Transformation Company</p>
    </div>
    
    <h1>NON-DISCLOSURE & CONFIDENTIALITY UNDERTAKING</h1>
    
    <div class="section">
        <div class="field">
            <span class="field-label">Document ID:</span>
            <span class="field-value">{nda.id}</span>
        </div>
        <div class="field">
            <span class="field-label">Date:</span>
            <span class="field-value">{nda.effective_date}</span>
        </div>
    </div>
    
    <p><strong>To:</strong><br>
    {nda.company_name}<br>
    Bangalore, India</p>
    
    <p><strong>Sub: Non-Disclosure & Confidentiality Undertaking to the Company</strong></p>
    
    <p>I, <span class="highlight">{nda.recipient_name}</span>, hereby acknowledge and undertake as follows:</p>
    
    <h2>1. DEFINITIONS</h2>
    <div class="clause">
        <p><strong>"Confidential Information"</strong> includes but is not limited to:</p>
        <ul>
            <li>Technical and non-technical information related to the Company's business</li>
            <li>Computer programs, R&D, product development plans, methodologies</li>
            <li>Financial information, customer lists, business forecasts</li>
            <li>Information concerning Group Companies and their operations</li>
            <li>Personnel information and Intellectual Property Rights</li>
        </ul>
    </div>
    
    <h2>2. NON-DISCLOSURE AND NON-USE</h2>
    <div class="clause">
        <p>I shall not disclose Confidential Information to any person through any medium. I shall treat all Confidential Information with the same care as my own confidential information.</p>
    </div>
    
    <h2>3. OWNERSHIP</h2>
    <div class="clause">
        <p>All Confidential Information and any derivatives shall be the property of the Company. No license or rights are granted to me.</p>
    </div>
    
    <h2>4. DURATION</h2>
    <div class="clause">
        <p>This undertaking is valid from the Effective Date and continues <strong>in perpetuity</strong> with respect to Company's Confidential Information.</p>
    </div>
    
    <h2>5. GOVERNING LAW</h2>
    <div class="clause">
        <p>This agreement shall be governed by the laws of India and subject to the exclusive jurisdiction of competent courts in <strong>{nda.jurisdiction}</strong>.</p>
    </div>
    
    <div class="signature-block">
        <div class="signature-area">
            <p><strong>Recipient</strong></p>
            <p>Name: {nda.recipient_name}</p>
            <p>Email: {nda.recipient_email}</p>
            <p>Phone: {nda.recipient_phone}</p>
            <p>Date: _______________</p>
            <p>Digital Signature: _______________</p>
        </div>
        <div class="signature-area">
            <p><strong>For {nda.company_name}</strong></p>
            <p>Authorized Signatory</p>
            <p>Date: _______________</p>
            <p>Digital Signature: _______________</p>
        </div>
    </div>
    
    <div class="footer">
        <p>Generated by Right Doers World - Content Command Centre</p>
        <p>Document ID: {nda.id} | Status: {nda.status.upper()}</p>
    </div>
</body>
</html>
"""
    
    def generate_offer_letter_html(self, offer: OfferLetter) -> str:
        """
        Generate Offer Letter HTML
        Based on Labra template structure
        """
        monthly_salary = offer.salary_annual // 12
        basic = int(monthly_salary * 0.4)
        hra = int(monthly_salary * 0.2)
        special = monthly_salary - basic - hra
        
        return f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Offer Letter - {offer.candidate_name}</title>
    <style>
        body {{ font-family: 'Arial', sans-serif; line-height: 1.8; padding: 40px; max-width: 800px; margin: 0 auto; }}
        h1 {{ color: #1a1a2e; text-align: center; }}
        .header {{ text-align: center; margin-bottom: 40px; padding: 20px; background: linear-gradient(135deg, #4a00e0, #8e2de2); color: white; border-radius: 10px; }}
        .logo {{ font-size: 28px; font-weight: bold; }}
        .section {{ margin: 25px 0; }}
        .section-title {{ font-size: 18px; font-weight: bold; color: #4a00e0; border-bottom: 2px solid #4a00e0; padding-bottom: 5px; margin-bottom: 15px; }}
        table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
        th, td {{ padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }}
        th {{ background: #f8f9fa; color: #4a00e0; }}
        .highlight {{ background: #e8f5e9; padding: 15px; border-radius: 8px; border-left: 4px solid #4caf50; }}
        .signature-block {{ margin-top: 50px; }}
        .signature-area {{ margin-top: 30px; }}
        .footer {{ text-align: center; margin-top: 40px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }}
        .badge {{ display: inline-block; padding: 5px 15px; background: #4a00e0; color: white; border-radius: 20px; font-size: 12px; margin: 5px; }}
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🚀 RIGHT DOERS WORLD</div>
        <p>Human Potential Management & Transformation Company</p>
        <span class="badge">DOERS LEGAL AI</span>
    </div>
    
    <p><strong>Date:</strong> {datetime.now().strftime('%d %B %Y')}</p>
    <p><strong>Document ID:</strong> {offer.id}</p>
    
    <p>Dear <strong>{offer.candidate_name}</strong>,</p>
    
    <div class="highlight">
        <p>Congratulations! We are pleased to offer you the position of <strong>{offer.position}</strong> in our <strong>{offer.division}</strong> division at Right Doers World Pvt. Ltd.</p>
    </div>
    
    <div class="section">
        <div class="section-title">TERMS AND CONDITIONS</div>
        
        <p><strong>1. Position:</strong> {offer.position}</p>
        <p><strong>2. Division:</strong> {offer.division}</p>
        <p><strong>3. Location:</strong> {offer.location}</p>
        <p><strong>4. Joining Date:</strong> {offer.joining_date}</p>
        <p><strong>5. Probation Period:</strong> {offer.probation_months} months</p>
    </div>
    
    <div class="section">
        <div class="section-title">COMPENSATION STRUCTURE</div>
        <table>
            <tr>
                <th>Component</th>
                <th>Monthly (₹)</th>
                <th>Annual (₹)</th>
            </tr>
            <tr>
                <td>Basic Salary</td>
                <td>{basic:,}</td>
                <td>{basic * 12:,}</td>
            </tr>
            <tr>
                <td>House Rent Allowance</td>
                <td>{hra:,}</td>
                <td>{hra * 12:,}</td>
            </tr>
            <tr>
                <td>Special Allowances</td>
                <td>{special:,}</td>
                <td>{special * 12:,}</td>
            </tr>
            <tr style="font-weight: bold; background: #e8f5e9;">
                <td>Total CTC</td>
                <td>{monthly_salary:,}</td>
                <td>{offer.salary_annual:,}</td>
            </tr>
        </table>
    </div>
    
    <div class="section">
        <div class="section-title">KEY CLAUSES</div>
        <p><strong>6. Confidentiality:</strong> You agree to maintain strict confidentiality of all company information.</p>
        <p><strong>7. Code of Conduct:</strong> You shall adhere to all company policies and procedures.</p>
        <p><strong>8. Notice Period:</strong> 30 days upon confirmation, none during probation.</p>
        <p><strong>9. Governing Law:</strong> This agreement is governed by Indian law, jurisdiction Bangalore.</p>
    </div>
    
    <p>Please sign and return this offer letter within <strong>48 hours</strong> to confirm your acceptance.</p>
    
    <p>We look forward to having you in our team!</p>
    
    <div class="signature-block">
        <p>Yours Sincerely,</p>
        <p><strong>For Right Doers World Pvt. Ltd.</strong></p>
        <div class="signature-area">
            <p>___________________________</p>
            <p>Authorized Signatory</p>
        </div>
    </div>
    
    <div class="section" style="margin-top: 50px; border-top: 2px dashed #4a00e0; padding-top: 20px;">
        <div class="section-title">ACCEPTANCE</div>
        <p>I, <strong>{offer.candidate_name}</strong>, accept this offer and agree to the terms and conditions stated above.</p>
        <div class="signature-area">
            <p>Signature: ___________________________</p>
            <p>Date: ___________________________</p>
            <p>Email: {offer.candidate_email}</p>
        </div>
    </div>
    
    <div class="footer">
        <p>Right Doers World Pvt. Ltd. | DOERS LEGAL AI Division</p>
        <p>Document ID: {offer.id} | Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        <p>This document is digitally generated and requires signature for validity.</p>
    </div>
</body>
</html>
"""

# ============================================
# GLOBAL INSTANCE
# ============================================

content_command = ContentCommandCentre()

# ============================================
# TARGET AUDIENCE SEGMENTS
# ============================================

TARGET_SEGMENTS = {
    "startup_india": {
        "name": "Startup India Registered Companies",
        "description": "Companies registered under Startup India needing services and handholding",
        "content_types": ["entrepreneur_mantras", "business_tips", "funding_guidance"],
        "estimated_reach": 100000
    },
    "cbse_repeaters": {
        "name": "CBSE 12th Repeaters",
        "description": "Students who couldn't get seats in JEE/NEET, need career guidance",
        "content_types": ["student_mantras", "alternative_careers", "skill_paths"],
        "estimated_reach": 500000
    },
    "small_business": {
        "name": "Small Business Owners",
        "description": "MSMEs needing digital transformation and workforce support",
        "content_types": ["business_growth", "hiring_tips", "digital_tools"],
        "estimated_reach": 200000
    },
    "corporate_hr": {
        "name": "Corporate HR & Talent Teams",
        "description": "HR professionals seeking talent solutions",
        "content_types": ["talent_insights", "industry_trends", "hiring_strategies"],
        "estimated_reach": 50000
    },
    "government": {
        "name": "Government Employment Programs",
        "description": "Backend services for employment exchanges",
        "content_types": ["policy_updates", "skill_programs", "placement_data"],
        "estimated_reach": 1000000
    }
}

# ============================================
# 2026 AI BUSINESS OPPORTUNITIES
# ============================================

AI_BUSINESS_2026 = {
    "ai_governance": {
        "name": "Responsible AI Governance & Compliance Services",
        "cost": "Medium",
        "effort": "High",
        "potential": "$50K-$100K/month",
        "doers_relevance": "DOERS LEGAL AI Division"
    },
    "ai_lead_gen": {
        "name": "AI Lead Generation Agency",
        "cost": "Low",
        "effort": "Medium/High",
        "potential": "$30K-$80K/month",
        "doers_relevance": "Content Command Centre GTM"
    },
    "ai_content": {
        "name": "AI Content Repurposing Service",
        "cost": "Low",
        "effort": "Medium",
        "potential": "$10K-$30K/month",
        "doers_relevance": "Multi-lingual Reel Creator"
    },
    "ai_assistant": {
        "name": "AI-Powered Virtual Assistant",
        "cost": "Low",
        "effort": "Low",
        "potential": "$10K-$20K/month",
        "doers_relevance": "Agent AIMEE"
    }
}
