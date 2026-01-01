# HI AI-APP.COM - Product Requirements Document
## Version 11.0 | January 1, 2026

---

## Original Problem Statement
Build **HI AI-APP.COM** - A Human Potential Management & Transformation Company (H.P.M.T.C.) platform.

**Project Doers** = Ability Assessments + Skilling Solutions = World's Workforce Creators for Industry 4.0 & 5.0 (Building for 1 Billion+)

**POSITIONING:** "We are to Population Management what NPCI is to Payments"

---

## Vision & Philosophy
- **Vision**: Right People @ Right Place | Work that feels like PLAY
- **Tagline**: "Enter the Doers World. Say WOW. Get What You Want."
- **Moonshot**: "People in this planet must say HI AI and experience WOW"
- **IPO Target**: Q1 2031 (Soonicorn Journey)

### 8 T's TIMELESS WORKFORCE FLOW (Reid Hoffman Vision)
| T | Meaning | Feature | Status |
|---|---------|---------|--------|
| 💬 **TALK** | Voice Command | AI Voice Assistant (Whisper) | ✅ IMPLEMENTED |
| 📋 **TASK** | Action Items | Goals & Milestones | 🔄 Partial |
| ⏰ **TIME** | Investment | Learning Hours | 🔄 Partial |
| 🛠️ **TOOLS** | Platform | DoersScore™, Jobs4Me | ✅ IMPLEMENTED |
| 🌟 **TALENTS** | Skills | 6D Assessment | ✅ IMPLEMENTED |
| 💰 **TAX** | Cost | Subscription Tiers | ✅ IMPLEMENTED |
| 📊 **TOTAL** | ROI | Career Metrics | 🔄 Partial |
| 🤝 **TRUST** | Verification | Right Doers Powered™ | ✅ IMPLEMENTED |

---

## What's Been Implemented

### ✅ NEW: Content Command Centre - GTM Content Factory (January 1, 2026)
**Purpose:** Create viral, multi-lingual content for GTM strategy - Target 10K users in 7 days before Dubai launch

**Features:**

#### 1. Multi-Lingual Reel Creator 🎬
- **6 Templates:** My DOERS Journey, Talent Card Reveal, Success Story Spotlight, Career Mantra, New Year Career Wish 2026, 5E Journey Progress
- **11 Indian Languages:** English, Hindi, Kannada, Tamil, Telugu, Marathi, Bengali, Gujarati, Malayalam, Punjabi, Odia
- **AI Image Generation:** Gemini Nano Banana (gemini-3-pro-image-preview)
- **Translation:** LLM-powered translation to all supported languages

#### 2. DoersScore™ Share Card Generator 🎯
- Generate viral-ready talent cards
- Live preview with score visualization
- Social media ready (1:1 format)
- Fields: Name, DoersScore™ (300-900), Adaptive Level, Top Skills, Career Match

#### 3. Career Mantra Generator 💬
**4 Target Audiences:**
- **Entrepreneurs:** Startup founders & business builders
- **Students:** Career seekers & graduates (including CBSE repeaters)
- **Corporate Professionals:** Working professionals
- **Career Comeback:** Those seeking second chances

**AI-Generated Mantras with Images for Each Audience**

#### 4. Legal Document Hub (DOERS LEGAL AI) ⚖️
**NDA Generator:**
- Based on user's real NDA template
- Fields: Recipient Name, Email, WhatsApp Number
- Perpetual confidentiality, Indian law (Bangalore jurisdiction)
- HTML output with digital signature placeholders

**Offer Letter Generator:**
- Based on professional offer letter template
- Fields: Candidate Name, Email, Position, Division, Salary, Joining Date
- Auto-calculated salary breakdown (Basic, HRA, Special Allowances)
- Company: Right Doers World Pvt. Ltd.

**Routes:** `/content`, `/content-command`, `/content-factory`, `/reel-creator`

**APIs:**
- `GET /api/content/status` - Check feature availability
- `POST /api/content/translate` - Multi-lingual translation
- `POST /api/content/generate-image` - AI image generation
- `POST /api/content/share-card` - Create share cards
- `GET /api/content/mantra/{audience}` - Get career mantras
- `POST /api/content/legal/nda` - Generate NDA
- `POST /api/content/legal/offer` - Generate Offer Letter
- `GET /api/content/segments` - GTM target segments
- `GET /api/content/ai-business-2026` - AI business opportunities

**Files:** `/app/backend/content_command.py`, `/app/frontend/src/pages/ContentCommandCentre.jsx`

### ✅ DOER TIERS & COMBO PRICING
**4 Tiers × 3 Plans = 12 Options:**

| Tier | Age | Monthly (Basic/Std/Prem) | Yearly |
|------|-----|--------------------------|--------|
| 🧒 **DOER KIDZ** | 6-12 | ₹99/149/199 | ₹999-1999 |
| 🎓 **DOER TEENS** | 13-19 | ₹199/299/399 | ₹1999-3999 |
| 💼 **DOER PRO** | 20-45 | ₹499/749/999 | ₹4999-9999 |
| ⭐ **DOER PLUS** | All | ₹1999/2999/4999 | ₹19999-49999 |

**B2B Plans:** Startup (₹49,999), Growth (₹1,49,999), Enterprise (Custom)

