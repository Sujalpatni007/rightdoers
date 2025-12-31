# HI AI-APP.COM - Product Requirements Document
## Version 3.1 | December 31, 2025

---

## Original Problem Statement
Build **HI AI-APP.COM** - A Human Potential Management & Transformation Company (H.P.M.T.C.) platform that functions as a "post-transactional, energy-based exchange system." The app should be a Web 3.0/4.0 compliant, multi-lingual, gamified **Progressive Web App (PWA)** inspired by IDFC First Bank's progressive disclosure and Duolingo's gamification.

---

## Vision & Mission
- **Vision**: Right People @ Right Place | Work that feels like PLAY
- **Tagline**: "Dream → Do → Done"
- **Brand**: HI AI-APP.COM (4 Generations: .COM → APP → AI → HI)
- **Mascot**: Astro Doer (playful, friendly guide)
- **Currency**: D-COIN (Doers Delivery Coin) - Energy Exchange System

---

## Core Personas (3 Types)
| Persona | Identity | D-COIN Reward |
|---------|----------|---------------|
| **Candidate (Doer)** | "I'm a Doer" | +100 D-COIN |
| **Consumer** | "I Need a Doer" | +50 D-COIN |
| **Corporate** | "We Hire Doers" | Custom Plans |

---

## 4 Products (The Flywheel)
1. **01 RIGHT DOERS** - DoerID via Agent AIMEE AI Analyzer
2. **02 ROLE PLAY** - Gamified AI skill capsules using D-COIN
3. **03 JOBS4ME** - L1-L5 skill/salary matching with Razorpay
4. **04 HAPPY HARMONY HABITAT** - Doers Dream SIIP family investment plan

---

## What's Been Implemented (Dec 31, 2025)

### ✅ PWA Architecture
- Progressive Web App setup with `manifest.json`
- Service worker for offline support
- Apple touch icons and meta tags
- Standalone display mode

### ✅ Multi-Language Support (i18n)
- **5 Languages**: English, Hindi (हिन्दी), Kannada (ಕನ್ನಡ), Tamil (தமிழ்), Telugu (తెలుగు)
- LanguageProvider context at app root
- LanguageSelector dropdown component
- Pincode-based language auto-detection
- localStorage persistence

### ✅ Agent AIMEE AI Analyzer (NEW)
- **3-Section Assessment**:
  1. CHARACTER (Core Concerns - Maslow-based)
  2. CAREER CHOICE (Why This Career? - Maslow Growth Matrix)
  3. SKILLS-SALARY MATCHER (L1-L5 Framework)
- Multi-lingual questions (English + Hindi)
- D-COIN rewards at milestones (+5 per question, +25 per section, +50 completion)
- PASS Code calculation (PSY Score + SKILL Score)
- Astro Doer guide throughout
- Results page with career match and salary analysis

### ✅ Framer-Motion Animations
- Landing page entrance animations
- Persona card swipe transitions (AnimatePresence)
- 5 Wheels Engine rotating animation
- Assessment question transitions
- D-COIN celebration effects

### ✅ Astro Doer Mascot
- FloatingAstro component in bottom-right
- Multi-language greeting messages
- Bouncing animation with emoji cycling
- CelebrationAstro for D-COIN rewards

### ✅ D-COIN Rebranding
- Global rename from E-COIN to D-COIN
- All pages updated

### ✅ Testing Results (All Passed - 9/9)
- Landing page branding ✓
- Language selector (5 languages) ✓
- Language switching ✓
- Persona cards swiping ✓
- D-COIN consistency ✓
- Icon grid navigation ✓
- Astro Doer mascot ✓
- PWA manifest ✓
- 5 Wheels animation ✓

---

## Prioritized Backlog

### P0 (Critical - Awaiting Captain's Input)
- [ ] Wait for 100+ real profiles for case studies
- [ ] Build complete Assessment Report (EduMilestones format)
- [ ] Daily Streak System (Duolingo-style)
- [ ] Cosmic Design Refresh (landing page)

### P1 (High - Month 1)
- [ ] Integrate Razorpay for payments
- [ ] Real OTP authentication (Twilio/Plavio)
- [ ] Build Role Play skill capsules
- [ ] PDF Report Generation
- [ ] Connect Agent AIMEE to Google Gemini

### P2 (Medium - Quarter 1)
- [ ] Backend APIs for D-COIN transactions
- [ ] Video resume feature
- [ ] Advanced AI-powered matching
- [ ] Push notifications

### P3 (Future)
- [ ] Web 3.0 integration
- [ ] Native language AI (Hugging Face)
- [ ] Robo Teddy assistant

---

## Key Files Reference
```
/app/frontend/src/
├── pages/
│   ├── LandingPage.jsx           # Main landing with animations
│   ├── AgentAimeeAnalyzer.jsx    # Complete assessment flow (NEW)
│   ├── WorldWheelPage.jsx        # 12 Clusters
│   ├── WorkWheelPage.jsx         # Human-AI-Robo modes
│   └── ... (45+ pages)
├── components/
│   ├── AstroDoer.jsx             # Mascot
│   └── LanguageSelector.jsx      # i18n dropdown
└── i18n/translations.js          # 5 languages

/app/memory/
├── PRD.md                        # This document
└── ARCHITECT_STUDY_NOTES.md      # Deep study summary (NEW)
```

---

## Credentials for Testing
- **Phone**: Any number except 9876543210 (hardcoded as employer)
- **OTP**: Any 6-digit code
- **Test User**: Create via /auth?role=doer
- **Assessment**: /aimee-analyzer (no auth required)

---

## Benchmarks to Beat
| Category | Competitors | Our Edge |
|----------|-------------|----------|
| Assessment | EduMilestones, MyAnatomy, MeritTrac | Multi-lingual + Gamified + D-COIN |
| Skilling | Duolingo | Job-role specific + AI-powered |
| Jobs | Mercor, Fiverr, LinkedIn, Naukri, Apna | L1-L5 matrix + PASS Code matching |

---

*Document Updated: December 31, 2025*
*HI AI-APP.COM | Right Doers World LLP | ESG - Exponential Soonicorns Group*
