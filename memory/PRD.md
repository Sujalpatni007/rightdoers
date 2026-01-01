# HI AI-APP.COM - Product Requirements Document
## Version 12.0 | January 1, 2026

---

## Original Problem Statement
Build **HI AI-APP.COM** - A Human Potential Management & Transformation Company (H.P.M.T.C.) platform.

**Project Doers** = Ability Assessments + Skilling Solutions = World's Workforce Creators for Industry 4.0 & 5.0 (Building for 1 Billion+)

**POSITIONING:** "We are to Population Management what NPCI is to Payments"

**HEADQUARTERS:**
```
Right Doers World Pvt Ltd
Global Capability Centre for Human Xperts
15th Floor, World Trade Centre
Bangalore, India
```

---

## Vision & Philosophy
- **Vision**: Right People @ Right Place | Work that feels like PLAY
- **Tagline**: "Enter the Doers World. Say WOW. Get What You Want."
- **Moonshot**: "People in this planet must say HI AI and experience WOW"
- **IPO Target**: Q1 2031 (Soonicorn Journey)

---

## What's Been Implemented

### ✅ NEW: Gemma Offline AI - Rural India (January 1, 2026)
**Purpose:** Bring DOERS career guidance to the last mile - LIG workers in remote areas with no network connectivity

**Target Regions:**
- **Srikakulum Village, Andhra Pradesh** - Telugu speaking LIG workers & families
- **Chickmagalur Hills, Karnataka** - Kannada speaking communities with no network

**Technology:**
- **Google Gemma 3n (270M parameters)** - Open source, designed for basic Android phones (₹5,000-10,000)
- **Offline-First Architecture** - Pre-cached responses work without internet
- **Multi-Lingual** - Telugu, Kannada, Hindi, English

**Features:**

#### 1. Offline Career Guidance Chatbot 💬
- Works completely offline with cached responses
- Keyword matching for common career questions
- Falls back to Emergent LLM (Gemini) when online
- Related resources returned with each response

#### 2. Multi-Lingual Support 🌍
| Language | Script | Region | Status |
|----------|--------|--------|--------|
| Telugu | తెలుగు | Srikakulum, AP | ✅ Full |
| Kannada | ಕನ್ನಡ | Chickmagalur, KA | ✅ Full |
| Hindi | हिंदी | Pan-India | ✅ Full |
| English | English | Universal | ✅ Full |

#### 3. LIG Workers Career Paths 📚
Pre-loaded career guidance for Low Income Group workers:
- **Digital Skills** - Data Entry, Mobile Banking Helper (₹8K-15K/month)
- **Agriculture Tech** - Farm Advisor, Crop Monitor (₹10K-20K/month)
- **Healthcare Support** - ASHA Worker, Health Assistant (₹6K-12K/month)
- **Skilled Trades** - Electrician, Plumber, Carpenter (₹12K-25K/month)

#### 4. Government Schemes Info 🏛️
- PMKVY (Pradhan Mantri Kaushal Vikas Yojana)
- Mudra Loan for small business
- Skill India Digital
- National Apprenticeship Scheme

#### 5. Rural DoersScore™ Calculator 📊
Modified algorithm for rural users:
- Education level (below 10th to postgraduate)
- Skills count (10 points each, max 50)
- Work experience (10 per year, max 100)
- Certifications (20 each, max 80)
- Language proficiency bonus

**Routes:** `/gemma`, `/offline-ai`, `/rural`

**APIs:**
- `GET /api/gemma/status` - Service status
- `POST /api/gemma/chat` - Main chat endpoint (offline/online)
- `GET /api/gemma/languages` - Supported languages
- `GET /api/gemma/career-data` - LIG workers career guidance
- `POST /api/gemma/doers-score` - Rural DoersScore calculation
- `GET /api/gemma/quick-questions/{language}` - Quick questions
- `GET /api/gemma/offline-cache` - Full data for PWA sync

