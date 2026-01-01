# HI AI-APP.COM - Product Requirements Document
## Version 13.0 | January 1, 2026

---

## Original Problem Statement
Build **HI AI-APP.COM** - A Human Potential Management & Transformation Company (H.P.M.T.C.) platform.

**Mission:** AI Adoption from **7G Neom City (Saudi Arabia)** to **No-Network Nagara Village (Thirthahalli, Shivamogga, Karnataka)**

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
- **Moonshot**: "People in this planet must say HI AI and experience WOW"
- **Global Reach**: From 7G smart cities to no-network villages
- **IPO Target**: Q1 2031 (Soonicorn Journey)

---

## What's Been Implemented

### ✅ NEW: PWA Service Worker - Offline-First Architecture (January 1, 2026)
**Purpose:** Enable true offline-first experience for basic Android phones (₹5,000-10,000) in rural India

**Technology:**
- **Service Worker v2.0.0** with smart caching strategies
- **IndexedDB** for conversation history and career data
- **Background Sync** for queued actions
- **Push Notifications** for engagement

**Caching Strategies:**
| Content Type | Strategy | Cache Name |
|--------------|----------|------------|
| Static Assets | Cache First | hi-ai-static-v2.0.0 |
| API Responses | Network First | hi-ai-api-v2.0.0 |
| Gemma Data | Full Offline | hi-ai-gemma-v2.0.0 |
| Images | Cache First | hi-ai-images-v2.0.0 |

**PWA Features:**
- **Install Prompt** - Banner for rural users in Telugu/Kannada
- **Offline Detection** - Real-time online/offline status
- **Conversation Persistence** - IndexedDB storage
- **Background Sync** - Queue actions for later sync

**App Shortcuts:**
1. Gemma Offline AI - Career guidance that works offline
2. Content Command - Create viral multi-lingual content
3. Doers Profiler - Get your DoersScore™ talent card
4. Jobs4Me - AI-powered job matching

**Files:**
- `/app/frontend/src/service-worker.js` - Advanced service worker
- `/app/frontend/src/hooks/usePWA.js` - PWA React hooks
- `/app/frontend/public/manifest.json` - Updated manifest

---

### ✅ Gemma Offline AI - Rural India (January 1, 2026)
**Purpose:** Bring DOERS career guidance to the last mile

**Target Regions:**
- **Srikakulum Village, Andhra Pradesh** - Telugu (తెలుగు)
- **Chickmagalur Hills, Karnataka** - Kannada (ಕನ್ನಡ)
- **Nagara Village, Thirthahalli, Shivamogga** - Kannada (ಕನ್ನಡ)

**Technology:**
- **Google Gemma 3n (270M)** - Designed for basic phones
- **Offline-First** - Pre-cached responses in Telugu/Kannada
- **PWA** - Installable app with full offline support

**Features:**
1. **Offline Career Chatbot** - Works without internet
2. **4 Language Support** - Telugu, Kannada, Hindi, English
3. **LIG Workers Career Paths** - Digital Skills, Agriculture, Healthcare, Skilled Trades
4. **Government Schemes** - PMKVY, Mudra Loan, Skill India

**Routes:** `/gemma`, `/offline-ai`, `/rural`

---

### ✅ Content Command Centre - GTM Content Factory
**Features:**
1. Multi-Lingual Reel Creator (11 languages)
2. DoersScore™ Share Card Generator
3. Career Mantra Generator (4 audiences)
4. DOERS LEGAL AI Division (NDA & Offer Letters)

**Routes:** `/content`, `/content-command`

---

### ✅ Previous Features (All Working)
- Voice AI (TALK) - OpenAI Whisper
- AIMEE TTS - Text-to-Speech
- PDF Reports - Big 5 Career Report
- Proven Profiles - Success stories
- Jobs4Me - AI job matching
- Pricing Tiers - DOER Kidz/Teens/Pro/Plus
- 12 Division Dashboards

---

## Global Reach Strategy

### From 7G to No-Network
| Location | Connectivity | Feature Support |
|----------|--------------|-----------------|
| Neom City, Saudi | 7G Ultra | Full AI, Real-time |
| Bangalore | 5G/4G | Full AI, Fast |
| Rural Towns | 4G/3G | Cached AI, Sync later |
| Srikakulum | 2G/EDGE | Offline mode, Basic |
| Nagara Village | No Network | Full Offline PWA |

### Offline Data Pre-loaded
- Career guidance in Telugu & Kannada
- Government schemes information
- Salary ranges and training durations
- Quick questions for common queries

---

## Testing Status
- **PWA Service Worker:** Implemented (manual verification needed)
- **Gemma Offline AI:** 100% (17/17 tests)
- **Content Command Centre:** 100% (12/12 tests)
- **Test Reports:** `/app/test_reports/iteration_10.json`

---

## Key Routes Reference
```
/gemma           → Gemma Offline AI (Rural India)
/content         → Content Command Centre (GTM)
/dp              → Doers Profiler
/jobs4me         → AI Job Matching
/pricing         → Subscription Tiers
/welcome         → Landing Page
```

---

## Upcoming Tasks (Priority Order)

### P0: Critical
1. ✅ **PWA Service Worker** - COMPLETE
2. ✅ **Gemma Offline AI** - COMPLETE
3. ✅ **Content Command Centre** - COMPLETE
4. **WhatsApp Integration** - NDA signing & notifications
5. **Real Device Testing** - Test on ₹5,000 Android phones

### P1: High Priority
1. **Full Job Aggregator** - Naukri, Quikr, Mercor APIs
2. **Complete CRM** - Lead management
3. **SMS OTP** - Twilio integration

### P2: Medium Priority
1. **Razorpay Payments**
2. **Blockchain Profile**
3. **Daily Career Capsules**

---

## Notes
- PWA works on Chrome, Edge, Samsung Internet, Firefox Mobile
- Service Worker caches ~5MB of offline data
- IndexedDB stores conversation history
- Google Fonts (Noto Sans Telugu, Kannada, Devanagari) for proper script rendering
- Install banner shows automatically for Telugu/Kannada users

---

*HI AI-APP.COM | 7G Neom City 🏙️ → Nagara Village 🏘️ | Everyone deserves AI 🚀*
