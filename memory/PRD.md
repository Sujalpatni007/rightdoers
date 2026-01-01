# HI AI-APP.COM - Product Requirements Document
## Version 7.0 | January 1, 2026

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

---

## Key Naming Conventions (Finalized)
| Feature | Name | Tagline/Badge |
|---------|------|---------------|
| Profile System | **D.P. (Doers Profiler)** | Like Display Picture |
| Credential | **Talent Card** | Verified Career Identity |
| Trust Score | **DoersScore™** | Like CIBIL for Careers (300-900) |
| Trust Badge | **Right Doers Powered™** | Like UIDAI Powered |
| Founder Dashboard | **Captain Command Centre** | CXO Level Access |
| Share Feature | **Send Your Profiler** | TALENTON.AI REVOLUTION |
| Family Dashboard | **DOERS ONE** | One Family, Different Dreams |
| Comparison | **DoersScore Battle** | Compare • Compete • Grow |
| Division Dashboards | **Director Dashboards** | 12 Doers Divisions |

---

## What's Been Implemented

### ✅ NEW: Profile Comparison - "SHARE IT • KEEP IT • LIKE IT" Journey (January 1, 2026)
Interactive card-swipe journey inspired by Tinder UX:
- **SHARE IT** - "Share with those who didn't believe YOU"
- **KEEP IT** - "Keep as your PERSONAL G.P.S"
- **LIKE IT** - "Show your support"
- **MATCH IT** - "See MULTIPLIER X EFFECT"

**Features:**
- Swipe right to act, swipe left to skip
- Progress dots for 4-step journey
- Family Leaderboard with DoersScore ranking
- QR Code, Share Link, Phone Lookup modes
- Multi-dimensional Inception-style UI

**Routes:** `/compare`, `/battle`

### ✅ NEW: 12 Division Director Dashboards (January 1, 2026)
Real-time delivery dashboards for IPO 2031 readiness:

**The 12 Divisions:**
1. 🚀 Technology (DEEP TECH - GPU Chip Manufacturing, AI Infrastructure)
2. 🚀 Science (DEEP TECH - Robotic Manufacturing, R&D)
3. Finance & Banking (IPO Readiness, Fund Allocation)
4. Health (AI Diagnostics, HealthTech)
5. Education (Student Acquisition, EdTech)
6. Policy (Government Relations, Compliance)
7. Legal (IP Protection, Contracts)
8. Security (Cybersecurity, Data Protection)
9. Transport & Logistics (Autonomous Vehicles, Supply Chain)
10. Food & Agriculture (AgriTech, Farm Automation)
11. Sport (Sports Analytics, Fitness Tech)
12. Art & Creative (Content Creation, Design)

**Dashboard Features:**
- **Revenue Matrix (KEY)** - This Month vs Target vs Last Month
- **Fund Efficiency** - Revenue / (CapEx + OpEx)
- **CapEx Charts** - Capital Expenditure with budget allocation
- **OpEx Charts** - Operating Expenditure (Salaries, Marketing, Operations)
- **Pay Variability Matrix** - Product Contributors vs Sales Agents
- **Founder's Priority** - Reward product developers over sales agents

**Routes:** `/divisions`, `/divisions/:divisionId`, `/director`

### ✅ COMPLETED: Frontend-Backend Integration (January 1, 2026)
- DoersProfiler fetches real profile data from MongoDB
- DoersOneFamily fetches real family data
- All backend APIs working with graceful fallbacks

### ✅ Previously Completed Features
- "Send Your Profiler" Viral Share (6 channels)
- D.P. (Doers Profiler) with Talent Tracker
- Captain Command Centre with 5C Framework
- Daily Career Capsules, Glocal Gurukul
- DoersID Profile, Agent AIMEE
- Landing Page with Cosmic Flywheel
- PWA support

---

## Architecture

### Frontend Stack
- **React** - UI framework
- **Framer Motion** - Animations & drag gestures
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **axios** - API calls

### Backend Stack
- **FastAPI** - Python async web framework
- **MongoDB** (via motor) - Document database
- **Pydantic** - Data validation

### Key Files
```
/app/frontend/src/pages/
├── ProfileComparison.jsx   # SHARE IT / KEEP IT journey
├── DivisionDashboards.jsx  # 12 Division Director Dashboards
├── DoersProfiler.jsx       # Talent Card with Compare button
├── FounderDashboard.jsx    # Captain Command with Divisions link
├── DoersOneFamily.jsx      # Family dashboard
└── LandingPage.jsx         # Cosmic Flywheel entry

/app/backend/
├── server.py               # Main API routes
├── models.py               # Pydantic models
└── db_routes.py            # DB management APIs
```

---

## Routes Reference
```
/compare         → Profile Comparison (SHARE IT/KEEP IT journey)
/battle          → Profile Comparison (alias)
/divisions       → 12 Division Director Dashboards
/dp              → Doers Profiler (Talent Card)
/family          → DOERS ONE Family Dashboard
/captain-command → Captain Command Centre
/prakruti        → Glocal Gurukul
```

---

## Testing Status
- **Backend**: 100% (all tests passing)
- **Frontend**: 100% (22/22 tests passed for new features)
- **Latest Test Report**: `/app/test_reports/iteration_8.json`

---

## Upcoming Tasks (Priority Order)

### P0: Critical
1. **PDF Report Generation** - "Big 5 Report" downloadable from DoersProfiler
2. **Real Authentication** - Twilio SMS OTP integration

### P1: High Priority
1. **Build DOERS STUDIO Page** - Expert podcasts featuring J Chaudhary
2. **Razorpay Payment Integration**
3. **Connect Division Dashboards to Real Backend** - Currently using demo metrics

### P2: Medium Priority
1. **Real AI Integration** - Connect Agent AIMEE to LLM (Google DeepMind)
2. **Jobs4Me Matcher (L1-L5)** - Job matching platform
3. **Daily Career Capsules & Streak System**

### P3: Future
1. **Robo Helper** - Third part of Right Doers Trinity
2. **Blockchain-based Digital Profile**
3. **QR Code Scanner** - For profile comparison

---

## Notes
- Division metrics are currently **MOCKED** client-side for demo purposes
- Profile Comparison uses demo data when backend returns 404
- Deep Tech divisions (Technology, Science) are marked as priority for Great Robotic Takeover era

---

*HI AI-APP.COM | TALENTON.AI REVOLUTION | Soonicorn Journey to IPO 2031 🚀*