**Files:** `/app/backend/gemma_offline.py`, `/app/frontend/src/pages/GemmaOffline.jsx`

---

### ✅ Content Command Centre - GTM Content Factory (January 1, 2026)
**Purpose:** Create viral, multi-lingual content for 10K users target before Dubai launch

**Features:**
1. **Multi-Lingual Reel Creator** - 6 templates, 11 Indian languages, Gemini Nano Banana AI images
2. **DoersScore™ Share Card Generator** - Viral-ready talent cards with live preview
3. **Career Mantra Generator** - 4 audiences (Entrepreneurs, Students, Corporate, Career Comeback)
4. **DOERS LEGAL AI Division** - NDA Generator & Offer Letter Generator

**Routes:** `/content`, `/content-command`, `/reel-creator`

---

### ✅ Previous Features (All Working)
- **Voice AI (TALK)** - OpenAI Whisper integration
- **AIMEE TTS** - Text-to-Speech with OpenAI
- **PDF Reports** - Big 5 Career Report
- **Proven Profiles** - Anushree's success story
- **Jobs4Me** - AI job matching
- **Pricing Tiers** - DOER Kidz/Teens/Pro/Plus
- **12 Division Dashboards** - IPO 2031 tracking
- **Cosmic Flywheel** - Landing page with 5 entry points

---

## Testing Status
- **Gemma Offline AI:** 100% (17/17 tests passing)
- **Content Command Centre:** 100% (12/12 tests passing)
- **Latest Test Reports:** 
  - `/app/test_reports/iteration_10.json` (Gemma)
  - `/app/test_reports/iteration_9.json` (Content)

---

## GTM Target Segments for Rural India

| Segment | Description | Content | Est. Reach |
|---------|-------------|---------|------------|
| 🚀 Startup India | Registered companies needing services | Entrepreneur mantras | 100,000 |
| 📚 CBSE Repeaters | Students needing career guidance | Alternative careers | 500,000 |
| 🏢 Small Business | MSMEs needing digital transformation | Business growth | 200,000 |
| 👔 Corporate HR | HR professionals | Talent insights | 50,000 |
| 🏛️ Government | Employment exchanges | Skill programs | 1,000,000 |
| 🏠 **LIG Workers** | Low Income Group families | Offline career guidance | **10,000,000+** |

---

## Key Routes Reference
```
/gemma           → Gemma Offline AI (Rural India - Telugu/Kannada)
/content         → Content Command Centre (GTM Content Factory)
/dp              → Doers Profiler (Talent Card)
/jobs4me         → AI Job Matching
/pricing         → Subscription Tiers
/proven-profiles → Success Stories
/welcome         → Landing Page
```

---

## Upcoming Tasks (Priority Order)

### P0: Critical
1. ✅ **Content Command Centre** - COMPLETE
2. ✅ **Gemma Offline AI** - COMPLETE
3. **WhatsApp Integration** - Direct NDA signing & notifications
4. **PWA Service Worker** - Full offline sync for rural areas

### P1: High Priority
1. **Full Job Aggregator Integration** - Naukri, Quikr, Mercor APIs
2. **Complete CRM Functionality** - Lead management
3. **Real SMS OTP Authentication** - Twilio

### P2: Medium Priority
1. **Razorpay Payment Integration**
2. **Blockchain Digital Profile**
3. **Daily Career Capsules**

---

## Notes
- **Gemma Offline AI** uses pre-cached responses for **true offline functionality**
- **Content Command Centre** uses **Gemini Nano Banana** for AI image generation
- **Indic fonts** (Noto Sans Telugu, Kannada, Devanagari) loaded for proper script rendering
- **Both features** prominently displayed on landing page with badges

---

*HI AI-APP.COM | From World Trade Centre, Bangalore to Srikakulum Village | Soonicorn Journey to IPO 2031 🚀*
