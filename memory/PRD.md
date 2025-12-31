# HI AI-APP.COM - Product Requirements Document
## Version 3.0 | December 31, 2025

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

## What's Been Implemented (PWA Update - Dec 31, 2025)

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

### ✅ Framer-Motion Animations
- Landing page entrance animations
- Persona card swipe transitions (AnimatePresence)
- 5 Wheels Engine rotating animation
- Super App icon grid staggered animation
- D-COIN section hover effects
- CTA button spring animations

### ✅ Astro Doer Mascot
- FloatingAstro component in bottom-right
- Multi-language greeting messages
- Bouncing animation with emoji cycling
- Speech bubble with playful messages
- Streak badge indicator

### ✅ D-COIN Rebranding (E-COIN → D-COIN)
- Global rename across all frontend files
- Pages updated: Landing, Dashboard, Profile, Wallet, Gigs, Clubs, Dream SIIP
- "Doers Delivery Coin" branding
- Energy Exchange philosophy

### ✅ Landing Page (IDFC First Bank Style)
- HI AI-APP.COM logo with orange gradient
- Domain story banner (.COM → APP → AI → HI)
- "Will AI replace me or empower me?" question
- 3 Swipeable persona cards with navigation dots
- 8 Super App icon grid with badges
- 5 Wheels Engine visualization
- D-COIN flywheel section
- QR Code GTM banner
- Start Journey CTA

### ✅ Testing Results (All Passed)
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

## Technical Stack
- **Frontend**: React 19 + Tailwind CSS + shadcn/ui + framer-motion
- **Backend**: FastAPI (Python) - Mocked for demo
- **Database**: MongoDB
- **PWA**: manifest.json + service-worker.js
- **i18n**: Custom context + translations.js

---

## Prioritized Backlog

### P0 (Critical - Next Sprint)
- [ ] Build Agent AIMEE AI Analyzer (conversational assessment)
- [ ] Integrate Razorpay for payments
- [ ] Real OTP authentication (Twilio/Plavio)
- [ ] Backend APIs for D-COIN transactions

### P1 (High - Month 1)
- [ ] Build Role Play skill capsules
- [ ] Connect Agent AIMEE to Google Gemini
- [ ] Government/Corporate dashboards
- [ ] Push notifications

### P2 (Medium - Quarter 1)
- [ ] Video resume feature
- [ ] Advanced AI-powered matching
- [ ] Referral system
- [ ] Voice input for AIMEE

### P3 (Future)
- [ ] Web 3.0 integration
- [ ] Native language AI (Hugging Face)
- [ ] Robo Teddy assistant

---

## Key Files Reference
```
/app/frontend/
├── public/
│   ├── manifest.json         # PWA config
│   ├── service-worker.js     # Offline support
│   └── icons/                # App icons
├── src/
│   ├── App.js               # Root with LanguageProvider
│   ├── context/
│   │   └── LanguageContext.jsx
│   ├── i18n/
│   │   └── translations.js   # 5 language translations
│   ├── components/
│   │   ├── AstroDoer.jsx    # Mascot component
│   │   ├── LanguageSelector.jsx
│   │   └── BottomNavNew.jsx
│   └── pages/
│       ├── LandingPage.jsx   # Main with animations
│       ├── EcoinWalletPage.jsx (D-COIN Wallet)
│       ├── GigMarketplacePage.jsx
│       ├── CapabilityClubsPage.jsx
│       └── DoersDreamSIIPPage.jsx
```

---

## Credentials for Testing
- **Phone**: Any number except 9876543210 (hardcoded as employer)
- **OTP**: Any 6-digit code
- **Test User**: Create via /auth?role=doer

---

## Mocked Components
- Backend APIs (auth, jobs, applications)
- AI features (Agent AIMEE)
- Payments (Razorpay pending)
- OTP (mock success)

---

*Document Updated: December 31, 2025*
*HI AI-APP.COM | Right Doers World LLP | ESG - Exponential Soonicorns Group*