### ✅ Voice AI - TALK Component
**Technology:** OpenAI Whisper (whisper-1) via Emergent LLM Key

**Voice Commands:**
- Navigation: "Go to pricing", "Show my profile", "Open jobs"
- Search: "Search jobs for fashion designer"
- Actions: "Start assessment", "Create my profile"
- Questions: "What is my Doer score?"

### ✅ AIMEE Text-to-Speech
**Technology:** OpenAI TTS (tts-1) via Emergent LLM Key
**Default Voice:** Nova
**Available Voices:** alloy, ash, coral, echo, fable, nova, onyx, sage, shimmer

### ✅ PDF Report Generation - "Big 5 Report"
**Report Contents (5 Pages):**
1. Cover Page - Name, DoersScore™, Report Date
2. DoersScore™ Breakdown - Visual chart, component scores
3. BIG 5 #1: Career Interests - RIASEC pie chart
4. BIG 5 #2: Skills & Abilities - Bar chart
5. BIG 5 #3-5: Recommendations - Career clusters, 5E Journey

### ✅ Proven Profiles - Anushree's Journey
**First Real Success Story:**
- Anushree R. Hosalli, Age 16, Bengaluru
- From Fashion Design aspiration to Circular Fashion Entrepreneur
- DoersScore™: 820/900
- Impact: 150+ artisans empowered, 30 tons textile waste diverted

### ✅ Jobs4Me - AI-Powered Job Matching
**Sources:** JSearch (LinkedIn, Indeed), Adzuna, Naukri (Coming), Mercor (Coming)
**AI Matching:** Skill match, Interest match (RIASEC), Level match, Salary match

### ✅ Streak System - Content + Campaign
**D-COIN Rewards, Streak Badges (3d → 365d), Leaderboard**

### ✅ 12 Division Director Dashboards
Real-time delivery dashboards for IPO 2031

### ✅ Cosmic Flywheel Landing Page
5 Entry Points: Pupil, People, Profiles, Partners, Performers

---

## GTM Target Segments

| Segment | Description | Content Types | Est. Reach |
|---------|-------------|---------------|------------|
| 🚀 Startup India | Registered companies needing services | Entrepreneur mantras, funding guidance | 100,000 |
| 📚 CBSE Repeaters | Students who need career guidance | Student mantras, alternative careers | 500,000 |
| 🏢 Small Business | MSMEs needing digital transformation | Business growth, hiring tips | 200,000 |
| 👔 Corporate HR | HR professionals seeking talent | Talent insights, hiring strategies | 50,000 |
| 🏛️ Government | Employment exchanges | Policy updates, skill programs | 1,000,000 |

---

## 2026 AI Business Opportunities (Mapped to DOERS)

| Business | Cost | Effort | Potential | DOERS Feature |
|----------|------|--------|-----------|---------------|
| AI Governance & Compliance | Medium | High | $50K-$100K/month | DOERS LEGAL AI Division |
| AI Lead Generation | Low | Medium | $30K-$80K/month | Content Command Centre GTM |
| AI Content Repurposing | Low | Medium | $10K-$30K/month | Multi-lingual Reel Creator |
| AI Virtual Assistant | Low | Low | $10K-$20K/month | Agent AIMEE |

---

## Key Routes Reference
```
/content         → Content Command Centre (GTM Content Factory)
/streaks         → Streak System (Content + Campaign)
/compare         → Profile Comparison (SHARE IT journey)
/divisions       → 12 Division Director Dashboards
/dp              → Doers Profiler (Talent Card)
/family          → DOERS ONE Family Dashboard
/captain-command → Captain Command Centre
/pricing         → Subscription Tiers
/jobs4me         → AI Job Matching
/proven-profiles → Success Stories
```

---

## Testing Status
- **Backend**: 100% (12/12 Content Command tests passing)
- **Frontend**: 100% (All UI elements working)
- **Latest Test Report**: `/app/test_reports/iteration_9.json`

---

## Upcoming Tasks (Priority Order)

### P0: Critical (GTM Focus)
1. ✅ **Content Command Centre** - COMPLETE
2. **WhatsApp Integration** - Direct NDA signing & notifications
3. **Real Authentication** - Twilio SMS OTP integration

### P1: High Priority
1. **Full Job Aggregator Integration** - Naukri, Quikr, Mercor APIs
2. **Complete CRM Functionality** - Lead management, business verticals
3. **Razorpay Payment Integration**

### P2: Medium Priority
1. **Real AI Integration** - Agent AIMEE with LLM
2. **Jobs4Me Matcher (L1-L5)** - Enhanced matching
3. **Daily Career Capsules** - Completion tracking

### P3: Future
1. **Robo Helper** - Third part of Right Doers Trinity
2. **Blockchain-based Digital Profile**
3. **QR Code Scanner** - Profile comparison

---

## Notes
- Content Command Centre uses **Gemini Nano Banana** for AI image generation
- Legal documents (NDA, Offer) are **real** - not mocked
- Translation uses LLM-powered translation with fallback to original text
- Job Aggregator and CRM are **scaffolded** - need API integration

---

*HI AI-APP.COM | Content + Campaign = Growth | Soonicorn Journey to IPO 2031 🚀*
